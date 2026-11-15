import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, doc as firestoreDoc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { GoogleTask, SubjectId } from '../types';
import { SUBJECT_CHAPTERS } from '../components/RevisionPlanner';
import {
  TaskIdentifier,
  normalizeKey,
  getTaskCompositeKey,
  getCompletedRegistry,
  saveToCompletedRegistry,
  isTaskCompletedInStorage,
  syncTaskCompletionAcrossAllLinks,
  resolveExactOrBestChapterMatch
} from '../utils/taskCompletionSync';
import { CALevel, getSelectedCALevel, getLevelForSubject, isValidCALevelValue } from '../data/curriculumLevels';
import {
  getLevelSubjectIds,
  getLevelScopedKey,
  getLevelFirestoreDocId,
  getDefaultExamDateForLevel,
  isClockSlotsStorageKeyForLevel
} from '../utils/levelStorage';

const ALL_SUBJECT_TAG_PREFIX_REGEX = /^\[(Accounts|Law|MathStats|Econ|AdvAcc|CorpLaw|Tax|Cost|AuditInter|FMSM|FR|AFM|Audit|DT|IDT|IBS|CMA[A-Za-z0-9]+)\]\s*/i;

function itemMatchesCALevel(item: any, level: CALevel): boolean {
  if (!item) return false;
  if (isValidCALevelValue(item.caLevel)) {
    return item.caLevel === level;
  }
  const sub = item.subjectCode || item.subjectId;
  if (sub) {
    return getLevelForSubject(String(sub)) === level;
  }
  return level === 'final';
}

export interface TargetSystemSnapshot {
  tasks: GoogleTask[];
  roadmapCheckpoints: any[];
  roadmapDates: { prepStartDate?: string; examDate?: string } | null;
  prepRoadmapRevisions: any[];
  revisionPlannerBySubject: Record<string, Record<string, any>>;
  lastSyncedAt: number;
  syncVersion: number;
  isSyncing: boolean;
}

// Global in-flight guard to coalesce rapid consecutive Firestore re-fetches
let inflightRefetchPromise: Promise<void> | null = null;
let lastRefetchTimestamp = 0;

/**
 * Forces an immediate re-fetch of the Roadmap, Daily Planner, and Milestone states
 * from Firestore (when authenticated) and reconciles local caches, 24-hour target clock
 * slots, and target duration meters so all displays remain accurate.
 */
