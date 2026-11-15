import React, { useMemo, useState } from 'react';
import { Share2, X, Copy, Check, Clock, Target, Flame, Award, ExternalLink } from 'lucide-react';
import { FocusSession, PracticeAttempt } from '../types';
import { ModalPortal } from './ModalPortal';

interface ShareStudyProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusSessions: FocusSession[];
  practiceAttempts: PracticeAttempt[];
  dailyGoalMinutes: number;
  examDate: string;
  attemptLabel: string;
}

export const ShareStudyProgressModal: React.FC<ShareStudyProgressModalProps> = ({
  isOpen,
  onClose,
  focusSessions,
  practiceAttempts,
  dailyGoalMinutes,
  attemptLabel,
}) => {
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const workSessions = focusSessions.filter((s) => !s.sessionType || s.sessionType === 'work');
    const totalMinutes = workSessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    const todayStr = new Date().toDateString();
    const todayMinutes = workSessions
      .filter((s) => {
        if (!s.timestamp) return false;
        return new Date(s.timestamp).toDateString() === todayStr;
      })
      .reduce((acc, s) => acc + (Number(s.duration) || 0), 0);

    const dailyProgressPct = dailyGoalMinutes > 0
      ? Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100))
      : 0;

    const totalMcqs = practiceAttempts.length;
    const correctMcqs = practiceAttempts.filter((a) => a.isCorrect).length;
    const accuracyPct = totalMcqs > 0 ? Math.round((correctMcqs / totalMcqs) * 100) : 0;

    const subjectTotals: Record<string, number> = {};
    workSessions.forEach((s) => {
      if (s.subjectId && s.subjectId !== 'General') {
        subjectTotals[s.subjectId] = (subjectTotals[s.subjectId] || 0) + (Number(s.duration) || 0);
      }
    });

    const topSubjects = Object.entries(subjectTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sub, mins]) => `${sub} (${(mins / 60).toFixed(1)}h)`);

    return {
      totalSessions: workSessions.length,
      totalMinutes,
      totalHours,
      todayMinutes,
      dailyProgressPct,
      totalMcqs,
      correctMcqs,
      accuracyPct,
      topSubjectsText: topSubjects.length > 0 ? topSubjects.join(', ') : 'All 6 CA Final Papers',
    };
  }, [focusSessions, practiceAttempts, dailyGoalMinutes]);

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://practace.app';

  const shareText = useMemo(() => {
    return [
      `📚 CA Final Study Progress (${attemptLabel}) — via practACE`,
      `⏱️ Today's Focus: ${stats.todayMinutes} / ${dailyGoalMinutes} mins (${stats.dailyProgressPct}% of Daily Target)`,
      `🔥 Cumulative Focus: ${stats.totalHours} hrs across ${stats.totalSessions} Deep Work Sessions`,
      `🎯 Practice Arena: ${stats.totalMcqs} ICAI MCQs Solved (${stats.accuracyPct}% Accuracy)`,
      `📖 Focus Papers: ${stats.topSubjectsText}`,
      `#CAFinal #ICAI #CharteredAccountancy #StudyWithMe #practACE`,
    ].join('\n');
  }, [attemptLabel, dailyGoalMinutes, stats]);

  if (!isOpen) return null;

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialPlatforms = [
    {
      id: 'x',
      label: 'Share on X (Twitter)',
      badge: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      className: 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700',
    },
    {
      id: 'whatsapp',
      label: 'Share on WhatsApp',
      badge: 'WA',
      href: `https://api.whatsapp.com/send?text=${encodedText}`,
      className: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/35',
    },
    {
      id: 'linkedin',
      label: 'Share on LinkedIn',
      badge: 'IN',
      href: `https://www.linkedin.com/feed/?shareActive=true&text=${encodedText}`,
      className: 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/35',
    },
    {
      id: 'telegram',
      label: 'Share on Telegram',
      badge: 'TG',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      className: 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/35',
    },
  ];

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `CA Final Study Progress — ${attemptLabel}`,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User canceled native share sheet
      }
    }
  };

  return (
    <ModalPortal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-[#0d1c2d] border border-cav-border shadow-2xl overflow-hidden text-left"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-cav-border bg-[#051424]">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-amber-500/15 border border-amber-500/35 flex items-center justify-center shrink-0">
                <Share2 className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <h2 className="font-display font-black text-white text-base tracking-tight">
                  Share Study Progress
                </h2>
                <p className="text-[11px] font-mono text-slate-400">
                  {attemptLabel} · Focus Timer & Practice Snapshot
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg bg-cav-card hover:bg-slate-800 border border-cav-border flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              title="Close Share Modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 space-y-4">
            {/* Live Metrics Summary Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-xl bg-[#051424] border border-cav-border">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-amber-400">
                  <Clock className="h-3 w-3 shrink-0" />
                  <span>Today&apos;s Focus</span>
                </div>
                <p className="mt-1 font-display font-black text-white text-base">
                  {stats.todayMinutes}m <span className="text-xs font-mono text-slate-400">/ {dailyGoalMinutes}m</span>
                </p>
                <p className="text-[10px] font-mono text-emerald-400 font-bold">
                  {stats.dailyProgressPct}% of Daily Goal
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#051424] border border-cav-border">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-cyan-400">
                  <Flame className="h-3 w-3 shrink-0" />
                  <span>Total Focus</span>
                </div>
                <p className="mt-1 font-display font-black text-white text-base">
                  {stats.totalHours} hrs
                </p>
                <p className="text-[10px] font-mono text-slate-400 font-bold">
                  {stats.totalSessions} Focus Sessions
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#051424] border border-cav-border">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase text-teal-400">
                  <Target className="h-3 w-3 shrink-0" />
                  <span>MCQ Accuracy</span>
                </div>
                <p className="mt-1 font-display font-black text-white text-base">
                  {stats.accuracyPct}%
                </p>
                <p className="text-[10px] font-mono text-slate-400 font-bold">
                  {stats.totalMcqs} MCQs Solved
                </p>
              </div>
            </div>

            {/* Formatted Social Post Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>Progress Card Preview</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/35 text-[11px] font-mono font-bold transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 shrink-0" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 shrink-0" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3.5 rounded-xl bg-[#051424] border border-cav-border text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed select-all">
                {shareText}
              </pre>
            </div>

            {/* Social Media Platform Share Buttons */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Share Directly to Social Media
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {socialPlatforms.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`h-9 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${platform.className}`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span className="h-5 w-5 rounded-md bg-black/30 border border-white/10 flex items-center justify-center font-mono text-[10px] font-black shrink-0">
                        {platform.badge}
                      </span>
                      <span className="truncate">{platform.label}</span>
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70 shrink-0" />
                  </a>
                ))}
              </div>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full h-9 px-3 rounded-xl bg-cav-accent hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition cursor-pointer mt-2"
                >
                  <Share2 className="h-3.5 w-3.5 shrink-0" />
                  <span>More Sharing Options</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
};

export default ShareStudyProgressModal;
