/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { exportToPdfEngine } from '../utils/pdfExporter';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Star, 
  Award, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { PracticeAttempt, BookmarkedSection, SubjectId, ChapterSummary } from '../types';
import BrandMark from './BrandMark';
const logoImg = '/assets/aistudio/practCA_Logo_photo_e935f99f.png';
const brandMarkImg = '/assets/aistudio/practCA_Logo_3008a4f9.png';
import { SUBJECTS_METADATA, CHAPTER_SUMMARIES } from '../data/syllabus';
import { ModalPortal } from './ModalPortal';
import { useCALevel, getLevelConfig, getLevelSubjectIds } from '../data/curriculumLevels';

const getFlowchartHtmlForPrint = (title: string): string => {
  switch (title) {
    case 'DT - Chapter 1: Undisclosed Income & 115BBE 78% Tax Flow':
      return `
        <div class="print-flowchart">
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Unexplained Transactions Detected u/s 68-69D</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; margin-top: 8px; font-size: 8.5px; font-family: 'Inter', sans-serif;">
              <div><strong>Sec 68:</strong> Cash Credits</div>
              <div><strong>Sec 69:</strong> Unexplained Invest.</div>
              <div><strong>Sec 69A:</strong> Unexplained Money</div>
              <div><strong>Sec 69B:</strong> Understated Invest.</div>
              <div><strong>Sec 69C:</strong> Unexplained Exps</div>
              <div><strong>Sec 69D:</strong> Hundi Loan</div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #6366f1; background-color: #f5f3ff;">
            <span class="print-flowchart-badge" style="background-color: #ddd6fe; color: #5b21b6;">2. Section 115BBE statutory flat tax engine</span>
            <div style="text-align: left; margin-top: 8px; font-size: 9px; line-height: 1.4; font-family: 'Inter', sans-serif;">
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px;">
                <span>Base Income Tax Rate:</span><span>60% Flat Rate</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px; margin-top: 3px;">
                <span>Surcharge (25% on Tax):</span><span>15% Flat Rate</span>
              </div>
              <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #cbd5e1; padding-bottom: 3px; margin-top: 3px;">
                <span>Health & Education Cess (4% on Tax+SC):</span><span>3% Flat Rate</span>
              </div>
              <div style="display: flex; justify-weight: 800; color: #b91c1c; margin-top: 6px; padding: 4px; background-color: #fee2e2; border-radius: 4px;">
                <span>TOTAL EFFECTIVE TAX RATE:</span><span>78% FLAT RATE</span>
              </div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #ef4444; background-color: #fef2f2;">
            <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">3. Strict statutory disallowance clawbacks</span>
            <p style="text-align: center; margin: 4px 0 0 0; font-size: 8.5px; line-height: 1.4; font-weight: 600; font-family: 'Inter', sans-serif;">
              No basic exemption limit offset allowed u/s 115BBE. No standard trade deductions, expenses, or business loss offsets are set off under current legislation.
            </p>
          </div>
        </div>
      `;
    case 'DT - Chapter 2: Agricultural Apportionment & Integration Slabs':
      return `
        <div class="print-flowchart">
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Composite Agri-Business Income Allocation u/s Rules 7, 7A, 7B, 8</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; margin-top: 8px; font-size: 8.5px; font-family: 'Inter', sans-serif;">
              <div><strong>Tea Rule 8:</strong> 60% Agri / 40% Bus</div>
              <div><strong>Rubber Rule 7A:</strong> 65% Agri / 35% Bus</div>
              <div><strong>Coffee Grown Rule 7B(1):</strong> 75% Agri / 25% Bus</div>
              <div><strong>Coffee Roasted Rule 7B(2):</strong> 60% Agri / 40% Bus</div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffbeb;">
            <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">2. Partial Integration Applicability Checklist</span>
            <div style="text-align: left; margin-top: 8px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
              <div>✔ Net Agricultural Income u/s 2(1A) <strong>exceeds ₹5,000 p.a.</strong></div>
              <div style="margin-top: 2px;">✔ Non-Agri Income <strong>exceeds Basic Exemption Limit</strong> (e.g. ₹4,00,000)</div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5;">
            <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">3. Step-by-Step Integration Tax Engine math</span>
            <div style="text-align: left; margin-top: 8px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
              <div><strong>Step A:</strong> Calculate tax on standard sum: [Agri Income + Non-Agri Income]</div>
              <div><strong>Step B:</strong> Calculate tax on exempt sum: [Agri Income + Basic Exemption Limit]</div>
              <div style="font-weight: 800; color: #047857; margin-top: 4px; padding: 4px; background-color: #d1fae5; border-radius: 4px;">
                NET PAYABLE TAX = [Step A Tax] - [Step B Tax]
              </div>
            </div>
          </div>
        </div>
      `;
    case 'DT - Chapter 4: Capital Asset Exclusion & SOH Period Test':
      return `
        <div class="print-flowchart">
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Capital Asset Scope Test u/s 2(14)</span>
            <div style="text-align: left; margin-top: 4px; font-size: 8.5px; line-height: 1.35; font-family: 'Inter', sans-serif;">
              <div><strong>Included:</strong> Mobiles, immovable property, corporate securities, jewelry, artwork, archaeological drawings.</div>
              <div style="margin-top: 3px;"><strong>Excluded:</strong> Stock-in-trade, personal effects, gold deposit certificates, rural agricultural land.</div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5;">
            <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">2. Period of Holding (SOH) Slabs</span>
            <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.45; font-family: 'Inter', sans-serif;">
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">
                <strong>12 Months Threshold:</strong> Listed equity shares, units of equity mutual funds, Zero Coupon Bonds.
                  </div>
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 3px;">
                <strong>24 Months Threshold:</strong> Land or building (Immovable property), unlisted shares.
              </div>
              <div style="margin-top: 3px;">
                <strong>36 Months Threshold:</strong> Debt mutual funds (prior to 1.4.23), gold, other assets.
              </div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #ef4444; background-color: #fef2f2;">
            <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">3. Deemed Short Term Capital Asset (STCA) Exception</span>
            <p style="text-align: center; margin: 4px 0 0 0; font-size: 8.5px; line-height: 1.4; font-weight: 600; font-family: 'Inter', sans-serif;">
              Debt Mutual Funds (acquired on/after 1.4.2023), Market Linked Debentures (MLDs), and unlisted bonds are statutorily deemed STCA regardless of holding period.
            </p>
          </div>
        </div>
      `;
    case 'DT - Chapter 5: Gift & Deemed Dividend Taxability Flow':
      return `
        <div class="print-flowchart">
          <div class="print-flowchart-card" style="border-color: #6366f1; background-color: #f5f3ff;">
            <span class="print-flowchart-badge" style="background-color: #ddd6fe; color: #5b21b6;">1. Deemed Dividend u/s 2(22)</span>
            <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">
                <strong>Type (a) to (d):</strong> Asset distributions, preference bonus shares, capital reductions, liquidation.
              </div>
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 3px;">
                <strong>Type (e):</strong> Closely held company lending money to beneficial owner (≥10% voting seats) or substantial interest concern.
              </div>
              <div style="margin-top: 3px; font-weight: 600; color: #b91c1c;">
                Capped up to accumulated profits balance. Repayment during PY cannot reduce taxability.
              </div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffff7;">
            <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">2. Gifts & Transfers u/s 56(2)(x)</span>
            <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.45; font-family: 'Inter', sans-serif;">
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;">
                <strong>Sum of Money:</strong> Taxable if aggregate PY sum without consideration exceeds ₹50,000.
              </div>
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 3px;">
                <strong>Immovable Property:</strong> Without consideration if SDV exceeds ₹50,000. Inadequate: difference (SDV - Price) &gt; ₹50,000 AND &gt; 10% of Consideration.
              </div>
              <div style="margin-top: 3px;">
                <strong>Movable Property (jewelry, shares, art):</strong> Taxable if aggregate under-price difference exceeds ₹50,000.
              </div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5;">
            <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">3. Statutory Gift Exemptions</span>
            <p style="text-align: left; margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; font-family: 'Inter', sans-serif;">
              Fully exempt u/s 56(2)(x) if received: from specified <strong>Relatives</strong> (spouse, siblings of self/spouse, parent siblings, lineal ascendants/descendants + spouses); on the occasion of <strong>Marriage</strong>; under <strong>Will or inheritance</strong>; or from registered <strong>Trusts u/s 12A/12AB</strong>.
            </p>
          </div>
        </div>
      `;
    case 'GST Supply Determination Flow':
      return `
        <div class="print-flowchart">
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 1: Core Ambit Screening Sec 2(52)/2(102)</span>
            <h5 style="margin: 4px 0; font-size: 9.5px; font-weight: 800; font-family: 'Inter', sans-serif;">Supply of Goods u/s 2(52) or Services u/s 2(102)?</h5>
            <p style="margin: 0; font-size: 8.5px; color: #475569; font-family: 'Inter', sans-serif;">Must represent movable property or conversion/use of money.</p>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 2: Consideration & Deeming Test Sec 7(1)(a)/(c)</span>
            <h5 style="margin: 4px 0; font-size: 9.5px; font-weight: 800; font-family: 'Inter', sans-serif;">Is a contractual Consideration charged?</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 6px; font-family: 'Inter', sans-serif;">
              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 4px; padding: 4px; font-size: 8px;">
                <strong>YES:</strong> Taxable u/s 7(1)(a) / 7(1)(b)
              </div>
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 4px; padding: 4px; font-size: 8px;">
                <strong>NO:</strong> Only if covered under Schedule I
              </div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 3: Commercial Intent Sec 7(1)(a)</span>
            <h5 style="margin: 4px 0; font-size: 9.5px; font-weight: 800; font-family: 'Inter', sans-serif;">In Course or Furtherance of Business?</h5>
            <p style="margin: 0; font-size: 8.5px; color: #475569; font-family: 'Inter', sans-serif;">Exception: Importation of services for consideration u/s 7(1)(b) is always taxable.</p>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
            <div class="print-flowchart-card" style="border-color: #f87171; background-color: #fef2f2; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">Schedule III Negative List</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                If listed under Schedule III (employee duties, funeral, sale of land, actionable claims other than lottery/betting), it's a non-supply.
              </p>
            </div>
            <div class="print-flowchart-card" style="border-color: #34d399; background-color: #ecfdf5; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">Fully Taxable Supply</span>
              <p style="margin: 4px 0 0 0; font-size: 8.5px; line-height: 1.35; text-align: left; font-weight: 600; font-family: 'Inter', sans-serif;">
                Transaction meets all elements u/s 7(1). Subject to GST levy, credit ledger flow, and tax invoice compliance.
              </p>
            </div>
          </div>
        </div>
      `;
    case 'GST Composition Levy & RCM Logic Flow':
      return `
        <div class="print-flowchart">
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 1: Preceding FY Aggregate Turnover Limit u/s 10(1)</span>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; margin-top: 6px; font-size: 8.5px; font-family: 'Inter', sans-serif;">
              <div><strong>General States:</strong> Limit ≤ ₹1.5 Crore</div>
              <div><strong>8 Special States:</strong> Limit ≤ ₹75 Lakh</div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div class="print-flowchart-card">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">Step 2: Composition Levy Slabs & Rates u/s 10</span>
            <div style="text-align: left; margin-top: 6px; font-size: 8.5px; line-height: 1.4; font-family: 'Inter', sans-serif;">
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px;"> Manufacturers: 1% of State Turnover</div>
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 2px;"> Restaurant Services: 5% of State Turnover</div>
              <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 2px; margin-top: 2px;"> Traders: 1% of Taxable Supplies</div>
              <div style="margin-top: 2px;"> Services Composition u/s 10(2A): 6% (Limit ≤ ₹50L preceding FY)</div>
            </div>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
            <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffbeb; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">Marginal Services Proviso</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                Goods composition supplier can provide services up to 10% of State Turnover in preceding FY or ₹5 Lakh (whichever is higher). Bank FD interest excluded.
              </p>
            </div>
            <div class="print-flowchart-card" style="border-color: #ef4444; background-color: #fef2f2; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #fee2e2; color: #991b1b;">Strict Restrictions Checklist</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                <strong>Forbidden:</strong> Cannot collect tax from customers, cannot claim any ITC, cannot make inter-state outward supplies, cannot sell through ECO.
              </p>
            </div>
          </div>
        </div>
      `;
    case 'GST Aadhaar Authentication & Verification pathways':
      return `
        <div class="print-flowchart">
          <div style="text-align: left; width: 100%; font-weight: bold; font-size: 10px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; color: #374151; font-family: 'Inter', sans-serif;">PATHWAY A: Aadhaar Authentication (Rule 10B/25)</div>
          <div class="print-flowchart-card" style="margin-top: 4px;">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. Registration Opt-in</span>
            <p style="margin: 3px 0 0 0; font-size: 8.5px; font-family: 'Inter', sans-serif;">Applicant opts-in for Aadhaar Authentication during online registration u/s 25.</p>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
            <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">Authentication Success u/s 10B</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                Deemed Approved. Registration is granted within 7 working days. Physical verification of place of business can be completely waived unless high risk is flagged.
              </p>
            </div>
            <div class="print-flowchart-card" style="border-color: #f59e0b; background-color: #fffbeb; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #fef3c7; color: #92400e;">Failure / Opt-out Rule 25</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                Physical verification of business premises is compulsory under Rule 25 before registration. Aadhaar biometric photo matching is required. Approval timeline is 30 days.
              </p>
            </div>
          </div>
          
          <div style="text-align: left; width: 100%; font-weight: bold; font-size: 10px; border-bottom: 1.5px solid #cbd5e1; padding-bottom: 3px; margin-top: 20px; color: #374151; font-family: 'Inter', sans-serif;">PATHWAY B: Amendment Categories (Sec 28)</div>
          <div class="print-flowchart-card" style="margin-top: 4px;">
            <span class="print-flowchart-badge" style="background-color: #eef2ff; color: #3730a3;">1. proper officer initial action u/s 28</span>
            <p style="margin: 3px 0 0 0; font-size: 8.5px; font-family: 'Inter', sans-serif;">Officer reviews registration details or requested amendments. SCN can be issued u/s 28.</p>
          </div>
          <div class="print-flowchart-arrow"></div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; width: 100%; max-width: 480px;">
            <div class="print-flowchart-card" style="border-color: #3b82f6; background-color: #eff6ff; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #dbeafe; color: #1e40af;">Core Fields Amendment</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                Required fields like legal name, business address, directors. Requires proper officer approval in 15 working days.
              </p>
            </div>
            <div class="print-flowchart-card" style="border-color: #10b981; background-color: #ecfdf5; max-width: 100%;">
              <span class="print-flowchart-badge" style="background-color: #d1fae5; color: #065f46;">Non-Core Fields Amendment</span>
              <p style="margin: 4px 0 0 0; font-size: 8px; line-height: 1.35; text-align: left; font-family: 'Inter', sans-serif;">
                Contacts, other secondary info. Automatic direct system update, no physical officer action required.
              </p>
            </div>
          </div>
        </div>
      `;
    default:
      return `<div class="diagram-container">${title} Flowchart Summary</div>`;
  }
};

