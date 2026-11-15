/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, BookOpen, Scale, Percent, Target, ChevronRight, CornerDownLeft, Command, Compass, BarChart3, Calendar, ListTodo, Clock, FileText, Youtube, Users, Heart } from 'lucide-react';
import { SUBJECTS_METADATA, CHAPTER_SUMMARIES, STATUTORY_SECTIONS, LIMITS_RATES } from '../data/syllabus';
import { QUIZ_QUESTIONS } from '../data/questions';
import { SubjectId, SUBJECT_COLORS } from '../types';
import { useCALevel, getLevelSubjectIds, getLevelConfig } from '../data/curriculumLevels';
import { ModalPortal } from './ModalPortal';

export type NavigableView = 'home' | 'dashboard' | 'subjects' | 'tasks' | 'revision' | 'pastpapers' | 'practice' | 'wellbeing' | 'profile' | 'peers' | 'pomodora' | 'references';

export interface SearchItem {
  id: string;
  category: 'navigation' | 'syllabus' | 'sections' | 'limits' | 'questions';
  subjectId: SubjectId;
  subjectName: string;
  title: string;
  subtitle?: string;
  content: string;
  extra?: string;
  sectionNumber?: string;
  targetView?: NavigableView;
  targetTab?: 'blueprint' | 'sections' | 'limits';
}

interface UniversalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (params: { 
    view: NavigableView; 
    subjectId: SubjectId | null; 
    activeTab?: 'blueprint' | 'sections' | 'limits';
  }) => void;
}

