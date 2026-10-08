import React, { useState } from 'react';
import { 
  Plus, CheckCircle2, Circle, Clock, Calendar, ArrowRight, ArrowLeft,
  Filter, Edit, Trash2, Tag, Flag
} from 'lucide-react';
import { Task, TaskPriority, TaskStatus, WeekPlan } from '../types/project';

interface KanbanViewProps {
  tasks: Task[];
  weeks: WeekPlan[];
  activeWeek: number;
  onOpenTaskModal: (weekNum?: number, task?: Task) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  onSelectWeek: (weekNum: number) => void;
}

export const KanbanView: React.FC<KanbanViewProps> = ({
  tasks,
  weeks,
  activeWeek,
  onOpenTaskModal,
  onUpdateTaskStatus,
  onDeleteTask,
  onSelectWeek,
}) => {
  const [weekFilter, setWeekFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (weekFilter !== 'all' && t.weekNumber !== Number(weekFilter)) {
      return false;
    }
    if (priorityFilter !== 'all' && t.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  const columns: { status: TaskStatus; label: string; color: string; count: number }[] = [
    {
      status: 'todo',
      label: 'Yapılacak',
      color: 'border-slate-700 bg-slate-900/60',
      count: filteredTasks.filter((t) => t.status === 'todo').length,
    },
    {
      status: 'in_progress',
      label: 'Devam Ediyor',
      color: 'border-blue-500/40 bg-blue-950/20',
      count: filteredTasks.filter((t) => t.status === 'in_progress').length,
    },
    {
      status: 'review',
      label: 'İncelemede',
      color: 'border-purple-500/40 bg-purple-950/20',
      count: filteredTasks.filter((t) => t.status === 'review').length,
    },
    {
      status: 'completed',
      label: 'Tamamlandı',
      color: 'border-emerald-500/40 bg-emerald-950/20',
      count: filteredTasks.filter((t) => t.status === 'completed').length,
    },
  ];

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Acil 🔥</span>;
      case 'high':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Yüksek</span>;
      case 'medium':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">Orta</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">Düşük</span>;
    }
  };

  const nextStatus = (curr: TaskStatus): TaskStatus | null => {
    if (curr === 'todo') return 'in_progress';
    if (curr === 'in_progress') return 'review';
    if (curr === 'review') return 'completed';
    return null;
  };

  const prevStatus = (curr: TaskStatus): TaskStatus | null => {
    if (curr === 'completed') return 'review';
    if (curr === 'review') return 'in_progress';
    if (curr === 'in_progress') return 'todo';
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-400">Hafta Filtresi:</span>
            <select
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tüm 38 Hafta</option>
              {weeks.map((w) => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  Hafta {w.weekNumber}: {w.title.substring(0, 25)}...
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Öncelik:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">Tümü</option>
              <option value="urgent">Acil</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => onOpenTaskModal(weekFilter !== 'all' ? Number(weekFilter) : activeWeek)}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Görev Ekle</span>
        </button>
      </div>

      {/* 4-Column Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className={`rounded-2xl border p-4 flex flex-col min-h-[500px] ${col.color}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">{col.label}</h3>
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-800 text-slate-300">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => onOpenTaskModal(activeWeek)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  title="Bu duruma görev ekle"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Task Cards */}
              <div className="flex-1 space-y-3 overflow-y-auto max-h-[70vh]">
                {colTasks.length > 0 ? (
                  colTasks.map((task) => {
                    const next = nextStatus(task.status);
                    const prev = prevStatus(task.status);

                    return (
                      <div
                        key={task.id}
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 shadow-md space-y-2.5 transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <button
                            onClick={() => onSelectWeek(task.weekNumber)}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 hover:underline"
                            title="Haftaya Git"
                          >
                            Hafta {task.weekNumber}
                          </button>
                          {getPriorityBadge(task.priority)}
                        </div>

                        <h4 className="font-semibold text-xs text-white leading-snug">
                          {task.title}
                        </h4>

                        {task.description && (
                          <p className="text-[11px] text-slate-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-blue-400" />
                            {task.loggedHours}/{task.estimatedHours}h
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            {task.dueDate}
                          </span>
                        </div>

                        {/* Card Action footer */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800/50">
                          <div className="flex items-center gap-1">
                            {prev && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, prev)}
                                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                title="Geri Taşı"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}
                            {next && (
                              <button
                                onClick={() => onUpdateTaskStatus(task.id, next)}
                                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                                title="İleri Taşı"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => onOpenTaskModal(task.weekNumber, task)}
                              className="p-1 text-slate-400 hover:text-white"
                              title="Düzenle"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                                  onDeleteTask(task.id);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-400"
                              title="Sil"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-32 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-500">
                    Görev yok
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
