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
} from 'lucide-react';
import { Respondent, StatusPenilaian } from '../types';
import { getMaturityCategory } from '../utils/scoring';
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

  // Statistics calculation
  const totalCount = respondents.length;
  const pendingCount = respondents.filter((r) => r.status === 'Belum Dinilai').length;
  const gradedCount = respondents.filter((r) => r.status === 'Sudah Dinilai').length;

  const averageScore = useMemo(() => {
    const graded = respondents.filter((r) => r.status === 'Sudah Dinilai' && r.evaluation);
    if (graded.length === 0) return 0;
    const sum = graded.reduce((acc, curr) => acc + (curr.evaluation?.nilaiAkhir || 0), 0);
    return Math.round((sum / graded.length) * 100) / 100;
  }, [respondents]);

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
            className="text-emerald-700 hover:text-emerald-900 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Title & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
        <div>
          <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            Portal Penilai Terakreditasi
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Daftar Antrean Responden & Hasil Evaluasi
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitoring pengisian kuesioner manajemen risiko seluruh satuan kerja dan eksekusi rubrik penilaian.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export to Excel Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleExportExcel}
              disabled={totalCount === 0}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors shadow-xs ${
                totalCount > 0
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
              disabled={totalCount === 0}
              className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                totalCount > 0
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

          {totalCount > 0 && (
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

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-slate-500">Total Berkas Responden</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">{totalCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Seluruh unit kerja Kemenkum</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="text-xs font-medium text-amber-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Menunggu Penilaian</span>
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-700 font-mono tabular-nums">{pendingCount}</div>
          <div className="mt-1 text-[11px] text-slate-400">Siap dievaluasi dengan rubrik</div>
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
          <div className="text-xs font-medium text-slate-500">Rata-rata Indeks Maturitas</div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {averageScore > 0 ? averageScore.toFixed(2) : '-'} <span className="text-xs text-slate-400 font-sans font-normal">/ 100</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 font-medium">
            {averageScore > 0 ? getMaturityCategory(averageScore).title : 'Belum ada data nilai'}
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
                <th className="py-3 px-4">Waktu Kirim</th>
                <th className="py-3 px-4 text-center">Status Penilaian</th>
                <th className="py-3 px-4 text-right">Nilai Akhir</th>
                <th className="py-3 px-4 text-center">Aksi Evaluator</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-700">
                      {totalCount === 0 ? 'Belum Ada Berkas Responden' : 'Tidak ada data responden yang cocok.'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-md mx-auto">
                      {totalCount === 0
                        ? 'Database responden saat ini kosong. Pegawai dapat mengisi survei melalui Formulir Publik atau Anda dapat memuat data simulasi contoh.'
                        : 'Coba sesuaikan kata kunci pencarian atau ubah filter satuan kerja.'}
                    </p>
                    {totalCount === 0 && (
                      <div className="mt-4 flex items-center justify-center gap-3">
                        <button
                          onClick={onGoToPublicForm}
                          className="px-3.5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Buka Formulir Publik
                        </button>
                        <button
                          onClick={handleResetMockDirect}
                          className="px-3.5 py-2 text-xs font-semibold bg-amber-50 border border-amber-300 text-amber-900 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                        >
                          Muat Data Contoh Awal
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map((item, index) => {
                  const isGraded = item.status === 'Sudah Dinilai' && item.evaluation;
                  const maturity = isGraded && item.evaluation ? getMaturityCategory(item.evaluation.nilaiAkhir) : null;

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

                      <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {item.timestamp}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {isGraded ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Sudah Dinilai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Belum Dinilai
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isGraded && item.evaluation && maturity ? (
                          <div>
                            <div className="font-bold text-slate-900 font-mono tabular-nums text-sm">
                              {item.evaluation.nilaiAkhir.toFixed(2)}
                            </div>
                            <div className={`text-[10px] font-medium ${maturity.colorClass}`}>
                              {maturity.badgeText}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>

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
                            {isGraded ? 'Lihat / Ubah Nilai' : 'Mulai Nilai'}
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
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
                            title="Hapus data responden ini"
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

      {/* IN-APP CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-rose-50 text-rose-600 border border-rose-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {confirmModal.type === 'delete_single' ? 'Konfirmasi Hapus Responden' : 'Konfirmasi Kosongkan Seluruh Data'}
                </h3>
              </div>
              <button
                onClick={() => setConfirmModal({ isOpen: false, type: 'delete_single' })}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed space-y-2 mb-6">
              {confirmModal.type === 'delete_single' ? (
                <p>
                  Apakah Anda yakin ingin menghapus data responden{' '}
                  <strong className="text-slate-900">{confirmModal.targetName}</strong>? Data yang dihapus tidak dapat dipulihkan kembali.
                </p>
              ) : (
                <p>
                  Apakah Anda yakin ingin <strong className="text-rose-700">menghapus seluruh berkas responden</strong> dari database? Seluruh data survei dan riwayat nilai akan dikosongkan.
                </p>
              )}
            </div>

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
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {confirmModal.type === 'delete_single' ? 'Ya, Hapus Data' : 'Ya, Kosongkan Semua'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
