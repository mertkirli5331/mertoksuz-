import React, { useState } from 'react';
import { X, Save, Download, Upload, RotateCcw, User, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { ProjectSettings } from '../types/project';

interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onSaveSettings: (settings: ProjectSettings) => void;
  onExportJSON: () => void;
  onImportJSON: (jsonStr: string) => boolean;
  onResetDefaults: () => void;
}

export const ProjectSettingsModal: React.FC<ProjectSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  onExportJSON,
  onImportJSON,
  onResetDefaults,
}) => {
  const [projectName, setProjectName] = useState(settings.projectName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [startDate, setStartDate] = useState(settings.startDate);
  const [weeklyTargetHours, setWeeklyTargetHours] = useState(settings.weeklyTargetHours);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      projectName: projectName.trim() || '38 Haftalık Proje',
      ownerName: ownerName.trim() || 'Mert Öksüz',
      startDate,
      weeklyTargetHours: Number(weeklyTargetHours) || 25,
    });
    onClose();
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const success = onImportJSON(importText);
    if (success) {
      setImportStatus('Veriler başarıyla içe aktarıldı! Yenileniyor...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setImportStatus('Hata: Geçersiz JSON formatı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden text-slate-100 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Proje Ayarları & Yedekleme</h3>
              <p className="text-xs text-slate-400">Yönetici: Mert Öksüz • 38 Hafta</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Main Settings Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Proje Sahibi / Yönetici Adı
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Mert Öksüz"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Proje Başlığı
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="38 Haftalık Kapsamlı Proje Planı"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Proje Başlangıç Tarihi
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                  Haftalık Hedef Çalışma Saati
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={weeklyTargetHours}
                  onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Ayarları Kaydet</span>
            </button>
          </form>

          {/* Backup & Export / Import */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              Veri Yedekleme & Dışa/İçe Aktarım
            </h4>
            <p className="text-xs text-slate-400">
              38 haftalık görevlerinizi, Google Drive bağlantılarınızı ve saat kayıtlarınızı JSON formatında indirin veya yedekten geri yükleyin.
            </p>

            <button
              type="button"
              onClick={onExportJSON}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs transition-all border border-slate-700"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>JSON Olarak Tüm Projeyi İndir</span>
            </button>

            <div className="space-y-2 pt-2">
              <textarea
                rows={3}
                placeholder="Yedek JSON içeriğini buraya yapıştırıp içe aktarabilirsiniz..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleImport}
                disabled={!importText.trim()}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Yedekten Geri Yükle</span>
              </button>
              {importStatus && (
                <p className="text-xs text-amber-400">{importStatus}</p>
              )}
            </div>
          </div>

          {/* Reset to defaults warning */}
          <div className="pt-4 border-t border-slate-800">
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Verileri Sıfırla
                </h5>
                <p className="text-[11px] text-rose-400/80">
                  Tüm görev ve dokümanları ilk 38 haftalık varsayılan düzene sıfırlar.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Tüm özel görev ve verilerinizi sıfırlayıp fabrika ayarlarına dönmek istediğinize emin misiniz?')) {
                    onResetDefaults();
                    window.location.reload();
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex-shrink-0"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
