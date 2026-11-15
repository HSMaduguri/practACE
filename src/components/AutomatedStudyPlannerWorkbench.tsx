/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  CheckCircle2, Plus, RotateCcw,
  Check, ArrowRight, CheckSquare,
  Square, X, RefreshCw, Search, ChevronDown, ChevronUp
} from 'lucide-react';
import { SubjectId, GoogleTask } from '../types';
import {
  StudyPhaseId,
  ABCCategory,
  ChapterConfidenceLevel,
  SubjectSequencingMode,
  DayOfWeekKey,
  AutomatedStudyPlanConfig,
  ChapterPlanInput,
  GeneratedMilestoneItem,
  PhaseReviewRecord,
  PHASE_LABELS,
  DAYS_OF_WEEK_ORDER,
  validateExceptionalDayLimit,
  computeFormulaExpectedMinutes,
  computeCalendarVsRequiredSummary,
  getPlannedPhasesList,
  generateAutomatedRoadmapAndDailySchedule,
  buildFullICAIChapterCatalog,
  classifyChapterICAI,
  loadCustomABCOverrides,
  saveCustomABCOverrides,
  STORAGE_KEY_AUTO_PLAN_CONFIG,
  STORAGE_KEY_CHAPTER_PLAN_INPUTS,
  STORAGE_KEY_PHASE_REVIEW_HISTORY
} from '../utils/automatedStudyPlannerEngine';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';
import { getLevelSubjectIds, getLevelScopedKey, isSubjectInLevel } from '../utils/levelStorage';

interface AutomatedStudyPlannerWorkbenchProps {
  initialMode?: 'setup' | 'amend' | 'icai_matrix';
  config: AutomatedStudyPlanConfig;
  chapterInputs: ChapterPlanInput[];
  existingTasks: GoogleTask[];
  existingCheckpoints: GeneratedMilestoneItem[];
  onSaveAndApplyPlan: (
    updatedConfig: AutomatedStudyPlanConfig,
    updatedChapterInputs: ChapterPlanInput[],
    generatedCheckpoints: GeneratedMilestoneItem[],
    mergedTasks: GoogleTask[],
    reviewRecord?: PhaseReviewRecord
  ) => void;
  onContinueExistingPlan?: (
    updatedConfig: AutomatedStudyPlanConfig,
    reviewRecord: PhaseReviewRecord
  ) => void;
  onUpdateChapterInputs?: (updatedChapterInputs: ChapterPlanInput[]) => void;
  onClose?: () => void;
}

const SUBJECT_NAMES_MAP: Record<SubjectId, string> = {
  // CA Foundation
  Accounts: 'Paper 1: Accounting',
  Law: 'Paper 2: Business Laws',
  MathStats: 'Paper 3: Quantitative Aptitude',
  Econ: 'Paper 4: Business Economics',
  // CA Intermediate
  AdvAcc: 'Paper 1: Advanced Accounting',
  CorpLaw: 'Paper 2: Corporate & Other Laws',
  Tax: 'Paper 3: Taxation',
  Cost: 'Paper 4: Cost & Management Accounting',
  AuditInter: 'Paper 5: Auditing & Ethics',
  FMSM: 'Paper 6: Financial & Strategic Mgmt',
  // CA Final
  FR: 'Paper 1: Financial Reporting',
  AFM: 'Paper 2: Adv. Financial Management',
  Audit: 'Paper 3: Advanced Auditing',
  DT: 'Paper 4: Direct Tax & Int. Tax',
  IDT: 'Paper 5: Indirect Tax Laws',
  IBS: 'Paper 6: Integrated Business Solutions',
  // CMA Foundation (4 Papers)
  CMAFoundLaw: 'Paper 1: Business Laws & Business Communication',
  CMAFoundAcc: 'Paper 2: Financial & Cost Accounting',
  CMAFoundMath: 'Paper 3: Business Mathematics & Statistics',
  CMAFoundEcon: 'Paper 4: Business Economics & Management',
  // CMA Intermediate (4+4 = 8 Papers)
  CMAInterLaw: 'Paper 5: Business Laws & Ethics',
  CMAInterFA: 'Paper 6: Financial Accounting',
  CMAInterTax: 'Paper 7: Direct & Indirect Taxation',
  CMAInterCost: 'Paper 8: Cost Accounting',
  CMAInterOMSM: 'Paper 9: Operations Mgmt & Strategic Mgmt',
  CMAInterCAA: 'Paper 10: Corporate Accounting & Auditing',
  CMAInterFMDA: 'Paper 11: Financial Mgmt & Business Data Analytics',
  CMAInterMA: 'Paper 12: Management Accounting',
  // CMA Final (4+4 = 8 Papers)
  CMAFinalLaw: 'Paper 13: Corporate & Economic Laws',
  CMAFinalSFM: 'Paper 14: Strategic Financial Management',
  CMAFinalDT: 'Paper 15: Direct Tax Laws & International Taxation',
  CMAFinalSCM: 'Paper 16: Strategic Cost Management',
  CMAFinalCMA: 'Paper 17: Cost & Management Audit',
  CMAFinalCFR: 'Paper 18: Corporate Financial Reporting',
  CMAFinalIDT: 'Paper 19: Indirect Tax Laws & Practice',
  CMAFinalSPBV: 'Paper 20: Strategic Performance Mgmt & Business Valuation'
};

const WEEKDAY_KEYS: DayOfWeekKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WEEKEND_KEYS: DayOfWeekKey[] = ['Sat', 'Sun'];

