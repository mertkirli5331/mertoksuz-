import React from 'react';
import { Shield, FolderGit2, Smartphone, Clock, Heart } from 'lucide-react';
import { ProjectSettings } from '../types/project';

interface FooterProps {
  settings: ProjectSettings;
  onOpenSyncModal: () => void;
  onOpenTimerModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenSyncModal,
  onOpenTimerModal,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-12 py-8 relative">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-center md:text-left">
          {/* Left: Brand & Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2 text-white font-extrabold text-base">
              <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-mono">
                MÖ
              </span>
              <span>{settings.ownerName || 'Mert Öksüz'}</span>
              <span className="text-xs text-blue-400 font-mono font-normal">
                • 38 Haftalık Proje Portalı
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {settings.projectName || 'Google Drive Dosya Entegrasyonu ve Canlı Zaman Yönetimi'}
            </p>
          </div>

          {/* Center: Feature Badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Google Drive Entegre</span>
            </span>
            <button
              onClick={onOpenTimerModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>Canlı Saat & Pomodoro</span>
            </button>
            <button
              onClick={onOpenSyncModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telefona Aktar (QR)</span>
            </button>
          </div>

          {/* Right: Security & Storage */}
          <div className="text-center md:text-right text-xs text-slate-400 space-y-0.5">
            <div>38 Hafta Zaman Planı & Dosya Yönetimi</div>
            <div className="text-[11px] text-slate-400">
              Verileriniz cihazınızda saklanır • QR Kod ile telefonlara aktarılabilir
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-6 pt-4 border-t border-slate-900/80 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <span>FOOTER [Alt bilgi bölümü] • Tasarım ve Yönetim: <strong>{settings.ownerName}</strong></span>
        </div>
      </div>
    </footer>
  );
};
