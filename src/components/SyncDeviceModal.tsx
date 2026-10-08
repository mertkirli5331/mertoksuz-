import React, { useState } from 'react';
import { X, Smartphone, QrCode, Copy, Check, Share2, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { ProjectSettings, WeekPlan } from '../types/project';

interface SyncDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeks: WeekPlan[];
  settings: ProjectSettings;
}

export const SyncDeviceModal: React.FC<SyncDeviceModalProps> = ({
  isOpen,
  onClose,
  weeks,
  settings,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build a lightweight sync payload focusing on Drive links and week customizations
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

  const jsonStr = JSON.stringify(syncData);
  const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
  
  // Current page URL with sync hash
  const baseUrl = window.location.origin + window.location.pathname;
  const shareableUrl = `${baseUrl}#sync=${encoded}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(shareableUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Telefona & Başka Cihaza Aktar</h3>
              <p className="text-xs text-slate-400">Tüm Google Drive linklerinizi başka tarayıcıda açın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Instruction */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-xs text-blue-300 leading-relaxed">
            <strong className="text-white block mb-1">Cihazlar Arası Anında Senkronizasyon:</strong>
            Telefonunuzun kamerasıyla aşağıdaki <strong>QR Kodu okutarak</strong> veya bağlantıyı kopyalayıp WhatsApp/Telegram üzerinden kendinize göndererek, eklediğiniz tüm Google Drive linklerini telefonunuzda veya diğer tarayıcınızda anında görüntüleyebilirsiniz.
          </div>

          {/* QR Code Card */}
          <div className="flex flex-col items-center justify-center p-5 bg-slate-950/80 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="p-2 bg-white rounded-2xl shadow-xl">
              <img
                src={qrImageUrl}
                alt="Telefon için Senkronizasyon QR Kodu"
                className="w-48 h-48 rounded-xl object-contain"
                loading="eager"
              />
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <QrCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>Telefon kamerasını bu koda doğrultun</span>
            </div>
          </div>

          {/* Copy Link Section */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Senkronizasyon Bağlantısı
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-400 select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Linki Kopyala</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
            Toplam <strong>{syncData.driveLinks.length} adet Google Drive bağlantısı</strong> ve hafta bilgisi bu bağlantıya dahil edilmiştir.
          </div>
        </div>
      </div>
    </div>
  );
};
