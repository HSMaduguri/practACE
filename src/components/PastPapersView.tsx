import React, { useState, useMemo, useEffect } from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { BookmarkedQuestion, SubjectId } from '../types';
import {
  INITIAL_PAST_PAPER_QUESTION_BANK,
  SubjectShortCode,
  ExtractedPastPaperQuestion,
} from '../data/pastPapersQuestionBank';
import { QuestionBankView, SUBJECT_BANK_META } from './QuestionBankView';
import { isSubjectLockedAfterFinalExam } from '../utils/taskCompletionSync';
import { StudyVaultTabId } from './StudyVaultInterconnectBar';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';
import { getLevelSubjectIds } from '../utils/levelStorage';

interface PastPapersViewProps {
  subjects?: unknown[];
  tasks?: unknown[];
  selectedSubjectId: string | null;
  setSelectedSubjectId?: (id: string | null) => void;
  onSelectSubject?: (id: string | null) => void;
  theme?: 'dark' | 'light';
  bookmarkedQuestions?: BookmarkedQuestion[];
  onToggleQuestionBookmark?: (bookmark: BookmarkedQuestion) => void;
  onNavigateStudyVault?: (targetTab: StudyVaultTabId, subjectId: SubjectId) => void;
}

function normalizeSubjectIdToCode(subjectIdOrName: string | null): SubjectShortCode | null {
  if (!subjectIdOrName) return null;
  const val = subjectIdOrName.trim().toLowerCase();
  if (val === 'fr' || val.includes('financial reporting') || val === 'sub-1') return 'FR';
  if (val === 'afm' || val.includes('advanced financial management') || val === 'sub-2') return 'AFM';
  if (val === 'aud' || val === 'audit' || val.includes('advanced auditing') || val === 'sub-3') return 'Audit';
  if (val === 'dt' || val.includes('direct tax') || val === 'sub-4') return 'DT';
  if (val === 'idt' || val.includes('indirect tax') || val === 'sub-5') return 'IDT';
  if (val === 'ibs' || val.includes('integrated business') || val === 'sub-6') return 'IBS';
  if (val === 'advacc' || val.includes('advanced accounting')) return 'AdvAcc';
  if (val === 'corplaw' || val.includes('corporate and other laws') || val.includes('corporate & other')) return 'CorpLaw';
  if (val === 'tax' || val.includes('taxation (direct tax')) return 'Tax';
  if (val === 'cost' || val.includes('cost and management')) return 'Cost';
  if (val === 'auditinter' || val === 'auditing and ethics') return 'AuditInter';
  if (val === 'fmsm' || val.includes('financial management and strategic')) return 'FMSM';
  if (val === 'accounts' || val === 'accounting') return 'Accounts';
  if (val === 'law' || val.includes('business laws')) return 'Law';
  if (val === 'mathstats' || val.includes('quantitative aptitude')) return 'MathStats';
  if (val === 'econ' || val.includes('business economics')) return 'Econ';
  return null;
}

const CARD_THEMES = [
  { darkColor: 'text-violet-400', border: 'hover:border-violet-500/40 hover:bg-violet-500/5', icon: '📋' },
  { darkColor: 'text-cyan-400', border: 'hover:border-cyan-500/40 hover:bg-cyan-500/5', icon: '📊' },
  { darkColor: 'text-emerald-400', border: 'hover:border-emerald-500/40 hover:bg-emerald-500/5', icon: '🔍' },
  { darkColor: 'text-orange-400', border: 'hover:border-orange-500/40 hover:bg-orange-500/5', icon: '⚖️' },
  { darkColor: 'text-pink-400', border: 'hover:border-pink-500/40 hover:bg-pink-500/5', icon: '🏛️' },
  { darkColor: 'text-yellow-400', border: 'hover:border-yellow-500/40 hover:bg-yellow-500/5', icon: '💡' },
];

