/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SubjectId } from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { motion, AnimatePresence } from 'motion/react';
import { 
  READY_THEORY_QUESTIONS, 
  TheoryQuestion, 
  evaluateAnswerOffline, 
  EvaluationResult,
  getTheoryQuestionsBySubject 
} from '../data/theoryAuditorQuestions';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Award,
  RotateCcw, 
  Check, 
  FileText, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  HelpCircle,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface TheoryTestingViewProps {
  subjectId: SubjectId;
  subjectName: string;
}

export default function TheoryTestingView({ subjectId, subjectName }: TheoryTestingViewProps) {
  const subjectMetadata = SUBJECTS_METADATA[subjectId];
  
  // Available questions for this subject
  const subjectQuestions = useMemo(() => {
    const questions = getTheoryQuestionsBySubject(subjectId);
    // If no specific questions exist yet for this subject, fallback to all available questions so user always has ready content
    return questions.length > 0 ? questions : READY_THEORY_QUESTIONS;
  }, [subjectId]);

  // Extract unique chapters with questions
  const availableChapters = useMemo(() => {
    const chaptersSet = new Set<string>();
    subjectQuestions.forEach(q => chaptersSet.add(q.chapterName));
    return ['All Chapters', ...Array.from(chaptersSet)];
  }, [subjectQuestions]);

  // Filter & Search states
  const [selectedChapter, setSelectedChapter] = useState<string>('All Chapters');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active question & evaluation states
  const [selectedQuestion, setSelectedQuestion] = useState<TheoryQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [showSuggestedAnswer, setShowSuggestedAnswer] = useState<boolean>(false);
  const [showCoordinateHints, setShowCoordinateHints] = useState<boolean>(false);

  // Reset when subject changes
  useEffect(() => {
    setSelectedChapter('All Chapters');
    setSearchQuery('');
    setSelectedQuestion(null);
    setUserAnswer('');
    setEvaluation(null);
    setShowSuggestedAnswer(false);
    setShowCoordinateHints(false);
  }, [subjectId]);

  // Filter questions based on chapter and search query
  const filteredQuestions = useMemo(() => {
    return subjectQuestions.filter(q => {
      const matchesChapter = selectedChapter === 'All Chapters' || q.chapterName === selectedChapter;
      const qText = `${q.title} ${q.chapterName} ${q.question} ${q.icaiExamRef || ''} ${q.keyConcepts.map(c => c.keyword).join(' ')}`.toLowerCase();
      const matchesSearch = searchQuery.trim() === '' || qText.includes(searchQuery.toLowerCase());
      return matchesChapter && matchesSearch;
    });
  }, [subjectQuestions, selectedChapter, searchQuery]);

  // Select a question to attempt
  const handleSelectQuestion = (q: TheoryQuestion) => {
    setSelectedQuestion(q);
    setUserAnswer('');
    setEvaluation(null);
    setShowSuggestedAnswer(false);
    setShowCoordinateHints(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Evaluate answer locally & instantly
  const handleEvaluateAnswer = async () => {
    if (!selectedQuestion || !userAnswer.trim()) return;

    setEvaluating(true);

    // Try server-side evaluation if available, but smoothly fallback to instant offline evaluation
    try {
      const response = await fetch('/api/theory/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: selectedQuestion.question,
          chapterName: selectedQuestion.chapterName,
          userAnswer,
          keyConcepts: selectedQuestion.keyConcepts
        })
      });

      if (response.ok) {
        const data: EvaluationResult = await response.json();
        setEvaluation(data);
        setShowSuggestedAnswer(true);
        setEvaluating(false);
        return;
      }
    } catch {
      // Fallback to offline evaluation
    }

    // Offline evaluation
    const result = evaluateAnswerOffline(selectedQuestion, userAnswer);
    setEvaluation(result);
    setShowSuggestedAnswer(true);
    setEvaluating(false);
  };

  // Re-attempt current question
  const handleReattempt = () => {
    setUserAnswer('');
    setEvaluation(null);
    setShowSuggestedAnswer(false);
  };

  // Next question navigation
  const handleNextQuestion = () => {
    if (!selectedQuestion) return;
    const currentIndex = subjectQuestions.findIndex(q => q.id === selectedQuestion.id);
    const nextIndex = (currentIndex + 1) % subjectQuestions.length;
    handleSelectQuestion(subjectQuestions[nextIndex]);
  };

  // Helper styles for score coloring
  const getScoreColorClass = (score: number) => {
    if (score >= 75) return 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 45) return 'text-amber-500 border-amber-500/30 bg-amber-500/5';
    return 'text-rose-500 border-rose-500/30 bg-rose-500/5';
  };

  return (
    <div id="theory-testing-container" className="space-y-6 animate-fadeIn">
      
      {/* ========================================================================= */}
      {/* 1. QUESTION SELECTION LIST VIEW (When no question is actively selected)    */}
      {/* ========================================================================= */}
      {!selectedQuestion && (
        <div className="space-y-6">
          {/* Header Card with Subject & Stats */}
          <div 
            id="theory-lobby-card" 
            className="p-6 rounded-2xl border border-slate-800 bg-slate-950 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 h-36 w-36 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-wider">
                    READY-MADE QUESTION BANK
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    • {subjectName}
                  </span>
                </div>
                <h3 className="font-display font-black text-white text-lg">
                  AI Theory & Case Scenario Auditor
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-base font-black text-amber-500 font-display">
                    {subjectQuestions.length}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Ready Questions
                  </div>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-900 mt-6">
              {/* Chapter Filter Dropdown */}
              <div className="sm:w-72">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-amber-500" /> Filter by Chapter
                </label>
                <select
                  id="theory-chapter-filter"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-[#00f3ff] hover:border-amber-500/50 transition-all cursor-pointer outline-none font-bold"
                >
                  {availableChapters.map((ch, idx) => {
                    const count = ch === 'All Chapters' 
                      ? subjectQuestions.length 
                      : subjectQuestions.filter(q => q.chapterName === ch).length;
                    return (
                      <option key={idx} value={ch} className="text-[#00f3ff] bg-[#07090f]">
                        {ch} ({count})
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Search Bar */}
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 font-mono flex items-center gap-1.5">
                  <Search className="h-3 w-3 text-amber-500" /> Search Concepts / Standards / Sections
                </label>
                <div className="relative">
                  <input
                    id="theory-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. SA 560, Section 143(12), SQC 1, BRSR, Fraud, CARO..."
                    className="w-full text-xs font-medium px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 focus:border-amber-500 outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* List of Ready Questions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Showing {filteredQuestions.length} of {subjectQuestions.length} Questions</span>
              {selectedChapter !== 'All Chapters' && (
                <button 
                  onClick={() => setSelectedChapter('All Chapters')}
                  className="text-amber-500 hover:underline cursor-pointer"
                >
                  Show all chapters
                </button>
              )}
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-slate-800 bg-slate-950 space-y-3">
                <BrainCircuit className="h-8 w-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No questions match your filter</p>
                <button
                  onClick={() => { setSelectedChapter('All Chapters'); setSearchQuery(''); }}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-amber-500 hover:bg-slate-800 transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredQuestions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    id={`theory-q-card-${q.id}`}
                    onClick={() => handleSelectQuestion(q)}
                    className="group p-5 rounded-2xl border border-slate-800 bg-slate-950/80 hover:bg-slate-900/60 hover:border-amber-500/50 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 tracking-wide font-mono uppercase">
                          {q.chapterName}
                        </span>
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[9px] font-mono font-bold uppercase border ${
                          q.difficulty === 'Mastery' 
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                            : q.difficulty === 'Advanced' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {q.difficulty}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 font-semibold">
                          {q.marks} Marks
                        </span>
                        {q.icaiExamRef && (
                          <span className="text-[10px] font-mono text-slate-500">
                            • {q.icaiExamRef}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                        {q.title}
                      </h4>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {q.question}
                      </p>

                      {/* Key Target Concepts Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {q.keyConcepts.slice(0, 4).map((concept, cIdx) => (
                          <span 
                            key={cIdx} 
                            className="inline-flex items-center text-[9px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {concept.keyword}
                          </span>
                        ))}
                        {q.keyConcepts.length > 4 && (
                          <span className="text-[9px] font-mono text-slate-500 self-center">
                            +{q.keyConcepts.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                      <span className="text-xs font-bold text-amber-500 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1 font-mono">
                        Attempt <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTIVE QUESTION ATTEMPT & EVALUATION WORKSPACE                         */}
      {/* ========================================================================= */}
      {selectedQuestion && (
        <div id="theory-active-workspace" className="space-y-6">
          
          {/* Top Bar: Back button, navigation & question meta */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-950">
            <button
              id="theory-back-to-list-btn"
              onClick={() => {
                setSelectedQuestion(null);
                setEvaluation(null);
                setUserAnswer('');
                setShowSuggestedAnswer(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-slate-700 transition cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Questions
            </button>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-500">
                {selectedQuestion.chapterName}
              </span>
              <span className="text-slate-400 font-bold">
                {selectedQuestion.marks} Marks
              </span>
            </div>

            <button
              id="theory-next-q-btn"
              onClick={handleNextQuestion}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 inline-flex items-center gap-1 cursor-pointer transition"
            >
              Next Question <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Question Scenario Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                  Exam Scenario / Case Question
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {selectedQuestion.title}
                </h3>
              </div>
              {selectedQuestion.icaiExamRef && (
                <span className="text-[10px] font-mono text-amber-400/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10">
                  {selectedQuestion.icaiExamRef}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                {selectedQuestion.question}
              </p>
            </div>

            {/* Target Coordinate Hints Toggle */}
            <div className="pt-3 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-[10px] text-slate-400 font-mono">
                Mandatory coordinates in model answer: {selectedQuestion.keyConcepts.length} concepts
              </div>
              <button
                onClick={() => setShowCoordinateHints(!showCoordinateHints)}
                className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-400 hover:text-amber-400 transition cursor-pointer self-start sm:self-auto"
              >
                {showCoordinateHints ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                {showCoordinateHints ? 'Hide Hints' : 'Peek Concept Hints'}
              </button>
            </div>

            {showCoordinateHints && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2"
              >
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider font-mono block">
                  Target Statutory Keywords / Sections:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuestion.keyConcepts.map((item, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-bold bg-slate-950 border border-slate-800 text-slate-300 font-mono"
                    >
                      <span className="text-amber-500">{item.category}:</span> {item.keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* User Answer Drafting Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Draft Your Answer Below
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">
                IGNORE GRAMMAR PENALTIES
              </span>
            </div>

            <textarea
              id="theory-user-answer"
              rows={8}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={evaluating}
              placeholder="E.g., 1. As per the provisions of SA 560 / Section 143... 
2. In this case, the condition existed on the balance sheet date, making it an adjusting event under Ind AS 10...
3. The auditor should request management to adjust the financial statements. If management refuses, the auditor must modify the audit report under SA 705..."
              className="w-full text-xs sm:text-sm font-semibold p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 hover:border-amber-500/50 focus:border-amber-500 outline-none transition-colors font-sans leading-relaxed resize-y"
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <span className="text-[10px] text-slate-400 font-mono">
                Words Drafted: {userAnswer.trim().split(/\s+/).filter(Boolean).length}
              </span>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {userAnswer && (
                  <button
                    onClick={() => setUserAnswer('')}
                    className="flex-1 sm:flex-initial text-center text-xs font-bold text-slate-400 hover:text-white py-2 px-3 border border-slate-800 rounded-lg cursor-pointer transition-colors"
                  >
                    Clear Draft
                  </button>
                )}

                <button
                  id="submit-answer-btn"
                  onClick={handleEvaluateAnswer}
                  disabled={evaluating || !userAnswer.trim()}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  {evaluating ? (
                    <>
                      <div className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin mr-1"></div>
                      Auditing Retention...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="h-4 w-4" />
                      Submit & Audit Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. EVALUATION REPORT & SUGGESTED ANSWER SECTION                          */}
          {/* ========================================================================= */}
          <AnimatePresence>
            {evaluation && (
              <motion.div
                id="theory-report-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Visual Dashboard Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Performance Score Circle Card */}
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-center space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Concept Clarity / Retention
                    </span>
                    
                    <div className={`mt-2 h-24 w-24 rounded-full border-4 flex flex-col items-center justify-center font-display ${getScoreColorClass(evaluation.efficiencyScore)}`}>
                      <span className="text-2xl font-black">{evaluation.efficiencyScore}%</span>
                      <span className="text-[8px] uppercase tracking-wide font-bold">Accuracy</span>
                    </div>

                    <div className="pt-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-bold font-mono tracking-wider uppercase border ${
                        evaluation.efficiencyScore >= 75 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' :
                        evaluation.efficiencyScore >= 45 ? 'text-amber-500 border-amber-500/30 bg-amber-500/5' :
                        'text-rose-500 border-rose-500/20 bg-rose-500/5'
                      }`}>
                        {evaluation.efficiencyScore >= 75 ? 'APPROVED RETENTION' :
                         evaluation.efficiencyScore >= 45 ? 'CONCEPT FEASIBLE' :
                         'REV RE-AUDIT NEEDED'}
                      </span>
                    </div>
                  </div>

                  {/* Remarks & Executive Analysis Card */}
                  <div className="md:col-span-2 p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-500 font-mono text-[9px] uppercase font-bold tracking-widest block mb-1">
                        <TrendingUp className="h-3 w-3" /> Audit Evaluation Synthesis
                      </div>
                      <h4 className="font-display font-bold text-white text-xs sm:text-sm">
                        Executive Analysis of Answer Substance
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2 whitespace-pre-wrap">
                        {evaluation.efficiencyReasoning}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Ignoring grammar limitations</span>
                      <span>Statutory Matching Engine v2.0</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Checklist: Section, standard, provision matches */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500" />
                    Detailed Statutory Provision Matching Checklist
                  </h4>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    {evaluation.matchedConcepts.map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 ${
                          item.matched 
                            ? 'bg-emerald-500/5 border-emerald-500/15' 
                            : 'bg-rose-500/5 border-rose-500/15'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-wider font-mono ${
                              item.matched ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
                            }`}>
                              {item.category}: {item.keyword}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">
                            {item.comment}
                          </p>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5 self-start sm:self-auto uppercase font-mono font-bold text-[9px]">
                          {item.matched ? (
                            <span className="flex items-center gap-1 text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" /> RECOGNIZED (+1)
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-rose-400">
                              <XCircle className="h-4 w-4" /> OMITTED (0)
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions and Critical Misses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Missed key provisions */}
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-[9px] uppercase font-bold tracking-widest">
                      <AlertCircle className="h-4 w-4" /> Crucial Law Suffixes Missed
                    </div>
                    <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wide">
                      Omitted Statutory Citations
                    </h4>
                    
                    {evaluation.criticalMisses.length === 0 ? (
                      <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                        <Check className="h-4 w-4" /> Core citations perfectly captured! Zero structural misses.
                      </div>
                    ) : (
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {evaluation.criticalMisses.map((miss, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-[11px] leading-relaxed">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0 mt-2"></span>
                            <span>{miss}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Suggestions for improvement */}
                  <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                    <div className="flex items-center gap-2 text-amber-500 font-mono text-[9px] uppercase font-bold tracking-widest">
                      <Award className="h-4 w-4" /> Advice to score 100%
                    </div>
                    <h4 className="font-display font-semibold text-white text-xs uppercase tracking-wide">
                      Retention Improvement Roadmap
                    </h4>

                    <ul className="space-y-2.5 text-xs text-slate-300">
                      {evaluation.suggestions.map((sug, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-[11.5px] leading-relaxed">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0 mt-2"></span>
                          <span>{sug}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* SUGGESTED ANSWER SECTION */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white uppercase tracking-wider">
                          Suggested Model Answer
                        </h4>
                        <p className="text-[9px] text-slate-400 font-mono">
                          Standard solution formatted to ICAI evaluation benchmarks
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowSuggestedAnswer(!showSuggestedAnswer)}
                      className="text-xs font-bold text-amber-500 hover:text-amber-400 font-mono cursor-pointer transition-colors px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg inline-flex items-center gap-1.5"
                    >
                      {showSuggestedAnswer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      {showSuggestedAnswer ? 'Hide Solution' : 'Reveal Solution'}
                    </button>
                  </div>

                  {showSuggestedAnswer && (
                    <motion.div 
                      id="suggested-answer-box"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-200 whitespace-pre-wrap font-sans font-medium"
                    >
                      {selectedQuestion.shortSuggestedAnswer}
                    </motion.div>
                  )}
                </div>

                {/* Action Buttons: Re-attempt or Pick Another */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <button
                    onClick={handleReattempt}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase font-mono tracking-wider transition cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Re-attempt This Question
                  </button>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setSelectedQuestion(null);
                        setEvaluation(null);
                        setUserAnswer('');
                      }}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs uppercase font-mono tracking-wider transition cursor-pointer"
                    >
                      <BookOpen className="h-3.5 w-3.5" /> Select Another Question
                    </button>

                    <button
                      onClick={handleNextQuestion}
                      className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase font-mono tracking-wider transition cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      Next Question <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

    </div>
  );
}
