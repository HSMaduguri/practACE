/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Quote, 
  BookOpen, 
  Award, 
  Clock, 
  Bookmark, 
  Calendar, 
  Save, 
  Shield, 
  Activity,
  LogIn,
  Sliders,
  Trash2,
  AlertTriangle,
  X,
  Edit,
  Volume2,
  Play,
  Check
} from 'lucide-react';
import {
  db,
  getSimpleUsername,
  normalizeUsername,
  cleanDisplayUsername,
  validateUsernameFormat,
  checkUsernameAvailability,
  claimCustomUsername,
  releaseUsernameOnDelete,
  auth
} from '../lib/firebase';
import { doc, setDoc, collection, getDocs, deleteDoc, onSnapshot } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import {
  PracticeAttempt,
  BookmarkedSection,
  BookmarkedQuestion,
  FocusSession,
  ScheduledPracticeSlotConfig,
  SubjectId
} from '../types';
import {
  loadUserPracticeTimePreference,
  saveUserPracticeTimePreference,
  prepareTimedPracticeNotificationSession,
  normalizeScheduledSlots,
  DEFAULT_PRACTICE_SLOTS
} from '../utils/scheduledPracticeWorkflow';
import {
  CALevel,
  CourseStream,
  BaseLevelStage,
  CA_CURRICULUM_LEVELS,
  useCALevel,
  getCourseFromCALevel,
  getBaseStageFromCALevel,
  resolveCALevel,
  isFoundationLevel,
} from '../data/curriculumLevels';
import {
  getLevelSubjectIds,
  isSubjectInLevel,
  normalizeCoursePreferenceForLevel,
  getLevelScopedKey,
  getUserDocExamDateField,
  getAttemptsForLevel,
  isAttemptDateValidForLevel,
  getDefaultAttemptDateForLevel,
  switchWorkspaceCALevel
} from '../utils/levelStorage';
import { activateNextExamAttemptSchedule } from '../utils/taskCompletionSync';
import {
  isLmrModeCurrentlyOn,
  turnOffLmrModeManually,
  syncLmrAutoTriggerForActiveWindow
} from './LmrSprintBoard';

interface ProfileViewProps {
  currentUser: any;
  onUpdateProfile: (updated: any) => void;
  examDate: string;
  onUpdateExamDate: (date: string) => void;
  dailyGoalMinutes: number;
  onUpdateDailyGoal: (minutes: number) => void;
  practiceAttempts: PracticeAttempt[];
  focusSessions: FocusSession[];
  bookmarkedSections: BookmarkedSection[];
  bookmarkedQuestions?: BookmarkedQuestion[];
  onToggleQuestionBookmark?: (bookmark: BookmarkedQuestion) => void;
  onOpenQuestionBank?: (subjectId: SubjectId) => void;
  onTriggerSignIn: () => void;
  hydrationSoundEnabled?: boolean;
  onToggleHydrationSound?: (val: boolean) => void;
}

const EMOTES_COLLECTION = [
  { char: '👨‍🎓', label: 'Scholar Male' },
  { char: '👩‍🎓', label: 'Scholar Female' },
  { char: '🦁', label: 'CARO Lion' },
  { char: '🎯', label: 'Target Rank' },
  { char: '⚡', label: 'Rapid Mind' },
  { char: '🚀', label: 'Ambition' },
  { char: '🧠', label: 'Tax Auditor' },
  { char: '📚', label: 'Law Master' },
  { char: '💼', label: 'Chartered Practitioner' }
];

const getMonthYearLabel = (dateStr: string) => {
  if (!dateStr) return 'NOVEMBER - 2025';
  if (dateStr.toLowerCase().includes('nov 1, 25') || dateStr === '2025-11-01') {
    return 'NOVEMBER - 2025';
  }
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const monthNames = [
        "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
        "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
      ];
      return `${monthNames[d.getMonth()]} - ${d.getFullYear()}`;
    }
  } catch (e) {}

  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    const year = match[1];
    const monthIndex = parseInt(match[2], 10) - 1;
    const monthNames = [
      "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
      "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
    ];
    if (monthIndex >= 0 && monthIndex < 12) {
      return `${monthNames[monthIndex]} - ${year}`;
    }
  }
  return dateStr.toUpperCase();
};

