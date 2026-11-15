import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, ChevronDown, Check, X } from 'lucide-react';
import { ModalPortal } from './ModalPortal';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const FULL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function toLocalDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDateStr(str?: string): { year: number; month: number; day: number } | null {
  if (!str || !/^\d{4}-\d{2}-\d{2}$/.test(str)) return null;
  const [y, m, d] = str.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { year: y, month: m - 1, day: d };
}

function formatReadableDate(str?: string, compact?: boolean): string {
  const parsed = parseDateStr(str);
  if (!parsed) return 'Select Date';
  const dayStr = String(parsed.day).padStart(2, '0');
  const monStr = SHORT_MONTHS[parsed.month] || '';
  if (compact) {
    return `${dayStr} ${monStr} '${String(parsed.year).slice(-2)}`;
  }
  return `${dayStr} ${monStr} ${parsed.year}`;
}

function format12HourDisplay(time24?: string): { main: string; ampm: string } {
  if (!time24 || !/^\d{1,2}:\d{2}/.test(time24)) {
    return { main: '--:--', ampm: '' };
  }
  const [hRaw, mRaw] = time24.split(':').map(Number);
  const h = isNaN(hRaw) ? 0 : hRaw % 24;
  const m = isNaN(mRaw) ? 0 : mRaw % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return {
    main: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
    ampm: `${h12}:${String(m).padStart(2, '0')} ${ampm}`
  };
}

