import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar, Clock, Plus, CheckCircle2, 
  Circle, Edit, Trash2, ExternalLink, FileText, FolderGit2, 
  Table, Presentation, CheckSquare, Sparkles, Folder, ArrowRight,
  Timer, AlertCircle, Save, Star, Copy, Check
} from 'lucide-react';
import { Phase, Task, TimeLog, WeekPlan, WeeklyDocument } from '../types/project';

interface WeeklyWorkspaceProps {
  activeWeek: number;
  weeks: WeekPlan[];
  phases: Phase[];
  tasks: Task[];
  documents: WeeklyDocument[];
  timeLogs: TimeLog[];
  onSelectWeek: (weekNum: number) => void;
  onUpdateWeekPlan: (week: WeekPlan) => void;
  onOpenTaskModal: (weekNum: number, task?: Task) => void;
  onOpenDocModal: (weekNum: number, doc?: WeeklyDocument) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteDoc: (docId: string) => void;
  onOpenTimerModal: () => void;
  onSaveManualTimeLog: (weekNum: number, minutes: number, note: string) => void;
}

export const WeeklyWorkspace: React.FC<WeeklyWorkspaceProps> = ({
  activeWeek,
  weeks,
  phases,
  tasks,
  documents,
  timeLogs,
  onSelectWeek,
  onUpdateWeekPlan,
  onOpenTaskModal,
  onOpenDocModal,
  onToggleTaskStatus,
  onDeleteTask,
  onDeleteDoc,
  onOpenTimerModal,
  onSaveManualTimeLog,
}) => {
  const [activeTab, setActiveTab] = useState<'drive_docs' | 'tasks' | 'timelogs'>('drive_docs');
  const [isEditingWeekNotes, setIsEditingWeekNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState('');
  const [manualMinutes, setManualMinutes] = useState(60);
  const [manualNote, setManualNote] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const currentWeek = weeks.find((w) => w.weekNumber === activeWeek) || weeks[0];
  const currentPhase = phases.find((p) => p.id === currentWeek?.phaseId);

  // Week-specific items
  const weekTasks = tasks.filter((t) => t.weekNumber === activeWeek);
  const weekDocs = documents.filter((d) => d.weekNumber === activeWeek);
  const weekTimeLogs = timeLogs.filter((l) => l.weekNumber === activeWeek);

  const completedTasksCount = weekTasks.filter((t) => t.status === 'completed').length;
  const totalLoggedHours = weekTasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0) +
    Math.round((weekTimeLogs.reduce((acc, l) => acc + l.durationMinutes, 0) / 60) * 10) / 10;
  
  const completionPercentage = weekTasks.length > 0 ? Math.round((completedTasksCount / weekTasks.length) * 100) : 0;
  const hoursPercentage = currentWeek ? Math.min(100, Math.round((totalLoggedHours / currentWeek.targetHours) * 100)) : 0;

  const handleSaveNotes = () => {
    if (!currentWeek) return;
    onUpdateWeekPlan({
      ...currentWeek,
      notes: editedNotes,
    });
    setIsEditingWeekNotes(false);
  };

  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMinutes || manualMinutes <= 0) return;
    onSaveManualTimeLog(activeWeek, Number(manualMinutes), manualNote.trim() || `${activeWeek}. Hafta Çalışması`);
    setManualNote('');
  };

  const handleCopyLink = (url?: string, docId?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    if (docId) {
      setCopiedId(docId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Acil 🔥</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Yüksek</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">Orta</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">Düşük</span>;
    }
  };

  const getDocTypeIcon = (type: WeeklyDocument['type']) => {
    switch (type) {
      case 'drive_doc':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'drive_sheet':
        return <Table className="w-5 h-5 text-emerald-400" />;
      case 'drive_slide':
        return <Presentation className="w-5 h-5 text-amber-400" />;
      case 'drive_folder':
        return <Folder className="w-5 h-5 text-yellow-400" />;
      case 'checklist':
        return <CheckSquare className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  const getDocTypeLabel = (type: WeeklyDocument['type']) => {
    switch (type) {
      case 'drive_doc':
        return 'Google Doküman';
      case 'drive_sheet':
        return 'Google E-Tablo';
      case 'drive_slide':
        return 'Google Slayt';
      case 'drive_folder':
        return 'Google Drive Klasörü';
      case 'checklist':
        return 'Kontrol Listesi';
      case 'markdown':
        return 'Dahili Belge (Markdown)';
      default:
        return 'Not / Dosya';
    }
  };

  return (
    <div className="space-y-6">
      {/* Week Navigator & Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with Prev / Select / Next */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelectWeek(Math.max(1, activeWeek - 1))}
              disabled={activeWeek <= 1}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Önceki Hafta"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Hafta Seçimi:</span>
              <select
                value={activeWeek}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 font-bold rounded-xl px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                {weeks.map((w) => (
                  <option key={w.weekNumber} value={w.weekNumber}>
                    Hafta {w.weekNumber}: {w.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onSelectWeek(Math.min(38, activeWeek + 1))}
              disabled={activeWeek >= 38}
              className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              title="Sonraki Hafta"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Zaman Aralığı</span>
              <span className="text-xs font-mono font-medium text-slate-200">
                {currentWeek?.startDate} — {currentWeek?.endDate}
              </span>
            </div>
            <span className="h-6 w-px bg-slate-800 hidden sm:block" />
            <button
              onClick={onOpenTimerModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 hover:bg-blue-600/30 transition-all text-xs font-semibold"
            >
              <Timer className="w-3.5 h-3.5 text-blue-400" />
              <span>Hafta Saati</span>
            </button>
          </div>
        </div>

        {/* Main Week Information */}
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-blue-600 text-white">
                Hafta {activeWeek} / 38
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                {currentPhase?.title}
              </span>
              {currentWeek?.isMilestone && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {currentWeek.milestoneTitle}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight">
              {currentWeek?.title}
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-3.5 rounded-2xl border border-slate-800/80">
              <strong className="text-blue-400">Haftalık Ana Hedef:</strong> {currentWeek?.goal}
            </p>

            {/* Editable Notes Section */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-semibold uppercase tracking-wider">Haftalık Notlar & Yönergeler</span>
                {!isEditingWeekNotes ? (
                  <button
                    onClick={() => {
                      setEditedNotes(currentWeek?.notes || '');
                      setIsEditingWeekNotes(true);
                    }}
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Edit className="w-3 h-3" /> Notu Düzenle
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveNotes}
                      className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Save className="w-3 h-3" /> Kaydet
                    </button>
                    <button
                      onClick={() => setIsEditingWeekNotes(false)}
                      className="text-slate-400 hover:underline"
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>

              {isEditingWeekNotes ? (
                <textarea
                  rows={3}
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              ) : (
                <p className="text-xs text-slate-400 italic">
                  {currentWeek?.notes || 'Bu hafta için henüz özel not girilmemiş.'}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Column */}
          <div className="lg:col-span-4 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-4">
            {/* Task completion meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Görev Tamamlanma</span>
                <span className="font-mono text-white font-bold">
                  {completedTasksCount} / {weekTasks.length} ({completionPercentage}%)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Hours spent meter */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Haftalık Saat Kotası</span>
                <span className="font-mono text-blue-400 font-bold">
                  {totalLoggedHours}h / {currentWeek?.targetHours || 25}h Hedef
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${hoursPercentage}%` }}
                />
              </div>
            </div>

            {/* Drive / Doc Quick Shortcut */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Google Drive & Belgeler:</span>
              <span className="font-bold text-slate-200">{weekDocs.length} Dosya Kayıtlı</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-6 flex items-center gap-2 border-t border-slate-800 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('drive_docs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'drive_docs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Google Drive & Dosya Merkezi ({weekDocs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Haftalık Görevler ({weekTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timelogs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'timelogs'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Saat Kayıtları ({weekTimeLogs.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GOOGLE DRIVE & DOCUMENT CENTER */}
      {activeTab === 'drive_docs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
                Hafta {activeWeek} - Google Drive & Doküman Yönetimi
              </h3>
              <p className="text-xs text-slate-400">
                Google Drive dosyalarınızı ekleyin, doğrudan uygulama üzerinden içeriğini düzenleyin ve yönetin.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://drive.google.com/drive/u/0/my-drive"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <Folder className="w-4 h-4 text-amber-400" />
                <span>Google Drive'a Git</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <button
                onClick={() => onOpenDocModal(activeWeek)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Doküman / Drive Dosyası Ekle</span>
              </button>
            </div>
          </div>

          {/* Documents Grid */}
          {weekDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weekDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                          {getDocTypeIcon(doc.type)}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                            {getDocTypeLabel(doc.type)}
                          </div>
                          <h4 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors">
                            {doc.title}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenDocModal(activeWeek, doc)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Dokümanı Düzenle"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`"${doc.title}" dokümanını silmek istiyor musunuz?`)) {
                              onDeleteDoc(doc.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content snippet */}
                    {doc.content && (
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
                        {doc.content}
                      </div>
                    )}

                    {/* Google Drive Link Bar */}
                    {doc.url && (
                      <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs">
                        <span className="truncate text-blue-300 font-mono text-[11px]">
                          {doc.url}
                        </span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleCopyLink(doc.url, doc.id)}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title="Bağlantıyı Kopyala"
                          >
                            {copiedId === doc.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <a
                            href={doc.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] flex items-center gap-1"
                          >
                            <span>Aç</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Tags */}
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {doc.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer metadata & Action */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Yazar: {doc.author}</span>
                    <button
                      onClick={() => onOpenDocModal(activeWeek, doc)}
                      className="text-blue-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>İçeriği Doğrudan Düzenle</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                <FolderGit2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">Bu haftaya ait dosya veya doküman bulunmuyor</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Google Drive klasör linki, Google Docs şartnamesi veya uygulama içi düzenlenebilir haftalık not ekleyerek belgelerinizi organize edin.
              </p>
              <button
                onClick={() => onOpenDocModal(activeWeek)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Hafta {activeWeek} İçin İlk Dokümanı Ekle</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: TASKS & SCHEDULE */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-base text-white">
                Hafta {activeWeek} Görevleri ({weekTasks.length})
              </h3>
              <p className="text-xs text-slate-400">
                Zaman planına göre yürütülen iş paketleri ve tamamlama durumları
              </p>
            </div>

            <button
              onClick={() => onOpenTaskModal(activeWeek)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Görev Ekle</span>
            </button>
          </div>

          {weekTasks.length > 0 ? (
            <div className="space-y-2.5">
              {weekTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    task.status === 'completed'
                      ? 'bg-slate-950/60 border-slate-800/60 opacity-80'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTaskStatus(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0 cursor-pointer"
                      title={task.status === 'completed' ? 'Tamamlanmadı yap' : 'Tamamlandı işaretle'}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4
                          className={`font-semibold text-sm ${
                            task.status === 'completed'
                              ? 'line-through text-slate-500'
                              : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        {getPriorityBadge(task.priority)}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {task.status === 'completed' ? 'Tamamlandı' : task.status === 'in_progress' ? 'Devam Ediyor' : task.status === 'review' ? 'İncelemede' : 'Yapılacak'}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap pt-0.5">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          Termin: {task.dueDate}
                        </span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-blue-400" />
                          {task.loggedHours}h / {task.estimatedHours}h
                        </span>
                        {task.tags.map((tg, i) => (
                          <span key={i} className="text-[10px] text-slate-500">#{tg}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onOpenTaskModal(activeWeek, task)}
                      className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Görevi Düzenle"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`"${task.title}" görevini silmek istiyor musunuz?`)) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      title="Görevi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-900/40 rounded-3xl border border-dashed border-slate-800">
              <p className="text-xs text-slate-400">Bu hafta için henüz görev planlanmamış.</p>
              <button
                onClick={() => onOpenTaskModal(activeWeek)}
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4" /> Görev Ekle
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TIME TRACKER & LOGS */}
      {activeTab === 'timelogs' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Session Launcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Hafta Odaklanma Saati</h4>
                  <p className="text-xs text-slate-400">Pomodoro veya kronometre ile sürenizi tutun</p>
                </div>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Toplam Kaydedilen Saat:</span>
                  <span className="text-white font-bold font-mono text-base">{totalLoggedHours} Saat</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Haftalık Hedef:</span>
                  <span className="text-blue-400 font-bold font-mono">{currentWeek?.targetHours} Saat</span>
                </div>
              </div>

              <button
                onClick={onOpenTimerModal}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Timer className="w-4 h-4" />
                <span>Çalışma Saatini Başlat</span>
              </button>
            </div>

            {/* Manual Time Entry */}
            <form onSubmit={handleManualTimeSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                Manuel Saat Girişi
              </h4>
              <p className="text-xs text-slate-400">
                Uygulama dışında yaptığınız çalışma sürelerini doğrudan bu haftaya ekleyin.
              </p>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Çalışma Süresi (Dakika)</label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block">Açıklama</label>
                <input
                  type="text"
                  placeholder="Örn: Rapor incelemesi ve analiz yapıldı"
                  value={manualNote}
                  onChange={(e) => setManualNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                Süreyi Bu Haftaya Ekle
              </button>
            </form>
          </div>

          {/* Time Logs History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Hafta {activeWeek} Zaman Kayıt Geçmişi ({weekTimeLogs.length})
            </h4>

            {weekTimeLogs.length > 0 ? (
              <div className="space-y-2">
                {weekTimeLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-white">{log.note}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {new Date(log.timestamp).toLocaleString('tr-TR')}
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 font-mono font-bold">
                      {log.durationMinutes} Dk ({(log.durationMinutes / 60).toFixed(1)}h)
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-3 text-center">
                Bu hafta için henüz çalışma süresi oturumu kaydedilmedi.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
