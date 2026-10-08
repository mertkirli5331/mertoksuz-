import React, { useState } from 'react';
import { 
  Calendar, CheckCircle2, Circle, Clock, FileText, Filter, 
  Flag, FolderGit2, Search, Star, Target, ChevronRight, Award,
  Sparkles, ExternalLink, Folder, Edit3, Link2, Plus
} from 'lucide-react';
import { Phase, Task, WeekPlan, WeeklyDocument } from '../types/project';

interface TimelineViewProps {
  phases: Phase[];
  weeks: WeekPlan[];
  tasks: Task[];
  documents: WeeklyDocument[];
  activeWeek: number;
  onSelectWeek: (weekNum: number) => void;
  onOpenTaskModal: (weekNum?: number) => void;
  onOpenDriveModal: (week: WeekPlan) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  phases,
  weeks,
  tasks,
  documents,
  activeWeek,
  onSelectWeek,
  onOpenTaskModal,
  onOpenDriveModal,
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyMilestones, setOnlyMilestones] = useState<boolean>(false);

  // Filter weeks
  const filteredWeeks = weeks.filter((w) => {
    if (selectedPhaseFilter !== 'all' && w.phaseId !== selectedPhaseFilter) {
      return false;
    }
    if (onlyMilestones && !w.isMilestone) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchGoal = w.goal.toLowerCase().includes(q);
      const matchDrive = (w.driveTitle || '').toLowerCase().includes(q) || (w.driveUrl || '').toLowerCase().includes(q);
      return matchTitle || matchGoal || matchDrive;
    }
    return true;
  });

  const getWeekStats = (weekNum: number) => {
    const weekTasks = tasks.filter((t) => t.weekNumber === weekNum);
    const completedTasks = weekTasks.filter((t) => t.status === 'completed');
    const weekDocs = documents.filter((d) => d.weekNumber === weekNum);
    const totalLoggedHours = weekTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);
    const percent = weekTasks.length > 0 ? Math.round((completedTasks.length / weekTasks.length) * 100) : 0;

    return {
      totalTasks: weekTasks.length,
      completedTasks: completedTasks.length,
      percent,
      totalLoggedHours,
      docsCount: weekDocs.length,
    };
  };

  const getPhaseColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
        };
      case 'blue':
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-400',
          badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-500/10',
          border: 'border-indigo-500/30',
          text: 'text-indigo-400',
          badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
        };
      case 'purple':
        return {
          bg: 'bg-purple-500/10',
          border: 'border-purple-500/30',
          text: 'text-purple-400',
          badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        };
      case 'amber':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
        };
      case 'rose':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        };
      default:
        return {
          bg: 'bg-slate-800',
          border: 'border-slate-700',
          text: 'text-slate-300',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* 38-Week Mini Scroller Bar (Quick jump) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 backdrop-blur shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              38 Haftalık Hızlı Atlama ve Google Drive Çubuğu
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Aktif: <strong className="text-white">Hafta {activeWeek}</strong>
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
          {weeks.map((w) => {
            const isSelected = w.weekNumber === activeWeek;
            const hasDrive = Boolean(w.driveUrl);

            return (
              <button
                key={w.weekNumber}
                onClick={() => onSelectWeek(w.weekNumber)}
                title={`Hafta ${w.weekNumber}: ${w.title} ${hasDrive ? '(Google Drive Bağlı)' : ''}`}
                className={`flex-shrink-0 w-8 sm:w-9 h-11 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                  isSelected
                    ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900 shadow-md'
                    : hasDrive
                    ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                    : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-[11px] leading-none">{w.weekNumber}</span>
                {hasDrive ? (
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-emerald-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 bg-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" /> Faz Filtresi:
          </span>
          <button
            onClick={() => setSelectedPhaseFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedPhaseFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Tüm 38 Hafta
          </button>
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setSelectedPhaseFilter(phase.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedPhaseFilter === phase.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Hafta {phase.startWeek}-{phase.endWeek}
            </button>
          ))}
          <button
            onClick={() => setOnlyMilestones(!onlyMilestones)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              onlyMilestones
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            Kilometre Taşları
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Hafta veya Drive bağlantısı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 38-Week Clean Cards Grid with Prominent Google Drive Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeeks.map((week) => {
          const stats = getWeekStats(week.weekNumber);
          const phase = phases.find((p) => p.id === week.phaseId);
          const colors = getPhaseColorClasses(phase?.color || 'blue');
          const isCurrentActive = week.weekNumber === activeWeek;
          const hasDriveLink = Boolean(week.driveUrl);

          return (
            <div
              key={week.weekNumber}
              className={`rounded-3xl border transition-all hover:shadow-xl flex flex-col justify-between p-5 relative overflow-hidden ${
                isCurrentActive
                  ? 'bg-slate-900 border-blue-500/60 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/5'
                  : 'bg-slate-900/90 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Top Row: Week Badges & Dates */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-extrabold font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      Hafta {week.weekNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-semibold border ${colors.badge}`}>
                      {phase?.title.split(':')[0]}
                    </span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{week.startDate}</span>
                  </div>
                </div>

                {/* Week Title & Goal (1'den 30'a kadar olan kutucukların başlığı silindi) */}
                {week.weekNumber > 30 && (
                  <div>
                    <h3 className="font-bold text-base text-white tracking-tight leading-snug">
                      {week.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {week.goal}
                    </p>
                  </div>
                )}
              </div>

              {/* CENTERPIECE: PROMINENT GOOGLE DRIVE BUTTON (Cleaned interior as requested) */}
              <div className="my-5 pt-3 border-t border-slate-800/80 space-y-2">
                {hasDriveLink ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <a
                        href={week.driveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer group active:scale-95"
                      >
                        <Folder className="w-4 h-4 text-emerald-200 fill-emerald-200/30" />
                        <span>Google Drive'ı Aç</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>

                      <button
                        onClick={() => onOpenDriveModal(week)}
                        title="Drive Linkini Değiştir"
                        className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span className="truncate max-w-[210px] text-emerald-400/90 font-medium">
                        ✓ {week.driveTitle || 'Google Drive Bağlandı'}
                      </span>
                      <span className="font-mono text-slate-500 text-[10px]">Aktif</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => onOpenDriveModal(week)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-emerald-600/20 border border-slate-700/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 font-bold text-xs sm:text-sm transition-all cursor-pointer group active:scale-95"
                  >
                    <Plus className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                    <span>Google Drive Linki Ekle</span>
                  </button>
                )}
              </div>

              {/* Bottom Quick Row: Tasks Count & Workspace Jump */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px]">
                  {stats.totalTasks > 0 ? (
                    <span className="font-mono text-slate-300">
                      {stats.completedTasks}/{stats.totalTasks} Görev ({stats.percent}%)
                    </span>
                  ) : (
                    <span className="text-slate-500">Planlandı</span>
                  )}
                </span>

                <button
                  onClick={() => onSelectWeek(week.weekNumber)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Hafta Detayı</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
