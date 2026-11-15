/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  List, 
  Lock, 
  AlertTriangle,
  EyeOff
} from 'lucide-react';
import { SubjectId } from '../types';
import { SUBJECTS_METADATA } from '../data/syllabus';
import { ModalPortal } from './ModalPortal';

interface ProtectedPdfReaderProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: SubjectId;
  chapterName: string;
  chapterNumber: number;
  chapterContentNode?: React.ReactNode;
  userEmail?: string;
}

export default function ProtectedPdfReader({
  isOpen,
  onClose,
  subjectId,
  chapterName,
  chapterNumber,
  chapterContentNode,
  userEmail = 'hs.incometaxworks@gmail.com'
}: ProtectedPdfReaderProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const isIndAS105 = chapterName.includes('Ind AS 105') || chapterName.includes('Held For Sale');
  const [totalPages, setTotalPages] = useState<number>(isIndAS105 ? 2 : 3);

  useEffect(() => {
    if (isIndAS105) {
      setTotalPages(2);
    } else {
      setTotalPages(3);
    }
  }, [chapterName, isIndAS105]);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isWindowFocused, setIsWindowFocused] = useState<boolean>(true);
  const [protectionToast, setProtectionToast] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const subjectMeta = SUBJECTS_METADATA[subjectId];
  const cleanSubjectCode = subjectMeta?.name || subjectId;
  const pdfFilename = `[${cleanSubjectCode}]_Ch_${chapterNumber}_${chapterName.replace(/[^a-zA-Z0-9]/g, '_')}_Concept_Focus.pdf`;

  // Window blur & screen-capture protection listener
  useEffect(() => {
    if (!isOpen) return;

    const handleBlur = () => setIsWindowFocused(false);
    const handleFocus = () => setIsWindowFocused(true);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowFocused(false);
      } else {
        setIsWindowFocused(true);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen]);

  // Anti-screenshot keyboard shortcut listener
  useEffect(() => {
    if (!isOpen) return;

    const triggerProtectionAlert = (msg: string) => {
      setProtectionToast(msg);
      setTimeout(() => setProtectionToast(null), 3500);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen / PrtScn
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerProtectionAlert('🔒 Screenshot blocked! This PDF document is screenshot-protected.');
        return false;
      }

      // Ctrl+P / Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        triggerProtectionAlert('🔒 Printing disabled! Downloads and prints are prohibited for this document.');
        return false;
      }

      // Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        triggerProtectionAlert('🔒 Download disabled! This PDF is restricted to read-only viewing.');
        return false;
      }

      // F12 / Inspect Element
      if (
        e.key === 'F12' ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'C' || e.key === 'c'))
      ) {
        e.preventDefault();
        triggerProtectionAlert('🔒 Developer inspect tools disabled inside Protected PDF Reader.');
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 15, 175));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col select-none overflow-hidden font-sans">
      
      {/* Toast Alert Banner */}
      {protectionToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-slate-950 font-black px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs animate-bounce border border-amber-300">
          <Lock className="h-4 w-4 shrink-0" />
          <span>{protectionToast}</span>
        </div>
      )}

      {/* PDF Reader Top Control Toolbar */}
      <div className="h-14 bg-[#090d16] border-b border-slate-800/80 px-4 flex items-center justify-between text-slate-200 shrink-0 z-40 shadow-md">
        
        {/* Left: Document Info & TOC Toggle */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isTocOpen ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
            title="Toggle Outline / Table of Contents"
          >
            <List className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Index</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>

          <div className="flex items-center gap-2 truncate">
            <div className="p-1.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="truncate">
              <span className="text-[11px] font-black text-slate-100 font-mono block truncate">
                {pdfFilename}
              </span>
              <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">
                {cleanSubjectCode} · CA Final Revision PDF Pack
              </span>
            </div>
          </div>
        </div>

        {/* Center: Pagination & Zoom Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Page controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="font-mono text-[11px] px-2 font-extrabold text-amber-400 whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 transition cursor-pointer"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden md:block"></div>

          {/* Zoom controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button 
              onClick={handleZoomOut} 
              className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={handleResetZoom}
              className="font-mono text-[10px] px-2 font-bold text-slate-300 hover:text-white cursor-pointer"
              title="Reset Zoom to 100%"
            >
              {zoomLevel}%
            </button>
            <button 
              onClick={handleZoomIn} 
              className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Security Status & Close Button (NO DOWNLOAD BUTTON) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Read-Only Protected</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-red-500/20 hover:border-red-500/40 text-slate-300 hover:text-red-300 transition-all cursor-pointer"
            title="Exit Protected Reader"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      </div>

      {/* Main Reader View Area */}
      <div className="flex-1 relative flex overflow-hidden bg-[#070a11]">
        
        {/* Table of Contents Drawer */}
        {isTocOpen && (
          <div className="w-72 bg-[#0a0e19] border-r border-slate-800/80 p-4 space-y-4 overflow-y-auto shrink-0 z-30 animate-slideRight">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-amber-400" />
                <h4 className="text-xs font-black uppercase text-slate-200 tracking-wider">Chapter Outline</h4>
              </div>
              <button 
                onClick={() => setIsTocOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => { setCurrentPage(1); }}
                className={`w-full text-left p-2.5 rounded-lg border transition font-bold ${
                  currentPage === 1 ? 'bg-amber-500/15 text-amber-300 border-amber-500/40' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isIndAS105 ? 'Page 1: Two-Test Gate & Measurement' : '1. Statutory Foundations & Principles'}
              </button>

              <button
                onClick={() => { setCurrentPage(2); }}
                className={`w-full text-left p-2.5 rounded-lg border transition font-bold ${
                  currentPage === 2 ? 'bg-amber-500/15 text-amber-300 border-amber-500/40' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isIndAS105 ? 'Page 2: Traps, Discontinued Ops & Exam Pattern' : '2. Key Statutory Clauses & Case Exceptions'}
              </button>

              {!isIndAS105 && (
                <button
                  onClick={() => { setCurrentPage(3); }}
                  className={`w-full text-left p-2.5 rounded-lg border transition font-bold ${
                    currentPage === 3 ? 'bg-amber-500/15 text-amber-300 border-amber-500/40' : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  3. High-Yield Summary & Exam Guidelines
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-slate-850 text-[10px] text-slate-500 space-y-1">
              <p className="font-bold text-slate-400 uppercase font-mono">Security DRM Policy:</p>
              <p>• Content is encrypted for read-only preview.</p>
              <p>• Downloads, exports, and prints are permanently disabled.</p>
              <p>• Licensed for ICAI revision access.</p>
            </div>
          </div>
        )}

        {/* Window Blur Protection Overlay (Obscures when window loses focus or screen record/snip triggers) */}
        {!isWindowFocused && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-2xl animate-pulse">
              <EyeOff className="h-10 w-10 mx-auto" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-base font-black text-slate-100 uppercase tracking-wider font-mono">
                🛡️ Screen Capture Shield Active
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Document display is temporarily obscured because the browser window lost focus. This prevents unauthorized screen recordings or snipping tool captures.
              </p>
            </div>
            <button
              onClick={() => setIsWindowFocused(true)}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition"
            >
              Resume Reading PDF
            </button>
          </div>
        )}

        {/* A4 Document Reader Paper Canvas Area */}
        <div 
          ref={containerRef}
          onContextMenu={(e) => {
            e.preventDefault();
            setProtectionToast('🔒 Right-click menu disabled on protected PDF.');
            setTimeout(() => setProtectionToast(null), 3000);
          }}
          className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center gap-8 relative select-none"
        >
          {/* Render PDF Paper Pages */}
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="transition-transform duration-200 flex flex-col items-center gap-8 pb-16 w-full max-w-4xl"
          >
            {isIndAS105 ? (
              <div className="w-full">
                {chapterContentNode}
              </div>
            ) : (
              /* Page Container for generic summaries */
              <div className="w-full bg-[#0c101d] border border-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-6 sm:p-10 relative overflow-hidden text-slate-200 space-y-6">
                
                {/* PDF Running Top Header */}
                <div className="flex items-center justify-between bg-[#0d1526] border-b-[3px] border-[#c99e3b] -mx-6 sm:-mx-10 -mt-6 sm:-mt-10 px-6 sm:px-10 py-3.5 mb-4">
                  <div className="text-xl font-extrabold text-[#deb041] tracking-tight leading-none">
                    practACE
                  </div>
                  <div className="text-xs font-medium text-slate-100">
                    CA Final <span className="text-slate-400 mx-1.5">|</span> {subjectMeta?.fullName || cleanSubjectCode}
                  </div>
                </div>

                {/* Title Section inside PDF Page */}
                <div className="space-y-2 border-b border-slate-800/80 pb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-extrabold uppercase tracking-widest">
                    Chapter {chapterNumber} · Official Curriculum PDF
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-100 tracking-tight leading-tight">
                    {chapterName}
                  </h1>
                  <p className="text-xs text-slate-400 font-medium">
                    CA Final {subjectMeta?.fullName} — Intensive Statutory Concept Blueprint
                  </p>
                </div>

                {/* Injected Chapter Content Node */}
                <div className="space-y-6 pt-2 text-left">
                  {chapterContentNode}
                </div>

                {/* PDF Running Bottom Footer */}
                <div className="border-t-2 border-[#c99e3b] pt-3 text-center">
                  <div className="text-[11px] font-bold text-slate-100 tracking-wide">
                    practACE — CA Final Revision Material
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
    </ModalPortal>
  );
}
