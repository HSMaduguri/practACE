/**
 * Sleep, Meal (Breakfast, Lunch, Dinner), Routine & Weekday/Weekly Rationale Analysis Utility
 *
 * Analyzes:
 * 1. Same-Day Data (`targetDateStr`):
 *    - Actual sleep wake/bed times logged today, already-completed meals (Breakfast, Lunch, Dinner),
 *      fresh-up/routine blocks, and study start times on that particular day.
 * 2. Last Week (Rolling 7-Day Window) & Recent 14-Day Progress:
 *    - Explicit Routine & Meal logs (`mode === 'routine'` for Breakfast, Lunch, Dinner, Fresh Up, etc.)
 *    - Implicit Habitual Meal Gaps between study sessions in the Breakfast (07:00–10:30),
 *      Lunch (12:00–15:30), and Dinner (19:00–22:30) windows.
 *    - Night Sleep & Habitual Power Nap patterns (`practca_sleep_sessions`, `practca_pomo_logs`, `practca_session_logs`).
 * 3. Same-Weekday History (up to last 7 occurrences of the same weekday, e.g. last 7 Mondays).
 * 4. User's Configured Routine Sub-Modes (`practca_routine_configs_v2`, `practca_routine_custom_submodes_v2`).
 * 5. Extraordinary / Outlier Day Filtering:
 *    - Excludes Empty Days (0m study) and SMA-Ignored Low Days (<50% of active average) from study volume/start averages.
 * 6. Prepares realistic 24-hour timelines that strictly protect Sleep, Breakfast, Lunch, Dinner, and Routine windows
 *    and automatically insert a 15-minute refreshment break after every 2–3 hours (120–180 minutes) of continuous study.
 */

import { CALevel, getSelectedCALevel } from '../data/curriculumLevels';
import { getLevelScopedKey } from './levelStorage';

export type RoutineBlockCategory = 'sleep' | 'fresh_up' | 'breakfast' | 'lunch' | 'dinner' | 'nap' | 'routine';

export interface RoutineBlockInterval {
  start: number; // 0 - 1440
  end: number;   // 0 - 1440
  duration: number;
  label: string;
  category?: RoutineBlockCategory;
  source?: 'same_day_logged' | 'historical_logs' | 'study_gap_analytics' | 'configured_habit';
  isCompletedToday?: boolean;
}

export interface SleepPatternAnalysis {
  sleepStartMinutes: number; // 0 - 1440 (e.g. 1380 = 23:00 / 11:00 PM)
  sleepEndMinutes: number;   // 0 - 1440 (e.g. 390 = 06:30 AM)
  sleepStartTimeStr: string; // "23:00"
  sleepEndTimeStr: string;   // "06:30"
  averageSleepHours: number; // e.g. 7.5
  sampleCount: number;
  // Sleep intervals mapped to a single 24-hour day (0 - 1440 minutes)
  sleepIntervals: { start: number; end: number }[];
}

export interface DayRationaleAnalysis extends SleepPatternAnalysis {
  targetDate: string;                  // YYYY-MM-DD
  weekdayIndex: number;                // 0 (Sun) - 6 (Sat)
  weekdayName: string;                 // "Monday", "Tuesday", etc.
  sameWeekdayAvailableWeeks: number;   // Max available historical weeks for this weekday (capped at 7)
  sameWeekdayValidCount: number;       // Non-empty, non-SMA-ignored same-weekdays used
  sameWeekdayIgnoredCount: number;     // Empty or SMA-ignored (<50% avg) same-weekdays excluded
  recentWeekValidCount: number;        // Valid days in current/last week
  recentWeekIgnoredCount: number;      // Ignored days in current/last week
  recentWeeklyCleanAvgMinutes: number; // Clean daily study SMA (mins)
  last7DaysSampleCount: number;        // Number of active days in the last 7 days analyzed
  sameDayLogsCount: number;            // Number of logs recorded on targetDate itself
  estimatedStudyStartMinutes: number;  // Usual time user starts studying on this day (e.g. 420 = 07:00 AM)
  estimatedStudyStartTimeStr: string;  // "07:00"
  estimatedStudyEndMinutes: number;    // Usual time user ends studying (e.g. 1350 = 22:30 / 10:30 PM)
  estimatedStudyEndTimeStr: string;    // "22:30"
  routineIntervals: RoutineBlockInterval[]; // Protected Breakfast, Lunch, Dinner, Fresh Up & Routine windows
  mealWindows: {
    breakfast: RoutineBlockInterval;
    lunch: RoutineBlockInterval;
    dinner: RoutineBlockInterval;
    freshUp?: RoutineBlockInterval;
  };
  breakRuleSummary: string;            // "15m break after every 2–3 hrs (120–180m) study"
  rationaleSummaryText: string;        // Concise human-readable summary for UI
}

// Convert minutes from midnight (0 - 1439) to HH:MM format
export function minutesToClockTime(mins: number): string {
  const normalized = Math.max(0, Math.min(1439, Math.round(mins)));
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// Convert minutes from midnight to 12-hour AM/PM display
export function minutesToAmPmStr(mins: number): string {
  const norm = ((Math.round(mins) % 1440) + 1440) % 1440;
  const h24 = Math.floor(norm / 60);
  const m = norm % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

// Round minutes to nearest slab (default 15 minutes for clean scheduling)
export function roundToNearestSlab(mins: number, slab: number = 15): number {
  return Math.round(mins / slab) * slab;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseClockOrIsoToMinutes(val: any): number | null {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim();
  if (trimmed.includes('T')) {
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.getHours() * 60 + d.getMinutes();
    }
  }
  const upper = trimmed.toUpperCase();
  const isPM = upper.includes('PM');
  const isAM = upper.includes('AM');
  const parts = upper.replace(/[A-Z\s]/g, '').split(':');
  if (parts.length >= 2) {
    let h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) || 0;
    if (!isNaN(h)) {
      if (isPM && h < 12) h += 12;
      if (isAM && h === 12) h = 0;
      return Math.max(0, Math.min(1439, h * 60 + m));
    }
  }
  return null;
}

function extractLogDateStr(log: any): string | null {
  if (!log) return null;
  if (typeof log.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(log.date.trim())) {
    return log.date.trim();
  }
  const ts = log.startTime || log.timestamp || log.created;
  if (typeof ts === 'string' && ts.includes('T')) {
    const d = new Date(ts);
    if (!isNaN(d.getTime())) return toYYYYMMDD(d);
  }
  return null;
}

function classifyRoutineNoteCategory(noteRaw: string, startMin: number): RoutineBlockCategory {
  const lower = (noteRaw || '').toLowerCase();
  if (lower.includes('breakfast') || lower.includes('morning meal') || lower.includes('tiffin')) {
    return 'breakfast';
  }
  if (lower.includes('lunch') || lower.includes('midday meal') || lower.includes('afternoon meal')) {
    return 'lunch';
  }
  if (lower.includes('dinner') || lower.includes('supper') || lower.includes('night meal')) {
    return 'dinner';
  }
  if (lower.includes('fresh up') || lower.includes('fresh_up') || lower.includes('brush') || lower.includes('bath') || lower.includes('shower') || lower.includes('morning routine')) {
    return 'fresh_up';
  }
  if (lower.includes('nap') || lower.includes('power nap') || lower.includes('rest')) {
    return 'nap';
  }
  // Positional fallback for generic routine blocks
  if (startMin >= 240 && startMin < 450) return 'fresh_up';
  if (startMin >= 450 && startMin < 660) return 'breakfast';
  if (startMin >= 720 && startMin < 930) return 'lunch';
  if (startMin >= 1140 && startMin < 1380) return 'dinner';
  return 'routine';
}

function loadUserConfiguredRoutineDurations(): {
  freshUpMins: number;
  breakfastMins: number;
  lunchMins: number;
  dinnerMins: number;
} {
  // Realistic CA Final defaults (giving enough time to eat & refresh without rushing)
  let freshUpMins = 25;
  let breakfastMins = 30;
  let lunchMins = 45;
  let dinnerMins = 45;

  try {
    const saved = localStorage.getItem('practca_routine_configs_v2') || localStorage.getItem('practca_routine_configs_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        if (parsed.fresh_up?.durationMinutes) {
          freshUpMins = Math.max(15, Math.min(60, roundToNearestSlab(Number(parsed.fresh_up.durationMinutes), 5)));
        }
        if (parsed.breakfast?.durationMinutes) {
          breakfastMins = Math.max(20, Math.min(60, roundToNearestSlab(Number(parsed.breakfast.durationMinutes), 5)));
        }
        if (parsed.lunch?.durationMinutes) {
          lunchMins = Math.max(25, Math.min(75, roundToNearestSlab(Number(parsed.lunch.durationMinutes), 5)));
        }
        if (parsed.dinner?.durationMinutes) {
          dinnerMins = Math.max(25, Math.min(75, roundToNearestSlab(Number(parsed.dinner.durationMinutes), 5)));
        }
      }
    }
  } catch {}

  return { freshUpMins, breakfastMins, lunchMins, dinnerMins };
}

