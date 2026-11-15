/**
 * Monthly 24-Hour Time Ledger Calculator & PDF Report Engine
 * Calculates exact day-wise metrics in hours for:
 * 1. Study Time
 * 2. Desk Break
 * 3. Routines
 * 4. Sleep
 * 5. Idle Time (24h - Study - Break - Routine - Sleep)
 */

import {
  SubjectId,
  FOUNDATION_SUBJECT_IDS,
  INTERMEDIATE_SUBJECT_IDS,
  FINAL_SUBJECT_IDS,
} from '../types';
import { exportToPdfEngine } from './pdfExporter';
import { deduplicateSessionLogs } from './logSyncEngine';
import { CA_CURRICULUM_LEVELS, getSelectedCALevel, CALevel } from '../data/curriculumLevels';
import { getLevelScopedKey } from './levelStorage';

const createEmptySubjectMinutes = (): Record<SubjectId, number> => {
  const map = {} as Record<SubjectId, number>;
  [...FOUNDATION_SUBJECT_IDS, ...INTERMEDIATE_SUBJECT_IDS, ...FINAL_SUBJECT_IDS].forEach((id) => {
    map[id] = 0;
  });
  return map;
};

export interface DayLedgerMetric {
  date: string; // YYYY-MM-DD
  dayNumber: number;
  formattedDate: string; // "01 Sep 2026"
  weekday: string; // "Tue"
  isToday: boolean;
  isFuture: boolean;
  studyMinutes: number;
  breakMinutes: number;
  routineMinutes: number;
  sleepMinutes: number;
  idleMinutes: number;
  studyHours: number;
  breakHours: number;
  routineHours: number;
  sleepHours: number;
  idleHours: number;
  totalHours: number; // 24.00 for elapsed/today, 0 for future
  studyPercentage: number;
  subjectBreakdownMinutes?: Record<SubjectId, number>;
}

export interface MonthlyLedgerSummary {
  monthKey: string; // "2026-09"
  monthName: string; // "September 2026"
  daysInMonth: number;
  daysCountedForAvg: number; // e.g. 4 for running month (Sep 4), or daysInMonth for past months
  isRunningMonth: boolean;
  isFutureMonth: boolean;
  currentDayOfMonth: number;
  days: DayLedgerMetric[];
  totalStudyHours: number;
  totalBreakHours: number;
  totalRoutineHours: number;
  totalSleepHours: number;
  totalIdleHours: number;
  totalMonthHours: number; // For running month: daysCountedForAvg * 24 (elapsed base)
  fullMonthBaseHours: number; // daysInMonth * 24
  avgStudyHoursPerDay: number;
  avgBreakHoursPerDay: number;
  avgRoutineHoursPerDay: number;
  avgSleepHoursPerDay: number;
  avgIdleHoursPerDay: number;
  activeTrackingDays: number;
  lifeStudyRatio: number;
}

const getLocalDateString = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseTimeToMinutes = (timeStr: string): number => {
  if (!timeStr) return 0;
  const clean = timeStr.trim();
  if (clean.includes('T')) {
    const d = new Date(clean);
    if (!isNaN(d.getTime())) {
      return d.getHours() * 60 + d.getMinutes();
    }
  }
  const uppercase = clean.toUpperCase().replace(/[\u202F\u00A0]/g, ' ');
  const isPM = uppercase.includes('PM');
  const isAM = uppercase.includes('AM');
  const rawNumbers = uppercase.replace(/[A-Z]/g, '').trim().split(':');
  let hours = parseInt(rawNumbers[0], 10) || 0;
  const mins = parseInt(rawNumbers[1] || '0', 10);
  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;
  return Math.min(1439, Math.max(0, hours * 60 + mins));
};

