import React from 'react';
import { 
  FolderGit2, Calendar, Kanban, BarChart3, Settings, 
  Plus, Timer, Sparkles, UserCheck, Shield, Smartphone, QrCode
} from 'lucide-react';
import { ProjectSettings } from '../types/project';

interface NavbarProps {
  currentView: 'timeline' | 'workspace' | 'kanban' | 'analytics';
  onViewChange: (view: 'timeline' | 'workspace' | 'kanban' | 'analytics') => void;
  settings: ProjectSettings;
  activeWeek: number;
  onOpenSettings: () => void;
  onOpenTaskModal: () => void;
  onOpenTimerModal: () => void;
  onOpenSyncModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  settings,
  activeWeek,
  onOpenSettings,
  onOpenTaskModal,
  onOpenTimerModal,
  onOpenSyncModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand: "Mert Öksüz" */}
          <div className="flex items-center gap-3.5 flex-shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-mono font-black text-blue-400 text-sm tracking-tighter">
                MÖ
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                  {settings.ownerName || 'Mert Öksüz'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Shield className="w-2.5 h-2.5" /> 38 Hafta
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-none">
                {settings.projectName}
              </p>
            </div>
          </div>

          {/* View Mode Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => onViewChange('timeline')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'timeline'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>38 Hafta Zaman Planı</span>
            </button>

            <button
              onClick={() => onViewChange('workspace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'workspace'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span>Haftalık Alan & Google Drive</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                H{activeWeek}
              </span>
            </button>

            <button
              onClick={() => onViewChange('kanban')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'kanban'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban</span>
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentView === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>İlerleme & Analitik</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSyncModal}
              title="Telefona veya Başka Cihaza Aktar (QR Kod)"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-600/30 transition-all text-xs font-semibold cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Telefona Aktar</span>
            </button>

            <button
              onClick={onOpenTimerModal}
              title="Çalışma Saati & Pomodoro"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold cursor-pointer"
            >
              <Timer className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Saat</span>
            </button>

            <button
              onClick={onOpenTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Yeni Görev</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Proje Ayarları & Yedek"
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-900 gap-1 overflow-x-auto text-[11px]">
          <button
            onClick={() => onViewChange('timeline')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap ${
              currentView === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" /> 38 Hafta
          </button>
          <button
            onClick={() => onViewChange('workspace')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap ${
              currentView === 'workspace' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" /> Drive & H{activeWeek}
          </button>
          <button
            onClick={() => onViewChange('kanban')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap ${
              currentView === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" /> Kanban
          </button>
          <button
            onClick={() => onViewChange('analytics')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 whitespace-nowrap ${
              currentView === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Analitik
          </button>
        </div>
      </div>
    </header>
  );
};
