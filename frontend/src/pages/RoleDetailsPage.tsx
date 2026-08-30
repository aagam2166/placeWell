import React, { useState } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { OutcomeDonutChart, DifficultyHistogram, RoundFrequencyChart, TopicFrequencyBar } from '../components/ui/Charts';
import { QuestionCard, AnonymousContributorCard } from '../components/ui/Cards';
import { DifficultyStars } from '../components/ui/Badges';
import {
  Building2,
  Calendar,
  Users,
  Award,
  Layers,
  HelpCircle,
  TrendingUp,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';

export const RoleDetailsPage: React.FC<{
  companyId: number;
  roleTitle: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ companyId, roleTitle, onNavigate }) => {
  const { getRoleAggregatedInsights } = usePlaceWell();

  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);

  const insights = getRoleAggregatedInsights(companyId, roleTitle);

  if (!insights) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Role intelligence not found</h2>
        <button
          onClick={() => onNavigate('companies')}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Back to Companies
        </button>
      </div>
    );
  }

  const {
    company,
    total_experiences,
    types,
    years,
    outcomes,
    difficulty_distribution,
    avg_difficulty,
    round_structure,
    top_topics,
    frequently_asked_questions,
    contributors,
    insights: keyInsights,
  } = insights;

  // Filtered FAQ
  const filteredQuestions = selectedTopicFilter
    ? frequently_asked_questions.filter((q) => q.topic.topic_name === selectedTopicFilter)
    : frequently_asked_questions;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        type="button"
        onClick={() => onNavigate('company-details', { companyId: company.company_id })}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to {company.name}
      </button>

      {/* 1. HERO AGGREGATION BANNER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-5 sm:p-6 space-y-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-brand-50 via-cyan-50 to-transparent dark:from-brand-950/40 dark:via-slate-800/40 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 shadow-sm">
              {company.logo_url ? (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <Building2 className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/70 px-2.5 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                  {company.name}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{company.industry}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {roleTitle}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  Based on <strong>{total_experiences}</strong> verified experiences
                </span>

                <span className="text-slate-300 dark:text-slate-700">•</span>

                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Years: {years.join(', ')}
                </span>

                <span className="text-slate-300 dark:text-slate-700">•</span>

                <div className="flex items-center gap-1">
                  {types.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 2. INTERVIEW OVERVIEW: VISUAL CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Selection Outcome Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Selection Outcome Distribution</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aggregated across all reported candidates.
            </p>
          </div>

          <OutcomeDonutChart
            selected={outcomes.selected}
            rejected={outcomes.rejected}
            total={total_experiences}
          />
        </div>

        {/* Difficulty Distribution Histogram */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Reported Difficulty Ratings</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Breakdown of student ratings (1★ Easy to 5★ Very Hard).
            </p>
          </div>

          <DifficultyHistogram
            distribution={difficulty_distribution}
            total={total_experiences}
          />
        </div>

        {/* Round Structure Frequency */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Round Structure Breakdown</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Relative occurrence of OA, Tech, System Design, HR.
            </p>
          </div>

          <RoundFrequencyChart roundStructure={round_structure} />
        </div>
      </div>

      {/* 3. FREQUENTLY DISCUSSED TOPICS (INTERACTIVE) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Frequently Tested Interview Topics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aggregated from candidate rounds and question logs for {roleTitle}. Click a topic to filter questions below.
            </p>
          </div>

          {selectedTopicFilter && (
            <button
              onClick={() => setSelectedTopicFilter(null)}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/70 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-800"
            >
              <span>Clear Filter: {selectedTopicFilter}</span>
            </button>
          )}
        </div>

        <TopicFrequencyBar
          topTopics={top_topics}
          onSelectTopic={(t) => setSelectedTopicFilter(t.topic_name)}
        />
      </div>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <span>Frequently Asked Questions ({filteredQuestions.length})</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Actual problem statements and theoretical questions reported for {roleTitle}.
            </p>
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
            No questions logged for this topic filter yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map(({ question, topic, round_type }) => (
              <QuestionCard
                key={question.question_id}
                question={question}
                topic={topic}
                roundType={round_type}
              />
            ))}
          </div>
        )}
      </div>

      {/* 5. PEOPLE WHO SHARED EXPERIENCES (STRICT ANONYMITY RULE) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <span>Peer Experiences & Verified Alumni Submissions</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Real candidates who interviewed for this role. Names and private info are strictly hidden to preserve anonymity.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>100% Anonymity Protected</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contributors.map((contributor) => (
            <AnonymousContributorCard
              key={contributor.experience_id}
              contributor={contributor}
              onClick={() =>
                onNavigate('alumni-details', { experienceId: contributor.experience_id })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
