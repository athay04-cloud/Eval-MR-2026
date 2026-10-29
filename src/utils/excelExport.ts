import { Respondent } from '../types';
import { getMaturityCategory } from './scoring';

/**
 * Escapes fields for CSV format
 */
function escapeCsv(val: unknown): string {
  if (val === undefined || val === null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports all respondents to an Excel-compatible CSV file with UTF-8 BOM
 */
export function exportRespondentsToCsv(respondents: Respondent[]) {
  const headers = [
    'No',
    'ID Responden',
    'Tanggal Kirim',
    'Nama Lengkap',
    'NIP',
    'Jabatan',
    'Satuan Kerja',
    'Status UPR',
    'Keterangan / Peran UPR',
    'Soal 1 - Jawaban',
    'Soal 1 - Nilai (1-10)',
    'Soal 1 - Catatan',
    'Soal 2 - Jawaban',
    'Soal 2 - Nilai (1-10)',
    'Soal 2 - Catatan',
    'Soal 3 - Jawaban',
    'Soal 3 - Nilai (1-10)',
    'Soal 3 - Catatan',
    'Soal 4 - Jawaban',
    'Soal 4 - Nilai (1-10)',
    'Soal 4 - Catatan',
    'Soal 5 - Jawaban',
    'Soal 5 - Nilai (1-10)',
    'Soal 5 - Catatan',
    'Soal 6 - Jawaban',
    'Soal 6 - Nilai (1-10)',
    'Soal 6 - Catatan',
    'Soal 7 - Jawaban',
    'Soal 7 - Nilai (1-10)',
    'Soal 7 - Catatan',
    'Skor Pemahaman (Maks 50)',
    'Status Pemahaman (Ambang >=30)',
    'Skor Penerapan (Maks 20)',
    'Status Penerapan (Ambang >=12)',
    'Total Skor (Maks 70)',
    'Nilai Akhir Indeks (0-100)',
    'Tingkat Maturitas (Skor 1-5)',
    'Status Penilaian',
    'Catatan Umum Evaluator',
    'Nama Evaluator',
    'NIP Evaluator',
    'Tanggal Evaluasi'
  ];

  const rows = respondents.map((r, index) => {
    const ev = r.evaluation;
    const finalScore = ev ? ev.nilaiAkhir : 0;
    const maturity = ev ? getMaturityCategory(finalScore, ev.skorPemahaman, ev.skorPenerapan).badgeText : '-';

    return [
      index + 1,
      r.id,
      r.timestamp,
      r.nama,
      `'${r.nip}`,
      r.jabatan,
      r.satker,
      r.statusUpr === 'IYA' ? 'UPR' : 'Non-UPR',
      r.keteranganUpr,
      r.answers[1] || '',
      ev?.scores[1] ?? '',
      ev?.itemNotes?.[1] ?? '',
      r.answers[2] || '',
      ev?.scores[2] ?? '',
      ev?.itemNotes?.[2] ?? '',
      r.answers[3] || '',
      ev?.scores[3] ?? '',
      ev?.itemNotes?.[3] ?? '',
      r.answers[4] || '',
      ev?.scores[4] ?? '',
      ev?.itemNotes?.[4] ?? '',
      r.answers[5] || '',
      ev?.scores[5] ?? '',
      ev?.itemNotes?.[5] ?? '',
      r.answers[6] || '',
      ev?.scores[6] ?? '',
      ev?.itemNotes?.[6] ?? '',
      r.answers[7] || '',
      ev?.scores[7] ?? '',
      ev?.itemNotes?.[7] ?? '',
      ev ? ev.skorPemahaman : '',
      ev ? ev.statusPemahaman : '',
      ev ? ev.skorPenerapan : '',
      ev ? ev.statusPenerapan : '',
      ev ? ev.totalSkor : '',
      ev ? ev.nilaiAkhir.toFixed(2) : '',
      maturity,
      r.status,
      ev?.catatanUmum || '',
      ev?.evaluatorName || '',
      ev?.evaluatorNip ? `'${ev.evaluatorNip}` : '',
      ev?.tanggalEvaluasi || ''
    ].map(escapeCsv).join(',');
  });

  const csvContent = '\uFEFF' + [headers.map(escapeCsv).join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekapitulasi_Evaluasi_Manajemen_Risiko_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports directly to an HTML-based Excel spreadsheet (.xls)
 * which opens directly in Microsoft Excel with formatted headers and grid lines.
 */
export function exportRespondentsToExcel(respondents: Respondent[]) {
  const headers = [
    'No',
    'ID Responden',
    'Waktu Kirim',
    'Nama Lengkap',
    'NIP',
    'Jabatan',
    'Satuan Kerja',
    'Status UPR',
    'Keterangan Peran UPR',
    'Soal 1: Definisi Risiko',
    'Nilai 1 (1-10)',
    'Soal 2: Dasar Hukum',
    'Nilai 2 (1-10)',
    'Soal 3: Pelatihan MR',
    'Nilai 3 (1-10)',
    'Soal 4: Tahapan MR',
    'Nilai 4 (1-10)',
    'Soal 5: Contoh Risiko & RTP',
    'Nilai 5 (1-10)',
    'Soal 6: Proses Identifikasi & Mitigasi',
    'Nilai 6 (1-10)',
    'Soal 7: Bukti Dokumen Pengambilan Keputusan',
    'Nilai 7 (1-10)',
    'Skor Pemahaman (A: Max 50)',
    'Status Pemahaman (Ambang >= 30)',
    'Skor Penerapan (B: Max 20)',
    'Status Penerapan (Ambang >= 12)',
    'Total Skor (Max 70)',
    'Nilai Akhir Indeks (0-100)',
    'Tingkat Maturitas (Skor 1-5)',
    'Status Penilaian',
    'Catatan / Rekomendasi Evaluator',
    'Nama Evaluator',
    'NIP Evaluator'
  ];

  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Rekapitulasi Evaluasi MR</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
      <style>
        table { border-collapse: collapse; width: 100%; font-family: Calibri, sans-serif; font-size: 11pt; }
        th { background-color: #1e293b; color: #ffffff; font-weight: bold; border: 1px solid #94a3b8; padding: 8px; text-align: left; }
        td { border: 1px solid #cbd5e1; padding: 6px; vertical-align: top; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .num { mso-number-format:"\\@"; }
        .score { font-weight: bold; text-align: center; background-color: #f8fafc; }
        .cukup { color: #047857; font-weight: bold; }
        .kurang { color: #b91c1c; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>REKAPITULASI EVALUASI & PENILAIAN MATURITAS MANAJEMEN RISIKO</h2>
      <p>Kementerian Hukum Republik Indonesia · Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}</p>
      <table>
        <thead>
          <tr>
            ${headers.map((h) => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
  `;

  respondents.forEach((r, idx) => {
    const ev = r.evaluation;
    const finalScore = ev ? ev.nilaiAkhir : 0;
    const maturity = ev ? getMaturityCategory(finalScore, ev.skorPemahaman, ev.skorPenerapan).badgeText : '-';

    tableHtml += `
      <tr>
        <td class="text-center">${idx + 1}</td>
        <td>${r.id}</td>
        <td>${r.timestamp}</td>
        <td><b>${r.nama}</b></td>
        <td class="num">${r.nip}</td>
        <td>${r.jabatan}</td>
        <td>${r.satker}</td>
        <td>${r.statusUpr === 'IYA' ? 'UPR' : 'Non-UPR'}</td>
        <td>${r.keteranganUpr}</td>
        <td>${r.answers[1] || ''}</td>
        <td class="score">${ev?.scores[1] ?? '-'}</td>
        <td>${r.answers[2] || ''}</td>
        <td class="score">${ev?.scores[2] ?? '-'}</td>
        <td>${r.answers[3] || ''}</td>
        <td class="score">${ev?.scores[3] ?? '-'}</td>
        <td>${r.answers[4] || ''}</td>
        <td class="score">${ev?.scores[4] ?? '-'}</td>
        <td>${r.answers[5] || ''}</td>
        <td class="score">${ev?.scores[5] ?? '-'}</td>
        <td>${r.answers[6] || ''}</td>
        <td class="score">${ev?.scores[6] ?? '-'}</td>
        <td>${r.answers[7] || ''}</td>
        <td class="score">${ev?.scores[7] ?? '-'}</td>
        <td class="text-center score">${ev?.skorPemahaman ?? '-'} / 50</td>
        <td class="${ev?.isPemahamanCukup ? 'cukup' : 'kurang'}">${ev?.statusPemahaman ?? '-'}</td>
        <td class="text-center score">${ev?.skorPenerapan ?? '-'} / 20</td>
        <td class="${ev?.isPenerapanMengetahui ? 'cukup' : 'kurang'}">${ev?.statusPenerapan ?? '-'}</td>
        <td class="score">${ev?.totalSkor ?? '-'} / 70</td>
        <td class="score">${ev ? ev.nilaiAkhir.toFixed(2) : '-'}</td>
        <td><b>${maturity}</b></td>
        <td>${r.status}</td>
        <td>${ev?.catatanUmum || '-'}</td>
        <td>${ev?.evaluatorName || '-'}</td>
        <td class="num">${ev?.evaluatorNip || '-'}</td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekapitulasi_Evaluasi_MR_${dateStr}.xls`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
