import React, { useState } from 'react';
import { 
  Settings, 
  Zap, 
  Infinity, 
  ShieldCheck, 
  Languages, 
  Download, 
  CreditCard, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../data/sampleData';

export const SettingsView: React.FC = () => {
  const { usageInfo, showToast, setIsCopyrightModalOpen } = useApp();

  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [defaultResolution, setDefaultResolution] = useState('1080p');
  const [activePlan, setActivePlan] = useState<'creator-unlimited' | 'enterprise'>('creator-unlimited');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-purple-500" />
          <span>Studio Settings & Quotas</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure platform defaults, language models, copyright verification, and unlimited AI processing tiers.
        </p>
      </div>

      {/* SECTION 1: STRICTLY UNLIMITED USAGE & SUBSCRIPTION */}
      <div className="p-6 rounded-3xl border relative overflow-hidden bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-slate-900/50 dark:from-purple-950/40 dark:via-indigo-950/30 dark:to-slate-950 border-purple-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Infinity className="w-4 h-4" />
                Current Active Subscription
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              CreatorCut Unlimited Pass
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Available AI Credits:</span>
            <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-cyan-400">
              {usageInfo.credits}
            </span>
          </div>
        </div>

        {/* Quota breakdown grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
          <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/60 border-purple-500/20">
            <span className="text-xs text-slate-500 block">AI Video Analysis</span>
            <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Infinity className="w-4 h-4 text-purple-500" />
              <span>UNLIMITED</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">No clip generation limits</span>
          </div>

          <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/60 border-purple-500/20">
            <span className="text-xs text-slate-500 block">Cloud 1080p Export</span>
            <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Infinity className="w-4 h-4 text-purple-500" />
              <span>UNLIMITED</span>
            </span>
            <span className="text-[11px] text-purple-600 font-medium">Full HD 60fps renders</span>
          </div>

          <div className="p-4 rounded-2xl border bg-white/60 dark:bg-slate-900/60 border-purple-500/20">
            <span className="text-xs text-slate-500 block">Storage & Bandwidth</span>
            <span className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1 mt-0.5">
              <Infinity className="w-4 h-4 text-purple-500" />
              <span>UNLIMITED</span>
            </span>
            <span className="text-[11px] text-cyan-600 font-medium">Global CDN edge caching</span>
          </div>
        </div>

        {/* Plan policy disclosure */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
          * Note: CreatorCut Unlimited grants boundless AI clipping and video exports for personal and commercial channels. Infrastructure uses automated dynamic scaling to ensure optimal processing throughput.
        </p>
      </div>

      {/* SECTION 2: MULTILINGUAL & AI PREFERENCES */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Languages className="w-4 h-4 text-purple-500" />
          <span>Default Language & Transcription Engine</span>
        </h2>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Primary Translation & Caption Language
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  setDefaultLanguage(lang.code);
                  showToast(`Default language set to ${lang.name}`, 'info');
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                  defaultLanguage === lang.code
                    ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                <div className="text-sm">{lang.flag}</div>
                <div className="text-xs font-bold mt-1 line-clamp-1">{lang.name.split('(')[0].trim()}</div>
                <div className="text-[10px] text-slate-400">{lang.script}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 3: COPYRIGHT & SAFETY NOTICE */}
      <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Copyright & Content Licensing Compliance</span>
          </h2>
          <button
            onClick={() => setIsCopyrightModalOpen(true)}
            className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Manage License Declarations</span>
          </button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>Safe Processing Protocol:</strong> CreatorCut strictly operates within authorized and supported ingestion methods. We do not bypass DRM, digital rights locks, or platform terms of service.
          </p>
          <p>
            Users are required to hold ownership or valid licenses for uploaded materials, or ensure their work complies with recognized fair-use guidelines (e.g. commentary, education, news reporting, parody).
          </p>
        </div>
      </div>
    </div>
  );
};