export async function forceRefetchTargetSystemFromFirestore(options?: {
  selectedDate?: string;
  bypassThrottle?: boolean;
}): Promise<void> {
  const now = Date.now();
  if (!options?.bypassThrottle && inflightRefetchPromise && now - lastRefetchTimestamp < 400) {
    return inflightRefetchPromise;
  }
  lastRefetchTimestamp = now;

  const runRefetch = async () => {
    const level = getSelectedCALevel();
    const levelSubjects = getLevelSubjectIds(level);
    const currentUser = auth.currentUser;
    const isRealUser = Boolean(currentUser && !currentUser.isAnonymous && currentUser.uid !== 'guest_user');
    const useLocalMode = localStorage.getItem('practca_use_local_mode') === 'true';

    try {
      // 1. Re-fetch Daily Planner Tasks & Task Lists from Firestore
      let latestTasks: GoogleTask[] = [];
      const cachedCloudTasksKey = getLevelScopedKey('practca_cached_cloud_tasks', level);
      const localTasksKey = getLevelScopedKey('practca_local_tasks', level);

      if (isRealUser && currentUser) {
        try {
          const tasksColRef = collection(db, 'users', currentUser.uid, 'tasks');
          const tasksSnap = await getDocs(tasksColRef);
          const cloudTasks = tasksSnap.docs
            .map(d => ({
              id: d.id,
              ...d.data()
            }))
            .filter(t => itemMatchesCALevel(t, level)) as GoogleTask[];

          if (cloudTasks.length > 0 || !useLocalMode) {
            localStorage.setItem(cachedCloudTasksKey, JSON.stringify(cloudTasks));
            if (!useLocalMode) {
              localStorage.setItem(localTasksKey, JSON.stringify(cloudTasks));
            }
            latestTasks = cloudTasks;
          }
        } catch (err) {
          console.warn('TargetSystemSync: Failed to re-fetch Daily Planner tasks from Firestore:', err);
        }
      }

      if (latestTasks.length === 0) {
        const rawLocal = localStorage.getItem(localTasksKey) || localStorage.getItem(cachedCloudTasksKey);
        if (rawLocal) {
          try {
            const parsed = JSON.parse(rawLocal);
            if (Array.isArray(parsed)) latestTasks = parsed;
          } catch (e) {}
        }
      }

      // Rebuild completed registry keys from authoritative tasks so no stale flags linger
      const completedKeysToAdd: string[] = [];
      const incompleteKeysToRemove: string[] = [];
      latestTasks.forEach((t: any) => {
        const isDone = t.status === 'completed' || Boolean(t.completed);
        const idNorm = t.id ? String(t.id).trim().toLowerCase() : '';
        const titleNorm = normalizeKey(t.title);
        const cleanNorm = normalizeKey(t.cleanTitle || t.title);
        const chapNorm = normalizeKey(t.chapterName);
        const compClean = getTaskCompositeKey(t.cleanTitle || t.title, t.subjectCode);
        const compTitle = getTaskCompositeKey(t.title, t.subjectCode);
        const compChap = getTaskCompositeKey(t.chapterName, t.subjectCode);

        const keys = [idNorm, titleNorm, cleanNorm, chapNorm, compClean, compTitle, compChap].filter(Boolean);
        if (isDone) {
          completedKeysToAdd.push(...keys);
        } else {
          incompleteKeysToRemove.push(...keys);
        }
      });

      if (completedKeysToAdd.length > 0 || incompleteKeysToRemove.length > 0) {
        // Only remove keys that are not completed by another duplicate task on the same topic
        const completedSet = new Set(completedKeysToAdd.map(k => k.toLowerCase()));
        const filteredRemove = incompleteKeysToRemove.filter(k => !completedSet.has(k.toLowerCase()));
        saveToCompletedRegistry(completedKeysToAdd, filteredRemove, level);
      }

      // 2. Re-fetch Roadmap & Milestone Checkpoints from Firestore
      const cpUserKey = getLevelScopedKey('practca_roadmap_user_checkpoints', level);
      const cpV3Key = getLevelScopedKey('practca_roadmap_checkpoints_v3', level);
      const deletedMilestonesKey = getLevelScopedKey('practca_deleted_milestone_ids', level);
      const masterDatesKey = getLevelScopedKey('practca_roadmap_master_dates', level);
      const examDateKey = getLevelScopedKey('practca_exam_date', level);
      const prepRoadmapKey = getLevelScopedKey('practca_prep_roadmap_revisions_v2', level);

      if (isRealUser && currentUser) {
        try {
          const roadmapDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('roadmap', level));
          const roadmapSnap = await getDoc(roadmapDocRef);
          if (roadmapSnap.exists()) {
            const data = roadmapSnap.data();
            if (Array.isArray(data.checkpoints)) {
              let deletedIds: string[] = [];
              try {
                const delRaw = localStorage.getItem(deletedMilestonesKey);
                if (delRaw) deletedIds = JSON.parse(delRaw);
              } catch (e) {}
              const nonDeleted = Array.isArray(deletedIds) && deletedIds.length > 0
                ? data.checkpoints.filter((c: any) => !deletedIds.includes(c.id))
                : data.checkpoints;
              // Merge task completions into roadmap checkpoints
              const reconciledCheckpoints = reconcileCheckpointsWithTasks(nonDeleted, latestTasks);
              localStorage.setItem(cpUserKey, JSON.stringify(reconciledCheckpoints));
            }
            if (data.prepStartDate || data.examDate) {
              const existingDatesRaw = localStorage.getItem(masterDatesKey);
              const existingDates = existingDatesRaw ? JSON.parse(existingDatesRaw) : {};
              const mergedDates = {
                prepStartDate: data.prepStartDate || existingDates.prepStartDate,
                examDate: data.examDate || existingDates.examDate
              };
              localStorage.setItem(masterDatesKey, JSON.stringify(mergedDates));
              if (mergedDates.examDate) {
                localStorage.setItem(examDateKey, mergedDates.examDate);
              }
            }
          } else {
            // If Firestore doc doesn't exist yet, push local checkpoints up to Firestore
            const localCpRaw = localStorage.getItem(cpUserKey);
            if (localCpRaw) {
              const parsedCp = JSON.parse(localCpRaw);
              if (Array.isArray(parsedCp)) {
                const reconciled = reconcileCheckpointsWithTasks(parsedCp, latestTasks);
                localStorage.setItem(cpUserKey, JSON.stringify(reconciled));
                const datesRaw = localStorage.getItem(masterDatesKey);
                const dates = datesRaw ? JSON.parse(datesRaw) : {};
                await setDoc(roadmapDocRef, {
                  caLevel: level,
                  checkpoints: reconciled,
                  prepStartDate: dates.prepStartDate || new Date().toISOString().split('T')[0],
                  examDate: dates.examDate || localStorage.getItem(examDateKey) || getDefaultExamDateForLevel(level),
                  updatedAt: new Date().toISOString()
                }, { merge: true });
              }
            }
          }
        } catch (err) {
          console.warn('TargetSystemSync: Failed to re-fetch Roadmap state from Firestore:', err);
        }

        // Also re-fetch PreparationRoadmapView phases if stored
        try {
          const prepRoadmapRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId('prep_roadmap_v2', level));
          const prepSnap = await getDoc(prepRoadmapRef);
          if (prepSnap.exists()) {
            const prepData = prepSnap.data();
            if (Array.isArray(prepData.revisions)) {
              localStorage.setItem(prepRoadmapKey, JSON.stringify(prepData.revisions));
            }
          }
        } catch (err) {}
      } else {
        // Local mode: still reconcile checkpoints with latest tasks
        try {
          const localCpRaw = localStorage.getItem(cpUserKey);
          if (localCpRaw) {
            const parsedCp = JSON.parse(localCpRaw);
            if (Array.isArray(parsedCp)) {
              let deletedIds: string[] = [];
              try {
                const delRaw = localStorage.getItem(deletedMilestonesKey);
                if (delRaw) deletedIds = JSON.parse(delRaw);
              } catch (e) {}
              const nonDeleted = Array.isArray(deletedIds) && deletedIds.length > 0
                ? parsedCp.filter((c: any) => !deletedIds.includes(c.id))
                : parsedCp;
              const reconciled = reconcileCheckpointsWithTasks(nonDeleted, latestTasks);
              localStorage.setItem(cpUserKey, JSON.stringify(reconciled));
            }
          }
        } catch (e) {}
      }

      // 3. Re-fetch Subject Revision & Milestone States from Firestore
      if (isRealUser && currentUser) {
        let currentActiveCps: any[] = [];
        try {
          const cpRaw = localStorage.getItem(cpUserKey) || localStorage.getItem(cpV3Key);
          if (cpRaw) currentActiveCps = JSON.parse(cpRaw);
        } catch (e) {}

        await Promise.all(
          levelSubjects.map(async (subId) => {
            try {
              const revDocRef = firestoreDoc(db, 'users', currentUser.uid, 'revisionPlanner', getLevelFirestoreDocId(subId, level));
              const revSnap = await getDoc(revDocRef);
              if (revSnap.exists()) {
                const data = revSnap.data();
                if (data && data.chapters) {
                  const localKey = getLevelScopedKey(`practca_revision_planner_${subId}`, level);
                  const currentLocalRaw = localStorage.getItem(localKey);
                  const currentLocal = currentLocalRaw ? JSON.parse(currentLocalRaw) : null;
                  const mergedChapters = { ...(data.chapters || {}) };

                  // Guard against resurrecting undone chapters from stale Firestore data
                  if (currentLocal && currentLocal.chapters) {
                    Object.keys(currentLocal.chapters).forEach(chKey => {
                      const localCycles = currentLocal.chapters[chKey];
                      const firestoreCycles = mergedChapters[chKey];
                      if (localCycles && firestoreCycles) {
                        Object.keys(localCycles).forEach(rk => {
                          if (localCycles[rk] && localCycles[rk].completed === false && firestoreCycles[rk]?.completed === true) {
                            const isDoneInAnyCp = (currentActiveCps || []).some(cp => {
                              if (cp.subjectId !== 'CUSTOM' && cp.subjectId !== subId) return false;
                              return Array.isArray(cp.completedChapters) && cp.completedChapters.some((c: string) => {
                                const cClean = c.replace(ALL_SUBJECT_TAG_PREFIX_REGEX, '').trim();
                                return cClean.toLowerCase() === chKey.toLowerCase();
                              });
                            });
                            if (!isDoneInAnyCp) {
                              firestoreCycles[rk] = {
                                ...firestoreCycles[rk],
                                completed: false,
                                completedAt: undefined,
                                isManualDateOverride: false,
                                skipped: false
                              };
                            }
                          }
                        });
                      }
                    });
                  }

                  localStorage.setItem(
                    localKey,
                    JSON.stringify({
                      revisionsCount: data.revisionsCount || 3,
                      chapters: mergedChapters
                    })
                  );
                }
              }
            } catch (err) {
              console.warn(`TargetSystemSync: Failed to re-fetch milestone state for ${subId}:`, err);
            }
          })
        );
      }

      // 4. Reconcile all 24-Hour Target Clock slots & Target Flow with authoritative task completion states
      reconcileTargetClocksAndFlowWithTasks(latestTasks, level);

      // 5. Broadcast unified synchronization events so 24h Target Clock, Target Duration Meter, Roadmap, and Daily Planner update immediately
      window.dispatchEvent(new CustomEvent('practca_target_system_synced', {
        detail: { timestamp: Date.now(), selectedDate: options?.selectedDate }
      }));
      window.dispatchEvent(new Event('practca_tasks_updated'));
      window.dispatchEvent(new Event('practca_target_clock_updated'));
      window.dispatchEvent(new Event('practca_roadmap_checkpoints_updated'));
      window.dispatchEvent(new Event('practca_revision_update'));
      window.dispatchEvent(new Event('practca_flow_updated'));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('TargetSystemSync: Error during unified Firestore re-fetch:', err);
    }
  };

  inflightRefetchPromise = runRefetch().finally(() => {
    inflightRefetchPromise = null;
  });

  return inflightRefetchPromise;
}

