import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Printer,
  UserPlus,
  RefreshCw,
  CheckCircle,
  Clock,
  Trash2,
  AlertTriangle,
  X,
  FileSpreadsheet,
  Download,
  Building2,
  Check,
  KeyRound,
  Award,
  CheckCircle2,
  XCircle,
  BarChart3
} from 'lucide-react';
import { Respondent, StatusPenilaian } from '../types';
import { getMaturityCategory, calculateSatkerMaturity } from '../utils/scoring';
import { exportRespondentsToExcel, exportRespondentsToCsv } from '../utils/excelExport';
import { DAFTAR_SATKER } from '../data/satkerList';

interface EvaluatorQueueProps {
  respondents: Respondent[];
  onSelectRespondent: (respondent: Respondent) => void;
  onPrintRespondent: (respondent: Respondent) => void;
  onDeleteRespondent: (id: string) => void;
  onClearAllRespondents: () => void;
  onResetToMock: () => void;
  onGoToPublicForm: () => void;
  onOpenChangePinModal?: () => void;
}

export const EvaluatorQueue: React.FC<EvaluatorQueueProps> = ({
  respondents,
  onSelectRespondent,
  onPrintRespondent,
  onDeleteRespondent,
  onClearAllRespondents,
  onResetToMock,
  onGoToPublicForm,
  onOpenChangePinModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | StatusPenilaian>('Semua');
  const [satkerFilter, setSatkerFilter] = useState<string>('Semua');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: 'delete_single' | 'clear_all';
    targetId?: string;
    targetName?: string;
  }>({
    isOpen: false,
    type: 'delete_single',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Direct reset mock data with instant feedback
  const handleResetMockDirect = () => {
    onResetToMock();
    showToast('Berhasil memuat ulang 4 data contoh responden ke dalam sistem.');
  };

  // Filtered respondents
  const filtered = useMemo(() => {
    return respondents.filter((r) => {
      const matchSearch =
        r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.satker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.jabatan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'Semua' ? true : r.status === statusFilter;
      const matchSatker = satkerFilter === 'Semua' ? true : r.satker === satkerFilter;

      return matchSearch && matchStatus && matchSatker;
    });
  }, [respondents, searchTerm, statusFilter, satkerFilter]);

  // Aggregate Satker calculation based on official guidelines
  const satkerMaturity = useMemo(() => {
    return calculateSatkerMaturity(filtered);
  }, [filtered]);

  // General statistics
  const totalCount = filtered.length;
  const pendingCount = filtered.filter((r) => r.status === 'Belum Dinilai').length;
  const gradedCount = filtered.filter((r) => r.status === 'Sudah Dinilai').length;

  const averageScore = useMemo(() => {
    const graded = filtered.filter((r) => r.status === 'Sudah Dinilai' && r.evaluation);
    if (graded.length === 0) return 0;
    const sum = graded.reduce((acc, curr) => acc + (curr.evaluation?.nilaiAkhir || 0), 0);
    return Math.round((sum / graded.length) * 100) / 100;
  }, [filtered]);

  const handleExecuteConfirm = () => {
    if (confirmModal.type === 'delete_single' && confirmModal.targetId) {
      onDeleteRespondent(confirmModal.targetId);
      showToast('Data responden berhasil dihapus.');
    } else if (confirmModal.type === 'clear_all') {
      onClearAllRespondents();
      showToast('Seluruh data responden telah dikosongkan.');
    }
    setConfirmModal({ isOpen: false, type: 'delete_single' });
  };

  const handleExportExcel = () => {
    if (respondents.length === 0) {
      showToast('Tidak ada data untuk diekspor ke Excel.');
      return;
    }
    exportRespondentsToExcel(respondents);
    showToast('File Excel (.xls) berhasil diunduh.');
  };

  const handleExportCsv = () => {
    if (respondents.length === 0) {
      showToast('Tidak ada data untuk diekspor ke CSV.');
      return;
    }
    exportRespondentsToCsv(respondents);
    showToast('File CSV Excel berhasil diunduh.');
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div>
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            Portal Penilai Terakreditasi · Sistem Manajemen Risiko
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Antrean Responden & Evaluasi Pegawai
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Sistem penilaian objektif skala 1–10 dengan ambang batas Pemahaman (≥30) dan Penerapan (≥12).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export to Excel Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportExcel}
              disabled={respondents.length === 0}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                respondents.length > 0
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title="Unduh seluruh rekapitulasi data responden & nilai dalam format Excel (.xls)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Ekspor Excel (.xls)</span>
            </button>

            <button
              onClick={handleExportCsv}
              disabled={respondents.length === 0}
              className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                respondents.length > 0
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 cursor-pointer'
                  : 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
              title="Unduh rekapitulasi CSV (Excel UTF-8 BOM)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          <button
            onClick={onGoToPublicForm}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Form Publik</span>
          </button>

          {onOpenChangePinModal && (
            <button
              onClick={onOpenChangePinModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              title="Perbarui PIN pengaman lembar kerja evaluator"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Ubah PIN</span>
            </button>
          )}

          <button
            onClick={handleResetMockDirect}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors cursor-pointer"
            title="Muat ulang 4 data contoh default secara instan"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-700" />
            <span>Muat Data Contoh</span>
          </button>

          {respondents.length > 0 && (
            <button
              onClick={() =>
                setConfirmModal({
                  isOpen: true,
                  type: 'clear_all',
                })
              }
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
              title="Hapus semua berkas responden dari database"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Kosongkan Data</span>
            </button>
          )}
        </div>
      </div>

      {/* DASHBOARD HASIL AKUMULATIF & TINGKAT MATURITAS SATKER (PEDOMAN RESMI) */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 sm:p-6 shadow-md border border-slate-700 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">
              Rekapitulasi Capaian Maturitas Sampel Pegawai
            </h2>
          </div>
          <div className="text-xs text-slate-300">
            Satker Terpilih: <strong className="text-amber-300">{satkerFilter}</strong> ({satkerMaturity.evaluatedSample} dari {satkerMaturity.totalSample} dinilai)
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Pemahaman MR (Skor >= 30) */}
          <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Pemahaman MR (≥ 30 / 50)</span>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-amber-300">Dasar Skor 1 - 3</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-emerald-400">
                {satkerMaturity.pemahamanCukupPercent}%
              </span>
              <span className="text-xs text-slate-400">
                ({satkerMaturity.pemahamanCukupCount} dari {satkerMaturity.evaluatedSample} pegawai)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Pegawai sampel dikategorikan <strong>Cukup Memahami</strong> apabila akumulatif skor Soal 1 s.d. 5 bernilai <strong>≥ 30</strong>.
            </p>
          </div>

          {/* Card 2: Penerapan MR (Skor >= 12) */}
          <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Penerapan MR (≥ 12 / 20)</span>
              <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-amber-300">Dasar Skor 4 - 5</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black font-mono text-blue-400">
                {satkerMaturity.penerapanMengetahuiPercent}%
              </span>
              <span className="text-xs text-slate-400">
                ({satkerMaturity.penerapanMengetahuiCount} dari {satkerMaturity.evaluatedSample} pegawai)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Pegawai sampel disimpulkan <strong>Mengetahui Penerapan</strong> apabila akumulatif skor Soal 6 & 7 bernilai <strong>≥ 12</strong>.
            </p>
          </div>

          {/* Card 3: Tingkat Maturitas Satker Hasil Evaluasi */}
          <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700 space-y-1.5">
            <div className="text-xs text-slate-300">Hasil Penilaian Maturitas Satker</div>
            <div className="pt-0.5">
              <span className="inline-block px-3 py-1 rounded-md text-sm font-black bg-amber-400 text-slate-950 shadow-xs">
                {satkerMaturity.predikatTingkat}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug pt-1">
              {satkerMaturity.keterangan}
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Berkas Responden</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Pegawai sampel unit kerja</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Penilaian</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700 font-mono tabular-nums">{pendingCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Siap dievaluasi skala 1-10</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Telah Dinilai</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-700 font-mono tabular-nums">{gradedCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Skor & kategori telah final</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Rata-rata Nilai Indeks</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {averageScore > 0 ? averageScore.toFixed(2) : '-'} <span className="text-xs text-slate-400 font-sans font-normal">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {averageScore > 0 ? getMaturityCategory(averageScore).badgeText : 'Belum ada data nilai'}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau NIP..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Satker Filter Dropdown */}
          <div className="relative flex-1 sm:max-w-sm">
            <select
              value={satkerFilter}
              onChange={(e) => setSatkerFilter(e.target.value)}
              className="w-full pl-8 pr-7 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-800 appearance-none cursor-pointer"
            >
              <option value="Semua">Semua Satuan Kerja (7 Satker Resmi)</option>
              {DAFTAR_SATKER.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status Tabs Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto self-start lg:self-auto">
          {(['Semua', 'Belum Dinilai', 'Sudah Dinilai'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`flex-1 sm:flex-initial px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                statusFilter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Queue Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Responden & NIP</th>
                <th className="py-3 px-4">Satuan Kerja & Jabatan</th>
                <th className="py-3 px-4 text-center">Status UPR</th>
                <th className="py-3 px-4 text-center">Pemahaman (Soal 1-5)</th>
                <th className="py-3 px-4 text-center">Penerapan (Soal 6-7)</th>
                <th className="py-3 px-4 text-right">Nilai Akhir (70)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi Evaluator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">
                      {totalCount === 0 ? 'Belum Ada Berkas Responden' : 'Tidak ada data responden yang cocok.'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                      {totalCount === 0
                        ? 'Database responden saat ini kosong. Pegawai dapat mengisi survei melalui Formulir Publik atau Anda dapat memuat data simulasi contoh.'
                        : 'Coba sesuaikan kata kunci pencarian atau ubah filter satuan kerja.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => {
                  const isGraded = item.status === 'Sudah Dinilai' && item.evaluation;
                  const ev = item.evaluation;
                  const maturity = isGraded && ev ? getMaturityCategory(ev.nilaiAkhir, ev.skorPemahaman, ev.skorPenerapan) : null;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center text-slate-400 font-mono tabular-nums">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.nama}</div>
                        <div className="text-[11px] text-slate-500 font-mono tabular-nums">
                          NIP: {item.nip}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-800 truncate" title={item.satker}>
                          {item.satker}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate" title={item.jabatan}>
                          {item.jabatan}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                            item.statusUpr === 'IYA'
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {item.statusUpr === 'IYA' ? 'UPR' : 'Non-UPR'}
                        </span>
                      </td>

                      {/* Skor Pemahaman Soal 1-5 */}
                      <td className="py-3.5 px-4 text-center">
                        {isGraded && ev ? (
                          <div>
                            <div className="font-mono font-bold text-slate-900">
                              {ev.skorPemahaman} <span className="text-[10px] text-slate-400 font-normal">/ 50</span>
                            </div>
                            <div className="mt-0.5">
                              {ev.isPemahamanCukup ? (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Cukup Memahami
                                </span>
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                                  Kurang Memahami
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Skor Penerapan Soal 6-7 */}
                      <td className="py-3.5 px-4 text-center">
                        {isGraded && ev ? (
                          <div>
                            <div className="font-mono font-bold text-slate-900">
                              {ev.skorPenerapan} <span className="text-[10px] text-slate-400 font-normal">/ 20</span>
                            </div>
                            <div className="mt-0.5">
                              {ev.isPenerapanMengetahui ? (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                                  Mengetahui MR
                                </span>
                              ) : (
                                <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                  Belum Mengetahui
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Nilai Akhir Indeks */}
                      <td className="py-3.5 px-4 text-right">
                        {isGraded && ev && maturity ? (
                          <div>
                            <div className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                              {ev.nilaiAkhir.toFixed(2)}
                            </div>
                            <div className={`text-[10px] font-bold ${maturity.colorClass}`}>
                              {maturity.badgeText}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

                      {/* Status Penilaian */}
                      <td className="py-3.5 px-4 text-center">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Antrean
                          </span>
                        )}
                      </td>

                      {/* Aksi Evaluator */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectRespondent(item)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                              isGraded
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                            }`}
                          >
                            {isGraded ? 'Lihat / Ubah' : 'Mulai Nilai'}
                          </button>

                          {isGraded && (
                            <button
                              onClick={() => onPrintRespondent(item)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                              title="Cetak Lembar Kerja Evaluasi"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            onClick={() =>
                              setConfirmModal({
                                isOpen: true,
                                type: 'delete_single',
                                targetId: item.id,
                                targetName: item.nama,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus berkas ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {confirmModal.type === 'clear_all' ? 'Kosongkan Semua Data?' : 'Hapus Berkas Responden?'}
                </h3>
                <p className="text-xs text-slate-500">Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {confirmModal.type === 'clear_all'
                ? 'Seluruh berkas survei dan hasil evaluasi akan dihapus secara permanen dari penyimpanan peramban.'
                : `Apakah Anda yakin ingin menghapus berkas responden atas nama "${confirmModal.targetName}"?`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, type: 'delete_single' })}
                className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirm}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
