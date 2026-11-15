/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SubjectId, FlashcardRating, ConfidenceRatingValue } from '../types';
import { HIGH_YIELD_FLASHCARDS, Flashcard } from '../data/flashcards';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { 
  CheckCircle2, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  AlertTriangle,
  Flame,
  Cloud,
  Layers,
  ArrowRight,
  Compass,
  Star,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';

interface FlashcardsViewProps {
  subjectId: SubjectId;
  subjectName: string;
}

// 5-Point Confidence Rating Metadata adhering to professional ICAI CA Final grading standards
const CONFIDENCE_LEVELS: {
  value: ConfidenceRatingValue;
  label: string;
  shortLabel: string;
  colorClass: string;
  badgeClass: string;
  activeBtnClass: string;
  desc: string;
}[] = [
  {
    value: 1,
    label: 'Needs Urgent Work',
    shortLabel: '1★ Urgent',
    colorClass: 'text-rose-400',
    badgeClass: 'bg-rose-500/15 border-rose-500/40 text-rose-400',
    activeBtnClass: 'bg-rose-600 text-white border-rose-400 shadow-sm shadow-rose-900/50 ring-2 ring-rose-400/40',
    desc: 'High exam vulnerability: gaps in statutory provisions, exceptions, or reporting clauses.'
  },
  {
    value: 2,
    label: 'Shaky Understanding',
    shortLabel: '2★ Shaky',
    colorClass: 'text-orange-400',
    badgeClass: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
    activeBtnClass: 'bg-orange-600 text-white border-orange-400 shadow-sm shadow-orange-900/50 ring-2 ring-orange-400/40',
    desc: 'Partial recall: confused on numerical thresholds, time limits, or penalty provisions.'
  },
  {
    value: 3,
    label: 'Moderate Grasp',
    shortLabel: '3★ Moderate',
    colorClass: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 border-amber-500/40 text-amber-400',
    activeBtnClass: 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-sm shadow-amber-900/50 ring-2 ring-amber-400/40',
    desc: 'Clear understanding of core concept; needs refinement in exact professional keywords.'
  },
  {
    value: 4,
    label: 'Solid Confidence',
    shortLabel: '4★ Solid',
    colorClass: 'text-sky-400',
    badgeClass: 'bg-sky-500/15 border-sky-500/40 text-sky-400',
    activeBtnClass: 'bg-sky-500 text-slate-950 border-sky-300 font-black shadow-sm shadow-sky-900/50 ring-2 ring-sky-400/40',
    desc: 'Strong recall: able to draft precise 4–6 mark statutory answers accurately.'
  },
  {
    value: 5,
    label: 'Exam Mastered',
    shortLabel: '5★ Mastered',
    colorClass: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400',
    activeBtnClass: 'bg-emerald-500 text-slate-950 border-emerald-300 font-black shadow-sm shadow-emerald-900/50 ring-2 ring-emerald-400/40',
    desc: 'Flawless recall: authoritative command of sections, standards, and practical case studies.'
  }
];

export default function FlashcardsView({ subjectId, subjectName }: FlashcardsViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filterMode, setFilterMode] = useState<'All' | 'Weakest' | 'Moderate' | 'Mastered' | 'Unrated' | 'Review' | 'SessionMastered'>('All');
  
  // Track user mastering state in this session
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [needsReviewIds, setNeedsReviewIds] = useState<Set<string>>(new Set());
  
  // Track flipped cards indexes
  const [flippedIds, setFlippedIds] = useState<Set<string>>(new Set());
  
  // Card layout: single-card swiper, multi-card grid, or dedicated Weakest Concepts priority view
  const [layoutMode, setLayoutMode] = useState<'swiper' | 'grid' | 'weakest'>('swiper');
  const [swiperIndex, setSwiperIndex] = useState<number>(0);

  // Firestore & local persistence for Confidence Ratings
  const [ratingsMap, setRatingsMap] = useState<Record<string, FlashcardRating>>(() => {
    try {
      const cached = localStorage.getItem('practca_flashcard_ratings');
      return cached ? JSON.parse(cached) : {};
    } catch (e) {
      return {};
    }
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'local' | 'syncing' | 'error'>('local');

  // Listen to Firestore real-time ratings for authenticated user
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user && !user.isAnonymous) {
        setCloudSyncStatus('syncing');
        const colRef = collection(db, 'users', user.uid, 'flashcardRatings');
        const unsubscribeSnapshot = onSnapshot(
          colRef,
          (snapshot) => {
            const cloudRatings: Record<string, FlashcardRating> = {};
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as FlashcardRating;
              if (data && data.cardId && typeof data.rating === 'number') {
                cloudRatings[data.cardId] = data;
              }
            });
            setRatingsMap((prev) => {
              const merged = { ...prev, ...cloudRatings };
              try {
                localStorage.setItem('practca_flashcard_ratings', JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
            setCloudSyncStatus('synced');
          },
          (error) => {
            console.error('Failed to listen to flashcardRatings from Firestore:', error);
            handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/flashcardRatings`);
            setCloudSyncStatus('error');
          }
        );
        return () => unsubscribeSnapshot();
      } else {
        setCloudSyncStatus('local');
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Filter cards to current subject
  const currentSubjectCards = useMemo(() => {
    return HIGH_YIELD_FLASHCARDS.filter(card => card.subjectId === subjectId);
  }, [subjectId]);

  // Extract categories for filter with counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: currentSubjectCards.length };
    currentSubjectCards.forEach(c => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [currentSubjectCards]);

  const categories = useMemo(() => {
    const list = new Set<string>();
    currentSubjectCards.forEach(c => list.add(c.category));
    return ['All', ...Array.from(list)];
  }, [currentSubjectCards]);

  // Helper to get card rating
  const getCardRating = (cardId: string): ConfidenceRatingValue | undefined => {
    const cleanId = cardId.replace(/[^a-zA-Z0-9_]/g, '_');
    return ratingsMap[cleanId]?.rating;
  };

  // Aggregated confidence analytics for current subject
  const subjectRatingsAnalysis = useMemo(() => {
    const ratedCards: { card: Flashcard; rating: ConfidenceRatingValue; updatedAt?: string }[] = [];
    const weakestCards: { card: Flashcard; rating: ConfidenceRatingValue; updatedAt?: string }[] = [];
    const moderateCards: { card: Flashcard; rating: ConfidenceRatingValue; updatedAt?: string }[] = [];
    const strongCards: { card: Flashcard; rating: ConfidenceRatingValue; updatedAt?: string }[] = [];
    const unratedCards: Flashcard[] = [];

    let totalScore = 0;

    currentSubjectCards.forEach(card => {
      const cleanId = card.id.replace(/[^a-zA-Z0-9_]/g, '_');
      const ratingObj = ratingsMap[cleanId];
      if (ratingObj && typeof ratingObj.rating === 'number') {
        const r = ratingObj.rating as ConfidenceRatingValue;
        totalScore += r;
        ratedCards.push({ card, rating: r, updatedAt: ratingObj.updatedAt });
        if (r <= 2) {
          weakestCards.push({ card, rating: r, updatedAt: ratingObj.updatedAt });
        } else if (r === 3) {
          moderateCards.push({ card, rating: r, updatedAt: ratingObj.updatedAt });
        } else {
          strongCards.push({ card, rating: r, updatedAt: ratingObj.updatedAt });
        }
      } else {
        unratedCards.push(card);
      }
    });

    // Sort weakest cards by lowest rating first (1 then 2)
    weakestCards.sort((a, b) => a.rating - b.rating);

    const averageScore = ratedCards.length > 0 ? (totalScore / ratedCards.length).toFixed(1) : '—';
    const masteryPercentage = ratedCards.length > 0 ? Math.round((strongCards.length / currentSubjectCards.length) * 100) : 0;

    // Chapter-wise weakness matrix breakdown
    const chapterMatrix: Record<string, { total: number; weakCount: number; ratedCount: number; scoreSum: number }> = {};
    currentSubjectCards.forEach(card => {
      if (!chapterMatrix[card.category]) {
        chapterMatrix[card.category] = { total: 0, weakCount: 0, ratedCount: 0, scoreSum: 0 };
      }
      chapterMatrix[card.category].total += 1;
      const cleanId = card.id.replace(/[^a-zA-Z0-9_]/g, '_');
      const ratingObj = ratingsMap[cleanId];
      if (ratingObj && typeof ratingObj.rating === 'number') {
        chapterMatrix[card.category].ratedCount += 1;
        chapterMatrix[card.category].scoreSum += ratingObj.rating;
        if (ratingObj.rating <= 2) {
          chapterMatrix[card.category].weakCount += 1;
        }
      }
    });

    const chapterAnalysisList = Object.entries(chapterMatrix).map(([category, stats]) => {
      const avg = stats.ratedCount > 0 ? (stats.scoreSum / stats.ratedCount).toFixed(1) : '—';
      let urgency: 'Critical' | 'Priority' | 'Solid' | 'Unassessed' = 'Solid';
      if (stats.ratedCount === 0) {
        urgency = 'Unassessed';
      } else if (stats.weakCount >= 2) {
        urgency = 'Critical';
      } else if (stats.weakCount === 1) {
        urgency = 'Priority';
      }
      return {
        category,
        total: stats.total,
        weakCount: stats.weakCount,
        ratedCount: stats.ratedCount,
        avgScore: avg,
        urgency
      };
    });

    // Sort chapters by most weak concepts descending, then by critical urgency
    chapterAnalysisList.sort((a, b) => b.weakCount - a.weakCount);

    return {
      ratedCards,
      weakestCards,
      moderateCards,
      strongCards,
      unratedCards,
      averageScore,
      masteryPercentage,
      chapterAnalysisList
    };
  }, [currentSubjectCards, ratingsMap]);

  // Apply visual category and status filters
  const filteredCards = useMemo(() => {
    return currentSubjectCards.filter(card => {
      const matchCategory = selectedCategory === 'All' || card.category === selectedCategory;
      const cleanId = card.id.replace(/[^a-zA-Z0-9_]/g, '_');
      const r = ratingsMap[cleanId]?.rating;

      let matchStatus = true;
      if (filterMode === 'Weakest') {
        matchStatus = r !== undefined && r <= 2;
      } else if (filterMode === 'Moderate') {
        matchStatus = r === 3;
      } else if (filterMode === 'Mastered') {
        matchStatus = r !== undefined && r >= 4;
      } else if (filterMode === 'Unrated') {
        matchStatus = r === undefined;
      } else if (filterMode === 'Review') {
        matchStatus = needsReviewIds.has(card.id);
      } else if (filterMode === 'SessionMastered') {
        matchStatus = masteredIds.has(card.id);
      }

      return matchCategory && matchStatus;
    });
  }, [currentSubjectCards, selectedCategory, filterMode, ratingsMap, needsReviewIds, masteredIds]);

  const handleToggleFlip = (cardId: string) => {
    const next = new Set(flippedIds);
    if (next.has(cardId)) {
      next.delete(cardId);
    } else {
      next.add(cardId);
    }
    setFlippedIds(next);
  };

  // Confidence Rating handler persisting to Firestore & LocalStorage
  const handleRateCard = async (
    card: Flashcard, 
    ratingValue: ConfidenceRatingValue, 
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();

    const cleanId = card.id.replace(/[^a-zA-Z0-9_]/g, '_');
    const newRatingObj: FlashcardRating = {
      cardId: cleanId,
      subjectId,
      rating: ratingValue,
      conceptTitle: card.question.substring(0, 480),
      category: card.category.substring(0, 190),
      statutoryRef: card.statutoryRef.substring(0, 190),
      updatedAt: new Date().toISOString()
    };

    // Optimistically update state
    setRatingsMap(prev => {
      const updated = { ...prev, [cleanId]: newRatingObj };
      try {
        localStorage.setItem('practca_flashcard_ratings', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    // Mirror to session lists
    if (ratingValue >= 4) {
      setMasteredIds(prev => new Set([...prev, card.id]));
      setNeedsReviewIds(prev => {
        const next = new Set(prev);
        next.delete(card.id);
        return next;
      });
    } else if (ratingValue <= 2) {
      setNeedsReviewIds(prev => new Set([...prev, card.id]));
      setMasteredIds(prev => {
        const next = new Set(prev);
        next.delete(card.id);
        return next;
      });
    }

    // Persist to Cloud Firestore if user is authenticated
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous) {
      setIsSyncing(true);
      try {
        const docRef = doc(db, 'users', currentUser.uid, 'flashcardRatings', cleanId);
        await setDoc(docRef, newRatingObj, { merge: true });
        setCloudSyncStatus('synced');
      } catch (err) {
        console.error('Failed to persist flashcard rating to Firestore:', err);
        handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}/flashcardRatings/${cleanId}`);
        setCloudSyncStatus('error');
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleMarkMastered = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMastered = new Set(masteredIds);
    const nextReview = new Set(needsReviewIds);
    
    if (nextMastered.has(cardId)) {
      nextMastered.delete(cardId);
    } else {
      nextMastered.add(cardId);
      nextReview.delete(cardId);
    }
    
    setMasteredIds(nextMastered);
    setNeedsReviewIds(nextReview);
  };

  const handleMarkReview = (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextMastered = new Set(masteredIds);
    const nextReview = new Set(needsReviewIds);
    
    if (nextReview.has(cardId)) {
      nextReview.delete(cardId);
    } else {
      nextReview.add(cardId);
      nextReview.delete(cardId);
    }
    
    setMasteredIds(nextMastered);
    setNeedsReviewIds(nextReview);
  };

  const handleResetProgress = () => {
    setMasteredIds(new Set());
    setNeedsReviewIds(new Set());
    setFlippedIds(new Set());
    setSwiperIndex(0);
  };

  const handlePrevSwiper = () => {
    if (swiperIndex > 0) {
      setSwiperIndex(swiperIndex - 1);
    }
  };

  const handleNextSwiper = () => {
    if (swiperIndex < filteredCards.length - 1) {
      setSwiperIndex(swiperIndex + 1);
    }
  };

  // Jump to specific card in Swiper mode
  const handleJumpToCardInSwiper = (cardId: string) => {
    setSelectedCategory('All');
    setFilterMode('All');
    setLayoutMode('swiper');
    const targetIdx = currentSubjectCards.findIndex(c => c.id === cardId);
    if (targetIdx >= 0) {
      setSwiperIndex(targetIdx);
    } else {
      setSwiperIndex(0);
    }
  };

  // Drill only weak concepts
  const handleDrillWeakConcepts = () => {
    setSelectedCategory('All');
    setFilterMode('Weakest');
    setLayoutMode('swiper');
    setSwiperIndex(0);
  };

  // Get current swiper card
  const activeSwiperCard = filteredCards[swiperIndex] || filteredCards[0];

  // Reusable Confidence Rating Meter component (Single-row inline bar for fixed-height cards)
  const renderConfidenceMeter = (card: Flashcard, compact: boolean = false) => {
    const currentRating = getCardRating(card.id);
    const currentLevel = CONFIDENCE_LEVELS.find(l => l.value === currentRating);

    return (
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="flex flex-wrap items-center justify-between gap-2"
      >
        <div className="flex items-center gap-1.5 text-xs font-mono shrink-0">
          <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          <span className="text-slate-300 font-bold uppercase tracking-wider">Confidence:</span>
          {currentLevel ? (
            <span className={`px-2 py-0.5 rounded font-extrabold border text-[11px] ${currentLevel.badgeClass}`}>
              {currentLevel.shortLabel}
            </span>
          ) : (
            <span className="text-slate-500 italic text-[11px]">Unrated</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-1 max-w-md">
          {CONFIDENCE_LEVELS.map((lvl) => {
            const isSelected = currentRating === lvl.value;
            return (
              <button
                key={lvl.value}
                onClick={(e) => handleRateCard(card, lvl.value, e)}
                title={`${lvl.value} - ${lvl.label}: ${lvl.desc}`}
                className={`flex-1 h-8 px-2 rounded-lg border font-mono transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isSelected
                    ? lvl.activeBtnClass
                    : 'bg-slate-950/90 hover:bg-slate-850 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
              >
                <span className="text-xs font-black">{lvl.value}★</span>
                {!compact && (
                  <span className="text-[10px] tracking-tight hidden lg:inline uppercase font-bold truncate opacity-95">
                    {lvl.value === 1 ? 'Urgent' : lvl.value === 2 ? 'Shaky' : lvl.value === 3 ? 'Grasp' : lvl.value === 4 ? 'Solid' : 'Master'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2.5">
      
      {/* SINGLE-BAR COMPACT HEADER CONTROLS & FILTERS TOOLBAR */}
      <div className="p-2.5 sm:px-3.5 rounded-2xl bg-cav-card border border-cav-border shadow-xs max-w-5xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: Chapter Filter, Confidence Filter & Clear */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="h-8 flex items-center gap-1.5 bg-slate-900/90 px-2.5 rounded-lg border border-slate-800 text-xs">
              <Filter className="h-3.5 w-3.5 text-cav-accent shrink-0" />
              <span className="font-bold text-slate-400 shrink-0">Chapter:</span>
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSwiperIndex(0);
                }}
                className="bg-transparent border-0 text-white font-semibold focus:outline-none cursor-pointer text-xs max-w-[145px] sm:max-w-[190px] truncate"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-slate-950 text-white">
                    {cat} ({categoryCounts[cat] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="h-8 flex items-center gap-1.5 bg-slate-900/90 px-2.5 rounded-lg border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 shrink-0">Filter:</span>
              <select 
                value={filterMode} 
                onChange={(e) => {
                  setFilterMode(e.target.value as any);
                  setSwiperIndex(0);
                }}
                className="bg-transparent border-0 text-white font-semibold focus:outline-none cursor-pointer text-xs max-w-[140px] sm:max-w-[175px] truncate"
              >
                <option value="All" className="bg-slate-950 text-white">All Concepts ({currentSubjectCards.length})</option>
                <option value="Weakest" className="bg-slate-950 text-rose-400 font-bold">Weakest (&lt; 3★) ({subjectRatingsAnalysis.weakestCards.length})</option>
                <option value="Moderate" className="bg-slate-950 text-amber-400">Moderate (3★) ({subjectRatingsAnalysis.moderateCards.length})</option>
                <option value="Mastered" className="bg-slate-950 text-emerald-400">Mastered (4–5★) ({subjectRatingsAnalysis.strongCards.length})</option>
                <option value="Unrated" className="bg-slate-950 text-slate-400">Unrated ({subjectRatingsAnalysis.unratedCards.length})</option>
                <option value="Review" className="bg-slate-950 text-white">Marked Review ({needsReviewIds.size})</option>
                <option value="SessionMastered" className="bg-slate-950 text-white">Session Mastered ({masteredIds.size})</option>
              </select>
            </div>

            {(selectedCategory !== 'All' || filterMode !== 'All') && (
              <button
                onClick={() => { setSelectedCategory('All'); setFilterMode('All'); setSwiperIndex(0); }}
                className="h-8 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right: Metrics Pills + View Mode Segmented Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="h-8 px-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-1 text-xs">
              <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="text-slate-400 font-bold">Avg:</span>
              <span className="font-black text-white">{subjectRatingsAnalysis.averageScore}</span>
              <span className="text-[10px] text-slate-500 font-mono">/5</span>
            </div>

            {(masteredIds.size > 0 || needsReviewIds.size > 0) && (
              <button 
                onClick={handleResetProgress}
                className="h-8 px-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 cursor-pointer transition-colors flex items-center gap-1 text-xs font-bold"
                title="Reset session review/mastered flags"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            {/* View Modes Segmented Control */}
            <div className="flex items-center bg-slate-900/90 p-0.5 rounded-xl border border-slate-800 gap-0.5">
              <button
                onClick={() => { setLayoutMode('swiper'); setSwiperIndex(0); }}
                className={`h-7 px-2.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  layoutMode === 'swiper' 
                    ? 'bg-cav-accent text-slate-950 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Swipe</span>
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`h-7 px-2.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  layoutMode === 'grid' 
                    ? 'bg-cav-accent text-slate-950 shadow-xs' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setLayoutMode('weakest')}
                className={`h-7 px-2.5 text-xs font-black rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  layoutMode === 'weakest' 
                    ? 'bg-rose-500 text-white shadow-xs' 
                    : subjectRatingsAnalysis.weakestCards.length > 0 
                      ? 'text-rose-400 hover:bg-rose-500/10' 
                      : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Weakest</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-950 text-rose-300 font-mono">
                  {subjectRatingsAnalysis.weakestCards.length}
                </span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* WEAKEST CONCEPTS PRIORITY FOCUS VIEW */}
      {layoutMode === 'weakest' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Educator Diagnostic Overview Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    High-Risk Knowledge Gap Diagnostic
                  </h3>
                </div>
              </div>

              {subjectRatingsAnalysis.weakestCards.length > 0 && (
                <button
                  onClick={handleDrillWeakConcepts}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-rose-950/50 shrink-0 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Flame className="h-4 w-4" />
                  Drill Weakest Deck ({subjectRatingsAnalysis.weakestCards.length} Cards)
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Performance KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Weakest Concepts</div>
                <div className="text-xl font-black text-rose-400 mt-0.5">
                  {subjectRatingsAnalysis.weakestCards.length}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Rating 1★ or 2★</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Moderate Concepts</div>
                <div className="text-xl font-black text-amber-400 mt-0.5">
                  {subjectRatingsAnalysis.moderateCards.length}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Rating 3★</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Mastered Concepts</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5">
                  {subjectRatingsAnalysis.strongCards.length}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Rating 4★ or 5★</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Assessed Coverage</div>
                <div className="text-xl font-black text-white mt-0.5">
                  {subjectRatingsAnalysis.ratedCards.length} <span className="text-xs text-slate-500 font-normal">/ {currentSubjectCards.length}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {currentSubjectCards.length > 0 ? Math.round((subjectRatingsAnalysis.ratedCards.length / currentSubjectCards.length) * 100) : 0}% Rated
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Ranked Weakest Concepts Ledger (Structured Table) */}
          <div className="p-5 rounded-2xl bg-cav-card border border-cav-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-rose-400" />
                  Prioritized Weakest Concepts Ledger
                </h4>
              </div>
            </div>

            {subjectRatingsAnalysis.weakestCards.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-white">No Critical Weak Concepts Flagged</h5>
                </div>
                <button
                  onClick={() => { setLayoutMode('swiper'); setSwiperIndex(0); }}
                  className="px-4 py-2 bg-cav-accent text-slate-950 font-black text-xs rounded-xl hover:scale-105 transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Layers className="h-3.5 w-3.5" />
                  Start Evaluating Deck
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-3">#</th>
                      <th className="py-3 px-3">Statutory Ref</th>
                      <th className="py-3 px-4">Exam Concept Scenario</th>
                      <th className="py-3 px-3">Chapter</th>
                      <th className="py-3 px-3 text-center">Confidence</th>
                      <th className="py-3 px-3 text-center">Quick Re-Rate</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 bg-slate-900/60">
                    {subjectRatingsAnalysis.weakestCards.map((item, idx) => {
                      const level = CONFIDENCE_LEVELS.find(l => l.value === item.rating);
                      return (
                        <tr key={item.card.id} className="hover:bg-slate-850/50 transition-colors">
                          <td className="py-3 px-3 font-mono text-slate-500 font-bold">
                            {idx + 1}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-cav-accent whitespace-nowrap">
                            {item.card.statutoryRef}
                          </td>
                          <td className="py-3 px-4 text-slate-200 font-semibold max-w-md">
                            {item.card.question}
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {item.card.category}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-black border ${level?.badgeClass}`}>
                              {level?.shortLabel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                              {[1, 2, 3, 4, 5].map((val) => (
                                <button
                                  key={val}
                                  onClick={(e) => handleRateCard(item.card, val as ConfidenceRatingValue, e)}
                                  className={`h-5 w-5 rounded text-[10px] font-mono font-black transition-all cursor-pointer ${
                                    item.rating === val
                                      ? val <= 2
                                        ? 'bg-rose-500 text-white'
                                        : val === 3
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-emerald-500 text-slate-950'
                                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                  }`}
                                  title={`Re-rate as Level ${val}`}
                                >
                                  {val}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleJumpToCardInSwiper(item.card.id)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer border border-slate-700 inline-flex items-center gap-1"
                            >
                              Study Card <ChevronRight className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 2: Chapter-Wise Syllabus Vulnerability Diagnostic (Structured Table) */}
          <div className="p-5 rounded-2xl bg-cav-card border border-cav-border shadow-xs space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-cav-accent" />
                Chapter-Wise Syllabus Vulnerability Matrix
              </h4>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Syllabus Chapter / Standard Group</th>
                    <th className="py-3 px-3 text-center">Total Cards</th>
                    <th className="py-3 px-3 text-center">Weak Concepts (&lt; 3★)</th>
                    <th className="py-3 px-3 text-center">Avg Confidence</th>
                    <th className="py-3 px-3 text-center">Revision Urgency</th>
                    <th className="py-3 px-3 text-right">Drill Filter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 bg-slate-900/60">
                  {subjectRatingsAnalysis.chapterAnalysisList.map((chap) => (
                    <tr key={chap.category} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4 text-white font-bold font-sans">
                        {chap.category}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-400">
                        {chap.total}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold">
                        {chap.weakCount > 0 ? (
                          <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {chap.weakCount} Concepts
                          </span>
                        ) : (
                          <span className="text-emerald-400">0</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-black text-slate-200">
                        {chap.avgScore !== '—' ? `${chap.avgScore} / 5.0` : '—'}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {chap.urgency === 'Critical' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-rose-500/15 border border-rose-500/40 text-rose-400">
                            CRITICAL REVISION
                          </span>
                        ) : chap.urgency === 'Priority' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-orange-500/15 border border-orange-500/40 text-orange-400">
                            PRIORITY REVIEW
                          </span>
                        ) : chap.urgency === 'Unassessed' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                            UNASSESSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                            EXAM READY
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedCategory(chap.category);
                            setLayoutMode('swiper');
                            setSwiperIndex(0);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold rounded-lg text-[11px] transition-all cursor-pointer border border-slate-700 inline-flex items-center gap-1"
                        >
                          Filter Deck <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SWIPER DECK MODE RENDERING */}
      {layoutMode === 'swiper' && (
        <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
          
          {filteredCards.length === 0 ? (
            <div className="text-center p-10 bg-cav-card border border-cav-border rounded-2xl w-full space-y-3">
              <HelpCircle className="h-9 w-9 text-slate-500 mx-auto" />
              <p className="text-slate-300 font-bold text-base">No flashcards match your filter combinations.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setFilterMode('All'); }}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="w-full space-y-2.5">
              
              {/* HORIZONTAL DECK ROW: [LEFT PREV BUTTON] + [FIXED-SPACE FLASHCARD] + [RIGHT NEXT BUTTON] */}
              <div className="flex items-center gap-2.5 sm:gap-3.5 w-full">
                
                {/* LEFT END: PREVIOUS BUTTON */}
                <button
                  disabled={swiperIndex === 0}
                  onClick={handlePrevSwiper}
                  title="Previous Card"
                  className="flex flex-col items-center justify-center gap-1.5 px-3 sm:px-4 h-[180px] sm:h-[220px] rounded-2xl border-2 border-slate-800 bg-slate-900/95 hover:bg-slate-800 hover:border-cav-accent/50 text-slate-200 hover:text-white transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 group"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7 text-cav-accent group-hover:-translate-x-0.5 transition-transform" />
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider font-mono">Prev</span>
                </button>

                {/* FIXED-SPACE FLASHCARD CONTAINER — NEVER INCREASES OR DECREASES, 100% VISIBILITY */}
                <div 
                  onClick={() => handleToggleFlip(activeSwiperCard.id)}
                  className="flex-1 w-full h-[390px] sm:h-[410px] cursor-pointer rounded-2xl transition-colors duration-200 shadow-xl overflow-hidden"
                >
                  {/* FRONT OF CARD (The Question) */}
                  {!flippedIds.has(activeSwiperCard.id) ? (
                    <div className="w-full h-full p-5 sm:p-6 rounded-2xl bg-slate-900 border-2 border-slate-700/90 hover:border-cav-accent/40 flex flex-col justify-between shadow-xl overflow-hidden">
                      {/* Card Top Status & Badges Row */}
                      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-md bg-slate-950 text-white border border-slate-800">
                            Card {swiperIndex + 1} / {filteredCards.length}
                          </span>
                          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider bg-slate-950 py-1 px-3 border border-slate-700 text-slate-200 rounded-md">
                            {activeSwiperCard.statutoryRef}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="bg-slate-950 py-1 px-2.5 border border-slate-800 text-cav-accent font-mono font-bold rounded-md text-xs">
                            {activeSwiperCard.category}
                          </span>
                          <div className="flex items-center gap-1 bg-amber-500/15 text-amber-300 py-1 px-2.5 rounded-md font-mono text-xs font-extrabold uppercase border border-amber-500/30">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{activeSwiperCard.examImportance}</span>
                          </div>
                          <span className="text-slate-400 font-semibold hidden md:flex items-center gap-1 text-xs pl-1">
                            <Eye className="h-3.5 w-3.5 text-cav-accent" /> Flip Answer
                          </span>
                        </div>
                      </div>

                      {/* Middle Fixed Content Area */}
                      <div className="flex-1 flex flex-col justify-center py-3 space-y-2.5 overflow-hidden">
                        <span className="inline-block text-xs uppercase font-extrabold text-cav-accent font-mono tracking-wider">
                          Exam Scenario Concept:
                        </span>
                        <h4 className="text-lg sm:text-xl lg:text-2xl font-black text-white leading-relaxed font-sans">
                          {activeSwiperCard.question}
                        </h4>
                      </div>

                      {/* Single-Row Bottom Action & Confidence Bar */}
                      <div className="shrink-0 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex-1 min-w-[240px]">
                          {renderConfidenceMeter(activeSwiperCard)}
                        </div>

                        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleMarkReview(activeSwiperCard.id, e)}
                            className={`h-8 px-3 rounded-lg text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                              needsReviewIds.has(activeSwiperCard.id)
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {needsReviewIds.has(activeSwiperCard.id) ? '⚑ In Review' : 'Review'}
                          </button>
                          <button
                            onClick={(e) => handleMarkMastered(activeSwiperCard.id, e)}
                            className={`h-8 px-3 rounded-lg text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                              masteredIds.has(activeSwiperCard.id)
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-slate-950 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {masteredIds.has(activeSwiperCard.id) ? '✓ Mastered' : 'Master'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* BACK OF CARD (The Official Exam Answer — Fixed Space, Zero Scrollbar, 100% Visibility) */
                    <div className="w-full h-full p-5 sm:p-6 rounded-2xl bg-neutral-950 border-2 border-cav-accent/40 flex flex-col justify-between shadow-xl overflow-hidden">
                      {/* Card Top Status & Badges Row */}
                      <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-black px-2.5 py-1 rounded-md bg-slate-900 text-white border border-slate-800">
                            Card {swiperIndex + 1} / {filteredCards.length}
                          </span>
                          <span className="text-xs sm:text-sm font-mono font-bold tracking-wider bg-slate-900 px-3 py-1 rounded-md text-indigo-300 border border-slate-700">
                            {activeSwiperCard.statutoryRef}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 font-mono text-xs px-3 py-1 rounded-md font-extrabold uppercase border border-emerald-500/30">
                            <Award className="h-3.5 w-3.5" />
                            <span>Official Exam Answer</span>
                          </div>
                          <span className="text-slate-400 font-semibold hidden md:flex items-center gap-1 text-xs pl-1">
                            <EyeOff className="h-3.5 w-3.5 text-emerald-400" /> Flip Question
                          </span>
                        </div>
                      </div>

                      {/* Middle Fixed Content Area — Scaled for 100% Visibility without Scrollbars */}
                      <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden">
                        <div 
                          className="text-slate-100 text-sm sm:text-[15px] leading-snug [&_*]:!text-[13.5px] sm:[&_*]:!text-[14.5px] [&_*]:!leading-snug [&_p]:!mb-1.5 [&_ul]:!space-y-1 [&_li]:!leading-snug [&_div]:!p-2 [&_table]:!text-[13px] [&_td]:!p-1.5 [&_th]:!p-1.5 [&_strong]:!text-white [&_strong]:!font-extrabold"
                          dangerouslySetInnerHTML={{ __html: activeSwiperCard.answerHtml }}
                        />
                      </div>

                      {/* Single-Row Bottom Action & Confidence Bar */}
                      <div className="shrink-0 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex-1 min-w-[240px]">
                          {renderConfidenceMeter(activeSwiperCard)}
                        </div>

                        <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleMarkReview(activeSwiperCard.id, e)}
                            className={`h-8 px-3 rounded-lg text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                              needsReviewIds.has(activeSwiperCard.id)
                                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {needsReviewIds.has(activeSwiperCard.id) ? '⚑ In Review' : 'Review'}
                          </button>
                          <button
                            onClick={(e) => handleMarkMastered(activeSwiperCard.id, e)}
                            className={`h-8 px-3 rounded-lg text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                              masteredIds.has(activeSwiperCard.id)
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            }`}
                          >
                            {masteredIds.has(activeSwiperCard.id) ? '✓ Mastered' : 'Master'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT END: NEXT BUTTON */}
                <button
                  disabled={swiperIndex === filteredCards.length - 1}
                  onClick={handleNextSwiper}
                  title="Next Card"
                  className="flex flex-col items-center justify-center gap-1.5 px-3 sm:px-4 h-[180px] sm:h-[220px] rounded-2xl border-2 border-slate-800 bg-slate-900/95 hover:bg-slate-800 hover:border-cav-accent/50 text-slate-200 hover:text-white transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shrink-0 group"
                >
                  <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7 text-cav-accent group-hover:translate-x-0.5 transition-transform" />
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider font-mono">Next</span>
                </button>

              </div>

              {/* Deck Progress Indicator Dots */}
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xl">
                  {filteredCards.slice(0, 30).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSwiperIndex(idx)}
                      title={`Jump to Card ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer shrink-0 ${swiperIndex === idx ? 'w-6 bg-cav-accent' : 'w-2 bg-slate-800 hover:bg-slate-700'}`}
                    ></button>
                  ))}
                  {filteredCards.length > 30 && (
                    <span className="text-[11px] text-slate-400 font-mono font-bold ml-1">+{filteredCards.length - 30} more</span>
                  )}
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* GRID VIEW MODE RENDERING */}
      {layoutMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {filteredCards.length === 0 ? (
            <div className="col-span-full text-center p-10 bg-cav-card border border-cav-border rounded-2xl space-y-3">
              <HelpCircle className="h-9 w-9 text-slate-500 mx-auto" />
              <p className="text-slate-300 font-bold text-base">No flashcards match your filtering values.</p>
              <button
                onClick={() => { setSelectedCategory('All'); setFilterMode('All'); }}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredCards.map(card => {
              const isFlipped = flippedIds.has(card.id);
              const isMastered = masteredIds.has(card.id);
              const isReview = needsReviewIds.has(card.id);
              const currentRating = getCardRating(card.id);
              const currentLevel = CONFIDENCE_LEVELS.find(l => l.value === currentRating);

              return (
                <div 
                  key={card.id}
                  onClick={() => handleToggleFlip(card.id)}
                  className={`p-5 rounded-2xl border-2 transition-colors duration-200 cursor-pointer flex flex-col justify-between h-[330px] overflow-hidden ${
                    isFlipped 
                      ? 'bg-slate-950 border-cav-accent/40'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-mono font-bold tracking-wider bg-slate-950 py-1 px-2.5 rounded-md text-slate-300 border border-slate-800">
                      {card.statutoryRef}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {currentLevel && (
                        <span className={`text-xs px-2 py-0.5 rounded-md font-bold font-mono border ${currentLevel.badgeClass}`}>
                          {currentLevel.shortLabel}
                        </span>
                      )}
                      <span className="text-xs bg-slate-950 text-cav-accent border border-slate-800 py-1 px-2.5 rounded-md font-bold font-mono">
                        {card.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center py-2 overflow-hidden">
                    {!isFlipped ? (
                      <h4 className="text-base sm:text-lg font-black text-white leading-relaxed">
                        {card.question}
                      </h4>
                    ) : (
                      <div 
                        className="text-slate-100 text-xs sm:text-sm select-all leading-snug [&_*]:!text-xs sm:[&_*]:!text-[13px] [&_*]:!leading-snug [&_p]:!mb-1 [&_ul]:!space-y-1 [&_div]:!p-1.5 [&_table]:!text-[11.5px] [&_td]:!p-1 [&_th]:!p-1 [&_strong]:!text-white"
                        dangerouslySetInnerHTML={{ __html: card.answerHtml }}
                      />
                    )}
                  </div>

                  <div className="shrink-0 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {renderConfidenceMeter(card, true)}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleMarkReview(card.id, e)}
                        className={`h-7 px-2.5 rounded-lg font-extrabold text-xs cursor-pointer ${
                          isReview
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        Review
                      </button>
                      <button
                        onClick={(e) => handleMarkMastered(card.id, e)}
                        className={`h-7 px-2.5 rounded-lg font-extrabold text-xs cursor-pointer ${
                          isMastered
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-850'
                        }`}
                      >
                        {isMastered ? '✓ Mastered' : 'Master'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
