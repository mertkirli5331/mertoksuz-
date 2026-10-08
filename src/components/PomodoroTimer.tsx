import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Save, X, Timer, Bell, CheckCircle2, BookOpen } from 'lucide-react';
import { ProjectSettings, Task, TimeLog, WeekPlan } from '../types/project';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  weeks: WeekPlan[];
  tasks: Task[];
  activeWeek: number;
  onSaveTimeLog: (log: Omit<TimeLog, 'id' | 'timestamp'>) => void;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  settings,
  weeks,
  tasks,
  activeWeek,
  onSaveTimeLog,
}) => {
  const [mode, setMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedWeek, setSelectedWeek] = useState<number>(activeWeek);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [completedSession, setCompletedSession] = useState<boolean>(false);

  // Update selected week if activeWeek changes and modal wasn't opened
  useEffect(() => {
    setSelectedWeek(activeWeek);
  }, [activeWeek]);

  // Available tasks for the selected week
  const weekTasks = tasks.filter((t) => t.weekNumber === selectedWeek);

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'pomodoro') {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              setIsRunning(false);
              setCompletedSession(true);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    setCompletedSession(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(durationMinutes * 60);
    setStopwatchSeconds(0);
    setCompletedSession(false);
  };

  const handleSelectPreset = (mins: number) => {
    setIsRunning(false);
    setMode('pomodoro');
    setDurationMinutes(mins);
    setSecondsLeft(mins * 60);
    setCompletedSession(false);
  };

  const handleSwitchToStopwatch = () => {
    setIsRunning(false);
    setMode('stopwatch');
    setStopwatchSeconds(0);
  };

  const formatDisplayTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSaveSession = () => {
    let minutesToSave = 0;
    if (mode === 'pomodoro') {
      const elapsedSeconds = durationMinutes * 60 - secondsLeft;
      minutesToSave = Math.max(1, Math.round(elapsedSeconds / 60));
    } else {
      minutesToSave = Math.max(1, Math.round(stopwatchSeconds / 60));
    }

    onSaveTimeLog({
      weekNumber: selectedWeek,
      taskId: selectedTaskId || undefined,
      durationMinutes: minutesToSave,
      note: note.trim() || `${selectedWeek}. Hafta çalışma oturumu (${minutesToSave} dk)`,
    });

    handleReset();
    setNote('');
    onClose();
  };

  if (!isOpen) return null;

  const currentSeconds = mode === 'pomodoro' ? secondsLeft : stopwatchSeconds;
  const progressPercent = mode === 'pomodoro'
    ? ((durationMinutes * 60 - secondsLeft) / (durationMinutes * 60)) * 100
    : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Timer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Çalışma Saati & Odaklanma</h3>
              <p className="text-xs text-slate-400">Mert Öksüz 38 Haftalık Zaman Planlayıcı</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handleSelectPreset(25)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'pomodoro' && durationMinutes === 25
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              25 Dk Odaklanma
            </button>
            <button
              onClick={() => handleSelectPreset(50)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'pomodoro' && durationMinutes === 50
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              50 Dk Derin Çalışma
            </button>
            <button
              onClick={() => handleSelectPreset(5)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'pomodoro' && durationMinutes === 5
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              5 Dk Mola
            </button>
            <button
              onClick={handleSwitchToStopwatch}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'stopwatch'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Kronometre (Serbest)
            </button>
          </div>

          {/* Big Clock Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-56 h-56 flex items-center justify-center rounded-full bg-slate-800/50 border-4 border-slate-700/60 shadow-inner">
              {/* Progress ring or subtle border */}
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-1000"
                style={{
                  clipPath: `inset(0 0 ${100 - progressPercent}% 0)`,
                  borderColor: mode === 'stopwatch' ? '#a855f7' : '#3b82f6',
                }}
              />
              <div className="text-center z-10">
                <span className="text-5xl font-mono font-bold tracking-tighter text-white">
                  {formatDisplayTime(currentSeconds)}
                </span>
                <p className="text-xs text-slate-400 mt-2 font-medium uppercase tracking-wider">
                  {mode === 'pomodoro'
                    ? isRunning
                      ? 'Odaklanılıyor...'
                      : completedSession
                      ? 'Süre Tamamlandı! 🎉'
                      : 'Hazır'
                    : 'Geçen Çalışma Süresi'}
                </p>
              </div>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleStartPause}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/25'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/25'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 fill-current" /> Duraklat
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-current" /> Başlat
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                title="Sıfırla"
                className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Session Tagging & Saving to Week / Task */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Çalışmayı Projeye Kaydet
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Hangi Hafta?</label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {weeks.map((w) => (
                    <option key={w.weekNumber} value={w.weekNumber}>
                      Hafta {w.weekNumber}: {w.title.substring(0, 24)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">İlgili Görev (Opsiyonel)</label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">Genel Hafta Çalışması</option>
                  {weekTasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title.substring(0, 28)}...
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Çalışma Notu</label>
              <input
                type="text"
                placeholder="Örn: Gereksinim analizi yapıldı, doküman güncellendi..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleSaveSession}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Süreyi Kaydet ve Zaman Planına Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