/**
 * Analyzes sleep patterns from Mental Wellbeing and the Log System.
 * Calculates the average or most frequent mean sleep start and end times.
 */
export function analyzeUserSleepPattern(
  customSleepSessions?: any[],
  customSessionLogs?: any[],
  level: CALevel = getSelectedCALevel()
): SleepPatternAnalysis {
  const rawSleepRecords: Array<{ startMin: number; endMin: number; durationMin: number; dateStr?: string }> = [];

  // 1. Gather sleep sessions from Mental Wellbeing
  let sleepList = customSleepSessions;
  if (!sleepList) {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_sleep_sessions', level));
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) sleepList = parsed;
      }
    } catch {}
  }

  (sleepList || []).forEach((s: any) => {
    if (!s || !s.startTime) return;
    const startD = new Date(s.startTime);
    const endD = s.endTime ? new Date(s.endTime) : (s.duration ? new Date(startD.getTime() + s.duration * 60000) : null);
    if (!endD || isNaN(startD.getTime()) || isNaN(endD.getTime())) return;

    const durationMin = Math.round((endD.getTime() - startD.getTime()) / 60000);
    // Focus on primary night sleep sessions (>= 90 minutes)
    if (durationMin >= 90) {
      const startMin = startD.getHours() * 60 + startD.getMinutes();
      const endMin = endD.getHours() * 60 + endD.getMinutes();
      rawSleepRecords.push({ startMin, endMin, durationMin, dateStr: toYYYYMMDD(endD) });
    }
  });

  // 2. Gather sleep sessions from continuous Pomodoro / session logs
  let logsList = customSessionLogs;
  if (!logsList) {
    try {
      const pomoStored = localStorage.getItem(getLevelScopedKey('practca_pomo_logs', level));
      const sessStored = localStorage.getItem(getLevelScopedKey('practca_session_logs', level));
      const pList = pomoStored ? JSON.parse(pomoStored) : [];
      const sList = sessStored ? JSON.parse(sessStored) : [];
      logsList = [
        ...(Array.isArray(pList) ? pList : []),
        ...(Array.isArray(sList) ? sList : [])
      ];
    } catch {}
  }

  (logsList || []).forEach((log: any) => {
    if (!log || log.mode !== 'sleep') return;
    const startMin = parseClockOrIsoToMinutes(log.startTime);
    const endMin = parseClockOrIsoToMinutes(log.endTime);
    const durationMin = log.durationSeconds
      ? Math.round(Number(log.durationSeconds) / 60)
      : (startMin !== null && endMin !== null ? ((endMin - startMin + 1440) % 1440) : 0);

    if (durationMin >= 90 && startMin !== null && endMin !== null) {
      rawSleepRecords.push({ startMin, endMin, durationMin, dateStr: extractLogDateStr(log) || undefined });
    }
  });

  // 3. Fallback defaults if insufficient data exists
  // Default CA Final sleep pattern: 11:00 PM (23:00 / 1380m) to 06:30 AM (390m)
  const defaultBedtimeMinutes = 1380; // 23:00 / 11:00 PM
  const defaultWakeMinutes = 390;     // 06:30 AM

  if (rawSleepRecords.length === 0) {
    return {
      sleepStartMinutes: defaultBedtimeMinutes,
      sleepEndMinutes: defaultWakeMinutes,
      sleepStartTimeStr: minutesToClockTime(defaultBedtimeMinutes),
      sleepEndTimeStr: minutesToClockTime(defaultWakeMinutes),
      averageSleepHours: 7.5,
      sampleCount: 0,
      sleepIntervals: [
        { start: 0, end: defaultWakeMinutes },
        { start: defaultBedtimeMinutes, end: 1440 }
      ]
    };
  }

  // Prioritize recent 7-14 days of sleep records if available (double weight for last 7 days)
  const nowStr = toYYYYMMDD(new Date());
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = toYYYYMMDD(sevenDaysAgo);

  const bedtimeOffsets: number[] = [];
  const wakeTimes: number[] = [];
  const durations: number[] = [];

  rawSleepRecords.forEach(r => {
    const offset = r.startMin >= 720 ? r.startMin - 1440 : r.startMin;
    const weight = r.dateStr && r.dateStr >= sevenDaysAgoStr && r.dateStr <= nowStr ? 2 : 1;
    for (let w = 0; w < weight; w++) {
      bedtimeOffsets.push(offset);
      wakeTimes.push(r.endMin);
      durations.push(r.durationMin);
    }
  });

  const meanBedtimeOffset = bedtimeOffsets.reduce((a, b) => a + b, 0) / bedtimeOffsets.length;
  let calculatedBedtime = (meanBedtimeOffset + 1440) % 1440;
  calculatedBedtime = roundToNearestSlab(calculatedBedtime, 15);

  const meanWakeTime = wakeTimes.reduce((a, b) => a + b, 0) / wakeTimes.length;
  let calculatedWakeTime = roundToNearestSlab(meanWakeTime, 15);

  const avgDurationHours = Number(((durations.reduce((a, b) => a + b, 0) / durations.length) / 60).toFixed(1));

  if (calculatedBedtime < 1200 && calculatedBedtime > 240) {
    calculatedBedtime = defaultBedtimeMinutes;
  }
  if (calculatedWakeTime > 660 || calculatedWakeTime < 180) {
    calculatedWakeTime = defaultWakeMinutes;
  }

  const sleepIntervals: { start: number; end: number }[] = [];
  if (calculatedBedtime > calculatedWakeTime) {
    if (calculatedWakeTime > 0) {
      sleepIntervals.push({ start: 0, end: calculatedWakeTime });
    }
    if (calculatedBedtime < 1440) {
      sleepIntervals.push({ start: calculatedBedtime, end: 1440 });
    }
  } else {
    sleepIntervals.push({ start: calculatedBedtime, end: calculatedWakeTime });
  }

  return {
    sleepStartMinutes: calculatedBedtime,
    sleepEndMinutes: calculatedWakeTime,
    sleepStartTimeStr: minutesToClockTime(calculatedBedtime),
    sleepEndTimeStr: minutesToClockTime(calculatedWakeTime),
    averageSleepHours: avgDurationHours > 0 ? avgDurationHours : 7.5,
    sampleCount: rawSleepRecords.length,
    sleepIntervals
  };
}

interface DailyHistoricalRecord {
  dateStr: string;
  weekday: number;
  studyMinutes: number;
  firstStudyStartMinutes: number | null;
  lastStudyEndMinutes: number | null;
  studyIntervals: { start: number; end: number }[];
  routineBlocks: RoutineBlockInterval[];
  sleepBedtimeOffset: number | null;
  sleepWakeMinutes: number | null;
  isIgnoredForSma: boolean;
}

/**
 * Analyzes the user's same-day + last-week (7d) + historical weekday rationale for `targetDateStr`:
 * 1. Inspects data already logged on `targetDateStr` (same-day wake time, completed meals/routines, study start).
 * 2. Inspects the last 7 days (last week) and last 14 days of study, routine, meal, and sleep data.
 * 3. Inspects up to the last 7 occurrences of the same weekday (e.g., last 7 Mondays).
 * 4. Infers realistic, non-overlapping windows for:
 *    - Sleep (`sleepIntervals`)
 *    - Fresh Up / Morning Wake Routine
 *    - Breakfast (`mealWindows.breakfast`)
 *    - Lunch (`mealWindows.lunch`)
 *    - Dinner (`mealWindows.dinner`)
 *    - Any additional recurring routine blocks
 */
