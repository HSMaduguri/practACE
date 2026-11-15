/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrainCircuit, Youtube, Target, FileText, ArrowUpRight } from 'lucide-react';
import { SubjectId } from '../types';

export type StudyVaultTabId = 'subjects' | 'references' | 'practice' | 'pastpapers';

interface StudyVaultInterconnectBarProps {
  currentTab: StudyVaultTabId;
  subjectId: SubjectId;
  onNavigate: (targetTab: StudyVaultTabId, subjectId: SubjectId) => void;
  compact?: boolean;
}

const STUDY_VAULT_OPTIONS: {
  id: StudyVaultTabId;
  label: string;
  icon: React.FC<{ className?: string }>;
  btnClass: string;
  iconClass: string;
  badgeClass: string;
}[] = [
  {
    id: 'subjects',
    label: 'Knowledge Hub',
    icon: BrainCircuit,
    btnClass: 'bg-violet-500/15 hover:bg-violet-500/25 border-violet-500/35 hover:border-violet-400/60 text-violet-200',
    iconClass: 'text-violet-400',
    badgeClass: 'bg-violet-950/80 text-violet-300 border-violet-500/30',
  },
  {
    id: 'references',
    label: 'Revision Studio',
    icon: Youtube,
    btnClass: 'bg-red-500/15 hover:bg-red-500/25 border-red-500/35 hover:border-red-400/60 text-red-200',
    iconClass: 'text-red-400',
    badgeClass: 'bg-red-950/80 text-red-300 border-red-500/30',
  },
  {
    id: 'practice',
    label: 'Practice Arena',
    icon: Target,
    btnClass: 'bg-teal-500/15 hover:bg-teal-500/25 border-teal-500/35 hover:border-teal-400/60 text-teal-200',
    iconClass: 'text-teal-400',
    badgeClass: 'bg-teal-950/80 text-teal-300 border-teal-500/30',
  },
  {
    id: 'pastpapers',
    label: 'Question Bank',
    icon: FileText,
    btnClass: 'bg-pink-500/15 hover:bg-pink-500/25 border-pink-500/35 hover:border-pink-400/60 text-pink-200',
    iconClass: 'text-pink-400',
    badgeClass: 'bg-pink-950/80 text-pink-300 border-pink-500/30',
  },
];

export const StudyVaultInterconnectBar: React.FC<StudyVaultInterconnectBarProps> = ({
  currentTab,
  subjectId,
  onNavigate,
  compact = false,
}) => {
  const otherOptions = STUDY_VAULT_OPTIONS.filter((opt) => opt.id !== currentTab);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto min-w-0">
        {otherOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onNavigate(opt.id, subjectId)}
              title={`Switch to ${opt.label} (${subjectId})`}
              className={`flex-1 sm:flex-initial min-h-[38px] sm:min-h-0 sm:h-7 px-2.5 rounded-lg border text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-w-[125px] sm:min-w-0 ${opt.btnClass}`}
            >
              <Icon className={`h-3 w-3 shrink-0 ${opt.iconClass}`} />
              <span className="truncate">{opt.label}</span>
              <span className={`px-1 py-0.2 rounded text-[9.5px] font-mono font-extrabold border shrink-0 ${opt.badgeClass}`}>
                {subjectId}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto min-w-0">
      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mr-0.5 hidden xl:inline">
        Switch {subjectId} Library:
      </span>
      {otherOptions.map((opt) => {
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onNavigate(opt.id, subjectId)}
            title={`Open ${subjectId} in ${opt.label}`}
            className={`flex-1 sm:flex-initial min-h-[40px] sm:min-h-0 sm:h-8 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 min-w-[140px] sm:min-w-0 shadow-2xs ${opt.btnClass}`}
          >
            <Icon className={`h-3.5 w-3.5 shrink-0 ${opt.iconClass}`} />
            <span className="truncate">{opt.label}</span>
            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black border shrink-0 ${opt.badgeClass}`}>
              {subjectId}
            </span>
            <ArrowUpRight className="h-3 w-3 opacity-70 shrink-0" />
          </button>
        );
      })}
    </div>
  );
};

export default StudyVaultInterconnectBar;
