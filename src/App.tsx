/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import BrandMark from './components/BrandMark';
import BrandFooter from './components/BrandFooter';
const logoImg = '/assets/aistudio/practCA_Logo_photo_e935f99f.png';
const brandMarkImg = '/assets/aistudio/practCA_Logo_3008a4f9.png';
import Dashboard from './components/Dashboard';
import SubjectView from './components/SubjectView';
import TasksPlanner from './components/TasksPlanner';
import RevisionPlanner, {
  SUBJECT_CHAPTERS,
  resolveLatestLogCompletionDate,
  computeSubjectMilestoneRevisionCount,
  getSubjectDynamicRevKeys
} from './components/RevisionPlanner';
import { deleteLinkedLogEverywhere, deduplicateSessionLogs, syncStudySessionToRevisionPlanner } from './utils/logSyncEngine';
import PastPapersView from './components/PastPapersView';
import PracticeArenaView from './components/PracticeArenaView';
import RevisionReferencesView from './components/RevisionReferencesView';
import PractAceLibraryHeader from './components/PractAceLibraryHeader';
import { StudyVaultTabId } from './components/StudyVaultInterconnectBar';
import UniversalSearch from './components/UniversalSearch';
import FinalExamDatesModal, { loadStoredSubjectExamDates, addDaysToDateStr } from './components/FinalExamDatesModal';
import { AttractiveDatePicker } from './components/AttractiveDateTimePickers';
import { 
  BarChart3, 
  BookOpen, 
  Sun, 
  Moon, 
  LogOut, 
  Mail, 
  Star, 
  User as UserIcon, 
  CheckCircle2, 
  Menu, 
  Lock,
  ListTodo,
  Calendar,
  BrainCircuit,
  FileText,
  Target,
  Search,
  Flame,
  HelpCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Heart,
  Droplet,
  Clock,
  X,
  Youtube,
  ChevronDown,
  Check,
  CheckCheck,
  Home,
  ArrowUp,
  Library,
  Trophy,
  Sparkles
} from 'lucide-react';
import ShareStudyProgressModal from './components/ShareStudyProgressModal';
import { SubjectId, PracticeAttempt, BookmarkedSection, BookmarkedQuestion, FocusSession, RevisionCycleKey, ScheduledPracticeSessionRecord } from './types';
import ProfileView from './components/ProfileView';
import HomeView from './components/HomeView';
import ScheduledPracticeQuestionModal from './components/ScheduledPracticeQuestionModal';
import TimedPracticeNotificationModal from './components/TimedPracticeNotificationModal';
import {
  startScheduledPracticeScheduler,
  launchOnScreenPracticeSession,
  startTimedPracticeSession,
  snoozeTimedPracticeNotification,
  dismissTimedPracticeNotification,
  loadUserPracticeTimePreference
} from './utils/scheduledPracticeWorkflow';
import StudyPeersView from './components/StudyPeersView';
import MentalWellbeingView from './components/MentalWellbeingView';
import DigitalPomodora from './components/DigitalPomodora';
import StudyPictureInPicture from './components/StudyPictureInPicture';
import { RestSelectionModal } from './components/RestSelectionModal';
import { PowerNapAlarmModal } from './components/PowerNapAlarmModal';
import { ModalPortal } from './components/ModalPortal';
import { ConfettiOverlay, triggerFinalRevisionConfetti } from './components/ConfettiOverlay';
import {
  normalizeKey,
  syncTaskCompletionAcrossAllLinks,
  autoCompleteFinalExamMilestonesAfter5PM,
  dismissPendingAndMissedTasksPostExam,
  activateNextExamAttemptSchedule,
  clearExamAttemptSchedule
} from './utils/taskCompletionSync';
import { resolveActiveExamSchedule, syncLmrAutoTriggerForActiveWindow } from './components/LmrSprintBoard';
import { CALevel, CA_CURRICULUM_LEVELS, getSelectedCALevel, setSelectedCALevel, getLevelSubjectIds, getDefaultSubjectForLevel, isValidCALevelValue, isFoundationLevel } from './data/curriculumLevels';
import { getLevelScopedKey, getFirestoreSubcollectionName, getUserDocExamDateField, getUserDocDailyGoalField, getAttemptsForLevel, getDefaultAttemptDateForLevel } from './utils/levelStorage';
import { playPowerNapAlarm, stopPowerNapAlarm, testPowerNapAlarmSound } from './utils/audioAlarm';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs, getDoc, query, where } from 'firebase/firestore';
import { auth, googleProvider, signInWithPopup, db, handleFirestoreError, OperationType, setGoogleAccessToken, getSimpleUsername } from './lib/firebase';

const calculateTimeLeft = (targetDateStr: string) => {
  if (!targetDateStr) return null;
  const difference = +new Date(targetDateStr) - +new Date();
  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, completed: true };
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    completed: false
  };
};

const ATTEMPTS = [
  { label: 'Nov 2026 Attempt', date: '2026-11-01' },
  { label: 'May 2027 Attempt', date: '2027-05-01' },
  { label: 'Nov 2027 Attempt', date: '2027-11-01' },
  { label: 'May 2028 Attempt', date: '2028-05-01' }
];

const getAttemptLabel = (dateStr: string) => {
  if (!dateStr) return 'No Scheduled Exam';
  const matched = ATTEMPTS.find(att => att.date === dateStr);
  if (matched) return matched.label;
  
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const month = d.toLocaleString('en-US', { month: 'short' });
      const year = d.getFullYear();
      return `${month} ${year} CA Attempt`;
    }
  } catch (e) {}
  return "CA Attempt";
};

const playHydrationSound = (enabled: boolean = true) => {
  if (!enabled) return;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Bubble sound: rising sine wave
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    
    osc1.type = 'sine';
    // Frequency start: 150Hz, rising to 800Hz in 0.15s
    osc1.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.15);
    
    gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    
    osc1.start();
    osc1.stop(audioCtx.currentTime + 0.15);
    
    // Second drop bubble
    setTimeout(() => {
      try {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(250, audioCtx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.12);
        
        gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.12);
        
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.12);
      } catch (innerErr) {}
    }, 100);
  } catch (e) {
    console.log('AudioContext not supported or blocked by browser autoplays policy', e);
  }
};

