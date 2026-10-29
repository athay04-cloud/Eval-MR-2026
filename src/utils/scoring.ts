import { EvaluationResult, Respondent } from '../types';

export interface MaturityLevelInfo {
  level: 1 | 2 | 3 | 4 | 5;
  title: string;
  description: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export interface SatkerMaturitySummary {
  totalSample: number;
  evaluatedSample: number;
  pemahamanCukupCount: number; // skor >= 30
  pemahamanCukupPercent: number; // % pegawai >= 30
  penerapanMengetahuiCount: number; // skor >= 12
  penerapanMengetahuiPercent: number; // % pegawai >= 12
  skorMaturitasTingkat: 1 | 2 | 3 | 4 | 5;
  predikatTingkat: string;
  keterangan: string;
}

export function getMaturityCategory(
  finalScore: number,
  skorPemahaman: number = 0,
  skorPenerapan: number = 0
): MaturityLevelInfo {
  // If specific section scores are provided, use the official threshold criteria
  if (skorPemahaman > 0 || skorPenerapan > 0) {
    if (skorPemahaman >= 30 && skorPenerapan >= 16) {
      return {
        level: 5,
        title: 'Optimum (Sangat Memahami & Menerapkan Terpadu)',
        description: 'Tingkat kematangan optimum (Continuous Improvement). Pegawai sangat memahami konsep dan regulasi (≥30), serta secara aktif dan konsisten menerapkan mitigasi risiko dalam pengambilan keputusan strategis (≥16/20).',
        colorClass: 'text-emerald-700',
        badgeBg: 'bg-emerald-50 text-emerald-800',
        badgeText: 'Skor 5 · Optimum',
        borderColor: 'border-emerald-300'
      };
    } else if (skorPemahaman >= 30 && skorPenerapan >= 12) {
      return {
        level: 4,
        title: 'Terkelola (Mengetahui Penerapan MR)',
        description: 'Tingkat kematangan terkelola (Managed). Pegawai cukup memahami (≥30) dan terbukti mengetahui serta menjalankan penerapan manajemen risiko (≥12/20) pada unit kerjanya.',
        colorClass: 'text-blue-700',
        badgeBg: 'bg-blue-50 text-blue-800',
        badgeText: 'Skor 4 · Mengetahui Penerapan',
        borderColor: 'border-blue-300'
      };
    } else if (skorPemahaman >= 30) {
      return {
        level: 3,
        title: 'Terdefinisi (Cukup Memahami)',
        description: 'Tingkat kematangan terdefinisi (Defined). Pegawai memenuhi kriteria cukup memahami manajemen risiko (akumulatif skor ≥30/50), namun bukti penerapan operasional masih perlu ditingkatkan (<12).',
        colorClass: 'text-cyan-700',
        badgeBg: 'bg-cyan-50 text-cyan-800',
        badgeText: 'Skor 3 · Cukup Memahami',
        borderColor: 'border-cyan-300'
      };
    } else if (skorPemahaman >= 20) {
      return {
        level: 2,
        title: 'Berkembang (Kurang Memahami)',
        description: 'Tingkat kematangan berkembang (Developing). Pemahaman konsep risiko masih parsial dan belum mencapai batas ambang pemahaman (skor pemahaman <30/50). Diperlukan sosialisasi berkala.',
        colorClass: 'text-amber-700',
        badgeBg: 'bg-amber-50 text-amber-800',
        badgeText: 'Skor 2 · Berkembang',
        borderColor: 'border-amber-300'
      };
    } else {
      return {
        level: 1,
        title: 'Rintisan (Perlu Pembinaan)',
        description: 'Tingkat kematangan rintisan/awal (Initial). Pemahaman dan penerapan manajemen risiko masih sangat minim (<20). Sangat membutuhkan pendampingan teknis dan workshop intensif.',
        colorClass: 'text-rose-700',
        badgeBg: 'bg-rose-50 text-rose-800',
        badgeText: 'Skor 1 · Perlu Pembinaan',
        borderColor: 'border-rose-300'
      };
    }
  }

  // Fallback purely based on percentage final score (0-100)
  if (finalScore >= 85) {
    return {
      level: 5,
      title: 'Optimum (Sangat Memahami & Menerapkan Terpadu)',
      description: 'Budaya sadar risiko terintegrasi penuh dalam seluruh siklus keputusan strategis dan operasional satker.',
      colorClass: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      badgeText: 'Skor 5 · Optimum',
      borderColor: 'border-emerald-300'
    };
  } else if (finalScore >= 70) {
    return {
      level: 4,
      title: 'Terkelola (Mengetahui Penerapan MR)',
      description: 'Pegawai cukup memahami konsep dasar dan mengetahui proses penerapan formal di unit kerja.',
      colorClass: 'text-blue-700',
      badgeBg: 'bg-blue-50 text-blue-800',
      badgeText: 'Skor 4 · Mengetahui Penerapan',
      borderColor: 'border-blue-300'
    };
  } else if (finalScore >= 55) {
    return {
      level: 3,
      title: 'Terdefinisi (Cukup Memahami)',
      description: 'Pegawai memenuhi kualifikasi pemahaman dasar risiko namun implementasi masih bertahap.',
      colorClass: 'text-cyan-700',
      badgeBg: 'bg-cyan-50 text-cyan-800',
      badgeText: 'Skor 3 · Cukup Memahami',
      borderColor: 'border-cyan-300'
    };
  } else if (finalScore >= 40) {
    return {
      level: 2,
      title: 'Berkembang (Kurang Memahami)',
      description: 'Pengenalan istilah risiko telah ada namun pemahaman tata kelola formal masih terbatas.',
      colorClass: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800',
      badgeText: 'Skor 2 · Berkembang',
      borderColor: 'border-amber-300'
    };
  } else {
    return {
      level: 1,
      title: 'Rintisan (Perlu Pembinaan)',
      description: 'Pemahaman konsep dasar dan regulasi manajemen risiko masih sangat minim, perlu pembinaan awal.',
      colorClass: 'text-rose-700',
      badgeBg: 'bg-rose-50 text-rose-800',
      badgeText: 'Skor 1 · Perlu Pembinaan',
      borderColor: 'border-rose-300'
    };
  }
}

export function calculateEvaluation(
  scores: Record<number, number>,
  catatanUmum: string = '',
  itemNotes: Record<number, string> = {},
  evaluatorName: string = 'Tim Evaluator Manajemen Risiko',
  evaluatorNip: string = '197905182005011001',
  tanggalEvaluasi: string = new Date().toISOString()
): EvaluationResult {
  // Domain 1: Pemahaman Manajemen Risiko (Soal 1 s.d. 5, masing-masing bobot 10 -> Max 50)
  let skorPemahaman = 0;
  for (let i = 1; i <= 5; i++) {
    skorPemahaman += Number(scores[i] || 0);
  }

  // Domain 2: Penerapan Manajemen Risiko (Soal 6 & 7, masing-masing bobot 10 -> Max 20)
  let skorPenerapan = 0;
  for (let i = 6; i <= 7; i++) {
    skorPenerapan += Number(scores[i] || 0);
  }

  const totalSkor = skorPemahaman + skorPenerapan; // Max 70
  const rawPercentage = (totalSkor / 70) * 100;
  const nilaiAkhir = Math.round(rawPercentage * 100) / 100;

  // Evaluator criteria according to official guidelines:
  // - Pemahaman: >= 30 dinyatakan Cukup Memahami
  // - Penerapan: >= 12 dinyatakan Mengetahui Penerapan Manajemen Risiko
  const isPemahamanCukup = skorPemahaman >= 30;
  const isPenerapanMengetahui = skorPenerapan >= 12;

  const statusPemahaman = isPemahamanCukup ? 'Cukup Memahami' : 'Kurang Memahami';
  const statusPenerapan = isPenerapanMengetahui ? 'Mengetahui Penerapan MR' : 'Belum Mengetahui Penerapan MR';

  const matInfo = getMaturityCategory(nilaiAkhir, skorPemahaman, skorPenerapan);

  return {
    scores,
    itemNotes,
    skorPemahaman,
    skorPenerapan,
    totalSkor,
    nilaiAkhir,
    isPemahamanCukup,
    isPenerapanMengetahui,
    statusPemahaman,
    statusPenerapan,
    kategoriMaturitas: {
      level: matInfo.level,
      title: matInfo.title,
      description: matInfo.description,
    },
    catatanUmum,
    evaluatorName,
    evaluatorNip,
    tanggalEvaluasi,
  };
}

/**
 * Menghitung rekapitulasi maturitas agregat sampel pegawai satuan kerja
 * berdasarkan aturan:
 * - Skor 1 - 3 diperoleh apabila jumlah persentase pegawai yang mendapatkan scoring >= 30 (Pemahaman)
 * - Skor 4 - 5 diperoleh apabila jumlah persentase pegawai yang mendapatkan scoring >= 12 (Penerapan)
 */
export function calculateSatkerMaturity(respondents: Respondent[]): SatkerMaturitySummary {
  const totalSample = respondents.length;
  const evaluatedList = respondents.filter((r) => r.status === 'Sudah Dinilai' && r.evaluation);
  const evaluatedSample = evaluatedList.length;

  if (evaluatedSample === 0) {
    return {
      totalSample,
      evaluatedSample: 0,
      pemahamanCukupCount: 0,
      pemahamanCukupPercent: 0,
      penerapanMengetahuiCount: 0,
      penerapanMengetahuiPercent: 0,
      skorMaturitasTingkat: 1,
      predikatTingkat: 'Belum Dinilai',
      keterangan: 'Belum ada responden sampel pegawai yang telah selesai dinilai oleh evaluator.',
    };
  }

  const pemahamanCukupCount = evaluatedList.filter(
    (r) => r.evaluation && r.evaluation.skorPemahaman >= 30
  ).length;

  const penerapanMengetahuiCount = evaluatedList.filter(
    (r) => r.evaluation && r.evaluation.skorPenerapan >= 12
  ).length;

  const pemahamanCukupPercent = Math.round((pemahamanCukupCount / evaluatedSample) * 1000) / 10;
  const penerapanMengetahuiPercent = Math.round((penerapanMengetahuiCount / evaluatedSample) * 1000) / 10;

  let skorMaturitasTingkat: 1 | 2 | 3 | 4 | 5 = 1;
  let predikatTingkat = 'Skor 1 - Perlu Pembinaan';
  let keterangan = '';

  // Logika: Skor 1 - 3 dinilai dari persentase pemahaman >= 30
  // Skor 4 - 5 dinilai jika persentase pemahaman tercapai dan persentase penerapan >= 12 tercapai
  if (pemahamanCukupPercent < 50) {
    skorMaturitasTingkat = 1;
    predikatTingkat = 'Skor 1 · Rintisan';
    keterangan = `Hanya ${pemahamanCukupPercent}% pegawai sampel yang mencapai skor Pemahaman ≥30 (Target minimal 50% untuk naik ke Skor 2).`;
  } else if (pemahamanCukupPercent < 80) {
    skorMaturitasTingkat = 2;
    predikatTingkat = 'Skor 2 · Berkembang';
    keterangan = `${pemahamanCukupPercent}% pegawai sampel telah mencapai skor Pemahaman ≥30 (Cukup). Target minimal 80% untuk mencapai Skor 3.`;
  } else {
    // Pemahaman >= 80% -> Memenuhi syarat Skor 3, kini evaluasi Skor 4 - 5 berdasarkan Penerapan (>= 12)
    if (penerapanMengetahuiPercent >= 80) {
      skorMaturitasTingkat = 5;
      predikatTingkat = 'Skor 5 · Optimum';
      keterangan = `Sangat Baik: ${pemahamanCukupPercent}% pegawai memahami MR (≥30) dan ${penerapanMengetahuiPercent}% mengetahui serta menerapkan MR secara aktif (≥12).`;
    } else if (penerapanMengetahuiPercent >= 50) {
      skorMaturitasTingkat = 4;
      predikatTingkat = 'Skor 4 · Terkelola (Mengetahui Penerapan)';
      keterangan = `Baik: ${pemahamanCukupPercent}% pegawai memahami MR (≥30) dan ${penerapanMengetahuiPercent}% pegawai mengetahui penerapan MR (≥12).`;
    } else {
      skorMaturitasTingkat = 3;
      predikatTingkat = 'Skor 3 · Terdefinisi (Cukup Memahami)';
      keterangan = `${pemahamanCukupPercent}% pegawai telah mencapai skor Pemahaman ≥30. Namun baru ${penerapanMengetahuiPercent}% yang mencapai skor Penerapan ≥12 (Dibutuhkan ≥50% untuk naik ke Skor 4).`;
    }
  }

  return {
    totalSample,
    evaluatedSample,
    pemahamanCukupCount,
    pemahamanCukupPercent,
    penerapanMengetahuiCount,
    penerapanMengetahuiPercent,
    skorMaturitasTingkat,
    predikatTingkat,
    keterangan,
  };
}
