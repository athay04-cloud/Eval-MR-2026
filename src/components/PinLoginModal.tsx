import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, AlertCircle, KeyRound, Check } from 'lucide-react';
import { DEFAULT_PINS } from '../data/mockData';

interface PinLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PinLoginModal: React.FC<PinLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError(null);
      setShowHint(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = pin.trim();

    if (!cleanPin) {
      setError('Silakan masukkan PIN atau Sandi Pengaman.');
      return;
    }

    if (DEFAULT_PINS.includes(cleanPin)) {
      setError(null);
      onSuccess();
    } else {
      setError('PIN Pengaman tidak valid! Akses ke Portal Evaluator ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden"
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
            Portal ini berisi kisi-kisi penilaian ideal, rubrik skala 1–4, data sensitif seluruh responden satker, serta kalkulator maturitas risiko. Masukkan PIN untuk membuka lembar kerja.
          </p>

          <div>
            <label htmlFor="evaluator-pin" className="block text-xs font-semibold text-slate-700 mb-1.5">
              PIN / Sandi Pengaman Evaluator
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                id="evaluator-pin"
                type="password"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Masukkan PIN..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 tracking-wider font-mono"
                autoComplete="current-password"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <span>{showHint ? 'Sembunyikan Petunjuk PIN' : 'Lupa PIN Akses Evaluator?'}</span>
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">PIN Bawaan Sistem:</p>
                <div className="flex items-center gap-2 font-mono text-slate-700">
                  <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-semibold">123456</span>
                  <span>atau</span>
                  <span className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs font-semibold">evaluasi2026</span>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Klik tombol di bawah untuk memasukkan PIN default secara cepat:
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPin('123456');
                    setError(null);
                  }}
                  className="mt-1 px-2.5 py-1 text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium cursor-pointer"
                >
                  Gunakan PIN 123456
                </button>
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
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
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
