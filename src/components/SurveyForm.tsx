import React, { useState } from 'react';
import { Send, CheckCircle2, Building2, User, FileText, AlertCircle } from 'lucide-react';
import { QUESTIONS_DATA } from '../data/questions';
import { Respondent, StatusUpr } from '../types';

interface SurveyFormProps {
  onSubmitSuccess: (newRespondent: Respondent) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ onSubmitSuccess }) => {
  // Identity state
  const [nama, setNama] = useState('');
  const [nip, setNip] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [satker, setSatker] = useState('');
  const [statusUpr, setStatusUpr] = useState<StatusUpr>('IYA');
  const [keteranganUpr, setKeteranganUpr] = useState('');

  // Answers state for questions 1 to 7
  const [answers, setAnswers] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
  });

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmittedModalOpen, setIsSubmittedModalOpen] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedReceipt, setSubmittedReceipt] = useState('');

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!nama.trim()) errors.push('Nama Lengkap wajib diisi.');
    if (!nip.trim()) errors.push('NIP wajib diisi.');
    if (!jabatan.trim()) errors.push('Jabatan wajib diisi.');
    if (!satker.trim()) errors.push('Unit Kerja / Satuan Kerja wajib diisi.');
    if (!keteranganUpr.trim()) {
      errors.push(
        statusUpr === 'IYA'
          ? 'Penjelasan peran/tingkatan UPR wajib diisi.'
          : 'Penjelasan posisi/alasan dalam struktur risiko wajib diisi.'
      );
    }

    for (let i = 1; i <= 7; i++) {
      if (!answers[i] || !answers[i].trim()) {
        errors.push(`Jawaban untuk Soal ${i} belum diisi.`);
      }
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);

    const receiptId = `SMR-${Date.now().toString().slice(-6)}`;
    const newRespondent: Respondent = {
      id: `resp-${Date.now()}`,
      timestamp: new Date().toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      nama: nama.trim(),
      nip: nip.trim(),
      jabatan: jabatan.trim(),
      satker: satker.trim(),
      statusUpr,
      keteranganUpr: keteranganUpr.trim(),
      answers: { ...answers },
      status: 'Belum Dinilai',
    };

    onSubmitSuccess(newRespondent);
    setSubmittedName(nama.trim());
    setSubmittedReceipt(receiptId);
    setIsSubmittedModalOpen(true);

    // Reset Form
    setNama('');
    setNip('');
    setJabatan('');
    setSatker('');
    setStatusUpr('IYA');
    setKeteranganUpr('');
    setAnswers({
      1: '',
      2: '',
      3: '',
      4: '',
      5: '',
      6: '',
      7: '',
    });
  };

  const questionsBagianA = QUESTIONS_DATA.filter((q) => q.category === 'A');
  const questionsBagianB = QUESTIONS_DATA.filter((q) => q.category === 'B');

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Intro Hero Section */}
      <div className="mb-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs">
        <div className="pb-6 border-b border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Instrumen Pengukuran Tingkat Maturitas
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Formulir Survei Manajemen Risiko
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
            Kementerian Hukum Republik Indonesia mengundang seluruh pejabat struktural, fungsional, dan pengelola tugas di lingkungan satuan kerja untuk mengisi survei pemahaman dan implementasi manajemen risiko secara objektif.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>7 Butir Pertanyaan Esai Substantif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Penyimpanan Aman ke Database Lokal</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Evaluasi Formal oleh Tim Penilai</span>
          </div>
        </div>
      </div>

      {formErrors.length > 0 && (
        <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Mohon lengkapi formulir sebelum mengirim:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-700 pl-1">
            {formErrors.slice(0, 5).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
            {formErrors.length > 5 && (
              <li>...dan {formErrors.length - 5} isian lainnya yang belum lengkap.</li>
            )}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* SECTION 1: Identitas Responden */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Identitas Pegawai & Satuan Kerja</h2>
              <p className="text-xs text-slate-500">Data responden yang bertugas di lingkungan Kementerian Hukum</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap (beserta gelar) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Rahmat Hidayat, S.H., M.H."
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Induk Pegawai (NIP) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="18 digit angka NIP (tanpa spasi)"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jabatan Struktural / Fungsional <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={jabatan}
                onChange={(e) => setJabatan(e.target.value)}
                placeholder="Contoh: Kepala Subbagian Tata Usaha / Analis Hukum"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Unit Kerja / Satuan Kerja (Satker) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={satker}
                  onChange={(e) => setSatker(e.target.value)}
                  placeholder="Contoh: Kantor Wilayah Kemenkum Jabar / Ditjen AHU"
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
                />
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Status UPR */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Status Unit Pemilik Risiko (UPR) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <label
                className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-colors ${
                  statusUpr === 'IYA'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="statusUpr"
                  value="IYA"
                  checked={statusUpr === 'IYA'}
                  onChange={() => setStatusUpr('IYA')}
                  className="mt-0.5 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">IYA (Unit Pemilik Risiko)</div>
                  <div className="text-xs text-slate-500">
                    Unit/Jabatan Saudara merupakan struktur resmi pemilik/pengelola risiko di satker.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3.5 border rounded-lg cursor-pointer transition-colors ${
                  statusUpr === 'TIDAK'
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="statusUpr"
                  value="TIDAK"
                  checked={statusUpr === 'TIDAK'}
                  onChange={() => setStatusUpr('TIDAK')}
                  className="mt-0.5 text-slate-900 focus:ring-slate-900"
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">TIDAK (Bukan UPR)</div>
                  <div className="text-xs text-slate-500">
                    Bukan anggota struktur UPR resmi, namun berkontribusi pada pelaksanaan mitigasi.
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {statusUpr === 'IYA'
                  ? 'Penjelasan Tingkatan / Peran UPR Saudara *'
                  : 'Penjelasan Posisi / Keterlibatan Saudara dalam Struktur Risiko *'}
              </label>
              <textarea
                required
                rows={2}
                value={keteranganUpr}
                onChange={(e) => setKeteranganUpr(e.target.value)}
                placeholder={
                  statusUpr === 'IYA'
                    ? 'Sebutkan tingkatan atau peran UPR Anda (contoh: Koordinator UPR Satker, Anggota Pokja Pengendalian Aset, atau Sekretariat Penilaian Risiko)...'
                    : 'Sebutkan posisi atau alasan keterlibatan Anda dalam struktur risiko (contoh: Pelaksana operasional layanan, operator TI, atau staf pelaksana mitigasi lapangan)...'
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Bagian A (Pemahaman Manajemen Risiko) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bagian A: Pemahaman Manajemen Risiko
              </h2>
              <p className="text-xs text-slate-500">
                Jawablah 5 pertanyaan esai di bawah ini dengan jelas berdasarkan pemahaman dan regulasi yang berlaku.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {questionsBagianA.map((q) => (
              <div key={q.id} className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">
                    Soal {q.id}
                  </span>
                  <label htmlFor={`answer-${q.id}`} className="text-sm font-semibold text-slate-900">
                    {q.question}
                  </label>
                </div>
                <textarea
                  id={`answer-${q.id}`}
                  required
                  rows={4}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Bagian B (Penerapan Manajemen Risiko) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bagian B: Penerapan Manajemen Risiko
              </h2>
              <p className="text-xs text-slate-500">
                Pertanyaan terkait praktik implementasi, proses identifikasi, serta bukti pemanfaatan dokumen risiko di satker Saudara.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {questionsBagianB.map((q) => (
              <div key={q.id} className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="px-2 py-0.5 text-xs font-bold bg-slate-900 text-white rounded">
                    Soal {q.id}
                  </span>
                  <label htmlFor={`answer-${q.id}`} className="text-sm font-semibold text-slate-900">
                    {q.question}
                  </label>
                </div>
                <textarea
                  id={`answer-${q.id}`}
                  required
                  rows={4}
                  value={answers[q.id] || ''}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder={q.placeholder}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Respon akan tersimpan dengan status &quot;Belum Dinilai&quot; untuk ditindaklanjuti evaluator.</span>
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Kirim Respon Survei</span>
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {isSubmittedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl p-6 sm:p-7 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Respon Berhasil Dikirim!</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Terima kasih, <strong className="text-slate-900">{submittedName}</strong>. Data kuesioner Anda telah berhasil disimpan ke sistem evaluasi manajemen risiko dengan status <span className="font-semibold text-amber-800">Belum Dinilai</span>.
            </p>

            <div className="my-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
              <div className="text-[11px] text-slate-400 font-sans">Kode Tanda Terima:</div>
              <div className="text-sm font-bold text-slate-900">{submittedReceipt}</div>
            </div>

            <p className="text-[11px] text-slate-500 mb-6">
              Tim Evaluator akan memeriksa jawaban Anda melalui Portal Evaluator sesuai pedoman rubrik resmi.
            </p>

            <button
              onClick={() => setIsSubmittedModalOpen(false)}
              className="w-full px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Isi Respon Baru / Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
