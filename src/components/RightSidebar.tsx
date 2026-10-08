import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, Timer, Play, Pause, RotateCcw, 
  Smartphone, QrCode, Copy, Check, ExternalLink, 
  Folder, Shield, Flame, TrendingUp, Save, Download, CheckCircle2, Cloud, CloudUpload 
} from 'lucide-react';
import { ProjectSettings, WeekPlan, Task } from '../types/project';

interface RightSidebarProps {
  settings: ProjectSettings;
  weeks: WeekPlan[];
  tasks: Task[];
  activeWeek: number;
  onOpenTimerModal: () => void;
  onOpenSyncModal: () => void;
  onOpenCloudModal: () => void;
  onSaveAll: () => void;
  onExportJSON: () => void;
  lastSavedTime: string;
  isSaving: boolean;
  cloudId: string | null;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  settings,
  weeks,
  tasks,
  activeWeek,
  onOpenTimerModal,
  onOpenSyncModal,
  onOpenCloudModal,
  onSaveAll,
  onExportJSON,
  lastSavedTime,
  isSaving,
  cloudId,
}) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [copied, setCopied] = useState(false);

  // Live ticking clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Time remaining to 38-week finish
  const startDate = new Date(settings.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 38 * 7);
  const remainingTime = endDate.getTime() - currentTime.getTime();
  const remainingDays = Math.max(0, Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));

  const timeString = currentTime.toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const dateString = currentTime.toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Calculate project metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalHours = tasks.reduce((acc, t) => acc + (t.loggedHours || 0), 0);

  // Direct share link for quick QR
  const baseUrl = window.location.origin + window.location.pathname;
  const syncData = {
    owner: settings.ownerName,
    startDate: settings.startDate,
    driveLinks: weeks
      .filter((w) => Boolean(w.driveUrl))
      .map((w) => ({
        weekNumber: w.weekNumber,
        url: w.driveUrl,
        title: w.driveTitle,
      })),
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(syncData))));
  const shareableUrl = `${baseUrl}#sync=${encoded}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=6&data=${encodeURIComponent(shareableUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
      {/* 1. Canlı Saat Kartı */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Canlı Saat & Tarih
            </h3>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Canlı
          </span>
        </div>

        <div className="text-center py-1">
          <div className="text-3xl font-mono font-bold tracking-wider text-white">
            {timeString}
          </div>
          <div className="text-xs text-slate-400 capitalize mt-1 flex items-center justify-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {dateString}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Proje Kalan:</span>
          <span className="font-mono font-bold text-amber-400">
            {remainingDays} Gün (38 Hafta)
          </span>
        </div>
      </div>

      {/* 2. KAYDET & YEDEKLE KARTI (Verilerin Gitmesini Önleyen Alan) */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 shadow-xl space-y-3 bg-gradient-to-b from-slate-900 to-emerald-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Save className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Projeyi Kaydet
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Kalıcı Bellek
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Eklediğiniz tüm <strong>Google Drive bağlantıları</strong>, görevler ve haftalık veriler tarayıcınıza anında kaydedilir.
        </p>

        <button
          onClick={onSaveAll}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all cursor-pointer active:scale-95"
        >
          {isSaving ? (
            <>
              <Save className="w-4 h-4 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Değişiklikleri Şimdi Kaydet</span>
            </>
          )}
        </button>

        <button
          onClick={onExportJSON}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition-colors border border-slate-700/80 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span>Yedek Dosyası İndir (.json)</span>
        </button>

        {lastSavedTime && (
          <div className="text-[11px] text-center text-slate-400 pt-1 font-mono">
            Son Kayıt: <strong className="text-emerald-400">{lastSavedTime}</strong>
          </div>
        )}
      </div>

      {/* 3. BULUTA KAYDET KARTI */}
      <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 shadow-xl space-y-3 bg-gradient-to-b from-slate-900 to-sky-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-sky-400" />
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Bulut Senkronizasyonu
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
            {cloudId ? 'Bulutta Aktif' : 'Bulut Deposu'}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Tüm haftaları ve Google Drive linklerinizi <strong>buluta kaydedin</strong>; herhangi bir telefondan anında açın.
        </p>

        <button
          onClick={onOpenCloudModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-500/25 transition-all cursor-pointer active:scale-95"
        >
          <CloudUpload className="w-4 h-4" />
          <span>Buluta Kaydet / Yükle</span>
        </button>

        {cloudId && (
          <div className="text-[10px] text-slate-400 font-mono truncate bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-center">
            Bulut ID: <span className="text-sky-300">{cloudId.substring(0, 16)}...</span>
          </div>
        )}
      </div>

      {/* 2. Çalışma Saati & Pomodoro Hızlı Başlatıcı */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Çalışma Saati
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            H{activeWeek} İçin
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Odaklanma oturumu başlatın ve sürenizi doğrudan haftalık plana kaydedin.
        </p>

        <button
          onClick={onOpenTimerModal}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Timer className="w-4 h-4" />
          <span>Sayaç & Pomodoro Aç</span>
        </button>
      </div>

      {/* 3. Telefona Aktar QR Kod Widget'ı */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-xs text-white uppercase tracking-wider">
              Telefona Aktar (QR)
            </h3>
          </div>
          <button
            onClick={onOpenSyncModal}
            className="text-[11px] text-blue-400 hover:underline"
          >
            Büyüt
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          Kameranızla okutun, tüm Google Drive linkleriniz telefonunuzda açılsın:
        </p>

        <div className="flex flex-col items-center justify-center p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80">
          <div className="p-1.5 bg-white rounded-xl shadow-md">
            <img
              src={qrImageUrl}
              alt="Telefona Aktar QR Kodu"
              className="w-28 h-28 rounded-lg object-contain"
              loading="lazy"
            />
          </div>
          <button
            onClick={handleCopy}
            className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Linki Kopyala</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Hızlı Google Drive Servisleri */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
        <h3 className="font-extrabold text-xs text-white uppercase tracking-wider flex items-center gap-2">
          <Folder className="w-4 h-4 text-amber-400" />
          Google Drive Kısayolları
        </h3>

        <div className="space-y-1.5 text-xs">
          <a
            href="https://drive.google.com/drive/my-drive"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              Drive Ana Klasörüm
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <a
            href="https://docs.google.com/document/u/0/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">Docs</span>
              Google Dokümanlar
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <a
            href="https://docs.google.com/spreadsheets/u/0/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">Sheets</span>
              Google E-Tablolar
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>
      </div>

      {/* 5. Proje İlerleme Özeti */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Toplam İlerleme</span>
          <span className="font-mono font-bold text-white">%{percent}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span>{completedTasks}/{totalTasks} Görev Bitti</span>
          <span className="font-mono">{totalHours} Saat Kayıtlı</span>
        </div>
      </div>
    </aside>
  );
};
