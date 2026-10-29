import { Respondent } from '../types';
import { calculateEvaluation } from '../utils/scoring';

export const INITIAL_MOCK_RESPONDENTS: Respondent[] = [
  {
    id: 'resp-2026-001',
    timestamp: '2026-10-25 09:15:30',
    nama: 'Budi Santoso, S.H., M.H.',
    nip: '198204152006041002',
    jabatan: 'Kepala Subbagian Pengelolaan Keuangan dan BMN',
    satker: 'Kantor Wilayah Kementerian Hukum Sumatera Selatan',
    statusUpr: 'IYA',
    keteranganUpr: 'Koordinator Unit Pemilik Risiko (UPR) Tingkat Satker pada Pokja Keuangan dan Aset BMN.',
    answers: {
      1: 'Risiko adalah potensi peristiwa ketidakpastian yang apabila terjadi dapat menghambat atau menggagalkan pencapaian sasaran strategis instansi. Sedangkan Manajemen Risiko adalah rangkaian proses terstruktur, berkesinambungan, dan terintegrasi meliputi penetapan konteks, identifikasi, analisis kemungkinan dan dampak, evaluasi, hingga penyusunan rencana tindak pengendalian (RTP) guna menjaga akuntabilitas kinerja keuangan dan aset satker.',
      2: 'Dasar hukum utama adalah PP No. 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah (SPIP) khususnya unsur Penilaian Risiko, Permenkum 15 Tahun 2025 tentang Penerapan Manajemen Risiko di Lingkungan Kementerian Hukum, serta Keputusan Menteri tentang Pedoman Pelaksanaan Manajemen Risiko dan Piagam Manajemen Risiko.',
      3: 'Pernah mengikuti Workshop Penyusunan Profil Risiko dan Register Risiko Satker yang diselenggarakan oleh BPSDM Hukum bekerja sama dengan BPKP pada Bulan Mei 2025, serta Pelatihan Mandiri Manajemen Risiko SPBE via MOOC Kemenkum.',
      4: 'Tahapan penyusunan manajemen risiko terdiri atas: (1) Penetapan Konteks dan Sasaran Kinerja Satker; (2) Identifikasi Risiko (mengenali risiko, penyebab langsung/akar masalah, dan akibatnya); (3) Analisis Risiko (mengukur level kemungkinan dan besaran dampak); (4) Evaluasi Risiko (menentukan ranking prioritas risiko); (5) Penanganan Risiko (menyusun Rencana Tindak Pengendalian / RTP); didukung dengan (6) Pemantauan berkala dan Komunikasi Konsultasi kepada pimpinan UPR.',
      5: 'Risiko: Keterlambatan penyelesaian pelaporan rekonsiliasi BMN semesteran akibat ketidaksesuaian input aplikasi Sakti dengan fisik lapangan. Rencana Tindak Penanganan (RTP): Pelaksanaan pra-rekonsiliasi internal mingguan bersama pengelola BMN dan operator keuangan, pembuatan checklist verifikasi mandiri, dan supervisi terpadu sebelum batas akhir cut-off pelaporan.',
      6: 'Proses identifikasi dilakukan melalui rapat koordinasi berkala (Focus Group Discussion) bersama seluruh penanggung jawab fungsi, menelaah laporan hasil audit internal/Inspektorat Jenderal, serta membedah proses bisnis layanan. Hasil inventarisasi dituangkan ke dalam matriks analisis risiko (skala 5x5) untuk menentukan tingkat risiko (Sangat Tinggi, Tinggi, Sedang, Rendah).',
      7: 'Bukti fisik nyata berupa: Adanya Piagam Manajemen Risiko Satker Tahun 2026, Register Risiko yang disahkan Kakanwil, serta Notula Rapat Evaluasi Anggaran Triwulan di mana alokasi anggaran pemeliharaan server dan pelatihan operator dimasukkan sebagai tindak lanjut atas risiko kegagalan sistem pelaporan.'
    },
    status: 'Sudah Dinilai',
    evaluation: calculateEvaluation(
      { 1: 10, 2: 9, 3: 9, 4: 10, 5: 8, 6: 9, 7: 8 },
      'Responden memiliki pemahaman tata kelola risiko yang sangat matang dan terbukti aktif mengintegrasikan register risiko ke dalam dokumen perencanaan anggaran satker sesuai Permenkum 15 Tahun 2025.',
      {
        1: 'Definisi sangat komprehensif mencakup aspek sasaran dan tata kelola terpadu.',
        2: 'Hierarki dasar hukum tepat dan lengkap sesuai Permenkum 15 Tahun 2025.',
        5: 'Contoh RTP sangat aplikatif dan realistis.',
        7: 'Bukti dukung konkret dan selaras dengan tugas fungsinya.'
      },
      'Drs. H. Hendra Wijaya, M.Si.',
      '197508121998031001',
      '2026-10-26 14:20:00'
    )
  },
  {
    id: 'resp-2026-002',
    timestamp: '2026-10-26 11:30:15',
    nama: 'Siti Rahmawati, S.Sos., M.AP.',
    nip: '198908222014022001',
    jabatan: 'Analis Perencanaan dan Kerjasama',
    satker: 'Kantor Wilayah Kementerian Hukum Jawa Barat',
    statusUpr: 'IYA',
    keteranganUpr: 'Sekretariat UPR Kanwil bidang Pelaporan Kinerja dan Pengendalian Internal.',
    answers: {
      1: 'Risiko adalah kemungkinan timbulnya peristiwa tak terduga yang dapat merugikan atau menghambat tugas pokok organisasi. Manajemen risiko adalah tata cara yang kita susun agar risiko tersebut dapat diantisipasi sejak dini dan tidak menimbulkan gangguan operasional.',
      2: 'Dasar hukumnya adalah PP No. 60 Tahun 2008 tentang SPIP, Permenkum 15 Tahun 2025 tentang Penerapan Manajemen Risiko di Lingkungan Kementerian Hukum, serta pedoman pelaksanaan teknis kementerian.',
      3: 'Pernah mengikuti Sosialisasi Maturitas SPIP Terintegrasi dan Manajemen Risiko yang diadakan Kanwil Kemenkum pada kuartal ketiga tahun 2025.',
      4: 'Tahapannya: Mengenali sasaran kerja, menemukan risiko-risiko yang mungkin timbul, menilai besar kecilnya dampak dan peluang terjadinya, menentukan mana yang paling darurat, lalu menyusun langkah penanganan serta diawasi secara berkala.',
      5: 'Risiko: Keterlambatan verifikasi berkas permohonan layanan kenotariatan. Rencana penanganan: Penguatan basis data digital, pembagian tim piket verifikasi, serta asistensi berkala ke pengguna layanan.',
      6: 'Kami mengadakan rapat tim kerja evaluasi program kerja, mengkaji catatan kendala dari tahun sebelumnya, lalu memasukkan temuan tersebut ke formulir daftar risiko untuk dinilai tingkat urgensinya.',
      7: 'Dokumen register risiko dijadikan lampiran dalam Rencana Strategis (Renstra) Satker dan dijadikan acuan evaluasi capaian kinerja triwulanan.'
    },
    status: 'Belum Dinilai'
  },
  {
    id: 'resp-2026-003',
    timestamp: '2026-10-27 08:45:10',
    nama: 'Ahmad Fauzi, S.Kom.',
    nip: '199301102018011003',
    jabatan: 'Pranata Komputer Ahli Pertama',
    satker: 'Direktorat Jenderal Administrasi Hukum Umum',
    statusUpr: 'TIDAK',
    keteranganUpr: 'Bukan pengurus inti UPR, namun bertindak sebagai pelaksana teknis pengamanan sistem informasi dan operasional infrastruktur TI pendukung risiko SPBE.',
    answers: {
      1: 'Menurut pemahaman saya, risiko adalah potensi terjadinya kendala, kegagalan sistem, atau ancaman siber yang mengganggu kelangsungan layanan pendaftaran daring. Manajemen risiko adalah langkah-langakah preventif teknologi informasi dan tata kelola SOP untuk meminimalkan waktu henti (downtime) dan kebocoran data.',
      2: 'PP 60 Tahun 2008 tentang SPIP, Perpres SPBE No. 95 Tahun 2018 tentang Manajemen Risiko SPBE, serta Permenkum 15 Tahun 2025 tentang Penerapan Manajemen Risiko di Lingkungan Kementerian Hukum.',
      3: 'Pernah mengikuti pelatihan online Cyber Security Incident Handling dan Manajemen Risiko SPBE Pusdatin Kemenkum pada tahun 2024.',
      4: 'Tahapannya mencakup identifikasi aset kritis TI, analisis kerentanan (vulnerability assessment) dan ancaman siber, penaksiran dampak gangguan layanan, implementasi patch/backup mitigasi, serta monitoring log insiden berkala.',
      5: 'Risiko: Serangan Distributed Denial of Service (DDoS) atau lonjakan trafik yang menyebabkan sistem permohonan daring lambat diakses publik. Rencana penanganan: Implementasi Cloud Web Application Firewall (WAF), load balancer redundan, serta uji beban berkala sebelum masa puncak permohonan.',
      6: 'Melakukan pemantauan log keamanan server secara harian, melakukan scanning kerentanan rutin, dan menyampaikan laporan reviu berkala kepada pimpinan UPR tingkat Ditjen.',
      7: 'Hasil analisis risiko kegagalan server dijadikan dasar justifikasi pengadaan peningkatan bandwidth dan lisensi failover multi-cloud dalam dokumen RKAKL tahun berjalan.'
    },
    status: 'Belum Dinilai'
  },
  {
    id: 'resp-2026-004',
    timestamp: '2026-10-24 13:10:00',
    nama: 'Dewi Lestari, S.E.',
    nip: '198511042009122002',
    jabatan: 'Pejabat Pengadaan Barang dan Jasa',
    satker: 'Kantor Wilayah Kementerian Hukum Kalimantan Barat',
    statusUpr: 'TIDAK',
    keteranganUpr: 'Staf pengadaan yang bertugas sebagai tim pelaksana teknis pada paket pengadaan sarana dan prasarana kantor.',
    answers: {
      1: 'Risiko adalah masalah yang dapat terjadi pada saat lelang atau distribusi barang yang membuat target kegiatan terhambat. Manajemen risiko adalah cara agar pengadaan tidak bermasalah dengan pemeriksa.',
      2: 'PP 60/2008 tentang SPIP, Perpres Pengadaan Barang dan Jasa Pemerintah, serta Permenkum 15 Tahun 2025 tentang Manajemen Risiko di Lingkungan Kementerian Hukum.',
      3: 'Belum pernah mengikuti diklat khusus manajemen risiko, baru sosialisasi umum SPIP pengadaan satu kali.',
      4: 'Mencari tahu potensi masalah lelang, mengecek rekanan yang wanprestasi, lalu membuat pengawasan ketat.',
      5: 'Risiko: Keterlambatan pengiriman bahan makanan oleh pihak penyedia vendor. Rencana penanganan: Menetapkan denda keterlambatan dan menyiapkan vendor cadangan.',
      6: 'Berkoordinasi dengan PPK dan staf dapur untuk memantau waktu kedatangan bahan setiap pagi.',
      7: 'Laporan kendala distribusi dijadikan bahan rapat mingguan bersama Kepala Kantor.'
    },
    status: 'Sudah Dinilai',
    evaluation: calculateEvaluation(
      { 1: 5, 2: 4, 3: 5, 4: 5, 5: 6, 6: 5, 7: 4 },
      'Responden memiliki pemahaman operasional pengadaan yang cukup, namun konsep formal tata kelola manajemen risiko masih perlu ditingkatkan melalui diklat teknis SPIP/MR terstruktur sesuai Permenkum 15 Tahun 2025.',
      {
        1: 'Pemahaman masih berorientasi pada aspek kepatuhan audit semata.',
        2: 'Perlu penguatan pemahaman regulasi spesifik Permenkum 15 Tahun 2025.',
        4: 'Tahapan masih ad-hoc dan belum mengikuti siklus baku manajemen risiko.'
      },
      'Drs. H. Hendra Wijaya, M.Si.',
      '197508121998031001',
      '2026-10-25 10:00:00'
    )
  }
];

