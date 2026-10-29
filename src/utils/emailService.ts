import { Respondent } from '../types';
import { QUESTIONS_DATA } from '../data/questions';

export const TARGET_EMAIL = 'naufalenjia@gmail.com';

export interface EmailDispatchResult {
  success: boolean;
  message: string;
}

/**
 * Sends survey respondent data automatically to naufalenjia@gmail.com via FormSubmit AJAX.
 * Works seamlessly in client-side static environments (such as GitHub Pages and preview).
 */
export async function sendRespondentEmailNotification(
  respondent: Respondent,
  receiptId: string
): Promise<EmailDispatchResult> {
  try {
    const payload: Record<string, string> = {
      _subject: `[SIM-RISIKO] Respon Survei Baru: ${respondent.nama} - ${respondent.satker}`,
      _template: 'table',
      _captcha: 'false',
      'Kode Tanda Terima': receiptId,
      'Waktu Pengiriman': respondent.timestamp,
      'Nama Responden': respondent.nama,
      'NIP Responden': respondent.nip,
      'Jabatan': respondent.jabatan,
      'Satuan Kerja': respondent.satker,
      'Status UPR': respondent.statusUpr === 'IYA' ? 'Unit Pemilik Risiko (UPR sesuai SK)' : 'Bukan UPR',
      'Keterangan Peran UPR': respondent.keteranganUpr,
    };

    // Append 7 questions and answers
    QUESTIONS_DATA.forEach((q) => {
      const answer = respondent.answers[q.id] || '(Tidak ada jawaban)';
      payload[`Soal ${q.id} - ${q.title}`] = answer;
    });

    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return {
        success: true,
        message: `Notifikasi email otomatis berhasil dikirim ke ${TARGET_EMAIL}`,
      };
    } else {
      return {
        success: false,
        message: `Gagal mengirim email otomatis (${response.status}). Anda dapat menggunakan tombol Kirim via Mail Client.`,
      };
    }
  } catch (error) {
    console.warn('FormSubmit AJAX dispatch error:', error);
    return {
      success: false,
      message: `Koneksi pengiriman email terhambat. Anda dapat membuka draft email via aplikasi email.`,
    };
  }
}

/**
 * Generates a pre-filled mailto URI for direct dispatch to naufalenjia@gmail.com
 * as a foolproof backup.
 */
export function generateMailtoLink(respondent: Respondent, receiptId: string): string {
  const subject = encodeURIComponent(`[SIM-RISIKO] Respon Baru: ${respondent.nama} - ${respondent.satker}`);
  
  let bodyText = `Yth. Tim Manajemen Risiko Kemenkum,\n\n`;
  bodyText += `Berikut adalah formulir respon survei Manajemen Risiko yang telah dikirim:\n\n`;
  bodyText += `--- IDENTITAS RESPONDEN ---\n`;
  bodyText += `Kode Tanda Terima: ${receiptId}\n`;
  bodyText += `Waktu: ${respondent.timestamp}\n`;
  bodyText += `Nama Lengkap: ${respondent.nama}\n`;
  bodyText += `NIP: ${respondent.nip}\n`;
  bodyText += `Jabatan: ${respondent.jabatan}\n`;
  bodyText += `Satuan Kerja: ${respondent.satker}\n`;
  bodyText += `Status UPR: ${respondent.statusUpr}\n`;
  bodyText += `Keterangan UPR: ${respondent.keteranganUpr}\n\n`;
  bodyText += `--- JAWABAN KUESIONER (7 SOAL) ---\n`;

  QUESTIONS_DATA.forEach((q) => {
    bodyText += `\n[Soal ${q.id}: ${q.title}]\n`;
    bodyText += `Pertanyaan: ${q.question}\n`;
    bodyText += `Jawaban: ${respondent.answers[q.id] || '-'}\n`;
  });

  bodyText += `\n\n---\nSistem Informasi Survei & Evaluasi Manajemen Risiko (SIM-RISIKO)\nKementerian Hukum Republik Indonesia`;

  return `mailto:${TARGET_EMAIL}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
}

/**
 * Sends evaluated report email to naufalenjia@gmail.com
 */
export async function sendEvaluationSummaryEmail(
  respondent: Respondent
): Promise<EmailDispatchResult> {
  try {
    const ev = respondent.evaluation;
    const payload: Record<string, string> = {
      _subject: `[SIM-RISIKO EVALUASI] Hasil Penilaian: ${respondent.nama} (${ev ? ev.nilaiAkhir.toFixed(2) : '0'}%)`,
      _template: 'table',
      _captcha: 'false',
      'Nama Responden': respondent.nama,
      'NIP': respondent.nip,
      'Satuan Kerja': respondent.satker,
      'Jabatan': respondent.jabatan,
      'Skor Pemahaman (Soal 1-5)': `${ev?.skorPemahaman || 0} / 50 (${ev?.statusPemahaman || '-'})`,
      'Skor Penerapan (Soal 6-7)': `${ev?.skorPenerapan || 0} / 20 (${ev?.statusPenerapan || '-'})`,
      'Total Akumulasi Skor': `${ev?.totalSkor || 0} / 70`,
      'Nilai Akhir Indeks': `${ev?.nilaiAkhir.toFixed(2) || '0'} / 100`,
      'Catatan Rekomendasi Evaluator': ev?.catatanUmum || '-',
      'Nama Evaluator': ev?.evaluatorName || '-',
      'NIP Evaluator': ev?.evaluatorNip || '-',
      'Waktu Evaluasi': ev?.tanggalEvaluasi || new Date().toLocaleString('id-ID'),
    };

    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return { success: true, message: `Hasil evaluasi berhasil dikirim ke ${TARGET_EMAIL}` };
    } else {
      return { success: false, message: `Gagal mengirim hasil evaluasi (${response.status})` };
    }
  } catch (error) {
    console.warn('Evaluation email dispatch error:', error);
    return { success: false, message: 'Gagal terhubung ke layanan pengiriman email.' };
  }
}
