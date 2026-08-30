import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src={logoImg} alt="PlaceWell Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Place<span className="text-brand-600 dark:text-brand-400">Well</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              PlaceWell empowers college students with structured, verified, and community-shared placement intelligence and real interview breakdowns.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Anonymity Protected</span>
            </div>
          </div>

          {/* Navigation Col */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button type="button" onClick={() => onNavigate('landing')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Landing Overview
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('feed')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Personalized Feed
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('companies')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Company Directory
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('search')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Universal Search
                </button>
              </li>
            </ul>
          </div>

          {/* Placement Intelligence */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">Intelligence</h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <li>
                <button type="button" onClick={() => onNavigate('companies')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Skill Requirements
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('search')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('submit-experience')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Share Your Experience
                </button>
              </li>
              <li>
                <button type="button" onClick={() => onNavigate('profile')} className="hover:text-brand-600 dark:hover:text-brand-400">
                  Student Skill Matching
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Student Pledge */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white mb-3">Community Integrity</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              PlaceWell guarantees student identity safety. When an experience is marked anonymous, student names, phone numbers, and email addresses are never publicly visible.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} PlaceWell. Built for modern college placement preparation.</p>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for engineering students everywhere</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
