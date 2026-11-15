/**
 * Unified Vector OCR PDF Export Engine for pract.CA
 * Ensures 100% reliable PDF printing and downloads across all browsers and sandboxed iframes.
 * Produces crisp, selectable/searchable vector text matching exact site colors.
 */

import { SUBJECT_NAMES, SubjectId } from '../types';
import { CA_CURRICULUM_LEVELS, getLevelForSubject, getSelectedCALevel } from '../data/curriculumLevels';

export const exportToPdfEngine = (filenamePart: string, bodyContentHtml: string) => {
  const resolveSubjectAndLevel = (fname: string, html: string): { subjectDisplayName: string; levelLabel: string } => {
    const upper = fname.toUpperCase();
    const activeLevel = getSelectedCALevel();
    const fallbackLevelLabel = CA_CURRICULUM_LEVELS[activeLevel]?.shortName || 'CA Final';

    // Match explicit level mentions in HTML or filename
    const detectLevelFromText = (): string | null => {
      if (upper.includes('FOUNDATION') || html.includes('CA Foundation') || html.includes('CA FOUNDATION')) return 'CA Foundation';
      if (upper.includes('INTERMEDIATE') || upper.includes('CA_INTER') || html.includes('CA Intermediate') || html.includes('CA INTERMEDIATE')) return 'CA Intermediate';
      if (upper.includes('CA_FINAL') || html.includes('CA Final') || html.includes('CA FINAL')) return 'CA Final';
      return null;
    };

    const orderedCandidates: Array<{ id: SubjectId; prefixes: string[]; name: string }> = [
      { id: 'AdvAcc', prefixes: ['ADVACC'], name: SUBJECT_NAMES.AdvAcc },
      { id: 'CorpLaw', prefixes: ['CORPLAW'], name: SUBJECT_NAMES.CorpLaw },
      { id: 'AuditInter', prefixes: ['AUDITINTER'], name: SUBJECT_NAMES.AuditInter },
      { id: 'MathStats', prefixes: ['MATHSTATS'], name: SUBJECT_NAMES.MathStats },
      { id: 'Accounts', prefixes: ['ACCOUNTS'], name: SUBJECT_NAMES.Accounts },
      { id: 'Law', prefixes: ['LAW_'], name: SUBJECT_NAMES.Law },
      { id: 'Econ', prefixes: ['ECON'], name: SUBJECT_NAMES.Econ },
      { id: 'Tax', prefixes: ['TAX_'], name: SUBJECT_NAMES.Tax },
      { id: 'Cost', prefixes: ['COST'], name: SUBJECT_NAMES.Cost },
      { id: 'FMSM', prefixes: ['FMSM'], name: SUBJECT_NAMES.FMSM },
      { id: 'IDT', prefixes: ['IDT'], name: SUBJECT_NAMES.IDT },
      { id: 'DT', prefixes: ['DT_'], name: SUBJECT_NAMES.DT },
      { id: 'FR', prefixes: ['FR_'], name: SUBJECT_NAMES.FR },
      { id: 'AFM', prefixes: ['AFM'], name: SUBJECT_NAMES.AFM },
      { id: 'Audit', prefixes: ['AUDIT'], name: SUBJECT_NAMES.Audit },
      { id: 'IBS', prefixes: ['IBS'], name: SUBJECT_NAMES.IBS },
    ];

    for (const c of orderedCandidates) {
      if (c.prefixes.some((p) => upper.startsWith(p) || upper === c.id.toUpperCase()) || html.includes(c.name)) {
        const subLevel = getLevelForSubject(c.id);
        return {
          subjectDisplayName: c.name,
          levelLabel: CA_CURRICULUM_LEVELS[subLevel]?.shortName || fallbackLevelLabel,
        };
      }
    }

    const explicitLevel = detectLevelFromText() || fallbackLevelLabel;
    if (upper.includes('LEDGER') || upper.includes('TIME_AUDIT')) {
      return { subjectDisplayName: '24-Hour Time Audit Ledger', levelLabel: explicitLevel };
    }
    return { subjectDisplayName: `${explicitLevel} Study Material`, levelLabel: explicitLevel };
  };

  const { subjectDisplayName, levelLabel } = resolveSubjectAndLevel(filenamePart, bodyContentHtml);

  // Clean legacy inline headers/footers and optionally generate Table of Contents
  let processedHtml = bodyContentHtml;
  if (typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<div>${bodyContentHtml}</div>`, 'text/html');
      const rootDiv = doc.body.firstElementChild;

      if (rootDiv) {
        // Remove any legacy inline headers or footers so the unified repeating page header/footer is used exclusively
        rootDiv
          .querySelectorAll('.pdf-top-header, .pdf-header-gold-bar, .brand-header, .header-layout, .pdf-footer-gold-bar, .pdf-bottom-footer')
          .forEach(el => el.remove());

        processedHtml = rootDiv.innerHTML;
      }
    } catch (e) {
      console.error('Error processing HTML for PDF export:', e);
    }
  }

  const headStyles = typeof document !== 'undefined'
    ? Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .filter(el => el.id !== 'practca-print-isolation-css')
        .map(el => el.outerHTML)
        .join('\n')
    : '';

  const fullHtmlDocument = `<!DOCTYPE html>
<html lang="en" class="light" style="background-color: #ffffff !important; color: #0f172a !important;">
<head>
  <meta charset="UTF-8">
  <title>practACE - ${filenamePart.replace(/_/g, ' ')}</title>
  ${headStyles}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');
    
    :root, .dark, [class*="dark"] {
      --bg: #ffffff !important;
      --bg-card: #ffffff !important;
      --bg-card2: #f8fafc !important;
      --bg-input: #ffffff !important;
      --text: #0f172a !important;
      --text-muted: #334155 !important;
      --text-dim: #475569 !important;
      --border-color: #cbd5e1 !important;
      --sidebar: #f8fafc !important;
      --sidebar-text: #0f172a !important;
      background-color: #ffffff !important;
      color: #0f172a !important;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
      text-shadow: none !important;
      box-shadow: none !important;
    }

    @page {
      size: A4 portrait;
      margin: 8mm !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a !important;
      font-size: 10pt;
      line-height: 1.6;
      word-spacing: 0.025em;
      letter-spacing: -0.005em;
      background-color: #ffffff !important;
      -webkit-font-smoothing: antialiased;
    }

    /* Force high contrast on any dark-mode text & background rules that leak from index.css */
    .concept-focus-container,
    .concept-focus-container *,
    .blueprint-view,
    .blueprint-view *,
    .text-white, .text-slate-100, .text-slate-200, .text-slate-300, .text-slate-400,
    .text-cav-text, .text-cav-muted, .text-cav-dim {
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
    }

    .concept-focus-container .bg-white,
    .concept-focus-container [class*="bg-white"],
    .concept-focus-container [class*="bg-slate-"],
    .blueprint-view .bg-white,
    .blueprint-view [class*="bg-white"],
    .blueprint-view [class*="bg-slate-"],
    .bg-slate-900, .bg-slate-950, .bg-slate-800, .bg-slate-700,
    .bg-cav-card, .bg-cav-card2, .bg-cav-input, .bg-cav-bg {
      background-color: #ffffff !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      border-color: #cbd5e1 !important;
    }

    /* Clean Page Container (Maximized width, zero wasted space) */
    .container {
      max-width: 100% !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background-color: #ffffff !important;
      color: #0f172a !important;
      box-shadow: none !important;
    }

    /* Base Body Typography with High Contrast */
    p, li, td, th, span, div, label, strong, b {
      font-size: 9.5pt;
      line-height: 1.55;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
    }

    table:not(.practca-print-frame-table) {
      width: 100% !important;
      border-collapse: collapse !important;
      color: #0f172a !important;
      background-color: #ffffff !important;
      margin-top: 8px !important;
      margin-bottom: 12px !important;
    }

    table:not(.practca-print-frame-table) th, .concept-focus-container th, .blueprint-view th {
      background-color: #e2e8f0 !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      font-weight: 800 !important;
      border: 1.5px solid #94a3b8 !important;
      padding: 8px !important;
    }

    table:not(.practca-print-frame-table) td, .concept-focus-container td, .blueprint-view td {
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      border: 1px solid #cbd5e1 !important;
      padding: 7px 8px !important;
    }

    ul, ol {
      margin-top: 6px !important;
      margin-bottom: 8px !important;
      padding-left: 20px !important;
    }

    li {
      margin-bottom: 4px !important;
      line-height: 1.6 !important;
      word-spacing: 0.025em !important;
    }

    /* Running Textbook Headings */
    h1 {
      font-size: 15pt !important;
      line-height: 1.3 !important;
      font-weight: 800 !important;
      word-spacing: 0.04em !important;
      letter-spacing: -0.01em !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      margin-top: 1.2em !important;
      margin-bottom: 0.4em !important;
      border-bottom: 1.5px solid #0f172a !important;
      padding-bottom: 4px !important;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    h2 {
      font-size: 13pt !important;
      line-height: 1.3 !important;
      font-weight: 800 !important;
      word-spacing: 0.035em !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      margin-top: 1em !important;
      margin-bottom: 0.35em !important;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    h3 {
      font-size: 11.5pt !important;
      line-height: 1.35 !important;
      font-weight: 700 !important;
      word-spacing: 0.03em !important;
      color: #1e293b !important;
      -webkit-text-fill-color: #1e293b !important;
      margin-top: 0.8em !important;
      margin-bottom: 0.25em !important;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    h4, h5, h6 {
      font-size: 10.5pt !important;
      line-height: 1.4 !important;
      font-weight: 700 !important;
      word-spacing: 0.025em !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      margin-top: 0.6em !important;
      margin-bottom: 0.2em !important;
      page-break-after: avoid !important;
      break-after: avoid !important;
    }

    small, .text-xs, .text-sm, sub, sup {
      font-size: 9pt !important;
      line-height: 1.5 !important;
    }

    /* Top Banner Dark Header Exception */
    .pdf-top-header,
    .pdf-concept-header {
      background-color: #0b1528 !important;
      color: #ffffff !important;
      padding: 10px 14px !important;
      border-radius: 4px !important;
      margin-bottom: 14px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .pdf-top-header h1, .pdf-top-header h2, .pdf-top-header h3, .pdf-top-header div,
    .pdf-concept-header h1, .pdf-concept-header h2, .pdf-concept-header h3 {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Outer Subtopic Borders & Cards */
    .chapter-block,
    .sub-card,
    .principle-card,
    .concept-card,
    .chapter-card,
    .section-card,
    .limit-card,
    .statutory-card,
    .pdf-concept-card,
    .card {
      border: 1px solid #cbd5e1 !important;
      box-shadow: none !important;
      border-radius: 4px !important;
      background: #ffffff !important;
      background-color: #ffffff !important;
      padding: 12px 14px !important;
      margin-top: 0.5rem !important;
      margin-bottom: 0.75rem !important;
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    /* TEXTBOOK CALLOUT / FORMULA / CODE BOXES */
    .pdf-formula-box,
    .formula-card,
    .equation-block,
    .alert-box,
    .example-box,
    pre,
    code,
    [class*="formula"] {
      font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
      font-size: 10.5pt !important;
      font-weight: 700 !important;
      line-height: 1.8 !important;
      letter-spacing: 0.035em !important;
      word-spacing: 0.09em !important;
      padding: 12px 16px !important;
      margin-top: 10px !important;
      margin-bottom: 12px !important;
      background-color: #f8fafc !important;
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      border-left: 4px solid #1e3a8a !important;
      border-radius: 4px !important;
      color: #0f172a !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    /* Explanation for Formula Elements & Parameters ("Where:" legends) */
    .pdf-concept-footnote,
    .formula-legend,
    .formula-where,
    .formula-explanation,
    div[class*="footnote"],
    div[class*="legend"] {
      margin-top: 8px !important;
      padding-top: 8px !important;
      border-top: 1px dashed #cbd5e1 !important;
      font-size: 9.5pt !important;
      line-height: 1.6 !important;
      word-spacing: 0.03em !important;
      letter-spacing: 0 !important;
      color: #334155 !important;
      font-family: 'Inter', -apple-system, sans-serif !important;
      font-weight: 400 !important;
    }

    .formula-legend li,
    .formula-where li,
    .formula-explanation li {
      margin-bottom: 4px !important;
      line-height: 1.55 !important;
      padding-left: 2px !important;
    }

    .formula-legend strong,
    .formula-where strong,
    .formula-explanation strong,
    .formula-var {
      font-family: 'JetBrains Mono', monospace !important;
      font-weight: 700 !important;
      color: #0f172a !important;
      margin-right: 4px !important;
    }

    /* KaTeX Math Formatting */
    .katex, .katex-display, .katex-html {
      font-size: 1.05em !important;
      line-height: 1.7 !important;
      letter-spacing: 0.025em !important;
      word-spacing: 0.06em !important;
    }

    /* Dark Header/Card Text Contrast Preservations */
    .pdf-top-header *, .pdf-concept-header * {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
    }
    .pdf-top-header .pdf-header-right {
      background-color: #050b14 !important;
      border: 1px solid #1e293b !important;
      padding: 6px 12px !important;
      border-radius: 4px !important;
    }
    .pdf-top-header .pdf-brand-title { color: #fbbf24 !important; -webkit-text-fill-color: #fbbf24 !important; }
    .pdf-top-header .pdf-brand-sub { color: #e2e8f0 !important; -webkit-text-fill-color: #e2e8f0 !important; }
    .pdf-top-header .pdf-doc-title { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
    .pdf-top-header .pdf-doc-sub { color: #fbbf24 !important; -webkit-text-fill-color: #fbbf24 !important; }

    /* High-contrast Token Highlights */
    .text-amber-400, .text-amber-300, .text-amber-500, .text-yellow-400, .text-yellow-500 {
      color: #b45309 !important;
      font-weight: 700 !important;
    }
    .bg-slate-900 .text-amber-400, .bg-slate-950 .text-amber-400, .bg-indigo-950 .text-amber-400 {
      color: #fbbf24 !important;
    }

    .text-sky-400, .text-sky-300, .text-sky-500, .text-cyan-400, .text-cyan-500 {
      color: #0369a1 !important;
      font-weight: 700 !important;
    }
    .bg-slate-900 .text-sky-400, .bg-slate-950 .text-sky-400, .bg-indigo-950 .text-sky-400 {
      color: #38bdf8 !important;
    }

    .text-emerald-400, .text-emerald-300, .text-emerald-500, .text-green-500 {
      color: #047857 !important;
      font-weight: 700 !important;
    }
    .bg-slate-900 .text-emerald-400, .bg-slate-950 .text-emerald-400, .bg-indigo-950 .text-emerald-400 {
      color: #34d399 !important;
    }

    .text-rose-400, .text-rose-300, .text-rose-500, .text-red-500 {
      color: #be123c !important;
      font-weight: 700 !important;
    }
    .bg-slate-900 .text-rose-400, .bg-slate-950 .text-rose-400, .bg-indigo-950 .text-rose-400 {
      color: #f43f5e !important;
    }

    /* Table & Image Page Break Avoidance */
    table:not(.practca-print-frame-table) {
      page-break-inside: auto !important;
      break-inside: auto !important;
      border-collapse: collapse !important;
      width: 100% !important;
      margin-top: 8px !important;
      margin-bottom: 12px !important;
      border: 1.5px solid #cbd5e1 !important;
    }

    thead {
      display: table-header-group !important;
    }

    tfoot {
      display: table-footer-group !important;
    }

    tbody {
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    table:not(.practca-print-frame-table) tr {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    table:not(.practca-print-frame-table) th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 800;
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      font-size: 9.5pt;
      word-spacing: 0.03em;
    }

    table:not(.practca-print-frame-table) td {
      color: #1e293b;
      border: 1px solid #cbd5e1;
      padding: 7px 10px;
      font-size: 9.5pt;
      word-spacing: 0.025em;
    }

    img, svg, canvas, figure, picture, video, .diagram-container, [class*="diagram"] {
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      max-width: 100% !important;
      height: auto !important;
    }

    @media print {
      @page {
        size: A4 portrait;
        margin: 0mm !important;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #ffffff !important;
      }
      .container {
        border: none !important;
        padding: 2mm 12mm 4mm 12mm !important;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always !important;
        break-before: page !important;
      }
      .avoid-break {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
    }

    .container {
      max-width: 100%;
      margin: 0 auto;
      background: #ffffff;
      color: #0f172a;
    }

    /* Custom Concept Focus & Base File PDF Layout Matching User Preview */
    .pdf-top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #0b1528 !important;
      color: #ffffff;
      padding: 10px 16px;
      border-radius: 4px 4px 0 0;
      margin-bottom: 0;
    }
    .pdf-header-left {
      text-align: left;
    }
    .pdf-brand-title {
      color: #fbbf24 !important;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: -0.01em;
      line-height: 1.1;
      font-family: 'Inter', sans-serif;
    }
    .pdf-brand-sub {
      color: #e2e8f0 !important;
      font-size: 10px;
      font-weight: 500;
      margin-top: 2px;
      font-family: 'Inter', sans-serif;
    }
    .pdf-header-right {
      text-align: right;
      background-color: #050b14 !important;
      padding: 6px 12px;
      border-radius: 4px;
    }
    .pdf-doc-title {
      color: #ffffff !important;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-family: 'JetBrains Mono', monospace;
    }
    .pdf-doc-sub {
      color: #fbbf24 !important;
      font-size: 10px;
      font-weight: 600;
      margin-top: 2px;
      font-family: 'Inter', sans-serif;
    }
    .pdf-header-gold-bar {
      height: 3.5px;
      background-color: #d97706 !important;
      margin-bottom: 24px;
    }

    .pdf-cover-page {
      text-align: center;
      padding: 40px 20px 60px 20px;
      page-break-after: always;
      break-after: page;
      min-height: 700px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .pdf-cover-title {
      font-size: 26px;
      font-weight: 900;
      color: #0b1528 !important;
      text-transform: uppercase;
      letter-spacing: 0.02em;
      margin: 0 0 12px 0;
      line-height: 1.25;
      max-width: 650px;
      font-family: 'Inter', sans-serif;
    }
    .pdf-cover-subtitle {
      font-size: 14px;
      font-weight: 700;
      color: #d97706 !important;
      margin-bottom: 24px;
      font-family: 'Inter', sans-serif;
    }
    .pdf-cover-divider {
      width: 200px;
      height: 2.5px;
      background-color: #d97706 !important;
      margin: 0 auto 30px auto;
    }
    .pdf-cover-source {
      font-size: 11px;
      color: #475569 !important;
      line-height: 1.65;
      max-width: 580px;
      margin: 0 auto;
      font-family: 'Inter', sans-serif;
    }

    .pdf-concept-card {
      margin-bottom: 22px;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      overflow: hidden;
      background-color: #ffffff;
    }
    .pdf-concept-header {
      display: flex;
      align-items: center;
      background-color: #0b1528 !important;
      padding: 9px 14px;
      color: #ffffff !important;
    }
    .pdf-concept-num-box {
      width: 24px;
      height: 24px;
      border: 1.5px solid #fbbf24;
      color: #fbbf24 !important;
      font-weight: 900;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      font-family: 'JetBrains Mono', monospace;
      flex-shrink: 0;
      border-radius: 2px;
    }
    .pdf-concept-title {
      font-size: 13px;
      font-weight: 800;
      color: #ffffff !important;
      letter-spacing: 0.01em;
      font-family: 'Inter', sans-serif;
    }
    .pdf-formula-box {
      background-color: #fffbeb !important;
      border: 1.5px solid #fde68a !important;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 12px;
      text-align: center;
    }
    .pdf-formula-content {
      font-family: 'JetBrains Mono', 'Inter', monospace;
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a !important;
      line-height: 1.6;
      white-space: pre-wrap;
    }
    .pdf-concept-footnote {
      font-size: 10px;
      color: #334155 !important;
      line-height: 1.55;
      padding: 0 14px 14px 14px;
      font-family: 'Inter', sans-serif;
    }

    .brand-header {
      margin-bottom: 24px;
      border-bottom: 3.5px double #cbd5e1;
      padding-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .brand-title {
      margin: 0;
      font-size: 20px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: -0.015em;
      color: #0f172a;
    }

    .brand-sub {
      margin: 4px 0 0 0;
      font-size: 11px;
      color: #475569;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .export-meta {
      text-align: right;
      font-size: 9px;
      color: #64748b;
      font-family: 'JetBrains Mono', monospace;
      line-height: 1.55;
    }

    .bg-indigo-600 { background-color: #4f46e5 !important; color: #ffffff !important; }
    .bg-indigo-50 { background-color: #eef2ff !important; color: #3730a3 !important; border: 1px solid #c7d2fe !important; }
    .bg-emerald-50 { background-color: #ecfdf5 !important; color: #065f46 !important; border: 1px solid #a7f3d0 !important; }
    .bg-amber-50 { background-color: #fffbeb !important; color: #92400e !important; border: 1px solid #fde68a !important; }
    .bg-rose-50 { background-color: #fff1f2 !important; color: #9f1239 !important; border: 1px solid #fecdd3 !important; }
    .bg-slate-50 { background-color: #f8fafc !important; color: #0f172a !important; }
    .bg-slate-900 { background-color: #0f172a !important; color: #ffffff !important; }

    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin-bottom: 22px;
      page-break-inside: auto;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
    }

    tr {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9.5px;
      color: #0f172a;
      background-color: #f1f5f9 !important;
      border-bottom: 1.5px solid #cbd5e1;
      border-right: 1px solid #cbd5e1;
      padding: 10px 12px;
      text-align: left;
    }

    th:last-child {
      border-right: none;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      font-size: 10.5px;
      color: #1e293b;
      line-height: 1.5;
    }

    td:last-child {
      border-right: none;
    }

    tr:last-child td {
      border-bottom: none;
    }

    .badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 8px;
      font-weight: 800;
      padding: 3px 7px;
      border-radius: 4px;
      background-color: #f1f5f9 !important;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .text-mono {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }

    .chapter-block {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      margin-bottom: 22px;
      overflow: hidden;
      page-break-inside: avoid;
      break-inside: avoid;
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
    }

    .chapter-header {
      background-color: #f8fafc !important;
      color: #0f172a !important;
      padding: 14px 18px;
      border-bottom: 1px solid #cbd5e1;
    }

    .chapter-title {
      font-size: 13.5px;
      font-weight: 800;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      color: #0f172a !important;
    }

    .chapter-sub {
      font-size: 10px;
      color: #475569 !important;
      margin: 4px 0 0 0;
      font-weight: 500;
    }

    .chapter-body {
      padding: 16px;
    }

    .principle-card {
      margin-bottom: 20px;
      border-bottom: 1.5px dashed #e2e8f0;
      padding-bottom: 16px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .principle-card:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    .principle-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .principle-description {
      font-size: 10.5px;
      color: #334155;
      line-height: 1.55;
    }

    .alert-box {
      background-color: #fffbeb !important;
      border-left: 4px solid #d97706;
      padding: 12px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 10px;
      margin-top: 10px;
      color: #78350f !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .alert-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: #b45309 !important;
    }

    .example-box {
      background-color: #f5f3ff !important;
      border-left: 4px solid #7c3aed;
      padding: 12px 14px;
      border-radius: 0 6px 6px 0;
      font-size: 10px;
      margin-top: 10px;
      color: #3b0764 !important;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .example-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 4px;
      color: #6d28d9 !important;
    }

    .diagram-container {
      background-color: #f8fafc !important;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 14px;
      margin-top: 12px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-all;
      color: #0f172a;
      line-height: 1.45;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .section-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 12px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .section-grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 12px 0;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .sub-card {
      background: #f8fafc !important;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .sub-card-title {
      font-size: 10.5px;
      font-weight: 800;
      color: #0c4a6e;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 5px;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .sub-card-text {
      font-size: 9.5px;
      color: #334155;
      line-height: 1.5;
    }

    .pdf-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 72pt;
      font-weight: 900;
      color: rgba(148, 163, 184, 0.14);
      z-index: -1;
      pointer-events: none;
      font-family: 'Inter', -apple-system, sans-serif;
      letter-spacing: -0.02em;
      white-space: nowrap;
      user-select: none;
    }

    /* Application Statutory Coverage Register Mirror Styles (Side-by-Side Alignment & Color Grading) */
    #sections-panel {
      background-color: #ffffff !important;
      color: #0f172a !important;
    }

    #sections-panel .statutory-intro-banner {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      gap: 10px !important;
      background-color: #eff6ff !important;
      border: 1px solid #bfdbfe !important;
      border-left: 4px solid #1d4ed8 !important;
      border-radius: 6px !important;
      padding: 10px 14px !important;
      margin-bottom: 12px !important;
      color: #1e3a8a !important;
      -webkit-text-fill-color: #1e3a8a !important;
    }

    #sections-panel .statutory-intro-banner * {
      color: #1e3a8a !important;
      -webkit-text-fill-color: #1e3a8a !important;
    }

    #sections-filter-bar {
      background-color: #f8fafc !important;
      border: 1.5px solid #cbd5e1 !important;
      border-left: 4px solid #1e3a8a !important;
      border-radius: 8px !important;
      padding: 12px 16px !important;
      margin-bottom: 16px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    #sections-panel .statutory-coverage-title {
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      font-weight: 800 !important;
      font-size: 9.5pt !important;
    }

    #sections-panel .statutory-coverage-view {
      color: #0369a1 !important;
      -webkit-text-fill-color: #0369a1 !important;
      font-weight: 700 !important;
      font-size: 9pt !important;
    }

    #sections-panel .statutory-counts-row {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: wrap !important;
      align-items: center !important;
      gap: 8px !important;
      margin-top: 6px !important;
    }

    /* Semantic Category Color Grading in Print/PDF */
    #sections-panel .statutory-pill-sections,
    #sections-panel .statutory-badge-sections {
      background-color: #eef2ff !important;
      color: #312e81 !important;
      -webkit-text-fill-color: #312e81 !important;
      border: 1px solid #a5b4fc !important;
    }

    #sections-panel .statutory-pill-schedules,
    #sections-panel .statutory-badge-schedules {
      background-color: #ecfdf5 !important;
      color: #065f46 !important;
      -webkit-text-fill-color: #065f46 !important;
      border: 1px solid #6ee7b7 !important;
    }

    #sections-panel .statutory-pill-rules,
    #sections-panel .statutory-badge-rules {
      background-color: #fffbeb !important;
      color: #92400e !important;
      -webkit-text-fill-color: #92400e !important;
      border: 1px solid #fcd34d !important;
    }

    #sections-panel .statutory-pill-notifications,
    #sections-panel .statutory-badge-notifications {
      background-color: #faf5ff !important;
      color: #581c87 !important;
      -webkit-text-fill-color: #581c87 !important;
      border: 1px solid #d8b4fe !important;
    }

    #sections-panel .statutory-pill-circular,
    #sections-panel .statutory-badge-circular {
      background-color: #f0f9ff !important;
      color: #0369a1 !important;
      -webkit-text-fill-color: #0369a1 !important;
      border: 1px solid #7dd3fc !important;
    }

    #sections-panel .statutory-pill-ftp,
    #sections-panel .statutory-badge-ftp {
      background-color: #f0fdfa !important;
      color: #0f766e !important;
      -webkit-text-fill-color: #0f766e !important;
      border: 1px solid #5eead4 !important;
    }

    #sections-list-container {
      border: 1.5px solid #cbd5e1 !important;
      border-radius: 10px !important;
      background-color: #ffffff !important;
      overflow: hidden !important;
    }

    .statutory-section-item {
      padding: 14px 16px !important;
      border-bottom: 1.5px solid #cbd5e1 !important;
      background-color: #ffffff !important;
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    .statutory-section-item:last-child {
      border-bottom: none !important;
    }

    /* Enforce Desktop Side-by-Side Row Layout for Top-Level Statutory Item */
    .statutory-item-header-row {
      display: flex !important;
      flex-direction: row !important;
      align-items: flex-start !important;
      justify-content: space-between !important;
      gap: 14px !important;
      width: 100% !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    .statutory-item-main {
      display: flex !important;
      flex-direction: row !important;
      align-items: flex-start !important;
      gap: 14px !important;
      flex: 1 1 auto !important;
      width: 100% !important;
    }

    .statutory-code-badge {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-width: 128px !important;
      padding: 5px 10px !important;
      border-radius: 6px !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8.5pt !important;
      font-weight: 800 !important;
      text-align: center !important;
      flex-shrink: 0 !important;
    }

    .statutory-item-text {
      flex: 1 1 auto !important;
      min-width: 0 !important;
    }

    #sections-panel .statutory-heading {
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      font-size: 10.5pt !important;
      font-weight: 800 !important;
      line-height: 1.35 !important;
      margin: 0 !important;
    }

    #sections-panel .statutory-category-tag {
      color: #475569 !important;
      -webkit-text-fill-color: #475569 !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 7.5pt !important;
      font-weight: 700 !important;
    }

    #sections-panel .statutory-purpose {
      color: #334155 !important;
      -webkit-text-fill-color: #334155 !important;
      font-size: 9.5pt !important;
      line-height: 1.5 !important;
      margin-top: 3px !important;
    }

    .statutory-subsections-block {
      margin-left: 16px !important;
      padding-left: 16px !important;
      border-left: 2px dashed #94a3b8 !important;
      margin-top: 10px !important;
    }

    #sections-panel .statutory-subblock-title {
      color: #1e3a8a !important;
      -webkit-text-fill-color: #1e3a8a !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8pt !important;
      font-weight: 800 !important;
      letter-spacing: 0.06em !important;
      text-transform: uppercase !important;
      margin-bottom: 6px !important;
    }

    /* Enforce Desktop Side-by-Side Row Layout for Every Sub-Clause / Schedule Para */
    .statutory-subclause-card {
      display: flex !important;
      flex-direction: row !important;
      align-items: flex-start !important;
      gap: 12px !important;
      background-color: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 6px !important;
      padding: 8px 12px !important;
      margin-bottom: 6px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    #sections-panel .statutory-subcode-badge {
      display: inline-block !important;
      min-width: 118px !important;
      background-color: #e0e7ff !important;
      color: #1e1b4b !important;
      -webkit-text-fill-color: #1e1b4b !important;
      border: 1px solid #a5b4fc !important;
      padding: 3px 8px !important;
      border-radius: 4px !important;
      font-family: 'JetBrains Mono', monospace !important;
      font-size: 8pt !important;
      font-weight: 800 !important;
      text-align: center !important;
      flex-shrink: 0 !important;
    }

    .statutory-subclause-text {
      flex: 1 1 auto !important;
      min-width: 0 !important;
    }

    #sections-panel .statutory-sub-heading {
      display: block !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      font-size: 9.5pt !important;
      font-weight: 800 !important;
      line-height: 1.35 !important;
    }

    #sections-panel .statutory-sub-purpose {
      color: #334155 !important;
      -webkit-text-fill-color: #334155 !important;
      font-size: 9pt !important;
      font-weight: 500 !important;
      line-height: 1.45 !important;
      margin-top: 2px !important;
    }

    /* ============================================================================
       REPEATING EVERY-PAGE BRAND HEADER & FOOTER (EXACT MATCH TO REFERENCE PDF)
       ============================================================================ */
    table.practca-print-frame-table {
      width: 100% !important;
      border-collapse: collapse !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      page-break-inside: auto !important;
      break-inside: auto !important;
    }

    table.practca-print-frame-table {
      width: 100% !important;
      border-collapse: collapse !important;
      border-spacing: 0 !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    table.practca-print-frame-table > thead,
    thead.practca-print-thead {
      display: table-header-group !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    table.practca-print-frame-table > tbody,
    tbody.practca-print-tbody {
      display: table-row-group !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    table.practca-print-frame-table > tfoot,
    tfoot.practca-print-tfoot {
      display: table-footer-group !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      border: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    table.practca-print-frame-table > thead > tr,
    table.practca-print-frame-table > tbody > tr,
    table.practca-print-frame-table > tfoot > tr,
    table.practca-print-frame-table > thead > tr > td,
    table.practca-print-frame-table > tbody > tr > td,
    table.practca-print-frame-table > tfoot > tr > td {
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
    }

    /* Running Top Header (Embedded inside thead - repeats cleanly at the top of every page) */
    .practca-running-header,
    div.practca-running-header,
    header.practca-running-header {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: 100% !important;
      box-sizing: border-box !important;
      background-color: #0d1526 !important;
      background: #0d1526 !important;
      border: 1.5px solid #0d1526 !important;
      border-bottom: 3.5px solid #c99e3b !important;
      box-shadow: inset 0 0 0 1000px #0d1526 !important;
      padding: 9px 12px !important;
      margin: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    .practca-running-header-inner {
      display: flex !important;
      flex-direction: row !important;
      align-items: center !important;
      justify-content: space-between !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .practca-header-logo,
    .practca-running-header .practca-header-logo,
    div.practca-header-logo {
      color: #deb041 !important;
      -webkit-text-fill-color: #deb041 !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 19px !important;
      font-weight: 800 !important;
      letter-spacing: -0.02em !important;
      line-height: 1 !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-block !important;
      visibility: visible !important;
    }

    .practca-header-meta,
    .practca-running-header .practca-header-meta,
    div.practca-header-meta {
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 11.5px !important;
      font-weight: 600 !important;
      letter-spacing: 0.01em !important;
      line-height: 1 !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline-block !important;
      visibility: visible !important;
    }

    .practca-header-meta .practca-header-pipe,
    .practca-running-header .practca-header-pipe,
    span.practca-header-pipe {
      color: #94a3b8 !important;
      -webkit-text-fill-color: #94a3b8 !important;
      margin: 0 5px !important;
      font-weight: 400 !important;
      display: inline-block !important;
    }

    /* Mandatory gap between header and content: at least 1pt gap (4pt provides clean breathing room) */
    .practca-header-gap {
      display: block !important;
      height: 4pt !important;
      min-height: 1.5pt !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    }

    /* Mandatory gap between content and footer: at least 1pt gap (4pt provides clean breathing room) */
    .practca-footer-gap {
      display: block !important;
      height: 4pt !important;
      min-height: 1.5pt !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
    }

    /* Running Bottom Footer (Embedded inside tfoot - repeats cleanly at the bottom of every page) */
    .practca-running-footer,
    div.practca-running-footer,
    footer.practca-running-footer {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      width: 100% !important;
      box-sizing: border-box !important;
      background-color: #ffffff !important;
      background: #ffffff !important;
      padding: 0 0 3px 0 !important;
      margin: 0 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    .practca-running-footer-inner,
    .practca-running-footer .practca-running-footer-inner,
    div.practca-running-footer-inner {
      width: 100% !important;
      border-top: 2px solid #c99e3b !important;
      padding-top: 5px !important;
      text-align: center !important;
      color: #0f172a !important;
      -webkit-text-fill-color: #0f172a !important;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 10px !important;
      font-weight: 700 !important;
      letter-spacing: 0.02em !important;
      line-height: 1.2 !important;
      margin: 0 !important;
      visibility: visible !important;
    }

    /* 2-Column Tabular Statutory Matrix Print Styles */
    .statutory-matrix-table {
      width: 100% !important;
      border-collapse: collapse !important;
      page-break-inside: auto !important;
      margin: 4px 0 12px 0 !important;
    }
    .statutory-matrix-table thead tr th {
      background-color: #0d1526 !important;
      color: #ffffff !important;
      -webkit-text-fill-color: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      padding: 6px 10px !important;
      font-size: 8.5pt !important;
      text-transform: uppercase !important;
      font-weight: 800 !important;
    }
    .statutory-matrix-table tbody tr {
      border-bottom: 1px solid #cbd5e1 !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      background-color: #ffffff !important;
    }
    .statutory-matrix-table tbody tr:nth-child(even) {
      background-color: #f8fafc !important;
    }
    .statutory-matrix-col-citation {
      width: 28% !important;
      border: 1px solid #cbd5e1 !important;
      padding: 8px 10px !important;
      vertical-align: top !important;
    }
    .statutory-matrix-col-content {
      width: 72% !important;
      border: 1px solid #cbd5e1 !important;
      padding: 8px 12px !important;
      vertical-align: top !important;
      color: #0f172a !important;
    }
  </style>
</head>
<body>
  <!-- PAGINATED LAYOUT TABLE: thead & tfoot REPEAT AUTOMATICALLY ON EVERY PAGE WITH ZERO COLLISION -->
  <table class="practca-print-frame-table">
    <thead class="practca-print-thead">
      <tr>
        <td class="practca-header-td">
          <!-- REPEATING TOP HEADER -->
          <div class="practca-running-header" role="banner">
            <div class="practca-running-header-inner">
              <div class="practca-header-logo">practACE</div>
              <div class="practca-header-meta">${levelLabel} <span class="practca-header-pipe">|</span> ${subjectDisplayName}</div>
            </div>
          </div>
          <!-- AT LEAST 1PT GAP (4pt) TO CONTENT -->
          <div class="practca-header-gap"></div>
        </td>
      </tr>
    </thead>
    <tbody class="practca-print-tbody">
      <tr>
        <td class="practca-body-td">
          <div class="container">
            ${processedHtml}
          </div>
        </td>
      </tr>
    </tbody>
    <tfoot class="practca-print-tfoot">
      <tr>
        <td class="practca-footer-td">
          <!-- AT LEAST 1PT GAP (4pt) FROM CONTENT TO FOOTER -->
          <div class="practca-footer-gap"></div>
          <!-- REPEATING BOTTOM FOOTER -->
          <div class="practca-running-footer" role="contentinfo">
            <div class="practca-running-footer-inner">
              practACE — ${levelLabel} Revision Material
            </div>
          </div>
        </td>
      </tr>
    </tfoot>
  </table>
</body>
</html>`;

  // Method 1: Try window.open (works in non-sandboxed popups or top-level browser windows)
  let printWin: Window | null = null;
  try {
    printWin = window.open('', '_blank');
  } catch {
    printWin = null;
  }

  if (printWin) {
    try {
      printWin.document.open();
      printWin.document.write(fullHtmlDocument);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        try {
          printWin?.print();
        } catch (err) {
          console.error("Window print error:", err);
        }
      }, 350);
      return;
    } catch {
      printWin = null;
    }
  }

  // Method 2: Isolated off-screen iframe printing with realistic A4 dimensions
  try {
    let printFrame = document.getElementById('practca-pdf-print-iframe') as HTMLIFrameElement | null;
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'practca-pdf-print-iframe';
      printFrame.style.position = 'fixed';
      printFrame.style.left = '-9999px';
      printFrame.style.top = '-9999px';
      printFrame.style.width = '210mm';
      printFrame.style.height = '297mm';
      printFrame.style.border = 'none';
      printFrame.style.visibility = 'visible';
      printFrame.style.opacity = '0';
      printFrame.style.pointerEvents = 'none';
      printFrame.setAttribute('aria-hidden', 'true');
      document.body.appendChild(printFrame);
    }
    const frameDoc = printFrame.contentWindow?.document || printFrame.contentDocument;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(fullHtmlDocument);
      frameDoc.close();
      setTimeout(() => {
        try {
          printFrame?.contentWindow?.focus();
          printFrame?.contentWindow?.print();
        } catch (frameErr) {
          console.warn("Iframe print error, falling back to body target:", frameErr);
          fallbackPrintToBody(fullHtmlDocument);
        }
      }, 350);
      return;
    }
  } catch (err) {
    console.warn("Could not use iframe for printing:", err);
  }

  // Method 3: Fallback for sandboxed iframes without print permission
  fallbackPrintToBody(fullHtmlDocument);
};

const fallbackPrintToBody = (fullHtmlDocument: string) => {
  let targetContainer = document.getElementById('practca-printable-pdf-target');
  if (!targetContainer) {
    targetContainer = document.createElement('div');
    targetContainer.id = 'practca-printable-pdf-target';
    document.body.appendChild(targetContainer);
  }

  let styleEl = document.getElementById('practca-print-isolation-css');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'practca-print-isolation-css';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 6mm 8mm 6mm 8mm !important;
      }
      body > *:not(#practca-printable-pdf-target) {
        display: none !important;
      }
      #practca-printable-pdf-target {
        display: block !important;
        position: relative !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #ffffff !important;
        color: #0f172a !important;
        z-index: 999999 !important;
      }
      #practca-printable-pdf-target * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
      #practca-printable-pdf-target .practca-running-header {
        background-color: #0d1526 !important;
        background: #0d1526 !important;
        border-bottom: 3px solid #c99e3b !important;
        display: block !important;
        width: 100% !important;
      }
      #practca-printable-pdf-target .practca-header-logo {
        color: #deb041 !important;
        -webkit-text-fill-color: #deb041 !important;
        font-weight: 800 !important;
      }
      #practca-printable-pdf-target .practca-header-meta {
        color: #f8fafc !important;
        -webkit-text-fill-color: #f8fafc !important;
      }
      #practca-printable-pdf-target .practca-header-pipe {
        color: #94a3b8 !important;
        -webkit-text-fill-color: #94a3b8 !important;
      }
      #practca-printable-pdf-target .practca-running-footer-inner {
        border-top: 2px solid #c99e3b !important;
        color: #0f172a !important;
        -webkit-text-fill-color: #0f172a !important;
      }
    }
  `;

  // Extract body content to avoid injecting full <html>/<body> tags inside a div
  const bodyMatch = fullHtmlDocument.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  targetContainer.innerHTML = bodyMatch ? bodyMatch[1] : fullHtmlDocument;

  setTimeout(() => {
    window.print();
  }, 180);
};

export const exportElementIdToPdf = (elementId: string, filenamePart: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id ${elementId} not found.`);
    return;
  }

  const clone = element.cloneNode(true) as HTMLElement;

  // Remove buttons, inputs, select controls, and print-excluded elements from the clone
  const selectorsToExclude = ['button', 'input', 'select', '.no-print', '[title*="Save"]', '[title*="Export"]'];
  selectorsToExclude.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove());
  });

  exportToPdfEngine(filenamePart, clone.outerHTML);
};
