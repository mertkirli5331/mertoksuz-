import React from 'react';
import { Shield, Sparkles, FolderGit2, Calendar, User, Clock } from 'lucide-react';
import { ProjectSettings } from '../types/project';

interface HeaderProps {
  settings: ProjectSettings;
  activeWeek: number;
  totalWeeks: number;
  lastSavedTime?: string;
}

export const Header: React.FC<HeaderProps> = ({ settings, activeWeek, totalWeeks, lastSavedTime }) => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-b border-slate-800 text-white shadow-xl relative overflow-hidden">
      {/* Decorative ambient gradients */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 left-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Main Title & Branding: Mert Öksüz */}
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-xl shadow-blue-500/25 flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-mono font-black text-blue-400 text-lg tracking-wider">
                MÖ
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  {settings.ownerName || 'MERT ÖKSÜZ'}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  <Shield className="w-3 h-3" /> 38 HAFTALIK PROJE
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <FolderGit2 className="w-3 h-3" /> GOOGLE DRIVE ENTEGRASYONU
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
                {settings.projectName || '38 Haftalık Kapsamlı Proje ve Zaman Takip Portalı'}
              </p>
            </div>
          </div>

          {/* Top Quick Status Badges */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl px-4 py-2 text-right">
              <span className="text-[11px] text-emerald-400 block font-semibold flex items-center justify-end gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Kayıt Durumu
              </span>
              <span className="text-xs font-bold font-mono text-emerald-300">
                {lastSavedTime ? `✓ Kaydedildi (${lastSavedTime})` : '✓ Kalıcı Kayıt Açık'}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Aktif Hafta</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                Hafta {activeWeek} / {totalWeeks}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Başlangıç</span>
              <span className="text-sm font-bold font-mono text-slate-200">
                {settings.startDate}
              </span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl px-4 py-2 text-right">
              <span className="text-[11px] text-slate-400 block font-medium">Yönetici</span>
              <span className="text-sm font-bold text-blue-400">
                {settings.ownerName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
