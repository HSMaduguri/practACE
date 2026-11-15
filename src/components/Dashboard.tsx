/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  TrendingUp, 
  Award, 
  Trash2, 
  Sparkles, 
  Target, 
  Clock, 
  AlertTriangle,
  Star,
  Sun,
  Moon,
  Printer,
  Plus,
  X,
  Loader2,
  Users,
  Calendar,
  ChevronRight,
  BookOpen,
  Info,
  ListTodo,
  Check,
  Filter,
  ArrowUpDown,
  Layers,
  PieChart as PieChartIcon,
  SlidersHorizontal,
  Minus,
  Edit3,
  Zap,
  CheckCheck,
  RefreshCw
} from 'lucide-react';
import { SubjectId, PracticeAttempt, BookmarkedSection, FocusSession } from '../types';
import { CALevel, CA_CURRICULUM_LEVELS, getSelectedCALevel, setSelectedCALevel, getLevelSubjectIds } from '../data/curriculumLevels';
import { getLevelScopedKey } from '../utils/levelStorage';
import { formatStaticDuration } from '../utils/timeFormat';
import { syncTaskCompletionAcrossAllLinks, normalizeKey } from '../utils/taskCompletionSync';
import { SUBJECTS_METADATA, CHAPTER_SUMMARIES } from '../data/syllabus';
import { SUBJECT_CHAPTERS } from './RevisionPlanner';
import { User } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import BrandMark from './BrandMark';
const logoImg = '/assets/aistudio/practCA_Logo_photo_e935f99f.png';
const brandMarkImg = '/assets/aistudio/practCA_Logo_3008a4f9.png';
import PrintPreview from './PrintPreview';
import StudyStreak from './StudyStreak';
import { ModalPortal } from './ModalPortal';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { ConfettiOverlay } from './ConfettiOverlay';
import { autoCompleteFinalExamMilestonesAfter5PM } from '../utils/taskCompletionSync';

