import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Upload,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Calendar,
  Plus,
  Trash2
} from 'lucide-react';
import { SubjectId } from '../types';
import { ModalPortal } from './ModalPortal';
import { useCALevel, getActiveCALevel, getLevelConfig, getLevelSubjectIds } from '../data/curriculumLevels';
import { SUBJECT_CHAPTERS, getCanonicalChapterKey } from './RevisionPlanner';

export interface TemplateTaskItemInput {
  title?: string;
  subjectCode?: SubjectId | string;
  subject?: SubjectId | string;
  chapterName?: string;
  chapter?: string;
  relevance?: 'General' | 'Revision' | 'Final Revision' | string;
  revKey?: 'rev1' | 'rev1.5' | 'rev2' | 'rev3' | string;
  targetDurationMinutes?: number;
  durationMinutes?: number;
  duration?: number;
  dueDate?: string;
  date?: string;
  dayOffset?: number;
  priority?: 'High' | 'Medium' | 'Low' | string;
  notes?: string;
}

export interface TemplateSchedulePayload {
  listTitle?: string;
  description?: string;
  tasks: TemplateTaskItemInput[];
}

export interface NormalizedTemplateTask {
  title: string;
  cleanTitle: string;
  subjectCode: SubjectId;
  chapterName?: string;
  relevance: 'General' | 'Revision' | 'Final Revision';
  revKey?: 'rev1' | 'rev1.5' | 'rev2' | 'rev3';
  targetDurationMinutes: number;
  taskDate: string;
  priority: 'High' | 'Medium' | 'Low';
  notes: string;
}

export interface TaskImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAnchorDate: string;
  currentBoardName: string;
  onImportTasks: (
    normalizedTasks: NormalizedTemplateTask[],
    options: {
      createNewBoard: boolean;
      newBoardTitle: string;
      skipDuplicates: boolean;
    }
  ) => Promise<{ importedCount: number; skippedCount: number; boardTitle: string }>;
}

const ALL_VALID_SUBJECTS: SubjectId[] = [
  'Accounts', 'Law', 'MathStats', 'Econ',
  'AdvAcc', 'CorpLaw', 'Tax', 'Cost', 'AuditInter', 'FMSM',
  'FR', 'AFM', 'Audit', 'DT', 'IDT', 'IBS'
];

export const STAGE_SELECT_OPTIONS: ('General' | 'Revision' | 'Final Revision')[] = [
  'General',
  'Revision',
  'Final Revision'
];

export const PREDEFINED_TEMPLATES: Record<
  string,
  { id: string; label: string; badge: string; payload: TemplateSchedulePayload }
> = {};

export function getSubjectChaptersForSystem(subjectCode: SubjectId): string[] {
  const fromPlanner = SUBJECT_CHAPTERS[subjectCode];
  if (Array.isArray(fromPlanner) && fromPlanner.length > 0) {
    return fromPlanner;
  }
  const activeCfg = getLevelConfig(getActiveCALevel());
  const found = activeCfg.subjects.find((s) => s.code === subjectCode);
  return found?.chapters || [];
}

export function matchSystemChapterName(subjectCode: SubjectId, rawText: string | undefined): string {
  const trimmed = (rawText || '')
    .replace(/^\[[A-Za-z]+\]\s*/, '')
    .trim();
  if (!trimmed || trimmed.startsWith('Select Chapter') || trimmed.startsWith('—')) return '';
  const chapters = getSubjectChaptersForSystem(subjectCode);
  if (chapters.includes(trimmed)) return trimmed;
  const canonical = getCanonicalChapterKey(subjectCode, trimmed);
  if (canonical && chapters.includes(canonical)) return canonical;
  const lower = trimmed.toLowerCase();
  const partial = chapters.find(
    (ch) => ch.toLowerCase() === lower || lower.includes(ch.toLowerCase()) || ch.toLowerCase().includes(lower)
  );
  return partial || '';
}

function addDaysToDateStr(baseDateStr: string, offsetDays: number): string {
  try {
    const [yr, mn, dy] = baseDateStr.split('-').map(Number);
    const d = new Date(yr, (mn || 1) - 1, dy || 1);
    d.setDate(d.getDate() + (Number(offsetDays) || 0));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return baseDateStr;
  }
}

function formatCalendarDateOption(dateStr: string): string {
  try {
    const [yr, mn, dy] = dateStr.split('-').map(Number);
    const d = new Date(yr, (mn || 1) - 1, dy || 1);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const monthName = d.toLocaleDateString('en-US', { month: 'short' });
    return `${dateStr} (${dayName}, ${String(dy).padStart(2, '0')} ${monthName} ${yr})`;
  } catch {
    return dateStr;
  }
}

function normalizeSubjectCode(raw: string | undefined): SubjectId {
  const defaultSub = getLevelSubjectIds(getActiveCALevel())[0] || 'FR';
  if (!raw) return defaultSub;
  const cleaned = raw.replace(/^\[|\]$/g, '').trim();
  const prefixMatch = cleaned.match(/^([A-Za-z]+)\s*[-:]/);
  const candidate = (prefixMatch ? prefixMatch[1] : cleaned).trim().toUpperCase();
  if (candidate === 'AUDITINTER' || candidate === 'INTER AUDIT') return 'AuditInter';
  if (candidate === 'AUDIT' || candidate === 'AUDITING') {
    return getActiveCALevel() === 'intermediate' ? 'AuditInter' : 'Audit';
  }
  if (candidate === 'SFM' || candidate === 'AFM') return 'AFM';
  if (candidate === 'FR') return 'FR';
  if (candidate === 'DT') return 'DT';
  if (candidate === 'IDT' || candidate === 'GST') return 'IDT';
  if (candidate === 'IBS') return 'IBS';
  if (candidate === 'ACCOUNTS' || candidate === 'ACCOUNTING') return 'Accounts';
  if (candidate === 'LAW' || candidate === 'BUSINESS LAWS') return 'Law';
  if (candidate === 'MATHSTATS' || candidate === 'QA' || candidate === 'MATHS') return 'MathStats';
  if (candidate === 'ECON' || candidate === 'ECONOMICS') return 'Econ';
  if (candidate === 'ADVACC' || candidate === 'ADVANCED ACCOUNTING') return 'AdvAcc';
  if (candidate === 'CORPLAW' || candidate === 'CORPORATE LAW') return 'CorpLaw';
  if (candidate === 'TAX' || candidate === 'TAXATION') return 'Tax';
  if (candidate === 'COST' || candidate === 'COSTING') return 'Cost';
  if (candidate === 'FMSM' || candidate === 'FM' || candidate === 'FM & SM') return 'FMSM';
  const match = ALL_VALID_SUBJECTS.find((s) => s.toUpperCase() === candidate);
  return match || defaultSub;
}

