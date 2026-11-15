import React, { useState, useEffect } from 'react';
import { Calendar, X, Check, Wand2, Lock } from 'lucide-react';
import { SubjectId, GoogleTask } from '../types';
import { ModalPortal } from './ModalPortal';
import { AttractiveDatePicker } from './AttractiveDateTimePickers';
import { getMilestoneSubjectChapters, UserCheckpoint } from './RoadmapDashboard';
import { auth, db } from '../lib/firebase';
import { doc as firestoreDoc, setDoc } from 'firebase/firestore';
import {
  autoCompleteFinalExamMilestonesAfter5PM,
  isSubjectLockedAfterFinalExam
} from '../utils/taskCompletionSync';
import { CALevel, CA_CURRICULUM_LEVELS, getSelectedCALevel, useCALevel } from '../data/curriculumLevels';
import {
  getLevelScopedKey,
  getLevelFirestoreDocId,
  getDefaultExamDateForLevel,
  getClockSlotsStorageKey,
  isClockSlotsStorageKeyForLevel
} from '../utils/levelStorage';
import {
  resolveSprintStartDateForSubject,
  applySmartLmrSprintAllocationToStorage
} from './LmrSprintBoard';

export interface IcaiPaperDefinition {
  paperNumber: number;
  subjectId: SubjectId;
  codeLabel: string;
  fullName: string;
  group: 'Group I' | 'Group II' | 'All 4 Papers';
}

export const ICAI_FOUNDATION_PAPERS: IcaiPaperDefinition[] = [
  { paperNumber: 1, subjectId: 'Accounts', codeLabel: 'Paper 1', fullName: 'Accounting (Accounts)', group: 'All 4 Papers' },
  { paperNumber: 2, subjectId: 'Law', codeLabel: 'Paper 2', fullName: 'Business Laws (Law)', group: 'All 4 Papers' },
  { paperNumber: 3, subjectId: 'MathStats', codeLabel: 'Paper 3', fullName: 'Quantitative Aptitude (Math/Stats)', group: 'All 4 Papers' },
  { paperNumber: 4, subjectId: 'Econ', codeLabel: 'Paper 4', fullName: 'Business Economics (Econ)', group: 'All 4 Papers' },
];

export const ICAI_INTERMEDIATE_PAPERS: IcaiPaperDefinition[] = [
  { paperNumber: 1, subjectId: 'AdvAcc', codeLabel: 'Paper 1', fullName: 'Advanced Accounting (AdvAcc)', group: 'Group I' },
  { paperNumber: 2, subjectId: 'CorpLaw', codeLabel: 'Paper 2', fullName: 'Corporate and Other Laws (CorpLaw)', group: 'Group I' },
  { paperNumber: 3, subjectId: 'Tax', codeLabel: 'Paper 3', fullName: 'Taxation — Income Tax & GST (Tax)', group: 'Group I' },
  { paperNumber: 4, subjectId: 'Cost', codeLabel: 'Paper 4', fullName: 'Cost & Management Accounting (Cost)', group: 'Group II' },
  { paperNumber: 5, subjectId: 'AuditInter', codeLabel: 'Paper 5', fullName: 'Auditing and Ethics (AuditInter)', group: 'Group II' },
  { paperNumber: 6, subjectId: 'FMSM', codeLabel: 'Paper 6', fullName: 'Financial Mgmt & Strategic Mgmt (FMSM)', group: 'Group II' },
];

export const ICAI_SEQUENTIAL_PAPERS: IcaiPaperDefinition[] = [
  {
    paperNumber: 1,
    subjectId: 'FR',
    codeLabel: 'Paper 1',
    fullName: 'Financial Reporting (FR)',
    group: 'Group I'
  },
  {
    paperNumber: 2,
    subjectId: 'AFM',
    codeLabel: 'Paper 2',
    fullName: 'Advanced Financial Management (AFM)',
    group: 'Group I'
  },
  {
    paperNumber: 3,
    subjectId: 'Audit',
    codeLabel: 'Paper 3',
    fullName: 'Advanced Auditing & Professional Ethics (Audit)',
    group: 'Group I'
  },
  {
    paperNumber: 4,
    subjectId: 'DT',
    codeLabel: 'Paper 4',
    fullName: 'Direct Tax & International Taxation (DT)',
    group: 'Group II'
  },
  {
    paperNumber: 5,
    subjectId: 'IDT',
    codeLabel: 'Paper 5',
    fullName: 'Indirect Tax Laws (IDT)',
    group: 'Group II'
  },
  {
    paperNumber: 6,
    subjectId: 'IBS',
    codeLabel: 'Paper 6',
    fullName: 'Integrated Business Solutions (IBS)',
    group: 'Group II'
  }
];

export const ICMAI_FOUNDATION_PAPERS: IcaiPaperDefinition[] = [
  { paperNumber: 1, subjectId: 'CMAFoundLaw', codeLabel: 'Paper 1', fullName: 'Fundamentals of Business Laws & Communication (CMAFoundLaw)', group: 'All 4 Papers' },
  { paperNumber: 2, subjectId: 'CMAFoundAcc', codeLabel: 'Paper 2', fullName: 'Fundamentals of Financial & Cost Accounting (CMAFoundAcc)', group: 'All 4 Papers' },
  { paperNumber: 3, subjectId: 'CMAFoundMath', codeLabel: 'Paper 3', fullName: 'Fundamentals of Business Maths & Statistics (CMAFoundMath)', group: 'All 4 Papers' },
  { paperNumber: 4, subjectId: 'CMAFoundEcon', codeLabel: 'Paper 4', fullName: 'Fundamentals of Business Economics & Management (CMAFoundEcon)', group: 'All 4 Papers' },
];

