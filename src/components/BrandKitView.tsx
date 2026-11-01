import React from 'react';
import { 
  Palette, 
  Upload, 
  Sparkles, 
  Check, 
  Sliders, 
  Smartphone, 
  ShieldCheck,
  Eye,
  Type
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BrandKitView: React.FC = () => {
  const { brandKit, setBrandKit, showToast } = useApp();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBrandKit(prev => ({ ...prev, logoUrl: url }));
    showToast('Brand logo uploaded successfully!', 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-purple-500" />
            <span>Brand Kit Studio</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Maintain your channel identity across every generated clip with logos, color schemes, watermarks, and outro CTAs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Configuration form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Brand Identity */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Brand Identity</span>
            </h2>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Brand / Channel Name
              </label>
              <input
                type="text"
                value={brandKit.name}
                onChange={e => setBrandKit(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Logo upload / URL */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Watermark Logo
              </label>
              <div className="flex items-center gap-4">
                {brandKit.logoUrl ? (
                  <div className="relative w-16 h-16 rounded-xl border bg-black/60 p-2 flex items-center justify-center">
                    <img src={brandKit.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                    <button
                      onClick={() => setBrandKit(prev => ({ ...prev, logoUrl: '' }))}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-500 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4 text-purple-500" />
                    <span>Upload PNG / SVG Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                )}

                <div className="flex-1 space-y-1">
                  <span className="text-[11px] text-slate-400 block">Or preset sample watermark:</span>
                  <div className="flex gap-2">
                    {['https://api.iconify.design/lucide:zap.svg', 'https://api.iconify.design/lucide:sparkles.svg'].map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setBrandKit(prev => ({ ...prev, logoUrl: url }))}
                        className="px-2.5 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-purple-500"
                      >
                        Preset #{i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Watermark position & opacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Watermark Position
                </label>
                <select
                  value={brandKit.watermarkPosition}
                  onChange={e => setBrandKit(prev => ({ ...prev, watermarkPosition: e.target.value as any }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Opacity</span>
                  <span className="font-mono text-purple-600">{Math.round(brandKit.watermarkOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={brandKit.watermarkOpacity}
                  onChange={e => setBrandKit(prev => ({ ...prev, watermarkOpacity: Number(e.target.value) }))}
                  className="w-full accent-purple-600 cursor-pointer mt-2"
                />
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" />
              <span>Channel Colors & Accent</span>
            </h2>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Primary Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.primaryColor}
                    onChange={e => setBrandKit(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono">{brandKit.primaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Secondary</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.secondaryColor}
                    onChange={e => setBrandKit(prev => ({ ...prev, secondaryColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono">{brandKit.secondaryColor}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Accent Hook</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandKit.accentColor}
                    onChange={e => setBrandKit(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-xs font-mono">{brandKit.accentColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar & Outro CTA */}
          <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-500" />
              <span>Video Elements</span>
            </h2>

            <div className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Animated Video Progress Bar
                </span>
                <span className="text-[10px] text-slate-500">
                  Renders a dynamic retention progress bar across the bottom
                </span>
              </div>
              <input
                type="checkbox"
                checked={brandKit.showProgressBar}
                onChange={e => setBrandKit(prev => ({ ...prev, showProgressBar: e.target.checked }))}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Default Outro CTA Text
              </label>
              <input
                type="text"
                value={brandKit.outroCta}
                onChange={e => setBrandKit(prev => ({ ...prev, outroCta: e.target.value }))}
                placeholder="e.g. Follow for daily insights!"
                className="w-full px-3.5 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Right: Live Interactive Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="sticky top-24 w-full max-w-sm space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
              Live Brand Kit Preview (9:16)
            </span>

            <div className="relative aspect-[9/16] rounded-3xl overflow-hidden bg-black shadow-2xl border-4 border-slate-800 flex flex-col justify-between p-4">
              {/* Simulated background */}
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80"
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none" />

              {/* Watermark position */}
              {brandKit.logoUrl && (
                <div
                  className={`absolute z-10 ${
                    brandKit.watermarkPosition === 'top-left' ? 'top-6 left-6' :
                    brandKit.watermarkPosition === 'top-right' ? 'top-6 right-6' :
                    brandKit.watermarkPosition === 'bottom-left' ? 'bottom-20 left-6' : 'bottom-20 right-6'
                  }`}
                  style={{ opacity: brandKit.watermarkOpacity }}
                >
                  <img src={brandKit.logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
                </div>
              )}

              {/* Top Banner with Brand Primary color */}
              <div
                className="relative z-10 px-3 py-1.5 rounded-lg text-center font-black text-xs uppercase tracking-wide text-white shadow-lg"
                style={{ backgroundColor: brandKit.primaryColor }}
              >
                {brandKit.name || 'YOUR BRAND HEADLINE'}
              </div>

              {/* Simulated Subtitles with Brand Highlight */}
              <div className="relative z-10 text-center space-y-2 mb-4">
                <span className="inline-block px-3 py-1.5 rounded-xl font-black text-sm bg-black/80 text-white tracking-wider">
                  WATCH THIS <span style={{ color: brandKit.accentColor }}>VIRAL</span> TAKEAWAY
                </span>

                <div className="text-[11px] text-slate-300 font-medium">
                  {brandKit.outroCta}
                </div>
              </div>

              {/* Progress bar */}
              {brandKit.showProgressBar && (
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-white/20 z-10">
                  <div
                    className="h-full w-2/3"
                    style={{ backgroundColor: brandKit.progressColor || brandKit.primaryColor }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
