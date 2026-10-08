import React from 'react';
import { 
  BarChart3, CheckCircle2, Clock, Calendar, Star, TrendingUp, 
  Award, ShieldCheck, Flame, FolderGit2, FileText, ArrowRight
} from 'lucide-react';
import { Phase, ProjectSettings, Task, TimeLog, WeekPlan, WeeklyDocument } from '../types/project';

interface AnalyticsViewProps {
  settings: ProjectSettings;
  phases: Phase[];
  weeks: WeekPlan[];
  tasks: Task[];
  documents: WeeklyDocument[];
  timeLogs: TimeLog[];
  onSelectWeek: (weekNum: number) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  settings,
  phases,
  weeks,
  tasks,
  documents,
  timeLogs,
  onSelectWeek,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;
  const todoTasks = tasks.filter((t) => t.status === 'todo').length;

  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalLoggedHoursTasks = tasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);
  const totalLoggedHoursLogs = Math.round((timeLogs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60) * 10) / 10;
  const totalLoggedHours = Math.round((totalLoggedHoursTasks + totalLoggedHoursLogs) * 10) / 10;

  const totalEstHours = tasks.reduce((acc, t) => acc + (t.estimatedHours || 0), 0);
  const totalTargetProjectHours = weeks.reduce((acc, w) => acc + (w.targetHours || 25), 0);

  const driveDocsCount = documents.filter((d) => d.type.startsWith('drive')).length;

  // Milestones
  const milestoneWeeks = weeks.filter((w) => w.isMilestone);

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              38 Hafta İlerlemesi
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            %{overallPercent}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {completedTasks} / {totalTasks} Görev Tamamlandı
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Toplam Harcanan Saat
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {totalLoggedHours} <span className="text-sm font-sans font-normal text-slate-400">Saat</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Toplam Hedef: {totalTargetProjectHours} Saat
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((totalLoggedHours / totalTargetProjectHours) * 100))}%` }}
            />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Google Drive & Dosyalar
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {documents.length}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {driveDocsCount} Google Drive Dosyası
          </div>
          <div className="text-[11px] text-purple-400 mt-3 font-medium">
            38 Haftaya Dağıtılmış Belgeler
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Kilometre Taşları
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {milestoneWeeks.length} <span className="text-sm font-sans font-normal text-slate-400">Hedef</span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Faz Sonlarında Kritik Teslimler
          </div>
          <div className="text-[11px] text-amber-400 mt-3 font-medium">
            Mert Öksüz Proje Kılavuzu
          </div>
        </div>
      </div>

      {/* 6 Major Milestones Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              38 Haftalık Kritik Kilometre Taşları (Milestones)
            </h3>
            <p className="text-xs text-slate-400">
              Projenin ana aşama ve onay kapıları
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {milestoneWeeks.map((m, idx) => {
            const mTasks = tasks.filter((t) => t.weekNumber === m.weekNumber);
            const mCompleted = mTasks.filter((t) => t.status === 'completed').length;
            const isDone = mTasks.length > 0 && mCompleted === mTasks.length;

            return (
              <div
                key={m.weekNumber}
                className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2.5 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Hafta {m.weekNumber}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tamamlandı
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      Planlandı
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-white">
                  {m.milestoneTitle || m.title}
                </h4>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {m.goal}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800">
                  <span className="text-slate-500 font-mono">{m.endDate}</span>
                  <button
                    onClick={() => onSelectWeek(m.weekNumber)}
                    className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Haftaya Git</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Breakdown Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-lg text-white">
          Fazlara Göre 38 Haftalık Dağılım
        </h3>

        <div className="space-y-4">
          {phases.map((phase) => {
            const phaseWeeks = weeks.filter((w) => w.phaseId === phase.id);
            const phaseWeekNumbers = phaseWeeks.map((w) => w.weekNumber);
            const phaseTasks = tasks.filter((t) => phaseWeekNumbers.includes(t.weekNumber));
            const phaseCompleted = phaseTasks.filter((t) => t.status === 'completed').length;
            const phasePercent = phaseTasks.length > 0 ? Math.round((phaseCompleted / phaseTasks.length) * 100) : 0;
            const phaseLoggedHours = phaseTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);

            return (
              <div
                key={phase.id}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{phase.title}</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                        Hafta {phase.startWeek} - {phase.endWeek} ({phase.endWeek - phase.startWeek + 1} Hafta)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-2xl">{phase.description}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white block">
                      {phaseCompleted}/{phaseTasks.length} Görev (%{phasePercent})
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {phaseLoggedHours} Saat Kaydedildi
                    </span>
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    style={{ width: `${phasePercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
