/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * STANDARDS ON AUDITING (SAs) & ENGAGEMENT STANDARDS MASTER INDEX
 * Grounded strictly in official ICAI Auditing syllabus (CA Intermediate & CA Final).
 * Provides a clean, properly indexed, and impeccably aligned statutory list.
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Copy, 
  Check, 
  Printer, 
  ListOrdered, 
  Layers, 
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';
import { STANDARDS_ON_AUDITING, StandardOnAuditing } from '../data/audit/standardsData';
import { exportToPdfEngine } from '../utils/pdfExporter';
import { CA_CURRICULUM_LEVELS, useCALevel } from '../data/curriculumLevels';

interface StandardsOnAuditingViewProps {
  onExportPDF?: () => void;
}

interface SeriesGroupMeta {
  id: string;
  name: string;
  codeRange: string;
  description: string;
  color: string;
}

const SERIES_GROUPS: Record<string, SeriesGroupMeta> = {
  'SQC': {
    id: 'SQC',
    name: 'Standards on Quality Control',
    codeRange: 'SQC 1',
    description: 'Firm-wide quality control systems governing all audits, reviews, assurance & related services',
    color: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  },
  '200 Series': {
    id: '200 Series',
    name: 'General Principles & Auditor Responsibilities',
    codeRange: 'SA 200 – 299',
    description: 'Overarching objectives, terms of engagement, quality control, documentation, fraud & joint audits',
    color: 'border-blue-500/30 text-blue-400 bg-blue-500/10'
  },
  '300 Series': {
    id: '300 Series',
    name: 'Risk Assessment & Audit Planning',
    codeRange: 'SA 300 – 330',
    description: 'Audit strategy, planning, risk assessment (SA 315), materiality (SA 320) & response to assessed risks',
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  },
  '400 Series': {
    id: '400 Series',
    name: 'Internal Control & Service Organisations',
    codeRange: 'SA 402 – 450',
    description: 'Service organisation controls and evaluation of identified misstatements',
    color: 'border-teal-500/30 text-teal-400 bg-teal-500/10'
  },
  '500 Series': {
    id: '500 Series',
    name: 'Audit Evidence',
    codeRange: 'SA 500 – 580',
    description: 'Evidence gathering, external confirmations, sampling, estimates, related parties, going concern & representations',
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  '600 Series': {
    id: '600 Series',
    name: 'Using the Work of Others',
    codeRange: 'SA 600 – 620',
    description: 'Coordination with branch/joint auditors, internal auditors, and appointed auditor experts',
    color: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10'
  },
  '700 Series': {
    id: '700 Series',
    name: 'Audit Conclusions & Reporting',
    codeRange: 'SA 700 – 720',
    description: 'Opinion formulation, Key Audit Matters (KAM 701), modified opinions, EoM/OM paragraphs & other information',
    color: 'border-purple-500/30 text-purple-400 bg-purple-500/10'
  },
  '800 Series': {
    id: '800 Series',
    name: 'Specialised Areas',
    codeRange: 'SA 800 – 810',
    description: 'Special purpose frameworks, single financial statement audits, and summary financial statements',
    color: 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10'
  },
  'SRE Series': {
    id: 'SRE Series',
    name: 'Standards on Review Engagements',
    codeRange: 'SRE 2400 – 2410',
    description: 'Limited assurance reviews of historical and interim financial information (e.g. SEBI Reg 33)',
    color: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  },
  'SAE Series': {
    id: 'SAE Series',
    name: 'Standards on Assurance Engagements',
    codeRange: 'SAE 3400 – 3420',
    description: 'Prospective financial information, service organisation reports, and pro forma prospectus information',
    color: 'border-orange-500/30 text-orange-400 bg-orange-500/10'
  },
  'SRS Series': {
    id: 'SRS Series',
    name: 'Standards on Related Services',
    codeRange: 'SRS 4400 – 4410',
    description: 'Non-assurance engagements: agreed-upon procedures and financial compilation engagements',
    color: 'border-amber-600/30 text-amber-500 bg-amber-600/10'
  }
};

const INTERMEDIATE_APPLICABLE_SA_CODES = new Set([
  'SQC 1',
  'SA 200', 'SA 210', 'SA 220', 'SA 230', 'SA 240', 'SA 250', 'SA 260', 'SA 265', 'SA 299',
  'SA 300', 'SA 315', 'SA 320', 'SA 330',
  'SA 450',
  'SA 500', 'SA 501', 'SA 505', 'SA 510', 'SA 520', 'SA 530', 'SA 550', 'SA 560', 'SA 570', 'SA 580',
  'SA 610',
  'SA 700', 'SA 701', 'SA 705', 'SA 706', 'SA 710',
]);

export default function StandardsOnAuditingView({ onExportPDF }: StandardsOnAuditingViewProps) {
  const caLevel = useCALevel();
  const levelLabel = CA_CURRICULUM_LEVELS[caLevel]?.shortName || 'CA Final';
  const auditPaperLabel = caLevel === 'intermediate' ? 'PAPER 5: AUDITING AND ETHICS' : 'ADVANCED AUDITING, ASSURANCE & PROFESSIONAL ETHICS';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const activeStandardsPool = useMemo(() => {
    if (caLevel === 'intermediate') {
      return STANDARDS_ON_AUDITING.filter(s => INTERMEDIATE_APPLICABLE_SA_CODES.has(s.code));
    }
    return STANDARDS_ON_AUDITING;
  }, [caLevel]);

  // Quick filter options
  const filterPills = useMemo(() => {
    const basePills = [
      { id: 'All', label: 'All Standards', count: activeStandardsPool.length },
      { id: 'SQC', label: 'SQC', count: activeStandardsPool.filter(s => s.series === 'SQC').length },
      { id: '200 Series', label: '200 Series', count: activeStandardsPool.filter(s => s.series === '200 Series').length },
      { id: '300 Series', label: '300 Series', count: activeStandardsPool.filter(s => s.series === '300 Series').length },
      { id: '400 Series', label: '400 Series', count: activeStandardsPool.filter(s => s.series === '400 Series').length },
      { id: '500 Series', label: '500 Series', count: activeStandardsPool.filter(s => s.series === '500 Series').length },
      { id: '600 Series', label: '600 Series', count: activeStandardsPool.filter(s => s.series === '600 Series').length },
      { id: '700 Series', label: '700 Series', count: activeStandardsPool.filter(s => s.series === '700 Series').length },
      { id: '800 Series', label: '800 Series', count: activeStandardsPool.filter(s => s.series === '800 Series').length },
      { id: 'SRE Series', label: 'SREs', count: activeStandardsPool.filter(s => s.series === 'SRE Series').length },
      { id: 'SAE Series', label: 'SAEs', count: activeStandardsPool.filter(s => s.series === 'SAE Series').length },
      { id: 'SRS Series', label: 'SRSs', count: activeStandardsPool.filter(s => s.series === 'SRS Series').length },
    ];
    return basePills.filter(p => p.id === 'All' || p.count > 0);
  }, [activeStandardsPool]);

  // Filtered standards with continuous serial numbering
  const filteredStandards = useMemo(() => {
    return activeStandardsPool.filter(std => {
      const matchSeries = selectedSeries === 'All' || std.series === selectedSeries;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query || 
        std.code.toLowerCase().includes(query) ||
        std.title.toLowerCase().includes(query) ||
        std.scope.toLowerCase().includes(query) ||
        std.category.toLowerCase().includes(query);
      return matchSeries && matchQuery;
    });
  }, [activeStandardsPool, selectedSeries, searchQuery]);

  // Grouped by series
  const groupedStandards = useMemo(() => {
    const groups: { series: string; meta: SeriesGroupMeta; items: { index: number; standard: StandardOnAuditing }[] }[] = [];
    
    // Track overall index (1-based) across all standards in active pool
    const indexedAll = activeStandardsPool.map((std, idx) => ({ index: idx + 1, standard: std }));
    
    Object.keys(SERIES_GROUPS).forEach(seriesKey => {
      if (selectedSeries !== 'All' && selectedSeries !== seriesKey) return;
      
      const groupItems = indexedAll.filter(item => {
        if (item.standard.series !== seriesKey) return false;
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase().trim();
        return item.standard.code.toLowerCase().includes(q) ||
               item.standard.title.toLowerCase().includes(q) ||
               item.standard.scope.toLowerCase().includes(q) ||
               item.standard.category.toLowerCase().includes(q);
      });

      if (groupItems.length > 0) {
        groups.push({
          series: seriesKey,
          meta: SERIES_GROUPS[seriesKey],
          items: groupItems
        });
      }
    });

    return groups;
  }, [activeStandardsPool, selectedSeries, searchQuery]);

  const handleCopy = (code: string, title: string) => {
    navigator.clipboard.writeText(`${code}: ${title}`);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const buildStandardsPdfHtml = (): string => {
    let tableRows = '';
    let globalIdx = 1;

    Object.keys(SERIES_GROUPS).forEach(seriesKey => {
      const meta = SERIES_GROUPS[seriesKey];
      const items = activeStandardsPool.filter(s => s.series === seriesKey);
      if (items.length === 0) return;

      // Series group header row
      tableRows += `
        <tr style="background-color: #f1f5f9; border-top: 2.5px solid #1e3a8a; border-bottom: 1.5px solid #94a3b8; page-break-after: avoid; break-after: avoid;">
          <td colspan="5" style="padding: 9px 12px; background-color: #f1f5f9 !important; border: 1px solid #cbd5e1; color: #0f172a !important;">
            <div style="display: flex; align-items: baseline; justify-content: space-between;">
              <div>
                <span style="display: inline-block; background-color: #dbeafe !important; color: #1e3a8a !important; border: 1px solid #93c5fd; font-family: 'JetBrains Mono', monospace; font-size: 8pt; font-weight: 800; padding: 2px 7px; border-radius: 4px; margin-right: 8px;">
                  ${meta.codeRange}
                </span>
                <span style="font-weight: 800; font-size: 10pt; color: #0f172a !important; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${meta.name}
                </span>
              </div>
              <span style="font-family: 'JetBrains Mono', monospace; font-size: 8pt; font-weight: 700; color: #475569 !important;">
                ${items.length} ${items.length === 1 ? 'Standard' : 'Standards'}
              </span>
            </div>
            <div style="font-size: 8pt; font-weight: 500; color: #334155 !important; margin-top: 3px; line-height: 1.35;">
              ${meta.description}
            </div>
          </td>
        </tr>
      `;

      items.forEach((std) => {
        const isEven = globalIdx % 2 === 0;
        const rowBg = isEven ? '#f8fafc' : '#ffffff';
        tableRows += `
          <tr style="background-color: ${rowBg} !important; border-bottom: 1px solid #cbd5e1; page-break-inside: avoid; break-inside: avoid;">
            <td style="padding: 7px 8px; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; font-weight: 700; color: #475569 !important; text-align: center; width: 34px; border: 1px solid #cbd5e1; background-color: ${rowBg} !important;">
              ${globalIdx}
            </td>
            <td style="padding: 7px 10px; font-family: 'JetBrains Mono', monospace; font-size: 9pt; font-weight: 800; color: #1e3a8a !important; white-space: nowrap; width: 85px; border: 1px solid #cbd5e1; background-color: ${rowBg} !important;">
              ${std.code}
            </td>
            <td style="padding: 7px 10px; font-size: 9pt; font-weight: 700; color: #0f172a !important; line-height: 1.35; width: 28%; border: 1px solid #cbd5e1; background-color: ${rowBg} !important;">
              ${std.title}
              <div style="font-size: 7.5pt; color: #64748b !important; font-family: 'JetBrains Mono', monospace; margin-top: 3px; font-weight: 600;">
                Domain: ${std.category}
              </div>
            </td>
            <td style="padding: 7px 10px; font-size: 8.5pt; color: #1e293b !important; line-height: 1.4; width: 34%; border: 1px solid #cbd5e1; background-color: ${rowBg} !important;">
              ${std.scope}
            </td>
            <td style="padding: 7px 10px; font-size: 8pt; color: #0f172a !important; line-height: 1.35; width: 28%; border: 1px solid #cbd5e1; background-color: ${isEven ? '#f1f5f9' : '#fafafa'} !important;">
              <div style="font-weight: 800; color: #b45309 !important; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.3px; margin-bottom: 2px;">
                ICAI Exam Focus:
              </div>
              <div style="color: #1e293b !important;">
                ${std.examFocus || 'Statutory auditing requirements and audit evidence documentation procedures.'}
              </div>
            </td>
          </tr>
        `;
        globalIdx++;
      });
    });

    return `
      <div style="font-family: 'Inter', -apple-system, sans-serif; color: #0f172a !important; background-color: #ffffff !important; padding: 4px;">
        <!-- Header Banner -->
        <div style="border-bottom: 3px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 14px; background-color: #ffffff !important;">
          <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px;">
            <div style="flex: 1;">
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; font-weight: 800; color: #1e3a8a !important; text-transform: uppercase; letter-spacing: 0.8px;">
                ICAI ${levelLabel.toUpperCase()} • ${auditPaperLabel}
              </div>
              <h1 style="font-size: 16pt; font-weight: 900; color: #0f172a !important; margin: 4px 0 4px 0; letter-spacing: -0.4px; line-height: 1.25;">
                Standards on Auditing (SAs) & Engagement Standards — Statutory Master Index
              </h1>
              <div style="font-size: 8.5pt; color: #1e293b !important; line-height: 1.4;">
                Complete statutory compendium of all ${activeStandardsPool.length} engagement standards applicable for ${levelLabel} formulated by the Auditing and Assurance Standards Board (AASB) of ICAI.
              </div>
            </div>
            <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 8pt; color: #0f172a !important; border: 1.5px solid #94a3b8; border-radius: 4px; padding: 6px 12px; background-color: #f1f5f9 !important; min-width: 140px; shrink-0;">
              <div style="font-weight: 900; color: #1e3a8a !important; font-size: 10pt;">${activeStandardsPool.length} STANDARDS</div>
              <div style="font-size: 7.5pt; color: #334155 !important; margin-top: 1px; font-weight: 700;">${caLevel === 'intermediate' ? 'SQC 1 • SA 200–710' : 'SQC • SA • SRE • SAE • SRS'}</div>
            </div>
          </div>
        </div>

        <!-- Master Index Table -->
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 8.5pt; margin-top: 6px; background-color: #ffffff !important; color: #0f172a !important; border: 1.5px solid #94a3b8;">
          <thead>
            <tr style="background-color: #e2e8f0 !important; color: #0f172a !important; font-family: 'JetBrains Mono', monospace; font-size: 8.5pt; text-transform: uppercase; letter-spacing: 0.5px;">
              <th style="padding: 8px 6px; text-align: center; width: 34px; border: 1.5px solid #94a3b8; color: #0f172a !important; font-weight: 800; background-color: #e2e8f0 !important;">#</th>
              <th style="padding: 8px 10px; width: 85px; border: 1.5px solid #94a3b8; color: #0f172a !important; font-weight: 800; background-color: #e2e8f0 !important;">Code</th>
              <th style="padding: 8px 10px; width: 28%; border: 1.5px solid #94a3b8; color: #0f172a !important; font-weight: 800; background-color: #e2e8f0 !important;">Standard Title & Domain</th>
              <th style="padding: 8px 10px; width: 34%; border: 1.5px solid #94a3b8; color: #0f172a !important; font-weight: 800; background-color: #e2e8f0 !important;">Core Regulatory Scope & Applicability</th>
              <th style="padding: 8px 10px; width: 28%; border: 1.5px solid #94a3b8; color: #0f172a !important; font-weight: 800; background-color: #e2e8f0 !important;">ICAI Exam Focus & Key Takeaways</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <!-- Footer Note -->
        <div style="margin-top: 18px; padding-top: 8px; border-top: 1.5px solid #94a3b8; font-size: 8pt; color: #334155 !important; display: flex; justify-content: space-between; align-items: center; font-family: 'JetBrains Mono', monospace; font-weight: 600;">
          <div style="color: #0f172a !important;">practACE • Advanced Auditing Concept Blueprint</div>
          <div style="color: #1e3a8a !important; font-weight: 700;">Official ICAI AASB Engagement Standards Architecture (46 Standards)</div>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    if (onExportPDF) {
      onExportPDF();
      return;
    }
    const pdfHtml = buildStandardsPdfHtml();
    const prefix = caLevel === 'intermediate' ? 'AuditInter' : 'Audit';
    exportToPdfEngine(`${prefix}_${levelLabel.replace(/\s+/g, '_')}_Standards_Master_Index`, pdfHtml);
  };

  return (
    <div id="standards-on-auditing-container" className="space-y-6 text-left text-slate-100">
      
      {/* Header Banner - Compact & Professional */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-amber-500/20 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400"></span>
            <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-400">
              ICAI Engagement Standards Architecture
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-black text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-400 shrink-0" />
            Standards on Auditing (SAs) — Master Index
          </h2>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handlePrint}
            id="export-standards-pdf-btn"
            title="Print or save as PDF"
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer uppercase tracking-wider active:scale-98"
          >
            <Printer className="h-4 w-4" />
            <span>Print / PDF Index</span>
          </button>
        </div>
      </div>

      {/* Search & Layout Control Toolbar */}
      <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        
        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            id="standards-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search standard by number (e.g. 500, 701) or title..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950/80 border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs cursor-pointer font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Layout Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-slate-400">Layout:</span>
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewMode('grouped')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>By Series</span>
            </button>
            <button
              onClick={() => setViewMode('flat')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'flat'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" />
              <span>Continuous (1–{activeStandardsPool.length})</span>
            </button>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-800 text-amber-300 rounded-lg border border-slate-700">
            {filteredStandards.length} Standards
          </span>
        </div>
      </div>

      {/* Series Filter Pills Bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        {filterPills.map(pill => (
          <button
            key={pill.id}
            onClick={() => setSelectedSeries(pill.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedSeries === pill.id
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <span>{pill.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              selectedSeries === pill.id ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {pill.count}
            </span>
          </button>
        ))}
      </div>

      {/* Master Index Container */}
      <div id="standards-printable-area" className="space-y-8 bg-slate-950 p-4 md:p-6 rounded-2xl border border-slate-800/80 shadow-inner">
        
        {viewMode === 'grouped' ? (
          /* ========================================================================= */
          /* GROUPED BY SERIES VIEW */
          /* ========================================================================= */
          <div className="space-y-8">
            {groupedStandards.map(group => (
              <div 
                key={group.series} 
                className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xs"
              >
                {/* Series Section Header */}
                <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${group.meta.color}`}>
                      {group.meta.codeRange}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {group.meta.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {group.items.length} {group.items.length === 1 ? 'Standard' : 'Standards'}
                  </span>
                </div>

                {/* Series Aligned Table */}
                <div className="w-full overflow-hidden">
                  <table className="w-full text-left border-collapse table-fixed">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        <th className="py-2.5 px-2.5 w-11 text-center">#</th>
                        <th className="py-2.5 px-2.5 w-24">Standard Code</th>
                        <th className="py-2.5 px-3 w-[32%]">Official Title / Standard Name</th>
                        <th className="py-2.5 px-3">Core Regulatory Scope &amp; Objective</th>
                        <th className="py-2.5 px-2.5 w-16 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {group.items.map(({ index, standard }) => (
                        <tr 
                          key={standard.code}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          {/* Index */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 group-hover:text-amber-400">
                            {String(index).padStart(2, '0')}
                          </td>

                          {/* Code */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono font-black text-xs">
                              {standard.code}
                            </span>
                          </td>

                          {/* Standard Name / Title */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                              {standard.title}
                            </div>
                            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                              Series: {standard.series} · Domain: {standard.category}
                            </div>
                          </td>

                          {/* Scope / Objective */}
                          <td className="py-3 px-4 text-[11.5px] text-slate-300 leading-relaxed">
                            {standard.scope}
                          </td>

                          {/* Copy Action */}
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleCopy(standard.code, standard.title)}
                              title="Copy code and standard name"
                              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition-all cursor-pointer inline-flex items-center justify-center"
                            >
                              {copiedCode === standard.code ? (
                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ========================================================================= */
          /* FLAT CONTINUOUS MASTER INDEX TABLE (1–46) */
          /* ========================================================================= */
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xs">
            <div className="w-full overflow-hidden">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-2.5 w-12 text-center">Index</th>
                    <th className="py-3 px-2.5 w-24">Standard Code</th>
                    <th className="py-3 px-3 w-[28%]">Official Standard Name</th>
                    <th className="py-3 px-2.5 w-24">Series</th>
                    <th className="py-3 px-3">Core Regulatory Scope &amp; Objective</th>
                    <th className="py-3 px-2.5 w-16 text-center">Copy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {filteredStandards.map((standard) => {
                    const originalIndex = activeStandardsPool.findIndex(s => s.code === standard.code) + 1;
                    return (
                      <tr 
                        key={standard.code}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Index */}
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-400 group-hover:text-amber-400">
                          #{String(originalIndex).padStart(2, '0')}
                        </td>

                        {/* Code */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/25 text-amber-300 font-mono font-black text-xs">
                            {standard.code}
                          </span>
                        </td>

                        {/* Official Name */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white leading-snug group-hover:text-amber-200 transition-colors">
                            {standard.title}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                            Category: {standard.category}
                          </div>
                        </td>

                        {/* Series */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {standard.series}
                          </span>
                        </td>

                        {/* Scope */}
                        <td className="py-3 px-4 text-[11.5px] text-slate-300 leading-relaxed">
                          {standard.scope}
                        </td>

                        {/* Copy */}
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleCopy(standard.code, standard.title)}
                            title="Copy code and standard name"
                            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-amber-500 hover:text-slate-950 text-slate-400 transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            {copiedCode === standard.code ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
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

        {filteredStandards.length === 0 && (
          <div className="p-8 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            No standards match "{searchQuery}". Try searching for another standard code or title keyword.
          </div>
        )}

        {/* Footer Index Summary Note */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-400 shrink-0" />
            <span>
              All standards follow the official Clarified International Auditing and Assurance Standards Board (IAASB) / ICAI numbering scheme.
            </span>
          </div>
          <span className="font-mono text-amber-400 font-bold hidden sm:inline">
            Total Standards ({levelLabel}): {activeStandardsPool.length}
          </span>
        </div>

      </div>

    </div>
  );
}