export const calculateMonthlyLedger = (
  monthKey: string, // "YYYY-MM"
  rawPomoLogs?: any[],
  rawSleepSessions?: any[],
  rawFocusSessions?: any[],
  level: CALevel = getSelectedCALevel()
): MonthlyLedgerSummary => {
  // 1. Fallback to level-scoped localStorage if not provided
  let pomoLogs = rawPomoLogs;
  if (!pomoLogs) {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_pomo_logs', level));
      pomoLogs = stored ? JSON.parse(stored) : [];
    } catch {
      pomoLogs = [];
    }
  }
  // Automatically deduplicate and sanitize legacy orphan records
  pomoLogs = deduplicateSessionLogs(pomoLogs || []).map((l: any) => {
    // Repair legacy routine logs stored as break
    if (l.mode === 'break' && (l.notes === 'Daily Routine Block' || l.notes === 'Extended Routine Block' || l.notes?.toLowerCase()?.includes('routine'))) {
      return { ...l, mode: 'routine', subjectId: undefined };
    }
    return l;
  });

  let sleepSessions = rawSleepSessions;
  if (!sleepSessions) {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_sleep_sessions', level)) || localStorage.getItem('practca_sleep_sessions');
      sleepSessions = stored ? JSON.parse(stored) : [];
    } catch {
      sleepSessions = [];
    }
  }

  let focusSessions = rawFocusSessions;
  if (!focusSessions) {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', level));
      focusSessions = stored ? JSON.parse(stored) : [];
    } catch {
      focusSessions = [];
    }
  }

  // 2. Determine Year and Month
  const [yearStr, monthStr] = (monthKey || getLocalDateString(new Date()).substring(0, 7)).split('-');
  const year = parseInt(yearStr, 10) || new Date().getFullYear();
  const month = parseInt(monthStr, 10) || (new Date().getMonth() + 1);

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthDate = new Date(year, month - 1, 1);
  const monthName = monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Determine running month and current day
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  const isRunningMonth = year === currentYear && month === currentMonth;
  const isFutureMonth = year > currentYear || (year === currentYear && month > currentMonth);

  // Average divisor: for the running month (e.g. today is 4 Sep so month is Sep),
  // days counted must only be till today (e.g. 4 days).
  // For past months, all days in the month are counted.
  // For future months, 0 days have elapsed.
  let daysCountedForAvg = daysInMonth;
  if (isRunningMonth) {
    daysCountedForAvg = Math.max(1, Math.min(daysInMonth, currentDay));
  } else if (isFutureMonth) {
    daysCountedForAvg = 0;
  }

  // 3. Split Sleep sessions across midnight
  const splitSleeps: Array<{ date: string; startMin: number; endMin: number; duration: number }> = [];
  (sleepSessions || []).forEach((s: any) => {
    if (!s.startTime) return;
    const startD = new Date(s.startTime);
    const endD = s.endTime ? new Date(s.endTime) : new Date(startD.getTime() + (s.duration || 0) * 60000);
    if (isNaN(startD.getTime()) || isNaN(endD.getTime())) return;

    let curr = new Date(startD);
    while (curr.getTime() < endD.getTime()) {
      const dateStr = getLocalDateString(curr);
      const nextMidnight = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate() + 1, 0, 0, 0, 0);
      const startMin = curr.getHours() * 60 + curr.getMinutes();

      if (nextMidnight.getTime() < endD.getTime()) {
        const durationMins = Math.round((nextMidnight.getTime() - curr.getTime()) / 60000);
        if (durationMins > 0) {
          splitSleeps.push({
            date: dateStr,
            startMin,
            endMin: 1440,
            duration: durationMins
          });
        }
        curr = nextMidnight;
      } else {
        const durationMins = Math.round((endD.getTime() - curr.getTime()) / 60000);
        const endMin = endD.getHours() * 60 + endD.getMinutes();
        if (durationMins > 0) {
          splitSleeps.push({
            date: dateStr,
            startMin,
            endMin: Math.min(1440, Math.max(startMin + 1, endMin)),
            duration: durationMins
          });
        }
        break;
      }
    }
  });

  // 4. Compute day by day
  const days: DayLedgerMetric[] = [];
  let totalStudyMinutes = 0;
  let totalBreakMinutes = 0;
  let totalRoutineMinutes = 0;
  let totalSleepMinutes = 0;
  let totalIdleMinutes = 0;
  let activeDaysCount = 0;

  for (let day = 1; day <= daysInMonth; day++) {
    const dayDate = new Date(year, month - 1, day);
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const weekday = dayDate.toLocaleString('en-US', { weekday: 'short' });
    const formattedDate = `${String(day).padStart(2, '0')} ${dayDate.toLocaleString('en-US', { month: 'short' })} ${year}`;

    const isToday = isRunningMonth && day === currentDay;
    const isFuture = isFutureMonth || (isRunningMonth && day > currentDay);

    // Timeline array for 1440 minutes of the day
    const minuteMap: Array<'study' | 'break' | 'routine' | 'sleep' | null> = new Array(1440).fill(null);
    const subjectMins: Record<SubjectId, number> = createEmptySubjectMinutes();

    // A. Apply Sleep for this day
    const daySleeps = splitSleeps.filter(s => s.date === dateStr);
    daySleeps.forEach(s => {
      const sMin = Math.max(0, Math.min(1439, s.startMin));
      const eMin = Math.max(sMin + 1, Math.min(1440, s.endMin));
      for (let m = sMin; m < eMin; m++) {
        minuteMap[m] = 'sleep';
      }
    });

    // B. Apply Pomo Ledger logs for this day
    const dayPomoLogs = (pomoLogs || []).filter((log: any) => {
      let logDate = log.date;
      if (!logDate && log.id) {
        const parts = log.id.split('_');
        for (const p of parts) {
          const ts = parseInt(p, 10);
          if (!isNaN(ts) && ts > 1000000000000) {
            logDate = getLocalDateString(new Date(ts));
            break;
          }
        }
      }
      return logDate === dateStr;
    });

    // Sort older to newer so newer logs override overlaps
    const sortedLogs = [...dayPomoLogs].reverse();
    sortedLogs.forEach((log: any) => {
      const startMins = parseTimeToMinutes(log.startTime);
      let endMins = log.endTime ? parseTimeToMinutes(log.endTime) : 0;
      const durationMins = Math.max(1, Math.round((log.durationSeconds || 0) / 60));
      if (endMins <= startMins) {
        endMins = startMins + durationMins;
      }
      endMins = Math.min(1440, endMins);

      let mode = (log.mode as 'study' | 'break' | 'routine' | 'sleep') || 'study';
      if (mode === 'break' && (log.notes === 'Daily Routine Block' || log.notes === 'Extended Routine Block' || log.notes?.toLowerCase()?.includes('routine'))) {
        mode = 'routine';
      }
      for (let m = startMins; m < endMins; m++) {
        minuteMap[m] = mode;
        if (mode === 'study' && log.subjectId && subjectMins[log.subjectId as SubjectId] !== undefined) {
          subjectMins[log.subjectId as SubjectId]++;
        }
      }
    });

    // C. Focus Sessions fallback (if no direct minute entries in ledger)
    const dayFocus = (focusSessions || []).filter((f: any) => f.date === dateStr);
    if (dayFocus.length > 0 && dayPomoLogs.length === 0) {
      dayFocus.forEach((f: any) => {
        const startMins = parseTimeToMinutes(f.startTime);
        const durationMins = Math.max(1, Math.round(f.durationMinutes || 0));
        const endMins = Math.min(1440, startMins + durationMins);
        for (let m = startMins; m < endMins; m++) {
          minuteMap[m] = 'study';
          if (f.subjectId && subjectMins[f.subjectId as SubjectId] !== undefined) {
            subjectMins[f.subjectId as SubjectId]++;
          }
        }
      });
    }

    // Tally minutes
    let sMins = 0;
    let bMins = 0;
    let rMins = 0;
    let slMins = 0;

    for (let m = 0; m < 1440; m++) {
      const mode = minuteMap[m];
      if (mode === 'study') sMins++;
      else if (mode === 'break') bMins++;
      else if (mode === 'routine') rMins++;
      else if (mode === 'sleep') slMins++;
    }

    // Fallback: If minuteMap was not populated due to missing timestamps, sum durations
    if (sMins === 0 && bMins === 0 && rMins === 0 && slMins === 0) {
      dayPomoLogs.forEach((l: any) => {
        const dur = Math.max(1, Math.round((l.durationSeconds || 0) / 60));
        if (l.mode === 'study') sMins += dur;
        else if (l.mode === 'break') bMins += dur;
        else if (l.mode === 'routine') rMins += dur;
        else if (l.mode === 'sleep') slMins += dur;
      });
      daySleeps.forEach(s => {
        slMins += s.duration;
      });
    }

    // Cap total if overflows 1440
    const totalAllocated = sMins + bMins + rMins + slMins;
    if (totalAllocated > 1440) {
      const scale = 1440 / totalAllocated;
      sMins = Math.round(sMins * scale);
      bMins = Math.round(bMins * scale);
      rMins = Math.round(rMins * scale);
      slMins = Math.round(slMins * scale);
    }

    // For past days and today, remaining unallocated time in 24h cycle is idle.
    // For future unreached days, idle time is 0 (day has not yet occurred).
    const idleMins = isFuture 
      ? 0 
      : Math.max(0, 1440 - (sMins + bMins + rMins + slMins));

    // Convert to hours (exact decimal hours)
    const studyHours = parseFloat((sMins / 60).toFixed(2));
    const breakHours = parseFloat((bMins / 60).toFixed(2));
    const routineHours = parseFloat((rMins / 60).toFixed(2));
    const sleepHours = parseFloat((slMins / 60).toFixed(2));
    const idleHours = parseFloat((idleMins / 60).toFixed(2));
    const totalHours = isFuture ? 0 : 24.00;

    const studyPercentage = isFuture 
      ? 0 
      : parseFloat(((sMins / 1440) * 100).toFixed(1));

    if (sMins > 0 || bMins > 0 || rMins > 0 || slMins > 0) {
      activeDaysCount++;
    }

    // Accumulate into monthly totals for elapsed days (up to today in running month)
    if (!isFuture || (sMins > 0 || bMins > 0 || rMins > 0 || slMins > 0)) {
      totalStudyMinutes += sMins;
      totalBreakMinutes += bMins;
      totalRoutineMinutes += rMins;
      totalSleepMinutes += slMins;
      totalIdleMinutes += idleMins;
    }

    days.push({
      date: dateStr,
      dayNumber: day,
      formattedDate,
      weekday,
      isToday,
      isFuture,
      studyMinutes: sMins,
      breakMinutes: bMins,
      routineMinutes: rMins,
      sleepMinutes: slMins,
      idleMinutes: idleMins,
      studyHours,
      breakHours,
      routineHours,
      sleepHours,
      idleHours,
      totalHours,
      studyPercentage,
      subjectBreakdownMinutes: subjectMins
    });
  }

  const totalStudyHours = parseFloat((totalStudyMinutes / 60).toFixed(2));
  const totalBreakHours = parseFloat((totalBreakMinutes / 60).toFixed(2));
  const totalRoutineHours = parseFloat((totalRoutineMinutes / 60).toFixed(2));
  const totalSleepHours = parseFloat((totalSleepMinutes / 60).toFixed(2));
  const totalIdleHours = parseFloat((totalIdleMinutes / 60).toFixed(2));

  // Elapsed hours capacity for the running month (e.g. 4 days * 24 = 96 hrs)
  const totalMonthHours = isRunningMonth 
    ? parseFloat((daysCountedForAvg * 24).toFixed(2)) 
    : parseFloat((daysInMonth * 24).toFixed(2));
  const fullMonthBaseHours = daysInMonth * 24;

  // Average formula: For running month, days to be counted only till today (e.g., 4 days for Sep 4)
  const avgDivisor = daysCountedForAvg > 0 ? daysCountedForAvg : 1;
  const avgStudyHoursPerDay = daysCountedForAvg > 0 ? parseFloat((totalStudyHours / avgDivisor).toFixed(2)) : 0;
  const avgBreakHoursPerDay = daysCountedForAvg > 0 ? parseFloat((totalBreakHours / avgDivisor).toFixed(2)) : 0;
  const avgRoutineHoursPerDay = daysCountedForAvg > 0 ? parseFloat((totalRoutineHours / avgDivisor).toFixed(2)) : 0;
  const avgSleepHoursPerDay = daysCountedForAvg > 0 ? parseFloat((totalSleepHours / avgDivisor).toFixed(2)) : 0;
  const avgIdleHoursPerDay = daysCountedForAvg > 0 ? parseFloat((totalIdleHours / avgDivisor).toFixed(2)) : 0;

  const totalRestHours = totalBreakHours + totalRoutineHours + totalSleepHours;
  const lifeStudyRatio = totalStudyHours > 0 ? parseFloat((totalRestHours / totalStudyHours).toFixed(2)) : 0;

  return {
    monthKey: `${year}-${String(month).padStart(2, '0')}`,
    monthName,
    daysInMonth,
    daysCountedForAvg,
    isRunningMonth,
    isFutureMonth,
    currentDayOfMonth: currentDay,
    days,
    totalStudyHours,
    totalBreakHours,
    totalRoutineHours,
    totalSleepHours,
    totalIdleHours,
    totalMonthHours,
    fullMonthBaseHours,
    avgStudyHoursPerDay,
    avgBreakHoursPerDay,
    avgRoutineHoursPerDay,
    avgSleepHoursPerDay,
    avgIdleHoursPerDay,
    activeTrackingDays: activeDaysCount,
    lifeStudyRatio
  };
};

