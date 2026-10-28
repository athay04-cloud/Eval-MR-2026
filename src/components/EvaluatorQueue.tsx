import React, { useState, useMemo } from 'react';
import { Search, Filter, Printer, UserPlus, RefreshCw, CheckCircle, Clock } from 'lucide-react';
import { Respondent, StatusPenilaian } from '../types';
import { getMaturityCategory } from '../utils/scoring';

interface EvaluatorQueueProps {
  respondents: Respondent[];
  onSelectRespondent: (respondent: Respondent) => void;
  onPrintRespondent: (respondent: Respondent) => void;
  onResetToMock: () => void;
  onGoToPublicForm: () => void;
}

export const EvaluatorQueue: React.FC<EvaluatorQueueProps> = ({
  respondents,
  onSelectRespondent,
  onPrintRespondent,
  onResetToMock,
  onGoToPublicForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | StatusPenilaian>('Semua');

  // Filtered respondents
  const filtered = useMemo(() => {
    return respondents.filter((r) => {
      const matchSearch =
        r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.nip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.satker.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.jabatan.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = statusFilter === 'Semua' ? true : r.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [respondents, searchTerm, statusFilter]);

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

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
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
          <button
            onClick={onGoToPublicForm}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Isi Form Publik</span>
          </button>
          <button
            onClick={onResetToMock}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Muat ulang 4 data contoh default"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Data Contoh</span>
          </button>
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
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, NIP, atau satker..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Status Tabs Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
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
                    <p className="font-medium text-slate-600">Tidak ada data responden yang cocok.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ubah tab status.</p>
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
                        <div className="flex items-center justify-center gap-2">
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
    </div>
  );
};