export function analyzeUserDayRationale(
  targetDateStr?: string,
  level: CALevel = getSelectedCALevel()
): DayRationaleAnalysis {
  const now = new Date();
  const effectiveDateStr = targetDateStr && /^\d{4}-\d{2}-\d{2}$/.test(targetDateStr)
    ? targetDateStr
    : toYYYYMMDD(now);

  const targetDateObj = new Date(`${effectiveDateStr}T12:00:00`);
  const targetWeekday = targetDateObj.getDay();
  const weekdayName = WEEKDAY_NAMES[targetWeekday] || 'Day';

  // Base sleep analysis across available sleep logs
  const baseSleep = analyzeUserSleepPattern(undefined, undefined, level);
  const configuredRoutineMins = loadUserConfiguredRoutineDurations();

  // Gather all historical & same-day logs from localStorage
  let pomoLogs: any[] = [];
  let sessionLogs: any[] = [];
  let focusSessions: any[] = [];
  let sleepSessions: any[] = [];
  const explicitIgnoredDates = new Set<string>();

  try {
    const rawPomo = localStorage.getItem(getLevelScopedKey('practca_pomo_logs', level));
    if (rawPomo) {
      const parsed = JSON.parse(rawPomo);
      if (Array.isArray(parsed)) pomoLogs = parsed;
    }
  } catch {}

  try {
    const rawSess = localStorage.getItem(getLevelScopedKey('practca_session_logs', level));
    if (rawSess) {
      const parsed = JSON.parse(rawSess);
      if (Array.isArray(parsed)) sessionLogs = parsed;
    }
  } catch {}

  try {
    const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', level));
    if (rawFocus) {
      const parsed = JSON.parse(rawFocus);
      if (Array.isArray(parsed)) focusSessions = parsed;
    }
  } catch {}

  try {
    const rawSleep = localStorage.getItem(getLevelScopedKey('practca_sleep_sessions', level));
    if (rawSleep) {
      const parsed = JSON.parse(rawSleep);
      if (Array.isArray(parsed)) sleepSessions = parsed;
    }
  } catch {}

  try {
    const rawIgnored =
      localStorage.getItem(getLevelScopedKey('practca_sma_ignored_days', level)) ||
      localStorage.getItem(getLevelScopedKey('practca_ignored_days', level));
    if (rawIgnored) {
      const parsed = JSON.parse(rawIgnored);
      if (Array.isArray(parsed)) {
        parsed.forEach((d: any) => {
          if (typeof d === 'string') explicitIgnoredDates.add(d);
        });
      }
    }
  } catch {}

  // Combine pomoLogs and sessionLogs, normalizing legacy routine & meal logs
  const allUnifiedLogs = [...pomoLogs, ...sessionLogs].map((l: any) => {
    if (!l) return null;
    const notesLower = String(l.notes || '').toLowerCase();
    if (
      l.mode === 'break' &&
      (notesLower.includes('routine') ||
        notesLower.includes('breakfast') ||
        notesLower.includes('lunch') ||
        notesLower.includes('dinner') ||
        notesLower.includes('fresh up') ||
        notesLower.includes('meal'))
    ) {
      return { ...l, mode: 'routine' };
    }
    return l;
  }).filter(Boolean);

  // Map by YYYY-MM-DD (including effectiveDateStr so same-day metrics are captured!)
  const dayMap = new Map<string, DailyHistoricalRecord>();
  let earliestLoggedDateStr: string | null = null;
  let sameDayLogsCount = 0;

  const ensureDayRecord = (dStr: string): DailyHistoricalRecord => {
    if (!dayMap.has(dStr)) {
      const dObj = new Date(`${dStr}T12:00:00`);
      dayMap.set(dStr, {
        dateStr: dStr,
        weekday: isNaN(dObj.getTime()) ? targetWeekday : dObj.getDay(),
        studyMinutes: 0,
        firstStudyStartMinutes: null,
        lastStudyEndMinutes: null,
        studyIntervals: [],
        routineBlocks: [],
        sleepBedtimeOffset: null,
        sleepWakeMinutes: null,
        isIgnoredForSma: false
      });
    }
    if (dStr < effectiveDateStr && (!earliestLoggedDateStr || dStr < earliestLoggedDateStr)) {
      earliestLoggedDateStr = dStr;
    }
    return dayMap.get(dStr)!;
  };

  // Track seen log fingerprints per day to avoid double counting
  const seenLogFingerprints = new Set<string>();

  allUnifiedLogs.forEach((log: any) => {
    const dStr = extractLogDateStr(log);
    if (!dStr || dStr > effectiveDateStr) return;

    const startM = parseClockOrIsoToMinutes(log.startTime);
    const endM = parseClockOrIsoToMinutes(log.endTime);
    const durMins = log.durationSeconds
      ? Math.max(0, Math.round(Number(log.durationSeconds) / 60))
      : (startM !== null && endM !== null && endM > startM ? endM - startM : 0);

    if (durMins <= 0) return;

    const fp = `${dStr}|${log.mode}|${startM ?? ''}|${durMins}`;
    if (seenLogFingerprints.has(fp)) return;
    seenLogFingerprints.add(fp);

    if (dStr === effectiveDateStr) {
      sameDayLogsCount++;
    }

    const rec = ensureDayRecord(dStr);

    if (log.mode === 'study') {
      rec.studyMinutes += durMins;
      if (startM !== null) {
        const computedEnd = endM !== null && endM > startM ? Math.min(1440, endM) : Math.min(1440, startM + durMins);
        rec.studyIntervals.push({ start: startM, end: computedEnd });
        // Consider daytime/morning study start (>= 03:30 AM = 210m) for usual daily start
        if (startM >= 210 && (rec.firstStudyStartMinutes === null || startM < rec.firstStudyStartMinutes)) {
          rec.firstStudyStartMinutes = startM;
        }
      }
      if (endM !== null) {
        if (rec.lastStudyEndMinutes === null || endM > rec.lastStudyEndMinutes) {
          rec.lastStudyEndMinutes = endM;
        }
      }
    } else if (log.mode === 'routine') {
      if (startM !== null && durMins >= 10) {
        const effEnd = endM !== null && endM > startM ? Math.min(1440, endM) : Math.min(1440, startM + durMins);
        const category = classifyRoutineNoteCategory(log.notes || '', startM);
        rec.routineBlocks.push({
          start: startM,
          end: effEnd,
          duration: Math.max(10, effEnd - startM),
          label: log.notes || 'Daily Routine',
          category,
          source: dStr === effectiveDateStr ? 'same_day_logged' : 'historical_logs',
          isCompletedToday: dStr === effectiveDateStr
        });
      }
    } else if (log.mode === 'sleep' && durMins >= 90 && startM !== null && endM !== null) {
      rec.sleepBedtimeOffset = startM >= 720 ? startM - 1440 : startM;
      rec.sleepWakeMinutes = endM;
    }
  });

  // Fallback / supplement from focusSessions if a date had no pomoLogs
  focusSessions.forEach((s: any) => {
    if (!s || !s.timestamp) return;
    const dObj = new Date(s.timestamp);
    if (isNaN(dObj.getTime())) return;
    const dStr = toYYYYMMDD(dObj);
    if (dStr > effectiveDateStr) return;

    const durMins = Math.max(0, Math.round(Number(s.duration) || 0));
    if (durMins <= 0) return;

    const rec = ensureDayRecord(dStr);
    const sessionEndM = dObj.getHours() * 60 + dObj.getMinutes();
    const sessionStartM = Math.max(0, sessionEndM - durMins);

    if (!s.sessionType || s.sessionType === 'work') {
      const fp = `${dStr}|study_focus|${sessionStartM}|${durMins}`;
      if (!seenLogFingerprints.has(fp) && rec.studyMinutes === 0) {
        rec.studyMinutes += durMins;
        rec.studyIntervals.push({ start: sessionStartM, end: Math.min(1440, sessionEndM) });
        if (sessionStartM >= 210 && (rec.firstStudyStartMinutes === null || sessionStartM < rec.firstStudyStartMinutes)) {
          rec.firstStudyStartMinutes = sessionStartM;
        }
        if (rec.lastStudyEndMinutes === null || sessionEndM > rec.lastStudyEndMinutes) {
          rec.lastStudyEndMinutes = sessionEndM;
        }
      }
    } else if (s.sessionType === 'routine' && durMins >= 10) {
      if (rec.routineBlocks.length === 0) {
        const category = classifyRoutineNoteCategory(s.taskTitle || '', sessionStartM);
        rec.routineBlocks.push({
          start: sessionStartM,
          end: Math.min(1440, sessionEndM),
          duration: durMins,
          label: s.taskTitle || 'Routine Block',
          category,
          source: dStr === effectiveDateStr ? 'same_day_logged' : 'historical_logs',
          isCompletedToday: dStr === effectiveDateStr
        });
      }
    }
  });

  // Supplement sleep records per day from practca_sleep_sessions (including wake-up on effectiveDateStr!)
  sleepSessions.forEach((s: any) => {
    if (!s || !s.startTime) return;
    const startD = new Date(s.startTime);
    const endD = s.endTime ? new Date(s.endTime) : (s.duration ? new Date(startD.getTime() + s.duration * 60000) : null);
    if (!endD || isNaN(startD.getTime()) || isNaN(endD.getTime())) return;
    const durMins = Math.round((endD.getTime() - startD.getTime()) / 60000);
    if (durMins < 90) return;
    const wakeDateStr = toYYYYMMDD(endD);
    if (wakeDateStr > effectiveDateStr) return;
    const rec = ensureDayRecord(wakeDateStr);
    const startM = startD.getHours() * 60 + startD.getMinutes();
    const endM = endD.getHours() * 60 + endD.getMinutes();
    rec.sleepBedtimeOffset = startM >= 720 ? startM - 1440 : startM;
    rec.sleepWakeMinutes = endM;
    if (wakeDateStr === effectiveDateStr) {
      sameDayLogsCount++;
    }
  });

  // Extract same-day record (data of that particular day) if present
  const sameDayRecord = dayMap.get(effectiveDateStr) || null;

  // Compute Active Study Average & SMA Outlier Threshold (<50% of active average = Ignored Low Day) across historical days
  const historicalRecords = Array.from(dayMap.values()).filter(r => r.dateStr < effectiveDateStr);
  const activeRecords = historicalRecords.filter(r => r.studyMinutes > 0 && !explicitIgnoredDates.has(r.dateStr));
  const activeAvgStudyMinutes = activeRecords.length > 0
    ? activeRecords.reduce((acc, r) => acc + r.studyMinutes, 0) / activeRecords.length
    : 0;
  const smaLowThreshold = 0.5 * activeAvgStudyMinutes;

  historicalRecords.forEach(rec => {
    if (
      rec.studyMinutes === 0 ||
      explicitIgnoredDates.has(rec.dateStr) ||
      (activeAvgStudyMinutes > 0 && rec.studyMinutes < smaLowThreshold)
    ) {
      rec.isIgnoredForSma = true;
    } else {
      rec.isIgnoredForSma = false;
    }
  });

  // ============================================================================
  // COHORT 1: Last 7 Same-Weekdays (e.g. Last 7 Mondays, or max available weeks <= 7)
  // ============================================================================
  let maxAvailableWeeks = 0;
  if (earliestLoggedDateStr && earliestLoggedDateStr < effectiveDateStr) {
    const earliestObj = new Date(`${earliestLoggedDateStr}T12:00:00`);
    const diffDays = Math.floor((targetDateObj.getTime() - earliestObj.getTime()) / (1000 * 60 * 60 * 24));
    maxAvailableWeeks = Math.min(7, Math.max(1, Math.floor(diffDays / 7)));
  }

  const sameWeekdayValidRecords: DailyHistoricalRecord[] = [];
  let sameWeekdayIgnoredCount = 0;

  for (let w = 1; w <= (maxAvailableWeeks || 7); w++) {
    const d = new Date(targetDateObj);
    d.setDate(targetDateObj.getDate() - w * 7);
    const dStr = toYYYYMMDD(d);
    if (earliestLoggedDateStr && dStr < earliestLoggedDateStr && w > maxAvailableWeeks) {
      break;
    }
    const rec = dayMap.get(dStr);
    if (!rec || rec.studyMinutes === 0 || rec.isIgnoredForSma) {
      if (earliestLoggedDateStr && dStr >= earliestLoggedDateStr) {
        sameWeekdayIgnoredCount++;
      }
    } else {
      sameWeekdayValidRecords.push(rec);
    }
  }

  // ============================================================================
  // COHORT 2: Last Week (Last 7 Days) & Recent 14 Days Progress
  // ============================================================================
  const last7DaysRecords: DailyHistoricalRecord[] = [];
  const recentWeekValidRecords: DailyHistoricalRecord[] = [];
  let recentWeekIgnoredCount = 0;

  for (let i = 1; i <= 14; i++) {
    const d = new Date(targetDateObj);
    d.setDate(targetDateObj.getDate() - i);
    const dStr = toYYYYMMDD(d);
    if (earliestLoggedDateStr && dStr < earliestLoggedDateStr) continue;
    const rec = dayMap.get(dStr);
    if (i <= 7 && rec && (rec.studyMinutes > 0 || rec.routineBlocks.length > 0 || rec.sleepWakeMinutes !== null)) {
      last7DaysRecords.push(rec);
    }
    if (!rec || rec.studyMinutes === 0 || rec.isIgnoredForSma) {
      recentWeekIgnoredCount++;
    } else {
      recentWeekValidRecords.push(rec);
    }
  }

  const recentWeeklyCleanAvgMinutes = recentWeekValidRecords.length > 0
    ? Math.round(recentWeekValidRecords.reduce((acc, r) => acc + r.studyMinutes, 0) / recentWeekValidRecords.length)
    : Math.round(activeAvgStudyMinutes);

  // ============================================================================
  // ESTIMATE SLEEP WINDOW (Prioritizing Same-Day Wake + Last 7 Days + Same-Weekday + Global Sleep)
  // ============================================================================
  const last7WakeList = last7DaysRecords.map(r => r.sleepWakeMinutes).filter((v): v is number => v !== null);
  const sameDayWakeList = sameWeekdayValidRecords.map(r => r.sleepWakeMinutes).filter((v): v is number => v !== null);
  const recentWakeList = recentWeekValidRecords.map(r => r.sleepWakeMinutes).filter((v): v is number => v !== null);

  const last7BedList = last7DaysRecords.map(r => r.sleepBedtimeOffset).filter((v): v is number => v !== null);
  const sameDayBedList = sameWeekdayValidRecords.map(r => r.sleepBedtimeOffset).filter((v): v is number => v !== null);
  const recentBedList = recentWeekValidRecords.map(r => r.sleepBedtimeOffset).filter((v): v is number => v !== null);

  let sleepEndMinutes = baseSleep.sleepEndMinutes;
  // If user already woke up and logged sleep on targetDateStr, anchor morning wake time to today's actual wake time!
  if (sameDayRecord?.sleepWakeMinutes !== null && sameDayRecord?.sleepWakeMinutes !== undefined && sameDayRecord.sleepWakeMinutes >= 180 && sameDayRecord.sleepWakeMinutes <= 660) {
    sleepEndMinutes = roundToNearestSlab(sameDayRecord.sleepWakeMinutes, 15);
  } else if (last7WakeList.length > 0 && sameDayWakeList.length > 0) {
    const l7Avg = last7WakeList.reduce((a, b) => a + b, 0) / last7WakeList.length;
    const sameAvg = sameDayWakeList.reduce((a, b) => a + b, 0) / sameDayWakeList.length;
    sleepEndMinutes = roundToNearestSlab(0.55 * l7Avg + 0.45 * sameAvg, 15);
  } else if (last7WakeList.length > 0) {
    sleepEndMinutes = roundToNearestSlab(last7WakeList.reduce((a, b) => a + b, 0) / last7WakeList.length, 15);
  } else if (sameDayWakeList.length > 0) {
    sleepEndMinutes = roundToNearestSlab(sameDayWakeList.reduce((a, b) => a + b, 0) / sameDayWakeList.length, 15);
  } else if (recentWakeList.length > 0) {
    sleepEndMinutes = roundToNearestSlab(recentWakeList.reduce((a, b) => a + b, 0) / recentWakeList.length, 15);
  }
  if (sleepEndMinutes < 180 || sleepEndMinutes > 660) {
    sleepEndMinutes = baseSleep.sleepEndMinutes;
  }

  let sleepStartMinutes = baseSleep.sleepStartMinutes;
  if (last7BedList.length > 0 || sameDayBedList.length > 0 || recentBedList.length > 0) {
    const combinedOffsets = [...last7BedList, ...last7BedList, ...sameDayBedList, ...recentBedList];
    const avgOffset = combinedOffsets.reduce((a, b) => a + b, 0) / combinedOffsets.length;
    const candBed = roundToNearestSlab((avgOffset + 1440) % 1440, 15);
    if (candBed >= 1200 || candBed <= 240) {
      sleepStartMinutes = candBed;
    }
  }

  const sleepIntervals: { start: number; end: number }[] = [];
  if (sleepStartMinutes > sleepEndMinutes) {
    if (sleepEndMinutes > 0) sleepIntervals.push({ start: 0, end: sleepEndMinutes });
    if (sleepStartMinutes < 1440) sleepIntervals.push({ start: sleepStartMinutes, end: 1440 });
  } else {
    sleepIntervals.push({ start: sleepStartMinutes, end: sleepEndMinutes });
  }

  // ============================================================================
  // ESTIMATE USUAL STUDY START TIME & STUDY END TIME
  // ============================================================================
  const last7Starts = last7DaysRecords
    .map(r => r.firstStudyStartMinutes)
    .filter((v): v is number => v !== null && v >= sleepEndMinutes && v <= 960);
  const sameDayStarts = sameWeekdayValidRecords
    .map(r => r.firstStudyStartMinutes)
    .filter((v): v is number => v !== null && v >= sleepEndMinutes && v <= 960);
  const recentStarts = recentWeekValidRecords
    .map(r => r.firstStudyStartMinutes)
    .filter((v): v is number => v !== null && v >= sleepEndMinutes && v <= 960);

  // Default study start: 30 minutes after wake-up (leaves room for Fresh Up)
  let estimatedStudyStartMinutes = Math.min(600, sleepEndMinutes + 30);

  if (sameDayRecord?.firstStudyStartMinutes && sameDayRecord.firstStudyStartMinutes >= sleepEndMinutes && sameDayRecord.firstStudyStartMinutes <= 840) {
    // Blend same-day actual first study start with historical habit
    const histAvg = last7Starts.length > 0
      ? last7Starts.reduce((a, b) => a + b, 0) / last7Starts.length
      : estimatedStudyStartMinutes;
    estimatedStudyStartMinutes = roundToNearestSlab(0.5 * sameDayRecord.firstStudyStartMinutes + 0.5 * histAvg, 15);
  } else if (last7Starts.length > 0 && sameDayStarts.length > 0) {
    const l7Avg = last7Starts.reduce((a, b) => a + b, 0) / last7Starts.length;
    const sameAvg = sameDayStarts.reduce((a, b) => a + b, 0) / sameDayStarts.length;
    estimatedStudyStartMinutes = roundToNearestSlab(0.55 * l7Avg + 0.45 * sameAvg, 15);
  } else if (last7Starts.length > 0) {
    estimatedStudyStartMinutes = roundToNearestSlab(last7Starts.reduce((a, b) => a + b, 0) / last7Starts.length, 15);
  } else if (sameDayStarts.length > 0) {
    estimatedStudyStartMinutes = roundToNearestSlab(sameDayStarts.reduce((a, b) => a + b, 0) / sameDayStarts.length, 15);
  } else if (recentStarts.length > 0) {
    estimatedStudyStartMinutes = roundToNearestSlab(recentStarts.reduce((a, b) => a + b, 0) / recentStarts.length, 15);
  }

  // Ensure study start is never inside morning sleep window + fresh-up buffer
  estimatedStudyStartMinutes = Math.max(sleepEndMinutes + 20, Math.min(840, estimatedStudyStartMinutes));

  const maxStudyCeiling = sleepStartMinutes > sleepEndMinutes ? sleepStartMinutes : 1380;
  let estimatedStudyEndMinutes = maxStudyCeiling;

  const sameDayEnds = sameWeekdayValidRecords
    .map(r => r.lastStudyEndMinutes)
    .filter((v): v is number => v !== null && v > estimatedStudyStartMinutes);
  const recentEnds = recentWeekValidRecords
    .map(r => r.lastStudyEndMinutes)
    .filter((v): v is number => v !== null && v > estimatedStudyStartMinutes);

  if (sameDayEnds.length > 0 && recentEnds.length > 0) {
    const sameEndAvg = sameDayEnds.reduce((a, b) => a + b, 0) / sameDayEnds.length;
    const recentEndAvg = recentEnds.reduce((a, b) => a + b, 0) / recentEnds.length;
    estimatedStudyEndMinutes = Math.min(maxStudyCeiling, Math.max(1080, roundToNearestSlab(0.5 * sameEndAvg + 0.5 * recentEndAvg, 15)));
  } else if (recentEnds.length > 0) {
    const recentEndAvg = recentEnds.reduce((a, b) => a + b, 0) / recentEnds.length;
    estimatedStudyEndMinutes = Math.min(maxStudyCeiling, Math.max(1080, roundToNearestSlab(recentEndAvg, 15)));
  }

  // ============================================================================
  // ANALYZE BREAKFAST, LUNCH, DINNER & ROUTINE WINDOWS
  // Combines:
  // 1) Same-day logged meals/routines (`sameDayRecord.routineBlocks`)
  // 2) Last 7 days & Same-Weekday explicit routine/meal logs (`mode === 'routine'`)
  // 3) Implicit habitual study gaps during Breakfast (07:00–10:30), Lunch (12:15–15:30), and Dinner (19:15–22:15)
  // 4) User's configured routine sub-mode durations (`practca_routine_configs_v2`)
  // ============================================================================
  const habitPoolRecords: DailyHistoricalRecord[] = [
    ...last7DaysRecords,
    ...sameWeekdayValidRecords.filter(s => !last7DaysRecords.some(l => l.dateStr === s.dateStr)),
    ...recentWeekValidRecords.filter(r => !last7DaysRecords.some(l => l.dateStr === r.dateStr) && !sameWeekdayValidRecords.some(s => s.dateStr === r.dateStr))
  ];

  // Collect explicit historical samples & implicit study-gap samples for Breakfast, Lunch, Dinner, and Fresh Up
  const breakfastStarts: number[] = [];
  const breakfastDurs: number[] = [];
  const lunchStarts: number[] = [];
  const lunchDurs: number[] = [];
  const dinnerStarts: number[] = [];
  const dinnerDurs: number[] = [];
  const freshUpStarts: number[] = [];
  const freshUpDurs: number[] = [];
  const customRoutineSamples: { start: number; duration: number; label: string }[] = [];

  habitPoolRecords.forEach(rec => {
    const isLast7 = last7DaysRecords.some(l => l.dateStr === rec.dateStr);
    const weight = isLast7 ? 2 : 1; // Double weight for last week's habits

    let hasExplicitBreakfast = false;
    let hasExplicitLunch = false;
    let hasExplicitDinner = false;

    rec.routineBlocks.forEach(rb => {
      const cat = rb.category || classifyRoutineNoteCategory(rb.label, rb.start);
      for (let w = 0; w < weight; w++) {
        if (cat === 'breakfast' || (rb.start >= 420 && rb.start < 660 && cat !== 'fresh_up')) {
          breakfastStarts.push(rb.start);
          breakfastDurs.push(Math.min(75, Math.max(20, rb.duration)));
          hasExplicitBreakfast = true;
        } else if (cat === 'lunch' || (rb.start >= 720 && rb.start < 960)) {
          lunchStarts.push(rb.start);
          lunchDurs.push(Math.min(90, Math.max(25, rb.duration)));
          hasExplicitLunch = true;
        } else if (cat === 'dinner' || (rb.start >= 1140 && rb.start < 1380)) {
          dinnerStarts.push(rb.start);
          dinnerDurs.push(Math.min(90, Math.max(25, rb.duration)));
          hasExplicitDinner = true;
        } else if (cat === 'fresh_up' && rb.start >= sleepEndMinutes - 30 && rb.start <= 540) {
          freshUpStarts.push(rb.start);
          freshUpDurs.push(Math.min(45, Math.max(15, rb.duration)));
        } else if (rb.start >= 960 && rb.start < 1140) {
          customRoutineSamples.push({ start: rb.start, duration: Math.min(60, Math.max(15, rb.duration)), label: rb.label });
        }
      }
    });

    // Also inspect natural gaps between consecutive study intervals on this day to detect implicit meal habits
    if (rec.studyIntervals.length >= 2) {
      const sortedStudy = [...rec.studyIntervals].sort((a, b) => a.start - b.start);
      for (let i = 0; i < sortedStudy.length - 1; i++) {
        const gapStart = sortedStudy[i].end;
        const gapEnd = sortedStudy[i + 1].start;
        const gapDur = gapEnd - gapStart;
        if (gapDur >= 20 && gapDur <= 105) {
          if (!hasExplicitBreakfast && gapStart >= 450 && gapStart <= 630) {
            breakfastStarts.push(gapStart);
            breakfastDurs.push(Math.min(45, Math.max(25, gapDur)));
          } else if (!hasExplicitLunch && gapStart >= 735 && gapStart <= 900) {
            lunchStarts.push(gapStart);
            lunchDurs.push(Math.min(60, Math.max(30, gapDur)));
          } else if (!hasExplicitDinner && gapStart >= 1140 && gapStart <= 1320) {
            dinnerStarts.push(gapStart);
            dinnerDurs.push(Math.min(60, Math.max(30, gapDur)));
          }
        }
      }
    }
  });

  // Check if same-day (`effectiveDateStr`) already has logged Fresh Up, Breakfast, Lunch, or Dinner
  const sameDayFreshUp = sameDayRecord?.routineBlocks.find(b => b.category === 'fresh_up');
  const sameDayBreakfast = sameDayRecord?.routineBlocks.find(b => b.category === 'breakfast');
  const sameDayLunch = sameDayRecord?.routineBlocks.find(b => b.category === 'lunch');
  const sameDayDinner = sameDayRecord?.routineBlocks.find(b => b.category === 'dinner');

  // 1. Fresh Up / Morning Wake Window
  let freshUpWindow: RoutineBlockInterval;
  if (sameDayFreshUp) {
    freshUpWindow = {
      ...sameDayFreshUp,
      label: 'Fresh Up & Morning Routine',
      category: 'fresh_up',
      source: 'same_day_logged',
      isCompletedToday: true
    };
  } else {
    const fDur = freshUpDurs.length > 0
      ? roundToNearestSlab(freshUpDurs.reduce((a, b) => a + b, 0) / freshUpDurs.length, 5)
      : configuredRoutineMins.freshUpMins;
    const fStart = sleepEndMinutes;
    const fEnd = Math.min(600, fStart + Math.max(15, fDur));
    freshUpWindow = {
      start: fStart,
      end: fEnd,
      duration: fEnd - fStart,
      label: 'Fresh Up & Morning Routine',
      category: 'fresh_up',
      source: freshUpStarts.length > 0 ? 'historical_logs' : 'configured_habit'
    };
  }

  // Ensure estimatedStudyStartMinutes is never before Fresh Up ends
  if (estimatedStudyStartMinutes < freshUpWindow.end) {
    estimatedStudyStartMinutes = roundToNearestSlab(freshUpWindow.end, 15);
  }

  // 2. Breakfast Window (Always Protected: 08:30 AM default or historical/same-day time)
  let breakfastWindow: RoutineBlockInterval;
  if (sameDayBreakfast) {
    breakfastWindow = {
      ...sameDayBreakfast,
      label: 'Breakfast',
      category: 'breakfast',
      source: 'same_day_logged',
      isCompletedToday: true
    };
  } else {
    const bDur = breakfastDurs.length > 0
      ? roundToNearestSlab(breakfastDurs.reduce((a, b) => a + b, 0) / breakfastDurs.length, 5)
      : Math.max(30, configuredRoutineMins.breakfastMins);
    let bStart: number;
    let bSource: RoutineBlockInterval['source'] = 'configured_habit';

    if (breakfastStarts.length > 0) {
      bStart = roundToNearestSlab(breakfastStarts.reduce((a, b) => a + b, 0) / breakfastStarts.length, 15);
      bSource = 'historical_logs';
    } else {
      // Realistic placement based on wake & study start:
      // If user starts studying early (e.g. 07:00 AM), place Breakfast after first 90m morning study block (~08:30 AM).
      // If user starts studying at/after 08:45 AM, place Breakfast right before study start (e.g. 08:15 AM).
      if (estimatedStudyStartMinutes <= 480) {
        bStart = Math.max(510, estimatedStudyStartMinutes + 90); // e.g., 08:30 AM
      } else {
        bStart = Math.max(freshUpWindow.end + 15, Math.min(540, estimatedStudyStartMinutes - bDur));
      }
    }
    bStart = Math.max(freshUpWindow.end, Math.min(630 - bDur, bStart));
    const bEnd = bStart + bDur;
    breakfastWindow = {
      start: bStart,
      end: bEnd,
      duration: bDur,
      label: 'Breakfast',
      category: 'breakfast',
      source: bSource
    };
  }

  // 3. Lunch Window (Always Protected: ~01:00 PM–01:45 PM default or historical/same-day time)
  let lunchWindow: RoutineBlockInterval;
  if (sameDayLunch) {
    lunchWindow = {
      ...sameDayLunch,
      label: 'Lunch',
      category: 'lunch',
      source: 'same_day_logged',
      isCompletedToday: true
    };
  } else {
    const lDur = lunchDurs.length > 0
      ? roundToNearestSlab(lunchDurs.reduce((a, b) => a + b, 0) / lunchDurs.length, 5)
      : Math.max(45, configuredRoutineMins.lunchMins);
    const lStart = lunchStarts.length > 0
      ? Math.max(735, Math.min(885, roundToNearestSlab(lunchStarts.reduce((a, b) => a + b, 0) / lunchStarts.length, 15)))
      : 780; // Default 01:00 PM (780m)
    const lEnd = Math.min(960, lStart + lDur);
    lunchWindow = {
      start: lStart,
      end: lEnd,
      duration: lEnd - lStart,
      label: 'Lunch',
      category: 'lunch',
      source: lunchStarts.length > 0 ? 'historical_logs' : 'configured_habit'
    };
  }

  // 4. Dinner Window (Always Protected: ~08:30 PM–09:15 PM default or historical/same-day time, always >=45m before bedtime)
  let dinnerWindow: RoutineBlockInterval;
  if (sameDayDinner) {
    dinnerWindow = {
      ...sameDayDinner,
      label: 'Dinner',
      category: 'dinner',
      source: 'same_day_logged',
      isCompletedToday: true
    };
  } else {
    const dDur = dinnerDurs.length > 0
      ? roundToNearestSlab(dinnerDurs.reduce((a, b) => a + b, 0) / dinnerDurs.length, 5)
      : Math.max(45, configuredRoutineMins.dinnerMins);
    const latestDinnerStart = Math.max(1140, maxStudyCeiling - dDur - 60);
    const dStart = dinnerStarts.length > 0
      ? Math.max(1140, Math.min(latestDinnerStart, roundToNearestSlab(dinnerStarts.reduce((a, b) => a + b, 0) / dinnerStarts.length, 15)))
      : Math.min(latestDinnerStart, 1230); // Default 08:30 PM (1230m)
    const dEnd = Math.min(maxStudyCeiling - 15, dStart + dDur);
    dinnerWindow = {
      start: dStart,
      end: dEnd,
      duration: Math.max(25, dEnd - dStart),
      label: 'Dinner',
      category: 'dinner',
      source: dinnerStarts.length > 0 ? 'historical_logs' : 'configured_habit'
    };
  }

  // Assemble all protected daily routine & meal intervals
  const routineIntervals: RoutineBlockInterval[] = [
    freshUpWindow,
    breakfastWindow,
    lunchWindow,
    dinnerWindow
  ];

  // Include any additional recurring evening/custom routine if consistently present in historical logs
  if (customRoutineSamples.length >= 2) {
    const avgCStart = roundToNearestSlab(
      customRoutineSamples.reduce((a, b) => a + b.start, 0) / customRoutineSamples.length,
      15
    );
    const avgCDur = roundToNearestSlab(
      customRoutineSamples.reduce((a, b) => a + b.duration, 0) / customRoutineSamples.length,
      15
    );
    const cEnd = Math.min(dinnerWindow.start - 15, avgCStart + Math.max(15, avgCDur));
    if (avgCStart >= lunchWindow.end + 60 && cEnd > avgCStart) {
      routineIntervals.push({
        start: avgCStart,
        end: cEnd,
        duration: cEnd - avgCStart,
        label: customRoutineSamples[0].label || 'Evening Routine',
        category: 'routine',
        source: 'historical_logs'
      });
    }
  }

  // Sort routine intervals chronologically
  routineIntervals.sort((a, b) => a.start - b.start);

  // If Breakfast sits right at estimatedStudyStartMinutes, shift estimatedStudyStartMinutes right after Breakfast
  if (
    breakfastWindow.start <= estimatedStudyStartMinutes &&
    breakfastWindow.end > estimatedStudyStartMinutes &&
    breakfastWindow.end <= 660
  ) {
    estimatedStudyStartMinutes = breakfastWindow.end;
  }

  const breakRuleSummary = '15m break after every 2–3 hrs (120–180m) study';
  const weeksCheckedLabel = maxAvailableWeeks > 0
    ? `${sameWeekdayValidRecords.length}/${maxAvailableWeeks} valid ${weekdayName.slice(0, 3)}s`
    : last7DaysRecords.length > 0
      ? `${last7DaysRecords.length}d last-week data`
      : `Calibrated ${weekdayName.slice(0, 3)} baseline`;
  const ignoredLabel = (sameWeekdayIgnoredCount + recentWeekIgnoredCount) > 0
    ? ` • ${sameWeekdayIgnoredCount + recentWeekIgnoredCount} outlier day(s) filtered`
    : '';

  const rationaleSummaryText = `${weekdayName} Analytics (${weeksCheckedLabel}${ignoredLabel}): Start ${minutesToAmPmStr(estimatedStudyStartMinutes)} • Breakfast ${minutesToAmPmStr(breakfastWindow.start)}–${minutesToAmPmStr(breakfastWindow.end)} • Lunch ${minutesToAmPmStr(lunchWindow.start)}–${minutesToAmPmStr(lunchWindow.end)} • Dinner ${minutesToAmPmStr(dinnerWindow.start)}–${minutesToAmPmStr(dinnerWindow.end)} • Sleep ${minutesToAmPmStr(sleepStartMinutes)}–${minutesToAmPmStr(sleepEndMinutes)}`;

  return {
    ...baseSleep,
    sleepStartMinutes,
    sleepEndMinutes,
    sleepStartTimeStr: minutesToClockTime(sleepStartMinutes),
    sleepEndTimeStr: minutesToClockTime(sleepEndMinutes),
    sleepIntervals,
    targetDate: effectiveDateStr,
    weekdayIndex: targetWeekday,
    weekdayName,
    sameWeekdayAvailableWeeks: maxAvailableWeeks,
    sameWeekdayValidCount: sameWeekdayValidRecords.length,
    sameWeekdayIgnoredCount,
    recentWeekValidCount: recentWeekValidRecords.length,
    recentWeekIgnoredCount,
    recentWeeklyCleanAvgMinutes,
    last7DaysSampleCount: last7DaysRecords.length,
    sameDayLogsCount,
    estimatedStudyStartMinutes,
    estimatedStudyStartTimeStr: minutesToClockTime(estimatedStudyStartMinutes),
    estimatedStudyEndMinutes,
    estimatedStudyEndTimeStr: minutesToClockTime(estimatedStudyEndMinutes),
    routineIntervals,
    mealWindows: {
      breakfast: breakfastWindow,
      lunch: lunchWindow,
      dinner: dinnerWindow,
      freshUp: freshUpWindow
    },
    breakRuleSummary,
    rationaleSummaryText
  };
}

