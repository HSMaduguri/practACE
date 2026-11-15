/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { SubjectId, RevisionVideoReference, FocusSession } from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { INITIAL_REVISION_VIDEOS } from '../data/revisionVideos';
import { ModalPortal } from './ModalPortal';
import { formatRunningTime } from '../utils/timeFormat';
import { 
  Youtube, 
  Play, 
  ExternalLink, 
  Search, 
  ChevronRight, 
  ArrowLeft, 
  X,
  Clock,
  User,
  BookOpen,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Flame,
  Pause,
  FileText,
  Video,
  Copy,
  Check,
  Lock
} from 'lucide-react';
import { isSubjectLockedAfterFinalExam } from '../utils/taskCompletionSync';
import { StudyVaultTabId } from './StudyVaultInterconnectBar';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';
import { getLevelScopedKey } from '../utils/levelStorage';

interface RevisionReferencesViewProps {
  selectedSubjectId: SubjectId | null;
  setSelectedSubjectId: (id: SubjectId | null) => void;
  onAllocateSession?: (session: Omit<FocusSession, 'id' | 'timestamp'> & { id?: string; timestamp?: string }) => Promise<void>;
  onNavigateStudyVault?: (targetTab: StudyVaultTabId, subjectId: SubjectId) => void;
}

interface WatchRecord {
  lastWatchedAt: string;
  duration: string;
}

