import React, { useState } from 'react';
import { 
  FolderGit2, Folder, Calendar, Star, CheckCircle2, 
  Circle, Filter, Search, ChevronRight, Layers, ExternalLink 
} from 'lucide-react';
import { Phase, WeekPlan, Task } from '../types/project';

interface LeftSidebarProps {
  weeks: WeekPlan[];
  phases: Phase[];
  tasks: Task[];
  activeWeek: number;
  onSelectWeek: (weekNum: number) => void;
  onOpenDriveModal: (week: WeekPlan) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  weeks,
  phases,
  tasks,
  activeWeek,
  onSelectWeek,
  onOpenDriveModal,
}) => {
  const [search, setSearch] = useState('');
  const [filterDriveOnly, setFilterDriveOnly] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<string>('all');

  const filteredWeeks = weeks.filter((w) => {
    if (filterDriveOnly && !w.driveUrl) return false;
    if (selectedPhase !== 'all' && w.phaseId !== selectedPhase) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchNum = `hafta ${w.weekNumber}`.includes(q) || `${w.weekNumber}` === q;
      const matchDrive = (w.driveTitle || '').toLowerCase().includes(q);
      const matchTitle = (w.title || '').toLowerCase().includes(q);
      return matchNum || matchDrive || matchTitle;
    }
    return true;
  });

  const getWeekTasksCount = (weekNum: number) => {
    const weekTasks = tasks.filter((t) => t.weekNumber === weekNum);
    const completed = weekTasks.filter((t) => t.status === 'completed').length;
    return { total: weekTasks.length, completed };
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <h2 className="font-extrabold text-sm text-white uppercase tracking-wider">
            38 Hafta Listesi
          </h2>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800">
          {weeks.filter(w => Boolean(w.driveUrl)).length} / 38 Drive
        </span>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Hafta ara (örn: 5)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Filter Toggle: Sadece Drive Bağlı Olanlar */}
      <div className="flex items-center justify-between gap-2 pt-1 text-xs">
        <button
          onClick={() => setFilterDriveOnly(!filterDriveOnly)}
          className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold transition-all border ${
            filterDriveOnly
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Folder className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sadece Drive Bağlılar</span>
        </button>
      </div>

      {/* Faz Filtresi */}
      <div>
        <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
          Proje Fazı:
        </label>
        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
        >
          <option value="all">Tüm Fazlar (Hafta 1-38)</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title.split(':')[0]} (H{p.startWeek}-{p.endWeek})
            </option>
          ))}
        </select>
      </div>

      {/* 38-Week Scrollable Vertical List */}
      <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {filteredWeeks.map((week) => {
          const isSelected = week.weekNumber === activeWeek;
          const hasDrive = Boolean(week.driveUrl);
          const taskCounts = getWeekTasksCount(week.weekNumber);

          return (
            <div
              key={week.weekNumber}
              className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all text-xs cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500/60 text-white shadow-sm ring-1 ring-blue-500/30'
                  : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
              }`}
              onClick={() => onSelectWeek(week.weekNumber)}
            >
              {/* Left Info: Week Number & Drive status */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow'
                      : hasDrive
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {week.weekNumber}
                </span>

                <div className="min-w-0">
                  <div className="font-bold truncate text-slate-100 flex items-center gap-1">
                    <span>Hafta {week.weekNumber}</span>
                    {week.isMilestone && (
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {hasDrive ? (
                      <span className="text-emerald-400 font-medium">✓ Drive Bağlı</span>
                    ) : (
                      <span>Drive Yok</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Action: Drive quick button */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {hasDrive ? (
                  <a
                    href={week.driveUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Google Drive'ı Aç"
                    className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-500 text-emerald-300 hover:text-white transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDriveModal(week);
                    }}
                    title="Drive Linki Ekle"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600/30 text-slate-400 hover:text-emerald-300 transition-all opacity-70 group-hover:opacity-100"
                  >
                    <Folder className="w-3.5 h-3.5" />
                  </button>
                )}
                <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-600'}`} />
              </div>
            </div>
          );
        })}

        {filteredWeeks.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-500">
            Filtreye uygun hafta bulunamadı.
          </div>
        )}
      </div>
    </aside>
  );
};
