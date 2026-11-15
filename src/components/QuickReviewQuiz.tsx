/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { SubjectId, FlashcardRating, ConfidenceRatingValue } from '../types';
import { SUBJECTS_METADATA, CHAPTER_SUMMARIES, FORM_ITEMS } from '../data/syllabus';
import { HIGH_YIELD_FLASHCARDS } from '../data/flashcards';
import { SUBJECT_CHAPTERS, getCanonicalChapterKey } from './RevisionPlanner';
import { CA_CURRICULUM_LEVELS, getSelectedCALevel, useCALevel } from '../data/curriculumLevels';
import { getLevelScopedKey, getLevelSubjectIds } from '../utils/levelStorage';
import {
  Zap,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  BookOpen,
  Layers,
  Award,
  Flame,
  Eye,
  ArrowRight,
  Filter,
  RefreshCw,
  XCircle,
  TrendingDown,
  Scale,
  Calculator
} from 'lucide-react';

export interface ChapterRevisionMetric {
  subjectId: SubjectId;
  chapterName: string;
  completedCycles: number;
  partialCycles: number;
  totalMinutes: number;
  sessionCount: number;
  lastRevisedDate: string | null;
  daysSinceLastRevision: number;
  priorityScore: number; // Lower = less frequently revised (higher priority for Quick Review)
}

export interface QuickReviewCard {
  id: string;
  subjectId: SubjectId;
  chapterName: string;
  statutoryRef: string;
  examImportance: 'Critical' | 'High' | 'Medium';
  question: string;
  bullets: string[];
  exceptionText?: string;
  exampleText?: string;
  equationText?: string;
  summaryClean: string;
  answerHtml?: string;
  chapterMetric: ChapterRevisionMetric;
  priorConfidence?: ConfidenceRatingValue;
}

export type QuizGrade = 'missed' | 'partial' | 'mastered';

interface QuickReviewQuizProps {
  subjectId: SubjectId | null;
  onSelectSubjectAndBlueprint?: (subjectId: SubjectId) => void;
  onClose?: () => void;
}

const FIVE_MINUTES_SECONDS = 5 * 60; // 300 seconds

/**
 * Computes revision frequency metrics for all official chapters of the requested subject(s)
 * by inspecting Revision Planner state, Revision Planner logs, Focus Sessions, and completed Study Tasks.
 */