/**
 * Generate high-yield vector PDF document HTML for the Monthly 24-Hour Time Ledger
 */
export const generateMonthlyLedgerPdfHtml = (
  summary: MonthlyLedgerSummary,
  level: CALevel = getSelectedCALevel()
): string => {
  const levelLabel = CA_CURRICULUM_LEVELS[level]?.shortName || 'CA Final';
  const dateStamp = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const avgLabelSuffix = summary.isRunningMonth ? ` (${summary.daysCountedForAvg}d elapsed)` : '';

  const rowsHtml = summary.days.map((d, idx) => {
    const isWeekend = d.weekday === 'Sun' || d.weekday === 'Sat';
    const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const weekendBg = isWeekend ? '#f1f5f9' : rowBg;
    
    // Future day treatment (if day has not yet arrived and has no tracked study)
    if (d.isFuture && d.studyHours === 0 && d.breakHours === 0 && d.routineHours === 0 && d.sleepHours === 0) {
      return `
        <tr style="background-color: #fafbfc; color: #94a3b8; opacity: 0.65;">
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: center; font-size: 9px; color: #94a3b8; width: 32px;">
            ${d.dayNumber}
          </td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 10px; font-size: 9px; color: #94a3b8; text-align: left; white-space: nowrap;">
            ${d.formattedDate} <span style="font-size: 8px; color: #cbd5e1; font-weight: 600; text-transform: uppercase;">(${d.weekday})</span>
          </td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: center; font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
          <td style="border: 1px solid #e2e8f0; padding: 5px 8px; text-align: center; font-size: 8.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">—</td>
        </tr>
      `;
    }

    // Visual indicators
    const studyColor = d.studyHours >= 8 ? '#059669' : d.studyHours >= 5 ? '#2563eb' : d.studyHours > 0 ? '#0284c7' : '#94a3b8';
    const studyWeight = d.studyHours > 0 ? '700' : '400';
    const todayBadge = d.isToday ? ` <span style="display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 7px; font-weight: 800; padding: 1px 4px; border-radius: 3px; vertical-align: middle; margin-left: 3px;">TODAY</span>` : '';

    return `
      <tr style="background-color: ${d.isToday ? '#eff6ff' : weekendBg};">
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-size: 9.5px; font-weight: bold; color: #64748b; width: 32px;">
          ${d.dayNumber}
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 9.5px; font-weight: 600; color: #0f172a; text-align: left; white-space: nowrap;">
          ${d.formattedDate} <span style="font-size: 8px; color: #64748b; font-weight: 700; text-transform: uppercase;">(${d.weekday})</span>${todayBadge}
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: ${studyWeight}; color: ${studyColor}; background-color: #f0fdf4;">
          ${d.studyHours.toFixed(2)} <span style="font-size: 8px; color: #64748b;">hrs</span>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 500; color: #d97706; background-color: #fffbeb;">
          ${d.breakHours.toFixed(2)} <span style="font-size: 8px; color: #64748b;">hrs</span>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 500; color: #0891b2; background-color: #ecfeff;">
          ${d.routineHours.toFixed(2)} <span style="font-size: 8px; color: #64748b;">hrs</span>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 600; color: #7c3aed; background-color: #f5f3ff;">
          ${d.sleepHours.toFixed(2)} <span style="font-size: 8px; color: #64748b;">hrs</span>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: right; font-size: 10px; font-family: 'JetBrains Mono', monospace; font-weight: 500; color: #64748b; background-color: #f8fafc;">
          ${d.idleHours.toFixed(2)} <span style="font-size: 8px; color: #94a3b8;">hrs</span>
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #0f172a; width: 60px;">
          24.00
        </td>
        <td style="border: 1px solid #cbd5e1; padding: 6px 8px; text-align: center; font-size: 9px; font-family: 'JetBrains Mono', monospace; font-weight: 700; color: ${d.studyPercentage >= 35 ? '#059669' : '#475569'}; width: 55px;">
          ${d.studyPercentage}%
        </td>
      </tr>
    `;
  }).join('');

  return `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; background-color: #ffffff; padding: 4px;">
      
      <!-- Top Brand Header Bar -->
      <div style="background-color: #0b1528; color: #ffffff; padding: 12px 18px; border-radius: 6px 6px 0 0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="color: #fbbf24; font-size: 18px; font-weight: 900; letter-spacing: -0.01em; line-height: 1.1;">practACE</div>
          <div style="color: #cbd5e1; font-size: 10px; font-weight: 600; margin-top: 3px;">${levelLabel} Academic Ledger · 24-Hour Time Audit</div>
        </div>
        <div style="text-align: right; background-color: #050b14; padding: 6px 14px; border-radius: 4px; border: 1px solid #1e293b;">
          <div style="color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; font-family: 'JetBrains Mono', monospace;">Monthly Time Report</div>
          <div style="color: #fbbf24; font-size: 10px; font-weight: 700; margin-top: 2px;">${summary.monthName}</div>
        </div>
      </div>
      <div style="height: 3.5px; background-color: #d97706; margin-bottom: 20px;"></div>

      <!-- Document Title & Meta -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 10px;">
        <div>
          <h1 style="font-size: 16pt; font-weight: 900; color: #0f172a; margin: 0 0 4px 0; border: none; padding: 0;">DAY-WISE 24-HOUR TIME AUDIT REPORT</h1>
          <p style="font-size: 10pt; color: #475569; margin: 0; font-weight: 500;">
            Comprehensive Breakdown of Study, Desk Break, Routine, Sleep & Idle Time (Unit: Hours)
          </p>
        </div>
        <div style="text-align: right; font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #64748b;">
          <div>Audit Month: <strong>${summary.monthName}</strong></div>
          <div>Generated: <strong>${dateStamp}</strong></div>
          <div>Tracking Active: <strong>${summary.activeTrackingDays} / ${summary.daysInMonth} Days</strong></div>
        </div>
      </div>

      <!-- Executive KPI Metric Cards (Hours Breakdown) -->
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 22px;">
        
        <!-- Card 1: Study Time -->
        <div style="background: #f0fdf4; border: 1.5px solid #bbf7d0; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 8px; text-transform: uppercase; color: #166534; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">🎯 Study Time</div>
          <div style="font-size: 16px; font-weight: 900; color: #15803d; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">
            ${summary.totalStudyHours.toFixed(1)} <span style="font-size: 9px; font-weight: bold;">hrs</span>
          </div>
          <div style="font-size: 8.5px; color: #166534; font-weight: 600; margin-top: 4px;">
            Avg: <strong>${summary.avgStudyHoursPerDay.toFixed(1)}h/day</strong><span style="font-size: 7.5px; color: #64748b;">${avgLabelSuffix}</span>
          </div>
        </div>

        <!-- Card 2: Desk Break -->
        <div style="background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 8px; text-transform: uppercase; color: #92400e; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">☕ Desk Break</div>
          <div style="font-size: 16px; font-weight: 900; color: #b45309; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">
            ${summary.totalBreakHours.toFixed(1)} <span style="font-size: 9px; font-weight: bold;">hrs</span>
          </div>
          <div style="font-size: 8.5px; color: #92400e; font-weight: 600; margin-top: 4px;">
            Avg: <strong>${summary.avgBreakHoursPerDay.toFixed(1)}h/day</strong><span style="font-size: 7.5px; color: #64748b;">${avgLabelSuffix}</span>
          </div>
        </div>

        <!-- Card 3: Routines -->
        <div style="background: #ecfeff; border: 1.5px solid #a5f3fc; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 8px; text-transform: uppercase; color: #155e75; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">🏃 Routines</div>
          <div style="font-size: 16px; font-weight: 900; color: #0891b2; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">
            ${summary.totalRoutineHours.toFixed(1)} <span style="font-size: 9px; font-weight: bold;">hrs</span>
          </div>
          <div style="font-size: 8.5px; color: #155e75; font-weight: 600; margin-top: 4px;">
            Avg: <strong>${summary.avgRoutineHoursPerDay.toFixed(1)}h/day</strong><span style="font-size: 7.5px; color: #64748b;">${avgLabelSuffix}</span>
          </div>
        </div>

        <!-- Card 4: Sleep -->
        <div style="background: #f5f3ff; border: 1.5px solid #ddd6fe; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 8px; text-transform: uppercase; color: #5b21b6; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">🌙 Sleep Rest</div>
          <div style="font-size: 16px; font-weight: 900; color: #6d28d9; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">
            ${summary.totalSleepHours.toFixed(1)} <span style="font-size: 9px; font-weight: bold;">hrs</span>
          </div>
          <div style="font-size: 8.5px; color: #5b21b6; font-weight: 600; margin-top: 4px;">
            Avg: <strong>${summary.avgSleepHoursPerDay.toFixed(1)}h/day</strong><span style="font-size: 7.5px; color: #64748b;">${avgLabelSuffix}</span>
          </div>
        </div>

        <!-- Card 5: Idle Time -->
        <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; padding: 10px; text-align: center;">
          <div style="font-size: 8px; text-transform: uppercase; color: #475569; font-weight: 800; letter-spacing: 0.05em; margin-bottom: 4px;">⏳ Idle Time</div>
          <div style="font-size: 16px; font-weight: 900; color: #334155; font-family: 'JetBrains Mono', monospace; line-height: 1.2;">
            ${summary.totalIdleHours.toFixed(1)} <span style="font-size: 9px; font-weight: bold;">hrs</span>
          </div>
          <div style="font-size: 8.5px; color: #475569; font-weight: 600; margin-top: 4px;">
            Avg: <strong>${summary.avgIdleHoursPerDay.toFixed(1)}h/day</strong><span style="font-size: 7.5px; color: #64748b;">${avgLabelSuffix}</span>
          </div>
        </div>

      </div>

      <!-- Ratio Banner -->
      <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #1e3a8a; border-radius: 6px; padding: 8px 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px;">
        <div>
          <strong style="color: #0f172a;">LIFE-STUDY BALANCE RATIO:</strong>
          <span style="font-family: 'JetBrains Mono', monospace; font-weight: 800; color: #1e3a8a; margin-left: 6px; font-size: 11px;">
            ${summary.lifeStudyRatio.toFixed(2)}x
          </span>
          <span style="color: #64748b; margin-left: 6px;">(Total Rest [Break+Routine+Sleep] vs Study Hours)</span>
        </div>
        <div style="color: #475569; font-family: 'JetBrains Mono', monospace; font-weight: 700;">
          Allocation Base: <strong>${summary.totalMonthHours} hrs</strong> ${summary.isRunningMonth ? `(${summary.daysCountedForAvg} days elapsed × 24h)` : `(100.0%)`}
        </div>
      </div>

      <!-- Day Wise Metric Table -->
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1.5px solid #cbd5e1;">
        <thead>
          <tr style="background-color: #0b1528; color: #ffffff;">
            <th style="border: 1px solid #334155; padding: 7px 6px; text-align: center; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #fbbf24; width: 32px;">#</th>
            <th style="border: 1px solid #334155; padding: 7px 10px; text-align: left; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #ffffff;">Date & Day</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: right; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #86efac;">Study Time (hrs)</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: right; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #fde047;">Desk Break (hrs)</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: right; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #67e8f9;">Routines (hrs)</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: right; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #c4b5fd;">Sleep (hrs)</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: right; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #cbd5e1;">Idle Time (hrs)</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: center; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #ffffff; width: 60px;">Total (hrs)</th>
            <th style="border: 1px solid #334155; padding: 7px 8px; text-align: center; font-size: 9px; text-transform: uppercase; font-weight: 800; color: #94a3b8; width: 55px;">Study %</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot>
          <!-- Summary Row 1: Totals -->
          <tr style="background-color: #0b1528; color: #ffffff; font-weight: 800;">
            <td colspan="2" style="border: 1.5px solid #334155; padding: 8px 10px; font-size: 10px; text-transform: uppercase; text-align: right; color: #fbbf24; font-family: 'JetBrains Mono', monospace;">
              MONTH TOTALS:
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: right; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #86efac;">
              ${summary.totalStudyHours.toFixed(2)} hrs
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: right; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #fde047;">
              ${summary.totalBreakHours.toFixed(2)} hrs
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: right; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #67e8f9;">
              ${summary.totalRoutineHours.toFixed(2)} hrs
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: right; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #c4b5fd;">
              ${summary.totalSleepHours.toFixed(2)} hrs
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: right; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">
              ${summary.totalIdleHours.toFixed(2)} hrs
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: center; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: #ffffff;">
              ${summary.totalMonthHours.toFixed(2)}
            </td>
            <td style="border: 1.5px solid #334155; padding: 8px 8px; text-align: center; font-size: 10px; font-family: 'JetBrains Mono', monospace; color: #fbbf24;">
              ${((summary.totalStudyHours / summary.totalMonthHours) * 100).toFixed(1)}%
            </td>
          </tr>

          <!-- Summary Row 2: Daily Averages -->
          <tr style="background-color: #1e293b; color: #cbd5e1; font-weight: 700;">
            <td colspan="2" style="border: 1px solid #334155; padding: 6px 10px; font-size: 8.5px; text-transform: uppercase; text-align: right; color: #94a3b8; font-family: 'JetBrains Mono', monospace;">
              DAILY AVERAGES (${summary.isRunningMonth ? `${summary.daysCountedForAvg} DAYS ELAPSED TILL TODAY` : `${summary.daysInMonth} DAYS`}):
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #86efac;">
              ${summary.avgStudyHoursPerDay.toFixed(2)} h/d
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #fde047;">
              ${summary.avgBreakHoursPerDay.toFixed(2)} h/d
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #67e8f9;">
              ${summary.avgRoutineHoursPerDay.toFixed(2)} h/d
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #c4b5fd;">
              ${summary.avgSleepHoursPerDay.toFixed(2)} h/d
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: right; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #cbd5e1;">
              ${summary.avgIdleHoursPerDay.toFixed(2)} h/d
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: center; font-size: 9.5px; font-family: 'JetBrains Mono', monospace; color: #ffffff;">
              24.00 h/d
            </td>
            <td style="border: 1px solid #334155; padding: 6px 8px; text-align: center; font-size: 9px; font-family: 'JetBrains Mono', monospace; color: #94a3b8;">
              -
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Verification & Student Declaration Box -->
      <div style="margin-top: 24px; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 12px 16px; background-color: #f8fafc; font-size: 9px; color: #334155; line-height: 1.5;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed #cbd5e1; padding-bottom: 6px; margin-bottom: 8px;">
          <span style="font-weight: 800; text-transform: uppercase; color: #0f172a; font-family: 'JetBrains Mono', monospace;">
            ⚖️ ICAI ${levelLabel} Academic Audit Declaration
          </span>
          <span style="color: #64748b;">Official Revision & Focus Ledger Verification</span>
        </div>
        <p style="margin: 0 0 8px 0;">
          This document certifies the systematic 24-hour continuous time allocation of the candidate for the month of <strong>${summary.monthName}</strong>. All focus blocks, desk breaks, physiological routines, and sleep rest sessions are strictly verified and archived within the local and cloud ledger engine.
        </p>
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 14px; padding-top: 6px;">
          <div>
            <div style="border-bottom: 1px solid #94a3b8; width: 160px; height: 16px; margin-bottom: 4px;"></div>
            <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase;">Candidate Signature</div>
          </div>
          <div>
            <div style="border-bottom: 1px solid #94a3b8; width: 160px; height: 16px; margin-bottom: 4px;"></div>
            <div style="font-size: 8px; color: #64748b; font-weight: bold; text-transform: uppercase;">Faculty / Mentor Stamp</div>
          </div>
        </div>
      </div>

    </div>
  `;
};

/**
 * Triggers PDF export directly
 */
export const exportMonthlyLedgerPdf = (
  summary: MonthlyLedgerSummary,
  level: CALevel = getSelectedCALevel()
) => {
  const levelSlug = (CA_CURRICULUM_LEVELS[level]?.shortName || 'CA_Final').replace(/\s+/g, '_');
  const filename = `${levelSlug}_Time_Ledger_Report_${summary.monthKey}`;
  const html = generateMonthlyLedgerPdfHtml(summary, level);
  exportToPdfEngine(filename, html);
};
