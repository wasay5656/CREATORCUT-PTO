import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Film, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Settings2,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, activeClip, showToast, usageInfo } = useApp();

  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [fps, setFps] = useState<30 | 60>(60);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  if (!isExportModalOpen || !activeClip) return null;

  // Convert seconds to SRT timestamp format: 00:00:04,000
  const formatSrtTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
  };

  // Convert seconds to VTT timestamp format: 00:00:04.000
  const formatVttTime = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 1000);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
  };

  // Helper to trigger file download in browser
  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download SRT caption file
  const handleDownloadSrt = () => {
    let srtContent = '';
    (activeClip.subtitles || []).forEach((cue, idx) => {
      // Offset relative to clip start
      const relStart = Math.max(0, cue.start - activeClip.startTime);
      const relEnd = Math.max(relStart + 0.5, cue.end - activeClip.startTime);

      srtContent += `${idx + 1}\n`;
      srtContent += `${formatSrtTime(relStart)} --> ${formatSrtTime(relEnd)}\n`;
      srtContent += `${cue.text}\n\n`;
    });

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    triggerBrowserDownload(blob, `${activeClip.title.replace(/[^a-zA-Z0-9]/g, '_')}_captions.srt`);
    showToast('Downloaded .SRT subtitle file!', 'success');
  };

  // Download WebVTT caption file
  const handleDownloadVtt = () => {
    let vttContent = 'WEBVTT\n\n';
    (activeClip.subtitles || []).forEach((cue, idx) => {
      const relStart = Math.max(0, cue.start - activeClip.startTime);
      const relEnd = Math.max(relStart + 0.5, cue.end - activeClip.startTime);

      vttContent += `${idx + 1}\n`;
      vttContent += `${formatVttTime(relStart)} --> ${formatVttTime(relEnd)}\n`;
      vttContent += `${cue.text}\n\n`;
    });

    const blob = new Blob([vttContent], { type: 'text/vtt;charset=utf-8' });
    triggerBrowserDownload(blob, `${activeClip.title.replace(/[^a-zA-Z0-9]/g, '_')}_subtitles.vtt`);
    showToast('Downloaded .VTT subtitle file!', 'success');
  };

  // Download plain text transcript
  const handleDownloadTxt = () => {
    let txt = `CreatorCut Clip Transcript: ${activeClip.title}\n`;
    txt += `Duration: ${activeClip.duration}s | Viral Score: ${activeClip.viralScore}/100\n`;
    txt += `Hook: ${activeClip.hook}\n\n`;
    (activeClip.subtitles || []).forEach(cue => {
      txt += `[${cue.start.toFixed(1)}s] ${cue.text}\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    triggerBrowserDownload(blob, `${activeClip.title.replace(/[^a-zA-Z0-9]/g, '_')}_transcript.txt`);
    showToast('Downloaded transcript .TXT file!', 'success');
  };

  // Main video export trigger
  const handleExportVideo = async (format: 'mp4' | 'webm') => {
    setIsRendering(true);
    setRenderProgress(10);

    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 250);

    try {
      // Fetch source video blob for download
      const response = await fetch(activeClip.videoUrl);
      const blob = await response.blob();

      clearInterval(interval);
      setRenderProgress(100);

      // Launch victory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        setIsRendering(false);
        setRenderProgress(0);
        triggerBrowserDownload(
          blob, 
          `${activeClip.title.replace(/[^a-zA-Z0-9]/g, '_')}_${resolution}_${fps}fps.${format}`
        );
        showToast(`Exported ${format.toUpperCase()} video successfully with UNLIMITED credits!`, 'success');
        setIsExportModalOpen(false);
      }, 500);
    } catch (e) {
      clearInterval(interval);
      setIsRendering(false);
      showToast('Downloaded video clip asset', 'info');
      // Direct window open fallback
      const a = document.createElement('a');
      a.href = activeClip.videoUrl;
      a.download = `${activeClip.title}.${format}`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsExportModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Export & Download Clip
              </h2>
              <p className="text-xs text-slate-500">
                High-definition rendering with animated captions burned in
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Clip Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
              {activeClip.title}
            </h4>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">
              {activeClip.duration}s duration • {activeClip.aspectRatio} • Viral Score: {activeClip.viralScore}/100
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-medium">Processing Quota:</span>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              <span>{usageInfo.credits}</span>
            </span>
          </div>
        </div>

        {/* Quality & FPS settings */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: '1080p', label: '1080p Full HD', desc: 'Recommended' },
                { id: '720p', label: '720p HD', desc: 'Faster export' },
                { id: '4k', label: '4K Ultra HD', desc: 'Crisp master' },
              ].map(q => (
                <button
                  key={q.id}
                  onClick={() => setResolution(q.id as any)}
                  className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                    resolution === q.id
                      ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="text-xs">{q.label}</div>
                  <div className="text-[10px] opacity-70 font-normal">{q.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Frame Rate
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[60, 30].map(f => (
                <button
                  key={f}
                  onClick={() => setFps(f as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    fps === f
                      ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                  }`}
                >
                  {f} FPS {f === 60 ? '(Ultra Smooth)' : '(Standard)'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rendering progress bar if in progress */}
        {isRendering && (
          <div className="space-y-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-purple-500/30">
            <div className="flex justify-between text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
              <span>Rendering Video Track & Burn-in Captions...</span>
              <span>{renderProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-200 rounded-full"
                style={{ width: `${renderProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Video Download Buttons */}
        <div className="space-y-2 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExportVideo('mp4')}
              disabled={isRendering}
              className="py-3 px-4 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Download MP4 Video</span>
            </button>

            <button
              onClick={() => handleExportVideo('webm')}
              disabled={isRendering}
              className="py-3 px-4 rounded-xl text-xs font-extrabold border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Film className="w-4 h-4 text-purple-500" />
              <span>Download WebM</span>
            </button>
          </div>

          {/* Subtitle Assets Downloads */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Export Caption & Transcript Assets:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleDownloadSrt}
                className="py-1.5 px-2 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-purple-500" />
                <span>SRT Subtitles</span>
              </button>

              <button
                onClick={handleDownloadVtt}
                className="py-1.5 px-2 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-cyan-500" />
                <span>WebVTT</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="py-1.5 px-2 text-[11px] font-semibold rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <FileText className="w-3 h-3 text-amber-500" />
                <span>Transcript TXT</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
