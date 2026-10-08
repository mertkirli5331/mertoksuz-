import { Phase, ProjectSettings, Task, WeekPlan, WeeklyDocument } from '../types/project';

export const DEFAULT_PHASES: Phase[] = [
  {
    id: 'phase-1',
    title: 'Faz 1: Kapsam & Gereksinim Analizi',
    description: 'Proje hedeflerinin belirlenmesi, paydaş görüşmeleri, teknik fizibilite ve gereksinim dokümantasyonu.',
    startWeek: 1,
    endWeek: 4,
    color: 'emerald',
  },
  {
    id: 'phase-2',
    title: 'Faz 2: Sistem Mimarisi & UI/UX Tasarımı',
    description: 'Veritabanı tasarımı, sistem mimarisi oluşturulması, kullanıcı akışları ve wireframe/tasarım süreçleri.',
    startWeek: 5,
    endWeek: 10,
    color: 'blue',
  },
  {
    id: 'phase-3',
    title: 'Faz 3: Temel Geliştirme & Çekirdek Modüller',
    description: 'Backend API servisleri, veritabanı kurulumu, kimlik doğrulama ve temel iş mantığı kodlaması.',
    startWeek: 11,
    endWeek: 18,
    color: 'indigo',
  },
  {
    id: 'phase-4',
    title: 'Faz 4: İleri Seviye Özellikler & Entegrasyonlar',
    description: 'Üçüncü parti servis entegrasyonları, gerçek zamanlı bildirimler, raporlama ve analitik modülleri.',
    startWeek: 19,
    endWeek: 26,
    color: 'purple',
  },
  {
    id: 'phase-5',
    title: 'Faz 5: Test, Güvenlik & Performans Optimizasyonu',
    description: 'Birim testleri, entegrasyon testleri, yük testi, güvenlik denetimleri ve performans iyileştirmeleri.',
    startWeek: 27,
    endWeek: 33,
    color: 'amber',
  },
  {
    id: 'phase-6',
    title: 'Faz 6: Kullanıcı Kabulü, Dağıtım & Final Teslim',
    description: 'UAT testleri, canlı ortama dağıtım (deployment), kullanıcı eğitimi, son dokümantasyon ve kapanış.',
    startWeek: 34,
    endWeek: 38,
    color: 'rose',
  },
];

export const DEFAULT_SETTINGS: ProjectSettings = {
  projectName: '38 Haftalık Kapsamlı Proje Planı',
  ownerName: 'Mert Öksüz',
  startDate: new Date().toISOString().split('T')[0],
  totalWeeks: 38,
  weeklyTargetHours: 25,
  pomodoroWorkMinutes: 25,
  pomodoroBreakMinutes: 5,
};

