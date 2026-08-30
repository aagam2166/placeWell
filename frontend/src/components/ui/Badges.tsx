import React from 'react';
import { ExperienceResult, ExperienceStatus, RoundType, TopicCategory, ProficiencyLevel, CompanySkillUsageType } from '../../types/database';
import { Star, CheckCircle2, XCircle, Clock, ShieldCheck, Sparkles, BookOpen, Layers, Cpu, Terminal } from 'lucide-react';

export const ResultBadge: React.FC<{ result: ExperienceResult; size?: 'sm' | 'md' | 'lg' }> = ({
  result,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold',
  }[size];

  switch (result) {
    case 'selected':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs ${sizeClasses}`}>
          <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400'} />
          Selected
        </span>
      );
    case 'rejected':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 shadow-xs ${sizeClasses}`}>
          <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-rose-600 dark:text-rose-400'} />
          Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/80 shadow-xs ${sizeClasses}`}>
          <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5 text-rose-600 dark:text-rose-400'} />
          Rejected
        </span>
      );
  }
};

export const DifficultyStars: React.FC<{
  rating: number;
  showText?: boolean;
  size?: 'sm' | 'md';
}> = ({ rating, showText = true, size = 'md' }) => {
  const starCount = Math.min(Math.max(Math.round(rating), 1), 5);
  const labels: { [key: number]: string } = {
    1: 'Easy',
    2: 'Moderate',
    3: 'Intermediate',
    4: 'Hard',
    5: 'Very Hard',
  };

  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`${starSize} ${
              s <= starCount
                ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                : 'text-slate-200 dark:text-slate-700 fill-slate-100 dark:fill-slate-800'
            }`}
          />
        ))}
      </div>
      {showText && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {rating.toFixed(1)} <span className="text-slate-400 dark:text-slate-500 font-normal">({labels[starCount]})</span>
        </span>
      )}
    </div>
  );
};

export const RoundTypeBadge: React.FC<{ roundType: RoundType; roundNumber?: number }> = ({
  roundType,
  roundNumber,
}) => {
  const styles: { [key in RoundType]: { bg: string; text: string; border: string; label: string } } = {
    OA: { bg: 'bg-cyan-50 dark:bg-cyan-950/70', text: 'text-cyan-700 dark:text-cyan-300', border: 'border-cyan-200 dark:border-cyan-800', label: 'Online Assessment' },
    Tech: { bg: 'bg-blue-50 dark:bg-blue-950/70', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800', label: 'Technical Interview' },
    HR: { bg: 'bg-purple-50 dark:bg-purple-950/70', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', label: 'HR / Behavioral' },
    SysDesign: { bg: 'bg-indigo-50 dark:bg-indigo-950/70', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800', label: 'System Design' },
    GD: { bg: 'bg-teal-50 dark:bg-teal-950/70', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800', label: 'Group Discussion' },
  };

  const style = styles[roundType] || styles.Tech;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
      {roundNumber ? `Round ${roundNumber}: ` : ''}
      {style.label}
    </span>
  );
};

export const SkillPill: React.FC<{
  name: string;
  proficiency?: ProficiencyLevel;
  usageType?: CompanySkillUsageType;
  interactive?: boolean;
  onClick?: () => void;
}> = ({ name, proficiency, usageType, interactive = false, onClick }) => {
  const proficiencyColors: { [key in ProficiencyLevel]: string } = {
    beginner: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    intermediate: 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    advanced: 'bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-950/80 dark:to-teal-950/80 text-brand-700 dark:text-teal-300 border-brand-200 dark:border-teal-800 font-semibold',
  };

  const usageColors: { [key in CompanySkillUsageType]: string } = {
    core_stack: 'bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800 font-semibold',
    frequent_interview_topic: 'bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 font-medium',
  };

  let badgeStyle = 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  if (proficiency) badgeStyle = proficiencyColors[proficiency];
  if (usageType) badgeStyle = usageColors[usageType];

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border ${badgeStyle} ${
        interactive ? 'cursor-pointer hover:border-brand-400 hover:shadow-xs transition-all' : ''
      }`}
    >
      <span>{name}</span>
      {proficiency && (
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 ml-1">
          • {proficiency}
        </span>
      )}
      {usageType && (
        <span className="text-[10px] uppercase font-bold tracking-wider opacity-70 ml-1">
          • {usageType === 'core_stack' ? 'Core' : 'Frequent'}
        </span>
      )}
    </span>
  );
};

export const TopicPill: React.FC<{
  name: string;
  category?: TopicCategory;
  onClick?: () => void;
}> = ({ name, category = 'dsa', onClick }) => {
  const categoryIcons: { [key in TopicCategory]: React.ReactNode } = {
    dsa: <Cpu className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />,
    tech_stack: <Terminal className="w-3 h-3 text-blue-600 dark:text-blue-400" />,
    subject: <Layers className="w-3 h-3 text-teal-600 dark:text-teal-400" />,
    soft_skill: <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />,
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-cyan-400 dark:hover:border-cyan-500 hover:text-cyan-800 dark:hover:text-cyan-300 transition-all ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {categoryIcons[category]}
      <span>{name}</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ExperienceStatus }> = ({ status }) => {
  switch (status) {
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
          <ShieldCheck className="w-3 h-3" />
          Verified
        </span>
      );
    case 'published':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          <Sparkles className="w-3 h-3" />
          Published
        </span>
      );
    case 'draft':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-3 h-3" />
          Draft
        </span>
      );
  }
};