/**
 * Builds the unified sorted list of protected/blocked intervals for a day:
 * - Sleep windows (`sleepIntervals`)
 * - Meal & Routine windows (`routineIntervals`: Fresh Up, Breakfast, Lunch, Dinner, Custom Routines)
 * - Fixed busy intervals (already scheduled or completed slots)
 */
export function buildProtectedBlockedIntervals(
  rationale: DayRationaleAnalysis,
  fixedBusyIntervals: { start: number; end: number }[] = [],
  protectSleep: boolean = true,
  protectMealsAndRoutines: boolean = true
): { start: number; end: number }[] {
  const rawBlocked: { start: number; end: number }[] = [];

  if (protectSleep) {
    rationale.sleepIntervals.forEach(s => {
      if (s.end > s.start) {
        rawBlocked.push({ start: s.start, end: s.end });
      }
    });
  }

  if (protectMealsAndRoutines) {
    rationale.routineIntervals.forEach(r => {
      if (r.end > r.start) {
        rawBlocked.push({ start: r.start, end: r.end });
      }
    });
  }

  fixedBusyIntervals.forEach(b => {
    if (b.end > b.start) {
      rawBlocked.push({ start: b.start, end: b.end });
    }
  });

  rawBlocked.sort((a, b) => a.start - b.start);
  const mergedBlocked: { start: number; end: number }[] = [];
  for (const blk of rawBlocked) {
    if (mergedBlocked.length === 0) {
      mergedBlocked.push({ start: blk.start, end: blk.end });
    } else {
      const last = mergedBlocked[mergedBlocked.length - 1];
      if (blk.start <= last.end) {
        last.end = Math.max(last.end, blk.end);
      } else {
        mergedBlocked.push({ start: blk.start, end: blk.end });
      }
    }
  }

  return mergedBlocked;
}

