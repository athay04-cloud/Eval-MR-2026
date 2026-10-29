import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, AlertCircle, KeyRound, Check, Eye, EyeOff, ShieldAlert, HelpCircle } from 'lucide-react';
import { verifyEvaluatorPin } from '../data/mockData';

interface PinLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showHelpNotice, setShowHelpNotice] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus and reset state when opened
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setShowPassword(false);
      setError(null);
      setShowHelpNotice(false);
      if (lockoutTimer <= 0) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }
  }, [isOpen, lockoutTimer]);

  // Lockout countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) return;

    const cleanPin = pin.trim();

    if (!cleanPin) {
      setError('Silakan masukkan PIN atau Sandi Pengaman Evaluator.');
      return;
    }

    if (verifyEvaluatorPin(cleanPin)) {
      setError(null);
      setFailedAttempts(0);
      onSuccess();
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      
      if (nextFailed >= 3) {
        setLockoutTimer(30);
        setError('Otorisasi gagal 3 kali berturut-turut. Demi keamanan sistem, akses ditangguhkan selama 30 detik.');
      } else {
        setError(`PIN Pengaman tidak valid! Percobaan tersisa: ${3 - nextFailed} kali.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-pin-title"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
              <Lock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 id="modal-pin-title" className="text-base font-bold text-slate-900">
                Autentikasi Portal Evaluator
              </h3>
              <p className="text-xs text-slate-500">Kawasan Terproteksi Tim Penilai Manajemen Risiko</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Portal ini berisi kisi-kisi penilaian ideal, rubrik skala 1–4, data sensitif seluruh responden satuan kerja, serta kalkulator maturitas risiko. Masukkan PIN otoritas untuk membuka lembar kerja.
          </p>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="evaluator-pin" className="block text-xs font-semibold text-slate-700">
                PIN / Sandi Pengaman Evaluator
              </label>
              {lockoutTimer > 0 && (
                <span className="text-[11px] font-semibold text-rose-600 animate-pulse">
                  Terkunci: {lockoutTimer}s
                </span>
              )}
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                id="evaluator-pin"
                type={showPassword ? 'text' : 'password'}
                value={pin}
                disabled={lockoutTimer > 0}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error && lockoutTimer <= 0) setError(null);
                }}
                placeholder={lockoutTimer > 0 ? 'Sistem dikunci sementara...' : 'Masukkan PIN pengaman...'}
                className="w-full pl-3.5 pr-20 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 tracking-wider font-mono disabled:opacity-60 disabled:cursor-not-allowed"
                autoComplete="current-password"
              />
              <div className="absolute right-2 top-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors cursor-pointer"
                  title={showPassword ? 'Sembunyikan karakter' : 'Tampilkan karakter'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <KeyRound className="w-4 h-4 text-slate-400 mr-1.5" />
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHelpNotice(!showHelpNotice)}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>{showHelpNotice ? 'Sembunyikan Informasi Bantuan' : 'Kendala Akses atau Lupa PIN?'}</span>
            </button>
            {showHelpNotice && (
              <div className="mt-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Protokol Keamanan Akses</span>
                </div>
                <p className="leading-relaxed text-[11px] text-slate-600">
                  Akses ke lembar kerja dan rubrik penilaian bersifat rahasia dan hanya diberikan kepada Tim Penilai / Inspektorat Jenderal Kementerian Hukum RI guna menjamin objektivitas evaluasi.
                </p>
                <div className="p-2.5 bg-white border border-slate-200 rounded text-[11px] text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-800">Bantuan Resmi & Verifikasi Penilai:</p>
                  <p>Hubungi Administrator Satgas Manajemen Risiko / Sekretariat Inspektorat Wilayah melalui kanal kedinasan.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={lockoutTimer > 0}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Verifikasi & Masuk</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
