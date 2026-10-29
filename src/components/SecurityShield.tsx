import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, EyeOff, AlertCircle, X } from 'lucide-react';

interface SecurityShieldProps {
  isPrintModalOpen?: boolean;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({ isPrintModalOpen = false }) => {
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);

  const showAlert = useCallback((message: string) => {
    setSecurityAlert(message);
    setTimeout(() => {
      setSecurityAlert(null);
    }, 4500);
  }, []);

  useEffect(() => {
    // 1. Block Right-Click Context Menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showAlert('Aksi Ditolak: Klik kanan (Context Menu) dinonaktifkan demi perlindungan konten.');
    };

    // 2. Block Copy, Cut, Paste and Screenshot Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen Key detection
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen') {
        e.preventDefault();
        // Attempt to clear clipboard if possible
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
        setIsScreenBlurred(true);
        showAlert('Peringatan: Pengambilan gambar layar dinonaktifkan demi perlindungan dokumen.');
        return;
      }

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // Prevent developer tools, view source
      if (
        e.key === 'F12' ||
        (isCtrlOrCmd && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
        (isCtrlOrCmd && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        showAlert('Aksi Ditolak: Akses ke Developer Tools / View Source dinonaktifkan.');
        return;
      }

      // Prevent Screen Capture shortcuts: Win+Shift+S or Cmd+Shift+3/4/5
      if (
        (isCtrlOrCmd && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))
      ) {
        setIsScreenBlurred(true);
        showAlert('Peringatan: Perekaman layar terdeteksi. Layar disamarkan sementara.');
        return;
      }

      // Prevent Ctrl+C / Cmd+C (Copy)
      if (isCtrlOrCmd && (e.key === 'C' || e.key === 'c')) {
        const target = e.target as HTMLElement;
        const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        // Allow copy only if explicitly necessary, or block completely to prevent leaking questions/answers
        if (!isInputField) {
          e.preventDefault();
          showAlert('Aksi Ditolak: Fitur salin teks dinonaktifkan untuk melindungi kerahasiaan dokumen.');
        }
      }

      // Prevent Ctrl+V / Cmd+V (Paste in essay fields)
      if (isCtrlOrCmd && (e.key === 'V' || e.key === 'v')) {
        const target = e.target as HTMLElement;
        // Block pasting in textareas to enforce authentic individual answering
        if (target.tagName === 'TEXTAREA') {
          e.preventDefault();
          showAlert('Jawaban esai wajib diketik mandiri. Fitur tempel teks dinonaktifkan.');
        }
      }
    };

    // 3. Handle Paste event directly on document
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA') {
        e.preventDefault();
        showAlert('Jawaban esai wajib diketik mandiri. Fitur tempel teks dinonaktifkan.');
      }
    };

    // 4. Handle Copy event directly on document
    const handleCopy = (e: ClipboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        showAlert('Fitur salin teks dinonaktifkan demi perlindungan konten.');
      }
    };

    // 5. Blur detection: When screen recorder or snipping tool grabs focus
    const handleWindowBlur = () => {
      // Don't blur if print dialog is opened
      if (!isPrintModalOpen) {
        setIsScreenBlurred(true);
      }
    };

    const handleWindowFocus = () => {
      setIsScreenBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isPrintModalOpen) {
        setIsScreenBlurred(true);
      } else {
        setIsScreenBlurred(false);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [showAlert, isPrintModalOpen]);

  return (
    <>
      {/* Repeating Background Security Watermark */}
      <div
        className="fixed inset-0 pointer-events-none z-10 select-none overflow-hidden opacity-[0.035] flex flex-wrap gap-16 p-8 items-center justify-around"
        aria-hidden="true"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="transform -rotate-25 text-xs sm:text-sm font-black text-slate-900 tracking-widest whitespace-nowrap uppercase font-mono"
          >
            KEMENTERIAN HUKUM RI · SISTEM MANAJEMEN RISIKO · DOKUMEN TERTUTUP
          </div>
        ))}
      </div>

      {/* Floating Security Alert Toast */}
      {securityAlert && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Sistem Proteksi Aktif</span>
              </div>
              <p className="mt-1 text-xs text-slate-200 leading-relaxed">
                {securityAlert}
              </p>
            </div>
            <button
              onClick={() => setSecurityAlert(null)}
              className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Anti-Screen Capture / Window Blur Overlay */}
      {isScreenBlurred && !isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
          <div className="max-w-md bg-white rounded-2xl p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
              <EyeOff className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Layar Disamarkan Sementara
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jendela aplikasi sedang tidak aktif. Demi menjaga kerahasiaan dan integritas instrumen evaluasi, konten disamarkan secara otomatis.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsScreenBlurred(false)}
                className="w-full px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Klik di Sini untuk Membuka Kembali
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