export interface TimelineSplitInfo {
  partNumber: number;
  totalParts: number;
  originalDurationMinutes: number;
  partLabel: string;
}

export interface PlacedTimelineItem<T> {
  item: T;
  startMinutes: number;
  endMinutes: number;
  durationMinutes: number;
  breakInsertedBefore: number;
  splitInfo?: TimelineSplitInfo;
}

export interface FitTimelineOptions {
  enforceStudyBreakRule?: boolean; // default true: 15m break every 120-180m study
  minTransitionGap?: number;       // default 5m between blocks < 120m
  protectSleepWindow?: boolean;    // default true
  allowBlockadeSplit?: boolean;    // default true: intelligently split chapter across routine blockades
}

/**
 * Fits an ordered sequence of study items into a 24-hour day timeline based on `DayRationaleAnalysis`:
 * - Starts at `anchorStartMinutes` (e.g., `estimatedStudyStartMinutes` or current time floor)
 * - Strictly leaves `sleepIntervals` and `routineIntervals` (Breakfast, Lunch, Dinner, Fresh Up) untouched
 * - Automatically inserts a 15-minute refreshment break after every 2–3 hours (120–180 minutes)
 *   of continuous study (and 5m transition buffer between smaller consecutive blocks).
 * - If a chapter encounters a routine blockade (Meals/Fresh Up) and has viable time before the blockade
 *   (>= 20m) and remaining time after (>= 15m), intelligently splits the chapter into two slots:
 *   Part 1 before the blockade, and Part 2 in the next available timeline immediately after the blockade!
 *   This avoids unnecessary timeline pushes and preserves prime study hours.
 */
