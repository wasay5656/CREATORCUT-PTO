/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClipMaker } from './components/ClipMaker';
import { VideoEditor } from './components/VideoEditor';
import { ProjectsView } from './components/ProjectsView';
import { TemplatesView } from './components/TemplatesView';
import { BrandKitView } from './components/BrandKitView';
import { SettingsView } from './components/SettingsView';
import { CopyrightModal } from './components/CopyrightModal';
import { ExportModal } from './components/ExportModal';
import { 
  LayoutDashboard, 
  Scissors, 
  Film, 
  FolderGit2, 
  Settings, 
  Menu, 
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, toasts, removeToast } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile menu overlay backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs"
          />
        )}

        {/* Sidebar */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Dynamic Main Workspace Container */}
        <main className="flex-1 overflow-y-auto min-w-0 pb-16 lg:pb-0">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'clip-maker' && <ClipMaker />}
          {activeTab === 'editor' && <VideoEditor />}
          {activeTab === 'projects' && <ProjectsView />}
          {activeTab === 'templates' && <TemplatesView />}
          {activeTab === 'brand-kit' && <BrandKitView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Floating Bottom Bar for Handheld Devices */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 h-14 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800 backdrop-blur-md z-30 flex items-center justify-around px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            activeTab === 'dashboard' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('clip-maker')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            activeTab === 'clip-maker' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
          }`}
        >
          <Scissors className="w-4 h-4" />
          <span>Clip AI</span>
        </button>

        <button
          onClick={() => setActiveTab('editor')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            activeTab === 'editor' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold ${
            activeTab === 'projects' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
          }`}
        >
          <FolderGit2 className="w-4 h-4" />
          <span>Videos</span>
        </button>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="flex flex-col items-center gap-0.5 p-1 text-[10px] font-bold text-slate-400"
        >
          {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          <span>Menu</span>
        </button>
      </div>

      {/* Global Modals */}
      <CopyrightModal />
      <ExportModal />

      {/* Toast Notification Container */}
      <div className="fixed bottom-16 lg:bottom-6 right-4 lg:right-6 z-50 space-y-2 pointer-events-none max-w-sm">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 p-3 rounded-2xl shadow-xl text-xs font-semibold backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 bg-slate-900/95 text-white border border-slate-700/80"
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {toast.type === 'error' && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
