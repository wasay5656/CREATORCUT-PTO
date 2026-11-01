import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandKit, Clip, NavTab, Project, SubtitleStyle } from '../types';
import { DEFAULT_BRAND_KIT, INITIAL_PROJECTS, SUBTITLE_STYLES_CONFIG } from '../data/sampleData';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  activeClip: Clip | null;
  setActiveClip: (clip: Clip | null) => void;
  brandKit: BrandKit;
  setBrandKit: React.Dispatch<React.SetStateAction<BrandKit>>;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  usageInfo: {
    tier: string;
    credits: string; // Strictly "UNLIMITED"
    storage: string;
    renderedMinutes: number;
    clipsCount: number;
  };
  isCopyrightModalOpen: boolean;
  setIsCopyrightModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  openClipInEditor: (clip: Clip, project?: Project) => void;
  updateActiveClip: (updates: Partial<Clip>) => void;
  saveNewProject: (project: Project) => void;
  deleteProject: (projectId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme management with localStorage persistence
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('creatorcut_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark'; // Default to sleek dark mode
  });

  useEffect(() => {
    localStorage.setItem('creatorcut_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Projects state
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('creatorcut_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
    return INITIAL_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem('creatorcut_projects', JSON.stringify(projects));
  }, [projects]);

  // Active project and clip
  const [activeProject, setActiveProject] = useState<Project | null>(() => projects[0] || null);
  const [activeClip, setActiveClip] = useState<Clip | null>(() => {
    if (projects[0]?.clips?.length) {
      return projects[0].clips[0];
    }
    return null;
  });

  // Brand Kit
  const [brandKit, setBrandKit] = useState<BrandKit>(() => {
    const saved = localStorage.getItem('creatorcut_brandkit');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse brandkit', e);
      }
    }
    return DEFAULT_BRAND_KIT;
  });

  useEffect(() => {
    localStorage.setItem('creatorcut_brandkit', JSON.stringify(brandKit));
  }, [brandKit]);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Modals
  const [isCopyrightModalOpen, setIsCopyrightModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Usage info with strictly "UNLIMITED" credits display
  const totalClips = projects.reduce((acc, p) => acc + (p.clips?.length || p.clipsCount || 0), 0);
  const totalMins = projects.reduce((acc, p) => acc + Math.round((p.duration || 60) / 60), 0);

  const usageInfo = {
    tier: 'Creator Unlimited Pass',
    credits: 'UNLIMITED',
    storage: 'Unlimited Cloud Storage',
    renderedMinutes: totalMins,
    clipsCount: totalClips,
  };

  // Open clip in editor helper
  const openClipInEditor = (clip: Clip, project?: Project) => {
    if (project) {
      setActiveProject(project);
    } else {
      const parent = projects.find(p => p.id === clip.projectId);
      if (parent) setActiveProject(parent);
    }
    setActiveClip(clip);
    setActiveTab('editor');
    showToast(`Loaded "${clip.title}" into Video Editor`, 'info');
  };

  // Update active clip
  const updateActiveClip = (updates: Partial<Clip>) => {
    if (!activeClip) return;
    const updated = { ...activeClip, ...updates };
    setActiveClip(updated);

    // Sync with project clips
    setProjects(prevProjects =>
      prevProjects.map(proj => {
        if (proj.id === updated.projectId) {
          return {
            ...proj,
            clips: (proj.clips || []).map(c => (c.id === updated.id ? updated : c)),
          };
        }
        return proj;
      })
    );
  };

  const saveNewProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
    setActiveProject(project);
    if (project.clips && project.clips.length > 0) {
      setActiveClip(project.clips[0]);
    }
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProject?.id === projectId) {
      const remaining = projects.filter(p => p.id !== projectId);
      setActiveProject(remaining[0] || null);
      setActiveClip(remaining[0]?.clips?.[0] || null);
    }
    showToast('Project removed', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        projects,
        setProjects,
        activeProject,
        setActiveProject,
        activeClip,
        setActiveClip,
        brandKit,
        setBrandKit,
        toasts,
        showToast,
        removeToast,
        usageInfo,
        isCopyrightModalOpen,
        setIsCopyrightModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        openClipInEditor,
        updateActiveClip,
        saveNewProject,
        deleteProject,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
