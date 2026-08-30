import React, { useEffect, useRef, useState } from 'react';
import { usePlaceWell } from '../../context/PlaceWellContext';
import { useTheme } from '../../context/ThemeContext';
import logoImg from '../../assets/logo.png';
import {
  Compass,
  Building2,
  Search,
  PlusCircle,
  User as UserIcon,
  LogOut,
  Sparkles,
  Menu,
  X,
  RotateCcw,
  CheckCircle2,
  Sun,
  Moon
} from 'lucide-react';

const useOutsideClick = <T extends HTMLElement>(isOpen: boolean, onClose: () => void) => {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, onClose]);

  return ref;
};

interface NavbarProps {
  currentTab: string;
  onNavigate: (page: string, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { currentUser, signOut, resetDatabase } = usePlaceWell();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);
  const userMenuRef = useOutsideClick<HTMLDivElement>(isUserMenuOpen, () => setIsUserMenuOpen(false));
  const mobileMenuRef = useOutsideClick<HTMLDivElement>(isMobileMenuOpen, () => setIsMobileMenuOpen(false));

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 3000);
  };

  const navLinks = [
    { id: 'landing', label: 'Overview', icon: Sparkles },
    { id: 'feed', label: 'My Feed', icon: Compass },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'search', label: 'Search', icon: Search },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => onNavigate(currentUser ? 'feed' : 'landing')}
                className="flex items-center gap-2.5 text-left group focus:outline-none"
              >
                <img src={logoImg} alt="PlaceWell Logo" className="w-9 h-9 object-contain group-hover:scale-105 transition-transform" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Place<span className="text-brand-600 dark:text-brand-400">Well</span>
                    </span>
                  </div>
                </div>
              </button>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const isActive = currentTab === link.id;
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => onNavigate(link.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 shadow-2xs font-bold border border-brand-200/50 dark:border-brand-800/60'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400 dark:text-slate-500'}`} />
                      {link.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right-Side Actions */}
            <div className="flex items-center gap-3">
              {/* Submit Experience CTA */}
              <button
                type="button"
                onClick={() => onNavigate('submit-experience')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-700 hover:to-cyan-700 text-white shadow-md shadow-brand-600/25 hover:shadow-lg hover:shadow-brand-600/35 transition-all transform active:scale-98"
              >
                <PlusCircle className="w-4 h-4 text-cyan-200" />
                <span className="hidden sm:inline">Share Experience</span>
                <span className="sm:hidden">Share</span>
              </button>

              {/* User Avatar & Menu */}
              {currentUser ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsUserMenuOpen((prev) => !prev);
                    }}
                    className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow-sm ring-2 ring-brand-500/20">
                      {currentUser.name.charAt(0)}
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div
                    className={`absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 py-2 z-50 transition-all duration-200 ease-out ${
                      isUserMenuOpen
                        ? 'pointer-events-auto max-h-96 opacity-100 translate-y-0'
                        : 'pointer-events-none max-h-0 translate-y-1 border-transparent opacity-0'
                    }`}
                  >
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser.college}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-900">
                          {currentUser.branch} • {currentUser.graduation_year}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onNavigate('profile');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <UserIcon className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          Student Profile & Skills
                        </button>

                        {/* <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onNavigate('feed');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                        >
                          <Compass className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                          Personalized Placement Feed
                        </button> */}

                        {/* <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            resetDatabase();
                            triggerToast('Database state reset to default demo records.');
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 flex items-center gap-2"
                        >
                          <RotateCcw className="w-4 h-4 text-amber-500" />
                          Reset Sample Demo State
                        </button> */}
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('auth')}
                  className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>
              )}

              {/* Light / Dark Mode Toggle Button (to the right of the profile icon) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all shadow-xs border border-slate-200 dark:border-slate-700 group focus:outline-none"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-700 group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Mobile menu toggle */}
              <div ref={mobileMenuRef} className="md:hidden relative">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div
                  className={`absolute right-0 top-12 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl transition-all duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1 border-transparent'
                  }`}
                >
                  <div className="px-4 py-4 space-y-2">
                    {navLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = currentTab === link.id;
                      return (
                        <button
                          key={link.id}
                          type="button"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            onNavigate(link.id);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                            isActive
                              ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {link.label}
                        </button>
                      );
                    })}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-400"
                      >
                        {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          onNavigate('submit-experience');
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Share Experience
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{showToast}</span>
        </div>
      )}
    </>
  );
};