interface DashboardProps {
  practiceAttempts: PracticeAttempt[];
  onClearHistory: () => void;
  onLoadDemoData: () => void;
  bookmarkedSections: BookmarkedSection[];
  onToggleBookmark: (section: BookmarkedSection) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser: User | null;
  focusSessions: FocusSession[];
  dailyGoalMinutes: number;
  onUpdateDailyGoal?: (minutes: number) => void;
  setView?: (view: 'dashboard' | 'subjects' | 'tasks' | 'revision' | 'pastpapers' | 'practice' | 'pomodora' | 'profile' | 'peers') => void;
  pendingPeersCount?: number;
  sleepSessions?: { id: string; startTime: string; endTime: string; duration: number; feeling?: string }[];
  examDate?: string;
  onStartQuickStudy?: (
    subjectCode: SubjectId,
    title: string,
    durationMinutes: number,
    chapterName: string,
    relevance: 'Final Revision'
  ) => void;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const attemptInfo = payload[0].payload;
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-1.5 text-xs text-slate-300 font-sans max-w-sm">
        <div className="flex justify-between items-center gap-3 text-[10px] font-mono text-slate-400 border-b border-slate-900 pb-1.5">
          <span>Attempt {attemptInfo.name}</span>
          <span>{attemptInfo.time}</span>
        </div>
        {attemptInfo.chapter && (
          <p className="font-semibold text-slate-200 text-[11px] leading-relaxed">
            Chapter: <span className="text-white">{attemptInfo.chapter}</span>
          </p>
        )}
        <div className="pt-1.5 space-y-1">
          {payload.map((p: any) => {
            if (p.value === undefined) return null;
            return (
              <div key={p.name} className="flex justify-between items-center gap-2">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: p.stroke }} />
                  {p.name}:
                </span>
                <span className="font-bold font-mono" style={{ color: p.stroke }}>
                  {p.value}% Accuracy
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

const FocusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatHoursMins = (mins: number) => {
      return formatStaticDuration(mins, 'minutes');
    };
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[200px]">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1">{data.name}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center gap-4 text-cyan-400">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#00f3ff]"></span>
              ✏️ Study Focus:
            </span>
            <span className="font-bold font-mono text-slate-100">{formatHoursMins(data.focusMinutes)}</span>
          </div>
          <p className="text-slate-500 text-[9px] pl-4 -mt-1 font-mono">
            {data.sessionsCount} active focus block{data.sessionsCount !== 1 ? 's' : ''}
          </p>
          
          <div className="flex justify-between items-center gap-4 text-emerald-400 pt-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              ☕ Break & Routines:
            </span>
            <span className="font-bold font-mono text-slate-100">{formatHoursMins(data.breakRoutineMinutes)}</span>
          </div>
          <p className="text-slate-500 text-[9px] pl-4 -mt-1 font-mono">
            {data.breakSessionsCount} break/routine session{data.breakSessionsCount !== 1 ? 's' : ''}
          </p>

          <div className="flex justify-between items-center gap-4 text-indigo-400 pt-0.5 border-t border-slate-900">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#6366f1]"></span>
              💤 Rest & Sleep:
            </span>
            <span className="font-bold font-mono text-slate-100">{formatHoursMins(data.sleepMinutes)}</span>
          </div>

          <div className="flex justify-between items-center gap-4 text-slate-400 pt-0.5">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#475569]"></span>
              ⏳ Idle & Unallocated:
            </span>
            <span className="font-bold font-mono text-slate-100">{formatHoursMins(data.idleMinutes)}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const MentalHealthTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const info = payload[0].payload;
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-1 text-xs text-slate-300 font-sans min-w-[150px]">
        <div className="flex justify-between items-center gap-2 border-b border-slate-900 pb-1 text-[10px] font-mono text-slate-400">
          <span>{info.date}</span>
          <span className="text-cav-accent uppercase font-black">{info.mood}</span>
        </div>
        <div className="pt-1.5 space-y-1 font-mono text-[11px]">
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-400">⚡ Energy:</span>
            <span className="font-bold text-amber-400">{info.energy}/10</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-400">🤯 Stress:</span>
            <span className="font-bold text-rose-400">{info.stress}/10</span>
          </div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-slate-400">🎯 Focus:</span>
            <span className="font-bold text-cyan-400">{info.focus}/10</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const SleepTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-1 text-xs text-slate-300 font-sans">
        <p className="font-extrabold text-white font-mono">{data.name}</p>
        <p className="text-violet-400 font-semibold flex items-center gap-1.5">
          🛌 Sleep Duration: <span className="font-bold text-white">{data.hours} hrs</span>
        </p>
        <p className="text-slate-500 text-[10px] font-mono">Sessions logged: {data.sessionsCount}</p>
        {data.feelingsText && (
          <p className="text-amber-400 text-[10.5px] border-t border-slate-900 pt-1 mt-1 leading-relaxed">
            😊 Wake-up feeling: <span className="font-medium text-slate-300 italic">"{data.feelingsText}"</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const ChapterRevisionTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatHrs = (h: number) => {
      if (!h || h <= 0) return '0.0h (0m)';
      const totalMins = Math.round(h * 60);
      const hrs = Math.floor(totalMins / 60);
      const mins = totalMins % 60;
      if (hrs > 0 && mins > 0) return `${h.toFixed(1)}h (${hrs}h ${mins}m)`;
      if (hrs > 0) return `${h.toFixed(1)}h (${hrs}h)`;
      return `${h.toFixed(1)}h (${mins}m)`;
    };

    return (
      <div className="p-3.5 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl space-y-2.5 text-xs text-slate-300 font-sans min-w-[240px] max-w-xs backdrop-blur-md">
        <div className="border-b border-slate-800/80 pb-1.5 space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {data.subjectId} Chapter
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {data.sessionsCount || 0} session{(data.sessionsCount || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="font-bold text-white text-xs leading-snug line-clamp-2 pt-1">{data.chapterName}</p>
        </div>

        <div className="space-y-1.5 text-[11px] font-medium">
          <div className="flex items-center justify-between text-sky-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              1st Read / Initial:
            </span>
            <span className="font-bold font-mono text-white">{formatHrs(data.read1)}</span>
          </div>

          <div className="flex items-center justify-between text-purple-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              Revision 1:
            </span>
            <span className="font-bold font-mono text-white">{formatHrs(data.rev1)}</span>
          </div>

          <div className="flex items-center justify-between text-amber-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Revision 2 & 3:
            </span>
            <span className="font-bold font-mono text-white">{formatHrs(data.rev23)}</span>
          </div>

          <div className="flex items-center justify-between text-pink-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400"></span>
              Final 1.5D Boost:
            </span>
            <span className="font-bold font-mono text-white">{formatHrs(data.finalRev)}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between font-mono">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Total Revision Time:</span>
          <span className="text-sm font-black text-[#00f3ff]">{formatHrs(data.totalHours)}</span>
        </div>
      </div>
    );
  }
  return null;
};

const SubjectFocusTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = (data.minutes / 60).toFixed(1);
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[180px]">
        <p className="font-bold text-slate-200 border-b border-slate-850 pb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.fullName} ({data.subjectId})</span>
        </p>
        <div className="space-y-1 font-mono text-[11px]">
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">Focus Duration:</span>
            <span className="font-bold text-white">{data.minutes} mins</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">Equivalent Hours:</span>
            <span className="font-bold text-cyan-400">{hours} hrs</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const WeeklySubjectStudyProgressTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.name === 'No study yet') {
      return (
        <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl text-xs text-slate-400 font-sans">
          No study sessions logged for the current week yet.
        </div>
      );
    }
    const color = data.color || '#38bdf8';
    return (
      <div className="p-3.5 bg-slate-950/95 border border-slate-800 rounded-2xl shadow-2xl space-y-2 text-xs text-slate-300 font-sans min-w-[220px] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: color }} />
            <span className="font-bold text-white font-display text-sm">{data.name}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold" style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}>
            {data.percentageShare}% Share
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium truncate">
          {data.fullName}
        </p>
        <div className="space-y-1.5 font-mono text-[11px] pt-1">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400">Study Duration:</span>
            <span className="font-bold text-white font-sans">{data.hours} hrs <span className="text-[10px] text-slate-400 font-mono">({data.minutes}m)</span></span>
          </div>
          {data.targetHours !== undefined && (
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Weekly Target:</span>
              <span className="font-bold text-amber-400 font-sans">{data.targetHours} hrs</span>
            </div>
          )}
          {data.targetProgress !== undefined && (
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Target Progress:</span>
              <span className={`font-bold ${data.targetProgress >= 100 ? 'text-emerald-400' : data.targetProgress >= 50 ? 'text-cyan-400' : 'text-slate-400'}`}>
                {data.targetProgress}%
              </span>
            </div>
          )}
          {data.sessionsCount !== undefined && (
            <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-900">
              <span className="text-slate-400">Logged Sessions:</span>
              <span className="font-bold text-white font-sans">{data.sessionsCount} session{data.sessionsCount !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const SubjectPerformanceTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[200px]">
        <p className="font-bold text-slate-200 border-b border-slate-850 pb-1 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.fullName} ({data.subjectId})</span>
        </p>
        <div className="space-y-1 font-mono text-[11px]">
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">Total MCQ Attempts:</span>
            <span className="font-bold text-white">{data.totalAttempts} questions</span>
          </p>
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">Correct Submissions:</span>
            <span className="font-bold text-emerald-400">{data.correctAttempts}</span>
          </p>
          <p className="flex justify-between gap-4 pt-1 border-t border-slate-900">
            <span className="text-slate-400">Diagnostic Accuracy:</span>
            <span className={`font-bold ${data.accuracy >= 75 ? 'text-emerald-400' : data.accuracy >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
              {data.accuracy}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const TimeOfDayTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatMinutes = (mins: number) => {
      return formatStaticDuration(mins, 'minutes');
    };
    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[190px]">
        <p className="font-bold text-slate-200 border-b border-slate-850 pb-1 flex items-center gap-2">
          <span>{data.icon}</span>
          <span>{data.label}</span>
        </p>
        <div className="space-y-1 font-mono text-[11px]">
          <p className="flex justify-between gap-4">
            <span className="text-slate-400">Total Study Time:</span>
            <span className="font-bold text-white">{formatMinutes(data.minutes)}</span>
          </p>
          <p className="flex justify-between gap-4 pt-1 border-t border-slate-900">
            <span className="text-slate-400">Daytime Share:</span>
            <span className="font-bold text-cyan-400">{data.percent}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const StudyPaceTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatMinutes = (mins: number) => {
      return formatStaticDuration(mins, 'minutes');
    };

    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[200px]">
        <p className="font-bold text-slate-200 border-b border-slate-850 pb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-[#00f3ff] flex justify-between gap-4 font-sans">
            <span>✏️ Study Time:</span>
            <span className="font-bold font-mono text-slate-100">{formatMinutes(data.minutes)}</span>
          </p>
          <div className="pt-1 border-t border-slate-900 flex justify-between items-center gap-2">
            <span className="text-[10px] text-slate-400">Pace Status:</span>
            {data.status === 'Regular' ? (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Included
              </span>
            ) : data.status === 'Complete Day Off' ? (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Day Off (Excluded)
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Low Day (Excluded)
              </span>
            )}
          </div>
          {data.flatCleanAvg > 0 && (
            <p className="text-slate-400 text-[10px] flex justify-between gap-4 pt-1">
              <span>🎯 Target Pace:</span>
              <span className="font-mono text-slate-300">{formatMinutes(data.flatCleanAvg)}</span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const TrendAnalysisTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatMinutes = (mins: number) => {
      return formatStaticDuration(mins, 'minutes');
    };

    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[220px]">
        <p className="font-bold text-slate-200 border-b border-slate-850 pb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-[#00f3ff] flex justify-between gap-4">
            <span>✏️ Daily Study:</span>
            <span className="font-bold font-mono text-slate-100">{formatMinutes(data.minutes)}</span>
          </p>
          <p className="text-[#fb923c] flex justify-between gap-4">
            <span>📈 5-Day SMA Pace:</span>
            <span className="font-bold font-mono text-slate-100">{formatMinutes(data.movingAvg)}</span>
          </p>
          <div className="pt-1 border-t border-slate-900 flex justify-between items-center gap-2">
            <span className="text-[10px] text-slate-400">Velocity Status:</span>
            {data.minutes >= data.movingAvg ? (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Above Average
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Below Average
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const WeeklyConsistencyTooltip = ({ active, payload, averageMinutes }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatMinutes = (mins: number) => {
      return formatStaticDuration(mins, 'minutes');
    };

    const diff = data.minutes - (averageMinutes || 0);

    return (
      <div className="p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-xl space-y-2 text-xs text-slate-300 font-sans min-w-[220px]">
        <p className="font-bold text-slate-200 border-b border-slate-850 pb-1">{data.name}</p>
        <div className="space-y-1">
          <p className="text-[#00f3ff] flex justify-between gap-4">
            <span>✏️ Study Minutes:</span>
            <span className="font-bold font-mono text-slate-100">{formatMinutes(data.minutes)}</span>
          </p>
          {averageMinutes > 0 && (
            <p className="flex justify-between gap-4 text-[10px] pt-1 border-t border-slate-900">
              <span className="text-slate-400">vs Active Average:</span>
              <span className={`font-bold font-mono ${diff >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {diff >= 0 ? '+' : ''}{formatMinutes(diff)}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 100, 
      damping: 15,
      mass: 0.8
    } 
  }
};

export default function Dashboard({ 
  practiceAttempts, 
  onClearHistory, 
  onLoadDemoData, 
  bookmarkedSections, 
  onToggleBookmark,
  darkMode,
  onToggleDarkMode,
  currentUser,
  focusSessions,
  dailyGoalMinutes,
  onUpdateDailyGoal,
  setView,
  pendingPeersCount = 0,
  sleepSessions = [],
  examDate,
  onStartQuickStudy
}: DashboardProps) {
  const handleTriggerQuickStudy = useCallback(() => {
    const subjects: SubjectId[] = ['FR', 'AFM', 'Audit', 'DT', 'IDT', 'IBS'];
    const pool: { subjectCode: SubjectId; chapterName: string; subTopicTitle: string }[] = [];

    subjects.forEach((subId) => {
      const summaries = CHAPTER_SUMMARIES[subId] || [];
      summaries.forEach((chap) => {
        if (Array.isArray(chap.keyPrinciples) && chap.keyPrinciples.length > 0) {
          chap.keyPrinciples.forEach((kp) => {
            if (kp?.title) {
              pool.push({
                subjectCode: subId,
                chapterName: chap.chapterName,
                subTopicTitle: kp.title,
              });
            }
          });
        }
      });
    });

    if (pool.length === 0) {
      subjects.forEach((subId) => {
        const chapters = SUBJECTS_METADATA[subId]?.chapters || [];
        chapters.forEach((chapName) => {
          pool.push({
            subjectCode: subId,
            chapterName: chapName,
            subTopicTitle: chapName,
          });
        });
      });
    }

    const picked = pool[Math.floor(Math.random() * pool.length)] || {
      subjectCode: 'FR' as SubjectId,
      chapterName: 'Ind AS 115 Revenue',
      subTopicTitle: 'Five-Step Revenue Recognition Model',
    };

    const durationMinutes = 10;
    const taskTitle = `Quick Study (10m): ${picked.subTopicTitle}`;
    const stableId = `active_focus_task_${taskTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const normKey = normalizeKey(taskTitle);

    try {
      const rawDurations = localStorage.getItem('practca_task_target_durations');
      const parsedDurations = rawDurations ? JSON.parse(rawDurations) : {};
      parsedDurations[taskTitle] = durationMinutes;
      if (normKey) parsedDurations[normKey] = durationMinutes;
      parsedDurations[stableId] = durationMinutes;
      localStorage.setItem('practca_task_target_durations', JSON.stringify(parsedDurations));
      localStorage.setItem('practca_focus_intensity_mode', 'deep_work');
    } catch (e) {}

    if (onStartQuickStudy) {
      onStartQuickStudy(
        picked.subjectCode,
        taskTitle,
        durationMinutes,
        picked.chapterName,
        'Final Revision'
      );
    } else {
      const todayStr = new Date().toISOString().split('T')[0];
      const nowIso = new Date().toISOString();
      const newTask = {
        subjectCode: picked.subjectCode,
        title: taskTitle,
        chapterName: picked.chapterName,
        relevance: 'Final Revision' as const,
        dueDate: todayStr,
        targetDurationMinutes: durationMinutes,
      };
      try {
        localStorage.setItem('practca_active_focus_task', JSON.stringify(newTask));
        localStorage.setItem('practca_pomo_mode', 'study');
        localStorage.setItem('practca_pomo_start', nowIso);
        localStorage.setItem('practca_pomo_subject', picked.subjectCode);
        localStorage.setItem('practca_pomo_notes', taskTitle);
        localStorage.removeItem('practca_pomo_paused_state');
        window.dispatchEvent(new Event('practca_pomo_mode_change'));
      } catch (e) {}
      setView?.('pomodora');
    }
  }, [onStartQuickStudy, setView]);
  const [dashboardSubTab, setDashboardSubTab] = useState<'overview' | 'roadmap'>('overview');
  const [subjectStats, setSubjectStats] = useState<Record<string, { total: number; correct: number; accuracy: number }>>({});
  const [overallStats, setOverallStats] = useState({ total: 0, correct: 0, accuracy: 0 });
  const [chapterStats, setChapterStats] = useState<Record<string, { total: number; correct: number; accuracy: number; subject: SubjectId }>>({});
  const [timelineTrend, setTimelineTrend] = useState<{ date: string; accuracy: number }[]>([]);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [hiddenSubjects, setHiddenSubjects] = useState<Record<string, boolean>>({});
  const [focusChartMetric, setFocusChartMetric] = useState<'work' | 'break' | 'both'>('work');
  const [selectedRevisionSubject, setSelectedRevisionSubject] = useState<'All' | SubjectId>('FR');
  const [chapterSortMode, setChapterSortMode] = useState<'hours' | 'order'>('hours');
  const [filterOnlyWithHours, setFilterOnlyWithHours] = useState<boolean>(false);
  const [paceTimeframe, setPaceTimeframe] = useState<'current_week' | 'last_week' | 'current_month' | 'last_30_days' | 'last_month'>('last_30_days');

  // Subject-specific hourly targets state (allowing users to set custom targets per subject)
  const DEFAULT_SUBJECT_TARGETS: Record<SubjectId, number> = useMemo(() => ({
    FR: 120,
    AFM: 100,
    Audit: 80,
    DT: 120,
    IDT: 100,
    IBS: 80,
    AdvAcc: 110,
    CorpLaw: 80,
    Tax: 110,
    Cost: 90,
    AuditInter: 80,
    FMSM: 90,
    Accounts: 100,
    Law: 80,
    MathStats: 90,
    Econ: 70,
    CMAFoundLaw: 80,
    CMAFoundAcc: 100,
    CMAFoundMath: 85,
    CMAFoundEcon: 75,
    CMAInterLaw: 85,
    CMAInterFA: 110,
    CMAInterTax: 110,
    CMAInterCost: 100,
    CMAInterOMSM: 85,
    CMAInterCAA: 95,
    CMAInterFMDA: 95,
    CMAInterMA: 95,
    CMAFinalLaw: 85,
    CMAFinalSFM: 105,
    CMAFinalDT: 115,
    CMAFinalSCM: 105,
    CMAFinalCMA: 90,
    CMAFinalCFR: 115,
    CMAFinalIDT: 100,
    CMAFinalSPBV: 95,
  }), []);

  const [subjectHourlyTargets, setSubjectHourlyTargets] = useState<Record<SubjectId, number>>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_subject_hourly_targets')) || localStorage.getItem('practca_subject_hourly_targets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_SUBJECT_TARGETS,
            ...parsed
          };
        }
      }
    } catch (e) {
      // ignore
    }
    return { ...DEFAULT_SUBJECT_TARGETS };
  });

  const [subjectTargetTimeframe, setSubjectTargetTimeframe] = useState<'all_time' | 'current_week' | 'current_month'>('all_time');

  // Real-time synchronization with localStorage pomo logs & subject hourly targets
  const [pomoLogsVersion, setPomoLogsVersion] = useState(0);

  useEffect(() => {
    const handleLogsUpdate = () => setPomoLogsVersion(v => v + 1);
    const handleSubjectTargetsSync = () => {
      try {
        const stored = localStorage.getItem(getLevelScopedKey('practca_subject_hourly_targets')) || localStorage.getItem('practca_subject_hourly_targets');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            setSubjectHourlyTargets({
              ...DEFAULT_SUBJECT_TARGETS,
              ...parsed
            });
          }
        }
      } catch (e) {}
    };
    window.addEventListener('practca_pomo_logs_update', handleLogsUpdate);
    window.addEventListener('practca_subject_targets_updated', handleSubjectTargetsSync);
    window.addEventListener('practca_level_changed', handleSubjectTargetsSync);
    window.addEventListener('storage', handleLogsUpdate);
    window.addEventListener('storage', handleSubjectTargetsSync);
    return () => {
      window.removeEventListener('practca_pomo_logs_update', handleLogsUpdate);
      window.removeEventListener('practca_subject_targets_updated', handleSubjectTargetsSync);
      window.removeEventListener('practca_level_changed', handleSubjectTargetsSync);
      window.removeEventListener('storage', handleLogsUpdate);
      window.removeEventListener('storage', handleSubjectTargetsSync);
    };
  }, []);

  // Read-only Schedule & Curriculum Level Presentation State
  const [caLevel, setCaLevel] = useState<CALevel>(() => getSelectedCALevel());
  const levelSubjectIds = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);

  useEffect(() => {
    if (selectedRevisionSubject !== 'All' && !levelSubjectIds.includes(selectedRevisionSubject as SubjectId)) {
      setSelectedRevisionSubject(levelSubjectIds[0] || 'All');
    }
  }, [levelSubjectIds, selectedRevisionSubject]);

  const [dashboardTasks, setDashboardTasks] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_local_tasks')) || localStorage.getItem(getLevelScopedKey('cavault_local_tasks'));
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem(getLevelScopedKey('practca_local_tasks')) || localStorage.getItem(getLevelScopedKey('cavault_local_tasks'));
        const parsed = stored ? JSON.parse(stored) : [];
        if (Array.isArray(parsed)) {
          setDashboardTasks(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
        }
      } catch (e) {}
    };
    const handleLevel = (e: any) => {
      if (e.detail?.level) setCaLevel(prev => prev === e.detail.level ? prev : e.detail.level);
      handleUpdate();
      setPomoLogsVersion(v => v + 1);
    };
    window.addEventListener('practca_tasks_updated', handleUpdate);
    window.addEventListener('practca_target_system_sync', handleUpdate);
    window.addEventListener('practca_level_changed', handleLevel);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('practca_tasks_updated', handleUpdate);
      window.removeEventListener('practca_target_system_sync', handleUpdate);
      window.removeEventListener('practca_level_changed', handleLevel);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const overdueDashboardTasks = useMemo(() => {
    return dashboardTasks.filter((t: any) => {
      const taskDate = (t.due || t.taskDate || '').split('T')[0];
      return taskDate && taskDate < todayStr && t.status === 'needsAction' && !t.completed;
    });
  }, [dashboardTasks, todayStr]);

  const todayDashboardTasks = useMemo(() => {
    return dashboardTasks.filter((t: any) => {
      const taskDate = (t.due || t.taskDate || '').split('T')[0];
      return taskDate === todayStr;
    });
  }, [dashboardTasks, todayStr]);

  const todayPendingTasks = useMemo(() => {
    return todayDashboardTasks.filter((t: any) => t.status === 'needsAction' && !t.completed);
  }, [todayDashboardTasks]);

  const todayCompletedTasksCount = useMemo(() => {
    return todayDashboardTasks.filter((t: any) => t.status === 'completed' || Boolean(t.completed)).length;
  }, [todayDashboardTasks]);

  const rechartsTrendData = useMemo(() => {
    if (practiceAttempts.length === 0) return [];

    const chronologicalAttempts = [...practiceAttempts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const subjectRunningStats: Record<string, { total: number; correct: number }> = {};
    levelSubjectIds.forEach(id => {
      subjectRunningStats[id] = { total: 0, correct: 0 };
    });

    return chronologicalAttempts.map((attempt, index) => {
      const subId = attempt.subjectId;
      if (subjectRunningStats[subId] !== undefined) {
        subjectRunningStats[subId].total += 1;
        if (attempt.isCorrect) {
          subjectRunningStats[subId].correct += 1;
        }
      }

      const dateObj = new Date(attempt.timestamp);
      const timeLabel = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + 
        ' ' + dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });

      const dataPoint: any = {
        name: `#${index + 1}`,
        time: timeLabel,
        chapter: attempt.chapterName,
        subjectId: attempt.subjectId
      };

      Object.keys(subjectRunningStats).forEach(key => {
        const stats = subjectRunningStats[key];
        if (stats.total > 0) {
          dataPoint[key] = Math.round((stats.correct / stats.total) * 100);
        }
      });

      return dataPoint;
    });
  }, [practiceAttempts, levelSubjectIds]);

  const last7DaysFocusData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    let ledgerLogs: any[] = [];
    try {
      const cached = localStorage.getItem(getLevelScopedKey('practca_pomo_logs'));
      if (cached) {
        ledgerLogs = JSON.parse(cached);
      }
    } catch (e) {
      console.error("Error reading practca_pomo_logs from localStorage", e);
    }

    const getYYYYMMDD = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return days.map(date => {
      const dateStr = date.toDateString();
      const dateStrYYYYMMDD = getYYYYMMDD(date);
      const label = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      
      // Filter Ledger Logs for this specific day
      const dayLedger = ledgerLogs.filter(log => {
        const lDate = log.date || (log.startTime ? getYYYYMMDD(new Date(log.startTime)) : '');
        return lDate === dateStrYYYYMMDD;
      });

      let focusMins = 0;
      let breakRoutineMins = 0;
      let sleepMins = 0;

      // Filter focusSessions (synced) as fallback/reference
      const daySessions = (focusSessions || []).filter(s => {
        if (!s.timestamp) return false;
        return new Date(s.timestamp).toDateString() === dateStr;
      });
      const workSessions = daySessions.filter(s => !s.sessionType || s.sessionType === 'work');
      const breakSessions = daySessions.filter(s => s.sessionType === 'break');
      const routineSessions = daySessions.filter(s => s.sessionType === 'routine');

      if (dayLedger.length > 0) {
        dayLedger.forEach(log => {
          const mins = Math.max(0, log.durationSeconds / 60);
          if (log.mode === 'study') {
            focusMins += mins;
          } else if (log.mode === 'break' || log.mode === 'routine') {
            breakRoutineMins += mins;
          } else if (log.mode === 'sleep') {
            sleepMins += mins;
          }
        });
      } else {
        // Fallback to standard focus/break sessions and sleepSessions
        focusMins = workSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        breakRoutineMins = breakSessions.reduce((sum, s) => sum + (s.duration || 0), 0) + routineSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
        
        const daySleepSessions = (sleepSessions || []).filter(s => {
          if (!s.startTime) return false;
          return new Date(s.startTime).toDateString() === dateStr;
        });
        sleepMins = daySleepSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      }

      focusMins = Math.round(focusMins);
      breakRoutineMins = Math.round(breakRoutineMins);
      sleepMins = Math.round(sleepMins);

      // Determine active day allocation ceiling (1440 mins normally, or current elapsed minutes if today)
      let totalMins = 1440;
      const todayStr = getYYYYMMDD(new Date());
      if (dateStrYYYYMMDD === todayStr) {
        const now = new Date();
        totalMins = now.getHours() * 60 + now.getMinutes();
      }

      // Idle is anything left over
      const idleMins = Math.max(0, totalMins - (focusMins + breakRoutineMins + sleepMins));

      return {
        dateStr,
        name: label,
        minutes: focusMins + breakRoutineMins,
        workMinutes: focusMins, // For compatibility with daily average calculations & outlier filters
        breakMinutes: breakRoutineMins, // For compatibility
        focusMinutes: focusMins,
        breakRoutineMinutes: breakRoutineMins,
        sleepMinutes: sleepMins,
        idleMinutes: idleMins,
        sessionsCount: workSessions.length,
        breakSessionsCount: breakSessions.length + routineSessions.length
      };
    });
  }, [focusSessions, sleepSessions, pomoLogsVersion]);

  // Helper for outlier-filtering daily averages
  const calculateCleanDailyAverage = useCallback((sessions: FocusSession[], daysCount: number) => {
    const dailyMinutes: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < daysCount; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateKey = d.toDateString();
      dailyMinutes[dateKey] = 0;
    }

    (sessions || []).forEach(s => {
      if (!s.timestamp || s.sessionType === 'break' || s.sessionType === 'routine') return;
      const sDate = new Date(s.timestamp).toDateString();
      if (dailyMinutes[sDate] !== undefined) {
        dailyMinutes[sDate] += s.duration || 0;
      }
    });

    const allDailyMinutes = Object.values(dailyMinutes);
    const totalDays = allDailyMinutes.length;

    if (totalDays === 0) return { cleanAvg: 0, rawAvg: 0, activeDaysCount: 0, ignoredDaysCount: 0, totalMinutes: 0, cleanDaysCount: 0, offDaysCount: 0, lowDaysCount: 0 };

    const rawTotal = allDailyMinutes.reduce((sum, m) => sum + m, 0);
    const rawAvg = rawTotal / totalDays;

    const activeDaysMinutes = allDailyMinutes.filter(m => m > 0);
    const activeDaysCount = activeDaysMinutes.length;
    const offDaysCount = totalDays - activeDaysCount;

    if (activeDaysCount === 0) {
      return { cleanAvg: 0, rawAvg: 0, activeDaysCount: 0, ignoredDaysCount: totalDays, totalMinutes: 0, cleanDaysCount: 0, offDaysCount: totalDays, lowDaysCount: 0 };
    }

    const activeAvg = activeDaysMinutes.reduce((sum, m) => sum + m, 0) / activeDaysCount;
    const threshold = 0.5 * activeAvg;

    const cleanDaysMinutes = allDailyMinutes.filter(m => m > 0 && m >= threshold);
    const cleanDaysCount = cleanDaysMinutes.length;
    const lowDaysCount = activeDaysCount - cleanDaysCount;

    const cleanAvg = cleanDaysCount > 0 
      ? cleanDaysMinutes.reduce((sum, m) => sum + m, 0) / cleanDaysCount 
      : 0;

    const ignoredDaysCount = totalDays - cleanDaysCount;

    return {
      cleanAvg: Math.round(cleanAvg),
      rawAvg: Math.round(rawAvg),
      activeDaysCount,
      ignoredDaysCount,
      offDaysCount,
      lowDaysCount,
      totalMinutes: rawTotal,
      cleanDaysCount
    };
  }, []);

  const weeklyPace = useMemo(() => calculateCleanDailyAverage(focusSessions, 7), [focusSessions, calculateCleanDailyAverage]);
  const monthlyPace = useMemo(() => calculateCleanDailyAverage(focusSessions, 30), [focusSessions, calculateCleanDailyAverage]);

  const studyTimeByWindow = useMemo(() => {
    const windows = {
      Morning: 0,
      Afternoon: 0,
      Evening: 0,
      Night: 0
    };

    (focusSessions || []).forEach(s => {
      if (!s.timestamp || s.sessionType === 'break' || s.sessionType === 'routine') return;
      try {
        const date = new Date(s.timestamp);
        const hour = date.getHours();
        if (hour >= 6 && hour < 12) {
          windows.Morning += s.duration || 0;
        } else if (hour >= 12 && hour < 17) {
          windows.Afternoon += s.duration || 0;
        } else if (hour >= 17 && hour < 22) {
          windows.Evening += s.duration || 0;
        } else {
          windows.Night += s.duration || 0;
        }
      } catch (e) {
        console.error("Failed to parse session timestamp:", e);
      }
    });

    return windows;
  }, [focusSessions]);

  const peakWindow = useMemo(() => {
    let maxWindow = "None";
    let maxVal = -1;
    Object.entries(studyTimeByWindow).forEach(([win, duration]) => {
      const dur = duration as number;
      if (dur > maxVal) {
        maxVal = dur;
        maxWindow = win;
      }
    });
    if (maxVal <= 0) return { name: "Awaiting Data", desc: "Start logging sessions to find your peak study hours." };
    
    const descriptions = {
      Morning: "🌅 Morning Mind (6 AM - 12 PM) - High cognitive retention",
      Afternoon: "☀️ Afternoon Grit (12 PM - 5 PM) - Consistent problem solving",
      Evening: "🌆 Sunset Focus (5 PM - 10 PM) - Dedicated revision blocks",
      Night: "🌙 Night Owl (10 PM - 6 AM) - Quiet uninterrupted focus"
    };
    return {
      name: maxWindow,
      desc: descriptions[maxWindow as keyof typeof descriptions] || ""
    };
  }, [studyTimeByWindow]);

  const studyEfficiency = useMemo(() => {
    let totalStudyMinutes = 0;
    let totalBreakMinutes = 0;

    (focusSessions || []).forEach(s => {
      if (!s.timestamp || s.sessionType === 'routine') return;
      if (s.sessionType === 'break') {
        totalBreakMinutes += s.duration || 0;
      } else {
        totalStudyMinutes += s.duration || 0;
      }
    });

    if (totalStudyMinutes === 0) return { ratio: 100, label: "Optimal (No Breaks)" };
    
    const breakPercentage = (totalBreakMinutes / totalStudyMinutes) * 100;
    let label = "High Endurance (Deep Focus)";
    if (breakPercentage > 30) label = "Frequent Rest (Low Endurance)";
    else if (breakPercentage > 15) label = "Balanced Pace (Optimal Pomodoro)";
    else if (breakPercentage > 0) label = "High Focus (Short Breaks)";

    return {
      ratio: Math.round(100 - Math.min(breakPercentage, 50)),
      label,
      totalStudyMinutes,
      totalBreakMinutes
    };
  }, [focusSessions]);

  const last30DaysStudyData = useMemo(() => {
    const dataset = [];
    const today = new Date();
    
    const { cleanAvg } = calculateCleanDailyAverage(focusSessions, 30);
    const threshold = 0.5 * cleanAvg;

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toDateString();
      const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

      const daySessions = (focusSessions || []).filter(s => {
        if (!s.timestamp || s.sessionType === 'break' || s.sessionType === 'routine') return false;
        return new Date(s.timestamp).toDateString() === dateStr;
      });
      const minutes = Math.round(daySessions.reduce((sum, s) => sum + (s.duration || 0), 0));

      let status = 'Regular';
      if (minutes === 0) {
        status = 'Complete Day Off';
      } else if (cleanAvg > 0 && minutes < threshold) {
        status = 'Insufficient (<50%)';
      }

      dataset.push({
        dateStr,
        name: dateLabel,
        minutes,
        cleanAvg: status === 'Regular' ? cleanAvg : null,
        flatCleanAvg: cleanAvg,
        status,
        isExcluded: status !== 'Regular'
      });
    }
    return dataset;
  }, [focusSessions, calculateCleanDailyAverage]);

