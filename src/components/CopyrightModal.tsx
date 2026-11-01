import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle2, AlertCircle, FileCheck, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CopyrightModal: React.FC = () => {
  const { isCopyrightModalOpen, setIsCopyrightModalOpen, showToast, activeProject, setProjects } = useApp();

  const [licenseType, setLicenseType] = useState<'original' | 'licensed' | 'fair-use' | 'public-domain'>(
    activeProject?.rightsStatus || 'original'
  );
  const [licenseNote, setLicenseNote] = useState('');

  if (!isCopyrightModalOpen) return null;

  const handleSaveLicense = () => {
    if (activeProject) {
      setProjects(prev =>
        prev.map(p => (p.id === activeProject.id ? { ...p, rightsStatus: licenseType } : p))
      );
    }
    showToast('Copyright & License status recorded for this video', 'success');
    setIsCopyrightModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Copyright Safety & Content Rights
              </h2>
              <p className="text-xs text-slate-500">
                Protect your channel and record ownership authorization
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCopyrightModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Safety Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            <span>Strict Anti-DRM & Compliance Policy</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-90">
            CreatorCut only processes videos through authorized and supported ingestion methods. We never circumvent DRM, encryption, or access controls. All API keys and proprietary credentials remain safely secured on the server.
          </p>
        </div>

        {/* License Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Select Your Content Rights for {activeProject?.title ? `"${activeProject.title}"` : 'This Project'}
          </label>

          <div className="space-y-2">
            {[
              { id: 'original', label: 'Original Creator / Proprietary Work', desc: 'You created and own 100% of the video footage and audio.' },
              { id: 'licensed', label: 'Commercial / Creative Commons License', desc: 'You have written or purchased license rights to repurpose this content.' },
              { id: 'fair-use', label: 'Fair Use: Commentary, Criticism, Education', desc: 'Transformative critique, educational analysis, or reaction format.' },
              { id: 'public-domain', label: 'Public Domain / Free Open Media', desc: 'Content free from copyright restrictions or officially open-source.' },
            ].map(opt => (
              <label
                key={opt.id}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  licenseType === opt.id
                    ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/30'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                <input
                  type="radio"
                  name="license"
                  checked={licenseType === opt.id}
                  onChange={() => setLicenseType(opt.id as any)}
                  className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block">{opt.label}</span>
                  <span className="text-slate-500 text-[11px]">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Optional note */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            License Reference ID / Proof URL (Optional)
          </label>
          <input
            type="text"
            value={licenseNote}
            onChange={e => setLicenseNote(e.target.value)}
            placeholder="e.g. CC-BY 4.0, invoice #8921, or channel authorization link"
            className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
          />
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsCopyrightModalOpen(false)}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveLicense}
            className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Confirm & Record License</span>
          </button>
        </div>
      </div>
    </div>
  );
};