interface PrintPreviewProps {
  practiceAttempts: PracticeAttempt[];
  bookmarkedSections: BookmarkedSection[];
  onClose: () => void;
}

export default function PrintPreview({ 
  practiceAttempts, 
  bookmarkedSections, 
  onClose 
}: PrintPreviewProps) {
  const caLevel = useCALevel();
  const levelConfig = getLevelConfig(caLevel);
  const levelSubjectIds = getLevelSubjectIds(caLevel);
  const levelSubjectsSet = new Set<string>(levelSubjectIds);

  // Config selection states
  const [includeProgress, setIncludeProgress] = useState(true);
  const [includeWeakChapters, setIncludeWeakChapters] = useState(true);
  const [includeBookmarks, setIncludeBookmarks] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState<Record<string, boolean>>({});
  const [layoutMode, setLayoutMode] = useState<'standard' | 'condensed' | 'print-friendly'>('standard');
  const [isPrintFriendly, setIsPrintFriendly] = useState(true);

  // Compile stats
  const [overallStats, setOverallStats] = useState({ total: 0, correct: 0, accuracy: 0 });
  const [subjectStats, setSubjectStats] = useState<Record<string, { total: number; correct: number; accuracy: number }>>({});
  const [chapterStats, setChapterStats] = useState<Record<string, { total: number; correct: number; accuracy: number; subject: SubjectId }>>({});

  useEffect(() => {
    // 1. Overall stats
    const total = practiceAttempts.length;
    const correct = practiceAttempts.filter(a => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    setOverallStats({ total, correct, accuracy });

    // 2. Subject stats
    const subBreakdown: Record<string, { total: number; correct: number; accuracy: number }> = {};
    levelSubjectIds.forEach(key => {
      subBreakdown[key] = { total: 0, correct: 0, accuracy: 0 };
    });
    practiceAttempts.forEach(attempt => {
      if (subBreakdown[attempt.subjectId]) {
        subBreakdown[attempt.subjectId].total += 1;
        if (attempt.isCorrect) {
          subBreakdown[attempt.subjectId].correct += 1;
        }
      }
    });
    Object.keys(subBreakdown).forEach(key => {
      const item = subBreakdown[key];
      item.accuracy = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
    });
    setSubjectStats(subBreakdown);

    // 3. Chapter stats
    const chapBreakdown: Record<string, { total: number; correct: number; accuracy: number; subject: SubjectId }> = {};
    practiceAttempts.forEach(attempt => {
      const key = `${attempt.subjectId} - ${attempt.chapterName}`;
      if (!chapBreakdown[key]) {
        chapBreakdown[key] = { total: 0, correct: 0, accuracy: 0, subject: attempt.subjectId };
      }
      chapBreakdown[key].total += 1;
      if (attempt.isCorrect) {
        chapBreakdown[key].correct += 1;
      }
    });
    Object.keys(chapBreakdown).forEach(key => {
      const item = chapBreakdown[key];
      item.accuracy = Math.round((item.correct / item.total) * 100);
    });
    setChapterStats(chapBreakdown);

    // Default select all available chapters for the active CA level
    const initialSelected: Record<string, boolean> = {};
    Object.entries(CHAPTER_SUMMARIES).forEach(([subId, list]) => {
      if (!levelSubjectsSet.has(subId)) return;
      list.forEach(summary => {
        initialSelected[`${subId} - ${summary.chapterName}`] = true;
      });
    });
    setSelectedChapters(initialSelected);
  }, [practiceAttempts, caLevel]);

  // Find weakest chapters
  const weakestChapters = (Object.entries(chapterStats) as [string, { total: number; correct: number; accuracy: number; subject: SubjectId }][])
    .filter(([_, stats]) => stats.total > 0)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 5);

  const toggleChapterSelection = (key: string) => {
    setSelectedChapters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrint = () => {
    const pane = document.getElementById('report-preview-pane');
    if (pane) {
      const clone = pane.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('button, input, select, .no-print').forEach(el => el.remove());
      // Strip static mockup preview header and footer so exportToPdfEngine's repeating per-page header/footer is used
      clone.querySelectorAll('div').forEach(el => {
        if ((el.textContent?.trim().startsWith('practACE') || el.textContent?.trim().startsWith('pract.CA')) && el.textContent?.includes('CA ')) {
          el.remove();
        }
        if (el.textContent?.includes('Plan. Revise. Analyse. Correct. Track. CA')) {
          el.remove();
        }
      });
      exportToPdfEngine(`${levelConfig.shortName.replace(/\s+/g, '_')}_Study_Pack`, clone.outerHTML);
    } else {
      window.print();
    }
  };

  const handleDownloadAsPDF = async () => {
    handlePrint();
  };

  // Build a self-contained beautifully formatted printable HTML string that can be downloaded offline
  const handleDownloadHtml = () => {
    const activeChaptersList: string[] = [];
    Object.entries(CHAPTER_SUMMARIES).forEach(([subId, list]) => {
      if (!levelSubjectsSet.has(subId)) return;
      list.forEach(summary => {
        const key = `${subId} - ${summary.chapterName}`;
        if (selectedChapters[key]) {
          activeChaptersList.push(key);
        }
      });
    });

    const currentTimestamp = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'long',
      timeStyle: 'medium'
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>practACE - Comprehensive Offline Revision & Progress Study Pack</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      background-color: #ffffff;
      margin: 0;
      padding: 40px;
    }

    /* Print styling rules */
    @media print {
      body {
        padding: 0;
        background-color: #ffffff;
        color: #000000;
        font-size: 11pt;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-before: always;
        break-before: page;
      }
      .avoid-break {
        page-break-inside: avoid;
        break-inside: avoid;
      }
    }

    * {
      box-sizing: border-box;
    }

    /* Layout Utility CSS */
    .container {
      max-width: 850px;
      margin: 0 auto;
    }

    .header-layout {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .brand-title {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #0f172a;
      margin: 0 0 5px 0;
    }

    .brand-sub {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }

    .meta-mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      text-align: right;
      color: #64748b;
    }

    .section-title {
      font-size: 18px;
      font-weight: 800;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 8px;
      margin-top: 30px;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
    }

    /* Grid cards */
    .grid-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 25px;
    }

    .stat-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 15px;
      background-color: #f8fafc;
    }

    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .stat-val {
      font-size: 22px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 5px;
    }

    /* Dashboard table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }

    th {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 705;
      text-transform: uppercase;
      font-size: 11px;
      color: #475569;
      background-color: #f1f5f9;
      border-bottom: 2px solid #cbd5e1;
      padding: 10px 12px;
      text-align: left;
    }

    td {
      padding: 10px 12px;
      border-bottom: 1.5px solid #e2e8f0;
      font-size: 12px;
    }

    .badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      padding: 3px 6px;
      border-radius: 4px;
      background-color: #f1f5f9;
      color: #334155;
    }

    .badge-error {
      background-color: #fee2e2;
      color: #b91c1c;
    }

    .text-mono {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }

    /* Principles summaries format */
    .chapter-block {
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      margin-bottom: 30px;
      overflow: hidden;
    }

    .chapter-header {
      background-color: #0f172a;
      color: #ffffff;
      padding: 15px 20px;
    }

    .chapter-title {
      font-size: 16px;
      font-weight: 800;
      margin: 0;
    }

    .chapter-sub {
      font-size: 11px;
      color: #94a3b8;
      margin: 5px 0 0 0;
    }

    .chapter-body {
      padding: 20px;
    }

    /* Column and card density styles based on layout mode selection */
    .bookmarks-grid {
      display: ${layoutMode === 'condensed' ? 'grid' : 'block'};
      grid-template-columns: ${layoutMode === 'condensed' ? 'repeat(2, 1fr)' : '1fr'};
      gap: ${layoutMode === 'condensed' ? '12px' : '0'};
    }

    .principles-grid {
      display: ${layoutMode === 'condensed' ? 'grid' : 'block'};
      grid-template-columns: ${layoutMode === 'condensed' ? 'repeat(2, 1fr)' : '1fr'};
      gap: ${layoutMode === 'condensed' ? '15px' : '0'};
    }

    .principle-card {
      margin-bottom: ${layoutMode === 'condensed' ? '0' : '20px'};
      border: ${layoutMode === 'condensed' ? '1px solid #e2e8f0' : 'none'};
      border-bottom: ${layoutMode === 'condensed' ? '1px solid #e2e8f0' : '1px dashed #e2e8f0'};
      border-radius: ${layoutMode === 'condensed' ? '12px' : '0'};
      padding: ${layoutMode === 'condensed' ? '12px' : '0 0 15px 0'};
      background-color: ${layoutMode === 'condensed' ? '#fafbfc' : 'transparent'};
    }

    .principle-card:last-child {
      border-bottom: ${layoutMode === 'condensed' ? '1px solid #e2e8f0' : 'none'};
      padding-bottom: ${layoutMode === 'condensed' ? '12px' : '0'};
      margin-bottom: 0;
    }

    .principle-header {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 8px;
    }

    .principle-description {
      font-size: 12px;
      color: #334155;
      line-height: 1.6;
    }

    .alert-box {
      background-color: #fffbeb;
      border-left: 4px solid #f59e0b;
      padding: 12px 15px;
      border-radius: 0 8px 8px 0;
      font-size: 11.5px;
      margin-top: 10px;
      color: #78350f;
    }

    .alert-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .example-box {
      background-color: #faf5ff;
      border-left: 4px solid #8b5cf6;
      padding: 12px 15px;
      border-radius: 0 8px 8px 0;
      font-size: 11.5px;
      margin-top: 10px;
      color: #4c1d95;
    }

    .example-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .diagram-container {
      background-color: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 12px;
      padding: 15px;
      margin-top: 15px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      white-space: pre;
      overflow-x: auto;
      color: #334155;
      line-height: 1.3;
    }

    /* Print instruction banner */
    .print-banner {
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      padding: 15px;
      margin-bottom: 25px;
      font-size: 12px;
      color: #1e40af;
    }

    .print-banner-title {
      font-weight: 700;
      margin-bottom: 5px;
    }

    .action-btn {
      background-color: #0f172a;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 10px 18px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-right: 10px;
    }

    .action-btn-secondary {
      background-color: #f1f5f9;
      color: #334155;
      border: 1px solid #cbd5e1;
    }

    .action-btn:hover {
      opacity: 0.9;
    }

    /* Dynamic Flowchart Print Styling */
    .print-flowchart {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      width: 100%;
      margin-top: 15px;
      margin-bottom: 15px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .print-flowchart-card {
      padding: 10px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      background-color: #f8fafc;
      width: 100%;
      max-width: 480px;
      text-align: center;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      page-break-inside: avoid;
      break-inside: avoid;
    }
    .print-flowchart-arrow {
      height: 16px;
      width: 2px;
      background-color: #94a3b8;
      position: relative;
    }
    .print-flowchart-arrow::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -3px;
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #94a3b8;
    }
    .print-flowchart-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
    }
  </style>
