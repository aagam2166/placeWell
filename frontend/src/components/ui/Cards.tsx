import React from 'react';
import { Company, InterviewExperience, Skill, Question, Topic } from '../../types/database';
import { ResultBadge, DifficultyStars, SkillPill } from './Badges';
import { Building2, ArrowRight, Briefcase, GraduationCap, Calendar, FileText, ExternalLink, Code2, HelpCircle } from 'lucide-react';

export const CompanyCard: React.FC<{
  company: Company;
  experienceCount?: number;
  rolesCount?: number;
  skills?: { skill: Skill; usage_type: 'core_stack' | 'frequent_interview_topic' }[] | Skill[];
  matchPercentage?: number;
  onClick: () => void;
}> = ({ company, experienceCount = 0, rolesCount = 0, skills = [], matchPercentage, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-card dark:shadow-dark-card hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:border-brand-300 dark:hover:border-brand-500 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
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
              <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {company.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{company.industry}</p>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl mb-4 border border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>
              <strong className="font-bold text-slate-900 dark:text-white">{experienceCount}</strong> Experiences
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
            <Briefcase className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>
              <strong className="font-bold text-slate-900 dark:text-white">{rolesCount}</strong> Roles
            </span>
          </div>
        </div>

        {/* Skills Tag list */}
        {skills.length > 0 && (
          <div className="space-y-1.5 mb-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Core Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 4).map((sItem) => {
                const s = 'skill' in sItem ? sItem.skill : sItem;
                const usage = 'usage_type' in sItem ? sItem.usage_type : undefined;
                return <SkillPill key={s.skill_id} name={s.skill_name} usageType={usage} />;
              })}
              {skills.length > 4 && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold px-2 py-0.5">
                  +{skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
        <span>View company intelligence</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const RoleCard: React.FC<{
  roleTitle: string;
  experienceCount: number;
  avgDifficulty: number;
  types?: ('internship' | 'placement')[];
  onClick: () => void;
}> = ({ roleTitle, experienceCount, avgDifficulty, types = [], onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-card dark:shadow-dark-card hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:border-cyan-400 dark:hover:border-cyan-500 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {roleTitle}
          </h4>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900">
            {experienceCount} {experienceCount === 1 ? 'experience' : 'experiences'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {types.map((t) => (
            <span
              key={t}
              className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1">Average Interview Difficulty</p>
          <DifficultyStars rating={avgDifficulty} size="sm" />
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-cyan-700 dark:text-cyan-400 group-hover:text-cyan-800 dark:group-hover:text-cyan-300">
        <span>Explore role intelligence</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const ExperienceCard: React.FC<{
  experience: InterviewExperience;
  company: Company;
  authorCollege?: string;
  authorBranch?: string;
  onClick: () => void;
}> = ({ experience, company, authorCollege = 'VJTI', authorBranch = 'Computer Engineering', onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-card dark:shadow-dark-card hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:border-brand-300 dark:hover:border-brand-500 transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Company and Result */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-1 flex items-center justify-center shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {company.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{experience.role_title}</p>
            </div>
          </div>
          <ResultBadge result={experience.result} size="sm" />
        </div>

        {/* Anonymous contributor tag */}
        <div className="flex items-center gap-2 py-1 px-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-xs text-slate-600 dark:text-slate-300 mb-3 border border-slate-100 dark:border-slate-800">
          <GraduationCap className="w-3.5 h-3.5 text-brand-500 shrink-0" />
          <span className="truncate">
            <strong>{authorCollege}</strong> • {authorBranch}
          </span>
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            <Calendar className="w-3 h-3 text-slate-400" />
            {experience.year} • {experience.experience_type.toUpperCase()}
          </span>

          {experience.ctc_or_stipend && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              {experience.ctc_or_stipend}
            </span>
          )}

          <span className="text-slate-400">•</span>
          <span>{experience.total_rounds} Rounds</span>
        </div>

        {/* Difficulty */}
        <div className="mb-3">
          <DifficultyStars rating={experience.overall_difficulty} size="sm" />
        </div>

        {/* Summary excerpt */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-4">
          "{experience.summary_text}"
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
        <span>Read full round breakdown</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const AnonymousContributorCard: React.FC<{
  contributor: {
    experience_id: number;
    college: string;
    branch: string;
    graduation_year: number;
    experience_year: number;
    experience_type: 'internship' | 'placement';
    result: 'selected' | 'rejected';
    overall_difficulty: number;
    summary_text: string;
  };
  onClick: () => void;
}> = ({ contributor, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-card dark:shadow-dark-card hover:shadow-card-hover dark:hover:shadow-dark-card-hover hover:border-brand-300 dark:hover:border-brand-500 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-900 dark:text-white">Anonymous Alumni</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded">
                {contributor.graduation_year}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {contributor.college} • {contributor.branch}
            </p>
          </div>
        </div>

        <ResultBadge result={contributor.result} size="sm" />
      </div>

      <div className="flex items-center gap-3 my-2 text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {contributor.experience_type === 'internship' ? 'Internship' : 'Placement'} ({contributor.experience_year})
        </span>
        <DifficultyStars rating={contributor.overall_difficulty} size="sm" />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic mb-3">
        "{contributor.summary_text}"
      </p>

      <div className="flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300 pt-2 border-t border-slate-100 dark:border-slate-800">
        <span>View experience details</span>
        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export const QuestionCard: React.FC<{
  question: Question;
  topic?: Topic;
  roundType?: string;
  companyName?: string;
  roleTitle?: string;
}> = ({ question, topic, roundType, companyName, roleTitle }) => {
  const typeIcons: { [key: string]: React.ReactNode } = {
    coding: <Code2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
    theory: <FileText className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
    puzzle: <HelpCircle className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
  };

  const typeLabels: { [key: string]: string } = {
    coding: 'Coding Problem',
    theory: 'Theoretical / Architecture',
    puzzle: 'Brainteaser / Puzzle',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-4 shadow-2xs hover:border-cyan-300 dark:hover:border-cyan-500 transition-all space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {typeIcons[question.question_type]}
            {typeLabels[question.question_type] || question.question_type}
          </span>

          {topic && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
              {topic.topic_name}
            </span>
          )}
          {roundType && (
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              {roundType}
            </span>
          )}
        </div>

        <DifficultyStars rating={question.difficulty} size="sm" />
      </div>

      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
        {question.question_text}
      </p>

      {(companyName || question.reference_link) && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {companyName && (
            <span>
              Asked at <strong className="text-slate-800 dark:text-slate-200">{companyName}</strong> ({roleTitle || 'SDE'})
            </span>
          )}

          {question.reference_link && (
            <a
              href={question.reference_link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 ml-auto"
            >
              <span>Practice Reference</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </div>
  );
};