function normalizeStage(raw: string | undefined): 'General' | 'Revision' | 'Final Revision' {
  if (!raw) return 'Revision';
  const u = raw.trim().toLowerCase();
  if (u.includes('final') || u.includes('1.5')) return 'Final Revision';
  if (u.includes('gen')) return 'General';
  return 'Revision';
}

function parseCalendarDateValue(rawDateStr: string | undefined, fallbackDate: string): string {
  const cleaned = (rawDateStr || '').trim();
  const isoMatch = cleaned.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) return isoMatch[1];
  const dmyMatch = cleaned.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})/);
  if (dmyMatch) return `${dmyMatch[3]}-${dmyMatch[2]}-${dmyMatch[1]}`;
  return fallbackDate;
}

// ============================================================================
// 1. STYLED INTERACTIVE PDF GENERATOR (NO TIME COLUMN, DROPDOWN ROW COUNT & ADD ROW)
// ============================================================================

function escapePdfString(val: string): string {
  return (val || '')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

export function generateMcaStyleFillablePdfBytes(
  boardTitle: string,
  anchorDate: string,
  tasks: TemplateTaskItemInput[],
  prefillRows: boolean,
  requestedRowCount?: number
): Uint8Array {
  const totalRows = Math.max(1, Math.min(60, requestedRowCount || tasks.length || 15));
  const rowsPerPage = 14;
  const pageCount = Math.ceil(totalRows / rowsPerPage);

  const activeLevel = getActiveCALevel();
  const validSubjects = getLevelSubjectIds(activeLevel);

  // Dropdown options (No manual typing: /FT /Ch /Ff 131072)
  const subjectOptions = [...validSubjects];

  const chapterOptions: string[] = ['— Select Chapter —'];
  validSubjects.forEach((sub) => {
    const chaps = getSubjectChaptersForSystem(sub);
    chaps.forEach((ch) => {
      chapterOptions.push(`[${sub}] ${ch}`);
    });
  });

  // 120 calendar date options starting from anchorDate
  const calendarDateOptions: string[] = [];
  for (let d = 0; d < 120; d++) {
    const dStr = addDaysToDateStr(anchorDate, d);
    calendarDateOptions.push(formatCalendarDateOption(dStr));
  }

  const stageOptions = [...STAGE_SELECT_OPTIONS];

  // Number of rows selector options inside the PDF itself ("1 Row" .. "${totalRows} Rows")
  const rowCountOptions: string[] = [];
  for (let r = 1; r <= totalRows; r++) {
    rowCountOptions.push(`${r} ${r === 1 ? 'Row' : 'Rows'}`);
  }
  const initialActiveRows = prefillRows
    ? Math.max(1, tasks.filter((t) => Boolean(t?.chapterName || t?.title)).length || totalRows)
    : totalRows;
  const defaultRowCountLabel = `${Math.min(totalRows, initialActiveRows)} ${
    Math.min(totalRows, initialActiveRows) === 1 ? 'Row' : 'Rows'
  }`;

  const objects: string[] = [];
  const addObj = (body: string): number => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = addObj('');
  const pagesId = addObj('');
  const fontRegularId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const fontBoldId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const fontMonoId = addObj('<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>');

  const subjectOptArrayId = addObj(
    `[ ${subjectOptions.map((o) => `(${escapePdfString(o)})`).join(' ')} ]`
  );
  const chapterOptArrayId = addObj(
    `[ ${chapterOptions.map((o) => `(${escapePdfString(o)})`).join(' ')} ]`
  );
  const dateOptArrayId = addObj(
    `[ ${calendarDateOptions.map((o) => `(${escapePdfString(o)})`).join(' ')} ]`
  );
  const stageOptArrayId = addObj(
    `[ ${stageOptions.map((o) => `(${escapePdfString(o)})`).join(' ')} ]`
  );
  const rowCountOptArrayId = addObj(
    `[ ${rowCountOptions.map((o) => `(${escapePdfString(o)})`).join(' ')} ]`
  );

  // Interactive PDF JavaScript Action for the "+ ADD ROW" button inside the PDF
  const addRowJsCode = `
    var f = this.getField("meta_row_count");
    if (f) {
      var cur = parseInt(String(f.value).replace(/[^0-9]/g, ""), 10) || 1;
      var next = Math.min(${totalRows}, cur + 1);
      f.value = next + (next === 1 ? " Row" : " Rows");
      var nextRowNum = (next < 10 ? "0" : "") + next;
      var chField = this.getField("row_" + nextRowNum + "_chapter");
      if (chField) { chField.setFocus(); }
    }
  `.trim().replace(/\s+/g, ' ');
  const addRowJsActionId = addObj(
    `<< /Type /Action /S /JavaScript /JS (${escapePdfString(addRowJsCode)}) >>`
  );

  const pageIds: number[] = [];
  const allFieldIds: number[] = [];

  const pageW = 842;
  const pageH = 595;

  for (let p = 0; p < pageCount; p++) {
    const thisPageId = addObj('');
    pageIds.push(thisPageId);

    const contentLines: string[] = [];
    const pageFieldIds: number[] = [];

    // 1. Page Canvas Background & Executive Outer Card Frame
    contentLines.push('0.95 0.96 0.98 rg 0 0 842 595 re f');
    contentLines.push('1 1 1 rg 18 18 806 559 re f');
    contentLines.push('0.10 0.16 0.28 RG 1.2 w 18 18 806 559 re S');

    // 2. Deep Obsidian-Navy Brand Header Banner + Gold Accent Bar
    contentLines.push('0.05 0.09 0.18 rg 18 518 806 59 re f');
    // Gold Accent Rule under Header
    contentLines.push('0.84 0.66 0.21 rg 18 515 806 3 re f');

    // Brand Title & Subtitle
    contentLines.push(
      'BT /F2 14 Tf 1 1 1 rg 32 553 Td (practACE   |   STUDY PLANNER SCHEDULE) Tj ET'
    );
    contentLines.push(
      'BT /F1 8.5 Tf 0.78 0.85 0.95 rg 32 534 Td (Interactive Dropdown Schedule  -  Select Subject, Chapter, Sch Date & Stage from Dropdowns) Tj ET'
    );
    contentLines.push(
      `BT /F2 9 Tf 0.96 0.78 0.28 rg 710 553 Td (PAGE ${p + 1} OF ${pageCount}) Tj ET`
    );
    contentLines.push(
      `BT /F1 8 Tf 0.78 0.85 0.95 rg 675 534 Td (Board: ${escapePdfString((boardTitle || 'Study Planner').slice(0, 22))}) Tj ET`
    );

    // 3. Styled Control Strip: Number of Rows Selector + "+ Add Row" Button inside PDF
    contentLines.push('0.93 0.95 0.99 rg 28 470 786 36 re f');
    contentLines.push('0.76 0.82 0.90 RG 0.8 w 28 470 786 36 re S');

    contentLines.push(
      'BT /F2 8.5 Tf 0.07 0.12 0.24 rg 38 485 Td (ROWS TO ADD / IMPORT:) Tj ET'
    );
    contentLines.push(
      'BT /F1 8 Tf 0.25 0.33 0.48 rg 378 485 Td (Select how many rows to include or click "+ Add Row", then fill the rows below & upload this PDF.) Tj ET'
    );

    // Helper: Create a strict non-editable Dropdown Field (/FT /Ch /Ff 131072)
    const createDropdownField = (
      fieldName: string,
      x: number,
      y: number,
      w: number,
      h: number,
      defaultValue: string,
      optArrayObjId: number,
      isHeaderControl: boolean = false
    ) => {
      // Field background
      contentLines.push(`${isHeaderControl ? '1 0.99 0.94' : '1 1 1'} rg ${x} ${y} ${w} ${h} re f`);
      contentLines.push(
        `${isHeaderControl ? '0.84 0.66 0.21' : '0.68 0.75 0.85'} RG ${isHeaderControl ? '1.0' : '0.6'} w ${x} ${y} ${w} ${h} re S`
      );

      // Right dropdown indicator badge
      const btnW = 14;
      contentLines.push(
        `${isHeaderControl ? '0.96 0.90 0.72' : '0.91 0.94 0.98'} rg ${x + w - btnW} ${y} ${btnW} ${h} re f`
      );
      contentLines.push(
        `${isHeaderControl ? '0.84 0.66 0.21' : '0.68 0.75 0.85'} RG 0.5 w ${x + w - btnW} ${y} ${btnW} ${h} re S`
      );
      // Draw small downward triangle chevron inside the right button box
      const cx = x + w - btnW / 2;
      const cy = y + h / 2;
      contentLines.push(
        `0.15 0.23 0.38 rg ${cx - 3} ${cy + 1.5} m ${cx + 3} ${cy + 1.5} l ${cx} ${cy - 2.5} l f`
      );

      const safeVal = escapePdfString(defaultValue);
      const safeName = escapePdfString(fieldName);

      const apStreamContent = `/Tx BMC q 1 1 ${w - btnW - 2} ${h - 2} re W n BT /F1 8.5 Tf 0.05 0.10 0.22 rg 5 ${Math.max(4, Math.round((h - 8) / 2))} Td (${safeVal}) Tj ET Q EMC`;
      const apObjId = addObj(
        `<< /Type /XObject /Subtype /Form /BBox [0 0 ${w} ${h}] /Resources << /Font << /F1 ${fontRegularId} 0 R >> >> /Length ${apStreamContent.length} >>\nstream\n${apStreamContent}\nendstream`
      );

      const fieldObj = `<< /Type /Annot /Subtype /Widget /FT /Ch /Ff 131072 /T (${safeName}) /V (${safeVal}) /DV (${safeVal}) /Opt ${optArrayObjId} 0 R /F 4 /Rect [${x} ${y} ${x + w} ${y + h}] /DA (/F1 8.5 Tf 0.05 0.10 0.22 rg) /MK << /BC [0.68 0.75 0.85] /BG [1 1 1] >> /AP << /N ${apObjId} 0 R >> >>`;
      const fId = addObj(fieldObj);
      pageFieldIds.push(fId);
      allFieldIds.push(fId);
    };

    // Place the "ROWS TO ADD / IMPORT" Dropdown & "+ ADD ROW" Button in the top control strip
    createDropdownField('meta_row_count', 155, 477, 105, 22, defaultRowCountLabel, rowCountOptArrayId, true);

    // Draw "+ ADD ROW" Interactive Push Button Widget in PDF
    const btnX = 268;
    const btnY = 477;
    const btnW = 96;
    const btnH = 22;
    contentLines.push(`0.09 0.18 0.36 rg ${btnX} ${btnY} ${btnW} ${btnH} re f`);
    contentLines.push(`0.18 0.32 0.58 RG 0.8 w ${btnX} ${btnY} ${btnW} ${btnH} re S`);
    contentLines.push(`BT /F2 8 Tf 1 1 1 rg ${btnX + 16} ${btnY + 7} Td (+ ADD ROW) Tj ET`);

    const btnApStream = `q 0.09 0.18 0.36 rg 0 0 ${btnW} ${btnH} re f BT /F2 8 Tf 1 1 1 rg 16 7 Td (+ ADD ROW) Tj ET Q`;
    const btnApId = addObj(
      `<< /Type /XObject /Subtype /Form /BBox [0 0 ${btnW} ${btnH}] /Resources << /Font << /F2 ${fontBoldId} 0 R >> >> /Length ${btnApStream.length} >>\nstream\n${btnApStream}\nendstream`
    );
    const addRowBtnFieldId = addObj(
      `<< /Type /Annot /Subtype /Widget /FT /Btn /Ff 65536 /T (btn_add_row_${p + 1}) /F 4 /Rect [${btnX} ${btnY} ${btnX + btnW} ${btnY + btnH}] /MK << /BG [0.09 0.18 0.36] /BC [0.18 0.32 0.58] /CA (+ ADD ROW) >> /AP << /N ${btnApId} 0 R >> /A ${addRowJsActionId} 0 R >>`
    );
    pageFieldIds.push(addRowBtnFieldId);
    allFieldIds.push(addRowBtnFieldId);

    // 4. Styled 4-Column Schedule Table (NO TIME COLUMN)
    // Columns:
    // Col 0: # (28..62, w=34)
    // Col 1: SUBJECT * (62..152, w=90)
    // Col 2: CHAPTER * (152..534, w=382)
    // Col 3: SCH DATE * (534..694, w=160)
    // Col 4: STAGE * (694..814, w=120)
    const tableTop = 458;
    const headerH = 24;
    const rowH = 27;

    // Table Header Bar
    contentLines.push(`0.07 0.13 0.25 rg 28 ${tableTop - headerH} 786 ${headerH} re f`);
    contentLines.push(`0.84 0.66 0.21 rg 28 ${tableTop - headerH} 786 1.5 re f`);
    contentLines.push(`BT /F2 8.5 Tf 0.96 0.80 0.30 rg 36 ${tableTop - 16} Td (#) Tj ET`);
    contentLines.push(`BT /F2 8.5 Tf 1 1 1 rg 68 ${tableTop - 16} Td (SUBJECT *) Tj ET`);
    contentLines.push(`BT /F2 8.5 Tf 1 1 1 rg 160 ${tableTop - 16} Td (CHAPTER *) Tj ET`);
    contentLines.push(`BT /F2 8.5 Tf 1 1 1 rg 542 ${tableTop - 16} Td (SCH DATE *) Tj ET`);
    contentLines.push(`BT /F2 8.5 Tf 1 1 1 rg 702 ${tableTop - 16} Td (STAGE *) Tj ET`);

    const startRowIdx = p * rowsPerPage;
    const endRowIdx = Math.min(totalRows, startRowIdx + rowsPerPage);

    for (let globalIdx = startRowIdx; globalIdx < endRowIdx; globalIdx++) {
      const localIdx = globalIdx - startRowIdx;
      const rowNum = String(globalIdx + 1).padStart(2, '0');
      const rowY = tableTop - headerH - (localIdx + 1) * rowH;
      const isEven = localIdx % 2 === 0;

      // Alternating clean row background
      contentLines.push(`${isEven ? '0.97 0.98 1.0' : '0.93 0.95 0.99'} rg 28 ${rowY} 786 ${rowH} re f`);
      contentLines.push(`0.80 0.85 0.92 RG 0.5 w 28 ${rowY} 786 ${rowH} re S`);

      // Row number badge
      contentLines.push(`0.10 0.17 0.32 rg 32 ${rowY + 5} 24 ${rowH - 10} re f`);
      contentLines.push(`BT /F3 8 Tf 1 1 1 rg 37 ${rowY + 10} Td (${rowNum}) Tj ET`);

      const taskItem = prefillRows && tasks[globalIdx] ? tasks[globalIdx] : null;
      const resolvedSub: SubjectId = taskItem
        ? normalizeSubjectCode(taskItem.subjectCode || taskItem.subject)
        : validSubjects[0] || 'FR';
      const matchedChap = taskItem
        ? matchSystemChapterName(resolvedSub, taskItem.chapterName || taskItem.chapter || taskItem.title)
        : '';
      const chapDisplayVal = matchedChap ? `[${resolvedSub}] ${matchedChap}` : '— Select Chapter —';

      const rawDate = taskItem ? taskItem.dueDate || taskItem.date || anchorDate : anchorDate;
      const dateDisplayVal = formatCalendarDateOption(rawDate);
      const stageVal = taskItem ? normalizeStage(taskItem.relevance) : 'Revision';

      const fieldY = rowY + 4;
      const fieldH = rowH - 8;

      createDropdownField(`row_${rowNum}_subject`, 64, fieldY, 82, fieldH, resolvedSub, subjectOptArrayId);
      createDropdownField(`row_${rowNum}_chapter`, 154, fieldY, 374, fieldH, chapDisplayVal, chapterOptArrayId);
      createDropdownField(`row_${rowNum}_date`, 536, fieldY, 152, fieldH, dateDisplayVal, dateOptArrayId);
      createDropdownField(`row_${rowNum}_stage`, 696, fieldY, 112, fieldH, stageVal, stageOptArrayId);
    }

    // Footer Strip
    contentLines.push('0.05 0.09 0.18 rg 18 18 806 24 re f');
    contentLines.push(
      'BT /F1 7.5 Tf 0.82 0.88 0.96 rg 32 27 Td (practACE Study Planner  |  All fields are mandatory for active rows  |  Dropdown & Calendar Selection Only) Tj ET'
    );

    const contentStream = contentLines.join('\n');
    const contentObjId = addObj(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
    const pageFieldsRef = pageFieldIds.map((id) => `${id} 0 R`).join(' ');

    objects[thisPageId - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Resources << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R /F3 ${fontMonoId} 0 R >> >> /Contents ${contentObjId} 0 R /Annots [${pageFieldsRef}] >>`;
  }

  const kidsRef = pageIds.map((id) => `${id} 0 R`).join(' ');
  const allFieldsRef = allFieldIds.map((id) => `${id} 0 R`).join(' ');

  objects[pagesId - 1] = `<< /Type /Pages /Kids [${kidsRef}] /Count ${pageIds.length} >>`;
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R /AcroForm << /Fields [${allFieldsRef}] /NeedAppearances true /DA (/F1 8.5 Tf 0 0 0 rg) /DR << /Font << /F1 ${fontRegularId} 0 R /F2 ${fontBoldId} 0 R /F3 ${fontMonoId} 0 R >> >> >> >>`;

  let pdfText = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdfText.length);
    pdfText += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefStart = pdfText.length;
  pdfText += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) {
    pdfText += `${String(off).padStart(10, '0')} 00000 n \n`;
  }
  pdfText += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  const bytes = new Uint8Array(pdfText.length);
  for (let i = 0; i < pdfText.length; i++) {
    bytes[i] = pdfText.charCodeAt(i) & 0xff;
  }
  return bytes;
}

function decodePdfLiteralString(raw: string): string {
  let out = '';
  let i = 0;
  while (i < raw.length) {
    const ch = raw[i];
    if (ch === '\\' && i + 1 < raw.length) {
      const next = raw[i + 1];
      if (next >= '0' && next <= '7') {
        const oct = raw.slice(i + 1, i + 4).match(/^[0-7]{1,3}/)?.[0] || next;
        out += String.fromCharCode(parseInt(oct, 8));
        i += 1 + oct.length;
        continue;
      }
      if (next === 'n') out += '\n';
      else if (next === 'r') out += '\r';
      else if (next === 't') out += '\t';
      else out += next;
      i += 2;
    } else {
      out += ch;
      i++;
    }
  }
  if (out.length >= 2 && out.charCodeAt(0) === 0xfe && out.charCodeAt(1) === 0xff) {
    let utf16 = '';
    for (let j = 2; j + 1 < out.length; j += 2) {
      utf16 += String.fromCharCode((out.charCodeAt(j) << 8) | out.charCodeAt(j + 1));
    }
    return utf16.trim();
  }
  return out.trim();
}

function decodePdfHexString(hexRaw: string): string {
  const clean = hexRaw.replace(/\s+/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 2) {
    const pair = clean.slice(i, i + 2).padEnd(2, '0');
    const code = parseInt(pair, 16);
    if (!isNaN(code)) bytes.push(code);
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    let utf16 = '';
    for (let j = 2; j + 1 < bytes.length; j += 2) {
      utf16 += String.fromCharCode((bytes[j] << 8) | bytes[j + 1]);
    }
    return utf16.trim();
  }
  return bytes.map((b) => String.fromCharCode(b)).join('').trim();
}

export function parseUploadedPdfAcroForm(
  buffer: ArrayBuffer,
  fallbackAnchorDate: string
): {
  listTitle: string;
  anchorDate: string;
  selectedRowCount: number;
  tasks: TemplateTaskItemInput[];
} {
  const bytes = new Uint8Array(buffer);
  let rawText = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    rawText += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
  }

  const objIdToFieldName = new Map<number, string>();
  const fieldValues = new Map<string, string>();

  const extractValueFromSnippet = (snippet: string): string | null => {
    const litMatch = snippet.match(/\/V\s*\(((?:\\.|[^\\()])*)\)/);
    if (litMatch) return decodePdfLiteralString(litMatch[1]);
    const hexMatch = snippet.match(/\/V\s*<([0-9A-Fa-f\s]*)>/);
    if (hexMatch) return decodePdfHexString(hexMatch[1]);
    const nameMatch = snippet.match(/\/V\s*\/([^\s\/<>()\[\]]+)/);
    if (nameMatch) return nameMatch[1].trim();
    return null;
  };

  const objRegex = /(\d+)\s+\d+\s+obj([\s\S]*?)endobj/g;
  let match: RegExpExecArray | null;
  while ((match = objRegex.exec(rawText)) !== null) {
    const objId = parseInt(match[1], 10);
    const body = match[2];

    const tLit = body.match(/\/T\s*\(((?:\\.|[^\\()])*)\)/);
    const tHex = !tLit ? body.match(/\/T\s*<([0-9A-Fa-f\s]+)>/) : null;
    const fieldName = tLit
      ? decodePdfLiteralString(tLit[1])
      : tHex
        ? decodePdfHexString(tHex[1])
        : objIdToFieldName.get(objId);

    if (fieldName) {
      objIdToFieldName.set(objId, fieldName);
      const val = extractValueFromSnippet(body);
      if (val !== null) {
        fieldValues.set(fieldName, val);
      }
    }
  }

  const inlineRegex = /<<[\s\S]*?>>/g;
  while ((match = inlineRegex.exec(rawText)) !== null) {
    const dict = match[0];
    const tLit = dict.match(/\/T\s*\(((?:\\.|[^\\()])*)\)/);
    if (tLit) {
      const fName = decodePdfLiteralString(tLit[1]);
      const val = extractValueFromSnippet(dict);
      if (val !== null) {
        fieldValues.set(fName, val);
      }
    }
  }

  const listTitle = (fieldValues.get('meta_board_title') || 'Study Planner').trim() || 'Study Planner';
  const anchorDateRaw = (fieldValues.get('meta_anchor_date') || fallbackAnchorDate).trim();
  const anchorDate = /^\d{4}-\d{2}-\d{2}$/.test(anchorDateRaw) ? anchorDateRaw : fallbackAnchorDate;

  // Read number of rows selected in the PDF ("ROWS TO ADD / IMPORT")
  const rawRowCountStr = (fieldValues.get('meta_row_count') || '').trim();
  const parsedRowLimit = parseInt(rawRowCountStr.replace(/[^\d]/g, ''), 10);
  const maxRowsToScan = !isNaN(parsedRowLimit) && parsedRowLimit > 0 ? Math.min(60, parsedRowLimit) : 60;

  const extractedTasks: TemplateTaskItemInput[] = [];
  for (let i = 1; i <= maxRowsToScan; i++) {
    const rowNum = String(i).padStart(2, '0');
    const subRaw = (fieldValues.get(`row_${rowNum}_subject`) || '').trim();
    const chapRaw = (fieldValues.get(`row_${rowNum}_chapter`) || '').trim();
    const dateRaw = (fieldValues.get(`row_${rowNum}_date`) || '').trim();
    const stageRaw = (
      fieldValues.get(`row_${rowNum}_stage`) ||
      fieldValues.get(`row_${rowNum}_priority`) ||
      ''
    ).trim();

    if (!chapRaw || chapRaw.startsWith('Select Chapter') || chapRaw.startsWith('—')) continue;

    const chapSubMatch = chapRaw.match(/^\[([A-Za-z]+)\]\s*(.+)$/);
    const subjectCode = chapSubMatch
      ? normalizeSubjectCode(chapSubMatch[1])
      : normalizeSubjectCode(subRaw);
    const cleanChapCandidate = chapSubMatch ? chapSubMatch[2] : chapRaw;
    const matchedChapter = matchSystemChapterName(subjectCode, cleanChapCandidate);
    if (!matchedChapter) continue;

    const relevance = normalizeStage(stageRaw);
    const priority: 'High' | 'Medium' | 'Low' =
      relevance === 'Final Revision' ? 'High' : relevance === 'General' ? 'Low' : 'Medium';
    const resolvedDate = parseCalendarDateValue(dateRaw, anchorDate);

    extractedTasks.push({
      subjectCode,
      chapterName: matchedChapter,
      title: matchedChapter,
      targetDurationMinutes: 0,
      dueDate: resolvedDate,
      priority,
      relevance
    });
  }

  return {
    listTitle,
    anchorDate,
    selectedRowCount: !isNaN(parsedRowLimit) && parsedRowLimit > 0 ? parsedRowLimit : extractedTasks.length || 5,
    tasks: extractedTasks
  };
}

export function generateExcelXmlTemplate(): string {
  return '';
}

export function parseUploadedExcelXml(
  _xmlText: string,
  fallbackAnchorDate: string
): {
  listTitle: string;
  anchorDate: string;
  tasks: TemplateTaskItemInput[];
} {
  return { listTitle: 'Study Planner', anchorDate: fallbackAnchorDate, tasks: [] };
}

// ============================================================================
// 2. SCHEDULE MODAL (SUBJECT, CHAPTER, SCH DATE, STAGE — NO TIME COLUMN)
// ============================================================================

interface StrictScheduleRow {
  subjectCode: SubjectId;
  chapterName: string;
  schDate: string;
  stage: 'General' | 'Revision' | 'Final Revision';
}

export default function TaskImportModal({
  isOpen,
  onClose,
  defaultAnchorDate,
  currentBoardName,
  onImportTasks
}: TaskImportModalProps) {
  const caLevel = useCALevel();
  const VALID_SUBJECTS = getLevelSubjectIds(caLevel);
  const defaultLevelSub = VALID_SUBJECTS[0] || 'FR';

  const [rows, setRows] = useState<StrictScheduleRow[]>(() =>
    Array.from({ length: 5 }, () => ({
      subjectCode: defaultLevelSub,
      chapterName: '',
      schDate: defaultAnchorDate,
      stage: 'Revision'
    }))
  );
  const [rowsToAddCount, setRowsToAddCount] = useState<number>(1);

  const [skipDuplicates, setSkipDuplicates] = useState<boolean>(true);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importResultBanner, setImportResultBanner] = useState<string | null>(null);
  const [uploadedFileStatus, setUploadedFileStatus] = useState<{
    fileName: string;
    selectedRowCount: number;
    extractedCount: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && defaultAnchorDate) {
      setImportResultBanner(null);
      setRows((prev) =>
        prev.map((r) => ({
          ...r,
          schDate: r.schDate || defaultAnchorDate
        }))
      );
    }
  }, [isOpen, defaultAnchorDate]);

  // Add N rows option
  const handleAddRows = (countToAdd: number) => {
    const safeAdd = Math.max(1, Math.min(30, countToAdd || 1));
    setRows((prev) => {
      const cap = Math.min(60, prev.length + safeAdd);
      const needed = cap - prev.length;
      if (needed <= 0) return prev;
      const newRows: StrictScheduleRow[] = Array.from({ length: needed }, () => ({
        subjectCode: defaultLevelSub,
        chapterName: '',
        schDate: defaultAnchorDate,
        stage: 'Revision'
      }));
      return [...prev, ...newRows];
    });
  };

  const handleRemoveRow = (indexToRemove: number) => {
    setRows((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, idx) => idx !== indexToRemove);
    });
  };

  // Validate rows: Subject, Chapter, Sch Date, and Stage are all mandatory
  const validationSummary = useMemo(() => {
    const validTasks: NormalizedTemplateTask[] = [];
    let incompleteRowCount = 0;

    rows.forEach((r) => {
      const hasMandatory =
        Boolean(r.subjectCode) &&
        Boolean(r.chapterName.trim()) &&
        Boolean(r.schDate.trim()) &&
        Boolean(r.stage);

      if (!hasMandatory) {
        incompleteRowCount++;
        return;
      }

      const priority: 'High' | 'Medium' | 'Low' =
        r.stage === 'Final Revision' ? 'High' : r.stage === 'General' ? 'Low' : 'Medium';
      const revKey: 'rev1' | 'rev1.5' | undefined =
        r.stage === 'Final Revision' ? 'rev1.5' : r.stage === 'Revision' ? 'rev1' : undefined;

      validTasks.push({
        title: r.chapterName,
        cleanTitle: r.chapterName,
        subjectCode: r.subjectCode,
        chapterName: r.chapterName,
        relevance: r.stage,
        revKey,
        targetDurationMinutes: 0,
        taskDate: r.schDate,
        priority,
        notes: ''
      });
    });

    return {
      validTasks,
      incompleteRowCount
    };
  }, [rows]);

  if (!isOpen) return null;

  const handleUpdateRow = (index: number, patch: Partial<StrictScheduleRow>) => {
    setRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== index) return row;
        const updated = { ...row, ...patch };
        if (patch.subjectCode && patch.subjectCode !== row.subjectCode) {
          const validChaps = getSubjectChaptersForSystem(patch.subjectCode);
          if (row.chapterName && !validChaps.includes(row.chapterName)) {
            updated.chapterName = '';
          }
        }
        return updated;
      })
    );
  };

  const handleDownloadPdf = (prefill: boolean) => {
    const taskInputs: TemplateTaskItemInput[] = rows.map((r) => ({
      subjectCode: r.subjectCode,
      chapterName: r.chapterName,
      title: r.chapterName,
      dueDate: r.schDate,
      relevance: r.stage
    }));

    const pdfBytes = generateMcaStyleFillablePdfBytes(
      currentBoardName || 'Study Planner',
      defaultAnchorDate,
      taskInputs,
      prefill,
      rows.length
    );
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practACE-Schedule-${rows.length}-Rows.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result;
      if (buffer instanceof ArrayBuffer) {
        const parsedPdf = parseUploadedPdfAcroForm(buffer, defaultAnchorDate);
        const targetLen = Math.max(parsedPdf.selectedRowCount || 1, parsedPdf.tasks.length || 1);

        const nextRows: StrictScheduleRow[] = Array.from({ length: targetLen }, (_, idx) => {
          const t = parsedPdf.tasks[idx];
          if (t) {
            const sub = normalizeSubjectCode(t.subjectCode || t.subject);
            const chap = matchSystemChapterName(sub, t.chapterName || t.title);
            return {
              subjectCode: sub,
              chapterName: chap,
              schDate: t.dueDate || defaultAnchorDate,
              stage: normalizeStage(t.relevance)
            };
          }
          return {
            subjectCode: defaultLevelSub,
            chapterName: '',
            schDate: defaultAnchorDate,
            stage: 'Revision'
          };
        });

        setRows(nextRows);
        setUploadedFileStatus({
          fileName: file.name,
          selectedRowCount: targetLen,
          extractedCount: parsedPdf.tasks.length
        });
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const handleExecuteImport = async () => {
    if (validationSummary.validTasks.length === 0 || isImporting) return;
    setIsImporting(true);
    setImportResultBanner(null);
    try {
      const res = await onImportTasks(validationSummary.validTasks, {
        createNewBoard: false,
        newBoardTitle: currentBoardName || 'Study Planner',
        skipDuplicates
      });
      setImportResultBanner(
        `Added ${res.importedCount} study target${res.importedCount === 1 ? '' : 's'} to "${res.boardTitle}"${
          res.skippedCount > 0 ? ` (${res.skippedCount} duplicate${res.skippedCount === 1 ? '' : 's'} skipped)` : ''
        }.`
      );
      setTimeout(() => {
        onClose();
      }, 900);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <ModalPortal triggerKey="task-import-modal">
      <div
        className="fixed inset-0 z-[165] flex items-center justify-center bg-slate-950/85 p-3 sm:p-5 backdrop-blur-md overflow-y-auto select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-5xl p-4 sm:p-5 shadow-2xl text-white space-y-4 my-auto max-h-[92vh] overflow-y-auto font-sans">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/35 text-indigo-400 flex items-center justify-center shrink-0">
                <FileText className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Study Schedule — PDF Export &amp; Import
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition cursor-pointer shrink-0"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Add Rows Option + Styled PDF Export / Import Bar */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
            {/* Select Number of Rows to Add */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white">Rows ({rows.length}):</span>

              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 gap-1">
                <select
                  value={rowsToAddCount}
                  onChange={(e) => setRowsToAddCount(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono font-bold text-amber-300 focus:outline-hidden cursor-pointer"
                >
                  {[1, 2, 3, 5, 10, 15].map((n) => (
                    <option key={n} value={n}>
                      +{n} {n === 1 ? 'Row' : 'Rows'}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleAddRows(rowsToAddCount)}
                  disabled={rows.length >= 60}
                  className="h-7 px-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer transition whitespace-nowrap"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Rows</span>
                </button>
              </div>
            </div>

            {/* PDF Export & Upload Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleDownloadPdf(false)}
                className="h-8 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 text-indigo-400" />
                <span>Download Blank PDF ({rows.length} Rows)</span>
              </button>

              <button
                type="button"
                onClick={() => handleDownloadPdf(true)}
                className="h-8 px-3 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span>Download Filled PDF ({rows.length} Rows)</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm whitespace-nowrap"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Filled PDF</span>
              </button>
            </div>
          </div>

          {uploadedFileStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  Loaded <strong>{uploadedFileStatus.fileName}</strong> ·{' '}
                  <strong className="font-mono tabular-nums">{uploadedFileStatus.selectedRowCount}</strong> row(s) selected in PDF ({uploadedFileStatus.extractedCount} filled).
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFileStatus(null)}
                className="text-[11px] text-slate-400 hover:text-white cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* 4-Column Schedule Table (Subject, Chapter, Sch Date, Stage — All Mandatory, Dropdown/Calendar Only) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-xs">
                <span className="font-bold text-white">
                  Schedule Rows ({rows.length})
                </span>
                <span className="text-slate-400">
                  <strong className="text-rose-400">*</strong> Subject, Chapter, Sch Date &amp; Stage are mandatory
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono tabular-nums">
                {validationSummary.validTasks.length > 0 ? (
                  <span className="text-emerald-300 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>
                      {validationSummary.validTasks.length} of {rows.length} Ready
                    </span>
                  </span>
                ) : (
                  <span className="text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    <span>Select chapters below</span>
                  </span>
                )}
              </div>
            </div>

            <div className="overflow-x-auto max-h-[360px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-900 text-slate-200 border-b border-slate-800 sticky top-0 z-10">
                  <tr>
                    <th className="py-2.5 px-2.5 font-mono text-[11px] w-10">#</th>
                    <th className="py-2.5 px-2.5 font-semibold text-[11px] w-32 whitespace-nowrap">
                      Subject <span className="text-rose-400">*</span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold text-[11px]">
                      Chapter <span className="text-rose-400">*</span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold text-[11px] w-44 whitespace-nowrap">
                      Sch Date <span className="text-rose-400">*</span>
                    </th>
                    <th className="py-2.5 px-2.5 font-semibold text-[11px] w-40 whitespace-nowrap">
                      Stage <span className="text-rose-400">*</span>
                    </th>
                    <th className="py-2.5 px-2 text-center font-semibold text-[11px] w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {rows.map((row, idx) => {
                    const subjectChapters = getSubjectChaptersForSystem(row.subjectCode);
                    const isRowComplete =
                      Boolean(row.subjectCode) &&
                      Boolean(row.chapterName) &&
                      Boolean(row.schDate) &&
                      Boolean(row.stage);

                    return (
                      <tr
                        key={`strict_row_${idx}`}
                        className={
                          isRowComplete
                            ? 'bg-slate-950 hover:bg-slate-900/60'
                            : 'bg-slate-950/60 hover:bg-slate-900/40'
                        }
                      >
                        <td className="py-2 px-2.5 font-mono tabular-nums text-[11px] text-slate-400">
                          {idx + 1}
                        </td>

                        {/* 1. SUBJECT (Mandatory Dropdown) */}
                        <td className="py-2 px-2.5">
                          <select
                            value={row.subjectCode}
                            onChange={(e) => handleUpdateRow(idx, { subjectCode: e.target.value as SubjectId })}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-mono font-bold text-white focus:border-indigo-400 focus:outline-hidden cursor-pointer"
                          >
                            {VALID_SUBJECTS.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 2. CHAPTER (Mandatory Dropdown) */}
                        <td className="py-2 px-2.5">
                          <select
                            value={row.chapterName}
                            onChange={(e) => handleUpdateRow(idx, { chapterName: e.target.value })}
                            className={`w-full bg-slate-900 border rounded-lg px-2.5 py-1.5 text-xs focus:border-indigo-400 focus:outline-hidden cursor-pointer ${
                              row.chapterName
                                ? 'border-slate-700 text-white font-medium'
                                : 'border-amber-500/50 text-amber-300'
                            }`}
                          >
                            <option value="">— Select Chapter (Mandatory) —</option>
                            {subjectChapters.map((chap) => (
                              <option key={chap} value={chap}>
                                {chap}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 3. SCH DATE (Mandatory Calendar Picker — Manual Typing Blocked) */}
                        <td className="py-2 px-2.5">
                          <input
                            type="date"
                            value={row.schDate}
                            onKeyDown={(e) => e.preventDefault()}
                            onPaste={(e) => e.preventDefault()}
                            onChange={(e) => e.target.value && handleUpdateRow(idx, { schDate: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-400 rounded-lg px-2.5 py-1.5 text-xs font-mono tabular-nums text-white focus:outline-hidden cursor-pointer select-none"
                          />
                        </td>

                        {/* 4. STAGE (Mandatory Dropdown) */}
                        <td className="py-2 px-2.5">
                          <select
                            value={row.stage}
                            onChange={(e) =>
                              handleUpdateRow(idx, {
                                stage: e.target.value as 'General' | 'Revision' | 'Final Revision'
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold text-white focus:border-indigo-400 focus:outline-hidden cursor-pointer"
                          >
                            {STAGE_SELECT_OPTIONS.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Remove Row */}
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(idx)}
                            disabled={rows.length <= 1}
                            className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400 disabled:opacity-30 cursor-pointer transition"
                            title="Remove row"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={skipDuplicates}
                  onChange={(e) => setSkipDuplicates(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-indigo-400 cursor-pointer"
                />
                <span className="text-[11px]">Skip duplicate chapters on the same date</span>
              </label>

              <span className="text-[11px] text-slate-400 font-mono">
                Target Board: <strong className="text-slate-200">{currentBoardName || 'Study Planner'}</strong>
              </span>
            </div>
          </div>

          {importResultBanner && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{importResultBanner}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {validationSummary.validTasks.length > 0
                ? `${validationSummary.validTasks.length} completed row(s) ready to add to Study Planner`
                : 'Select Chapter for at least 1 row or upload a filled PDF'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={validationSummary.validTasks.length === 0 || isImporting}
                onClick={handleExecuteImport}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  {isImporting
                    ? 'Adding to Study Planner...'
                    : `Add ${validationSummary.validTasks.length || ''} Row${validationSummary.validTasks.length === 1 ? '' : 's'} to Study Planner`}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}
