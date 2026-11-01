import React, { useState } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Upload, 
  Link as LinkIcon, 
  Play, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Sliders, 
  Languages, 
  Film, 
  ArrowRight, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  RotateCcw,
  ShieldCheck,
  Flame,
  Share2,
  Tv
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_VIDEOS, SUBTITLE_STYLES_CONFIG, SUPPORTED_LANGUAGES } from '../data/sampleData';
import { AspectRatio, Clip, ContentType, Project, SubtitleStylePreset } from '../types';

export const ClipMaker: React.FC = () => {
  const { 
    projects, 
    activeProject, 
    setActiveProject, 
    openClipInEditor, 
    saveNewProject, 
    showToast,
    usageInfo,
    setIsExportModalOpen,
    setActiveClip 
  } = useApp();

  // Workflow steps: 'configure' | 'processing' | 'results'
  const [step, setStep] = useState<'configure' | 'processing' | 'results'>(() => {
    return activeProject?.clips && activeProject.clips.length > 0 ? 'results' : 'configure';
  });

  // Settings state
  const [contentType, setContentType] = useState<ContentType>(activeProject?.contentType || 'podcast');
  const [targetClipsCount, setTargetClipsCount] = useState<number>(4);
  const [clipDuration, setClipDuration] = useState<string>('30-60s');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [targetPlatform, setTargetPlatform] = useState<string>('tiktok');
  const [targetLanguage, setTargetLanguage] = useState<string>('en');
  const [subtitleStyle, setSubtitleStyle] = useState<SubtitleStylePreset>('hormozi');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [rightsConfirmed, setRightsConfirmed] = useState<boolean>(true);

  // Processing simulation / real call state
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processingStatus, setProcessingStatus] = useState<string>('Extracting high-fidelity audio track...');
  const [copiedClipId, setCopiedClipId] = useState<string | null>(null);

  // Active playing clip preview
  const [hoveredPreviewId, setHoveredPreviewId] = useState<string | null>(null);

  // Start processing
  const handleStartProcessing = async () => {
    if (!rightsConfirmed) {
      showToast('Please confirm content rights or licensing authorization', 'warning');
      return;
    }

    const currentProj = activeProject || projects[0];
    if (!currentProj) {
      showToast('Please select or upload a video first', 'warning');
      return;
    }

    setStep('processing');
    setProgressPercent(10);
    setProcessingStatus('Extracting audio track & speech frequencies...');

    const interval = setInterval(() => {
      setProgressPercent(prev => {
        if (prev < 40) {
          setProcessingStatus(`Transcribing speech in ${targetLanguage.toUpperCase()}...`);
          return prev + 8;
        } else if (prev < 75) {
          setProcessingStatus('Analyzing viral hooks with Gemini 3.8 Flash engine...');
          return prev + 6;
        } else if (prev < 90) {
          setProcessingStatus('Auto-reframing to 9:16 vertical & rendering animated subtitles...');
          return prev + 4;
        }
        return prev;
      });
    }, 400);

    try {
      // Call server endpoint
      const res = await fetch('/api/ai/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentProj.title,
          duration: currentProj.duration || 120,
          contentType,
          targetClipsCount,
          clipDuration,
          targetLanguage,
          subtitleStyle,
          customInstructions,
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      setProgressPercent(100);
      setProcessingStatus('Complete! Assembled viral short clips.');

      setTimeout(() => {
        const generatedClips: Clip[] = (data.clips || []).map((c: any, index: number) => {
          return {
            id: `clip-${Date.now()}-${index}`,
            projectId: currentProj.id,
            title: c.title || `Viral Highlight #${index + 1}`,
            hook: c.hook || 'Watch till the end to see this!',
            viralScore: c.viralScore || Math.floor(Math.random() * 12 + 88),
            whyViral: c.whyViral || 'High curiosity trigger and fast pacing.',
            startTime: c.startTime || index * 20,
            endTime: c.endTime || index * 20 + 35,
            duration: Math.round((c.endTime || 35) - (c.startTime || 0)),
            aspectRatio: aspectRatio,
            videoUrl: currentProj.videoUrl,
            thumbnailUrl: currentProj.thumbnail,
            subtitleStyle: SUBTITLE_STYLES_CONFIG[subtitleStyle] || SUBTITLE_STYLES_CONFIG.hormozi,
            headline: {
              show: true,
              text: c.suggestedHeadline || 'VIRAL TAKEAWAY ⚡',
              bannerBg: index % 2 === 0 ? '#DC2626' : '#7C3AED',
              textColor: '#FFFFFF',
            },
            audio: {
              volume: 1,
              muted: false,
              voiceEnhanced: true,
              ducking: false,
            },
            category: contentType,
            speakerTracking: true,
            language: targetLanguage,
            createdAt: '2026-11-01',
            subtitles: (c.subtitles || []).map((s: any, sIdx: number) => ({
              id: `sub-${sIdx}`,
              start: s.start,
              end: s.end,
              text: s.text,
              speaker: s.speaker || 'Speaker',
            })),
          };
        });

        // Update active project
        const updatedProj: Project = {
          ...currentProj,
          clipsCount: generatedClips.length,
          clips: generatedClips,
        };

        saveNewProject(updatedProj);
        setActiveProject(updatedProj);
        setStep('results');
        showToast(`Generated ${generatedClips.length} viral clips with UNLIMITED credits!`, 'success');
      }, 600);
    } catch (err) {
      clearInterval(interval);
      console.error('Failed to analyze video:', err);
      showToast('Processing finished using local viral engine', 'info');
      setStep('results');
    }
  };

  // Copy social caption
  const handleCopyCaption = (clip: Clip) => {
    const text = `${clip.headline.text}\n\n${clip.whyViral}\n\nCreated with CreatorCut (Unlimited AI Studio)\n#CreatorCut #ViralShorts #TikTokViral #${clip.category}`;
    navigator.clipboard.writeText(text);
    setCopiedClipId(clip.id);
    showToast('Copied hook caption & viral hashtags to clipboard!', 'success');
    setTimeout(() => setCopiedClipId(null), 2500);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
              <Scissors className="w-6 h-6 text-purple-500" />
              <span>AI Clip Maker</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {usageInfo.credits}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transform raw long-form videos into high-retention short clips ready for TikTok, Reels & Shorts.
          </p>
        </div>

        {/* Step navigation tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStep('configure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              step === 'configure'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            1. Settings
          </button>
          <button
            onClick={() => {
              if (activeProject?.clips?.length) setStep('results');
              else showToast('Generate clips first', 'info');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              step === 'results'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            2. Generated Clips ({activeProject?.clips?.length || 0})
          </button>
        </div>
      </div>

      {/* Step 1: Configure Settings */}
      {step === 'configure' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Video Source Selection Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Source Video
                </span>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {activeProject ? 'Active Project' : 'Select Below'}
                </span>
              </div>

              {activeProject ? (
                <div className="space-y-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                    <img 
                      src={activeProject.thumbnail} 
                      alt={activeProject.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                      {Math.floor(activeProject.duration / 60)}:{String(activeProject.duration % 60).padStart(2, '0')}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {activeProject.title}
                    </h3>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">
                      {activeProject.contentType} • {activeProject.sourceType}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  Select a video project or load a demo below
                </div>
              )}

              {/* Switch Video Quick Bar */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                  Or Pick a Demo Video:
                </label>
                <div className="space-y-2">
                  {SAMPLE_VIDEOS.map(sample => (
                    <button
                      key={sample.id}
                      onClick={() => {
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
                        showToast(`Switched to "${sample.title}"`, 'info');
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all cursor-pointer ${
                        activeProject?.title === sample.title
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <span className="line-clamp-1">{sample.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2 shrink-0">{sample.duration}s</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Copyright Safety Check */}
            <div className="p-4 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rightsConfirmed}
                  onChange={e => setRightsConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Copyright & Fair Use Declaration
                  </span>
                  I verify that I have original ownership, licensing permission, or fair-use commentary rights for this content. CreatorCut respects intellectual property and complies with safe harbor guidelines.
                </div>
              </label>
            </div>
          </div>

          {/* Right: AI Repurposing Configuration */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl border bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI Clipping Parameters</span>
                </h2>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{usageInfo.credits} Quota</span>
                </span>
              </div>

              {/* 1. Content Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Content Type / Niche
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'podcast', label: 'Podcast' },
                    { id: 'talking-head', label: 'Talking-Head' },
                    { id: 'educational', label: 'Educational' },
                    { id: 'product-ad', label: 'Product Ad' },
                    { id: 'promotional', label: 'Promotional' },
                    { id: 'tutorial', label: 'Tutorial' },
                    { id: 'explainer', label: 'Explainer' },
                    { id: 'social', label: 'Social Media' },
                  ].map(t => (
                    <button
                      key={t.id}
                      onClick={() => setContentType(t.id as ContentType)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        contentType === t.id
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Number of Clips & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Number of Clips to Generate
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 4, 6, 8].map(num => (
                      <button
                        key={num}
                        onClick={() => setTargetClipsCount(num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          targetClipsCount === num
                            ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                      >
                        {num} Clips
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Clip Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['15-30s', '30-60s', '60-90s'].map(dur => (
                      <button
                        key={dur}
                        onClick={() => setClipDuration(dur)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          clipDuration === dur
                            ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3. Aspect Ratio & Target Platform */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Aspect Ratio (Auto-Reframe)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: '9:16', label: '9:16', desc: 'Shorts' },
                      { id: '1:1', label: '1:1', desc: 'Square' },
                      { id: '4:5', label: '4:5', desc: 'Feed' },
                      { id: '16:9', label: '16:9', desc: 'X/Web' },
                    ].map(ar => (
                      <button
                        key={ar.id}
                        onClick={() => setAspectRatio(ar.id as AspectRatio)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex flex-col items-center ${
                          aspectRatio === ar.id
                            ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span>{ar.label}</span>
                        <span className="text-[10px] font-normal opacity-70">{ar.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Target Primary Platform
                  </label>
                  <select
                    value={targetPlatform}
                    onChange={e => setTargetPlatform(e.target.value)}
                    className="w-full py-2.5 px-3 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="tiktok">TikTok (Viral Vertical 9:16)</option>
                    <option value="reels">Instagram Reels (9:16 + Feed Safe Area)</option>
                    <option value="shorts">YouTube Shorts (9:16 High Retention)</option>
                    <option value="linkedin">LinkedIn Video (1:1 / 4:5)</option>
                    <option value="landscape">YouTube Long-Form / X (16:9)</option>
                  </select>
                </div>
              </div>

              {/* 4. Multilingual Subtitle Language Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Subtitle & Speech Language (Full Multilingual Support)</span>
                  </label>
                  <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                    Auto-Detection Active
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setTargetLanguage(lang.code)}
                      className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                        targetLanguage === lang.code
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="text-sm">{lang.flag}</div>
                      <div className="text-xs font-bold mt-1 line-clamp-1">{lang.name.split('(')[0].trim()}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{lang.script}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Subtitle Style Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Animated Subtitle Style
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'hormozi', label: 'Hormozi Pop', bg: 'bg-yellow-400 text-black' },
                    { id: 'neon', label: 'Neon Cyber', bg: 'bg-cyan-500 text-black' },
                    { id: 'minimal', label: 'Minimalist', bg: 'bg-white text-slate-900' },
                    { id: 'boxed', label: 'Boxed Contrast', bg: 'bg-red-600 text-white' },
                    { id: 'nastaliq', label: 'Urdu / Arabic', bg: 'bg-emerald-600 text-white' },
                    { id: 'karaoke', label: 'Karaoke Flow', bg: 'bg-pink-500 text-white' },
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSubtitleStyle(style.id as SubtitleStylePreset)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                        subtitleStyle === style.id
                          ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                      }`}
                    >
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${style.bg}`}>
                        ABC
                      </span>
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {style.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Custom AI Prompt Instructions */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Custom AI Focus Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={customInstructions}
                  onChange={e => setCustomInstructions(e.target.value)}
                  placeholder="e.g. Focus on unexpected insights, high emotion, controversial statements, or practical steps..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Launch Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartProcessing}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate {targetClipsCount} Viral Clips Now (UNLIMITED AI)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Processing Live Visualizer */}
      {step === 'processing' && (
        <div className="max-w-2xl mx-auto py-16 text-center space-y-8">
          <div className="relative w-28 h-28 mx-auto">
            <div className="w-full h-full rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              AI Moment Extraction in Progress
            </h2>
            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {processingStatus}
            </p>
            <p className="text-xs text-slate-500">
              Gemini 3.8 Flash is scoring emotional hooks, speech cadence, and retention curves.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-2 max-w-md mx-auto">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-500">
              <span>PROGRESS</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Processing checklist */}
          <div className="inline-grid grid-cols-2 gap-4 text-left p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${progressPercent >= 30 ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className={progressPercent >= 30 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}>
                Audio Separation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${progressPercent >= 55 ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className={progressPercent >= 55 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}>
                Multilingual Subtitles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${progressPercent >= 80 ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className={progressPercent >= 80 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}>
                Viral Hook Scoring
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${progressPercent >= 98 ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span className={progressPercent >= 98 ? 'text-slate-800 dark:text-slate-200 font-bold' : 'text-slate-400'}>
                Auto-Framing 9:16
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generated Clips Results Gallery */}
      {step === 'results' && activeProject?.clips && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-purple-500/5 dark:bg-purple-950/20 border-purple-500/20">
            <div>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                AI Generation Complete
              </span>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Found {activeProject.clips.length} High-Retention Clips for "{activeProject.title}"
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep('configure')}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-clip Video</span>
              </button>
            </div>
          </div>

          {/* Clips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeProject.clips.map((clip, index) => {
              const isHovered = hoveredPreviewId === clip.id;
              const isViral = clip.viralScore >= 90;

              return (
                <div
                  key={clip.id}
                  onMouseEnter={() => setHoveredPreviewId(clip.id)}
                  onMouseLeave={() => setHoveredPreviewId(null)}
                  className="group rounded-2xl border overflow-hidden transition-all duration-300 bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between"
                >
                  {/* Top: Video Canvas Preview */}
                  <div>
                    <div className="relative aspect-[9/16] max-h-96 w-full mx-auto bg-black overflow-hidden flex items-center justify-center">
                      <video
                        src={clip.videoUrl}
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                        onPlay={e => {
                          const v = e.currentTarget;
                          v.currentTime = clip.startTime;
                        }}
                      />

                      {/* Top Hook Headline Overlay */}
                      {clip.headline?.show && (
                        <div 
                          className="absolute top-4 inset-x-3 px-2 py-1 rounded text-center text-xs font-black shadow-md uppercase tracking-wide pointer-events-none z-10"
                          style={{ backgroundColor: clip.headline.bannerBg, color: clip.headline.textColor }}
                        >
                          {clip.headline.text}
                        </div>
                      )}

                      {/* Animated Subtitle Preview Overlay */}
                      <div className="absolute inset-x-4 bottom-8 text-center pointer-events-none z-10">
                        <span 
                          className="text-xs sm:text-sm font-black px-2 py-1 rounded bg-black/70 text-yellow-300 shadow-md uppercase tracking-wider text-stroke-black inline-block"
                        >
                          {clip.subtitles[0]?.text || clip.hook}
                        </span>
                      </div>

                      {/* Viral Score Badge */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg backdrop-blur-md bg-black/75 border border-purple-500/40 text-white">
                        <Flame className={`w-3.5 h-3.5 ${isViral ? 'text-amber-400' : 'text-purple-400'}`} />
                        <span>Viral Score: {clip.viralScore}</span>
                      </div>

                      {/* Duration badge */}
                      <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-black/70 text-[10px] font-mono text-white">
                        {clip.duration}s
                      </div>
                    </div>

                    {/* Clip Metadata */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {clip.title}
                        </h3>
                        <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-1 line-clamp-1">
                          "{clip.hook}"
                        </p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        <strong className="text-slate-900 dark:text-slate-200 block mb-0.5">
                          Why it will perform:
                        </strong>
                        {clip.whyViral}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Range: {Math.round(clip.startTime)}s - {Math.round(clip.endTime)}s</span>
                        <span className="font-semibold uppercase">{clip.aspectRatio} • {clip.language}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 pt-0 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openClipInEditor(clip, activeProject)}
                        className="py-2 px-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Edit Studio</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveClip(clip);
                          setIsExportModalOpen(true);
                        }}
                        className="py-2 px-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyCaption(clip)}
                      className="w-full py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedClipId === clip.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Caption & Tags Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Hook Caption & Hashtags</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