/**
 * Reconciles Roadmap Checkpoints (`completedChapters`) with the current Daily Planner tasks list.
 */
function reconcileCheckpointsWithTasks(checkpoints: any[], tasks: GoogleTask[]): any[] {
  if (!Array.isArray(checkpoints)) return [];

  // Group checkpoints by subjectId sorted chronologically by targetDate
  const bySubject = new Map<string, any[]>();
  checkpoints.forEach(cp => {
    const key = String(cp.subjectId || 'CUSTOM').toUpperCase();
    if (!bySubject.has(key)) bySubject.set(key, []);
    bySubject.get(key)!.push(cp);
  });
  bySubject.forEach(list => {
    list.sort((a, b) => String(a.targetDate || '').localeCompare(String(b.targetDate || '')));
  });

  return checkpoints.map(cp => {
    const isSub = cp.subjectId && cp.subjectId !== 'CUSTOM';
    const subKey = String(cp.subjectId || 'CUSTOM').toUpperCase();
    const sameSubjectList = bySubject.get(subKey) || [cp];
    const cpChronoIndex = sameSubjectList.findIndex(item => item.id === cp.id);
    const hasMultipleSameSubject = sameSubjectList.length > 1;
    const prevSameSubjectTargetDate = cpChronoIndex > 0
      ? String(sameSubjectList[cpChronoIndex - 1]?.targetDate || '')
      : '';

    const selectedChaps: string[] = Array.isArray(cp.selectedChapters) && cp.selectedChapters.length > 0
      ? cp.selectedChapters
      : (isSub ? (SUBJECT_CHAPTERS[cp.subjectId as SubjectId] || []) : []);
    const existingCompleted = new Set<string>(Array.isArray(cp.completedChapters) ? cp.completedChapters : []);

    tasks.forEach(t => {
      if (isSub && t.subjectCode && t.subjectCode.toUpperCase() !== subKey) {
        return;
      }

      // Check explicit milestoneId on task or inside task.notes
      const tMilestoneId = t.milestoneId || (typeof t.notes === 'string' && t.notes.match(/MilestoneId:\s*([^\n\r]+)/i)?.[1]?.trim());
      if (tMilestoneId) {
        if (tMilestoneId !== cp.id) return;
      } else if (hasMultipleSameSubject) {
        // When multiple milestones exist for the same subject, an unlinked task must strictly fall within this milestone's date window
        const tDate = (t.due || t.taskDate || '').split('T')[0];
        if (!tDate) return;
        const windowStart = cp.startDate || prevSameSubjectTargetDate;
        if (cpChronoIndex === 0) {
          if (tDate > cp.targetDate) return;
        } else {
          if (!windowStart || tDate <= prevSameSubjectTargetDate || tDate > cp.targetDate) {
            return;
          }
        }
      }

      const isTaskDone = t.status === 'completed' || Boolean(t.completed);
      const searchCandidates = [t.chapterName, t.cleanTitle, t.title].filter((s): s is string => Boolean(s && s.trim().length > 0));

      const matchedChapter = resolveExactOrBestChapterMatch(
        selectedChaps,
        searchCandidates,
        cp.subjectId && cp.subjectId !== 'ALL' ? (cp.subjectId as SubjectId) : undefined
      );

      if (matchedChapter) {
        if (isTaskDone) {
          existingCompleted.add(matchedChapter);
        }
      }
    });

    return {
      ...cp,
      completedChapters: Array.from(existingCompleted)
    };
  });
}