export const ICMAI_INTERMEDIATE_PAPERS: IcaiPaperDefinition[] = [
  { paperNumber: 5, subjectId: 'CMAInterLaw', codeLabel: 'Paper 5', fullName: 'Business Laws and Ethics (CMAInterLaw)', group: 'Group I' },
  { paperNumber: 6, subjectId: 'CMAInterFA', codeLabel: 'Paper 6', fullName: 'Financial Accounting (CMAInterFA)', group: 'Group I' },
  { paperNumber: 7, subjectId: 'CMAInterTax', codeLabel: 'Paper 7', fullName: 'Direct and Indirect Taxation (CMAInterTax)', group: 'Group I' },
  { paperNumber: 8, subjectId: 'CMAInterCost', codeLabel: 'Paper 8', fullName: 'Cost Accounting (CMAInterCost)', group: 'Group I' },
  { paperNumber: 9, subjectId: 'CMAInterOMSM', codeLabel: 'Paper 9', fullName: 'Operations Mgmt & Strategic Mgmt (CMAInterOMSM)', group: 'Group II' },
  { paperNumber: 10, subjectId: 'CMAInterCAA', codeLabel: 'Paper 10', fullName: 'Corporate Accounting and Auditing (CMAInterCAA)', group: 'Group II' },
  { paperNumber: 11, subjectId: 'CMAInterFMDA', codeLabel: 'Paper 11', fullName: 'Financial Mgmt & Business Data Analytics (CMAInterFMDA)', group: 'Group II' },
  { paperNumber: 12, subjectId: 'CMAInterMA', codeLabel: 'Paper 12', fullName: 'Management Accounting (CMAInterMA)', group: 'Group II' },
];

export const ICMAI_FINAL_PAPERS: IcaiPaperDefinition[] = [
  { paperNumber: 13, subjectId: 'CMAFinalLaw', codeLabel: 'Paper 13', fullName: 'Corporate and Economic Laws (CMAFinalLaw)', group: 'Group I' },
  { paperNumber: 14, subjectId: 'CMAFinalSFM', codeLabel: 'Paper 14', fullName: 'Strategic Financial Management (CMAFinalSFM)', group: 'Group I' },
  { paperNumber: 15, subjectId: 'CMAFinalDT', codeLabel: 'Paper 15', fullName: 'Direct Tax Laws and International Taxation (CMAFinalDT)', group: 'Group I' },
  { paperNumber: 16, subjectId: 'CMAFinalSCM', codeLabel: 'Paper 16', fullName: 'Strategic Cost Management (CMAFinalSCM)', group: 'Group I' },
  { paperNumber: 17, subjectId: 'CMAFinalCMA', codeLabel: 'Paper 17', fullName: 'Cost and Management Audit (CMAFinalCMA)', group: 'Group II' },
  { paperNumber: 18, subjectId: 'CMAFinalCFR', codeLabel: 'Paper 18', fullName: 'Corporate Financial Reporting (CMAFinalCFR)', group: 'Group II' },
  { paperNumber: 19, subjectId: 'CMAFinalIDT', codeLabel: 'Paper 19', fullName: 'Indirect Tax Laws and Practice (CMAFinalIDT)', group: 'Group II' },
  { paperNumber: 20, subjectId: 'CMAFinalSPBV', codeLabel: 'Paper 20', fullName: 'Strategic Performance Mgmt & Business Valuation (CMAFinalSPBV)', group: 'Group II' },
];

export function getSequentialPapersForLevel(level: CALevel = getSelectedCALevel()): IcaiPaperDefinition[] {
  if (level === 'foundation') return ICAI_FOUNDATION_PAPERS;
  if (level === 'intermediate') return ICAI_INTERMEDIATE_PAPERS;
  if (level === 'cma_foundation') return ICMAI_FOUNDATION_PAPERS;
  if (level === 'cma_intermediate') return ICMAI_INTERMEDIATE_PAPERS;
  if (level === 'cma_final') return ICMAI_FINAL_PAPERS;
  return ICAI_SEQUENTIAL_PAPERS;
}

export const STORAGE_KEY_SUBJECT_EXAM_DATES = 'practca_subject_final_exam_dates';
const STORAGE_KEY_CHECKPOINTS = 'practca_roadmap_user_checkpoints';
const STORAGE_KEY_DATES = 'practca_roadmap_master_dates';
const STORAGE_KEY_EXAM_DATE = 'practca_exam_date';

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function addDaysToDateStr(dateStr: string, deltaDays: number): string {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, (m || 1) - 1, d || 1);
    dt.setDate(dt.getDate() + deltaDays);
    const yr = dt.getFullYear();
    const mn = String(dt.getMonth() + 1).padStart(2, '0');
    const dy = String(dt.getDate()).padStart(2, '0');
    return `${yr}-${mn}-${dy}`;
  } catch {
    return dateStr;
  }
}

function getDaysInYearMonth(year: number, month1Based: number): number {
  return new Date(year, month1Based, 0).getDate();
}

function formatShortDate(dateStr: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
  const [, m, d] = dateStr.split('-').map(Number);
  return `${String(d).padStart(2, '0')} ${SHORT_MONTHS[(m || 1) - 1] || ''}`;
}

