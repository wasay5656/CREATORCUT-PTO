import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Play, 
  ArrowRight, 
  Tag, 
  Layers, 
  Tv, 
  Mic, 
  GraduationCap, 
  ShoppingBag, 
  Megaphone,
  Share2,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUBTITLE_STYLES_CONFIG, TEMPLATES_LIBRARY } from '../data/sampleData';
import { ContentType, Project, Template } from '../types';

export const TemplatesView: React.FC = () => {
  const { 
    setActiveTab, 
    saveNewProject, 
    setActiveProject, 
    openClipInEditor, 
    showToast,
    usageInfo 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePreviewTemplate, setActivePreviewTemplate] = useState<Template | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'podcast', label: 'Podcast & Interviews' },
    { id: 'talking-head', label: 'Talking-Head & Creator' },
    { id: 'educational', label: 'Educational & Explainer' },
    { id: 'product-ad', label: 'Product & E-Commerce' },
    { id: 'promotional', label: 'Promotional & Events' },
    { id: 'social', label: 'Social & Multilingual' },
  ];

  const filteredTemplates = TEMPLATES_LIBRARY.filter(t => {
    if (selectedCategory === 'all') return true;
    return t.category === selectedCategory;
  });

  // Apply template
  const handleApplyTemplate = (tpl: Template) => {
    const newProj: Project = {
      id: `proj-tpl-${Date.now()}`,
      title: `${tpl.name} Video Project`,
      sourceType: 'sample',
      sourceUrl: tpl.videoUrl,
      videoUrl: tpl.videoUrl,
      duration: 110,
      thumbnail: tpl.previewUrl,
      createdAt: 'Just now',
      status: 'ready',
      clipsCount: 1,
      contentType: tpl.category,
      language: tpl.subtitlePreset === 'nastaliq' ? 'ur' : 'en',
      rightsStatus: 'licensed',
      clips: [
        {
          id: `clip-tpl-${Date.now()}`,
          projectId: `proj-tpl-${Date.now()}`,
          title: `${tpl.name} - Viral Clip #1`,
          hook: tpl.headlineText,
          viralScore: 97,
          whyViral: 'High-contrast typography with instant visual hook and pattern interrupt.',
          startTime: 4,
          endTime: 36,
          duration: 32,
          aspectRatio: tpl.aspectRatio,
          videoUrl: tpl.videoUrl,
          thumbnailUrl: tpl.previewUrl,
          subtitleStyle: SUBTITLE_STYLES_CONFIG[tpl.subtitlePreset] || SUBTITLE_STYLES_CONFIG.hormozi,
          headline: {
            show: true,
            text: tpl.headlineText,
            bannerBg: tpl.headlineBg,
            textColor: tpl.headlineColor,
          },
          audio: { volume: 1, muted: false, voiceEnhanced: true, ducking: false },
          category: tpl.category,
          speakerTracking: true,
          language: tpl.subtitlePreset === 'nastaliq' ? 'ur' : 'en',
          createdAt: '2026-11-01',
          subtitles: [
            {
              id: 'sub-t1',
              start: 4,
              end: 12,
              text: 'This exact structure is what drives 10x organic retention on short-form feeds.',
              speaker: 'Host',
            },
            {
              id: 'sub-t2',
              start: 12.5,
              end: 24,
              text: 'Dynamic animated subtitles catch viewers even with their sound muted.',
              speaker: 'Host',
            },
            {
              id: 'sub-t3',
              start: 24.5,
              end: 35,
              text: 'Test this layout now and scale your creator workflow with CreatorCut.',
              speaker: 'Host',
            },
          ],
        },
      ],
    };

    saveNewProject(newProj);
    setActiveProject(newProj);
    openClipInEditor(newProj.clips[0], newProj);
    showToast(`Template "${tpl.name}" applied with UNLIMITED credits!`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <span>Viral Templates Gallery</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {usageInfo.credits}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pre-designed viral video layouts with dynamic animated captions, hook banners, and safe-zone optimization.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(tpl => (
          <div
            key={tpl.id}
            className="group rounded-2xl border overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
          >
            <div>
              {/* Preview with Mockup Overlay */}
              <div className="relative aspect-[9/16] max-h-72 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                <img
                  src={tpl.previewUrl}
                  alt={tpl.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-black/30 to-black/40" />

                {/* Simulated Hook Banner */}
                <div 
                  className="absolute top-4 inset-x-4 px-2 py-1 rounded text-center text-[10px] font-black uppercase tracking-wide shadow-md pointer-events-none"
                  style={{ backgroundColor: tpl.headlineBg, color: tpl.headlineColor }}
                >
                  {tpl.headlineText}
                </div>

                {/* Subtitle style mockup */}
                <div className="absolute bottom-6 inset-x-4 text-center pointer-events-none">
                  <span className="text-xs font-black px-2 py-1 rounded bg-black/75 text-yellow-300 tracking-wider">
                    ANIMATED CAPTION PREVIEW
                  </span>
                </div>

                {/* Aspect ratio badge */}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                  {tpl.aspectRatio}
                </div>
              </div>

              {/* Template Info */}
              <div className="p-4 space-y-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {tpl.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {tpl.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {tpl.tags.map(t => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-4 pt-0">
              <button
                onClick={() => handleApplyTemplate(tpl)}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/15 cursor-pointer"
              >
                <span>Use This Template</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