export interface AttractiveDatePickerProps {
  value: string;
  onChange: (nextDateStr: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  compact?: boolean;
  accent?: 'cyan' | 'amber' | 'indigo' | 'emerald';
  className?: string;
  title?: string;
  allowClear?: boolean;
}

export const AttractiveDatePicker: React.FC<AttractiveDatePickerProps> = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  compact = false,
  accent = 'cyan',
  className = '',
  title,
  allowClear = false
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; openUpward: boolean }>({
    top: 0,
    left: 0,
    openUpward: false
  });

  const parsedValue = useMemo(() => parseDateStr(value), [value]);
  const todayObj = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => toLocalDateStr(todayObj), [todayObj]);

  const [viewYear, setViewYear] = useState<number>(() => parsedValue?.year ?? todayObj.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => parsedValue?.month ?? todayObj.getMonth());

  useEffect(() => {
    if (open) {
      const p = parseDateStr(value);
      if (p) {
        setViewYear(p.year);
        setViewMonth(p.month);
      }
    }
  }, [open, value]);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popWidth = 276;
    const popHeight = 324;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < popHeight + 12 && rect.top > popHeight;
    const top = openUpward ? Math.max(8, rect.top - popHeight - 6) : Math.min(window.innerHeight - popHeight - 8, rect.bottom + 6);
    const left = Math.max(8, Math.min(window.innerWidth - popWidth - 8, rect.left));
    setCoords({ top, left, openUpward });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open]);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
    // Convert Sunday=0..Saturday=6 into Monday=0..Sunday=6
    const startWeekday = (firstDayOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const cells: Array<{
      dateStr: string;
      dayNum: number;
      isCurrentMonth: boolean;
      isDisabled: boolean;
    }> = [];

    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = new Date(viewYear, viewMonth - 1, daysInPrevMonth - i);
      const dStr = toLocalDateStr(d);
      cells.push({
        dateStr: dStr,
        dayNum: d.getDate(),
        isCurrentMonth: false,
        isDisabled: Boolean((min && dStr < min) || (max && dStr > max))
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(viewYear, viewMonth, day);
      const dStr = toLocalDateStr(d);
      cells.push({
        dateStr: dStr,
        dayNum: day,
        isCurrentMonth: true,
        isDisabled: Boolean((min && dStr < min) || (max && dStr > max))
      });
    }

    const remaining = (7 - (cells.length % 7)) % 7;
    for (let day = 1; day <= remaining; day++) {
      const d = new Date(viewYear, viewMonth + 1, day);
      const dStr = toLocalDateStr(d);
      cells.push({
        dateStr: dStr,
        dayNum: day,
        isCurrentMonth: false,
        isDisabled: Boolean((min && dStr < min) || (max && dStr > max))
      });
    }

    return cells;
  }, [viewYear, viewMonth, min, max]);

  const accentStyles = {
    cyan: {
      icon: 'text-cyan-400',
      ring: 'focus:border-cyan-400/70 hover:border-cyan-400/45',
      activeDay: 'bg-gradient-to-br from-cyan-400 to-teal-400 text-slate-950 font-black shadow-md shadow-cyan-500/25',
      todayRing: 'border-cyan-400/60 text-cyan-300'
    },
    amber: {
      icon: 'text-amber-400',
      ring: 'focus:border-amber-400/70 hover:border-amber-400/45',
      activeDay: 'bg-gradient-to-br from-amber-400 to-orange-400 text-slate-950 font-black shadow-md shadow-amber-500/25',
      todayRing: 'border-amber-400/60 text-amber-300'
    },
    indigo: {
      icon: 'text-indigo-400',
      ring: 'focus:border-indigo-400/70 hover:border-indigo-400/45',
      activeDay: 'bg-gradient-to-br from-indigo-500 to-cyan-400 text-white font-black shadow-md shadow-indigo-500/25',
      todayRing: 'border-indigo-400/60 text-indigo-300'
    },
    emerald: {
      icon: 'text-emerald-400',
      ring: 'focus:border-emerald-400/70 hover:border-emerald-400/45',
      activeDay: 'bg-gradient-to-br from-emerald-400 to-teal-400 text-slate-950 font-black shadow-md shadow-emerald-500/25',
      todayRing: 'border-emerald-400/60 text-emerald-300'
    }
  }[accent];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        title={title || 'Select Calendar Date'}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={`group inline-flex items-center justify-between gap-1.5 bg-gradient-to-b from-[#13253a] to-[#0b1828] border border-white/15 ${accentStyles.ring} rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed tabular-nums ${className}`}
      >
        <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
          <Calendar className={`h-3.5 w-3.5 shrink-0 ${accentStyles.icon} transition-transform group-hover:scale-105`} />
          <span className="truncate">{formatReadableDate(value, compact)}</span>
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {open && (
        <ModalPortal>
          <div
            ref={popoverRef}
            onClick={(e) => e.stopPropagation()}
            style={{ top: coords.top, left: coords.left, width: 276 }}
            className="fixed z-[260] bg-[#0b192c]/98 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-[0_20px_50px_rgba(2,6,18,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] text-white select-none"
          >
            {/* Header: Month & Year Navigation */}
            <div className="flex items-center justify-between gap-1 pb-2.5 mb-2 border-b border-slate-800/90">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <div className="text-xs font-bold tracking-wide text-slate-100 font-sans">
                {FULL_MONTHS[viewMonth]} <span className="font-mono text-amber-300">{viewYear}</span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/70 text-slate-300 hover:text-white transition cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Weekday Header */}
            <div className="grid grid-cols-7 gap-1 mb-1 text-center">
              {WEEKDAYS.map((wd) => (
                <span key={wd} className="text-[10px] font-mono font-bold text-slate-400 py-0.5">
                  {wd}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 font-mono text-[11px] tabular-nums">
              {calendarDays.map((cell) => {
                const isSelected = cell.dateStr === value;
                const isToday = cell.dateStr === todayStr;
                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    disabled={cell.isDisabled}
                    onClick={() => {
                      if (cell.isDisabled) return;
                      onChange(cell.dateStr);
                      setOpen(false);
                    }}
                    className={`h-7 rounded-lg flex items-center justify-center transition cursor-pointer ${
                      cell.isDisabled
                        ? 'text-slate-700 cursor-not-allowed opacity-45'
                        : isSelected
                        ? accentStyles.activeDay
                        : isToday
                        ? `border ${accentStyles.todayRing} bg-slate-900/80 font-bold`
                        : cell.isCurrentMonth
                        ? 'text-slate-200 hover:bg-white/10 hover:text-white font-semibold'
                        : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
                    }`}
                  >
                    {cell.dayNum}
                  </button>
                );
              })}
            </div>

            {/* Quick Footer Shortcuts */}
            <div className="flex items-center justify-between gap-1.5 pt-2.5 mt-2 border-t border-slate-800/90 text-[10px] font-mono">
              <div className="flex items-center gap-1.5">
                {(!min || todayStr >= min) && (!max || todayStr <= max) && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(todayStr);
                      setOpen(false);
                    }}
                    className="px-2 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 font-bold transition cursor-pointer"
                  >
                    Today
                  </button>
                )}
                {(() => {
                  const tmrw = new Date();
                  tmrw.setDate(tmrw.getDate() + 1);
                  const tmrwStr = toLocalDateStr(tmrw);
                  if ((min && tmrwStr < min) || (max && tmrwStr > max)) return null;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        onChange(tmrwStr);
                        setOpen(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white font-semibold transition cursor-pointer"
                    >
                      Tomorrow
                    </button>
                  );
                })()}
              </div>

              {allowClear && value ? (
                <button
                  type="button"
                  onClick={() => {
                    onChange('');
                    setOpen(false);
                  }}
                  className="px-2 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold transition cursor-pointer inline-flex items-center gap-1"
                >
                  <X className="h-2.5 w-2.5" />
                  <span>Clear</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-2 py-1 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};

export interface AttractiveTimePickerProps {
  value: string;
  onChange: (nextTime24: string) => void;
  disabled?: boolean;
  compact?: boolean;
  accent?: 'cyan' | 'amber' | 'indigo' | 'emerald';
  className?: string;
  title?: string;
}

const HOURS_24 = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES_5 = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
const QUICK_TIMES = ['06:30', '09:00', '12:00', '14:00', '18:00', '21:00'];

export const AttractiveTimePicker: React.FC<AttractiveTimePickerProps> = ({
  value,
  onChange,
  disabled = false,
  compact = false,
  accent = 'cyan',
  className = '',
  title
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const [curHour, curMin] = useMemo(() => {
    if (!value || !/^\d{1,2}:\d{2}/.test(value)) return ['09', '00'];
    const [h, m] = value.split(':');
    return [String(Number(h) || 0).padStart(2, '0'), String(Number(m) || 0).padStart(2, '0')];
  }, [value]);

  const formatted = useMemo(() => format12HourDisplay(value), [value]);

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popWidth = 264;
    const popHeight = 310;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < popHeight + 12 && rect.top > popHeight;
    const top = openUpward ? Math.max(8, rect.top - popHeight - 6) : Math.min(window.innerHeight - popHeight - 8, rect.bottom + 6);
    const left = Math.max(8, Math.min(window.innerWidth - popWidth - 8, rect.left));
    setCoords({ top, left });
  };

  useEffect(() => {
    if (!open) return;
    updatePosition();
    const handleOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleScrollOrResize = () => updatePosition();
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open]);

  const accentStyles = {
    cyan: {
      icon: 'text-cyan-400',
      ring: 'focus:border-cyan-400/70 hover:border-cyan-400/45',
      activeItem: 'bg-cyan-500/25 border-cyan-400/60 text-cyan-200 font-black',
      subText: 'text-cyan-300/90'
    },
    amber: {
      icon: 'text-amber-400',
      ring: 'focus:border-amber-400/70 hover:border-amber-400/45',
      activeItem: 'bg-amber-500/25 border-amber-400/60 text-amber-200 font-black',
      subText: 'text-amber-300/90'
    },
    indigo: {
      icon: 'text-indigo-400',
      ring: 'focus:border-indigo-400/70 hover:border-indigo-400/45',
      activeItem: 'bg-indigo-500/25 border-indigo-400/60 text-indigo-200 font-black',
      subText: 'text-indigo-300/90'
    },
    emerald: {
      icon: 'text-emerald-400',
      ring: 'focus:border-emerald-400/70 hover:border-emerald-400/45',
      activeItem: 'bg-emerald-500/25 border-emerald-400/60 text-emerald-200 font-black',
      subText: 'text-emerald-300/90'
    }
  }[accent];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        title={title || 'Select Time'}
        onClick={(e) => {
          e.stopPropagation();
          if (!disabled) setOpen((prev) => !prev);
        }}
        className={`group inline-flex items-center justify-between gap-2 bg-gradient-to-b from-[#13253a] to-[#0b1828] border border-white/15 ${accentStyles.ring} rounded-xl px-2.5 py-1.5 text-xs font-mono font-bold text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed tabular-nums ${className}`}
      >
        <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
          <Clock className={`h-3.5 w-3.5 shrink-0 ${accentStyles.icon} transition-transform group-hover:scale-105`} />
          <span className="text-white font-black">{formatted.main}</span>
          {!compact && formatted.ampm && (
            <span className={`text-[10px] font-semibold ${accentStyles.subText} truncate`}>
              ({formatted.ampm})
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 shrink-0 transition-transform duration-150 ${
            open ? 'rotate-180 text-white' : ''
          }`}
        />
      </button>

      {open && (
        <ModalPortal>
          <div
            ref={popoverRef}
            onClick={(e) => e.stopPropagation()}
            style={{ top: coords.top, left: coords.left, width: 264 }}
            className="fixed z-[260] bg-[#0b192c]/98 backdrop-blur-xl border border-white/15 rounded-2xl p-3 shadow-[0_20px_50px_rgba(2,6,18,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] text-white select-none space-y-2.5"
          >
            {/* Header Display */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/90">
              <div className="flex items-center gap-1.5">
                <Clock className={`h-3.5 w-3.5 ${accentStyles.icon}`} />
                <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-slate-300">
                  Select Time
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700/80 text-xs font-mono font-black text-amber-300 tabular-nums">
                {formatted.main} · {formatted.ampm}
              </span>
            </div>

            {/* Dual Scroll Columns: Hours (00-23) & Minutes (00-55) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9.5px] font-mono uppercase font-bold text-slate-400 block text-center">
                  Hour (24h)
                </span>
                <div className="h-40 overflow-y-auto pr-1 space-y-1 bg-slate-950/80 border border-slate-800/90 rounded-xl p-1.5">
                  {HOURS_24.map((h) => {
                    const isSelected = h === curHour;
                    const hNum = Number(h);
                    const label12 = hNum === 0 ? '12 AM' : hNum < 12 ? `${hNum} AM` : hNum === 12 ? '12 PM' : `${hNum - 12} PM`;
                    return (
                      <button
                        key={h}
                        type="button"
                        onClick={() => onChange(`${h}:${curMin}`)}
                        className={`w-full px-2 py-1 rounded-lg text-[11px] font-mono flex items-center justify-between border transition cursor-pointer tabular-nums ${
                          isSelected
                            ? accentStyles.activeItem
                            : 'border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="font-bold">{h}:00</span>
                        <span className="text-[9.5px] text-slate-400">{label12}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9.5px] font-mono uppercase font-bold text-slate-400 block text-center">
                  Minute
                </span>
                <div className="h-40 overflow-y-auto pr-1 space-y-1 bg-slate-950/80 border border-slate-800/90 rounded-xl p-1.5">
                  {MINUTES_5.map((m) => {
                    const isSelected = m === curMin;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          onChange(`${curHour}:${m}`);
                          setOpen(false);
                        }}
                        className={`w-full px-2.5 py-1 rounded-lg text-[11px] font-mono flex items-center justify-between border transition cursor-pointer tabular-nums ${
                          isSelected
                            ? accentStyles.activeItem
                            : 'border-transparent text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>:{m}m</span>
                        {isSelected && <Check className="h-3 w-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Presets Row */}
            <div className="pt-2 border-t border-slate-800/90 space-y-1.5">
              <div className="flex items-center justify-between text-[9.5px] font-mono text-slate-400">
                <span>Quick Presets</span>
                <button
                  type="button"
                  onClick={() => {
                    const now = new Date();
                    const hh = String(now.getHours()).padStart(2, '0');
                    const mm = String(Math.round(now.getMinutes() / 5) * 5 % 60).padStart(2, '0');
                    onChange(`${hh}:${mm}`);
                    setOpen(false);
                  }}
                  className="text-cyan-300 hover:text-cyan-200 font-bold cursor-pointer"
                >
                  Set to Now
                </button>
              </div>
              <div className="grid grid-cols-6 gap-1">
                {QUICK_TIMES.map((qt) => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => {
                      onChange(qt);
                      setOpen(false);
                    }}
                    className={`py-1 rounded-md text-[10px] font-mono font-bold border transition cursor-pointer tabular-nums ${
                      value === qt
                        ? accentStyles.activeItem
                        : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/70 text-slate-300 hover:text-white'
                    }`}
                  >
                    {qt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </>
  );
};
