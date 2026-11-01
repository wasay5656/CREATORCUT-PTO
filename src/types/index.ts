export type AspectRatio = '9:16' | '1:1' | '16:9' | '4:5';

export type ContentType = 
  | 'podcast'
  | 'talking-head'
  | 'educational'
  | 'product-ad'
  | 'promotional'
  | 'tutorial'
  | 'explainer'
  | 'social';

export type SubtitleStylePreset = 
  | 'hormozi'
  | 'neon'
  | 'minimal'
  | 'boxed'
  | 'nastaliq'
  | 'karaoke';

export interface SubtitleWord {
  word: string;
  start: number;
  end: number;
}

export interface SubtitleCue {
  id: string;
  start: number;
  end: number;
  text: string;
  speaker?: string;
  words?: SubtitleWord[];
}

export interface SubtitleStyle {
  preset: SubtitleStylePreset;
  fontFamily: string;
  fontSize: number; // in px or rem relative
  textColor: string;
  highlightColor: string;
  backgroundColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  textTransform: 'uppercase' | 'none' | 'capitalize';
  positionY: number; // 0 to 100 percentage from top
  hasShadow: boolean;
  activeAnimation: 'pop' | 'glow' | 'bounce' | 'color';
}

export interface ClipHeadline {
  show: boolean;
  text: string;
  bannerBg: string;
  textColor: string;
}

export interface ClipAudio {
  volume: number; // 0 to 1
  muted: boolean;
  voiceEnhanced: boolean;
  ducking: boolean;
}

export interface Clip {
  id: string;
  projectId: string;
  title: string;
  hook: string;
  viralScore: number; // 0 - 100
  whyViral: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  duration: number; // in seconds
  aspectRatio: AspectRatio;
  videoUrl: string;
  thumbnailUrl?: string;
  subtitles: SubtitleCue[];
  subtitleStyle: SubtitleStyle;
  headline: ClipHeadline;
  audio: ClipAudio;
  category: ContentType;
  speakerTracking: boolean;
  language: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  sourceType: 'upload' | 'url' | 'sample';
  sourceUrl: string;
  videoUrl: string;
  duration: number; // seconds
  thumbnail: string;
  createdAt: string;
  status: 'ready' | 'processing' | 'failed';
  clipsCount: number;
  contentType: ContentType;
  language: string;
  rightsStatus: 'original' | 'licensed' | 'fair-use' | 'public-domain';
  clips: Clip[];
}

export interface BrandKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  logoUrl?: string;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  watermarkOpacity: number;
  showProgressBar: boolean;
  progressColor: string;
  outroCta: string;
}

export interface Template {
  id: string;
  name: string;
  category: ContentType;
  description: string;
  previewUrl: string;
  videoUrl: string;
  aspectRatio: AspectRatio;
  subtitlePreset: SubtitleStylePreset;
  headlineText: string;
  headlineBg: string;
  headlineColor: string;
  tags: string[];
}

export type NavTab = 
  | 'dashboard'
  | 'clip-maker'
  | 'editor'
  | 'projects'
  | 'templates'
  | 'brand-kit'
  | 'settings';
