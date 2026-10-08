import React from 'react';
import { 
  Calendar, FolderGit2, Kanban, BarChart3, 
  Smartphone, Timer, Plus, Settings, Sparkles, Save, CheckCircle2 
} from 'lucide-react';

interface MenuBarProps {
  currentView: 'timeline' | 'workspace' | 'kanban' | 'analytics';
  onViewChange: (view: 'timeline' | 'workspace' | 'kanban' | 'analytics') => void;
  activeWeek: number;
  onOpenTaskModal: () => void;
  onOpenTimerModal: () => void;
  onOpenSyncModal: () => void;
  onOpenSettings: () => void;
  onSaveAll: () => void;
  lastSavedTime: string;
  isSaving: boolean;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  currentView,
  onViewChange,
  activeWeek,
  onOpenTaskModal,
  onOpenTimerModal,
  onOpenSyncModal,
  onOpenSettings,
  onSaveAll,
  lastSavedTime,
  isSaving,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 shadow-md sticky top-0 z-30 backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3 overflow-x-auto scrollbar-none">
          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={() => onViewChange('timeline')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'timeline'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>38 Hafta Zaman Planı</span>
            </button>

            <button
              onClick={() => onViewChange('workspace')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'workspace'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FolderGit2 className="w-4 h-4 text-emerald-400" />
              <span>Haftalık Alan & Google Drive</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                H{activeWeek}
              </span>
            </button>

            <button
              onClick={() => onViewChange('kanban')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'kanban'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban Panosu</span>
            </button>

            <button
              onClick={() => onViewChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                currentView === 'analytics'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>İlerleme & Analitik</span>
            </button>
          </nav>

          {/* Quick Action Buttons on Right side of Menu Bar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Prominent Save Button with Status Indicator */}
            <button
              onClick={onSaveAll}
              title="Tüm eklediğiniz Google Drive linklerini ve görevleri hemen kaydeder"
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md whitespace-nowrap ${
                isSaving
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/20 active:scale-95'
              }`}
            >
              {isSaving ? (
                <>
                  <Save className="w-4 h-4 animate-spin" />
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Kaydet</span>
                  {lastSavedTime && (
                    <span className="hidden sm:inline font-mono text-[10px] bg-emerald-800/60 px-1.5 py-0.5 rounded text-emerald-200 ml-0.5">
                      {lastSavedTime}
                    </span>
                  )}
                </>
              )}
            </button>

            <button
              onClick={onOpenSyncModal}
              title="Telefona veya Başka Cihaza Aktar (QR Kod)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Telefona Aktar (QR)</span>
            </button>

            <button
              onClick={onOpenTimerModal}
              title="Çalışma Saati & Pomodoro"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap border border-slate-700"
            >
              <Timer className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Çalışma Saati</span>
            </button>

            <button
              onClick={onOpenTaskModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>+ Görev</span>
            </button>

            <button
              onClick={onOpenSettings}
              title="Proje Ayarları & Yedek"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
