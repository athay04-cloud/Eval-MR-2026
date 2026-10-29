import { ShieldCheck, LogIn, LogOut, FileText, LayoutDashboard, KeyRound } from 'lucide-react';

interface HeaderProps {
  currentPortal: 'public' | 'evaluator';
  isEvaluatorLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onLogout: () => void;
  onSwitchPortal: (portal: 'public' | 'evaluator') => void;
  onOpenChangePinModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPortal,
  isEvaluatorLoggedIn,
  onOpenLoginModal,
  onLogout,
  onSwitchPortal,
  onOpenChangePinModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-6 md:gap-8 h-14 sm:h-16">
          {/* Zone 1: Brand Wordmark (Responsive, never overflows on phone) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-amber-400" />
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onSwitchPortal('public');
              }}
              className="flex items-baseline gap-1 sm:gap-1.5 hover:opacity-90 transition-opacity truncate"
            >
              <span className="text-xs sm:text-base md:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                SIM-RISIKO
              </span>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 whitespace-nowrap">
                KEMENKUM
              </span>
            </a>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onSwitchPortal('public')}
              className={`flex items-center gap-2 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentPortal === 'public' ? 'text-slate-950 font-semibold border-b-2 border-slate-900 pb-0.5' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Formulir Survei</span>
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

          {/* Zone 3: Primary Action (Fully Mobile Responsive) */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {isEvaluatorLoggedIn ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Mobile View Switcher Tabs (when logged in on mobile) */}
                <div className="flex md:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => onSwitchPortal('public')}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      currentPortal === 'public'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Formulir Publik"
                  >
                    <FileText className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSwitchPortal('evaluator')}
                    className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                      currentPortal === 'evaluator'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    title="Portal Evaluator"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="hidden lg:inline-block text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md whitespace-nowrap">
                  Akses Evaluator
                </span>

                {onOpenChangePinModal && (
                  <button
                    onClick={onOpenChangePinModal}
                    className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    title="Ubah PIN Pengaman Evaluator"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="hidden sm:inline">Ubah PIN</span>
                  </button>
                )}

                <button
                  onClick={onLogout}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  title="Keluar dari sesi evaluator"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span className="hidden sm:inline">Portal </span>
                <span>Evaluator</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