/**
 * Reconciles all `practca_24h_target_clock_*` slots and `practca_target_flow` items
 * against the authoritative tasks & completed registry so that both completed AND
 * reopened/unchecked tasks accurately reflect on the 24-hour target clock and meter displays.
 */
export function reconcileTargetClocksAndFlowWithTasks(
  tasks: GoogleTask[],
  level: CALevel = getSelectedCALevel()
): void {
  try {
    const registry = getCompletedRegistry(level);

    const checkIsDoneAuthoritative = (
      targetId?: string,
      title?: string,
      cleanTitle?: string,
      chapterName?: string,
      subjectCode?: string
    ): boolean => {
      const idNorm = targetId ? targetId.trim().toLowerCase() : '';
      const titleNorm = normalizeKey(title);
      const cleanNorm = normalizeKey(cleanTitle || title);
      const chapNorm = normalizeKey(chapterName);
      const compClean = getTaskCompositeKey(cleanTitle || title, subjectCode);
      const compTitle = getTaskCompositeKey(title, subjectCode);
      const compChap = getTaskCompositeKey(chapterName, subjectCode);

      // 1. Check authoritative tasks list first if a matching task exists
      if (Array.isArray(tasks) && tasks.length > 0) {
        const matchingTasks = tasks.filter(t => {
          const tId = (t.id || '').trim().toLowerCase();
          const tTitle = normalizeKey(t.title);
          const tClean = normalizeKey(t.cleanTitle || t.title);
          const tChap = normalizeKey(t.chapterName);

          return Boolean(
            (idNorm && tId && idNorm === tId) ||
            (cleanNorm && tClean && cleanNorm === tClean) ||
            (titleNorm && tTitle && titleNorm === tTitle) ||
            (cleanNorm && tTitle && cleanNorm === tTitle) ||
            (titleNorm && tClean && titleNorm === tClean) ||
            (chapNorm && tChap && chapNorm === tChap && (!subjectCode || !t.subjectCode || subjectCode.toUpperCase() === t.subjectCode.toUpperCase()))
          );
        });

        if (matchingTasks.length > 0) {
          return matchingTasks.some(t => t.status === 'completed' || Boolean(t.completed));
        }
      }

      // 2. Fallback to registry
      if (compClean && registry.has(compClean)) return true;
      if (compTitle && registry.has(compTitle)) return true;
      if (compChap && registry.has(compChap)) return true;
      if (idNorm && registry.has(idNorm)) return true;
      if (cleanNorm && registry.has(cleanNorm)) return true;
      if (titleNorm && registry.has(titleNorm)) return true;
      if (chapNorm && registry.has(chapNorm)) return true;

      return false;
    };

    // Update all 24h target clocks for this CA level
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && isClockSlotsStorageKeyForLevel(key, level)) {
        const rawClock = localStorage.getItem(key);
        if (rawClock) {
          try {
            const slots = JSON.parse(rawClock);
            if (Array.isArray(slots)) {
              let changed = false;
              const updatedSlots = slots.map((s: any) => {
                const isDone = checkIsDoneAuthoritative(
                  s.targetId,
                  s.title,
                  s.title,
                  s.chapterName,
                  s.subjectCode
                );
                const nextStatus = isDone ? 'completed' : (s.status === 'active' ? 'active' : 'pending');
                if (s.status !== nextStatus) {
                  changed = true;
                  return { ...s, status: nextStatus };
                }
                return s;
              });
              if (changed) {
                localStorage.setItem(key, JSON.stringify(updatedSlots));
              }
            }
          } catch (e) {}
        }
      }
    }

    // Update Target Flow for this CA level
    const flowKey = getLevelScopedKey('practca_target_flow', level);
    const rawFlow = localStorage.getItem(flowKey);
    if (rawFlow) {
      try {
        const flow = JSON.parse(rawFlow);
        if (Array.isArray(flow)) {
          let changed = false;
          const updatedFlow = flow.map((f: any) => {
            const isDone = checkIsDoneAuthoritative(
              f.taskId || f.id,
              f.title,
              f.cleanTitle || f.title,
              f.chapterName,
              f.subjectCode
            );
            const nextStatus = isDone ? 'completed' : (f.status === 'completed' ? 'pending' : f.status);
            if (f.status !== nextStatus) {
              changed = true;
              return {
                ...f,
                status: nextStatus,
                completedAt: isDone ? (f.completedAt || new Date().toISOString()) : undefined
              };
            }
            return f;
          });
          if (changed) {
            localStorage.setItem(flowKey, JSON.stringify(updatedFlow));
          }
        }
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Error reconciling target clocks and flow:', e);
  }
}

