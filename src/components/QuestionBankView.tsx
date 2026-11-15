import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Download,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Filter,
  RotateCcw,
  Bookmark,
  Lock,
} from 'lucide-react';
import { doc, setDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { BookmarkedQuestion, SubjectId } from '../types';
import { isSubjectLockedAfterFinalExam } from '../utils/taskCompletionSync';
import { StudyVaultTabId } from './StudyVaultInterconnectBar';
import {
  ATTEMPT_LIST,
  SUBJECT_CHAPTERS_MAP,
  INITIAL_PAST_PAPER_QUESTION_BANK,
  AttemptCode,
  SubjectShortCode,
  ExtractedPastPaperQuestion,
} from '../data/pastPapersQuestionBank';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';
import { getDefaultSubjectForLevel } from '../utils/levelStorage';

export interface QuestionBankViewProps {
  subjectCode?: SubjectShortCode | null;
  onSelectSubjectCode?: (code: SubjectShortCode | null) => void;
  bookmarkedQuestions?: BookmarkedQuestion[];
  onToggleQuestionBookmark?: (bookmark: BookmarkedQuestion) => void;
  onNavigateStudyVault?: (targetTab: StudyVaultTabId, subjectId: SubjectId) => void;
}

export const SUBJECT_BANK_META: Record<
  SubjectShortCode,
  {
    id: string;
    code: SubjectShortCode;
    paperNumber: string;
    fullName: string;
    group: 'Group I' | 'Group II' | 'Unified';
  }
> = {
  FR: {
    id: 'FR',
    code: 'FR',
    paperNumber: 'Paper 1',
    fullName: 'Financial Reporting',
    group: 'Group I',
  },
  AFM: {
    id: 'AFM',
    code: 'AFM',
    paperNumber: 'Paper 2',
    fullName: 'Advanced Financial Management',
    group: 'Group I',
  },
  Audit: {
    id: 'AUD',
    code: 'Audit',
    paperNumber: 'Paper 3',
    fullName: 'Advanced Auditing, Assurance & Professional Ethics',
    group: 'Group I',
  },
  DT: {
    id: 'DT',
    code: 'DT',
    paperNumber: 'Paper 4',
    fullName: 'Direct Tax Laws & International Taxation',
    group: 'Group II',
  },
  IDT: {
    id: 'IDT',
    code: 'IDT',
    paperNumber: 'Paper 5',
    fullName: 'Indirect Tax Laws',
    group: 'Group II',
  },
  IBS: {
    id: 'IBS',
    code: 'IBS',
    paperNumber: 'Paper 6',
    fullName: 'Integrated Business Solutions',
    group: 'Group II',
  },
  AdvAcc: {
    id: 'AdvAcc',
    code: 'AdvAcc',
    paperNumber: 'Paper 1',
    fullName: SUBJECTS_METADATA.AdvAcc.fullName,
    group: 'Group I',
  },
  CorpLaw: {
    id: 'CorpLaw',
    code: 'CorpLaw',
    paperNumber: 'Paper 2',
    fullName: SUBJECTS_METADATA.CorpLaw.fullName,
    group: 'Group I',
  },
  Tax: {
    id: 'Tax',
    code: 'Tax',
    paperNumber: 'Paper 3',
    fullName: SUBJECTS_METADATA.Tax.fullName,
    group: 'Group I',
  },
  Cost: {
    id: 'Cost',
    code: 'Cost',
    paperNumber: 'Paper 4',
    fullName: SUBJECTS_METADATA.Cost.fullName,
    group: 'Group II',
  },
  AuditInter: {
    id: 'AuditInter',
    code: 'AuditInter',
    paperNumber: 'Paper 5',
    fullName: SUBJECTS_METADATA.AuditInter.fullName,
    group: 'Group II',
  },
  FMSM: {
    id: 'FMSM',
    code: 'FMSM',
    paperNumber: 'Paper 6',
    fullName: SUBJECTS_METADATA.FMSM.fullName,
    group: 'Group II',
  },
  Accounts: {
    id: 'Accounts',
    code: 'Accounts',
    paperNumber: 'Paper 1',
    fullName: SUBJECTS_METADATA.Accounts.fullName,
    group: 'Unified',
  },
  Law: {
    id: 'Law',
    code: 'Law',
    paperNumber: 'Paper 2',
    fullName: SUBJECTS_METADATA.Law.fullName,
    group: 'Unified',
  },
  MathStats: {
    id: 'MathStats',
    code: 'MathStats',
    paperNumber: 'Paper 3',
    fullName: SUBJECTS_METADATA.MathStats.fullName,
    group: 'Unified',
  },
  Econ: {
    id: 'Econ',
    code: 'Econ',
    paperNumber: 'Paper 4',
    fullName: SUBJECTS_METADATA.Econ.fullName,
    group: 'Unified',
  },
  // CMA Foundation (4 Papers)
  CMAFoundLaw: {
    id: 'CMAFoundLaw',
    code: 'CMAFoundLaw',
    paperNumber: 'Paper 1',
    fullName: SUBJECTS_METADATA.CMAFoundLaw.fullName,
    group: 'Unified',
  },
  CMAFoundAcc: {
    id: 'CMAFoundAcc',
    code: 'CMAFoundAcc',
    paperNumber: 'Paper 2',
    fullName: SUBJECTS_METADATA.CMAFoundAcc.fullName,
    group: 'Unified',
  },
  CMAFoundMath: {
    id: 'CMAFoundMath',
    code: 'CMAFoundMath',
    paperNumber: 'Paper 3',
    fullName: SUBJECTS_METADATA.CMAFoundMath.fullName,
    group: 'Unified',
  },
  CMAFoundEcon: {
    id: 'CMAFoundEcon',
    code: 'CMAFoundEcon',
    paperNumber: 'Paper 4',
    fullName: SUBJECTS_METADATA.CMAFoundEcon.fullName,
    group: 'Unified',
  },
  // CMA Intermediate (4+4 = 8 Papers)
  CMAInterLaw: {
    id: 'CMAInterLaw',
    code: 'CMAInterLaw',
    paperNumber: 'Paper 5',
    fullName: SUBJECTS_METADATA.CMAInterLaw.fullName,
    group: 'Group I',
  },
  CMAInterFA: {
    id: 'CMAInterFA',
    code: 'CMAInterFA',
    paperNumber: 'Paper 6',
    fullName: SUBJECTS_METADATA.CMAInterFA.fullName,
    group: 'Group I',
  },
  CMAInterTax: {
    id: 'CMAInterTax',
    code: 'CMAInterTax',
    paperNumber: 'Paper 7',
    fullName: SUBJECTS_METADATA.CMAInterTax.fullName,
    group: 'Group I',
  },
  CMAInterCost: {
    id: 'CMAInterCost',
    code: 'CMAInterCost',
    paperNumber: 'Paper 8',
    fullName: SUBJECTS_METADATA.CMAInterCost.fullName,
    group: 'Group I',
  },
  CMAInterOMSM: {
    id: 'CMAInterOMSM',
    code: 'CMAInterOMSM',
    paperNumber: 'Paper 9',
    fullName: SUBJECTS_METADATA.CMAInterOMSM.fullName,
    group: 'Group II',
  },
  CMAInterCAA: {
    id: 'CMAInterCAA',
    code: 'CMAInterCAA',
    paperNumber: 'Paper 10',
    fullName: SUBJECTS_METADATA.CMAInterCAA.fullName,
    group: 'Group II',
  },
  CMAInterFMDA: {
    id: 'CMAInterFMDA',
    code: 'CMAInterFMDA',
    paperNumber: 'Paper 11',
    fullName: SUBJECTS_METADATA.CMAInterFMDA.fullName,
    group: 'Group II',
  },
  CMAInterMA: {
    id: 'CMAInterMA',
    code: 'CMAInterMA',
    paperNumber: 'Paper 12',
    fullName: SUBJECTS_METADATA.CMAInterMA.fullName,
    group: 'Group II',
  },
  // CMA Final (4+4 = 8 Papers)
  CMAFinalLaw: {
    id: 'CMAFinalLaw',
    code: 'CMAFinalLaw',
    paperNumber: 'Paper 13',
    fullName: SUBJECTS_METADATA.CMAFinalLaw.fullName,
    group: 'Group I',
  },
  CMAFinalSFM: {
    id: 'CMAFinalSFM',
    code: 'CMAFinalSFM',
    paperNumber: 'Paper 14',
    fullName: SUBJECTS_METADATA.CMAFinalSFM.fullName,
    group: 'Group I',
  },
  CMAFinalDT: {
    id: 'CMAFinalDT',
    code: 'CMAFinalDT',
    paperNumber: 'Paper 15',
    fullName: SUBJECTS_METADATA.CMAFinalDT.fullName,
    group: 'Group I',
  },
  CMAFinalSCM: {
    id: 'CMAFinalSCM',
    code: 'CMAFinalSCM',
    paperNumber: 'Paper 16',
    fullName: SUBJECTS_METADATA.CMAFinalSCM.fullName,
    group: 'Group I',
  },
  CMAFinalCMA: {
    id: 'CMAFinalCMA',
    code: 'CMAFinalCMA',
    paperNumber: 'Paper 17',
    fullName: SUBJECTS_METADATA.CMAFinalCMA.fullName,
    group: 'Group II',
  },
  CMAFinalCFR: {
    id: 'CMAFinalCFR',
    code: 'CMAFinalCFR',
    paperNumber: 'Paper 18',
    fullName: SUBJECTS_METADATA.CMAFinalCFR.fullName,
    group: 'Group II',
  },
  CMAFinalIDT: {
    id: 'CMAFinalIDT',
    code: 'CMAFinalIDT',
    paperNumber: 'Paper 19',
    fullName: SUBJECTS_METADATA.CMAFinalIDT.fullName,
    group: 'Group II',
  },
  CMAFinalSPBV: {
    id: 'CMAFinalSPBV',
    code: 'CMAFinalSPBV',
    paperNumber: 'Paper 20',
    fullName: SUBJECTS_METADATA.CMAFinalSPBV.fullName,
    group: 'Group II',
  },
};

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  subjectCode,
  onSelectSubjectCode,
  bookmarkedQuestions: externalBookmarks,
  onToggleQuestionBookmark,
  onNavigateStudyVault,
}) => {
  const caLevel = useCALevel();
  const [internalSubject, setInternalSubject] = useState<SubjectShortCode>(() =>
    getDefaultSubjectForLevel(caLevel)
  );
  const activeSubjectCode: SubjectShortCode = subjectCode || internalSubject;

  const [questionBank, setQuestionBank] = useState<ExtractedPastPaperQuestion[]>(
    INITIAL_PAST_PAPER_QUESTION_BANK
  );
  const [selectedChapter, setSelectedChapter] = useState<string>('ALL');
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptCode | 'ALL'>('ALL');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [localBookmarks, setLocalBookmarks] = useState<BookmarkedQuestion[]>(() => {
    try {
      const raw = localStorage.getItem('practca_bookmarked_questions');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const activeBookmarks = externalBookmarks ?? localBookmarks;

  // Real-time Firestore listener and cross-tab sync when standalone
  useEffect(() => {
    if (externalBookmarks !== undefined) return;

    const syncFromLocalStorage = () => {
      try {
        const raw = localStorage.getItem('practca_bookmarked_questions');
        if (raw) setLocalBookmarks(JSON.parse(raw));
      } catch {}
    };

    window.addEventListener('practca_bookmarked_questions_updated', syncFromLocalStorage);
    window.addEventListener('storage', syncFromLocalStorage);

    let unsubscribeFirestore: (() => void) | null = null;
    if (auth.currentUser?.uid) {
      const uid = auth.currentUser.uid;
      const colRef = collection(db, 'users', uid, 'bookmarkedQuestions');
      unsubscribeFirestore = onSnapshot(
        colRef,
        (snapshot) => {
          const list: BookmarkedQuestion[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as BookmarkedQuestion);
          });
          list.sort((a, b) => (b.savedAt || '').localeCompare(a.savedAt || ''));
          setLocalBookmarks(list);
          try {
            localStorage.setItem('practca_bookmarked_questions', JSON.stringify(list));
          } catch {}
        },
        (error) => {
          console.error('Firestore Error loading bookmarkedQuestions:', error);
        }
      );
    }

    return () => {
      window.removeEventListener('practca_bookmarked_questions_updated', syncFromLocalStorage);
      window.removeEventListener('storage', syncFromLocalStorage);
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, [externalBookmarks]);

  const handleBookmarkClick = async (item: ExtractedPastPaperQuestion) => {
    const bookmarkPayload: BookmarkedQuestion = {
      questionId: String(item.id).substring(0, 128),
      subjectId: item.subjectCode as SubjectId,
      attempt: String(item.attempt).substring(0, 32),
      attemptLabel: String(item.attemptLabel).substring(0, 64),
      questionNumber: String(item.questionNumber).substring(0, 32),
      marks: Math.max(1, Math.min(100, Number(item.marks) || 4)),
      chapterName: String(item.chapterName).substring(0, 300),
      topicTag: String(item.topicTag).substring(0, 300),
      questionPreview: String(item.questionText.join(' ')).substring(0, 2900),
      savedAt: new Date().toISOString(),
    };

    if (onToggleQuestionBookmark) {
      onToggleQuestionBookmark(bookmarkPayload);
      return;
    }

    const isAlreadySaved = activeBookmarks.some((b) => b.questionId === bookmarkPayload.questionId);
    const nextList = isAlreadySaved
      ? activeBookmarks.filter((b) => b.questionId !== bookmarkPayload.questionId)
      : [bookmarkPayload, ...activeBookmarks];

    setLocalBookmarks(nextList);
    try {
      localStorage.setItem('practca_bookmarked_questions', JSON.stringify(nextList));
      window.dispatchEvent(new Event('practca_bookmarked_questions_updated'));
    } catch {}

    if (auth.currentUser?.uid) {
      const uid = auth.currentUser.uid;
      const cleanId = `qbook_${bookmarkPayload.questionId}`.replace(/[^a-zA-Z0-9_\-]/g, '_').substring(0, 128);
      const docRef = doc(db, 'users', uid, 'bookmarkedQuestions', cleanId);
      try {
        if (isAlreadySaved) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, bookmarkPayload);
        }
      } catch (err) {
        console.error('Error syncing question bookmark to Firestore:', err);
      }
    }
  };

  // Sync with backend pre-extracted & auto-synced PDF question bank
  useEffect(() => {
    let active = true;
    fetch('/api/past-papers/bank')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestionBank(data.questions);
        }
      })
      .catch(() => {
        // Fallback to pre-extracted local question bank silently
      });
    return () => {
      active = false;
    };
  }, []);

  // Reset chapter selection when active subject changes
  useEffect(() => {
    setSelectedChapter('ALL');
  }, [activeSubjectCode]);

  const toggleRevealAnswer = (questionId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const subjectQuestionsAll = useMemo(
    () => questionBank.filter((q) => q.subjectCode === activeSubjectCode),
    [questionBank, activeSubjectCode]
  );

  // Available chapters for the selected subject
  const subjectChapters = useMemo(() => {
    const baseChapters = SUBJECT_CHAPTERS_MAP[activeSubjectCode] || [];
    const countsByChapter: Record<string, number> = {};
    subjectQuestionsAll.forEach((q) => {
      countsByChapter[q.chapterName] = (countsByChapter[q.chapterName] || 0) + 1;
    });

    const allChapterNames = Array.from(
      new Set([...baseChapters, ...Object.keys(countsByChapter)])
    );

    return allChapterNames.map((name) => ({
      name,
      count: countsByChapter[name] || 0,
    }));
  }, [activeSubjectCode, subjectQuestionsAll]);

  // Questions filtered by Chapter dropdown and Attempt Year dropdown
  const filteredQuestions = useMemo(() => {
    return subjectQuestionsAll.filter((q) => {
      if (selectedChapter !== 'ALL' && q.chapterName !== selectedChapter) return false;
      if (selectedAttempt !== 'ALL' && q.attempt !== selectedAttempt) return false;
      return true;
    });
  }, [subjectQuestionsAll, selectedChapter, selectedAttempt]);

  const meta = SUBJECT_BANK_META[activeSubjectCode];
  const downloadAttempt: AttemptCode = selectedAttempt === 'ALL' ? 'May-26' : selectedAttempt;

  return (
    <div className="space-y-6 pb-20">
      {/* Subject Header, Subject Switcher & Backend QP/SA Download Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#0b0f19] p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
              <span className="font-mono font-bold text-amber-400">{meta.group}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono font-semibold text-slate-300">{meta.paperNumber}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-400">
                {filteredQuestions.length} of {subjectQuestionsAll.length} Questions Shown
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                {meta.code} — {meta.fullName} Question Bank
              </h2>
            </div>
          </div>

          {/* Compact Backend PDF Download Buttons (QP & SA) */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={`/api/past-papers/download?subject=${encodeURIComponent(
                meta.code
              )}&attempt=${encodeURIComponent(downloadAttempt)}&type=qp`}
              download={`${CA_CURRICULUM_LEVELS[caLevel].shortName.replace(/\s+/g, '_')}_${meta.code}_${downloadAttempt}_Question_Paper.pdf`}
              className="flex-1 sm:flex-initial min-h-[40px] justify-center inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap overflow-hidden"
              title={`Download Official ${meta.code} ${downloadAttempt} Question Paper PDF from Backend`}
            >
              <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">Download QP ({downloadAttempt})</span>
            </a>

            <a
              href={`/api/past-papers/download?subject=${encodeURIComponent(
                meta.code
              )}&attempt=${encodeURIComponent(downloadAttempt)}&type=sa`}
              download={`${CA_CURRICULUM_LEVELS[caLevel].shortName.replace(/\s+/g, '_')}_${meta.code}_${downloadAttempt}_Suggested_Answer.pdf`}
              className="flex-1 sm:flex-initial min-h-[40px] justify-center inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors whitespace-nowrap overflow-hidden"
              title={`Download Official ${meta.code} ${downloadAttempt} Suggested Answer PDF from Backend`}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Download SA ({downloadAttempt})</span>
            </a>
          </div>
        </div>

        {/* Filter Controls: Chapter Dropdown + Attempt Year Dropdown */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-7">
            <label
              htmlFor="question-bank-chapter-select"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1.5"
            >
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              Select Chapter
            </label>
            <select
              id="question-bank-chapter-select"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full rounded-lg bg-[#070a12] border border-slate-800 focus:border-amber-500/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">
                All Chapters ({subjectQuestionsAll.length} Questions)
              </option>
              {subjectChapters.map((ch) => (
                <option key={ch.name} value={ch.name}>
                  {ch.name} {ch.count > 0 ? `(${ch.count} Question${ch.count > 1 ? 's' : ''})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label
              htmlFor="question-bank-attempt-select"
              className="block text-xs font-semibold text-slate-300 mb-1.5"
            >
              Filter by Attempt Year
            </label>
            <select
              id="question-bank-attempt-select"
              value={selectedAttempt}
              onChange={(e) => setSelectedAttempt(e.target.value as AttemptCode | 'ALL')}
              className="w-full rounded-lg bg-[#070a12] border border-slate-800 focus:border-amber-500/60 px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 font-medium focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Attempts (May 2024 – May 2026)</option>
              {ATTEMPT_LIST.map((att) => (
                <option key={att.code} value={att.code}>
                  {att.label} ({att.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions & Toggleable Suggested Answers List */}
      {filteredQuestions.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-[#0b0f19] p-8 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-200">
            No extracted questions found for the selected Chapter and Attempt Year filter.
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                setSelectedChapter('ALL');
                setSelectedAttempt('ALL');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredQuestions.map((item) => {
            const isAnswerRevealed = !!revealedAnswers[item.id];
            const isBookmarked = activeBookmarks.some((b) => b.questionId === item.id);

            return (
              <article
                key={item.id}
                className="rounded-xl border border-slate-800 bg-[#0b0f19] p-5 sm:p-6 space-y-4"
              >
                {/* Question Metadata Header + Bookmark Icon Button */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-3.5">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 tabular-nums">
                      <span className="font-semibold text-amber-400">{item.attemptLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-200">{item.questionNumber}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-300">{item.marks} Marks</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-400 font-medium">Chapter: {item.chapterName}</span>
                    </div>

                    <h2 className="text-base font-semibold text-slate-100">
                      {item.topicTag}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookmarkClick(item)}
                    aria-pressed={isBookmarked}
                    title={
                      isBookmarked
                        ? 'Remove question from My Bookmarks in Profile'
                        : 'Save high-priority question to My Bookmarks in Profile'
                    }
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                      isBookmarked
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 hover:bg-amber-500/25'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-amber-400 text-amber-400' : 'text-slate-400'
                      }`}
                    />
                    <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                  </button>
                </div>

                {/* Question Body */}
                <div className="space-y-2.5 text-sm text-slate-200 leading-relaxed">
                  <ul className="space-y-2 list-disc pl-5">
                    {item.questionText.map((line, idx) => (
                      <li key={idx} className="text-slate-200">
                        {line}
                      </li>
                    ))}
                  </ul>

                  {item.questionTable && (
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-left border-collapse border border-slate-800 text-xs sm:text-sm tabular-nums">
                        <thead>
                          <tr className="bg-slate-900/90 text-slate-300">
                            {item.questionTable.headers.map((h, i) => (
                              <th
                                key={i}
                                className="py-2.5 px-3.5 border border-slate-800 font-semibold"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80">
                          {item.questionTable.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="bg-[#070a12]/60">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className="py-2 px-3.5 border border-slate-800 text-slate-200"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Single Reveal Answer Toggle Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleRevealAnswer(item.id)}
                    aria-expanded={isAnswerRevealed}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      isAnswerRevealed
                        ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {isAnswerRevealed ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Reveal Answer
                      </>
                    )}
                  </button>
                </div>

                {/* Revealed Official ICAI Suggested Answer */}
                {isAnswerRevealed && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 bg-[#070b13] rounded-lg p-4 sm:p-5">
                    <div className="text-xs font-semibold text-emerald-400">
                      Official ICAI Suggested Answer ({item.attemptLabel} · {item.questionNumber})
                    </div>

                    {/* 1. Applicable Statutory Provisions / Standards */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold text-slate-300">
                        1. Applicable Statutory Provisions / Ind AS / Auditing Standards:
                      </h3>
                      <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {item.suggestedAnswer.provisionOrStandard.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 2. Step-by-Step Computation & Working Notes */}
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-semibold text-slate-300">
                        2. Step-by-Step Computation & Working Notes:
                      </h3>
                      <ul className="space-y-1.5 list-disc pl-5 text-xs sm:text-sm text-slate-200 leading-relaxed tabular-nums">
                        {item.suggestedAnswer.analysisAndWorkings.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>

                    {/* 3. Computation Table */}
                    {item.suggestedAnswer.computationTable && (
                      <div className="overflow-x-auto pt-1">
                        <table className="w-full text-left border-collapse border border-slate-800 text-xs sm:text-sm tabular-nums">
                          <thead>
                            <tr className="bg-slate-900 text-slate-300">
                              {item.suggestedAnswer.computationTable.headers.map((h, i) => (
                                <th
                                  key={i}
                                  className="py-2 px-3.5 border border-slate-800 font-semibold"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {item.suggestedAnswer.computationTable.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="bg-[#0b0f19]">
                                {row.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="py-2 px-3.5 border border-slate-800 text-slate-200"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 4. Final Conclusion */}
                    <div className="pt-2 border-t border-slate-800/80 text-xs sm:text-sm text-slate-100">
                      <span className="font-semibold text-emerald-400">Conclusion: </span>
                      <span>{item.suggestedAnswer.conclusion}</span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QuestionBankView;