const weekDescriptions: { title: string; goal: string; isMilestone?: boolean; milestoneTitle?: string }[] = [
  // Phase 1 (1-4)
  { title: 'Proje Başlangıcı & Vizyon', goal: 'Proje hedeflerinin belirlenmesi, ekip rollerinin atanması ve başlangıç toplantısı.' },
  { title: 'Kullanıcı & Pazar Araştırması', goal: 'Hedef kitle analizi, rakip incelemeleri ve kullanıcı görüşmeleri gerçekleştirme.' },
  { title: 'Detaylı Gereksinim Dokümanı (SRS)', goal: 'Fonksiyonel ve fonksiyonel olmayan gereksinimlerin çıkarılması.' },
  { title: 'Proje Onayı & Kapsam Dondurma', goal: '1. Faz değerlendirmesi ve kapsam belgesinin paydaşlarca imzalanması.', isMilestone: true, milestoneTitle: 'Milestone 1: Kapsam Onayı' },

  // Phase 2 (5-10)
  { title: 'Sistem Mimarisi & Teknoloji Seçimi', goal: 'Yazılım mimarisi, bulut altyapısı ve teknoloji yığını kararlaştırılması.' },
  { title: 'Veritabanı Şeması & Veri Modelleme', goal: 'İlişkisel ve doküman bazlı şemaların modellenmesi, normalizasyon.' },
  { title: 'API Şeması & İletişim Protokolleri', goal: 'REST/GraphQL uç noktalarının OpenAPI spesifikasyonu ile tanımlanması.' },
  { title: 'UI/UX Bilgi Mimarisi & Wireframeler', goal: 'Sayfa yapıları, navigasyon şeması ve düşük çözünürlüklü prototipler.' },
  { title: 'Tasarım Sistemi & Yüksek Sadakatli Mockuplar', goal: 'Figma bileşen kütüphanesi, tipografi, renk paletleri ve tasarım sistemi.' },
  { title: 'UI/UX Prototip Testi & Tasarım Onayı', goal: 'Kullanıcı testleri ve tasarım fazının tamamlanarak geliştirme için dondurulması.', isMilestone: true, milestoneTitle: 'Milestone 2: Tasarım & Mimari Onayı' },

  // Phase 3 (11-18)
  { title: 'Geliştirme Ortamı & CI/CD Pipeline', goal: 'Docker konteynerleri, Git iş akışı ve otomatik test hatlarının kurulması.' },
  { title: 'Kimlik Doğrulama & Yetkilendirme', goal: 'JWT/OAuth, rol bazlı erişim kontrolü (RBAC) ve oturum yönetimi.' },
  { title: 'Kullanıcı Yönetimi Modülü', goal: 'Profil yönetimi, kullanıcı listesi, şifre sıfırlama akışları.' },
  { title: 'Çekirdek Veri İşlemleri (CRUD)', goal: 'Ana varlıkların oluşturulması, listelenmesi, güncellenmesi ve arşivlenmesi.' },
  { title: 'Frontend Temel Bileşen Entegrasyonu', goal: 'Tasarım sisteminin koda dökülmesi ve API istemcisinin bağlanması.' },
  { title: 'Görev & Zaman Çizelgesi Modülü', goal: 'İş akış motorunun ve zaman planlama çekirdeğinin geliştirilmesi.' },
  { title: 'Dosya Yönetimi & Depolama Entegrasyonu', goal: 'Medya yükleme, bulut depolama ve Google Drive senkronizasyon yapısı.' },
  { title: 'Alfa Sürüm Birleştirme & İç İnceleme', goal: 'Çekirdek modüllerin birleştirilmesi ve ilk çalışan Alfa derlemesi.', isMilestone: true, milestoneTitle: 'Milestone 3: Alfa Sürüm Tamamlandı' },

  // Phase 4 (19-26)
  { title: 'Gelişmiş Arama & Filtreleme', goal: 'Elasticsearch/indeksleme, çoklu kriterli filtreleme mekanizmaları.' },
  { title: 'Gerçek Zamanlı Bildirim Sistemi', goal: 'WebSockets/SSE üzerinden anlık sistem ve aktivite bildirimleri.' },
  { title: 'Google Workspace & Dış Entegrasyonlar', goal: 'Google Drive, Doküman ve Takvim servisleri ile çift yönlü iletişim.' },
  { title: 'Raporlama & Veri Dışa Aktarım', goal: 'PDF, Excel ve CSV formatlarında dinamik rapor oluşturma araçları.' },
  { title: 'Gösterge Paneli (Dashboard) & Analitik', goal: 'Grafikler, KPI sayaçları ve görsel ilerleme panolarının geliştirilmesi.' },
  { title: 'Erişilebilirlik & Çoklu Dil Desteği (i18n)', goal: 'WCAG standartlarına uyum ve Türkçe/İngilizce dil altyapısı.' },
  { title: 'Mobil Uyumluluk & Responsive İyileştirme', goal: 'Farklı ekran boyutlarında kusursuz mobil ve tablet deneyimi.' },
  { title: 'Beta Sürümü Yayını & Paydaş Demosu', goal: 'Tüm özelliklerin çalıştığı Beta sürümünün test ortamına alınması.', isMilestone: true, milestoneTitle: 'Milestone 4: Beta Sürümü & Canlı Demo' },

  // Phase 5 (27-33)
  { title: 'Kapsamlı Birim & Entegrasyon Testleri', goal: 'Test kapsamının %80 üzerine çıkarılması ve hata senaryolarının kapatılması.' },
  { title: 'Uçtan Uca (E2E) Otomasyon Testleri', goal: 'Cypress/Playwright ile kritik kullanıcı senaryolarının otomatik testi.' },
  { title: 'Güvenlik Denetimi & Penetrasyon Testi', goal: 'OWASP kontrolleri, zafiyet taramaları ve yetki aşımı testleri.' },
  { title: 'Performans, Önbellekleme & Veritabanı İndeksleme', goal: 'Redis önbellek, SQL sorgu optimizasyonu ve sayfa yükleme süresi düşürme.' },
  { title: 'Yük & Stres Testleri', goal: 'Yüksek eşzamanlı kullanıcı altında sistem kararlılığının ölçülmesi.' },
  { title: 'Hata Ayıklama (Bug Bashing) Maratonu', goal: 'Açık kalan tüm minör ve majör yazılım hatalarının çözülmesi.' },
  { title: 'Sürüm Adayı (RC) Onayı', goal: 'Canlıya çıkmaya hazır kararlı Sürüm Adayı (Release Candidate) dondurulması.', isMilestone: true, milestoneTitle: 'Milestone 5: Release Candidate (RC)' },

  // Phase 6 (34-38)
  { title: 'Kullanıcı Kabul Testleri (UAT)', goal: 'Son kullanıcılar ile pilot testler ve geri bildirimlerin toplanması.' },
  { title: 'Kullanıcı Kılavuzları & Teknik Dokümantasyon', goal: 'Yönetici rehberi, API dokümantasyonu ve yardım merkezi içerikleri.' },
  { title: 'Üretim Ortamı (Production) Kurulumu & Geçiş', goal: 'Canlı sunucu konfigürasyonu, SSL, CDN ve sıfır kesintili dağıtım.' },
  { title: 'Eğitim & Canlıya Geçiş (Go-Live)', goal: 'Sistemin resmi olarak yayına alınması ve son kullanıcı oryantasyonu.' },
  { title: 'Proje Kapanışı & Final Değerlendirme', goal: '38 haftalık proje başarısının raporlanması, retrospektif ve teslim.', isMilestone: true, milestoneTitle: 'Milestone 6: 38 Haftalık Proje Final Teslimi!' },
];

