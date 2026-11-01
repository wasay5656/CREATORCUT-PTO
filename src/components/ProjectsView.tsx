import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  Plus, 
  Film, 
  Scissors, 
  Trash2, 
  Clock, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

export const ProjectsView: React.FC = () => {
  const { 
    projects, 
    setActiveProject, 
    openClipInEditor, 
    setActiveTab, 
    deleteProject, 
    showToast 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || p.contentType === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <FolderGit2 className="w-6 h-6 text-purple-500" />
            <span>My Videos & Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize, repurpose, and manage all your uploaded and processed video assets.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('clip-maker')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search projects by title..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['all', 'podcast', 'talking-head', 'educational', 'product-ad'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap border transition-all cursor-pointer ${
                filterType === f
                  ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No projects matched your search
          </p>
          <button
            onClick={() => setActiveTab('clip-maker')}
            className="text-xs font-bold text-purple-600 hover:underline"
          >
            Create your first project now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(proj => {
            const hasClips = proj.clips && proj.clips.length > 0;

            return (
              <div
                key={proj.id}
                className="group rounded-2xl border overflow-hidden transition-all bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-950 overflow-hidden">
                    <img
                      src={proj.thumbnail}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 text-[11px] font-mono text-white flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{Math.floor(proj.duration / 60)}:{String(proj.duration % 60).padStart(2, '0')}</span>
                    </div>

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-purple-600 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                      <Scissors className="w-3 h-3" />
                      <span>{hasClips ? `${proj.clips.length} Clips Ready` : 'Unprocessed'}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {proj.title}
                    </h3>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="capitalize">{proj.contentType}</span>
                      <span>{proj.createdAt}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="capitalize">{proj.rightsStatus} License</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  {hasClips ? (
                    <button
                      onClick={() => openClipInEditor(proj.clips[0], proj)}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Studio ({proj.clips.length})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveProject(proj);
                        setActiveTab('clip-maker');
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      <span>Clip Video</span>
                    </button>
                  )}

                  <button
                    onClick={() => deleteProject(proj.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