export const STORAGE_KEY_RESPONDENTS = 'smr_kemenkum_respondents_v4';
export const STORAGE_KEY_AUTH = 'smr_evaluator_session_v1';
export const STORAGE_KEY_CUSTOM_PIN = 'smr_evaluator_custom_pin_v1';
export const DEFAULT_PINS = ['123456', 'evaluasi2026'];

/**
 * Sanitizes any string to strictly replace legacy 'permenkumham' references with 'Permenkum 15 Tahun 2025'.
 */
export function sanitizeStringForRegulation(input: string): string {
  if (!input) return input;
  return input
    .replace(/permenkumham(\s*(no|nomor)?\s*\.?\s*\d+\s*(tahun)?\s*\d+)?/gi, 'Permenkum 15 Tahun 2025')
    .replace(/kemenkumham/gi, 'Kemenkum')
    .replace(/Kementerian Hukum dan Hak Asasi Manusia/gi, 'Kementerian Hukum')
    .replace(/Kementerian Hukum dan HAM/gi, 'Kementerian Hukum');
}

/**
 * Recursively scrubs any object to replace legacy references.
 */
export function sanitizeObjectData<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeStringForRegulation(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObjectData(item)) as unknown as T;
  }
  if (obj && typeof obj === 'object') {
    const copy: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
      copy[key] = sanitizeObjectData((obj as Record<string, unknown>)[key]);
    }
    return copy as T;
  }
  return obj;
}