export default function ProfileView({
  currentUser,
  onUpdateProfile,
  examDate,
  onUpdateExamDate,
  dailyGoalMinutes,
  onUpdateDailyGoal,
  practiceAttempts,
  focusSessions,
  bookmarkedSections,
  bookmarkedQuestions: externalBookmarkedQuestions,
  onToggleQuestionBookmark,
  onOpenQuestionBank,
  onTriggerSignIn,
  hydrationSoundEnabled = true,
  onToggleHydrationSound
}: ProfileViewProps) {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const levelSubjects = getLevelSubjectIds(caLevel);
  const [selectedCourse, setSelectedCourse] = useState<CourseStream>(() => getCourseFromCALevel(caLevel));
  const [selectedCALevel, setSelectedCALevelState] = useState<CALevel>(caLevel);
  const [selectedAttemptDate, setSelectedAttemptDate] = useState<string>(() =>
    isAttemptDateValidForLevel(examDate, caLevel)
      ? examDate
      : getDefaultAttemptDateForLevel(caLevel)
  );
  const [isSavingCourseLevel, setIsSavingCourseLevel] = useState(false);
  const [justSavedCourseLevel, setJustSavedCourseLevel] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [motto, setMotto] = useState('');
  const [coursePreference, setCoursePreference] = useState('Both Groups');
  const [selectedEmote, setSelectedEmote] = useState('👨‍🎓');
  const [localExamDate, setLocalExamDate] = useState(examDate);
  const [localDailyGoal, setLocalDailyGoal] = useState(dailyGoalMinutes);
  const [studyStatus, setStudyStatus] = useState('Offline');
  const [customHandleInput, setCustomHandleInput] = useState('');
  const [activeStudentHandle, setActiveStudentHandle] = useState('');
  const [handleCheckState, setHandleCheckState] = useState<
    'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'current'
  >('idle');
  const [handleCheckReason, setHandleCheckReason] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const resolveValidAttemptForLevel = (level: CALevel, candidate?: string | null): string => {
    if (candidate && isAttemptDateValidForLevel(candidate, level)) {
      return candidate;
    }
    try {
      const stored = localStorage.getItem(getLevelScopedKey('practca_exam_date', level));
      if (stored && isAttemptDateValidForLevel(stored, level)) {
        return stored;
      }
    } catch {}
    return getDefaultAttemptDateForLevel(level);
  };

  useEffect(() => {
    setSelectedCALevelState(caLevel);
    setSelectedCourse(getCourseFromCALevel(caLevel));
    setSelectedAttemptDate((prev) => resolveValidAttemptForLevel(caLevel, examDate || prev));
    setBookmarkSubjectFilter('ALL');
  }, [caLevel, examDate]);

  // States for student account deletion / purging
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [typedConfirm, setTypedConfirm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // States for password reset option in user profile too
  const [resetMode, setResetMode] = useState<'idle' | 'requested'>('idle');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isSmtpConfigured, setIsSmtpConfigured] = useState<boolean>(true);
  const [receivedCode, setReceivedCode] = useState<string | null>(null);
  const [showReceivedCode, setShowReceivedCode] = useState<boolean>(false);
  const [resetMethod, setResetMethod] = useState<'otp' | 'direct'>('direct');

  // Scheduled Timed Practice Slots State
  const [scheduledSlots, setScheduledSlots] = useState<ScheduledPracticeSlotConfig[]>(DEFAULT_PRACTICE_SLOTS);
  const [isSavingPracticePref, setIsSavingPracticePref] = useState<boolean>(false);
  const [isLaunchingPractice, setIsLaunchingPractice] = useState<boolean>(false);
  const [practicePrefFeedback, setPracticePrefFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 1.5-Day LMR Sprint Mode (auto-triggered ON during LMR sprint time; can only be turned OFF manually)
  const [isLmrActive, setIsLmrActive] = useState<boolean>(() => isLmrModeCurrentlyOn(caLevel));

  useEffect(() => {
    const syncLmrPref = () => {
      try {
        setIsLmrActive(isLmrModeCurrentlyOn(caLevel));
      } catch (e) {}
    };
    syncLmrAutoTriggerForActiveWindow(new Date(), caLevel);
    syncLmrPref();
    window.addEventListener('storage', syncLmrPref);
    window.addEventListener('practca_lmr_preference_updated', syncLmrPref);
    window.addEventListener('practca_lmr_mode_changed', syncLmrPref);
    window.addEventListener('practca_ca_level_changed', syncLmrPref);
    window.addEventListener('practca_exam_date_updated', syncLmrPref);
    window.addEventListener('practca_subject_exam_dates_updated', syncLmrPref);
    window.addEventListener('practca_roadmap_checkpoints_updated', syncLmrPref);
    return () => {
      window.removeEventListener('storage', syncLmrPref);
      window.removeEventListener('practca_lmr_preference_updated', syncLmrPref);
      window.removeEventListener('practca_lmr_mode_changed', syncLmrPref);
      window.removeEventListener('practca_ca_level_changed', syncLmrPref);
      window.removeEventListener('practca_exam_date_updated', syncLmrPref);
      window.removeEventListener('practca_subject_exam_dates_updated', syncLmrPref);
      window.removeEventListener('practca_roadmap_checkpoints_updated', syncLmrPref);
    };
  }, [caLevel]);

  const handleTurnOffLmrMode = () => {
    if (!isLmrActive) return;
    if (turnOffLmrModeManually(caLevel)) {
      setIsLmrActive(false);
    }
  };

  // Load user data upon selection
  useEffect(() => {
    const loadedPref = loadUserPracticeTimePreference(currentUser);
    setScheduledSlots(normalizeScheduledSlots(loadedPref.scheduled_slots, loadedPref.preferred_practice_time));

    if (currentUser) {
      const userLevel = (currentUser.caLevel as CALevel) || caLevel;
      setSelectedCALevelState(userLevel);
      setSelectedCourse(getCourseFromCALevel(userLevel));
      setDisplayName(currentUser.displayName || '');
      setPhone(currentUser.phone || '');
      setMotto(currentUser.motto || '');
      setCoursePreference(normalizeCoursePreferenceForLevel(currentUser.coursePreference, userLevel));
      setSelectedEmote(currentUser.emote || '👨‍🎓');
      setStudyStatus(currentUser.studyStatus || 'Offline');
      const initHandle = getSimpleUsername(currentUser);
      setCustomHandleInput(initHandle);
      setActiveStudentHandle(initHandle);
    } else {
      // Guest mode states
      const savedGuest = localStorage.getItem('practca_guest_profile');
      if (savedGuest) {
        try {
          const parsed = JSON.parse(savedGuest);
          const guestLevel = (parsed.caLevel as CALevel) || caLevel;
          setSelectedCALevelState(guestLevel);
          setSelectedCourse(getCourseFromCALevel(guestLevel));
          setDisplayName(parsed.displayName || `${CA_CURRICULUM_LEVELS[guestLevel].shortName} Guest`);
          setPhone(parsed.phone || '');
          setMotto(parsed.motto || 'Striving for professional excellence');
          setCoursePreference(normalizeCoursePreferenceForLevel(parsed.coursePreference, guestLevel));
          setSelectedEmote(parsed.emote || '🦁');
          setStudyStatus(parsed.studyStatus || 'Offline');
          const gHandle = cleanDisplayUsername(parsed.displayHandle || parsed.studentHandle || 'guest_student');
          setCustomHandleInput(gHandle);
          setActiveStudentHandle(gHandle);
        } catch (e) {
          // Defaults
          setDisplayName(`${levelInfo.shortName} Guest`);
          setCoursePreference(normalizeCoursePreferenceForLevel(undefined, caLevel));
          setSelectedEmote('🦁');
          setStudyStatus('Offline');
          setCustomHandleInput('guest_student');
          setActiveStudentHandle('guest_student');
        }
      } else {
        setDisplayName(`${levelInfo.shortName} Guest`);
        setCoursePreference(normalizeCoursePreferenceForLevel(undefined, caLevel));
        setSelectedEmote('🦁');
        setStudyStatus('Offline');
        setCustomHandleInput('guest_student');
        setActiveStudentHandle('guest_student');
      }
    }

  }, [currentUser]);

  // Listen for cross-component username updates (e.g. from Study Peers Hub)
  useEffect(() => {
    const onUsernameUpdated = (e: Event) => {
      const detail = (e as CustomEvent)?.detail;
      if (detail?.displayHandle || detail?.studentHandle) {
        const nextHandle = cleanDisplayUsername(detail.displayHandle || detail.studentHandle);
        setCustomHandleInput(nextHandle);
        setActiveStudentHandle(nextHandle);
      }
    };
    window.addEventListener('practca_username_updated', onUsernameUpdated);
    return () => window.removeEventListener('practca_username_updated', onUsernameUpdated);
  }, []);

  // Live debounced case-insensitive availability check when editing custom username
  useEffect(() => {
    if (!isEditingProfile) return;
    const raw = customHandleInput.trim();
    const format = validateUsernameFormat(raw);
    if (!format.valid) {
      setHandleCheckState('invalid');
      setHandleCheckReason(format.error || 'Invalid username format.');
      return;
    }
    if (normalizeUsername(raw) === normalizeUsername(activeStudentHandle)) {
      setHandleCheckState('current');
      setHandleCheckReason(`@${format.display} is your current active username.`);
      return;
    }

    setHandleCheckState('checking');
    setHandleCheckReason('Checking case-insensitive registry...');
    const timer = setTimeout(async () => {
      const uid = currentUser?.uid || auth.currentUser?.uid || 'guest_user';
      const res = await checkUsernameAvailability(raw, uid);
      if (res.isCurrentUsers) {
        setHandleCheckState('current');
        setHandleCheckReason(`@${res.display} is your current active username.`);
      } else if (res.available) {
        setHandleCheckState('available');
        setHandleCheckReason(`✓ @${res.display} is available (First-Come, First-Served).`);
      } else {
        setHandleCheckState('taken');
        setHandleCheckReason(res.reason || `@${res.normalized} is already taken.`);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [customHandleInput, activeStudentHandle, isEditingProfile, currentUser?.uid]);

  useEffect(() => {
    const syncPref = () => {
      const pref = loadUserPracticeTimePreference(currentUser, caLevel);
      setScheduledSlots(normalizeScheduledSlots(pref.scheduled_slots, pref.preferred_practice_time));
    };
    syncPref();
    window.addEventListener('practca_scheduled_practice_pref_updated', syncPref);
    return () => {
      window.removeEventListener('practca_scheduled_practice_pref_updated', syncPref);
    };
  }, [currentUser, caLevel]);

  // Synchronize dynamic dates/goals if they change from external modals
  useEffect(() => {
    setLocalExamDate(examDate);
    if (examDate && isAttemptDateValidForLevel(examDate, selectedCALevel)) {
      setSelectedAttemptDate(examDate);
    }
  }, [examDate]);

  useEffect(() => {
    setLocalDailyGoal(dailyGoalMinutes);
  }, [dailyGoalMinutes]);

  // Bookmarked Questions state synced with Firestore and localStorage
  const [localBookmarkedQuestions, setLocalBookmarkedQuestions] = useState<BookmarkedQuestion[]>(() => {
    try {
      const raw = localStorage.getItem('practca_bookmarked_questions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [bookmarkSubjectFilter, setBookmarkSubjectFilter] = useState<SubjectId | 'ALL'>('ALL');

  const activeBookmarkedQuestions = externalBookmarkedQuestions ?? localBookmarkedQuestions;

  useEffect(() => {
    if (externalBookmarkedQuestions !== undefined) return;

    const syncLocal = () => {
      try {
        const raw = localStorage.getItem('practca_bookmarked_questions');
        if (raw) setLocalBookmarkedQuestions(JSON.parse(raw));
      } catch {}
    };

    window.addEventListener('practca_bookmarked_questions_updated', syncLocal);
    window.addEventListener('storage', syncLocal);

    let unsubscribeFirestore: (() => void) | null = null;
    if (currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser) {
      const colRef = collection(db, 'users', currentUser.uid, 'bookmarkedQuestions');
      unsubscribeFirestore = onSnapshot(
        colRef,
        (snapshot) => {
          const list: BookmarkedQuestion[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as BookmarkedQuestion);
          });
          list.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
          setLocalBookmarkedQuestions(list);
          try {
            localStorage.setItem('practca_bookmarked_questions', JSON.stringify(list));
          } catch {}
        },
        (err) => {
          console.error('Error syncing bookmarkedQuestions in ProfileView:', err);
        }
      );
    }

    return () => {
      window.removeEventListener('practca_bookmarked_questions_updated', syncLocal);
      window.removeEventListener('storage', syncLocal);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [currentUser, externalBookmarkedQuestions]);

  const handleRemoveBookmarkedQuestion = async (item: BookmarkedQuestion) => {
    if (onToggleQuestionBookmark) {
      onToggleQuestionBookmark(item);
      return;
    }

    const updated = activeBookmarkedQuestions.filter((b) => b.questionId !== item.questionId);
    setLocalBookmarkedQuestions(updated);
    try {
      localStorage.setItem('practca_bookmarked_questions', JSON.stringify(updated));
      window.dispatchEvent(new Event('practca_bookmarked_questions_updated'));
    } catch {}

    if (currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser) {
      const cleanId = `qbook_${item.questionId}`.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 128);
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'bookmarkedQuestions', cleanId));
      } catch (err) {
        console.error('Failed to delete bookmarked question from Firestore:', err);
      }
    }
  };

  // Calculate high-yield Revision Stats scoped to active CA level
  const levelFocusSessions = (focusSessions || []).filter((s) => isSubjectInLevel(s.subjectId, caLevel));
  const levelPracticeAttempts = (practiceAttempts || []).filter((a) => isSubjectInLevel(a.subjectId, caLevel));
  const levelBookmarkedSections = (bookmarkedSections || []).filter((b) => isSubjectInLevel(b.subjectId, caLevel));
  const levelBookmarkedQuestions = activeBookmarkedQuestions.filter((q) => isSubjectInLevel(q.subjectId, caLevel));

  const totalFocusMinutes = levelFocusSessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const totalAttempts = levelPracticeAttempts.length;
  const successfulAttempts = levelPracticeAttempts.filter(a => a.isCorrect).length;
  const accuracyPercent = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0;
  const totalBookmarks = levelBookmarkedSections.length + levelBookmarkedQuestions.length;

  const handleLevelDropdownChange = (nextLevel: CALevel) => {
    setSelectedCALevelState(nextLevel);
    setSelectedCourse(getCourseFromCALevel(nextLevel));
    const nextAttempt = resolveValidAttemptForLevel(nextLevel, selectedAttemptDate);
    setSelectedAttemptDate(nextAttempt);
  };

  const handleSelectCourseLevel = async (newLevel: CALevel, attemptOverride?: string) => {
    setIsSavingCourseLevel(true);
    setJustSavedCourseLevel(false);
    setSelectedCALevelState(newLevel);
    const resolvedCourse = getCourseFromCALevel(newLevel);
    setSelectedCourse(resolvedCourse);
    const resolvedAttempt = resolveValidAttemptForLevel(newLevel, attemptOverride ?? selectedAttemptDate);
    setSelectedAttemptDate(resolvedAttempt);
    setLocalExamDate(resolvedAttempt);
    const normalizedPref = normalizeCoursePreferenceForLevel(coursePreference, newLevel);
    setCoursePreference(normalizedPref);

    try {
      localStorage.removeItem(getLevelScopedKey('practca_exam_attempt_cleared', newLevel));
      localStorage.setItem(getLevelScopedKey('practca_exam_date', newLevel), resolvedAttempt);
    } catch {}

    switchWorkspaceCALevel(newLevel);
    activateNextExamAttemptSchedule(resolvedAttempt, newLevel);
    onUpdateExamDate(resolvedAttempt);

    const examField = getUserDocExamDateField(newLevel);
    try {
      if (currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser) {
        await setDoc(
          doc(db, 'users', currentUser.uid),
          {
            course: selectedCourse,
            caLevel: newLevel,
            coursePreference: normalizedPref,
            [examField]: resolvedAttempt,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
        const mergedUser = {
          ...currentUser,
          course: selectedCourse,
          caLevel: newLevel,
          coursePreference: normalizedPref,
          [examField]: resolvedAttempt
        };
        localStorage.setItem('practca_custom_user', JSON.stringify(mergedUser));
        onUpdateProfile(mergedUser);
      } else {
        const rawGuest = localStorage.getItem('practca_guest_profile');
        const parsedGuest = rawGuest ? JSON.parse(rawGuest) : {};
        const nextGuest = {
          ...parsedGuest,
          course: selectedCourse,
          caLevel: newLevel,
          coursePreference: normalizedPref,
          [examField]: resolvedAttempt
        };
        localStorage.setItem('practca_guest_profile', JSON.stringify(nextGuest));
        onUpdateProfile({
          uid: 'guest_user',
          email: 'guest@student.icai',
          ...(currentUser || {}),
          ...nextGuest,
          isGuest: true
        });
      }
      setJustSavedCourseLevel(true);
      setTimeout(() => setJustSavedCourseLevel(false), 2000);
    } catch (err) {
      console.error('Failed to persist CA level & attempt update:', err);
    } finally {
      setIsSavingCourseLevel(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const resolvedDisplayName =
        displayName.trim() || (currentUser?.email ? String(currentUser.email).split('@')[0] : 'Student');
      const uid = currentUser?.uid || auth.currentUser?.uid || 'guest_user';

      // Claim & verify custom username (case-insensitive, first-come-first-served, releases old handle)
      const claimResult = await claimCustomUsername({
        rawInput: customHandleInput,
        currentUid: uid,
        currentDisplayName: resolvedDisplayName,
        previousHandle: activeStudentHandle
      });

      if (!claimResult.success) {
        setSaveMessage({
          type: 'error',
          text: claimResult.error || 'Could not claim custom username. Please choose another handle.'
        });
        setIsSaving(false);
        return;
      }

      setActiveStudentHandle(claimResult.displayHandle);
      setCustomHandleInput(claimResult.displayHandle);

      const normalizedCoursePref = normalizeCoursePreferenceForLevel(coursePreference, selectedCALevel);
      if (selectedCALevel !== caLevel) {
        switchWorkspaceCALevel(selectedCALevel);
      }

      const updatedData = {
        displayName: resolvedDisplayName,
        studentHandle: claimResult.normalizedHandle,
        displayHandle: claimResult.displayHandle,
        phone: phone.trim(),
        motto: motto.trim(),
        caLevel: selectedCALevel,
        coursePreference: normalizedCoursePref,
        emote: selectedEmote,
        examDate: localExamDate,
        dailyGoalMinutes: Number(localDailyGoal),
        studyStatus: studyStatus,
        preferred_practice_time: scheduledSlots[0]?.time || '14:00',
        scheduled_practice_enabled: scheduledSlots.some((s) => s.enabled)
      };

      await saveUserPracticeTimePreference(
        {
          preferred_practice_time: scheduledSlots[0]?.time || '14:00',
          scheduled_slots: scheduledSlots,
          scheduled_practice_enabled: scheduledSlots.some((s) => s.enabled)
        },
        currentUser,
        onUpdateProfile
      );

      if (currentUser && !currentUser.isGuest && currentUser.uid !== 'guest_user' && auth.currentUser) {
        // Logged in: update on Firestore and sync locally
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          ...updatedData,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Update local memory and raise state up
        const mergedUser = {
          ...currentUser,
          ...updatedData
        };
        localStorage.setItem('practca_custom_user', JSON.stringify(mergedUser));
        onUpdateProfile(mergedUser);
      } else {
        // Guest mode update
        localStorage.setItem('practca_guest_profile', JSON.stringify(updatedData));
        onUpdateProfile({
          uid: 'guest_user',
          email: 'guest@student.icai',
          ...updatedData,
          isGuest: true
        });
      }

      // Propagate countdown and hourly alerts
      onUpdateExamDate(localExamDate);
      onUpdateDailyGoal(Number(localDailyGoal));

      setSaveMessage({
        type: 'success',
        text: `Profile @${claimResult.displayHandle} saved.`
      });
      
      // Auto dismiss success toast and collapse form
      setTimeout(() => {
        setSaveMessage(null);
        setIsEditingProfile(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setSaveMessage({ type: 'error', text: err.message || 'Failed to save student profile details.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccountAndData = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      if (currentUser && !currentUser.isGuest) {
        const userId = currentUser.uid;
        await releaseUsernameOnDelete(userId, activeStudentHandle || currentUser.studentHandle);

        // Subcollections to purge
        const subcollections = [
          'practiceAttempts',
          'bookmarkedSections',
          'bookmarkedQuestions',
          'focusSessions',
          'revisionPlanner',
          'taskLists',
          'tasks'
        ];

        // Delete each document in all registered subcollections
        for (const sub of subcollections) {
          const colRef = collection(db, 'users', userId, sub);
          const qSnap = await getDocs(colRef);
          for (const docSnap of qSnap.docs) {
            await deleteDoc(doc(db, 'users', userId, sub, docSnap.id));
          }
        }

        // Delete the root users document
        try {
          await deleteDoc(doc(db, 'users', userId));
        } catch (e) {
          console.warn('Could not delete root user doc (perhaps it was not initialized on Firestore):', e);
        }

        // Delete Auth account
        if (auth.currentUser) {
          await deleteUser(auth.currentUser);
        }
        
        // Finalize cleanup across all CA levels
        const purgeKeys = [
          'practca_custom_user',
          'practca_guest_profile',
          'practca_practice_attempts',
          'cavault_practice_attempts',
          'practca_bookmarked_sections',
          'cavault_bookmarked_sections',
          'practca_bookmarked_questions',
          'practca_focus_sessions',
          'practca_local_tasks',
          'practca_local_task_lists',
          'practca_exam_date',
          'practca_paper_exam_dates_v1',
        ];
        for (const baseKey of purgeKeys) {
          localStorage.removeItem(baseKey);
          localStorage.removeItem(getLevelScopedKey(baseKey, 'foundation'));
          localStorage.removeItem(getLevelScopedKey(baseKey, 'intermediate'));
        }

        window.location.reload();
      } else {
        // Guest mode profile reset across all CA levels
        const purgeKeys = [
          'practca_guest_profile',
          'practca_practice_attempts',
          'cavault_practice_attempts',
          'practca_bookmarked_sections',
          'cavault_bookmarked_sections',
          'practca_bookmarked_questions',
          'practca_focus_sessions',
          'practca_local_tasks',
          'practca_local_task_lists',
          'practca_custom_user',
          'practca_exam_date',
          'practca_paper_exam_dates_v1',
        ];
        for (const baseKey of purgeKeys) {
          localStorage.removeItem(baseKey);
          localStorage.removeItem(getLevelScopedKey(baseKey, 'foundation'));
          localStorage.removeItem(getLevelScopedKey(baseKey, 'intermediate'));
        }

        // Reload page to reset state completely
        window.location.reload();
      }
    } catch (err: any) {
      console.error('Error in complete account purge:', err);
      if (err.code === 'auth/requires-recent-login' || err.message?.includes('requires-recent-login')) {
        setDeleteError('Security lock activated: Deleting your student profile requires a fresh session. Please sign out, sign back in, and then immediately retry deleting your account.');
      } else {
        setDeleteError(err.message || 'An error occurred during profile & database deletion.');
      }
      setIsDeleting(false);
    }
  };

  const handleRequestResetCode = async () => {
    if (!currentUser || !currentUser.email) return;
    setResetSubmitting(true);
    setResetError(null);
    setResetSuccess(null);
    setReceivedCode(null);
    setShowReceivedCode(false);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to request reset code.');
      }
      setIsSmtpConfigured(!!data.isSmtpConfigured);
      setReceivedCode(data.devCode || null);
      if (data.isSmtpConfigured) {
        setResetSuccess(`Reset code dispatched successfully to ${currentUser.email}! Please check your email inbox.`);
      } else {
        setResetSuccess(`Reset code generated! Since SMTP is not configured in this sandbox environment, you can use the secure 'Reveal Code' fallback below.`);
      }
      setResetMode('requested');
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleDirectPasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;
    if (!newPassword.trim()) {
      setResetError('Please specify the new security password.');
      return;
    }
    setResetSubmitting(true);
    setResetError(null);
    setResetSuccess(null);
    try {
      const response = await fetch('/api/auth/direct-update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          newPassword: newPassword.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password.');
      }
      setResetSuccess('🎉 Your security password has been changed instantly and successfully!');
      setNewPassword('');
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !currentUser.email) return;
    if (!resetCode.trim() || !newPassword.trim()) {
      setResetError('Please fill in both the code and the new password.');
      return;
    }
    setResetSubmitting(true);
    setResetError(null);
    setResetSuccess(null);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.email,
          code: resetCode.trim(),
          newPassword: newPassword.trim()
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update password.');
      }
      setResetSuccess('Your password has been successfully updated!');
      setResetCode('');
      setNewPassword('');
      setResetMode('idle');
      setReceivedCode(null);
      setShowReceivedCode(false);
    } catch (err: any) {
      setResetError(err.message);
    } finally {
      setResetSubmitting(false);
    }
  };

  const handleUpdateSlot = (
    slotId: 'slot_1' | 'slot_2',
    updates: Partial<ScheduledPracticeSlotConfig>
  ) => {
    setScheduledSlots((prev) =>
      normalizeScheduledSlots(
        prev.map((s) => (s.id === slotId ? { ...s, ...updates } : s))
      )
    );
  };

  const handleSaveScheduledPractice = async () => {
    setIsSavingPracticePref(true);
    setPracticePrefFeedback(null);
    try {
      const normalized = normalizeScheduledSlots(scheduledSlots);
      const anySlotOn = normalized.some((s) => s.enabled);
      const saved = await saveUserPracticeTimePreference(
        {
          preferred_practice_time: normalized[0]?.time || '14:00',
          scheduled_slots: normalized,
          scheduled_practice_enabled: anySlotOn,
          triggered_slots_by_date: {},
          pending_snooze: null
        },
        currentUser,
        onUpdateProfile
      );
      setScheduledSlots(normalizeScheduledSlots(saved.scheduled_slots, saved.preferred_practice_time));
      const activeSummary = (saved.scheduled_slots || [])
        .filter((s) => s.enabled)
        .map((s) => s.time)
        .join(' & ');
      setPracticePrefFeedback({
        type: 'success',
        text: activeSummary ? `Slots saved (${activeSummary}).` : 'Slots saved (all slots Off).'
      });
    } catch (err: any) {
      setPracticePrefFeedback({
        type: 'error',
        text: err.message || 'Failed to save slots.'
      });
    } finally {
      setIsSavingPracticePref(false);
    }
  };

  const handleTriggerTimedPracticeNow = async () => {
    setIsLaunchingPractice(true);
    setPracticePrefFeedback(null);
    try {
      const normalized = normalizeScheduledSlots(scheduledSlots);
      await saveUserPracticeTimePreference(
        {
          scheduled_slots: normalized,
          scheduled_practice_enabled: normalized.some((s) => s.enabled)
        },
        currentUser,
        onUpdateProfile
      );
      const activeSlot = normalized.find((s) => s.enabled) || normalized[0];
      const { session } = prepareTimedPracticeNotificationSession({
        currentUser,
        triggerType: 'scheduled',
        slotId: activeSlot?.id || 'slot_1',
        slotTime: activeSlot?.time
      });
      if (!session) {
        setPracticePrefFeedback({
          type: 'error',
          text: 'No eligible timed practice question ready yet (requires a completed chapter past the 3-hour cut-off).'
        });
        return;
      }
      window.dispatchEvent(
        new CustomEvent('practca_open_timed_practice_notification', {
          detail: { session, isSnoozeResume: false }
        })
      );
    } catch (err: any) {
      setPracticePrefFeedback({
        type: 'error',
        text: err.message || 'Unable to trigger timed practice.'
      });
    } finally {
      setIsLaunchingPractice(false);
    }
  };

  const attemptOptions = getAttemptsForLevel(selectedCALevel, selectedAttemptDate);
  const editorAttemptOptions = getAttemptsForLevel(selectedCALevel, localExamDate);

  return (
    <div id="student-profile-tab" className="w-full max-w-full select-none space-y-6">
      
      {/* Banner Card (Locked & Scroll-Diminished) */}
      <div className="locked-internal-header">
        <div className="locked-internal-header-card relative bg-gradient-to-r from-[#102238] via-[#182e4b] to-[#1d2c42] border border-amber-400/55 ring-1 ring-white/[0.06] rounded-2xl px-5 py-5 sm:px-6 sm:py-6 overflow-hidden">
          {/* Top Luminous Gold-Amber-Emerald Hairline */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-400 via-yellow-300 to-emerald-400 opacity-90 pointer-events-none" />
          {/* Decorative corner grid background matching the premium UI theme */}
          <div className="absolute inset-0 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.05] pointer-events-none" />
          <div className="absolute -top-10 right-12 w-56 h-24 bg-amber-400/12 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 z-10">
            <div className="flex items-center gap-4 min-w-0 w-full md:w-auto">
              {/* Avatar Area */}
              <div className="flex flex-col items-center shrink-0">
                <div className="header-diminish-avatar h-16 w-16 rounded-xl bg-gradient-to-br from-amber-400/25 to-amber-600/15 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-[0_0_16px_rgba(245,158,11,0.3)] transition-all duration-200 relative">
                  <span className="relative drop-shadow-md select-none leading-none">{selectedEmote}</span>
                  <div className="header-diminish-hide absolute -bottom-1.5 -right-1.5 bg-[#061322] border border-amber-400/60 text-amber-300 text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded shadow-xs select-none leading-none">
                    {isFoundationLevel(caLevel) ? 'FOUND.' : caLevel === 'intermediate' || caLevel === 'cma_intermediate' ? 'INTER' : 'FINAL'}
                  </div>
                </div>
              </div>

              <div className="flex-1 text-left space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-400/45 text-[10.5px] font-mono font-extrabold uppercase tracking-widest text-amber-300">
                    {levelInfo.shortName}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 text-[10.5px] font-mono font-extrabold tracking-wider rounded-full bg-[#061322]/90 text-amber-300 border border-amber-400/45 shadow-2xs select-none">
                    @{activeStudentHandle || getSimpleUsername(currentUser || { uid: 'guest_user' })}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight leading-tight truncate drop-shadow-xs">
                  {displayName || (currentUser?.email ? String(currentUser.email).split('@')[0] : `${levelInfo.shortName} Student`)}
                </h2>

                {motto && (
                  <div className="header-diminish-hide relative block max-w-2xl">
                    <p className="text-xs text-slate-200/90 font-mono italic leading-relaxed truncate">
                      &ldquo;{motto}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex flex-wrap items-center justify-start md:justify-end gap-2.5 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`header-diminish-btn h-10 flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 text-xs font-mono font-black tracking-wider uppercase rounded-xl transition duration-200 cursor-pointer border whitespace-nowrap ${
                  isEditingProfile 
                    ? 'bg-[#061322] border-slate-700 text-slate-200 hover:text-white hover:border-slate-500' 
                    : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 border-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.3)]'
                }`}
              >
                {isEditingProfile ? (
                  <>
                    <X className="h-3.5 w-3.5" />
                    Close
                  </>
                ) : (
                  <>
                    <Edit className="h-3.5 w-3.5" />
                    Edit Profile
                  </>
                )}
              </button>

              {!currentUser && (
                <button
                  type="button"
                  onClick={onTriggerSignIn}
                  className="header-diminish-btn h-10 flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 border border-emerald-200 text-xs font-black rounded-xl transition duration-200 shadow-[0_0_14px_rgba(16,185,129,0.28)] cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Aligned 12-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Sidebar Rail */}
        <div className="lg:col-span-4 space-y-6">
          {/* Progress */}
          <div className="bg-cav-card/50 border border-cav-border rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2 border-b border-cav-border pb-3 text-left">
              <Activity className="h-4 w-4 text-cav-accent shrink-0" />
              <span>Progress</span>
            </h3>

            <div className="space-y-3">
              {/* Focus Widget */}
              <div className="p-3.5 bg-cav-card2 border border-cav-border/70 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg border border-sky-500/20 shrink-0">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Focus Time</span>
                    <strong className="text-sm font-extrabold text-white block">
                      {Math.ceil(totalFocusMinutes / 60)} <span className="text-[10px] text-slate-400 font-semibold">Hrs</span>
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg tabular-nums shrink-0">
                  {totalFocusMinutes} Mins
                </span>
              </div>

              {/* Quiz Accuracy Widget */}
              <div className="p-3.5 bg-cav-card2 border border-cav-border/70 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <div className="p-2 bg-cav-emerald/10 text-cav-emerald rounded-lg border border-cav-emerald/20 shrink-0">
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Quiz Accuracy</span>
                    <strong className="text-sm font-extrabold text-[#10b981] block">
                      {accuracyPercent}%
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg tabular-nums shrink-0">
                  {successfulAttempts}/{totalAttempts} Ans
                </span>
              </div>

              {/* Bookmarks Widget */}
              <div
                onClick={() => {
                  const el = document.getElementById('my-bookmarks-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="p-3.5 bg-cav-card2 border border-cav-border/70 hover:border-amber-500/40 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition"
              >
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20 shrink-0">
                    <Bookmark className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-mono text-slate-400 font-bold block">Bookmarks</span>
                    <strong className="text-sm font-extrabold text-white block">
                      {totalBookmarks} <span className="text-[10px] text-slate-400 font-semibold">Saved</span>
                    </strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-amber-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg tabular-nums shrink-0">
                  {levelBookmarkedQuestions.length} Qs
                </span>
              </div>
            </div>
          </div>

          {/* Student Details */}
          <div className="bg-cav-card/50 border border-cav-border rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2 border-b border-cav-border pb-3 text-left">
              <User className="h-4 w-4 text-cav-accent shrink-0" />
              <span>Details</span>
            </h3>

            <div className="divide-y divide-slate-800/70 font-mono text-xs">
              <div className="flex justify-between items-center py-2.5 first:pt-0 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Name</span>
                <span className="text-slate-100 font-bold text-right truncate max-w-[190px]" title={displayName || `${levelInfo.shortName} Candidate`}>
                  {displayName || `${levelInfo.shortName} Candidate`}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Course &amp; Level</span>
                <span className="text-amber-300 font-extrabold text-right whitespace-nowrap">{levelInfo.name}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Username</span>
                <span className="text-amber-400 font-extrabold text-right truncate max-w-[190px]">
                  @{activeStudentHandle || getSimpleUsername(currentUser || { uid: 'guest_user' })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Email</span>
                <span className="text-slate-200 text-right truncate max-w-[190px]" title={currentUser?.email || 'guest@icai.org'}>
                  {currentUser?.email || 'guest@icai.org'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Status</span>
                <span className={`font-extrabold text-right truncate max-w-[190px] font-mono ${
                  studyStatus === 'In Focus Session' ? 'text-emerald-400' :
                  studyStatus === 'On Break' ? 'text-amber-400' :
                  studyStatus === 'Offline' ? 'text-slate-400' :
                  'text-cyan-400'
                }`}>
                  {studyStatus}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Groups</span>
                <span className="text-cav-accent font-bold text-right truncate max-w-[190px]">{coursePreference}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Attempt</span>
                <span className="text-white font-bold text-right whitespace-nowrap">{getMonthYearLabel(localExamDate)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Daily Goal</span>
                <span className="text-white font-bold text-right whitespace-nowrap">{localDailyGoal || 120} Mins/Day</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 pb-0.5 gap-3">
                <span className="text-slate-400 font-medium whitespace-nowrap">Sync</span>
                <span className={`font-bold text-right whitespace-nowrap ${currentUser ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {currentUser ? 'Cloud' : 'Local'}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-950/15 border border-rose-900/50 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm text-left">
            <div className="flex items-center gap-2 border-b border-rose-900/35 pb-3">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <h3 className="text-xs font-extrabold uppercase text-rose-200 font-mono tracking-widest">
                Danger Zone
              </h3>
            </div>

            {deleteError && (
              <div className="p-3.5 bg-rose-950/40 border border-rose-800/50 text-rose-300 rounded-xl text-xs font-semibold leading-relaxed">
                {deleteError}
              </div>
            )}

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(true);
                  setTypedConfirm('');
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 h-10 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-rose-200 border border-rose-500/35 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-xs"
              >
                <Trash2 className="h-4 w-4 shrink-0" />
                <span>Delete Account</span>
              </button>
            ) : (
              <div className="bg-slate-950/80 border border-rose-900/40 rounded-xl p-4 space-y-3">
                <input
                  type="text"
                  disabled={isDeleting}
                  placeholder="Type DELETE to confirm"
                  value={typedConfirm}
                  onChange={(e) => setTypedConfirm(e.target.value)}
                  className="w-full h-10 bg-slate-900 border border-slate-800 focus:border-rose-500 text-rose-400 font-mono text-center text-xs tracking-widest px-3.5 rounded-lg focus:outline-none transition-colors"
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    disabled={typedConfirm.toUpperCase() !== 'DELETE' || isDeleting}
                    onClick={handleDeleteAccountAndData}
                    className="flex-1 h-10 flex items-center justify-center gap-2 px-4 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-900 disabled:text-slate-500 disabled:border-slate-800 border border-rose-500 text-white text-[11px] font-bold font-mono uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer shadow-md"
                  >
                    {isDeleting ? 'Purging...' : 'Confirm'}
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="h-10 flex items-center justify-center gap-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] font-bold font-mono uppercase tracking-wider rounded-lg transition duration-200 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Primary Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Course & Level (Course, Level, Attempt & Save button only) */}
          <div className="bg-cav-card/60 border border-amber-400/35 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm text-left">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cav-border pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400 shrink-0" />
                <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest">
                  Course &amp; Level
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-400/30 text-[10px] font-mono font-bold text-amber-300">
                {CA_CURRICULUM_LEVELS[selectedCALevel]?.shortName} · {CA_CURRICULUM_LEVELS[selectedCALevel]?.paperStructureSummary}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 items-end">
              {/* Course */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="profile-course-select"
                  className="text-[10.5px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block"
                >
                  Course
                </label>
                <select
                  id="profile-course-select"
                  value={selectedCourse}
                  onChange={(e) => {
                    const nextCourse = e.target.value as CourseStream;
                    setSelectedCourse(nextCourse);
                    const currentStage = getBaseStageFromCALevel(selectedCALevel);
                    const nextLevel = resolveCALevel(nextCourse, currentStage);
                    handleLevelDropdownChange(nextLevel);
                  }}
                  className="w-full h-10 bg-slate-950/90 border border-slate-700/80 hover:border-amber-400/50 focus:border-amber-400 px-3.5 text-xs font-mono font-bold rounded-xl text-white transition cursor-pointer focus:outline-none"
                >
                  <option value="CA">CA</option>
                  <option value="CMA">CMA</option>
                </select>
              </div>

              {/* Level */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="profile-ca-level-select"
                  className="text-[10.5px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block"
                >
                  Level
                </label>
                <select
                  id="profile-ca-level-select"
                  value={getBaseStageFromCALevel(selectedCALevel)}
                  disabled={!selectedCourse}
                  onChange={(e) => {
                    const nextStage = e.target.value as BaseLevelStage;
                    const nextLevel = resolveCALevel(selectedCourse, nextStage);
                    handleLevelDropdownChange(nextLevel);
                  }}
                  className="w-full h-10 bg-slate-950/90 border border-slate-700/80 hover:border-amber-400/50 focus:border-amber-400 px-3.5 text-xs font-mono font-bold rounded-xl text-white transition cursor-pointer focus:outline-none disabled:opacity-50"
                >
                  <option value="foundation">Foundation</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="final">Final</option>
                </select>
              </div>

              {/* Attempt */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="profile-attempt-select"
                  className="text-[10.5px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block"
                >
                  Attempt
                </label>
                <select
                  id="profile-attempt-select"
                  value={selectedAttemptDate}
                  onChange={(e) => setSelectedAttemptDate(e.target.value)}
                  className="w-full h-10 bg-slate-950/90 border border-slate-700/80 hover:border-amber-400/50 focus:border-amber-400 px-3.5 text-xs font-mono font-bold rounded-xl text-white transition cursor-pointer focus:outline-none"
                >
                  {attemptOptions.map((att) => (
                    <option key={att.date} value={att.date}>
                      {att.shortLabel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Save */}
              <div>
                <button
                  type="button"
                  id="save-ca-course-level-btn"
                  disabled={isSavingCourseLevel}
                  onClick={() => handleSelectCourseLevel(selectedCALevel, selectedAttemptDate)}
                  className={`w-full h-10 flex items-center justify-center gap-2 px-4 text-xs font-mono font-black uppercase tracking-wider rounded-xl transition cursor-pointer border ${
                    justSavedCourseLevel
                      ? 'bg-emerald-500 border-emerald-300 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.28)]'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 text-slate-950 border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  }`}
                >
                  {justSavedCourseLevel ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" />
                      <span>{isSavingCourseLevel ? 'Saving...' : 'Save'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="bg-cav-card border border-cav-border rounded-xl p-5 sm:p-6 space-y-5 shadow-sm animate-fadeIn text-left">
              <div className="flex items-center justify-between border-b border-cav-border pb-3 gap-4">
                <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cav-accent shrink-0" />
                  <span>Edit Profile</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 text-[10px] uppercase font-mono font-bold tracking-wider text-slate-300 bg-slate-900 border border-slate-800 hover:text-white hover:border-slate-700 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                >
                  <X className="h-3 w-3" />
                  <span>Close</span>
                </button>
              </div>

              {saveMessage && (
                <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-center gap-3 animate-fadeIn ${
                  saveMessage.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981]' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  <span>{saveMessage.type === 'success' ? '✔' : '⚠'}</span>
                  <div>{saveMessage.text}</div>
                </div>
              )}

              {/* Avatar Emote Picker */}
              <div className="space-y-2 text-left">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                  Emote
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {EMOTES_COLLECTION.map((emote) => (
                    <button
                      key={emote.char}
                      type="button"
                      onClick={() => setSelectedEmote(emote.char)}
                      title={emote.label}
                      className={`h-11 w-11 rounded-xl flex items-center justify-center text-2xl transition cursor-pointer ${
                        selectedEmote === emote.char
                          ? 'bg-cav-accent/15 border-2 border-cav-accent scale-105 shadow-md shadow-cav-accent/10'
                          : 'bg-cav-input border border-cav-border hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      {emote.char}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <User className="h-4 w-4 text-cav-accent/70" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent pl-10 pr-4 text-xs rounded-xl text-white font-semibold transition placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Username
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400 font-mono font-bold text-xs pointer-events-none">
                      @
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={24}
                      placeholder="username"
                      value={customHandleInput}
                      onChange={(e) => setCustomHandleInput(e.target.value.replace(/\s+/g, ''))}
                      className={`w-full h-10 bg-cav-input border pl-8 pr-4 text-xs font-mono rounded-xl text-white font-bold transition ${
                        handleCheckState === 'taken' || handleCheckState === 'invalid'
                          ? 'border-rose-500/70 focus:border-rose-500'
                          : handleCheckState === 'available'
                          ? 'border-emerald-500/70 focus:border-emerald-500'
                          : 'border-cav-border hover:border-slate-700 focus:border-cav-accent'
                      }`}
                    />
                  </div>
                  {(handleCheckState === 'taken' || handleCheckState === 'invalid' || handleCheckState === 'available') && handleCheckReason && (
                    <div
                      className={`text-[10px] font-mono leading-snug ${
                        handleCheckState === 'available'
                          ? 'text-emerald-400 font-bold'
                          : 'text-rose-400 font-bold'
                      }`}
                    >
                      {handleCheckReason}
                    </div>
                  )}
                </div>

                {/* Mobile */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Mobile
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                      <Phone className="h-4 w-4 text-cav-accent/70" />
                    </span>
                    <input
                      type="tel"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+ ]/g, ''))}
                      className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent pl-10 pr-4 text-xs rounded-xl text-white font-semibold transition placeholder:text-slate-500"
                    />
                  </div>
                </div>

                {/* Attempt */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Attempt
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">
                      <Calendar className="h-4 w-4 text-cav-accent/70" />
                    </span>
                    <select
                      value={localExamDate}
                      onChange={(e) => {
                        setLocalExamDate(e.target.value);
                        setSelectedAttemptDate(e.target.value);
                      }}
                      className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent pl-10 pr-8 text-xs rounded-xl text-white font-semibold transition select-none appearance-none cursor-pointer"
                    >
                      {editorAttemptOptions.map((att) => (
                        <option key={att.date} value={att.date}>
                          {att.shortLabel}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Groups */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Groups
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">
                      <BookOpen className="h-4 w-4 text-cav-accent/70" />
                    </span>
                    <select
                      value={coursePreference}
                      onChange={(e) => setCoursePreference(e.target.value)}
                      className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent pl-10 pr-8 text-xs rounded-xl text-white font-semibold transition select-none appearance-none cursor-pointer"
                    >
                      {isFoundationLevel(selectedCALevel) ? (
                        <option value="All 4 Papers">All 4 Papers</option>
                      ) : (
                        <>
                          <option value="Both Groups">Both Groups</option>
                          <option value="Group 1 Only">Group 1 Only</option>
                          <option value="Group 2 Only">Group 2 Only</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
                
                {/* Daily Goal */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Daily Goal (Mins)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="1440"
                    value={localDailyGoal}
                    onChange={(e) => setLocalDailyGoal(Number(e.target.value) || 120)}
                    className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent px-4 text-xs rounded-xl text-white font-semibold transition"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block opacity-60">
                    Email
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser ? currentUser.email : 'guest@student.icai'}
                    className="w-full h-10 bg-cav-input/50 text-slate-400 border border-cav-border/40 px-4 text-xs rounded-xl font-semibold cursor-not-allowed opacity-80"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                    Status
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none z-10">
                      <Activity className="h-4 w-4 text-cav-accent/70" />
                    </span>
                    <select
                      value={studyStatus}
                      onChange={(e) => setStudyStatus(e.target.value)}
                      className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent pl-10 pr-8 text-xs rounded-xl text-white font-semibold transition select-none appearance-none cursor-pointer"
                    >
                      <option value="Offline">Offline</option>
                      <option value="In Focus Session">In Focus Session</option>
                      <option value="On Break">On Break</option>
                      <option value="Active Study">Active Study</option>
                      <option value="Exam Mode">Exam Mode</option>
                      <option value="Doubt Solving">Doubt Solving</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Motto */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 font-mono block">
                  Motto
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                    <Quote className="h-4 w-4 text-cav-accent/70" />
                  </span>
                  <input
                    type="text"
                    maxLength={160}
                    placeholder="Study motto"
                    value={motto}
                    onChange={(e) => setMotto(e.target.value)}
                    className="w-full h-10 bg-cav-input border border-cav-border hover:border-slate-700 focus:border-cav-accent pl-10 pr-4 text-xs rounded-xl text-white font-semibold transition placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Save Buttons */}
              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-cav-border">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="h-10 px-5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="h-10 flex items-center gap-2 px-6 bg-cav-accent hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-md"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? 'Saving...' : 'Save'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Preferences */}
          <div className="bg-cav-card/50 border border-cav-border rounded-xl p-5 sm:p-6 space-y-4">
            <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2 border-b border-cav-border pb-3 text-left">
              <Volume2 className="h-4 w-4 text-cav-accent shrink-0" />
              <span>Preferences</span>
            </h3>

            <div className="divide-y divide-slate-800/70">
              <div className="flex items-center justify-between gap-4 pb-3.5">
                <span className="text-xs font-bold text-slate-200 text-left">Hydration Chime</span>
                <button
                  type="button"
                  onClick={() => onToggleHydrationSound?.(!hydrationSoundEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    hydrationSoundEnabled ? 'bg-amber-500' : 'bg-slate-800'
                  }`}
                  aria-label="Toggle hydration sound"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                      hydrationSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 pt-3.5">
                <div className="flex items-center gap-2 flex-wrap text-left">
                  <span className="text-xs font-bold text-slate-200">
                    1.5-Day LMR Mode
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                      isLmrActive
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isLmrActive ? 'Active' : 'Off'}
                  </span>
                </div>
                <button
                  type="button"
                  disabled={!isLmrActive}
                  onClick={handleTurnOffLmrMode}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isLmrActive
                      ? 'bg-amber-500 cursor-pointer'
                      : 'bg-slate-800 opacity-50 cursor-not-allowed'
                  }`}
                  aria-label="Turn off 1.5-Day LMR Mode"
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isLmrActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Timed Practice */}
          <div className="bg-cav-card/50 border border-cav-border rounded-xl p-5 sm:p-6 space-y-4 text-left">
            <div className="flex items-center gap-2 border-b border-cav-border pb-3">
              <Clock className="h-4 w-4 text-cav-accent shrink-0" />
              <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest">
                Timed Practice
              </h3>
            </div>

            {practicePrefFeedback && (
              <div
                className={`px-3.5 py-2.5 rounded-lg border text-xs font-bold ${
                  practicePrefFeedback.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                }`}
              >
                {practicePrefFeedback.text}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 items-end">
              {scheduledSlots.map((slot, idx) => (
                <div key={slot.id} className="space-y-2 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-300">
                      Slot {idx + 1}
                    </label>
                    <button
                      type="button"
                      onClick={() => handleUpdateSlot(slot.id, { enabled: !slot.enabled })}
                      className={`px-2.5 py-0.5 rounded-md text-[9.5px] font-mono font-bold uppercase cursor-pointer border transition ${
                        slot.enabled
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {slot.enabled ? 'On' : 'Off'}
                    </button>
                  </div>
                  <input
                    type="time"
                    value={slot.time}
                    disabled={!slot.enabled}
                    onChange={(e) => handleUpdateSlot(slot.id, { time: e.target.value })}
                    className="w-full h-10 bg-slate-900 border border-slate-800 focus:border-cav-accent disabled:opacity-45 rounded-xl px-3 text-xs font-mono font-bold text-white tabular-nums [color-scheme:dark]"
                  />
                </div>
              ))}

              <button
                type="button"
                disabled={isSavingPracticePref}
                onClick={handleSaveScheduledPractice}
                className="w-full h-10 px-3.5 bg-cav-accent hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5 shrink-0" />
                <span>{isSavingPracticePref ? 'Saving...' : 'Save Slots'}</span>
              </button>

              <button
                type="button"
                disabled={isLaunchingPractice}
                onClick={handleTriggerTimedPracticeNow}
                className="w-full h-10 px-3.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 font-mono text-xs font-extrabold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <Play className="h-3.5 w-3.5 shrink-0" />
                <span>{isLaunchingPractice ? 'Opening...' : 'Trigger Now'}</span>
              </button>
            </div>
          </div>

          {/* Bookmarks */}
          <div id="my-bookmarks-section" className="bg-cav-card/50 border border-cav-border rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cav-border pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-amber-400 fill-amber-400 shrink-0" />
                <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest">
                  Bookmarks
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 tabular-nums">
                  {levelBookmarkedQuestions.length}
                </span>
              </div>

              {/* Subject Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {(['ALL', ...levelSubjects] as const).map((sub) => {
                  const isActive = bookmarkSubjectFilter === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setBookmarkSubjectFilter(sub)}
                      className={`h-7 px-2.5 rounded-lg font-mono text-[10px] font-bold transition cursor-pointer whitespace-nowrap flex items-center justify-center ${
                        isActive
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {sub === 'ALL' ? 'All' : sub}
                    </button>
                  );
                })}
              </div>
            </div>

            {(() => {
              const filteredQuestionBookmarks = levelBookmarkedQuestions.filter(
                (b) => bookmarkSubjectFilter === 'ALL' || b.subjectId === bookmarkSubjectFilter
              );

              if (filteredQuestionBookmarks.length === 0) {
                return (
                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-5 text-center">
                    <p className="text-xs font-bold text-slate-400">
                      No bookmarked questions yet.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {filteredQuestionBookmarks.map((item) => (
                    <div
                      key={item.questionId}
                      className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 rounded-xl p-4 space-y-2.5 transition text-left"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2.5">
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-slate-400 tabular-nums">
                            <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                              {item.subjectId}
                            </span>
                            <span className="text-slate-300 font-semibold">{item.attemptLabel}</span>
                            <span>·</span>
                            <span className="text-slate-200 font-bold">{item.questionNumber}</span>
                            <span>·</span>
                            <span className="text-emerald-400 font-bold">{item.marks} Marks</span>
                            <span>·</span>
                            <span className="text-sky-400 truncate">{item.chapterName}</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                            {item.topicTag}
                          </h4>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (onOpenQuestionBank) {
                                onOpenQuestionBank(item.subjectId);
                              } else {
                                window.dispatchEvent(
                                  new CustomEvent('practca_open_question_bank', {
                                    detail: { subjectId: item.subjectId, questionId: item.questionId }
                                  })
                                );
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-300 font-mono text-[10px] font-bold transition cursor-pointer whitespace-nowrap"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>Open</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveBookmarkedQuestion(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-mono text-[10px] font-bold transition cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {item.questionPreview}
                      </p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Security */}
          <div className="bg-cav-card/50 border border-cav-border rounded-xl p-5 sm:p-6 space-y-4 animate-fadeIn text-left">
            <h3 className="text-xs font-extrabold uppercase text-slate-200 font-mono tracking-widest flex items-center gap-2 border-b border-cav-border pb-3">
              <Shield className="h-4 w-4 text-cav-accent shrink-0" />
              <span>Security</span>
            </h3>

            {currentUser && !currentUser.isGuest ? (
              <div className="space-y-4">
                <div className="flex border-b border-slate-800 pb-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetMethod('direct');
                      setResetError(null);
                      setResetSuccess(null);
                      setResetMode('idle');
                    }}
                    className={`pb-2 px-3 text-xs font-bold transition uppercase tracking-wider font-mono border-b-2 cursor-pointer ${
                      resetMethod === 'direct'
                        ? 'border-cav-accent text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    Instant Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setResetMethod('otp');
                      setResetError(null);
                      setResetSuccess(null);
                      setResetMode('idle');
                    }}
                    className={`pb-2 px-3 text-xs font-bold transition uppercase tracking-wider font-mono border-b-2 cursor-pointer ${
                      resetMethod === 'otp'
                        ? 'border-cav-accent text-white'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    Email OTP
                  </button>
                </div>

                {resetSuccess && (
                  <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-[#10b981] rounded-xl text-xs font-bold leading-relaxed animate-fadeIn">
                    {resetSuccess}
                  </div>
                )}

                {resetError && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold leading-relaxed animate-fadeIn">
                    {resetError}
                  </div>
                )}

                {resetMethod === 'direct' ? (
                  <form onSubmit={handleDirectPasswordUpdate} className="animate-fadeIn text-left">
                    <div className="flex flex-col sm:flex-row sm:items-end gap-3">
                      <div className="space-y-1.5 text-left flex-1 max-w-sm">
                        <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Minimum 6 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={resetSubmitting}
                          className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-cav-accent rounded-xl px-3.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-500 font-bold"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={resetSubmitting}
                        className="h-10 flex items-center justify-center gap-2 px-5 bg-cav-accent hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-md whitespace-nowrap"
                      >
                        {resetSubmitting ? (
                          <span className="h-3.5 w-3.5 border-2 border-slate-950/25 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 animate-fadeIn text-left">
                    {resetMode === 'idle' ? (
                      <button
                        type="button"
                        disabled={resetSubmitting}
                        onClick={handleRequestResetCode}
                        className="h-10 flex items-center justify-center gap-2 px-5 bg-cav-accent hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-md animate-fadeIn"
                      >
                        {resetSubmitting ? (
                          <span className="h-3.5 w-3.5 border-2 border-slate-950/25 border-t-slate-950 rounded-full animate-spin" />
                        ) : (
                          'Send Reset Code'
                        )}
                      </button>
                    ) : (
                      <form onSubmit={handleConfirmReset} className="space-y-4 animate-fadeIn">
                        {!isSmtpConfigured && receivedCode && (
                          <div className="p-3.5 bg-slate-950 border border-amber-500/15 rounded-xl flex items-center justify-between gap-2 text-left">
                            {showReceivedCode ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-white text-xs font-bold tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                                  {receivedCode}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setResetCode(receivedCode)}
                                  className="text-[10px] text-amber-500 hover:text-amber-400 underline font-bold cursor-pointer"
                                >
                                  Autofill
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setShowReceivedCode(true)}
                                className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 font-mono text-[9.5px] font-bold rounded-lg transition cursor-pointer"
                              >
                                Reveal Code
                              </button>
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">6-Digit Code</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              placeholder="6-digit code"
                              value={resetCode}
                              onChange={(e) => setResetCode(e.target.value)}
                              disabled={resetSubmitting}
                              className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-cav-accent rounded-xl px-3.5 text-xs text-white text-center focus:outline-none transition-colors placeholder:text-slate-600 font-mono tracking-widest font-bold"
                            />
                          </div>

                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">New Password</label>
                            <input
                              type="password"
                              required
                              placeholder="Minimum 6 characters"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              disabled={resetSubmitting}
                              className="w-full h-10 bg-slate-950 border border-slate-800 focus:border-cav-accent rounded-xl px-3.5 text-xs text-white focus:outline-none transition-colors placeholder:text-slate-500 font-bold"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="submit"
                            disabled={resetSubmitting}
                            className="h-10 flex items-center justify-center gap-2 px-5 bg-cav-accent hover:bg-amber-600 text-slate-950 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition duration-200 cursor-pointer shadow-md"
                          >
                            {resetSubmitting ? (
                              <span className="h-3.5 w-3.5 border-2 border-slate-950/25 border-t-slate-950 rounded-full animate-spin" />
                            ) : (
                              'Save Password'
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setResetMode('idle');
                              setResetError(null);
                              setResetSuccess(null);
                              setShowReceivedCode(false);
                            }}
                            className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            Cancel
                          </button>

                          <button
                            type="button"
                            onClick={handleRequestResetCode}
                            className="text-xs font-bold text-amber-500 hover:text-amber-400 transition uppercase font-mono cursor-pointer bg-transparent border-none outline-none"
                          >
                            Resend
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <span className="text-xs font-semibold text-slate-400">
                  Local session
                </span>
                <button
                  type="button"
                  onClick={onTriggerSignIn}
                  className="inline-flex items-center gap-2 h-9 px-4 bg-cav-accent hover:bg-amber-600 text-slate-950 text-xs font-extrabold rounded-xl transition duration-200 cursor-pointer shadow-md"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
