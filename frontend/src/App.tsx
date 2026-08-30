import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { PlaceWellProvider } from './context/PlaceWellContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { FeedPage } from './pages/FeedPage';
import { SearchPage } from './pages/SearchPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { SubmitExperiencePage } from './pages/SubmitExperiencePage';
import { CompanyDetailsPage } from './pages/CompanyDetailsPage';
import { RoleDetailsPage } from './pages/RoleDetailsPage';
import { AlumniDetailsPage } from './pages/AlumniDetailsPage';
import {
  Layers,
  CheckCircle2
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

const getRoutePath = (page: string, params: any = {}) => {
  switch (page) {
    case 'landing':
      return '/';
    case 'auth':
      return '/signup';
    case 'profile':
      return '/profile';
    case 'feed':
      return '/feed';
    case 'search':
      return params?.query ? `/search?query=${encodeURIComponent(params.query)}` : '/search';
    case 'companies':
      return '/companies';
    case 'submit-experience':
      return '/submit-experience';
    case 'company-details':
      return `/companies/${params?.companyId ?? 1}`;
    case 'role-details': {
      const companyId = params?.companyId ?? 1;
      const roleTitle = params?.roleTitle ?? 'Embedded Systems Intern';
      return `/companies/${companyId}/roles/${encodeURIComponent(roleTitle)}`;
    }
    case 'alumni-details':
      return `/alumni/${params?.experienceId ?? 1}`;
    default:
      return '/';
  }
};

const getCurrentTabFromPath = (pathname: string) => {
  if (pathname === '/signup') return 'auth';
  if (pathname === '/profile') return 'profile';
  if (pathname === '/feed') return 'feed';
  if (pathname === '/search') return 'search';
  if (pathname === '/companies' || pathname.startsWith('/companies/')) return 'companies';
  if (pathname === '/submit-experience') return 'submit-experience';
  if (pathname.startsWith('/alumni/')) return 'alumni-details';
  if (pathname === '/') return 'landing';
  return 'landing';
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);
  const demoSwitcherRef = useOutsideClick<HTMLDivElement>(isDemoSwitcherOpen, () => setIsDemoSwitcherOpen(false));

  const onNavigate = (page: string, params: any = {}) => {
    const nextPath = getRoutePath(page, params);
    navigate(nextPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pagesList = [
    { id: 'landing', label: '1. Landing Page', subtitle: 'Know what you’re walking into' },
    { id: 'auth', label: '2. Sign In / Sign Up', subtitle: 'Student Authentication' },
    { id: 'profile', label: '3. Profile', subtitle: 'USER + USER_SKILL Management' },
    { id: 'feed', label: '4. My Feed / Home', subtitle: 'Skill-Matched Recommendations' },
    { id: 'search', label: '5. Universal Search', subtitle: 'Multi-Entity Categorized Search' },
    { id: 'companies', label: '6. Companies', subtitle: 'Company Directory & Filters' },
    { id: 'submit-experience', label: '7. Submit Experience', subtitle: 'Multi-Step Contribution Wizard' },
    { id: 'company-details', label: '8. Company Details', subtitle: 'Qualcomm Hiring Intelligence', defaultParams: { companyId: 1 } },
    { id: 'role-details', label: '9. Role Details', subtitle: 'Aggregated Role Intelligence', defaultParams: { companyId: 1, roleTitle: 'Embedded Systems Intern' } },
    { id: 'alumni-details', label: '10. Alumni Details', subtitle: 'Anonymous Experience Breakdown', defaultParams: { experienceId: 1 } },
  ];

  const currentTab = getCurrentTabFromPath(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
      {!['auth'].includes(currentTab) && (
        <Navbar currentTab={currentTab} onNavigate={onNavigate} />
      )}

      <main className={currentTab === 'auth' ? 'flex-1' : 'flex-1'}>
        <Routes>
          <Route path="/" element={<LandingPage onNavigate={onNavigate} />} />
          <Route path="/signup" element={<AuthPage onNavigate={onNavigate} />} />
          <Route path="/profile" element={<ProfilePage onNavigate={onNavigate} />} />
          <Route path="/feed" element={<FeedPage onNavigate={onNavigate} />} />
          <Route path="/search" element={<SearchPage initialQuery={new URLSearchParams(location.search).get('query') || ''} onNavigate={onNavigate} />} />
          <Route path="/companies" element={<CompaniesPage onNavigate={onNavigate} />} />
          <Route path="/submit-experience" element={<SubmitExperiencePage onNavigate={onNavigate} />} />
          <Route path="/companies/:companyId" element={<CompanyDetailsPage companyId={Number(useLocation().pathname.split('/')[2] || 1)} onNavigate={onNavigate} />} />
          <Route
            path="/companies/:companyId/roles/:roleTitle"
            element={
              <RoleDetailsPage
                companyId={Number(useLocation().pathname.split('/')[2] || 1)}
                roleTitle={decodeURIComponent(useLocation().pathname.split('/').slice(4).join('/')) || 'Embedded Systems Intern'}
                onNavigate={onNavigate}
              />
            }
          />
          <Route path="/alumni/:experienceId" element={<AlumniDetailsPage experienceId={Number(useLocation().pathname.split('/')[2] || 1)} onNavigate={onNavigate} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!['auth'].includes(currentTab) && (
        <Footer onNavigate={onNavigate} />
      )}

      {currentTab !== 'auth' && (
        <div className="fixed bottom-5 left-5 z-50">
          <div ref={demoSwitcherRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDemoSwitcherOpen((prev) => !prev)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-md text-white hover:bg-slate-950 dark:hover:bg-slate-700 shadow-2xl border border-slate-700/80 text-xs font-bold transition-all hover:scale-105"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>10-Page Demo Navigator</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <div
              className={`absolute bottom-12 left-0 w-80 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl transition-all duration-200 ease-out dark:border-slate-800 dark:bg-slate-900 z-50 ${
                isDemoSwitcherOpen ? 'pointer-events-auto max-h-96 opacity-100 translate-y-0' : 'pointer-events-none max-h-0 translate-y-1 border-transparent opacity-0'
              }`}
            >
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    PlaceWell 10 Pages
                  </span>
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-2 py-0.5 rounded-full border border-brand-200 dark:border-brand-900">
                    All Complete
                  </span>
                </div>

                <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                  {pagesList.map((p) => {
                    const isActive = currentTab === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setIsDemoSwitcherOpen(false);
                          onNavigate(p.id, p.defaultParams);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 font-bold border border-brand-200 dark:border-brand-800'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div>
                          <p className="truncate">{p.label}</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{p.subtitle}</p>
                        </div>
                        {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <PlaceWellProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PlaceWellProvider>
    </ThemeProvider>
  );
}

export default App;