function minutesToHHMM(mins: number): string {
  const clamped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function getStoredTargetExamDate(level: CALevel = getSelectedCALevel()): string {
  try {
    const globalExam = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_EXAM_DATE, level));
    if (globalExam && /^\d{4}-\d{2}-\d{2}$/.test(globalExam)) return globalExam;
    const stored = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_DATES, level));
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.examDate && /^\d{4}-\d{2}-\d{2}$/.test(parsed.examDate)) {
        return parsed.examDate;
      }
    }
  } catch {}
  return getDefaultExamDateForLevel(level);
}

const createEmptySubjectStringMap = (): Record<SubjectId, string> => ({
  Accounts: '', Law: '', MathStats: '', Econ: '',
  AdvAcc: '', CorpLaw: '', Tax: '', Cost: '', AuditInter: '', FMSM: '',
  FR: '', AFM: '', Audit: '', DT: '', IDT: '', IBS: '',
  CMAFoundLaw: '', CMAFoundAcc: '', CMAFoundMath: '', CMAFoundEcon: '',
  CMAInterLaw: '', CMAInterFA: '', CMAInterTax: '', CMAInterCost: '',
  CMAInterOMSM: '', CMAInterCAA: '', CMAInterFMDA: '', CMAInterMA: '',
  CMAFinalLaw: '', CMAFinalSFM: '', CMAFinalDT: '', CMAFinalSCM: '',
  CMAFinalCMA: '', CMAFinalCFR: '', CMAFinalIDT: '', CMAFinalSPBV: '',
});

export function loadStoredSubjectExamDates(level: CALevel = getSelectedCALevel()): Record<SubjectId, string> {
  const empty: Record<SubjectId, string> = createEmptySubjectStringMap();
  const levelPapers = getSequentialPapersForLevel(level);
  const normalizeSub = (raw?: string): SubjectId | null => {
    if (!raw) return null;
    const u = String(raw).trim().toUpperCase();
    const matched = levelPapers.find(p => p.subjectId.toUpperCase() === u);
    return matched ? matched.subjectId : null;
  };
  try {
    const raw = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_SUBJECT_EXAM_DATES, level));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        Object.keys(parsed).forEach(k => {
          const sub = normalizeSub(k);
          const val = parsed[k];
          if (sub && typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
            empty[sub] = val;
          }
        });
      }
    }
    const cpRaw = localStorage.getItem(getLevelScopedKey(STORAGE_KEY_CHECKPOINTS, level));
    if (cpRaw) {
      const cps = JSON.parse(cpRaw);
      if (Array.isArray(cps)) {
        cps.forEach((cp: any) => {
          const sub = normalizeSub(cp?.subjectId);
          if (
            sub &&
            !empty[sub] &&
            (cp.revisionCycle === 'Final Sprint' || String(cp.id || '').startsWith('cp_final_sprint_')) &&
            typeof cp.targetDate === 'string' &&
            /^\d{4}-\d{2}-\d{2}$/.test(cp.targetDate)
          ) {
            empty[sub] = cp.targetDate;
          }
        });
      }
    }
  } catch {}
  return empty;
}

interface FinalExamDatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (summaryMessage: string) => void;
}

