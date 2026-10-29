import { QuestionDefinition } from '../types';

export const QUESTIONS_DATA: QuestionDefinition[] = [
  {
    id: 1,
    category: 'A',
    categoryTitle: 'Bagian A: Pemahaman Manajemen Risiko',
    title: 'Definisi Risiko & Manajemen Risiko',
    question: 'Apa yang Saudara ketahui tentang risiko dan manajemen risiko? Jelaskan!',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `• Risiko: Peluang atau kemungkinan terjadinya suatu peristiwa yang berpotensi menghambat, menggagalkan, atau tidak tercapainya sasaran strategis/operasional organisasi.\n• Manajemen Risiko: Proses yang sistematis, terstruktur, terpadu, dan berkelanjutan yang dikoordinasikan untuk mengarahkan dan mengendalikan organisasi dalam mengidentifikasi, menganalisis, mengevaluasi, serta mengendalikan risiko guna memberikan keyakinan memadai atas tercapainya tujuan.`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Tidak menjawab atau jawaban melenceng, hanya mengartikan risiko sebatas kerugian finansial/bahaya fisik tanpa mengaitkan dengan sasaran organisasi.',
      2: 'Kurang (4-6): Menjelaskan risiko secara sempit dan tidak menguraikan konsep manajemen risiko secara komprehensif atau struktural.',
      3: 'Cukup / Baik (7-8): Menjelaskan risiko sebagai potensi hambatan sasaran dan manajemen risiko sebagai langkah pengendalian risiko dengan jelas.',
      4: 'Sangat Lengkap (9-10): Menguraikan risiko secara presisi (unsur kemungkinan dan dampak terhadap sasaran) serta manajemen risiko sebagai proses sistematis, berkelanjutan, dan terintegrasi dalam tata kelola organisasi.'
    }
  },
  {
    id: 2,
    category: 'A',
    categoryTitle: 'Bagian A: Pemahaman Manajemen Risiko',
    title: 'Dasar Hukum Penerapan Manajemen Risiko',
    question: 'Apa dasar hukum penerapan manajemen risiko di lingkungan Kemenkum?',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `• PP No. 60 Tahun 2008 tentang Sistem Pengendalian Intern Pemerintah (SPIP) - khususnya sub-unsur Penilaian Risiko.\n• Peraturan Menteri Hukum (Permenkum) No. 15 Tahun 2025 tentang Penerapan Manajemen Risiko di Lingkungan Kementerian Hukum.\n• Keputusan Menteri tentang Pedoman Pelaksanaan Manajemen Risiko dan Piagam Manajemen Risiko.\n• Standar Internasional ISO 31000:2018 (Risk Management - Guidelines) sebagai acuan rujukan teknis.`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Tidak tahu / tidak menyebutkan dasar hukum sama sekali atau menyebutkan regulasi yang sama sekali tidak relevan.',
      2: 'Kurang (4-6): Hanya menyebutkan peraturan umum (misalnya hanya menyebut "UUD 1945" atau "peraturan menteri" tanpa nomor dan substansi yang jelas).',
      3: 'Cukup / Baik (7-8): Menyebutkan minimal 1 regulasi pokok yang tepat (misal: PP 60/2008 tentang SPIP atau Permenkum 15 Tahun 2025 tentang Manajemen Risiko).',
      4: 'Sangat Lengkap (9-10): Menyebutkan kombinasi regulasi hierarki lengkap: PP No. 60/2008 (SPIP), Permenkum 15 Tahun 2025 tentang Manajemen Risiko di Lingkungan Kementerian Hukum, dan acuan pedoman teknis/ISO 31000.'
    }
  },
  {
    id: 3,
    category: 'A',
    categoryTitle: 'Bagian A: Pemahaman Manajemen Risiko',
    title: 'Keikutsertaan Pelatihan & Sosialisasi',
    question: 'Apakah Saudara pernah mengikuti kegiatan terkait Manajemen Risiko dalam bentuk Sosialisasi, workshop atau pelatihan lainnya?',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `• Kejujuran dan kejelasan data partisipasi: Nama kegiatan, bentuk kegiatan (Sosialisasi/Bimtek/Workshop/MOOC BPSDM Kemenkum/BPKP).\n• Tahun/periode keikutsertaan dan materi yang diperoleh (contoh: penyusunan risk register, analisis matriks analisis risiko).\n• Jika belum pernah, menguraikan inisiatif belajar mandiri atau kebutuhan peningkatan kompetensi di satkernya.`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Hanya menjawab singkat "Pernah" atau "Belum" tanpa rincian sama sekali.',
      2: 'Kurang (4-6): Menyebutkan pernah mengikuti namun keterangan kegiatan sangat samar (tidak jelas waktu dan substansinya).',
      3: 'Cukup / Baik (7-8): Menguraikan bentuk kegiatan yang pernah diikuti secara jelas (nama pelatihan/sosialisasi, waktu, dan topik garis besar).',
      4: 'Sangat Lengkap (9-10): Menguraikan riwayat pelatihan/sosialisasi secara detail (nama kegiatan, tahun, penyelenggara, materi spesifik) serta relevansi penerapannya terhadap tugas jabatan saat ini.'
    }
  },
  {
    id: 4,
    category: 'A',
    categoryTitle: 'Bagian A: Pemahaman Manajemen Risiko',
    title: 'Tahapan Penyusunan Manajemen Risiko',
    question: 'Jelaskan/gambarkan tahapan penyusunan Manajemen Risiko!',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `Siklus Manajemen Risiko yang baku (ISO 31000 / SPIP Kemenkum):\n1. Penetapan Konteks (Sasaran strategis, ruang lingkup, kriteria risiko).\n2. Penilaian Risiko (Risk Assessment):\n   a. Identifikasi Risiko (mengenali risiko, penyebab/akar masalah, dan dampak).\n   b. Analisis Risiko (menentukan tingkat kemungkinan/probabilitas dan tingkat dampak).\n   c. Evaluasi Risiko (membandingkan hasil analisis dengan selera risiko / prioritisasi).\n3. Penanganan/Mitigasi Risiko (Rencana Tindak Pengendalian / RTP).\n4. Pemantauan dan Reviu (Monitoring berkala terhadap efektivitas pengendalian).\n5. Komunikasi dan Konsultasi (Sepanjang siklus kepada seluruh pemangku kepentingan).`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Tahapan salah total atau hanya menyebutkan 1 tahap acak tanpa runtutan proses.',
      2: 'Kurang (4-6): Hanya menyebutkan 2-3 tahap terpisah (misal: "cari masalah lalu diperbaiki") tanpa metodologi baku.',
      3: 'Cukup / Baik (7-8): Menyebutkan runtutan tahapan pokok (Identifikasi, Analisis, Evaluasi, dan Penanganan/Mitigasi risiko).',
      4: 'Sangat Lengkap (9-10): Menyajikan siklus menyeluruh secara runut dan runtut: Penetapan Konteks, Penilaian Risiko (Identifikasi-Analisis-Evaluasi), Penanganan/RTP, serta Pemantauan & Komunikasi Konsultasi.'
    }
  },
  {
    id: 5,
    category: 'A',
    categoryTitle: 'Bagian A: Pemahaman Manajemen Risiko',
    title: 'Studi Kasus Risiko & Rencana Tindak Pengendalian (RTP)',
    question: 'Sebutkan salah satu risiko dan rencana tindak penanganannya di Satuan Kerja saudara!',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `• Perumusan Pernyataan Risiko: Spesifik, riil di lingkungan kerja (misal: Keterlambatan pengadaan barang/jasa, gangguan server aplikasi layanan publik, penyerapan anggaran tidak optimal, ketidakakuratan data BMN).\n• Uraian Sebab (Root Cause) & Dampak (Impact).\n• Rencana Tindak Pengendalian (RTP): Langkah mitigasi pencegahan (preventif) dan penanggulangan (represif/kuratif), penanggung jawab tindakan, serta periode waktu implementasi.`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Contoh tidak masuk akal, tidak berkaitan dengan satker, atau rencana penanganan tidak ada.',
      2: 'Kurang (4-6): Contoh risiko terlalu umum/abstrak dan tindakan penanganan tidak spesifik / tidak menyelesaikan akar masalah.',
      3: 'Cukup / Baik (7-8): Contoh risiko nyata di satker dan rencana penanganan relevan serta masuk akal untuk dijalankan.',
      4: 'Sangat Lengkap (9-10): Rumusan risiko sangat konkret dan kontekstual pada tugas pokok satker, dilengkapi uraian akar penyebab, dampak potensial, serta rencana mitigasi yang realistis, terukur, dan memiliki penanggung jawab.'
    }
  },
  {
    id: 6,
    category: 'B',
    categoryTitle: 'Bagian B: Penerapan Manajemen Risiko',
    title: 'Proses Identifikasi & Mitigasi Risiko',
    question: 'Bagaimana cara menentukan atau berproses untuk mengidentifikasi dan memitigasi risiko?',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `• Mekanisme Kolaboratif: Pembentukan tim kerja/gugus tugas, pelaksanaan Focus Group Discussion (FGD), wawancara, brainstorming lintas fungsi.\n• Teknik & Alat Analisis: Pemanfaatan register risiko satker, analisis data historis insiden masa lalu, analisis pohon masalah (root cause analysis / 5 Whys), pemetaan matriks analisis risiko (tingkat probabilitas x besaran dampak).\n• Formulasi Mitigasi: Penentuan opsi mitigasi (menghindari, mengurangi kemungkinan, mengurangi dampak, mengalihkan, atau menerima risiko) yang dituangkan dalam formulir Rencana Tindak Pengendalian (RTP).`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Tidak tahu caranya atau menganggap identifikasi risiko cukup dilakukan secara spontan tanpa metode.',
      2: 'Kurang (4-6): Menyebutkan proses secara parsial (misal hanya rapat singkat) tanpa menyentuh instrumen/analisis formal.',
      3: 'Cukup / Baik (7-8): Menjelaskan proses identifikasi melalui rapat kerja/FGD dan pencatatan risiko dengan penentuan level dampak dan upaya penanganan.',
      4: 'Sangat Lengkap (9-10): Menguraikan metodologi komprehensif: pelibatan tim kerja/UPR, penggunaan teknik analisis (FGD, data historis, root cause), pemetaan matriks selera risiko, serta perumusan opsi mitigasi terstruktur dalam Risk Register.'
    }
  },
  {
    id: 7,
    category: 'B',
    categoryTitle: 'Bagian B: Penerapan Manajemen Risiko',
    title: 'Bukti Pemanfaatan Dokumen Risiko dalam Pengambilan Keputusan',
    question: 'Apa bukti dari Dokumen Manajemen Risiko di lingkungan Satuan Kerja telah dijadikan bahan pertimbangan dalam membuat keputusan?',
    placeholder: 'Tuliskan jawaban Anda di sini...',
    bobotMax: 10,
    kisiKisi: `Bukti otentik integrasi manajemen risiko dalam tata kelola satker:\n• Adanya dokumen Piagam Manajemen Risiko & Dokumen Profil/Register Risiko Satker yang ditandatangani pimpinan unit.\n• Notula Rapat Evaluasi Kinerja/Pimpinan yang secara eksplisit membahas status risiko dan tindak lanjut mitigasi.\n• Penyesuaian perencanaan anggaran dalam Rencana Kerja Tahunan (RKT) atau revisi DIPA untuk mendanai mitigasi risiko prioritas.\n• Terbitnya Surat Keputusan (SK), SOP baru, atau edaran perbaikan tata kelola sebagai output mitigasi risiko.\n• Laporan Pemantauan Triwulanan/Semesteran Pengendalian Risiko yang dilaporkan ke Inspektorat Jenderal / UPR tingkat atas.`,
    rubrik: {
      1: 'Sangat Kurang (1-3): Tidak dapat menunjukkan bukti atau menyatakan dokumen hanya formalitas arsip tanpa pernah digunakan.',
      2: 'Kurang (4-6): Menyatakan dokumen digunakan tetapi bukti sangat abstrak tanpa menyebutkan wujud dokumen/notula/kebijakan nyata.',
      3: 'Cukup / Baik (7-8): Menyebutkan minimal 1-2 bukti konkret (misal: notula rapat pimpinan membahas risiko atau adanya dokumen risk register yang disahkan).',
      4: 'Sangat Lengkap (9-10): Menunjukkan bukti konkret dan beragam: keterkaitan profil risiko dengan DIPA/RKT anggaran, notula rapat pimpinan berkala, laporan monev triwulanan ke Inspektorat, dan penerbitan SOP penanganan mitigasi.'
    }
  }
];
