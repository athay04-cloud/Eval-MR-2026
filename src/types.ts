export type StatusUpr = 'IYA' | 'TIDAK';

export type StatusPenilaian = 'Belum Dinilai' | 'Sudah Dinilai';

export interface EvaluationResult {
  scores: Record<number, number>; // 1-7, values 1-4
  itemNotes?: Record<number, string>;
  skorPemahaman: number; // max 20
  skorPenerapan: number; // max 8
  totalSkor: number; // max 28
  nilaiAkhir: number; // 0-100 scale: (totalSkor / 28) * 100
  kategoriMaturitas: {
    level: 1 | 2 | 3 | 4;
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
  rubrik: {
    1: string;
    2: string;
    3: string;
    4: string;
  };
}