export default function App() {
  const [currentView, setView] = useState<'home' | 'dashboard' | 'subjects' | 'tasks' | 'revision' | 'pastpapers' | 'practice' | 'wellbeing' | 'profile' | 'peers' | 'pomodora' | 'references'>(() => {
    try {
      if (localStorage.getItem('practca_active_mock_test')) {
        return 'pomodora';
      }
    } catch (e) {}
    return 'home';
  });
  const [activeFocusTask, setActiveFocusTask] = useState<{
    id?: string;
    subjectCode: string;
    title: string;
    cleanTitle?: string;
    chapterName?: string;
    relevance?: 'General' | 'Revision' | 'Final Revision';
    completed?: boolean;
    dueDate?: string;
    revKey?: 'rev1' | 'rev2' | 'rev3' | 'rev1.5';
    targetDurationMinutes?: number;
    isUntimedOpen?: boolean;
  } | null>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_active_focus_task')) || localStorage.getItem(getLevelScopedKey('cavault_active_focus_task'));
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (activeFocusTask) {
      localStorage.setItem(getLevelScopedKey('practca_active_focus_task'), JSON.stringify(activeFocusTask));
    } else {
      localStorage.removeItem(getLevelScopedKey('practca_active_focus_task'));
    }
  }, [activeFocusTask]);
  const [isNavOverlayOpen, setIsNavOverlayOpen] = useState<boolean>(false);

  const handleToggleSidebar = () => {
    setIsNavOverlayOpen(prev => !prev);
  };

  useEffect(() => {
    setIsNavOverlayOpen(false);
  }, [currentView]);

  useEffect(() => {
    if (!isNavOverlayOpen) return;
    const handleEscClose = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsNavOverlayOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscClose);
    return () => window.removeEventListener('keydown', handleEscClose);
  }, [isNavOverlayOpen]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | null>(null);
  const [selectedPastPaperSubjectId, setSelectedPastPaperSubjectId] = useState<SubjectId | null>(null);
  const [selectedPracticeSubjectId, setSelectedPracticeSubjectId] = useState<SubjectId | null>(null);
  const [selectedRevisionReferenceSubjectId, setSelectedRevisionReferenceSubjectId] = useState<SubjectId | null>(null);
  const [lastLibraryPillar, setLastLibraryPillar] = useState<StudyVaultTabId>('subjects');
  const [hubQuickReviewActive, setHubQuickReviewActive] = useState<boolean>(false);

  const syncLibrarySubject = (rawSubId: string | SubjectId | null) => {
    if (!rawSubId) {
      setSelectedSubjectId(null);
      setSelectedRevisionReferenceSubjectId(null);
      setSelectedPracticeSubjectId(null);
      setSelectedPastPaperSubjectId(null);
      return;
    }
    const normalized: SubjectId =
      rawSubId === 'AUD' || rawSubId === 'Audit' || rawSubId === 'sub-3'
        ? 'Audit'
        : rawSubId === 'sub-1'
          ? 'FR'
          : rawSubId === 'sub-2'
            ? 'AFM'
            : rawSubId === 'sub-4'
              ? 'DT'
              : rawSubId === 'sub-5'
                ? 'IDT'
                : rawSubId === 'sub-6'
                  ? 'IBS'
                  : (rawSubId as SubjectId);
    setSelectedSubjectId(normalized);
    setSelectedRevisionReferenceSubjectId(normalized);
    setSelectedPracticeSubjectId(normalized);
    setSelectedPastPaperSubjectId((normalized === 'Audit' ? 'AUD' : normalized) as SubjectId);
  };

  useEffect(() => {
    if (
      currentView === 'subjects' ||
      currentView === 'references' ||
      currentView === 'practice' ||
      currentView === 'pastpapers'
    ) {
      setLastLibraryPillar(currentView);
    }
  }, [currentView]);

  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [practiceAttempts, setPracticeAttempts] = useState<PracticeAttempt[]>(() => {
    const stored = localStorage.getItem(getLevelScopedKey('practca_practice_attempts')) || localStorage.getItem(getLevelScopedKey('cavault_practice_attempts'));
    return stored ? JSON.parse(stored) : [];
  });
  const [bookmarkedSections, setBookmarkedSections] = useState<BookmarkedSection[]>(() => {
    const stored = localStorage.getItem(getLevelScopedKey('practca_bookmarked_sections')) || localStorage.getItem(getLevelScopedKey('cavault_bookmarked_sections'));
    return stored ? JSON.parse(stored) : [];
  });
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<BookmarkedQuestion[]>(() => {
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_bookmarked_questions'));
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Focus Timer/Sessions State variables
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(25 * 60);
  const [timerDuration, setTimerDuration] = useState<number>(25 * 60);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [timerType, setTimerType] = useState<'work' | 'break'>('work');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(() => {
    const stored = localStorage.getItem(getLevelScopedKey('practca_daily_goal'));
    return stored ? parseInt(stored, 10) : 120;
  });
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(() => {
    const stored = localStorage.getItem(getLevelScopedKey('practca_focus_sessions'));
    return stored ? JSON.parse(stored) : [];
  });

  // Track study/break/routine/power-nap mode, elapsed seconds, and pause state for persistent PiP across all views
  const [activePomoMode, setActivePomoMode] = useState<string>(() => {
    return localStorage.getItem('practca_pomo_mode') || 'idle';
  });
  const [activePomoSeconds, setActivePomoSeconds] = useState<number>(0);
  const [activePomoRoutineName, setActivePomoRoutineName] = useState<string>(() => {
    return localStorage.getItem('practca_active_routine_name') || '';
  });
  const [activePomoBreakTargetMins, setActivePomoBreakTargetMins] = useState<number>(() => {
    return Number(localStorage.getItem('practca_break_target_mins')) || 15;
  });
  const [pomoPausedState, setPomoPausedState] = useState<{ mode: string; elapsedSeconds: number } | null>(() => {
    try {
      const raw = localStorage.getItem('practca_pomo_paused_state');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const checkPomoState = () => {
      const mode = localStorage.getItem('practca_pomo_mode') || 'idle';
      setActivePomoMode((prev) => (prev !== mode ? mode : prev));

      const rName = localStorage.getItem('practca_active_routine_name') || '';
      setActivePomoRoutineName((prev) => (prev !== rName ? rName : prev));

      const bMins = Number(localStorage.getItem('practca_break_target_mins')) || 15;
      setActivePomoBreakTargetMins((prev) => (prev !== bMins ? bMins : prev));

      try {
        const rawPaused = localStorage.getItem('practca_pomo_paused_state');
        const parsedPaused = rawPaused ? JSON.parse(rawPaused) : null;
        setPomoPausedState((prev) => {
          if (!prev && !parsedPaused) return null;
          if (prev && parsedPaused && prev.mode === parsedPaused.mode && prev.elapsedSeconds === parsedPaused.elapsedSeconds) {
            return prev;
          }
          return parsedPaused;
        });
      } catch (e) {}

      // Keep activeFocusTask synced if DigitalPomodora updated it in localStorage
      try {
        const rawTask = localStorage.getItem(getLevelScopedKey('practca_active_focus_task'));
        const parsedTask = rawTask ? JSON.parse(rawTask) : null;
        setActiveFocusTask((prev) => {
          const prevTitle = prev?.title || '';
          const nextTitle = parsedTask?.title || '';
          const prevSub = prev?.subjectCode || '';
          const nextSub = parsedTask?.subjectCode || '';
          if (prevTitle === nextTitle && prevSub === nextSub && Boolean(prev) === Boolean(parsedTask)) {
            return prev;
          }
          return parsedTask;
        });
      } catch (e) {}

      if (mode !== 'idle') {
        const start = localStorage.getItem('practca_pomo_start');
        if (start) {
          const startMs = new Date(start).getTime();
          if (!Number.isNaN(startMs)) {
            const elapsed = Math.floor((Date.now() - startMs) / 1000);
            const nextSec = Math.max(0, elapsed);
            setActivePomoSeconds((prev) => (prev !== nextSec ? nextSec : prev));
          }
        }
      } else {
        try {
          const rawPaused = localStorage.getItem('practca_pomo_paused_state');
          if (rawPaused) {
            const parsed = JSON.parse(rawPaused);
            if (typeof parsed?.elapsedSeconds === 'number') {
              const nextSec = Math.max(0, parsed.elapsedSeconds);
              setActivePomoSeconds((prev) => (prev !== nextSec ? nextSec : prev));
            }
          }
        } catch (e) {}
      }
    };
    checkPomoState();

    const interval = setInterval(checkPomoState, 1000);

    window.addEventListener('storage', checkPomoState);
    window.addEventListener('practca_pomo_mode_change', checkPomoState);
    window.addEventListener('practca_pomo_logs_update', checkPomoState);
    window.addEventListener('practca_active_task_elapsed_updated', checkPomoState);
    window.addEventListener('practca_active_focus_task_cleared', checkPomoState);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkPomoState);
      window.removeEventListener('practca_pomo_mode_change', checkPomoState);
      window.removeEventListener('practca_pomo_logs_update', checkPomoState);
      window.removeEventListener('practca_active_task_elapsed_updated', checkPomoState);
      window.removeEventListener('practca_active_focus_task_cleared', checkPomoState);
    };
  }, []);

  // Immediate timer and pomo state sync whenever navigation view changes
  useEffect(() => {
    const mode = localStorage.getItem('practca_pomo_mode') || 'idle';
    if (mode !== 'idle' || localStorage.getItem('practca_pomo_paused_state')) {
      setActivePomoMode((prev) => (prev !== mode ? mode : prev));
    }
  }, [currentView]);

  // Uptime, ShowTimeInHours, and Exam Countdown States
  const [uptimeEnabled, setUptimeEnabled] = useState<boolean>(() => {
    return localStorage.getItem('practca_uptime_enabled') !== 'false';
  });
  const [showTimeInHours, setShowTimeInHours] = useState<boolean>(() => {
    return localStorage.getItem('practca_show_hours') === 'true';
  });
  const [examDate, setExamDate] = useState<string>(() => {
    if (localStorage.getItem(getLevelScopedKey('practca_exam_attempt_cleared')) === 'true') {
      return '';
    }
    return localStorage.getItem(getLevelScopedKey('practca_exam_date')) || getDefaultAttemptDateForLevel();
  });
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(examDate));
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showFinalExamDatesModal, setShowFinalExamDatesModal] = useState<boolean>(false);
  const [showShareProgressModal, setShowShareProgressModal] = useState<boolean>(false);
  const [examModalError, setExamModalError] = useState<string | null>(null);
  const [milestoneSyncTick, setMilestoneSyncTick] = useState<number>(0);

  useEffect(() => {
    const handleMilestoneOrExamUpdate = () => {
      const isCleared = localStorage.getItem(getLevelScopedKey('practca_exam_attempt_cleared')) === 'true';
      if (isCleared) {
        setExamDate(prev => (prev !== '' ? '' : prev));
      } else {
        const storedExam = localStorage.getItem(getLevelScopedKey('practca_exam_date'));
        if (storedExam && /^\d{4}-\d{2}-\d{2}$/.test(storedExam)) {
          setExamDate(prev => (prev !== storedExam ? storedExam : prev));
        }
      }
      setMilestoneSyncTick(t => t + 1);
    };
    const handleOpenFinalExamDates = () => {
      setShowFinalExamDatesModal(true);
    };
    window.addEventListener('practca_roadmap_checkpoints_updated', handleMilestoneOrExamUpdate);
    window.addEventListener('practca_subject_exam_dates_updated', handleMilestoneOrExamUpdate);
    window.addEventListener('practca_exam_date_updated', handleMilestoneOrExamUpdate);
    window.addEventListener('storage', handleMilestoneOrExamUpdate);
    window.addEventListener('practca_open_final_exam_dates_modal', handleOpenFinalExamDates);
    return () => {
      window.removeEventListener('practca_roadmap_checkpoints_updated', handleMilestoneOrExamUpdate);
      window.removeEventListener('practca_subject_exam_dates_updated', handleMilestoneOrExamUpdate);
      window.removeEventListener('practca_exam_date_updated', handleMilestoneOrExamUpdate);
      window.removeEventListener('storage', handleMilestoneOrExamUpdate);
      window.removeEventListener('practca_open_final_exam_dates_modal', handleOpenFinalExamDates);
    };
  }, []);

  // CA Curriculum Tier & Level Sync
  const [caLevel, setCaLevel] = useState<CALevel>(() => getSelectedCALevel());
  const [showLevelMenu, setShowLevelMenu] = useState<boolean>(false);

  // 1-Click Auto-Sync Notification State
  const [autoSyncedToast, setAutoSyncedToast] = useState<{
    taskId: string;
    title: string;
    subjectCode: string;
    chapterName: string;
    duration: number;
  } | null>(null);

  useEffect(() => {
    const handleLevelChange = (e: any) => {
      const nextLvl: CALevel = e.detail?.level || getSelectedCALevel();
      setCaLevel(nextLvl);
      syncLibrarySubject(null);
      try {
        const isCleared = localStorage.getItem(getLevelScopedKey('practca_exam_attempt_cleared', nextLvl)) === 'true';
        const storedExam = isCleared
          ? ''
          : (localStorage.getItem(getLevelScopedKey('practca_exam_date', nextLvl)) || getDefaultAttemptDateForLevel(nextLvl));
        setExamDate(storedExam);
        const storedGoal = localStorage.getItem(getLevelScopedKey('practca_daily_goal', nextLvl));
        setDailyGoalMinutes(storedGoal ? parseInt(storedGoal, 10) : 120);
        const storedFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', nextLvl));
        setFocusSessions(storedFocus ? JSON.parse(storedFocus) : []);
        const storedAttempts = localStorage.getItem(getLevelScopedKey('practca_practice_attempts', nextLvl));
        setPracticeAttempts(storedAttempts ? JSON.parse(storedAttempts) : []);
        const storedBooks = localStorage.getItem(getLevelScopedKey('practca_bookmarked_sections', nextLvl));
        setBookmarkedSections(storedBooks ? JSON.parse(storedBooks) : []);
        const storedQBooks = localStorage.getItem(getLevelScopedKey('practca_bookmarked_questions', nextLvl));
        setBookmarkedQuestions(storedQBooks ? JSON.parse(storedQBooks) : []);
        const storedTask = localStorage.getItem(getLevelScopedKey('practca_active_focus_task', nextLvl));
        setActiveFocusTask(storedTask ? JSON.parse(storedTask) : null);
      } catch (err) {}
      setMilestoneSyncTick(t => t + 1);
    };
    window.addEventListener('practca_level_changed', handleLevelChange);
    return () => window.removeEventListener('practca_level_changed', handleLevelChange);
  }, []);

  useEffect(() => {
    if (!autoSyncedToast) return;
    const timer = setTimeout(() => {
      setAutoSyncedToast(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [autoSyncedToast]);

  const handleSelectLevel = (newLevel: CALevel) => {
    setCaLevel(newLevel);
    setSelectedCALevel(newLevel);
    setShowLevelMenu(false);
  };

  const handleUndoAutoSync = async () => {
    if (!autoSyncedToast) return;
    try {
      const rawLocalTasks = localStorage.getItem(getLevelScopedKey('practca_local_tasks'));
      if (rawLocalTasks) {
        const taskList = JSON.parse(rawLocalTasks);
        const target = taskList.find((t: any) => t.id === autoSyncedToast.taskId);
        if (target) {
          await syncTaskCompletionAcrossAllLinks(target, false);
        }
      }
      setAutoSyncedToast(null);
    } catch (e) {
      console.error("Error undoing auto-sync:", e);
    }
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDateStr = `${yyyy}-${mm}-${dd}`;

  const [showAllExamsCongratsModal, setShowAllExamsCongratsModal] = useState(false);

  // Resolve Next Paper List and Next Active Exam from Study Planner Milestones (including Audit and all active milestone subjects)
  const examScheduleInfo = React.useMemo(() => {
    const resolved = resolveActiveExamSchedule(examDate);
    return {
      hasScheduledExam: resolved.hasScheduledExam,
      areExamsStarted: resolved.hasScheduledExam && Boolean(resolved.areExamsStarted || (timeLeft && timeLeft.completed)),
      orderedExams: resolved.orderedExams,
      nextExam: resolved.nextExam,
      areAllScheduledExamsConcluded: resolved.areAllScheduledExamsConcluded,
      scheduleSignature: resolved.scheduleSignature,
      latestExamDateStr: resolved.latestExamDateStr
    };
  }, [examDate, minDateStr, timeLeft?.completed, milestoneSyncTick]);

  // Auto-trigger LMR Mode strictly inside LMR sprint time, auto-mark Final Exam Date milestones after conclusion,
  // revert to Regular Mode when outside sprint window / post-exam, and show Congratulations popup
  useEffect(() => {
    const checkExamMilestonesAndCompletion = () => {
      const anyUpdated = autoCompleteFinalExamMilestonesAfter5PM();
      if (anyUpdated) {
        setMilestoneSyncTick(t => t + 1);
      }

      syncLmrAutoTriggerForActiveWindow(new Date(), caLevel);

      const schedule = resolveActiveExamSchedule(examDate, new Date(), caLevel);
      if (schedule.areAllScheduledExamsConcluded && schedule.scheduleSignature) {
        try {
          const revertedKey = getLevelScopedKey('practca_post_exam_regular_mode_reverted_sig', caLevel);
          const disabledKey = getLevelScopedKey('practca_lmr_mode_disabled', caLevel);
          const activeKey = getLevelScopedKey('practca_lmr_mode_active', caLevel);
          const revertedSig = localStorage.getItem(revertedKey);
          if (revertedSig !== schedule.scheduleSignature) {
            localStorage.setItem(revertedKey, schedule.scheduleSignature);
            localStorage.setItem(disabledKey, 'true');
            localStorage.setItem(activeKey, 'false');
            window.dispatchEvent(new Event('practca_lmr_preference_updated'));
            window.dispatchEvent(new Event('practca_lmr_mode_changed'));
            window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
            window.dispatchEvent(new Event('practca_revision_planner_updated'));
            window.dispatchEvent(new Event('practca_target_system_synced'));
            window.dispatchEvent(new Event('storage'));
          }

          dismissPendingAndMissedTasksPostExam(schedule.scheduleSignature, schedule.latestExamDateStr);

          const congratsKey = getLevelScopedKey(
            `practca_all_exams_congrats_shown_${schedule.scheduleSignature}`,
            caLevel
          );
          if (localStorage.getItem(congratsKey) !== 'true') {
            setShowAllExamsCongratsModal(true);
            triggerFinalRevisionConfetti({
              milestoneTitle: 'Congratulations on Completion of All CA Exams!',
              isExamAutoComplete: true
            });
          }
        } catch (e) {}
      }
    };

    checkExamMilestonesAndCompletion();
    const examMilestoneTimer = window.setInterval(checkExamMilestonesAndCompletion, 15000);
    window.addEventListener('practca_exam_date_updated', checkExamMilestonesAndCompletion);
    window.addEventListener('practca_subject_exam_dates_updated', checkExamMilestonesAndCompletion);
    window.addEventListener('practca_roadmap_checkpoints_updated', checkExamMilestonesAndCompletion);
    return () => {
      window.clearInterval(examMilestoneTimer);
      window.removeEventListener('practca_exam_date_updated', checkExamMilestonesAndCompletion);
      window.removeEventListener('practca_subject_exam_dates_updated', checkExamMilestonesAndCompletion);
      window.removeEventListener('practca_roadmap_checkpoints_updated', checkExamMilestonesAndCompletion);
    };
  }, [examDate, caLevel]);

  const handleAcknowledgeAllExamsCompleted = () => {
    try {
      if (examScheduleInfo.scheduleSignature) {
        localStorage.setItem(
          getLevelScopedKey(`practca_all_exams_congrats_shown_${examScheduleInfo.scheduleSignature}`, caLevel),
          'true'
        );
        localStorage.setItem(
          getLevelScopedKey('practca_post_exam_regular_mode_reverted_sig', caLevel),
          examScheduleInfo.scheduleSignature
        );
      }
      localStorage.setItem(getLevelScopedKey('practca_lmr_mode_disabled', caLevel), 'true');
      localStorage.setItem(getLevelScopedKey('practca_lmr_mode_active', caLevel), 'false');
      window.dispatchEvent(new Event('practca_lmr_preference_updated'));
      window.dispatchEvent(new Event('practca_lmr_mode_changed'));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
    setShowAllExamsCongratsModal(false);
  };

  const handleToggleUptime = () => {
    setUptimeEnabled(prev => {
      const next = !prev;
      localStorage.setItem('practca_uptime_enabled', String(next));
      return next;
    });
  };

  const handleToggleShowTimeInHours = () => {
    setShowTimeInHours(prev => {
      const next = !prev;
      localStorage.setItem('practca_show_hours', String(next));
      return next;
    });
  };

  const handleClearExamAttempt = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    clearExamAttemptSchedule(caLevel);
    setExamDate('');
    setTimeLeft(null);
    setExamModalError(null);
    setMilestoneSyncTick(t => t + 1);
  };

  useEffect(() => {
    setTimeLeft(calculateTimeLeft(examDate));
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(examDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [examDate]);

  // Synchronize subject selectors and tabs
  useEffect(() => {
    if (selectedSubjectId) {
      localStorage.setItem('practca_last_selected_subject', selectedSubjectId);
      if (selectedPracticeSubjectId !== selectedSubjectId) {
        setSelectedPracticeSubjectId(selectedSubjectId);
      }
      if (selectedPastPaperSubjectId !== selectedSubjectId) {
        setSelectedPastPaperSubjectId(selectedSubjectId);
      }
    }
  }, [selectedSubjectId]);

  useEffect(() => {
    if (selectedPracticeSubjectId) {
      localStorage.setItem('practca_last_selected_subject', selectedPracticeSubjectId);
      if (selectedSubjectId !== selectedPracticeSubjectId) {
        setSelectedSubjectId(selectedPracticeSubjectId);
      }
      if (selectedPastPaperSubjectId !== selectedPracticeSubjectId) {
        setSelectedPastPaperSubjectId(selectedPracticeSubjectId);
      }
    }
  }, [selectedPracticeSubjectId]);

  useEffect(() => {
    if (selectedPastPaperSubjectId) {
      localStorage.setItem('practca_last_selected_subject', selectedPastPaperSubjectId);
      if (selectedSubjectId !== selectedPastPaperSubjectId) {
        setSelectedSubjectId(selectedPastPaperSubjectId);
      }
      if (selectedPracticeSubjectId !== selectedPastPaperSubjectId) {
        setSelectedPracticeSubjectId(selectedPastPaperSubjectId);
      }
    }
  }, [selectedPastPaperSubjectId]);

  // Unified Live Sleep Tracking States
  const [isSleeping, setIsSleeping] = useState<boolean>(() => {
    return localStorage.getItem('practca_is_sleeping') === 'true';
  });
  const [sleepStartTime, setSleepStartTime] = useState<string | null>(() => {
    return localStorage.getItem('practca_sleep_start_time');
  });
  const [sleepSessions, setSleepSessions] = useState<{ id: string; startTime: string; endTime: string; duration: number; feeling?: string }[]>(() => {
    const stored = localStorage.getItem('practca_sleep_sessions');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Seed 25 days of historic sleep logs across the past month for immediate metric & report testing
    const initialSessions: { id: string; startTime: string; endTime: string; duration: number; feeling?: string }[] = [];
    const now = new Date();
    const feelings = [
      'Very refreshed & energetic',
      'Rested, ready for FR revision',
      'Good sleep',
      'Slightly groggy, but clear mind',
      'Optimal rest & stable focus',
      'Refreshed, ready for mock test'
    ];
    for (let i = 25; i >= 1; i--) {
      const sDate = new Date();
      sDate.setDate(now.getDate() - i);
      // Bedtime between 11:00 PM and 11:40 PM
      const bedtimeMinsOffset = (i * 7) % 40;
      sDate.setHours(23, 10 + bedtimeMinsOffset, 0, 0);

      const eDate = new Date();
      eDate.setDate(now.getDate() - i + 1);
      // Wake up time between 06:20 AM and 07:10 AM
      const waketimeMinsOffset = (i * 9) % 50;
      eDate.setHours(6, 20 + waketimeMinsOffset, 0, 0);

      const durationMins = Math.round((eDate.getTime() - sDate.getTime()) / (1000 * 60));
      initialSessions.push({
        id: `session_hist_${i}`,
        startTime: sDate.toISOString(),
        endTime: eDate.toISOString(),
        duration: durationMins,
        feeling: feelings[i % feelings.length]
      });
    }
    try {
      localStorage.setItem('practca_sleep_sessions', JSON.stringify(initialSessions));
    } catch (e) {}
    return initialSessions;
  });
  const [elapsedSleepText, setElapsedSleepText] = useState<string>('00h 00m 00s');
  const [showSleepActivityAlert, setShowSleepActivityAlert] = useState<boolean>(false);
  const [sleepFeelingInput, setSleepFeelingInput] = useState<string>('');

  // Power Nap State & Alarm Management
  const [isPowerNapping, setIsPowerNapping] = useState<boolean>(() => {
    return localStorage.getItem('practca_is_power_nap') === 'true';
  });
  const [powerNapTargetMins, setPowerNapTargetMins] = useState<number>(() => {
    const stored = localStorage.getItem('practca_power_nap_target_mins');
    return stored ? parseInt(stored, 10) : 20;
  });
  const [powerNapStartTime, setPowerNapStartTime] = useState<string | null>(() => {
    return localStorage.getItem('practca_power_nap_start_time');
  });
  const [powerNapEndTime, setPowerNapEndTime] = useState<number | null>(() => {
    const stored = localStorage.getItem('practca_power_nap_end_time');
    return stored ? parseInt(stored, 10) : null;
  });
  const [powerNapTimeLeftSeconds, setPowerNapTimeLeftSeconds] = useState<number>(0);
  const [showPowerNapAlarmModal, setShowPowerNapAlarmModal] = useState<boolean>(false);
  const [showRestModeModal, setShowRestModeModal] = useState<boolean>(false);

  // Power Nap Countdown Timer Effect
  useEffect(() => {
    if (!isPowerNapping || !powerNapEndTime) {
      setPowerNapTimeLeftSeconds(0);
      return;
    }

    const intervalId = setInterval(() => {
      const diffMs = powerNapEndTime - Date.now();
      if (diffMs <= 0) {
        setPowerNapTimeLeftSeconds(0);
        if (!showPowerNapAlarmModal) {
          setShowPowerNapAlarmModal(true);
          playPowerNapAlarm();
        }
      } else {
        setPowerNapTimeLeftSeconds(Math.ceil(diffMs / 1000));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isPowerNapping, powerNapEndTime, showPowerNapAlarmModal]);

  // Hydration state variables
  const [hydrationReminderEnabled, setHydrationReminderEnabled] = useState<boolean>(() => {
    return localStorage.getItem('practca_hydration_reminder_enabled') !== 'false';
  });
  const [hydrationSoundEnabled, setHydrationSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('practca_hydration_sound_enabled') !== 'false';
  });
  const [hydrationInterval, setHydrationInterval] = useState<number>(() => {
    const stored = localStorage.getItem('practca_hydration_interval');
    return stored ? parseInt(stored, 10) : 45;
  });
  const [dailyHydrationCount, setDailyHydrationCount] = useState<number>(() => {
    const storedDate = localStorage.getItem('practca_daily_hydration_date');
    const todayStr = new Date().toDateString();
    if (storedDate !== todayStr) {
      localStorage.setItem('practca_daily_hydration_date', todayStr);
      localStorage.setItem('practca_daily_hydration_count', '0');
      return 0;
    }
    const storedCount = localStorage.getItem('practca_daily_hydration_count');
    return storedCount ? parseInt(storedCount, 10) : 0;
  });

  // Triggered check on application open / window focus to auto-reset dailyHydrationCount for a new day
  useEffect(() => {
    const checkAndResetDailyHydration = () => {
      const todayStr = new Date().toDateString();
      const storedDate = localStorage.getItem('practca_daily_hydration_date');
      if (storedDate !== todayStr) {
        localStorage.setItem('practca_daily_hydration_date', todayStr);
        localStorage.setItem('practca_daily_hydration_count', '0');
        setDailyHydrationCount(0);
      }
    };
    checkAndResetDailyHydration();
    window.addEventListener('focus', checkAndResetDailyHydration);
    return () => {
      window.removeEventListener('focus', checkAndResetDailyHydration);
    };
  }, []);
  const [dailyHydrationTarget, setDailyHydrationTarget] = useState<number>(() => {
    const stored = localStorage.getItem('practca_daily_hydration_target');
    return stored ? parseInt(stored, 10) : 8;
  });
  const [showHydrationPopup, setShowHydrationPopup] = useState<boolean>(false);
  const [hydrationTimerStart, setHydrationTimerStart] = useState<number>(() => {
    const stored = localStorage.getItem('practca_hydration_timer_start');
    if (stored) return parseInt(stored, 10);
    const now = Date.now();
    localStorage.setItem('practca_hydration_timer_start', String(now));
    return now;
  });
  const [hydrationHistory, setHydrationHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem('practca_hydration_history');
    return stored ? JSON.parse(stored) : [];
  });
  const [hydrationSnoozeEndTime, setHydrationSnoozeEndTime] = useState<number | null>(() => {
    const stored = localStorage.getItem('practca_hydration_snooze_end');
    return stored ? parseInt(stored, 10) : null;
  });
  const [hydrationTimeLeftSeconds, setHydrationTimeLeftSeconds] = useState<number>(0);

  const hydrationTimerStartRef = React.useRef(hydrationTimerStart);
  const hydrationSnoozeEndTimeRef = React.useRef(hydrationSnoozeEndTime);
  React.useEffect(() => {
    hydrationTimerStartRef.current = hydrationTimerStart;
  }, [hydrationTimerStart]);
  React.useEffect(() => {
    hydrationSnoozeEndTimeRef.current = hydrationSnoozeEndTime;
  }, [hydrationSnoozeEndTime]);

  // Background hydration countdown timer effect (with advanced smart health-app logic)
  useEffect(() => {
    if (!hydrationReminderEnabled || showHydrationPopup) {
      return;
    }

    if (isSleeping) {
      // Auto-postpone hydration reminders during active sleep cycles
      const intervalId = setInterval(() => {
        const now = Date.now();
        hydrationTimerStartRef.current = now;
        setHydrationTimerStart(now);
        localStorage.setItem('practca_hydration_timer_start', String(now));
        setHydrationTimeLeftSeconds(hydrationInterval * 60);
      }, 5000);
      return () => clearInterval(intervalId);
    }

    const intervalId = setInterval(() => {
      // Postpone hydration popups if a full-screen Mock Test is actively running
      if (localStorage.getItem('practca_active_mock_test')) {
        const now = Date.now();
        hydrationTimerStartRef.current = now;
        setHydrationTimerStart(now);
        localStorage.setItem('practca_hydration_timer_start', String(now));
        return;
      }

      // Check quiet hours (11:00 PM to 7:00 AM) to skip timers & protect sleep quality
      const localHour = new Date().getHours();
      const isQuietHours = localHour < 7 || localHour >= 23;
      if (isQuietHours) {
        const now = Date.now();
        hydrationTimerStartRef.current = now;
        setHydrationTimerStart(now);
        localStorage.setItem('practca_hydration_timer_start', String(now));
        setHydrationTimeLeftSeconds(hydrationInterval * 60);
        return;
      }

      // Continue the timer to next reminder ONLY when the clock is actively in study mode
      const currentMode = localStorage.getItem('practca_pomo_mode') || 'idle';
      const isStudyMode = currentMode === 'study';

      if (!isStudyMode) {
        // Reset first reminder completion flag so next study session starts fresh with a 20-min first reminder
        localStorage.setItem('practca_study_first_reminder_done', 'false');

        const nextStart = hydrationTimerStartRef.current + 1000;
        hydrationTimerStartRef.current = nextStart;
        setHydrationTimerStart(nextStart);
        localStorage.setItem('practca_hydration_timer_start', String(nextStart));

        if (hydrationSnoozeEndTimeRef.current !== null) {
          const nextSnooze = hydrationSnoozeEndTimeRef.current + 1000;
          hydrationSnoozeEndTimeRef.current = nextSnooze;
          setHydrationSnoozeEndTime(nextSnooze);
          localStorage.setItem('practca_hydration_snooze_end', String(nextSnooze));
        }

        // Show 20-min countdown preview for when study mode starts
        setHydrationTimeLeftSeconds(20 * 60);
        return;
      }

      const now = Date.now();
      const isFirstReminderDone = localStorage.getItem('practca_study_first_reminder_done') === 'true';

      let targetTime: number;

      if (hydrationSnoozeEndTimeRef.current !== null) {
        targetTime = hydrationSnoozeEndTimeRef.current;
      } else if (!isFirstReminderDone) {
        // First reminder when study mode starts MUST come ONLY after 20 minutes from study start
        const storedStart = localStorage.getItem('practca_pomo_start');
        let studyStartMs = storedStart ? new Date(storedStart).getTime() : 0;
        if (isNaN(studyStartMs) || studyStartMs <= 0) {
          const customStart = localStorage.getItem('practca_study_start_time');
          studyStartMs = customStart ? parseInt(customStart, 10) : now;
          if (isNaN(studyStartMs) || studyStartMs <= 0) {
            studyStartMs = now;
            localStorage.setItem('practca_study_start_time', String(now));
          }
        }
        targetTime = studyStartMs + (20 * 60 * 1000); // exactly 20 minutes after study mode started
      } else {
        // Subsequent reminders after the first 20-minute reminder
        targetTime = hydrationTimerStartRef.current + (hydrationInterval * 60 * 1000);
      }

      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        setShowHydrationPopup(true);
        playHydrationSound(hydrationSoundEnabledRef.current);
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate([100, 50, 100]);
          } catch (e) {}
        }
        localStorage.setItem('practca_study_first_reminder_done', 'true');
        hydrationTimerStartRef.current = now;
        setHydrationTimerStart(now);
        localStorage.setItem('practca_hydration_timer_start', String(now));
        hydrationSnoozeEndTimeRef.current = null;
        setHydrationSnoozeEndTime(null);
        localStorage.removeItem('practca_hydration_snooze_end');
      } else {
        setHydrationTimeLeftSeconds(Math.ceil(diffMs / 1000));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hydrationReminderEnabled, hydrationInterval, showHydrationPopup, isSleeping]);

  const handleHydrated = (amount: any = 1) => {
    const finalAmount = typeof amount === 'number' ? amount : 1;
    const now = Date.now();
    const todayStr = new Date().toDateString();
    
    const storedDate = localStorage.getItem('practca_daily_hydration_date');
    let currentCount = dailyHydrationCount;
    if (storedDate !== todayStr) {
      localStorage.setItem('practca_daily_hydration_date', todayStr);
      currentCount = 0;
    }

    const nextCount = currentCount + finalAmount;
    setDailyHydrationCount(nextCount);
    localStorage.setItem('practca_daily_hydration_count', String(nextCount));

    const timestamp = new Date().toISOString();
    let updatedHistory = [...hydrationHistory];
    for (let i = 0; i < finalAmount; i++) {
      updatedHistory = [timestamp, ...updatedHistory];
    }
    updatedHistory = updatedHistory.slice(0, 50);
    setHydrationHistory(updatedHistory);
    localStorage.setItem('practca_hydration_history', JSON.stringify(updatedHistory));

    localStorage.setItem('practca_study_first_reminder_done', 'true');
    setHydrationTimerStart(now);
    localStorage.setItem('practca_hydration_timer_start', String(now));
    
    setHydrationSnoozeEndTime(null);
    localStorage.removeItem('practca_hydration_snooze_end');
    
    setShowHydrationPopup(false);
  };

  const handleSnoozeHydration = (mins: number) => {
    const endTime = Date.now() + mins * 60 * 1000;
    setHydrationSnoozeEndTime(endTime);
    localStorage.setItem('practca_hydration_snooze_end', String(endTime));
    setShowHydrationPopup(false);
  };

  const handleDismissHydration = () => {
    const now = Date.now();
    localStorage.setItem('practca_study_first_reminder_done', 'true');
    setHydrationTimerStart(now);
    localStorage.setItem('practca_hydration_timer_start', String(now));
    setHydrationSnoozeEndTime(null);
    localStorage.removeItem('practca_hydration_snooze_end');
    setShowHydrationPopup(false);
  };

  // Refs for real-time synchronization to bypass stale closures in onSnapshot
  const isSleepingRef = React.useRef(isSleeping);
  const isPowerNappingRef = React.useRef(isPowerNapping);
  const sleepStartTimeRef = React.useRef(sleepStartTime);
  const sleepSessionsRef = React.useRef(sleepSessions);
  const timerIsRunningRef = React.useRef(timerIsRunning);
  const timerSecondsLeftRef = React.useRef(timerSecondsLeft);
  const timerDurationRef = React.useRef(timerDuration);
  const timerTypeRef = React.useRef(timerType);
  const activeFocusTaskRef = React.useRef(activeFocusTask);
  const hydrationSoundEnabledRef = React.useRef(hydrationSoundEnabled);

  React.useEffect(() => { isSleepingRef.current = isSleeping; }, [isSleeping]);
  React.useEffect(() => { isPowerNappingRef.current = isPowerNapping; }, [isPowerNapping]);
  React.useEffect(() => { sleepStartTimeRef.current = sleepStartTime; }, [sleepStartTime]);
  React.useEffect(() => { sleepSessionsRef.current = sleepSessions; }, [sleepSessions]);
  React.useEffect(() => { timerIsRunningRef.current = timerIsRunning; }, [timerIsRunning]);
  React.useEffect(() => { timerSecondsLeftRef.current = timerSecondsLeft; }, [timerSecondsLeft]);
  React.useEffect(() => { timerDurationRef.current = timerDuration; }, [timerDuration]);
  React.useEffect(() => { timerTypeRef.current = timerType; }, [timerType]);
  React.useEffect(() => { activeFocusTaskRef.current = activeFocusTask; }, [activeFocusTask]);
  React.useEffect(() => { hydrationSoundEnabledRef.current = hydrationSoundEnabled; }, [hydrationSoundEnabled]);

  // Cloud Sync Handler
  const syncTimerAndSleepToCloud = async (updates: {
    isSleeping?: boolean;
    isPowerNapping?: boolean;
    powerNapTargetMins?: number;
    sleepStartTime?: string | null;
    sleepSessions?: any[];
    timerIsRunning?: boolean;
    timerSecondsLeft?: number;
    timerDuration?: number;
    timerType?: 'work' | 'break';
    timerUpdatedAt?: number;
    activeFocusTask?: { subjectCode: string; title: string; chapterName?: string; relevance?: 'General' | 'Revision' | 'Final Revision'; completed?: boolean; dueDate?: string } | null;
  }) => {
    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (!isRealUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        ...updates,
        stateLastUpdatedByDeviceAt: Date.now()
      }, { merge: true });
    } catch (err) {
      console.error("Failed to sync timer and sleep to cloud:", err);
    }
  };

  // Real-time synchronization when 24h clock slots update planned time for the running task
  useEffect(() => {
    const handleActiveDurationAdjusted = (e: any) => {
      const { newTotalMinutes, taskTitle, activeFocusTask: incomingTask } = e.detail || {};
      if (!newTotalMinutes || newTotalMinutes <= 0) return;

      setActiveFocusTask((prev: any) => {
        if (!prev) return prev;
        const currentTitle = (prev.title || '').trim().toLowerCase();
        const incomingTitle = (taskTitle || incomingTask?.title || '').trim().toLowerCase();
        const currentClean = (prev.cleanTitle || prev.title || '').trim().toLowerCase();
        const incomingClean = (incomingTask?.cleanTitle || incomingTitle).trim().toLowerCase();
        const prevId = (prev.id || '').trim().toLowerCase();
        const incomingId = (incomingTask?.id || '').trim().toLowerCase();

        const isMatch = Boolean(
          (prevId && incomingId && prevId === incomingId) ||
          currentTitle === incomingTitle ||
          currentClean === incomingClean ||
          currentTitle.includes(incomingTitle) ||
          incomingTitle.includes(currentTitle) ||
          (prev.title && normalizeKey(prev.title) === normalizeKey(taskTitle || incomingTitle))
        );

        if (!isMatch) return prev;

        const oldTargetMins = prev.targetDurationMinutes || Math.round(timerDuration / 60) || 45;
        const deltaMinutes = newTotalMinutes - oldTargetMins;
        const deltaSeconds = deltaMinutes * 60;

        const updated = {
          ...prev,
          targetDurationMinutes: newTotalMinutes
        };

        // Extend remaining seconds while preserving elapsed study progress
        if (timerType === 'work') {
          const newDurSecs = newTotalMinutes * 60;
          setTimerDuration(newDurSecs);
          setTimerSecondsLeft((curSecs: number) => Math.max(0, curSecs + deltaSeconds));
        }

        try {
          localStorage.setItem('practca_active_focus_task', JSON.stringify(updated));
        } catch (err) {}

        syncTimerAndSleepToCloud({
          activeFocusTask: updated,
          timerDuration: newTotalMinutes * 60,
          timerUpdatedAt: Date.now()
        });

        return updated;
      });
    };

    window.addEventListener('practca_active_task_duration_adjusted', handleActiveDurationAdjusted);
    return () => {
      window.removeEventListener('practca_active_task_duration_adjusted', handleActiveDurationAdjusted);
    };
  }, [timerDuration, timerType]);

  const handleToggleHydrationSound = async (val: boolean) => {
    setHydrationSoundEnabled(val);
    localStorage.setItem('practca_hydration_sound_enabled', String(val));
    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          hydrationSoundEnabled: val,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        setCurrentUser((prev: any) => prev ? { ...prev, hydrationSoundEnabled: val } : prev);
      } catch (err) {
        console.error("Failed to sync hydration sound preference to cloud:", err);
      }
    }
  };

  const handleStartSleep = () => {
    const nowStr = new Date().toISOString();
    setIsSleeping(true);
    setSleepStartTime(nowStr);
    localStorage.setItem('practca_is_sleeping', 'true');
    localStorage.setItem('practca_sleep_start_time', nowStr);
    setShowSleepActivityAlert(false);

    // Parallel cloud state sync
    syncTimerAndSleepToCloud({
      isSleeping: true,
      sleepStartTime: nowStr,
    });
  };

  const handleStopSleep = (feeling?: string) => {
    const currentStart = sleepStartTime || localStorage.getItem('practca_sleep_start_time');
    if (!currentStart) return;
    
    const endStr = new Date().toISOString();
    const startD = new Date(currentStart);
    const endD = new Date(endStr);
    const durationSecs = Math.round((endD.getTime() - startD.getTime()) / 1000);

    setIsSleeping(false);
    setSleepStartTime(null);
    localStorage.removeItem('practca_is_sleeping');
    localStorage.removeItem('practca_sleep_start_time');
    localStorage.setItem('practca_pomo_mode', 'idle');
    localStorage.removeItem('practca_pomo_start');

    // Any time log less than 1 minute (< 60 seconds) shall not be added to the logs
    if (durationSecs < 60) {
      syncTimerAndSleepToCloud({
        isSleeping: false,
        sleepStartTime: null,
        sleepSessions
      });
      return;
    }

    const durationMins = Math.round(durationSecs / 60);
    const finalDuration = Math.min(1440, Math.max(1, durationMins));
    
    const newSession = {
      id: 'sleep-' + Date.now(),
      startTime: currentStart,
      endTime: endStr,
      duration: finalDuration,
      feeling: feeling || undefined
    };
    const updated = [newSession, ...sleepSessions];
    setSleepSessions(updated);
    localStorage.setItem('practca_sleep_sessions', JSON.stringify(updated));

    // Also update 24-hour clock allocation ledger logs (practca_pomo_logs) with midnight splitting & deduplication
    try {
      const existingLogsRaw = localStorage.getItem('practca_pomo_logs');
      const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];

      const segments: {
        date: string;
        startTime: Date;
        endTime: Date;
        secs: number;
      }[] = [];

      let currStart = new Date(startD.getTime());
      while (true) {
        const nextMidnight = new Date(
          currStart.getFullYear(),
          currStart.getMonth(),
          currStart.getDate() + 1,
          0, 0, 0, 0
        );
        if (nextMidnight.getTime() < endD.getTime()) {
          const segSecs = Math.round((nextMidnight.getTime() - currStart.getTime()) / 1000);
          if (segSecs >= 60) {
            const segDate = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
            segments.push({
              date: segDate,
              startTime: currStart,
              endTime: nextMidnight,
              secs: segSecs
            });
          }
          currStart = nextMidnight;
        } else {
          const segSecs = Math.round((endD.getTime() - currStart.getTime()) / 1000);
          if (segSecs >= 60) {
            const segDate = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
            segments.push({
              date: segDate,
              startTime: currStart,
              endTime: endD,
              secs: segSecs
            });
          }
          break;
        }
      }

      const newPomoLogs: any[] = [];
      segments.forEach((seg, i) => {
        const formattedStart = seg.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const formattedEnd = seg.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const alreadyExists = existingLogs.some((l: any) => 
          l.mode === 'sleep' && 
          l.date === seg.date && 
          (l.startTime === formattedStart || Math.abs(l.durationSeconds - seg.secs) < 5)
        );

        if (!alreadyExists) {
          newPomoLogs.push({
            id: i === 0 ? newSession.id : `${newSession.id}_split_${i}`,
            date: seg.date,
            mode: 'sleep' as const,
            startTime: formattedStart,
            endTime: formattedEnd,
            durationSeconds: seg.secs,
            notes: feeling ? `Sleep Rest - ${feeling}` : 'Sleep Rest Session'
          });
        }
      });

      if (newPomoLogs.length > 0) {
        const updatedPomoLogs = [...newPomoLogs, ...existingLogs];
        localStorage.setItem('practca_pomo_logs', JSON.stringify(updatedPomoLogs));
        window.dispatchEvent(new Event('practca_pomo_logs_update'));
        window.dispatchEvent(new Event('storage'));
      }
    } catch (e) {
      console.error("Error writing sleep to pomo logs:", e);
    }

    // Parallel cloud state sync
    syncTimerAndSleepToCloud({
      isSleeping: false,
      sleepStartTime: null,
      sleepSessions: updated
    });
  };

  const handleStartPowerNap = (durationMins: number) => {
    const effectiveDuration = Math.min(30, Math.max(1, durationMins));
    const now = Date.now();
    const nowStr = new Date(now).toISOString();
    const endTime = now + effectiveDuration * 60 * 1000;

    setIsPowerNapping(true);
    isPowerNappingRef.current = true;
    setPowerNapTargetMins(effectiveDuration);
    setPowerNapStartTime(nowStr);
    setPowerNapEndTime(endTime);
    setPowerNapTimeLeftSeconds(effectiveDuration * 60);

    localStorage.setItem('practca_is_power_nap', 'true');
    localStorage.setItem('practca_power_nap_target_mins', String(effectiveDuration));
    localStorage.setItem('practca_power_nap_start_time', nowStr);
    localStorage.setItem('practca_power_nap_end_time', String(endTime));

    // Enable power nap state without overnight screen-lock
    setIsSleeping(false);
    isSleepingRef.current = false;
    setSleepStartTime(nowStr);
    localStorage.removeItem('practca_is_sleeping');
    localStorage.removeItem('practca_pomo_paused_state');
    localStorage.setItem('practca_sleep_start_time', nowStr);
    localStorage.setItem('practca_pomo_mode', 'sleep');
    localStorage.setItem('practca_pomo_start', nowStr);
    window.dispatchEvent(new Event('practca_pomo_mode_change'));

    setShowRestModeModal(false);
    setShowSleepActivityAlert(false);

    syncTimerAndSleepToCloud({
      isSleeping: false,
      isPowerNapping: true,
      powerNapTargetMins: effectiveDuration,
      sleepStartTime: nowStr,
    });
  };

  const handleStopPowerNap = (feeling?: string) => {
    stopPowerNapAlarm();
    const currentStart = powerNapStartTime || sleepStartTime || new Date().toISOString();
    const endStr = new Date().toISOString();
    const startD = new Date(currentStart);
    const endD = new Date(endStr);
    const durationSecs = Math.round((endD.getTime() - startD.getTime()) / 1000);

    let updated = sleepSessions;

    // Any time log less than 1 minute (< 60 seconds) shall not be added to the logs
    if (durationSecs >= 60) {
      const actualMins = Math.max(1, Math.round(durationSecs / 60));
      const napTag = `⚡ Power Nap (${powerNapTargetMins}m target)`;
      const finalFeeling = feeling ? `${napTag} - ${feeling}` : napTag;
      const baseId = 'power-nap-' + Date.now();

      const newSession = {
        id: baseId,
        startTime: currentStart,
        endTime: endStr,
        duration: actualMins,
        feeling: finalFeeling
      };

      updated = [newSession, ...sleepSessions];
      setSleepSessions(updated);
      localStorage.setItem('practca_sleep_sessions', JSON.stringify(updated));

      // Split across midnight if the Power Nap crossed 12:00 AM so 24-hour clock ledger stays accurate per day
      const newPomoLogs: any[] = [];
      let currStart = new Date(startD.getTime());
      let segIndex = 0;
      while (currStart.getTime() < endD.getTime()) {
        const nextMid = new Date(currStart.getFullYear(), currStart.getMonth(), currStart.getDate() + 1, 0, 0, 0, 0);
        const segEnd = nextMid.getTime() < endD.getTime() ? nextMid : endD;
        const segSecs = Math.round((segEnd.getTime() - currStart.getTime()) / 1000);
        if (segSecs >= 60) {
          const segDateStr = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
          newPomoLogs.push({
            id: segIndex === 0 ? baseId : `${baseId}_split_${segIndex}`,
            date: segDateStr,
            mode: 'sleep' as const,
            startTime: currStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
            endTime: segEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
            durationSeconds: segSecs,
            notes: finalFeeling
          });
          segIndex++;
        }
        currStart = segEnd;
      }

      if (newPomoLogs.length > 0) {
        try {
          const existingLogsRaw = localStorage.getItem('practca_pomo_logs');
          const existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
          const updatedPomoLogs = [...newPomoLogs, ...existingLogs];
          localStorage.setItem('practca_pomo_logs', JSON.stringify(updatedPomoLogs));
          window.dispatchEvent(new Event('practca_pomo_logs_update'));
          window.dispatchEvent(new Event('storage'));
        } catch (e) {
          console.error("Error writing power nap to pomo logs:", e);
        }
      }
    }

    setIsPowerNapping(false);
    isPowerNappingRef.current = false;
    setPowerNapStartTime(null);
    setPowerNapEndTime(null);
    setShowPowerNapAlarmModal(false);

    localStorage.removeItem('practca_is_power_nap');
    localStorage.removeItem('practca_power_nap_target_mins');
    localStorage.removeItem('practca_power_nap_start_time');
    localStorage.removeItem('practca_power_nap_end_time');

    setIsSleeping(false);
    isSleepingRef.current = false;
    setSleepStartTime(null);
    localStorage.removeItem('practca_is_sleeping');
    localStorage.removeItem('practca_sleep_start_time');
    localStorage.setItem('practca_pomo_mode', 'idle');
    localStorage.removeItem('practca_pomo_start');
    window.dispatchEvent(new Event('practca_pomo_mode_change'));

    syncTimerAndSleepToCloud({
      isSleeping: false,
      isPowerNapping: false,
      sleepStartTime: null,
      sleepSessions: updated
    });
  };

  const handleSnoozePowerNap = (snoozeMins: number = 5) => {
    stopPowerNapAlarm();
    const newEndTime = Date.now() + snoozeMins * 60 * 1000;
    setPowerNapEndTime(newEndTime);
    localStorage.setItem('practca_power_nap_end_time', String(newEndTime));
    setShowPowerNapAlarmModal(false);
  };

  const handleDeleteSleepSession = (id: string) => {
    const baseId = id.replace(/(?:_split_|-split-)\d+$/, '');
    const updated = sleepSessions.filter(s => s.id !== id && s.id !== baseId);
    setSleepSessions(updated);
    localStorage.setItem('practca_sleep_sessions', JSON.stringify(updated));

    // Also remove from practca_pomo_logs if present
    try {
      const rawPomo = localStorage.getItem('practca_pomo_logs');
      if (rawPomo) {
        const parsedPomo = JSON.parse(rawPomo);
        if (Array.isArray(parsedPomo)) {
          const filteredPomo = parsedPomo.filter((l: any) => {
            if (!l) return false;
            if (l.id === id || l.id === baseId) return false;
            if (typeof l.id === 'string' && (l.id.startsWith(`${baseId}_split_`) || l.id.startsWith(`${baseId}-split-`))) {
              return false;
            }
            return true;
          });
          localStorage.setItem('practca_pomo_logs', JSON.stringify(filteredPomo));
          window.dispatchEvent(new Event('practca_pomo_logs_update'));
        }
      }
    } catch (e) {}

    // Parallel cloud state sync
    syncTimerAndSleepToCloud({
      sleepSessions: updated
    });
  };

  // Sync focusSessions and sleepSessions when logSyncEngine updates localStorage
  useEffect(() => {
    const handleSyncSessionsFromStorage = () => {
      try {
        const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions'));
        if (rawFocus) {
          const parsedFocus = JSON.parse(rawFocus);
          if (Array.isArray(parsedFocus)) {
            setFocusSessions(parsedFocus);
          }
        }
        const rawSleep = localStorage.getItem('practca_sleep_sessions');
        if (rawSleep) {
          const parsedSleep = JSON.parse(rawSleep);
          if (Array.isArray(parsedSleep)) {
            setSleepSessions(parsedSleep);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('practca_pomo_logs_update', handleSyncSessionsFromStorage);
    return () => window.removeEventListener('practca_pomo_logs_update', handleSyncSessionsFromStorage);
  }, []);

  const handleAddSleepSession = (session: { id?: string; startTime: string; endTime: string; duration: number; feeling?: string }) => {
    const newSession = {
      id: session.id || 'sleep-' + Date.now(),
      startTime: session.startTime,
      endTime: session.endTime,
      duration: Math.min(1440, Math.max(1, session.duration)),
      feeling: session.feeling
    };
    const updated = [newSession, ...sleepSessions];
    setSleepSessions(updated);
    localStorage.setItem('practca_sleep_sessions', JSON.stringify(updated));

    // Parallel cloud state sync
    syncTimerAndSleepToCloud({
      sleepSessions: updated
    });
  };

  // Live elapsed sleep timer effect
  useEffect(() => {
    if (!isSleeping || !sleepStartTime) {
      setElapsedSleepText('00h 00m 00s');
      return;
    }

    const updateTimer = () => {
      const currentStart = sleepStartTime || localStorage.getItem('practca_sleep_start_time');
      if (!currentStart) return;
      const elapsedMs = Date.now() - new Date(currentStart).getTime();
      if (elapsedMs < 0) {
        setElapsedSleepText('00h 00m 00s');
        return;
      }
      const secs = Math.floor(elapsedMs / 1000) % 60;
      const mins = Math.floor(elapsedMs / (1000 * 60)) % 60;
      const hrs = Math.floor(elapsedMs / (1000 * 60 * 60));
      
      const pad = (num: number) => String(num).padStart(2, '0');
      setElapsedSleepText(`${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isSleeping, sleepStartTime]);

  // Detect keyboard keydowns as activity and trigger alert when in sleep mode
  useEffect(() => {
    if (!isSleeping) return;

    const handleKeyDown = () => {
      setShowSleepActivityAlert(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSleeping]);

  const handleOverlayClick = () => {
    setShowSleepActivityAlert(true);
  };

  // Auto-dismiss sleep warning alert after 3.5 seconds
  useEffect(() => {
    if (showSleepActivityAlert) {
      const timer = setTimeout(() => {
        setShowSleepActivityAlert(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [showSleepActivityAlert]);

  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('practca_custom_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load custom user session:", e);
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [activeScheduledPracticeSession, setActiveScheduledPracticeSession] = useState<ScheduledPracticeSessionRecord | null>(null);
  const [pendingTimedPracticeNotification, setPendingTimedPracticeNotification] = useState<{
    session: ScheduledPracticeSessionRecord;
    isSnoozeResume?: boolean;
    snoozeMinutes?: number;
  } | null>(null);
  const currentUserRef = React.useRef(currentUser);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Dynamic Time Trigger for Scheduled Timed Practice Pop-Up Notification (Up to 2 Daily Slots + Snooze)
  useEffect(() => {
    const stopScheduler = startScheduledPracticeScheduler(() => ({
      currentUser: currentUserRef.current,
      onUpdateProfile: setCurrentUser,
      onNotifySession: (record, meta) => {
        setPendingTimedPracticeNotification({
          session: record,
          isSnoozeResume: meta?.isSnoozeResume,
          snoozeMinutes: meta?.snoozeMinutes
        });
      },
      onTriggerSession: (record) => {
        setActiveScheduledPracticeSession(record);
      }
    }));

    const handleOpenFromEvent = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as ScheduledPracticeSessionRecord | undefined;
      if (detail && detail.question) {
        setActiveScheduledPracticeSession(detail);
      }
    };
    const handleOpenNotificationEvent = (e: Event) => {
      const detail = (e as CustomEvent)?.detail as
        | { session?: ScheduledPracticeSessionRecord; isSnoozeResume?: boolean; snoozeMinutes?: number }
        | undefined;
      if (detail?.session && detail.session.question) {
        setPendingTimedPracticeNotification({
          session: detail.session,
          isSnoozeResume: detail.isSnoozeResume,
          snoozeMinutes: detail.snoozeMinutes
        });
      }
    };

    window.addEventListener('practca_open_scheduled_practice', handleOpenFromEvent);
    window.addEventListener('practca_open_timed_practice_notification', handleOpenNotificationEvent);

    return () => {
      stopScheduler();
      window.removeEventListener('practca_open_scheduled_practice', handleOpenFromEvent);
      window.removeEventListener('practca_open_timed_practice_notification', handleOpenNotificationEvent);
    };
  }, []);

  // Custom Authentication Modal States
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'verify' | 'forgot' | 'reset'>('signup');
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState<string>('');
  const [pendingVerifyName, setPendingVerifyName] = useState<string>('');
  const [pendingVerifyUid, setPendingVerifyUid] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMessage, setAuthSuccessMessage] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState<boolean>(false);

  // Form Inputs for Auth Portal
  const [authNameInput, setAuthNameInput] = useState<string>('');
  const [authEmailInput, setAuthEmailInput] = useState<string>('');
  const [authPasswordInput, setAuthPasswordInput] = useState<string>('');
  const [authCodeInput, setAuthCodeInput] = useState<string>('');
  const [resetCodeInput, setResetCodeInput] = useState<string>('');
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');
  const [isAuthSmtpConfigured, setIsAuthSmtpConfigured] = useState<boolean>(true);
  const [authDevCode, setAuthDevCode] = useState<string | null>(null);
  const [showAuthDevCode, setShowAuthDevCode] = useState<boolean>(false);

  // Universal Search and deep linking Subject Active Tab active states
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [subjectActiveTab, setSubjectActiveTab] = useState<'blueprint' | 'references' | 'sections' | 'limits' | 'formulas' | 'standards' | 'quick_review'>('blueprint');
  const mainScrollRef = React.useRef<HTMLElement | null>(null);
  const levelMenuRef = React.useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState<boolean>(false);

  // Smooth scroll-to-top whenever the active view or selected subject changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setShowScrollTop(false);
    setIsHeaderScrolled(false);
  }, [currentView, selectedSubjectId, selectedPracticeSubjectId, selectedPastPaperSubjectId, selectedRevisionReferenceSubjectId]);

  // Close CA Curriculum Level dropdown when clicking outside
  useEffect(() => {
    if (!showLevelMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (levelMenuRef.current && !levelMenuRef.current.contains(e.target as Node)) {
        setShowLevelMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLevelMenu]);

  // Global Keyboard Shortcuts: Ctrl+K / Cmd+K (Command Search), Alt+1..9 (Workspace Views), Alt+B (Toggle Sidebar)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }

      const target = e.target as HTMLElement | null;
      const isEditable = Boolean(
        target && (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable
        )
      );
      if (isEditable) return;

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const key = e.key.toLowerCase();
        if (key === '1') { e.preventDefault(); setView('dashboard'); }
        else if (key === '2') { e.preventDefault(); setView('revision'); }
        else if (key === '3') { e.preventDefault(); setView('tasks'); }
        else if (key === '4') { e.preventDefault(); setView('pomodora'); }
        else if (key === '5') { e.preventDefault(); setSelectedSubjectId(null); setView('subjects'); }
        else if (key === '6') { e.preventDefault(); setSelectedRevisionReferenceSubjectId(null); setView('references'); }
        else if (key === '7') { e.preventDefault(); setSelectedPracticeSubjectId(null); setView('practice'); }
        else if (key === '8') { e.preventDefault(); setSelectedPastPaperSubjectId(null); setView('pastpapers'); }
        else if (key === '9') { e.preventDefault(); setView('peers'); }
        else if (key === '0') { e.preventDefault(); setView('home'); }
        else if (key === 'b') { e.preventDefault(); handleToggleSidebar(); }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Real-time Peer Study Requests Notifications State
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [pendingPeersCount, setPendingPeersCount] = useState<number>(0);

  // Monitor user Authentication session
  useEffect(() => {
    // 1. Initial state check from localStorage (synchronous fallback)
    const stored = localStorage.getItem('practca_custom_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.uid) {
          setCurrentUser(parsed);
        }
      } catch (e) {
        console.error("Failed to parse custom user:", e);
      }
    }

    // 2. Always listen to Firebase Auth changes in real-time
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let mergedUser = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Student',
          emailVerified: true,
          emote: '👨‍🎓',
          coursePreference: 'Both Groups',
          motto: 'Focused on CA Final success!',
          examDate: '',
          dailyGoalMinutes: 0,
          studyStatus: 'Offline',
          hydrationSoundEnabled: localStorage.getItem('practca_hydration_sound_enabled') !== 'false'
        };

        // Try to merge with localStorage data to avoid losing custom details
        const storedLocal = localStorage.getItem('practca_custom_user');
        if (storedLocal) {
          try {
            const parsed = JSON.parse(storedLocal);
            if (parsed && (parsed.email?.toLowerCase() === user.email?.toLowerCase() || parsed.uid === user.uid)) {
              mergedUser = {
                ...mergedUser,
                ...parsed,
                uid: user.uid, // Always prioritize Firebase UID for matching rules
                email: user.email || parsed.email || '',
              };
            }
          } catch (e) {
            console.error("Error merging with stored custom user:", e);
          }
        }

        // Also fetch from Firestore user document to synchronize full profile config
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const d = docSnap.data();
            mergedUser = {
              ...mergedUser,
              displayName: d.displayName || mergedUser.displayName,
              emote: d.emote || mergedUser.emote,
              coursePreference: d.coursePreference || mergedUser.coursePreference,
              motto: d.motto || mergedUser.motto,
              examDate: d.examDate || mergedUser.examDate,
              dailyGoalMinutes: d.dailyGoalMinutes !== undefined ? d.dailyGoalMinutes : mergedUser.dailyGoalMinutes,
              studyStatus: d.studyStatus || mergedUser.studyStatus,
              hydrationSoundEnabled: d.hydrationSoundEnabled !== undefined ? d.hydrationSoundEnabled : mergedUser.hydrationSoundEnabled
            };
            if (d.hydrationSoundEnabled !== undefined) {
              setHydrationSoundEnabled(d.hydrationSoundEnabled);
              localStorage.setItem('practca_hydration_sound_enabled', String(d.hydrationSoundEnabled));
            }
          }
        } catch (fsErr) {
          console.warn("Firestore profile fetch offline/deferred on auth change:", fsErr);
        }

        localStorage.setItem('practca_custom_user', JSON.stringify(mergedUser));
        setCurrentUser(mergedUser);
      } else {
        // Keep custom user if loaded, otherwise set null
        const isCustomNow = localStorage.getItem('practca_custom_user');
        if (!isCustomNow) {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sync with Firestore in real-time when a user is signed in
  useEffect(() => {
    if (!currentUser || currentUser.isGuest || currentUser.uid === 'guest_user' || !auth.currentUser) return;

    const attemptsSubcol = getFirestoreSubcollectionName('practiceAttempts', caLevel);
    const pathAttempts = `users/${currentUser.uid}/${attemptsSubcol}`;
    const attsRef = collection(db, 'users', currentUser.uid, attemptsSubcol);
    const unsubscribeAtts = onSnapshot(attsRef, (snapshot) => {
      const list: PracticeAttempt[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as PracticeAttempt);
      });
      // Sort chronologically by timestamp
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setPracticeAttempts(list);
      try {
        localStorage.setItem(getLevelScopedKey('practca_practice_attempts', caLevel), JSON.stringify(list));
      } catch {}
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathAttempts);
    });

    const booksSubcol = getFirestoreSubcollectionName('bookmarkedSections', caLevel);
    const pathBookmarks = `users/${currentUser.uid}/${booksSubcol}`;
    const booksRef = collection(db, 'users', currentUser.uid, booksSubcol);
    const unsubscribeBooks = onSnapshot(booksRef, (snapshot) => {
      const list: BookmarkedSection[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as BookmarkedSection);
      });
      setBookmarkedSections(list);
      try {
        localStorage.setItem(getLevelScopedKey('practca_bookmarked_sections', caLevel), JSON.stringify(list));
      } catch {}
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathBookmarks);
    });

    const qBooksSubcol = getFirestoreSubcollectionName('bookmarkedQuestions', caLevel);
    const pathQuestionBookmarks = `users/${currentUser.uid}/${qBooksSubcol}`;
    const questionBooksRef = collection(db, 'users', currentUser.uid, qBooksSubcol);
    const unsubscribeQuestionBooks = onSnapshot(questionBooksRef, (snapshot) => {
      const list: BookmarkedQuestion[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as BookmarkedQuestion);
      });
      list.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
      setBookmarkedQuestions(list);
      try {
        localStorage.setItem(getLevelScopedKey('practca_bookmarked_questions', caLevel), JSON.stringify(list));
      } catch {}
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathQuestionBookmarks);
    });

    const focusSubcol = getFirestoreSubcollectionName('focusSessions', caLevel);
    const pathFocus = `users/${currentUser.uid}/${focusSubcol}`;
    const focusRef = collection(db, 'users', currentUser.uid, focusSubcol);
    const unsubscribeFocus = onSnapshot(focusRef, (snapshot) => {
      const list: FocusSession[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as FocusSession);
      });
      // Sort chronologically by timestamp
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setFocusSessions(list);
      try {
        localStorage.setItem(getLevelScopedKey('practca_focus_sessions', caLevel), JSON.stringify(list));
      } catch {}
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathFocus);
    });

    // Subscriptions for user settings root document
    const pathUserConfig = `users/${currentUser.uid}`;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data) {
          if (typeof data.darkMode === 'boolean') {
            setDarkMode(data.darkMode);
          }
          // Synchronize CA/CMA level if updated in cloud
          if (data.caLevel && isValidCALevelValue(data.caLevel)) {
            if (data.caLevel !== getSelectedCALevel()) {
              setSelectedCALevel(data.caLevel);
            }
          }
          // Synchronize target exam date and focus goal for active CA level
          const examField = getUserDocExamDateField(caLevel);
          if (data[examField] === '') {
            localStorage.setItem(getLevelScopedKey('practca_exam_attempt_cleared', caLevel), 'true');
            localStorage.removeItem(getLevelScopedKey('practca_exam_date', caLevel));
            setExamDate('');
          } else if (data[examField]) {
            localStorage.removeItem(getLevelScopedKey('practca_exam_attempt_cleared', caLevel));
            setExamDate(data[examField]);
            localStorage.setItem(getLevelScopedKey('practca_exam_date', caLevel), data[examField]);
          }
          const goalField = getUserDocDailyGoalField(caLevel);
          if (typeof data[goalField] === 'number') {
            setDailyGoalMinutes(data[goalField]);
            localStorage.setItem(getLevelScopedKey('practca_daily_goal', caLevel), String(data[goalField]));
          }
          if (data.hydrationSoundEnabled !== undefined) {
            setHydrationSoundEnabled(data.hydrationSoundEnabled);
            localStorage.setItem('practca_hydration_sound_enabled', String(data.hydrationSoundEnabled));
          }
          if (data.dailyGoalsHistory && typeof data.dailyGoalsHistory === 'object') {
            localStorage.setItem(getLevelScopedKey('practca_daily_goals_history', caLevel), JSON.stringify(data.dailyGoalsHistory));
          }

          // 🛌 Real-Time Sleep & Power Nap State Sync across concurrent sessions
          const incomingPowerNap = Boolean(data.isPowerNapping) || localStorage.getItem('practca_is_power_nap') === 'true';
          if (incomingPowerNap) {
            if (isSleepingRef.current) {
              setIsSleeping(false);
              isSleepingRef.current = false;
              localStorage.removeItem('practca_is_sleeping');
            }
          } else if (data.isSleeping !== undefined && data.isSleeping !== isSleepingRef.current) {
            setIsSleeping(data.isSleeping);
            isSleepingRef.current = data.isSleeping;
            if (data.isSleeping) {
              localStorage.setItem('practca_is_sleeping', 'true');
            } else {
              localStorage.removeItem('practca_is_sleeping');
            }
          }
          if (data.sleepStartTime !== undefined && data.sleepStartTime !== sleepStartTimeRef.current) {
            setSleepStartTime(data.sleepStartTime);
            sleepStartTimeRef.current = data.sleepStartTime;
            if (data.sleepStartTime) {
              localStorage.setItem('practca_sleep_start_time', data.sleepStartTime);
            } else {
              localStorage.removeItem('practca_sleep_start_time');
            }
          }
          if (data.sleepSessions && Array.isArray(data.sleepSessions)) {
            const currentSerialized = JSON.stringify(sleepSessionsRef.current);
            const incomingSerialized = JSON.stringify(data.sleepSessions);
            if (currentSerialized !== incomingSerialized) {
              setSleepSessions(data.sleepSessions);
              localStorage.setItem('practca_sleep_sessions', incomingSerialized);
            }
          }

          // ⏱️ Real-Time Focus Timer Sync across concurrent sessions
          if (data.timerIsRunning !== undefined) {
            const incomingIsRunning = data.timerIsRunning;
            const incomingSecondsLeft = data.timerSecondsLeft ?? (25 * 60);
            const incomingDuration = data.timerDuration ?? (25 * 60);
            const incomingType = data.timerType ?? 'work';
            const incomingUpdatedAt = data.timerUpdatedAt ?? Date.now();

            let calculatedSecondsLeft = incomingSecondsLeft;
            if (incomingIsRunning && incomingUpdatedAt) {
              const elapsedSeconds = Math.floor((Date.now() - incomingUpdatedAt) / 1000);
              calculatedSecondsLeft = Math.max(0, incomingSecondsLeft - elapsedSeconds);
            }

            const isRunningDiffers = incomingIsRunning !== timerIsRunningRef.current;
            const typeDiffers = incomingType !== timerTypeRef.current;
            const durationDiffers = incomingDuration !== timerDurationRef.current;
            const secondsDiffers = Math.abs(calculatedSecondsLeft - timerSecondsLeftRef.current) > 3;

            if (isRunningDiffers || typeDiffers || durationDiffers || secondsDiffers) {
              setTimerIsRunning(incomingIsRunning);
              setTimerType(incomingType);
              setTimerDuration(incomingDuration);
              setTimerSecondsLeft(calculatedSecondsLeft);
            }
          }

          // 🎯 Real-Time Active Focus Task Sync across concurrent sessions
          if (data.activeFocusTask !== undefined) {
            const currentSerialized = JSON.stringify(activeFocusTaskRef.current);
            const incomingSerialized = JSON.stringify(data.activeFocusTask);
            if (currentSerialized !== incomingSerialized) {
              setActiveFocusTask(data.activeFocusTask);
            }
          }
          
          setCurrentUser(prevUser => {
            if (!prevUser) return null;
            const resolvedHandle =
              data.studentHandle ||
              prevUser.studentHandle ||
              getSimpleUsername(prevUser);
            const resolvedDisplayHandle =
              data.displayHandle ||
              prevUser.displayHandle ||
              resolvedHandle;
            const updated = {
              ...prevUser,
              displayName: data.displayName || prevUser.displayName || '',
              phone: data.phone || prevUser.phone || '',
              motto: data.motto || prevUser.motto || '',
              coursePreference: data.coursePreference || prevUser.coursePreference || 'Both Groups',
              emote: data.emote || prevUser.emote || '👨‍🎓',
              studyStatus: data.studyStatus || prevUser.studyStatus || 'Offline',
              studentHandle: resolvedHandle.replace(/^@+/, '').toLowerCase(),
              displayHandle: resolvedDisplayHandle.replace(/^@+/, '')
            };
            if (JSON.stringify(prevUser) !== JSON.stringify(updated)) {
              localStorage.setItem('practca_custom_user', JSON.stringify(updated));
              return updated;
            }
            return prevUser;
          });
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, pathUserConfig);
    });

    // Real-time listener for incoming pending peer requests for notifications
    const peerReqRef = collection(db, 'peerRequests');
    const q = query(
      peerReqRef,
      where('toUserId', '==', currentUser.uid),
      where('status', '==', 'pending')
    );
    const unsubscribePeerRequests = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setPendingRequests(list);
      setPendingPeersCount(list.length);
    }, (error) => {
      console.warn("Error listening to peer requests for notification badges:", error);
    });

    return () => {
      unsubscribeAtts();
      unsubscribeBooks();
      unsubscribeQuestionBooks();
      unsubscribeUser();
      unsubscribeFocus();
      unsubscribePeerRequests();
    };
  }, [currentUser?.uid, auth.currentUser, caLevel]);

  // Migrate offline/local Guest progress automatically upon Login
  useEffect(() => {
    if (!currentUser || currentUser.isGuest || currentUser.uid === 'guest_user' || !auth.currentUser) return;

    const syncLocalToFirestore = async () => {
      // Migrate theme configuration first without overwriting custom studentHandle
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        const payload: Record<string, any> = {
          darkMode: darkMode,
          hydrationSoundEnabled: hydrationSoundEnabled,
          uid: currentUser.uid,
          email: currentUser.email || '',
          updatedAt: new Date().toISOString()
        };
        if (currentUser.studentHandle) {
          payload.studentHandle = String(currentUser.studentHandle).replace(/^@+/, '').toLowerCase();
        }
        if (currentUser.displayHandle) {
          payload.displayHandle = String(currentUser.displayHandle).replace(/^@+/, '');
        }
        await setDoc(userDocRef, payload, { merge: true });
      } catch (err) {
        console.error("Migration error for user theme: ", err);
      }

      const localAttemptsStr = localStorage.getItem('practca_practice_attempts') || localStorage.getItem('cavault_practice_attempts');
      if (localAttemptsStr) {
        try {
          const localAttempts: PracticeAttempt[] = JSON.parse(localAttemptsStr);
          if (localAttempts.length > 0) {
            const validSubjects = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
            for (const att of localAttempts) {
              const cleanId = `att_${att.questionId}_${new Date(att.timestamp).getTime()}`.replace(/[^a-zA-Z0-9_]/g, '_');
              const subId = validSubjects.includes(att.subjectId) ? att.subjectId : ('AFM' as any);
              await setDoc(doc(db, 'users', currentUser.uid, 'practiceAttempts', cleanId), {
                questionId: att.questionId || 'unknown',
                subjectId: subId,
                chapterName: att.chapterName ? att.chapterName.substring(0, 190) : 'General',
                isCorrect: Boolean(att.isCorrect),
                timestamp: att.timestamp || new Date().toISOString()
              });
            }
            localStorage.removeItem('practca_practice_attempts');
            localStorage.removeItem('cavault_practice_attempts');
          }
        } catch (err) {
          console.error("Migration error for practice attempts: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/practiceAttempts`);
        }
      }

      const localBooksStr = localStorage.getItem('practca_bookmarked_sections') || localStorage.getItem('cavault_bookmarked_sections');
      if (localBooksStr) {
        try {
          const localBooks: BookmarkedSection[] = JSON.parse(localBooksStr);
          if (localBooks.length > 0) {
            const validSubjects = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
            for (const book of localBooks) {
              const cleanId = `book_${book.subjectId}_${book.number}`.replace(/[^a-zA-Z0-9_]/g, '_');
              const subId = validSubjects.includes(book.subjectId) ? book.subjectId : ('AFM' as any);
              await setDoc(doc(db, 'users', currentUser.uid, 'bookmarkedSections', cleanId), {
                subjectId: subId,
                number: book.number || '0',
                heading: book.heading ? book.heading.substring(0, 240) : 'General',
                purpose: book.purpose ? book.purpose.substring(0, 1900) : 'Notes'
              });
            }
            localStorage.removeItem('practca_bookmarked_sections');
            localStorage.removeItem('cavault_bookmarked_sections');
          }
        } catch (err) {
          console.error("Migration error for bookmarked sections: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/bookmarkedSections`);
        }
      }

      // Migrate Revision Planner local offline data
      const subjectIds: SubjectId[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
      for (const subId of subjectIds) {
        const localKeyNew = `practca_revision_planner_${subId}`;
        const localKeyOld = `cavault_revision_planner_${subId}`;
        const stored = localStorage.getItem(localKeyNew) || localStorage.getItem(localKeyOld);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.revisionsCount || parsed.chapters) {
              const docRef = doc(db, 'users', currentUser.uid, 'revisionPlanner', subId);
              await setDoc(docRef, {
                subjectId: subId,
                revisionsCount: parsed.revisionsCount || 2,
                chapters: parsed.chapters || {},
                updatedAt: new Date().toISOString()
              });
              localStorage.removeItem(localKeyNew);
              localStorage.removeItem(localKeyOld);
            }
          } catch (err) {
            console.error(`Migration error for revision planner ${subId}: `, err);
            handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/revisionPlanner/${subId}`);
          }
        }
      }

      // Migrate Focus sessions local offline data
      const localFocusStr = localStorage.getItem('practca_focus_sessions');
      if (localFocusStr) {
        try {
          const localSess: FocusSession[] = JSON.parse(localFocusStr);
          if (localSess.length > 0) {
            const validSubjects = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
            for (const sess of localSess) {
              const cleanId = sess.id || `sess_${Date.now()}_${Math.random()}`;
              const subId = validSubjects.includes(sess.subjectId) ? sess.subjectId : ('AFM' as any);
              const cleanData: any = {
                id: cleanId,
                duration: Math.floor(Number(sess.duration || 0)),
                subjectId: subId,
                timestamp: sess.timestamp || new Date().toISOString()
              };
              if (sess.description) {
                cleanData.description = sess.description.substring(0, 950);
              }
              await setDoc(doc(db, 'users', currentUser.uid, 'focusSessions', cleanId), cleanData);
            }
            localStorage.removeItem('practca_focus_sessions');
          }
        } catch (err) {
          console.error("Migration error for focus sessions: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/focusSessions`);
        }
      }

      // Migrate Flashcard Confidence Ratings local offline data
      const localRatingsStr = localStorage.getItem('practca_flashcard_ratings');
      if (localRatingsStr) {
        try {
          const localRatings: Record<string, any> = JSON.parse(localRatingsStr);
          const validSubjects = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
          for (const [cardId, ratingData] of Object.entries(localRatings)) {
            if (ratingData && typeof ratingData === 'object') {
              const cleanId = cardId.replace(/[^a-zA-Z0-9_]/g, '_');
              const subId = validSubjects.includes(ratingData.subjectId) ? ratingData.subjectId : ('Audit' as any);
              const ratingVal = Math.min(5, Math.max(1, Number(ratingData.rating) || 3));
              await setDoc(doc(db, 'users', currentUser.uid, 'flashcardRatings', cleanId), {
                cardId: cleanId,
                subjectId: subId,
                rating: ratingVal,
                conceptTitle: ratingData.conceptTitle ? String(ratingData.conceptTitle).substring(0, 480) : '',
                category: ratingData.category ? String(ratingData.category).substring(0, 190) : '',
                statutoryRef: ratingData.statutoryRef ? String(ratingData.statutoryRef).substring(0, 190) : '',
                updatedAt: ratingData.updatedAt || new Date().toISOString()
              }, { merge: true });
            }
          }
        } catch (err) {
          console.error("Migration error for flashcard ratings: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/flashcardRatings`);
        }
      }

      // Migrate Local Task Lists
      const localListsStr = localStorage.getItem('practca_local_task_lists') || localStorage.getItem('cavault_local_task_lists');
      if (localListsStr) {
        try {
          const localLists = JSON.parse(localListsStr);
          if (Array.isArray(localLists) && localLists.length > 0) {
            for (const list of localLists) {
              const cleanListId = list.id.startsWith('local-list-')
                ? list.id.replace('local-list-', 'cloud-list-')
                : list.id === 'local-default' ? 'cloud-default' : list.id;

              const docRef = doc(db, 'users', currentUser.uid, 'taskLists', cleanListId);
              await setDoc(docRef, {
                id: cleanListId,
                title: list.title || 'Untitled Board'
              }, { merge: true });
            }
            localStorage.removeItem('practca_local_task_lists');
            localStorage.removeItem('cavault_local_task_lists');
          }
        } catch (err) {
          console.error("Migration error for task lists: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/taskLists`);
        }
      }

      // Migrate Local Tasks
      const localTasksStr = localStorage.getItem('practca_local_tasks') || localStorage.getItem('cavault_local_tasks');
      if (localTasksStr) {
        try {
          const localTasks = JSON.parse(localTasksStr);
          if (Array.isArray(localTasks) && localTasks.length > 0) {
            for (const task of localTasks) {
              const cleanTaskId = task.id.startsWith('local-task-')
                ? task.id.replace('local-task-', 'cloud-task-')
                : task.id;

              const cleanListId = task.listId && task.listId.startsWith('local-list-')
                ? task.listId.replace('local-list-', 'cloud-list-')
                : task.listId === 'local-default' ? 'cloud-default' : (task.listId || 'cloud-default');

              const docRef = doc(db, 'users', currentUser.uid, 'tasks', cleanTaskId);
              
              // Map local values to fit strict Firestore schema u/s isValidTask
              const taskData: any = {
                id: cleanTaskId,
                title: task.title || 'Untitled Goal',
                status: (task.status === 'completed' || task.status === 'unachieved' || task.status === 'needsAction') ? task.status : 'needsAction',
                listId: cleanListId
              };

              if (task.notes) {
                taskData.notes = task.notes;
              }
              if (task.due) {
                taskData.due = task.due;
              }
              if (task.completed) {
                taskData.completed = task.completed;
              }
              if (task.priority && (task.priority === 'High' || task.priority === 'Medium' || task.priority === 'Low')) {
                taskData.priority = task.priority;
              }
              if (task.subjectCode) {
                taskData.subjectCode = task.subjectCode;
              }
              if (task.cleanTitle) {
                taskData.cleanTitle = task.cleanTitle;
              }

              await setDoc(docRef, taskData, { merge: true });
            }
            localStorage.removeItem('practca_local_tasks');
            localStorage.removeItem('cavault_local_tasks');
            
            // Clear or update any stored selected list ID if it matches local defaults to avoid stale UI selection
            const savedSelected = localStorage.getItem('practca_selected_list_id');
            if (savedSelected === 'local-default') {
              localStorage.setItem('practca_selected_list_id', 'cloud-default');
            } else if (savedSelected && savedSelected.startsWith('local-list-')) {
              localStorage.setItem('practca_selected_list_id', savedSelected.replace('local-list-', 'cloud-list-'));
            }
          }
        } catch (err) {
          console.error("Migration error for tasks: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/tasks`);
        }
      }
    };

    syncLocalToFirestore();
  }, [currentUser?.uid, auth.currentUser]);

  // Track the application theme classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('practca_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('practca_theme', 'light');
    }
  }, [darkMode]);

  // Pomodoro Focus Timer ticking logic (Decommissioned in favor of 24h clock study mode)
  useEffect(() => {
    // Disabled to prevent unwanted background execution
  }, []);

  // Pomodoro Focus Timer Side-Effects (Decommissioned in favor of 24h clock study mode)
  useEffect(() => {
    // Disabled to prevent any alert/sound notifications or background state updates
  }, []);

  const handleStartTimer = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(console.error);
    }
    setTimerIsRunning(true);
    syncTimerAndSleepToCloud({
      timerIsRunning: true,
      timerSecondsLeft: timerSecondsLeft,
      timerDuration: timerDuration,
      timerType: timerType,
      timerUpdatedAt: Date.now()
    });
  };
  const handlePauseTimer = () => {
    setTimerIsRunning(false);
    syncTimerAndSleepToCloud({
      timerIsRunning: false,
      timerSecondsLeft: timerSecondsLeft,
      timerDuration: timerDuration,
      timerType: timerType,
      timerUpdatedAt: Date.now()
    });
  };
  const handleResetTimer = () => {
    setTimerIsRunning(false);
    setTimerSecondsLeft(timerDuration);
    syncTimerAndSleepToCloud({
      timerIsRunning: false,
      timerSecondsLeft: timerDuration,
      timerDuration: timerDuration,
      timerType: timerType,
      timerUpdatedAt: Date.now()
    });
  };
  const handleSelectPreset = (minutes: number, type: 'work' | 'break') => {
    setTimerIsRunning(false);
    setTimerType(type);
    setTimerDuration(minutes * 60);
    setTimerSecondsLeft(minutes * 60);
    syncTimerAndSleepToCloud({
      timerIsRunning: false,
      timerSecondsLeft: minutes * 60,
      timerDuration: minutes * 60,
      timerType: type,
      timerUpdatedAt: Date.now()
    });
  };
  const handleStopAndLog = () => {
    setTimerIsRunning(false);
    syncTimerAndSleepToCloud({
      timerIsRunning: false,
      timerSecondsLeft: timerSecondsLeft,
      timerDuration: timerDuration,
      timerType: timerType,
      timerUpdatedAt: Date.now()
    });
  };
  const handleUpdateDailyGoal = (minutes: number) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const historyStr = localStorage.getItem(getLevelScopedKey('practca_daily_goals_history'));
    let history: Record<string, number> = {};
    if (historyStr) {
      try {
        history = JSON.parse(historyStr);
      } catch (e) {
        // ignore
      }
    } else {
      // Seed historical baseline with current goal for older dates
      history['2020-01-01'] = dailyGoalMinutes;
    }

    history[dateStr] = minutes;
    localStorage.setItem(getLevelScopedKey('practca_daily_goals_history'), JSON.stringify(history));

    setDailyGoalMinutes(minutes);
    localStorage.setItem(getLevelScopedKey('practca_daily_goal'), minutes.toString());

    // Also sync the history array or map structure to Firestore user object if possible
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      const goalField = getUserDocDailyGoalField(caLevel);
      setDoc(userRef, { 
        [goalField]: minutes,
        dailyGoalsHistory: history 
      }, { merge: true }).catch(err => {
        console.warn("Error syncing goal history to Firestore:", err);
      });
    }
  };

  const allocateTimeToRevisionPlanner = async (
    subjectId: SubjectId,
    chapterName: string,
    relevance: 'General' | 'Revision' | 'Final Revision',
    durationMinutes: number,
    timestamp: string,
    taskTitle: string,
    targetRevKey?: RevisionCycleKey,
    markCompleted?: boolean,
    sessionId?: string
  ) => {
    try {
      await syncStudySessionToRevisionPlanner({
        id: sessionId,
        subjectId,
        chapterName,
        durationMinutes,
        timestamp,
        taskTitle,
        notes: taskTitle,
        revKey: targetRevKey,
        relevance,
        markRevisionCompleted: markCompleted
      });
    } catch (error) {
      console.error("Error in allocateTimeToRevisionPlanner:", error);
    }
  };

  const handleAllocateSession = async (sessionData: Omit<FocusSession, 'id' | 'timestamp'> & { id?: string; timestamp?: string; chapterName?: string; relevance?: 'General' | 'Revision' | 'Final Revision'; revKey?: RevisionCycleKey; markRevisionCompleted?: boolean }) => {
    // Strictly enforce: any time log less than 1 minute shall not be added to the logs
    if (!sessionData || Number(sessionData.duration || 0) < 1) return;
    const timestamp = sessionData.timestamp || new Date().toISOString();
    const sessionId = sessionData.id || `sess_${Date.now()}`;
    const isWorkSession = sessionData.sessionType === 'work';
    
    // Prevent routine sessions from ever misattributing as breaks
    const isRoutineDesc = sessionData.description?.toLowerCase()?.includes('routine') || (sessionData as any).notes?.toLowerCase()?.includes('routine');
    const resolvedSessionType = sessionData.sessionType === 'work' ? 'work' : (sessionData.sessionType === 'routine' || isRoutineDesc) ? 'routine' : 'break';
    
    let finalChapterName = isWorkSession ? sessionData.chapterName : undefined;
    let finalRelevance = isWorkSession ? sessionData.relevance : undefined;

    if (isWorkSession) {
      const desc = sessionData.description || '';
      const descUpper = desc.toUpperCase();

      // Parse relevance from description if missing
      if (!finalRelevance) {
        if (descUpper.includes('[FINAL REVISION]') || descUpper.includes('FINAL REVISION') || descUpper.includes('[HIGH]') || descUpper.includes('🔴')) {
          finalRelevance = 'Final Revision';
        } else if (descUpper.includes('[GENERAL]') || descUpper.includes('GENERAL') || descUpper.includes('[LOW]') || descUpper.includes('🔵')) {
          finalRelevance = 'General';
        } else if (descUpper.includes('[REVISION]') || descUpper.includes('REVISION') || descUpper.includes('[MEDIUM]') || descUpper.includes('🟡')) {
          finalRelevance = 'Revision';
        } else {
          finalRelevance = 'Revision'; // Default fallback
        }
      }

      // Parse chapterName from description/notes if missing or generic
      if (!finalChapterName || finalChapterName === 'General / Entire Subject') {
        const chaptersList = SUBJECT_CHAPTERS[sessionData.subjectId] || [];
        const cleanDesc = desc
          .replace(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/ig, '')
          .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/ig, '')
          .replace(/[🔴🟡🔵]/g, '')
          .replace(/^[\s\-\|]+|[\s\-\|]+$/g, '')
          .trim();

        const cleanDescUpper = cleanDesc.toUpperCase();

        // Find precise or partial match
        const matchedChapter = chaptersList.find(ch => {
          const chUpper = ch.toUpperCase();
          if (cleanDescUpper === chUpper) return true;
          
          // Strip prefixes like "Study " or "Revise " or "Study: "
          const cleanDescWithoutPrefix = cleanDescUpper.replace(/^(STUDY|REVISE)\s+/i, '').replace(/^STUDY:\s+/i, '').trim();
          if (cleanDescWithoutPrefix === chUpper) return true;
          
          if (cleanDescUpper.includes(chUpper)) return true;
          if (chUpper.includes(cleanDescUpper) && cleanDescUpper.length > 5) return true;
          return false;
        });

        if (matchedChapter) {
          finalChapterName = matchedChapter;
        }
      }
    }

    // Resolve explicit revKey: prioritize passed revKey -> activeFocusTask -> description regex -> cached last study session
    let finalRevKey = sessionData.revKey;
    if (!finalRevKey && isWorkSession) {
      const desc = sessionData.description || '';
      const descUpper = desc.toUpperCase();
      if (activeFocusTask?.revKey) {
        finalRevKey = activeFocusTask.revKey;
      } else if (descUpper.match(/\b(FINAL REVISION|1\.5\s*DAY|1\.5D|R1\.5|REV\s*1\.5|REVISION\s*1\.5)\b/)) {
        finalRevKey = 'rev1.5';
      } else if (descUpper.match(/\b(BASELINE|BL\s*STUDY)\b/)) {
        finalRevKey = 'baseline';
      } else {
        const revNumMatch = descUpper.match(/\b(?:R|REV|REVISION)\s*(\d+)\b/);
        if (revNumMatch) {
          finalRevKey = `rev${parseInt(revNumMatch[1], 10)}`;
        } else {
          try {
            const lastStr = localStorage.getItem('practca_last_study_session');
            if (lastStr) {
              const parsed = JSON.parse(lastStr);
              if (parsed && parsed.revKey) finalRevKey = parsed.revKey;
            }
          } catch (e) {}
          if (!finalRevKey && sessionData.subjectId && finalRelevance !== 'General' && finalRelevance !== 'Final Revision') {
            try {
              const dynamicCount = computeSubjectMilestoneRevisionCount(sessionData.subjectId);
              const dynamicKeys = getSubjectDynamicRevKeys(dynamicCount);
              finalRevKey = (dynamicKeys[dynamicKeys.length - 1] as any) || 'rev1';
            } catch (e) {
              finalRevKey = 'rev1';
            }
          }
        }
      }
    }

    const newSession: FocusSession = {
      id: sessionId,
      duration: sessionData.duration,
      subjectId: sessionData.subjectId,
      description: sessionData.description || (resolvedSessionType === 'routine' ? 'Daily Routine Block' : resolvedSessionType === 'break' ? 'Desk Break Rest' : 'Digital Study Block'),
      sessionType: resolvedSessionType,
      timestamp,
      chapterName: finalChapterName,
      relevance: finalRelevance,
      revKey: finalRevKey
    };

    // Check for duplicates in focusSessions
    const isDuplicateFocus = focusSessions.some(s => 
      s.id === sessionId || 
      (s.subjectId === sessionData.subjectId && s.timestamp === timestamp && Math.abs(s.duration - sessionData.duration) <= 0.1)
    );
    if (!isDuplicateFocus) {
      // Update local state and storage immediately for instant UI response
      const updated = [...focusSessions, newSession];
      setFocusSessions(updated);
      localStorage.setItem(getLevelScopedKey('practca_focus_sessions'), JSON.stringify(updated));

      // Persist to Firestore in background if a real registered user is authenticated
      const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
      if (isRealUser) {
        const focusSubcol = getFirestoreSubcollectionName('focusSessions', caLevel);
        const docRef = doc(db, 'users', currentUser.uid, focusSubcol, sessionId);
        setDoc(docRef, newSession).catch((err) => {
          console.error("Failed storing focus entry to Firestore: ", err);
          handleFirestoreError(err, OperationType.CREATE, `users/${currentUser.uid}/${focusSubcol}`);
        });
      }
    }

    // Allocate time to Revision Planner for all study (work) sessions with a chapter (strictly excluding Digital Study Block, Mock Tests, and MCQ Practice)
    const rawDescStr = (sessionData.description || '').trim();
    const isNonRevisionBlock =
      /^(digital study block|general study)$/i.test(rawDescStr) ||
      /mock\s*test|\bmcq\s*practice\b/i.test(rawDescStr) ||
      (sessionData as any).isMockTest === true;
    if (isWorkSession && !isNonRevisionBlock && finalChapterName && finalChapterName !== 'General / Entire Subject') {
      await allocateTimeToRevisionPlanner(
        sessionData.subjectId,
        finalChapterName,
        finalRelevance || 'Revision',
        sessionData.duration,
        timestamp,
        sessionData.description || 'Linked Study Block',
        finalRevKey,
        sessionData.markRevisionCompleted,
        sessionId
      );
    }

    // Ensure 24-hour continuous grind clock ledger (practca_pomo_logs) has this entry
    try {
      const pomoLogsKey = getLevelScopedKey('practca_pomo_logs');
      const existingLogsRaw = localStorage.getItem(pomoLogsKey);
      let existingLogs = existingLogsRaw ? JSON.parse(existingLogsRaw) : [];
      // Auto-heal any existing logs where routine was incorrectly saved as break
      let logsRepaired = false;
      existingLogs = existingLogs.map((l: any) => {
        if (l.mode === 'break' && (l.notes === 'Daily Routine Block' || l.notes === 'Extended Routine Block' || l.notes?.toLowerCase()?.includes('routine'))) {
          logsRepaired = true;
          return { ...l, mode: 'routine' as const, subjectId: undefined };
        }
        return l;
      });
      if (logsRepaired) {
        localStorage.setItem(pomoLogsKey, JSON.stringify(existingLogs));
      }

      const alreadyLogged = existingLogs.some((l: any) => l.id === sessionId);
      if (!alreadyLogged) {
        const startD = new Date(new Date(timestamp).getTime() - sessionData.duration * 60000);
        const endD = new Date(timestamp);
        
        // Correctly identify mode: work -> study, routine -> routine, break -> break
        const targetMode: 'study' | 'break' | 'routine' = 
          resolvedSessionType === 'work' ? 'study' : 
          resolvedSessionType === 'routine' ? 'routine' : 'break';
        const defaultNotes = targetMode === 'routine' ? (sessionData.description || 'Daily Routine Block') : 
          targetMode === 'break' ? 'Desk Break Rest' : 
          (finalChapterName ? `Study: ${finalChapterName}` : 'Digital Study Block');

        // Split session across midnight if needed
        const segments: any[] = [];
        let currStart = new Date(startD.getTime());
        let segIdx = 0;
        while (true) {
          const nextMidnight = new Date(
            currStart.getFullYear(),
            currStart.getMonth(),
            currStart.getDate() + 1,
            0, 0, 0, 0
          );
          if (nextMidnight.getTime() < endD.getTime()) {
            const segSecs = Math.round((nextMidnight.getTime() - currStart.getTime()) / 1000);
            if (segSecs >= 60) {
              const segDateStr = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
              segments.push({
                id: segIdx === 0 ? sessionId : `${sessionId}_split_${segIdx}`,
                date: segDateStr,
                mode: targetMode,
                startTime: currStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                endTime: nextMidnight.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                durationSeconds: segSecs,
                subjectId: targetMode === 'study' ? sessionData.subjectId : undefined,
                notes: sessionData.description || defaultNotes
              });
            }
            currStart = nextMidnight;
            segIdx++;
          } else {
            const segSecs = Math.round((endD.getTime() - currStart.getTime()) / 1000);
            if (segSecs >= 60) {
              const segDateStr = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
              segments.push({
                id: segIdx === 0 ? sessionId : `${sessionId}_split_${segIdx}`,
                date: segDateStr,
                mode: targetMode,
                startTime: currStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                endTime: endD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                durationSeconds: segSecs,
                subjectId: targetMode === 'study' ? sessionData.subjectId : undefined,
                notes: sessionData.description || defaultNotes
              });
            }
            break;
          }
        }
        if (segments.length > 0) {
          const updatedPomoLogs = [...segments, ...existingLogs];
          localStorage.setItem(pomoLogsKey, JSON.stringify(updatedPomoLogs));
          window.dispatchEvent(new Event('practca_pomo_logs_update'));
          window.dispatchEvent(new Event('storage'));
        }
      }
    } catch (e) {
      console.error("Error ensuring session in pomo logs:", e);
    }

    // Explicit task completion pipeline: only complete daily tasks if markRevisionCompleted was explicitly requested by user action
    if (isWorkSession && (sessionData as any).markRevisionCompleted === true && finalChapterName && finalChapterName !== 'General / Entire Subject') {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const rawLocalTasks = localStorage.getItem(getLevelScopedKey('practca_local_tasks')) || localStorage.getItem(getLevelScopedKey('cavault_local_tasks'));
        if (rawLocalTasks) {
          const taskList = JSON.parse(rawLocalTasks);
          if (Array.isArray(taskList)) {
            const normFinalChap = normalizeKey(finalChapterName);
            const matchingTask = taskList.find((t: any) => {
              if (t.status === 'completed' || Boolean(t.completed)) return false;
              const tSub = (t.subjectCode || '').toUpperCase();
              if (tSub && tSub !== sessionData.subjectId.toUpperCase()) return false;
              const tChapNorm = normalizeKey(t.chapterName);
              const tCleanNorm = normalizeKey(t.cleanTitle || t.title);
              return Boolean(
                (tChapNorm && tChapNorm === normFinalChap) ||
                (tCleanNorm && normFinalChap && (tCleanNorm === normFinalChap))
              );
            });

            if (matchingTask) {
              await syncTaskCompletionAcrossAllLinks(matchingTask, true, {
                selectedDate: todayStr,
                completionDate: timestamp,
                revKey: finalRevKey,
                alreadyLogged: true
              });

              setAutoSyncedToast({
                taskId: matchingTask.id,
                title: matchingTask.cleanTitle || matchingTask.title,
                subjectCode: sessionData.subjectId,
                chapterName: finalChapterName,
                duration: sessionData.duration
              });
            }
          }
        }
      } catch (err) {
        console.error("Error in task completion sync:", err);
      }
    }
  };

  const handleAllocateActiveFocusTask = async (elapsedMinutes: number) => {
    if (!activeFocusTask) return;
    const durationMins = elapsedMinutes;
    
    // Map activeFocusTask.subjectCode to a valid SubjectId
    const inputSub = activeFocusTask.subjectCode.toUpperCase();
    const validSubjects: SubjectId[] = getLevelSubjectIds(caLevel);
    const matched = validSubjects.find(sub => sub.toUpperCase() === inputSub) || getDefaultSubjectForLevel(caLevel);

    await handleAllocateSession({
      duration: durationMins,
      subjectId: matched,
      description: activeFocusTask.title,
      sessionType: 'work',
      chapterName: activeFocusTask.chapterName,
      relevance: activeFocusTask.relevance,
      revKey: (activeFocusTask as any).revKey
    });
  };

  const handleCompleteLinkedTask = async (task: any) => {
    if (!task) return;
    if (task._alreadyLogged) {
      // Task session was already recorded by the caller (e.g. DigitalPomodora toggleLocalTaskStatus)
      return;
    }

    const currentPomoMode = localStorage.getItem('practca_pomo_mode');
    const pomoStartStr = localStorage.getItem('practca_pomo_start');
    let parsedPaused: any = null;
    try {
      const rawPaused = localStorage.getItem('practca_pomo_paused_state');
      if (rawPaused) parsedPaused = JSON.parse(rawPaused);
    } catch (e) {}

    const isStudyPaused = Boolean(currentPomoMode === 'idle' && parsedPaused && parsedPaused.mode === 'study');
    const isStudyRunning = currentPomoMode === 'study' || isStudyPaused || (timerIsRunning && timerType === 'work');

    const taskTitle = (task.cleanTitle || task.title || '').trim().toLowerCase();
    const activeTitle = (activeFocusTask?.title || '').trim().toLowerCase();
    const activeChap = (activeFocusTask?.chapterName || '').trim().toLowerCase();
    const taskChap = (task.chapterName || '').trim().toLowerCase();

    const isLinkedMatch = Boolean(
      activeFocusTask && (
        (activeTitle && taskTitle && (activeTitle === taskTitle || taskTitle.includes(activeTitle) || activeTitle.includes(taskTitle))) ||
        (activeChap && taskChap && activeChap === taskChap) ||
        (activeFocusTask.title && task.title && activeFocusTask.title.toLowerCase() === task.title.toLowerCase())
      )
    );

    // If an active focus task is running on the timer, only log time if the completed task matches it
    if (activeFocusTask && !isLinkedMatch) {
      return;
    }

    // Calculate elapsedSecs: from running timer or paused study session
    let elapsedSecs = 0;
    if (isStudyPaused && typeof parsedPaused?.elapsedSeconds === 'number') {
      elapsedSecs = Math.max(0, parsedPaused.elapsedSeconds);
    } else if (currentPomoMode === 'study' && pomoStartStr) {
      const d = new Date(pomoStartStr);
      if (!isNaN(d.getTime())) {
        elapsedSecs = Math.floor((Date.now() - d.getTime()) / 1000);
      }
    }
    if (elapsedSecs <= 0 && timerIsRunning && timerType === 'work') {
      elapsedSecs = Math.max(0, timerDuration - timerSecondsLeft);
    }

    const defaultSub = getDefaultSubjectForLevel(caLevel);
    const inputSub = ((task.subjectCode || activeFocusTask?.subjectCode || defaultSub) as string).toUpperCase();
    const validSubjects: SubjectId[] = getLevelSubjectIds(caLevel);
    const matchedSub = validSubjects.find(sub => sub.toUpperCase() === inputSub) || defaultSub;
    const desc = task.cleanTitle || task.title || activeFocusTask?.title || 'Target Task';
    let chap = task.chapterName || activeFocusTask?.chapterName;
    if (!chap || chap === 'General / Entire Subject') {
      const chaptersList = SUBJECT_CHAPTERS[matchedSub] || [];
      const cleanDescUpper = (task.cleanTitle || task.title || desc).toUpperCase();
      const matchedCh = chaptersList.find(ch => {
        const chU = ch.toUpperCase();
        return cleanDescUpper.includes(chU) || chU.includes(cleanDescUpper);
      });
      if (matchedCh) chap = matchedCh;
    }
    const rel = task.relevance || activeFocusTask?.relevance || 'Revision';

    // Calculate total time previously invested in this task
    const prevInvested = focusSessions
      .filter(s => {
        const sDesc = (s.description || '').toLowerCase();
        const tClean = (task.cleanTitle || task.title || '').toLowerCase();
        return (tClean && (sDesc.includes(tClean) || tClean.includes(sDesc))) || (chap && s.chapterName === chap);
      })
      .reduce((acc, curr) => acc + (curr.duration || 0), 0);

    // Log current segment if at least 60 seconds of unlogged study time accrued
    if (isStudyRunning && elapsedSecs >= 60) {
      const durationMins = Math.max(1, Math.round(elapsedSecs / 60));
      const isSkipRevision = (task as any)?.revKey === 'none' || (task as any)?.skipRevision === true;
      let taskRevKey = (task as any)?.revKey || (activeFocusTask as any)?.revKey;
      if (taskRevKey === 'none' || taskRevKey === 'skip') {
        taskRevKey = undefined;
      }

      if (!taskRevKey) {
        const titleU = (task.cleanTitle || task.title || '').toUpperCase();
        if (titleU.match(/\b(FINAL REVISION|1\.5\s*DAY|1\.5D|R1\.5|REV\s*1\.5|REVISION\s*1\.5)\b/)) {
          taskRevKey = 'rev1.5';
        } else if (titleU.match(/\b(R3|REV\s*3|REVISION\s*3)\b/)) {
          taskRevKey = 'rev3';
        } else if (titleU.match(/\b(R2|REV\s*2|REVISION\s*2)\b/)) {
          taskRevKey = 'rev2';
        } else if (titleU.match(/\b(R1|REV\s*1|REVISION\s*1)\b/)) {
          taskRevKey = 'rev1';
        }
      }

      const shouldMarkRevisionComplete = !isSkipRevision;
      const endMs = isStudyPaused && parsedPaused?.pausedAt ? parsedPaused.pausedAt : Date.now();
      const endD = new Date(endMs);
      const startD = (!isStudyPaused && pomoStartStr)
        ? new Date(pomoStartStr)
        : new Date(endD.getTime() - elapsedSecs * 1000);

      // Split session across midnight if needed for Revision Planner, focusSessions, and Grind Clock ledger
      const segments: { start: Date; end: Date; secs: number; mins: number; dateStr: string }[] = [];
      let currStart = new Date(startD.getTime());
      while (true) {
        const nextMidnight = new Date(
          currStart.getFullYear(),
          currStart.getMonth(),
          currStart.getDate() + 1,
          0, 0, 0, 0
        );
        if (nextMidnight.getTime() < endD.getTime()) {
          const segSecs = Math.round((nextMidnight.getTime() - currStart.getTime()) / 1000);
          if (segSecs > 0) {
            const dateStr = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
            segments.push({
              start: currStart,
              end: nextMidnight,
              secs: segSecs,
              mins: Math.max(1, Math.round(segSecs / 60)),
              dateStr
            });
          }
          currStart = nextMidnight;
        } else {
          const segSecs = Math.round((endD.getTime() - currStart.getTime()) / 1000);
          if (segSecs > 0) {
            const dateStr = `${currStart.getFullYear()}-${String(currStart.getMonth() + 1).padStart(2, '0')}-${String(currStart.getDate()).padStart(2, '0')}`;
            segments.push({
              start: currStart,
              end: endD,
              secs: segSecs,
              mins: Math.max(1, Math.round(segSecs / 60)),
              dateStr
            });
          }
          break;
        }
      }

      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const segLogId = `pom_log_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;

        await handleAllocateSession({
          id: segLogId,
          duration: seg.mins,
          subjectId: matchedSub,
          description: desc,
          sessionType: 'work',
          timestamp: seg.end.toISOString(),
          chapterName: chap,
          relevance: rel,
          revKey: taskRevKey,
          markRevisionCompleted: shouldMarkRevisionComplete
        });
      }
    }

    // Resolve revision key for 2-way Sprint Board & Revision Report sync
    let resolvedRevKey: RevisionCycleKey | undefined =
      (task as any)?.revKey || (activeFocusTask as any)?.revKey;
    if (!resolvedRevKey && (rel === 'Final Revision' || /\b(final\s*revision|1\.5d|1\.5\s*day|lmr)\b/i.test(desc))) {
      resolvedRevKey = 'rev1.5';
    }

    // Mark matching task as completed in localTasks / 24h target clock / Sprint Board
    try {
      const completedIso = new Date().toISOString();
      const tasksKey = getLevelScopedKey('practca_local_tasks');
      const rawTasks = localStorage.getItem(tasksKey);
      let matchedTaskObj: any = null;
      if (rawTasks) {
        const parsedTasks = JSON.parse(rawTasks);
        if (Array.isArray(parsedTasks)) {
          const updatedTasks = parsedTasks.map((t: any) => {
            const tClean = (t.cleanTitle || t.title || '').trim().toLowerCase();
            const isMatch =
              (task.id && t.id === task.id) ||
              (taskTitle && tClean && (tClean === taskTitle || tClean.includes(taskTitle) || taskTitle.includes(tClean)));
            if (isMatch) {
              matchedTaskObj = { ...t, status: 'completed', completed: completedIso };
              return matchedTaskObj;
            }
            return t;
          });
          if (matchedTaskObj) {
            localStorage.setItem(tasksKey, JSON.stringify(updatedTasks));
            localStorage.setItem(getLevelScopedKey('practca_cached_cloud_tasks'), JSON.stringify(updatedTasks));
          }
        }
      }

      const fallbackSyncTask = matchedTaskObj || {
        id: task.id || (chap ? `lmr_${matchedSub}_${normalizeKey(chap)}` : `task_${Date.now()}`),
        title: desc,
        cleanTitle: (task as any).cleanTitle || chap || desc,
        chapterName: chap,
        subjectCode: matchedSub,
        relevance: rel,
        revKey: resolvedRevKey,
        targetDurationMinutes: Number(task.targetDurationMinutes || (activeFocusTask as any)?.targetDurationMinutes || 45),
        _alreadyLogged: true
      };

      await syncTaskCompletionAcrossAllLinks(fallbackSyncTask, true, {
        alreadyLogged: true,
        revKey: resolvedRevKey
      });

      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('practca_target_system_synced'));
    } catch (e) {}

    // Move focus mode to idle and clear active task + pause state
    localStorage.setItem('practca_pomo_mode', 'idle');
    localStorage.removeItem('practca_pomo_start');
    localStorage.removeItem('practca_pomo_paused_state');
    localStorage.removeItem(getLevelScopedKey('practca_active_focus_task'));
    localStorage.removeItem('practca_last_study_session');
    setPomoPausedState(null);
    setActivePomoMode('idle');
    setActivePomoSeconds(0);
    setActiveFocusTask(null);
    setTimerIsRunning(false);
    setTimerSecondsLeft(25 * 60);

    window.dispatchEvent(new Event('practca_pomo_mode_change'));
    window.dispatchEvent(new Event('storage'));

    syncTimerAndSleepToCloud({
      activeFocusTask: null,
      timerIsRunning: false,
      timerSecondsLeft: 25 * 60
    });
  };

  const handleDeleteSession = async (id: string) => {
    const sessionToDelete = focusSessions.find(s => s.id === id);

    // Update local state and storage immediately
    const updated = focusSessions.filter(s => s.id !== id);
    setFocusSessions(updated);
    localStorage.setItem(getLevelScopedKey('practca_focus_sessions'), JSON.stringify(updated));

    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      const focusSubcol = getFirestoreSubcollectionName('focusSessions', caLevel);
      const docRef = doc(db, 'users', currentUser.uid, focusSubcol, id);
      deleteDoc(docRef).catch((err) => {
        console.error("Failed to delete focus entry: ", err);
        handleFirestoreError(err, OperationType.DELETE, `users/${currentUser.uid}/${focusSubcol}/${id}`);
      });
    }

    // Bidirectionally delete linked log across Grind Clock and Revision Planner
    await deleteLinkedLogEverywhere({
      logId: id,
      subjectId: sessionToDelete?.subjectId,
      chapterName: sessionToDelete?.chapterName,
      durationMinutes: sessionToDelete?.duration
    });
  };

  const handleToggleBookmark = async (section: BookmarkedSection) => {
    // Update local state and storage immediately
    setBookmarkedSections(prev => {
      const exists = prev.some(b => b.subjectId === section.subjectId && b.number === section.number);
      let updated;
      if (exists) {
        updated = prev.filter(b => !(b.subjectId === section.subjectId && b.number === section.number));
      } else {
        updated = [...prev, section];
      }
      localStorage.setItem(getLevelScopedKey('practca_bookmarked_sections'), JSON.stringify(updated));
      return updated;
    });

    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      const booksSubcol = getFirestoreSubcollectionName('bookmarkedSections', caLevel);
      const cleanId = `book_${section.subjectId}_${section.number}`.replace(/[^a-zA-Z0-9_]/g, '_');
      const docRef = doc(db, 'users', currentUser.uid, booksSubcol, cleanId);
      const exists = bookmarkedSections.some(b => b.subjectId === section.subjectId && b.number === section.number);
      
      if (exists) {
        deleteDoc(docRef).catch(error => {
          handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/${booksSubcol}/${cleanId}`);
        });
      } else {
        setDoc(docRef, {
          subjectId: section.subjectId,
          number: section.number,
          heading: section.heading,
          purpose: section.purpose
        }).catch(error => {
          handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}/${booksSubcol}/${cleanId}`);
        });
      }
    }
  };

  const handleToggleQuestionBookmark = async (question: BookmarkedQuestion) => {
    const exists = bookmarkedQuestions.some(b => b.questionId === question.questionId);
    setBookmarkedQuestions(prev => {
      const alreadyExists = prev.some(b => b.questionId === question.questionId);
      const updated = alreadyExists
        ? prev.filter(b => b.questionId !== question.questionId)
        : [question, ...prev];
      try {
        localStorage.setItem(getLevelScopedKey('practca_bookmarked_questions'), JSON.stringify(updated));
        window.dispatchEvent(new Event('practca_bookmarked_questions_updated'));
      } catch {}
      return updated;
    });

    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      const qBooksSubcol = getFirestoreSubcollectionName('bookmarkedQuestions', caLevel);
      const cleanId = `qbook_${question.questionId}`.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 128);
      const docRef = doc(db, 'users', currentUser.uid, qBooksSubcol, cleanId);
      if (exists) {
        deleteDoc(docRef).catch(error => {
          handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/${qBooksSubcol}/${cleanId}`);
        });
      } else {
        setDoc(docRef, {
          questionId: String(question.questionId).substring(0, 128),
          subjectId: question.subjectId,
          attempt: String(question.attempt).substring(0, 32),
          attemptLabel: String(question.attemptLabel).substring(0, 64),
          questionNumber: String(question.questionNumber).substring(0, 32),
          marks: Math.max(1, Math.min(100, Number(question.marks) || 4)),
          chapterName: String(question.chapterName).substring(0, 300),
          topicTag: String(question.topicTag).substring(0, 300),
          questionPreview: String(question.questionPreview).substring(0, 2900),
          savedAt: String(question.savedAt || new Date().toISOString()).substring(0, 64)
        }).catch(error => {
          handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}/${qBooksSubcol}/${cleanId}`);
        });
      }
    }
  };

  const handleRecordPractice = async (newAttempt: PracticeAttempt) => {
    // Update local state and storage immediately
    setPracticeAttempts(prev => {
      const updated = [...prev, newAttempt];
      localStorage.setItem(getLevelScopedKey('practca_practice_attempts'), JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('practca_practice_attempts_updated'));
      return updated;
    });

    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      const attemptsSubcol = getFirestoreSubcollectionName('practiceAttempts', caLevel);
      const cleanId = `att_${newAttempt.questionId}_${Date.now()}`.replace(/[^a-zA-Z0-9_]/g, '_');
      const docRef = doc(db, 'users', currentUser.uid, attemptsSubcol, cleanId);
      setDoc(docRef, {
        questionId: newAttempt.questionId,
        subjectId: newAttempt.subjectId,
        chapterName: newAttempt.chapterName,
        isCorrect: newAttempt.isCorrect,
        timestamp: newAttempt.timestamp
      }).catch(error => {
        handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}/${attemptsSubcol}/${cleanId}`);
      });
    }
  };

  const handleClearHistory = async () => {
    localStorage.removeItem(getLevelScopedKey('practca_practice_attempts'));
    localStorage.removeItem(getLevelScopedKey('cavault_practice_attempts'));
    setPracticeAttempts([]);
    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      const attemptsSubcol = getFirestoreSubcollectionName('practiceAttempts', caLevel);
      try {
        const attsRef = collection(db, 'users', currentUser.uid, attemptsSubcol);
        const querySnapshot = await getDocs(attsRef);
        const batchPromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(batchPromises);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${currentUser.uid}/${attemptsSubcol}`);
      }
    }
  };

  const handleLoadDemoData = async () => {
    // Generate around 24 detailed practice questions spread over the last 4 days
    const demoAttempts: PracticeAttempt[] = [];
    const subjectsList: { sub: 'AFM' | 'FR' | 'Audit' | 'DT' | 'IDT' | 'IBS'; chapters: string[] }[] = [
      { sub: 'AFM', chapters: ['Portfolio Management', 'Foreign Exchange Exposure and Risk Management', 'Mergers, Acquisitions and Corporate Restructuring'] },
      { sub: 'FR', chapters: ['Business Combinations (Ind AS 103)', 'Financial Instruments (Ind AS 32/107/109)', 'Leases (Ind AS 116)', 'Revenue (Ind AS 115)'] },
      { sub: 'Audit', chapters: ['Audit Planning, Strategy and Execution', 'Reporting', 'Due Diligence, Investigation & Forensic Audit'] },
      { sub: 'DT', chapters: ['Basic Concepts', 'Incomes which do not form part of Total Income', 'Profits and Gains of Business or Profession', 'Capital Gains', 'Income from Other Sources'] },
      { sub: 'IDT', chapters: ['Input Tax Credit', 'Supply', 'Value of Supply'] },
      { sub: 'IBS', chapters: ['Cross-functional Integration'] }
    ];

    const dates = [
      new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      new Date().toISOString()
    ];

    // Seed data meticulously so we have realistic accuracies (e.g. DT/IDT slightly weak)
    let qCounter = 1;
    subjectsList.forEach((item) => {
      item.chapters.forEach((chap, cIdx) => {
        dates.forEach((date, dIdx) => {
          // Determine realistic correctness:
          // DT: roughly 50% accurate (regradial)
          // IDT: roughly 60% accurate
          // AFM/FR: roughly 80% accurate
          let isCorrect = true;
          if (item.sub === 'DT') {
            isCorrect = dIdx % 2 === 0;
          } else if (item.sub === 'IDT') {
            isCorrect = (dIdx + cIdx) % 3 !== 0;
          } else {
            isCorrect = (dIdx + cIdx) % 5 !== 0;
          }

          demoAttempts.push({
            questionId: `${item.sub}_DEMO_Q_${qCounter++}`,
            subjectId: item.sub,
            chapterName: chap,
            isCorrect,
            timestamp: date
          });
        });
      });
    });

    // Seed 30 days of detailed FocusSession logs with outliers to demonstrate filtering
    const demoSessions: FocusSession[] = [];
    const subjects: ('AFM' | 'FR' | 'Audit' | 'DT' | 'IDT' | 'IBS')[] = ['AFM', 'FR', 'Audit', 'DT', 'IDT', 'IBS'];
    
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString();
      
      // Let's create some outliers (complete days off)
      if ([4, 11, 18, 25].includes(i)) {
        continue;
      }
      
      // Days with very low study minutes (sub-50% outlier)
      if ([6, 20].includes(i)) {
        demoSessions.push({
          id: `demo-session-low-${i}`,
          duration: 20, // Only 20 mins of study
          subjectId: subjects[i % subjects.length],
          timestamp: dateStr,
          description: "Sub-50% Outlier: Brief formula lookup",
          sessionType: 'work'
        });
        continue;
      }
      
      // Regular study days: add 2-4 sessions of 45-60 mins each
      const numSessions = 2 + (i % 3); // 2, 3, or 4 sessions
      for (let sIdx = 0; sIdx < numSessions; sIdx++) {
        const duration = 45 + ((i + sIdx) % 4) * 5; // 45 to 60 mins
        demoSessions.push({
          id: `demo-session-${i}-${sIdx}`,
          duration,
          subjectId: subjects[(i + sIdx) % subjects.length],
          timestamp: new Date(d.getTime() + sIdx * 2.5 * 3600 * 1000).toISOString(),
          description: `Chapter revision session ${sIdx + 1}`,
          sessionType: 'work'
        });
      }
      
      // Add break sessions: 1-2 breaks of 10-15 mins
      const numBreaks = 1 + (i % 2);
      for (let bIdx = 0; bIdx < numBreaks; bIdx++) {
        demoSessions.push({
          id: `demo-break-${i}-${bIdx}`,
          duration: 10 + (bIdx * 5),
          subjectId: subjects[i % subjects.length],
          timestamp: new Date(d.getTime() + bIdx * 3.5 * 3600 * 1000 + 45 * 60 * 1000).toISOString(),
          description: "Coffee rest",
          sessionType: 'break'
        });
      }
    }

    localStorage.setItem('practca_practice_attempts', JSON.stringify(demoAttempts));
    setPracticeAttempts(demoAttempts);
    localStorage.setItem('practca_focus_sessions', JSON.stringify(demoSessions));
    setFocusSessions(demoSessions);

    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      try {
        for (const att of demoAttempts) {
          const cleanId = `att_${att.questionId}_${new Date(att.timestamp).getTime()}`.replace(/[^a-zA-Z0-9_]/g, '_');
          await setDoc(doc(db, 'users', currentUser.uid, 'practiceAttempts', cleanId), {
            questionId: att.questionId,
            subjectId: att.subjectId,
            chapterName: att.chapterName,
            isCorrect: Boolean(att.isCorrect),
            timestamp: att.timestamp
          });
        }
        for (const s of demoSessions) {
          await setDoc(doc(db, 'users', currentUser.uid, 'focusSessions', s.id), {
            id: s.id,
            duration: Math.floor(Number(s.duration) || 0),
            subjectId: s.subjectId,
            timestamp: s.timestamp,
            ...(s.description ? { description: s.description } : {}),
            ...(s.sessionType ? { sessionType: s.sessionType } : {})
          });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}/practiceAttempts`);
      }
    }
  };

  const handleCustomSignUp = async (name: string, email: string, pword: string) => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      try {
        await signOut(auth);
      } catch (sqErr) {
        console.warn("Silent ignore auth signout failure:", sqErr);
      }
      
      // A. Register in Firebase Auth first to get a real Firebase Auth UID
      let firebaseUid: string | null = null;
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, pword);
        firebaseUid = credential.user.uid;
      } catch (fbErr: any) {
        console.warn("Firebase SignUp notice (checking if already exists):", fbErr.code);
        if (fbErr.code === 'auth/email-already-in-use') {
          try {
            const credential = await signInWithEmailAndPassword(auth, email, pword);
            firebaseUid = credential.user.uid;
          } catch (signInErr) {
            throw new Error(`Email already registered in system. Please try logging in instead.`);
          }
        } else {
          throw fbErr;
        }
      }

      // B. Register in Node.js custom DB with matching UID
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: pword, uid: firebaseUid })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }
      const activeUser = {
        uid: data.uid,
        email: data.email,
        displayName: data.name,
        emailVerified: true
      };
      localStorage.setItem('practca_custom_user', JSON.stringify(activeUser));
      setCurrentUser(activeUser);
      setIsAuthModalOpen(false);
      setAuthSuccessMessage(null);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleCustomVerify = async (code: string) => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingVerifyEmail, code })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }
      const activeUser = {
        uid: data.uid,
        email: data.email,
        displayName: data.name,
        emailVerified: true
      };
      localStorage.setItem('practca_custom_user', JSON.stringify(activeUser));
      setCurrentUser(activeUser);
      setIsAuthModalOpen(false);
      setAuthSuccessMessage(null);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleCustomLogin = async (email: string, pword: string) => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      try {
        await signOut(auth);
      } catch (sqErr) {
        console.warn("Silent ignore auth signout failure:", sqErr);
      }
      
      // A. Login to Node.js backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // B. Authenticate in Firebase client-side Auth with same credentials
      try {
        await signInWithEmailAndPassword(auth, email, pword);
      } catch (fbErr: any) {
        console.warn("Firebase login warning, checking auto-creation:", fbErr.code);
        if (fbErr.code === 'auth/user-not-found' || fbErr.code === 'auth/invalid-credential' || fbErr.code === 'auth/wrong-password') {
          // User exists in our custom DB, so auto-create them in Firebase Auth
          try {
            await createUserWithEmailAndPassword(auth, email, pword);
          } catch (createErr) {
            console.error("Failed to automatically recreate Firebase user:", createErr);
          }
        }
      }

      const activeUser = {
        uid: data.uid,
        email: data.email,
        displayName: data.name,
        emailVerified: true
      };
      localStorage.setItem('practca_custom_user', JSON.stringify(activeUser));
      setCurrentUser(activeUser);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingVerifyEmail })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend code');
      }
      setAuthSuccessMessage(`New verification checkcode requested successfully for ${pendingVerifyEmail}!`);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);
    setAuthDevCode(null);
    setShowAuthDevCode(false);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request reset');
      }
      setPendingVerifyEmail(email);
      setIsAuthSmtpConfigured(!!data.isSmtpConfigured);
      setAuthDevCode(data.devCode || null);
      if (data.isSmtpConfigured) {
        setAuthSuccessMessage(`Password reset code dispatched successfully to ${email}! Please check your email inbox.`);
      } else {
        setAuthSuccessMessage(`Password reset code generated! Since SMTP is not configured in this sandbox environment, you can use the secure 'Reveal Code' fallback below.`);
      }
      setAuthModalMode('reset');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleResetPassword = async (email: string, code: string, pword: string) => {
    setAuthSubmitting(true);
    setAuthError(null);
    setAuthSuccessMessage(null);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword: pword })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }
      
      setAuthSuccessMessage("Your password was updated successfully! Please sign in with your new password.");
      setAuthModalMode('signin');
      setResetCodeInput('');
      setNewPasswordInput('');
      setAuthDevCode(null);
      setShowAuthDevCode(false);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSignIn = () => {
    setAuthError(null);
    setAuthSuccessMessage(null);
    setAuthModalMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('practca_custom_user');
      setCurrentUser(null);
      await signOut(auth);
      setGoogleAccessToken(null);
    } catch (error) {
      console.error("Sign out failed: ", error);
    }
  };

  const handleToggleDarkMode = async () => {
    // Keep dark mode active as requested
    setDarkMode(true);
    localStorage.setItem('practca_theme', 'dark');

    const isRealUser = currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser;
    if (isRealUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        await setDoc(userDocRef, {
          darkMode: true,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${currentUser.uid}`);
      }
    }
  };

  const handleSearchNavigate = (params: { 
    view: 'home' | 'dashboard' | 'subjects' | 'tasks' | 'revision' | 'pastpapers' | 'practice' | 'wellbeing' | 'profile' | 'peers' | 'pomodora' | 'references'; 
    subjectId: SubjectId | null; 
    activeTab?: 'blueprint' | 'sections' | 'limits';
  }) => {
    setView(params.view);
    if (
      params.view === 'subjects' ||
      params.view === 'practice' ||
      params.view === 'pastpapers' ||
      params.view === 'references'
    ) {
      syncLibrarySubject(params.subjectId);
      if (params.view === 'subjects' && params.activeTab) {
        setSubjectActiveTab(params.activeTab);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#051424] flex flex-col items-center justify-center gap-6 text-cav-text font-sans select-none p-6">
        <BrandMark size="xl" showIcon align="center" />
        <div className="flex flex-col items-center gap-1.5 mt-2">
          <span className="text-[11px] text-amber-300/90 font-mono tracking-widest animate-pulse uppercase">
            Loading CA Final Materials...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="app-container" 
      className="flex h-screen w-full max-w-[100vw] transition-colors duration-300 bg-cav-bg text-cav-text font-sans overflow-hidden"
    >
      <ConfettiOverlay isDashboardView={currentView === 'dashboard'} />
      {/* 1. LINKEDIN-STYLE FLOATING NAVIGATION OVERLAY (Anchored Under Top-Left Logo, Zero Workspace Reflow) */}
      <AnimatePresence>
        {currentView !== 'home' && isNavOverlayOpen && (
          <>
            {/* Click-Outside Backdrop */}
            <motion.div
              key="nav-overlay-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setIsNavOverlayOpen(false)}
              className="fixed inset-0 top-16 z-40 bg-slate-950/45 backdrop-blur-[2px]"
            />

            {/* Floating Navigation Drawer Card Anchored Beneath Top-Left Logo */}
            <motion.aside
              key="nav-overlay-drawer"
              id="app-sidebar"
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[80px] left-3 sm:left-5 z-50 w-[288px] max-w-[calc(100vw-24px)] max-h-[calc(100vh-96px)] flex flex-col rounded-2xl bg-[#081728]/98 border border-sky-400/35 text-cav-sidebar-text shadow-[0_24px_64px_rgba(2,8,20,0.88)] backdrop-blur-xl overflow-hidden"
            >
              {/* Ambient glow detail */}
              <div className="absolute top-0 right-0 h-32 w-32 bg-cav-accent/8 rounded-full blur-2xl pointer-events-none" />

              {/* Top Section: Executive Home Action + Close Button */}
              <div className="px-3.5 py-4 border-b border-cav-border flex items-center justify-between gap-2.5 relative z-10 bg-[#051424]/70">
                <button
                  type="button"
                  onClick={() => {
                    setView('home');
                    setIsNavOverlayOpen(false);
                  }}
                  className="flex-1 flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gradient-to-r from-amber-500/22 via-[#192f4a] to-[#13253c] hover:from-amber-500/32 hover:border-amber-300/85 border border-amber-400/55 text-white transition-all cursor-pointer shadow-xs text-left"
                  title="Return to Executive Home & Overview"
                >
                  <span className="h-8 w-8 rounded-lg bg-amber-400/25 border border-amber-300/60 flex items-center justify-center shrink-0">
                    <Home className="h-4.5 w-4.5 text-amber-200 shrink-0" />
                  </span>
                  <div className="min-w-0">
                    <span className="font-display text-[14px] font-black tracking-tight text-white block leading-tight truncate">
                      Executive Home
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-300/90 block leading-tight">
                      Overview Board
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNavOverlayOpen(false)}
                  className="h-10 w-10 shrink-0 flex items-center justify-center bg-[#122131]/90 hover:bg-[#1c2b3c] border border-cav-border rounded-xl text-slate-300 hover:text-white transition cursor-pointer"
                  title="Close Navigation Menu (Esc)"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Grouped Links */}
              <nav className="flex-1 overflow-y-auto px-3 py-3.5 space-y-4 scrollbar-none">
                {/* Group 1: Prep & Grind */}
                <div>
                  <div className="px-2.5 mb-1.5">
                    <span className="text-[10.5px] uppercase font-mono font-black text-sky-300 tracking-widest block">
                      Prep &amp; Focus
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setView('dashboard');
                        setIsNavOverlayOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 cursor-pointer border ${
                        currentView === 'dashboard'
                          ? 'bg-gradient-to-r from-sky-500/32 via-[#203a5a] to-[#192f4a] text-white border-sky-300/95 shadow-md shadow-sky-500/20 ring-1 ring-sky-300/50'
                          : 'bg-gradient-to-r from-sky-500/18 via-[#182e49] to-[#14273e] border-sky-400/55 text-white hover:from-sky-500/28 hover:via-[#1f3a5c] hover:border-sky-300/85 shadow-sm'
                      }`}
                      title="Dashboard"
                    >
                      <span className="h-7 w-7 rounded-lg bg-sky-500/25 border border-sky-300/55 flex items-center justify-center shrink-0 shadow-xs">
                        <BarChart3 className="h-4 w-4 text-sky-200 shrink-0" />
                      </span>
                      <span className="font-display text-[14px] font-black tracking-tight text-white truncate">
                        Dashboard
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setView('revision');
                        setIsNavOverlayOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 cursor-pointer border ${
                        currentView === 'revision'
                          ? 'bg-gradient-to-r from-cyan-500/32 via-[#203a5a] to-[#192f4a] text-white border-cyan-300/95 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-300/50'
                          : 'bg-gradient-to-r from-cyan-500/18 via-[#182e49] to-[#14273e] border-cyan-400/55 text-white hover:from-cyan-500/28 hover:via-[#1f3a5c] hover:border-cyan-300/85 shadow-sm'
                      }`}
                      title="Revision Report"
                    >
                      <span className="h-7 w-7 rounded-lg bg-cyan-500/25 border border-cyan-300/55 flex items-center justify-center shrink-0 shadow-xs">
                        <Calendar className="h-4 w-4 text-cyan-200 shrink-0" />
                      </span>
                      <span className="font-display text-[14px] font-black tracking-tight text-white truncate">
                        Revision Report
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setView('tasks');
                        setIsNavOverlayOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 cursor-pointer border ${
                        currentView === 'tasks'
                          ? 'bg-gradient-to-r from-emerald-500/32 via-[#203a5a] to-[#192f4a] text-white border-emerald-300/95 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-300/50'
                          : 'bg-gradient-to-r from-emerald-500/18 via-[#182e49] to-[#14273e] border-emerald-400/55 text-white hover:from-emerald-500/28 hover:via-[#1f3a5c] hover:border-emerald-300/85 shadow-sm'
                      }`}
                      title="Study Planner"
                    >
                      <span className="h-7 w-7 rounded-lg bg-emerald-500/25 border border-emerald-300/55 flex items-center justify-center shrink-0 shadow-xs">
                        <ListTodo className="h-4 w-4 text-emerald-200 shrink-0" />
                      </span>
                      <span className="font-display text-[14px] font-black tracking-tight text-white truncate">
                        Study Planner
                      </span>
                    </button>

                    <button
                      type="button"
                      id="nav-pomodora-button"
                      onClick={() => {
                        setView('pomodora');
                        setIsNavOverlayOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 cursor-pointer border ${
                        currentView === 'pomodora'
                          ? 'bg-gradient-to-r from-amber-500/32 via-[#203a5a] to-[#192f4a] text-white border-amber-300/95 shadow-md shadow-amber-500/20 ring-1 ring-amber-300/50'
                          : 'bg-gradient-to-r from-amber-500/18 via-[#182e49] to-[#14273e] border-amber-400/55 text-white hover:from-amber-500/28 hover:via-[#1f3a5c] hover:border-amber-300/85 shadow-sm'
                      }`}
                      title="Focus Timer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="h-7 w-7 rounded-lg bg-amber-500/25 border border-amber-300/55 flex items-center justify-center shrink-0 shadow-xs">
                          <Clock className="h-4 w-4 text-amber-200 shrink-0" />
                        </span>
                        <span className="font-display text-[14px] font-black tracking-tight text-white truncate">
                          Focus Timer
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Group 2: Highlighted Main Heading Button — practACE Library */}
                <div>
                  <button
                    type="button"
                    id="nav-practace-library-button"
                    onClick={() => {
                      setView(lastLibraryPillar);
                      setIsNavOverlayOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 text-left cursor-pointer border ${
                      currentView === 'subjects' ||
                      currentView === 'references' ||
                      currentView === 'practice' ||
                      currentView === 'pastpapers'
                        ? 'bg-gradient-to-r from-amber-500/35 via-[#213855] to-[#1c2f47] text-white border-amber-300/95 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/45'
                        : 'bg-gradient-to-r from-amber-500/24 via-[#1a314c] to-[#152840] border-amber-400/70 text-amber-100 hover:text-white hover:from-amber-500/32 hover:border-amber-300/90 shadow-sm'
                    }`}
                    title="practACE Library — Knowledge Hub, Revision Studio, Practice Arena & Question Bank"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-7 w-7 rounded-lg bg-amber-400/30 border border-amber-300/60 flex items-center justify-center shrink-0 shadow-xs">
                        <Library className="h-4 w-4 text-amber-200 shrink-0" />
                      </span>
                      <span className="font-display text-[15px] font-black tracking-tight truncate">
                        practACE Library
                      </span>
                    </div>
                  </button>
                </div>

                {/* Group 3: Crew & Mindset */}
                <div>
                  <div className="px-2.5 mb-1.5">
                    <span className="text-[10.5px] uppercase font-mono font-black text-indigo-300 tracking-widest block">
                      Crew &amp; Mindset
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setView('peers');
                        setIsNavOverlayOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 cursor-pointer border ${
                        currentView === 'peers'
                          ? 'bg-gradient-to-r from-indigo-500/32 via-[#203a5a] to-[#192f4a] text-white border-indigo-300/95 shadow-md shadow-indigo-500/20 ring-1 ring-indigo-300/50'
                          : 'bg-gradient-to-r from-indigo-500/18 via-[#182e49] to-[#14273e] border-indigo-400/55 text-white hover:from-indigo-500/28 hover:via-[#1f3a5c] hover:border-indigo-300/85 shadow-sm'
                      }`}
                      title="Peer Lounge"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0 h-7 w-7 rounded-lg bg-indigo-500/25 border border-indigo-300/55 flex items-center justify-center shadow-xs">
                          <Users className="h-4 w-4 text-indigo-200" />
                        </div>
                        <span className="font-display text-[14px] font-black tracking-tight text-white truncate">
                          Peer Lounge
                        </span>
                      </div>
                      {pendingPeersCount > 0 && (
                        <span className="bg-rose-500 text-white font-mono tabular-nums font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                          {pendingPeersCount}
                        </span>
                      )}
                    </button>

                    <button
                      type="button"
                      id="nav-wellbeing-button"
                      onClick={() => {
                        setView('wellbeing');
                        setIsNavOverlayOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[14px] font-black tracking-tight transition-all duration-150 cursor-pointer border ${
                        currentView === 'wellbeing'
                          ? 'bg-gradient-to-r from-rose-500/32 via-[#203a5a] to-[#192f4a] text-white border-rose-300/95 shadow-md shadow-rose-500/20 ring-1 ring-rose-300/50'
                          : 'bg-gradient-to-r from-rose-500/18 via-[#182e49] to-[#14273e] border-rose-400/55 text-white hover:from-rose-500/28 hover:via-[#1f3a5c] hover:border-rose-300/85 shadow-sm'
                      }`}
                      title="Mind Space"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="h-7 w-7 rounded-lg bg-rose-500/25 border border-rose-300/55 flex items-center justify-center shrink-0 shadow-xs">
                          <Heart className="h-4 w-4 text-rose-200 shrink-0" />
                        </span>
                        <span className="font-display text-[14px] font-black tracking-tight text-white truncate">
                          Mind Space
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </nav>

              {/* Overlay Footer / User Segment */}
              <div id="sidebar-footer" className="p-3 border-t border-cav-border bg-[#051424]/90 flex flex-col gap-2">
                {authLoading ? (
                  <div className="h-10 w-full bg-[#122131] rounded-xl animate-pulse" />
                ) : currentUser ? (
                  <div className="flex items-center justify-between gap-2 p-2 px-3 rounded-xl bg-[#122131] border border-cav-border">
                    <div
                      onClick={() => {
                        setView('profile');
                        setIsNavOverlayOpen(false);
                      }}
                      className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition shrink-0"
                      title="Open My Profile & Custom @ID"
                    >
                      <div className="h-8 w-8 rounded-lg bg-cav-accent/15 flex items-center justify-center text-cav-accent shrink-0 border border-cav-accent/20 text-base">
                        {currentUser.emote || '👨‍🎓'}
                      </div>
                      <div className="min-w-0 whitespace-nowrap overflow-hidden">
                        <p className="text-[13px] font-extrabold text-white truncate max-w-[140px]">
                          {currentUser.displayName || currentUser.email?.split('@')[0]}
                        </p>
                        <p className="text-[10px] font-mono text-cav-accent font-extrabold tracking-wider uppercase select-none">
                          MY PROFILE
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsNavOverlayOpen(false);
                        handleSignOut();
                      }}
                      className="p-1.5 rounded-lg border border-cav-border hover:border-rose-500/30 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                      title="Sign Out"
                    >
                      <LogOut className="h-4 w-4 text-rose-400" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsNavOverlayOpen(false);
                      handleSignIn();
                    }}
                    className="py-3 px-3 text-[13px] bg-cav-accent text-slate-950 hover:bg-cav-accent/90 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-cav-accent/20 transition cursor-pointer w-full"
                    title="Sign In with Email"
                  >
                    <Mail className="h-[18px] w-[18px] shrink-0" />
                    <span className="whitespace-nowrap overflow-hidden text-[13px] font-extrabold">
                      Sign In with Email
                    </span>
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 2. MAIN COGNITIVE WORKSPACE (100% Full Viewport Width) */}
      <div className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
        
        {/* Sleek Minimal Header Bar with Top-Left Logo Navigation Overlay Trigger (Hidden on Homepage Display Board) */}
        {currentView !== 'home' && (
        <header className={`sticky top-0 z-45 flex-shrink-0 w-full overflow-hidden rounded-b-2xl border border-slate-600/60 ring-1 ring-white/[0.06] ${isHeaderScrolled ? 'min-h-[68px] py-2.5' : 'min-h-[80px] sm:min-h-[86px] py-3 sm:py-3.5'} bg-gradient-to-r from-[#0a192c]/95 via-[#102540]/95 to-[#0b1b30]/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_12px_30px_-8px_rgba(2,8,20,0.85)] backdrop-blur-xl transition-all duration-200 flex items-center`}>
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-amber-400/55 via-cyan-400/40 to-amber-400/55 pointer-events-none" />
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Zone: Top-Left practACE Logo Launcher (Toggles Floating Navigation Overlay) + Context Breadcrumb + Universal Search */}
          <div className="flex flex-1 items-center justify-between gap-3 min-w-0 pr-2 lg:pr-5">
            <div className="flex items-center gap-3 min-w-0">
              {/* Top-Left Logo Button: Toggles LinkedIn-style Floating Navigation Overlay */}
              <button
                type="button"
                onClick={() => setIsNavOverlayOpen(prev => !prev)}
                aria-expanded={isNavOverlayOpen}
                className={`relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer select-none shrink-0 group ${
                  isNavOverlayOpen
                    ? 'bg-[#12263d] border-amber-400/70 shadow-[0_0_16px_rgba(245,158,11,0.2)]'
                    : 'bg-[#0b1929]/90 hover:bg-[#12263d] border-cav-border hover:border-amber-400/45'
                }`}
                title="Click to open Navigation Overlay Menu (Alt+B)"
              >
                <BrandMark
                  size="xs"
                  showIcon
                  align="left"
                  svgClassName="h-8 sm:h-9 w-auto"
                />
                <ChevronDown
                  className={`h-4 w-4 text-amber-400 transition-transform duration-200 shrink-0 ${
                    isNavOverlayOpen ? 'rotate-180' : ''
                  }`}
                />
                {pendingPeersCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                  </span>
                )}
              </button>
            </div>

            {/* Universal Search Box shifted towards the left so the Target Meter sits in the exact center */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center justify-between gap-2.5 h-11 w-44 lg:w-52 xl:w-60 px-3.5 bg-[#0d1c2d] hover:bg-[#14263b] border border-cav-accent/35 hover:border-cav-accent/70 rounded-xl text-slate-200 hover:text-white transition-all duration-200 text-xs font-medium cursor-pointer group shrink-0 shadow-xs mr-1 lg:mr-3"
              title="Search anything (Syllabus, Sections, Rates, MCQs) — Ctrl+K / ⌘K"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Search className="h-4 w-4 text-cav-accent group-hover:scale-110 transition duration-200 shrink-0" />
                <span className="truncate text-slate-200 group-hover:text-white font-semibold">
                  Search Syllabus...
                </span>
              </div>
              <kbd className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold text-cav-accent bg-[#051424] border border-cav-border rounded-md shrink-0">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Center Zone: Centered Target Meter (or Next Exam in Active Milestone order, or No Scheduled Exam post-cycle) */}
          <div className="hidden md:flex items-center justify-center shrink-0">
            {!examScheduleInfo.hasScheduledExam ? (
              <button
                onClick={() => setShowExamModal(true)}
                className="relative flex items-center gap-2.5 h-11 bg-cav-bg hover:bg-[#0d1c2d] border border-cav-border hover:border-cav-accent/40 px-4 rounded-xl transition-all duration-200 cursor-pointer select-none active:scale-[0.99] group shrink-0"
                title="No Scheduled Exam — Click to select a next exam attempt"
              >
                <Calendar className="h-4 w-4 text-slate-400 group-hover:text-cav-accent transition-colors shrink-0" />
                <span className="text-xs font-bold text-slate-200 group-hover:text-white tracking-tight whitespace-nowrap">
                  No Scheduled Exam
                </span>
              </button>
            ) : examScheduleInfo.areExamsStarted ? (
              <div className="relative flex items-center h-11 bg-cav-bg border border-cav-border hover:border-cav-accent/40 rounded-xl transition-all duration-200 select-none shrink-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowExamModal(true)}
                  className="flex items-center gap-2.5 h-full hover:bg-[#0d1c2d] pl-4 pr-3 transition-colors cursor-pointer active:scale-[0.99] group"
                  title={`Next Exam: ${examScheduleInfo.nextExam.subjectId} (${examScheduleInfo.nextExam.formattedDate})`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    <span className="text-slate-400">Next Exam:</span>
                    <span className="text-cav-accent font-extrabold tracking-tight whitespace-nowrap group-hover:text-[#ffc174] transition-colors">
                      {examScheduleInfo.nextExam.subjectId}
                    </span>
                  </div>

                  <span className="h-4 w-[1px] bg-cav-border shrink-0" />

                  {/* Final Exam Date from Study Planner Milestones */}
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold tabular-nums text-slate-200 bg-[#0d1c2d] border border-cav-border px-2.5 py-1 rounded-lg">
                    <Calendar className="h-3 w-3 text-cav-accent shrink-0" />
                    <span className="text-white">{examScheduleInfo.nextExam.formattedDate}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[10px] text-[#ffc174] font-semibold">
                      {examScheduleInfo.nextExam.diffDays === 0
                        ? 'Today'
                        : examScheduleInfo.nextExam.diffDays === 1
                        ? 'Tomorrow'
                        : examScheduleInfo.nextExam.diffDays > 1
                        ? `${examScheduleInfo.nextExam.diffDays}d left`
                        : 'Scheduled'}
                    </span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleClearExamAttempt}
                  className="h-full px-2.5 flex items-center justify-center border-l border-cav-border text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Clear selected attempt"
                  aria-label="Clear selected attempt"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="relative flex items-center h-11 bg-cav-bg border border-cav-border hover:border-cav-accent/40 rounded-xl transition-all duration-200 select-none shrink-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowExamModal(true)}
                  className="flex items-center gap-2.5 h-full hover:bg-[#0d1c2d] pl-4 pr-3 transition-colors cursor-pointer active:scale-[0.99] group"
                  title={`Configure Attempt Target: ${getAttemptLabel(examDate)}`}
                >
                  {/* Target Attempt Label in Native Brand Gold */}
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <span className="text-slate-400">Target:</span>
                    <span className="text-cav-accent font-bold tracking-tight whitespace-nowrap group-hover:text-[#ffc174] transition-colors">
                      {getAttemptLabel(examDate).replace(/Attempt/gi, '').trim()}
                    </span>
                  </div>

                  <span className="h-4 w-[1px] bg-cav-border shrink-0" />

                  {/* Live Countdown Timer in Native Surface Pill */}
                  {timeLeft && !timeLeft.completed && (
                    <div className="flex items-center gap-1 font-mono text-[11px] font-bold tabular-nums text-slate-200 bg-[#0d1c2d] border border-cav-border px-2.5 py-1 rounded-lg">
                      <span className="text-white">{timeLeft.days}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase mr-0.5">d</span>
                      <span className="text-slate-600">:</span>
                      <span className="text-slate-200">{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase mr-0.5">h</span>
                      <span className="text-slate-600">:</span>
                      <span className="text-slate-300">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="text-[9px] text-slate-400 font-semibold uppercase">m</span>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClearExamAttempt}
                  className="h-full px-2.5 flex items-center justify-center border-l border-cav-border text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                  title="Clear selected attempt"
                  aria-label="Clear selected attempt"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Quick Action Bar (Right Zone) */}
          <div className="flex md:flex-1 items-center justify-end gap-1.5 sm:gap-2.5 min-w-0 sm:min-w-[150px] lg:min-w-[190px] pl-1.5 sm:pl-3 lg:pl-6 shrink-0">
            {/* Mobile-only compact search button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex md:hidden items-center justify-center h-11 w-11 bg-[#0d1c2d] border border-cav-accent/35 rounded-xl text-slate-200 hover:text-white transition text-xs font-semibold cursor-pointer shrink-0"
              title="Search Syllabus (⌘K / Ctrl+K)"
            >
              <Search className="h-4 w-4 text-cav-accent" />
            </button>

            {/* Mobile-only compact Target / Countdown button */}
            <button
              type="button"
              onClick={() => setShowExamModal(true)}
              className="flex md:hidden items-center gap-1.5 h-11 px-3.5 bg-[#0d1c2d] border border-cav-border rounded-xl text-[11px] font-mono font-bold text-cav-accent shrink-0 cursor-pointer"
              title={!examScheduleInfo.hasScheduledExam ? 'No Scheduled Exam — Select Next Attempt' : 'Configure Exam Target Date'}
            >
              <Calendar className="h-4 w-4 text-cav-accent shrink-0" />
              <span className="text-white tabular-nums">
                {!examScheduleInfo.hasScheduledExam
                  ? 'No Exam'
                  : examScheduleInfo.areExamsStarted
                  ? examScheduleInfo.nextExam.subjectId
                  : timeLeft && !timeLeft.completed
                  ? `${timeLeft.days}d`
                  : getAttemptLabel(examDate).replace(/Attempt/gi, '').trim()}
              </span>
            </button>

            {/* Quick-Resume Active Focus Task Pill when viewing non-Pomodora tabs */}
            {activeFocusTask && currentView !== 'pomodora' && (
              <button
                type="button"
                onClick={() => setView('pomodora')}
                className="hidden lg:flex items-center gap-2 h-11 px-3.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/35 text-xs font-bold text-amber-300 transition cursor-pointer max-w-[190px] shrink-0"
                title={`Active Target: [${activeFocusTask.subjectCode}] ${activeFocusTask.title} — Click to open Focus Timer`}
              >
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-mono text-[10px] font-extrabold uppercase text-amber-400 shrink-0">
                  {activeFocusTask.subjectCode}
                </span>
                <span className="text-[11px] font-semibold text-slate-200 truncate">
                  {activeFocusTask.chapterName || activeFocusTask.title}
                </span>
              </button>
            )}

            {/* Real-time Peer Request alert icon (Shown only when pending requests exist) */}
            {currentUser && pendingPeersCount > 0 && (
              <button
                onClick={() => setView('peers')}
                className="relative flex items-center justify-center h-11 px-3.5 rounded-xl border bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 shadow-[0_0_12px_rgba(239,68,68,0.2)] transition cursor-pointer group"
                title={`${pendingPeersCount} Pending Peer Request${pendingPeersCount === 1 ? '' : 's'} received! Click to open Peer Lounge.`}
              >
                <Users className="h-4 w-4 text-rose-400" />
                <span className="ml-1.5 font-mono text-[10px] font-bold text-rose-300 tabular-nums">
                  {pendingPeersCount}
                </span>
              </button>
            )}

            {/* 🎓 Read-Only CA Curriculum Level Badge + Profile Quick-Access Icon */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setView('profile')}
                className="flex items-center gap-2 h-11 px-3 sm:px-4 rounded-xl bg-[#0d1c2d] border border-cav-border hover:border-amber-500/40 text-xs font-bold text-slate-200 transition cursor-pointer whitespace-nowrap shrink-0"
                title="Active CA Course Level — Click to manage in Student Profile"
              >
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                <span className="font-display text-xs font-extrabold text-amber-400">
                  {CA_CURRICULUM_LEVELS[caLevel]?.shortName || 'CA Final'}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono hidden xl:inline">
                  {isFoundationLevel(caLevel)
                    ? '4 Papers'
                    : caLevel === 'final'
                      ? '3+3 + SPOM'
                      : caLevel.startsWith('cma_')
                        ? '4+4 Papers'
                        : '3+3 Papers'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setView('profile')}
                aria-label="Open Student Profile"
                aria-current={currentView === 'profile' ? 'page' : undefined}
                className={`relative flex items-center justify-center h-11 w-11 rounded-xl border transition-all duration-200 cursor-pointer shrink-0 group ${
                  currentView === 'profile'
                    ? 'bg-amber-500/20 border-amber-400/75 text-amber-300 shadow-[0_0_16px_rgba(245,158,11,0.28)]'
                    : 'bg-[#0d1c2d] border-cav-border hover:border-amber-400/50 hover:bg-[#14263b] text-slate-200 hover:text-amber-300'
                }`}
                title={
                  currentUser
                    ? `Student Profile — ${currentUser.displayName || currentUser.email?.split('@')[0] || 'My Account'}`
                    : 'Open Student Profile'
                }
              >
                <UserIcon
                  className={`h-4 w-4 transition-transform duration-200 group-hover:scale-105 ${
                    currentView === 'profile' ? 'text-amber-300' : 'text-amber-400'
                  }`}
                />
                {currentUser && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0a192c]" />
                )}
              </button>
            </div>
          </div>
          </div>
        </header>
        )}

        {/* Floating Zero-Manual-Entry Auto-Sync Toast Notification */}
        <AnimatePresence>
          {autoSyncedToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="fixed top-20 right-6 z-50 max-w-md p-3.5 rounded-2xl bg-slate-950/95 border border-emerald-500/40 text-slate-100 shadow-2xl backdrop-blur-md flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0 mt-0.5">
                <CheckCheck className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-black uppercase text-emerald-400 tracking-wider">⚡ 1-Click Zero-Manual Sync</span>
                  <span className="text-[9px] text-slate-500">•</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{autoSyncedToast.duration}m Logged</span>
                </div>
                <p className="text-xs font-black text-white truncate mt-0.5" title={autoSyncedToast.title}>
                  {autoSyncedToast.subjectCode}: {autoSyncedToast.chapterName}
                </p>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Matching daily task and Revision Planner milestone cycle auto-marked completed.
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0 self-center">
                <button
                  type="button"
                  onClick={handleUndoAutoSync}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-rose-300 hover:text-rose-200 border border-rose-500/30 rounded-lg text-xs font-bold transition cursor-pointer"
                  title="Undo automatic task completion"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => setAutoSyncedToast(null)}
                  className="p-1 text-slate-500 hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {pendingTimedPracticeNotification && (
            <TimedPracticeNotificationModal
              session={pendingTimedPracticeNotification.session}
              defaultSnoozeMinutes={
                pendingTimedPracticeNotification.snoozeMinutes ||
                loadUserPracticeTimePreference(currentUserRef.current).snooze_default_minutes ||
                15
              }
              isSnoozeResume={pendingTimedPracticeNotification.isSnoozeResume}
              onStartTimedPractice={async () => {
                const targetSession = pendingTimedPracticeNotification.session;
                setPendingTimedPracticeNotification(null);
                const started = await startTimedPracticeSession(
                  targetSession,
                  currentUserRef.current,
                  setCurrentUser
                );
                setActiveScheduledPracticeSession(started);
              }}
              onSnooze={async (mins) => {
                const targetSession = pendingTimedPracticeNotification.session;
                setPendingTimedPracticeNotification(null);
                await snoozeTimedPracticeNotification(
                  targetSession,
                  mins,
                  currentUserRef.current,
                  setCurrentUser
                );
              }}
              onDismiss={async () => {
                const targetSession = pendingTimedPracticeNotification.session;
                setPendingTimedPracticeNotification(null);
                await dismissTimedPracticeNotification(
                  targetSession,
                  currentUserRef.current,
                  setCurrentUser
                );
              }}
            />
          )}

          {activeScheduledPracticeSession && (
            <ScheduledPracticeQuestionModal
              session={activeScheduledPracticeSession}
              onClose={() => setActiveScheduledPracticeSession(null)}
              onSessionUpdated={(updated) => setActiveScheduledPracticeSession(updated)}
              onStartNextQuestion={async () => {
                try {
                  const nextSession = await launchOnScreenPracticeSession({
                    currentUser: currentUserRef.current,
                    triggerType: 'manual_practice',
                    onUpdateProfile: setCurrentUser
                  });
                  setActiveScheduledPracticeSession(nextSession);
                } catch {
                  setActiveScheduledPracticeSession(null);
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Scrollable Main Content Port */}
        <main
          ref={mainScrollRef}
          data-header-scrolled={isHeaderScrolled ? 'true' : 'false'}
          onScroll={(e) => {
            const top = e.currentTarget.scrollTop;
            if (top > 18 && !isHeaderScrolled) {
              setIsHeaderScrolled(true);
            } else if (top <= 18 && isHeaderScrolled) {
              setIsHeaderScrolled(false);
            }
            if (top > 380 && !showScrollTop) {
              setShowScrollTop(true);
            } else if (top <= 380 && showScrollTop) {
              setShowScrollTop(false);
            }
          }}
          className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-cav-bg transition-colors relative flex flex-col justify-between"
        >
          <div className="flex-1 min-w-0 w-full max-w-full">
          {currentView === 'home' ? (
            <div key="view-home" className="w-full overflow-x-hidden">
              <HomeView
                onNavigate={(view) => setView(view)}
                examDate={examDate}
                attemptLabel={getAttemptLabel(examDate)}
                daysLeft={timeLeft && !timeLeft.completed ? timeLeft.days : 0}
                caLevel={caLevel}
                focusSessions={focusSessions}
                practiceAttempts={practiceAttempts}
                userName={currentUser?.displayName || currentUser?.email?.split('@')[0] || null}
                onOpenSearch={() => setIsSearchOpen(true)}
                onTriggerSignIn={handleSignIn}
              />
            </div>
          ) : (
          <div
            key={`view-${
              currentView === 'subjects' ||
              currentView === 'references' ||
              currentView === 'practice' ||
              currentView === 'pastpapers'
                ? 'practace-library'
                : currentView
            }`}
            className="w-full max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-12 space-y-3 view-faded-slide"
          >
            {currentView === 'dashboard' ? (
              <Dashboard 
                practiceAttempts={practiceAttempts} 
                onClearHistory={handleClearHistory} 
                onLoadDemoData={handleLoadDemoData} 
                bookmarkedSections={bookmarkedSections}
                onToggleBookmark={handleToggleBookmark}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
                currentUser={currentUser}
                focusSessions={focusSessions}
                dailyGoalMinutes={dailyGoalMinutes}
                onUpdateDailyGoal={handleUpdateDailyGoal}
                setView={setView}
                pendingPeersCount={pendingPeersCount}
                sleepSessions={sleepSessions}
                examDate={examDate}
                onStartQuickStudy={(subjectCode, title, durationMinutes, chapterName, relevance) => {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const newTask = {
                    subjectCode,
                    title,
                    chapterName,
                    relevance,
                    dueDate: todayStr,
                    targetDurationMinutes: durationMinutes || 10,
                  };
                  setActiveFocusTask(newTask);
                  setTimerType('work');
                  const secs = (durationMinutes || 10) * 60;
                  setTimerDuration(secs);
                  setTimerSecondsLeft(secs);
                  setTimerIsRunning(true);
                  const nowIso = new Date().toISOString();
                  localStorage.setItem('practca_active_focus_task', JSON.stringify(newTask));
                  localStorage.setItem('practca_pomo_mode', 'study');
                  localStorage.setItem('practca_pomo_start', nowIso);
                  localStorage.setItem('practca_pomo_subject', subjectCode);
                  localStorage.setItem('practca_pomo_notes', title);
                  localStorage.setItem('practca_focus_intensity_mode', 'deep_work');
                  localStorage.removeItem('practca_pomo_paused_state');
                  window.dispatchEvent(new Event('practca_pomo_mode_change'));
                  setView('pomodora');
                  syncTimerAndSleepToCloud({
                    activeFocusTask: newTask,
                    timerType: 'work',
                    timerIsRunning: true,
                    timerSecondsLeft: secs,
                    timerDuration: secs,
                    timerUpdatedAt: Date.now(),
                  });
                }}
              />
            ) : currentView === 'subjects' ||
              currentView === 'references' ||
              currentView === 'practice' ||
              currentView === 'pastpapers' ? (
              <div className="space-y-3">
                <PractAceLibraryHeader
                  activePillar={currentView}
                  selectedSubjectId={selectedSubjectId}
                  onSelectPillar={(pillar) => {
                    setHubQuickReviewActive(false);
                    setView(pillar);
                  }}
                  onSelectSubject={(subId) => {
                    setHubQuickReviewActive(false);
                    syncLibrarySubject(subId);
                  }}
                  hubQuickReviewActive={
                    selectedSubjectId ? subjectActiveTab === 'quick_review' : hubQuickReviewActive
                  }
                  onToggleQuickReview={() => {
                    if (selectedSubjectId) {
                      setSubjectActiveTab(
                        subjectActiveTab === 'quick_review' ? 'blueprint' : 'quick_review'
                      );
                    } else {
                      setHubQuickReviewActive((prev) => !prev);
                    }
                  }}
                  practiceAttemptsCount={practiceAttempts.length}
                  onClearPracticeHistory={handleClearHistory}
                />

                {currentView === 'subjects' ? (
                  <SubjectView
                    selectedSubjectId={selectedSubjectId}
                    setSelectedSubjectId={(subId) => syncLibrarySubject(subId)}
                    bookmarkedSections={bookmarkedSections}
                    onToggleBookmark={handleToggleBookmark}
                    activeTab={subjectActiveTab}
                    setActiveTab={setSubjectActiveTab}
                    hubQuickReviewActive={hubQuickReviewActive}
                    setHubQuickReviewActive={setHubQuickReviewActive}
                  />
                ) : currentView === 'references' ? (
                  <RevisionReferencesView
                    selectedSubjectId={selectedRevisionReferenceSubjectId}
                    setSelectedSubjectId={(subId) => syncLibrarySubject(subId)}
                    onAllocateSession={handleAllocateSession}
                  />
                ) : currentView === 'practice' ? (
                  <PracticeArenaView
                    selectedSubjectId={selectedPracticeSubjectId}
                    setSelectedSubjectId={(subId) => syncLibrarySubject(subId)}
                    onRecordPractice={handleRecordPractice}
                    practiceAttemptsCount={practiceAttempts.length}
                    onClearHistory={handleClearHistory}
                  />
                ) : (
                  <PastPapersView
                    selectedSubjectId={selectedPastPaperSubjectId}
                    setSelectedSubjectId={(subId) => syncLibrarySubject(subId)}
                    bookmarkedQuestions={bookmarkedQuestions}
                    onToggleQuestionBookmark={handleToggleQuestionBookmark}
                  />
                )}
              </div>
            ) : currentView === 'tasks' ? (
              <TasksPlanner 
                onStartFocusForTask={(subjectCode, title, durationMinutes, chapterName, relevance, dueDate, revKey, taskId, isUntimedOpen) => {
                  const resolvedDur = isUntimedOpen || durationMinutes === 0 ? 0 : (durationMinutes || 45);
                  const cleanTitle = title
                    .replace(/[🔴🟡🔵]/g, '')
                    .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/ig, '')
                    .replace(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/ig, '')
                    .replace(/^[\s\-\|]+|[\s\-\|]+$/g, '')
                    .trim() || title;
                  const newTask = {
                    ...(taskId ? { id: taskId } : {}),
                    subjectCode,
                    title,
                    cleanTitle,
                    chapterName,
                    relevance,
                    dueDate,
                    revKey,
                    targetDurationMinutes: resolvedDur,
                    ...(isUntimedOpen !== undefined ? { isUntimedOpen } : {})
                  };
                  setActiveFocusTask(newTask);
                  try {
                    localStorage.setItem('practca_active_focus_task', JSON.stringify(newTask));
                    if (resolvedDur > 0) {
                      const rawDur = localStorage.getItem('practca_task_target_durations');
                      const durMap = rawDur ? JSON.parse(rawDur) : {};
                      if (taskId) durMap[taskId] = resolvedDur;
                      durMap[title] = resolvedDur;
                      durMap[cleanTitle] = resolvedDur;
                      localStorage.setItem('practca_task_target_durations', JSON.stringify(durMap));
                      window.dispatchEvent(new Event('practca_task_target_durations_update'));
                    }
                    const dNow = new Date();
                    const todayLocal = `${dNow.getFullYear()}-${String(dNow.getMonth() + 1).padStart(2, '0')}-${String(dNow.getDate()).padStart(2, '0')}`;
                    localStorage.setItem('practca_selected_clock_date', todayLocal);
                  } catch (e) {}
                  setTimerType('work');
                  let finalSecs = timerSecondsLeft;
                  let finalDur = timerDuration;
                  if (resolvedDur > 0) {
                    const secs = resolvedDur * 60;
                    setTimerDuration(secs);
                    setTimerSecondsLeft(secs);
                    setTimerIsRunning(true);
                    finalSecs = secs;
                    finalDur = secs;
                  } else {
                    setTimerIsRunning(true);
                  }
                  const nowIso = new Date().toISOString();
                  localStorage.setItem('practca_pomo_mode', 'study');
                  localStorage.setItem('practca_pomo_start', nowIso);
                  localStorage.setItem('practca_pomo_subject', subjectCode);
                  localStorage.setItem('practca_pomo_notes', title);
                  localStorage.removeItem('practca_pomo_paused_state');
                  window.dispatchEvent(new Event('practca_pomo_mode_change'));
                  setView('pomodora');
                  syncTimerAndSleepToCloud({
                    activeFocusTask: newTask,
                    timerType: 'work',
                    timerIsRunning: true,
                    timerSecondsLeft: finalSecs,
                    timerDuration: finalDur,
                    timerUpdatedAt: Date.now()
                  });
                }}
                activeFocusTask={activeFocusTask}
                onClearActiveFocusTask={() => {
                  setActiveFocusTask(null);
                  syncTimerAndSleepToCloud({ activeFocusTask: null });
                }}
                onCompleteLinkedTask={handleCompleteLinkedTask}
                onGoToClock={() => setView('pomodora')}
                onGoToRevisionReport={() => setView('revision')}
              />
            ) : currentView === 'pomodora' ? (
              <DigitalPomodora
                focusSessions={focusSessions}
                onAllocateSession={handleAllocateSession}
                onDeleteSession={handleDeleteSession}
                sleepSessions={sleepSessions}
                isSleeping={isSleeping}
                sleepStartTime={sleepStartTime}
                onStartSleep={handleStartSleep}
                onStopSleep={handleStopSleep}
                onDeleteSleepSession={handleDeleteSleepSession}
                onAddSleepSession={handleAddSleepSession}
                activeFocusTask={activeFocusTask}
                onClearActiveFocusTask={() => {
                  setActiveFocusTask(null);
                  syncTimerAndSleepToCloud({ activeFocusTask: null });
                }}
                onAllocateActiveFocusTask={handleAllocateActiveFocusTask}
                onCompleteLinkedTask={handleCompleteLinkedTask}
                dailyGoalMinutes={dailyGoalMinutes}
                onUpdateDailyGoal={handleUpdateDailyGoal}
                onStartFocusForTask={(subjectCode, title, durationMinutes, chapterName, relevance, dueDate, revKey, taskId, isUntimedOpen) => {
                  const resolvedDur = isUntimedOpen || durationMinutes === 0 ? 0 : (durationMinutes || 45);
                  const cleanTitle = title
                    .replace(/[🔴🟡🔵]/g, '')
                    .replace(/\[\s*(High|Medium|Low|General|Revision|Final Revision)\s*\]/ig, '')
                    .replace(/\[\s*(AFM|FR|Audit|DT|IDT|IBS)\s*\]/ig, '')
                    .replace(/^[\s\-\|]+|[\s\-\|]+$/g, '')
                    .trim() || title;
                  const newTask = {
                    ...(taskId ? { id: taskId } : {}),
                    subjectCode,
                    title,
                    cleanTitle,
                    chapterName,
                    relevance,
                    dueDate,
                    revKey,
                    targetDurationMinutes: resolvedDur,
                    ...(isUntimedOpen !== undefined ? { isUntimedOpen } : {})
                  };
                  setActiveFocusTask(newTask);
                  try {
                    localStorage.setItem('practca_active_focus_task', JSON.stringify(newTask));
                    if (resolvedDur > 0) {
                      const rawDur = localStorage.getItem('practca_task_target_durations');
                      const durMap = rawDur ? JSON.parse(rawDur) : {};
                      if (taskId) durMap[taskId] = resolvedDur;
                      durMap[title] = resolvedDur;
                      durMap[cleanTitle] = resolvedDur;
                      localStorage.setItem('practca_task_target_durations', JSON.stringify(durMap));
                      window.dispatchEvent(new Event('practca_task_target_durations_update'));
                    }
                  } catch (e) {}
                  setTimerType('work');
                  let finalSecs = timerSecondsLeft;
                  let finalDur = timerDuration;
                  if (resolvedDur > 0) {
                    const secs = resolvedDur * 60;
                    setTimerDuration(secs);
                    setTimerSecondsLeft(secs);
                    setTimerIsRunning(true);
                    finalSecs = secs;
                    finalDur = secs;
                  } else {
                    setTimerIsRunning(true);
                  }
                  syncTimerAndSleepToCloud({
                    activeFocusTask: newTask,
                    timerType: 'work',
                    timerIsRunning: true,
                    timerSecondsLeft: finalSecs,
                    timerDuration: finalDur,
                    timerUpdatedAt: Date.now()
                  });
                }}
                onGoToPlanner={() => setView('tasks')}
                onGoToRevisionPlanner={() => setView('revision')}
                onRequestRestMode={() => setShowRestModeModal(true)}
                isPowerNapping={isPowerNapping}
                powerNapTimeLeftSeconds={powerNapTimeLeftSeconds}
                powerNapTargetMins={powerNapTargetMins}
                onStopPowerNap={handleStopPowerNap}
                onShareProgress={() => setShowShareProgressModal(true)}
              />
            ) : currentView === 'wellbeing' ? (
              <MentalWellbeingView
                isSleeping={isSleeping}
                sleepStartTime={sleepStartTime}
                sleepSessions={sleepSessions}
                onStartSleep={handleStartSleep}
                onStopSleep={handleStopSleep}
                onDeleteSleepSession={handleDeleteSleepSession}
                focusSessions={focusSessions}
                dailyGoalMinutes={dailyGoalMinutes}
                hydrationReminderEnabled={hydrationReminderEnabled}
                onToggleHydrationReminder={(val) => {
                  setHydrationReminderEnabled(val);
                  localStorage.setItem('practca_hydration_reminder_enabled', String(val));
                  if (val) {
                    const now = Date.now();
                    setHydrationTimerStart(now);
                    localStorage.setItem('practca_hydration_timer_start', String(now));
                  }
                }}
                hydrationInterval={hydrationInterval}
                onUpdateHydrationInterval={(val) => {
                  setHydrationInterval(val);
                  localStorage.setItem('practca_hydration_interval', String(val));
                  const now = Date.now();
                  setHydrationTimerStart(now);
                  localStorage.setItem('practca_hydration_timer_start', String(now));
                }}
                dailyHydrationCount={dailyHydrationCount}
                onLogHydration={handleHydrated}
                onResetHydration={() => {
                  setDailyHydrationCount(0);
                  localStorage.setItem('practca_daily_hydration_count', '0');
                  setHydrationHistory([]);
                  localStorage.setItem('practca_hydration_history', '[]');
                }}
                dailyHydrationTarget={dailyHydrationTarget}
                onUpdateHydrationTarget={(val) => {
                  setDailyHydrationTarget(val);
                  localStorage.setItem('practca_daily_hydration_target', String(val));
                }}
                hydrationTimeLeftSeconds={hydrationTimeLeftSeconds}
                hydrationSnoozeEndTime={hydrationSnoozeEndTime}
                hydrationHistory={hydrationHistory}
                hydrationSoundEnabled={hydrationSoundEnabled}
                onToggleHydrationSound={handleToggleHydrationSound}
                isPowerNapping={isPowerNapping}
                powerNapTimeLeftSeconds={powerNapTimeLeftSeconds}
                powerNapTargetMins={powerNapTargetMins}
                onStartPowerNap={handleStartPowerNap}
                onStopPowerNap={handleStopPowerNap}
                onSnoozePowerNap={handleSnoozePowerNap}
                onRequestRestMode={() => setShowRestModeModal(true)}
                onTestPowerNapAlarm={testPowerNapAlarmSound}
              />
            ) : currentView === 'profile' ? (
              <ProfileView
                currentUser={currentUser}
                onUpdateProfile={setCurrentUser}
                examDate={examDate}
                onUpdateExamDate={(date) => {
                  if (!date) {
                    handleClearExamAttempt();
                  } else {
                    setExamDate(date);
                    activateNextExamAttemptSchedule(date);
                    setMilestoneSyncTick(t => t + 1);
                  }
                }}
                dailyGoalMinutes={dailyGoalMinutes}
                onUpdateDailyGoal={handleUpdateDailyGoal}
                practiceAttempts={practiceAttempts}
                focusSessions={focusSessions}
                bookmarkedSections={bookmarkedSections}
                bookmarkedQuestions={bookmarkedQuestions}
                onToggleQuestionBookmark={handleToggleQuestionBookmark}
                onOpenQuestionBank={(subId) => {
                  syncLibrarySubject(subId);
                  setView('pastpapers');
                }}
                onTriggerSignIn={handleSignIn}
                hydrationSoundEnabled={hydrationSoundEnabled}
                onToggleHydrationSound={handleToggleHydrationSound}
              />
            ) : currentView === 'peers' ? (
              <StudyPeersView 
                currentUser={currentUser}
                setView={setView}
              />
            ) : (
              <RevisionPlanner 
                activeSubjectIdProp={selectedSubjectId || undefined}
                onActiveSubjectChangeProp={(id) => syncLibrarySubject(id)}
                onGoToClock={() => setView('pomodora')}
                onGoToTasks={() => setView('tasks')}
              />
            )}
          </div>
          )}
          </div>

          <div className="w-full">
            <BrandFooter
              currentView={currentView}
              onNavigate={(view) => setView(view)}
              onSelectSubject={(subjectId) => syncLibrarySubject(subjectId)}
              onScrollTop={() => {
                mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              examDate={examDate}
            />
          </div>

          {/* Floating Back to Top Button for Deep Revision & Statutory Reading */}
          <AnimatePresence>
            {showScrollTop && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  mainScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0d1c2d]/95 hover:bg-[#16293f] border border-cav-accent/40 hover:border-cav-accent text-cav-accent hover:text-white shadow-xl backdrop-blur-md text-[11px] font-mono font-extrabold uppercase tracking-wider cursor-pointer transition-colors print:hidden"
                title="Scroll back to top"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Top</span>
              </motion.button>
            )}
          </AnimatePresence>
        </main>
      </div>

      <UniversalSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />

      {/* EXAM COUNTDOWN SELECTOR MODAL */}
      {showExamModal && (
        <ModalPortal>
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-[#051424]/80 backdrop-blur-md animate-fadeIn" onClick={() => { setShowExamModal(false); setExamModalError(null); }} />
          <div className="relative w-full max-w-sm bg-[#0d1c2d] border border-cav-border rounded-2xl p-6 shadow-2xl space-y-5 animate-slideUp z-10 select-none">
            <div className="flex items-center justify-between border-b border-cav-border pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cav-accent" />
                <h3 className="text-xs font-extrabold uppercase text-white tracking-wider font-mono">Exam Target Attempt</h3>
              </div>
              <button 
                onClick={() => { setShowExamModal(false); setExamModalError(null); }}
                className="text-xs text-slate-400 hover:text-white transition font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Next Exam Sequence OR Concluded No Scheduled Exam Banner */}
              {!examScheduleInfo.hasScheduledExam ? (
                <div className="p-3.5 rounded-xl bg-[#051424] border border-cav-border flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-emerald-400 block">
                      No Scheduled Exam
                    </span>
                    <span className="text-[11px] text-slate-300 font-sans">
                      Previous exam cycle concluded. Select a next attempt below to start a countdown.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowExamModal(false);
                      setShowFinalExamDatesModal(true);
                    }}
                    className="text-[10px] font-mono font-bold text-[#7bd0ff] hover:text-white underline cursor-pointer transition-colors shrink-0"
                  >
                    Set Paper Dates
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#051424] border border-cav-border space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-cav-accent truncate">
                      Next Paper Order ({examScheduleInfo.orderedExams.map(e => e.subjectId).join(' → ')})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowExamModal(false);
                        setShowFinalExamDatesModal(true);
                      }}
                      className="text-[10px] font-mono font-bold text-[#7bd0ff] hover:text-white underline cursor-pointer transition-colors shrink-0"
                    >
                      Edit Milestone Dates
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {examScheduleInfo.orderedExams.map((item) => {
                      const isNext = item.subjectId === examScheduleInfo.nextExam.subjectId;
                      return (
                        <div
                          key={item.subjectId}
                          className={`p-2 rounded-lg border text-center transition-colors ${
                            isNext
                              ? 'bg-cav-accent/15 border-cav-accent/50 text-white'
                              : 'bg-[#0d1c2d] border-cav-border text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            <span className={`font-mono text-xs font-extrabold ${isNext ? 'text-cav-accent' : 'text-white'}`}>
                              {item.subjectId}
                            </span>
                            {isNext && (
                              <span className="text-[8px] font-mono font-black uppercase px-1 py-0.2 rounded bg-cav-accent text-[#051424]">
                                Next
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[10px] font-bold text-slate-300 mt-0.5">
                            {item.formattedDate}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Predefined Attempts Shortcuts */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold font-mono tracking-wider text-slate-400 block uppercase">Standard Attempts</span>
                <div className="grid grid-cols-2 gap-2">
                  {getAttemptsForLevel(caLevel, examDate).slice(0, 4).map((att) => {
                    const isPastAttempt = att.date < minDateStr;
                    const isSelectedAttempt = examScheduleInfo.hasScheduledExam && examDate === att.date;
                    return (
                      <button
                        key={att.date}
                        disabled={isPastAttempt}
                        onClick={() => {
                          if (isPastAttempt) return;
                          setExamDate(att.date);
                          activateNextExamAttemptSchedule(att.date);
                          setMilestoneSyncTick(t => t + 1);
                          setExamModalError(null);
                          setShowExamModal(false);
                        }}
                        className={`py-2 px-2.5 border rounded-xl text-[11px] font-bold font-mono transition text-center ${
                          isPastAttempt
                            ? 'bg-[#051424]/50 border-slate-800/60 text-slate-600 cursor-not-allowed opacity-60'
                            : isSelectedAttempt
                              ? 'bg-cav-accent/15 text-cav-accent border-cav-accent/40 font-extrabold cursor-pointer'
                              : 'bg-[#051424] border-cav-border text-slate-400 hover:text-white hover:bg-[#122131] cursor-pointer'
                        }`}
                      >
                        {att.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Date Input Picker */}
              <div className="space-y-2 border-t border-cav-border pt-3.5">
                <span className="text-[10px] font-extrabold font-mono tracking-wider text-slate-400 block uppercase">Or select custom exam date</span>
                <div className="flex items-center gap-2">
                  <AttractiveDatePicker
                    value={examScheduleInfo.hasScheduledExam ? examDate : ''}
                    minDate={minDateStr}
                    accentColor="amber"
                    size="md"
                    className="flex-1"
                    placeholder="Select Exam Date"
                    onChange={(value) => {
                      if (value) {
                        if (value < minDateStr) {
                          setExamModalError("Please select today or a future date.");
                        } else {
                          setExamModalError(null);
                          setExamDate(value);
                          activateNextExamAttemptSchedule(value);
                          setMilestoneSyncTick(t => t + 1);
                        }
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (!examModalError) {
                        setShowExamModal(false);
                      }
                    }}
                    disabled={!!examModalError}
                    className={`py-2 px-4 font-extrabold text-xs rounded-xl transition cursor-pointer ${
                      examModalError 
                        ? 'bg-[#122131] text-slate-500 cursor-not-allowed opacity-55' 
                        : 'bg-cav-accent hover:bg-cav-accent/90 text-[#051424]'
                    }`}
                  >
                    Done
                  </button>
                </div>
                {examModalError && (
                  <p className="text-[10px] text-amber-400 font-mono font-medium mt-1 select-none">
                    ⚠️ {examModalError}
                  </p>
                )}
              </div>

              {examScheduleInfo.hasScheduledExam && (
                <div className="pt-2 border-t border-cav-border flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      handleClearExamAttempt();
                      setShowExamModal(false);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-mono font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Clear Selected Attempt</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      <FinalExamDatesModal
        isOpen={showFinalExamDatesModal}
        onClose={() => setShowFinalExamDatesModal(false)}
        onSaved={() => {
          setMilestoneSyncTick(t => t + 1);
          setShowFinalExamDatesModal(false);
        }}
      />



      {/* 🔐 PREMIUM STUDENT PORTAL AUTH MODAL & VERIFICATION FLOW */}
      {isAuthModalOpen && (
        <ModalPortal>
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md animate-fadeIn" onClick={() => { if (!authSubmitting) setIsAuthModalOpen(false); }} />
          <div className="relative w-full max-w-md bg-[#0c0f1c] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-slideUp z-10 selection:bg-amber-500/30 selection:text-white">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <div className="flex items-center gap-2.5">
                <BrandMark size="xs" showIcon />
                <span className="text-[10.5px] font-bold text-[#7bd0ff] uppercase tracking-wider font-mono">
                  Student Portal
                </span>
              </div>
              <button 
                onClick={() => { if (!authSubmitting) setIsAuthModalOpen(false); }}
                className="text-xs text-slate-400 hover:text-white transition font-bold p-1 bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
                disabled={authSubmitting}
              >
                ✕
              </button>
            </div>

            {/* Error or Success banners */}
            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 text-[10px] font-bold rounded-xl flex items-start gap-2 animate-pulse">
                <span>⚠️</span>
                <span>{authError}</span>
              </div>
            )}
            {authSuccessMessage && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-xl flex items-start gap-2">
                <span>✅</span>
                <span>{authSuccessMessage}</span>
              </div>
            )}

            {(authModalMode === 'signup' || authModalMode === 'signin') && (
              <div className="grid grid-cols-2 gap-1 bg-slate-950 border border-slate-850 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('signup'); setAuthError(null); setAuthSuccessMessage(null); }}
                  className={`py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer ${
                    authModalMode === 'signup' ? 'bg-cav-accent text-slate-955 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthModalMode('signin'); setAuthError(null); setAuthSuccessMessage(null); }}
                  className={`py-1.5 rounded-xl text-[10.5px] font-black uppercase tracking-wider transition cursor-pointer ${
                    authModalMode === 'signin' ? 'bg-cav-accent text-slate-955 font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}

            {authModalMode === 'signup' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCustomSignUp(authNameInput, authEmailInput, authPasswordInput);
              }} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={authNameInput}
                    onChange={(e) => setAuthNameInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Create access password"
                    value={authPasswordInput}
                    onChange={(e) => setAuthPasswordInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 px-4 bg-cav-accent text-slate-955 rounded-xl text-xs font-extrabold shadow-md shadow-cav-accent/15 hover:bg-cav-accent/90 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authSubmitting ? (
                    <span className="h-3.5 w-3.5 border-2 border-slate-955/25 border-t-slate-955 rounded-full animate-spin" />
                  ) : 'Sign Up Student Account'}
                </button>
              </form>
            )}

            {authModalMode === 'signin' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCustomLogin(authEmailInput, authPasswordInput);
              }} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter registered Email"
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <div className="flex items-center justify-between">
                    <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthModalMode('forgot');
                        setAuthError(null);
                        setAuthSuccessMessage(null);
                      }}
                      className="text-[9.5px] font-black text-amber-500 hover:text-amber-400 transition uppercase font-mono cursor-pointer bg-transparent border-none outline-none"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter your security password"
                    value={authPasswordInput}
                    onChange={(e) => setAuthPasswordInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 px-4 bg-cav-accent text-slate-955 rounded-xl text-xs font-extrabold shadow-md shadow-cav-accent/15 hover:bg-cav-accent/90 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authSubmitting ? (
                    <span className="h-3.5 w-3.5 border-2 border-slate-955/25 border-t-slate-955 rounded-full animate-spin" />
                  ) : 'Authenticate Profile'}
                </button>
              </form>
            )}

            {authModalMode === 'forgot' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleForgotPassword(authEmailInput);
              }} className="space-y-4">
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">Reset password access</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Provide your registered Email ID. We will generate and dispatch a 6-digit verification code to reset your security password.
                  </p>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your registered Email"
                    value={authEmailInput}
                    onChange={(e) => setAuthEmailInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 px-4 bg-cav-accent text-slate-955 rounded-xl text-xs font-extrabold shadow-md shadow-cav-accent/15 hover:bg-cav-accent/90 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authSubmitting ? (
                    <span className="h-3.5 w-3.5 border-2 border-slate-955/25 border-t-slate-955 rounded-full animate-spin" />
                  ) : 'Send Reset Code'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signin');
                      setAuthError(null);
                      setAuthSuccessMessage(null);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white transition font-bold"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            )}

            {authModalMode === 'reset' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleResetPassword(authEmailInput, resetCodeInput, newPasswordInput);
              }} className="space-y-4">
                <div className="text-left space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">Set New Security Password</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Check your Email! Enter the 6-digit verification reset code sent to <strong className="text-amber-400">{pendingVerifyEmail}</strong> and specify your new access password.
                  </p>
                </div>

                {/* Secure Sandbox Helper (If SMTP is not configured, give an explicit Disclosure toggle) */}
                {!isAuthSmtpConfigured && authDevCode && (
                  <div className="p-3 bg-slate-950 border border-amber-500/10 rounded-xl space-y-1.5 text-left animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-extrabold font-mono text-amber-500 uppercase tracking-wider">Local Sandbox Helper</span>
                      <span className="text-[8.5px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-mono font-bold">Mail Offline</span>
                    </div>
                    <p className="text-[9.5px] text-slate-400 leading-relaxed">
                      Since an SMTP server is not active in this sandbox, click below to reveal the generated reset code securely:
                    </p>
                    {showAuthDevCode ? (
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="font-mono text-white text-xs font-bold tracking-widest bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg select-all">
                          {authDevCode}
                        </span>
                        <button
                          type="button"
                          onClick={() => setResetCodeInput(authDevCode)}
                          className="text-[10px] text-amber-500 hover:text-amber-400 underline font-bold cursor-pointer"
                        >
                          Autofill Code
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAuthDevCode(true)}
                        className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-mono text-[9px] font-bold rounded-lg transition cursor-pointer"
                      >
                        Reveal Sandboxed Code
                      </button>
                    )}
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">6-Digit Reset Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="E.g., 583190"
                    value={resetCodeInput}
                    onChange={(e) => setResetCodeInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white text-center focus:outline-none transition-colors placeholder:text-slate-700 font-mono tracking-widest font-bold animate-pulse"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 block font-mono">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    disabled={authSubmitting}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-600 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-2.5 px-4 bg-cav-accent text-slate-955 rounded-xl text-xs font-extrabold shadow-md shadow-cav-accent/15 hover:bg-cav-accent/90 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {authSubmitting ? (
                    <span className="h-3.5 w-3.5 border-2 border-slate-955/25 border-t-slate-955 rounded-full animate-spin" />
                  ) : 'Save New Password'}
                </button>

                <div className="text-center flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      handleForgotPassword(authEmailInput);
                    }}
                    disabled={authSubmitting}
                    className="text-[10px] text-amber-500 hover:text-amber-400 transition font-bold disabled:opacity-50 cursor-pointer"
                  >
                    Resend Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMode('signin');
                      setAuthError(null);
                      setAuthSuccessMessage(null);
                    }}
                    className="text-[10px] text-slate-400 hover:text-white transition font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {authModalMode === 'verify' && (
              <div className="space-y-5">
                <div className="text-center space-y-2">
                  <span className="text-2xl block animate-bounce">📨</span>
                  <p className="text-[11.5px] text-slate-300 font-bold leading-relaxed">
                    Check your Email! We sent an activation checkcode to <strong className="text-amber-400">{pendingVerifyEmail}</strong>.
                  </p>
                  <p className="text-[9.5px] text-slate-500">
                    Insert the 6-digit code below to unlock the revised materials.
                  </p>
                </div>

                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000000"
                  value={authCodeInput}
                  onChange={(e) => setAuthCodeInput(e.target.value.replace(/\D/g, ''))}
                  disabled={authSubmitting}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-cav-accent tracking-[0.5em] text-center rounded-xl p-3 text-lg text-amber-400 focus:outline-none font-mono font-black"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCustomVerify(authCodeInput)}
                    disabled={authSubmitting || authCodeInput.length !== 6}
                    className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-slate-955 rounded-xl text-xs font-extrabold transition cursor-pointer"
                  >
                    Activate Profile
                  </button>
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={authSubmitting}
                    className="py-2 px-3 bg-slate-950 border border-slate-850 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Resend Code
                  </button>
                </div>

                {/* Code verification UI block completed */}
              </div>
            )}
          </div>
        </div>
        </ModalPortal>
      )}

      {/* 🛌 Immersive Rest & Recovery Mode Overlay */}
      {isSleeping && !isPowerNapping && (
        <ModalPortal priorityOffset={3000}>
        <div 
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 select-none overflow-hidden"
        >
          {/* Constellation background / glowing ambient particles */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(15,23,42,0.6))] pointer-events-none" />
          
          <div className="max-w-md w-full space-y-8 relative z-10">
            {/* Sleeping Moon Animation */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute inset-2 bg-indigo-500/5 rounded-full border border-violet-500/20 animate-spin" style={{ animationDuration: '40s' }} />
              <div className="absolute inset-6 bg-indigo-500/5 rounded-full border border-indigo-400/10" />
              
              <div className="relative p-6 rounded-full bg-violet-950/40 border border-violet-500/20 shadow-2xl">
                <Moon className="h-16 w-16 text-violet-400" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest">
                Rest & Recovery Session Active
              </span>
              <h2 className="text-2xl font-display font-extrabold tracking-tight text-white">
                Sleeping Soundly...
              </h2>
            </div>

            {/* Live Sleep Duration counter */}
            <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-1.5 backdrop-blur-sm max-w-xs mx-auto">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-bold">Elapsed Sleep Duration</span>
              <p className="text-3xl font-black font-mono text-violet-300 tracking-wider">
                {elapsedSleepText}
              </p>
              <p className="text-[8.5px] text-slate-500">Started at: {sleepStartTime ? new Date(sleepStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</p>
            </div>

            {/* Optional Wake-up Feeling Input */}
            <div 
              className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl max-w-xs mx-auto space-y-2.5 backdrop-blur-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block text-left">
                How refreshed do you feel? (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Fully Rested, Energetic, Slightly Tired..."
                value={sleepFeelingInput}
                onChange={(e) => setSleepFeelingInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-violet-500 rounded-xl p-2.5 text-xs text-white focus:outline-none placeholder-slate-650 font-sans select-text"
              />
              <div className="flex flex-wrap gap-1 justify-start">
                {["😊 Refreshed", "🥱 Tired", "🔋 Supercharged", "🧠 Focused"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSleepFeelingInput(preset)}
                    className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-850 text-slate-300 rounded-lg text-[9px] font-medium font-mono transition cursor-pointer select-none"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering activity alert
                  handleStopSleep(sleepFeelingInput);
                  setSleepFeelingInput('');
                }}
                className="w-full max-w-xs px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25 cursor-pointer flex items-center justify-center gap-2 mx-auto"
              >
                🌅 Woke Up & Shine
              </button>
            </div>
          </div>

          {/* Activity warning nudge overlay inside sleep viewport */}
          {showSleepActivityAlert && (
            <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] max-w-sm w-11/12 bg-rose-950/95 border border-rose-500/30 rounded-xl shadow-2xl p-4 flex items-start gap-3 text-left">
              <span className="text-lg">🤫</span>
              <div className="space-y-0.5">
                <h5 className="font-extrabold text-rose-400 uppercase tracking-wider text-[10px] font-mono">Shh... Go to sleep!</h5>
                <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  Deep REM cycles are vital for syllabus memory storage. All tools are locked. Click <strong>Woke Up & Shine</strong> to resume.
                </p>
              </div>
            </div>
          )}
        </div>
        </ModalPortal>
      )}

      {/* 💧 NON-INTRUSIVE FLOATING HYDRATION PROGRESS WIDGET (BOTTOM-RIGHT) */}
      <AnimatePresence>
        {showHydrationPopup && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[99999] w-80 sm:w-96 bg-[#0a0f1c]/95 border-2 border-cyan-500/40 rounded-2xl p-4 shadow-2xl shadow-cyan-950/80 backdrop-blur-xl text-slate-100 select-none overflow-hidden space-y-3.5"
          >
            {/* Background soft ambient glow */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Header Row */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Droplet className="h-5 w-5 text-cyan-400 fill-cyan-400 animate-bounce" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest">
                      💧 HYDRATION ALERT
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[8px] font-mono font-bold">
                      Active Session
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-200 truncate">
                    Time to refuel your brain!
                  </p>
                </div>
              </div>
            </div>

            {/* Progress & Target Section */}
            <div className="space-y-1.5 bg-slate-950/60 border border-slate-900 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 font-bold">Daily Progress</span>
                <span className="text-cyan-400 font-black">
                  {dailyHydrationCount} / {dailyHydrationTarget} Glasses ({dailyHydrationCount * 250}ml)
                </span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((dailyHydrationCount / dailyHydrationTarget) * 100))}%` }}
                />
              </div>
            </div>

            {/* Primary 1-Click Action */}
            <button
              type="button"
              onClick={() => handleHydrated(1)}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 transition duration-150 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Droplet className="h-4 w-4 fill-slate-950" />
              <span>Chug 1 Glass (250ml) • 1-Click Log</span>
            </button>

            {/* Compact Secondary Options Row */}
            <div className="flex items-center justify-between gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleHydrated(2)}
                className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-850 text-cyan-400 border border-cyan-500/20 rounded-lg text-[10px] font-bold transition active:scale-[0.98] cursor-pointer text-center truncate"
                title="Log 1 Bottle (500ml / 2 Glasses)"
              >
                🧪 +2 Glasses (500ml)
              </button>
              <button
                type="button"
                onClick={() => handleSnoozeHydration(10)}
                className="py-1.5 px-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-900 rounded-lg text-[10px] font-mono font-bold transition active:scale-[0.98] cursor-pointer"
                title="Snooze 10 mins"
              >
                ⏰ 10m
              </button>
              <button
                type="button"
                onClick={() => handleSnoozeHydration(30)}
                className="py-1.5 px-2.5 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-900 rounded-lg text-[10px] font-mono font-bold transition active:scale-[0.98] cursor-pointer"
                title="Snooze 30 mins"
              >
                ⏰ 30m
              </button>
            </div>

            {/* Clinical Tip subtext */}
            <div className="text-[9.5px] text-slate-400 italic font-sans leading-tight text-center px-1">
              💡 {
                [
                  "Hydration maintains peak cortisol control and focus during study sessions.",
                  "A 2% drop in water causes a 20% drop in memory recall and attention.",
                  "Water increases prefrontal cortex blood flow for complex problem solving."
                ][dailyHydrationCount % 3]
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rest Channel Selection Modal (Full Sleep vs Power Nap) */}
      <RestSelectionModal
        isOpen={showRestModeModal}
        onClose={() => setShowRestModeModal(false)}
        onStartFullSleep={handleStartSleep}
        onStartPowerNap={handleStartPowerNap}
        onTestAlarm={testPowerNapAlarmSound}
      />

      {/* Power Nap Alarm Ringing Screen */}
      <PowerNapAlarmModal
        isOpen={showPowerNapAlarmModal}
        powerNapTargetMins={powerNapTargetMins}
        onWakeUpAndLog={handleStopPowerNap}
        onSnooze={handleSnoozePowerNap}
      />

      <ShareStudyProgressModal
        isOpen={showShareProgressModal}
        onClose={() => setShowShareProgressModal(false)}
        focusSessions={focusSessions}
        practiceAttempts={practiceAttempts}
        dailyGoalMinutes={dailyGoalMinutes}
        examDate={examDate}
        attemptLabel={getAttemptLabel(examDate)}
      />

      {/* Persistent Study / Timer Picture-in-Picture (Native Document/Video PiP + In-App Floating Dock across Tabs) */}
      <StudyPictureInPicture
        isStudyActive={activePomoMode === 'study'}
        studySeconds={activePomoSeconds}
        activeMode={activePomoMode}
        activeRoutineName={activePomoRoutineName}
        breakTargetMinutes={activePomoBreakTargetMins}
        isPowerNapping={isPowerNapping}
        powerNapTimeLeftSeconds={powerNapTimeLeftSeconds}
        powerNapTargetMins={powerNapTargetMins}
        activeFocusTask={activeFocusTask}
        isTimerPaused={false}
        onTogglePauseResume={() => {
          if (activePomoMode !== 'idle') {
            const nowMs = Date.now();
            const storedStart = localStorage.getItem('practca_pomo_start');
            const computedElapsed = storedStart && !isNaN(new Date(storedStart).getTime())
              ? Math.max(activePomoSeconds, Math.floor((nowMs - new Date(storedStart).getTime()) / 1000))
              : activePomoSeconds;
            const pausedPayload = {
              mode: activePomoMode,
              elapsedSeconds: computedElapsed,
              pausedAt: nowMs,
              originalStart: storedStart || new Date(nowMs - computedElapsed * 1000).toISOString(),
              subjectId: localStorage.getItem('practca_pomo_subject') || 'AFM',
              notes: localStorage.getItem('practca_pomo_notes') || '',
              routineName: localStorage.getItem('practca_active_routine_name') || '',
              breakTargetMinutes: Number(localStorage.getItem('practca_break_target_mins')) || 15
            };
            localStorage.setItem('practca_pomo_paused_state', JSON.stringify(pausedPayload));
            localStorage.setItem('practca_pomo_mode', 'idle');
            setPomoPausedState(pausedPayload);
            setActivePomoMode('idle');
            setActivePomoSeconds(computedElapsed);
            window.dispatchEvent(new Event('practca_pomo_mode_change'));
            window.dispatchEvent(new Event('storage'));
          } else if (pomoPausedState) {
            const resumeMode = pomoPausedState.mode || 'study';
            const resumedStart = new Date(Date.now() - (pomoPausedState.elapsedSeconds || 0) * 1000).toISOString();
            localStorage.removeItem('practca_pomo_paused_state');
            localStorage.setItem('practca_pomo_mode', resumeMode);
            localStorage.setItem('practca_pomo_start', resumedStart);
            setPomoPausedState(null);
            setActivePomoMode(resumeMode);
            window.dispatchEvent(new Event('practca_pomo_mode_change'));
            window.dispatchEvent(new Event('storage'));
          }
        }}
        onReturnToPomodoro={() => setView('pomodora')}
        onCompleteTarget={() => {
          if (activeFocusTask) {
            handleCompleteLinkedTask(activeFocusTask);
          }
        }}
        isCurrentViewPomodoro={currentView === 'pomodora'}
      />

      {/* Congratulations on Completion of All Exams Modal */}
      {showAllExamsCongratsModal && (
        <ModalPortal>
          <ConfettiOverlay />
          <div
            id="all-exams-completed-congrats-modal"
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-amber-500/35 p-6 sm:p-7 shadow-2xl text-white space-y-5"
            >
              <button
                type="button"
                onClick={handleAcknowledgeAllExamsCompleted}
                aria-label="Close congratulations dialog"
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                  <Trophy className="h-7 w-7" />
                </div>
                <div className="space-y-1.5 pr-6">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>CA Final Examination Cycle Concluded</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                    Congratulations on Completion of Exams!
                  </h2>
                </div>
              </div>

              {examScheduleInfo.orderedExams.length > 0 && (
                <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-1.5">
                    <span>Completed Examination Papers</span>
                    <span className="text-emerald-400 font-bold tabular-nums">
                      {examScheduleInfo.orderedExams.length}/{examScheduleInfo.orderedExams.length} Done
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                    {examScheduleInfo.orderedExams.map((paper) => (
                      <div
                        key={paper.subjectId}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/90 text-xs"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span className="font-bold text-slate-100 truncate">
                            Paper {paper.paperNumber} · {paper.subjectId}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0">
                          {paper.formattedDate} · {paper.subjectId === 'IBS' ? '6:00 PM' : '5:00 PM'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  id="continue-regular-mode-btn"
                  type="button"
                  onClick={handleAcknowledgeAllExamsCompleted}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 h-10 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-extrabold text-xs sm:text-sm transition cursor-pointer whitespace-nowrap"
                >
                  <Check className="h-4 w-4 shrink-0" />
                  <span>Continue in Regular Mode</span>
                </button>
              </div>
            </motion.div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}