  const selectedPaceStudyData = useMemo(() => {
    const dataset = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let startDate: Date;
    let endDate: Date;

    if (paceTimeframe === 'current_week') {
      const dayOfWeek = now.getDay();
      const diffToMon = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      startDate = new Date(now);
      startDate.setDate(now.getDate() + diffToMon);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (paceTimeframe === 'last_week') {
      const dayOfWeek = now.getDay();
      const diffToMon = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      const thisMon = new Date(now);
      thisMon.setDate(now.getDate() + diffToMon);
      startDate = new Date(thisMon);
      startDate.setDate(thisMon.getDate() - 7);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (paceTimeframe === 'current_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      endDate = now > endOfMonth ? endOfMonth : now;
    } else if (paceTimeframe === 'last_month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      // last_30_days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 29);
      endDate = new Date(now);
    }

    const dates: Date[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }

    const dayMinutesList: { dateObj: Date; dateStr: string; name: string; minutes: number }[] = [];
    dates.forEach(d => {
      const dateStr = d.toDateString();
      const dateLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      const daySessions = (focusSessions || []).filter(s => {
        if (!s.timestamp || s.sessionType === 'break' || s.sessionType === 'routine') return false;
        return new Date(s.timestamp).toDateString() === dateStr;
      });
      const minutes = Math.round(daySessions.reduce((sum, s) => sum + (s.duration || 0), 0));
      dayMinutesList.push({ dateObj: d, dateStr, name: dateLabel, minutes });
    });

    const activeMinutes = dayMinutesList.map(item => item.minutes).filter(m => m > 0);
    const activeAvg = activeMinutes.length > 0 ? activeMinutes.reduce((sum, m) => sum + m, 0) / activeMinutes.length : 0;
    const threshold = 0.5 * activeAvg;

    const cleanDays = dayMinutesList.filter(item => item.minutes > 0 && item.minutes >= threshold);
    const cleanAvg = cleanDays.length > 0 
      ? Math.round(cleanDays.reduce((sum, item) => sum + item.minutes, 0) / cleanDays.length)
      : Math.round(dayMinutesList.reduce((sum, item) => sum + item.minutes, 0) / (dayMinutesList.length || 1));

    dayMinutesList.forEach(item => {
      let status = 'Regular';
      if (item.minutes === 0) {
        status = 'Complete Day Off';
      } else if (cleanAvg > 0 && item.minutes < threshold) {
        status = 'Insufficient (<50%)';
      }

      dataset.push({
        dateStr: item.dateStr,
        name: item.name,
        minutes: item.minutes,
        cleanAvg: status === 'Regular' ? cleanAvg : null,
        flatCleanAvg: cleanAvg,
        status,
        isExcluded: status !== 'Regular'
      });
    });

    return { dataset, cleanAvg };
  }, [focusSessions, paceTimeframe]);

  const recentDaysAudit = useMemo(() => {
    return [...last30DaysStudyData].slice(-10).reverse();
  }, [last30DaysStudyData]);

  const studyTrendAnalysisData = useMemo(() => {
    return last30DaysStudyData.map((day, index, arr) => {
      let sum = 0;
      let count = 0;
      for (let i = Math.max(0, index - 4); i <= index; i++) {
        sum += arr[i].minutes;
        count++;
      }
      const movingAvg = count > 0 ? Math.round(sum / count) : 0;
      return {
        ...day,
        movingAvg
      };
    });
  }, [last30DaysStudyData]);

  const formatMinutes = useCallback((mins: number) => {
    return formatStaticDuration(mins, 'minutes');
  }, []);

  const consistencyScoreData = useMemo(() => {
    if (!last7DaysFocusData || last7DaysFocusData.length === 0) {
      return { percentage: 0, metCount: 0 };
    }
    const metCount = last7DaysFocusData.filter(d => d.workMinutes >= dailyGoalMinutes).length;
    const percentage = Math.round((metCount / 7) * 100);
    return {
      percentage,
      metCount
    };
  }, [last7DaysFocusData, dailyGoalMinutes]);

  const dailyGoalProgress = useMemo(() => {
    const goalMins = Math.max(1, dailyGoalMinutes || 300);
    const todayMins = last7DaysFocusData && last7DaysFocusData.length > 0 
      ? (last7DaysFocusData[last7DaysFocusData.length - 1]?.workMinutes || 0)
      : 0;
    
    const rawPercentage = (todayMins / goalMins) * 100;
    const percentage = Math.min(100, Math.round(rawPercentage));
    const remainingMins = Math.max(0, goalMins - todayMins);
    const isGoalAchieved = todayMins >= goalMins;

    return {
      goalMins,
      todayMins,
      percentage,
      rawPercentage,
      remainingMins,
      isGoalAchieved
    };
  }, [last7DaysFocusData, dailyGoalMinutes]);

  const weeklyConsistencyTrendData = useMemo(() => {
    if (!last7DaysFocusData) return [];
    // tracks total study minutes per day over the last 7 days, filtering out the outlier days (complete days off)
    return last7DaysFocusData
      .filter(d => d.workMinutes > 0)
      .map(d => ({
        name: d.name,
        minutes: d.workMinutes,
        originalDate: d.dateStr
      }));
  }, [last7DaysFocusData]);

  const weeklyConsistencyAverageMinutes = useMemo(() => {
    if (weeklyConsistencyTrendData.length === 0) return 0;
    const total = weeklyConsistencyTrendData.reduce((sum, d) => sum + d.minutes, 0);
    return Math.round(total / weeklyConsistencyTrendData.length);
  }, [weeklyConsistencyTrendData]);

  const last7DaysSleepData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    return days.map(date => {
      const dateStr = date.toDateString();
      const label = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      
      const daySessions = (sleepSessions || []).filter(s => {
        if (!s.startTime) return false;
        return new Date(s.startTime).toDateString() === dateStr;
      });
      
      const totalMinutes = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const totalHours = Number((totalMinutes / 60).toFixed(1));
      const feelings = daySessions.map(s => s.feeling).filter(Boolean);

      return {
        dateStr,
        name: label,
        minutes: totalMinutes,
        hours: totalHours,
        feelingsText: feelings.join(', ') || undefined,
        sessionsCount: daySessions.length
      };
    });
  }, [sleepSessions]);

  const weeklySubjectStudySummary = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const currentDay = startOfWeek.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const isDateInSelectedTimeframe = (logDate: Date) => {
      if (subjectTargetTimeframe === 'all_time') return true;
      if (subjectTargetTimeframe === 'current_week') {
        return logDate >= startOfWeek && logDate <= endOfWeek;
      }
      if (subjectTargetTimeframe === 'current_month') {
        return logDate >= startOfMonth && logDate <= endOfMonth;
      }
      return true;
    };

    const subjectStats: Record<SubjectId, { minutes: number; sessionsCount: number }> = {
      AFM: { minutes: 0, sessionsCount: 0 },
      FR: { minutes: 0, sessionsCount: 0 },
      Audit: { minutes: 0, sessionsCount: 0 },
      DT: { minutes: 0, sessionsCount: 0 },
      IDT: { minutes: 0, sessionsCount: 0 },
      IBS: { minutes: 0, sessionsCount: 0 },
      AdvAcc: { minutes: 0, sessionsCount: 0 },
      CorpLaw: { minutes: 0, sessionsCount: 0 },
      Tax: { minutes: 0, sessionsCount: 0 },
      Cost: { minutes: 0, sessionsCount: 0 },
      AuditInter: { minutes: 0, sessionsCount: 0 },
      FMSM: { minutes: 0, sessionsCount: 0 },
      Accounts: { minutes: 0, sessionsCount: 0 },
      Law: { minutes: 0, sessionsCount: 0 },
      MathStats: { minutes: 0, sessionsCount: 0 },
      Econ: { minutes: 0, sessionsCount: 0 },
      CMAFoundLaw: { minutes: 0, sessionsCount: 0 },
      CMAFoundAcc: { minutes: 0, sessionsCount: 0 },
      CMAFoundMath: { minutes: 0, sessionsCount: 0 },
      CMAFoundEcon: { minutes: 0, sessionsCount: 0 },
      CMAInterLaw: { minutes: 0, sessionsCount: 0 },
      CMAInterFA: { minutes: 0, sessionsCount: 0 },
      CMAInterTax: { minutes: 0, sessionsCount: 0 },
      CMAInterCost: { minutes: 0, sessionsCount: 0 },
      CMAInterOMSM: { minutes: 0, sessionsCount: 0 },
      CMAInterCAA: { minutes: 0, sessionsCount: 0 },
      CMAInterFMDA: { minutes: 0, sessionsCount: 0 },
      CMAInterMA: { minutes: 0, sessionsCount: 0 },
      CMAFinalLaw: { minutes: 0, sessionsCount: 0 },
      CMAFinalSFM: { minutes: 0, sessionsCount: 0 },
      CMAFinalDT: { minutes: 0, sessionsCount: 0 },
      CMAFinalSCM: { minutes: 0, sessionsCount: 0 },
      CMAFinalCMA: { minutes: 0, sessionsCount: 0 },
      CMAFinalCFR: { minutes: 0, sessionsCount: 0 },
      CMAFinalIDT: { minutes: 0, sessionsCount: 0 },
      CMAFinalSPBV: { minutes: 0, sessionsCount: 0 },
    };

    const countedSessionIds = new Set<string>();

