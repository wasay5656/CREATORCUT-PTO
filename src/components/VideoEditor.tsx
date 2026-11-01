import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Film,
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Scissors, 
  Sparkles, 
  Type, 
  Layers, 
  Palette, 
  Smartphone, 
  Maximize2, 
  Download, 
  Sliders, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Languages, 
  ChevronLeft, 
  ChevronRight,
  Split,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AspectRatio, Clip, SubtitleCue, SubtitleStylePreset } from '../types';
import { SUBTITLE_STYLES_CONFIG, SUPPORTED_LANGUAGES } from '../data/sampleData';

export const VideoEditor: React.FC = () => {
  const { 
    activeClip, 
    activeProject, 
    updateActiveClip, 
    showToast, 
    setIsExportModalOpen, 
    brandKit,
    setActiveClip 
  } = useApp();

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);

  // Safe area overlay toggle
  const [safeAreaGuide, setSafeAreaGuide] = useState<'none' | 'tiktok' | 'reels' | 'shorts'>('none');

  // Left sidebar tabs: 'subtitles' | 'styling' | 'headline' | 'layout' | 'audio'
  const [editorTab, setEditorTab] = useState<'subtitles' | 'styling' | 'headline' | 'layout' | 'audio'>('subtitles');

  // Translation dropdown state
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetTransLang, setTargetTransLang] = useState('ur');

  // Sync video element with active clip on change
  useEffect(() => {
    if (activeClip && videoRef.current) {
      videoRef.current.currentTime = activeClip.startTime;
      setCurrentTime(activeClip.startTime);
      setDuration(Math.max(activeClip.endTime - activeClip.startTime, 1));
      setIsPlaying(false);
    }
  }, [activeClip?.id]);

  // Video time update event handler
  const handleTimeUpdate = () => {
    if (!videoRef.current || !activeClip) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    // Loop within clip boundary if looping is on
    if (t >= activeClip.endTime) {
      if (isLooping) {
        videoRef.current.currentTime = activeClip.startTime;
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current || !activeClip) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime >= activeClip.endTime || videoRef.current.currentTime < activeClip.startTime) {
        videoRef.current.currentTime = activeClip.startTime;
      }
      videoRef.current.play().catch(e => console.error(e));
      setIsPlaying(true);
    }
  };

  const seekTo = (sec: number) => {
    if (!videoRef.current || !activeClip) return;
    const clamped = Math.max(activeClip.startTime, Math.min(sec, activeClip.endTime));
    videoRef.current.currentTime = clamped;
    setCurrentTime(clamped);
  };

  // Keyboard shortcut for Play/Pause (Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        seekTo(currentTime - 2);
      } else if (e.code === 'ArrowRight') {
        seekTo(currentTime + 2);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentTime, activeClip]);

  if (!activeClip) {
    return (
      <div className="p-12 text-center max-w-lg mx-auto space-y-4">
        <Film className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          No Clip Selected
        </h2>
        <p className="text-xs text-slate-500">
          Please select a project or generate viral clips in the AI Clip Maker.
        </p>
      </div>
    );
  }

  // Find active subtitle cue at current video time
  const currentCue = activeClip.subtitles?.find(
    s => currentTime >= s.start && currentTime <= s.end
  );

  // Calculate clip progress percent
  const clipProgressPercent = Math.max(
    0,
    Math.min(100, ((currentTime - activeClip.startTime) / (activeClip.endTime - activeClip.startTime)) * 100)
  );

  // Subtitle styling helpers
  const style = activeClip.subtitleStyle || SUBTITLE_STYLES_CONFIG.hormozi;

  // Handle trim updates
  const handleStartTrimChange = (val: number) => {
    const newStart = Math.max(0, Math.min(val, activeClip.endTime - 2));
    updateActiveClip({
      startTime: newStart,
      duration: Math.round(activeClip.endTime - newStart),
    });
    seekTo(newStart);
  };

  const handleEndTrimChange = (val: number) => {
    const parentDur = activeProject?.duration || 180;
    const newEnd = Math.min(parentDur, Math.max(val, activeClip.startTime + 2));
    updateActiveClip({
      endTime: newEnd,
      duration: Math.round(newEnd - activeClip.startTime),
    });
  };

  // Subtitle cue text edit
  const handleEditSubtitleText = (cueId: string, newText: string) => {
    const updatedSubs = activeClip.subtitles.map(c => 
      c.id === cueId ? { ...c, text: newText } : c
    );
    updateActiveClip({ subtitles: updatedSubs });
  };

  // Add new subtitle cue
  const handleAddSubtitleCue = () => {
    const newCue: SubtitleCue = {
      id: `sub-${Date.now()}`,
      start: currentTime,
      end: Math.min(currentTime + 3, activeClip.endTime),
      text: 'New subtitle caption',
      speaker: 'Speaker',
    };
    const updated = [...(activeClip.subtitles || []), newCue].sort((a, b) => a.start - b.start);
    updateActiveClip({ subtitles: updated });
    showToast('Added new subtitle cue at current playhead', 'success');
  };

  // Delete subtitle cue
  const handleDeleteSubtitleCue = (cueId: string) => {
    const updated = activeClip.subtitles.filter(c => c.id !== cueId);
    updateActiveClip({ subtitles: updated });
    showToast('Deleted subtitle cue', 'info');
  };

  // AI Translate all subtitles
  const handleTranslateSubtitles = async () => {
    setIsTranslating(true);
    try {
      const res = await fetch('/api/ai/translate-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtitles: activeClip.subtitles,
          targetLanguage: targetTransLang,
        }),
      });
      const data = await res.json();
      if (data.subtitles) {
        updateActiveClip({
          subtitles: data.subtitles,
          language: targetTransLang,
        });
        showToast(`Subtitles translated into ${targetTransLang.toUpperCase()} successfully!`, 'success');
      }
    } catch (e) {
      console.error(e);
      showToast('Translation error occurred', 'error');
    } finally {
      setIsTranslating(false);
    }
  };

  // Aspect ratio canvas wrapper styling
  const getAspectRatioClasses = () => {
    switch (activeClip.aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-h-[580px] w-auto';
      case '1:1':
        return 'aspect-square max-h-[520px] w-auto';
      case '4:5':
        return 'aspect-[4/5] max-h-[540px] w-auto';
      case '16:9':
        return 'aspect-[16/9] w-full max-w-[700px]';
      default:
        return 'aspect-[9/16] max-h-[580px] w-auto';
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Top Studio Control Bar */}
      <div className="h-14 border-b px-4 lg:px-6 flex items-center justify-between shrink-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={activeClip.title}
            onChange={e => updateActiveClip({ title: e.target.value })}
            className="text-sm font-extrabold px-2.5 py-1 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-purple-500 bg-transparent text-slate-900 dark:text-white max-w-[260px] sm:max-w-md truncate"
            title="Click to rename clip"
          />
          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {activeClip.duration}s
          </span>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          {(['9:16', '1:1', '4:5', '16:9'] as AspectRatio[]).map(ratio => (
            <button
              key={ratio}
              onClick={() => updateActiveClip({ aspectRatio: ratio })}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeClip.aspectRatio === ratio
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Multiple clips carousel selector if project has more */}
          {activeProject?.clips && activeProject.clips.length > 1 && (
            <div className="hidden sm:flex items-center gap-1 border-r pr-2 mr-1 border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium mr-1">Clip:</span>
              <select
                value={activeClip.id}
                onChange={e => {
                  const found = activeProject.clips.find(c => c.id === e.target.value);
                  if (found) setActiveClip(found);
                }}
                className="text-xs py-1 px-2 rounded-lg border bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
              >
                {activeProject.clips.map((c, i) => (
                  <option key={c.id} value={c.id}>
                    #{i + 1} - {c.title.slice(0, 20)}...
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-purple-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clip</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Sidebar + Center Player Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Control Panel */}
        <div className="w-80 lg:w-96 border-r flex flex-col shrink-0 bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
          {/* Tabs bar */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
            {[
              { id: 'subtitles', label: 'Captions', icon: Type },
              { id: 'styling', label: 'Style', icon: Palette },
              { id: 'headline', label: 'Hook Banner', icon: Sparkles },
              { id: 'layout', label: 'Layout', icon: Smartphone },
              { id: 'audio', label: 'Audio', icon: Volume2 },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = editorTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setEditorTab(tab.id as any)}
                  className={`flex-1 min-w-[70px] py-3 flex flex-col items-center gap-1 transition-all cursor-pointer border-b-2 ${
                    isActive
                      ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-500/5'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* TAB 1: SUBTITLES & TRANSCRIPT */}
            {editorTab === 'subtitles' && (
              <div className="space-y-4">
                {/* AI Translate Tool */}
                <div className="p-3 rounded-xl border bg-purple-500/5 border-purple-500/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-purple-500" />
                      <span>AI Multilingual Translate</span>
                    </span>
                    <span className="text-[10px] text-purple-600 font-bold uppercase">
                      Gemini 3.8
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={targetTransLang}
                      onChange={e => setTargetTransLang(e.target.value)}
                      className="flex-1 py-1 px-2 text-xs rounded-lg border bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                    >
                      {SUPPORTED_LANGUAGES.map(l => (
                        <option key={l.code} value={l.code}>
                          {l.flag} {l.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleTranslateSubtitles}
                      disabled={isTranslating}
                      className="px-3 py-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isTranslating ? 'Translating...' : 'Translate'}
                    </button>
                  </div>
                </div>

                {/* Subtitle Cue List */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Subtitle Cues ({activeClip.subtitles?.length || 0})
                  </span>
                  <button
                    onClick={handleAddSubtitleCue}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Cue</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(activeClip.subtitles || []).map((cue, idx) => {
                    const isCueActive = currentTime >= cue.start && currentTime <= cue.end;

                    return (
                      <div
                        key={cue.id}
                        className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                          isCueActive
                            ? 'border-purple-500 bg-purple-500/10 ring-1 ring-purple-500/40'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                          <button
                            onClick={() => seekTo(cue.start)}
                            className="hover:text-purple-500 font-bold flex items-center gap-1 cursor-pointer"
                            title="Jump to this moment"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>{cue.start.toFixed(1)}s - {cue.end.toFixed(1)}s</span>
                          </button>
                          <button
                            onClick={() => handleDeleteSubtitleCue(cue.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            title="Delete caption cue"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <textarea
                          rows={2}
                          value={cue.text}
                          onChange={e => handleEditSubtitleText(cue.id, e.target.value)}
                          className="w-full p-2 text-xs rounded-lg border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CAPTION STYLING */}
            {editorTab === 'styling' && (
              <div className="space-y-5">
                {/* Presets */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Subtitle Style Preset
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'hormozi', label: 'Hormozi Pop', bg: 'bg-yellow-400 text-black' },
                      { id: 'neon', label: 'Neon Cyber', bg: 'bg-cyan-500 text-black' },
                      { id: 'minimal', label: 'Minimalist', bg: 'bg-white text-slate-900' },
                      { id: 'boxed', label: 'Boxed Contrast', bg: 'bg-red-600 text-white' },
                      { id: 'nastaliq', label: 'Urdu / Arabic', bg: 'bg-emerald-600 text-white' },
                      { id: 'karaoke', label: 'Karaoke Flow', bg: 'bg-pink-500 text-white' },
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => {
                          const conf = SUBTITLE_STYLES_CONFIG[st.id] || SUBTITLE_STYLES_CONFIG.hormozi;
                          updateActiveClip({ subtitleStyle: conf });
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          style.preset === st.id
                            ? 'border-purple-500 bg-purple-500/10 font-bold ring-1 ring-purple-500/40'
                            : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                      >
                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${st.bg} inline-block mb-1`}>
                          CAPTION
                        </span>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {st.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Font Size</span>
                    <span className="font-mono text-purple-600">{style.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="48"
                    value={style.fontSize}
                    onChange={e => {
                      updateActiveClip({
                        subtitleStyle: { ...style, fontSize: Number(e.target.value) }
                      });
                    }}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Vertical Position Y */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Vertical Position</span>
                    <span className="font-mono text-purple-600">{style.positionY}% from top</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="92"
                    value={style.positionY}
                    onChange={e => {
                      updateActiveClip({
                        subtitleStyle: { ...style, positionY: Number(e.target.value) }
                      });
                    }}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Text Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={style.textColor}
                        onChange={e => {
                          updateActiveClip({
                            subtitleStyle: { ...style, textColor: e.target.value }
                          });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <span className="text-xs font-mono">{style.textColor}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold">Highlight Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={style.highlightColor}
                        onChange={e => {
                          updateActiveClip({
                            subtitleStyle: { ...style, highlightColor: e.target.value }
                          });
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                      />
                      <span className="text-xs font-mono">{style.highlightColor}</span>
                    </div>
                  </div>
                </div>

                {/* Text Transform Toggle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Capitalization</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateActiveClip({ subtitleStyle: { ...style, textTransform: 'uppercase' } })}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        style.textTransform === 'uppercase'
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      ALL CAPS
                    </button>
                    <button
                      onClick={() => updateActiveClip({ subtitleStyle: { ...style, textTransform: 'none' } })}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                        style.textTransform === 'none'
                          ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      Normal Case
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HEADLINE & HOOK BANNER */}
            {editorTab === 'headline' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Show Top Hook Banner
                  </span>
                  <input
                    type="checkbox"
                    checked={activeClip.headline?.show ?? true}
                    onChange={e => {
                      updateActiveClip({
                        headline: {
                          ...(activeClip.headline || { bannerBg: '#DC2626', textColor: '#FFFFFF', text: '' }),
                          show: e.target.checked,
                        }
                      });
                    }}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                  />
                </div>

                {activeClip.headline?.show && (
                  <div className="space-y-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold">Banner Text</label>
                      <input
                        type="text"
                        value={activeClip.headline.text}
                        onChange={e => {
                          updateActiveClip({
                            headline: { ...activeClip.headline, text: e.target.value }
                          });
                        }}
                        className="w-full px-3 py-2 text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-800 text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Banner Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeClip.headline.bannerBg}
                            onChange={e => {
                              updateActiveClip({
                                headline: { ...activeClip.headline, bannerBg: e.target.value }
                              });
                            }}
                            className="w-8 h-8 rounded cursor-pointer border-0"
                          />
                          <span className="text-xs font-mono">{activeClip.headline.bannerBg}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold">Text Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeClip.headline.textColor}
                            onChange={e => {
                              updateActiveClip({
                                headline: { ...activeClip.headline, textColor: e.target.value }
                              });
                            }}
                            className="w-8 h-8 rounded cursor-pointer border-0"
                          />
                          <span className="text-xs font-mono">{activeClip.headline.textColor}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: LAYOUT & SAFE ZONES */}
            {editorTab === 'layout' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Social App Safe-Zone Overlay
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Preview how buttons (Like, Comment, Share, Sound) appear on social apps to avoid overlapping text.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'none', label: 'Guides Off' },
                      { id: 'tiktok', label: 'TikTok UI' },
                      { id: 'reels', label: 'Reels UI' },
                      { id: 'shorts', label: 'Shorts UI' },
                    ].map(g => (
                      <button
                        key={g.id}
                        onClick={() => setSafeAreaGuide(g.id as any)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          safeAreaGuide === g.id
                            ? 'border-purple-500 bg-purple-500/10 text-purple-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speaker Tracking Simulation Toggle */}
                <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        Auto Speaker Face-Centering
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Keeps active speaker in the 9:16 vertical center
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeClip.speakerTracking}
                      onChange={e => updateActiveClip({ speakerTracking: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: AUDIO & VOICE */}
            {editorTab === 'audio' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Clip Volume</span>
                    <span className="font-mono text-purple-600">{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={e => {
                      const v = Number(e.target.value);
                      setVolume(v);
                      if (videoRef.current) videoRef.current.volume = v;
                    }}
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-xl border bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        AI Voice Clarity & Denoise
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Removes background hiss and boosts dialogue presence
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={activeClip.audio?.voiceEnhanced ?? true}
                      onChange={e => {
                        updateActiveClip({
                          audio: { ...(activeClip.audio || { volume: 1, muted: false, ducking: false, voiceEnhanced: true }), voiceEnhanced: e.target.checked }
                        });
                        showToast(`Voice Enhancement ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
                      }}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Video Preview Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-6 bg-slate-900/40 relative overflow-hidden">
          {/* Aspect ratio frame container */}
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-700/60 transition-all duration-300 ${getAspectRatioClasses()}`}>
            <video
              ref={videoRef}
              src={activeClip.videoUrl}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className={`w-full h-full object-cover cursor-pointer ${
                activeClip.speakerTracking ? 'scale-105' : ''
              }`}
              playsInline
            />

            {/* Top Hook Banner Overlay */}
            {activeClip.headline?.show && (
              <div 
                className="absolute top-4 inset-x-4 px-3 py-1.5 rounded-lg text-center font-black shadow-lg uppercase tracking-wide pointer-events-none z-20"
                style={{ 
                  backgroundColor: activeClip.headline.bannerBg, 
                  color: activeClip.headline.textColor,
                  fontSize: `${Math.max(12, Math.round(style.fontSize * 0.5))}px`
                }}
              >
                {activeClip.headline.text}
              </div>
            )}

            {/* Brand Logo Watermark Overlay */}
            {brandKit.logoUrl && (
              <div 
                className={`absolute pointer-events-none z-20 ${
                  brandKit.watermarkPosition === 'top-left' ? 'top-4 left-4' :
                  brandKit.watermarkPosition === 'top-right' ? 'top-4 right-4' :
                  brandKit.watermarkPosition === 'bottom-left' ? 'bottom-16 left-4' : 'bottom-16 right-4'
                }`}
                style={{ opacity: brandKit.watermarkOpacity }}
              >
                <img src={brandKit.logoUrl} alt="Watermark" className="h-6 w-auto object-contain" />
              </div>
            )}

            {/* Live Subtitle Rendering Engine */}
            {currentCue && (
              <div 
                className="absolute inset-x-4 text-center pointer-events-none z-20 transition-all select-none"
                style={{ top: `${style.positionY}%` }}
              >
                <span
                  className={`inline-block px-3 py-1.5 rounded-xl font-black shadow-xl tracking-wider ${
                    style.textTransform === 'uppercase' ? 'uppercase' : ''
                  }`}
                  style={{
                    fontSize: `${style.fontSize}px`,
                    color: style.textColor,
                    backgroundColor: style.backgroundColor || 'rgba(0, 0, 0, 0.75)',
                    textShadow: style.hasShadow ? '0 2px 8px rgba(0,0,0,0.9)' : 'none',
                    WebkitTextStroke: style.strokeWidth ? `${style.strokeWidth}px ${style.strokeColor || '#000'}` : 'none',
                    fontFamily: style.fontFamily,
                  }}
                >
                  {/* Word-level animated highlight or whole sentence */}
                  {currentCue.words && currentCue.words.length > 0 ? (
                    currentCue.words.map((w, wIdx) => {
                      const isWordActive = currentTime >= w.start && currentTime <= w.end;
                      return (
                        <span
                          key={wIdx}
                          style={{
                            color: isWordActive ? style.highlightColor : style.textColor,
                            transform: isWordActive ? 'scale(1.1)' : 'scale(1)',
                            display: 'inline-block',
                            marginRight: '0.25em',
                            transition: 'color 0.1s ease, transform 0.1s ease',
                          }}
                        >
                          {w.word}
                        </span>
                      );
                    })
                  ) : (
                    <span>{currentCue.text}</span>
                  )}
                </span>
              </div>
            )}

            {/* Animated Bottom Progress Bar */}
            {brandKit.showProgressBar && (
              <div className="absolute bottom-0 inset-x-0 h-1.5 bg-black/40 z-20 pointer-events-none">
                <div 
                  className="h-full transition-all duration-100"
                  style={{ 
                    width: `${clipProgressPercent}%`,
                    backgroundColor: brandKit.progressColor || '#8B5CF6'
                  }}
                />
              </div>
            )}

            {/* Social App Safe-Zone UI Simulation Overlays */}
            {safeAreaGuide !== 'none' && (
              <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4">
                <div className="flex justify-between items-center text-[10px] text-white/70">
                  <span>Following | For You</span>
                  <span>🔍</span>
                </div>
                <div className="flex justify-end items-end space-y-4">
                  <div className="flex flex-col items-center gap-4 pb-12 pr-1 text-white/80 text-[10px]">
                    <div className="w-8 h-8 rounded-full border border-white bg-slate-800 flex items-center justify-center font-bold">👤</div>
                    <div className="flex flex-col items-center"><span>❤️</span><span>124K</span></div>
                    <div className="flex flex-col items-center"><span>💬</span><span>1.4K</span></div>
                    <div className="flex flex-col items-center"><span>🔖</span><span>18K</span></div>
                    <div className="flex flex-col items-center"><span>↗️</span><span>Share</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* Center Play Overlay Icon when paused */}
            {!isPlaying && (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer z-10"
              >
                <div className="w-16 h-16 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Timeline & Controls */}
      <div className="h-28 border-t px-4 lg:px-6 py-2.5 flex flex-col justify-between shrink-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        {/* Playback Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
              title="Play / Pause (Spacebar)"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            <button
              onClick={() => seekTo(currentTime - 5)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Jump -5s"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
              <span>{Math.max(0, currentTime - activeClip.startTime).toFixed(1)}s</span>
              <span className="text-slate-400"> / {activeClip.duration}s</span>
            </div>
          </div>

          {/* Center Trim Info */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span>Trim Start: <strong className="text-purple-600">{activeClip.startTime.toFixed(1)}s</strong></span>
            <span>Trim End: <strong className="text-purple-600">{activeClip.endTime.toFixed(1)}s</strong></span>
          </div>

          {/* Right quick tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                isLooping
                  ? 'border-purple-500 text-purple-600 bg-purple-500/10'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400'
              }`}
            >
              Loop
            </button>

            <button
              onClick={() => {
                const currentV = isMuted ? 1 : 0;
                setIsMuted(!isMuted);
                if (videoRef.current) videoRef.current.muted = !isMuted;
              }}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Visual Timeline Track with Scrubbing and Trim Handles */}
        <div 
          ref={timelineRef}
          onClick={e => {
            if (!timelineRef.current || !activeClip) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const ratio = clickX / rect.width;
            const targetSec = activeClip.startTime + ratio * (activeClip.endTime - activeClip.startTime);
            seekTo(targetSec);
          }}
          className="relative h-10 w-full rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer select-none group"
        >
          {/* Simulated Audio Waveform track */}
          <div className="absolute inset-0 flex items-center justify-around px-2 opacity-30 pointer-events-none">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-purple-500 rounded-full"
                style={{ height: `${((i * 17 + 23) % 80) + 15}%` }}
              />
            ))}
          </div>

          {/* Subtitle cues visualization blocks on timeline */}
          {(activeClip.subtitles || []).map(cue => {
            const clipDur = activeClip.endTime - activeClip.startTime;
            const leftPct = Math.max(0, ((cue.start - activeClip.startTime) / clipDur) * 100);
            const widthPct = Math.min(100 - leftPct, ((cue.end - cue.start) / clipDur) * 100);

            return (
              <div
                key={cue.id}
                className="absolute top-1 bottom-1 rounded bg-purple-500/25 border border-purple-500/40 pointer-events-none flex items-center px-1 overflow-hidden text-[9px] text-purple-700 dark:text-purple-300 font-semibold truncate"
                style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
              >
                {cue.text}
              </div>
            );
          })}

          {/* Current Playhead Scrubber */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400 z-10 pointer-events-none transition-all duration-75 shadow-lg shadow-cyan-400/50"
            style={{ left: `${clipProgressPercent}%` }}
          >
            <div className="w-3 h-3 rounded-full bg-cyan-400 -ml-1 -mt-0.5 shadow-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
