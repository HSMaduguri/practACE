/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  SubjectId, 
  QuizQuestionItem, 
  GeneralQuestion, 
  CaseScenario, 
  CaseSubQuestion, 
  PracticeAttempt 
} from '../types';
import { QUIZ_QUESTIONS } from '../data/questions';
import { getSelectedCALevel } from '../data/curriculumLevels';
import { getLevelScopedKey } from '../utils/levelStorage';
import { formatRunningTime } from '../utils/timeFormat';
import IcaExamPalette, { PaletteItem, QuestionExamStatus } from './quiz/IcaExamPalette';
import SplitCaseWorkspace from './quiz/SplitCaseWorkspace';
import ExamResultScorecard, { EvaluatedQuestion } from './quiz/ExamResultScorecard';
import { 
  Play, 
  BookOpen, 
  Target, 
  Compass, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  FileText,
  Layers,
  Search,
  ArrowLeft,
  Check,
  Lock,
  RefreshCw,
  HelpCircle,
  Bookmark,
  Menu,
  ShieldCheck
} from 'lucide-react';

interface QuizViewProps {
  subjectId: SubjectId;
  subjectName: string;
  onRecordPractice: (attempt: PracticeAttempt) => void;
}

// Case Study Progress & Attempt History State
export interface CaseStudyProgressState {
  answers: Record<string, number>; // subQ.id -> selectedShuffledOptionIndex
  lastStoppedQIndex: number; // 0..4
  attemptCount: number; // 1, 2, 3
  lastAttemptTimestamp: number; // Date.now() timestamp ms
  questionOrder: string[]; // array of subQ.id in shuffled order
  optionOrders: Record<string, number[]>; // subQ.id -> [shuffled original option indices]
  markedForReview?: string[]; // array of subQ.id
}

// Circular Progress SVG Ring Component with Visual Percentage Label
export function CircularProgressRing({ 
  attempted, 
  total = 5, 
  size = 44, 
  strokeWidth = 4,
  showPercentage = true,
  className = ''
}: { 
  attempted: number; 
  total?: number; 
  size?: number; 
  strokeWidth?: number; 
  showPercentage?: boolean;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = total > 0 ? total : 1;
  const rawPercentage = Math.min(100, Math.max(0, (attempted / safeTotal) * 100));
  const percentage = Math.round(rawPercentage);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isCompleted = attempted >= total && total > 0;

  return (
    <div className={`flex items-center gap-2.5 shrink-0 ${className}`}>
      <div className="relative inline-flex items-center justify-center shrink-0" title={`${attempted} of ${total} attempted (${percentage}%)`}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-500 ${
              isCompleted 
                ? 'text-emerald-400' 
                : attempted > 0 
                ? 'text-cyan-400' 
                : 'text-slate-700'
            }`}
            fill="transparent"
          />
        </svg>
        <span className="absolute font-mono text-[10px] font-bold text-slate-200">
          {attempted}/{total}
        </span>
      </div>

      {showPercentage && (
        <span 
          className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border shadow-xs whitespace-nowrap transition-colors ${
            isCompleted 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : attempted > 0 
              ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
              : 'bg-slate-900 text-slate-500 border-slate-800'
          }`}
        >
          {percentage}%
        </span>
      )}
    </div>
  );
}

// Helper to shuffle arrays
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Cooldown calculation helper for 1-week rule
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function getCooldownDetails(lastAttemptTimestamp: number) {
  if (!lastAttemptTimestamp) return { inCooldown: false, text: '', daysLeft: 0, hoursLeft: 0 };
  const timeElapsed = Date.now() - lastAttemptTimestamp;
  const msLeft = ONE_WEEK_MS - timeElapsed;
  if (msLeft <= 0) return { inCooldown: false, text: '', daysLeft: 0, hoursLeft: 0 };

  const daysLeft = Math.floor(msLeft / (24 * 3600 * 1000));
  const hoursLeft = Math.floor((msLeft % (24 * 3600 * 1000)) / (3600 * 1000));
  const text = daysLeft > 0 ? `${daysLeft}d ${hoursLeft}h` : `${hoursLeft}h`;
  return { inCooldown: true, text, daysLeft, hoursLeft };
}

