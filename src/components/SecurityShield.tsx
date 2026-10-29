import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ShieldAlert, EyeOff, AlertCircle, X, ShieldCheck } from 'lucide-react';

interface SecurityShieldProps {
  isPrintModalOpen?: boolean;
}

export const SecurityShield: React.FC<SecurityShieldProps> = ({ isPrintModalOpen = false }) => {
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const [isScreenBlurred, setIsScreenBlurred] = useState(false);

  // Generate a persistent session tracking watermark token for forensic identification
  const sessionToken = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('smr_security_session_id');
      if (stored) return stored;
      const newToken = 'MR-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString().slice(-4);
      sessionStorage.setItem('smr_security_session_id', newToken);
      return newToken;
    } catch {
      return 'MR-SEC-2026';
    }
  }, []);

  const showAlert = useCallback((message: string) => {
    setSecurityAlert(message);
    setTimeout(() => {
      setSecurityAlert(null);
    }, 4500);
  }, []);

  const triggerInstantObscure = useCallback((reason: string) => {
    document.body.classList.add('screen-shield-active');
    setIsScreenBlurred(true);
    showAlert(reason);

    // Overwrite clipboard if accessible
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(
        'PERINGATAN RESMI KEMENKUM RI: Tangkapan layar dinonaktifkan. Seluruh instrumen dan rubrik evaluasi manajemen risiko berstatus dokumen rahasia negara.'
      ).catch(() => {});
    }
  }, [showAlert]);

  const handleDismissObscure = () => {
    document.body.classList.remove('screen-shield-active');
    setIsScreenBlurred(false);
  };

  useEffect(() => {
    // 1. Block Context Menu (Right-Click & Long-Tap on Mobile)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showAlert('Aksi Ditolak: Klik kanan dan menu konteks dinonaktifkan demi perlindungan dokumen.');
    };

    // 2. Prevent Dragging
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // 3. Multi-Touch Gesture Detection (Android 3-Finger Screenshot Gesture)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        triggerInstantObscure('Gestur tangkapan layar 3-jari terdeteksi. Layar disamarkan secara otomatis.');
      }
    };

    // 4. Keyboard Shortcuts Interception
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;

      // PrintScreen Key (Windows / Linux)
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerInstantObscure('Peringatan: Tombol tangkapan layar (PrintScreen) terdeteksi. Konten disamarkan.');
        return;
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac Screenshots (Cmd + Shift + 3/4/5)
      if (
        (isCtrlOrCmd && e.shiftKey && (e.key === 'S' || e.key === 's')) ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key))
      ) {
        e.preventDefault();
        triggerInstantObscure('Peringatan: Pintasan perekam/tangkapan layar terdeteksi. Layar disamarkan.');
        return;
      }

      // Developer Tools (F12, Ctrl+Shift+I/J/C)
      if (
        e.key === 'F12' ||
        (isCtrlOrCmd && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        (isCtrlOrCmd && (e.key === 'U' || e.key === 'u'))
      ) {
        e.preventDefault();
        showAlert('Aksi Ditolak: Akses Developer Tools / View Source dinonaktifkan.');
        return;
      }

      // Block Save Page (Ctrl+S / Cmd+S)
      if (isCtrlOrCmd && (e.key === 'S' || e.key === 's') && !e.shiftKey) {
        e.preventDefault();
        showAlert('Aksi Ditolak: Fitur penyimpanan halaman dinonaktifkan demi kerahasiaan instrumen.');
        return;
      }

      // Block Browser Print (Ctrl+P / Cmd+P) if print modal is not explicitly open
      if (isCtrlOrCmd && (e.key === 'P' || e.key === 'p')) {
        if (!isPrintModalOpen) {
          e.preventDefault();
          showAlert('Aksi Ditolak: Pencetakan instrumen survei publik dilarang.');
          return;
        }
      }

      // Block Copy (Ctrl+C / Cmd+C) outside inputs
      if (isCtrlOrCmd && (e.key === 'C' || e.key === 'c')) {
        const target = e.target as HTMLElement;
        const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';
        if (!isInputField) {
          e.preventDefault();
          showAlert('Aksi Ditolak: Fitur salin teks dinonaktifkan.');
        }
      }

      // Block Paste in essay questions
      if (isCtrlOrCmd && (e.key === 'V' || e.key === 'v')) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA') {
          e.preventDefault();
          showAlert('Jawaban esai wajib diketik mandiri. Fitur tempel teks dinonaktifkan.');
        }
      }
    };

    // PrintScreen keyup check
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        triggerInstantObscure('Tangkapan layar terdeteksi. Konten disamarkan.');
      }
    };

    // 5. Direct Copy/Paste document handlers
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA') {
        e.preventDefault();
        showAlert('Jawaban esai wajib diketik mandiri. Fitur tempel teks dinonaktifkan.');
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      const activeEl = document.activeElement as HTMLElement;
      if (!activeEl || (activeEl.tagName !== 'INPUT' && activeEl.tagName !== 'TEXTAREA')) {
        e.preventDefault();
        showAlert('Fitur salin teks dinonaktifkan demi perlindungan konten.');
      }
    };

    // 6. Window Blur & Visibility Change (Snipping Tool & App Switcher triggers this immediately)
    const handleWindowBlur = () => {
      if (!isPrintModalOpen) {
        document.body.classList.add('screen-shield-active');
        setIsScreenBlurred(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && !isPrintModalOpen) {
        document.body.classList.add('screen-shield-active');
        setIsScreenBlurred(true);
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('dragstart', handleDragStart);
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('paste', handlePaste);
    window.addEventListener('copy', handleCopy);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('paste', handlePaste);
      window.removeEventListener('copy', handleCopy);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.classList.remove('screen-shield-active');
    };
  }, [showAlert, triggerInstantObscure, isPrintModalOpen]);

  return (
    <>
      {/* 
        High-Density Forensic Security Watermark Overlay 
        z-30 ensures watermark sits OVER all white cards, form inputs, and questions.
        pointer-events-none ensures users can click, scroll, and type without any obstruction.
      */}
      <div
        className="fixed inset-0 pointer-events-none z-30 select-none overflow-hidden flex flex-wrap gap-x-12 gap-y-16 p-4 sm:p-8 items-center justify-around opacity-[0.09] dark:opacity-[0.14]"
        aria-hidden="true"
      >
        {Array.from({ length: 36 }).map((_, i) => (
          <div
            key={i}
            className="transform -rotate-25 text-[11px] sm:text-xs font-black text-slate-900 tracking-wider whitespace-nowrap uppercase font-mono border-y border-dashed border-slate-900/40 py-1"
          >
            KEMENKUM RI · DOKUMEN TERTUTUP · DILARANG TANGKAP LAYAR · {sessionToken}
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
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-150">
          <div className="max-w-md bg-white rounded-2xl p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mx-auto">
              <EyeOff className="w-7 h-7 text-amber-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Layar Disamarkan Otomatis
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jendela aplikasi tidak aktif atau alat tangkapan layar terdeteksi. Demi menjaga kerahasiaan instrumen evaluasi manajemen risiko, konten disamarkan dan disensor.
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ID Sesi Forensik: {sessionToken}</span>
              </div>
              <p className="text-slate-500">Seluruh akses terenkripsi dan tercatat dalam log audit sistem.</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDismissObscure}
                className="w-full px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                Klik di Sini untuk Membuka Kembali Layar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
