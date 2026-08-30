import React from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { CompanyCard, ExperienceCard } from '../components/ui/Cards';
import {
  Compass,
  Sparkles,
  TrendingUp,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Cpu,
  Share2
} from 'lucide-react';

export const FeedPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { currentUser, db, getCompanyRecommendations, getTrendingTopics } = usePlaceWell();

  const studentName = currentUser?.name?.split(' ')[0] || 'Engineer';
  const recommendations = getCompanyRecommendations(currentUser?.user_id || 1);
  const trendingTopics = getTrendingTopics();
  const recentExperiences = db.interview_experiences.slice(0, 4);

  const studentResources = db.resources.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* 1. HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-brand-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
        {/* Subtle decorative glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
        

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Good morning, {studentName}.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Here's what might matter for your next placement drive based on your skills and college placement patterns.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('submit-experience')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Experience</span>
            </button>

            <button
              onClick={() => onNavigate('search')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-sm transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. PERSONALIZED COMPANY RECOMMENDATIONS */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Personalized Company Matches</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Matched by comparing your profile skills against companies' core hiring and interview stacks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('companies')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>View all companies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.slice(0, 3).map(({ company, match_percentage, matched_skills, experience_count }) => {
            const companyRoles = db.interview_experiences.filter((e) => e.company_id === company.company_id);
            const rolesCount = new Set(companyRoles.map((e) => e.role_title)).size;

            return (
              <CompanyCard
                key={company.company_id}
                company={company}
                experienceCount={experience_count}
                rolesCount={rolesCount}
                skills={matched_skills}
                matchPercentage={match_percentage}
                onClick={() => onNavigate('company-details', { companyId: company.company_id })}
              />
            );
          })}
        </div>
      </section>

      {/* 3. PREPARATION PRIORITIES & TRENDING INTELLIGENCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Prep Priorities */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-5">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Preparation Priorities</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Ranked by frequency across recent technical rounds.
            </p>
          </div>

          <div className="space-y-3">
            {/* High Priority */}
            <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-rose-700 dark:text-rose-300 uppercase tracking-wider text-[10px]">
                  High Priority
                </span>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">8+ questions</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">DSA → Graphs & BFS/DFS</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Shortest paths, topological sort, and cycle detection asked at Qualcomm, Microsoft, and Google.
              </p>
            </div>

            {/* Medium Priority */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider text-[10px]">
                  Medium Priority
                </span>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">5+ questions</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">C++ → Memory & Pointers</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Smart pointers, circular buffers, and memory alignment for embedded & systems roles.
              </p>
            </div>

            {/* Emerging */}
            <div className="p-3.5 rounded-2xl bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200/80 dark:border-cyan-800/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-cyan-700 dark:text-cyan-300 uppercase tracking-wider text-[10px]">
                  Emerging Priority
                </span>
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">3+ questions</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-sm">System Design → Caching</div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Rate limiting, cache invalidation, and low-level object-oriented patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Aggregated Interview Intelligence Digest */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Frequently Tested Interview Topics</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Aggregated from {db.rounds.length} verified rounds across all companies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trendingTopics.slice(0, 6).map(({ topic, skill, count }) => (
              <div
                key={topic.topic_id}
                onClick={() => onNavigate('search', { query: topic.topic_name })}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500 hover:bg-brand-50/30 dark:hover:bg-slate-800/60 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="space-y-1 overflow-hidden">
                  <p className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                    {topic.topic_name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.2 rounded border border-teal-200 dark:border-teal-800">
                      {skill.skill_name}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      {topic.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                    {count} rounds
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-300">
              Want to see actual coding and theory questions for these topics?
            </span>
            <button
              onClick={() => onNavigate('search')}
              className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
            >
              Open Question Bank <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. RECENT INTERVIEW EXPERIENCES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Recent Community Experiences</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Freshly submitted and verified interview breakdowns from peer college students.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('companies')}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 flex items-center gap-1"
          >
            <span>Explore all experiences</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recentExperiences.map((exp) => {
            const comp = db.companies.find((c) => c.company_id === exp.company_id) || db.companies[0];
            const author = db.users.find((u) => u.user_id === exp.user_id);

            return (
              <ExperienceCard
                key={exp.experience_id}
                experience={exp}
                company={comp}
                authorCollege={author?.college}
                authorBranch={author?.branch}
                onClick={() => onNavigate('alumni-details', { experienceId: exp.experience_id })}
              />
            );
          })}
        </div>
      </section>

      {/* 5. RECOMMENDED PREPARATION RESOURCES (RESOURCE) */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Curated Preparation Resources</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Recommended directly by alumni who cleared placements at Qualcomm, Microsoft, and Google.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {studentResources.map((res) => (
            <a
              key={res.resource_id}
              href={res.url}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-brand-50/30 dark:hover:bg-slate-800 hover:border-brand-300 dark:hover:border-brand-500 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300 bg-brand-100/70 dark:bg-brand-950/80 px-2 py-0.5 rounded-md border border-brand-200/60 dark:border-brand-800">
                  Verified Resource
                </span>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
                  {res.title}
                </h4>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400">
                <span>Access Guide</span>
                <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
};
