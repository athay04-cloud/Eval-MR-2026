import React from 'react';
import { X, Printer, Shield, CheckCircle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 my-8 print:my-0 print:border-none print:shadow-none print:w-full print:max-w-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print px-6 py-4 bg-slate-900 text-white rounded-t-xl flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-sm">
              Pratinjau Lembar Kerja Resmi & Ekspor PDF
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
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

        {/* PRINTABLE OFFICIAL DOCUMENT BODY */}
        <div className="p-8 sm:p-12 print:p-0 space-y-6 text-slate-900 print-container">
          {/* KOP RESMI PEMERINTAH */}
          <div className="border-b-2 border-slate-900 pb-4 text-center relative">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center">
                <Shield className="w-7 h-7 text-slate-900" />
              </div>
              <div className="text-center">
                <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-slate-900">
                  KEMENTERIAN HUKUM REPUBLIK INDONESIA
                </h2>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800">
                  TIM EVALUASI DAN PENILAIAN MATURITAS MANAJEMEN RISIKO
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Gedung Sentra Mulia, Jl. H.R. Rasuna Said Kav. X-6, Kuningan, Jakarta Selatan
                </p>
              </div>
            </div>
          </div>

          {/* DOKUMEN TITLE */}
          <div className="text-center py-2">
            <h1 className="text-base sm:text-lg font-black uppercase underline decoration-1 text-slate-900">
              LEMBAR EVALUASI DAN PENILAIAN INDIVIDUAL MANAJEMEN RISIKO
            </h1>
            <p className="text-xs text-slate-600 mt-1 font-mono">
              Nomor Berkas: BERKAS-MR/{respondent.id.toUpperCase()}
            </p>
          </div>

          {/* 1. DATA IDENTITAS RESPONDEN */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50 print:bg-white text-xs">
            <div className="font-bold text-slate-900 text-xs uppercase mb-3 border-b border-slate-200 pb-1">
              I. Identitas Pegawai & Satuan Kerja
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <div>
                <span className="text-slate-500 block">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{respondent.nama}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nomor Induk Pegawai (NIP):</span>
                <span className="font-mono font-bold text-slate-900">{respondent.nip}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Jabatan:</span>
                <span className="font-semibold text-slate-800">{respondent.jabatan}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Satuan Kerja (Satker):</span>
                <span className="font-semibold text-slate-800">{respondent.satker}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Status Unit Pemilik Risiko:</span>
                <span className="font-bold text-slate-900">
                  {respondent.statusUpr === 'IYA' ? 'Unit Pemilik Risiko (UPR)' : 'Bukan UPR'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Waktu Pengisian Survei:</span>
                <span className="font-medium text-slate-800">{respondent.timestamp}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-slate-200/60">
                <span className="text-slate-500 block">Peran / Keterlibatan dalam Risiko:</span>
                <span className="text-slate-800 italic">{respondent.keteranganUpr}</span>
              </div>
            </div>
          </div>

          {/* 2. REKAPITULASI SKOR & TINGKAT MATURITAS */}
          <div className="border-2 border-slate-900 rounded-lg p-4 bg-white text-xs">
            <div className="font-bold text-slate-900 uppercase mb-3 border-b border-slate-200 pb-1">
              II. Rekapitulasi Skor & Hasil Penilaian Maturitas
            </div>
            <div className="grid grid-cols-4 gap-4 text-center divide-x divide-slate-200">
              <div>
                <div className="text-[11px] text-slate-500">Skor Pemahaman (A)</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {evaluation?.skorPemahaman || 0} / 20
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Skor Penerapan (B)</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {evaluation?.skorPenerapan || 0} / 8
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Total Skor Rubrik</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">
                  {evaluation?.totalSkor || 0} / 28
                </div>
              </div>
              <div>
                <div className="text-[11px] text-slate-500">Nilai Akhir Indeks (0-100)</div>
                <div className="text-xl font-black font-mono text-slate-900 mt-0.5">
                  {nilaiAkhir.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="text-xs">
                <span className="font-bold text-slate-700">Kategori Tingkat Maturitas: </span>
                <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-slate-900 text-white">
                  {maturity.badgeText}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 text-right">
                Formula: (Total Skor Diperoleh / 28) × 100
              </div>
            </div>

            <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
              <strong>Keterangan Hasil:</strong> {maturity.description}
            </div>
          </div>

          {/* 3. TABEL RINCIAN NILAI BUTIR SOAL 1-7 */}
          <div className="space-y-2">
            <div className="font-bold text-slate-900 text-xs uppercase border-b border-slate-200 pb-1">
              III. Rincian Penilaian Jawaban Responden (7 Butir Soal)
            </div>

            <table className="w-full text-left border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-[10px] uppercase font-bold text-slate-700">
                  <th className="p-2 border-r border-slate-300 w-8 text-center">No</th>
                  <th className="p-2 border-r border-slate-300 w-1/3">Pertanyaan & Jawaban Responden</th>
                  <th className="p-2 border-r border-slate-300 w-16 text-center">Skor (1-4)</th>
                  <th className="p-2">Catatan Evaluator & Analisis Rubrik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {QUESTIONS_DATA.map((q) => {
                  const score = evaluation?.scores[q.id] || 0;
                  const itemNote = evaluation?.itemNotes?.[q.id];
                  const userAnswer = respondent.answers[q.id] || '-';

                  return (
                    <tr key={q.id} className="print-break-inside-avoid">
                      <td className="p-2.5 border-r border-slate-300 text-center font-bold text-slate-700">
                        {q.id}
                      </td>
                      <td className="p-2.5 border-r border-slate-300 space-y-1.5">
                        <div className="font-semibold text-slate-900">{q.question}</div>
                        <div className="p-2 bg-slate-50 print:bg-transparent rounded text-[11px] text-slate-700 italic border border-slate-200 print:border-none print:p-0">
                          &quot;{userAnswer}&quot;
                        </div>
                      </td>
                      <td className="p-2.5 border-r border-slate-300 text-center font-mono font-bold text-sm text-slate-900">
                        {score > 0 ? score : '-'}
                      </td>
                      <td className="p-2.5 text-[11px] text-slate-700">
                        <div className="font-medium text-slate-900">
                          {score > 0 ? q.rubrik[score as 1 | 2 | 3 | 4] : 'Belum dinilai'}
                        </div>
                        {itemNote && (
                          <div className="mt-1 text-slate-600 bg-amber-50/60 p-1.5 rounded border border-amber-200/60">
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

          {/* 4. CATATAN & REKOMENDASI UMUM */}
          <div className="border border-slate-300 rounded-lg p-4 bg-white text-xs print-break-inside-avoid">
            <div className="font-bold text-slate-900 uppercase mb-2">
              IV. Catatan / Rekomendasi Umum Tim Evaluator
            </div>
            <p className="text-slate-800 leading-relaxed whitespace-pre-line text-xs">
              {evaluation?.catatanUmum ||
                'Responden telah menyelesaikan seluruh instrumen survei manajemen risiko. Rekomendasi tindak lanjut agar dikoordinasikan bersama koordinator UPR Satuan Kerja untuk penguatan implementasi register risiko.'}
            </p>
          </div>

          {/* 5. TANDA TANGAN LEGALITAS */}
          <div className="pt-6 grid grid-cols-2 gap-8 text-xs text-center print-break-inside-avoid">
            <div>
              <p className="text-slate-600">Mengetahui Responden,</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{respondent.nama}</p>
              <p className="text-slate-600 font-mono text-[11px]">NIP. {respondent.nip}</p>
            </div>

            <div>
              <p className="text-slate-600">
                Jakarta, {evaluation?.tanggalEvaluasi || new Date().toLocaleDateString('id-ID')}
              </p>
              <p className="text-slate-600 font-medium">Tim Penilai / Evaluator Manajemen Risiko,</p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 font-mono tracking-widest border border-dashed border-slate-300 px-3 py-1 rounded">
                  [Telah Terverifikasi Digital]
                </span>
              </div>
              <p className="font-bold text-slate-900 underline">
                {evaluation?.evaluatorName || 'Drs. H. Hendra Wijaya, M.Si.'}
              </p>
              <p className="text-slate-600 font-mono text-[11px]">
                NIP. {evaluation?.evaluatorNip || '197508121998031001'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls (Hidden in Print) */}
        <div className="no-print px-6 py-4 bg-slate-100 rounded-b-xl border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Dokumen siap dicetak ke printer fisik atau disimpan sebagai PDF (Ctrl+P / Cmd+P).
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
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