export function generateInitialWeeks(startDateStr: string): WeekPlan[] {
  const start = new Date(startDateStr);
  const weeks: WeekPlan[] = [];

  for (let i = 1; i <= 38; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + (i - 1) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const desc = i <= 30
      ? { title: '', goal: '', isMilestone: false, milestoneTitle: undefined }
      : (weekDescriptions[i - 1] || {
          title: `Hafta ${i} Çalışmaları`,
          goal: `Hafta ${i} için belirlenen hedeflerin gerçekleştirilmesi.`,
        });

    let phaseId = 'phase-1';
    if (i >= 5 && i <= 10) phaseId = 'phase-2';
    else if (i >= 11 && i <= 18) phaseId = 'phase-3';
    else if (i >= 19 && i <= 26) phaseId = 'phase-4';
    else if (i >= 27 && i <= 33) phaseId = 'phase-5';
    else if (i >= 34) phaseId = 'phase-6';

    weeks.push({
      weekNumber: i,
      title: desc.title,
      goal: desc.goal,
      phaseId,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      targetHours: 25,
      notes: `Hafta ${i} detaylı çalışma planı ve hedefleri Mert Öksüz tarafından takip edilmektedir.`,
      isMilestone: desc.isMilestone,
      milestoneTitle: desc.milestoneTitle,
      driveUrl: i === 3 
        ? 'https://drive.google.com/drive/my-drive' 
        : (i === 1 ? 'https://drive.google.com/drive/my-drive' : undefined),
      driveTitle: i === 3 
        ? 'Hafta 3 - Google Drive Çalışma Klasörü' 
        : (i === 1 ? 'Hafta 1 - Google Drive Proje Klasörü' : undefined),
    });
  }

  return weeks;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '38 Haftalık Yol Haritasını ve Takvimi Onaylama',
    description: 'Projenin 38 haftalık zaman çizelgesini gözden geçirip kilometre taşlarını belirleme.',
    weekNumber: 1,
    status: 'completed',
    priority: 'urgent',
    estimatedHours: 5,
    loggedHours: 5,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    tags: ['Yönetim', 'Planlama'],
    createdAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Google Drive Dosya Klasör Yapısını Oluşturma',
    description: '38 hafta için ana klasörleri ve haftalık dokümantasyon şablonlarını hazırlama.',
    weekNumber: 1,
    status: 'in_progress',
    priority: 'high',
    estimatedHours: 6,
    loggedHours: 3.5,
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
    tags: ['Google Drive', 'Altyapı'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Paydaş Görüşmeleri & İhtiyaç Analizi Matrisi',
    description: 'Tüm birimlerle toplantı yapılarak işlevsel ihtiyaçların toplanması.',
    weekNumber: 1,
    status: 'todo',
    priority: 'medium',
    estimatedHours: 8,
    loggedHours: 0,
    dueDate: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0],
    tags: ['Gereksinimler', 'Toplantı'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Rakip Ürün ve Pazar Karşılaştırma Raporu',
    description: 'Sektördeki 5 ana rakibin güçlü ve zayıf yönlerini tabloya dökme.',
    weekNumber: 2,
    status: 'todo',
    priority: 'medium',
    estimatedHours: 10,
    loggedHours: 0,
    dueDate: new Date(Date.now() + 86400000 * 11).toISOString().split('T')[0],
    tags: ['Pazar Analizi', 'Dokümantasyon'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    title: 'SRS (Software Requirements Specification) Taslağı',
    description: 'IEEE 830 standardında teknik şartname taslağı oluşturma.',
    weekNumber: 3,
    status: 'todo',
    priority: 'urgent',
    estimatedHours: 16,
    loggedHours: 0,
    dueDate: new Date(Date.now() + 86400000 * 18).toISOString().split('T')[0],
    tags: ['Gereksinimler', 'SRS'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-6',
    title: 'Faz 1 Kapsam Dondurma ve İmzalı Onay',
    description: 'Proje yöneticisi Mert Öksüz ve sponsorlar tarafından kapsam belgesinin onaylanması.',
    weekNumber: 4,
    status: 'todo',
    priority: 'high',
    estimatedHours: 4,
    loggedHours: 0,
    dueDate: new Date(Date.now() + 86400000 * 25).toISOString().split('T')[0],
    tags: ['Kilometre Taşı', 'Onay'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-7',
    title: 'Figma UI/UX Tasarım Sistemi & Bileşenler',
    description: 'Renk paletleri, tipografi, butonlar ve form alanlarının hazırlanması.',
    weekNumber: 9,
    status: 'todo',
    priority: 'high',
    estimatedHours: 20,
    loggedHours: 0,
    dueDate: new Date(Date.now() + 86400000 * 60).toISOString().split('T')[0],
    tags: ['UI/UX', 'Figma'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-8',
    title: '38. Hafta: Canlıya Dağıtım ve Final Proje Sunumu',
    description: 'Projenin tüm çıktılarıyla eksiksiz teslim edilmesi ve kutlama toplantısı.',
    weekNumber: 38,
    status: 'todo',
    priority: 'urgent',
    estimatedHours: 12,
    loggedHours: 0,
    dueDate: new Date(Date.now() + 86400000 * 260).toISOString().split('T')[0],
    tags: ['Final', 'Teslim'],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_DOCUMENTS: WeeklyDocument[] = [
  {
    id: 'doc-1',
    weekNumber: 1,
    title: 'Hafta 1 - Proje Şartnamesi & Yönetim Özeti',
    type: 'markdown',
    content: `# Mert Öksüz - 38 Haftalık Proje Yönetim Özeti

## Proje Vizyonu
Bu 38 haftalık kapsamlı proje, belirlenen zaman planına ve kilometre taşlarına tam uyumlu olarak yürütülecektir.

### Hafta 1 Öncelikli Hedefleri:
1. Zaman çizelgesinin tüm paydaşlar tarafından doğrulanması
2. Haftalık hedeflerin ve çalışma saat kotalarının belirlenmesi
3. Doküman ve dosya yönetim entegrasyonlarının devreye alınması

### Notlar & İpuçları
- Her hafta için saat takibi düzenli yapılmalı.
- Google Drive linkleri ve dahili dokümanlar ilgili haftanın dosyalar sekmesine eklenmeli.
`,
    updatedAt: new Date().toISOString(),
    author: 'Mert Öksüz',
    size: '2.4 KB',
    tags: ['Plan', 'Özet', 'Hafta 1'],
  },
  {
    id: 'doc-2',
    weekNumber: 1,
    title: 'Google Drive Proje Ana Klasörü',
    type: 'drive_folder',
    url: 'https://drive.google.com/drive/u/0/my-drive',
    content: `Google Drive üzerindeki ana proje çalışma klasörü. Bu klasör altında her hafta için özel çalışma alt klasörleri tutulmaktadır.

Klasör Yolu: /Mert_Oksuz_38_Haftalik_Proje/Hafta_01/
Düzenleme Yetkisi: Mert Öksüz (Yönetici)`,
    updatedAt: new Date().toISOString(),
    author: 'Mert Öksüz',
    size: 'Bağlantı',
    tags: ['Google Drive', 'Klasör'],
  },
  {
    id: 'doc-3',
    weekNumber: 1,
    title: 'Haftalık Kontrol Listesi & Saat Planı',
    type: 'checklist',
    content: `[x] 38 haftalık genel plan gözden geçirildi
[x] Saat sayacı ve çalışma kotaları ayarlandı
[ ] 1. hafta Google Drive klasörleri oluşturuldu
[ ] Paydaş iletişim kanalları tanımlandı
[ ] Hafta sonu ilerleme değerlendirmesi yapılacak`,
    updatedAt: new Date().toISOString(),
    author: 'Mert Öksüz',
    size: '1.1 KB',
    tags: ['Kontrol Listesi', 'Görevler'],
  },
  {
    id: 'doc-4',
    weekNumber: 2,
    title: 'Pazar Analizi & Rakip Tablosu (Google Sheet)',
    type: 'drive_sheet',
    url: 'https://docs.google.com/spreadsheets/u/0/',
    content: `Rakip analiz verileri, fiyatlandırma stratejileri ve özellik karşılaştırma tablosu bu tabloda derlenmektedir.`,
    updatedAt: new Date().toISOString(),
    author: 'Mert Öksüz',
    size: 'Tablo',
    tags: ['Google E-Tablolar', 'Analiz'],
  },
  {
    id: 'doc-5',
    weekNumber: 3,
    title: 'Hafta 3 - Google Drive Çalışma Klasörü',
    type: 'drive_folder',
    url: 'https://drive.google.com/drive/my-drive',
    content: 'Hafta 3 çalışma dosyaları, araştırma notları ve teslimat Google Drive bağlantısı.',
    updatedAt: new Date().toISOString(),
    author: 'Mert Öksüz',
    size: 'Bağlantı',
    tags: ['Google Drive', 'Hafta 3', 'Klasör'],
  },
];
