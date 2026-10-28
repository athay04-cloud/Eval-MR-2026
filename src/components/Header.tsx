import React from 'react';
import { ShieldCheck, LogIn, LogOut, FileText, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  currentPortal: 'public' | 'evaluator';
  isEvaluatorLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onSwitchPortal: (portal: 'public' | 'evaluator') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPortal,
  isEvaluatorLoggedIn,
  onOpenLoginModal,
  onLogout,
  onSwitchPortal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchPortal('public');
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-700 transition-colors"
            >
              SIM-RISIKO KEMENKUM
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSwitchPortal('public')}
              className={`flex items-center gap-2 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPortal === 'public' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Formulir Survei Responden</span>
            </button>

            {isEvaluatorLoggedIn && (
              <button
                onClick={() => onSwitchPortal('evaluator')}
                className={`flex items-center gap-2 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  currentPortal === 'evaluator' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Portal Evaluator</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            {isEvaluatorLoggedIn ? (
              <div className="flex items-center gap-2.5">
                <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md">
                  Akses Evaluator Aktif
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Keluar dari sesi evaluator"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300" />
                <span>Masuk Portal Evaluator</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