export default function UniversalSearch({ isOpen, onClose, onNavigate }: UniversalSearchProps) {
  const caLevel = useCALevel();
  const levelConfig = useMemo(() => getLevelConfig(caLevel), [caLevel]);
  const levelSubjectIds = useMemo(() => getLevelSubjectIds(caLevel), [caLevel]);
  const levelSubjectSet = useMemo(() => new Set<SubjectId>(levelSubjectIds), [levelSubjectIds]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'navigation' | 'syllabus' | 'sections' | 'limits' | 'questions'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Compile search index once
  const searchIndex = useMemo(() => {
    const index: SearchItem[] = [];

    // 0. Workspace Navigation & Subject Quick-Jumps
    const navShortcuts: { id: string; title: string; subtitle: string; extra: string; view: NavigableView; subjectId: SubjectId | null; keywords: string }[] = [
      { id: 'nav_dashboard', title: 'Dashboard', subtitle: 'Workspace View (Alt+1)', extra: 'Executive readiness metrics, subject completion radar, and milestone overview', view: 'dashboard', subjectId: null, keywords: 'dashboard analytics overview stats home readiness' },
      { id: 'nav_revision', title: 'Revision Report', subtitle: 'Workspace View (Alt+2)', extra: 'Track R1, R2, R3, and Final Sprint 1.5-Day revision cycles by chapter', view: 'revision', subjectId: null, keywords: 'revision report cycles r1 r2 r3 1.5 day tracker' },
      { id: 'nav_tasks', title: 'Study Planner', subtitle: 'Workspace View (Alt+3)', extra: 'Manage daily study targets, revision schedules, and exam date milestones', view: 'tasks', subjectId: null, keywords: 'planner study planner tasks todo schedule milestones calendar daily targets' },
      { id: 'nav_pomodora', title: 'Focus Timer', subtitle: 'Workspace View (Alt+4)', extra: '24-hour continuous focus timer, break tracker, and daily routine ledger', view: 'pomodora', subjectId: null, keywords: 'grind clock pomodoro timer focus session study stopwatch' },
      { id: 'nav_subjects', title: 'Knowledge Hub', subtitle: 'Workspace View (Alt+5)', extra: 'High-yield ICAI statutory blueprints, sections, rates, and 5-min quick reviews', view: 'subjects', subjectId: null, keywords: 'syllabus knowledge hub concept focus chapters blueprints notes' },
      { id: 'nav_references', title: 'Revision Studio', subtitle: 'Workspace View (Alt+6)', extra: 'Curated revision lectures and marathon video references by paper', view: 'references', subjectId: null, keywords: 'revision studio references youtube videos lectures marathon' },
      { id: 'nav_practice', title: 'Practice Arena', subtitle: 'Workspace View (Alt+7)', extra: 'Timed ICAI case scenarios and chapter-wise conceptual MCQ drills', view: 'practice', subjectId: null, keywords: 'practice arena mcq quiz test questions drill' },
      { id: 'nav_pastpapers', title: 'Question Bank', subtitle: 'Workspace View (Alt+8)', extra: 'Chapter-tagged ICAI question bank, exam attempts, and official suggested answers', view: 'pastpapers', subjectId: null, keywords: 'question bank past papers rtp mtp exam questions suggested answers' },
      { id: 'nav_peers', title: 'Peer Lounge', subtitle: 'Workspace View (Alt+9)', extra: 'Collaborate and compare revision momentum with fellow CA Final aspirants', view: 'peers', subjectId: null, keywords: 'peer lounge peers community friends leaderboard group' },
      { id: 'nav_wellbeing', title: 'Mind Space', subtitle: 'Workspace View', extra: 'Hydration reminders, power nap alarm, and sleep recovery analytics', view: 'wellbeing', subjectId: null, keywords: 'mind space wellbeing sleep nap hydration water rest' },
    ];

    navShortcuts.forEach((nav) => {
      index.push({
        id: nav.id,
        category: 'navigation',
        subjectId: (nav.subjectId || levelSubjectIds[0] || 'FR') as SubjectId,
        subjectName: 'Workspace Navigation',
        title: nav.title,
        subtitle: nav.subtitle,
        content: `${nav.title} ${nav.subtitle} ${nav.extra} ${nav.keywords}`,
        extra: nav.extra,
        targetView: nav.view
      });
    });

    levelSubjectIds.forEach((subId) => {
      const subName = SUBJECTS_METADATA[subId]?.fullName || subId;
      index.push({
        id: `nav_sub_${subId}`,
        category: 'navigation',
        subjectId: subId,
        subjectName: subName,
        title: `${subId} — ${subName} (Knowledge Hub)`,
        subtitle: 'Open Subject Blueprint & Statutory Provisions',
        content: `${subId} ${subName} knowledge hub concept focus syllabus blueprint sections limits`,
        extra: `Jump directly to ${subId} chapter blueprints, statutory sections, and limits`,
        targetView: 'subjects',
        targetTab: 'blueprint'
      });
    });

    // 1. Chapters / Syllabus
    Object.entries(CHAPTER_SUMMARIES).forEach(([subId, chapters]) => {
      const subjectId = subId as SubjectId;
      if (!levelSubjectSet.has(subjectId)) return;
      const subjectName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;
      
      chapters.forEach((ch, idx) => {
        let contentParts = [ch.chapterName];
        if (ch.keyPrinciples) {
          ch.keyPrinciples.forEach(kp => {
            contentParts.push(kp.title, kp.description);
            if (kp.exception) contentParts.push(kp.exception);
            if (kp.example) contentParts.push(kp.example);
          });
        }
        
        index.push({
          id: `chap_${subjectId}_${idx}`,
          category: 'syllabus',
          subjectId,
          subjectName,
          title: ch.chapterName,
          subtitle: `Chapter Blueprint`,
          content: contentParts.join(' '),
          extra: ch.keyPrinciples ? ch.keyPrinciples.slice(0, 3).map(k => k.title).join(' • ') : undefined
        });
      });
    });

    // 2. Statutory Sections & Subsections
    Object.entries(STATUTORY_SECTIONS).forEach(([subId, sections]) => {
      const subjectId = subId as SubjectId;
      if (!levelSubjectSet.has(subjectId)) return;
      const subjectName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;

      sections.forEach((sec, idx) => {
        let contentParts = [sec.number, sec.heading, sec.purpose];
        if (sec.subsections) {
          sec.subsections.forEach(sub => {
            contentParts.push(sub.number, sub.heading, sub.purpose);
          });
        }

        index.push({
          id: `sec_${subjectId}_${idx}`,
          category: 'sections',
          subjectId,
          subjectName,
          title: `${sec.number}: ${sec.heading}`,
          subtitle: `Statutory Code`,
          content: contentParts.join(' '),
          extra: sec.purpose,
          sectionNumber: sec.number
        });
      });
    });

    // 3. Limits & Rates
    Object.entries(LIMITS_RATES).forEach(([subId, rates]) => {
      const subjectId = subId as SubjectId;
      if (!levelSubjectSet.has(subjectId)) return;
      const subjectName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;

      rates.forEach((rate, idx) => {
        let contentParts = [rate.item, rate.limitRate, rate.remarks];
        index.push({
          id: `rate_${subjectId}_${idx}`,
          category: 'limits',
          subjectId,
          subjectName,
          title: rate.item,
          subtitle: `Rate & Limit Context: ${rate.limitRate}`,
          content: contentParts.join(' '),
          extra: rate.remarks
        });
      });
    });

    // 4. MCQ Practice Questions
    Object.entries(QUIZ_QUESTIONS).forEach(([subId, questions]) => {
      const subjectId = subId as SubjectId;
      if (!levelSubjectSet.has(subjectId)) return;
      const subjectName = SUBJECTS_METADATA[subjectId]?.fullName || subjectId;

      questions.forEach((q, idx) => {
        let contentParts: string[] = [];
        let titleText = '';
        if (q.type === 'general') {
          const gen = q.data;
          contentParts = [gen.questionText, ...gen.options, gen.explanation];
          titleText = gen.questionText;

          index.push({
            id: `q_${subjectId}_${idx}`,
            category: 'questions',
            subjectId,
            subjectName,
            title: titleText.length > 100 ? titleText.slice(0, 100) + '...' : titleText,
            subtitle: `Quiz Practice MCQ`,
            content: contentParts.join(' '),
            extra: `Choices: ${gen.options.slice(0, 3).join(' | ')}`
          });
        } else if (q.type === 'case') {
          const cs = q.data;
          contentParts = [
            cs.scenarioTitle,
            cs.scenarioText,
            ...cs.subQuestions.flatMap(sq => [sq.questionText, ...sq.options, sq.explanation])
          ];
          titleText = `Case Scenario: ${cs.scenarioTitle}`;

          index.push({
            id: `q_${subjectId}_${idx}`,
            category: 'questions',
            subjectId,
            subjectName,
            title: titleText.length > 100 ? titleText.slice(0, 100) + '...' : titleText,
            subtitle: `Case Scenario Questions`,
            content: contentParts.join(' '),
            extra: cs.scenarioText.slice(0, 120) + '...'
          });
        }
      });
    });

    return index;
  }, [levelSubjectIds, levelSubjectSet]);

  // Filter & Rank search results
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) {
      if (activeCategory === 'navigation') {
        return searchIndex.filter(item => item.category === 'navigation');
      }
      return [];
    }

    const queryTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    
    const results = searchIndex.filter(item => {
      // 1. Category Filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // 2. Term Matching
      const titleLower = item.title.toLowerCase();
      const contentLower = item.content.toLowerCase();
      const subNameLower = item.subjectName.toLowerCase();
      const extraLower = (item.extra || '').toLowerCase();
      const secNumLower = (item.sectionNumber || '').toLowerCase();

      // All search terms must match somewhere in the item fields
      return queryTerms.every(term => {
        return (
          titleLower.includes(term) ||
          contentLower.includes(term) ||
          subNameLower.includes(term) ||
          extraLower.includes(term) ||
          secNumLower.includes(term) ||
          item.subjectId.toLowerCase().includes(term)
        );
      });
    });

    // Rank results simple scoring (higher if matches in title or section number)
    return results.slice(0, 30); // Max 30 results
  }, [searchIndex, searchQuery, activeCategory]);

  // Handle Autocomplete selection
  const handleItemSelect = (item: SearchItem) => {
    if (item.category === 'navigation' && item.targetView) {
      onNavigate({
        view: item.targetView,
        subjectId: item.id.startsWith('nav_sub_') ? item.subjectId : null,
        activeTab: item.targetTab
      });
    } else if (item.category === 'syllabus') {
      onNavigate({ 
        view: 'subjects', 
        subjectId: item.subjectId, 
        activeTab: 'blueprint' 
      });
    } else if (item.category === 'sections') {
      onNavigate({ 
        view: 'subjects', 
        subjectId: item.subjectId, 
        activeTab: 'sections' 
      });
    } else if (item.category === 'limits') {
      onNavigate({ 
        view: 'subjects', 
        subjectId: item.subjectId, 
        activeTab: 'limits' 
      });
    } else if (item.category === 'questions') {
      onNavigate({ 
        view: 'practice', 
        subjectId: item.subjectId 
      });
    }
    onClose();
  };

  // Keyboard navigation & Shortcuts listener
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = 'hidden';
      setSelectedIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(filteredResults.length - 1, prev + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          handleItemSelect(filteredResults[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  // Keep selected result visible on scroll
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        const parent = resultsContainerRef.current;
        const activeTop = activeEl.offsetTop;
        const activeBottom = activeTop + activeEl.clientHeight;
        const parentScrollTop = parent.scrollTop;
        const parentHeight = parent.clientHeight;

        if (activeBottom > parentScrollTop + parentHeight) {
          parent.scrollTop = activeBottom - parentHeight;
        } else if (activeTop < parentScrollTop) {
          parent.scrollTop = activeTop;
        }
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[8vh] px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity cursor-pointer animate-fadeIn"
        onClick={onClose}
      />

      {/* Search Dialogue card */}
      <div className="relative w-full max-w-2xl bg-[#0c0f1c] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden animate-slideUp z-10">
        
        {/* Input box */}
        <div className="relative flex items-center border-b border-slate-800 p-4 shrink-0">
          <Search className="h-5 w-5 text-cav-accent absolute left-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent pl-8 pr-16 text-sm text-slate-100 placeholder-slate-500 outline-none font-sans font-medium"
            placeholder="Search sections, rates, chapters, or jump to any tool (e.g. 'Sec 43B', 'RCM', 'Planner')..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-14 p-1.5 hover:bg-slate-900/60 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[9px] font-bold font-mono tracking-widest text-slate-400 hover:text-white absolute right-4 transition cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex border-b border-slate-850 px-3 py-2 gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Fields' },
            { id: 'navigation', label: 'Quick Jump', icon: Compass },
            { id: 'syllabus', label: 'Syllabus Chapters', icon: BookOpen },
            { id: 'sections', label: 'Statutory Sections', icon: Scale },
            { id: 'limits', label: 'Rates & Limits', icon: Percent },
            { id: 'questions', label: 'Practice MCQs', icon: Target }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as any);
                  setSelectedIndex(0);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold uppercase tracking-wider whitespace-nowrap transition cursor-pointer select-none ${
                  isActive 
                    ? 'bg-cav-accent/15 text-cav-accent border border-cav-accent/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border border-transparent'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Stream */}
        <div 
          ref={resultsContainerRef}
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800 select-none"
        >
          {!searchQuery.trim() && activeCategory !== 'navigation' ? (
            <div className="py-4 px-3 space-y-5">
              {/* 1-Click Subject Launchers */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
                    1-Click Subject Blueprints ({levelConfig.shortName})
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-500">
                    Knowledge Hub
                  </span>
                </div>
                <div className={`grid grid-cols-2 ${levelSubjectIds.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-6'} gap-2`}>
                  {levelSubjectIds.map((subId) => {
                    const subStyle = SUBJECT_COLORS[subId];
                    const paperMeta = levelConfig.subjects.find(s => s.id === subId);
                    return (
                      <button
                        key={subId}
                        type="button"
                        onClick={() => {
                          onNavigate({ view: 'subjects', subjectId: subId, activeTab: 'blueprint' });
                          onClose();
                        }}
                        className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border ${subStyle.bg} ${subStyle.border} hover:border-cav-accent/50 transition-all cursor-pointer group`}
                      >
                        <span className={`font-mono text-xs font-black ${subStyle.text} group-hover:scale-105 transition-transform`}>
                          {subId}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold mt-0.5 truncate max-w-full">
                          {paperMeta?.paperCode || SUBJECTS_METADATA[subId]?.name || subId}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 1-Click Workspace Quick Navigation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
                    Workspace Quick Jump
                  </span>
                  <span className="text-[9.5px] font-mono text-slate-500">
                    Keyboard Shortcuts
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { view: 'dashboard' as NavigableView, label: 'Dashboard', shortcut: 'Alt+1', icon: BarChart3, color: 'text-sky-400' },
                    { view: 'revision' as NavigableView, label: 'Revision Report', shortcut: 'Alt+2', icon: Calendar, color: 'text-cyan-400' },
                    { view: 'tasks' as NavigableView, label: 'Study Planner', shortcut: 'Alt+3', icon: ListTodo, color: 'text-emerald-400' },
                    { view: 'pomodora' as NavigableView, label: 'Focus Timer', shortcut: 'Alt+4', icon: Clock, color: 'text-amber-400' },
                    { view: 'practice' as NavigableView, label: 'Practice Arena', shortcut: 'Alt+7', icon: Target, color: 'text-teal-400' },
                    { view: 'pastpapers' as NavigableView, label: 'Question Bank', shortcut: 'Alt+8', icon: FileText, color: 'text-pink-400' },
                    { view: 'references' as NavigableView, label: 'Revision Studio', shortcut: 'Alt+6', icon: Youtube, color: 'text-red-400' },
                    { view: 'wellbeing' as NavigableView, label: 'Mind Space', shortcut: 'Rest', icon: Heart, color: 'text-rose-400' }
                  ].map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.view}
                        type="button"
                        onClick={() => {
                          onNavigate({ view: item.view, subjectId: null });
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800/90 hover:border-slate-700 text-left transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ItemIcon className={`h-3.5 w-3.5 ${item.color} shrink-0`} />
                          <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate">
                            {item.label}
                          </span>
                        </div>
                        <kbd className="text-[8.5px] font-mono font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 shrink-0 ml-1">
                          {item.shortcut}
                        </kbd>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* High-Yield Statutory & Rate Lookups */}
              <div className="space-y-2 pt-1 border-t border-slate-800/80">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400 block px-1">
                  Frequent Statutory &amp; Rate Lookups
                </span>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {[
                    { q: 'Section 43B', label: 'Sec 43B MSME & Deductions' },
                    { q: 'Section 44AD', label: 'Presumptive Tax (44AD)' },
                    { q: 'Reverse Charge', label: 'GST Reverse Charge (RCM)' },
                    { q: 'Section 115BAC', label: 'Sec 115BAC Slab Rates' },
                    { q: 'Ind AS 115', label: 'Ind AS 115 Revenue' },
                    { q: 'Rule 86B', label: 'Rule 86B 1% Cash Ledger' },
                    { q: 'SA 701', label: 'SA 701 Key Audit Matters' },
                    { q: 'Section 194Q', label: 'TDS on Goods (194Q)' }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSearchQuery(item.q)}
                      className="px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#7bd0ff] bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-[#7bd0ff]/40 rounded-lg transition cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <p className="text-xs font-bold text-slate-400">No matching results found</p>
              <p className="text-[10px] text-slate-500">
                No matching concept summary, statutory section, threshold rate, or quiz found for <span className="text-amber-400 font-mono">"{searchQuery}"</span>
              </p>
            </div>
          ) : (
            filteredResults.map((item, index) => {
              const isSelected = selectedIndex === index;
              const subStyle = SUBJECT_COLORS[item.subjectId] || { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' };

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900/75 border-slate-700 shadow-lg'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  {/* Visual Icons */}
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${
                    item.category === 'navigation' ? 'bg-cav-accent/15 text-cav-accent border-cav-accent/25' :
                    item.category === 'syllabus' ? 'bg-amber-500/10 text-amber-500 border-amber-500/15' :
                    item.category === 'sections' ? 'bg-blue-500/10 text-blue-500 border-blue-500/15' :
                    item.category === 'limits' ? 'bg-pink-500/10 text-pink-500 border-pink-500/15' :
                    'bg-emerald-500/10 text-emerald-500 border-emerald-500/15'
                  }`}>
                    {item.category === 'navigation' && <Compass className="h-4 w-4" />}
                    {item.category === 'syllabus' && <BookOpen className="h-4 w-4" />}
                    {item.category === 'sections' && <Scale className="h-4 w-4" />}
                    {item.category === 'limits' && <Percent className="h-4 w-4" />}
                    {item.category === 'questions' && <Target className="h-4 w-4" />}
                  </div>

                  {/* Context Content block */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Subject Name pill */}
                      {item.category === 'navigation' && !item.id.startsWith('nav_sub_') ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wide border bg-cav-accent/15 text-cav-accent border-cav-accent/30">
                          JUMP
                        </span>
                      ) : (
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wide border ${subStyle.bg} ${subStyle.text} ${subStyle.border}`}>
                          {item.subjectId}
                        </span>
                      )}
                      {/* Subtitle */}
                      <span className="text-[10px] text-slate-500 truncate">
                        {item.subtitle}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-xs font-bold text-slate-200 line-clamp-1">
                      {item.title}
                    </h4>

                    {/* Content preview snippet block */}
                    {item.extra && (
                      <p className="text-[10px] text-slate-400 line-clamp-1 font-semibold leading-relaxed">
                        {item.extra}
                      </p>
                    )}
                  </div>

                  {/* Navigation indicator */}
                  <div className="shrink-0 flex items-center self-center pl-2">
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-cav-accent whitespace-nowrap bg-cav-accent/10 border border-cav-accent/15 px-1.5 py-0.5 rounded">
                        <span>GO</span>
                        <CornerDownLeft className="h-2.5 w-2.5" />
                      </span>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info/commands indicator */}
        <div className="p-3 border-t border-slate-850 bg-slate-950 flex items-center justify-between text-[9.5px] text-slate-500 shrink-0 font-mono tracking-wide">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-slate-400">↑↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-slate-400">Enter</kbd>
              <span>Open</span>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-bold text-slate-400">⌘K / Ctrl+K</kbd>
              <span>Toggle anywhere</span>
            </span>
          </div>
          <span className="flex items-center gap-1 text-slate-400">
            <Command className="h-3 w-3 text-cav-accent" />
            <span>practACE Command &amp; Lookup</span>
          </span>
        </div>

      </div>
    </div>
    </ModalPortal>
  );
}
