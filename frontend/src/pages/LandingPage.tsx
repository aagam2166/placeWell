import React from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import {
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Cpu,
  Layers,
  Sparkles,
  Award,
  Share2,
  HelpCircle,
  BookOpen,
  Briefcase,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { db } = usePlaceWell();

  const totalExperiences = db.interview_experiences.length;
  const totalCompanies = db.companies.length;
  const totalQuestions = db.questions.length;

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-12">
        {/* Subtle decorative background gradient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-400/20 via-cyan-400/20 to-teal-300/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Tag */}
            

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              Let's get you <br />
              <span className="bg-gradient-to-r from-brand-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
                Placed-Well !!!
              </span>
            </h1>

            {/* Supporting Message */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              We help students prepare smarter with real interview experiences, company insights, role intelligence, and preparation patterns shared by the student community.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('companies')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transition-all transform hover:-translate-y-0.5"
              >
                <Building2 className="w-4 h-4" />
                <span>Explore companies</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('submit-experience')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-800 shadow-card dark:shadow-dark-card hover:border-slate-300 dark:hover:border-slate-700 transition-all"
              >
                <Share2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Share your experience</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> 100% Anonymous Submissions
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" /> Verified Round Breakdown
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Role-Specific Question Bank
              </span>
            </div>
          </div>

          {/* Abstract Flow Visual: Student → Company → Role → Interview → Intelligence */}
          <div className="mt-14 max-w-5xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl p-6 sm:p-8">
              <div className="text-center mb-6">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Data-Driven Placement Flow
                </span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1">
                  How Community Intelligence Turns Real Interviews into Unfair Advantage
                </h3>
              </div>

              {/* Step Flow Ribbon */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative">
                {/* Step 1: Student */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">Student Profile</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">College, Branch, Skills & Target Roles</p>
                </div>

                {/* Step 2: Company */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">Company</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Core Hiring Tech Stack & Culture</p>
                </div>

                {/* Step 3: Role */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">Target Role</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Internship vs Placement Tracks</p>
                </div>

                {/* Step 4: Interview Rounds */}
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 text-center flex flex-col items-center justify-center space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">Real Rounds</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">OA, Tech, System Design, HR</p>
                </div>

                {/* Step 5: Aggregated Intelligence */}
                <div className="bg-gradient-to-b from-brand-600 to-cyan-700 text-white rounded-2xl p-4 text-center flex flex-col items-center justify-center space-y-2 shadow-md">
                  <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5 text-cyan-200" />
                  </div>
                  <span className="font-extrabold text-xs">Intelligence</span>
                  <p className="text-[11px] text-cyan-100">Topic Frequencies & Question Banks</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION: WHY PLACEWELL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            Everything you need for serious interview readiness
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
            No gossip, no fake glassdoor reviews. Pure structured insight from students who sat in the hot seat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card dark:shadow-dark-card hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Real experiences</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Learn from verified students who actually cleared or faced the exact technical rounds at your target company.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card dark:shadow-dark-card hover:border-cyan-300 dark:hover:border-cyan-500 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Company intelligence</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Understand what different tech companies repeatedly look for, from C++ pointer memory layout to distributed caching.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card dark:shadow-dark-card hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Role-specific prep</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Target Embedded Firmware vs Fullstack SDE with dedicated round timelines, difficulty meters, and question banks.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card dark:shadow-dark-card hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-card-hover transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Share2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Give back securely</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Share your interview experience anonymously to help juniors and peers while keeping your private contact details protected.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SECTION: EXPLORE THE ECOSYSTEM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-900/90 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="max-w-2xl mb-10">
            <h2 className="text-3xl font-extrabold mt-2">
              Structured Placement Intelligence
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Explore interconnected nodes built strictly around real interview data.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {[
              { label: 'Companies', icon: Building2, count: `${totalCompanies}+`, page: 'companies' },
              { label: 'Roles', icon: Briefcase, count: '25+', page: 'companies' },
              { label: 'Experiences', icon: FileText, count: `${totalExperiences}`, page: 'feed' },
              { label: 'Skills', icon: Cpu, count: '10+', page: 'profile' },
              { label: 'Topics', icon: Layers, count: '18+', page: 'search' },
              { label: 'Questions', icon: HelpCircle, count: `${totalQuestions}+`, page: 'search' },
              { label: 'Resources', icon: BookOpen, count: '12+', page: 'feed' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-center flex flex-col items-center justify-center space-y-1.5 transition-all group cursor-pointer"
                >
                  <Icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-base font-extrabold text-white">{item.count}</span>
                  <span className="text-[11px] font-semibold text-slate-400">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SECTION: HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            Four simple steps to get Placed-Well
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Build your profile',
              desc: 'Select your college, branch, graduation year and rate your proficiency across DSA, C++, OS, Embedded, and System Design.',
              page: 'profile',
            },
            {
              step: '02',
              title: 'Discover companies & roles',
              desc: 'See skill-matched recommendations with match percentage (e.g. Qualcomm 82% match) and deep role directories.',
              page: 'companies',
            },
            {
              step: '03',
              title: 'Learn from real rounds',
              desc: 'Read exact questions asked in OA, technical, and system design rounds with difficulty ratings and candidate notes.',
              page: 'search',
            },
            {
              step: '04',
              title: 'Share your experience',
              desc: 'Pay it forward after your placement drive with full anonymous privacy controls and give back to future batches.',
              page: 'submit-experience',
            },
          ].map((s) => (
            <div
              key={s.step}
              onClick={() => onNavigate(s.page)}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-card dark:shadow-dark-card hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-card-hover transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-2xl font-black text-brand-600/40 dark:text-brand-400/40 mb-2 block font-mono">
                  {s.step}
                </span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">{s.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
              <span className="mt-4 text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 group">
                View <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-600 via-cyan-600 to-teal-600 rounded-3xl p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Your next interview shouldn’t be a mystery.
            </h2>
            <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
              Join students and alumni from premier engineering colleges preparing smarter with community-verified placement intelligence.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigate('feed')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore PlaceWell</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
