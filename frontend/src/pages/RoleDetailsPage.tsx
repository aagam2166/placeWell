import React, { useState, useEffect } from 'react';
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
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { getRoleAnalytics } from '../services/companyApi';

export const RoleDetailsPage: React.FC<{
  companyId: number;
  roleTitle: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ companyId, roleTitle, onNavigate }) => {
  const { getRoleAggregatedInsights } = usePlaceWell();

  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [apiInsights, setApiInsights] = useState<any>(null);
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    let isMounted = true;
    getRoleAnalytics(companyId, roleTitle)
      .then((data) => {
        if (isMounted && data) {
          setApiInsights(data);
        }
      })
      .catch((err) => {
        console.warn('Live role analytics API connection note (using fallback):', err);
      });
    return () => {
      isMounted = false;
    };
  }, [companyId, roleTitle]);

  const handleSelectTopic = (topicName: string | null) => {
    setSelectedTopicFilter(topicName);
    setCurrentPage(1);
  };

  const insights = apiInsights || getRoleAggregatedInsights(companyId, roleTitle);

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
    ? frequently_asked_questions.filter((q: any) => (q.topic?.topic_name || q.topic_name) === selectedTopicFilter)
    : frequently_asked_questions;

  const totalQuestions = filteredQuestions.length;
  const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalQuestions);
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

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
                  {types.map((t: string) => (
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

      {/* 3. INTERVIEW QUESTIONS & FREQUENTLY TESTED TOPICS (MERGED SECTION) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Frequently Asked Questions & Tested Topics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Problem statements and topics aggregated for {roleTitle}. Select topics on the right to filter questions.
            </p>
          </div>

          {selectedTopicFilter && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Filter:</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950/70 px-3 py-1 rounded-xl border border-brand-200 dark:border-brand-800">
                <span>{selectedTopicFilter}</span>
                <button
                  onClick={() => handleSelectTopic(null)}
                  className="p-0.5 hover:bg-brand-200/60 dark:hover:bg-brand-800/60 rounded-full transition-colors"
                  title="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </div>
          )}
        </div>

        {/* 2/3 (Left) and 1/3 (Right) Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Questions (2/3 space) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Questions ({totalQuestions})
                </h3>
                {totalQuestions > 0 && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                    Showing {startIndex + 1}–{endIndex} of {totalQuestions}
                  </span>
                )}
              </div>

              {totalPages > 1 && (
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Page {currentPage} of {totalPages}
                </span>
              )}
            </div>

            {currentQuestions.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-2.5">
                <HelpCircle className="w-7 h-7 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No questions logged for "{selectedTopicFilter}"
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Try selecting another topic from the right or clear the filter to see all questions.
                </p>
                <button
                  onClick={() => handleSelectTopic(null)}
                  className="mt-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1"
                >
                  Clear topic filter
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {currentQuestions.map(({ question, topic, round_type }: any) => (
                  <QuestionCard
                    key={question.question_id}
                    question={question}
                    topic={topic}
                    roundType={round_type}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentPage === 1
                      ? 'text-slate-400 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed border border-transparent'
                      : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    currentPage === totalPages
                      ? 'text-slate-400 dark:text-slate-600 bg-slate-100/60 dark:bg-slate-800/40 cursor-not-allowed border border-transparent'
                      : 'text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 shadow-2xs'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right: Tested Topics Filter (1/3 space) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Interview Topics</span>
              </h3>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                Click topic to filter
              </span>
            </div>

            <TopicFrequencyBar
              topTopics={top_topics}
              selectedTopic={selectedTopicFilter}
              onSelectTopic={(t: any) => handleSelectTopic(t.topic?.topic_name || t.topic_name)}
              onClearFilter={() => handleSelectTopic(null)}
            />
          </div>
        </div>
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
          {contributors.map((contributor: any) => (
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