export const PastPapersView: React.FC<PastPapersViewProps> = ({
  selectedSubjectId,
  setSelectedSubjectId,
  onSelectSubject,
  bookmarkedQuestions,
  onToggleQuestionBookmark,
  onNavigateStudyVault,
}) => {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const [questionBank, setQuestionBank] = useState<ExtractedPastPaperQuestion[]>(
    INITIAL_PAST_PAPER_QUESTION_BANK
  );

  const handleSelectSubject = (id: string | null) => {
    const code = normalizeSubjectIdToCode(id);
    if (code && isSubjectLockedAfterFinalExam(code)) return;
    setSelectedSubjectId?.(id);
    onSelectSubject?.(id);
  };

  useEffect(() => {
    let active = true;
    fetch('/api/past-papers/bank')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && data && Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestionBank(data.questions);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const activeSubjectCode = useMemo(() => {
    const code = normalizeSubjectIdToCode(selectedSubjectId);
    if (code && isSubjectLockedAfterFinalExam(code)) return null;
    return code;
  }, [selectedSubjectId]);

  const countsByCode = useMemo(() => {
    const codes = getLevelSubjectIds(caLevel);
    const result: Partial<Record<SubjectShortCode, { questionCount: number; chapterCount: number }>> = {};
    codes.forEach((code) => {
      const subjectQuestions = questionBank.filter((q) => q.subjectCode === code);
      const uniqueChapters = new Set(subjectQuestions.map((q) => q.chapterName));
      result[code] = {
        questionCount: subjectQuestions.length,
        chapterCount: uniqueChapters.size,
      };
    });
    return result;
  }, [questionBank, caLevel]);

  if (activeSubjectCode) {
    return (
      <QuestionBankView
        subjectCode={activeSubjectCode}
        bookmarkedQuestions={bookmarkedQuestions}
        onToggleQuestionBookmark={onToggleQuestionBookmark}
        onNavigateStudyVault={onNavigateStudyVault}
        onSelectSubjectCode={(code) => {
          if (!code) {
            handleSelectSubject(null);
          } else if (!isSubjectLockedAfterFinalExam(code)) {
            handleSelectSubject(SUBJECT_BANK_META[code].id);
          }
        }}
      />
    );
  }

  const renderPaperCard = (sub: typeof levelInfo.subjects[number], idx: number) => {
    const theme = CARD_THEMES[idx % CARD_THEMES.length];
    const isLocked = isSubjectLockedAfterFinalExam(sub.code);
    const meta = SUBJECT_BANK_META[sub.code];
    const stats = countsByCode[sub.code] || { questionCount: 0, chapterCount: 0 };
    return (
      <button
        key={sub.code}
        type="button"
        disabled={isLocked}
        onClick={() => {
          if (!isLocked) handleSelectSubject(meta.id);
        }}
        className={`w-full text-left p-4 rounded-xl bg-cav-card border border-cav-border transition-all flex flex-col justify-between h-[120px] group ${
          isLocked
            ? 'opacity-60 cursor-not-allowed'
            : `cursor-pointer hover:scale-[1.01] hover:shadow-md ${theme.border}`
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2 h-6">
            <div className="flex items-center gap-2">
              <span className="text-lg shrink-0">{theme.icon}</span>
              <span className={`text-base font-black font-display uppercase ${theme.darkColor}`}>
                {sub.code}
              </span>
            </div>
            {isLocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono font-bold text-[10px]">
                <Lock className="h-3 w-3" /> Locked
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {stats.questionCount} Qs · {stats.chapterCount} Ch
              </span>
            )}
          </div>
          <h4 className="text-sm font-black text-white leading-tight truncate">
            {sub.name}
          </h4>
        </div>

        <div className="flex items-center justify-end pt-2.5 border-t border-cav-border/50">
          {isLocked ? (
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Lock className="h-3 w-3 text-emerald-400" /> Exam Completed
            </span>
          ) : (
            <span className="text-[11px] font-extrabold text-pink-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              Open Question Bank <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </button>
    );
  };

  if (levelInfo.id === 'foundation' || levelInfo.id === 'cma_foundation') {
    return (
      <div className="space-y-6 animate-fadeIn pb-16 text-left">
        <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
          <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎓</span>
              <h3 className="font-display font-bold text-white text-sm tracking-tight">
                {levelInfo.shortName} Question Bank (Papers 1 – 4)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Papers 1 – 4
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {levelInfo.subjects.map((sub, idx) => renderPaperCard(sub, idx))}
          </div>
        </div>
      </div>
    );
  }

  const group1Subjects = levelInfo.subjects.filter((s) => s.group === 'Group I');
  const group2Subjects = levelInfo.subjects.filter((s) => s.group === 'Group II');
  const g1Label =
    group1Subjects.length > 0
      ? `${group1Subjects[0].paperNumber} – ${group1Subjects[group1Subjects.length - 1].paperNumber.replace('Paper ', '')}`
      : 'Group I';
  const g2Label =
    group2Subjects.length > 0
      ? `${group2Subjects[0].paperNumber} – ${group2Subjects[group2Subjects.length - 1].paperNumber.replace('Paper ', '')}`
      : 'Group II';

  return (
    <div className="space-y-6 animate-fadeIn pb-16 text-left">
      {/* 2 Column Group-wise Layout (Identical alignment across all 4 pillars) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group 1 Column */}
        <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
          <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <h3 className="font-display font-bold text-white text-sm tracking-tight">
                {levelInfo.id === 'cma_final' ? 'Group III (Group 1)' : 'Group 1'} ({group1Subjects.length} Papers)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {g1Label}
            </span>
          </div>

          <div className="space-y-3">
            {group1Subjects.map((sub, idx) => renderPaperCard(sub, idx))}
          </div>
        </div>

        {/* Group 2 Column */}
        <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
          <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏛️</span>
              <h3 className="font-display font-bold text-white text-sm tracking-tight">
                {levelInfo.id === 'cma_final' ? 'Group IV (Group 2)' : 'Group 2'} ({group2Subjects.length} Papers)
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {g2Label}
            </span>
          </div>

          <div className="space-y-3">
            {group2Subjects.map((sub, idx) => renderPaperCard(sub, idx + group1Subjects.length))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { QuestionBankView };
export default PastPapersView;