    // 1. Process practca_pomo_logs from localStorage (synchronous real-time logs)
    try {
      const cached = localStorage.getItem(getLevelScopedKey('practca_pomo_logs'));
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          parsed.forEach((log: any) => {
            if ((log.mode !== 'study' && log.mode !== 'work') || !log.durationSeconds) return;
            let logDate: Date | null = null;
            if (log.date) {
              const [y, m, d] = String(log.date).split('-').map(Number);
              logDate = new Date(y, m - 1, d);
            } else if (log.startTime && String(log.startTime).includes('T')) {
              logDate = new Date(log.startTime);
            }
            if (logDate && isDateInSelectedTimeframe(logDate)) {
              const subId = (log.subjectId || log.subjectCode || log.subject) as SubjectId;
              if (subId && subjectStats[subId]) {
                const mins = Math.max(1, Math.round(log.durationSeconds / 60));
                subjectStats[subId].minutes += mins;
                subjectStats[subId].sessionsCount += 1;
                if (log.id) countedSessionIds.add(log.id);
              }
            }
          });
        }
      }
    } catch (e) {
      console.error("Error reading practca_pomo_logs for subject distribution", e);
    }

    // 2. Process focusSessions (synced sessions or prop data)
    (focusSessions || []).forEach(s => {
      if (!s.timestamp || s.sessionType === 'break' || s.sessionType === 'routine') return;
      if (s.id && countedSessionIds.has(s.id)) return;
      const sessionDate = new Date(s.timestamp);
      if (isDateInSelectedTimeframe(sessionDate)) {
        const subId = s.subjectId;
        if (subId && subjectStats[subId]) {
          subjectStats[subId].minutes += s.duration || 0;
          subjectStats[subId].sessionsCount += 1;
          if (s.id) countedSessionIds.add(s.id);
        }
      }
    });

    const colors: Record<SubjectId, string> = {
      AFM: "#FF3366",
      FR: "#00D2FF",
      Audit: "#9D4EDD",
      DT: "#FF9F1C",
      IDT: "#10B981",
      IBS: "#FFD166",
      AdvAcc: "#00D2FF",
      CorpLaw: "#818CF8",
      Tax: "#FF9F1C",
      Cost: "#10B981",
      AuditInter: "#9D4EDD",
      FMSM: "#FF3366",
      Accounts: "#00D2FF",
      Law: "#9D4EDD",
      MathStats: "#FF9F1C",
      Econ: "#10B981",
      CMAFoundLaw: "#9D4EDD",
      CMAFoundAcc: "#00D2FF",
      CMAFoundMath: "#FF9F1C",
      CMAFoundEcon: "#10B981",
      CMAInterLaw: "#818CF8",
      CMAInterFA: "#00D2FF",
      CMAInterTax: "#FF9F1C",
      CMAInterCost: "#10B981",
      CMAInterOMSM: "#EC4899",
      CMAInterCAA: "#9D4EDD",
      CMAInterFMDA: "#FF3366",
      CMAInterMA: "#FFD166",
      CMAFinalLaw: "#818CF8",
      CMAFinalSFM: "#FF3366",
      CMAFinalDT: "#FF9F1C",
      CMAFinalSCM: "#10B981",
      CMAFinalCMA: "#9D4EDD",
      CMAFinalCFR: "#00D2FF",
      CMAFinalIDT: "#EC4899",
      CMAFinalSPBV: "#FFD166",
    };

    const subjectsOrder: SubjectId[] = levelSubjectIds;

    const totalMinutes = subjectsOrder.reduce((acc, id) => acc + (subjectStats[id]?.minutes || 0), 0);
    const totalHours = +(totalMinutes / 60).toFixed(1);

    // Total target hours across active level subjects
    const totalTargetHours = subjectsOrder.reduce((sum, id) => sum + (subjectHourlyTargets[id] || 100), 0);
    const overallProgress = totalTargetHours > 0 ? Math.min(100, Math.round((totalHours / totalTargetHours) * 100)) : 0;

    let targetsMetCount = 0;

    const chartData = subjectsOrder.map(id => {
      const metadata = SUBJECTS_METADATA[id];
      const mins = subjectStats[id]?.minutes || 0;
      const hours = +(mins / 60).toFixed(1);
      const targetHours = subjectHourlyTargets[id] || 100;
      const remainingHours = Math.max(0, +(targetHours - hours).toFixed(1));
      const percentageShare = totalMinutes > 0 ? +((mins / totalMinutes) * 100).toFixed(1) : 0;
      const targetProgress = targetHours > 0 ? Math.min(100, Math.round((hours / targetHours) * 100)) : 0;
      
      let status: 'exceeded' | 'on_track' | 'in_progress' | 'pending' = 'pending';
      if (hours >= targetHours && targetHours > 0) {
        status = 'exceeded';
        targetsMetCount++;
      } else if (hours >= targetHours * 0.5 && targetHours > 0) {
        status = 'on_track';
      } else if (hours > 0) {
        status = 'in_progress';
      }

      return {
        id,
        subjectId: id,
        name: id,
        fullName: metadata?.fullName || id,
        minutes: mins,
        hours,
        targetHours,
        remainingHours,
        targetProgress,
        percentageShare,
        color: colors[id],
        sessionsCount: subjectStats[id]?.sessionsCount || 0,
        status
      };
    });

    const activeSubjects = chartData.filter(item => item.hours > 0);
    const topSubject = activeSubjects.length > 0
      ? [...activeSubjects].sort((a, b) => b.hours - a.hours)[0]
      : null;

    const pieData = activeSubjects.length > 0
      ? activeSubjects.map(s => ({
          name: s.name,
          fullName: s.fullName,
          value: s.hours,
          minutes: s.minutes,
          color: s.color,
          percentageShare: s.percentageShare
        }))
      : [{ name: 'No study yet', fullName: 'Awaiting Study Sessions', value: 1, minutes: 0, color: '#334155', percentageShare: 100 }];

    const startStr = startOfWeek.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
    const endStr = endOfWeek.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const weekRangeFormatted = `${startStr} – ${endStr}`;

    const timeframeLabel = subjectTargetTimeframe === 'all_time' 
      ? 'All-Time Total Study Hours' 
      : subjectTargetTimeframe === 'current_week' 
      ? `Current Week (${weekRangeFormatted})` 
      : `Current Month (${now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })})`;

    return {
      chartData,
      pieData,
      totalHours,
      totalMinutes,
      totalTargetHours,
      targetSubjectHours: +(totalTargetHours / Math.max(1, subjectsOrder.length)).toFixed(1),
      weeklyGoalHours: +(totalTargetHours / Math.max(1, subjectsOrder.length)).toFixed(1),
      overallProgress,
      topSubject,
      activeSubjectsCount: activeSubjects.length,
      targetsMetCount,
      weekRangeFormatted,
      timeframeLabel
    };
  }, [focusSessions, dailyGoalMinutes, pomoLogsVersion, subjectHourlyTargets, subjectTargetTimeframe, levelSubjectIds]);

  const weeklySubjectFocusData = useMemo(() => {
    return weeklySubjectStudySummary.chartData.map(item => ({
      subjectId: item.id,
      name: item.name,
      fullName: item.fullName,
      minutes: item.minutes,
      hours: item.hours,
      color: item.color
    }));
  }, [weeklySubjectStudySummary]);

  const chapterRevisionHoursData = useMemo(() => {
    const chapterMap: Record<string, {
      subjectId: SubjectId;
      chapterName: string;
      read1: number;
      rev1: number;
      rev23: number;
      finalRev: number;
      sessionsCount: number;
    }> = {};

    const getEntry = (subId: SubjectId, chName: string) => {
      const key = `${subId}:::${chName}`;
      if (!chapterMap[key]) {
        chapterMap[key] = {
          subjectId: subId,
          chapterName: chName,
          read1: 0,
          rev1: 0,
          rev23: 0,
          finalRev: 0,
          sessionsCount: 0
        };
      }
      return chapterMap[key];
    };

    // 1. Process focusSessions
    (focusSessions || []).forEach(s => {
      if (s.sessionType === 'break' || s.sessionType === 'routine' || !s.duration) return;
      const subId = (s.subjectId || 'FR') as SubjectId;
      let chName = s.chapterName;

      if (!chName || chName === 'General / Entire Subject') {
        const desc = s.description || '';
        const subChapters = SUBJECT_CHAPTERS[subId] || [];
        const match = subChapters.find(ch => desc.toLowerCase().includes(ch.toLowerCase()));
        if (match) {
          chName = match;
        } else {
          chName = 'General / Entire Subject';
        }
      }

      const entry = getEntry(subId, chName);
      const hours = (s.duration || 0) / 60;
      entry.sessionsCount += 1;

      const rel = (s.relevance || '').toLowerCase();
      if (rel.includes('final') || rel.includes('1.5')) {
        entry.finalRev += hours;
      } else if (rel.includes('general') || rel.includes('initial') || rel.includes('1st')) {
        entry.read1 += hours;
      } else {
        entry.rev1 += hours;
      }
    });

    // 2. Process RevisionPlanner logs from localStorage
    try {
      const storedLogs = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs')) || localStorage.getItem(getLevelScopedKey('cavault_revision_planner_logs'));
      if (storedLogs) {
        const logs = JSON.parse(storedLogs);
        if (Array.isArray(logs)) {
          logs.forEach((log: any) => {
            if (!log.subjectId || !log.chapterName || !log.durationMinutes) return;
            const subId = log.subjectId as SubjectId;
            const chName = log.chapterName;
            const hours = (log.durationMinutes || 0) / 60;
            const entry = getEntry(subId, chName);
            entry.sessionsCount += 1;

            if (log.revKey === 'rev1.5') {
              entry.finalRev += hours;
            } else if (log.revKey === 'rev2' || log.revKey === 'rev3') {
              entry.rev23 += hours;
            } else {
              entry.rev1 += hours;
            }
          });
        }
      }
    } catch (e) {
      console.warn('Error parsing revision logs for chapter chart:', e);
    }

    const targetSubjects: SubjectId[] = selectedRevisionSubject === 'All' 
      ? levelSubjectIds
      : [selectedRevisionSubject as SubjectId];

    let resultList: {
      subjectId: SubjectId;
      chapterName: string;
      read1: number;
      rev1: number;
      rev23: number;
      finalRev: number;
      totalHours: number;
      sessionsCount: number;
      color: string;
    }[] = [];

    const subjectColors: Record<SubjectId, string> = {
      AFM: "#00d4ff",
      FR:  "#a78bfa",
      Audit: "#34d399",
      DT:  "#fb923c",
      IDT: "#f472b6",
      IBS: "#facc15",
      AdvAcc: "#38bdf8",
      CorpLaw: "#818cf8",
      Tax: "#fbbf24",
      Cost: "#34d399",
      AuditInter: "#c084fc",
      FMSM: "#f472b6",
      Accounts: "#60a5fa",
      Law: "#a78bfa",
      MathStats: "#fb923c",
      Econ: "#2dd4bf",
      CMAFoundLaw: "#a78bfa",
      CMAFoundAcc: "#60a5fa",
      CMAFoundMath: "#fb923c",
      CMAFoundEcon: "#2dd4bf",
      CMAInterLaw: "#818cf8",
      CMAInterFA: "#38bdf8",
      CMAInterTax: "#fbbf24",
      CMAInterCost: "#34d399",
      CMAInterOMSM: "#f472b6",
      CMAInterCAA: "#c084fc",
      CMAInterFMDA: "#00d4ff",
      CMAInterMA: "#facc15",
      CMAFinalLaw: "#818cf8",
      CMAFinalSFM: "#00d4ff",
      CMAFinalDT: "#fb923c",
      CMAFinalSCM: "#34d399",
      CMAFinalCMA: "#c084fc",
      CMAFinalCFR: "#a78bfa",
      CMAFinalIDT: "#f472b6",
      CMAFinalSPBV: "#facc15",
    };

    targetSubjects.forEach(subId => {
      const officialChapters = SUBJECT_CHAPTERS[subId] || [];
      officialChapters.forEach(chName => {
        const key = `${subId}:::${chName}`;
        const entry = chapterMap[key];
        
        const read1 = entry ? entry.read1 : 0;
        const rev1 = entry ? entry.rev1 : 0;
        const rev23 = entry ? entry.rev23 : 0;
        const finalRev = entry ? entry.finalRev : 0;
        const sessionsCount = entry ? entry.sessionsCount : 0;
        const totalHours = +(read1 + rev1 + rev23 + finalRev).toFixed(1);

        resultList.push({
          subjectId: subId,
          chapterName: chName,
          read1: +read1.toFixed(1),
          rev1: +rev1.toFixed(1),
          rev23: +rev23.toFixed(1),
          finalRev: +finalRev.toFixed(1),
          totalHours,
          sessionsCount,
          color: subjectColors[subId] || '#38bdf8'
        });
      });
    });

    const maxHoursLogged = Math.max(0, ...resultList.map(r => r.totalHours));
    let isDemoData = false;

    if (maxHoursLogged === 0) {
      isDemoData = true;
      resultList = resultList.map((item, idx) => {
        if (idx < 12) {
          const seedRead1 = +((idx % 3 + 1) * 1.5).toFixed(1);
          const seedRev1 = +((idx % 2 + 1) * 2.0).toFixed(1);
          const seedRev23 = idx % 4 === 0 ? 1.5 : 0;
          const seedFinal = idx % 3 === 0 ? 1.0 : 0;
          const seedTotal = +(seedRead1 + seedRev1 + seedRev23 + seedFinal).toFixed(1);
          return {
            ...item,
            read1: seedRead1,
            rev1: seedRev1,
            rev23: seedRev23,
            finalRev: seedFinal,
            totalHours: seedTotal,
            sessionsCount: 3 + (idx % 3)
          };
        }
        return item;
      });
    }

    if (filterOnlyWithHours) {
      resultList = resultList.filter(item => item.totalHours > 0);
    }

    if (chapterSortMode === 'hours') {
      resultList.sort((a, b) => b.totalHours - a.totalHours);
    }

    if (resultList.length > 15 && selectedRevisionSubject === 'All') {
      resultList = resultList.slice(0, 15);
    }

    return {
      data: resultList,
      isDemoData,
      totalRevisionHours: +resultList.reduce((acc, curr) => acc + curr.totalHours, 0).toFixed(1),
      chaptersCovered: resultList.filter(r => r.totalHours > 0).length,
      topChapter: resultList.length > 0 ? [...resultList].sort((a, b) => b.totalHours - a.totalHours)[0] : null
    };
  }, [focusSessions, selectedRevisionSubject, chapterSortMode, filterOnlyWithHours, levelSubjectIds]);

  const subjectPerformanceData = useMemo(() => {
    const subjects: SubjectId[] = levelSubjectIds;
    const colors: Record<SubjectId, string> = {
      AFM: "#00d4ff",
      FR:  "#a78bfa",
      Audit: "#34d399",
      DT:  "#fb923c",
      IDT: "#f472b6",
      IBS: "#facc15",
      AdvAcc: "#38bdf8",
      CorpLaw: "#818cf8",
      Tax: "#fbbf24",
      Cost: "#34d399",
      AuditInter: "#c084fc",
      FMSM: "#f472b6",
      Accounts: "#60a5fa",
      Law: "#a78bfa",
      MathStats: "#fb923c",
      Econ: "#2dd4bf",
      CMAFoundLaw: "#a78bfa",
      CMAFoundAcc: "#60a5fa",
      CMAFoundMath: "#fb923c",
      CMAFoundEcon: "#2dd4bf",
      CMAInterLaw: "#818cf8",
      CMAInterFA: "#38bdf8",
      CMAInterTax: "#fbbf24",
      CMAInterCost: "#34d399",
      CMAInterOMSM: "#f472b6",
      CMAInterCAA: "#c084fc",
      CMAInterFMDA: "#00d4ff",
      CMAInterMA: "#facc15",
      CMAFinalLaw: "#818cf8",
      CMAFinalSFM: "#00d4ff",
      CMAFinalDT: "#fb923c",
      CMAFinalSCM: "#34d399",
      CMAFinalCMA: "#c084fc",
      CMAFinalCFR: "#a78bfa",
      CMAFinalIDT: "#f472b6",
      CMAFinalSPBV: "#facc15",
    };

    return subjects.map(subId => {
      const stats = subjectStats[subId] || { total: 0, correct: 0, accuracy: 0 };
      const metadata = SUBJECTS_METADATA[subId];
      return {
        subjectId: subId,
        name: subId,
        fullName: metadata?.fullName || subId,
        totalAttempts: stats.total,
        correctAttempts: stats.correct,
        accuracy: stats.accuracy,
        color: colors[subId] || '#00d4ff'
      };
    });
  }, [subjectStats, levelSubjectIds]);

  const timeOfDayChartData = useMemo(() => {
    const total = (studyTimeByWindow.Morning + studyTimeByWindow.Afternoon + studyTimeByWindow.Evening + studyTimeByWindow.Night) || 1;
    return [
      { window: 'Morning', label: 'Morning (6 AM - 12 PM)', minutes: studyTimeByWindow.Morning, percent: Math.round((studyTimeByWindow.Morning / total) * 100), icon: '🌅', color: '#38bdf8' },
      { window: 'Afternoon', label: 'Afternoon (12 PM - 5 PM)', minutes: studyTimeByWindow.Afternoon, percent: Math.round((studyTimeByWindow.Afternoon / total) * 100), icon: '☀️', color: '#fbbf24' },
      { window: 'Evening', label: 'Evening (5 PM - 10 PM)', minutes: studyTimeByWindow.Evening, percent: Math.round((studyTimeByWindow.Evening / total) * 100), icon: '🌆', color: '#a78bfa' },
      { window: 'Night', label: 'Night (10 PM - 6 AM)', minutes: studyTimeByWindow.Night, percent: Math.round((studyTimeByWindow.Night / total) * 100), icon: '🌙', color: '#818cf8' }
    ];
  }, [studyTimeByWindow]);

  const handleLegendClick = (data: any) => {
    const { dataKey } = data;
    setHiddenSubjects(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey]
    }));
  };

  useEffect(() => {
    calculateMetrics();
  }, [practiceAttempts]);

  const calculateMetrics = () => {
    if (practiceAttempts.length === 0) {
      setOverallStats({ total: 0, correct: 0, accuracy: 0 });
      setSubjectStats({});
      setChapterStats({});
      setTimelineTrend([]);
      return;
    }

    // Overall
    const total = practiceAttempts.length;
    const correct = practiceAttempts.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correct / total) * 100);
    setOverallStats({ total, correct, accuracy });

    // Subject breakdown
    const subBreakdown: Record<string, { total: number; correct: number; accuracy: number }> = {};
    Object.keys(SUBJECTS_METADATA).forEach(key => {
      subBreakdown[key] = { total: 0, correct: 0, accuracy: 0 };
    });

    practiceAttempts.forEach(attempt => {
      if (!subBreakdown[attempt.subjectId]) {
        subBreakdown[attempt.subjectId] = { total: 0, correct: 0, accuracy: 0 };
      }
      subBreakdown[attempt.subjectId].total += 1;
      if (attempt.isCorrect) {
        subBreakdown[attempt.subjectId].correct += 1;
      }
    });

    Object.keys(subBreakdown).forEach(key => {
      const item = subBreakdown[key];
      item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });
    setSubjectStats(subBreakdown);

    // Chapter weakness breakdown
    const chapBreakdown: Record<string, { total: number; correct: number; accuracy: number; subject: SubjectId }> = {};
    practiceAttempts.forEach(attempt => {
      const key = `${attempt.subjectId} - ${attempt.chapterName}`;
      if (!chapBreakdown[key]) {
        chapBreakdown[key] = { total: 0, correct: 0, accuracy: 0, subject: attempt.subjectId };
      }
      chapBreakdown[key].total += 1;
      if (attempt.isCorrect) {
        chapBreakdown[key].correct += 1;
      }
    });

    Object.keys(chapBreakdown).forEach(key => {
      const item = chapBreakdown[key];
      item.accuracy = Math.round((item.correct / item.total) * 100);
    });
    setChapterStats(chapBreakdown);

    // Over time trend (Grouped by date)
    const dateGroups: Record<string, { total: number; correct: number }> = {};
    // Sort chronological first
    const sorted = [...practiceAttempts].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    sorted.forEach(attempt => {
      const dateStr = new Date(attempt.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = { total: 0, correct: 0 };
      }
      dateGroups[dateStr].total += 1;
      if (attempt.isCorrect) {
        dateGroups[dateStr].correct += 1;
      }
    });

    const trendData = Object.keys(dateGroups).map(date => {
      const day = dateGroups[date];
      return {
        date,
        accuracy: Math.round((day.correct / day.total) * 100)
      };
    });
    setTimelineTrend(trendData);
  };

  // Find weakest chapters: Any chapter with at least 1 attempt and accuracy below 70%
  const weakestChapters = (Object.entries(chapterStats) as [string, { total: number; correct: number; accuracy: number; subject: SubjectId }][])
    .filter(([_, stats]) => stats.total > 0)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 3);

  return (
    <div id="dashboard-root" className="space-y-3.5 w-full max-w-full animate-fadeIn font-sans">
      <ConfettiOverlay isDashboardView={true} />
      {/* Unified Student Dashboard Presentation Header (Locked & Scroll-Diminished) */}
      <div className="locked-internal-header">
        <div
          id="dashboard-title-card"
          className="locked-internal-header-card flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-5 py-5 sm:px-7 sm:py-6 rounded-2xl bg-gradient-to-r from-[#0c223b] via-[#132d4c] to-[#172840] border border-sky-400/55 ring-1 ring-white/[0.06] text-white relative overflow-hidden"
        >
          {/* Top Luminous Sky-Amber-Emerald Hairline */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-sky-400 via-amber-400 to-emerald-400 opacity-90 pointer-events-none" />
          <div className="absolute -top-10 right-16 w-44 h-20 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-400/30 to-cyan-500/15 border border-sky-300/60 shadow-[0_0_14px_rgba(56,189,248,0.28)] flex items-center justify-center shrink-0">
                <BarChart3 className="h-5 w-5 text-sky-200" />
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight drop-shadow-xs">
                Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-amber-500/18 border border-amber-400/45 text-[10.5px] font-mono font-extrabold uppercase tracking-wider text-amber-300">
                {CA_CURRICULUM_LEVELS[caLevel]?.shortName || 'CA Final'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/15 border border-sky-400/35 text-[10.5px] font-mono font-bold text-sky-200 hidden sm:inline">
                Executive Telemetry
              </span>
            </div>
          </div>

          {/* View Switcher & Read-Only Print Report */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 w-full xl:w-auto shrink-0">
            <div
              id="dashboard-sub-tab-bar"
              className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1.5 rounded-xl bg-[#061322]/90 border border-slate-700/80 shadow-inner w-full sm:w-auto"
            >
              <button
                id="dashboard-sub-tab-overview"
                type="button"
                onClick={() => setDashboardSubTab('overview')}
                className={`header-diminish-btn flex items-center justify-center gap-1.5 h-9 px-3 sm:px-3.5 font-sans font-bold text-xs rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border ${
                  dashboardSubTab === 'overview'
                    ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 border-sky-200 font-black shadow-[0_0_14px_rgba(56,189,248,0.35)]'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-[#132944]'
                }`}
              >
                <BarChart3 className="h-3.5 w-3.5 shrink-0" />
                <span>Analytics Overview</span>
              </button>
              <button
                id="dashboard-sub-tab-roadmap"
                type="button"
                onClick={() => setDashboardSubTab('roadmap')}
                className={`header-diminish-btn flex items-center justify-center gap-1.5 h-8.5 sm:h-8 px-2.5 sm:px-3 font-sans font-bold text-xs rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 border ${
                  dashboardSubTab === 'roadmap'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 border-amber-200 font-black shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                    : 'border-transparent text-slate-200 hover:text-white hover:bg-[#132944]'
                }`}
              >
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>Revision Roadmap</span>
              </button>
            </div>

            <span className="hidden sm:inline-block h-4 w-px bg-slate-700" />

            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
              <button
                id="dashboard-quick-study-btn"
                type="button"
                onClick={handleTriggerQuickStudy}
                title="Start a 10-minute high-intensity focus block for a randomly selected CA Final sub-topic"
                className="header-diminish-btn flex items-center justify-center gap-1.5 h-8.5 sm:h-8 w-full sm:w-auto px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 border border-amber-200 text-xs font-black cursor-pointer transition-all whitespace-nowrap shrink-0 shadow-[0_0_14px_rgba(245,158,11,0.3)]"
              >
                <Zap className="h-3.5 w-3.5 shrink-0 fill-current" />
                <span>Quick Study (10m)</span>
              </button>

              <button
                id="open-print-preview-btn"
                type="button"
                onClick={() => setShowPrintModal(true)}
                className="header-diminish-btn flex items-center justify-center gap-1.5 h-8.5 sm:h-8 w-full sm:w-auto px-3 sm:px-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 border border-emerald-200 text-xs font-black cursor-pointer transition-all whitespace-nowrap shrink-0 shadow-[0_0_14px_rgba(16,185,129,0.28)]"
              >
                <Printer className="h-3.5 w-3.5 shrink-0" />
                <span>Export Study Pack</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Peer Requests Alert Notification Banner */}
      {pendingPeersCount > 0 && (
        <div
          id="peer-requests-dashboard-alert"
          className="p-4 sm:p-5 rounded-2xl bg-cav-card border border-rose-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-rose-500/15 text-rose-400 border border-rose-500/25 rounded-xl shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                {pendingPeersCount} Pending Study Peer Request{pendingPeersCount === 1 ? '' : 's'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setView?.('peers')}
            className="flex items-center justify-center gap-1.5 h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white px-4 text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0 self-start md:self-center"
          >
            <span>Open Peer Lounge</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Read-Only Overdue Study Goals Notice (Links to Daily Targets to resolve) */}
      {overdueDashboardTasks.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-cav-card border border-amber-500/40 text-amber-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-sm text-amber-200">
                  {overdueDashboardTasks.length} Overdue Study Goal{overdueDashboardTasks.length === 1 ? '' : 's'} in Schedule
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setView?.('tasks')}
              className="h-9 px-4 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border border-amber-500/35 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 self-start lg:self-center"
            >
              <ListTodo className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span>Manage in Study Planner</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {dashboardSubTab === 'roadmap' ? (
        <SyllabusRoadmap examDate={examDate} darkMode={darkMode} />
      ) : (
        <motion.div
          id="dashboard-active-view"
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Row 1: Read-Only Student Status Snapshot Strip (4 Equal-Height Presentation Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {/* Card 1: Today's Study Schedule Status */}
            <div className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between gap-3 h-full">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span className="font-bold text-indigo-400 uppercase">Today&apos;s Schedule</span>
                  <span className="tabular-nums">
                    {todayCompletedTasksCount}/{todayDashboardTasks.length} Done
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Daily Checklist Status
                </h3>
              </div>
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className={todayPendingTasks.length === 0 && todayDashboardTasks.length > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                  {todayPendingTasks.length === 0 && todayDashboardTasks.length > 0
                    ? 'All Today Targets Met'
                    : `${todayPendingTasks.length} Pending Today`}
                </span>
                <button
                  type="button"
                  onClick={() => setView?.('tasks')}
                  className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer transition"
                >
                  <span>Study Planner</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Backlog & Pacing Alignment */}
            <div className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between gap-3 h-full">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span className="font-bold text-emerald-400 uppercase">Backlog Status</span>
                  <span className="tabular-nums">
                    {overdueDashboardTasks.length === 0 ? 'Clear' : `${overdueDashboardTasks.length} Overdue`}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Schedule Alignment
                </h3>
              </div>
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className={overdueDashboardTasks.length === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {overdueDashboardTasks.length === 0 ? 'On Track' : 'Needs Reschedule'}
                </span>
                <button
                  type="button"
                  onClick={() => setView?.('tasks')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 cursor-pointer transition"
                >
                  <span>Study Planner</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Today's Focus Sessions */}
            <div className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between gap-3 h-full">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span className="font-bold text-amber-400 uppercase">Focus Telemetry</span>
                  <span className="tabular-nums">{dailyGoalProgress.sessionsToday} Block{dailyGoalProgress.sessionsToday === 1 ? '' : 's'}</span>
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Today&apos;s Focus Output
                </h3>
              </div>
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold tabular-nums">
                  {formatMinutes(dailyGoalProgress.todayMins)} / {formatMinutes(dailyGoalProgress.goalMins)}
                </span>
                <button
                  type="button"
                  onClick={() => setView?.('pomodora')}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer transition"
                >
                  <span>Focus Timer</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Card 4: Multi-Cycle Revision Coverage */}
            <div className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between gap-3 h-full">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span className="font-bold text-cyan-400 uppercase">Retention Matrix</span>
                  <span className="tabular-nums">{chapterRevisionHoursData.chaptersCovered} Chaps</span>
                </div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">
                  Revision Coverage (R1–R3)
                </h3>
              </div>
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-cyan-400 font-bold tabular-nums">
                  {chapterRevisionHoursData.totalRevisionHours}h Total
                </span>
                <button
                  type="button"
                  onClick={() => setView?.('revision')}
                  className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-0.5 cursor-pointer transition"
                >
                  <span>Revision Report</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Row 2: Daily Study Target Visualizer (Read-Only) + 4 Non-Duplicate Student KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left (7 cols): Daily Study Target Ring (Read-Only Presentation) */}
            <motion.div
              id="dashboard-daily-goal-ring-card"
              variants={itemVariants}
              className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between gap-5"
            >
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                {/* SVG Progress Ring */}
                <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90 overflow-visible" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="dailyGoalRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f3ff" />
                        <stop offset="50%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor={dailyGoalProgress.isGoalAchieved ? '#10b981' : '#d6a836'} />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="10"
                      className="text-slate-100 dark:text-slate-800/80"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="transparent"
                      stroke="url(#dailyGoalRingGradient)"
                      strokeWidth="10"
                      strokeDasharray={301.59}
                      initial={{ strokeDashoffset: 301.59 }}
                      animate={{ strokeDashoffset: 301.59 - (dailyGoalProgress.percentage / 100) * 301.59 }}
                      transition={{ duration: 1.0, ease: 'easeOut' }}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
                    <span className="text-lg font-black font-display text-slate-900 dark:text-white leading-none tabular-nums">
                      {dailyGoalProgress.percentage}%
                    </span>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 mt-1">
                      {dailyGoalProgress.isGoalAchieved ? 'Goal Met' : 'Today'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
                    <span className="font-bold uppercase tracking-wider text-slate-400">
                      Daily Study Target Progress
                    </span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span
                      className={`font-bold ${
                        dailyGoalProgress.isGoalAchieved ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {dailyGoalProgress.isGoalAchieved ? 'Target Achieved' : 'In Progress'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white tabular-nums">
                      {formatMinutes(dailyGoalProgress.todayMins)}
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      / <strong className="text-slate-200">{formatMinutes(dailyGoalProgress.goalMins)}</strong> daily goal
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs font-mono">
                <div className="flex items-center gap-3 text-slate-400">
                  <span>
                    Target: <strong className="text-white">{formatMinutes(dailyGoalProgress.goalMins)}/day</strong>
                  </span>
                  <span aria-hidden="true" className="text-slate-700">·</span>
                  <span>
                    Sessions Today: <strong className="text-cyan-400 tabular-nums">{dailyGoalProgress.sessionsToday}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setView?.('profile')}
                  className="text-slate-400 hover:text-cav-accent font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <span>Adjust Target in Profile</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>

            {/* Right (5 cols): 2x2 Essential Student KPI Grid (Read-Only) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4 items-stretch">
              {/* KPI 1: 7-Day Consistency */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 truncate">7-Day Consistency</span>
                  <Calendar className="h-4 w-4 text-violet-400 shrink-0" />
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums">
                      {consistencyScoreData.percentage}%
                    </span>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      ({consistencyScoreData.metCount}/7d)
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-violet-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${consistencyScoreData.percentage}%` }}
                  />
                </div>
              </motion.div>

              {/* KPI 2: 7-Day Clean Study Pace */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 truncate">7-Day Study Pace</span>
                  <TrendingUp className="h-4 w-4 text-cav-accent shrink-0" />
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums">
                      {formatMinutes(weeklyPace.cleanAvg)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">/ day</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono truncate">
                  {weeklyPace.activeDaysCount} active study day{weeklyPace.activeDaysCount === 1 ? '' : 's'}
                </span>
              </motion.div>

              {/* KPI 3: Total Curriculum Hours */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 truncate">Curriculum Hours</span>
                  <Clock className="h-4 w-4 text-cyan-400 shrink-0" />
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tabular-nums">
                      {weeklySubjectStudySummary.totalHours}h
                    </span>
                    <span className="text-xs text-slate-400 font-mono tabular-nums">
                      / {weeklySubjectStudySummary.totalTargetHours}h
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-cyan-400 font-mono truncate tabular-nums">
                  {weeklySubjectStudySummary.overallProgress}% of target logged
                </span>
              </motion.div>

              {/* KPI 4: Practice MCQ Accuracy */}
              <motion.div
                variants={itemVariants}
                className="p-4 rounded-2xl bg-cav-card border border-cav-border flex flex-col justify-between"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-400 truncate">MCQ Accuracy</span>
                  <Target className="h-4 w-4 text-emerald-400 shrink-0" />
                </div>
                <div className="my-2">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-2xl font-extrabold font-display tabular-nums ${
                        overallStats.accuracy >= 75
                          ? 'text-cav-emerald'
                          : overallStats.accuracy >= 50
                          ? 'text-cav-amber'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {overallStats.accuracy}%
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 font-mono truncate tabular-nums">
                  {overallStats.correct}/{overallStats.total} correct answers
                </span>
              </motion.div>
            </div>
          </div>

          {/* Row 3: Consistency Calendar & Study Streak (Read-Only Presentation) */}
          <StudyStreak
            focusSessions={focusSessions}
            dailyGoalMinutes={dailyGoalMinutes}
          />

          {/* Row 4: CA Final Subject Study Hours & Target Progress (Read-Only Presentation) */}
          <motion.div
            variants={itemVariants}
            id="weekly-subject-hours-distribution-chart-card"
            className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs space-y-6 text-left"
          >
            {/* Header with Title & Timeframe Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-cav-accent shrink-0" />
                  <h3 className="font-display font-bold text-white text-base">
                    CA Final Subject Study Hours &amp; Target Progress
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {/* Timeframe View Filter */}
                <div className="flex items-center bg-slate-950/90 border border-slate-800 rounded-xl p-1 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setSubjectTargetTimeframe('all_time')}
                    className={`h-7 px-3 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      subjectTargetTimeframe === 'all_time'
                        ? 'bg-cav-accent text-slate-950 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    All-Time
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubjectTargetTimeframe('current_week')}
                    className={`h-7 px-3 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      subjectTargetTimeframe === 'current_week'
                        ? 'bg-cav-accent text-slate-950 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubjectTargetTimeframe('current_month')}
                    className={`h-7 px-3 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                      subjectTargetTimeframe === 'current_month'
                        ? 'bg-cav-accent text-slate-950 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    This Month
                  </button>
                </div>
              </div>
            </div>

            {/* Main Recharts Dual-Visual Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* 1. Recharts Horizontal Progress Bar Chart */}
              <div className="lg:col-span-7 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <BarChart3 className="h-4 w-4 text-cav-accent" />
                    Study Hours per Subject
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {weeklySubjectStudySummary.timeframeLabel}
                  </span>
                </div>

                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={weeklySubjectStudySummary.chartData}
                      margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                      barCategoryGap="16%"
                    >
                      <CartesianGrid stroke="rgba(71, 85, 105, 0.3)" strokeDasharray="3 3" horizontal={false} />
                      <XAxis
                        type="number"
                        stroke="#cbd5e1"
                        fontSize={10}
                        fontFamily="JetBrains Mono, monospace"
                        tickLine={false}
                        tickFormatter={(v) => `${v}h`}
                        domain={[0, (dataMax: number) => Math.max(dataMax, 100) + 15]}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        stroke="#f8fafc"
                        fontSize={11}
                        fontFamily="JetBrains Mono, monospace"
                        tickLine={false}
                        width={45}
                      />
                      <Tooltip content={<WeeklySubjectStudyProgressTooltip />} />
                      <Bar
                        dataKey="hours"
                        name="Hours Studied"
                        radius={[0, 6, 6, 0]}
                        maxBarSize={22}
                        isAnimationActive={false}
                      >
                        {weeklySubjectStudySummary.chartData.map((entry, index) => (
                          <Cell key={`bar-cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Recharts Distribution Donut Chart */}
              <div className="lg:col-span-5 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <PieChartIcon className="h-4 w-4 text-cav-accent" />
                    Subject Share (%)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {weeklySubjectStudySummary.targetsMetCount}/6 Targets Met
                  </span>
                </div>

                <div className="w-full h-[175px] relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<WeeklySubjectStudyProgressTooltip />} />
                      <Pie
                        data={weeklySubjectStudySummary.pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={74}
                        paddingAngle={weeklySubjectStudySummary.totalHours > 0 ? 3 : 0}
                        isAnimationActive={false}
                      >
                        {weeklySubjectStudySummary.pieData.map((entry, index) => (
                          <Cell key={`pie-cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-lg font-display font-extrabold text-white leading-none tabular-nums">
                      {weeklySubjectStudySummary.totalHours}h
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">
                      Logged
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/60 text-[10px] font-mono">
                  {weeklySubjectStudySummary.chartData.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80"
                    >
                      <div className="flex items-center gap-1 truncate">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                        <span className="font-bold text-white">{s.name}</span>
                      </div>
                      <span className="font-bold tabular-nums" style={{ color: s.color }}>
                        {s.hours}h
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Read-Only Progress Cards for Each CA Final Subject */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                <span className="flex items-center gap-1.5 text-white text-sm font-display font-bold">
                  <Target className="h-4 w-4 text-cav-accent" />
                  Individual Subject Target Progress
                </span>
                <button
                  type="button"
                  onClick={() => setView?.('revision')}
                  className="text-xs font-mono text-slate-400 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer self-start sm:self-auto"
                >
                  <span>Configure Subject Hourly Targets in Revision Report</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 items-stretch">
                {weeklySubjectStudySummary.chartData.map((subject) => {
                  const isMet = subject.hours >= subject.targetHours && subject.targetHours > 0;
                  const isOnTrack = subject.hours >= subject.targetHours * 0.5 && !isMet;

                  return (
                    <div
                      key={subject.id}
                      className={`p-4 rounded-xl bg-slate-900/85 border flex flex-col justify-between gap-3 transition-all ${
                        isMet ? 'border-emerald-500/40' : 'border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="text-xs font-mono font-black px-2 py-0.5 rounded-md shrink-0"
                            style={{
                              backgroundColor: `${subject.color}20`,
                              color: subject.color,
                              border: `1px solid ${subject.color}45`
                            }}
                          >
                            {subject.id}
                          </span>
                          <span className="text-xs font-bold text-white truncate" title={subject.fullName}>
                            {subject.fullName}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono font-bold uppercase shrink-0 ${
                            isMet
                              ? 'text-emerald-400'
                              : isOnTrack
                              ? 'text-cyan-400'
                              : subject.hours > 0
                              ? 'text-amber-400'
                              : 'text-slate-400'
                          }`}
                        >
                          {isMet ? 'Target Met' : isOnTrack ? 'On Track' : subject.hours > 0 ? 'In Progress' : 'Pending'}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-baseline justify-between text-xs font-mono tabular-nums">
                          <span className="text-slate-300 flex items-baseline gap-1">
                            <strong className="text-white font-display text-base font-extrabold">{subject.hours}h</strong>
                            <span className="text-slate-500">/</span>
                            <span className="text-amber-400 font-bold">{subject.targetHours}h target</span>
                          </span>
                          <span className={`font-black ${isMet ? 'text-emerald-400' : isOnTrack ? 'text-cyan-400' : 'text-white'}`}>
                            {subject.targetProgress}%
                          </span>
                        </div>

                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, subject.targetProgress)}%`,
                              backgroundColor: subject.color
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10.5px] font-mono text-slate-400 pt-0.5 tabular-nums">
                          <span>
                            {subject.remainingHours > 0
                              ? `${subject.remainingHours}h remaining`
                              : `Goal met (+${+(subject.hours - subject.targetHours).toFixed(1)}h)`}
                          </span>
                          <span>
                            {subject.sessionsCount} session{subject.sessionsCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Row 5: Chapter Revision Cycle Hours Analysis */}
          <motion.div
            variants={itemVariants}
            id="recharts-chapter-revision-cycles-card"
            className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs space-y-5 text-left"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/60 pb-4">
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  Chapter Revision Cycle Hours (Baseline → R3 &amp; 1.5D Sprint)
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Revision Hours: </span>
                  <strong className="text-indigo-400 tabular-nums">{chapterRevisionHoursData.totalRevisionHours}h</strong>
                </div>
                <span aria-hidden="true" className="text-slate-700">·</span>
                <div>
                  <span className="text-slate-400">Chapters Revised: </span>
                  <strong className="text-emerald-400 tabular-nums">{chapterRevisionHoursData.chaptersCovered}</strong>
                </div>
              </div>
            </div>

            {/* Subject Filter Pills + Sort & Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1 font-mono uppercase">Subject:</span>
                {([...levelSubjectIds, 'All'] as const).map((sub) => {
                  const isActive = selectedRevisionSubject === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSelectedRevisionSubject(sub)}
                      className={`h-7 px-2.5 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700/80'
                      }`}
                    >
                      {sub}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setChapterSortMode((prev) => (prev === 'hours' ? 'order' : 'hours'))}
                  className="h-7 px-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/60 flex items-center gap-1.5 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <ArrowUpDown className="h-3 w-3 text-indigo-400" />
                  <span>{chapterSortMode === 'hours' ? 'Sorted by Hours' : 'Syllabus Order'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilterOnlyWithHours((prev) => !prev)}
                  className={`h-7 px-2.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    filterOnlyWithHours
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                  }`}
                >
                  <Filter className="h-3 w-3 text-indigo-400" />
                  <span>{filterOnlyWithHours ? 'Only Revised (>0h)' : 'All Chapters'}</span>
                </button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-[11px] font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#38bdf8]" />
                  <span className="text-slate-300">1st Read / Initial</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#8b5cf6]" />
                  <span className="text-slate-300">Revision 1</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                  <span className="text-slate-300">Revision 2 &amp; 3</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ec4899]" />
                  <span className="text-slate-300">Final 1.5D Boost</span>
                </div>
              </div>

              {chapterRevisionHoursData.isDemoData && (
                <span className="text-[11px] font-mono text-amber-400/90">
                  Sample benchmark preview until session logs are added
                </span>
              )}
            </div>

            <div className="w-full h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chapterRevisionHoursData.data}
                  margin={{ top: 15, right: 15, left: -20, bottom: 100 }}
                  barCategoryGap="12%"
                >
                  <CartesianGrid
                    stroke={darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
                    strokeDasharray="3 3"
                  />
                  <XAxis
                    dataKey="chapterName"
                    stroke={darkMode ? '#94a3b8' : '#475569'}
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                    tickLine={false}
                    interval={0}
                    angle={-90}
                    textAnchor="end"
                    height={105}
                    dy={5}
                    dx={-4}
                    tickFormatter={(val) => (val.length > 25 ? val.slice(0, 23) + '...' : val)}
                  />
                  <YAxis
                    stroke={darkMode ? '#94a3b8' : '#475569'}
                    fontSize={10}
                    fontFamily="JetBrains Mono, monospace"
                    tickLine={false}
                    tickFormatter={(v) => `${v}h`}
                  />
                  <Tooltip content={<ChapterRevisionTooltip />} />
                  <Bar dataKey="read1" name="1st Read / Initial" stackId="revStack" fill="#38bdf8" maxBarSize={38} isAnimationActive={false} />
                  <Bar dataKey="rev1" name="Revision 1" stackId="revStack" fill="#8b5cf6" maxBarSize={38} isAnimationActive={false} />
                  <Bar dataKey="rev23" name="Revision 2 & 3" stackId="revStack" fill="#f59e0b" maxBarSize={38} isAnimationActive={false} />
                  <Bar dataKey="finalRev" name="Final 1.5D Boost" stackId="revStack" fill="#ec4899" radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Row 6: Study Pace Trend & 7-Day 24h Block Allocation (2-Column Equal-Height Grid) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            {/* Left: Study Pace Trend & Velocity Analytics */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between space-y-5 text-left"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
                <div>
                  <h3 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cav-accent" />
                    Study Pace Trend &amp; Target Velocity
                  </h3>
                </div>

                <select
                  value={paceTimeframe}
                  onChange={(e) => setPaceTimeframe(e.target.value as any)}
                  className="h-8 bg-slate-900 border border-slate-700/80 hover:border-amber-500/50 text-amber-300 text-xs font-mono font-bold rounded-xl px-3 focus:outline-hidden cursor-pointer transition shrink-0"
                >
                  <option value="current_week">Current Week</option>
                  <option value="last_week">Last Week</option>
                  <option value="current_month">Current Month</option>
                  <option value="last_30_days">Last 30 Days</option>
                  <option value="last_month">Last Month</option>
                </select>
              </div>

              {/* Compact Pace Summary Strip */}
              <div className="grid grid-cols-3 gap-3 text-left font-mono">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 block">30-Day Pace</span>
                  <span className="text-sm font-bold text-emerald-400 font-sans tabular-nums">
                    {formatMinutes(monthlyPace.cleanAvg)}/d
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 block">Peak Window</span>
                  <span className="text-sm font-bold text-indigo-400 font-sans truncate block">
                    {peakWindow.name}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <span className="text-[10px] uppercase text-slate-400 block">Endurance</span>
                  <span className="text-sm font-bold text-violet-400 font-sans tabular-nums">
                    {studyEfficiency.ratio}%
                  </span>
                </div>
              </div>

              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={selectedPaceStudyData.dataset} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="studyPaceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      stroke={darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                      fontSize={9}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                      interval={paceTimeframe.includes('week') ? 0 : selectedPaceStudyData.dataset.length > 15 ? 2 : 0}
                    />
                    <YAxis
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                      tickFormatter={(v) => `${+(v / 60).toFixed(1)}h`}
                    />
                    <Tooltip content={<StudyPaceTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="minutes"
                      name="Study Minutes"
                      stroke="#00f3ff"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#studyPaceGrad)"
                      isAnimationActive={false}
                    />
                    <ReferenceLine
                      y={selectedPaceStudyData.cleanAvg}
                      stroke="#fb923c"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{
                        value: `Clean Pace (${formatMinutes(selectedPaceStudyData.cleanAvg)})`,
                        fill: '#fb923c',
                        fontSize: 9,
                        fontFamily: 'JetBrains Mono, monospace',
                        position: 'top'
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Right: 7-Day Continuous Block Allocation (24h Stack) */}
            <motion.div
              variants={itemVariants}
              id="pomodoro-focus-bar-chart-card"
              className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between space-y-5 text-left"
            >
              <div className="border-b border-slate-800/60 pb-4">
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Clock className="h-5 w-5 text-cav-accent" />
                  7-Day 24-Hour Time Allocation Stack
                </h3>
              </div>

              {/* Time-of-Day Productivity Strip */}
              <div className="grid grid-cols-4 gap-2 text-left font-mono">
                {timeOfDayChartData.map((w) => (
                  <div key={w.window} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block truncate">{w.window}</span>
                    <span className="text-xs font-bold text-white tabular-nums">{w.percent}%</span>
                  </div>
                ))}
              </div>

              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7DaysFocusData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }} barCategoryGap="14%">
                    <CartesianGrid
                      stroke={darkMode ? 'rgba(51, 65, 85, 0.2)' : 'rgba(226, 232, 240, 0.7)'}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                    />
                    <YAxis
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                      domain={[0, 1440]}
                      ticks={[0, 360, 720, 1080, 1440]}
                      tickFormatter={(v) => `${v / 60}h`}
                    />
                    <Tooltip content={<FocusTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={32}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', paddingTop: '8px' }}
                    />
                    <Bar dataKey="focusMinutes" name="Study Focus" stackId="daily_stack" fill="#00f3ff" isAnimationActive={false} />
                    <Bar dataKey="breakRoutineMinutes" name="Break & Routines" stackId="daily_stack" fill="#10b981" isAnimationActive={false} />
                    <Bar dataKey="sleepMinutes" name="Rest & Sleep" stackId="daily_stack" fill="#6366f1" isAnimationActive={false} />
                    <Bar
                      dataKey="idleMinutes"
                      name="Unallocated"
                      stackId="daily_stack"
                      fill={darkMode ? '#334155' : '#94a3b8'}
                      isAnimationActive={false}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Row 7: Subject Practice Volume vs Accuracy + Weakest Syllabus Sectors (12-Col Equal-Height Split) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left (7 cols): Subject Practice Volume vs. Accuracy Matrix */}
            <motion.div
              variants={itemVariants}
              id="subject-performance-dual-matrix"
              className="lg:col-span-7 p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between space-y-4 text-left"
            >
              <div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Target className="h-5 w-5 text-cav-accent" />
                  Subject Practice Volume vs. Accuracy Matrix
                </h3>
              </div>

              <div className="w-full h-[270px] pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={subjectPerformanceData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                    <CartesianGrid
                      stroke={darkMode ? 'rgba(51, 65, 85, 0.3)' : 'rgba(226, 232, 240, 0.8)'}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke={darkMode ? '#94a3b8' : '#475569'}
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      domain={[0, 100]}
                      stroke="#10b981"
                      fontSize={10}
                      fontFamily="JetBrains Mono, monospace"
                      tickLine={false}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip content={<SubjectPerformanceTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Plus Jakarta Sans, sans-serif', paddingTop: '6px' }} />
                    <Bar yAxisId="left" dataKey="totalAttempts" name="MCQ Volume (Questions)" fill="#00f3ff" radius={[4, 4, 0, 0]} maxBarSize={38}>
                      {subjectPerformanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                      ))}
                    </Bar>
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="accuracy"
                      name="Accuracy %"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: '#10b981' }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Right (5 cols): Weakest Syllabus Sectors */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between space-y-5 text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 text-cav-rose">
                    <AlertTriangle className="h-5 w-5 shrink-0" />
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">
                      Weakest Syllabus Sectors
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 tabular-nums">
                    {weakestChapters.length} Priority
                  </span>
                </div>

                {weakestChapters.length === 0 ? (
                  <div className="text-center py-8 px-4 rounded-xl bg-slate-950/40 border border-dashed border-slate-800 text-xs text-slate-400">
                    Complete MCQ practice sessions in the Practice Arena to identify chapter-level accuracy gaps.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {weakestChapters.map(([title, stats]) => {
                      const id = stats.subject;
                      const subjectsColors: Record<string, string> = {
                        AFM: '#00d4ff',
                        FR: '#a78bfa',
                        Audit: '#34d399',
                        DT: '#fb923c',
                        IDT: '#f472b6',
                        IBS: '#facc15'
                      };
                      const color = subjectsColors[id] || '#00d4ff';
                      return (
                        <div
                          key={title}
                          className="p-3.5 rounded-xl border border-cav-rose/20 bg-cav-rose/5 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono uppercase font-bold" style={{ color }}>
                              {stats.subject}
                            </span>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                              {title.split(' - ')[1] || title}
                            </p>
                          </div>
                          <div className="text-right shrink-0 font-mono tabular-nums">
                            <p className="text-sm font-bold text-cav-rose">{stats.accuracy}%</p>
                            <p className="text-[10px] text-slate-400">
                              {stats.correct}/{stats.total} correct
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-300 leading-relaxed">
                  {weakestChapters.length > 0
                    ? `Recommended next drill: ${weakestChapters[0][0].split(' - ')[1] || weakestChapters[0][0]}`
                    : 'All practiced chapters meet the 60%+ target accuracy threshold.'}
                </p>
                <button
                  type="button"
                  onClick={() => setView && setView('practice')}
                  className="h-8 px-3 rounded-lg bg-cav-accent/15 hover:bg-cav-accent/25 border border-cav-accent/30 text-cav-accent text-xs font-bold transition cursor-pointer whitespace-nowrap shrink-0"
                >
                  Practice Arena
                </button>
              </div>
            </motion.div>
          </div>

          {/* Row 8: Saved Statutory Provisions Deck & Recent Practice Feed (2-Column Equal-Height Read-Only Grid) */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
            {/* Left: Saved Statutory Provisions Deck (Read-Only Presentation) */}
            <motion.div
              variants={itemVariants}
              id="dashboard-favorites-deck"
              className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between space-y-4 text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <Star className="h-4.5 w-4.5 text-cav-amber fill-current" />
                      Saved Statutory Provisions Deck
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-mono font-bold text-cav-amber tabular-nums">
                      {bookmarkedSections.length} Saved
                    </span>
                    <button
                      type="button"
                      onClick={() => setView?.('subjects')}
                      className="text-xs font-mono font-bold text-slate-400 hover:text-cav-accent flex items-center gap-0.5 transition cursor-pointer"
                    >
                      <span>Study Guide</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {bookmarkedSections.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-cav-card2 border border-dashed border-cav-border">
                    <p className="text-xs text-slate-400 font-medium">No bookmarked statutory provisions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
                    {bookmarkedSections.map((sec) => {
                      const subColors: Record<string, string> = {
                        DT: '#fb923c',
                        IDT: '#f472b6'
                      };
                      const color = subColors[sec.subjectId] || '#00d4ff';
                      return (
                        <div
                          key={`${sec.subjectId}-${sec.number}`}
                          id={`fav-deck-item-${sec.subjectId}-${sec.number}`}
                          className="p-3.5 rounded-xl border bg-cav-card2 border-cav-border flex items-start justify-between gap-3"
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 text-xs font-mono">
                              <span className="font-bold" style={{ color }}>
                                {sec.subjectId}
                              </span>
                              <span aria-hidden="true" className="text-slate-600">·</span>
                              <span className="font-bold text-slate-200">{sec.number}</span>
                            </div>
                            <h4 className="font-display font-bold text-xs text-slate-900 dark:text-white leading-snug">
                              {sec.heading}
                            </h4>
                            <p className="text-[11px] text-slate-400 line-clamp-2" title={sec.purpose}>
                              {sec.purpose}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right: Chronological Practice Feed & Chapter Telemetry (Read-Only) */}
            <motion.div
              variants={itemVariants}
              id="dashboard-recent-activity"
              className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-xs flex flex-col justify-between space-y-4 text-left"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                      <Clock className="h-4.5 w-4.5 text-slate-400" />
                      Recent MCQ Practice Attempts &amp; Chapter Log
                    </h3>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {practiceAttempts.length} Total
                    </span>
                    <button
                      type="button"
                      onClick={() => setView?.('practice')}
                      className="text-xs font-mono font-bold text-slate-400 hover:text-cav-accent flex items-center gap-0.5 transition cursor-pointer"
                    >
                      <span>Practice Arena</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {practiceAttempts.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-cav-card2 border border-dashed border-cav-border">
                    <p className="text-xs text-slate-400 font-medium">No practice attempts recorded yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto max-h-[320px]">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-cav-border text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                          <th className="py-2 px-2.5">Timestamp</th>
                          <th className="py-2 px-2.5">Subject</th>
                          <th className="py-2 px-2.5">Chapter</th>
                          <th className="py-2 px-2.5">Question ID</th>
                          <th className="py-2 px-2.5 text-right">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cav-border bg-cav-card2/50">
                        {practiceAttempts
                          .slice(-15)
                          .reverse()
                          .map((attempt, index) => {
                            const subColors: Record<string, string> = {
                              AFM: '#00d4ff',
                              FR: '#a78bfa',
                              Audit: '#34d399',
                              DT: '#fb923c',
                              IDT: '#f472b6',
                              IBS: '#facc15'
                            };
                            const color = subColors[attempt.subjectId] || '#00d4ff';
                            return (
                              <tr key={`${attempt.timestamp}-${index}`} className="hover:bg-cav-card transition-colors">
                                <td className="py-2.5 px-2.5 text-slate-400 font-mono tabular-nums whitespace-nowrap">
                                  {new Date(attempt.timestamp).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </td>
                                <td className="py-2.5 px-2.5 font-mono font-bold whitespace-nowrap" style={{ color }}>
                                  {attempt.subjectId}
                                </td>
                                <td className="py-2.5 px-2.5 font-medium text-slate-200 truncate max-w-[160px]" title={attempt.chapterName}>
                                  {attempt.chapterName}
                                </td>
                                <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                                  {attempt.questionId}
                                </td>
                                <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                                  {attempt.isCorrect ? (
                                    <span className="inline-flex items-center gap-1 text-cav-emerald font-bold uppercase font-mono text-[10px]">
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-cav-rose font-bold uppercase font-mono text-[10px]">
                                      <XCircle className="h-3.5 w-3.5" /> Incorrect
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      {showPrintModal && (
        <PrintPreview
          practiceAttempts={practiceAttempts}
          bookmarkedSections={bookmarkedSections}
          onClose={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}

// ==========================================
// STATIC CA FINAL SYLLABUS ROADMAP BLUEPRINT
// ==========================================

const ROADMAP_SUBJECT_DETAILS = [
  {
    id: 'FR',
    name: 'FR',
    fullName: 'Financial Reporting',
    color: 'border-blue-500/20 bg-blue-500/5 text-blue-400',
    dotColor: 'bg-blue-500',
    chapters: [
      'Applicability of IND AS',
      'Ind AS 16 Property Plant & Equipment',
      'Ind AS 40 Investment Property',
      'Ind AS 38 Intangible Assets',
      'Ind AS 36 Impairment of Assets',
      'Ind AS 105 Non Current Assets Held For Sale',
      'Ind AS 23 Borrowing Costs',
      'Ind AS 2 Inventories',
      'Ind AS 41 Agriculture',
      'Ind AS 20 Accounting for Govt Grants',
      'Ind AS 113 Fair Value Measurement',
      'Ind AS 102 Share Based Payment',
      'Ind AS 116 Leases',
      'IND AS 37 Provisions, Contingent',
      'Ind AS 108 Operating Segments',
      'Analysis of FS',
      'Ind AS 19 Employee Benefits',
      'Financial Instruments',
      'Ind AS 33 Earnings Per Share',
      'Ind AS 34 Interim Financial Reporting',
      'Ind AS 1 Presentation of FS',
      'Ind AS 10 Events After the Reporting',
      'Ind AS 8 Acc Policies Errors',
      'Ind AS 7 Statement of Cash Flows',
      'Ind AS 12 Income Taxes',
      'Ind AS 103 Business Combination',
      'Consolidation',
      'JV & Associates',
      'Ind AS 24 Related Party Disclosures',
      'Ind AS 21 Forex',
      'Ind AS 115 Revenue',
      'Ind AS 101 First Time Adoption',
      'Conceptual Framework',
      'Professional and Ethical Duty of CA',
      'Accounting & Tech'
    ]
  },
  {
    id: 'AFM',
    name: 'AFM',
    fullName: 'Advanced Financial Management',
    color: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    dotColor: 'bg-amber-500',
    chapters: [
      'Financial Policy, Corporate Strategy & Macro Economics',
      'Capital Budgeting and Risk-Adjusted Decision Analysis',
      'Portfolio Theory & Security Analysis Models',
      'Mutual Funds & REITs/InvITs Practical Valuations',
      'Derivatives Analysis, Futures & Options Payoffs',
      'Foreign Exchange Exposure & Risk Management Techniques',
      'International Financial Management & Cross-Border Fundings',
      'Interest Rate Risk Management & Hedging Instruments',
      'Corporate Restructuring, Mergers & Acquisitions Valuation',
      'Startup Finance & Venture Capital Valuation Methods'
    ]
  },
  {
    id: 'Audit',
    name: 'Audit',
    fullName: 'Advanced Auditing, Assurance and Professional Ethics',
    color: 'border-purple-500/20 bg-purple-500/5 text-purple-400',
    dotColor: 'bg-purple-500',
    chapters: [
      'Quality Control',
      'General Auditing Principles and Auditors Responsibilities',
      'Audit Planning, Strategy and Execution',
      'Materiality, Risk Assessment and Internal Control',
      'Audit Evidence',
      'Completion and Review',
      'Reporting',
      'Specialised Areas',
      'Related Services',
      'Review of Financial Information',
      'Prospective Financial Information and Other Assurance Services',
      'Digital Auditing & Assurance',
      'Group Audits',
      'Special Features of Audit of Banks & Non-Banking Financial Companies',
      'Overview of Audit of Public Sector Undertakings',
      'Internal Audit',
      'Due Diligence, Investigation & Forensic Audit',
      'Sustainable Development Goals (SDG) & Environment, Social and Governance (ESG) Assurance',
      'Professional Ethics & Liabilities of Auditors'
    ]
  },
  {
    id: 'DT',
    name: 'DT',
    fullName: 'Direct Tax Laws & International Taxation',
    color: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    dotColor: 'bg-emerald-500',
    chapters: [
      'Basic Concepts',
      'Incomes which do not form part of Total Income',
      'Profits and Gains of Business or Profession',
      'Capital Gains',
      'Income from Other Sources',
      'Income of Other Persons included in Assessee\'s Total Income',
      'Aggregation of Income, Set Off or Carry Forward of Losses',
      'Deductions from Gross Total Income',
      'Assessment of Various Entities',
      'Assessment of Trusts and Institutions, Political Parties and Other Special Entities',
      'Tax Planning, Tax Avoidance and Tax Evasion',
      'Taxation of Digital Transactions',
      'Deduction, Collection and Recovery of Tax',
      'Income Tax Authorities',
      'Assessment Procedure',
      'Appeals and Revision',
      'Dispute Resolution',
      'Miscellaneous Provisions',
      'Provisions to Counteract Unethical Tax Practices',
      'Tax Audit and Ethical Compliances',
      'Non Resident Taxation',
      'Double Taxation Relief',
      'Advance Rulings',
      'Transfer Pricing',
      'Fundamentals Of Beps',
      'Application And Interpretation Of Tax Treaties',
      'Overview Of Model Tax Conventions',
      'Latest Developments In International Taxation'
    ]
  },
  {
    id: 'IDT',
    name: 'IDT',
    fullName: 'Indirect Tax Laws (GST & Customs)',
    color: 'border-rose-500/20 bg-rose-500/5 text-rose-400',
    dotColor: 'bg-rose-500',
    chapters: [
      'Supply under GST',
      'Charge of GST',
      'Place of Supply',
      'Exemptions from GST',
      'Time of Supply',
      'Value of Supply',
      'Input Tax Credit',
      'Registration',
      'Tax Invoice, Credit & Debit Notes',
      'Accounts and Records; E-way Bill',
      'Payment of Tax',
      'Electronic Commerce Transactions',
      'Returns',
      'Import and Export under GST',
      'Refunds',
      'Job Work',
      'Assessment and Audit',
      'Inspection, Search, Seizure and Arrest',
      'Demands and Recovery',
      'Liability to Pay in Certain Cases',
      'Offences and Penalties',
      'Appeals and Revision',
      'Advance Ruling',
      'Miscellaneous Provisions',
      'Levy of and Exemptions from Customs Duty',
      'Types of Duty',
      'Classification of Imported and Export Goods',
      'Valuation under the Customs Act, 1962',
      'Importation and Exportation of Goods',
      'Warehousing',
      'Customs Refunds',
      'Foreign Trade Policy'
    ]
  },
  {
    id: 'IBS',
    name: 'IBS',
    fullName: 'Integrated Business Solutions',
    color: 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400',
    dotColor: 'bg-indigo-500',
    chapters: [
      'Financial Reporting',
      'Advanced Financial Management',
      'Auditing',
      'Direct Taxes',
      'Indirect Taxes',
      'Corporate & Economic Laws',
      'SCMPE',
      'Case Scenarios'
    ]
  }
];

interface SyllabusRoadmapProps {
  examDate?: string;
  darkMode?: boolean;
}

interface PlannerCheckpoint {
  id: string;
  subjectId: SubjectId | 'CUSTOM';
  customTitle?: string;
  revisionCycle: '1st Revision' | '2nd Revision' | '3rd Revision' | 'Final Sprint' | 'Mock Exam' | 'Custom';
  targetDate: string; // YYYY-MM-DD
  targetChapters?: number;
  completedChapters?: string[];
  completed?: boolean;
  notes?: string;
}

export function SyllabusRoadmap({ examDate, darkMode }: SyllabusRoadmapProps) {
  // ==================== PLANNER MASTER ROADMAP SYNCHRONIZATION ====================
  // Synchronized with planner's practca_roadmap_user_checkpoints and master dates
  const [plannerCheckpoints, setPlannerCheckpoints] = useState<PlannerCheckpoint[]>(() => {
    try {
      const stored = localStorage.getItem('practca_roadmap_user_checkpoints');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  const [masterDates, setMasterDates] = useState<{ prepStartDate: string; examDate: string }>(() => {
    try {
      const stored = localStorage.getItem('practca_roadmap_master_dates');
      const globalExam = localStorage.getItem('practca_exam_date');
      const parsed = stored ? JSON.parse(stored) : {};
      return {
        prepStartDate: parsed.prepStartDate || new Date().toISOString().split('T')[0],
        examDate: globalExam || parsed.examDate || examDate || '2026-11-01'
      };
    } catch (e) {
      return {
        prepStartDate: new Date().toISOString().split('T')[0],
        examDate: examDate || '2026-11-01'
      };
    }
  });

  // Listen for roadmap checkpoint updates from Planner
  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = localStorage.getItem('practca_roadmap_user_checkpoints');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setPlannerCheckpoints(prev => JSON.stringify(prev) === JSON.stringify(parsed) ? prev : parsed);
          }
        } else {
          setPlannerCheckpoints(prev => prev.length === 0 ? prev : []);
        }
        const datesStored = localStorage.getItem('practca_roadmap_master_dates');
        const globalExam = localStorage.getItem('practca_exam_date');
        const parsedDates = datesStored ? JSON.parse(datesStored) : {};
        const nextPrep = parsedDates.prepStartDate || new Date().toISOString().split('T')[0];
        const nextExam = globalExam || parsedDates.examDate || examDate || '2026-11-01';
        setMasterDates(prev => (prev.prepStartDate === nextPrep && prev.examDate === nextExam) ? prev : {
          prepStartDate: nextPrep,
          examDate: nextExam
        });
      } catch (e) {}
    };

    window.addEventListener('practca_roadmap_checkpoints_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    autoCompleteFinalExamMilestonesAfter5PM();
    const timer = window.setInterval(() => {
      autoCompleteFinalExamMilestonesAfter5PM();
    }, 30000);
    return () => {
      window.removeEventListener('practca_roadmap_checkpoints_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      window.clearInterval(timer);
    };
  }, [examDate]);

  // Use synchronized exam date
  const targetDateStr = masterDates.examDate || examDate || '2026-11-01';
  const targetDate = useMemo(() => new Date(targetDateStr), [targetDateStr]);
  
  // Calculate exact days remaining from today until the ICAI attempt
  const totalDaysRemaining = useMemo(() => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const examTime = new Date(targetDateStr);
      examTime.setHours(0, 0, 0, 0);
      return Math.max(0, Math.ceil((examTime.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    } catch (e) {
      return 0;
    }
  }, [targetDateStr]);

  // Chronologically sorted planner checkpoints
  const sortedCheckpoints = useMemo(() => {
    return [...plannerCheckpoints].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  }, [plannerCheckpoints]);

  // Determine the next upcoming active checkpoint
  const nextUpcomingIndex = useMemo(() => {
    const nowMs = new Date().setHours(0, 0, 0, 0);
    return sortedCheckpoints.findIndex(cp => {
      const targetMs = new Date(cp.targetDate).setHours(0, 0, 0, 0);
      const totalChaps = cp.targetChapters || (cp.subjectId !== 'CUSTOM' ? SUBJECTS_METADATA[cp.subjectId]?.chapters.length : 0) || 0;
      const isCompleted = Boolean(cp.completed) || ((cp.completedChapters?.length || 0) >= totalChaps && totalChaps > 0);
      return !isCompleted && targetMs >= nowMs;
    });
  }, [sortedCheckpoints]);

  // Plain summarized nodes for the horizontal flowchart
  const roadmapFlowNodes = useMemo(() => {
    if (sortedCheckpoints.length === 0) return [];

    const nodes: {
      type: 'start' | 'checkpoint' | 'end';
      topTag: string;
      title: string;
      subText: string;
      isCurrent: boolean;
      isCompleted: boolean;
      subjectId?: string;
    }[] = [];

    // 1. Start Node
    nodes.push({
      type: 'start',
      topTag: 'START',
      title: 'Prep Kickoff',
      subText: masterDates.prepStartDate,
      isCurrent: nextUpcomingIndex === -1 && sortedCheckpoints.length === 0,
      isCompleted: true
    });

    // 2. User Checkpoints / Milestones
    sortedCheckpoints.forEach((cp, idx) => {
      const totalChaps = cp.targetChapters || (cp.subjectId !== 'CUSTOM' ? SUBJECTS_METADATA[cp.subjectId]?.chapters.length : 0) || 0;
      const doneCount = cp.completed ? totalChaps : (cp.completedChapters?.length || 0);
      const isDone = Boolean(cp.completed) || (doneCount >= totalChaps && totalChaps > 0);
      const isCurrent = idx === nextUpcomingIndex;

      const subName = cp.subjectId !== 'CUSTOM' ? (SUBJECTS_METADATA[cp.subjectId]?.name || cp.subjectId) : (cp.customTitle || 'Custom Milestone');

      nodes.push({
        type: 'checkpoint',
        topTag: cp.revisionCycle.toUpperCase(),
        title: subName,
        subText: `${cp.targetDate} • ${doneCount}/${totalChaps} Chaps`,
        isCurrent,
        isCompleted: isDone,
        subjectId: cp.subjectId
      });
    });

    // 3. Exam Destination Node
    nodes.push({
      type: 'end',
      topTag: 'EXAM',
      title: 'CA Final Exam',
      subText: `${targetDateStr} (${totalDaysRemaining}d)`,
      isCurrent: false,
      isCompleted: totalDaysRemaining === 0
    });

    return nodes;
  }, [sortedCheckpoints, masterDates, targetDateStr, totalDaysRemaining, nextUpcomingIndex]);

  // Generate monthly phases dynamically
  const baselineDate = new Date('2026-07-14');
  const months: { name: string; year: number; monthIndex: number; phase: string; details: string[] }[] = [];
  const startYear = baselineDate.getFullYear();
  const startMonth = baselineDate.getMonth();
  const endYear = targetDate.getFullYear();
  const endMonth = targetDate.getMonth();
  
  let currentYear = startYear;
  let currentMonth = startMonth;
  
  const phaseTemplates = [
    { phase: "Phase I: Foundation Kickoff", details: ["Establish continuous study routine of 6+ hours daily.", "Complete overviews of AFM quantitative techniques and FR standards.", "Organize statutory material binders for direct and indirect taxes."] },
    { phase: "Phase II: Core Concept Deep-Dive", details: ["Analyze high-weightage Ind AS (103, 110, 109) and AFM Mergers/Forex.", "Solve at least 10-12 practical numerical problems daily.", "Synthesize short cards for Direct Taxes PGBP adjustments and exemptions."] },
    { phase: "Phase III: Practice & Taxation Mastery", details: ["Complete direct and indirect taxation chapters.", "Trace and map inter-disciplinary connections for Integrated Case Studies.", "Perform weekly review of Auditing Standards (SAs) using clear mnemonics."] },
    { phase: "Phase IV: Consolidation & Full Revisions", details: ["Solve past 5 attempts of ICAI Question Papers under real timed conditions.", "Revise statutory interest rates, penal limits, and assessment deadlines.", "Solve the latest ICAI Revision Test Papers (RTP) and Mock Test Papers (MTP)."] },
    { phase: "Phase V: Exam Simulation & Quick Recalls", details: ["Evaluate performance discrepancies on full 3-hour mocks.", "Perform final rapid reviews of Professional Ethics clauses & schedules.", "Verify standard formulas for business mergers, forex hedges, and capital assets."] }
  ];

  let loop = 0;
  while ((currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) && loop < 12) {
    const d = new Date(currentYear, currentMonth, 1);
    const mName = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const assignedTemplate = phaseTemplates[Math.min(loop, phaseTemplates.length - 1)];
    
    months.push({
      name: mName,
      year: currentYear,
      monthIndex: currentMonth,
      phase: assignedTemplate.phase,
      details: assignedTemplate.details
    });
    
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    loop++;
  }

  // Fallback to a solid 3-month cycle if calculations yield zero months
  if (months.length === 0) {
    months.push(
      { name: "July 2026", year: 2026, monthIndex: 6, phase: "Phase I: Foundation Kickoff", details: ["Set up study goals", "Cover initial FR chapters"] },
      { name: "August 2026", year: 2026, monthIndex: 7, phase: "Phase II: Core Mastery", details: ["Solve practical exercises", "Complete DT chapters"] },
      { name: "September 2026", year: 2026, monthIndex: 8, phase: "Phase III: Revisions & Mocks", details: ["Complete paper solutions", "Solve RTPs and mocks"] }
    );
  }

  // Calculate study phase months (leaving the final month purely for revisions/mocks if >= 2 months exist)
  const syllabusStudyMonths = Math.max(1, months.length >= 2 ? months.length - 1 : months.length);

  const partitionList = (list: string[], partsCount: number) => {
    const partitioned: string[][] = Array.from({ length: partsCount }, () => []);
    if (list.length === 0) return partitioned;
    const itemsPerPart = Math.ceil(list.length / partsCount);
    for (let i = 0; i < partsCount; i++) {
      partitioned[i] = list.slice(i * itemsPerPart, (i + 1) * itemsPerPart);
    }
    return partitioned;
  };

  const subjectAllocations = ROADMAP_SUBJECT_DETAILS.map(subject => ({
    ...subject,
    parts: partitionList(subject.chapters, syllabusStudyMonths)
  }));

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      
      {/* 🚀 Top Summary Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-[#1e2440] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider">
              High-Yield Revision Report
            </span>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-xs font-semibold">CA Final Prep Roadmap</span>
          </div>
          <h2 className="text-lg md:text-xl font-black tracking-tight text-white font-display">
            Dynamic Syllabus Timeline Analysis
          </h2>
        </div>
        
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-850 text-center shrink-0 min-w-[160px] shadow-lg flex flex-col justify-center">
          <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-widest block">Days Remaining</span>
          <span className="text-4xl font-extrabold text-amber-400 font-display mt-1 block">
            {totalDaysRemaining}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-1.5 block">
            Targeting: {targetDate.toLocaleString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* 📍 Visual Horizontal Roadmap Flowchart (Linked with Planner Master Roadmap) */}
      <div className="p-6 rounded-2xl bg-cav-card border border-cav-border space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cav-accent" />
              <span>Text-Based Syllabus Progression Path</span>
            </h3>
          </div>
          {sortedCheckpoints.length > 0 && (
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 shrink-0 w-fit">
              ⚡ Linked to Planner Roadmap ({sortedCheckpoints.length} Target{sortedCheckpoints.length === 1 ? '' : 's'})
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-3 py-6 px-4 bg-slate-950/60 rounded-2xl border border-slate-800 shadow-inner">
          {roadmapFlowNodes.length > 0 ? (
            roadmapFlowNodes.map((node, idx) => (
              <React.Fragment key={`roadmap_node_${idx}`}>
                <div className={`flex flex-col items-center p-3 bg-slate-900 border rounded-xl w-44 text-center shadow-lg relative ${
                  node.isCurrent 
                    ? 'border-amber-400 ring-1 ring-amber-400/40 bg-amber-500/5' 
                    : node.isCompleted 
                    ? 'border-emerald-500/40 bg-emerald-500/5' 
                    : 'border-slate-800'
                }`}>
                  {node.isCurrent && (
                    <span className="absolute -top-2.5 -right-2 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                      ACTIVE GOAL
                    </span>
                  )}
                  {node.isCompleted && !node.isCurrent && (
                    <span className="absolute -top-2.5 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md">
                      DONE
                    </span>
                  )}
                  <span className={`text-[9px] font-mono font-black uppercase tracking-widest block leading-tight ${
                    node.type === 'start' ? 'text-emerald-400' : node.type === 'end' ? 'text-amber-400' : 'text-amber-300'
                  }`}>
                    {node.topTag}
                  </span>
                  <span className="text-xs font-black text-white mt-1 block truncate max-w-full font-sans" title={node.title}>
                    {node.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block font-semibold truncate max-w-full">
                    {node.subText}
                  </span>
                </div>
                {idx < roadmapFlowNodes.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))
          ) : (
            months.map((m, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center p-3 bg-slate-900 border border-slate-800 rounded-xl w-40 text-center shadow-lg relative">
                  {idx === 0 && (
                    <span className="absolute -top-2.5 -right-2 bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md animate-pulse">
                      CURRENT
                    </span>
                  )}
                  <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest block leading-tight">{m.phase.split(':')[0]}</span>
                  <span className="text-xs font-black text-white mt-1 block">{m.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1 block font-semibold truncate max-w-full">
                    {idx === months.length - 1 && months.length >= 2 ? "🎯 Final Review & Mocks" : m.phase.split(':')[1]?.trim() || "Concept Building"}
                  </span>
                </div>
                {idx < months.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* 📅 Target Subjects & Milestones Detailed Schedule (Linked with Planner) */}
      {sortedCheckpoints.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-white text-lg tracking-tight flex items-center gap-2">
                <span>Target Subjects & Checkpoints Schedule</span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                  {sortedCheckpoints.length} Set
                </span>
              </h3>
            </div>
          </div>

          <div className="p-6 rounded-2xl border bg-cav-card border-cav-border shadow-sm space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left border-collapse text-xs text-slate-100">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-200 font-mono font-bold uppercase tracking-wider">
                    <th className="p-3">Target Subject / Milestone</th>
                    <th className="p-3">Revision Cycle</th>
                    <th className="p-3">Target Date</th>
                    <th className="p-3">Chapters Status</th>
                    <th className="p-3">Pacing Status</th>
                    <th className="p-3">Revision Strategy & Guidance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-100">
                  {sortedCheckpoints.map((cp, cIdx) => {
                    const subjectMeta = cp.subjectId !== 'CUSTOM' ? SUBJECTS_METADATA[cp.subjectId] : null;
                    const totalChaps = cp.targetChapters || subjectMeta?.chapters.length || 0;
                    const completedChaps = cp.completed ? totalChaps : (cp.completedChapters?.length || 0);
                    const isDone = Boolean(cp.completed) || (completedChaps >= totalChaps && totalChaps > 0);
                    
                    const nowMs = new Date().setHours(0, 0, 0, 0);
                    const targetMs = new Date(cp.targetDate).setHours(0, 0, 0, 0);
                    const daysRemaining = Math.ceil((targetMs - nowMs) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <tr key={cp.id || cIdx} className="hover:bg-slate-900/40">
                        <td className="p-3 font-bold text-white min-w-[140px]">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded text-[9.5px] font-mono font-black border bg-amber-500/10 text-amber-300 border-amber-500/30">
                              {cp.subjectId}
                            </span>
                            <span>{cp.customTitle || subjectMeta?.fullName || cp.subjectId}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-300 font-bold">
                          {cp.revisionCycle}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-200">
                          {cp.targetDate}
                        </td>
                        <td className="p-3 font-mono font-bold">
                          <span className={isDone ? 'text-emerald-400' : 'text-cyan-400'}>
                            {completedChaps} / {totalChaps} Chapters ({totalChaps > 0 ? Math.round((completedChaps / totalChaps) * 100) : 0}%)
                          </span>
                        </td>
                        <td className="p-3">
                          {isDone ? (
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                              Completed
                            </span>
                          ) : daysRemaining < 0 ? (
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black bg-rose-500/15 text-rose-300 border border-rose-500/30">
                              {Math.abs(daysRemaining)}d Overdue
                            </span>
                          ) : daysRemaining === 0 ? (
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              Due Today
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30">
                              {daysRemaining} day{daysRemaining === 1 ? '' : 's'} remaining
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-slate-300 leading-relaxed text-[11px]">
                          {cp.notes || (
                            cp.subjectId === 'FR' ? 'Consolidate Ind AS 103/110 adjustments and 5-step model disclosures.' :
                            cp.subjectId === 'AFM' ? 'Solve practical forex hedging, futures, options, and portfolio risk calculations.' :
                            cp.subjectId === 'Audit' ? 'Practice SA paragraph citations, professional ethics clauses and audit reporting.' :
                            cp.subjectId === 'DT' ? 'Practice corporate PGBP adjustments, transfer pricing, and TDS statutory dates.' :
                            cp.subjectId === 'IDT' ? 'Track GST input tax credit blocks, place of supply, and customs valuation.' :
                            cp.subjectId === 'IBS' ? 'Analyze multi-disciplinary case scenarios mapping taxation, audit and law.' :
                            'Master allocated high-yield chapters for target checkpoint.'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 📅 Month-Wise Detailed Allocation */}
      <div className="space-y-6">
        <h3 className="font-display font-bold text-white text-lg tracking-tight">
          Phase-Wise Study Allocation Schedules
        </h3>
        
        {months.map((month, mIdx) => {
          const isFinalMonth = mIdx === months.length - 1 && months.length >= 2;
          
          return (
            <div 
              key={mIdx} 
              className={`p-6 rounded-2xl border bg-cav-card shadow-sm space-y-4 ${
                isFinalMonth ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.04)]' : 'border-cav-border'
              }`}
            >
              {/* Month Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest block">
                    {month.phase}
                  </span>
                  <h4 className="text-base font-black text-white font-display">
                    Syllabus Checklist: {month.name}
                  </h4>
                </div>
                
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-slate-400 w-fit">
                  {isFinalMonth ? "🔥 Exam Readiness Block" : `📅 Study Block ${mIdx + 1} of ${months.length}`}
                </div>
              </div>

              {/* Weekly Guidance */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-mono font-extrabold text-slate-200 uppercase tracking-wider block">
                  Actionable Phase Guidelines
                </span>
                <ul className="list-disc pl-4 text-xs text-slate-100 space-y-1.5">
                  {month.details.map((detail, dIdx) => (
                    <li key={dIdx} className="leading-relaxed">
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chapters Table */}
              {isFinalMonth ? (
                /* Final Month Intensive Revision Agenda */
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono font-extrabold text-amber-500 uppercase tracking-wider block">
                    Exam Month Intensive Revision Protocol
                  </span>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left border-collapse text-xs text-slate-100">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-200 font-mono font-bold uppercase tracking-wider">
                          <th className="p-3">Core Revision Domain</th>
                          <th className="p-3">Task Deliverable</th>
                          <th className="p-3">Practice Metric Target</th>
                          <th className="p-3">Statutory Guideline</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-100">
                        <tr>
                          <td className="p-3 font-bold text-white">ICAI Mock Test Papers (MTP)</td>
                          <td className="p-3">Solve at least 2 full-length 3-hour papers per subject.</td>
                          <td className="p-3 font-mono font-bold text-cyan-400">40+ hours timed writing</td>
                          <td className="p-3">Solve strictly between 2 PM and 5 PM to sync biological clock with actual exam hours.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Revision Test Papers (RTP)</td>
                          <td className="p-3">Analyze latest RTP questions and identify newly added case study patterns.</td>
                          <td className="p-3 font-mono font-bold text-emerald-400">100% completion</td>
                          <td className="p-3">Pay intense attention to DT & IDT statutory amendments issued up to 6 months prior.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">SAs & Ind AS Summary Cards</td>
                          <td className="p-3">Rapid verbal recall of standard numbers, titles, and principal disclosures.</td>
                          <td className="p-3 font-mono font-bold text-purple-400">Daily 30-min recalls</td>
                          <td className="p-3">Ensure exact ICAI keywords are integrated into professional auditing answers.</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">Formula & Rates Recitations</td>
                          <td className="p-3">Review AFM derivatives formulas, company MAT/AMT tax rates, and TDS thresholds.</td>
                          <td className="p-3 font-mono font-bold text-amber-400">100% memorization</td>
                          <td className="p-3">Maintain a formula cheat-sheet; recite right before sleep and immediately after waking.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* Allocated Chapters Table */
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono font-extrabold text-slate-200 uppercase tracking-wider block">
                    Syllabus Chapters Allocated
                  </span>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left border-collapse text-xs text-slate-100">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-[10px] text-slate-200 font-mono font-bold uppercase tracking-wider">
                          <th className="p-3">Subject</th>
                          <th className="p-3">Syllabus Chapters to Master</th>
                          <th className="p-3">Study Load</th>
                          <th className="p-3">Weightage Profile</th>
                          <th className="p-3">Revision Strategy</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-100">
                        {subjectAllocations.map((subj, sIdx) => {
                          const chapList = subj.parts[mIdx] || [];
                          if (chapList.length === 0) return null;
                          
                          return (
                            <tr key={sIdx} className="hover:bg-slate-900/40">
                              <td className="p-3 font-bold text-white min-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <span className={`h-2.5 w-2.5 rounded-full ${subj.dotColor}`}></span>
                                  <span>{subj.fullName} ({subj.name})</span>
                                </div>
                              </td>
                              <td className="p-3">
                                <ul className="list-disc pl-4 space-y-1">
                                  {chapList.map((chap, cIdx) => (
                                    <li key={cIdx} className="text-white">
                                      {chap}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <td className="p-3 font-mono font-bold text-white dark:text-cyan-400">
                                ~{chapList.length * 4} Hours
                              </td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                                  subj.id === 'FR' || subj.id === 'DT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {subj.id === 'FR' || subj.id === 'DT' ? 'High Weightage Core' : 'Scoring Core'}
                                </span>
                              </td>
                              <td className="p-3 text-slate-300 leading-relaxed">
                                {subj.id === 'FR' ? 'Focus on Ind AS disclosure compliance.' :
                                 subj.id === 'AFM' ? 'Solve detailed forex hedging illustrations.' :
                                 subj.id === 'Audit' ? 'Memorize SA paragraph references.' :
                                 subj.id === 'DT' ? 'Draft composite PGBP calculations.' :
                                 subj.id === 'IDT' ? 'Track input tax credit blockages under GST.' :
                                 'Cross-verify inter-disciplinary tax & law clauses.'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🌲 Hierarchical Strategy Tree */}
      <div className="p-6 rounded-2xl bg-cav-card border border-cav-border space-y-4 shadow-sm">
        <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-cav-accent" />
          ICAI Exam Revision Strategy Tree
        </h3>
        <pre className="font-mono text-[11px] leading-relaxed text-amber-400 bg-slate-950 p-5 rounded-2xl border border-slate-850 overflow-x-auto whitespace-pre">
{`CA FINAL CORE EXAM ROADMAP & STRATEGY
├── Group I: Financial Reporting & Strategic Finance (Weightage: 200 Marks)
│   ├── Financial Reporting (FR)
│   │   ├── Part A: Ind AS Core (Ind AS 103, 110, 109, 115, 116)
│   │   │   └── Priority: Extremely High | weightage: 55-60% | Drill: Practice 5-step model, consolidations
│   │   └── Part B: Other Ind AS & Ethics (Assets, Liabilities, Share Payments)
│   │       └── Priority: High | weightage: 40% | Drill: Concept recall and statutory differences
│   └── Advanced Financial Management (AFM)
│       ├── Part A: Mergers, Acquisitions & Foreign Exchange Exposure Risk
│       │   └── Priority: Critical | weightage: 45-50% | Drill: FX hedging, derivatives pricing models
│       └── Part B: Security, Portfolio, Mutual Funds & Startup Financing
│           └── Priority: High | weightage: 50% | Drill: Security valuation, risk-return metrics
├── Group II: Taxation, Auditing & Multi-Disciplinary Case Scenarios (Weightage: 300 Marks)
│   ├── Advanced Auditing, Assurance & Professional Ethics
│   │   ├── Part A: Engagement Standards & SAs (SA 200 to 700 Series)
│   │   │   └── Priority: High | weightage: 40-45% | Drill: Memorize key paragraph titles and requirements
│   │   └── Part B: Professional Ethics & Company Audits
│   │       └── Priority: Critical | weightage: 40% | Drill: ICAI Code of Conduct clauses and schedules
│   ├── Direct Tax Laws & International Taxation (DT)
│   │   ├── Part A: Corporate Income Tax & PGBP Calculations
│   │   │   └── Priority: Critical | weightage: 45-50% | Drill: Depreciations, AMT, trust exemptions
│   │   └── Part B: International Taxation & Transfer Pricing
│   │       └── Priority: High | weightage: 35% | Drill: Arm's length calculations, double tax reliefs
│   ├── Indirect Tax Laws (IDT)
│   │   ├── Part A: Goods and Services Tax (GST) Core & Valuation
│   │   │   └── Priority: Critical | weightage: 75% | Drill: Input Tax Credit (ITC) blocks, place/value of supply
│   │   └── Part B: Customs Act & Foreign Trade Policy
│   │       └── Priority: High | weightage: 25% | Drill: Valuation, duty types, export benefits
│   └── Integrated Business Solutions (IBS)
│       └── Case Scenarios: Multi-disciplinary concepts applied to enterprise strategy
│           └── Priority: High | weightage: 100 Marks | Drill: Analyze ICAI Case Studies, map across G1 & G2`}
        </pre>
      </div>

      {/* 📋 Syllabus Mastery Checklist */}
      <div className="p-6 rounded-2xl bg-cav-card border border-cav-border space-y-4 shadow-sm">
        <h3 className="font-display font-semibold text-white text-base flex items-center gap-2">
          <Check className="h-5 w-5 text-cav-accent" />
          Complete CA Final Syllabus Master Checklist
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {ROADMAP_SUBJECT_DETAILS.map((subj, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-850 pb-2">
                <span className={`h-3 w-3 rounded-full ${subj.dotColor}`}></span>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">{subj.fullName}</h4>
              </div>
              <ul className="space-y-2">
                {subj.chapters.map((chap, cIdx) => (
                  <li key={cIdx} className="flex items-start gap-2 text-[11px] text-slate-200 leading-tight">
                    <span className="text-amber-500 mt-0.5 select-none shrink-0">[ ]</span>
                    <span>{chap}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}

