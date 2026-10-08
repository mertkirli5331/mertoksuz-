import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Task, TaskPriority, TaskStatus, WeekPlan } from '../types/project';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  weeks: WeekPlan[];
  initialWeekNumber?: number;
  onSave: (task: Task) => void;
  onDelete?: (id: string) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  weeks,
  initialWeekNumber,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weekNumber, setWeekNumber] = useState(initialWeekNumber || 1);
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedHours, setEstimatedHours] = useState(4);
  const [loggedHours, setLoggedHours] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setWeekNumber(task.weekNumber);
      setStatus(task.status);
      setPriority(task.priority);
      setEstimatedHours(task.estimatedHours);
      setLoggedHours(task.loggedHours);
      setDueDate(task.dueDate);
      setTagsInput(task.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      const targetWeek = initialWeekNumber || 1;
      setWeekNumber(targetWeek);
      setStatus('todo');
      setPriority('medium');
      setEstimatedHours(4);
      setLoggedHours(0);
      const weekPlan = weeks.find((w) => w.weekNumber === targetWeek);
      setDueDate(weekPlan ? weekPlan.endDate : new Date().toISOString().split('T')[0]);
      setTagsInput(`Hafta ${targetWeek}`);
    }
  }, [task, initialWeekNumber, weeks, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const taskToSave: Task = {
      id: task ? task.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      weekNumber: Number(weekNumber),
      status,
      priority,
      estimatedHours: Number(estimatedHours) || 0,
      loggedHours: Number(loggedHours) || 0,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      tags,
      createdAt: task ? task.createdAt : new Date().toISOString(),
      completedAt: status === 'completed' ? task?.completedAt || new Date().toISOString() : undefined,
    };

    onSave(taskToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {task ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
              </h3>
              <p className="text-xs text-slate-400">38 haftalık zaman planı ve saat takibi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {task && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bu görevi silmek istediğinize emin misiniz?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors"
                title="Görevi Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Görev Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: API Uç Noktalarının Test Edilmesi"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Açıklama & Notlar
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Görevin detayları, kabul kriterleri veya teslim çıktıları..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Zaman Planı (Hafta 1-38)
              </label>
              <select
                value={weekNumber}
                onChange={(e) => setWeekNumber(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {weeks.map((w) => (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    Hafta {w.weekNumber}: {w.title.substring(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Durum
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="todo">Yapılacak (To Do)</option>
                <option value="in_progress">Devam Ediyor (In Progress)</option>
                <option value="review">İncelemede (Review)</option>
                <option value="completed">Tamamlandı (Completed)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Öncelik
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
                <option value="urgent">Acil 🔥</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Tahmini Saat
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Harcanan Saat
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={loggedHours}
                onChange={(e) => setLoggedHours(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Bitiş Tarihi (Termin)
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Etiketler (Virgülle ayırın)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Backend, API, Test"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Görevi Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
