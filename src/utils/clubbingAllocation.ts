import { SUBJECTS_METADATA } from '../data/syllabus';
import { getSelectedCALevel, CALevel } from '../data/curriculumLevels';
import { getLevelScopedKey, getLevelSubjectIds } from './levelStorage';

export type ClubAllocationBasis = 'prior_logs' | 'best_judgment' | 'custom_adjusted';

export interface ClubAllocatableItem {
  id: string;
  subjectCode?: string;
  chapterName?: string;
  title?: string;
  relevance?: 'general' | 'revision' | 'final_revision' | string;
  currentTargetMinutes?: number;
}

export interface ClubAllocationResult {
  id: string;
  allocatedMinutes: number;
  sharePercent: number;
  weight: number;
  basis: ClubAllocationBasis;
  basisLabel: string;
  priorLoggedMinutes: number;
}

/**
 * Normalizes a chapter/topic label for fuzzy matching against study logs and syllabus data.
 */
function normalizeTopicKey(raw?: string): string {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/^(ch|chap|chapter|unit|mod|module)\s*[\d.]*\s*[-:–]?\s*/i, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Scans all available study log stores in localStorage to find prior study experience
 * (logged minutes) for a given subject and chapter/topic.
 */
export function getChapterPriorStudyMinutes(
  subjectCode?: string,
  chapterName?: string,
  title?: string,
  level: CALevel = getSelectedCALevel()
): number {
  const normChapter = normalizeTopicKey(chapterName);
  const normTitle = normalizeTopicKey(title);
  const fullChapterLower = (chapterName || '').toLowerCase().trim();
  const fullTitleLower = (title || '').toLowerCase().trim();
  const subUpper = (subjectCode || '').toUpperCase().trim();

  if (!normChapter && !normTitle && !fullChapterLower && !fullTitleLower) {
    return 0;
  }

  const matchesTopic = (candidate?: string): boolean => {
    if (!candidate) return false;
    const candLower = candidate.toLowerCase().trim();
    const candNorm = normalizeTopicKey(candidate);
    if (fullChapterLower && candLower === fullChapterLower) return true;
    if (fullTitleLower && candLower === fullTitleLower) return true;
    if (normChapter && normChapter.length >= 4 && candNorm && (candNorm.includes(normChapter) || normChapter.includes(candNorm))) {
      return true;
    }
    if (normTitle && normTitle.length >= 4 && candNorm && (candNorm.includes(normTitle) || normTitle.includes(candNorm))) {
      return true;
    }
    return false;
  };

  let totalPriorMinutes = 0;

  try {
    // 1. Check practca_focus_sessions (Grind Clock focus sessions)
    const rawFocus = localStorage.getItem(getLevelScopedKey('practca_focus_sessions', level));
    if (rawFocus) {
      const sessions = JSON.parse(rawFocus);
      if (Array.isArray(sessions)) {
        for (const s of sessions) {
          const sSub = (s.subjectCode || s.subject || s.subjectId || '').toUpperCase().trim();
          if (subUpper && sSub && sSub !== subUpper) continue;
          if (matchesTopic(s.chapterName) || matchesTopic(s.topic) || matchesTopic(s.taskTitle) || matchesTopic(s.title) || matchesTopic(s.description)) {
            const mins = Number(s.durationMinutes ?? s.duration ?? s.minutes ?? (s.durationSeconds ? s.durationSeconds / 60 : 0));
            if (Number.isFinite(mins) && mins > 0) {
              totalPriorMinutes += mins;
            }
          }
        }
      }
    }

    // 2. Check practca_revision_planner_logs
    const rawRevLogs = localStorage.getItem(getLevelScopedKey('practca_revision_planner_logs', level));
    if (rawRevLogs) {
      const revLogs = JSON.parse(rawRevLogs);
      if (Array.isArray(revLogs)) {
        for (const log of revLogs) {
          const lSub = (log.subjectId || log.subjectCode || '').toUpperCase().trim();
          if (subUpper && lSub && lSub !== subUpper) continue;
          if (matchesTopic(log.chapterName) || matchesTopic(log.topicName) || matchesTopic(log.title)) {
            const mins = Number(log.durationMinutes ?? log.minutesSpent ?? log.actualMinutes ?? 0);
            if (Number.isFinite(mins) && mins > 0) {
              totalPriorMinutes += mins;
            }
          }
        }
      }
    }

    // 3. Check subject-specific revision planner state: practca_revision_planner_${subId}
    const levelSubjects = getLevelSubjectIds(level);
    const canonicalMatch = subUpper ? levelSubjects.find(id => id.toUpperCase() === subUpper) : undefined;
    const subjectsToScan = canonicalMatch ? [canonicalMatch] : (subUpper ? [subUpper] : levelSubjects);

    for (const code of subjectsToScan) {
      const rawSubPlan = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${code}`, level));
      if (!rawSubPlan) continue;
      const parsed = JSON.parse(rawSubPlan);
      if (parsed?.chapters && typeof parsed.chapters === 'object' && !Array.isArray(parsed.chapters)) {
        for (const [chName, cObj] of Object.entries<any>(parsed.chapters)) {
          if (matchesTopic(chName)) {
            let totalHrs = 0;
            ['rev1', 'rev2', 'rev3', 'rev1.5'].forEach(rk => {
              const h = parseFloat(cObj?.[rk]?.hours || '0');
              if (!isNaN(h) && h > 0) totalHrs += h;
            });
            if (totalHrs > 0) {
              totalPriorMinutes += Math.round(totalHrs * 60);
            }
          }
        }
      } else {
        const topicsList = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.topics)
          ? parsed.topics
          : Array.isArray(parsed?.chapters)
          ? parsed.chapters
          : [];
        for (const item of topicsList) {
          if (matchesTopic(item.name) || matchesTopic(item.chapterName) || matchesTopic(item.title)) {
            const r1 = Number(item.r1Minutes || item.rev1Minutes || 0);
            const r2 = Number(item.r2Minutes || item.rev2Minutes || 0);
            const r3 = Number(item.r3Minutes || item.rev3Minutes || 0);
            const actual = Number(item.actualMinutes || item.timeSpentMinutes || item.loggedMinutes || 0);
            const sumRev = r1 + r2 + r3 + actual;
            if (Number.isFinite(sumRev) && sumRev > 0) {
              totalPriorMinutes += sumRev;
            }
          }
        }
      }
    }

    // 4. Check completed tasks in practca_local_tasks & practca_cached_cloud_tasks that have actual logged durations
    const taskStores = [
      getLevelScopedKey('practca_local_tasks', level),
      getLevelScopedKey('practca_cached_cloud_tasks', level)
    ];
    const seenTaskIds = new Set<string>();
    for (const storeKey of taskStores) {
      const rawTasks = localStorage.getItem(storeKey);
      if (!rawTasks) continue;
      const tasks = JSON.parse(rawTasks);
      if (!Array.isArray(tasks)) continue;
      for (const t of tasks) {
        if (!t || !t.id || seenTaskIds.has(t.id)) continue;
        seenTaskIds.add(t.id);
        const tSub = (t.subjectCode || '').toUpperCase().trim();
        if (subUpper && tSub && tSub !== subUpper) continue;
        if (matchesTopic(t.chapterName) || matchesTopic(t.title)) {
          const actualMins = Number(t.actualDurationMinutes ?? t.timeSpentMinutes ?? 0);
          if (Number.isFinite(actualMins) && actualMins > 0) {
            totalPriorMinutes += actualMins;
          }
        }
      }
    }
  } catch {
    // Ignore storage parse errors and fall back gracefully
  }

  return Math.round(totalPriorMinutes);
}

/**
 * Rounds a duration in minutes to the nearest 15-minute slab (15, 30, 45, 60, 75, 90, ...).
 * Guarantees zero odd-number allotments during automatic or best-judgmental allocation.
 */
export function roundToNearest15MinSlab(minutes: number, minMinutes: number = 15): number {
  const safeMin = Math.max(15, Math.round(minMinutes / 15) * 15);
  const raw = Number(minutes);
  if (!Number.isFinite(raw) || raw <= 0) return safeMin;
  return Math.max(safeMin, Math.round(raw / 15) * 15);
}

/**
 * Computes an ICAI CA syllabus best-judgment weight for a chapter when no prior study logs exist.
 * All returned weights are strictly rounded to the nearest 15-minute slab (15m multiples).
 */
export function getBestJudgmentChapterWeight(
  subjectCode?: string,
  chapterName?: string,
  title?: string,
  relevance?: string,
  currentTargetMinutes?: number
): { weight: number; label: string } {
  const text = `${chapterName || ''} ${title || ''}`.toLowerCase();

  // High-density / Category A chapters across CA Foundation, Intermediate & Final
  const catAPatterns = [
    /ind\s*as\s*(115|116|109|103|110|32|12|36|19)/i,
    /consolidat|business\s*combination|financial\s*instrument|revenue|leases/i,
    /forex|foreign\s*exchange|derivative|swap|option|futures|merger|acquisition|corporate\s*valuation|portfolio|capital\s*budgeting/i,
    /audit\s*report|caro|professional\s*ethics|company\s*audit|bank\s*audit|nbsc|nbfc|group\s*audit|sa\s*(700|701|705|706|600|315|330|240|500|505|570)/i,
    /pgbp|business\s*or\s*profession|capital\s*gain|international\s*tax|transfer\s*pricing|non[\s-]*resident|dtaa|assessment\s*procedure|appeals|tds|tcs|mat|amt|salary|house\s*property|total\s*income/i,
    /supply|time\s*of\s*supply|place\s*of\s*supply|value\s*of\s*supply|input\s*tax\s*credit|\bitc\b|exemption|refund|demand|recovery|appeals|customs\s*valuation/i,
    /partnership|company\s*accounts|final\s*accounts|incomplete\s*records|amalgamation|internal\s*reconstruction|branch\s*account|cash\s*flow|as\s*(10|11|12|13|15|16|19|22|26|28)/i,
    /contract\s*act|sale\s*of\s*goods|companies\s*act|incorporation|share\s*capital|management\s*&?\s*administration|audit\s*of\s*financial\s*statements/i,
    /process\s*costing|standard\s*costing|marginal\s*costing|cost\s*of\s*capital|capital\s*structure|time\s*value\s*of\s*money|probability|theoretical\s*distribution|national\s*income|money\s*market/i,
  ];

  // Medium-density / Category B patterns
  const catBPatterns = [
    /ind\s*as\s*(1|2|7|8|10|16|20|21|23|33|37|38|40|102|105|108|113)/i,
    /mutual\s*fund|bond\s*valuation|working\s*capital|dividend|risk\s*management|securitization|startup\s*finance|financing\s*decisions|strategic\s*management/i,
    /internal\s*control|automated\s*environment|digital\s*audit|psu\s*audit|insurance\s*audit|tax\s*audit|due\s*diligence|investigation|forensic|esg|audit\s*evidence|audit\s*sampling/i,
    /charitable\s*trust|exit\s*tax|deduction|set\s*off|clubbing|penalt|prosecution|dispute\s*resolution|equalisation\s*levy|black\s*money|residential\s*status|other\s*sources/i,
    /registration|tax\s*invoice|e[\s-]*way\s*bill|returns|payment\s*of\s*tax|reverse\s*charge|composition|job\s*work|import|export|baggage|warehousing|ftp/i,
    /depreciation|rectification|brs|bank\s*reconciliation|bills\s*of\s*exchange|consignment|llp|negotiable|overheads|activity\s*based|job\s*&?\s*batch|correlations|regression|index\s*numbers|demand\s*and\s*supply|market\s*structures/i,
  ];

  let baseWeight = 60; // Category C / compact standard chapter baseline (15m slab)
  let categoryTag = 'Cat-C Compact';

  if (catAPatterns.some(rx => rx.test(text))) {
    baseWeight = 120; // Category A / heavy chapter baseline (15m slab)
    categoryTag = 'Cat-A Heavy';
  } else if (catBPatterns.some(rx => rx.test(text))) {
    baseWeight = 90; // Category B / core chapter baseline (15m slab)
    categoryTag = 'Cat-B Core';
  } else {
    const subKey = Object.keys(SUBJECTS_METADATA).find(k => k.toUpperCase() === (subjectCode || '').toUpperCase());
    const subMeta = subKey ? (SUBJECTS_METADATA as any)[subKey] : undefined;
    if (subMeta?.chapters && chapterName) {
      const matchedChap = subMeta.chapters.find((c: string) => c.toLowerCase() === chapterName.toLowerCase());
      if (matchedChap && matchedChap.length > 42) {
        baseWeight = 90;
        categoryTag = 'Cat-B Core';
      }
    }
  }

  // Relevance multiplier
  let relMult = 1.0;
  if (relevance === 'general' || relevance === 'General') relMult = 1.25;
  else if (relevance === 'final_revision' || relevance === 'Final Revision') relMult = 0.75;

  let computedWeight = baseWeight * relMult;

  // If the item already had a custom individual target duration that differs from standard 60m default,
  // blend 50% of that prior estimate with 50% of the syllabus complexity weight
  if (
    typeof currentTargetMinutes === 'number' &&
    Number.isFinite(currentTargetMinutes) &&
    currentTargetMinutes > 0 &&
    currentTargetMinutes !== 60
  ) {
    computedWeight = computedWeight * 0.5 + currentTargetMinutes * 0.5;
  }

  const slabWeight = roundToNearest15MinSlab(computedWeight, 15);

  return {
    weight: slabWeight,
    label: `Best Judgment (${categoryTag})`,
  };
}

/**
 * Returns a single chapter's recommended target duration strictly in a 15-minute slab
 * based on prior study logs if available, otherwise ICAI syllabus best judgment.
 */
export function getRecommendedChapterSlabMinutes(
  subjectCode?: string,
  chapterName?: string,
  title?: string,
  relevance?: string,
  currentTargetMinutes?: number
): number {
  const priorMins = getChapterPriorStudyMinutes(subjectCode, chapterName, title);
  if (priorMins > 0) {
    return roundToNearest15MinSlab(priorMins, 15);
  }
  const judgment = getBestJudgmentChapterWeight(subjectCode, chapterName, title, relevance, currentTargetMinutes);
  return roundToNearest15MinSlab(judgment.weight, 15);
}

/**
 * Distributes `clubTotalMinutes` proportionately across `items` so that:
 * 1. Prior study logs / experience are used whenever available for an item.
 * 2. Best judgmental syllabus weight (in 15-minute slabs) is used when prior study logs are unavailable.
 * 3. Whenever total time allows 15-minute slabs, every sub-target is strictly allotted in 15-minute slabs
 *    (15m, 30m, 45m, 60m, ...) — never odd-number allotments.
 * 4. The sum of allocated minutes across all sub-targets STRICTLY equals the batch total limit.
 */
export function allocateProportionateClubDurations(
  items: ClubAllocatableItem[],
  clubTotalMinutes: number
): ClubAllocationResult[] {
  if (!items || items.length === 0) return [];
  const n = items.length;
  const rawTotal = Math.max(n, Math.round(Number(clubTotalMinutes) || n * 45));
  // If rawTotal is at least n * 15, snap to nearest 15m slab if rawTotal wasn't explicitly set to a fine-tuned minute,
  // or distribute in 15m slabs when rawTotal % 15 === 0
  const validTotal = rawTotal >= n * 15 && rawTotal % 15 === 0
    ? rawTotal
    : rawTotal >= n * 15
    ? roundToNearest15MinSlab(rawTotal, n * 15)
    : rawTotal;

  // Step 1: Gather prior logs and best-judgment weights for each item
  const rawProfiles = items.map(item => {
    const priorMins = getChapterPriorStudyMinutes(item.subjectCode, item.chapterName, item.title);
    const judgment = getBestJudgmentChapterWeight(
      item.subjectCode,
      item.chapterName,
      item.title,
      item.relevance,
      item.currentTargetMinutes
    );
    return {
      item,
      priorMins: priorMins > 0 ? roundToNearest15MinSlab(priorMins, 15) : 0,
      rawPriorMins: priorMins,
      judgmentWeight: judgment.weight,
      judgmentLabel: judgment.label,
    };
  });

  const anyHasPriorLogs = rawProfiles.some(p => p.priorMins > 0);
  const allHavePriorLogs = rawProfiles.every(p => p.priorMins > 0);

  const loggedProfiles = rawProfiles.filter(p => p.priorMins > 0);
  const avgPriorMins =
    loggedProfiles.length > 0
      ? loggedProfiles.reduce((acc, p) => acc + p.priorMins, 0) / loggedProfiles.length
      : 0;
  const avgJudgmentWeight =
    rawProfiles.reduce((acc, p) => acc + p.judgmentWeight, 0) / rawProfiles.length || 90;

  const weightedItems = rawProfiles.map(p => {
    if (p.priorMins > 0) {
      return {
        id: p.item.id,
        weight: Math.max(15, p.priorMins),
        basis: 'prior_logs' as ClubAllocationBasis,
        basisLabel: `Prior Logs (${p.rawPriorMins}m logged)`,
        priorLoggedMinutes: p.rawPriorMins,
      };
    }
    const scaledWeight =
      anyHasPriorLogs && !allHavePriorLogs && avgJudgmentWeight > 0
        ? roundToNearest15MinSlab((p.judgmentWeight / avgJudgmentWeight) * avgPriorMins, 15)
        : roundToNearest15MinSlab(p.judgmentWeight, 15);

    return {
      id: p.item.id,
      weight: scaledWeight,
      basis: 'best_judgment' as ClubAllocationBasis,
      basisLabel: p.judgmentLabel,
      priorLoggedMinutes: 0,
    };
  });

  return distributeTotalByWeights(weightedItems, validTotal);
}

/**
 * Rescales existing sub-target durations proportionately when the user adjusts the batch's total duration,
 * maintaining relative proportions and guaranteeing sum(t_i) === newClubTotalMinutes.
 * Uses 15-minute slabs whenever newClubTotalMinutes is a multiple of 15 (>= n * 15).
 */
export function rescaleClubSubTargetsToNewTotal(
  subTargets: Array<{
    id: string;
    currentMinutes: number;
    basis?: ClubAllocationBasis;
    priorLoggedMinutes?: number;
  }>,
  newClubTotalMinutes: number
): ClubAllocationResult[] {
  if (!subTargets || subTargets.length === 0) return [];
  const validTotal = Math.max(subTargets.length, Math.round(Number(newClubTotalMinutes) || 60));

  const weightedItems = subTargets.map(st => ({
    id: st.id,
    weight: Math.max(1, Number(st.currentMinutes) || 15),
    basis: st.basis || ('best_judgment' as ClubAllocationBasis),
    basisLabel:
      st.basis === 'prior_logs'
        ? `Prior Logs (${st.priorLoggedMinutes || st.currentMinutes}m)`
        : st.basis === 'custom_adjusted'
        ? 'Custom Balanced'
        : 'Proportionate Share',
    priorLoggedMinutes: st.priorLoggedMinutes || 0,
  }));

  return distributeTotalByWeights(weightedItems, validTotal);
}

/**
 * Rebalances the remaining sub-targets in a batch when a single sub-target (`editedId`) is adjusted,
 * strictly preserving the batch's total time limit (`clubTotalMinutes`) so that sum(t_i) === clubTotalMinutes.
 * - If the batch total and requested sub-target time are on 15-minute slabs (and batchTotal >= n * 15),
 *   every peer sub-target is rebalanced in 15-minute slabs (minimum 15m per target).
 * - If the user fine-tunes by 1 minute (non-15m multiple), peers rebalance to the exact minute so
 *   sum(t_i) === clubTotalMinutes is still strictly maintained within the batch limit.
 */
export function rebalanceClubSubTargetsWithinLimit(
  subTargets: Array<{
    id: string;
    currentMinutes: number;
    basis?: ClubAllocationBasis;
    priorLoggedMinutes?: number;
  }>,
  editedId: string,
  requestedSubMinutes: number,
  clubTotalMinutes: number
): ClubAllocationResult[] {
  const n = subTargets.length;
  if (n === 0) {
    return [];
  }

  const fixedTotal = Math.max(n, Math.round(Number(clubTotalMinutes) || n * 45));
  if (n === 1) {
    return [
      {
        id: subTargets[0].id,
        allocatedMinutes: fixedTotal,
        sharePercent: 100,
        weight: fixedTotal,
        basis: 'custom_adjusted',
        basisLabel: 'Custom Balanced',
        priorLoggedMinutes: subTargets[0].priorLoggedMinutes || 0,
      },
    ];
  }

  const rawRequested = Math.max(1, Math.round(Number(requestedSubMinutes) || 15));
  const use15MinSlabs =
    fixedTotal >= n * 15 &&
    fixedTotal % 15 === 0 &&
    rawRequested % 15 === 0;

  const minPerTarget = use15MinSlabs ? 15 : 1;
  const maxForEdited = Math.max(minPerTarget, fixedTotal - (n - 1) * minPerTarget);
  const clampedEditedMins = use15MinSlabs
    ? Math.max(15, Math.min(maxForEdited, Math.round(rawRequested / 15) * 15))
    : Math.max(1, Math.min(maxForEdited, rawRequested));

  const remainingPool = Math.max((n - 1) * minPerTarget, fixedTotal - clampedEditedMins);
  const peerItems = subTargets
    .filter(st => st.id !== editedId)
    .map(st => ({
      id: st.id,
      weight: Math.max(1, Number(st.currentMinutes) || 15),
      basis: st.basis || ('best_judgment' as ClubAllocationBasis),
      basisLabel: 'Proportionate Share',
      priorLoggedMinutes: st.priorLoggedMinutes || 0,
    }));

  const peerAllocations = distributeTotalByWeights(peerItems, remainingPool);
  const peerMap = new Map(peerAllocations.map(p => [p.id, p]));

  const finalAllocations: ClubAllocationResult[] = subTargets.map(st => {
    if (st.id === editedId) {
      return {
        id: st.id,
        allocatedMinutes: clampedEditedMins,
        sharePercent: fixedTotal > 0 ? Math.round((clampedEditedMins / fixedTotal) * 100) : Math.round(100 / n),
        weight: clampedEditedMins,
        basis: 'custom_adjusted',
        basisLabel: 'Custom Balanced',
        priorLoggedMinutes: st.priorLoggedMinutes || 0,
      };
    }
    const peerAlloc = peerMap.get(st.id);
    const mins = peerAlloc ? peerAlloc.allocatedMinutes : minPerTarget;
    return {
      id: st.id,
      allocatedMinutes: mins,
      sharePercent: fixedTotal > 0 ? Math.round((mins / fixedTotal) * 100) : Math.round(100 / n),
      weight: mins,
      basis: 'custom_adjusted',
      basisLabel: 'Custom Balanced',
      priorLoggedMinutes: st.priorLoggedMinutes || 0,
    };
  });

  return finalAllocations;
}

/**
 * Helper: Largest Remainder method.
 * - Whenever `totalMinutes` is a multiple of 15 and `totalMinutes >= n * 15`, distributes strictly in
 *   15-minute slabs (15m, 30m, 45m, 60m, ...) so NO odd-number durations are ever allotted AND
 *   sum(allocatedMinutes) === totalMinutes.
 * - Otherwise (only when a user manually typed a non-15m custom minute total), distributes integer minutes
 *   so sum(allocatedMinutes) === totalMinutes.
 */
function distributeTotalByWeights(
  weightedItems: Array<{
    id: string;
    weight: number;
    basis: ClubAllocationBasis;
    basisLabel: string;
    priorLoggedMinutes: number;
  }>,
  totalMinutes: number
): ClubAllocationResult[] {
  const n = weightedItems.length;
  if (n === 0) return [];

  const use15MinSlabs = totalMinutes >= n * 15 && totalMinutes % 15 === 0;
  const unitSize = use15MinSlabs ? 15 : 1;
  const totalUnits = Math.round(totalMinutes / unitSize);
  const minFloorUnits = 1; // At least 1 slab (15m) in slab mode, or 1m in custom fine-tune mode

  const totalWeight = weightedItems.reduce((acc, w) => acc + Math.max(1, w.weight), 0);
  const distributableUnits = Math.max(0, totalUnits - n * minFloorUnits);

  const exactShares = weightedItems.map((w, idx) => {
    const exactAdd =
      totalWeight > 0
        ? (Math.max(1, w.weight) / totalWeight) * distributableUnits
        : distributableUnits / n;
    const flooredAdd = Math.floor(exactAdd);
    return {
      idx,
      item: w,
      allocatedUnits: minFloorUnits + flooredAdd,
      remainder: exactAdd - flooredAdd,
    };
  });

  const currentUnitSum = exactShares.reduce((acc, s) => acc + s.allocatedUnits, 0);
  let leftoverUnits = totalUnits - currentUnitSum;

  // Sort by largest remainder descending (tie-break by weight descending) to distribute leftover units
  const sortedByRemainder = [...exactShares].sort((a, b) => {
    if (Math.abs(b.remainder - a.remainder) > 1e-9) return b.remainder - a.remainder;
    return b.item.weight - a.item.weight;
  });

  let cursor = 0;
  while (leftoverUnits > 0 && sortedByRemainder.length > 0) {
    sortedByRemainder[cursor % sortedByRemainder.length].allocatedUnits += 1;
    leftoverUnits -= 1;
    cursor += 1;
  }

  return exactShares.map(s => {
    const allocatedMinutes = s.allocatedUnits * unitSize;
    return {
      id: s.item.id,
      allocatedMinutes,
      sharePercent: totalMinutes > 0 ? Math.round((allocatedMinutes / totalMinutes) * 100) : Math.round(100 / n),
      weight: s.item.weight,
      basis: s.item.basis,
      basisLabel: s.item.basisLabel,
      priorLoggedMinutes: s.item.priorLoggedMinutes,
    };
  });
}

