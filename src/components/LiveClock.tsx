import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Timer, Play, Pause, RotateCcw, CheckCircle2, Flame, ChevronRight } from 'lucide-react';
import { ProjectSettings, WeekPlan } from '../types/project';

interface LiveClockProps {
  settings: ProjectSettings;
  weeks: WeekPlan[];
  activeWeek: number;
  onSelectWeek: (weekNum: number) => void;
  onOpenTimerModal: () => void;
}

export const LiveClock: React.FC<LiveClockProps> = ({
  settings,
  weeks,
  activeWeek,
  onSelectWeek,
  onOpenTimerModal,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate current week based on start date
  const startDate = new Date(settings.startDate);
  const diffTime = currentTime.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const calculatedCurrentWeek = Math.max(1, Math.min(38, Math.floor(diffDays / 7) + 1));

  // Time remaining to 38-week finish
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 38 * 7);
  const remainingTime = endDate.getTime() - currentTime.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  // Format time strings (Turkish locale)
  const timeString = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 shadow-xl mb-6 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Real-time Clock display */}
        <div className="md:col-span-4 flex items-center gap-4 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white">
            <Clock className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wider text-slate-100 flex items-center gap-2">
              {timeString}
              <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Canlı
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5 capitalize">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              {dateString}
            </div>
          </div>
        </div>

        {/* Project Week & Countdown status */}
        <div className="md:col-span-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                38 Haftalık Planlama
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Flame className="w-3 h-3 text-emerald-400" />
                Hafta {calculatedCurrentWeek} / 38
              </span>
            </div>
            <div className="text-sm font-medium text-slate-200 mt-1">
              Görüntülenen: <button 
                onClick={() => onSelectWeek(activeWeek)} 
                className="text-blue-400 hover:underline font-semibold"
              >
                Hafta {activeWeek} - {weeks.find(w => w.weekNumber === activeWeek)?.title || 'Plan'}
              </button>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Proje Kapanışına Kalan</div>
            <div className="text-xl font-bold font-mono text-amber-400">
              {remainingDays} <span className="text-xs font-sans font-normal text-slate-300">Gün</span>
            </div>
          </div>
        </div>

        {/* Quick Focus / Work Stopwatch trigger */}
        <div className="md:col-span-3 flex items-center justify-end gap-2">
          <button
            onClick={onOpenTimerModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
          >
            <Timer className="w-4 h-4" />
            <span>Çalışma Saati & Pomodoro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
