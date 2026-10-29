import React from 'react';
import { X, Printer, Shield } from 'lucide-react';
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
  if (!isOpen || !respondent) return null;

  const evaluation = respondent.evaluation;
  const nilaiAkhir = evaluation ? evaluation.nilaiAkhir : 0;
  const maturity = getMaturityCategory(nilaiAkhir);

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
              Lembar Kerja Evaluasi Resmi
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
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
                <p className="text-[9px] sm:text-[10px] text-slate-500">
                  Gedung Sentra Mulia, Jl. H.R. Rasuna Said Kav. X-6, Kuningan, Jakarta Selatan
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

          {/* 1. DATA IDENTITAS RESPONDEN (Responsive grid) */}
          <div className="border border-slate-300 rounded-lg p-3 sm:p-4 bg-slate-50/50 print:bg-white text-xs">
            <div className="font-bold text-slate-900 text-[11px] sm:text-xs uppercase mb-2 border-b border-slate-200 pb-1">
              I. Identitas Pegawai & Satuan Kerja
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

          {/* 2. REKAPITULASI SKOR & TINGKAT MATURITAS (Responsive 2x2 on mobile, 4 columns on PC/print) */}
          <div className="border-2 border-slate-900 rounded-lg p-3 sm:p-4 bg-white text-xs">
            <div className="font-bold text-slate-900 uppercase mb-2 border-b border-slate-200 pb-1 text-[11px] sm:text-xs">
              II. Rekapitulasi Skor & Hasil Penilaian Maturitas
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 print:grid-cols-4 gap-3 sm:gap-4 text-center divide-y sm:divide-y-0 sm:divide-x print:divide-x divide-slate-200">
              <div className="pt-1 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Skor Pemahaman (A)</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evaluation?.skorPemahaman || 0} / 20
                </div>
              </div>
              <div className="pt-1 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Skor Penerapan (B)</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evaluation?.skorPenerapan || 0} / 8
                </div>
              </div>
              <div className="pt-2 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Total Skor Rubrik</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 mt-0.5">
                  {evaluation?.totalSkor || 0} / 28
                </div>
              </div>
              <div className="pt-2 sm:pt-0">
                <div className="text-[10px] sm:text-[11px] text-slate-500">Nilai Akhir Indeks</div>
                <div className="text-base sm:text-xl font-black font-mono text-slate-900 mt-0.5">
                  {nilaiAkhir.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-bold text-slate-700">Kategori Tingkat Maturitas: </span>
                <span className="px-2 py-0.5 rounded font-bold text-xs bg-slate-900 text-white inline-block mt-1 sm:mt-0">
                  {maturity.badgeText}
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500">
                Formula: (Total Skor Diperoleh / 28) × 100
              </div>
            </div>

            <div className="mt-2 text-[10px] sm:text-[11px] text-slate-600 bg-slate-50 p-2 sm:p-2.5 rounded border border-slate-200 leading-relaxed">
              <strong>Keterangan Hasil:</strong> {maturity.description}
            </div>
          </div>

          {/* 3. TABEL RINCIAN NILAI BUTIR SOAL 1-7 (Responsive horizontal scroll container on screen + pristine A4 print table) */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-[11px] sm:text-xs uppercase border-b border-slate-200 pb-1 flex items-center justify-between">
              <span>III. Rincian Penilaian Jawaban Responden (7 Butir Soal)</span>
              <span className="no-print text-[10px] text-slate-400 font-normal sm:hidden">
                (Geser ke samping jika tabel terpotong di HP)
              </span>
            </div>

            <div className="overflow-x-auto -mx-2 sm:mx-0 border border-slate-300 rounded-lg print:border-none print:overflow-visible">
              <table className="w-full min-w-[560px] sm:min-w-full text-left border-collapse text-xs print:table-fixed">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-700">
                    <th className="p-2 border-r border-slate-300 w-8 text-center print:w-[6%]">No</th>
                    <th className="p-2 border-r border-slate-300 w-64 sm:w-80 print:w-[46%]">Pertanyaan & Jawaban Responden</th>
                    <th className="p-2 border-r border-slate-300 w-16 text-center print:w-[12%]">Skor (1-4)</th>
                    <th className="p-2 print:w-[36%]">Catatan Evaluator & Analisis Rubrik</th>
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
                        <td className="p-2 border-r border-slate-300 text-center font-mono font-bold text-sm text-slate-900">
                          {score > 0 ? score : '-'}
                        </td>
                        <td className="p-2 text-[10px] sm:text-[11px] text-slate-700 break-words">
                          <div className="font-medium text-slate-900 leading-snug">
                            {score > 0 ? q.rubrik[score as 1 | 2 | 3 | 4] : 'Belum dinilai'}
                          </div>
                          {itemNote && (
                            <div className="mt-1 text-slate-600 bg-amber-50/60 p-1.5 rounded border border-amber-200/60 leading-snug">
                              <strong>Catatan:</strong> {itemNote}
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

          {/* 4. CATATAN & REKOMENDASI UMUM */}
          <div className="border border-slate-300 rounded-lg p-3 sm:p-4 bg-white text-xs print-break-inside-avoid">
            <div className="font-bold text-slate-900 uppercase mb-1.5 text-[11px] sm:text-xs">
              IV. Catatan / Rekomendasi Umum Tim Evaluator
            </div>
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-[11px] sm:text-xs break-words">
              {evaluation?.catatanUmum ||
                'Responden telah menyelesaikan seluruh instrumen survei manajemen risiko. Rekomendasi tindak lanjut agar dikoordinasikan bersama koordinator UPR Satuan Kerja untuk penguatan implementasi register risiko.'}
            </p>
          </div>

          {/* 5. TANDA TANGAN LEGALITAS (Responsive 2-column or stacked on very small mobile) */}
          <div className="pt-4 grid grid-cols-2 gap-4 sm:gap-8 text-xs text-center print-break-inside-avoid">
            <div>
              <p className="text-slate-600 text-[10px] sm:text-xs">Mengetahui Responden,</p>
              <div className="h-12 sm:h-16"></div>
              <p className="font-bold text-slate-900 underline text-[11px] sm:text-xs break-words">{respondent.nama}</p>
              <p className="text-slate-600 font-mono text-[9px] sm:text-[11px] break-all">NIP. {respondent.nip}</p>
            </div>

            <div>
              <p className="text-slate-600 text-[10px] sm:text-xs">
                Jakarta, {evaluation?.tanggalEvaluasi ? evaluation.tanggalEvaluasi.slice(0, 10) : new Date().toLocaleDateString('id-ID')}
              </p>
              <p className="text-slate-600 font-medium text-[10px] sm:text-xs">Tim Penilai / Evaluator,</p>
              <div className="h-10 sm:h-14 flex items-center justify-center">
                <span className="text-[8px] sm:text-[10px] text-slate-500 font-mono tracking-wider border border-dashed border-slate-300 px-2 py-0.5 rounded">
                  [Terverifikasi Digital]
                </span>
              </div>
              <p className="font-bold text-slate-900 underline text-[11px] sm:text-xs break-words">
                {evaluation?.evaluatorName || 'Drs. H. Hendra Wijaya, M.Si.'}
              </p>
              <p className="text-slate-600 font-mono text-[9px] sm:text-[11px] break-all">
                NIP. {evaluation?.evaluatorNip || '197508121998031001'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden in Print) */}
        <div className="no-print px-4 sm:px-6 py-3 bg-slate-100 rounded-b-xl border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            Siap dicetak ke printer fisik atau disimpan sebagai PDF (Ctrl+P / Cmd+P).
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer text-center"
            >
              Tutup
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak / Ekspor PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