export default function AutomatedStudyPlannerWorkbench({
  initialMode = 'setup',
  config: propConfig,
  chapterInputs: propChapterInputs,
  existingTasks,
  existingCheckpoints,
  onSaveAndApplyPlan,
  onContinueExistingPlan,
  onUpdateChapterInputs,
  onClose
}: AutomatedStudyPlannerWorkbenchProps) {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const ALL_SUBJECTS = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);

  const [activeTab, setActiveTab] = useState<'setup' | 'chapters' | 'amend' | 'icai_reference'>(
    initialMode === 'amend'
      ? 'amend'
      : initialMode === 'icai_matrix'
        ? 'icai_reference'
        : 'setup'
  );

  const [draftConfig, setDraftConfig] = useState<AutomatedStudyPlanConfig>(() => ({
    ...propConfig,
    activeSubjectsFilter:
      Array.isArray(propConfig.activeSubjectsFilter) &&
      propConfig.activeSubjectsFilter.some((s) => isSubjectInLevel(s, caLevel))
        ? propConfig.activeSubjectsFilter.filter((s) => isSubjectInLevel(s, caLevel))
        : [...getLevelSubjectIds(caLevel)]
  }));

  const [draftChapters, setDraftChapters] = useState<ChapterPlanInput[]>(() =>
    propChapterInputs.map((c) => ({
      ...c,
      expectedMinutesByPhase: { ...c.expectedMinutesByPhase },
      isUserEditedTime: { ...c.isUserEditedTime }
    }))
  );

  // Simple UI progressive-disclosure states
  const [showPerDayHours, setShowPerDayHours] = useState<boolean>(false);
  const [showOptionalSettings, setShowOptionalSettings] = useState<boolean>(
    () => propConfig.exceptionalDays.length > 0 || propConfig.defaultCompletionCondition === 'mock_test_required'
  );
  const [showAllPhaseColumns, setShowAllPhaseColumns] = useState<boolean>(false);

  // Filters for Chapters view
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<SubjectId>(() => getLevelSubjectIds(caLevel)[0] || 'FR');
  const [selectedABCFilter, setSelectedABCFilter] = useState<'ALL' | ABCCategory>('ALL');
  const [chapterSearch, setChapterSearch] = useState<string>('');

  React.useEffect(() => {
    const subs = getLevelSubjectIds(caLevel);
    if (!subs.includes(selectedSubjectFilter)) {
      setSelectedSubjectFilter(subs[0]);
    }
  }, [caLevel, selectedSubjectFilter]);

  // Days off / custom hours form state
  const [newExDate, setNewExDate] = useState<string>('');
  const [newExHours, setNewExHours] = useState<number>(0);
  const [newExReason, setNewExReason] = useState<string>('');
  const [exErrorMsg, setExErrorMsg] = useState<string>('');

  // Amendment mode state
  const [amendDecision, setAmendDecision] = useState<'continue' | 'amend'>('amend');
  const [amendStartFromDate, setAmendStartFromDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [amendTargetPhase, setAmendTargetPhase] = useState<StudyPhaseId>(() => {
    const planned = getPlannedPhasesList(propConfig);
    const currIdx = planned.indexOf(propConfig.activePhaseId);
    if (currIdx >= 0 && currIdx + 1 < planned.length) {
      return planned[currIdx + 1];
    }
    return propConfig.activePhaseId || 'rev1';
  });
  const [amendNotes, setAmendNotes] = useState<string>('');
  const [amendedCount, setAmendedCount] = useState<number>(0);

  const catalogMap = useMemo(() => {
    const map = new Map<string, number>();
    buildFullICAIChapterCatalog(caLevel).forEach((item) => {
      map.set(`${item.subjectId}::${item.chapterName}`, item.baseStudyMinutes);
    });
    return map;
  }, [caLevel]);

  const plannedPhases = useMemo(() => getPlannedPhasesList(draftConfig), [draftConfig]);
  const primaryPhase: StudyPhaseId = plannedPhases[0] || 'rev1';

  const capacitySummary = useMemo(() => {
    const startFrom = activeTab === 'amend' ? amendStartFromDate : draftConfig.prepStartDate;
    const phasesForSummary =
      activeTab === 'amend'
        ? plannedPhases.slice(Math.max(0, plannedPhases.indexOf(amendTargetPhase)))
        : plannedPhases;
    return computeCalendarVsRequiredSummary(draftConfig, draftChapters, startFrom, phasesForSummary, caLevel);
  }, [draftConfig, draftChapters, plannedPhases, activeTab, amendStartFromDate, amendTargetPhase, caLevel]);

  const weekdayAvgHours = useMemo(() => {
    const total = WEEKDAY_KEYS.reduce((acc, k) => acc + (draftConfig.weeklyHoursByDay[k] || 0), 0);
    return Number((total / WEEKDAY_KEYS.length).toFixed(1));
  }, [draftConfig.weeklyHoursByDay]);

  const weekendAvgHours = useMemo(() => {
    const total = WEEKEND_KEYS.reduce((acc, k) => acc + (draftConfig.weeklyHoursByDay[k] || 0), 0);
    return Number((total / WEEKEND_KEYS.length).toFixed(1));
  }, [draftConfig.weeklyHoursByDay]);

  const weeklyTotalHours = useMemo(
    () => (Object.values(draftConfig.weeklyHoursByDay) as number[]).reduce((a, b) => a + b, 0),
    [draftConfig.weeklyHoursByDay]
  );

  const handleSetBulkDayHours = (keys: DayOfWeekKey[], hours: number) => {
    const clamped = Math.max(0, Math.min(16, Number(hours) || 0));
    setDraftConfig((prev) => {
      const next = { ...prev.weeklyHoursByDay };
      keys.forEach((k) => {
        next[k] = clamped;
      });
      return { ...prev, weeklyHoursByDay: next };
    });
  };

  const handleAddExceptionalDay = () => {
    setExErrorMsg('');
    if (!newExDate) {
      setExErrorMsg('Please pick a date.');
      return;
    }
    const check = validateExceptionalDayLimit(draftConfig.exceptionalDays, newExDate);
    if (!check.valid) {
      setExErrorMsg(check.message || 'Maximum 3 custom days per month.');
      return;
    }
    const clampedHours = Math.max(0, Math.min(18, Number(newExHours) || 0));
    setDraftConfig((prev) => {
      const filtered = prev.exceptionalDays.filter((d) => d.date !== newExDate);
      return {
        ...prev,
        exceptionalDays: [
          ...filtered,
          { date: newExDate, hours: clampedHours, reason: newExReason.trim() || undefined }
        ].sort((a, b) => a.date.localeCompare(b.date))
      };
    });
    setNewExDate('');
    setNewExReason('');
  };

  const handleRemoveExceptionalDay = (dateStr: string) => {
    setDraftConfig((prev) => ({
      ...prev,
      exceptionalDays: prev.exceptionalDays.filter((d) => d.date !== dateStr)
    }));
  };

  const handleUpdateChapterConfidence = (
    subjectId: SubjectId,
    chapterName: string,
    confidence: ChapterConfidenceLevel
  ) => {
    setAmendedCount((c) => c + 1);
    setDraftChapters((prev) =>
      prev.map((ch) => {
        if (ch.subjectId !== subjectId || ch.chapterName !== chapterName) return ch;
        const baseMins = catalogMap.get(`${subjectId}::${chapterName}`) || 180;
        const updatedTimes = { ...ch.expectedMinutesByPhase };
        (['baseline', 'rev1', 'rev2', 'rev3'] as StudyPhaseId[]).forEach((pId) => {
          if (!ch.isUserEditedTime[pId]) {
            updatedTimes[pId] = computeFormulaExpectedMinutes(
              baseMins,
              ch.abcCategory,
              pId,
              confidence,
              ch.isSkipped,
              ch.lastStudiedDate
            );
          }
        });
        return {
          ...ch,
          confidence,
          expectedMinutesByPhase: updatedTimes
        };
      })
    );
  };

  const handleUpdateChapterABCCategory = (
    subjectId: SubjectId,
    chapterName: string,
    nextCategory: ABCCategory
  ) => {
    setAmendedCount((c) => c + 1);
    const overrides = loadCustomABCOverrides(caLevel);
    const defaultCat = classifyChapterICAI(subjectId, chapterName, true).abcCategory;
    const key = `${subjectId}::${chapterName}`;
    if (nextCategory === defaultCat) {
      delete overrides[key];
    } else {
      overrides[key] = nextCategory;
    }

    setDraftChapters((prev) => {
      const nextList = prev.map((ch) => {
        if (ch.subjectId !== subjectId || ch.chapterName !== chapterName) return ch;
        const baseMins = catalogMap.get(key) || 180;
        const updatedTimes = { ...ch.expectedMinutesByPhase };
        (['baseline', 'rev1', 'rev2', 'rev3'] as StudyPhaseId[]).forEach((pId) => {
          if (!ch.isUserEditedTime[pId]) {
            updatedTimes[pId] = computeFormulaExpectedMinutes(
              baseMins,
              nextCategory,
              pId,
              ch.confidence,
              ch.isSkipped,
              ch.lastStudiedDate
            );
          }
        });
        return {
          ...ch,
          abcCategory: nextCategory,
          expectedMinutesByPhase: updatedTimes
        };
      });

      try {
        localStorage.setItem(getLevelScopedKey(STORAGE_KEY_CHAPTER_PLAN_INPUTS, caLevel), JSON.stringify(nextList));
      } catch (e) {}
      saveCustomABCOverrides(overrides, caLevel);
      onUpdateChapterInputs?.(nextList);
      return nextList;
    });
  };

  const handleResetABCToDefaults = (subjectFilter?: SubjectId) => {
    const overrides = loadCustomABCOverrides(caLevel);
    if (subjectFilter) {
      Object.keys(overrides).forEach((k) => {
        if (k.startsWith(`${subjectFilter}::`)) {
          delete overrides[k];
        }
      });
    } else {
      Object.keys(overrides).forEach((k) => delete overrides[k]);
    }

    setDraftChapters((prev) => {
      const nextList = prev.map((ch) => {
        if (subjectFilter && ch.subjectId !== subjectFilter) return ch;
        const defaultCat = classifyChapterICAI(ch.subjectId, ch.chapterName, true).abcCategory;
        const baseMins = catalogMap.get(`${ch.subjectId}::${ch.chapterName}`) || 180;
        const updatedTimes = { ...ch.expectedMinutesByPhase };
        (['baseline', 'rev1', 'rev2', 'rev3'] as StudyPhaseId[]).forEach((pId) => {
          if (!ch.isUserEditedTime[pId]) {
            updatedTimes[pId] = computeFormulaExpectedMinutes(
              baseMins,
              defaultCat,
              pId,
              ch.confidence,
              ch.isSkipped,
              ch.lastStudiedDate
            );
          }
        });
        return {
          ...ch,
          abcCategory: defaultCat,
          expectedMinutesByPhase: updatedTimes
        };
      });

      try {
        localStorage.setItem(getLevelScopedKey(STORAGE_KEY_CHAPTER_PLAN_INPUTS, caLevel), JSON.stringify(nextList));
      } catch (e) {}
      saveCustomABCOverrides(overrides, caLevel);
      onUpdateChapterInputs?.(nextList);
      return nextList;
    });
  };

  const handleToggleSkipChapter = (subjectId: SubjectId, chapterName: string) => {
    setAmendedCount((c) => c + 1);
    setDraftChapters((prev) =>
      prev.map((ch) => {
        if (ch.subjectId !== subjectId || ch.chapterName !== chapterName) return ch;
        const nextSkip = !ch.isSkipped;
        const baseMins = catalogMap.get(`${subjectId}::${chapterName}`) || 180;
        const updatedTimes = { ...ch.expectedMinutesByPhase };
        (['baseline', 'rev1', 'rev2', 'rev3'] as StudyPhaseId[]).forEach((pId) => {
          updatedTimes[pId] = nextSkip
            ? 0
            : computeFormulaExpectedMinutes(
                baseMins,
                ch.abcCategory,
                pId,
                ch.confidence,
                false,
                ch.lastStudiedDate
              );
        });
        return {
          ...ch,
          isSkipped: nextSkip,
          expectedMinutesByPhase: updatedTimes
        };
      })
    );
  };

  const handleEditChapterExpectedHours = (
    subjectId: SubjectId,
    chapterName: string,
    phaseId: StudyPhaseId,
    hoursValue: number
  ) => {
    const mins = Math.max(0, Math.round(hoursValue * 60));
    setAmendedCount((c) => c + 1);
    setDraftChapters((prev) =>
      prev.map((ch) => {
        if (ch.subjectId !== subjectId || ch.chapterName !== chapterName) return ch;
        return {
          ...ch,
          expectedMinutesByPhase: {
            ...ch.expectedMinutesByPhase,
            [phaseId]: mins
          },
          isUserEditedTime: {
            ...ch.isUserEditedTime,
            [phaseId]: true
          }
        };
      })
    );
  };

  const handleResetChapterFormulaTime = (subjectId: SubjectId, chapterName: string) => {
    setDraftChapters((prev) =>
      prev.map((ch) => {
        if (ch.subjectId !== subjectId || ch.chapterName !== chapterName) return ch;
        const baseMins = catalogMap.get(`${subjectId}::${chapterName}`) || 180;
        const updatedTimes: Record<StudyPhaseId, number> = {
          baseline: computeFormulaExpectedMinutes(baseMins, ch.abcCategory, 'baseline', ch.confidence, ch.isSkipped, ch.lastStudiedDate),
          rev1: computeFormulaExpectedMinutes(baseMins, ch.abcCategory, 'rev1', ch.confidence, ch.isSkipped, ch.lastStudiedDate),
          rev2: computeFormulaExpectedMinutes(baseMins, ch.abcCategory, 'rev2', ch.confidence, ch.isSkipped, ch.lastStudiedDate),
          rev3: computeFormulaExpectedMinutes(baseMins, ch.abcCategory, 'rev3', ch.confidence, ch.isSkipped, ch.lastStudiedDate)
        };
        return {
          ...ch,
          expectedMinutesByPhase: updatedTimes,
          isUserEditedTime: { baseline: false, rev1: false, rev2: false, rev3: false }
        };
      })
    );
  };

  const handleBulkSubjectAction = (
    subjectId: SubjectId,
    action: 'all_low' | 'all_medium' | 'all_high' | 'skip_cat_c' | 'include_all'
  ) => {
    setAmendedCount((c) => c + 1);
    setDraftChapters((prev) =>
      prev.map((ch) => {
        if (ch.subjectId !== subjectId) return ch;
        const baseMins = catalogMap.get(`${ch.subjectId}::${ch.chapterName}`) || 180;
        let nextConf = ch.confidence;
        let nextSkip = ch.isSkipped;

        if (action === 'all_low') nextConf = 'low';
        if (action === 'all_medium') nextConf = 'medium';
        if (action === 'all_high') nextConf = 'high';
        if (action === 'skip_cat_c') nextSkip = ch.abcCategory === 'C';
        if (action === 'include_all') nextSkip = false;

        const updatedTimes = { ...ch.expectedMinutesByPhase };
        (['baseline', 'rev1', 'rev2', 'rev3'] as StudyPhaseId[]).forEach((pId) => {
          updatedTimes[pId] = nextSkip
            ? 0
            : computeFormulaExpectedMinutes(baseMins, ch.abcCategory, pId, nextConf, false, ch.lastStudiedDate);
        });

        return {
          ...ch,
          confidence: nextConf,
          isSkipped: nextSkip,
          expectedMinutesByPhase: updatedTimes,
          isUserEditedTime: { baseline: false, rev1: false, rev2: false, rev3: false }
        };
      })
    );
  };

  const filteredChaptersForSubject = useMemo(() => {
    return draftChapters.filter((ch) => {
      if (ch.subjectId !== selectedSubjectFilter) return false;
      if (selectedABCFilter !== 'ALL' && ch.abcCategory !== selectedABCFilter) return false;
      if (
        chapterSearch.trim() &&
        !ch.chapterName.toLowerCase().includes(chapterSearch.toLowerCase()) &&
        !ch.icaiSectionName.toLowerCase().includes(chapterSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [draftChapters, selectedSubjectFilter, selectedABCFilter, chapterSearch]);

  const handleCommitFullPlan = () => {
    const finalizedConfig: AutomatedStudyPlanConfig = {
      ...draftConfig,
      isConfigured: true,
      activePhaseId: plannedPhases[0] || 'rev1',
      lastGeneratedAt: new Date().toISOString()
    };

    const result = generateAutomatedRoadmapAndDailySchedule(
      finalizedConfig,
      draftChapters,
      existingTasks,
      existingCheckpoints
    );

    try {
      localStorage.setItem(getLevelScopedKey(STORAGE_KEY_AUTO_PLAN_CONFIG, caLevel), JSON.stringify(finalizedConfig));
      localStorage.setItem(getLevelScopedKey(STORAGE_KEY_CHAPTER_PLAN_INPUTS, caLevel), JSON.stringify(draftChapters));
    } catch (e) {}

    onSaveAndApplyPlan(finalizedConfig, draftChapters, result.checkpoints, result.mergedTasks);
  };

  const handleExecutePhaseReviewOrAmend = () => {
    const completedPhase = draftConfig.activePhaseId;
    const nextCompletedList = Array.from(new Set([...draftConfig.completedPhases, completedPhase]));

    const reviewRecord: PhaseReviewRecord = {
      phaseId: completedPhase,
      reviewedAt: new Date().toISOString(),
      decision: amendDecision === 'continue' ? 'continue' : 'amended',
      amendedChaptersCount: amendDecision === 'continue' ? 0 : amendedCount,
      notes: amendNotes.trim() || undefined
    };

    try {
      const reviewKey = getLevelScopedKey(STORAGE_KEY_PHASE_REVIEW_HISTORY, caLevel);
      const existingHistoryRaw = localStorage.getItem(reviewKey);
      const existingHistory: PhaseReviewRecord[] = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      localStorage.setItem(reviewKey, JSON.stringify([reviewRecord, ...existingHistory]));
    } catch (e) {}

    if (amendDecision === 'continue') {
      const updatedConfig: AutomatedStudyPlanConfig = {
        ...draftConfig,
        activePhaseId: amendTargetPhase,
        completedPhases: nextCompletedList
      };
      try {
        localStorage.setItem(getLevelScopedKey(STORAGE_KEY_AUTO_PLAN_CONFIG, caLevel), JSON.stringify(updatedConfig));
      } catch (e) {}
      if (onContinueExistingPlan) {
        onContinueExistingPlan(updatedConfig, reviewRecord);
      } else if (onClose) {
        onClose();
      }
      return;
    }

    const startIdx = Math.max(0, plannedPhases.indexOf(amendTargetPhase));
    const remainingPhases = plannedPhases.slice(startIdx);

    const updatedConfig: AutomatedStudyPlanConfig = {
      ...draftConfig,
      isConfigured: true,
      activePhaseId: amendTargetPhase,
      completedPhases: nextCompletedList,
      lastAmendedAt: new Date().toISOString()
    };

    const result = generateAutomatedRoadmapAndDailySchedule(
      updatedConfig,
      draftChapters,
      existingTasks,
      existingCheckpoints,
      {
        startFromDate: amendStartFromDate,
        phasesToGenerate: remainingPhases.length > 0 ? remainingPhases : [amendTargetPhase],
        preserveCompletedBeforeStart: true
      }
    );

    try {
      localStorage.setItem(getLevelScopedKey(STORAGE_KEY_AUTO_PLAN_CONFIG, caLevel), JSON.stringify(updatedConfig));
      localStorage.setItem(getLevelScopedKey(STORAGE_KEY_CHAPTER_PLAN_INPUTS, caLevel), JSON.stringify(draftChapters));
    } catch (e) {}

    onSaveAndApplyPlan(updatedConfig, draftChapters, result.checkpoints, result.mergedTasks, reviewRecord);
  };

  const availableHours = capacitySummary.totalAvailableMinutes / 60;
  const requiredHours = capacitySummary.totalRequiredMinutes / 60;
  const scheduleFits = requiredHours <= availableHours;

  return (
    <div className="relative w-full bg-slate-950/65 backdrop-blur-2xl text-slate-100 border-t border-x border-b-0 border-white/12 rounded-t-2xl rounded-b-none shadow-[0_24px_64px_-16px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.1)] flex flex-col select-none font-sans">
      {/* Ambient Depth Glow Behind Frosted Glass */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-28 -left-24 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute top-1/4 -right-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Frosted Glass Top Bar */}
      <div className="relative z-10 bg-white/[0.04] backdrop-blur-xl border-b border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight whitespace-nowrap shrink-0">
            {levelInfo.shortName} Auto Planner
          </h2>
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-xs text-slate-300 font-mono tabular-nums whitespace-nowrap">
            {capacitySummary.activeStudyDays} study days · {availableHours.toFixed(0)}h available · {requiredHours.toFixed(0)}h needed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950/60 backdrop-blur-xl border border-white/12 rounded-xl p-1 text-xs gap-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <button
              type="button"
              onClick={() => setActiveTab('setup')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer font-semibold whitespace-nowrap shrink-0 transition ${
                activeTab === 'setup'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-300/50 font-bold shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              Plan Setup
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('chapters')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer font-semibold whitespace-nowrap shrink-0 transition ${
                activeTab === 'chapters'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-300/50 font-bold shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              Chapters
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('amend')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer font-semibold whitespace-nowrap shrink-0 transition ${
                activeTab === 'amend'
                  ? 'bg-cyan-400/25 text-cyan-200 border border-cyan-300/50 font-bold shadow-[0_0_16px_rgba(34,211,238,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              Update Plan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('icai_reference')}
              className={`px-3 py-1.5 rounded-lg cursor-pointer font-semibold whitespace-nowrap shrink-0 transition ${
                activeTab === 'icai_reference'
                  ? 'bg-amber-400/25 text-amber-200 border border-amber-300/50 font-bold shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              ABC Matrix
            </button>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-slate-300 hover:text-white border border-white/10 cursor-pointer shrink-0 transition"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 p-4 sm:p-5 pb-2 space-y-5">
        {/* 1. PLAN SETUP (MUST OPTIONS ONLY) */}
        {activeTab === 'setup' && (
          <div className="max-w-6xl mx-auto space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
              {/* Left Column: Dates, Subjects, Revisions & Mocks */}
              <div className="lg:col-span-6 bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <div className="space-y-5">
                  <h3 className="text-sm font-bold text-white border-b border-white/10 pb-2.5">
                    1. Exam Dates &amp; Subjects
                  </h3>

                  {/* Start & Exam Dates */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Start Studying On
                      </label>
                      <input
                        type="date"
                        value={draftConfig.prepStartDate}
                        onChange={(e) =>
                          e.target.value && setDraftConfig((prev) => ({ ...prev, prepStartDate: e.target.value }))
                        }
                        className="w-full bg-slate-950/60 hover:bg-slate-950/80 backdrop-blur-md border border-white/12 focus:border-amber-400/60 focus:outline-none rounded-xl px-3 py-2 text-sm text-white font-mono tabular-nums transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Exam Starts On
                      </label>
                      <input
                        type="date"
                        value={draftConfig.examDate}
                        onChange={(e) =>
                          e.target.value && setDraftConfig((prev) => ({ ...prev, examDate: e.target.value }))
                        }
                        className="w-full bg-slate-950/60 hover:bg-slate-950/80 backdrop-blur-md border border-amber-400/30 focus:border-amber-400/70 focus:outline-none rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold tabular-nums transition"
                      />
                    </div>
                  </div>

                  {/* Subjects Included */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-semibold text-slate-300">
                        Subjects to Study
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig((prev) => ({ ...prev, activeSubjectsFilter: [...ALL_SUBJECTS] }))
                        }
                        className="text-xs text-amber-300 hover:text-amber-200 font-semibold cursor-pointer"
                      >
                        Select All
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {ALL_SUBJECTS.map((sub) => {
                        const isIncluded = draftConfig.activeSubjectsFilter.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => {
                              setDraftConfig((prev) => {
                                const exists = prev.activeSubjectsFilter.includes(sub);
                                if (exists && prev.activeSubjectsFilter.length === 1) return prev;
                                const next = exists
                                  ? prev.activeSubjectsFilter.filter((s) => s !== sub)
                                  : [...prev.activeSubjectsFilter, sub];
                                return { ...prev, activeSubjectsFilter: next };
                              });
                            }}
                            className={`px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap backdrop-blur-md transition ${
                              isIncluded
                                ? 'bg-amber-400/18 border-amber-300/50 text-amber-200 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.2)]'
                                : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                            }`}
                          >
                            {isIncluded ? (
                              <CheckSquare className="h-3.5 w-3.5 text-amber-300 shrink-0" />
                            ) : (
                              <Square className="h-3.5 w-3.5 shrink-0" />
                            )}
                            <span>{sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Revisions, First Reading & Mocks */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2 border-t border-white/10">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Revisions
                      </label>
                      <select
                        value={draftConfig.plannedRevisionsCount}
                        onChange={(e) =>
                          setDraftConfig((prev) => ({
                            ...prev,
                            plannedRevisionsCount: Number(e.target.value) as 1 | 2 | 3
                          }))
                        }
                        className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-3 py-2 text-sm text-white font-semibold cursor-pointer focus:outline-none focus:border-amber-400/60"
                      >
                        <option value={1}>1 Revision</option>
                        <option value={2}>2 Revisions</option>
                        <option value={3}>3 Revisions</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        1st-Time Reading
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig((prev) => ({ ...prev, includeBaseline: !prev.includeBaseline }))
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-sm font-semibold flex items-center justify-between cursor-pointer backdrop-blur-md transition ${
                          draftConfig.includeBaseline
                            ? 'bg-emerald-500/18 text-emerald-200 border-emerald-400/45 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.2)]'
                            : 'bg-white/[0.03] text-slate-400 border-white/10 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>{draftConfig.includeBaseline ? 'Included' : 'Revisions Only'}</span>
                        {draftConfig.includeBaseline ? (
                          <CheckSquare className="h-4 w-4 text-emerald-300 shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 shrink-0" />
                        )}
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                        Mock Tests
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={18}
                        value={draftConfig.plannedMocksCount}
                        onChange={(e) =>
                          setDraftConfig((prev) => ({
                            ...prev,
                            plannedMocksCount: Math.max(0, Math.min(18, Number(e.target.value) || 0))
                          }))
                        }
                        className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 focus:border-amber-400/60 focus:outline-none rounded-xl px-3 py-2 text-sm text-amber-300 font-mono font-bold tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Daily Study Hours & Subject Order */}
              <div className="lg:col-span-6 bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-5 flex flex-col justify-between space-y-5 shadow-[0_8px_32px_0_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                    <h3 className="text-sm font-bold text-white">
                      2. Daily Study Hours &amp; Style
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-400/30 text-xs font-mono text-emerald-300 font-semibold tabular-nums">
                      {weeklyTotalHours} hrs / week
                    </span>
                  </div>

                  {/* Simple Weekday / Weekend Hours + Optional Per-Day Edit */}
                  <div className="space-y-3">
                    {!showPerDayHours ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Weekdays (Mon–Fri)
                          </label>
                          <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              max={16}
                              step={0.5}
                              value={weekdayAvgHours}
                              onChange={(e) => handleSetBulkDayHours(WEEKDAY_KEYS, Number(e.target.value))}
                              className="w-full bg-transparent text-sm text-white font-mono font-bold focus:outline-none tabular-nums"
                            />
                            <span className="text-xs text-slate-400 shrink-0">hrs/day</span>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                            Weekends (Sat–Sun)
                          </label>
                          <div className="flex items-center gap-2 bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-3 py-2">
                            <input
                              type="number"
                              min={0}
                              max={16}
                              step={0.5}
                              value={weekendAvgHours}
                              onChange={(e) => handleSetBulkDayHours(WEEKEND_KEYS, Number(e.target.value))}
                              className="w-full bg-transparent text-sm text-amber-300 font-mono font-bold focus:outline-none tabular-nums"
                            />
                            <span className="text-xs text-slate-400 shrink-0">hrs/day</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-7 gap-1.5">
                        {DAYS_OF_WEEK_ORDER.map((dayKey) => (
                          <div key={dayKey} className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center">
                            <span className="text-[11px] font-semibold text-slate-300 block">{dayKey}</span>
                            <input
                              type="number"
                              min={0}
                              max={16}
                              step={0.5}
                              value={draftConfig.weeklyHoursByDay[dayKey]}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(16, Number(e.target.value) || 0));
                                setDraftConfig((prev) => ({
                                  ...prev,
                                  weeklyHoursByDay: {
                                    ...prev.weeklyHoursByDay,
                                    [dayKey]: val
                                  }
                                }));
                              }}
                              className="w-full bg-white/[0.05] border border-white/15 rounded-lg px-1 py-1 text-center text-xs font-mono font-bold text-white mt-1 tabular-nums focus:outline-none focus:border-amber-400/60"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowPerDayHours((v) => !v)}
                        className="text-xs text-cyan-300 hover:text-cyan-200 font-semibold cursor-pointer"
                      >
                        {showPerDayHours ? 'Use Simple Weekday / Weekend Hours' : 'Customize Each Day (Mon–Sun)'}
                      </button>
                    </div>
                  </div>

                  {/* Study Style */}
                  <div className="pt-2 border-t border-white/10 space-y-2.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      How Should Subjects Be Scheduled?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        {
                          id: 'single_subject' as SubjectSequencingMode,
                          title: 'One Subject at a Time'
                        },
                        {
                          id: 'daily_pair' as SubjectSequencingMode,
                          title: '2 Subjects per Day'
                        },
                        {
                          id: 'group_wise' as SubjectSequencingMode,
                          title: caLevel === 'foundation' ? 'Papers 1–2, then 3–4' : 'Group I, then Group II'
                        },
                        {
                          id: 'consolidated' as SubjectSequencingMode,
                          title: 'Mix High-Priority Topics'
                        }
                      ].map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => setDraftConfig((prev) => ({ ...prev, sequencingMode: mode.id }))}
                          className={`px-3 py-2.5 rounded-xl border text-left text-xs font-semibold cursor-pointer flex items-center justify-between backdrop-blur-md transition ${
                            draftConfig.sequencingMode === mode.id
                              ? 'bg-cyan-500/18 border-cyan-300/50 text-cyan-100 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.2)]'
                              : 'bg-white/[0.03] border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.06]'
                          }`}
                        >
                          <span className="truncate">{mode.title}</span>
                          {draftConfig.sequencingMode === mode.id && (
                            <Check className="h-3.5 w-3.5 text-cyan-300 shrink-0 ml-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Extra Settings (Collapsed by Default so First View Stays Clean) */}
            <div className="bg-white/[0.035] backdrop-blur-xl border border-white/12 rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <button
                type="button"
                onClick={() => setShowOptionalSettings((v) => !v)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.03] cursor-pointer transition"
              >
                <span>
                  Optional: Leave Days, Custom Hours &amp; Exam Gate Rule
                  {draftConfig.exceptionalDays.length > 0 && (
                    <span className="ml-2 text-amber-300 font-mono">
                      ({draftConfig.exceptionalDays.length} custom day{draftConfig.exceptionalDays.length === 1 ? '' : 's'})
                    </span>
                  )}
                </span>
                {showOptionalSettings ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              {showOptionalSettings && (
                <div className="px-5 pb-5 pt-3 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Leave / Custom Days */}
                  <div className="lg:col-span-8 space-y-3">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Add a Leave Day or Extra-Hours Day (Max 3 per month)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                      <div className="sm:col-span-4">
                        <input
                          type="date"
                          value={newExDate}
                          min={draftConfig.prepStartDate}
                          max={draftConfig.examDate}
                          onChange={(e) => setNewExDate(e.target.value)}
                          className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-2.5 py-2 text-white font-mono"
                        />
                      </div>
                      <div className="sm:col-span-3 flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-2.5 py-2">
                        <input
                          type="number"
                          min={0}
                          max={16}
                          step={0.5}
                          value={newExHours}
                          onChange={(e) => setNewExHours(Number(e.target.value))}
                          className="w-full bg-transparent text-amber-300 font-mono font-bold focus:outline-none tabular-nums"
                          placeholder="0"
                        />
                        <span className="text-slate-400 shrink-0">hrs</span>
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          value={newExReason}
                          onChange={(e) => setNewExReason(e.target.value)}
                          className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-2.5 py-2 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="button"
                          onClick={handleAddExceptionalDay}
                          className="w-full h-full bg-amber-400/25 hover:bg-amber-400/35 border border-amber-300/50 text-amber-200 font-bold rounded-xl px-3 py-2 cursor-pointer flex items-center justify-center gap-1 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>

                    {exErrorMsg && (
                      <div className="text-xs text-rose-300 font-medium">{exErrorMsg}</div>
                    )}

                    {draftConfig.exceptionalDays.length > 0 && (
                      <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-950/50 backdrop-blur-md">
                        <table className="w-full text-left text-xs font-mono">
                          <tbody className="divide-y divide-white/10">
                            {draftConfig.exceptionalDays.map((item) => (
                              <tr key={item.date}>
                                <td className="py-2 px-3 font-bold text-white tabular-nums">{item.date}</td>
                                <td className="py-2 px-3 text-amber-300 font-bold tabular-nums">{item.hours} hrs</td>
                                <td className="py-2 px-3 text-slate-300 font-sans">{item.reason || 'Custom Hours'}</td>
                                <td className="py-2 px-3 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExceptionalDay(item.date)}
                                    className="text-rose-400 hover:text-rose-300 font-sans cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Checkpoint Completion Rule */}
                  <div className="lg:col-span-4 space-y-2.5">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Subject Completion Rule
                    </label>
                    <div className="space-y-2 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig((prev) => ({ ...prev, defaultCompletionCondition: 'targets_only' }))
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-left font-semibold flex items-center justify-between cursor-pointer backdrop-blur-md transition ${
                          draftConfig.defaultCompletionCondition === 'targets_only'
                            ? 'bg-emerald-500/18 border-emerald-400/45 text-emerald-200'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>Study Targets Done</span>
                        {draftConfig.defaultCompletionCondition === 'targets_only' && (
                          <Check className="h-3.5 w-3.5 text-emerald-300" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDraftConfig((prev) => ({ ...prev, defaultCompletionCondition: 'mock_test_required' }))
                        }
                        className={`w-full px-3 py-2 rounded-xl border text-left font-semibold flex items-center justify-between cursor-pointer backdrop-blur-md transition ${
                          draftConfig.defaultCompletionCondition === 'mock_test_required'
                            ? 'bg-amber-500/18 border-amber-400/45 text-amber-200'
                            : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>Targets + Mock Test Score</span>
                        {draftConfig.defaultCompletionCondition === 'mock_test_required' && (
                          <Check className="h-3.5 w-3.5 text-amber-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Frosted Glass Bottom Action Bar */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono tabular-nums">
                <span className="font-bold text-white">
                  {availableHours.toFixed(0)} hrs available
                </span>
                <span className="text-slate-500">·</span>
                <span className="font-bold text-amber-300">
                  {requiredHours.toFixed(0)} hrs needed
                </span>
                <span className="text-slate-500">·</span>
                <span className={`font-bold ${scheduleFits ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {scheduleFits
                    ? 'Fits Schedule'
                    : 'Tight Schedule (increase hours or skip chapters)'}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('chapters')}
                  className="px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md border border-white/15 text-slate-100 text-xs font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition"
                >
                  <span>Customize Chapters</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleCommitFullPlan}
                  className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-[0_0_24px_rgba(52,211,153,0.3)] transition"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Create My Study Plan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. CHAPTERS (WEAK / STRONG, SKIP, HOURS) */}
        {activeTab === 'chapters' && (
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Subject Switcher + Filter Controls */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="flex flex-wrap items-center gap-1.5">
                {ALL_SUBJECTS.map((subId) => {
                  const subStats = capacitySummary.subjectBreakdown[subId];
                  const isSelected = selectedSubjectFilter === subId;
                  return (
                    <button
                      key={subId}
                      type="button"
                      onClick={() => setSelectedSubjectFilter(subId)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md transition ${
                        isSelected
                          ? 'bg-amber-400/25 text-amber-200 border-amber-300/50 shadow-[0_0_14px_rgba(251,191,36,0.2)]'
                          : 'bg-white/[0.03] text-slate-300 border-white/10 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      <span>{subId}</span>
                      <span className={`font-mono text-[11px] tabular-nums ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                        {subStats.activeChapters}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="flex items-center bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl p-0.5">
                  {(['ALL', 'A', 'B', 'C'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setSelectedABCFilter(tier)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition ${
                        selectedABCFilter === tier
                          ? 'bg-white/[0.12] text-amber-300'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tier === 'ALL' ? 'All' : `Cat ${tier}`}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder={`Search ${selectedSubjectFilter}...`}
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="bg-slate-950/60 backdrop-blur-md border border-white/12 focus:border-amber-400/60 focus:outline-none rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Subject Quick Summary & Bulk Buttons */}
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-white text-sm">{SUBJECT_NAMES_MAP[selectedSubjectFilter]}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-300 font-mono tabular-nums">
                  {capacitySummary.subjectBreakdown[selectedSubjectFilter].activeChapters} included ·{' '}
                  {capacitySummary.subjectBreakdown[selectedSubjectFilter].skippedChapters} skipped ·{' '}
                  {(capacitySummary.subjectBreakdown[selectedSubjectFilter].requiredMinutes / 60).toFixed(1)}h total
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleBulkSubjectAction(selectedSubjectFilter, 'all_low')}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/35 text-rose-200 font-semibold cursor-pointer backdrop-blur-md transition"
                >
                  All Weak
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSubjectAction(selectedSubjectFilter, 'all_high')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/35 text-emerald-200 font-semibold cursor-pointer backdrop-blur-md transition"
                >
                  All Strong
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSubjectAction(selectedSubjectFilter, 'skip_cat_c')}
                  className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/35 text-amber-200 font-semibold cursor-pointer backdrop-blur-md transition"
                >
                  Skip Low-Priority (Cat C)
                </button>
                <button
                  type="button"
                  onClick={() => handleBulkSubjectAction(selectedSubjectFilter, 'include_all')}
                  className="px-2.5 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 font-semibold cursor-pointer backdrop-blur-md transition"
                >
                  Include All
                </button>
                <button
                  type="button"
                  onClick={() => setShowAllPhaseColumns((v) => !v)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/35 text-cyan-200 font-semibold cursor-pointer backdrop-blur-md transition"
                >
                  {showAllPhaseColumns ? 'Show 1st Phase Only' : 'Show All Phases'}
                </button>
              </div>
            </div>

            {/* Chapters Table */}
            <div className="border border-white/12 rounded-2xl overflow-x-auto bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.35)]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-white/[0.05] text-slate-300 text-[11px] font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-2.5 px-3.5">#</th>
                    <th className="py-2.5 px-3.5">Chapter</th>
                    <th className="py-2.5 px-3.5">Your Confidence</th>
                    {(showAllPhaseColumns ? plannedPhases : [primaryPhase]).map((pId) => (
                      <th key={pId} className="py-2.5 px-3.5 whitespace-nowrap">
                        {showAllPhaseColumns ? `${PHASE_LABELS[pId].shortLabel} Hours` : 'Planned Hours'}
                      </th>
                    ))}
                    <th className="py-2.5 px-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredChaptersForSubject.map((ch, idx) => {
                    const hasCustom = Object.values(ch.isUserEditedTime).some(Boolean);
                    return (
                      <tr
                        key={`${ch.subjectId}_${ch.chapterName}`}
                        className={ch.isSkipped ? 'opacity-50 bg-slate-950/40' : 'hover:bg-white/[0.04] transition'}
                      >
                        <td className="py-2.5 px-3.5 text-slate-400 font-mono tabular-nums">{idx + 1}</td>
                        <td className="py-2.5 px-3.5">
                          <div className={`font-semibold text-xs ${ch.isSkipped ? 'line-through text-slate-500' : 'text-white'}`}>
                            {ch.chapterName}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            Cat {ch.abcCategory} · ~{ch.icaiWeightageMarks} Marks
                          </div>
                        </td>
                        <td className="py-2.5 px-3.5">
                          <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md p-0.5">
                            {([
                              { id: 'low' as ChapterConfidenceLevel, label: 'Weak' },
                              { id: 'medium' as ChapterConfidenceLevel, label: 'Okay' },
                              { id: 'high' as ChapterConfidenceLevel, label: 'Strong' }
                            ]).map((lvl) => (
                              <button
                                key={lvl.id}
                                type="button"
                                disabled={ch.isSkipped}
                                onClick={() => handleUpdateChapterConfidence(ch.subjectId, ch.chapterName, lvl.id)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer transition ${
                                  ch.confidence === lvl.id
                                    ? lvl.id === 'low'
                                      ? 'bg-rose-500/80 text-white'
                                      : lvl.id === 'medium'
                                        ? 'bg-amber-400 text-slate-950'
                                        : 'bg-emerald-400 text-slate-950'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                              >
                                {lvl.label}
                              </button>
                            ))}
                          </div>
                        </td>
                        {(showAllPhaseColumns ? plannedPhases : [primaryPhase]).map((pId) => {
                          const hrs = Number(((ch.expectedMinutesByPhase[pId] || 0) / 60).toFixed(2));
                          return (
                            <td key={pId} className="py-2.5 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={40}
                                  step={0.25}
                                  disabled={ch.isSkipped}
                                  value={hrs}
                                  onChange={(e) =>
                                    handleEditChapterExpectedHours(
                                      ch.subjectId,
                                      ch.chapterName,
                                      pId,
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className={`w-18 bg-slate-950/60 backdrop-blur-md border rounded-lg px-2 py-1 text-xs font-mono font-bold tabular-nums ${
                                    ch.isUserEditedTime[pId]
                                      ? 'border-amber-400/70 text-amber-300'
                                      : 'border-white/15 text-white'
                                  }`}
                                />
                                <span className="text-[11px] text-slate-400">h</span>
                                {hasCustom && !showAllPhaseColumns && (
                                  <button
                                    type="button"
                                    onClick={() => handleResetChapterFormulaTime(ch.subjectId, ch.chapterName)}
                                    className="text-[11px] text-cyan-300 hover:underline cursor-pointer ml-1"
                                  >
                                    Reset
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="py-2.5 px-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleSkipChapter(ch.subjectId, ch.chapterName)}
                            className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer whitespace-nowrap backdrop-blur-md transition ${
                              ch.isSkipped
                                ? 'bg-rose-500/15 border-rose-400/40 text-rose-300'
                                : 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                            }`}
                          >
                            {ch.isSkipped ? 'Skipped' : 'Included'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Navigation & Primary Action */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('setup')}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md text-slate-200 border border-white/12 text-xs font-semibold cursor-pointer transition"
              >
                ← Back to Plan Setup
              </button>
              <button
                type="button"
                onClick={handleCommitFullPlan}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm cursor-pointer flex items-center gap-2 whitespace-nowrap shadow-[0_0_24px_rgba(52,211,153,0.3)] transition"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Create My Study Plan</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. UPDATE ONGOING PLAN */}
        {activeTab === 'amend' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-5 space-y-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-white">
                  Update Your Active Study Plan
                </h3>
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-xs font-mono text-amber-300 font-semibold">
                  Current Phase: {PHASE_LABELS[draftConfig.activePhaseId]?.title}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAmendDecision('continue')}
                  className={`p-3.5 rounded-xl border text-left text-xs font-semibold cursor-pointer flex items-center justify-between backdrop-blur-md transition ${
                    amendDecision === 'continue'
                      ? 'bg-emerald-500/18 border-emerald-400/50 text-emerald-200 shadow-[inset_0_1px_0_0_rgba(52,211,153,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>Keep Current Plan as Planned</span>
                  {amendDecision === 'continue' && <CheckCircle2 className="h-4 w-4 text-emerald-300 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setAmendDecision('amend')}
                  className={`p-3.5 rounded-xl border text-left text-xs font-semibold cursor-pointer flex items-center justify-between backdrop-blur-md transition ${
                    amendDecision === 'amend'
                      ? 'bg-cyan-500/18 border-cyan-400/50 text-cyan-200 shadow-[inset_0_1px_0_0_rgba(34,211,238,0.2)]'
                      : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>Adjust &amp; Reschedule Remaining Days</span>
                  {amendDecision === 'amend' && <RefreshCw className="h-4 w-4 text-cyan-300 shrink-0" />}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1 text-xs">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Start From Phase
                  </label>
                  <select
                    value={amendTargetPhase}
                    onChange={(e) => setAmendTargetPhase(e.target.value as StudyPhaseId)}
                    className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-3 py-2 text-amber-300 font-semibold cursor-pointer"
                  >
                    {plannedPhases.map((pId) => (
                      <option key={pId} value={pId}>
                        {PHASE_LABELS[pId].title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Apply Changes Starting From
                  </label>
                  <input
                    type="date"
                    value={amendStartFromDate}
                    onChange={(e) => e.target.value && setAmendStartFromDate(e.target.value)}
                    className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-3 py-2 text-white font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Extra focus on Ind AS"
                    value={amendNotes}
                    onChange={(e) => setAmendNotes(e.target.value)}
                    className="w-full bg-slate-950/60 backdrop-blur-md border border-white/12 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {amendDecision === 'amend' && (
              <div className="space-y-3">
                <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {ALL_SUBJECTS.map((subId) => (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => setSelectedSubjectFilter(subId)}
                        className={`px-3 py-1 rounded-xl border text-xs font-bold cursor-pointer backdrop-blur-md transition ${
                          selectedSubjectFilter === subId
                            ? 'bg-cyan-400/25 text-cyan-200 border-cyan-300/50'
                            : 'bg-white/[0.03] text-slate-300 border-white/10 hover:text-white'
                        }`}
                      >
                        {subId}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-semibold">
                    {PHASE_LABELS[amendTargetPhase].shortLabel}
                  </span>
                </div>

                <div className="border border-white/12 rounded-2xl overflow-x-auto bg-white/[0.03] backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.35)]">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-white/[0.05] text-slate-300 text-[11px] font-semibold border-b border-white/10">
                      <tr>
                        <th className="py-2.5 px-3.5">Chapter</th>
                        <th className="py-2.5 px-3.5">Logged</th>
                        <th className="py-2.5 px-3.5">Confidence</th>
                        <th className="py-2.5 px-3.5">Hours</th>
                        <th className="py-2.5 px-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {filteredChaptersForSubject.map((ch) => {
                        const targetHrs = Number(((ch.expectedMinutesByPhase[amendTargetPhase] || 0) / 60).toFixed(2));
                        return (
                          <tr
                            key={`amend_${ch.subjectId}_${ch.chapterName}`}
                            className={ch.isSkipped ? 'opacity-50 bg-slate-950/40' : 'hover:bg-white/[0.04] transition'}
                          >
                            <td className="py-2.5 px-3.5">
                              <div className="font-semibold text-white text-xs">{ch.chapterName}</div>
                              <div className="text-[11px] text-slate-400">Cat {ch.abcCategory}</div>
                            </td>
                            <td className="py-2.5 px-3.5 font-mono tabular-nums text-emerald-300">
                              {ch.actualMinutesLogged ? `${(ch.actualMinutesLogged / 60).toFixed(1)}h` : '0.0h'}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="inline-flex rounded-xl border border-white/10 bg-slate-950/60 backdrop-blur-md p-0.5">
                                {([
                                  { id: 'low' as ChapterConfidenceLevel, label: 'Weak' },
                                  { id: 'medium' as ChapterConfidenceLevel, label: 'Okay' },
                                  { id: 'high' as ChapterConfidenceLevel, label: 'Strong' }
                                ]).map((lvl) => (
                                  <button
                                    key={lvl.id}
                                    type="button"
                                    disabled={ch.isSkipped}
                                    onClick={() => handleUpdateChapterConfidence(ch.subjectId, ch.chapterName, lvl.id)}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold cursor-pointer ${
                                      ch.confidence === lvl.id
                                        ? lvl.id === 'low'
                                          ? 'bg-rose-500/80 text-white'
                                          : lvl.id === 'medium'
                                            ? 'bg-amber-400 text-slate-950'
                                            : 'bg-emerald-400 text-slate-950'
                                        : 'text-slate-400'
                                    }`}
                                  >
                                    {lvl.label}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={40}
                                  step={0.25}
                                  disabled={ch.isSkipped}
                                  value={targetHrs}
                                  onChange={(e) =>
                                    handleEditChapterExpectedHours(
                                      ch.subjectId,
                                      ch.chapterName,
                                      amendTargetPhase,
                                      Number(e.target.value) || 0
                                    )
                                  }
                                  className="w-18 bg-slate-950/60 backdrop-blur-md border border-cyan-400/50 rounded-lg px-2 py-1 text-xs font-mono font-bold text-cyan-300 tabular-nums"
                                />
                                <span className="text-[11px] text-slate-400">h</span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleToggleSkipChapter(ch.subjectId, ch.chapterName)}
                                className={`px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer backdrop-blur-md ${
                                  ch.isSkipped
                                    ? 'bg-rose-500/15 text-rose-300 border-rose-400/40'
                                    : 'bg-white/[0.04] text-slate-200 border-white/15'
                                }`}
                              >
                                {ch.isSkipped ? 'Skipped' : 'Included'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={handleExecutePhaseReviewOrAmend}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm cursor-pointer flex items-center gap-2 transition ${
                  amendDecision === 'continue'
                    ? 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-[0_0_24px_rgba(52,211,153,0.3)]'
                    : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.3)]'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {amendDecision === 'continue'
                    ? `Keep Current Plan (${PHASE_LABELS[amendTargetPhase].shortLabel})`
                    : `Update My Plan from ${amendStartFromDate}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 4. INTERACTIVE ABC MATRIX (SUBJECT-TABBED, ALIGNED & GLASSIFIED) */}
        {activeTab === 'icai_reference' && (() => {
          const activeSubChaps = draftChapters.filter((c) => c.subjectId === selectedSubjectFilter);
          const catAChaps = activeSubChaps.filter((c) => c.abcCategory === 'A');
          const catBChaps = activeSubChaps.filter((c) => c.abcCategory === 'B');
          const catCChaps = activeSubChaps.filter((c) => c.abcCategory === 'C');

          const categoryColumns: {
            cat: ABCCategory;
            title: string;
            accentText: string;
            accentBorder: string;
            headerBg: string;
            badgeClass: string;
            items: ChapterPlanInput[];
          }[] = [
            {
              cat: 'A',
              title: 'Category A · High Priority',
              accentText: 'text-amber-300',
              accentBorder: 'border-amber-400/25',
              headerBg: 'bg-amber-500/10 border-b border-amber-400/20',
              badgeClass: 'text-amber-300 bg-amber-400/15 border border-amber-300/30',
              items: catAChaps
            },
            {
              cat: 'B',
              title: 'Category B · Medium Priority',
              accentText: 'text-cyan-300',
              accentBorder: 'border-cyan-400/25',
              headerBg: 'bg-cyan-500/10 border-b border-cyan-400/20',
              badgeClass: 'text-cyan-300 bg-cyan-400/15 border border-cyan-300/30',
              items: catBChaps
            },
            {
              cat: 'C',
              title: 'Category C · Low Priority',
              accentText: 'text-slate-200',
              accentBorder: 'border-white/15',
              headerBg: 'bg-white/[0.06] border-b border-white/10',
              badgeClass: 'text-slate-200 bg-white/[0.08] border border-white/15',
              items: catCChaps
            }
          ];

          return (
            <div className="max-w-6xl mx-auto space-y-4">
              {/* Top Subject Tabs & Reset Bar (Frosted Glass) */}
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-[0_8px_32px_0_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.08)]">
                <div className="flex flex-wrap items-center gap-1.5">
                  {ALL_SUBJECTS.map((subId) => {
                    const isSelected = selectedSubjectFilter === subId;
                    const count = draftChapters.filter((c) => c.subjectId === subId).length;
                    return (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => setSelectedSubjectFilter(subId)}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center gap-1.5 whitespace-nowrap backdrop-blur-md transition ${
                          isSelected
                            ? 'bg-amber-400/25 text-amber-200 border-amber-300/50 shadow-[0_0_16px_rgba(251,191,36,0.2)]'
                            : 'bg-white/[0.03] text-slate-300 border-white/10 hover:text-white hover:bg-white/[0.06]'
                        }`}
                      >
                        <span>{subId}</span>
                        <span className={`font-mono text-[11px] tabular-nums ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleResetABCToDefaults(selectedSubjectFilter)}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-md border border-white/12 text-slate-200 hover:text-white text-xs font-semibold cursor-pointer flex items-center gap-1.5 whitespace-nowrap transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-cyan-300 shrink-0" />
                    <span>Reset {selectedSubjectFilter}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResetABCToDefaults()}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] backdrop-blur-md border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer whitespace-nowrap transition"
                  >
                    Reset All
                  </button>
                </div>
              </div>

              {/* Active Subject Summary Strip (Frosted Glass) */}
              <div className="bg-white/[0.04] backdrop-blur-xl border border-white/12 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
                <span className="font-bold text-white text-sm">
                  {SUBJECT_NAMES_MAP[selectedSubjectFilter]}
                </span>
                <div className="flex items-center gap-2.5 font-mono tabular-nums">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400/15 border border-amber-300/30 text-amber-300 font-semibold">
                    Cat A: {catAChaps.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-400/15 border border-cyan-300/30 text-cyan-300 font-semibold">
                    Cat B: {catBChaps.length}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/[0.06] border border-white/15 text-slate-200 font-semibold">
                    Cat C: {catCChaps.length}
                  </span>
                </div>
              </div>

              {/* 3-Column Aligned Frosted Glass ABC Grid for Selected Subject */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
                {categoryColumns.map((col) => (
                  <div
                    key={col.cat}
                    className={`bg-white/[0.035] backdrop-blur-xl border ${col.accentBorder} rounded-2xl flex flex-col overflow-hidden shadow-[0_12px_36px_-8px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.08)]`}
                  >
                    <div className={`px-4 py-3 ${col.headerBg} backdrop-blur-md flex items-center justify-between gap-2`}>
                      <h4 className={`text-xs font-bold ${col.accentText} whitespace-nowrap`}>
                        {col.title}
                      </h4>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold tabular-nums whitespace-nowrap ${col.badgeClass}`}>
                        {col.items.length} {col.items.length === 1 ? 'chapter' : 'chapters'}
                      </span>
                    </div>

                    <div className="p-3 space-y-2 flex-1">
                      {col.items.length === 0 ? (
                        <div className="h-24 rounded-xl border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center text-xs text-slate-400 font-mono">
                          No chapters in Category {col.cat}
                        </div>
                      ) : (
                        col.items.map((ch, idx) => {
                          const defaultCat = classifyChapterICAI(ch.subjectId, ch.chapterName, true).abcCategory;
                          const isCustomized = ch.abcCategory !== defaultCat;
                          return (
                            <div
                              key={`${ch.subjectId}_${ch.chapterName}`}
                              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] backdrop-blur-md border border-white/10 hover:border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] transition"
                            >
                              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                                <span className="text-[11px] font-mono text-slate-400 tabular-nums shrink-0 mt-0.5">
                                  {String(idx + 1).padStart(2, '0')}.
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs font-semibold text-white leading-snug break-words">
                                    {ch.chapterName}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-slate-300 font-mono tabular-nums mt-0.5">
                                    <span>~{ch.icaiWeightageMarks}M</span>
                                    <span className="text-slate-500">·</span>
                                    <span>{((ch.expectedMinutesByPhase[primaryPhase] || 0) / 60).toFixed(1)}h</span>
                                    {isCustomized && (
                                      <>
                                        <span className="text-slate-500">·</span>
                                        <span className="text-amber-300">Default: {defaultCat}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="inline-flex items-center rounded-lg bg-slate-950/65 backdrop-blur-md border border-white/12 p-0.5 shrink-0 font-mono text-[10.5px]">
                                {(['A', 'B', 'C'] as ABCCategory[]).map((targetCat) => {
                                  const active = ch.abcCategory === targetCat;
                                  return (
                                    <button
                                      key={targetCat}
                                      type="button"
                                      onClick={() =>
                                        handleUpdateChapterABCCategory(ch.subjectId, ch.chapterName, targetCat)
                                      }
                                      className={`w-6 h-6 rounded-md flex items-center justify-center font-bold cursor-pointer transition ${
                                        active
                                          ? targetCat === 'A'
                                            ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.35)]'
                                            : targetCat === 'B'
                                              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(34,211,238,0.35)]'
                                              : 'bg-white/25 text-white'
                                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                                      }`}
                                      title={`Move ${ch.chapterName} to Category ${targetCat}`}
                                    >
                                      {targetCat}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
