import React, { useState, useEffect } from 'react';
import { X, Save, ExternalLink, Trash2, Folder, Link2, Sparkles, CheckCircle2 } from 'lucide-react';
import { WeekPlan } from '../types/project';

interface DriveLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  week: WeekPlan | null;
  onSaveDriveLink: (weekNumber: number, driveUrl: string, driveTitle?: string) => void;
  onRemoveDriveLink: (weekNumber: number) => void;
}

export const DriveLinkModal: React.FC<DriveLinkModalProps> = ({
  isOpen,
  onClose,
  week,
  onSaveDriveLink,
  onRemoveDriveLink,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (week) {
      setUrl(week.driveUrl || '');
      setTitle(week.driveTitle || `Hafta ${week.weekNumber} Google Drive Klasörü`);
    }
  }, [week, isOpen]);

  if (!isOpen || !week) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = url.trim();
    if (!cleaned) return;
    if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = `https://${cleaned}`;
    }
    onSaveDriveLink(week.weekNumber, cleaned, title.trim() || undefined);
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm(`Hafta ${week.weekNumber} için Google Drive bağlantısını kaldırmak istediğinize emin misiniz?`)) {
      onRemoveDriveLink(week.weekNumber);
      onClose();
    }
  };

  const handleUsePreset = (presetUrl: string, presetTitle: string) => {
    setUrl(presetUrl);
    setTitle(presetTitle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                Hafta {week.weekNumber} - Google Drive Linki
              </h3>
              <p className="text-xs text-slate-400">{week.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Google Drive Linki (URL) *
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/... veya doküman linki"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Google Drive klasörünüzü veya dokümanınızı açıp "Bağlantıyı Paylaş" diyerek aldığınız linki buraya yapıştırın.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
              Bağlantı Başlığı (Opsiyonel)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Örn: Hafta ${week.weekNumber} Belgeleri`}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Shortcuts */}
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Hızlı Kısayol Önerileri:
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleUsePreset('https://drive.google.com/drive/my-drive', `Hafta ${week.weekNumber} Drive Ana Klasör`)}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              >
                Drive Ana Sayfam
              </button>
              <button
                type="button"
                onClick={() => handleUsePreset('https://docs.google.com/document/u/0/', `Hafta ${week.weekNumber} Google Docs`)}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-blue-500/10 text-blue-300 border border-blue-500/30 hover:bg-blue-500/20"
              >
                Google Docs
              </button>
              <button
                type="button"
                onClick={() => handleUsePreset('https://docs.google.com/spreadsheets/u/0/', `Hafta ${week.weekNumber} Google Sheets`)}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
              >
                Google Sheets
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <div>
              {week.driveUrl && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Linki Kaldır</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Drive Linkini Kaydet</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
