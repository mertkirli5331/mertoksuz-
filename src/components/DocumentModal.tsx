import React, { useState, useEffect } from 'react';
import { 
  X, Save, FileText, ExternalLink, Link2, Folder, 
  Table, Presentation, CheckSquare, Sparkles, Eye, Edit3, Trash2
} from 'lucide-react';
import { FileType, WeeklyDocument } from '../types/project';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: WeeklyDocument | null;
  weekNumber: number;
  onSave: (doc: WeeklyDocument) => void;
  onDelete?: (id: string) => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  document,
  weekNumber,
  onSave,
  onDelete,
}) => {
  const [title, setTitle] = useState<string>('');
  const [type, setType] = useState<FileType>('markdown');
  const [url, setUrl] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setType(document.type);
      setUrl(document.url || '');
      setContent(document.content || '');
      setTagsInput(document.tags.join(', '));
      setActiveTab('edit');
    } else {
      setTitle('');
      setType('markdown');
      setUrl('');
      setContent('');
      setTagsInput(`Hafta ${weekNumber}`);
      setActiveTab('edit');
    }
  }, [document, weekNumber, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const docToSave: WeeklyDocument = {
      id: document ? document.id : `doc-${Date.now()}`,
      weekNumber: document ? document.weekNumber : weekNumber,
      title: title.trim(),
      type,
      url: url.trim() || undefined,
      content: content.trim(),
      updatedAt: new Date().toISOString(),
      author: document ? document.author : 'Mert Öksüz',
      size: `${(new Blob([content]).size / 1024).toFixed(1)} KB`,
      tags,
    };

    onSave(docToSave);
    onClose();
  };

  const handleApplyTemplate = (templateType: 'status' | 'drive' | 'checklist' | 'meeting') => {
    if (templateType === 'status') {
      setTitle(`Hafta ${weekNumber} Durum & İlerleme Raporu`);
      setType('markdown');
      setContent(`# Hafta ${weekNumber} İlerleme ve Durum Raporu
Hazırlayan: Mert Öksüz
Tarih: ${new Date().toLocaleDateString('tr-TR')}

## 1. Tamamlanan Görevler
- 

## 2. Devam Eden Çalışmalar
- 

## 3. Karşılaşılan Engeller & Riskler
- 

## 4. Sonraki Hafta Hedefleri
- `);
    } else if (templateType === 'drive') {
      setTitle(`Hafta ${weekNumber} Google Drive Dokümanı`);
      setType('drive_doc');
      setUrl('https://docs.google.com/document/d/');
      setContent(`Google Drive üzerinde oluşturulan teknik şartname ve çalışma dokümanı.

Google Doküman Bağlantısı: [Yukarıdaki Bağlantıyı Düzenleyin]
Yetkili: Mert Öksüz
İçerik Notları: Doküman üzerinde tüm proje ekibi ortak çalışmaktadır.`);
    } else if (templateType === 'checklist') {
      setTitle(`Hafta ${weekNumber} Kalite & Teslim Kontrol Listesi`);
      setType('checklist');
      setContent(`[ ] Tüm kodlar ve testler tamamlandı
[ ] Dokümantasyon güncellendi
[ ] Google Drive klasörüne haftalık çıktılar yüklendi
[ ] Mert Öksüz tarafından haftalık inceleme onaylandı`);
    } else if (templateType === 'meeting') {
      setTitle(`Hafta ${weekNumber} Paydaş Toplantı Notları`);
      setType('note');
      setContent(`Toplantı: Hafta ${weekNumber} Değerlendirme
Katılımcılar: Mert Öksüz ve Proje Paydaşları
Gündem:
1. Hafta hedeflerinin gözden geçirilmesi
2. Zaman planı uyumu ve saat harcamaları
3. Kararlar ve aksiyon adımları:
- Aksiyon 1:
- Aksiyon 2:`);
    }
  };

  const getTypeIcon = (t: FileType) => {
    switch (t) {
      case 'drive_doc':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'drive_sheet':
        return <Table className="w-4 h-4 text-emerald-400" />;
      case 'drive_slide':
        return <Presentation className="w-4 h-4 text-amber-400" />;
      case 'drive_folder':
        return <Folder className="w-4 h-4 text-yellow-400" />;
      case 'checklist':
        return <CheckSquare className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              {getTypeIcon(type)}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">
                {document ? 'Dokümanı Düzenle' : `Hafta ${weekNumber} İçin Dosya / Doküman Ekle`}
              </h3>
              <p className="text-xs text-slate-400">
                Google Drive entegrasyonu veya doğrudan uygulama içi düzenleyici
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {document && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bu dokümanı silmek istediğinize emin misiniz?')) {
                    onDelete(document.id);
                    onClose();
                  }
                }}
                className="p-2 rounded-xl text-rose-400 hover:text-white hover:bg-rose-900/50 transition-colors"
                title="Dokümanı Sil"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Quick Template Selector */}
          {!document && (
            <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Hızlı Şablon Seçimi:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('drive')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                >
                  📁 Google Drive Dosyası
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('status')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                  📝 Haftalık Durum Raporu
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('checklist')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
                >
                  ✅ Kontrol Listesi
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('meeting')}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                >
                  👥 Toplantı Notları
                </button>
              </div>
            </div>
          )}

          {/* Title and Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Doküman / Dosya Başlığı *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Hafta 1 Teknik Spesifikasyon ve Drive Dosyası"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
                Dosya Türü
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FileType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              >
                <option value="markdown">Uygulama İçi Doküman (Markdown)</option>
                <option value="checklist">Kontrol Listesi (Checklist)</option>
                <option value="drive_doc">Google Docs (Doküman)</option>
                <option value="drive_sheet">Google Sheets (E-Tablo)</option>
                <option value="drive_slide">Google Slides (Sunum)</option>
                <option value="drive_folder">Google Drive Klasörü</option>
                <option value="drive_link">Harici Web / Bulut Bağlantısı</option>
                <option value="note">Kısa Not</option>
              </select>
            </div>
          </div>

          {/* URL (for Google Drive or external files) */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-400" />
                Google Drive URL / Dosya Bağlantısı (Opsiyonel)
              </span>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  Bağlantıyı Aç <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/... veya https://docs.google.com/..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Google Drive, Docs, Sheets bağlantınızı buraya ekleyerek doğrudan uygulama üzerinden erişebilir veya alt kısımdan içeriğini düzenleyebilirsiniz.
            </p>
          </div>

          {/* Content Editor & Preview Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-400">
                Doküman İçeriği & Detaylar (Doğrudan Düzenlenebilir)
              </label>
              <div className="flex items-center rounded-lg bg-slate-950 border border-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'edit'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3 h-3" /> Düzenle
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    activeTab === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" /> Önizle
                </button>
              </div>
            </div>

            {activeTab === 'edit' ? (
              <textarea
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Doküman içeriğinizi, notlarınızı, madde işaretlerini veya Google Drive özetinizi buraya yazın..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-y"
              />
            ) : (
              <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 min-h-[220px] max-h-[350px] overflow-y-auto text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {content || <span className="text-slate-500 italic">İçerik boş. Düzenle sekmesinden yazabilirsiniz.</span>}
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs font-semibold text-slate-400 mb-1.5 block">
              Etiketler (Virgülle ayırın)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Google Drive, Şartname, Hafta 1, Tasarım"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Dokümanı Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