/**
 * Performs complete migration & sanitization from previous localStorage versions.
 */
export function loadAndMigrateRespondents(): Respondent[] {
  try {
    // 1. Purge legacy string occurrences across all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('respondent') || key.includes('smr_') || key.includes('evaluasi_'))) {
        const val = localStorage.getItem(key);
        if (val && /kumham/i.test(val)) {
          const sanitizedVal = sanitizeStringForRegulation(val);
          localStorage.setItem(key, sanitizedVal);
        }
      }
    }

    // 2. Try loading from current key v4
    const storedV4 = localStorage.getItem(STORAGE_KEY_RESPONDENTS);
    if (storedV4 !== null) {
      const parsed = JSON.parse(storedV4);
      if (Array.isArray(parsed)) {
        return sanitizeObjectData(parsed);
      }
    }

    // 3. Try migrating from prior keys
    const legacyKeys = [
      'smr_kemenkum_respondents_v3',
      'smr_kemenkum_respondents_v2',
      'smr_kemenkum_respondents_v1',
      'evaluasi_mr_respondents_v2',
      'evaluasi_mr_respondents'
    ];

    for (const legacyKey of legacyKeys) {
      const legacyData = localStorage.getItem(legacyKey);
      if (legacyData) {
        try {
          const parsed = JSON.parse(legacyData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Check if it's only default mock respondents with old data
            const onlyHasMockIds = parsed.every((item: Respondent) =>
              item.id.startsWith('resp-2026-00')
            );

            if (onlyHasMockIds) {
              // Replace cleanly with fresh INITIAL_MOCK_RESPONDENTS
              localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify(INITIAL_MOCK_RESPONDENTS));
              localStorage.removeItem(legacyKey);
              return INITIAL_MOCK_RESPONDENTS;
            }

            // Otherwise, sanitize respondent answers and save to v4
            const sanitized = sanitizeObjectData(parsed);
            localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify(sanitized));
            localStorage.removeItem(legacyKey);
            return sanitized;
          }
        } catch {
          // ignore corrupted legacy key
        }
      }
    }
  } catch (e) {
    console.error('Error during respondent storage migration:', e);
  }

  // Fresh initialization
  try {
    localStorage.setItem(STORAGE_KEY_RESPONDENTS, JSON.stringify(INITIAL_MOCK_RESPONDENTS));
  } catch {
    // ignore
  }
  return INITIAL_MOCK_RESPONDENTS;
}

export function verifyEvaluatorPin(inputPin: string): boolean {
  const clean = inputPin.trim();
  if (!clean) return false;
  try {
    const customPin = localStorage.getItem(STORAGE_KEY_CUSTOM_PIN);
    if (customPin) {
      return clean === customPin;
    }
  } catch {
    // fallback
  }
  return DEFAULT_PINS.includes(clean);
}

export function setCustomEvaluatorPin(newPin: string): void {
  localStorage.setItem(STORAGE_KEY_CUSTOM_PIN, newPin.trim());
}

export function resetCustomEvaluatorPin(): void {
  localStorage.removeItem(STORAGE_KEY_CUSTOM_PIN);
}

export function hasCustomPin(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY_CUSTOM_PIN));
  } catch {
    return false;
  }
}
