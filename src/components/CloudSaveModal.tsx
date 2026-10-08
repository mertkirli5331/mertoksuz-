import React, { useState } from 'react';
import { 
  X, Cloud, CloudUpload, CloudDownload, Copy, Check, 
  ExternalLink, QrCode, Sparkles, CheckCircle2, AlertCircle, RefreshCw 
} from 'lucide-react';

interface CloudSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudId: string | null;
  onSaveToCloud: () => Promise<void>;
  onLoadFromCloud: (cloudId: string) => Promise<void>;
  isCloudSaving: boolean;
  isCloudLoading: boolean;
}

export const CloudSaveModal: React.FC<CloudSaveModalProps> = ({
  isOpen,
  onClose,
  cloudId,
  onSaveToCloud,
  onLoadFromCloud,
  isCloudSaving,
  isCloudLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [inputCloudId, setInputCloudId] = useState('');
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = cloudId ? `${baseUrl}#cloud=${cloudId}` : '';
  const qrUrl = cloudId 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=${encodeURIComponent(shareUrl)}`
    : '';

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSave = async () => {
    setStatusMessage(null);
    try {
      await onSaveToCloud();
      setStatusMessage({ text: '✓ Tüm verileriniz buluta başarıyla kaydedildi!', type: 'success' });
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Buluta kaydedilirken bir hata oluştu.', type: 'error' });
    }
  };

  const handleLoad = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCloudId.trim()) return;
    setStatusMessage(null);
    try {
      await onLoadFromCloud(inputCloudId.trim());
      setStatusMessage({ text: '✓ Bulut verileri başarıyla yüklendi!', type: 'success' });
      setTimeout(() => onClose(), 1500);
    } catch (e: any) {
      setStatusMessage({ text: e.message || 'Buluttan yüklenemedi. Lütfen ID kontrol ediniz.', type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/25">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Bulut Senkronizasyonu</h3>
              <p className="text-xs text-slate-400">Tüm cihazlarınızdan erişmek için buluta kaydedin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => { setActiveTab('save'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'save'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudUpload className="w-4 h-4" />
            <span>Buluta Kaydet</span>
          </button>
          <button
            onClick={() => { setActiveTab('load'); setStatusMessage(null); }}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'load'
                ? 'text-sky-400 border-b-2 border-sky-400 bg-slate-900/50'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudDownload className="w-4 h-4" />
            <span>Buluttan Yükle</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-200'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'save' ? (
            <div className="space-y-4">
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-4 text-xs text-sky-200 leading-relaxed">
                <strong className="text-white block mb-1">Bulut Yedekleme Nasıl Çalışır?</strong>
                Aşağıdaki butona bastığınızda tüm 38 haftalık planınız, Google Drive bağlantılarınız ve görevleriniz güvenli bulut deposuna yüklenir. Oluşan bağlantıyı veya QR kodu başka telefonda açarak projenize dilediğiniz yerden erişebilirsiniz.
              </div>

              <button
                onClick={handleSave}
                disabled={isCloudSaving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                {isCloudSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Buluta Yükleniyor...</span>
                  </>
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4" />
                    <span>Şimdi Buluta Kaydet</span>
                  </>
                )}
              </button>

              {cloudId && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Bulut ID Kodunuz:</span>
                    <span className="font-mono text-xs font-bold text-sky-400 select-all break-all">
                      {cloudId}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-400 mb-1 block">
                      Doğrudan Bulut Erişim Bağlantısı:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 select-all focus:outline-none"
                      />
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer border border-slate-700"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Kopyalandı</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {qrUrl && (
                    <div className="flex flex-col items-center justify-center p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
                      <div className="p-1.5 bg-white rounded-xl">
                        <img
                          src={qrUrl}
                          alt="Bulut Erişim QR Kodu"
                          className="w-32 h-32 rounded-lg object-contain"
                        />
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Telefon kamerasını bu koda doğrultarak buluttan açın
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleLoad} className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Başka bir telefondan veya tarayıcıdan aldığınız <strong>Bulut ID</strong> kodunu buraya yapıştırarak verilerinizi bu cihaza çekebilirsiniz.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  Bulut ID Kodu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: ff808181a09d98f701a11b66f2f92087"
                  value={inputCloudId}
                  onChange={(e) => setInputCloudId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={isCloudLoading || !inputCloudId.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isCloudLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Buluttan Çekiliyor...</span>
                  </>
                ) : (
                  <>
                    <CloudDownload className="w-4 h-4" />
                    <span>Buluttan Verileri Yükle</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