export function computeLeastRevisedChapters(targetSubjectId: SubjectId | null): ChapterRevisionMetric[] {
  const caLevel = getSelectedCALevel();
  const subjectsToScan: SubjectId[] = targetSubjectId
    ? [targetSubjectId]
    : getLevelSubjectIds(caLevel);

  // 1. Load Revision Planner Logs (level-scoped)
  let revLogs: any[] = [];
  try {
    const rawLogs = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs', caLevel));
    if (rawLogs) {
      const parsed = JSON.parse(rawLogs);
      if (Array.isArray(parsed)) revLogs = parsed;
    }
  } catch (e) {}

  // 2. Load Focus Sessions (level-scoped)
  let focusSessions: any[] = [];
  try {
    const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', caLevel));
    if (rawFocus) {
      const parsed = JSON.parse(rawFocus);
      if (Array.isArray(parsed)) focusSessions = parsed;
    }
  } catch (e) {}

  // 3. Load Completed Tasks (level-scoped)
  let completedTasks: any[] = [];
  try {
    const rawTasks =
      localStorage.getItem(getLevelScopedKey('practca_local_tasks', caLevel)) ||
      localStorage.getItem(getLevelScopedKey('practca_cached_cloud_tasks', caLevel));
    if (rawTasks) {
      const parsed = JSON.parse(rawTasks);
      if (Array.isArray(parsed)) {
        completedTasks = parsed.filter((t: any) => t && t.status === 'completed');
      }
    }
  } catch (e) {}

  const nowMs = Date.now();
  const metrics: ChapterRevisionMetric[] = [];

  subjectsToScan.forEach((subId) => {
    const officialChapters =
      SUBJECT_CHAPTERS[subId] && SUBJECT_CHAPTERS[subId].length > 0
        ? SUBJECT_CHAPTERS[subId]
        : SUBJECTS_METADATA[subId]?.chapters || [];

    // Load per-subject Revision Planner tracker state
    let subjectTrackerChapters: Record<string, Record<string, any>> = {};
    try {
      const rawTracker =
        localStorage.getItem(`practca_revision_planner_${subId}`) ||
        localStorage.getItem(`cavault_revision_planner_${subId}`);
      if (rawTracker) {
        const parsed = JSON.parse(rawTracker);
        if (parsed && parsed.chapters && typeof parsed.chapters === 'object') {
          Object.keys(parsed.chapters).forEach((rawChKey) => {
            const canon = getCanonicalChapterKey(subId, rawChKey);
            subjectTrackerChapters[canon] = parsed.chapters[rawChKey];
          });
        }
      }
    } catch (e) {}

    officialChapters.forEach((chapterName) => {
      const canonChapter = getCanonicalChapterKey(subId, chapterName);
      const trackerState = subjectTrackerChapters[canonChapter] || {};

      let completedCycles = 0;
      let partialCycles = 0;
      let trackerMinutes = 0;
      let latestIsoDate: string | null = null;

      const updateLatestDate = (candidate?: string | null) => {
        if (!candidate) return;
        const d = new Date(candidate);
        if (isNaN(d.getTime())) return;
        const iso = d.toISOString().split('T')[0];
        if (!latestIsoDate || iso > latestIsoDate) {
          latestIsoDate = iso;
        }
      };

      Object.entries(trackerState).forEach(([, cycleData]) => {
        if (!cycleData || typeof cycleData !== 'object') return;
        if (cycleData.completed) {
          completedCycles += 1;
        } else if (cycleData.partiallyDone || cycleData.statusTag === 'partially_done') {
          partialCycles += 1;
        }
        const hrs = parseFloat(cycleData.hours || '0');
        if (!isNaN(hrs) && hrs > 0) {
          trackerMinutes += Math.round(hrs * 60);
        }
        if (cycleData.completedAt) {
          updateLatestDate(cycleData.completedAt);
        }
      });

      // Match Revision Planner logs
      let logMinutes = 0;
      let logSessions = 0;
      revLogs.forEach((log) => {
        if (!log || String(log.subjectId || '').toUpperCase() !== subId.toUpperCase()) return;
        const logCanon = getCanonicalChapterKey(subId, log.chapterName || '');
        if (logCanon === canonChapter) {
          logSessions += 1;
          logMinutes += Number(log.durationMinutes) || 0;
          updateLatestDate(log.timestamp);
        }
      });

      // Match Focus Sessions
      let focusMinutes = 0;
      let focusCount = 0;
      focusSessions.forEach((sess) => {
        if (!sess || (sess.sessionType && sess.sessionType !== 'work')) return;
        if (String(sess.subjectId || '').toUpperCase() !== subId.toUpperCase()) return;
        const sessCanon = getCanonicalChapterKey(
          subId,
          sess.chapterName || sess.description || ''
        );
        if (sessCanon === canonChapter) {
          focusCount += 1;
          focusMinutes += Number(sess.duration) || 0;
          updateLatestDate(sess.timestamp);
        }
      });

      // Match Completed Study Tasks
      let completedTaskCount = 0;
      completedTasks.forEach((task) => {
        const tSub = String(task.subjectCode || '').toUpperCase();
        if (tSub !== subId.toUpperCase()) return;
        const taskCanon = getCanonicalChapterKey(
          subId,
          task.chapterName || task.cleanTitle || task.title || ''
        );
        if (taskCanon === canonChapter) {
          completedTaskCount += 1;
          updateLatestDate(task.completed || task.taskDate || task.due);
        }
      });

      const totalMinutes = Math.max(trackerMinutes, logMinutes, focusMinutes);
      const sessionCount = Math.max(logSessions, focusCount, completedTaskCount);
      const effectiveCompletedCycles =
        completedCycles > 0
          ? completedCycles
          : completedTaskCount > 0 || sessionCount > 0
          ? Math.min(1, completedTaskCount + sessionCount)
          : 0;

      let daysSinceLastRevision = 9999;
      if (latestIsoDate) {
        const diffMs = nowMs - new Date(latestIsoDate).getTime();
        daysSinceLastRevision = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      }

      // Priority score: Lower means LESS frequently revised -> higher priority for Quick Review
      const priorityScore =
        effectiveCompletedCycles * 10000 +
        partialCycles * 3500 +
        totalMinutes * 15 +
        sessionCount * 400 -
        Math.min(daysSinceLastRevision, 365) * 5;

      metrics.push({
        subjectId: subId,
        chapterName: canonChapter,
        completedCycles: effectiveCompletedCycles,
        partialCycles,
        totalMinutes,
        sessionCount,
        lastRevisedDate: latestIsoDate,
        daysSinceLastRevision,
        priorityScore
      });
    });
  });

  // Sort strictly from LEAST revised to MOST revised
  return metrics.sort((a, b) => {
    if (a.completedCycles !== b.completedCycles) {
      return a.completedCycles - b.completedCycles;
    }
    if (a.totalMinutes !== b.totalMinutes) {
      return a.totalMinutes - b.totalMinutes;
    }
    if (a.sessionCount !== b.sessionCount) {
      return a.sessionCount - b.sessionCount;
    }
    return b.daysSinceLastRevision - a.daysSinceLastRevision;
  });
}

/**
 * Splits a multi-sentence statutory description into crisp, scannable bullet points.
 */
