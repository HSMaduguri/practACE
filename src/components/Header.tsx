/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, BookOpen, BarChart3, Mail, LogOut, ShieldCheck } from 'lucide-react';
import { User } from 'firebase/auth';
import BrandMark from './BrandMark';
const logoImg = '/assets/aistudio/practCA_Logo_photo_e935f99f.png';

interface HeaderProps {
  currentView: 'dashboard' | 'subjects';
  setView: (view: 'dashboard' | 'subjects') => void;
  currentUser: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  authLoading: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ 
  currentView, 
  setView, 
  currentUser, 
  onSignIn, 
  onSignOut, 
  authLoading,
  darkMode,
  onToggleDarkMode
}: HeaderProps) {
  return (
    <header 
      id="app-header" 
      className="sticky top-0 z-50 w-full rounded-b-2xl border border-slate-200 dark:border-slate-700/70 backdrop-blur-xl transition-all duration-300 dark:bg-slate-950/90 bg-white/95 shadow-[0_10px_28px_-8px_rgba(2,8,20,0.6)] overflow-hidden"
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo and Brand */}
        <div 
          id="brand-logo"
          className="flex items-center cursor-pointer transition-opacity hover:opacity-90"
          onClick={() => setView('dashboard')}
        >
          <BrandMark size="sm" showIcon />
        </div>

        {/* Global Navigation */}
        <nav id="global-navigation" className="hidden md:flex items-center gap-2">
          <button
            id="nav-btn-dashboard"
            onClick={() => setView('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentView === 'dashboard'
                ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </button>
          
          <button
            id="nav-btn-subjects"
            onClick={() => setView('subjects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentView === 'subjects'
                ? 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Knowledge Hub
          </button>
        </nav>

        {/* Theme and Action Buttons */}
        <div id="header-actions" className="flex items-center gap-3">
          {/* Mobile navigation triggers */}
          <div className="flex md:hidden items-center gap-1">
            <button
              id="mobile-nav-dashboard"
              onClick={() => setView('dashboard')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'dashboard' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
              title="Dashboard"
            >
              <BarChart3 className="h-5 w-5" />
            </button>
            <button
              id="mobile-nav-subjects"
              onClick={() => setView('subjects')}
              className={`p-2 rounded-lg transition-colors ${
                currentView === 'subjects' ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' : 'text-slate-500'
              }`}
              title="Knowledge Hub"
            >
              <BookOpen className="h-5 w-5" />
            </button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

          {/* Cloud Auth Synchronization Actions */}
          {authLoading ? (
            <div className="h-8 w-20 rounded-lg bg-slate-100 dark:bg-slate-900 animate-pulse hidden sm:block"></div>
          ) : currentUser ? (
            <div className="flex items-center gap-2">
              {/* User profile with active status badge */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 font-mono tracking-tight leading-none">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1 mt-0.5 justify-end font-mono">
                  <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                  Cloud Synced
                </span>
              </div>
              <button
                id="sign-out-btn"
                onClick={onSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-rose-500/30 hover:bg-rose-500/10 text-slate-600 dark:text-slate-400 dark:hover:text-rose-450 hover:text-rose-600 text-[11px] font-semibold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer"
                title="Sign out from cloud sync"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              id="sign-in-btn"
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 dark:border dark:border-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-[11.5px] uppercase transition-all shadow-xs cursor-pointer whitespace-nowrap"
              title="Sign in with your email account"
            >
              <Mail className="h-3.5 w-3.5 text-indigo-500" />
              <span>Mail Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