export default function QuizView({ subjectId, subjectName, onRecordPractice }: QuizViewProps) {
  const [quizMode, setQuizMode] = useState<'lobby' | 'practice' | 'test'>('lobby');
  
  // Practice Sub-Type: 'case' (Case Study Scenarios) or 'general' (Standalone MCQs)
  const [practiceType, setPracticeType] = useState<'case' | 'general'>('case');
  const [selectedChapter, setSelectedChapter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Active Case Study state
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [currentSubQIndex, setCurrentSubQIndex] = useState<number>(0);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);

  // General Practice State (keyed by question.id for persistence across chapter filters)
  const [currentGeneralIndex, setCurrentGeneralIndex] = useState(0);
  const [selectedGeneralOption, setSelectedGeneralOption] = useState<number | null>(null);
  const [generalAiExplanation, setGeneralAiExplanation] = useState<string | null>(null);
  const [loadingGeneralAi, setLoadingGeneralAi] = useState(false);
  const [generalMarkedReview, setGeneralMarkedReview] = useState<Set<number>>(new Set());
  const [generalAnswers, setGeneralAnswers] = useState<Record<string, number>>({});

  // Practice Mode Detailed Attempt Tracking State
  const [practiceAttemptsHistory, setPracticeAttemptsHistory] = useState<PracticeAttempt[]>([]);
  const [showPracticeTelemetry, setShowPracticeTelemetry] = useState<boolean>(false);

  // Case Study Practice State (Persistent progress)
  const [caseProgressMap, setCaseProgressMap] = useState<Record<string, CaseStudyProgressState>>({});
  const [caseAiExplanations, setCaseAiExplanations] = useState<Record<string, string>>({});
  const [loadingCaseAi, setLoadingCaseAi] = useState<Record<string, boolean>>({});

  // Test Mode States
  const [testTimeLeft, setTestTimeLeft] = useState(1800); // 30 minutes countdown
  const [testTotalDuration, setTestTotalDuration] = useState(1800);
  const [testRunning, setTestRunning] = useState(false);
  const [testQuestions, setTestQuestions] = useState<QuizQuestionItem[]>([]);
  const [currentTestItemIndex, setCurrentTestItemIndex] = useState(0);
  const [testSubIndex, setTestSubIndex] = useState(0);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({}); // questionId -> chosenOptionIndex
  const [testMarkedReview, setTestMarkedReview] = useState<Set<string>>(new Set());
  const [testVisitedQuestions, setTestVisitedQuestions] = useState<Set<string>>(new Set());
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testEvaluatedList, setTestEvaluatedList] = useState<EvaluatedQuestion[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load saved Case Study & General MCQ attempts + Practice Attempt history from localStorage on mount & level switch
  useEffect(() => {
    const loadSavedQuizState = () => {
      const level = getSelectedCALevel();
      try {
        const saved = localStorage.getItem(getLevelScopedKey('ca_final_case_study_attempts_v2', level));
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setCaseProgressMap(parsed);
          }
        } else {
          setCaseProgressMap({});
        }
        const savedGeneral = localStorage.getItem(getLevelScopedKey('ca_final_general_mcq_attempts_v1', level));
        if (savedGeneral) {
          const parsedGen = JSON.parse(savedGeneral);
          if (parsedGen && typeof parsedGen === 'object') {
            setGeneralAnswers(parsedGen);
          }
        } else {
          setGeneralAnswers({});
        }
      } catch (e) {
        console.warn("Failed to read quiz attempts from localStorage:", e);
      }
    };
    loadSavedQuizState();
    window.addEventListener('practca_ca_level_changed', loadSavedQuizState);
    return () => {
      window.removeEventListener('practca_ca_level_changed', loadSavedQuizState);
    };
  }, [subjectId]);

  // Load and sync detailed PracticeAttempts from localStorage
  useEffect(() => {
    const loadAttempts = () => {
      try {
        const level = getSelectedCALevel();
        const raw = localStorage.getItem(getLevelScopedKey('practca_practice_attempts', level));
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setPracticeAttemptsHistory(parsed);
            return;
          }
        }
        setPracticeAttemptsHistory([]);
      } catch (e) {
        console.warn("Failed to read practice attempts:", e);
      }
    };
    loadAttempts();
    window.addEventListener('practca_practice_attempts_updated', loadAttempts);
    window.addEventListener('practca_ca_level_changed', loadAttempts);
    window.addEventListener('storage', loadAttempts);
    return () => {
      window.removeEventListener('practca_practice_attempts_updated', loadAttempts);
      window.removeEventListener('practca_ca_level_changed', loadAttempts);
      window.removeEventListener('storage', loadAttempts);
    };
  }, []);

  const recordPracticeAttemptAndSync = (attempt: PracticeAttempt) => {
    onRecordPractice(attempt);
    setPracticeAttemptsHistory(prev => [...prev, attempt]);
  };

  // Save General MCQ answers to localStorage helper
  const saveGeneralAnswers = (newMap: Record<string, number>) => {
    setGeneralAnswers(newMap);
    try {
      const level = getSelectedCALevel();
      localStorage.setItem(getLevelScopedKey('ca_final_general_mcq_attempts_v1', level), JSON.stringify(newMap));
    } catch (e) {
      console.warn("Failed to write general MCQ attempts to localStorage:", e);
    }
  };

  // Save Case Study progress to localStorage helper
  const saveCaseProgress = (newMap: Record<string, CaseStudyProgressState>) => {
    setCaseProgressMap(newMap);
    try {
      const level = getSelectedCALevel();
      localStorage.setItem(getLevelScopedKey('ca_final_case_study_attempts_v2', level), JSON.stringify(newMap));
    } catch (e) {
      console.warn("Failed to write case study attempts to localStorage:", e);
    }
  };

  const rawItems = useMemo(() => QUIZ_QUESTIONS[subjectId] || [], [subjectId]);

  // Extract raw case scenarios
  const allCaseScenarios = useMemo(() => {
    const list: CaseScenario[] = [];
    rawItems.forEach(item => {
      if (item.type === 'case') {
        list.push(item.data as CaseScenario);
      }
    });
    return list;
  }, [rawItems]);

  // Total Case Scenario Sub-Questions count
  const totalCaseSubMcqs = useMemo(() => {
    return allCaseScenarios.reduce((sum, cs) => sum + cs.subQuestions.length, 0);
  }, [allCaseScenarios]);

  // Subject-specific Practice Mode Attempt Analytics (Subject, Chapter, Correct/Incorrect, Timestamp)
  const subjectPracticeStats = useMemo(() => {
    const subjectAttempts = practiceAttemptsHistory.filter(a => a.subjectId === subjectId);
    const total = subjectAttempts.length;
    const correct = subjectAttempts.filter(a => a.isCorrect).length;
    const incorrect = total - correct;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    const chapterMap = new Map<string, { chapterName: string; total: number; correct: number; incorrect: number; lastTimestamp: string }>();
    subjectAttempts.forEach(att => {
      const ch = att.chapterName || 'General';
      const existing = chapterMap.get(ch) || { chapterName: ch, total: 0, correct: 0, incorrect: 0, lastTimestamp: att.timestamp };
      existing.total += 1;
      if (att.isCorrect) existing.correct += 1;
      else existing.incorrect += 1;
      if (new Date(att.timestamp).getTime() > new Date(existing.lastTimestamp).getTime()) {
        existing.lastTimestamp = att.timestamp;
      }
      chapterMap.set(ch, existing);
    });

    const chapterBreakdown = Array.from(chapterMap.values())
      .map(c => ({
        ...c,
        accuracy: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0
      }))
      .sort((a, b) => b.total - a.total);

    const recentAttempts = [...subjectAttempts].reverse().slice(0, 15);

    return {
      total,
      correct,
      incorrect,
      accuracy,
      chapterBreakdown,
      recentAttempts
    };
  }, [practiceAttemptsHistory, subjectId]);

  // Available chapters list for filtering
  const allChapters = useMemo(() => {
    const set = new Set<string>();
    rawItems.forEach(item => {
      if (item.type === 'general') {
        if (item.data.chapterName) set.add(item.data.chapterName);
      } else {
        if (item.data.chapterName) set.add(item.data.chapterName);
        item.data.subQuestions.forEach(sq => {
          if (sq.chapterName) set.add(sq.chapterName);
        });
      }
    });
    return Array.from(set).sort();
  }, [rawItems]);

  // Count of total MCQs against each chapter
  const chapterMcqCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    rawItems.forEach(item => {
      if (item.type === 'general') {
        const ch = item.data.chapterName || 'General';
        counts[ch] = (counts[ch] || 0) + 1;
      } else {
        const parentCh = item.data.chapterName || 'General';
        item.data.subQuestions.forEach(sq => {
          const ch = sq.chapterName || parentCh;
          counts[ch] = (counts[ch] || 0) + 1;
        });
      }
    });
    return counts;
  }, [rawItems]);

  // Total count of MCQs
  const totalAllMcqs = useMemo(() => {
    let total = 0;
    rawItems.forEach(item => {
      if (item.type === 'general') {
        total += 1;
      } else {
        total += item.data.subQuestions.length;
      }
    });
    return total;
  }, [rawItems]);

  // Group Case Scenarios into Chapter Blocks
  const chapterBlocks = useMemo(() => {
    const chapterMap = new Map<string, CaseScenario[]>();

    allCaseScenarios.forEach(cs => {
      const chName = cs.chapterName || 'Comprehensive Case Scenarios';
      if (!chapterMap.has(chName)) {
        chapterMap.set(chName, []);
      }
      chapterMap.get(chName)!.push(cs);
    });

    const result: { chapterName: string; scenarios: CaseScenario[] }[] = [];

    chapterMap.forEach((scenarios, chName) => {
      if (selectedChapter !== 'All' && chName !== selectedChapter) {
        return;
      }

      const matchedScenarios = scenarios.filter(cs => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          cs.scenarioTitle.toLowerCase().includes(q) ||
          cs.scenarioText.toLowerCase().includes(q) ||
          cs.id.toLowerCase().includes(q) ||
          cs.subQuestions.some(sq => sq.questionText.toLowerCase().includes(q))
        );
      });

      if (matchedScenarios.length > 0) {
        result.push({
          chapterName: chName,
          scenarios: matchedScenarios
        });
      }
    });

    return result;
  }, [allCaseScenarios, selectedChapter, searchTerm]);

  // Filtered General Questions
  const filteredGeneralQuestions = useMemo(() => {
    const list: GeneralQuestion[] = [];
    rawItems.forEach(item => {
      if (item.type === 'general') {
        if (selectedChapter === 'All' || item.data.chapterName === selectedChapter) {
          if (!searchTerm.trim()) {
            list.push(item.data);
          } else {
            const q = searchTerm.toLowerCase();
            if (
              item.data.questionText.toLowerCase().includes(q) ||
              item.data.chapterName.toLowerCase().includes(q)
            ) {
              list.push(item.data);
            }
          }
        }
      }
    });
    return list;
  }, [rawItems, selectedChapter, searchTerm]);

  // Active Case Scenario object
  const activeCaseScenario = useMemo(() => {
    if (!activeCaseId) return null;
    return allCaseScenarios.find(cs => cs.id === activeCaseId) || null;
  }, [allCaseScenarios, activeCaseId]);

  // Active attempt state for current Case Study
  const activeCaseProgressState = useMemo(() => {
    if (!activeCaseScenario) return null;
    
    const existing = caseProgressMap[activeCaseScenario.id];
    if (existing && existing.questionOrder && existing.questionOrder.length > 0) {
      return existing;
    }

    const subQIds: string[] = activeCaseScenario.subQuestions.map(sq => sq.id);
    const shuffledQIds: string[] = shuffleArray<string>(subQIds);
    const optionOrders: Record<string, number[]> = {};
    activeCaseScenario.subQuestions.forEach(sq => {
      optionOrders[sq.id] = shuffleArray<number>([0, 1, 2, 3]);
    });

    const newState: CaseStudyProgressState = {
      answers: {},
      lastStoppedQIndex: 0,
      attemptCount: 1,
      lastAttemptTimestamp: Date.now(),
      questionOrder: shuffledQIds,
      optionOrders,
      markedForReview: []
    };

    return newState;
  }, [activeCaseScenario, caseProgressMap]);

  // Sub-questions in shuffled order
  const activeOrderedSubQuestions = useMemo(() => {
    if (!activeCaseScenario || !activeCaseProgressState) return [];
    const qMap = new Map(activeCaseScenario.subQuestions.map(sq => [sq.id, sq]));
    return activeCaseProgressState.questionOrder
      .map(id => qMap.get(id))
      .filter(Boolean) as CaseSubQuestion[];
  }, [activeCaseScenario, activeCaseProgressState]);

  // Ensure initial state exists in localStorage
  useEffect(() => {
    if (activeCaseScenario && activeCaseProgressState && !caseProgressMap[activeCaseScenario.id]) {
      const updated = {
        ...caseProgressMap,
        [activeCaseScenario.id]: activeCaseProgressState
      };
      saveCaseProgress(updated);
    }
  }, [activeCaseScenario, activeCaseProgressState, caseProgressMap]);

  // Init Practice Mode
  const initPracticeMode = (type: 'case' | 'general' = 'case') => {
    setPracticeType(type);
    setSelectedChapter('All');
    setSearchTerm('');
    setActiveCaseId(null);
    setCurrentSubQIndex(0);
    setCurrentGeneralIndex(0);
    setSelectedGeneralOption(null);
    setGeneralAiExplanation(null);
    setGeneralMarkedReview(new Set());
    setQuizMode('practice');
  };

  // Flattened questions for Test Mode
  const testFlatQuestions = useMemo(() => {
    const flat: {
      globalIndex: number;
      itemIndex: number;
      subIndex: number;
      questionId: string;
      chapterName: string;
      isCase: boolean;
      caseScenario?: CaseScenario;
      question: GeneralQuestion | CaseSubQuestion;
    }[] = [];

    let count = 0;
    testQuestions.forEach((item, itemIdx) => {
      if (item.type === 'general') {
        flat.push({
          globalIndex: count++,
          itemIndex: itemIdx,
          subIndex: 0,
          questionId: item.data.id,
          chapterName: item.data.chapterName,
          isCase: false,
          question: item.data
        });
      } else {
        item.data.subQuestions.forEach((sq, sIdx) => {
          flat.push({
            globalIndex: count++,
            itemIndex: itemIdx,
            subIndex: sIdx,
            questionId: sq.id,
            chapterName: sq.chapterName || item.data.chapterName,
            isCase: true,
            caseScenario: item.data,
            question: sq
          });
        });
      }
    });

    return flat;
  }, [testQuestions]);

  // Scenario groups in Test Mode for the Multi-Concept Case Scenario Switcher
  const testScenarioGroups = useMemo(() => {
    const groups: {
      itemIndex: number;
      scenario: CaseScenario;
      startGlobalIndex: number;
      endGlobalIndex: number;
      concepts: string[];
      questionIds: string[];
    }[] = [];

    let cursor = 0;
    testQuestions.forEach((item, idx) => {
      if (item.type === 'case') {
        const qCount = item.data.subQuestions.length;
        const conceptsSet = new Set<string>();
        if (item.data.chapterName) conceptsSet.add(item.data.chapterName);
        item.data.subQuestions.forEach(sq => {
          if (sq.chapterName) conceptsSet.add(sq.chapterName);
        });
        groups.push({
          itemIndex: idx,
          scenario: item.data,
          startGlobalIndex: cursor,
          endGlobalIndex: cursor + qCount - 1,
          concepts: Array.from(conceptsSet),
          questionIds: item.data.subQuestions.map(sq => sq.id)
        });
        cursor += qCount;
      } else {
        cursor += 1;
      }
    });

    return groups;
  }, [testQuestions]);

  // Active question in Test Mode
  const currentTestFlatQuestion = useMemo(() => {
    if (testFlatQuestions.length === 0) return null;
    return testFlatQuestions[currentTestItemIndex] || testFlatQuestions[0];
  }, [testFlatQuestions, currentTestItemIndex]);

  // Mark current test question as visited
  useEffect(() => {
    if (quizMode === 'test' && currentTestFlatQuestion) {
      setTestVisitedQuestions(prev => {
        const next = new Set(prev);
        next.add(currentTestFlatQuestion.questionId);
        return next;
      });
    }
  }, [quizMode, currentTestFlatQuestion]);

  // Init Test Mode — prioritizes exam-standard multi-concept Case Study Scenarios (3–5 interconnected questions each)
  const initTestMode = (targetScenarioId?: string) => {
    const caseItems = rawItems.filter(
      item => item.type === 'case' && item.data.subQuestions.length >= 3
    );

    let selectedItems: QuizQuestionItem[] = [];

    if (caseItems.length > 0) {
      if (targetScenarioId) {
        const targetItem = caseItems.find(item => item.type === 'case' && item.data.id === targetScenarioId);
        const remaining = shuffleArray(caseItems.filter(item => !(item.type === 'case' && item.data.id === targetScenarioId)));
        selectedItems = targetItem
          ? [targetItem, ...remaining.slice(0, Math.min(2, remaining.length))]
          : shuffleArray([...caseItems]).slice(0, Math.min(3, caseItems.length));
      } else {
        // Select up to 3 realistic multi-concept Case Study Scenarios (12–15 interconnected questions total)
        selectedItems = shuffleArray([...caseItems]).slice(0, Math.min(3, caseItems.length));
      }
    } else {
      selectedItems = shuffleArray([...rawItems]).slice(0, 5);
    }

    setTestQuestions(selectedItems);
    setCurrentTestItemIndex(0);
    setTestAnswers({});
    setTestMarkedReview(new Set());
    setTestVisitedQuestions(new Set());
    setTestSubmitted(false);
    setTestEvaluatedList([]);
    const duration = 30 * 60; // 30 minutes exam-standard case study timer
    setTestTimeLeft(duration);
    setTestTotalDuration(duration);
    setTestRunning(true);
    setQuizMode('test');
  };

  // Test Mode Timer
  useEffect(() => {
    if (testRunning && testTimeLeft > 0 && !testSubmitted) {
      timerRef.current = setInterval(() => {
        setTestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTestSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testRunning, testTimeLeft, testSubmitted]);

  // Test submission handler
  const handleTestSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestRunning(false);
    setTestSubmitted(true);

    const evaluated: EvaluatedQuestion[] = testFlatQuestions.map(item => {
      const userAns = testAnswers[item.questionId];
      const isCorrect = userAns !== undefined && userAns === item.question.correctOptionIndex;
      const isSkipped = userAns === undefined;

      const attempt: PracticeAttempt = {
        questionId: item.questionId,
        subjectId,
        chapterName: item.chapterName,
        isCorrect: !!isCorrect,
        timestamp: new Date().toISOString()
      };
      recordPracticeAttemptAndSync(attempt);

      return {
        id: item.questionId,
        globalIndex: item.globalIndex,
        chapterName: item.chapterName,
        questionText: item.question.questionText,
        options: item.question.options,
        userAnswer: userAns,
        correctAnswer: item.question.correctOptionIndex,
        explanation: item.question.explanation,
        isCorrect: !!isCorrect,
        isSkipped,
        marks: isCorrect ? 2 : 0
      };
    });

    setTestEvaluatedList(evaluated);
  };

  // General MCQ Option Selection (Practice Mode)
  const handleGeneralSelect = async (optionIndex: number) => {
    if (filteredGeneralQuestions.length === 0) return;
    const question = filteredGeneralQuestions[currentGeneralIndex];
    if (!question) return;
    
    setSelectedGeneralOption(optionIndex);
    const updatedGeneralMap = { ...generalAnswers, [question.id]: optionIndex };
    saveGeneralAnswers(updatedGeneralMap);

    const isCorrect = optionIndex === question.correctOptionIndex;
    const attempt: PracticeAttempt = {
      questionId: question.id,
      subjectId: question.subjectId || subjectId,
      chapterName: question.chapterName || 'General',
      isCorrect,
      timestamp: new Date().toISOString()
    };
    recordPracticeAttemptAndSync(attempt);

    // AI Explanation Request
    setLoadingGeneralAi(true);
    setGeneralAiExplanation(null);
    try {
      const response = await fetch('/api/quiz/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.questionText,
          options: question.options,
          selectedOption: question.options[optionIndex],
          correctOption: question.options[question.correctOptionIndex],
          standardExplanation: question.explanation
        })
      });
      if (response.ok) {
        const data = await response.json();
        setGeneralAiExplanation(data.aiReinforcement);
      } else {
        setGeneralAiExplanation("Statutory Note: Verify specific thresholds and legal exceptions under the relevant statutory provisions.");
      }
    } catch (e) {
      setGeneralAiExplanation("Statutory Note: Verify specific thresholds and legal exceptions under the relevant statutory provisions.");
    } finally {
      setLoadingGeneralAi(false);
    }
  };

  // Reset single General MCQ in Practice Mode so student can re-attempt and log a new PracticeAttempt
  const handleReattemptGeneralQuestion = (questionId: string) => {
    const updated = { ...generalAnswers };
    delete updated[questionId];
    saveGeneralAnswers(updated);
    setSelectedGeneralOption(null);
    setGeneralAiExplanation(null);
  };

  // Case Sub-Question Selection (Practice Mode)
  const handleCaseSubQuestionSelect = async (
    subQ: CaseSubQuestion, 
    shuffledOptionIndex: number,
    shuffledCorrectIndex: number,
    shuffledOptionsList: string[]
  ) => {
    if (!activeCaseScenario || !activeCaseProgressState) return;

    const currentAnswers = activeCaseProgressState.answers;
    if (currentAnswers[subQ.id] !== undefined) return; // Locked

    const updatedAnswers = {
      ...currentAnswers,
      [subQ.id]: shuffledOptionIndex
    };

    const updatedState: CaseStudyProgressState = {
      ...activeCaseProgressState,
      answers: updatedAnswers,
      lastStoppedQIndex: currentSubQIndex,
      lastAttemptTimestamp: Date.now()
    };

    saveCaseProgress({
      ...caseProgressMap,
      [activeCaseScenario.id]: updatedState
    });

    const isCorrect = shuffledOptionIndex === shuffledCorrectIndex;
    const attempt: PracticeAttempt = {
      questionId: subQ.id,
      subjectId: subQ.subjectId || subjectId,
      chapterName: subQ.chapterName || activeCaseScenario.chapterName || 'Comprehensive Case Scenarios',
      isCorrect,
      timestamp: new Date().toISOString()
    };
    recordPracticeAttemptAndSync(attempt);

    // Request AI Explanation
    setLoadingCaseAi(prev => ({ ...prev, [subQ.id]: true }));
    try {
      const response = await fetch('/api/quiz/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: subQ.questionText,
          options: shuffledOptionsList,
          selectedOption: shuffledOptionsList[shuffledOptionIndex],
          correctOption: shuffledOptionsList[shuffledCorrectIndex],
          standardExplanation: subQ.explanation
        })
      });
      if (response.ok) {
        const data = await response.json();
        setCaseAiExplanations(prev => ({ ...prev, [subQ.id]: data.aiReinforcement }));
      } else {
        setCaseAiExplanations(prev => ({ ...prev, [subQ.id]: "ICAI Statutory Compliance Check: Refer to specific statutory subsections and notifications." }));
      }
    } catch (e) {
      setCaseAiExplanations(prev => ({ ...prev, [subQ.id]: "ICAI Statutory Compliance Check: Refer to specific statutory subsections and notifications." }));
    } finally {
      setLoadingCaseAi(prev => ({ ...prev, [subQ.id]: false }));
    }
  };

  // Case Try Again handler (Practice Mode)
  const handleTryAgain = (cs: CaseScenario, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = caseProgressMap[cs.id];
    const attemptCount = (existing?.attemptCount || 1) + 1;

    const subQIds: string[] = cs.subQuestions.map(sq => sq.id);
    const shuffledQIds = shuffleArray<string>(subQIds);
    const optionOrders: Record<string, number[]> = {};
    cs.subQuestions.forEach(sq => {
      optionOrders[sq.id] = shuffleArray<number>([0, 1, 2, 3]);
    });

    const freshState: CaseStudyProgressState = {
      answers: {},
      lastStoppedQIndex: 0,
      attemptCount,
      lastAttemptTimestamp: Date.now(),
      questionOrder: shuffledQIds,
      optionOrders,
      markedForReview: []
    };

    saveCaseProgress({
      ...caseProgressMap,
      [cs.id]: freshState
    });

    setActiveCaseId(cs.id);
    setCurrentSubQIndex(0);
  };

  // Reset Case Study attempt
  const handleResetCase = (csId: string) => {
    const updated = { ...caseProgressMap };
    delete updated[csId];
    saveCaseProgress(updated);
    setActiveCaseId(null);
    setCurrentSubQIndex(0);
  };

  // Generate Palette items for active Case Scenario in Practice Mode
  const casePaletteItems: PaletteItem[] = useMemo(() => {
    if (!activeCaseScenario || !activeCaseProgressState) return [];
    return activeOrderedSubQuestions.map((sq, idx) => {
      const isAnswered = activeCaseProgressState.answers[sq.id] !== undefined;
      const isMarked = activeCaseProgressState.markedForReview?.includes(sq.id);

      let status: QuestionExamStatus = 'not_visited';
      if (isAnswered && isMarked) status = 'answered_and_marked';
      else if (isAnswered) status = 'answered';
      else if (isMarked) status = 'marked_for_review';
      else if (idx <= (activeCaseProgressState.lastStoppedQIndex || 0)) status = 'not_answered';

      return {
        id: `${sq.id || 'cs_subq'}_${idx}`,
        globalIndex: idx,
        displayLabel: `${idx + 1}`,
        status,
        groupTitle: activeCaseScenario.scenarioTitle
      };
    });
  }, [activeCaseScenario, activeCaseProgressState, activeOrderedSubQuestions]);

  // Generate Palette items for Test Mode
  const testPaletteItems: PaletteItem[] = useMemo(() => {
    if (testFlatQuestions.length === 0) return [];
    return testFlatQuestions.map((q, idx) => {
      const isVisited = testVisitedQuestions.has(q.questionId);
      const isAnswered = testAnswers[q.questionId] !== undefined;
      const isMarked = testMarkedReview.has(q.questionId);

      let status: QuestionExamStatus = 'not_visited';
      if (isAnswered && isMarked) status = 'answered_and_marked';
      else if (isAnswered) status = 'answered';
      else if (isMarked) status = 'marked_for_review';
      else if (isVisited) status = 'not_answered';

      return {
        id: `${q.questionId || 'test_q'}_${idx}`,
        globalIndex: idx,
        displayLabel: `${idx + 1}`,
        status,
        groupTitle: q.caseScenario ? `${q.caseScenario.id}: ${q.caseScenario.scenarioTitle}` : q.chapterName
      };
    });
  }, [testFlatQuestions, testVisitedQuestions, testAnswers, testMarkedReview]);

  // Toggle mark for review in active Case Practice
  const toggleCaseMarkForReview = (subQId: string) => {
    if (!activeCaseScenario || !activeCaseProgressState) return;
    const currentMarked = activeCaseProgressState.markedForReview || [];
    const isMarked = currentMarked.includes(subQId);
    const updatedMarked = isMarked 
      ? currentMarked.filter(id => id !== subQId)
      : [...currentMarked, subQId];

    const updatedState: CaseStudyProgressState = {
      ...activeCaseProgressState,
      markedForReview: updatedMarked
    };

    saveCaseProgress({
      ...caseProgressMap,
      [activeCaseScenario.id]: updatedState
    });
  };

  return (
    <div className="practice-arena-quiz space-y-6 animate-fadeIn pb-16">
      
      {/* 1. LOBBY VIEW */}
      {quizMode === 'lobby' && (
        <div id="quiz-lobby" className="space-y-6 animate-fadeIn">
          
          {/* Practice Hub Welcome Banner */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 h-48 w-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-extrabold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    {subjectId} MCQ Engine
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {allCaseScenarios.length} Multi-Concept Case Scenarios • {totalAllMcqs} Total ICAI MCQs
                  </span>
                </div>

                <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                  ICAI Examination & Practice Arena
                </h2>
              </div>

              {/* Live Practice Mode Telemetry Summary Pill */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0 flex items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    {subjectId} Practice Accuracy
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xl font-mono font-black text-cyan-400">
                      {subjectPracticeStats.accuracy}%
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      ({subjectPracticeStats.correct}/{subjectPracticeStats.total} Correct)
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowPracticeTelemetry(prev => !prev)}
                  className="px-3 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-cyan-400 transition cursor-pointer"
                >
                  {showPracticeTelemetry ? 'Hide Telemetry' : 'Attempt Log'}
                </button>
              </div>
            </div>
          </div>

          {/* Collapsible Practice Attempt Telemetry Panel in Lobby */}
          {showPracticeTelemetry && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    {subjectName} — Practice Mode Question Tracking & Chapter Telemetry
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  {subjectPracticeStats.total} Logged Attempts
                </span>
              </div>

              {subjectPracticeStats.total === 0 ? (
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs font-mono text-slate-400">
                  No Practice Mode attempts recorded for {subjectName} yet. Attempt any Case Scenario or Standalone MCQ to populate live chapter telemetry.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Chapter-wise Practice Breakdown */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                      Chapter-Wise Accuracy Breakdown
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-800">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead>
                          <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <th className="py-2 px-3">Chapter</th>
                            <th className="py-2 px-2 text-center">Tries</th>
                            <th className="py-2 px-2 text-center text-emerald-400">Correct</th>
                            <th className="py-2 px-2 text-center text-rose-400">Wrong</th>
                            <th className="py-2 px-3 text-right">Accuracy</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70 bg-slate-950">
                          {subjectPracticeStats.chapterBreakdown.map((ch, idx) => (
                            <tr key={`lobby-ch-stat-${idx}`} className="hover:bg-slate-900/40">
                              <td className="py-2 px-3 text-slate-200 font-sans font-medium truncate max-w-[180px]" title={ch.chapterName}>
                                {ch.chapterName}
                              </td>
                              <td className="py-2 px-2 text-center text-slate-300">{ch.total}</td>
                              <td className="py-2 px-2 text-center text-emerald-400 font-bold">{ch.correct}</td>
                              <td className="py-2 px-2 text-center text-rose-400 font-bold">{ch.incorrect}</td>
                              <td className="py-2 px-3 text-right font-bold text-cyan-400">{ch.accuracy}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent Chronological Question Attempts */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
                      Recent Question Attempts (With Timestamp)
                    </h4>
                    <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[240px] overflow-y-auto no-scrollbar">
                      <table className="w-full text-left border-collapse text-xs font-mono">
                        <thead className="sticky top-0 bg-slate-900 text-slate-400 border-b border-slate-800">
                          <tr>
                            <th className="py-2 px-3">Question ID</th>
                            <th className="py-2 px-3">Chapter</th>
                            <th className="py-2 px-2 text-center">Status</th>
                            <th className="py-2 px-3 text-right">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/70 bg-slate-950">
                          {subjectPracticeStats.recentAttempts.map((att, idx) => (
                            <tr key={`lobby-att-${att.questionId}-${idx}`} className="hover:bg-slate-900/40">
                              <td className="py-2 px-3 text-cyan-400 font-bold">{att.questionId}</td>
                              <td className="py-2 px-3 text-slate-300 font-sans truncate max-w-[150px]" title={att.chapterName}>
                                {att.chapterName}
                              </td>
                              <td className="py-2 px-2 text-center">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  att.isCorrect
                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                                }`}>
                                  {att.isCorrect ? 'Correct' : 'Incorrect'}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-right text-slate-400 text-[10px]">
                                {new Date(att.timestamp).toLocaleString([], {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mode 1: Case Studies (Split Screen Practice Mode) */}
            <div 
              onClick={() => initPracticeMode('case')}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-6 shadow-md hover:shadow-cyan-500/5 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                    Practice Mode • Live Tracking
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  Chapter Case Scenarios (Split-Screen)
                </h3>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  {allCaseScenarios.length} Scenarios • {totalCaseSubMcqs} Interconnected MCQs
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Case Workspace <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>

            {/* Mode 2: Full ICAI Timed Test Simulation (Multi-Concept Case Study Scenarios) */}
            <div 
              onClick={() => initTestMode()}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-6 shadow-md hover:shadow-emerald-500/5 relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    Timed 30 Mins • 3 Case Scenarios
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                  ICAI Case Study Test Mode Simulation
                </h3>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">
                  3 Multi-Concept Scenarios • 12–15 Interconnected Questions
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Start Case Exam <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>

          {/* Exam-Standard Multi-Concept Case Scenarios Direct Test Launcher */}
          {allCaseScenarios.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-display font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Exam-Standard Multi-Concept Case Scenarios ({subjectId})
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  2 Marks / Interconnected MCQ
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {allCaseScenarios.slice(0, 6).map((cs) => {
                  const distinctConcepts = Array.from(
                    new Set([cs.chapterName, ...cs.subQuestions.map(sq => sq.chapterName)].filter(Boolean))
                  );
                  return (
                    <div
                      key={`lobby-test-cs-${cs.id}`}
                      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {cs.id} • {cs.subQuestions.length} Interconnected Qs
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {cs.subQuestions.length * 2} Marks
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-2">
                          {cs.scenarioTitle}
                        </h4>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {distinctConcepts.slice(0, 3).map((concept, cIdx) => (
                            <span
                              key={`concept-tag-${cs.id}-${cIdx}`}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 truncate max-w-[160px]"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            initPracticeMode('case');
                            setActiveCaseId(cs.id);
                            setCurrentSubQIndex(0);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono font-bold text-cyan-400 transition cursor-pointer"
                        >
                          Practice Case
                        </button>
                        <button
                          onClick={() => initTestMode(cs.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-300 transition cursor-pointer flex items-center gap-1"
                        >
                          Test Mode <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Standalone MCQ Shortcut */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Standalone MCQs Quick Drills</h4>
              </div>
            </div>

            <button
              onClick={() => initPracticeMode('general')}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono font-bold text-slate-300 hover:text-white transition cursor-pointer shrink-0"
            >
              Open Standalone Drills ({rawItems.filter(i => i.type === 'general').length} Questions)
            </button>
          </div>
        </div>
      )}

      {/* 2. PRACTICE MODE */}
      {quizMode === 'practice' && (
        <div id="practice-arena-console" className="space-y-5 animate-fadeIn">
          
          {/* Top Control Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
            {/* Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shrink-0">
              <button
                onClick={() => {
                  setPracticeType('case');
                  setActiveCaseId(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  practiceType === 'case'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Case Scenarios ({allCaseScenarios.length})
              </button>

              <button
                onClick={() => setPracticeType('general')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  practiceType === 'general'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Standalone MCQs
              </button>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter by chapter or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <select
                value={selectedChapter}
                onChange={(e) => {
                  setSelectedChapter(e.target.value);
                  setCurrentGeneralIndex(0);
                  setSelectedGeneralOption(null);
                  setGeneralAiExplanation(null);
                }}
                className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-pointer font-mono"
              >
                <option value="All">All Chapters</option>
                {allChapters.map((ch, idx) => (
                  <option key={`ch-sel-${ch}-${idx}`} value={ch}>{ch} ({chapterMcqCounts[ch] || 0})</option>
                ))}
              </select>
            </div>

            {/* Telemetry Toggle & Exit Practice Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setShowPracticeTelemetry(prev => !prev)}
                className={`px-3 py-2 rounded-xl border text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  showPracticeTelemetry
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telemetry ({subjectPracticeStats.total})</span>
              </button>

              <button
                onClick={() => {
                  setActiveCaseId(null);
                  setQuizMode('lobby');
                }}
                className="px-3.5 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl text-xs font-mono font-bold transition cursor-pointer shrink-0"
              >
                Exit Arena
              </button>
            </div>
          </div>

          {/* Live Practice Mode Telemetry Drawer inside Practice Mode */}
          {showPracticeTelemetry && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-display font-bold uppercase text-white">
                    Live Practice Attempt Log — {subjectName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">Attempted: <strong className="text-white">{subjectPracticeStats.total}</strong></span>
                  <span className="text-emerald-400">Correct: <strong>{subjectPracticeStats.correct}</strong></span>
                  <span className="text-rose-400">Incorrect: <strong>{subjectPracticeStats.incorrect}</strong></span>
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                    Accuracy: {subjectPracticeStats.accuracy}%
                  </span>
                </div>
              </div>

              {subjectPracticeStats.recentAttempts.length === 0 ? (
                <p className="text-xs font-mono text-slate-400 text-center py-3">
                  No questions attempted in Practice Mode yet. Select an option on any question below to log your attempt.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[200px] overflow-y-auto no-scrollbar">
                  <table className="w-full text-left border-collapse text-xs font-mono">
                    <thead className="sticky top-0 bg-slate-900 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">Question ID</th>
                        <th className="py-2 px-3">Subject</th>
                        <th className="py-2 px-3">Chapter</th>
                        <th className="py-2 px-2 text-center">Outcome</th>
                        <th className="py-2 px-3 text-right">Attempt Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 bg-slate-950">
                      {subjectPracticeStats.recentAttempts.map((att, idx) => (
                        <tr key={`prac-live-att-${att.questionId}-${idx}`} className="hover:bg-slate-900/40">
                          <td className="py-1.5 px-3 text-cyan-400 font-bold">{att.questionId}</td>
                          <td className="py-1.5 px-3 text-slate-300">{att.subjectId}</td>
                          <td className="py-1.5 px-3 text-slate-200 font-sans truncate max-w-[200px]">{att.chapterName}</td>
                          <td className="py-1.5 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              att.isCorrect
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            }`}>
                              {att.isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          </td>
                          <td className="py-1.5 px-3 text-right text-slate-400 text-[10px]">
                            {new Date(att.timestamp).toLocaleString([], {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* PRACTICE TYPE A: CHAPTER CASE STUDIES */}
          {practiceType === 'case' && (
            <div>
              {/* CASE WORKSPACE (When a case is open) */}
              {activeCaseScenario && activeCaseProgressState ? (
                <div className="space-y-4">
                  {/* Active Case Top Navigation Banner - Spacious, Clear Alignment */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 w-full">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveCaseId(null)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
                        Back to List
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase">
                          {activeCaseScenario.chapterName}
                        </span>
                        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                          Attempt #{activeCaseProgressState.attemptCount}
                        </span>
                      </div>
                    </div>

                    {/* Integrated Quick Sub-Question Jumper & Palette Drawer Trigger */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Sub-Question status pills right in header */}
                      <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                        {activeOrderedSubQuestions.map((sq, idx) => {
                          const isAnswered = activeCaseProgressState.answers[sq.id] !== undefined;
                          const isMarked = activeCaseProgressState.markedForReview?.includes(sq.id);
                          const isActive = idx === currentSubQIndex;

                          let btnStyle = 'text-slate-400 hover:text-white bg-slate-950 border-slate-800';
                          if (isAnswered && isMarked) {
                            btnStyle = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-bold';
                          } else if (isAnswered) {
                            btnStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
                          } else if (isMarked) {
                            btnStyle = 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';
                          }
                          if (isActive) {
                            btnStyle += ' ring-2 ring-cyan-400 ring-offset-1 ring-offset-slate-950';
                          }

                          return (
                            <button
                              key={`head-subq-${sq.id || 'sq'}-${idx}`}
                              onClick={() => setCurrentSubQIndex(idx)}
                              className={`h-7 w-7 rounded-lg border text-[11px] font-mono flex items-center justify-center transition cursor-pointer ${btnStyle}`}
                              title={`Jump to Q${idx + 1}`}
                            >
                              {idx + 1}
                            </button>
                          );
                        })}
                      </div>

                      {/* Retake Case Scenario in Practice Mode */}
                      {Object.keys(activeCaseProgressState.answers).length > 0 && (
                        <button
                          onClick={(e) => handleTryAgain(activeCaseScenario, e)}
                          className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5 transition cursor-pointer"
                          title="Reset and re-attempt this Case Scenario"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-attempt Case</span>
                        </button>
                      )}

                      {/* Full ICAI Palette Drawer Toggle Button */}
                      <button
                        onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          mobilePaletteOpen
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>ICAI Palette</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-cyan-400 border border-slate-800 font-mono">
                          {Object.keys(activeCaseProgressState.answers).length}/{activeCaseScenario.subQuestions.length}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Split Screen Workspace - Takes 100% Full Optimal Width! */}
                  <div className="w-full">
                    {(() => {
                      const subQ = activeOrderedSubQuestions[currentSubQIndex];
                      if (!subQ) return null;

                      const optOrder = activeCaseProgressState.optionOrders[subQ.id] || [0, 1, 2, 3];
                      const shuffledOptionsList = optOrder.map(idx => subQ.options[idx]);
                      const shuffledCorrectIndex = optOrder.indexOf(subQ.correctOptionIndex);
                      const selectedShuffledOpt = activeCaseProgressState.answers[subQ.id];
                      const isAnswerLocked = selectedShuffledOpt !== undefined;
                      const isMarked = activeCaseProgressState.markedForReview?.includes(subQ.id) || false;

                      const transformedOrderedList = activeOrderedSubQuestions.map(sq => {
                        const order = activeCaseProgressState.optionOrders[sq.id] || [0, 1, 2, 3];
                        return {
                          ...sq,
                          options: order.map(i => sq.options[i])
                        };
                      });

                      return (
                        <SplitCaseWorkspace
                          scenario={activeCaseScenario}
                          orderedSubQuestions={transformedOrderedList}
                          currentSubIndex={currentSubQIndex}
                          onNavigateSubQuestion={(idx) => setCurrentSubQIndex(idx)}
                          selectedOptionIndex={selectedShuffledOpt}
                          onSelectOption={(shuffledOptIdx) => {
                            handleCaseSubQuestionSelect(
                              subQ, 
                              shuffledOptIdx, 
                              shuffledCorrectIndex, 
                              shuffledOptionsList
                            );
                          }}
                          onClearResponse={() => {
                            if (!isAnswerLocked) {
                              const updatedAns = { ...activeCaseProgressState.answers };
                              delete updatedAns[subQ.id];
                              saveCaseProgress({
                                ...caseProgressMap,
                                [activeCaseScenario.id]: {
                                  ...activeCaseProgressState,
                                  answers: updatedAns
                                }
                              });
                            }
                          }}
                          onMarkForReview={() => toggleCaseMarkForReview(subQ.id)}
                          isMarkedForReview={isMarked}
                          onSaveAndNext={() => {
                            setCurrentSubQIndex(prev => Math.min(activeOrderedSubQuestions.length - 1, prev + 1));
                          }}
                          onCompleteCase={() => {
                            setActiveCaseId(null);
                          }}
                          isPracticeMode={true}
                          isAnswerLocked={isAnswerLocked}
                          correctOptionIndex={isAnswerLocked ? shuffledCorrectIndex : undefined}
                          explanation={subQ.explanation}
                          aiExplanation={caseAiExplanations[subQ.id]}
                          isLoadingAi={loadingCaseAi[subQ.id]}
                          onRequestAiExplanation={() => {
                            handleCaseSubQuestionSelect(
                              subQ,
                              selectedShuffledOpt ?? 0,
                              shuffledCorrectIndex,
                              shuffledOptionsList
                            );
                          }}
                          answeredCount={Object.keys(activeCaseProgressState.answers).length}
                          totalSubQuestions={activeOrderedSubQuestions.length}
                        />
                      );
                    })()}
                  </div>

                  {/* Slide-out ICAI Palette Drawer */}
                  {mobilePaletteOpen && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
                      <div className="w-full max-w-sm sm:max-w-md h-full bg-slate-950 border-l border-slate-800 p-4 overflow-y-auto no-scrollbar shadow-2xl animate-slideLeft">
                        <IcaExamPalette
                          items={casePaletteItems}
                          currentIndex={currentSubQIndex}
                          onSelectIndex={(idx) => {
                            setCurrentSubQIndex(idx);
                            setMobilePaletteOpen(false);
                          }}
                          isTestMode={false}
                          onCloseMobile={() => setMobilePaletteOpen(false)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* CHAPTER BLOCKS LIST VIEW */
                <div className="space-y-6">
                  {chapterBlocks.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950 text-center space-y-3">
                      <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto" />
                      <h4 className="font-display font-bold text-white text-sm">No Case Scenarios found</h4>
                    </div>
                  ) : (
                    chapterBlocks.map((block, blockIdx) => (
                      <div 
                        key={`ch-block-${block.chapterName}-${blockIdx}`}
                        className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-sm space-y-4 p-5"
                      >
                        {/* Chapter Block Header */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs font-mono">
                              {blockIdx + 1}
                            </span>
                            <div>
                              <h3 className="font-display font-bold text-white text-sm">
                                {block.chapterName}
                              </h3>
                              <p className="text-[11px] text-slate-400 font-mono">
                                {block.scenarios.length} Scenarios • {block.scenarios.reduce((acc, cs) => acc + cs.subQuestions.length, 0)} Interconnected MCQs
                              </p>
                            </div>
                          </div>

                          <span className="bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-0.5 rounded text-xs font-mono">
                            Block {blockIdx + 1}
                          </span>
                        </div>

                        {/* Case Scenarios Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                          {block.scenarios.map((cs, csIdx) => {
                            const csState = caseProgressMap[cs.id];
                            const answers = csState?.answers || {};
                            const attemptedCount = Object.keys(answers).length;
                            const totalCount = cs.subQuestions.length;
                            const isCompleted = attemptedCount === totalCount;
                            const lastStoppedQIndex = csState?.lastStoppedQIndex ?? 0;
                            const attemptCount = csState?.attemptCount || 0;
                            const canTryAgain = attemptedCount > 0;

                            return (
                              <div
                                key={`cs-card-${cs.id}-${blockIdx}-${csIdx}`}
                                onClick={() => {
                                  setActiveCaseId(cs.id);
                                  setCurrentSubQIndex(lastStoppedQIndex);
                                }}
                                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group flex flex-col justify-between space-y-4"
                              >
                                <div className="space-y-2.5">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase">
                                          {cs.id}
                                        </span>
                                        {attemptCount > 0 && (
                                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                                            Attempt #{attemptCount}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="font-display font-bold text-white text-sm group-hover:text-cyan-300 transition-colors mt-0.5">
                                        {cs.scenarioTitle}
                                      </h4>
                                    </div>

                                    <CircularProgressRing 
                                      attempted={attemptedCount} 
                                      total={totalCount} 
                                      size={40} 
                                      strokeWidth={3.5} 
                                      showPercentage={false}
                                    />
                                  </div>

                                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                    {cs.scenarioText}
                                  </p>
                                </div>

                                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                                  <span className="text-[11px] font-mono text-slate-400">
                                    {isCompleted ? (
                                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> All {totalCount} Done
                                      </span>
                                    ) : attemptedCount > 0 ? (
                                      <span className="text-amber-400 font-bold">
                                        {attemptedCount}/{totalCount} Completed
                                      </span>
                                    ) : (
                                      <span>{totalCount} Interconnected Qs • {totalCount * 2} Marks</span>
                                    )}
                                  </span>

                                  <div className="flex items-center gap-2">
                                    {canTryAgain && (
                                      <button
                                        onClick={(e) => handleTryAgain(cs, e)}
                                        className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
                                      >
                                        <RefreshCw className="w-3 h-3" /> Retake
                                      </button>
                                    )}
                                    <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                      {attemptedCount > 0 && !isCompleted ? 'Resume' : 'Open Case'} <ChevronRight className="w-3.5 h-3.5" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* PRACTICE TYPE B: STANDALONE GENERAL MCQs */}
          {practiceType === 'general' && (
            <div className="space-y-5">
              {filteredGeneralQuestions.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-800 bg-slate-950 text-center space-y-3">
                  <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto" />
                  <h4 className="font-display font-bold text-white text-sm">No Standalone Questions found</h4>
                </div>
              ) : (
                (() => {
                  const activeGenQ = filteredGeneralQuestions[currentGeneralIndex] || filteredGeneralQuestions[0];
                  const savedChoice = generalAnswers[activeGenQ.id];
                  const effectiveChoice = selectedGeneralOption !== null ? selectedGeneralOption : savedChoice;
                  const isLocked = effectiveChoice !== undefined && effectiveChoice !== null;

                  return (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                      {/* Left / Center: Standalone Question Canvas */}
                      <div className="lg:col-span-9 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-md">
                        {/* Header */}
                        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              {activeGenQ.chapterName}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              ID: {activeGenQ.id}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            {isLocked && (
                              <button
                                onClick={() => handleReattemptGeneralQuestion(activeGenQ.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono font-bold text-cyan-400 flex items-center gap-1 transition cursor-pointer"
                              >
                                <RefreshCw className="w-3 h-3" /> Re-attempt Question
                              </button>
                            )}
                            <span className="text-xs font-mono text-slate-400">
                              Question <strong>{currentGeneralIndex + 1}</strong> of {filteredGeneralQuestions.length}
                            </span>
                          </div>
                        </div>

                        {/* Question Statement */}
                        <div className="text-sm sm:text-base font-semibold text-white leading-relaxed font-sans whitespace-pre-wrap">
                          {activeGenQ.questionText}
                        </div>

                        {/* Options */}
                        <div className="space-y-2.5">
                          {activeGenQ.options.map((opt, oIdx) => {
                            const isSelected = effectiveChoice === oIdx;
                            const isCorrect = oIdx === activeGenQ.correctOptionIndex;

                            let cardStyle = 'border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-200';
                            if (isLocked) {
                              if (isCorrect) {
                                cardStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold';
                              } else if (isSelected) {
                                cardStyle = 'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold';
                              } else {
                                cardStyle = 'border-slate-900 opacity-40 text-slate-500';
                              }
                            } else if (isSelected) {
                              cardStyle = 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400 font-semibold';
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleGeneralSelect(oIdx)}
                                disabled={isLocked}
                                className={`w-full p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 cursor-pointer ${cardStyle}`}
                              >
                                <span className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                                  isSelected 
                                    ? 'bg-cyan-500 text-slate-950 border-cyan-400' 
                                    : 'bg-slate-900 text-slate-400 border-slate-800'
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="leading-snug pt-0.5">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Solution Rationale & AI Auditor */}
                        {isLocked && (
                          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 animate-slideIn">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                <span className="text-xs font-mono font-bold uppercase text-cyan-400">
                                  Statutory Standard & Legal Basis
                                </span>
                              </div>
                              <span className="text-[10px] font-mono text-emerald-400">
                                Logged to Performance Dashboard
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                              {activeGenQ.explanation}
                            </p>

                            <div className="pt-2 border-t border-slate-800/80">
                              <span className="text-[10px] font-mono font-bold text-indigo-400 flex items-center gap-1 mb-1">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> AI Statutory Auditor
                              </span>
                              {loadingGeneralAi ? (
                                <p className="text-[11px] font-mono text-slate-400 animate-pulse">
                                  Analyzing statutory clauses and exceptions...
                                </p>
                              ) : generalAiExplanation ? (
                                <p className="text-[11px] text-slate-200 leading-relaxed italic bg-slate-950 p-2.5 rounded-lg border border-indigo-900/40">
                                  {generalAiExplanation}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {/* Bottom Nav */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <button
                            onClick={() => {
                              setCurrentGeneralIndex(prev => Math.max(0, prev - 1));
                              setSelectedGeneralOption(null);
                              setGeneralAiExplanation(null);
                            }}
                            disabled={currentGeneralIndex === 0}
                            className="px-4 py-2 border border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-300 hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" /> Previous
                          </button>

                          <button
                            onClick={() => {
                              setCurrentGeneralIndex(prev => Math.min(filteredGeneralQuestions.length - 1, prev + 1));
                              setSelectedGeneralOption(null);
                              setGeneralAiExplanation(null);
                            }}
                            disabled={currentGeneralIndex === filteredGeneralQuestions.length - 1}
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-display font-bold uppercase tracking-wider transition flex items-center gap-1 cursor-pointer shadow-md shadow-cyan-500/10"
                          >
                            Next Question <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>

                      {/* Right: Quick Number Grid Palette */}
                      <div className="lg:col-span-3">
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                          <h4 className="font-display font-bold text-xs uppercase text-slate-200">
                            Questions List
                          </h4>
                          <div className="grid grid-cols-5 gap-1.5 max-h-[350px] overflow-y-auto no-scrollbar">
                            {filteredGeneralQuestions.map((q, idx) => {
                              const ans = generalAnswers[q.id];
                              const isAnswered = ans !== undefined;
                              const isCorrect = isAnswered && ans === q.correctOptionIndex;
                              const isCurrent = idx === currentGeneralIndex;

                              let style = 'bg-slate-900 border-slate-800 text-slate-400';
                              if (isAnswered) {
                                style = isCorrect
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40';
                              }
                              if (isCurrent) style += ' ring-2 ring-cyan-400';

                              return (
                                <button
                                  key={`gen-q-${q.id || 'gen'}-${idx}`}
                                  onClick={() => {
                                    setCurrentGeneralIndex(idx);
                                    setSelectedGeneralOption(generalAnswers[q.id] ?? null);
                                    setGeneralAiExplanation(null);
                                  }}
                                  className={`h-8 rounded-lg border text-xs font-mono font-bold flex items-center justify-center cursor-pointer transition-all ${style}`}
                                >
                                  {idx + 1}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. TIMED TEST MODE SIMULATOR (Multi-Concept Case Study Scenarios) */}
      {quizMode === 'test' && (
        <div id="test-console" className="space-y-4 animate-fadeIn">
          {!testSubmitted ? (
            <div className="space-y-4">
              {/* Exam Header Console */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">
                      {subjectName} — Multi-Concept Case Study Examination Console
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">
                      ICAI Integrated Case Study Mode • {testScenarioGroups.length} Case Scenarios • {testFlatQuestions.length} Interconnected Questions ({testFlatQuestions.length * 2} Marks)
                    </p>
                  </div>
                </div>

                {/* Exam Countdown Timer & Header Controls */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                    <Clock className={`w-4 h-4 ${testTimeLeft <= 300 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
                    <div className="text-right">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block leading-none">Time Remaining</span>
                      <span className={`text-base font-mono font-bold ${
                        testTimeLeft <= 300 ? 'text-rose-400 animate-pulse' : 'text-white'
                      }`}>
                        {formatRunningTime(testTimeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Question Palette Trigger Button */}
                  <button
                    onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-mono font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
                    title="Toggle ICAI Question Palette"
                  >
                    <Bookmark className="w-4 h-4" />
                    <span>Question Palette</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-mono">
                      {Object.keys(testAnswers).length}/{testFlatQuestions.length}
                    </span>
                  </button>

                  {/* Final Submit Exam Button */}
                  <button
                    onClick={handleTestSubmit}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-emerald-500/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    Submit Final Exam
                  </button>
                </div>
              </div>

              {/* Multi-Concept Case Scenario Switcher Bar */}
              {testScenarioGroups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {testScenarioGroups.map((grp, grpIdx) => {
                    const isCurrentScenario =
                      currentTestFlatQuestion &&
                      currentTestFlatQuestion.itemIndex === grp.itemIndex;
                    const answeredInGroup = grp.questionIds.filter(qId => testAnswers[qId] !== undefined).length;

                    return (
                      <button
                        key={`test-cs-tab-${grp.scenario.id}-${grpIdx}`}
                        onClick={() => setCurrentTestItemIndex(grp.startGlobalIndex)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                          isCurrentScenario
                            ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-400/40'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                            isCurrentScenario
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-900 text-cyan-400 border border-slate-800'
                          }`}>
                            Case Scenario {grpIdx + 1} • Q{grp.startGlobalIndex + 1}–Q{grp.endGlobalIndex + 1}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {answeredInGroup}/{grp.questionIds.length} Answered
                          </span>
                        </div>

                        <div className="text-xs font-display font-bold text-white truncate">
                          {grp.scenario.scenarioTitle}
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {grp.concepts.slice(0, 3).map((concept, cIdx) => (
                            <span
                              key={`test-grp-concept-${grpIdx}-${cIdx}`}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 truncate max-w-[140px]"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Test Active View: 100% Full Optimal Width */}
              <div className="w-full">
                {currentTestFlatQuestion ? (
                  currentTestFlatQuestion.isCase && currentTestFlatQuestion.caseScenario ? (
                    /* SPLIT SCREEN FOR CASE STUDY QUESTIONS IN TEST - Full 50/50 View */
                    <SplitCaseWorkspace
                      scenario={currentTestFlatQuestion.caseScenario}
                      orderedSubQuestions={currentTestFlatQuestion.caseScenario.subQuestions}
                      currentSubIndex={currentTestFlatQuestion.subIndex}
                      onNavigateSubQuestion={(newSubIdx) => {
                        const target = testFlatQuestions.find(
                          q => q.itemIndex === currentTestFlatQuestion.itemIndex && q.subIndex === newSubIdx
                        );
                        if (target) setCurrentTestItemIndex(target.globalIndex);
                      }}
                      selectedOptionIndex={testAnswers[currentTestFlatQuestion.questionId]}
                      onSelectOption={(optIdx) => {
                        setTestAnswers(prev => ({
                          ...prev,
                          [currentTestFlatQuestion.questionId]: optIdx
                        }));
                      }}
                      onClearResponse={() => {
                        setTestAnswers(prev => {
                          const updated = { ...prev };
                          delete updated[currentTestFlatQuestion.questionId];
                          return updated;
                        });
                      }}
                      onMarkForReview={() => {
                        setTestMarkedReview(prev => {
                          const next = new Set(prev);
                          if (next.has(currentTestFlatQuestion.questionId)) {
                            next.delete(currentTestFlatQuestion.questionId);
                          } else {
                            next.add(currentTestFlatQuestion.questionId);
                          }
                          return next;
                        });
                      }}
                      isMarkedForReview={testMarkedReview.has(currentTestFlatQuestion.questionId)}
                      onSaveAndNext={() => {
                        setCurrentTestItemIndex(prev => Math.min(testFlatQuestions.length - 1, prev + 1));
                      }}
                      onCompleteCase={() => {
                        if (currentTestItemIndex < testFlatQuestions.length - 1) {
                          setCurrentTestItemIndex(prev => prev + 1);
                        } else {
                          handleTestSubmit();
                        }
                      }}
                      isPracticeMode={false}
                      answeredCount={
                        currentTestFlatQuestion.caseScenario.subQuestions.filter(
                          sq => testAnswers[sq.id] !== undefined
                        ).length
                      }
                      totalSubQuestions={currentTestFlatQuestion.caseScenario.subQuestions.length}
                    />
                  ) : (
                    /* SPACIOUS CANVAS FOR STANDALONE MCQS IN TEST */
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-md w-full max-w-4xl mx-auto">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {currentTestFlatQuestion.chapterName}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          Question <strong>{currentTestItemIndex + 1}</strong> of {testFlatQuestions.length}
                        </span>
                      </div>

                      <div className="text-sm sm:text-base font-semibold text-white leading-relaxed font-sans whitespace-pre-wrap">
                        {currentTestFlatQuestion.question.questionText}
                      </div>

                      <div className="space-y-3">
                        {currentTestFlatQuestion.question.options.map((opt, oIdx) => {
                          const isSelected = testAnswers[currentTestFlatQuestion.questionId] === oIdx;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => {
                                setTestAnswers(prev => ({
                                  ...prev,
                                  [currentTestFlatQuestion.questionId]: oIdx
                                }));
                              }}
                              className={`w-full p-4 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 cursor-pointer ${
                                isSelected
                                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400 font-semibold shadow-sm'
                                  : 'border-slate-800 hover:border-slate-700 bg-slate-900/60 text-slate-200'
                              }`}
                            >
                              <span className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center font-mono text-xs font-bold border ${
                                isSelected 
                                  ? 'bg-cyan-500 text-slate-950 border-cyan-400' 
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="leading-snug pt-0.5">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Exam Nav Bar */}
                      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentTestItemIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentTestItemIndex === 0}
                            className="px-3.5 py-2 border border-slate-800 hover:bg-slate-900 text-slate-300 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <ChevronLeft className="w-4 h-4" /> Previous
                          </button>

                          <button
                            onClick={() => {
                              setTestAnswers(prev => {
                                const updated = { ...prev };
                                delete updated[currentTestFlatQuestion.questionId];
                                return updated;
                              });
                            }}
                            disabled={testAnswers[currentTestFlatQuestion.questionId] === undefined}
                            className="px-3.5 py-2 border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Clear
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTestMarkedReview(prev => {
                                const next = new Set(prev);
                                if (next.has(currentTestFlatQuestion.questionId)) {
                                  next.delete(currentTestFlatQuestion.questionId);
                                } else {
                                  next.add(currentTestFlatQuestion.questionId);
                                }
                                return next;
                              });
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                              testMarkedReview.has(currentTestFlatQuestion.questionId)
                                ? 'bg-purple-600/30 text-purple-300 border-purple-500/50'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            {testMarkedReview.has(currentTestFlatQuestion.questionId) ? 'Marked' : 'Mark Review'}
                          </button>

                          <button
                            onClick={() => setCurrentTestItemIndex(prev => Math.min(testFlatQuestions.length - 1, prev + 1))}
                            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl text-xs font-display font-extrabold uppercase tracking-wider transition shadow-md shadow-cyan-500/10 flex items-center gap-1 cursor-pointer"
                          >
                            Save & Next <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                ) : null}
              </div>

              {/* Slide-out ICAI Palette Drawer for Test Mode */}
              {mobilePaletteOpen && (
                <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
                  <div className="w-full max-w-sm sm:max-w-md h-full bg-slate-950 border-l border-slate-800 p-4 overflow-y-auto no-scrollbar shadow-2xl animate-slideLeft">
                    <IcaExamPalette
                      items={testPaletteItems}
                      currentIndex={currentTestItemIndex}
                      onSelectIndex={(idx) => {
                        setCurrentTestItemIndex(idx);
                        setMobilePaletteOpen(false);
                      }}
                      onSubmitExam={handleTestSubmit}
                      isTestMode={true}
                      onCloseMobile={() => setMobilePaletteOpen(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* EVALUATION SCORECARD VIEW */
            <ExamResultScorecard
              subjectName={subjectName}
              totalQuestions={testFlatQuestions.length}
              evaluatedQuestions={testEvaluatedList}
              durationSeconds={testTotalDuration - testTimeLeft}
              onReturnToLobby={() => setQuizMode('lobby')}
              onRetakeExam={() => initTestMode()}
            />
          )}
        </div>
      )}

    </div>
  );
}