export default function FinalExamDatesModal({
  isOpen,
  onClose,
  onSaved
}: FinalExamDatesModalProps) {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const sequentialPapers = getSequentialPapersForLevel(caLevel);
  const [targetExamDate, setTargetExamDate] = useState<string>(() => getStoredTargetExamDate(caLevel));
  // Inherited Year-Month (`YYYY-MM`) from the user's Target Exam Date; editable if needed
  const [baseYearMonth, setBaseYearMonth] = useState<string>(() => getStoredTargetExamDate(caLevel).slice(0, 7));
  const [paperDates, setPaperDates] = useState<Record<SubjectId, string>>(() => loadStoredSubjectExamDates(caLevel));
  const [dayDrafts, setDayDrafts] = useState<Record<SubjectId, string>>(createEmptySubjectStringMap);
  const [showFullDateOverride, setShowFullDateOverride] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const rawTDate = getStoredTargetExamDate(caLevel);
      const stored = loadStoredSubjectExamDates(caLevel);

      // If previous attempt already concluded (all stored dates < todayStr and no upcoming paper), allow scheduling from today onward
      const hasUpcomingPaper = sequentialPapers.some((p) => Boolean(stored[p.subjectId] && stored[p.subjectId] >= todayStr));
      const effectiveTargetDate = rawTDate < todayStr && !hasUpcomingPaper ? todayStr : rawTDate;

      setTargetExamDate(effectiveTargetDate);
      const tYM = effectiveTargetDate.slice(0, 7);

      const clamped: Record<SubjectId, string> = { ...stored };
      const drafts: Record<SubjectId, string> = createEmptySubjectStringMap();

      sequentialPapers.forEach(({ subjectId: sub }) => {
        if (clamped[sub]) {
          if (rawTDate >= todayStr && clamped[sub] < effectiveTargetDate) {
            clamped[sub] = effectiveTargetDate;
          }
          drafts[sub] = String(Number(clamped[sub].split('-')[2]));
        }
      });

      const firstFilled = sequentialPapers.map((p) => clamped[p.subjectId]).find(Boolean);
      setBaseYearMonth(hasUpcomingPaper && firstFilled ? firstFilled.slice(0, 7) : tYM);
      setPaperDates(clamped);
      setDayDrafts(drafts);
      setShowFullDateOverride(false);
    }
  }, [isOpen, caLevel]);

  // Build a valid full date `YYYY-MM-DD` on or after `targetExamDate` when the user types only the day (`DD`)
  const buildDateFromDayNumber = (dayNum: number, ymStr: string): string => {
    const [rawY, rawM] = ymStr.split('-').map(Number);
    let yr = rawY || Number(targetExamDate.slice(0, 4)) || 2026;
    let mn = rawM || Number(targetExamDate.slice(5, 7)) || 11;
    const maxDays = getDaysInYearMonth(yr, mn);
    const clampedDay = Math.max(1, Math.min(maxDays, dayNum));

    let candidate = `${yr}-${String(mn).padStart(2, '0')}-${String(clampedDay).padStart(2, '0')}`;
    // If candidate is before targetExamDate in the same month/year, check if rolling to next month makes sense
    // or clamp to targetExamDate
    if (candidate < targetExamDate) {
      const targetYM = targetExamDate.slice(0, 7);
      const targetDay = Number(targetExamDate.slice(8, 10)) || 1;
      if (ymStr === targetYM && clampedDay < targetDay && targetDay >= 20) {
        // E.g. Target Exam starts Nov 28 and user enters Day 2 -> Dec 02
        const nextDate = new Date(yr, mn, clampedDay);
        candidate = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, '0')}-${String(nextDate.getDate()).padStart(2, '0')}`;
      } else {
        candidate = targetExamDate;
      }
    }
    return candidate;
  };

  const handleDayInputChange = (subjectId: SubjectId, rawVal: string) => {
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 2);
    setDayDrafts(prev => ({ ...prev, [subjectId]: digitsOnly }));

    if (!digitsOnly) {
      setPaperDates(prev => ({ ...prev, [subjectId]: '' }));
      return;
    }

    const num = Number(digitsOnly);
    if (num >= 1 && num <= 31) {
      const fullDate = buildDateFromDayNumber(num, baseYearMonth);
      setPaperDates(prev => ({ ...prev, [subjectId]: fullDate }));
    }
  };

  const handleDayInputBlur = (subjectId: SubjectId) => {
    const fullDate = paperDates[subjectId];
    if (fullDate && /^\d{4}-\d{2}-\d{2}$/.test(fullDate)) {
      const clamped = fullDate < targetExamDate ? targetExamDate : fullDate;
      if (clamped !== fullDate) {
        setPaperDates(prev => ({ ...prev, [subjectId]: clamped }));
      }
      setDayDrafts(prev => ({ ...prev, [subjectId]: String(Number(clamped.split('-')[2])) }));
    }
  };

  const handleFullDateChange = (subjectId: SubjectId, value: string) => {
    if (!value) {
      setPaperDates(prev => ({ ...prev, [subjectId]: '' }));
      setDayDrafts(prev => ({ ...prev, [subjectId]: '' }));
      return;
    }
    const clamped = value < targetExamDate ? targetExamDate : value;
    setPaperDates(prev => ({ ...prev, [subjectId]: clamped }));
    setDayDrafts(prev => ({ ...prev, [subjectId]: String(Number(clamped.split('-')[2])) }));
  };

  const handleBaseYearMonthChange = (newYM: string) => {
    if (!newYM || !/^\d{4}-\d{2}$/.test(newYM)) return;
    const minYM = targetExamDate.slice(0, 7);
    const effectiveYM = newYM < minYM ? minYM : newYM;
    setBaseYearMonth(effectiveYM);

    // Re-apply day numbers onto the new Year-Month
    setPaperDates(prev => {
      const next = { ...prev };
      (Object.keys(next) as SubjectId[]).forEach(sub => {
        const dayStr = dayDrafts[sub];
        if (dayStr && Number(dayStr) >= 1) {
          next[sub] = buildDateFromDayNumber(Number(dayStr), effectiveYM);
        }
      });
      return next;
    });
  };

  // Auto-fill standard ICAI alternate-day sequence (+2 days gap) starting from Paper 1 or Target Exam Date
  const handleAutoFillAlternateDays = () => {
    const firstPaperId = sequentialPapers[0].subjectId;
    const rawStart =
      paperDates[firstPaperId] ||
      sequentialPapers.map(p => paperDates[p.subjectId]).find(Boolean) ||
      targetExamDate;
    const baseDate = rawStart < targetExamDate ? targetExamDate : rawStart;

    const nextDates = { ...paperDates };
    const nextDrafts = { ...dayDrafts };
    sequentialPapers.forEach((p, idx) => {
      const assignedDate = idx === 0 ? baseDate : addDaysToDateStr(baseDate, idx * 2);
      nextDates[p.subjectId] = assignedDate;
      nextDrafts[p.subjectId] = String(Number(assignedDate.split('-')[2]));
    });
    setBaseYearMonth(baseDate.slice(0, 7));
    setPaperDates(nextDates);
    setDayDrafts(nextDrafts);
  };

  const handleClearGroup = (group: 'Group I' | 'Group II' | 'ALL') => {
    setPaperDates(prev => {
      const next = { ...prev };
      sequentialPapers.forEach(p => {
        if (group === 'ALL' || p.group === group) {
          next[p.subjectId] = '';
        }
      });
      return next;
    });
    setDayDrafts(prev => {
      const next = { ...prev };
      sequentialPapers.forEach(p => {
        if (group === 'ALL' || p.group === group) {
          next[p.subjectId] = '';
        }
      });
      return next;
    });
  };

  const handleSaveAndGenerateSprints = (e: React.FormEvent) => {
    e.preventDefault();

    const activePapers = sequentialPapers.filter(p =>
      Boolean(paperDates[p.subjectId] && /^\d{4}-\d{2}-\d{2}$/.test(paperDates[p.subjectId]))
    );

    // 1. Persist Subject Final Exam Dates Map (clamped >= targetExamDate)
    const cleanDatesMap: Record<string, string> = {};
    activePapers.forEach(p => {
      const rawDate = paperDates[p.subjectId];
      cleanDatesMap[p.subjectId] = rawDate < targetExamDate ? targetExamDate : rawDate;
    });
    localStorage.setItem(getLevelScopedKey(STORAGE_KEY_SUBJECT_EXAM_DATES, caLevel), JSON.stringify(cleanDatesMap));
    if (activePapers.length > 0) {
      localStorage.removeItem(getLevelScopedKey('practca_exam_attempt_cleared', caLevel));
    }

    // 2. Keep Master Target Exam Date intact unless transitioning from an expired cycle to future Paper dates
    const savedPaperDates = Object.values(cleanDatesMap).sort();
    const earliestSavedPaperDate = savedPaperDates[0];
    let earliestExamDate = targetExamDate;
    if (earliestSavedPaperDate && getStoredTargetExamDate(caLevel) < targetExamDate) {
      earliestExamDate = earliestSavedPaperDate;
      localStorage.setItem(getLevelScopedKey(STORAGE_KEY_EXAM_DATE, caLevel), earliestExamDate);
      try {
        const datesKey = getLevelScopedKey(STORAGE_KEY_DATES, caLevel);
        const rawMaster = localStorage.getItem(datesKey);
        const parsedMaster = rawMaster ? JSON.parse(rawMaster) : {};
        localStorage.setItem(
          datesKey,
          JSON.stringify({ ...(parsedMaster || {}), examDate: earliestExamDate })
        );
      } catch {}
      localStorage.removeItem(getLevelScopedKey('practca_post_exam_regular_mode_reverted_sig', caLevel));
      window.dispatchEvent(new Event('practca_exam_date_updated'));
    }

    // 3. Auto-Add / Sync 1.5-Day Final Sprint Milestones in Roadmap
    const cpKey = getLevelScopedKey(STORAGE_KEY_CHECKPOINTS, caLevel);
    let existingCheckpoints: UserCheckpoint[] = [];
    try {
      const rawCp = localStorage.getItem(cpKey);
      if (rawCp) {
        const parsed = JSON.parse(rawCp);
        if (Array.isArray(parsed)) existingCheckpoints = parsed;
      }
    } catch {}

    const existingSprintBySubject = new Map<SubjectId, UserCheckpoint>();
    const baselineAndRevisionCheckpoints: UserCheckpoint[] = [];

    existingCheckpoints.forEach(cp => {
      const isSprint =
        cp.revisionCycle === 'Final Sprint' ||
        String(cp.id || '').startsWith('cp_final_sprint_') ||
        String(cp.customTitle || '').toLowerCase().includes('1.5-day') ||
        String(cp.customTitle || '').toLowerCase().includes('1.5 day') ||
        String(cp.customTitle || '').toLowerCase().includes('final sprint');
      if (isSprint && cp.subjectId !== 'CUSTOM') {
        existingSprintBySubject.set(cp.subjectId as SubjectId, cp);
      } else if (!isSprint) {
        baselineAndRevisionCheckpoints.push(cp);
      }
    });

    const generatedSprintCheckpoints: UserCheckpoint[] = activePapers.map(paper => {
      const examDateStr = cleanDatesMap[paper.subjectId];
      const startDateStr = resolveSprintStartDateForSubject(
        paper.subjectId,
        examDateStr,
        cleanDatesMap,
        caLevel
      );
      const prevSprint = existingSprintBySubject.get(paper.subjectId);
      const isSameAttemptDate = prevSprint?.targetDate === examDateStr;
      const allChaps = getMilestoneSubjectChapters(paper.subjectId);
      const selectedChaps =
        prevSprint?.selectedChapters && prevSprint.selectedChapters.length > 0
          ? prevSprint.selectedChapters
          : allChaps;

      const timingStr =
        paper.subjectId === 'IBS'
          ? '2:00 PM – 6:00 PM'
          : (paper.subjectId === 'MathStats' || paper.subjectId === 'Econ')
          ? '2:00 PM – 4:00 PM'
          : '2:00 PM – 5:00 PM';

      return {
        id: prevSprint?.id || `cp_final_sprint_${paper.subjectId}`,
        subjectId: paper.subjectId,
        customTitle: `Paper ${paper.paperNumber}: ${paper.subjectId} — 1.5-Day Final Sprint`,
        revisionCycle: 'Final Sprint',
        startDate: startDateStr,
        targetDate: examDateStr,
        targetChapters: selectedChaps.length,
        selectedChapters: selectedChaps,
        completedChapters: isSameAttemptDate ? prevSprint?.completedChapters || [] : [],
        completed: isSameAttemptDate ? prevSprint?.completed : false,
        mockTestCompleted: isSameAttemptDate ? prevSprint?.mockTestCompleted : false,
        completionCondition: 'targets_only',
        notes: `Auto-added practACE Sprint for ${paper.codeLabel}: ${paper.fullName} • ${startDateStr} → ${examDateStr} (${timingStr})`
      };
    });

    const updatedCheckpoints = [
      ...baselineAndRevisionCheckpoints,
      ...generatedSprintCheckpoints
    ].sort((a, b) => a.targetDate.localeCompare(b.targetDate));

    localStorage.setItem(cpKey, JSON.stringify(updatedCheckpoints));

    // 4. Auto-Populate Daily Study Targets & 24-Hour Target Clock Blocks
    const allExamDatesSet = new Set(Object.values(cleanDatesMap));
    const tasksKey = getLevelScopedKey('practca_local_tasks', caLevel);
    const durationsKey = getLevelScopedKey('practca_task_target_durations', caLevel);
    let currentTasks: GoogleTask[] = [];
    try {
      const rawTasks = localStorage.getItem(tasksKey);
      if (rawTasks) {
        const parsed = JSON.parse(rawTasks);
        if (Array.isArray(parsed)) currentTasks = parsed;
      }
    } catch {}

    const filteredTasks = currentTasks.filter(t => {
      const idStr = String(t.id || '');
      const msId = String(t.milestoneId || '');
      if (idStr.startsWith('local-task-finalsprint-') || msId.startsWith('cp_final_sprint_')) {
        return false;
      }
      return true;
    });

    let durationsMap: Record<string, number> = {};
    try {
      const rawDur = localStorage.getItem(durationsKey);
      if (rawDur) durationsMap = JSON.parse(rawDur);
    } catch {}

    const newSprintTasks: GoogleTask[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (isClockSlotsStorageKeyForLevel(k, caLevel) && k) {
        try {
          const rawSlots = localStorage.getItem(k);
          if (rawSlots && (rawSlots.includes('slot_finalsprint_') || rawSlots.includes('slot_final_exam_'))) {
            const parsedSlots = JSON.parse(rawSlots);
            if (Array.isArray(parsedSlots)) {
              const cleaned = parsedSlots.filter(
                (s: any) =>
                  !String(s.id || '').startsWith('slot_finalsprint_') &&
                  !String(s.id || '').startsWith('slot_final_exam_')
              );
              localStorage.setItem(k, JSON.stringify(cleaned));
            }
          }
        } catch {}
      }
    }

    const appendClockSlotsForDate = (dateStr: string, slotsToAdd: any[]) => {
      const clockKey = getClockSlotsStorageKey(dateStr, caLevel);
      let existingSlots: any[] = [];
      try {
        const raw = localStorage.getItem(clockKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) existingSlots = parsed;
        }
      } catch {}
      const merged = [...existingSlots, ...slotsToAdd].sort(
        (a, b) => (Number(a.startMinutes) || 0) - (Number(b.startMinutes) || 0)
      );
      localStorage.setItem(clockKey, JSON.stringify(merged));
    };

    generatedSprintCheckpoints.forEach(cp => {
      const paper = sequentialPapers.find(p => p.subjectId === cp.subjectId);
      if (!paper) return;
      const examDateStr = cp.targetDate;
      const day1DateStr =
        cp.startDate ||
        resolveSprintStartDateForSubject(paper.subjectId, examDateStr, cleanDatesMap, caLevel);

      const smartPlan = applySmartLmrSprintAllocationToStorage(paper.subjectId, {
        level: caLevel,
        examDateStr,
        allExamDatesMap: cleanDatesMap
      });

      const activePlanItems = smartPlan.orderedPlan.filter(
        item => !item.isSkipped && item.plannedMinutes > 0
      );

      // Build ordered pre-exam sprint dates [startDate .. examDate - 1] with capacity weights
      const preExamDates: Array<{ dateStr: string; capWeight: number }> = [];
      let cursorDate = day1DateStr;
      let dateGuard = 0;
      const isStartDayAlsoExam = allExamDatesSet.has(day1DateStr);
      while (cursorDate < examDateStr && dateGuard < 14) {
        const isFirst = dateGuard === 0;
        const capWeight = isFirst && isStartDayAlsoExam ? 240 : 960;
        preExamDates.push({ dateStr: cursorDate, capWeight });
        cursorDate = addDaysToDateStr(cursorDate, 1);
        dateGuard++;
      }
      if (preExamDates.length === 0) {
        preExamDates.push({ dateStr: day1DateStr, capWeight: 240 });
      }

      const preExamItems = activePlanItems.filter(i => i.cognitivePhaseId !== 'exam_am_recall');
      const examAmItems = activePlanItems.filter(i => i.cognitivePhaseId === 'exam_am_recall');

      const totalPreExamMins = preExamItems.reduce((s, i) => s + i.plannedMinutes, 0);
      const totalPreExamCap = preExamDates.reduce((s, d) => s + d.capWeight, 0);

      let runningMins = 0;
      let taskSeqIdx = 0;

      const createSprintTask = (
        chName: string,
        dateStr: string,
        idx: number,
        durMins: number,
        abcCat: string
      ) => {
        const taskId = `local-task-finalsprint-${paper.subjectId}-${dateStr}-${idx}`;
        const fullTitle = `🔴 [Final Revision] [${paper.subjectId}] ${chName}`;
        const fullNotes = `Relevance: Final Revision\nRevKey: rev1.5\nSubject: ${paper.subjectId}\nChapter: ${chName}\nABC: Category ${abcCat}\nImportance: High\nTargetDurationMinutes: ${durMins}\nMilestone: ${cp.customTitle}\nMilestoneId: ${cp.id}`;
        durationsMap[taskId] = durMins;
        durationsMap[chName] = durMins;
        newSprintTasks.push({
          id: taskId,
          title: fullTitle,
          notes: fullNotes,
          due: new Date(`${dateStr}T09:00:00`).toISOString(),
          status: 'needsAction',
          listId: 'local-default',
          subjectCode: paper.subjectId,
          chapterName: chName,
          milestoneId: cp.id,
          relevance: 'Final Revision',
          revKey: 'rev1.5',
          targetDurationMinutes: durMins
        });
      };

      preExamItems.forEach(item => {
        const midpointRatio =
          totalPreExamMins > 0 ? (runningMins + item.plannedMinutes * 0.5) / totalPreExamMins : 0;
        let targetDateStr = preExamDates[0].dateStr;
        let accCap = 0;
        for (const dEntry of preExamDates) {
          accCap += dEntry.capWeight;
          if (midpointRatio * totalPreExamCap <= accCap) {
            targetDateStr = dEntry.dateStr;
            break;
          }
        }
        runningMins += item.plannedMinutes;
        createSprintTask(item.chapterName, targetDateStr, taskSeqIdx++, item.plannedMinutes, item.abcCategory);
      });

      examAmItems.forEach(item => {
        createSprintTask(item.chapterName, examDateStr, taskSeqIdx++, item.plannedMinutes, item.abcCategory);
      });

      // Only add the actual ICAI Exam paper block to Exam Date's clock; daily study targets are slotted manually by the user
      const isIbsPaper = paper.subjectId === 'IBS';
      const isTwoHourMcq = paper.subjectId === 'MathStats' || paper.subjectId === 'Econ';
      const examTimeWindow = isIbsPaper
        ? '2:00 PM – 6:00 PM'
        : isTwoHourMcq
        ? '2:00 PM – 4:00 PM'
        : '2:00 PM – 5:00 PM';
      const examOnlySlot = [
        {
          id: `slot_final_exam_${paper.subjectId}_${examDateStr}`,
          targetId: `final_exam_${cp.id}`,
          title: `[${paper.codeLabel}: ${paper.subjectId}] ${levelInfo.shortName} Exam (${examTimeWindow})`,
          chapterName: `${paper.fullName} — Exam`,
          subjectCode: paper.subjectId,
          subjectsInBatch: [paper.subjectId],
          batchSize: 1,
          relevance: 'Final Revision',
          startTime: '14:00',
          endTime: isIbsPaper ? '18:00' : isTwoHourMcq ? '16:00' : '17:00',
          startMinutes: 840,
          endMinutes: isIbsPaper ? 1080 : isTwoHourMcq ? 960 : 1020,
          durationMinutes: isIbsPaper ? 240 : isTwoHourMcq ? 120 : 180,
          status: 'pending' as const
        }
      ];

      appendClockSlotsForDate(examDateStr, examOnlySlot);
    });

    const mergedAllTasks = [...newSprintTasks, ...filteredTasks];
    localStorage.setItem(tasksKey, JSON.stringify(mergedAllTasks));
    localStorage.setItem(durationsKey, JSON.stringify(durationsMap));

    try {
      const currentUser = auth.currentUser;
      if (currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user') {
        const roadmapDocRef = firestoreDoc(
          db,
          'users',
          currentUser.uid,
          'revisionPlanner',
          getLevelFirestoreDocId('roadmap', caLevel)
        );
        setDoc(
          roadmapDocRef,
          {
            caLevel,
            checkpoints: updatedCheckpoints,
            examDate: earliestExamDate,
            subjectFinalExamDates: cleanDatesMap,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        ).catch(() => {});
      }
    } catch {}

    autoCompleteFinalExamMilestonesAfter5PM(caLevel);
    window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
    window.dispatchEvent(new CustomEvent('practca_subject_exam_dates_updated', { detail: cleanDatesMap }));
    window.dispatchEvent(new Event('practca_tasks_updated'));
    window.dispatchEvent(new Event('practca_target_clock_updated'));
    window.dispatchEvent(new Event('storage'));

    const summary =
      activePapers.length > 0
        ? `Saved ${activePapers.length} ${levelInfo.shortName} Exam ${activePapers.length === 1 ? 'Date' : 'Dates'} & auto-added ${activePapers.length} × 1.5-Day Sprints to Roadmap.`
        : `Cleared ${levelInfo.shortName} Exam dates and removed auto-generated 1.5-Day Sprints.`;

    if (onSaved) {
      onSaved(summary);
    }
    onClose();
  };

  if (!isOpen) return null;

  const filledCount = sequentialPapers.filter(p => Boolean(paperDates[p.subjectId])).length;
  const [baseY, baseM] = baseYearMonth.split('-').map(Number);
  const inheritedMonthLabel = `${SHORT_MONTHS[(baseM || 1) - 1] || 'Nov'} ${baseY || 2026}`;
  const minYearMonth = targetExamDate.slice(0, 7);

  return (
    <ModalPortal triggerKey="final-exam-dates-modal">
      <div className="fixed inset-0 z-[140] flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-xs select-none">
        <div className="relative bg-[#0d121f] border border-slate-800 text-slate-200 rounded-xl p-4 max-w-xl w-full shadow-xl space-y-3 font-sans">
          {/* Compact Header */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/90 pb-2.5">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-100 tracking-tight">
                {levelInfo.shortName} Exam Dates (Papers 1 – {sequentialPapers.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition"
              title="Close"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Compact Logic & Quick Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] bg-slate-900/70 border border-slate-800/90 rounded-lg px-2.5 py-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-slate-400">Month & Year:</span>
              <input
                type="month"
                value={baseYearMonth}
                min={minYearMonth}
                onChange={(e) => handleBaseYearMonthChange(e.target.value)}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded px-1.5 py-0.5 text-[11px] font-mono font-semibold text-slate-200 focus:outline-none focus:border-slate-600 cursor-pointer"
                title="Inherited from Target Exam Date — change here if needed"
              />
              <button
                type="button"
                onClick={() => setShowFullDateOverride(prev => !prev)}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline ml-1 cursor-pointer"
                title="Switch between quick Day entry and full YYYY-MM-DD picker"
              >
                {showFullDateOverride ? 'Use Day Only' : 'Full Date'}
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAutoFillAlternateDays}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[10px] font-medium flex items-center gap-1 cursor-pointer transition"
                title="Auto-fill +2 days gap starting from Paper 1 or Target Exam Date"
              >
                <Wand2 className="h-2.5 w-2.5 text-slate-300" />
                <span>+2d Auto-Fill</span>
              </button>
              {levelInfo.hasGroups && (
                <>
                  <button
                    type="button"
                    onClick={() => handleClearGroup('Group II')}
                    className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] cursor-pointer transition"
                  >
                    Grp I
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearGroup('Group I')}
                    className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] cursor-pointer transition"
                  >
                    Grp II
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => handleClearGroup('ALL')}
                className="px-1.5 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-300 border border-slate-800 text-[10px] cursor-pointer transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Compact Multi-Row Table for Sequential ICAI Papers */}
          <form onSubmit={handleSaveAndGenerateSprints} className="space-y-3">
            <div className="border border-slate-800 rounded-lg divide-y divide-slate-800/80 bg-slate-950/50">
              {sequentialPapers.map(paper => {
                const dateVal = paperDates[paper.subjectId] || '';
                const dayDraft = dayDrafts[paper.subjectId] || '';
                const sprintStartStr = dateVal ? addDaysToDateStr(dateVal, -1) : '';
                const rowMonthLabel = dateVal
                  ? `${SHORT_MONTHS[(Number(dateVal.slice(5, 7)) || 1) - 1]} ${dateVal.slice(0, 4)}`
                  : inheritedMonthLabel;
                const isPaperLocked = isSubjectLockedAfterFinalExam(paper.subjectId);

                return (
                  <div
                    key={paper.subjectId}
                    className={`px-3 py-2 flex items-center justify-between gap-3 text-xs transition ${
                      isPaperLocked ? 'bg-amber-950/20 opacity-85' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    {/* Left: Sequential Paper Code + Subject Name */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <span className="font-mono text-[11px] font-semibold text-slate-400 w-14 shrink-0">
                        {paper.codeLabel}
                      </span>
                      <span className="text-slate-200 font-medium truncate">
                        {paper.fullName}
                      </span>
                      {isPaperLocked && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono text-[9.5px] font-bold flex items-center gap-1 shrink-0">
                          <Lock className="h-2.5 w-2.5 text-amber-400" />
                          <span>Locked</span>
                        </span>
                      )}
                    </div>

                    {/* Middle Gap: Day Input (inherits Month & Year from Target Exam Date) or Full Date Override */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {!showFullDateOverride ? (
                        <div className={`flex items-center bg-slate-900 border border-slate-700/90 focus-within:border-slate-500 rounded px-2 py-1 gap-1.5 ${isPaperLocked ? 'opacity-70 cursor-not-allowed' : ''}`}>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="DD"
                            disabled={isPaperLocked}
                            value={dayDraft}
                            onChange={(e) => !isPaperLocked && handleDayInputChange(paper.subjectId, e.target.value)}
                            onBlur={() => !isPaperLocked && handleDayInputBlur(paper.subjectId)}
                            className="w-7 bg-transparent text-center font-mono text-xs font-bold text-white placeholder-slate-600 focus:outline-none disabled:cursor-not-allowed"
                            title={isPaperLocked ? 'Exam & 1.5D Sprint completed — date locked' : `Enter exam day (on or after ${targetExamDate})`}
                          />
                          <span className="text-[11px] font-mono text-slate-400 select-none">
                            {rowMonthLabel}
                          </span>
                        </div>
                      ) : (
                        <AttractiveDatePicker
                          disabled={isPaperLocked}
                          value={dateVal}
                          minDate={targetExamDate}
                          allowClear={!isPaperLocked}
                          onChange={(val) => !isPaperLocked && handleFullDateChange(paper.subjectId, val)}
                          accentColor="amber"
                          size="sm"
                          className="w-[136px]"
                          placeholder="Pick Date"
                        />
                      )}

                      {dateVal && !isPaperLocked && (
                        <button
                          type="button"
                          onClick={() => handleFullDateChange(paper.subjectId, '')}
                          className="p-1 text-slate-500 hover:text-slate-300 cursor-pointer"
                          title="Clear date"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>

                    {/* Right: Compact 1.5-Day Sprint Range */}
                    <div className="w-36 text-right font-mono text-[10.5px] shrink-0 hidden sm:block">
                      {dateVal ? (
                        <span className="text-slate-300">
                          1.5d: {formatShortDate(sprintStartStr)} – {formatShortDate(dateVal)}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compact Footer */}
            <div className="flex items-center justify-between gap-2 pt-1 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">
                {filledCount}/{sequentialPapers.length} papers set ({filledCount} × 1.5d sprints)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-semibold text-xs cursor-pointer transition flex items-center gap-1.5"
                >
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Save & Auto-Add Sprints</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
}