function getYouTubeVideoId(video: RevisionVideoReference): string {
  if (video.youtubeVideoId && video.youtubeVideoId.trim()) {
    return video.youtubeVideoId.trim();
  }
  const url = video.youtubeUrl || '';
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

export default function RevisionReferencesView({
  selectedSubjectId,
  setSelectedSubjectId,
  onAllocateSession,
  onNavigateStudyVault
}: RevisionReferencesViewProps) {
  const caLevel = useCALevel();
  const levelInfo = CA_CURRICULUM_LEVELS[caLevel];
  const videos: RevisionVideoReference[] = INITIAL_REVISION_VIDEOS;
  const [refSearchQuery, setRefSearchQuery] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [copiedVideoId, setCopiedVideoId] = useState<string | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);
  const [failedThumbnails, setFailedThumbnails] = useState<Record<string, boolean>>({});
  
  // Watch History State stored in localStorage
  const [watchHistory, setWatchHistory] = useState<Record<string, WatchRecord>>(() => {
    try {
      const saved = localStorage.getItem('practca_video_watch_history');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active Video Modal State
  const [activeVideoEmbed, setActiveVideoEmbed] = useState<RevisionVideoReference | null>(null);

  // Study Mode & Timer State (Count UP Stopwatch)
  const [studyModeActive, setStudyModeActive] = useState<boolean>(false);
  const [studyTimerSeconds, setStudyTimerSeconds] = useState<number>(0);
  const [studyTimerRunning, setStudyTimerRunning] = useState<boolean>(false);
  const [studyNotes, setStudyNotes] = useState<string>('');
  const [grindLogNotification, setGrindLogNotification] = useState<string | null>(null);

  // YouTube Redirect Prompt Dialog State
  const [ytPromptVideo, setYtPromptVideo] = useState<RevisionVideoReference | null>(null);

  // Study Timer Count-Up Effect
  useEffect(() => {
    let interval: any = null;
    if (studyTimerRunning) {
      interval = setInterval(() => {
        setStudyTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [studyTimerRunning]);

  const formatTimer = (secs: number) => {
    return formatRunningTime(secs);
  };

  // Helper to record watched date & duration
  const recordVideoWatch = (video: RevisionVideoReference) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const record: WatchRecord = {
      lastWatchedAt: formattedDate,
      duration: video.duration
    };

    setWatchHistory(prev => {
      const next = { ...prev, [video.id]: record };
      try {
        localStorage.setItem('practca_video_watch_history', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save watch history', e);
      }
      return next;
    });
  };

  // Log session to Grind Clock logs
  const logSessionToGrindClock = async (video: RevisionVideoReference, elapsedSeconds: number) => {
    const durationMins = Math.max(1, Math.round(elapsedSeconds / 60));
    const cleanNotes = studyNotes.trim();
    const desc = `Video Revision: ${video.videoTitle} (${video.facultyName})${cleanNotes ? ` — Notes: ${cleanNotes}` : ''}`;

    const sessionData = {
      duration: durationMins,
      subjectId: video.subjectId,
      description: desc,
      sessionType: 'work' as const,
      chapterName: video.chapterName,
      relevance: 'Revision' as const,
      timestamp: new Date().toISOString()
    };

    if (onAllocateSession) {
      try {
        await onAllocateSession(sessionData);
      } catch (err) {
        console.warn('Error calling onAllocateSession:', err);
      }
    }

    try {
      const scopedFocusKey = getLevelScopedKey('practca_focus_sessions', caLevel);
      const existingStr = localStorage.getItem(scopedFocusKey);
      const existingSessions: FocusSession[] = existingStr ? JSON.parse(existingStr) : [];
      const newSession: FocusSession = {
        id: `sess_vid_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        ...sessionData
      };
      
      const isAlreadyAdded = existingSessions.some(
        s => s.subjectId === newSession.subjectId && s.description === newSession.description && s.duration === newSession.duration
      );

      if (!isAlreadyAdded) {
        const updated = [...existingSessions, newSession];
        localStorage.setItem(scopedFocusKey, JSON.stringify(updated));
      }
    } catch (e) {
      console.error('Failed storing session to localStorage:', e);
    }

    setGrindLogNotification(`✓ Logged ${durationMins}m to Focus Timer logs for ${video.subjectId}!`);
    setTimeout(() => {
      setGrindLogNotification(null);
    }, 4000);
  };

  const handleCloseModal = () => {
    if (activeVideoEmbed && studyModeActive && studyTimerSeconds >= 5) {
      logSessionToGrindClock(activeVideoEmbed, studyTimerSeconds);
    }
    setActiveVideoEmbed(null);
    setStudyModeActive(false);
    setStudyTimerSeconds(0);
    setStudyTimerRunning(false);
    setStudyNotes('');
  };

  const handleWatchInApp = (video: RevisionVideoReference) => {
    setActiveVideoEmbed(video);
    recordVideoWatch(video);
    setStudyModeActive(false);
    setStudyTimerSeconds(0);
    setStudyTimerRunning(false);
  };

  const handleOpenYtClick = (e: React.MouseEvent, video: RevisionVideoReference) => {
    e.preventDefault();
    setYtPromptVideo(video);
  };

  const handleConfirmOpenYtWithStudyMode = () => {
    if (!ytPromptVideo) return;
    recordVideoWatch(ytPromptVideo);
    setActiveVideoEmbed(ytPromptVideo);
    setStudyModeActive(true);
    setStudyTimerRunning(true);
    window.open(ytPromptVideo.youtubeUrl, '_blank');
    setYtPromptVideo(null);
  };

  const handleConfirmOpenYtDirect = () => {
    if (!ytPromptVideo) return;
    recordVideoWatch(ytPromptVideo);
    window.open(ytPromptVideo.youtubeUrl, '_blank');
    setYtPromptVideo(null);
  };

  const handleCopyVideoLink = (video: RevisionVideoReference) => {
    navigator.clipboard.writeText(video.youtubeUrl);
    setCopiedVideoId(video.id);
    setCopiedToast(`Copied YouTube link for "${video.chapterName}"!`);
    setTimeout(() => {
      setCopiedVideoId(prev => (prev === video.id ? null : prev));
      setCopiedToast(null);
    }, 3000);
  };

  // All videos for the active subject
  const availableSubjectVideos = useMemo(() => {
    return videos.filter(v => !selectedSubjectId || v.subjectId === selectedSubjectId);
  }, [videos, selectedSubjectId]);

  // Unique topics/chapters for current subject
  const availableTopics = useMemo(() => {
    const topics = Array.from<string>(new Set(availableSubjectVideos.map(v => v.chapterName)));
    return topics.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }, [availableSubjectVideos]);

  // Unique faculty members for current subject
  const availableFaculties = useMemo(() => {
    const faculties = Array.from<string>(new Set(availableSubjectVideos.map(v => v.facultyName)));
    return faculties.sort();
  }, [availableSubjectVideos]);

  // Filter videos based on search query, selected topic, and selected faculty (matching Concept Focus)
  const currentSubjectVideos = useMemo(() => {
    const q = refSearchQuery.toLowerCase().trim();
    return availableSubjectVideos.filter(v => {
      const matchesSearch =
        !q ||
        v.videoTitle.toLowerCase().includes(q) ||
        v.chapterName.toLowerCase().includes(q) ||
        v.facultyName.toLowerCase().includes(q) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(q)));
      const matchTopic = selectedTopic === 'all' || !selectedTopic || v.chapterName === selectedTopic;
      const matchFaculty = selectedFaculty === 'all' || !selectedFaculty || v.facultyName === selectedFaculty;
      return matchesSearch && matchTopic && matchFaculty;
    });
  }, [availableSubjectVideos, refSearchQuery, selectedTopic, selectedFaculty]);

  useEffect(() => {
    if (selectedSubjectId && isSubjectLockedAfterFinalExam(selectedSubjectId)) {
      setSelectedSubjectId(null);
    }
  }, [selectedSubjectId, setSelectedSubjectId]);

  const handleSubjectChange = (newSubId: SubjectId) => {
    if (isSubjectLockedAfterFinalExam(newSubId)) return;
    setSelectedSubjectId(newSubId);
    setRefSearchQuery('');
    setSelectedTopic('all');
    setSelectedFaculty('all');
  };

  const getCleanFullSubjectName = (fullName: string): string => {
    return fullName.replace(/\s*\([^)]*\)\s*$/gi, '').trim();
  };

  const CARD_THEMES = [
    { color: 'text-violet-400', border: 'hover:border-violet-500/40 hover:bg-violet-500/5', icon: '📋' },
    { color: 'text-cyan-400', border: 'hover:border-cyan-500/40 hover:bg-cyan-500/5', icon: '📊' },
    { color: 'text-emerald-400', border: 'hover:border-emerald-500/40 hover:bg-emerald-500/5', icon: '🔍' },
    { color: 'text-orange-400', border: 'hover:border-orange-500/40 hover:bg-orange-500/5', icon: '⚖️' },
    { color: 'text-pink-400', border: 'hover:border-pink-500/40 hover:bg-pink-500/5', icon: '🏛️' },
    { color: 'text-yellow-400', border: 'hover:border-yellow-500/40 hover:bg-yellow-500/5', icon: '💡' },
  ];

  const renderVideoSubjectCard = (sub: typeof levelInfo.subjects[number], idx: number) => {
    const theme = CARD_THEMES[idx % CARD_THEMES.length];
    const subCount = videos.filter(v => v.subjectId === sub.code).length;
    const subFaculties = Array.from(new Set(videos.filter(v => v.subjectId === sub.code).map(v => v.facultyName)));
    const isLocked = isSubjectLockedAfterFinalExam(sub.code);
    return (
      <button
        key={sub.code}
        type="button"
        disabled={isLocked}
        onClick={() => {
          if (!isLocked) setSelectedSubjectId(sub.code);
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
              <span className={`text-base font-black font-display uppercase ${theme.color}`}>
                {sub.code}
              </span>
            </div>
            {isLocked ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 font-mono font-bold text-[10px]">
                <Lock className="h-3 w-3" /> Locked
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold text-slate-400">
                {subCount} Videos
              </span>
            )}
          </div>
          <h4 className="text-sm font-black text-white leading-tight truncate">
            {sub.name}
          </h4>
        </div>

        <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-cav-border/50">
          <span className="text-[10px] font-mono text-amber-300/90 truncate">
            {subFaculties.length > 0 ? `🎓 ${subFaculties.join(' · ')}` : ''}
          </span>
          {isLocked ? (
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <Lock className="h-3 w-3 text-emerald-400" /> Exam Completed
            </span>
          ) : (
            <span className="text-[11px] font-extrabold text-red-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform shrink-0">
              Explore Revisions <ChevronRight className="h-3 w-3" />
            </span>
          )}
        </div>
      </button>
    );
  };

  // Overview Hub view when no subject selected
  if (!selectedSubjectId) {
    if (levelInfo.id === 'foundation' || levelInfo.id === 'cma_foundation') {
      return (
        <div className="space-y-6 animate-fadeIn pb-16 text-left">
          <div className="space-y-4 bg-cav-card2 border border-cav-border p-5 rounded-2xl">
            <div className="flex items-center justify-between border-b border-cav-border/70 pb-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎓</span>
                <h3 className="font-display font-bold text-white text-sm tracking-tight">
                  {levelInfo.shortName} Revision Studio (Papers 1 – 4)
                </h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Papers 1 – 4
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {levelInfo.subjects.map((sub, idx) => renderVideoSubjectCard(sub, idx))}
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
        {/* 2 Group Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Group 1 */}
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
              {group1Subjects.map((sub, idx) => renderVideoSubjectCard(sub, idx))}
            </div>
          </div>

          {/* Group 2 */}
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
              {group2Subjects.map((sub, idx) => renderVideoSubjectCard(sub, idx + group1Subjects.length))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Subject Specific View when selectedSubjectId is non-null
  const activeSubjectMeta = SUBJECTS_METADATA[selectedSubjectId];

  return (
    <div className="revision-references-container space-y-6 animate-fadeIn pb-16 text-left">
      {/* Header Banner (Matching Concept Focus Revision Video References Hub) */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1">
              <Youtube className="h-3 w-3" /> YouTube Video Hub
            </span>
            <span className="text-[10px] text-slate-400 font-mono font-bold">
              {getCleanFullSubjectName(activeSubjectMeta.fullName)} ({selectedSubjectId})
            </span>
          </div>
          <h2 className="text-xl font-black font-display text-slate-100">
            Faculty Revision Classes & Video References
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs font-bold text-amber-300">
            {currentSubjectVideos.length} {currentSubjectVideos.length === 1 ? 'Video' : 'Videos'} Found
          </span>
        </div>
      </div>

      {/* Multi-Filter Search & Select Controls (Matching Concept Focus) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Search Query Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={refSearchQuery}
              onChange={(e) => setRefSearchQuery(e.target.value)}
              placeholder="Search title, chapter, faculty or tags..."
              className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl outline-none focus:border-red-500"
            />
            {refSearchQuery && (
              <button
                onClick={() => setRefSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Faculty Filter Dropdown */}
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-amber-400 pointer-events-none" />
            <select
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">All Faculty ({availableFaculties.length})</option>
              {availableFaculties.map((faculty, idx) => (
                <option key={idx} value={faculty}>{faculty}</option>
              ))}
            </select>
          </div>

          {/* Chapter Filter Dropdown */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-indigo-400 pointer-events-none" />
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-100 rounded-xl outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">All Chapters ({availableTopics.length})</option>
              {availableTopics.map((chap, idx) => (
                <option key={idx} value={chap}>{chap}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reset Filters & Active Tags Row */}
        {(refSearchQuery || selectedFaculty !== 'all' || selectedTopic !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Active Filters:</span>
              {refSearchQuery && (
                <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-[10px]">
                  Query: "{refSearchQuery}"
                </span>
              )}
              {selectedFaculty !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px]">
                  Faculty: {selectedFaculty}
                </span>
              )}
              {selectedTopic !== 'all' && (
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[10px]">
                  Chapter: {selectedTopic}
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setRefSearchQuery('');
                setSelectedFaculty('all');
                setSelectedTopic('all');
              }}
              className="text-slate-400 hover:text-white underline text-[11px] font-mono shrink-0 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Copied Link Toast */}
      {copiedToast && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{copiedToast}</span>
        </div>
      )}

      {/* Video Cards Grid — Identical Visual Preview to Concept Focus Revision Video References */}
      {currentSubjectVideos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Video className="h-12 w-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">No Revision Videos Match Your Filter</h3>
          <button
            onClick={() => {
              setRefSearchQuery('');
              setSelectedFaculty('all');
              setSelectedTopic('all');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
          >
            Reset Search & Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentSubjectVideos.map((video) => {
            const ytId = getYouTubeVideoId(video);
            const showThumbImg = Boolean(ytId && !failedThumbnails[video.id]);
            const watchedInfo = watchHistory[video.id];

            return (
              <div
                key={video.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 hover:border-red-500/50 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden group flex flex-col justify-between"
              >
                <div>
                  {/* 16:9 Video Thumbnail Preview Box (Identical to Concept Focus) */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    {showThumbImg ? (
                      <img
                        src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
                        alt={video.videoTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => {
                          setFailedThumbnails(prev => ({ ...prev, [video.id]: true }));
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center p-4 text-center gap-2">
                        <Video className="h-9 w-9 text-red-500/70" />
                        <span className="text-[11px] font-mono font-bold text-slate-300 line-clamp-1 px-2">
                          {video.facultyName} • {video.subjectId}
                        </span>
                      </div>
                    )}

                    {/* Hover Dark Overlay & Play Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        if (ytId) {
                          handleWatchInApp({ ...video, youtubeVideoId: ytId });
                        } else {
                          handleOpenYtClick(e, video);
                        }
                      }}
                      className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 flex items-center justify-center transition-colors cursor-pointer"
                      title={ytId ? `Watch "${video.videoTitle}" by ${video.facultyName}` : `Open "${video.videoTitle}" on YouTube`}
                    >
                      <div className="h-12 w-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </div>
                    </button>

                    {/* Top Left Tag: Faculty */}
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-950/90 backdrop-blur-md border border-slate-700 text-amber-300 font-bold text-[10px] font-mono shadow-md flex items-center gap-1">
                        🎓 {video.facultyName}
                      </span>
                    </div>

                    {/* Top Right Tag: Watched Status (if watched) */}
                    {watchedInfo && (
                      <div className="absolute top-3 right-3 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-mono text-[9.5px] font-bold shadow-md flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          <span>Watched</span>
                        </span>
                      </div>
                    )}

                    {/* Bottom Right Tag: Duration */}
                    <div className="absolute bottom-3 right-3 pointer-events-none">
                      <span className="px-2 py-0.5 rounded bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-200 font-mono text-[10px] font-bold shadow-md">
                        ⏱️ {video.duration}
                      </span>
                    </div>
                  </div>

                  {/* Content Body (Identical to Concept Focus) */}
                  <div className="p-4 space-y-3">
                    {/* Chapter Name Tag + Faculty Sub-indicator */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-mono text-[10px] font-bold max-w-full">
                        <BookOpen className="h-3 w-3 shrink-0" />
                        <span className="truncate">{video.chapterName}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-slate-100 text-sm leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                      {video.videoTitle}
                    </h3>

                    {/* Description */}
                    {video.description && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}

                    {/* Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {video.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[9.5px]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Last Watched Timestamp if available */}
                    {watchedInfo && (
                      <div className="text-[10px] font-mono text-emerald-400/90 pt-0.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 shrink-0" />
                        <span className="truncate">Last watched: {watchedInfo.lastWatchedAt}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Actions (Matching Concept Focus + In-App Player support) */}
                <div className="p-4 pt-0 flex items-center gap-2">
                  {ytId ? (
                    <button
                      type="button"
                      onClick={() => handleWatchInApp({ ...video, youtubeVideoId: ytId })}
                      className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Play className="h-3.5 w-3.5 fill-current shrink-0" />
                      <span>Watch Lecture</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => handleOpenYtClick(e, video)}
                      className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                    >
                      <Youtube className="h-4 w-4 fill-current shrink-0" />
                      <span>Watch Lecture</span>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => handleOpenYtClick(e, video)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs transition cursor-pointer"
                    title="Open on YouTube (with optional Study Mode Stopwatch)"
                  >
                    <ExternalLink className="h-4 w-4 text-red-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyVideoLink(video)}
                    className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs transition cursor-pointer"
                    title="Copy YouTube Link"
                  >
                    {copiedVideoId === video.id ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Embed Modal */}
      {activeVideoEmbed && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-cav-card border border-cav-border rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4 text-left">
            <div className="flex flex-wrap items-center justify-between border-b border-cav-border pb-3 gap-2">
              <div>
                <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block">
                  {activeVideoEmbed.subjectId} • 🎓 {activeVideoEmbed.facultyName}
                </span>
                <h3 className="text-sm font-black text-white">{activeVideoEmbed.videoTitle}</h3>
              </div>

              <div className="flex items-center gap-2">
                {/* Study Mode Button in App Watch Modal */}
                <button
                  onClick={() => {
                    const nextState = !studyModeActive;
                    setStudyModeActive(nextState);
                    if (nextState) {
                      setStudyTimerRunning(true);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    studyModeActive
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/30'
                  }`}
                >
                  <Sparkles className={`h-3.5 w-3.5 ${studyModeActive ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                  <span>{studyModeActive ? '⚡ Study Mode Active' : '🎯 Study Mode'}</span>
                </button>

                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
                  title="Close Modal & Save Log"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Grind Log Confirmation Banner */}
            {grindLogNotification && (
              <div className="px-3 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{grindLogNotification}</span>
              </div>
            )}

            {/* Study Mode Focus Timer & Scratchpad Bar */}
            {studyModeActive && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3 animate-fadeIn">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-mono font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                      Study Focus Timer:
                    </span>
                    <span className="font-mono text-base font-black text-white bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-800">
                      {formatTimer(studyTimerSeconds)}
                    </span>
                    <button
                      onClick={() => setStudyTimerRunning(!studyTimerRunning)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-700 cursor-pointer"
                      title={studyTimerRunning ? "Pause Timer" : "Start Timer"}
                    >
                      {studyTimerRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-amber-300" />}
                    </button>
                    <button
                      onClick={() => {
                        setStudyTimerSeconds(0);
                        setStudyTimerRunning(false);
                      }}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-700 cursor-pointer"
                      title="Reset Timer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>

                    {/* Manual Log to Focus Timer Button */}
                    <button
                      onClick={() => activeVideoEmbed && logSessionToGrindClock(activeVideoEmbed, studyTimerSeconds)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-[11px] transition flex items-center gap-1 cursor-pointer shadow-xs ml-1"
                      title="Log session to Focus Timer"
                    >
                      <Clock className="h-3 w-3 text-white" />
                      <span>Log to Focus Timer</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                    <BookOpen className="h-3.5 w-3.5 text-amber-400" />
                    <span>{activeVideoEmbed.chapterName}</span>
                  </div>
                </div>

                {/* Quick Revision Notes scratchpad */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1">
                    <FileText className="h-3 w-3 text-amber-400" />
                    <span>Live Chapter Notes Scratchpad</span>
                  </label>
                  <textarea
                    value={studyNotes}
                    onChange={(e) => setStudyNotes(e.target.value)}
                    placeholder="Jot key section numbers, formula notes, or Ind AS statutory provisions while watching..."
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500/50 resize-none font-sans"
                  />
                </div>
              </div>
            )}

            <div className="relative pt-[56.25%] w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(activeVideoEmbed)}?autoplay=1`}
                title={activeVideoEmbed.videoTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* YouTube Redirect Confirmation Prompt Modal */}
      {ytPromptVideo && (
        <ModalPortal>
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-cav-card border border-cav-border rounded-2xl p-6 text-left space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
                  <Flame className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-display font-black text-white text-base">Start Study Mode?</h3>
                  <p className="text-[11px] font-mono text-slate-400">{ytPromptVideo.subjectId} • {ytPromptVideo.chapterName}</p>
                </div>
              </div>

              <button
                onClick={() => setYtPromptVideo(null)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed relative z-10">
              You are about to open <strong className="text-white">"{ytPromptVideo.videoTitle}"</strong> on YouTube. Would you like to launch a Study Mode Focus Stopwatch in practACE while studying?
            </p>

            <div className="space-y-2 pt-2 relative z-10">
              <button
                onClick={handleConfirmOpenYtWithStudyMode}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-amber-200 fill-amber-200" />
                <span>Start Study Mode & Open YouTube</span>
              </button>

              <button
                onClick={handleConfirmOpenYtDirect}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 text-red-400" />
                <span>Just Open YouTube</span>
              </button>

              <button
                onClick={() => setYtPromptVideo(null)}
                className="w-full py-2 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-semibold transition cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
        </ModalPortal>
      )}
    </div>
  );
}
