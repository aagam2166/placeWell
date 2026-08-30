import React from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { ResultBadge, DifficultyStars, StatusBadge } from '../components/ui/Badges';
import { RoundAccordion } from '../components/ui/RoundAccordion';
import {
  GraduationCap,
  Building2,
  Layers,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';

export const AlumniDetailsPage: React.FC<{
  experienceId: number;
  onNavigate: (page: string, params?: any) => void;
}> = ({ experienceId, onNavigate }) => {
  const { getExperienceDetails } = usePlaceWell();

  const details = getExperienceDetails(experienceId);

  if (!details) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Experience breakdown not found</h2>
        <button
          onClick={() => onNavigate('feed')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  const { experience, company, author, rounds, topics_skills, resources } = details;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            onNavigate('role-details', {
              companyId: company.company_id,
              roleTitle: experience.role_title,
            })
          }
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to {experience.role_title} Intelligence
        </button>

        <StatusBadge status={experience.status} />
      </div>

      {/* 1. ANONYMOUS ALUMNI IDENTITY HEADER & EXPERIENCE OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
        {/* Top Gradient Header Ribbon */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          {/* Identity Block (Strictly Anonymized) */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-md shrink-0">
              {author.name ? author.name.charAt(0) : 'A'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {author.name ? author.name : 'Anonymous Alumni'}
                </h1>

                {experience.is_anonymous_public ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Identity Protected
                  </span>
                ) : (
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-900">
                    Public Contributor
                  </span>
                )}
              </div>

              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                {author.college}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {author.branch} • Class of {author.graduation_year}
              </p>
            </div>
          </div>

          <ResultBadge result={experience.result} size="lg" />
        </div>

        {/* Company & Role Drive Banner */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                {company.name} — {experience.role_title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                  {experience.year} • {experience.experience_type.toUpperCase()}
                </span>
                {experience.ctc_or_stipend && (
                  <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {experience.ctc_or_stipend}
                  </span>
                )}
                <span>• {experience.total_rounds} Total Rounds</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Overall Candidate Difficulty
            </span>
            <DifficultyStars rating={experience.overall_difficulty} size="md" />
          </div>
        </div>

        {/* 2. REVIEW SUMMARY */}
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            Interview Summary & Candidate Experience
          </h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
            "{experience.summary_text}"
          </p>
        </div>
      </div>

      {/* 3. ROUND-BY-ROUND BREAKDOWN ACCORDIONS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Round-by-Round Breakdown ({rounds.length} Rounds)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any round accordion to reveal platforms, interview questions, and candidate advice.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rounds.map((roundItem, index) => (
            <RoundAccordion
              key={roundItem.round.round_id}
              round={roundItem.round}
              topic={roundItem.topic}
              skill={roundItem.skill}
              questions={roundItem.questions}
              defaultOpen={index === 0}
            />
          ))}
        </div>
      </div>

      {/* 4. TOPICS & SKILLS EVALUATED */}
      {topics_skills.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Topics Evaluated in this Interview</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Mapped from questions asked across rounds to parent skills.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {topics_skills.map(({ topic, skill }) => (
              <div
                key={topic.topic_id}
                onClick={() => onNavigate('search', { query: topic.topic_name })}
                className="cursor-pointer"
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all">
                  <span>{topic.topic_name}</span>
                  <span className="text-[10px] uppercase font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/70 px-1.5 py-0.2 rounded border border-teal-200 dark:border-teal-800">
                    {skill.skill_name}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ATTACHED PREPARATION RESOURCES (RESOURCE) */}
      {resources.length > 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Candidate's Recommended Resources</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Material shared by the candidate to help future batches prepare.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {resources.map((res) => (
              <a
                key={res.resource_id}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-brand-50/40 dark:hover:bg-slate-800 hover:border-brand-300 dark:hover:border-brand-500 transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300 bg-teal-100/70 dark:bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-200/60 dark:border-teal-800">
                    Alumni Recommendation
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {res.title}
                  </h4>
                </div>

                <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-brand-600 dark:group-hover:text-brand-400 shrink-0 ml-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