export function fitOrderedItemsToRationaleTimeline<T extends { durationMinutes: number }>(
  orderedItems: T[],
  rationale: DayRationaleAnalysis,
  anchorStartMinutes: number,
  fixedBusyIntervals: { start: number; end: number }[] = [],
  options?: FitTimelineOptions
): {
  placedItems: PlacedTimelineItem<T>[];
  unplacedItems: T[];
} {
  const enforceBreakRule = options?.enforceStudyBreakRule !== false;
  const minTransitionGap = options?.minTransitionGap ?? 5;
  const protectSleep = options?.protectSleepWindow !== false;
  const allowBlockadeSplit = options?.allowBlockadeSplit !== false;

  const mergedBlocked = buildProtectedBlockedIntervals(rationale, fixedBusyIntervals, protectSleep, true);

  const dayCeiling = protectSleep && rationale.sleepStartMinutes > rationale.sleepEndMinutes
    ? rationale.sleepStartMinutes
    : 1440;

  const wakingFloor = Math.max(
    protectSleep ? rationale.sleepEndMinutes : 0,
    rationale.mealWindows?.freshUp ? rationale.mealWindows.freshUp.end : 0
  );

  // Helper to run a placement pass with given break settings
  const runPlacementPass = (use15mBreakRule: boolean, stepTransitionGap: number, startFloor: number) => {
    let cursor = Math.max(wakingFloor, Math.min(1425, startFloor));

    const advancePastBlocked = (pos: number): { nextPos: number; jumpedBlock: boolean } => {
      let p = pos;
      let jumped = false;
      for (const blk of mergedBlocked) {
        if (p >= blk.start && p < blk.end) {
          p = blk.end;
          jumped = true;
        }
      }
      return { nextPos: p, jumpedBlock: jumped };
    };

    let continuousStudyMins = 0;
    const placed: PlacedTimelineItem<T>[] = [];
    const unplaced: T[] = [];

    for (let idx = 0; idx < orderedItems.length; idx++) {
      const item = orderedItems[idx];
      const dur = Math.max(1, item.durationMinutes);
      const originalTargetDur = (item as any).totalTargetMinutes || (item as any).originalDurationMinutes || dur;
      const isMockTest = Boolean(
        (item as any).isMockTest ||
        (item as any).mockScheduledTime ||
        ((item as any).title && /mock\s*test/i.test((item as any).title))
      );

      // Determine break needed before this item based on 2-3 hour (120-180m) study rule
      let breakBefore = 0;
      if (placed.length > 0) {
        if (use15mBreakRule && (continuousStudyMins >= 120 || continuousStudyMins + dur > 180)) {
          breakBefore = 15; // 15-minute mandatory refreshment break after 2–3 hours of study
        } else {
          breakBefore = stepTransitionGap;
        }
      }

      let candidateStart = cursor + breakBefore;
      const step1 = advancePastBlocked(candidateStart);
      if (step1.jumpedBlock) {
        // A meal/routine or busy block already acted as a natural break
        candidateStart = step1.nextPos;
        continuousStudyMins = 0;
        breakBefore = 0;
      } else if (breakBefore === 15) {
        continuousStudyMins = 0;
      }

      // We attempt to fit this item into the timeline.
      // If a routine blockade (meal, snack, protected routine) comes in between and leaves
      // viable time before the blockade (>= 20m) and remaining after (>= 15m),
      // we intelligently split the chapter around the blockade:
      // Part 1 before the blockade, and Part 2 in the next available timeline after the blockade!
      let remainingDurToPlace = dur;
      let itemFitted = false;
      const partsForThisItem: Array<{ start: number; end: number; dur: number; breakBefore: number }> = [];

      const savedCursor = cursor;
      const savedContinuousStudy = continuousStudyMins;

      while (remainingDurToPlace > 0 && candidateStart < dayCeiling) {
        const targetEnd = candidateStart + remainingDurToPlace;
        const overlappingBlock = mergedBlocked.find(
          blk => Math.max(candidateStart, blk.start) < Math.min(targetEnd, blk.end)
        );

        if (!overlappingBlock) {
          if (targetEnd <= dayCeiling) {
            partsForThisItem.push({
              start: candidateStart,
              end: targetEnd,
              dur: remainingDurToPlace,
              breakBefore
            });
            cursor = targetEnd;
            continuousStudyMins += remainingDurToPlace;
            remainingDurToPlace = 0;
            itemFitted = true;
          }
          break;
        }

        // Blockade encountered
        const spaceBeforeBlock = overlappingBlock.start - candidateStart;

        // Check viability of splitting this chapter around the routine blockade
        const canSplit = allowBlockadeSplit &&
          !isMockTest &&
          spaceBeforeBlock >= 20 &&
          (remainingDurToPlace - spaceBeforeBlock) >= 15 &&
          overlappingBlock.start <= dayCeiling;

        if (canSplit) {
          // Place Part 1 before the blockade
          partsForThisItem.push({
            start: candidateStart,
            end: overlappingBlock.start,
            dur: spaceBeforeBlock,
            breakBefore
          });
          remainingDurToPlace -= spaceBeforeBlock;

          // Routine blockade naturally resets continuous study time
          continuousStudyMins = 0;
          breakBefore = 0;

          // Resume next part immediately after the routine blockade
          const stepPast = advancePastBlocked(overlappingBlock.end);
          candidateStart = stepPast.nextPos;
        } else {
          // Not viable to split (e.g. < 20m before block, remainder < 15m, or mock test)
          // Jump past the entire blockade into the next open window
          continuousStudyMins = 0;
          breakBefore = 0;
          const stepPast = advancePastBlocked(overlappingBlock.end);
          candidateStart = stepPast.nextPos;
        }
      }

      if (itemFitted && remainingDurToPlace === 0 && partsForThisItem.length > 0) {
        const totalParts = partsForThisItem.length;
        for (let p = 0; p < totalParts; p++) {
          const part = partsForThisItem[p];
          placed.push({
            item,
            startMinutes: part.start,
            endMinutes: part.end,
            durationMinutes: part.dur,
            breakInsertedBefore: part.breakBefore,
            ...(totalParts > 1 ? {
              splitInfo: {
                partNumber: p + 1,
                totalParts,
                originalDurationMinutes: originalTargetDur,
                partLabel: `Part ${p + 1}/${totalParts}`
              }
            } : {})
          });
        }
      } else {
        // Roll back state and mark as unplaced
        cursor = savedCursor;
        continuousStudyMins = savedContinuousStudy;
        unplaced.push(item);
      }
    }

    return { placedItems: placed, unplacedItems: unplaced };
  };

  // Pass 1: Standard placement with 15m study break rule and requested anchorStartMinutes
  const pass1 = runPlacementPass(enforceBreakRule, minTransitionGap, anchorStartMinutes);
  if (pass1.unplacedItems.length === 0) {
    return pass1;
  }

  // Pass 2: If some items didn't fit before bedtime, try compacting inter-study transition gaps (0m) while still strictly protecting Sleep, Breakfast, Lunch & Dinner
  const pass2 = runPlacementPass(false, 0, anchorStartMinutes);
  if (pass2.placedItems.length > pass1.placedItems.length) {
    if (pass2.unplacedItems.length === 0) {
      return pass2;
    }
    return pass2;
  }

  return pass1;
}

