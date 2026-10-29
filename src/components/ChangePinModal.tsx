import React, { useState, useEffect } from 'react';
import { KeyRound, X, Check, AlertCircle, Shield, RotateCcw } from 'lucide-react';
import {
  verifyEvaluatorPin,
  setCustomEvaluatorPin,
  resetCustomEvaluatorPin,
  hasCustomPin,
} from '../data/mockData';

interface ChangePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const ChangePinModal: React.FC<ChangePinModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast,
}) => {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isCustomActive, setIsCustomActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentPin('');
      setNewPin('');
      setConfirmPin('');
      setError(null);
      setIsCustomActive(hasCustomPin());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPin.trim()) {
      setError('Masukkan PIN Anda saat ini terlebih dahulu.');
      return;
    }

    if (!verifyEvaluatorPin(currentPin)) {
      setError('PIN saat ini salah. Verifikasi otorisasi gagal.');
      return;
    }

    const trimmedNew = newPin.trim();
    if (trimmedNew.length < 6) {
      setError('PIN baru minimal harus 6 karakter untuk memastikan keamanan portal.');
      return;
    }

    if (trimmedNew !== confirmPin.trim()) {
      setError('Konfirmasi PIN baru tidak sesuai.');
      return;
    }

    setCustomEvaluatorPin(trimmedNew);
    if (onSuccessToast) {
      onSuccessToast('PIN akses Evaluator berhasil diperbarui.');
    }
    onClose();
  };

  const handleResetToDefault = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset PIN Evaluator ke setelan default sistem?')) {
      resetCustomEvaluatorPin();
      if (onSuccessToast) {
        onSuccessToast('PIN Evaluator dikembalikan ke setelan standar sistem.');
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-change-pin-title"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h3 id="modal-change-pin-title" className="text-base font-bold text-slate-900">
                Ubah PIN Akses Evaluator
              </h3>
              <p className="text-xs text-slate-500">Perbarui kunci pengaman lembar kerja evaluasi</p>
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
          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
            <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
            <p className="leading-relaxed">
              Jaga kerahasiaan PIN ini. Jangan membagikan PIN kepada pihak responden atau operator satuan kerja demi menjaga integritas rubrik penilaian.
            </p>
          </div>

          <div>
            <label htmlFor="current-pin" className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Saat Ini
            </label>
            <input
              id="current-pin"
              type="password"
              value={currentPin}
              onChange={(e) => {
                setCurrentPin(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Masukkan PIN saat ini..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono tracking-wider"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label htmlFor="new-pin" className="block text-xs font-semibold text-slate-700 mb-1">
              PIN Baru (Minimal 6 Karakter)
            </label>
            <input
              id="new-pin"
              type="password"
              value={newPin}
              onChange={(e) => {
                setNewPin(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Masukkan PIN baru..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono tracking-wider"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label htmlFor="confirm-pin" className="block text-xs font-semibold text-slate-700 mb-1">
              Konfirmasi PIN Baru
            </label>
            <input
              id="confirm-pin"
              type="password"
              value={confirmPin}
              onChange={(e) => {
                setConfirmPin(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ketik ulang PIN baru..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 font-mono tracking-wider"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {isCustomActive && (
            <div className="pt-1">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kembalikan ke PIN Default Sistem</span>
              </button>
            </div>
          )}

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
              <span>Simpan PIN Baru</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