</head>
<body>

  <!-- Print Instruction Banner (Hidden when printed) -->
  <div class="print-banner no-print">
    <div class="print-banner-title">💡 Formatted Offline Revision Study Pack Ready</div>
    <div>This file is designed for perfect offline reading or PDF conversion. Press the <strong>Print study pack</strong> button to print or "Save as PDF" through your browser's print options. Set paper orientation to Portrait, enable background headers/footers, and enable background graphics for best results.</div>
    <div style="margin-top: 12px;">
      <button class="action-btn" onclick="window.print()">
        Print study pack
      </button>
      <button class="action-btn action-btn-secondary" onclick="window.close();">
        Close tab
      </button>
    </div>
  </div>

  <div class="container">
    
    <!-- BRAND HEADER -->
    <div style="background-color: #00102a; border-bottom: 3px solid #c99e3b; padding: 12px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: baseline; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight: 900; font-size: 24px; line-height: 1; letter-spacing: -0.5px;">
        <span style="color: #ffffff;">pract</span><span style="color: #e5a93c; margin-left: 2px;">CA</span>
      </div>
      <div style="color: #f1f5f9; font-size: 12px; font-weight: 500;">${levelConfig.shortName} <span style="color: #94a3b8; margin: 0 6px;">|</span> Revision Study Pack</div>
    </div>

    <!-- 1. METRICS OVERVIEW -->
    ${includeProgress ? `
    <div class="avoid-break">
      <h2 class="section-title">1. Executive Revision Metrics</h2>
      <div class="grid-stats">
        <div class="stat-card">
          <div class="stat-label">Revision syllabus Accuracy</div>
          <div class="stat-val" style="color: ${overallStats.accuracy >= 75 ? '#10b981' : '#f59e0b'}">${overallStats.accuracy}%</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Correct Answers Mapped</div>
          <div class="stat-val">${overallStats.correct} / ${overallStats.total} <span style="font-size: 12px; color: #64748b;">Correct</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Syllabus Class Standing</div>
          <div class="stat-val">${overallStats.accuracy >= 75 ? 'First Class Distinction' : overallStats.accuracy >= 50 ? 'Pass Standard' : 'Revising'}</div>
        </div>
      </div>

      <h3 style="font-size: 14px; text-transform: uppercase; margin-bottom: 10px; color: #475569;">Subject Diagnostic Breakdown</h3>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Name u/s ICAI</th>
            <th>Attempts</th>
            <th>Accuracy %</th>
            <th>Revision Status</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(SUBJECTS_METADATA).filter(([id]) => levelSubjectsSet.has(id)).map(([id, metadata]) => {
            const stats = subjectStats[id] || { total: 0, correct: 0, accuracy: 0 };
            const speedIndicator = stats.total > 0 
              ? (stats.accuracy >= 75 ? '<span style="color: #10b981; font-weight:700">OPTIMAL</span>' : stats.accuracy >= 50 ? '<span style="color: #f59e0b; font-weight:700">MEDIUM</span>' : '<span style="color: #ef4444; font-weight:700">ALERT</span>')
              : '<span style="color: #94a3b8">UNSEEDED</span>';
            return `
            <tr>
              <td class="text-mono" style="font-size: 12px; font-weight: 700;">${id}</td>
              <td style="text-transform: capitalize; font-weight: 500;">${metadata.fullName}</td>
              <td class="text-mono">${stats.total}</td>
              <td class="text-mono" style="font-weight: 700; color: ${stats.total > 0 ? (stats.accuracy >= 75 ? '#10b981' : stats.accuracy >= 50 ? '#d97706' : '#b91c1c') : '#94a3b8'}">${stats.total > 0 ? stats.accuracy + '%' : 'Unattempted'}</td>
              <td>${speedIndicator}</td>
            </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <!-- 2. DIAGNOSTIC WEAK CHAPTERS AUDIT -->
    ${includeWeakChapters && weakestChapters.length > 0 ? `
    <div class="avoid-break page-break">
      <h2 class="section-title">2. Curriculum Hot-Spot Alerts (Weakest Syllabus Chapters)</h2>
      <p style="font-size: 12px; color: #64748b; margin-top: -10px; margin-bottom: 15px;">
        The system has detected critical knowledge gaps based on mock evaluations below 70% accuracy. Prioritize deep review for these sectors instantly.
      </p>
      <table>
        <thead>
          <tr>
            <th>Curriculum Sector</th>
            <th>Subject Ref</th>
            <th>Evaluations Run</th>
            <th>Incorrect Mappings</th>
            <th>Current Accuracy Score</th>
          </tr>
        </thead>
        <tbody>
          ${weakestChapters.map(([title, stats]) => `
          <tr>
            <td style="font-weight: 700; font-size: 12px; color: #0f172a;">${title.split(' - ')[1]}</td>
            <td class="text-mono">${stats.subject}</td>
            <td class="text-mono">${stats.total}</td>
            <td class="text-mono" style="color: #ef4444;">${stats.total - stats.correct}</td>
            <td class="text-mono" style="font-weight: 800; color: #ef4444; font-size: 13px;">${stats.accuracy}%</td>
          </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    ` : ''}

    <!-- 3. FAVORITES DECK / BOOKMARKS -->
    ${includeBookmarks && bookmarkedSections.length > 0 ? `
    <div class="avoid-break">
      <h2 class="section-title">3. Bookmarked statutory Rules & Exemption Codes</h2>
      <p style="font-size: 12px; color: #64748b; margin-top: -10px; margin-bottom: 15px;">
        Selected key statutes preserved for high-frequency offline lookup and legal mapping u/s Direct and Indirect Taxation.
      </p>
      <div class="bookmarks-grid">
        ${bookmarkedSections.map(sec => `
          <div style="border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 15px; background-color: #fafbfc; ${layoutMode === 'condensed' ? 'margin-bottom: 0;' : 'margin-bottom: 12px;'}">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span class="badge" style="background-color: #e0e7ff; color: #3730a3; font-weight: 800; font-family: 'JetBrains Mono';">${sec.subjectId}</span>
              <span class="text-mono" style="font-size: 11.5px; color: #475569;">${sec.number}</span>
            </div>
            <h4 style="margin: 0 0 6px 0; font-size: 13px; font-weight: 750; color: #0f172a;">${sec.heading}</h4>
            <p style="margin: 0; font-size: 11.5px; color: #334155; line-height: 1.5;">${sec.purpose}</p>
          </div>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- 4. CHAPTER REVISION CHEAT SHEET SHEET -->
    ${activeChaptersList.length > 0 ? `
    <div class="page-break">
      <h2 class="section-title">4. Formatted Syllabus Revision summaries</h2>
      <p style="font-size: 12px; color: #64748b; margin-top: -10px; margin-bottom: 20px;">
        Exam-focused breakdown in structured logic: Statutory Rule, Exceptions, Examples, and schematic diagrams compiled u/s 7, 8 and Schedules.
      </p>

      ${Object.entries(CHAPTER_SUMMARIES).map(([subId, list]) => {
        return list.map(summary => {
          const key = `${subId} - ${summary.chapterName}`;
          if (!selectedChapters[key]) return '';

          return `
          <div class="chapter-block avoid-break">
            <div class="chapter-header">
              <h3 class="chapter-title">${summary.chapterName}</h3>
              <p class="chapter-sub">Subject Course: ${subId} | Core Exam Syllabus Summary</p>
            </div>
            <div class="chapter-body">
              <div class="principles-grid">
                ${summary.keyPrinciples.map((origPrinciple) => `
                  <div class="principle-card">
                    <div class="principle-header">
                      <span style="font-weight: 800;">${origPrinciple.title}</span>
                      <span class="badge">RULE CODE</span>
                    </div>
                    <div class="principle-description">
                      ${origPrinciple.description}
                    </div>
                    
                    ${origPrinciple.exception ? `
                      <div class="alert-box">
                        <div class="alert-title">⚠️ Statutory Exception / Exam Trap</div>
                        <div>${origPrinciple.exception}</div>
                      </div>
                    ` : ''}

                    ${origPrinciple.example ? `
                      <div class="example-box">
                        <div class="example-title">💡 Worked Application Example</div>
                        <div style="font-style: italic;">${origPrinciple.example}</div>
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>

              ${summary.visualBreakdown && summary.visualBreakdown.type === 'flow' ? `
                <h4 style="font-size: 11.5px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; margin-top: 20px; margin-bottom: 8px;">Diagrammatic Logic Blueprint: ${summary.visualBreakdown.title}</h4>
                <div style="background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; margin-top: 10px;">
                  ${getFlowchartHtmlForPrint(summary.visualBreakdown.title)}
                </div>
              ` : ''}

              ${summary.visualBreakdown && summary.visualBreakdown.content ? `
                <h4 style="font-size: 11.5px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; margin-top: 20px; margin-bottom: 8px;">Diagrammatic Logic Blueprint</h4>
                <div class="diagram-container">${summary.visualBreakdown.content}</div>
              ` : ''}

              ${summary.visualBreakdown && summary.visualBreakdown.type !== 'flow' && summary.visualBreakdown.headers && summary.visualBreakdown.rows ? `
                <h4 style="font-size: 11.5px; text-transform: uppercase; color: #475569; letter-spacing: 0.05em; margin-top: 20px; margin-bottom: 8px;">Visual Table Summary: ${summary.visualBreakdown.title}</h4>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px;">
                  <thead>
                    <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
                      ${summary.visualBreakdown.headers.map((h: any) => `<th style="padding: 8px; text-align: left; font-weight: 700; color: #334155;">${h}</th>`).join('')}
                    </tr>
                  </thead>
                  <tbody>
                    ${summary.visualBreakdown.rows.map((row: any) => `
                      <tr style="border-bottom: 1px solid #e2e8f0;">
                        ${row.map((cell: any, cIdx: number) => `<td style="padding: 8px; ${cIdx === 0 ? 'font-weight: 700; color: #4f46e5;' : ''}">${cell}</td>`).join('')}
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : ''}
            </div>
          </div>
          `;
        }).join('');
      }).join('')}

    </div>
    ` : ''}

    <!-- FOOTER SIGN-OFF -->
    <div style="margin-top: 32px; border-top: 2px solid #c99e3b; padding-top: 8px; text-align: center; font-size: 11px; font-weight: 700; color: #0f172a; letter-spacing: 0.015em;">
      practACE — ${levelConfig.shortName} Revision Material
    </div>

  </div>

</body>
</html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `practACE_Revision_Study_Pack_${new Date().toISOString().slice(0,10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ModalPortal>
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      id="print-preview-modal-overlay"
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden relative"
        id="print-preview-modal-content"
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Create Printable Revision PDF & Study Pack
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize, preview, and export a formatted study sheet for offline revisión.
              </p>
            </div>
          </div>
          <button 
            id="close-print-preview-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Workspace - Split Panel */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          
          {/* Left panel - Configurations (5 cols) */}
          <div className="lg:col-span-5 p-5 space-y-6">
            {/* Layout Mode Selection Toggle */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Layout Preference
              </h3>
              <div className="grid grid-cols-3 gap-2">
                <button
                  id="layout-standard-toggle"
                  onClick={() => { setLayoutMode('standard'); setIsPrintFriendly(false); }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    layoutMode === 'standard' && !isPrintFriendly
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">Standard</span>
                  <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">Single-col</span>
                </button>
                <button
                  id="layout-condensed-toggle"
                  onClick={() => { setLayoutMode('condensed'); setIsPrintFriendly(false); }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    layoutMode === 'condensed' && !isPrintFriendly
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">Condensed</span>
                  <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">Two-col</span>
                </button>
                <button
                  id="layout-printfriendly-toggle"
                  onClick={() => { setLayoutMode('print-friendly'); setIsPrintFriendly(true); }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center cursor-pointer transition ${
                    isPrintFriendly || layoutMode === 'print-friendly'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xs">Print-Friendly</span>
                  <span className="text-[9px] font-normal text-slate-400 dark:text-slate-500 mt-0.5">High Contrast</span>
                </button>
              </div>

              {/* Dedicated Print-Friendly Layout Toggle */}
              <div className="mt-3">
                <button
                  id="toggle-print-friendly-mode"
                  onClick={() => setIsPrintFriendly(!isPrintFriendly)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left w-full cursor-pointer transition ${
                    isPrintFriendly
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Printer className={`h-4 w-4 ${isPrintFriendly ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                    <div>
                      <span className="font-bold text-xs block text-slate-800 dark:text-slate-200">Print-Friendly Ink-Saver Layout</span>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">High-contrast white canvas with crisp borders and page-break optimization.</p>
                    </div>
                  </div>
                  {isPrintFriendly ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Include Sections
              </h3>
              <div className="space-y-3">
                <button
                  id="toggle-include-progress"
                  onClick={() => setIncludeProgress(!includeProgress)}
                  className="flex items-center gap-3 text-xs text-left w-full p-2.5 rounded-xl border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  {includeProgress ? <CheckSquare className="h-4 w-4 text-indigo-500" /> : <Square className="h-4 w-4 text-slate-400" />}
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">1. Student Revision Metrics</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Overall precision standings, scores, subject Diagnostic meters.</p>
                  </div>
                </button>

                <button
                  id="toggle-include-weak"
                  onClick={() => setIncludeWeakChapters(!includeWeakChapters)}
                  className="flex items-center gap-3 text-xs text-left w-full p-2.5 rounded-xl border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  {includeWeakChapters ? <CheckSquare className="h-4 w-4 text-indigo-500" /> : <Square className="h-4 w-4 text-slate-400" />}
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">2. Syllabus Gaps (Weak Sectors)</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Chapters where accuracy falls below 70% u/s automatic diagnostic.</p>
                  </div>
                </button>

                <button
                  id="toggle-include-bookmarks"
                  onClick={() => setIncludeBookmarks(!includeBookmarks)}
                  className="flex items-center gap-3 text-xs text-left w-full p-2.5 rounded-xl border dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  {includeBookmarks ? <CheckSquare className="h-4 w-4 text-indigo-500" /> : <Square className="h-4 w-4 text-slate-400" />}
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">3. Saved Exemption Codes</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Bookmark list u/s Direct Tax & Indirect Tax for immediate revision.</p>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
                Select Revision Cheat Sheets
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Include study sheets mapping key principles u/s GST, with worked case examples, exceptions, and schematic charts.
              </p>
              
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {Object.entries(CHAPTER_SUMMARIES).filter(([subId]) => levelSubjectsSet.has(subId)).map(([subId, list]) => {
                  if (list.length === 0) return null;
                  return list.map(summary => {
                    const key = `${subId} - ${summary.chapterName}`;
                    const isSelected = selectedChapters[key] || false;
                    return (
                      <button
                        key={key}
                        id={`toggle-chap-${key.replace(/\s+/g, '-')}`}
                        onClick={() => toggleChapterSelection(key)}
                        className="flex items-center gap-2.5 text-left w-full p-2 rounded-lg border dark:border-slate-850 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                      >
                        {isSelected ? <CheckSquare className="h-4 w-4 text-indigo-500 shrink-0" /> : <Square className="h-4 w-4 text-slate-400 shrink-0" />}
                        <div className="truncate">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{summary.chapterName}</span>
                          <span className="ml-1.5 text-[9px] uppercase tracking-wide font-bold px-1.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded shrink-0">
                            {subId}
                          </span>
                        </div>
                      </button>
                    );
                  });
                })}
              </div>
            </div>

            {/* Print advice warning */}
            <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-700 dark:text-amber-400 text-[11px] leading-relaxed select-none">
              <strong className="block uppercase tracking-wider text-[9px] font-mono mb-1 font-bold">⚠️ SANDBOX CONSTRAINTS IFRAME TIP:</strong>
              If you run into issues printing from the preview window, simply click the <strong>Download Offline Pack (.html)</strong> button! It compiles everything into a self-contained single-file webpage that you can keep, open offline, or print to PDF with absolute 100% perfection.
            </div>
          </div>

          {/* Right panel - Real-time Printable PDF mockup (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-950 p-6 flex flex-col justify-between overflow-hidden">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-3">
              Formatted Preview (Wyk-Dossier print format)
            </h3>
            
            <div 
              className="flex-1 bg-white border border-slate-200 rounded-xl p-6 overflow-y-auto text-slate-900 shadow-inner font-sans max-h-[450px]"
              id="report-preview-pane"
            >
              {/* Document Header mockup */}
              <div className="bg-[#00102a] border-b-[3px] border-[#c99e3b] -mx-6 -mt-6 px-5 py-3 mb-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BrandMark size="xs" showIcon />
                </div>
                <div className="text-[11px] font-medium text-slate-100">
                  {levelConfig.shortName} <span className="text-slate-400 mx-1">|</span> Revision Study Pack
                </div>
              </div>

              {/* 1. Progress Metrics Mockup */}
              {includeProgress && (
                <div className="mb-4">
                  <h5 className="text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-2 border-b border-slate-200 pb-0.5">1. Revision Metrics</h5>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[8px] text-slate-400 block uppercase">Accuracy</span>
                      <strong className="text-xs text-indigo-600">{overallStats.accuracy}%</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[8px] text-slate-400 block uppercase">Practice</span>
                      <strong className="text-xs text-slate-800">{overallStats.correct}/{overallStats.total}</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <span className="text-[8px] text-slate-400 block uppercase">Evals run</span>
                      <strong className="text-xs text-slate-800">{Math.ceil(practiceAttempts.length / 5)}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Weakest Sectors Mockup */}
              {includeWeakChapters && weakestChapters.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-2 border-b border-slate-200 pb-0.5">2. Critical Weak Curriculum Sectors</h5>
                  <div className="space-y-1.5">
                    {weakestChapters.map(([title, stats]) => (
                      <div key={title} className="p-2 border border-rose-100 bg-rose-50/40 rounded-lg flex justify-between items-center text-[10px]">
                        <div>
                          <span className="font-mono bg-rose-100 text-rose-700 text-[8px] font-bold px-1 py-0.5 rounded mr-1.5 uppercase">{stats.subject}</span>
                          <strong className="text-slate-800 font-semibold">{title.split(' - ')[1]}</strong>
                        </div>
                        <span className="text-rose-600 font-bold font-mono">{stats.accuracy}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Bookmarks Deck Mockup */}
              {includeBookmarks && bookmarkedSections.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-2 border-b border-slate-200 pb-0.5">3. Preserved Exemption Codes ({bookmarkedSections.length})</h5>
                  <div className={layoutMode === 'condensed' ? "grid grid-cols-2 gap-2" : "space-y-1"}>
                    {bookmarkedSections.slice(0, layoutMode === 'condensed' ? 4 : 3).map(sec => (
                      <div 
                        key={sec.number} 
                        className={layoutMode === 'condensed' 
                          ? "text-[9px] border border-slate-200 rounded-lg p-2 bg-white flex flex-col justify-between" 
                          : "text-[10px] border-b border-dashed border-slate-100 pb-1 flex justify-between text-slate-700"
                        }
                      >
                        <span className="font-bold text-slate-850 truncate max-w-[200px]">{sec.heading}</span>
                        <span className={layoutMode === 'condensed' 
                          ? "font-mono text-[8px] font-bold text-indigo-500 bg-indigo-50/50 px-1 py-0.2 rounded mt-1 self-start" 
                          : "font-mono text-[9px] font-bold text-slate-400"
                        }>
                          {sec.number}
                        </span>
                      </div>
                    ))}
                    {bookmarkedSections.length > (layoutMode === 'condensed' ? 4 : 3) && (
                      <div className={`text-[9px] text-slate-400 italic text-center pt-1 ${layoutMode === 'condensed' ? 'col-span-full' : ''}`}>
                        + {bookmarkedSections.length - (layoutMode === 'condensed' ? 4 : 3)} more saved bookmark entries...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Syllabus Summaries Mockup */}
              <div>
                <h5 className="text-[10px] uppercase font-bold text-slate-800 tracking-wider mb-2 border-b border-slate-200 pb-0.5">4. Dynamic Syllabus Summaries</h5>
                <div className={layoutMode === 'condensed' ? "grid grid-cols-2 gap-3" : "space-y-3"}>
                  {Object.entries(CHAPTER_SUMMARIES).filter(([subId]) => levelSubjectsSet.has(subId)).some(([subId, list]) => list.some(summary => selectedChapters[`${subId} - ${summary.chapterName}`])) ? (
                    Object.entries(CHAPTER_SUMMARIES).filter(([subId]) => levelSubjectsSet.has(subId)).map(([subId, list]) => {
                      return list.map(summary => {
                        const key = `${subId} - ${summary.chapterName}`;
                        if (!selectedChapters[key]) return null;
                        
                        return (
                          <div key={key} className="border border-slate-150 rounded-lg p-3 space-y-2 bg-slate-50/50">
                            <div className="flex justify-between items-center border-b border-slate-200/60 pb-1.5 mb-1.5">
                              <span className="text-[10px] font-extrabold text-slate-900 truncate">{summary.chapterName}</span>
                              <span className="bg-indigo-50 text-indigo-700 text-[8px] font-bold px-1.5 py-0.5 rounded font-mono">{subId}</span>
                            </div>
                            
                            <div className="space-y-1.5">
                              {summary.keyPrinciples.slice(0, 2).map((origPrinciple, pIdx) => (
                                <div key={pIdx} className="text-[9px] text-slate-600 leading-normal pl-1.5 border-l-2 border-indigo-500/20">
                                  <strong className="text-slate-850 block font-semibold">{origPrinciple.title}</strong>
                                  <span className="line-clamp-1 italic">{origPrinciple.description}</span>
                                </div>
                              ))}
                              {summary.keyPrinciples.length > 2 && <p className="text-[8px] text-slate-400 italic font-mono text-center pt-1">+ {summary.keyPrinciples.length - 2} more high-fidelity rule principles u/s summary...</p>}
                            </div>
                          </div>
                        );
                      });
                    })
                  ) : (
                    <p className="text-[10px] text-slate-400 italic">No syllabus cheat sheets selected.</p>
                  )}
                </div>
              </div>

              {/* Document Footer mockup */}
              <div className="mt-6 border-t-2 border-[#c99e3b] pt-2 text-center text-[10px] font-bold text-slate-900 tracking-wide">
                practACE — {levelConfig.shortName} Revision Material
              </div>
            </div>

            {/* Action deck */}
            <div className="flex gap-2.5 mt-5">
              <button
                id="modal-print-action-btn"
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-3 text-xs font-bold shadow-lg shadow-indigo-600/15 cursor-pointer transition"
              >
                <Printer className="h-4.5 w-4.5" />
                Print / Save as PDF
              </button>

              <button
                id="modal-download-action-btn"
                onClick={handleDownloadAsPDF}
                className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-750 text-white dark:text-slate-100 rounded-xl py-3 text-xs font-bold border dark:border-slate-700 cursor-pointer transition transform active:scale-95 duration-100"
                title="Download currently selected live revision sections, bookmarks, and chapters compiled into a pristine, high-fidelity A4 revision PDF."
              >
                <Download className="h-4.5 w-4.5" />
                Download Study Pack (PDF)
              </button>
            </div>

          </div>

        </div>
      </div>

    </div>
    </ModalPortal>
  );
}