/**
 * Finds the next realistic non-overlapping gap on the 24-hour clock that strictly avoids:
 * - Existing study slots
 * - Sleep windows (`sleepIntervals`)
 * - Meal & Routine windows (`routineIntervals`: Fresh Up, Breakfast, Lunch, Dinner)
 */
export function findRealisticGapOnClock(
  existingSlots: Array<{ startMinutes: number; endMinutes: number }>,
  durationMinutes: number,
  preferStartMinutes: number = 540,
  minAllowedStartMinutes: number = 0,
  targetDateStr?: string,
  level: CALevel = getSelectedCALevel()
): { startMinutes: number; endMinutes: number } {
  const rationale = analyzeUserDayRationale(targetDateStr, level);
  const safeMin = Math.max(0, Math.min(1425, minAllowedStartMinutes));
  const wakingStart = Math.max(
    safeMin,
    rationale.sleepEndMinutes,
    rationale.mealWindows?.freshUp ? rationale.mealWindows.freshUp.end : 0
  );
  const dayCeiling = rationale.sleepStartMinutes > rationale.sleepEndMinutes
    ? rationale.sleepStartMinutes
    : 1440;

  const effectiveDur = Math.max(1, Math.min(durationMinutes, 1440 - safeMin));
  const existingBusy = existingSlots.map(s => ({
    start: Number(s.startMinutes) || 0,
    end: Number(s.endMinutes) || 0
  }));

  // 1. Search with full protection (Sleep + Breakfast + Lunch + Dinner + Existing Slots)
  const blockedWithMeals = buildProtectedBlockedIntervals(rationale, existingBusy, true, true);

  const searchInBlocked = (blockedList: { start: number; end: number }[], startFrom: number, ceiling: number): { startMinutes: number; endMinutes: number } | null => {
    let candidate = Math.max(safeMin, startFrom);
    for (const blk of blockedList) {
      if (blk.end <= candidate) continue;
      if (candidate + effectiveDur <= blk.start && candidate + effectiveDur <= ceiling) {
        return { startMinutes: candidate, endMinutes: candidate + effectiveDur };
      }
      if (candidate < blk.end) {
        candidate = Math.max(candidate, blk.end);
      }
    }
    if (candidate + effectiveDur <= ceiling) {
      return { startMinutes: candidate, endMinutes: candidate + effectiveDur };
    }
    return null;
  };

  // Try starting from preferStartMinutes
  const fit1 = searchInBlocked(blockedWithMeals, Math.max(wakingStart, preferStartMinutes), dayCeiling);
  if (fit1) return fit1;

  // Try searching from wakingStart (morning)
  const fit2 = searchInBlocked(blockedWithMeals, wakingStart, dayCeiling);
  if (fit2) return fit2;

  // Find the largest available non-meal, non-sleep gap >= wakingStart before bedtime
  let bestGapStart = wakingStart;
  let bestGapEnd = Math.min(dayCeiling, wakingStart + effectiveDur);
  let maxGapSize = 0;
  let cursor = wakingStart;

  for (const blk of blockedWithMeals) {
    if (blk.end <= cursor) continue;
    const clampedBlkStart = Math.min(dayCeiling, blk.start);
    if (clampedBlkStart > cursor) {
      const gapLen = clampedBlkStart - cursor;
      if (gapLen > maxGapSize) {
        maxGapSize = gapLen;
        bestGapStart = cursor;
        bestGapEnd = Math.min(clampedBlkStart, cursor + effectiveDur);
      }
    }
    cursor = Math.max(cursor, blk.end);
    if (cursor >= dayCeiling) break;
  }
  if (dayCeiling > cursor) {
    const tailGap = dayCeiling - cursor;
    if (tailGap > maxGapSize) {
      maxGapSize = tailGap;
      bestGapStart = cursor;
      bestGapEnd = Math.min(dayCeiling, cursor + effectiveDur);
    }
  }
  if (maxGapSize >= 15) {
    return { startMinutes: bestGapStart, endMinutes: bestGapEnd };
  }

  // Last resort: avoid existing slots and sleep
  const blockedSleepOnly = buildProtectedBlockedIntervals(rationale, existingBusy, true, false);
  const fit3 = searchInBlocked(blockedSleepOnly, Math.max(safeMin, preferStartMinutes), 1440);
  if (fit3) return fit3;

  const clampedStart = Math.max(safeMin, Math.min(preferStartMinutes, Math.max(safeMin, 1440 - effectiveDur)));
  return { startMinutes: clampedStart, endMinutes: Math.min(1440, clampedStart + effectiveDur) };
}
