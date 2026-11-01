import React from 'react';
import { 
  LayoutDashboard, 
  Scissors, 
  Film, 
  FolderGit2, 
  Sparkles, 
  Palette, 
  Settings, 
  Infinity, 
  ShieldCheck, 
  HelpCircle,
  TrendingUp,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, usageInfo, setIsCopyrightModalOpen } = useApp();

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clip-maker', label: 'AI Clip Maker', icon: Scissors, badge: 'Viral AI' },
    { id: 'editor', label: 'Video Editor', icon: Film },
    { id: 'projects', label: 'My Videos', icon: FolderGit2 },
    { id: 'templates', label: 'Templates', icon: Sparkles },
    { id: 'brand-kit', label: 'Brand Kit', icon: Palette },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNav = (id: NavTab) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-40 w-64 border-r flex flex-col justify-between transition-all duration-300 transform bg-slate-50 dark:bg-slate-950/90 border-slate-200 dark:border-slate-800/80 ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Top Nav Items */}
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Workspace
          </p>
          <div className="space-y-1 pt-1">
            {navItems.slice(0, 4).map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/30 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Studio Tools */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Assets & Style
          </p>
          <div className="space-y-1 pt-1">
            {navItems.slice(4).map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/30 font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-purple-500 dark:text-purple-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom section: Strictly UNLIMITED usage card */}
      <div className="p-4 space-y-3">
        {/* Creator Unlimited Card */}
        <div className="p-3.5 rounded-2xl border relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-slate-900/40 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-900/80 border-purple-500/30 dark:border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-purple-600 dark:text-purple-300 flex items-center gap-1">
              <Infinity className="w-3.5 h-3.5" />
              Creator Pass
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Active
            </span>
          </div>

          <div className="space-y-1 mb-2.5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 dark:text-slate-400">AI Credits:</span>
              <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-400">
                {usageInfo.credits}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500 dark:text-slate-400">Auto-Reframing:</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {usageInfo.credits}
              </span>
            </div>
          </div>

          <div className="w-full h-1.5 rounded-full bg-purple-200 dark:bg-purple-950 overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 w-full animate-pulse rounded-full" />
          </div>

          <button
            onClick={() => handleNav('settings')}
            className="w-full py-1 text-[11px] font-medium text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-purple-200 flex items-center justify-center gap-1"
          >
            <span>Manage Unlimited Quotas</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Rights & Security Notice button */}
        <button
          onClick={() => setIsCopyrightModalOpen(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-[11px] font-medium border transition-colors bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Copyright & License Log</span>
        </button>
      </div>
    </aside>
  );
};
