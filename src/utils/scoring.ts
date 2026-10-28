import { EvaluationResult } from '../types';

export interface MaturityLevelInfo {
  level: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  colorClass: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export function getMaturityCategory(finalScore: number): MaturityLevelInfo {
  if (finalScore >= 85) {
    return {
      level: 4,
      title: 'Sangat Memahami',
      description: 'Tingkat kematangan tinggi (Managed & Measurable). Pegawai dan unit kerja memiliki kompetensi komprehensif, budaya sadar risiko telah terinternalisasi, dan pengelolaan risiko terintegrasi dalam seluruh siklus keputusan strategis.',
      colorClass: 'text-emerald-700',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      badgeText: 'Level 4 · Sangat Memahami',
      borderColor: 'border-emerald-300'
    };
  } else if (finalScore >= 70) {
    return {
      level: 3,
      title: 'Memahami',
      description: 'Tingkat kematangan memadai (Defined). Pegawai memahami konsep dasar dan regulasi risiko secara tepat, proses identifikasi dan mitigasi risiko telah dijalankan secara formal dan terdokumentasi dengan baik.',
      colorClass: 'text-blue-700',
      badgeBg: 'bg-blue-50 text-blue-800',
      badgeText: 'Level 3 · Memahami',
      borderColor: 'border-blue-300'
    };
  } else if (finalScore >= 55) {
    return {
      level: 2,
      title: 'Cukup / Kurang',
      description: 'Tingkat kematangan berkembang (Developing). Pegawai telah mengenal istilah risiko namun pemahaman proses dan implementasi di unit kerja masih parsial, reaktif, dan belum sepenuhnya terintegrasi ke dalam program kerja.',
      colorClass: 'text-amber-700',
      badgeBg: 'bg-amber-50 text-amber-800',
      badgeText: 'Level 2 · Cukup / Kurang',
      borderColor: 'border-amber-300'
    };
  } else {
    return {
      level: 1,
      title: 'Perlu Pembinaan',
      description: 'Tingkat kematangan awal (Initial / Ad-Hoc). Pemahaman konsep dasar dan regulasi manajemen risiko masih sangat minim. Diperlukan asistensi intensif, workshop terstruktur, dan pembinaan berkala oleh Tim Pembina/Inspektorat.',
      colorClass: 'text-rose-700',
      badgeBg: 'bg-rose-50 text-rose-800',
      badgeText: 'Level 1 · Perlu Pembinaan',
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
  let skorPemahaman = 0;
  for (let i = 1; i <= 5; i++) {
    skorPemahaman += scores[i] || 0;
  }

  let skorPenerapan = 0;
  for (let i = 6; i <= 7; i++) {
    skorPenerapan += scores[i] || 0;
  }

  const totalSkor = skorPemahaman + skorPenerapan;
  // Maximum possible score is 28 (7 questions * 4 max)
  const rawScore = (totalSkor / 28) * 100;
  const nilaiAkhir = Math.round(rawScore * 100) / 100;

  const matInfo = getMaturityCategory(nilaiAkhir);

  return {
    scores,
    itemNotes,
    skorPemahaman,
    skorPenerapan,
    totalSkor,
    nilaiAkhir,
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
