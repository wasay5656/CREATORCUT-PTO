import React from 'react';
import { 
  Sun, 
  Moon, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  Search, 
  Layers, 
  Film,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { 
    theme, 
    toggleTheme, 
    setActiveTab, 
    setIsCopyrightModalOpen, 
    usageInfo,
    showToast 
  } = useApp();

  return (
    <header className="h-16 border-b px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 transition-colors backdrop-blur-md bg-white/80 dark:bg-slate-950/80 border-slate-200 dark:border-slate-800/80">
      {/* Brand & Left Actions */}
      <div className="flex items-center gap-6">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Film className="w-5 h-5 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500 dark:from-purple-400 dark:via-cyan-300 dark:to-indigo-300 bg-clip-text text-transparent">
                CreatorCut
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                AI Studio
              </span>
            </div>
          </div>
        </button>

        {/* Global quick search */}
        <div className="hidden md:flex items-center relative w-64 lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input 
            type="text"
            placeholder="Search projects, clips, hooks..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border transition-all bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Strictly UNLIMITED Usage Badge */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer hover:border-purple-500/60 transition-all bg-purple-500/10 dark:bg-purple-500/15 border-purple-500/30 text-purple-700 dark:text-purple-300 shadow-sm"
          title="CreatorCut Unlimited Processing Tier Active"
        >
          <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wide">
            {usageInfo.credits}
          </span>
          <span className="hidden sm:inline text-[11px] opacity-75 font-medium ml-0.5">
            AI Credits
          </span>
        </div>

        {/* Copyright Safety Badge */}
        <button
          onClick={() => setIsCopyrightModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400"
          title="Verify content licensing and copyright safety status"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden lg:inline">Rights Verified</span>
        </button>

        {/* Theme Switcher Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg border transition-all cursor-pointer bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
          title={theme === 'dark' ? 'Switch to Clean Light Mode' : 'Switch to Elegant Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Create Project Button */}
        <button
          onClick={() => setActiveTab('clip-maker')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>

        {/* User avatar */}
        <div 
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2 pl-1 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-purple-500/30">
            CC
          </div>
        </div>
      </div>
    </header>
  );
};
