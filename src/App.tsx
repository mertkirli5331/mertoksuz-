/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Phase, ProjectSettings, Task, TimeLog, WeekPlan, WeeklyDocument, TaskStatus 
} from './types/project';
import { 
  getProjectSettings, saveProjectSettings,
  getPhases, savePhases,
  getWeeks, saveWeeks,
  getTasks, saveTasks,
  getDocuments, saveDocuments,
  getTimeLogs, saveTimeLogs,
  exportProjectDataJSON, importProjectDataJSON, resetAllDataToDefault
} from './utils/storage';

import { Header } from './components/Header';
import { MenuBar } from './components/MenuBar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { Footer } from './components/Footer';

import { TimelineView } from './components/TimelineView';
import { WeeklyWorkspace } from './components/WeeklyWorkspace';
import { KanbanView } from './components/KanbanView';
import { AnalyticsView } from './components/AnalyticsView';

import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskModal } from './components/TaskModal';
import { DocumentModal } from './components/DocumentModal';
import { ProjectSettingsModal } from './components/ProjectSettingsModal';
import { DriveLinkModal } from './components/DriveLinkModal';
import { SyncDeviceModal } from './components/SyncDeviceModal';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  // Primary State
  const [settings, setSettings] = useState<ProjectSettings>(getProjectSettings);
  const [phases, setPhases] = useState<Phase[]>(getPhases);
  const [weeks, setWeeks] = useState<WeekPlan[]>(getWeeks);
  const [tasks, setTasks] = useState<Task[]>(getTasks);
  const [documents, setDocuments] = useState<WeeklyDocument[]>(getDocuments);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(getTimeLogs);

  // Active View & Navigation
  const [currentView, setCurrentView] = useState<'timeline' | 'workspace' | 'kanban' | 'analytics'>('timeline');
  const [activeWeek, setActiveWeek] = useState<number>(1);

  // Modals
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);

  // Drive Link Modal state
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [selectedWeekForDrive, setSelectedWeekForDrive] = useState<WeekPlan | null>(null);

  // Persistence & Save State
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAll = () => {
    setIsSaving(true);
    try {
      saveProjectSettings(settings);
      saveWeeks(weeks);
      saveTasks(tasks);
      saveDocuments(documents);
      saveTimeLogs(timeLogs);

      const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(timeNow);
      setSyncSuccessMessage('✓ Tüm Google Drive bağlantıları, haftalar ve görevleriniz başarıyla kaydedildi! Sayfayı yenileseniz veya kapatsanız da bilgileriniz korunur.');
      setTimeout(() => setSyncSuccessMessage(null), 5000);
    } catch (err) {
      console.error('Save error', err);
    } finally {
      setTimeout(() => setIsSaving(false), 350);
    }
  };

  // Auto-save on page exit
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveProjectSettings(settings);
      saveWeeks(weeks);
      saveTasks(tasks);
      saveDocuments(documents);
      saveTimeLogs(timeLogs);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings, weeks, tasks, documents, timeLogs]);
  
  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetTaskWeek, setTargetTaskWeek] = useState<number>(1);

  // Document Modal state
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<WeeklyDocument | null>(null);
  const [targetDocWeek, setTargetDocWeek] = useState<number>(1);

  // Sync state to storage
  useEffect(() => {
    saveProjectSettings(settings);
  }, [settings]);

  // Check URL hash for cross-device sync payload (e.g. from QR code scan on phone)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash.startsWith('#sync=')) {
        const encoded = hash.replace('#sync=', '');
        const decodedJson = decodeURIComponent(escape(atob(encoded)));
        const parsed = JSON.parse(decodedJson);
        if (parsed && Array.isArray(parsed.driveLinks)) {
          setWeeks((prev) =>
            prev.map((w) => {
              const matched = parsed.driveLinks.find((item: any) => item.weekNumber === w.weekNumber);
              if (matched) {
                 return { ...w, driveUrl: matched.url, driveTitle: matched.title };
              }
              return w;
            })
          );
          setSyncSuccessMessage(`✅ ${parsed.driveLinks.length} adet Google Drive bağlantısı bu cihaza başarıyla aktarıldı!`);
          setTimeout(() => setSyncSuccessMessage(null), 6000);
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    } catch (err) {
      console.error('Sync hash parsing error', err);
    }
  }, []);

  useEffect(() => {
    saveWeeks(weeks);
  }, [weeks]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveDocuments(documents);
  }, [documents]);

  useEffect(() => {
    saveTimeLogs(timeLogs);
  }, [timeLogs]);

  // Handlers for Weeks
  const handleSelectWeek = (weekNum: number) => {
    setActiveWeek(weekNum);
    setCurrentView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateWeekPlan = (updatedWeek: WeekPlan) => {
    setWeeks((prev) => prev.map((w) => (w.weekNumber === updatedWeek.weekNumber ? updatedWeek : w)));
  };

  // Handlers for Tasks
  const handleOpenTaskModal = (weekNum?: number, task?: Task) => {
    setTargetTaskWeek(weekNum || activeWeek);
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskToSave: Task) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === taskToSave.id);
      if (exists) {
        return prev.map((t) => (t.id === taskToSave.id ? taskToSave : t));
      }
      return [taskToSave, ...prev];
    });
    const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeNow);
    setSyncSuccessMessage('✓ Görev başarıyla kaydedildi!');
    setTimeout(() => setSyncSuccessMessage(null), 3000);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeNow);
  };

  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const isComp = t.status === 'completed';
          return {
            ...t,
            status: isComp ? 'todo' : 'completed',
            completedAt: !isComp ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  // Handlers for Documents / Google Drive Files
  const handleOpenDocModal = (weekNum: number, doc?: WeeklyDocument) => {
    setTargetDocWeek(weekNum);
    setEditingDoc(doc || null);
    setIsDocModalOpen(true);
  };

  const handleOpenDriveModal = (week: WeekPlan) => {
    setSelectedWeekForDrive(week);
    setIsDriveModalOpen(true);
  };

  const handleSaveDriveLink = (weekNumber: number, driveUrl: string, driveTitle?: string) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.weekNumber === weekNumber
          ? { ...w, driveUrl, driveTitle: driveTitle || `Hafta ${weekNumber} Google Drive Klasörü` }
          : w
      )
    );

    // Also sync to weekly documents list so it appears in both places
    setDocuments((prev) => {
      const existingDoc = prev.find((d) => d.weekNumber === weekNumber && d.type.startsWith('drive'));
      if (existingDoc) {
        return prev.map((d) =>
          d.id === existingDoc.id
            ? { ...d, url: driveUrl, title: driveTitle || existingDoc.title, updatedAt: new Date().toISOString() }
            : d
        );
      } else {
        const newDoc: WeeklyDocument = {
          id: `drive-${weekNumber}-${Date.now()}`,
          weekNumber,
          title: driveTitle || `Hafta ${weekNumber} Google Drive Klasörü`,
          type: 'drive_folder',
          url: driveUrl,
          content: `Hafta ${weekNumber} çalışma dosyaları Google Drive bağlantısı: ${driveUrl}`,
          updatedAt: new Date().toISOString(),
          author: settings.ownerName || 'Mert Öksüz',
          tags: ['Google Drive', `Hafta ${weekNumber}`],
        };
        return [newDoc, ...prev];
      }
    });

    const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeNow);
    setSyncSuccessMessage(`✓ Hafta ${weekNumber} için Google Drive bağlantısı kaydedildi! Tarayıcı belleğinizde saklanmaktadır.`);
    setTimeout(() => setSyncSuccessMessage(null), 4000);
  };

  const handleRemoveDriveLink = (weekNumber: number) => {
    setWeeks((prev) =>
      prev.map((w) =>
        w.weekNumber === weekNumber
          ? { ...w, driveUrl: undefined, driveTitle: undefined }
          : w
      )
    );
    const timeNow = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    setLastSavedTime(timeNow);
    setSyncSuccessMessage(`✓ Hafta ${weekNumber} için Drive bağlantısı kaldırıldı ve kaydedildi.`);
    setTimeout(() => setSyncSuccessMessage(null), 3000);
  };

  const handleSaveDoc = (docToSave: WeeklyDocument) => {
    setDocuments((prev) => {
      const exists = prev.some((d) => d.id === docToSave.id);
      if (exists) {
        return prev.map((d) => (d.id === docToSave.id ? docToSave : d));
      }
      return [docToSave, ...prev];
    });
  };

  const handleDeleteDoc = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  // Handlers for Time Logs
  const handleSaveTimeLog = (logData: Omit<TimeLog, 'id' | 'timestamp'>) => {
    const newLog: TimeLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setTimeLogs((prev) => [newLog, ...prev]);

    // If linked to a task, update the task's logged hours too
    if (logData.taskId) {
      const hoursToAdd = Math.round((logData.durationMinutes / 60) * 10) / 10;
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === logData.taskId) {
            return {
              ...t,
              loggedHours: Math.round(((t.loggedHours || 0) + hoursToAdd) * 10) / 10,
            };
          }
          return t;
        })
      );
    }
  };

  const handleSaveManualTimeLog = (weekNum: number, minutes: number, note: string) => {
    handleSaveTimeLog({
      weekNumber: weekNum,
      durationMinutes: minutes,
      note,
    });
  };

  // Export JSON file download
  const handleExportJSON = () => {
    const jsonStr = exportProjectDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mert_oksuz_38_haftalik_proje_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* 1. HEADER (BAŞLIK) Alanı - Üst bilgi bölümü */}
      <Header
        settings={settings}
        activeWeek={activeWeek}
        totalWeeks={settings.totalWeeks || 38}
        lastSavedTime={lastSavedTime}
      />

      {/* 2. MENÜ ALANI - Yatay Gezinme Çubuğu */}
      <MenuBar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeWeek={activeWeek}
        onOpenTaskModal={() => handleOpenTaskModal(activeWeek)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onSaveAll={handleSaveAll}
        lastSavedTime={lastSavedTime}
        isSaving={isSaving}
      />

      {/* Sync Notification Toast Banner */}
      {syncSuccessMessage && (
        <div className="max-w-[1700px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 px-4 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{syncSuccessMessage}</span>
            </div>
            <button
              onClick={() => setSyncSuccessMessage(null)}
              className="p-1 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 3. ANA DÜZEN (3-KOLONLU HOLY GRAIL YAPISI): 
             [SOL SIDEBAR] | [ORTA CONTENT] | [SAĞ SIDEBAR] */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* SOL SIDEBAR: 38 Hafta Listesi & Filtreler */}
          <LeftSidebar
            weeks={weeks}
            phases={phases}
            tasks={tasks}
            activeWeek={activeWeek}
            onSelectWeek={handleSelectWeek}
            onOpenDriveModal={handleOpenDriveModal}
          />

          {/* ORTA CONTENT: Sayfa İçeriğinin Yer Aldığı Ana Alan */}
          <main className="flex-1 min-w-0 w-full space-y-6">
            {currentView === 'timeline' && (
              <TimelineView
                phases={phases}
                weeks={weeks}
                tasks={tasks}
                documents={documents}
                activeWeek={activeWeek}
                onSelectWeek={handleSelectWeek}
                onOpenTaskModal={(weekNum) => handleOpenTaskModal(weekNum)}
                onOpenDriveModal={handleOpenDriveModal}
              />
            )}

            {currentView === 'workspace' && (
              <WeeklyWorkspace
                activeWeek={activeWeek}
                weeks={weeks}
                phases={phases}
                tasks={tasks}
                documents={documents}
                timeLogs={timeLogs}
                onSelectWeek={setActiveWeek}
                onUpdateWeekPlan={handleUpdateWeekPlan}
                onOpenTaskModal={(wNum, task) => handleOpenTaskModal(wNum, task)}
                onOpenDocModal={(wNum, doc) => handleOpenDocModal(wNum, doc)}
                onToggleTaskStatus={handleToggleTaskStatus}
                onDeleteTask={handleDeleteTask}
                onDeleteDoc={handleDeleteDoc}
                onOpenTimerModal={() => setIsTimerModalOpen(true)}
                onSaveManualTimeLog={handleSaveManualTimeLog}
              />
            )}

            {currentView === 'kanban' && (
              <KanbanView
                tasks={tasks}
                weeks={weeks}
                activeWeek={activeWeek}
                onOpenTaskModal={(wNum, task) => handleOpenTaskModal(wNum, task)}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onDeleteTask={handleDeleteTask}
                onSelectWeek={handleSelectWeek}
              />
            )}

            {currentView === 'analytics' && (
              <AnalyticsView
                settings={settings}
                phases={phases}
                weeks={weeks}
                tasks={tasks}
                documents={documents}
                timeLogs={timeLogs}
                onSelectWeek={handleSelectWeek}
              />
            )}
          </main>

          {/* SAĞ SIDEBAR: Araçlar, Canlı Saat, Pomodoro & QR Telefona Aktar */}
          <RightSidebar
            settings={settings}
            weeks={weeks}
            tasks={tasks}
            activeWeek={activeWeek}
            onOpenTimerModal={() => setIsTimerModalOpen(true)}
            onOpenSyncModal={() => setIsSyncModalOpen(true)}
            onSaveAll={handleSaveAll}
            onExportJSON={handleExportJSON}
            lastSavedTime={lastSavedTime}
            isSaving={isSaving}
          />

        </div>
      </div>

      {/* 4. FOOTER [Alt bilgi bölümü] */}
      <Footer
        settings={settings}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenTimerModal={() => setIsTimerModalOpen(true)}
      />

      {/* MODALS */}
      <PomodoroTimer
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
        settings={settings}
        weeks={weeks}
        tasks={tasks}
        activeWeek={activeWeek}
        onSaveTimeLog={handleSaveTimeLog}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        weeks={weeks}
        initialWeekNumber={targetTaskWeek}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        document={editingDoc}
        weekNumber={targetDocWeek}
        onSave={handleSaveDoc}
        onDelete={handleDeleteDoc}
      />

      <DriveLinkModal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        week={selectedWeekForDrive}
        onSaveDriveLink={handleSaveDriveLink}
        onRemoveDriveLink={handleRemoveDriveLink}
      />

      <SyncDeviceModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        weeks={weeks}
        settings={settings}
      />

      <ProjectSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
        onExportJSON={handleExportJSON}
        onImportJSON={importProjectDataJSON}
        onResetDefaults={resetAllDataToDefault}
      />
    </div>
  );
}
