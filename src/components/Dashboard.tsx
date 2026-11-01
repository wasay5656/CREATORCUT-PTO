import React, { useState } from 'react';
import { 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  Play, 
  Scissors, 
  Film, 
  Clock, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Plus,
  Tv,
  Mic,
  GraduationCap,
  ShoppingBag,
  Megaphone,
  HelpCircle,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_VIDEOS, TEMPLATES_LIBRARY } from '../data/sampleData';
import { ContentType, Project } from '../types';

export const Dashboard: React.FC = () => {
  const { 
    projects, 
    setActiveTab, 
    setActiveProject, 
    openClipInEditor, 
    saveNewProject, 
    showToast,
    usageInfo 
  } = useApp();

  const [urlInput, setUrlInput] = useState('');
  const [isUrlSubmitting, setIsUrlSubmitting] = useState(false);

  // Workflow preset shortcuts
  const workflows: { type: ContentType; title: string; desc: string; icon: React.FC<{ className?: string }>; color: string }[] = [
    { type: 'podcast', title: 'Podcast Clips', desc: 'Turn 1-hr chats into 10 high-energy viral shorts', icon: Mic, color: 'from-purple-500 to-indigo-600' },
    { type: 'talking-head', title: 'Talking-Head', desc: 'Auto-reframe, Hormozi captions & speaker tracking', icon: Tv, color: 'from-blue-500 to-cyan-500' },
    { type: 'educational', title: 'Educational & Masterclass', desc: 'Step-by-step explainer clips with clean captions', icon: GraduationCap, color: 'from-emerald-500 to-teal-500' },
    { type: 'product-ad', title: 'Product & E-Commerce Ads', desc: 'High-conversion hooks optimized for TikTok & Reels ads', icon: ShoppingBag, color: 'from-amber-500 to-orange-500' },
  ];

  // Handle direct file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      sourceType: 'upload',
      sourceUrl: file.name,
      videoUrl: objectUrl,
      duration: 120, // default placeholder until metadata loads
      thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      createdAt: 'Just now',
      status: 'ready',
      clipsCount: 0,
      contentType: 'podcast',
      language: 'en',
      rightsStatus: 'original',
      clips: [],
    };

    saveNewProject(newProj);
    setActiveProject(newProj);
    setActiveTab('clip-maker');
    showToast(`Uploaded "${file.name}". Choose clipping settings!`, 'success');
  };

  // Handle URL submit
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      showToast('Please enter a valid video link', 'warning');
      return;
    }

    setIsUrlSubmitting(true);
    setTimeout(() => {
      // Pick a sample video stream for seamless playback demonstration
      const sample = SAMPLE_VIDEOS[0];
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: urlInput.includes('youtube') || urlInput.includes('youtu.be') ? 'Imported Web Video Stream' : 'Podcast Repurpose Project',
        sourceType: 'url',
        sourceUrl: urlInput,
        videoUrl: sample.videoUrl,
        duration: 124,
        thumbnail: sample.thumbnail,
        createdAt: 'Just now',
        status: 'ready',
        clipsCount: 0,
        contentType: 'podcast',
        language: 'en',
        rightsStatus: 'fair-use',
        clips: [],
      };

      saveNewProject(newProj);
      setActiveProject(newProj);
      setIsUrlSubmitting(false);
      setUrlInput('');
      setActiveTab('clip-maker');
      showToast('Video URL ingested successfully! Setting up AI moments...', 'success');
    }, 900);
  };

  // Try instant sample video
  const handleTrySample = (sample: typeof SAMPLE_VIDEOS[0]) => {
    const newProj: Project = {
      id: `proj-sample-${Date.now()}`,
      title: sample.title,
      sourceType: 'sample',
      sourceUrl: sample.videoUrl,
      videoUrl: sample.videoUrl,
      duration: sample.duration,
      thumbnail: sample.thumbnail,
      createdAt: 'Just now',
      status: 'ready',
      clipsCount: 0,
      contentType: sample.category,
      language: sample.language,
      rightsStatus: 'licensed',
      clips: [],
    };

    saveNewProject(newProj);
    setActiveProject(newProj);
    setActiveTab('clip-maker');
    showToast(`Loaded sample: "${sample.title}"`, 'info');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Hero Section */}
      <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden border bg-gradient-to-br from-purple-900/10 via-indigo-900/5 to-slate-900/20 dark:from-purple-950/40 dark:via-indigo-950/20 dark:to-slate-950 border-purple-500/20">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Video Repurposing Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Turn 1 Long Video Into 10+ Viral Shorts in Minutes
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Auto-detect best moments, generate animated Hormozi captions, reframe to 9:16 vertical, and publish to TikTok, Reels & Shorts with <strong className="text-purple-600 dark:text-purple-400 font-semibold">{usageInfo.credits}</strong> processing.
          </p>
        </div>

        {/* Quick Launch Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 relative z-10">
          {/* File Upload Box */}
          <div className="md:col-span-5 relative group">
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all bg-white/70 dark:bg-slate-900/70 border-purple-400/40 dark:border-purple-500/40 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-500/5 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Upload Video File
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 text-center mt-1">
                Drop MP4, MOV, WebM or MKV up to 4K
              </span>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleFileUpload} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Paste Link Box */}
          <div className="md:col-span-7 flex flex-col justify-center p-6 rounded-2xl border bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-cyan-500" />
              Paste Video Link (YouTube, Vimeo, Zoom, Podcast)
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Direct import from URL with auto-transcription and chapter extraction
            </p>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or direct MP4 link"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border transition-all bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={isUrlSubmitting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-md shadow-purple-500/20 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUrlSubmitting ? (
                  <span>Fetching...</span>
                ) : (
                  <>
                    <span>Import</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 1-Click Instant Demo Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold">Quick Test with Demo Videos:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SAMPLE_VIDEOS.map(sample => (
              <button
                key={sample.id}
                onClick={() => handleTrySample(sample)}
                className="px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-purple-500 hover:text-purple-600 dark:hover:text-purple-400"
              >
                {sample.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Usage & Platform Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Available AI Credits</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">
            {usageInfo.credits}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Active Creator Pass
          </span>
        </div>

        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Total Projects</span>
            <Film className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {projects.length}
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Stored in Workspace
          </span>
        </div>

        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Clips Generated</span>
            <Scissors className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {usageInfo.clipsCount}
          </p>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            Viral Ready (9:16)
          </span>
        </div>

        <div className="p-4 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-xs font-semibold">Multilingual AI Engine</span>
            <Share2 className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            10+ Languages
          </p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Urdu, Arabic, Hindi, English
          </span>
        </div>
      </div>

      {/* Workflow Presets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Repurposing Workflows
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select your content format for tailor-made viral clipping rules
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('templates')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>Explore All 8 Workflows</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflows.map(wf => {
            const Icon = wf.icon;
            return (
              <div
                key={wf.type}
                onClick={() => {
                  setActiveTab('clip-maker');
                  showToast(`Selected ${wf.title} workflow`, 'info');
                }}
                className="group p-5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/5"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${wf.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {wf.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {wf.desc}
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-semibold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Start Workflow</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Projects & Videos
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {projects.length}
            </span>
          </div>

          <button
            onClick={() => setActiveTab('projects')}
            className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(proj => {
            const hasClips = proj.clips && proj.clips.length > 0;
            return (
              <div
                key={proj.id}
                className="group rounded-2xl border overflow-hidden transition-all bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-slate-950 overflow-hidden">
                  <img
                    src={proj.thumbnail}
                    alt={proj.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Duration badge */}
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 text-[11px] font-mono text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-300" />
                    <span>{Math.floor(proj.duration / 60)}:{String(proj.duration % 60).padStart(2, '0')}</span>
                  </div>

                  {/* Clips count badge */}
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-purple-600 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                    <Scissors className="w-3 h-3" />
                    <span>{hasClips ? `${proj.clips.length} Viral Clips` : 'Unprocessed'}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {proj.title}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="capitalize">{proj.contentType}</span>
                    <span>{proj.createdAt}</span>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    {hasClips ? (
                      <button
                        onClick={() => openClipInEditor(proj.clips[0], proj)}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Edit Studio</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveProject(proj);
                          setActiveTab('clip-maker');
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Make AI Clips</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setActiveTab('clip-maker');
                      }}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Repurpose again"
                    >
                      AI Clips
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
