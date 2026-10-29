export type StatusUpr = 'IYA' | 'TIDAK';

export type StatusPenilaian = 'Belum Dinilai' | 'Sudah Dinilai';

export interface EvaluationResult {
  scores: Record<number, number>; // question 1-7, values 1-10
  itemNotes?: Record<number, string>;
  skorPemahaman: number; // max 50 (Soal 1-5, bobot 10)
  skorPenerapan: number; // max 20 (Soal 6-7, bobot 10)
  totalSkor: number; // max 70
  nilaiAkhir: number; // Skala 0 - 100: (totalSkor / 70) * 100
  isPemahamanCukup: boolean; // skorPemahaman >= 30
  isPenerapanMengetahui: boolean; // skorPenerapan >= 12
  statusPemahaman: 'Cukup Memahami' | 'Kurang Memahami';
  statusPenerapan: 'Mengetahui Penerapan MR' | 'Belum Mengetahui Penerapan MR';
  kategoriMaturitas: {
    level: 1 | 2 | 3 | 4 | 5;
    title: string;
    description: string;
  };
  catatanUmum: string;
  evaluatorName: string;
  evaluatorNip: string;
  tanggalEvaluasi: string;
}

export interface Respondent {
  id: string;
  timestamp: string; // ISO or formatted date
  nama: string;
  nip: string;
  jabatan: string;
  satker: string;
  statusUpr: StatusUpr;
  keteranganUpr: string;
  answers: Record<number, string>; // questions 1 to 7
  status: StatusPenilaian;
  evaluation?: EvaluationResult;
}

export interface QuestionDefinition {
  id: number;
  category: 'A' | 'B';
  categoryTitle: string;
  title: string;
  question: string;
  placeholder: string;
  kisiKisi: string;
  bobotMax: number; // 10
  rubrik: Record<number, string>;
}