/**
 * Unified React Hook for the 'target' system (`useTargetSystemSync`).
 * Forces a re-fetch of the Roadmap, Daily Planner, and Milestone states from Firestore
 * whenever task completion status changes, and keeps the 24-hour target clock and
 * Target & Duration Meter displays accurate in real time.
 */
export function useTargetSystemSync(
  optionsOrDate?: string | {
    selectedDate?: string;
    onSyncComplete?: (snapshot: TargetSystemSnapshot) => void;
  }
) {
  const normalizedOptions = typeof optionsOrDate === 'string'
    ? { selectedDate: optionsOrDate }
    : optionsOrDate;
  const [syncVersion, setSyncVersion] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number>(() => Date.now());
  const optionsRef = useRef(normalizedOptions);
  optionsRef.current = normalizedOptions;

  const syncMetaRef = useRef({ lastSyncedAt, syncVersion, isSyncing });
  syncMetaRef.current = { lastSyncedAt, syncVersion, isSyncing };

  const readLocalSnapshot = useCallback((): TargetSystemSnapshot => {
    const level = getSelectedCALevel();
    const levelSubjects = getLevelSubjectIds(level);
    let tasks: GoogleTask[] = [];
    let roadmapCheckpoints: any[] = [];
    let roadmapDates: { prepStartDate?: string; examDate?: string } | null = null;
    let prepRoadmapRevisions: any[] = [];
    const revisionPlannerBySubject: Record<string, Record<string, any>> = {};

    try {
      const useLocal = localStorage.getItem('practca_use_local_mode') !== 'false';
      const localTasksKey = getLevelScopedKey('practca_local_tasks', level);
      const cachedTasksKey = getLevelScopedKey('practca_cached_cloud_tasks', level);
      const rawTasks = localStorage.getItem(useLocal ? localTasksKey : cachedTasksKey) ||
                       localStorage.getItem(localTasksKey);
      if (rawTasks) {
        const parsed = JSON.parse(rawTasks);
        if (Array.isArray(parsed)) tasks = parsed;
      }
    } catch (e) {}

    try {
      const rawCp = localStorage.getItem(getLevelScopedKey('practca_roadmap_user_checkpoints', level));
      if (rawCp) {
        const parsed = JSON.parse(rawCp);
        if (Array.isArray(parsed)) roadmapCheckpoints = parsed;
      }
    } catch (e) {}

    try {
      const rawDates = localStorage.getItem(getLevelScopedKey('practca_roadmap_master_dates', level));
      if (rawDates) {
        roadmapDates = JSON.parse(rawDates);
      }
    } catch (e) {}

    try {
      const rawPrep = localStorage.getItem(getLevelScopedKey('practca_prep_roadmap_revisions_v2', level));
      if (rawPrep) {
        const parsed = JSON.parse(rawPrep);
        if (Array.isArray(parsed)) prepRoadmapRevisions = parsed;
      }
    } catch (e) {}

    levelSubjects.forEach(subId => {
      try {
        const rawRev = localStorage.getItem(getLevelScopedKey(`practca_revision_planner_${subId}`, level));
        if (rawRev) {
          const parsed = JSON.parse(rawRev);
          if (parsed && parsed.chapters) {
            revisionPlannerBySubject[subId] = parsed.chapters;
          }
        }
      } catch (e) {}
    });

    return {
      tasks,
      roadmapCheckpoints,
      roadmapDates,
      prepRoadmapRevisions,
      revisionPlannerBySubject,
      lastSyncedAt: syncMetaRef.current.lastSyncedAt,
      syncVersion: syncMetaRef.current.syncVersion,
      isSyncing: syncMetaRef.current.isSyncing
    };
  }, []);

  const forceRefetch = useCallback(async (bypassThrottle: boolean = false) => {
    setIsSyncing(true);
    try {
      await forceRefetchTargetSystemFromFirestore({
        selectedDate: optionsRef.current?.selectedDate,
        bypassThrottle
      });
      const ts = Date.now();
      setLastSyncedAt(ts);
      setSyncVersion(v => v + 1);
      if (optionsRef.current?.onSyncComplete) {
        optionsRef.current.onSyncComplete(readLocalSnapshot());
      }
    } finally {
      setIsSyncing(false);
    }
  }, [readLocalSnapshot]);

  const syncTaskCompletion = useCallback(
    async (
      task: TaskIdentifier,
      isCompleted: boolean,
      syncOptions?: { completionDate?: string; selectedDate?: string }
    ) => {
      setIsSyncing(true);
      try {
        await syncTaskCompletionAcrossAllLinks(task, isCompleted, {
          completionDate: syncOptions?.completionDate,
          selectedDate: syncOptions?.selectedDate || optionsRef.current?.selectedDate
        });
        await forceRefetchTargetSystemFromFirestore({
          selectedDate: syncOptions?.selectedDate || optionsRef.current?.selectedDate,
          bypassThrottle: true
        });
        const ts = Date.now();
        setLastSyncedAt(ts);
        setSyncVersion(v => v + 1);
      } finally {
        setIsSyncing(false);
      }
    },
    []
  );

  useEffect(() => {
    const handleTaskCompletionEvent = () => {
      forceRefetch(false);
    };

    const handleSystemSynced = () => {
      setLastSyncedAt(Date.now());
      setSyncVersion(v => v + 1);
      if (optionsRef.current?.onSyncComplete) {
        optionsRef.current.onSyncComplete(readLocalSnapshot());
      }
    };

    const handleLevelChanged = () => {
      handleSystemSynced();
      forceRefetch(false);
    };

    window.addEventListener('practca_task_completion_changed', handleTaskCompletionEvent);
    window.addEventListener('practca_target_system_synced', handleSystemSynced);
    window.addEventListener('practca_tasks_updated', handleSystemSynced);
    window.addEventListener('practca_target_clock_updated', handleSystemSynced);
    window.addEventListener('practca_roadmap_checkpoints_updated', handleSystemSynced);
    window.addEventListener('practca_revision_update', handleSystemSynced);
    window.addEventListener('practca_level_changed', handleLevelChanged);

    return () => {
      window.removeEventListener('practca_task_completion_changed', handleTaskCompletionEvent);
      window.removeEventListener('practca_target_system_synced', handleSystemSynced);
      window.removeEventListener('practca_tasks_updated', handleSystemSynced);
      window.removeEventListener('practca_target_clock_updated', handleSystemSynced);
      window.removeEventListener('practca_roadmap_checkpoints_updated', handleSystemSynced);
      window.removeEventListener('practca_revision_update', handleSystemSynced);
      window.removeEventListener('practca_level_changed', handleLevelChanged);
    };
  }, [forceRefetch, readLocalSnapshot]);

  const currentSnapshot = useMemo(() => readLocalSnapshot(), [syncVersion, readLocalSnapshot]);

  return {
    syncVersion,
    isSyncing,
    lastSyncedAt,
    tasks: currentSnapshot.tasks,
    roadmapCheckpoints: currentSnapshot.roadmapCheckpoints,
    roadmapDates: currentSnapshot.roadmapDates,
    roadmapRevisions: currentSnapshot.prepRoadmapRevisions,
    prepRoadmapRevisions: currentSnapshot.prepRoadmapRevisions,
    revisionPlannerBySubject: currentSnapshot.revisionPlannerBySubject,
    forceRefetchFromFirestore: forceRefetch,
    syncTaskCompletion,
    getSnapshot: readLocalSnapshot,
    isTaskCompleted: isTaskCompletedInStorage
  };
}
