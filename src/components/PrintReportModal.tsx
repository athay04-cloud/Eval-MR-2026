import React from 'react';
import { X, Printer, Shield, CheckCircle2, XCircle } from 'lucide-react';
import { Respondent } from '../types';
import { QUESTIONS_DATA } from '../data/questions';
import { getMaturityCategory } from '../utils/scoring';

interface PrintReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  respondent: Respondent | null;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  onClose,
  respondent,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('allow-print');
    }
    return () => {
      document.body.classList.remove('allow-print');
    };
  }, [isOpen]);

  if (!isOpen || !respondent) return null;

  const evaluation = respondent.evaluation;
  const nilaiAkhir = evaluation ? evaluation.nilaiAkhir : 0;
  const skorPemahaman = evaluation ? evaluation.skorPemahaman : 0;
  const skorPenerapan = evaluation ? evaluation.skorPenerapan : 0;
  const maturity = getMaturityCategory(nilaiAkhir, skorPemahaman, skorPenerapan);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-start sm:items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 my-2 sm:my-6 print:my-0 print:border-none print:shadow-none print:w-full print:max-w-none flex flex-col">
        {/* Modal Controls Header (Hidden in Print) */}
        <div className="no-print px-4 sm:px-6 py-3 sm:py-4 bg-slate-900 text-white rounded-t-xl flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Printer className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-xs sm:text-sm truncate">
              Lembar Evaluasi & Penilaian Resmi
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF Dokumen</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT BODY (Fully responsive on screen + A4 print ready) */}
        <div className="p-4 sm:p-8 md:p-10 print:p-0 space-y-5 text-slate-900 print-container overflow-y-auto max-h-[85vh] print:max-h-none">
          {/* KOP RESMI PEMERINTAH */}
          <div className="border-b-2 border-slate-900 pb-3 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-1">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-slate-900 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-slate-900" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wide text-slate-900">
                  KEMENTERIAN HUKUM REPUBLIK INDONESIA
                </h2>
                <h3 className="text-[11px] sm:text-xs font-bold text-slate-800">
                  TIM EVALUASI DAN PENILAIAN MATURITAS MANAJEMEN RISIKO
                </h3>
                <p className="text-[9px] sm:text-[10px] text-slate-600 mt-0.5 leading-snug">
                  Jalan H.R. Rasuna Said Kav.6-7, Kuningan, Jakarta Selatan · Laman: itjen.kemenkum.go.id
                </p>
              </div>
            </div>
          </div>

          {/* DOKUMEN TITLE */}
          <div className="text-center py-1">
            <h1 className="text-sm sm:text-base md:text-lg font-black uppercase underline decoration-1 text-slate-900">
              LEMBAR EVALUASI DAN PENILAIAN INDIVIDUAL MANAJEMEN RISIKO
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-600 mt-0.5 font-mono">
              Nomor Berkas: BERKAS-MR/{respondent.id.toUpperCase()}
            </p>
          </div>

          {/* 1. DATA IDENTITAS RESPONDEN */}
          <div className="border border-slate-300 rounded-lg p-3 sm:p-4 bg-slate-50/50 print:bg-white text-xs">
            <div className="font-bold text-slate-900 text-[11px] sm:text-xs uppercase mb-2 border-b border-slate-200 pb-1">
              I. Identitas Pegawai Sampel & Satuan Kerja
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-500 block text-[10px] sm:text-xs">Nama Lengkap:</span>
                <span className="font-bold text-slate-900 break-words">{respondent.nama}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] sm:text-xs">Nomor Induk Pegawai (NIP):</span>
                <span className="font-mono font-bold text-slate-900 break-all">{respondent.nip}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] sm:text-xs">Jabatan:</span>
                <span className="font-semibold text-slate-800 break-words">{respondent.jabatan}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] sm:text-xs">Satuan Kerja:</span>
                <span className="font-semibold text-slate-800 break-words">{respondent.satker}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] sm:text-xs">Status Unit Pemilik Risiko:</span>
                <span className="font-bold text-slate-900">
                  {respondent.statusUpr === 'IYA' ? 'Unit Pemilik Risiko (UPR)' : 'Bukan UPR'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] sm:text-xs">Waktu Pengisian Survei:</span>
                <span className="font-medium text-slate-800">{respondent.timestamp}</span>
              </div>
              <div className="col-span-1 sm:col-span-2 print:col-span-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block text-[10px] sm:text-xs">Peran / Keterlibatan dalam Risiko:</span>
                <span className="text-slate-800 italic break-words">{respondent.keteranganUpr}</span>
              </div>
            </div>
          </div>

          {/* 2. REKAPITULASI SKOR & TINGKAT MATURITAS (Sesuai Pedoman Resmi 10 Bobot) */}
          <div className="border-2 border-slate-900 rounded-lg p-3 sm:p-4 bg-white text-xs">
            <div className="font-bold text-slate-900 uppercase mb-2 border-b border-slate-200 pb-1 text-[11px] sm:text-xs">
              II. Rekapitulasi Skor Penilaian Berdasarkan Pedoman Resmi
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 sm:gap-4 text-center divide-y sm:divide-y-0 sm:divide-x print:divide-x divide-slate-200">
              <div className="pt-1 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Skor Pemahaman (A: Soal 1-5)</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evaluation?.skorPemahaman || 0} / 50
                </div>
                <div className="text-[10px] mt-1 font-bold">
                  {evaluation && evaluation.skorPemahaman >= 30 ? (
                    <span className="text-emerald-700">✓ Cukup Memahami (≥30)</span>
                  ) : (
                    <span className="text-rose-700">✕ Kurang Memahami (&lt;30)</span>
                  )}
                </div>
              </div>

              <div className="pt-1 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Skor Penerapan (B: Soal 6-7)</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evaluation?.skorPenerapan || 0} / 20
                </div>
                <div className="text-[10px] mt-1 font-bold">
                  {evaluation && evaluation.skorPenerapan >= 12 ? (
                    <span className="text-emerald-700">✓ Mengetahui Penerapan (≥12)</span>
                  ) : (
                    <span className="text-rose-700">✕ Belum Mengetahui (&lt;12)</span>
                  )}
                </div>
              </div>

              <div className="pt-2 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Total Akumulasi Skor</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evaluation?.totalSkor || 0} / 70
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  7 Butir Soal × Bobot 10
                </div>
              </div>

              <div className="pt-2 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Nilai Akhir Indeks</div>
                <div className="text-base sm:text-xl font-black font-mono text-slate-900 mt-0.5">
                  {nilaiAkhir.toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  (Total / 70) × 100
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-bold text-slate-700">Tingkat Maturitas Pegawai: </span>
                <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-slate-900 text-white inline-block mt-1 sm:mt-0">
                  {maturity.badgeText}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                Skor 1 - 3 via Pemahaman (≥30) · Skor 4 - 5 via Penerapan (≥12)
              </div>
            </div>

            <div className="mt-2 text-[10px] sm:text-[11px] text-slate-600 bg-slate-50 p-2 sm:p-2.5 rounded border border-slate-200 leading-relaxed">
              <strong>Keterangan Hasil:</strong> {maturity.description}
            </div>
          </div>

          {/* 3. TABEL RINCIAN NILAI BUTIR SOAL 1-7 */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-[11px] sm:text-xs uppercase border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>III. Rincian Penilaian Jawaban Responden (Skala 1 - 10, Bobot 10)</span>
            </div>

            <div className="overflow-x-auto -mx-2 sm:mx-0 border border-slate-300 rounded-lg print:border-none print:overflow-visible">
              <table className="w-full min-w-[560px] sm:min-w-full text-left border-collapse text-xs print:table-fixed">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-700">
                    <th className="p-2 border-r border-slate-300 w-8 text-center print:w-[6%]">No</th>
                    <th className="p-2 border-r border-slate-300 w-64 sm:w-80 print:w-[46%]">Pertanyaan & Jawaban Responden</th>
                    <th className="p-2 border-r border-slate-300 w-20 text-center print:w-[14%]">Skor (1-10)</th>
                    <th className="p-2 print:w-[34%]">Catatan Evaluator & Analisis Kisi-Kisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {QUESTIONS_DATA.map((q) => {
                    const score = evaluation?.scores[q.id] || 0;
                    const itemNote = evaluation?.itemNotes?.[q.id];
                    const userAnswer = respondent.answers[q.id] || '-';

                    return (
                      <tr key={q.id} className="print-break-inside-avoid align-top">
                        <td className="p-2 border-r border-slate-300 text-center font-bold text-slate-700">
                          {q.id}
                        </td>
                        <td className="p-2 border-r border-slate-300 space-y-1 break-words">
                          <div className="font-semibold text-slate-900 text-[11px]">
                            {q.question}
                          </div>
                          <div className="p-1.5 bg-slate-50 print:bg-transparent rounded text-[10px] sm:text-[11px] text-slate-700 italic border border-slate-200 print:border-none print:p-0 whitespace-pre-line leading-relaxed">
                            &quot;{userAnswer}&quot;
                          </div>
                        </td>
                        <td className="p-2 border-r border-slate-300 text-center">
                          <div className="font-mono font-bold text-base text-slate-900">
                            {score > 0 ? score : '-'} <span className="text-[10px] font-normal text-slate-400">/ 10</span>
                          </div>
                          <div className="text-[9px] text-slate-500 font-medium mt-0.5">
                            {score >= 9 ? 'Sangat Lengkap' : score >= 7 ? 'Cukup / Baik' : score >= 4 ? 'Kurang' : 'Sangat Kurang'}
                          </div>
                        </td>
                        <td className="p-2 text-[10px] sm:text-[11px] text-slate-700 break-words leading-relaxed">
                          <div className="text-slate-800">
                            {score >= 9
                              ? q.rubrik[4]
                              : score >= 7
                              ? q.rubrik[3]
                              : score >= 4
                              ? q.rubrik[2]
                              : q.rubrik[1]}
                          </div>
                          {itemNote && (
                            <div className="mt-1.5 text-slate-700 bg-amber-50/80 p-1.5 rounded border border-amber-200/80 leading-snug text-[10px]">
                              <strong>Catatan Khusus:</strong> {itemNote}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. CATATAN UMUM DAN TANDA TANGAN */}
          <div className="border border-slate-300 rounded-lg p-3 sm:p-4 bg-white text-xs space-y-4 print-break-inside-avoid">
            <div>
              <div className="font-bold text-slate-900 uppercase mb-1 text-[11px] sm:text-xs">
                IV. Catatan Rekomendasi Evaluator
              </div>
              <p className="text-[11px] sm:text-xs text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-200 min-h-[48px] leading-relaxed">
                {evaluation?.catatanUmum || 'Tidak ada catatan umum tambahan.'}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-[10px] sm:text-xs text-slate-500">Responden Pegawai yang Dinilai,</p>
                <div className="h-14 sm:h-16 flex items-end justify-center">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm underline">
                    {respondent.nama}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] font-mono text-slate-600">NIP. {respondent.nip}</p>
              </div>

              <div>
                <p className="text-[10px] sm:text-xs text-slate-500">
                  Jakarta, {evaluation?.tanggalEvaluasi ? evaluation.tanggalEvaluasi.split(',')[0] : new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
                  <br />
                  Pejabat / Tim Penilai Manajemen Risiko,
                </p>
                <div className="h-14 sm:h-16 flex items-end justify-center">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm underline">
                    {evaluation?.evaluatorName || 'Drs. H. Hendra Wijaya, M.Si.'}
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] font-mono text-slate-600">
                  NIP. {evaluation?.evaluatorNip || '197508121998031001'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
