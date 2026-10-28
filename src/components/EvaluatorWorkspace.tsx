import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Printer, HelpCircle, Check, Sparkles } from 'lucide-react';
import { Respondent } from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { calculateEvaluation, getMaturityCategory } from '../utils/scoring';

interface EvaluatorWorkspaceProps {
  respondent: Respondent;
  onBack: () => void;
  onSaveEvaluation: (updatedRespondent: Respondent) => void;
  onPrintReport: (respondent: Respondent) => void;
}

export const EvaluatorWorkspace: React.FC<EvaluatorWorkspaceProps> = ({
  respondent,
  onBack,
  onSaveEvaluation,
  onPrintReport,
}) => {
  // Initialize scores: either existing evaluation scores or blank/default
  const [scores, setScores] = useState<Record<number, number>>(() => {
    if (respondent.evaluation?.scores) {
      return { ...respondent.evaluation.scores };
    }
    // Default to initial 0 or 3
    const initial: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) {
      initial[i] = 3; // sensible starting point for active assessment
    }
    return initial;
  });

  const [itemNotes, setItemNotes] = useState<Record<number, string>>(() => {
    return respondent.evaluation?.itemNotes ? { ...respondent.evaluation.itemNotes } : {};
  });

  const [catatanUmum, setCatatanUmum] = useState<string>(() => {
    return respondent.evaluation?.catatanUmum || '';
  });

  const [evaluatorName, setEvaluatorName] = useState<string>(() => {
    return respondent.evaluation?.evaluatorName || 'Drs. H. Hendra Wijaya, M.Si.';
  });

  const [evaluatorNip, setEvaluatorNip] = useState<string>(() => {
    return respondent.evaluation?.evaluatorNip || '197508121998031001';
  });

  const [saveSuccessNotification, setSaveSuccessNotification] = useState(false);

  // Real-time calculation
  const currentEvaluation = useMemo(() => {
    return calculateEvaluation(
      scores,
      catatanUmum,
      itemNotes,
      evaluatorName,
      evaluatorNip,
      respondent.evaluation?.tanggalEvaluasi || new Date().toISOString()
    );
  }, [scores, catatanUmum, itemNotes, evaluatorName, evaluatorNip, respondent.evaluation]);

  const maturityInfo = useMemo(() => {
    return getMaturityCategory(currentEvaluation.nilaiAkhir);
  }, [currentEvaluation.nilaiAkhir]);

  const handleScoreChange = (questionId: number, value: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleItemNoteChange = (questionId: number, value: string) => {
    setItemNotes((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSave = () => {
    const updated: Respondent = {
      ...respondent,
      status: 'Sudah Dinilai',
      evaluation: {
        ...currentEvaluation,
        tanggalEvaluasi: new Date().toLocaleString('id-ID', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      },
    };

    onSaveEvaluation(updated);
    setSaveSuccessNotification(true);
    setTimeout(() => {
      setSaveSuccessNotification(false);
    }, 3500);
  };

  const handleApplyPreset = (level: 1 | 2 | 3 | 4) => {
    const newScores: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) {
      newScores[i] = level;
    }
    setScores(newScores);
  };

  const questionsBagianA = QUESTIONS_DATA.filter((q) => q.category === 'A');
  const questionsBagianB = QUESTIONS_DATA.filter((q) => q.category === 'B');

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 px-3.5 py-2 rounded-lg transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Antrean</span>
        </button>

        <div className="flex items-center gap-2.5">
          {saveSuccessNotification && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nilai Berhasil Disimpan!</span>
            </span>
          )}

          <button
            onClick={() => onPrintReport({
              ...respondent,
              status: 'Sudah Dinilai',
              evaluation: currentEvaluation,
            })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak / Ekspor Lembar Kerja</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Simpan Hasil Penilaian</span>
          </button>
        </div>
      </div>

      {/* Respondent Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Lembar Kerja Penilaian Responden
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {respondent.nama}
            </h1>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              NIP: {respondent.nip} · Dikirim: {respondent.timestamp}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold ${
                respondent.statusUpr === 'IYA'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-800 border border-slate-300'
              }`}
            >
              Status: {respondent.statusUpr === 'IYA' ? 'Unit Pemilik Risiko (UPR)' : 'Bukan UPR'}
            </span>
            <span
              className={`px-3 py-1 rounded-md text-xs font-semibold ${
                respondent.status === 'Sudah Dinilai'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200'
              }`}
            >
              {respondent.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Jabatan:</span>
            <span className="font-semibold text-slate-800">{respondent.jabatan}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Satuan Kerja:</span>
            <span className="font-semibold text-slate-800">{respondent.satker}</span>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <span className="text-slate-400 block mb-0.5">Keterangan Peran/UPR:</span>
            <span className="text-slate-700 italic">{respondent.keteranganUpr}</span>
          </div>
        </div>
      </div>

      {/* STICKY LIVE SCORECARD BANNER */}
      <div className="sticky top-16 z-30 bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {/* Bagian A */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Skor Pemahaman (A)</div>
              <div className="mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-300">
                {currentEvaluation.skorPemahaman} <span className="text-xs text-slate-400 font-normal">/ 20</span>
              </div>
            </div>

            {/* Bagian B */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Skor Penerapan (B)</div>
              <div className="mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-300">
                {currentEvaluation.skorPenerapan} <span className="text-xs text-slate-400 font-normal">/ 8</span>
              </div>
            </div>

            {/* Total Poin */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Total Skor Diperoleh</div>
              <div className="mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
                {currentEvaluation.totalSkor} <span className="text-xs text-slate-400 font-normal">/ 28</span>
              </div>
            </div>

            {/* Nilai Akhir */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Nilai Akhir Indeks</div>
              <div className="mt-0.5 text-2xl font-black font-mono tabular-nums text-emerald-400">
                {currentEvaluation.nilaiAkhir.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Maturity Category Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-700 pt-3 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Kategori Maturitas Otomatis</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${maturityInfo.badgeBg}`}>
                  {maturityInfo.badgeText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <span className="text-[11px] text-slate-400 hidden xl:inline">Preset:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(4)}
                className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                title="Terapkan Nilai 4 ke semua soal"
              >
                Max 4
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(3)}
                className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                title="Terapkan Nilai 3 ke semua soal"
              >
                Baik 3
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION A: PEMAHAMAN (Soal 1 s/d 5) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Bagian A: Pemahaman Konseptual & Regulasi Risiko
            </h2>
            <p className="text-xs text-slate-500">
              5 Butir Pertanyaan · Bobot Skor Maksimal: 20 (Nilai 1–4 per butir)
            </p>
          </div>
        </div>

        {questionsBagianA.map((q) => (
          <EvaluationItemCard
            key={q.id}
            question={q}
            userAnswer={respondent.answers[q.id] || '(Tidak ada jawaban responden)'}
            selectedScore={scores[q.id] || 1}
            onSelectScore={(val) => handleScoreChange(q.id, val)}
            itemNote={itemNotes[q.id] || ''}
            onItemNoteChange={(val) => handleItemNoteChange(q.id, val)}
          />
        ))}
      </div>

      {/* SECTION B: PENERAPAN (Soal 6 s/d 7) */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Bagian B: Penerapan & Bukti Dokumen Pengambilan Keputusan
            </h2>
            <p className="text-xs text-slate-500">
              2 Butir Pertanyaan · Bobot Skor Maksimal: 8 (Nilai 1–4 per butir)
            </p>
          </div>
        </div>

        {questionsBagianB.map((q) => (
          <EvaluationItemCard
            key={q.id}
            question={q}
            userAnswer={respondent.answers[q.id] || '(Tidak ada jawaban responden)'}
            selectedScore={scores[q.id] || 1}
            onSelectScore={(val) => handleScoreChange(q.id, val)}
            itemNote={itemNotes[q.id] || ''}
            onItemNoteChange={(val) => handleItemNoteChange(q.id, val)}
          />
        ))}
      </div>

      {/* GENERAL EVALUATOR RECOMMENDATION & SIGNATURE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Catatan Rekomendasi & Identitas Evaluator
          </h3>
          <p className="text-xs text-slate-500">
            Kesimpulan evaluasi ini akan dicantumkan dalam lembar kerja resmi dan laporan pertanggungjawaban maturitas risiko.
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Catatan / Rekomendasi Umum Tim Evaluator
          </label>
          <textarea
            rows={3}
            value={catatanUmum}
            onChange={(e) => setCatatanUmum(e.target.value)}
            placeholder="Tuliskan analisis komprehensif atas kompetensi responden, area yang perlu diperbaiki, serta rekomendasi pembinaan/pelatihan lanjut bagi satker..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Pejabat / Tim Evaluator
            </label>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              NIP Evaluator
            </label>
            <input
              type="text"
              value={evaluatorNip}
              onChange={(e) => setEvaluatorNip(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Status Terkini:{' '}
            <strong className="text-slate-800">
              Nilai {currentEvaluation.nilaiAkhir.toFixed(2)} ({maturityInfo.title})
            </strong>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onBack}
              className="px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Kembali
            </button>
            <button
              onClick={handleSave}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Simpan & Perbarui Status Penilaian</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface EvaluationItemCardProps {
  question: typeof QUESTIONS_DATA[0];
  userAnswer: string;
  selectedScore: number;
  onSelectScore: (val: number) => void;
  itemNote: string;
  onItemNoteChange: (val: string) => void;
}

const EvaluationItemCard: React.FC<EvaluationItemCardProps> = ({
  question,
  userAnswer,
  selectedScore,
  onSelectScore,
  itemNote,
  onItemNoteChange,
}) => {
  const [showNoteField, setShowNoteField] = useState(Boolean(itemNote));

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Question Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">
            Soal {question.id}
          </span>
          <h3 className="text-sm font-bold text-slate-900">{question.title}</h3>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Nilai Dipilih: <span className="font-mono font-bold text-slate-900 text-sm">{selectedScore}</span> / 4
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Full Question Text */}
        <p className="text-xs font-semibold text-slate-800 italic">
          &quot;{question.question}&quot;
        </p>

        {/* Side-by-side or stacked: Jawaban Asli Responden vs Kisi-Kisi Jawaban Ideal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box Jawaban Asli Responden */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800">
                Jawaban Asli Responden
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {userAnswer.length} karakter
              </span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line flex-1">
              {userAnswer}
            </div>
          </div>

          {/* Box Kisi-Kisi Jawaban Ideal */}
          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200 flex flex-col">
            <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-amber-200/60 text-amber-900">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span className="text-xs font-bold">
                Kisi-Kisi Jawaban Ideal (Acuan Penilai)
              </span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-sans flex-1">
              {question.kisiKisi}
            </div>
          </div>
        </div>

        {/* Rubrik Penilaian Skala 1 - 4 */}
        <div className="pt-2 border-t border-slate-100">
          <div className="text-xs font-bold text-slate-800 mb-3 flex items-center justify-between">
            <span>Pilihan Nilai Rubrik (Skala 1 - 4):</span>
            <span className="text-[11px] text-slate-500 font-normal">
              Pilih salah satu sesuai kesesuaian jawaban dengan indikator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {[1, 2, 3, 4].map((level) => {
              const isSelected = selectedScore === level;
              const titleMap: Record<number, string> = {
                1: '1 = Sangat Kurang',
                2: '2 = Kurang',
                3: '3 = Baik / Cukup',
                4: '4 = Sangat Lengkap',
              };

              return (
                <label
                  key={level}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className={`text-xs font-bold ${
                          isSelected ? 'text-amber-300' : 'text-slate-900'
                        }`}
                      >
                        {titleMap[level]}
                      </span>
                      <input
                        type="radio"
                        name={`score-question-${question.id}`}
                        value={level}
                        checked={isSelected}
                        onChange={() => onSelectScore(level)}
                        className="text-slate-900 focus:ring-slate-900"
                      />
                    </div>
                    <p
                      className={`text-[11px] leading-relaxed line-clamp-4 ${
                        isSelected ? 'text-slate-200' : 'text-slate-500'
                      }`}
                    >
                      {question.rubrik[level as 1 | 2 | 3 | 4]}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Optional Evaluator Item Note */}
        <div className="pt-2">
          {!showNoteField ? (
            <button
              type="button"
              onClick={() => setShowNoteField(true)}
              className="text-[11px] text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
            >
              + Tambah Catatan Khusus untuk Butir Ini
            </button>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600">
                  Catatan Evaluator Butir Soal {question.id}:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    onItemNoteChange('');
                    setShowNoteField(false);
                  }}
                  className="text-[10px] text-slate-400 hover:text-rose-600 cursor-pointer"
                >
                  Hapus Catatan
                </button>
              </div>
              <input
                type="text"
                value={itemNote}
                onChange={(e) => onItemNoteChange(e.target.value)}
                placeholder="Contoh: Jawaban cukup tepat namun belum menyertakan nomor Permenkum yang spesifik..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
