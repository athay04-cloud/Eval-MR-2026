import React, { useState, useMemo } from 'react';
import { ArrowLeft, Save, Printer, HelpCircle, Check, Sparkles, Award, CheckCircle2, XCircle, Mail, Loader2 } from 'lucide-react';
import { Respondent } from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { calculateEvaluation, getMaturityCategory } from '../utils/scoring';
import { sendEvaluationSummaryEmail, TARGET_EMAIL } from '../utils/emailService';

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
  // Initialize scores: scale 1-10 (default 7 if not set)
  const [scores, setScores] = useState<Record<number, number>>(() => {
    if (respondent.evaluation?.scores) {
      return { ...respondent.evaluation.scores };
    }
    const initial: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) {
      initial[i] = 7; // standard starting point on 1-10 scale
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailNotification, setEmailNotification] = useState<string | null>(null);

  const handleSendEmailReport = async () => {
    setIsSendingEmail(true);
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

    const res = await sendEvaluationSummaryEmail(updated);
    setIsSendingEmail(false);
    setEmailNotification(res.message);
    setTimeout(() => {
      setEmailNotification(null);
    }, 4500);
  };

  // Real-time calculation using 1-10 scale and 30 / 12 thresholds
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
    return getMaturityCategory(
      currentEvaluation.nilaiAkhir,
      currentEvaluation.skorPemahaman,
      currentEvaluation.skorPenerapan
    );
  }, [currentEvaluation.nilaiAkhir, currentEvaluation.skorPemahaman, currentEvaluation.skorPenerapan]);

  const handleScoreChange = (questionId: number, value: number) => {
    const clamped = Math.max(1, Math.min(10, Math.round(value)));
    setScores((prev) => ({
      ...prev,
      [questionId]: clamped,
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

  const handleApplyPreset = (value: number) => {
    const newScores: Record<number, number> = {};
    for (let i = 1; i <= 7; i++) {
      newScores[i] = value;
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

        <div className="flex flex-wrap items-center gap-2">
          {saveSuccessNotification && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nilai Berhasil Disimpan!</span>
            </span>
          )}

          {emailNotification && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-800 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg animate-in fade-in">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span>{emailNotification}</span>
            </span>
          )}

          <button
            onClick={handleSendEmailReport}
            disabled={isSendingEmail}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
            title={`Kirim salinan laporan evaluasi ke ${TARGET_EMAIL}`}
          >
            {isSendingEmail ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
            ) : (
              <Mail className="w-3.5 h-3.5 text-amber-600" />
            )}
            <span>Email ke Evaluator</span>
          </button>

          <button
            onClick={() => onPrintReport({
              ...respondent,
              status: 'Sudah Dinilai',
              evaluation: currentEvaluation,
            })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak / PDF</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-amber-400" />
            <span>Simpan Nilai</span>
          </button>
        </div>
      </div>

      {/* Respondent Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Lembar Kerja Evaluasi Pegawai Sampel
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
              Status: {respondent.statusUpr === 'IYA' ? 'Unit Pemilik Risiko (UPR sesuai SK)' : 'Bukan UPR'}
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

      {/* METRIC STANDARDS NOTICE BANNER (Berdasarkan Pedoman Penilaian) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-950 space-y-2">
        <div className="flex items-center gap-2 font-bold text-amber-900">
          <Award className="w-4 h-4 text-amber-700" />
          <span>Ketentuan & Rumus Penilaian Resmi Manajemen Risiko:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
          <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200">
            <p className="font-bold text-slate-900 mb-1">1. Khusus Pemahaman Manajemen Risiko (Soal 1 s.d. 5):</p>
            <p className="text-slate-700">
              Masing-masing pertanyaan berbobot 10 (skala 1–10). Nilai akumulatif maksimal 50. Apabila bernilai <strong>≥ 30</strong> dikategorikan <strong>Cukup Memahami</strong>. Persentase sampel bernilai ≥ 30 menentukan capaian <strong>Skor 1 - 3</strong>.
            </p>
          </div>
          <div className="p-2.5 bg-white/80 rounded-lg border border-amber-200">
            <p className="font-bold text-slate-900 mb-1">2. Khusus Penerapan Manajemen Risiko (Soal 6 & 7):</p>
            <p className="text-slate-700">
              Masing-masing pertanyaan berbobot 10 (skala 1–10). Nilai akumulatif maksimal 20. Apabila bernilai <strong>≥ 12</strong> disimpulkan pegawai <strong>Mengetahui Penerapan Manajemen Risiko</strong>. Persentase sampel bernilai ≥ 12 menentukan capaian <strong>Skor 4 - 5</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* STICKY LIVE SCORECARD BANNER */}
      <div className="sticky top-16 z-30 bg-slate-900 text-white rounded-xl p-4 sm:p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {/* Bagian A Pemahaman */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Skor Pemahaman (A)</div>
              <div className="mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-300">
                {currentEvaluation.skorPemahaman} <span className="text-xs text-slate-400 font-normal">/ 50</span>
              </div>
              <div className="mt-1">
                {currentEvaluation.isPemahamanCukup ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Cukup Memahami (≥30)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/70 border border-rose-500/40 px-1.5 py-0.5 rounded">
                    <XCircle className="w-3 h-3" />
                    <span>Kurang Memahami (&lt;30)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Bagian B Penerapan */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Skor Penerapan (B)</div>
              <div className="mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-300">
                {currentEvaluation.skorPenerapan} <span className="text-xs text-slate-400 font-normal">/ 20</span>
              </div>
              <div className="mt-1">
                {currentEvaluation.isPenerapanMengetahui ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/40 px-1.5 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mengetahui Penerapan (≥12)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/70 border border-rose-500/40 px-1.5 py-0.5 rounded">
                    <XCircle className="w-3 h-3" />
                    <span>Belum Mengetahui (&lt;12)</span>
                  </span>
                )}
              </div>
            </div>

            {/* Total Poin */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Total Akumulasi Skor</div>
              <div className="mt-0.5 text-lg sm:text-xl font-bold font-mono tabular-nums text-white">
                {currentEvaluation.totalSkor} <span className="text-xs text-slate-400 font-normal">/ 70</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Maksimal 7 butir × 10
              </div>
            </div>

            {/* Nilai Akhir Indeks */}
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Nilai Akhir Indeks</div>
              <div className="mt-0.5 text-2xl font-black font-mono tabular-nums text-emerald-400">
                {currentEvaluation.nilaiAkhir.toFixed(2)} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
              <div className="mt-1 text-[10px] text-slate-400">
                Skor Relatif Keseluruhan
              </div>
            </div>
          </div>

          {/* Maturity Category Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-700 pt-3 lg:pt-0 lg:pl-6">
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Tingkat Maturitas Pegawai</div>
              <div className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${maturityInfo.badgeBg}`}>
                  {maturityInfo.badgeText}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
              <span className="text-[11px] text-slate-400 hidden xl:inline">Preset:</span>
              <button
                type="button"
                onClick={() => handleApplyPreset(10)}
                className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                title="Terapkan Skor 10 ke semua butir soal"
              >
                Semua 10
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(8)}
                className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                title="Terapkan Skor 8 ke semua butir soal"
              >
                Semua 8
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(5)}
                className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer"
                title="Terapkan Skor 5 ke semua butir soal"
              >
                Semua 5
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION A: PEMAHAMAN (Soal 1 s/d 5) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Khusus Pemahaman Manajemen Risiko (Soal 1 s.d. 5)
            </h2>
            <p className="text-xs text-slate-500">
              5 Butir Pertanyaan · Masing-masing berbobot 10 (Skor Maksimal: 50) · <strong>Ambang batas Cukup Memahami ≥ 30</strong>
            </p>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 border border-slate-200 w-fit">
            Subtotal Pemahaman: <strong className="text-slate-900 font-mono">{currentEvaluation.skorPemahaman}</strong> / 50
          </div>
        </div>

        {questionsBagianA.map((q) => (
          <EvaluationItemCard
            key={q.id}
            question={q}
            userAnswer={respondent.answers[q.id] || '(Tidak ada jawaban responden)'}
            selectedScore={scores[q.id] || 7}
            onSelectScore={(val) => handleScoreChange(q.id, val)}
            itemNote={itemNotes[q.id] || ''}
            onItemNoteChange={(val) => handleItemNoteChange(q.id, val)}
          />
        ))}
      </div>

      {/* SECTION B: PENERAPAN (Soal 6 s/d 7) */}
      <div className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Khusus Penerapan Manajemen Risiko (Soal 6 & 7)
            </h2>
            <p className="text-xs text-slate-500">
              2 Butir Pertanyaan · Masing-masing berbobot 10 (Skor Maksimal: 20) · <strong>Ambang batas Mengetahui Penerapan ≥ 12</strong>
            </p>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 border border-slate-200 w-fit">
            Subtotal Penerapan: <strong className="text-slate-900 font-mono">{currentEvaluation.skorPenerapan}</strong> / 20
          </div>
        </div>

        {questionsBagianB.map((q) => (
          <EvaluationItemCard
            key={q.id}
            question={q}
            userAnswer={respondent.answers[q.id] || '(Tidak ada jawaban responden)'}
            selectedScore={scores[q.id] || 7}
            onSelectScore={(val) => handleScoreChange(q.id, val)}
            itemNote={itemNotes[q.id] || ''}
            onItemNoteChange={(val) => handleItemNoteChange(q.id, val)}
          />
        ))}
      </div>

      {/* Evaluator Notes & Sign-off Section */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
          Catatan & Pengesahan Hasil Evaluasi
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Catatan Rekomendasi / Evaluasi Umum untuk Satuan Kerja & Responden
          </label>
          <textarea
            rows={3}
            value={catatanUmum}
            onChange={(e) => setCatatanUmum(e.target.value)}
            placeholder="Tuliskan evaluasi komprehensif, catatan kekuatan pemahaman, kelemahan penerapan, atau rekomendasi workshop/asistensi..."
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
            Hasil Penilaian:{' '}
            <strong className="text-slate-800">
              Skor Total {currentEvaluation.totalSkor}/70 ({currentEvaluation.nilaiAkhir.toFixed(2)}%) · {maturityInfo.title}
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

  // Determine qualitative label for current score on 1-10 scale
  const getScoreBadge = (val: number) => {
    if (val >= 9) return { label: 'Sangat Lengkap', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' };
    if (val >= 7) return { label: 'Cukup / Baik', color: 'bg-blue-50 text-blue-800 border-blue-300' };
    if (val >= 4) return { label: 'Kurang', color: 'bg-amber-50 text-amber-800 border-amber-300' };
    return { label: 'Sangat Kurang', color: 'bg-rose-50 text-rose-800 border-rose-300' };
  };

  const badge = getScoreBadge(selectedScore);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Question Header */}
      <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">
            Soal {question.id}
          </span>
          <h3 className="text-sm font-bold text-slate-900">{question.title}</h3>
          <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
            Bobot Maks: 10
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${badge.color}`}>
            {badge.label}
          </span>
          <span className="text-slate-500 font-medium">
            Nilai: <strong className="font-mono text-slate-900 text-sm">{selectedScore}</strong> / 10
          </span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Full Question Text */}
        <p className="text-xs font-semibold text-slate-800 italic">
          &quot;{question.question}&quot;
        </p>

        {/* Side-by-side: Jawaban Asli Responden vs Kisi-Kisi Jawaban Ideal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box Jawaban Asli Responden */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Jawaban Responden (Pegawai Sampel):</span>
            </div>
            <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans bg-white p-3 rounded border border-slate-200 min-h-[90px]">
              {userAnswer}
            </div>
          </div>

          {/* Box Kisi-Kisi Jawaban Ideal */}
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-lg">
            <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Kisi-Kisi Jawaban Ideal & Indikator Utama:</span>
            </div>
            <div className="text-xs text-amber-950 leading-relaxed whitespace-pre-wrap font-sans bg-white/80 p-3 rounded border border-amber-200 min-h-[90px]">
              {question.kisiKisi}
            </div>
          </div>
        </div>

        {/* 1 - 10 Score Selector */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-800">
            <span>Pemberian Nilai Objektif Evaluator (Skala 1 - 10):</span>
            <span className="text-[11px] text-slate-500 font-normal">
              Pilih nilai 1 sampai 10 sesuai kedalaman jawaban dengan indikator
            </span>
          </div>

          {/* 1 to 10 Button Bar */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
              const isSelected = selectedScore === num;
              let activeColor = 'bg-slate-900 text-white border-slate-900';
              let badgeText = `${num}`;

              if (num >= 9) {
                activeColor = 'bg-emerald-700 text-white border-emerald-700 ring-2 ring-emerald-400';
              } else if (num >= 7) {
                activeColor = 'bg-blue-700 text-white border-blue-700 ring-2 ring-blue-400';
              } else if (num >= 4) {
                activeColor = 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-300';
              } else {
                activeColor = 'bg-rose-700 text-white border-rose-700 ring-2 ring-rose-300';
              }

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onSelectScore(num)}
                  className={`py-2 px-1 text-xs font-mono font-bold rounded-lg border transition-all text-center cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? `${activeColor} shadow-sm scale-105`
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                  title={`Berikan Skor ${num} / 10`}
                >
                  <span className="text-sm">{badgeText}</span>
                  <span className="text-[9px] font-sans font-normal opacity-75">
                    {num >= 9 ? 'Sgt Baik' : num >= 7 ? 'Cukup' : num >= 4 ? 'Kurang' : 'Sgt Krg'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Selected Rubric Explanation Spotlight */}
          {(() => {
            const activeRubricText =
              selectedScore >= 9
                ? question.rubrik[4]
                : selectedScore >= 7
                ? question.rubrik[3]
                : selectedScore >= 4
                ? question.rubrik[2]
                : question.rubrik[1];

            const activeStyle =
              selectedScore >= 9
                ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                : selectedScore >= 7
                ? 'bg-blue-50/90 border-blue-300 text-blue-950'
                : selectedScore >= 4
                ? 'bg-amber-50/90 border-amber-300 text-amber-950'
                : 'bg-rose-50/90 border-rose-300 text-rose-950';

            const activeBadgeStyle =
              selectedScore >= 9
                ? 'bg-emerald-700 text-white'
                : selectedScore >= 7
                ? 'bg-blue-700 text-white'
                : selectedScore >= 4
                ? 'bg-amber-700 text-white'
                : 'bg-rose-700 text-white';

            return (
              <div className={`p-3.5 rounded-lg border shadow-xs transition-all ${activeStyle}`}>
                <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${activeBadgeStyle}`}>
                      Skor {selectedScore} / 10
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Uraian Rubrik Nilai Terpilih ({badge.label})
                    </span>
                  </div>
                  <span className="text-[11px] font-medium opacity-85">
                    Kriteria Objektif Butir Soal {question.id}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed whitespace-normal break-words font-sans font-medium">
                  {activeRubricText}
                </p>
              </div>
            );
          })()}

          {/* Rubric Guide Interval Details (Semua Kategori Teks Utuh Tanpa Terpotong) */}
          <div className="space-y-2 pt-1">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span>Panduan Seluruh Rentang Skor (Skala 1 - 10):</span>
              <span className="text-[10px] text-slate-500 font-normal">Teks lengkap tidak terpotong</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
              <div
                className={`p-3 rounded-lg border transition-all ${
                  selectedScore <= 3
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-300 text-rose-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <strong className="text-[11px] text-rose-900 block font-bold">
                    Skor 1 - 3 (Sangat Kurang)
                  </strong>
                  {selectedScore <= 3 && (
                    <span className="text-[9px] bg-rose-700 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed whitespace-normal break-words">
                  {question.rubrik[1]}
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border transition-all ${
                  selectedScore >= 4 && selectedScore <= 6
                    ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-300 text-amber-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <strong className="text-[11px] text-amber-900 block font-bold">
                    Skor 4 - 6 (Kurang)
                  </strong>
                  {selectedScore >= 4 && selectedScore <= 6 && (
                    <span className="text-[9px] bg-amber-700 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed whitespace-normal break-words">
                  {question.rubrik[2]}
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border transition-all ${
                  selectedScore >= 7 && selectedScore <= 8
                    ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-300 text-blue-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <strong className="text-[11px] text-blue-900 block font-bold">
                    Skor 7 - 8 (Cukup / Baik)
                  </strong>
                  {selectedScore >= 7 && selectedScore <= 8 && (
                    <span className="text-[9px] bg-blue-700 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed whitespace-normal break-words">
                  {question.rubrik[3]}
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border transition-all ${
                  selectedScore >= 9
                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-300 text-emerald-950 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <strong className="text-[11px] text-emerald-900 block font-bold">
                    Skor 9 - 10 (Sangat Lengkap)
                  </strong>
                  {selectedScore >= 9 && (
                    <span className="text-[9px] bg-emerald-700 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] sm:text-xs leading-relaxed whitespace-normal break-words">
                  {question.rubrik[4]}
                </p>
              </div>
            </div>
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
                placeholder="Contoh: Penjelasan tahapan sudah tepat namun belum menyertakan pemantauan berkala..."
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-slate-900 focus:bg-white"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