function splitIntoCrispBullets(text: string): string[] {
  if (!text) return [];
  const rawParts = text
    .split(/(?<=\.)\s+(?=[A-Z0-9(])|;\s+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 8);
  return rawParts.length > 0 ? rawParts.slice(0, 5) : [text.trim()];
}

/**
 * Generates a high-yield 5-minute flashcard quiz deck focused on the user's least-frequently-revised chapters.
 */
export function buildQuickReviewDeck(
  leastRevisedChapters: ChapterRevisionMetric[],
  maxCards: number = 10,
  ratingsMap: Record<string, FlashcardRating> = {},
  filterChapterName: string = 'ALL'
): QuickReviewCard[] {
  const targetMetrics =
    filterChapterName !== 'ALL'
      ? leastRevisedChapters.filter((m) => m.chapterName === filterChapterName)
      : leastRevisedChapters.slice(0, 6);

  const activeMetrics =
    targetMetrics.length > 0 ? targetMetrics : leastRevisedChapters.slice(0, 5);

  const candidateCards: QuickReviewCard[] = [];
  const seenIds = new Set<string>();

  activeMetrics.forEach((metric) => {
    const { subjectId, chapterName } = metric;

    // 1. Check Chapter Summaries in syllabus.ts for exact or canonical chapter match
    const subjectSummaries = CHAPTER_SUMMARIES[subjectId] || [];
    const matchedSummary = subjectSummaries.find(
      (s) =>
        getCanonicalChapterKey(subjectId, s.chapterName).toLowerCase() ===
          chapterName.toLowerCase() ||
        s.chapterName.toLowerCase() === chapterName.toLowerCase()
    );

    if (matchedSummary && Array.isArray(matchedSummary.keyPrinciples)) {
      matchedSummary.keyPrinciples.forEach((kp, idx) => {
        const cardId = `qr_sum_${subjectId}_${chapterName.replace(/[^a-zA-Z0-9]/g, '_')}_${idx}`;
        if (seenIds.has(cardId)) return;
        seenIds.add(cardId);

        const cleanId = cardId.replace(/[^a-zA-Z0-9_]/g, '_');
        const priorConfidence = ratingsMap[cleanId]?.rating;

        // Extract statutory reference if mentioned in title or description
        const refMatch =
          kp.title.match(
            /\b(Sec(?:tion)?\s+\d+[A-Za-z0-9()]*|Ind\s*AS\s*\d+|SA\s*\d+|SQC\s*\d+|SRS\s*\d+|SRE\s*\d+|SAE\s*\d+|Rule\s*\d+[A-Za-z0-9()]*|Schedule\s+[IVX\d]+)\b/i
          ) ||
          kp.description.match(
            /\b(Sec(?:tion)?\s+\d+[A-Za-z0-9()]*|Ind\s*AS\s*\d+|SA\s*\d+|SQC\s*\d+|Rule\s*\d+[A-Za-z0-9()]*|Schedule\s+[IVX\d]+)\b/i
          );

        const statutoryRef = refMatch ? refMatch[1] : `${subjectId} Core Provision`;
        const bullets = splitIntoCrispBullets(kp.description);

        candidateCards.push({
          id: cardId,
          subjectId,
          chapterName,
          statutoryRef,
          examImportance: idx === 0 || kp.exception ? 'Critical' : 'High',
          question: `What are the governing statutory rules, conditions, and exceptions for "${kp.title}" under ${chapterName}?`,
          bullets,
          exceptionText: kp.exception,
          exampleText: kp.example,
          summaryClean: bullets[0] || kp.description,
          chapterMetric: metric,
          priorConfidence
        });
      });
    }

    // 2. Also match curated HIGH_YIELD_FLASHCARDS for this subject & chapter
    const subjectFlashcards = HIGH_YIELD_FLASHCARDS.filter((fc) => fc.subjectId === subjectId);
    subjectFlashcards.forEach((fc) => {
      const fcCanon = getCanonicalChapterKey(subjectId, fc.category);
      const matchesChapter =
        fcCanon.toLowerCase() === chapterName.toLowerCase() ||
        chapterName.toLowerCase().includes(fc.category.toLowerCase()) ||
        fc.category.toLowerCase().includes(chapterName.toLowerCase());

      if (matchesChapter && !seenIds.has(fc.id)) {
        seenIds.add(fc.id);
        const cleanId = fc.id.replace(/[^a-zA-Z0-9_]/g, '_');
        const priorConfidence = ratingsMap[cleanId]?.rating;

        candidateCards.push({
          id: fc.id,
          subjectId,
          chapterName,
          statutoryRef: fc.statutoryRef,
          examImportance: fc.examImportance,
          question: fc.question,
          bullets: [fc.summaryClean],
          answerHtml: fc.answerHtml,
          summaryClean: fc.summaryClean,
          chapterMetric: metric,
          priorConfidence
        });
      }
    });

    // 3. Also match Formula items for this chapter (AFM / DT / IDT / Audit)
    const subjectFormulas = FORM_ITEMS[subjectId] || [];
    subjectFormulas.forEach((form, fIdx) => {
      const formCanon = getCanonicalChapterKey(subjectId, form.chapterName);
      if (formCanon.toLowerCase() === chapterName.toLowerCase()) {
        const cardId = `qr_form_${subjectId}_${chapterName.replace(/[^a-zA-Z0-9]/g, '_')}_${fIdx}`;
        if (seenIds.has(cardId)) return;
        seenIds.add(cardId);

        const cleanId = cardId.replace(/[^a-zA-Z0-9_]/g, '_');
        const priorConfidence = ratingsMap[cleanId]?.rating;

        candidateCards.push({
          id: cardId,
          subjectId,
          chapterName,
          statutoryRef: 'Statutory Formula & Computation',
          examImportance: 'Critical',
          question: `State the exact formula, variables, and application context for "${form.formulaName}" (${chapterName}).`,
          bullets: [
            `Application Context: ${form.context}`,
            ...form.variables.map((v) => `${v.name}: ${v.desc}`)
          ],
          equationText: form.equation,
          exampleText: form.workedExample
            ? `${form.workedExample.scenario} → ${form.workedExample.calculation} = ${form.workedExample.output}`
            : undefined,
          summaryClean: `${form.formulaName}: ${form.equation}`,
          chapterMetric: metric,
          priorConfidence
        });
      }
    });
  });

  // Fallback: if a chapter has no matched cards yet, include top subject flashcards mapped to the least revised chapters
  if (candidateCards.length === 0 && activeMetrics.length > 0) {
    const primaryMetric = activeMetrics[0];
    HIGH_YIELD_FLASHCARDS.filter((fc) => fc.subjectId === primaryMetric.subjectId)
      .slice(0, maxCards)
      .forEach((fc) => {
        const cleanId = fc.id.replace(/[^a-zA-Z0-9_]/g, '_');
        candidateCards.push({
          id: fc.id,
          subjectId: fc.subjectId,
          chapterName: primaryMetric.chapterName,
          statutoryRef: fc.statutoryRef,
          examImportance: fc.examImportance,
          question: fc.question,
          bullets: [fc.summaryClean],
          answerHtml: fc.answerHtml,
          summaryClean: fc.summaryClean,
          chapterMetric: primaryMetric,
          priorConfidence: ratingsMap[cleanId]?.rating
        });
      });
  }

  // Interleave cards across the least-frequently-revised chapters so the 5-minute sprint covers multiple weak chapters evenly
  const cardsByChapter = new Map<string, QuickReviewCard[]>();
  candidateCards.forEach((card) => {
    const key = `${card.subjectId}::${card.chapterName}`;
    if (!cardsByChapter.has(key)) {
      cardsByChapter.set(key, []);
    }
    cardsByChapter.get(key)!.push(card);
  });

  // Within each chapter, prioritize lower confidence ratings (1★/2★) or unrated cards first, then Critical importance
  cardsByChapter.forEach((list) => {
    list.sort((a, b) => {
      const confA = a.priorConfidence ?? 2.5;
      const confB = b.priorConfidence ?? 2.5;
      if (confA !== confB) return confA - confB;
      if (a.examImportance === 'Critical' && b.examImportance !== 'Critical') return -1;
      if (b.examImportance === 'Critical' && a.examImportance !== 'Critical') return 1;
      return 0;
    });
  });

  const interleaved: QuickReviewCard[] = [];
  const chapterQueues = Array.from(cardsByChapter.values());
  let round = 0;
  while (interleaved.length < maxCards) {
    let addedInRound = false;
    for (const queue of chapterQueues) {
      if (round < queue.length && interleaved.length < maxCards) {
        interleaved.push(queue[round]);
        addedInRound = true;
      }
    }
    if (!addedInRound) break;
    round += 1;
  }

  return interleaved;
}

export default function QuickReviewQuiz({
  subjectId,
  onSelectSubjectAndBlueprint,
  onClose
}: QuickReviewQuizProps) {
  const [scopeSubjectId, setScopeSubjectId] = useState<SubjectId | null>(subjectId);
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('ALL');
  const [deckSize, setDeckSize] = useState<number>(10);

  // Sync scopeSubjectId when parent subjectId prop changes
  useEffect(() => {
    setScopeSubjectId(subjectId);
    setSelectedChapterFilter('ALL');
  }, [subjectId]);

  // Load confidence ratings from localStorage
  const [ratingsMap, setRatingsMap] = useState<Record<string, FlashcardRating>>(() => {
    try {
      const raw = localStorage.getItem('practca_flashcard_ratings');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  // Compute least-revised chapters for current scope
  const leastRevisedChapters = useMemo(() => {
    return computeLeastRevisedChapters(scopeSubjectId);
  }, [scopeSubjectId]);

  // Top 6 least-frequently-revised chapters displayed in the diagnostic bar
  const topLeastRevisedChapters = useMemo(() => {
    return leastRevisedChapters.slice(0, 6);
  }, [leastRevisedChapters]);

  // Build active quiz deck
  const [deckSeed, setDeckSeed] = useState<number>(0);
  const fullDeck = useMemo(() => {
    return buildQuickReviewDeck(
      leastRevisedChapters,
      deckSize,
      ratingsMap,
      selectedChapterFilter
    );
  }, [leastRevisedChapters, deckSize, selectedChapterFilter, deckSeed]);

  const [activeCards, setActiveCards] = useState<QuickReviewCard[]>(fullDeck);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [grades, setGrades] = useState<Record<string, QuizGrade>>({});
  const [secondsLeft, setSecondsLeft] = useState<number>(FIVE_MINUTES_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  // Reset quiz session when deck changes
  useEffect(() => {
    setActiveCards(fullDeck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setGrades({});
    setSecondsLeft(FIVE_MINUTES_SECONDS);
    setIsTimerPaused(false);
    setIsQuizFinished(false);
  }, [fullDeck]);

  // 5-Minute Countdown Timer
  useEffect(() => {
    if (isQuizFinished || isTimerPaused || activeCards.length === 0) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsQuizFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isQuizFinished, isTimerPaused, activeCards.length]);

  const currentCard = activeCards[currentIndex] || null;

  // Format mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Grade current card & advance
  const handleGradeCard = useCallback(
    (grade: QuizGrade) => {
      if (!currentCard) return;

      setGrades((prev) => ({
        ...prev,
        [currentCard.id]: grade
      }));

      // Sync confidence rating to localStorage so FlashcardsView & analytics stay updated
      const mappedRating: ConfidenceRatingValue =
        grade === 'mastered' ? 5 : grade === 'partial' ? 3 : 1;
      const cleanId = currentCard.id.replace(/[^a-zA-Z0-9_]/g, '_');
      const updatedRatingObj: FlashcardRating = {
        cardId: cleanId,
        subjectId: currentCard.subjectId,
        rating: mappedRating,
        conceptTitle: currentCard.question,
        category: currentCard.chapterName,
        statutoryRef: currentCard.statutoryRef,
        updatedAt: new Date().toISOString()
      };

      setRatingsMap((prev) => {
        const next = { ...prev, [cleanId]: updatedRatingObj };
        try {
          localStorage.setItem('practca_flashcard_ratings', JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // Advance to next card or finish quiz
      if (currentIndex + 1 < activeCards.length) {
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsQuizFinished(true);
      }
    },
    [currentCard, currentIndex, activeCards.length]
  );

  // Keyboard shortcuts for rapid 5-minute revision
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isQuizFinished || !currentCard) return;
      if (
        document.activeElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped && e.key === '1') {
        e.preventDefault();
        handleGradeCard('missed');
      } else if (isFlipped && e.key === '2') {
        e.preventDefault();
        handleGradeCard('partial');
      } else if (isFlipped && e.key === '3') {
        e.preventDefault();
        handleGradeCard('mastered');
      } else if (e.key === 'ArrowRight' && currentIndex + 1 < activeCards.length) {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setIsFlipped(false);
        setCurrentIndex((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQuizFinished, currentCard, isFlipped, handleGradeCard, currentIndex, activeCards.length]);

  // Quiz score statistics
  const quizStats = useMemo(() => {
    let mastered = 0;
    let partial = 0;
    let missed = 0;
    Object.values(grades).forEach((g) => {
      if (g === 'mastered') mastered += 1;
      else if (g === 'partial') partial += 1;
      else if (g === 'missed') missed += 1;
    });
    const answeredCount = mastered + partial + missed;
    const rawScore = mastered * 1 + partial * 0.5;
    const accuracyPct =
      answeredCount > 0 ? Math.round((rawScore / answeredCount) * 100) : 0;
    const elapsedSeconds = FIVE_MINUTES_SECONDS - secondsLeft;
    return {
      mastered,
      partial,
      missed,
      answeredCount,
      rawScore,
      accuracyPct,
      elapsedSeconds
    };
  }, [grades, secondsLeft]);

  const handleRestartFresh = () => {
    setDeckSeed((prev) => prev + 1);
    setCurrentIndex(0);
    setIsFlipped(false);
    setGrades({});
    setSecondsLeft(FIVE_MINUTES_SECONDS);
    setIsTimerPaused(false);
    setIsQuizFinished(false);
  };

  const handleRetryWeakCardsOnly = () => {
    const weakCards = activeCards.filter(
      (c) => grades[c.id] === 'missed' || grades[c.id] === 'partial' || !grades[c.id]
    );
    if (weakCards.length === 0) {
      handleRestartFresh();
      return;
    }
    setActiveCards(weakCards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setGrades({});
    setSecondsLeft(FIVE_MINUTES_SECONDS);
    setIsTimerPaused(false);
    setIsQuizFinished(false);
  };

  const formatRevisionBadge = (metric: ChapterRevisionMetric) => {
    const hrs = (metric.totalMinutes / 60).toFixed(1);
    if (metric.completedCycles === 0 && metric.totalMinutes === 0) {
      return '0 Revisions · 0.0h Logged';
    }
    const lastText = metric.lastRevisedDate
      ? metric.daysSinceLastRevision === 0
        ? 'Today'
        : `${metric.daysSinceLastRevision}d ago`
      : 'Unlogged';
    return `${metric.completedCycles} Rev${metric.completedCycles === 1 ? '' : 's'} · ${hrs}h · ${lastText}`;
  };

  return (
    <div
      id="quick-review-quiz-container"
      className="space-y-5 animate-fadeIn text-left"
    >
      {/* Top Control & 5-Minute Countdown Bar */}
      <div className="p-5 rounded-2xl bg-cav-card border border-cav-border shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-36 w-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono font-black text-[11px] uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                5-Minute Quick Review
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-400">
                Targeting Least-Frequently-Revised Chapters
              </span>
            </div>
            <h2 className="font-display font-black text-white text-lg sm:text-xl tracking-tight">
              {scopeSubjectId
                ? `${scopeSubjectId} — High-Yield Recall Sprint`
                : `All ${getLevelSubjectIds(getSelectedCALevel()).length} ${CA_CURRICULUM_LEVELS[getSelectedCALevel()].shortName} Papers — Least-Revised Sprint`}
            </h2>
          </div>

          {/* Right Controls: Subject Scope, Timer & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1 bg-cav-card2 p-1 rounded-xl border border-cav-border">
              <button
                type="button"
                onClick={() => {
                  setScopeSubjectId(null);
                  setSelectedChapterFilter('ALL');
                }}
                className={`h-7 px-2.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                  scopeSubjectId === null
                    ? 'bg-cav-accent text-slate-950 font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ALL
              </button>
              {getLevelSubjectIds(getSelectedCALevel()).map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => {
                    setScopeSubjectId(sub);
                    setSelectedChapterFilter('ALL');
                  }}
                  className={`h-7 px-2.5 rounded-lg text-[11px] font-mono font-bold transition cursor-pointer ${
                    scopeSubjectId === sub
                      ? 'bg-cav-accent text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* 5-Minute Live Countdown Clock */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-black text-sm shadow-xs ${
                secondsLeft <= 30
                  ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse'
                  : secondsLeft <= 90
                  ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              }`}
            >
              <Clock className="h-4 w-4 shrink-0" />
              <span>{formatTime(secondsLeft)}</span>
              <button
                type="button"
                onClick={() => setIsTimerPaused((prev) => !prev)}
                title={isTimerPaused ? 'Resume 5-Min Timer' : 'Pause 5-Min Timer'}
                className="ml-1 p-1 rounded-md hover:bg-slate-800/80 text-slate-200 transition cursor-pointer"
              >
                {isTimerPaused ? (
                  <Play className="h-3.5 w-3.5 text-amber-400" />
                ) : (
                  <Pause className="h-3.5 w-3.5 text-slate-300" />
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleRestartFresh}
              className="h-9 px-3 rounded-xl bg-cav-card2 hover:bg-slate-800 border border-cav-border text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              title="Reset 5-minute timer and regenerate cards"
            >
              <RotateCcw className="h-3.5 w-3.5 text-cav-accent" />
              <span>Restart</span>
            </button>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-3 rounded-xl bg-cav-card2 hover:bg-slate-800 border border-cav-border text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span>Blueprint View</span>
              </button>
            )}
          </div>
        </div>

        {/* 5-Minute Time Progress Bar */}
        <div className="mt-4 w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
          <div
            className={`h-full transition-all duration-500 ${
              secondsLeft <= 30
                ? 'bg-rose-500'
                : secondsLeft <= 90
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{
              width: `${Math.max(0, Math.min(100, (secondsLeft / FIVE_MINUTES_SECONDS) * 100))}%`
            }}
          />
        </div>
      </div>

      {/* Least-Frequently-Revised Chapters Diagnostic Selector Bar */}
      <div className="p-4 rounded-2xl bg-cav-card2 border border-cav-border space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cav-border/70 pb-2.5">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-400 shrink-0" />
            <span className="text-xs font-display font-bold text-white uppercase tracking-wider">
              Priority Least-Revised Chapters Detected
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>Deck Size:</span>
            {[5, 10, 15].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setDeckSize(cnt)}
                className={`px-2 py-0.5 rounded font-bold cursor-pointer transition ${
                  deckSize === cnt
                    ? 'bg-cav-accent text-slate-950'
                    : 'bg-cav-card text-slate-300 hover:text-white border border-cav-border'
                }`}
              >
                {cnt} Cards
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedChapterFilter('ALL')}
            className={`px-3 py-2 rounded-xl border text-left transition cursor-pointer shrink-0 ${
              selectedChapterFilter === 'ALL'
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-300'
                : 'bg-cav-card border-cav-border text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
              Auto-Prioritized Mix
            </div>
            <div className="text-xs font-extrabold text-white mt-0.5">
              Top {topLeastRevisedChapters.length} Least-Revised Chapters
            </div>
          </button>

          {topLeastRevisedChapters.map((metric, idx) => {
            const isSelected = selectedChapterFilter === metric.chapterName;
            return (
              <button
                key={`${metric.subjectId}-${metric.chapterName}`}
                type="button"
                onClick={() =>
                  setSelectedChapterFilter(
                    isSelected ? 'ALL' : metric.chapterName
                  )
                }
                className={`px-3 py-2 rounded-xl border text-left transition cursor-pointer shrink-0 max-w-[260px] ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/50 text-white'
                    : 'bg-cav-card border-cav-border text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-black uppercase text-rose-400">
                    #{idx + 1} Least Revised · {metric.subjectId}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    {formatRevisionBadge(metric)}
                  </span>
                </div>
                <div className="text-xs font-bold text-white truncate mt-0.5">
                  {metric.chapterName}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Stage OR Final Summary Report */}
      {isQuizFinished ? (
        <div className="p-6 rounded-2xl bg-cav-card border border-cav-border shadow-lg space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cav-border pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold uppercase">
                <Award className="h-3.5 w-3.5" />
                5-Minute Quick Review Complete
              </div>
              <h3 className="text-xl font-display font-black text-white">
                Least-Revised Chapters Recall Report
              </h3>
              <p className="text-xs text-slate-400">
                Completed {quizStats.answeredCount} of {activeCards.length} flashcards in{' '}
                {formatTime(quizStats.elapsedSeconds)}.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-cav-card2 border border-cav-border text-center">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Recall Score
                </span>
                <span
                  className={`text-2xl font-display font-black ${
                    quizStats.accuracyPct >= 75
                      ? 'text-emerald-400'
                      : quizStats.accuracyPct >= 50
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {quizStats.accuracyPct}%
                </span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                <span className="text-[10px] font-mono uppercase text-emerald-400 block">
                  Mastered
                </span>
                <span className="text-xl font-mono font-black text-emerald-300">
                  {quizStats.mastered}
                </span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
                <span className="text-[10px] font-mono uppercase text-amber-400 block">
                  Partial
                </span>
                <span className="text-xl font-mono font-black text-amber-300">
                  {quizStats.partial}
                </span>
              </div>
              <div className="px-4 py-2.5 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
                <span className="text-[10px] font-mono uppercase text-rose-400 block">
                  Needs Work
                </span>
                <span className="text-xl font-mono font-black text-rose-300">
                  {quizStats.missed}
                </span>
              </div>
            </div>
          </div>

          {/* Chapter-Wise Performance Breakdown Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Chapter-Wise Vulnerability & Recall Breakdown
            </h4>
            <div className="overflow-x-auto rounded-xl border border-cav-border">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-cav-card2 text-slate-400 font-mono text-[10.5px] uppercase border-b border-cav-border">
                    <th className="p-3">Subject & Chapter</th>
                    <th className="p-3">Prior Revision Status</th>
                    <th className="p-3 text-center">Cards Tested</th>
                    <th className="p-3 text-center">Recall Accuracy</th>
                    <th className="p-3 text-right">Study Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cav-border/60">
                  {Array.from(
                    new Set<string>(activeCards.map((c) => `${c.subjectId}::${c.chapterName}`))
                  ).map((key: string) => {
                    const [subId, chapName] = key.split('::') as [SubjectId, string];
                    const chapCards = activeCards.filter(
                      (c) => c.subjectId === subId && c.chapterName === chapName
                    );
                    const metric = chapCards[0].chapterMetric;
                    let pts = 0;
                    chapCards.forEach((c) => {
                      if (grades[c.id] === 'mastered') pts += 1;
                      else if (grades[c.id] === 'partial') pts += 0.5;
                    });
                    const pct = Math.round((pts / chapCards.length) * 100);

                    return (
                      <tr key={key} className="hover:bg-cav-card2/50">
                        <td className="p-3 font-bold text-white">
                          <span className="inline-block px-1.5 py-0.5 rounded bg-cav-accent/15 text-cav-accent font-mono text-[10px] mr-2">
                            {subId}
                          </span>
                          {chapName}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">
                          {formatRevisionBadge(metric)}
                        </td>
                        <td className="p-3 text-center font-mono font-bold text-slate-200">
                          {chapCards.length}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                              pct >= 75
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : pct >= 50
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {pct}%
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {onSelectSubjectAndBlueprint && (
                            <button
                              type="button"
                              onClick={() => onSelectSubjectAndBlueprint(subId)}
                              className="px-2.5 py-1 rounded-lg bg-cav-card2 hover:bg-cav-accent hover:text-slate-950 text-cav-accent border border-cav-border font-bold text-[11px] inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>Study Blueprint</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2.5">
              {(quizStats.missed > 0 || quizStats.partial > 0) && (
                <button
                  type="button"
                  onClick={handleRetryWeakCardsOnly}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>
                    Review Weak / Partial Cards ({quizStats.missed + quizStats.partial})
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={handleRestartFresh}
                className="px-4 py-2.5 rounded-xl bg-cav-accent hover:brightness-110 text-slate-950 font-black text-xs flex items-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Zap className="h-4 w-4" />
                <span>Start Fresh 5-Min Quick Review</span>
              </button>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-cav-card2 hover:bg-slate-800 border border-cav-border text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                Return to Concept Blueprint
              </button>
            )}
          </div>
        </div>
      ) : currentCard ? (
        <div className="space-y-4">
          {/* Card Progress & Live Score Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-cav-card border border-cav-border text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-cav-accent">
                Card {currentIndex + 1} of {activeCards.length}
              </span>
              <div className="flex items-center gap-1">
                {activeCards.map((c, idx) => {
                  const g = grades[c.id];
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentIndex(idx);
                      }}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex ? 'w-6 ring-2 ring-white/40 ' : 'w-2.5 '
                      }${
                        g === 'mastered'
                          ? 'bg-emerald-400'
                          : g === 'partial'
                          ? 'bg-amber-400'
                          : g === 'missed'
                          ? 'bg-rose-500'
                          : idx === currentIndex
                          ? 'bg-cav-accent'
                          : 'bg-slate-700'
                      }`}
                      title={`Card ${idx + 1}: ${c.chapterName}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="text-emerald-400 font-bold">
                ✓ Mastered: {quizStats.mastered}
              </span>
              <span className="text-amber-400 font-bold">
                ~ Partial: {quizStats.partial}
              </span>
              <span className="text-rose-400 font-bold">
                ✗ Missed: {quizStats.missed}
              </span>
              {quizStats.answeredCount > 0 && (
                <span className="px-2 py-0.5 rounded bg-cav-card2 border border-cav-border text-white font-black">
                  Score: {quizStats.accuracyPct}%
                </span>
              )}
            </div>
          </div>

          {/* Flashcard-Style Quiz Card */}
          <div className="p-6 sm:p-7 rounded-2xl bg-cav-card border border-cav-border shadow-lg space-y-5 relative overflow-hidden">
            {/* Card Metadata Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cav-border pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cav-accent text-slate-950 font-mono font-black text-xs">
                  {currentCard.subjectId}
                </span>
                <span className="px-3 py-1 rounded-lg bg-cav-card2 border border-cav-border text-white font-bold text-xs flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-cav-accent" />
                  {currentCard.chapterName}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-mono font-bold text-[11px]">
                  Least Revised · {formatRevisionBadge(currentCard.chapterMetric)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-mono font-bold text-[11px]">
                  {currentCard.statutoryRef}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-lg font-mono font-black text-[10px] uppercase ${
                    currentCard.examImportance === 'Critical'
                      ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                      : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  }`}
                >
                  {currentCard.examImportance} Priority
                </span>
              </div>
            </div>

            {/* Question Prompt */}
            <div className="space-y-3">
              <div className="text-[10.5px] font-mono font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5" />
                Active Recall Exam Prompt
              </div>
              <h3 className="text-base sm:text-lg font-display font-black text-white leading-snug">
                {currentCard.question}
              </h3>
            </div>

            {!isFlipped ? (
              /* Front Side: Active Recall Checklist & Reveal Button */
              <div className="space-y-5 pt-2">
                <div className="p-4 rounded-xl bg-cav-card2 border border-cav-border space-y-2">
                  <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                    Mentally Verify Before Revealing Answer:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-cav-accent shrink-0" />
                      <span>Core statutory rule, recognition criteria, or standard mandate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      <span>Specific monetary thresholds, time limits, or statutory exceptions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                      <span>Computational treatment or reporting conclusion in exam scenarios</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="w-full py-3.5 px-5 rounded-xl bg-cav-accent hover:brightness-110 text-slate-950 font-display font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                >
                  <Eye className="h-4 w-4" />
                  <span>Reveal ICAI Statutory Answer & Grade Recall (Space)</span>
                </button>
              </div>
            ) : (
              /* Back Side: Crisp Bullet-Point Breakdown & Self-Grading Quiz Buttons */
              <div className="space-y-4 pt-2 animate-fadeIn">
                <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[10.5px] font-mono font-black uppercase tracking-wider text-emerald-400">
                      Authoritative ICAI Key Points
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      100% Static Revision Breakdown
                    </span>
                  </div>

                  {/* Formula Equation Box if present */}
                  {currentCard.equationText && (
                    <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 font-mono text-xs font-bold text-indigo-200 flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>{currentCard.equationText}</span>
                    </div>
                  )}

                  {/* Rich HTML or Crisp Bullet Points */}
                  {currentCard.answerHtml ? (
                    <div
                      className="text-xs text-slate-200 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentCard.answerHtml }}
                    />
                  ) : (
                    <ul className="space-y-2 text-xs text-slate-200 leading-relaxed">
                      {currentCard.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="font-mono font-black text-cav-accent mt-0.5 shrink-0">
                            {i + 1}.
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Statutory Exception Callout */}
                  {currentCard.exceptionText && (
                    <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-500/30 space-y-1">
                      <div className="text-[10.5px] font-mono font-black uppercase text-rose-400 flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        Statutory Exception / Caveat
                      </div>
                      <p className="text-xs text-rose-100 leading-relaxed">
                        {currentCard.exceptionText}
                      </p>
                    </div>
                  )}

                  {/* Worked Numerical / Practical Illustration */}
                  {currentCard.exampleText && (
                    <div className="p-3 rounded-lg bg-emerald-950/25 border border-emerald-500/30 space-y-1">
                      <div className="text-[10.5px] font-mono font-black uppercase text-emerald-400 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        Practical Exam Illustration
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        {currentCard.exampleText}
                      </p>
                    </div>
                  )}
                </div>

                {/* Self-Assessment Quiz Grading Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Rate your recall accuracy to score & advance:</span>
                    <span>Keys: [1] Needs Work · [2] Partial · [3] Mastered</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleGradeCard('missed')}
                      className="p-3 rounded-xl bg-rose-950/40 hover:bg-rose-600 border border-rose-500/40 text-rose-200 hover:text-white transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] font-black uppercase">
                        <span>1 · Needs Revision</span>
                        <span className="opacity-75">+0%</span>
                      </div>
                      <div className="text-[11px] text-rose-300/90 group-hover:text-white mt-0.5">
                        Missed provision or threshold
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGradeCard('partial')}
                      className="p-3 rounded-xl bg-amber-950/40 hover:bg-amber-500 border border-amber-500/40 text-amber-200 hover:text-slate-950 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] font-black uppercase">
                        <span>2 · Partial Recall</span>
                        <span className="opacity-75">+50%</span>
                      </div>
                      <div className="text-[11px] text-amber-300/90 group-hover:text-slate-950 mt-0.5">
                        Recalled core rule, shaky on details
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleGradeCard('mastered')}
                      className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-200 hover:text-slate-950 transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] font-black uppercase">
                        <span>3 · Exam Mastered</span>
                        <span className="opacity-75">+100%</span>
                      </div>
                      <div className="text-[11px] text-emerald-300/90 group-hover:text-slate-950 mt-0.5">
                        Crisp recall of provision & exception
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Card Footer Navigation */}
            <div className="flex items-center justify-between pt-3 border-t border-cav-border/60 text-xs">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                }}
                className="px-3 py-1.5 rounded-lg bg-cav-card2 hover:bg-slate-800 disabled:opacity-40 border border-cav-border text-slate-300 font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setIsQuizFinished(true)}
                className="text-[11px] font-mono font-bold text-slate-400 hover:text-white underline cursor-pointer"
              >
                Finish & View Score Report Now
              </button>

              <button
                type="button"
                disabled={currentIndex + 1 >= activeCards.length}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => Math.min(activeCards.length - 1, prev + 1));
                }}
                className="px-3 py-1.5 rounded-lg bg-cav-card2 hover:bg-slate-800 disabled:opacity-40 border border-cav-border text-slate-300 font-bold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Skip / Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
