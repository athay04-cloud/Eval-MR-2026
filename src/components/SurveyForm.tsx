import React, { useState } from 'react';
import { Send, CheckCircle2, Building2, User, FileText, AlertCircle, Mail, Loader2, ExternalLink } from 'lucide-react';
import { QUESTIONS_DATA } from '../data/questions';
import { DAFTAR_SATKER } from '../data/satkerList';
import { Respondent, StatusUpr } from '../types';
import {
  sendRespondentEmailNotification,
  generateMailtoLink,
  TARGET_EMAIL,
} from '../utils/emailService';

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
  const [submittedRespondentData, setSubmittedRespondentData] = useState<Respondent | null>(null);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'failed'>('idle');

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
    setSubmittedRespondentData(newRespondent);
    setIsSubmittedModalOpen(true);

    // Auto-dispatch notification email to naufalenjia@gmail.com
    setEmailStatus('sending');
    sendRespondentEmailNotification(newRespondent, receiptId)
      .then((res) => {
        setEmailStatus(res.success ? 'success' : 'failed');
      })
      .catch(() => {
        setEmailStatus('failed');
      });

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

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>7 Pertanyaan Esai Substantif</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>Penyimpanan Aman Database</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span>Evaluasi Formal Penilai</span>
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
                <select
                  required
                  value={satker}
                  onChange={(e) => setSatker(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-900 appearance-none cursor-pointer"
                >
                  <option value="" disabled>-- Pilih Satuan Kerja --</option>
                  {DAFTAR_SATKER.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
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
                  <div className="text-sm font-semibold text-slate-900">IYA (Unit Pemilik Risiko sesuai SK)</div>
                  <div className="text-xs text-slate-500">
                    Unit/Jabatan Saudara merupakan struktur resmi pemilik/pengelola risiko di satker sesuai SK.
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
                  ? 'Penjelasan Tingkatan / Peran UPR Saudara (sesuai SK) *'
                  : 'Penjelasan Posisi / Keterlibatan Saudara dalam Struktur Risiko *'}
              </label>
              <textarea
                required
                rows={2}
                value={keteranganUpr}
                onChange={(e) => setKeteranganUpr(e.target.value)}
                placeholder={
                  statusUpr === 'IYA'
                    ? 'Sebutkan tingkatan atau peran UPR Anda sesuai SK (contoh: Koordinator UPR Satker, Anggota Pokja Pengendalian Aset, atau Sekretariat Penilaian Risiko)...'
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
        <div className="pt-2 flex justify-end">
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

            <div className="my-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700">
              <div className="text-[11px] text-slate-400 font-sans">Kode Tanda Terima:</div>
              <div className="text-sm font-bold text-slate-900">{submittedReceipt}</div>
            </div>

            {/* Auto Email Status Notification Card */}
            <div className="my-3 p-3.5 rounded-xl border text-left text-xs space-y-2 bg-slate-50/80 border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600" />
                  <span>Notifikasi Email Respon</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">{TARGET_EMAIL}</span>
              </div>

              {emailStatus === 'sending' && (
                <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200 font-medium text-[11px]">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-600" />
                  <span>Mengirim notifikasi otomatis ke {TARGET_EMAIL}...</span>
                </div>
              )}

              {emailStatus === 'success' && (
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>Data respon survei otomatis terkirim ke {TARGET_EMAIL}</span>
                </div>
              )}

              {emailStatus === 'failed' && submittedRespondentData && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 bg-rose-50 p-2 rounded-lg border border-rose-200 font-medium text-[11px]">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                    <span>Layanan otomatis terhambat peramban. Kirim salinan via mailto:</span>
                  </div>
                  <a
                    href={generateMailtoLink(submittedRespondentData, submittedReceipt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kirim Salinan ke {TARGET_EMAIL}</span>
                  </a>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 mb-5">
              Tim Evaluator akan memeriksa jawaban Anda melalui Portal Evaluator sesuai pedoman rubrik resmi Permenkum 15 Tahun 2025.
            </p>

            <button
              onClick={() => setIsSubmittedModalOpen(false)}
              className="w-full px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              Isi Respon Baru / Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
