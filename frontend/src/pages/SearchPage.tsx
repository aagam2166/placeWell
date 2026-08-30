import React, { useState } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { ExperienceType, ExperienceResult } from '../types/database';
import { CompanyCard, RoleCard, ExperienceCard, QuestionCard } from '../components/ui/Cards';
import { TopicPill } from '../components/ui/Badges';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import {
  Search as SearchIcon,
  Building2,
  Briefcase,
  Layers,
  HelpCircle,
  FileText,
  X
} from 'lucide-react';

export const SearchPage: React.FC<{
  initialQuery?: string;
  onNavigate: (page: string, params?: any) => void;
}> = ({ initialQuery = '', onNavigate }) => {
  const { db, searchAll } = usePlaceWell();

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'companies' | 'roles' | 'topics' | 'questions' | 'experiences'>('all');

  // Filters
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | undefined>();
  const [selectedExpType, setSelectedExpType] = useState<ExperienceType | undefined>();
  const [selectedResult, setSelectedResult] = useState<ExperienceResult | undefined>();
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | undefined>();
  const [selectedSkillId, setSelectedSkillId] = useState<number | undefined>();

  const results = searchAll(query, {
    companyId: selectedCompanyId,
    experienceType: selectedExpType,
    result: selectedResult,
    difficulty: selectedDifficulty,
    skillId: selectedSkillId,
  });

  const clearAllFilters = () => {
    setSelectedCompanyId(undefined);
    setSelectedExpType(undefined);
    setSelectedResult(undefined);
    setSelectedDifficulty(undefined);
    setSelectedSkillId(undefined);
    setQuery('');
  };

  const hasActiveFilters =
    Boolean(query) ||
    Boolean(selectedCompanyId) ||
    Boolean(selectedExpType) ||
    Boolean(selectedResult) ||
    Boolean(selectedDifficulty) ||
    Boolean(selectedSkillId);

  const totalResultsCount =
    results.companies.length +
    results.roles.length +
    results.topics.length +
    results.questions.length +
    results.experiences.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. SEARCH HEADER & INPUT */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
        
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Search PlaceWell
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search across companies, target roles, interview questions, topics, and real student experiences.
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="relative">
          <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies, roles, topics, questions (e.g., 'Qualcomm', 'Pointers', 'Graphs', 'SDE')..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Toolbar (Desktop) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Company Filter */}
          <SearchableSelect
            value={selectedCompanyId ?? ''}
            onChange={(value) => setSelectedCompanyId(value === '' ? undefined : Number(value))}
            options={[
              { value: '', label: 'All Companies' },
              ...db.companies.map((c) => ({ value: c.company_id, label: c.name })),
            ]}
            placeholder="All Companies"
            searchable
            buttonClassName="min-w-[220px] w-[220px]"
          />

          {/* Skill Filter */}
          <SearchableSelect
            value={selectedSkillId ?? ''}
            onChange={(value) => setSelectedSkillId(value === '' ? undefined : Number(value))}
            options={[
              { value: '', label: 'All Skills' },
              ...db.skills.map((s) => ({ value: s.skill_id, label: s.skill_name })),
            ]}
            placeholder="All Skills"
            searchable
            buttonClassName="min-w-[190px] w-[190px]"
          />

          {/* Experience Type Filter */}
          <SearchableSelect
            value={selectedExpType ?? ''}
            onChange={(value) => setSelectedExpType((value as ExperienceType) || undefined)}
            options={[
              { value: '', label: 'All Types (Intern / Placement)' },
              { value: 'internship', label: 'Internship Only' },
              { value: 'placement', label: 'Full-time Placement' },
            ]}
            placeholder="All Types (Intern / Placement)"
            buttonClassName="min-w-[220px] w-[220px]"
          />

          {/* Outcome Result Filter */}
          <SearchableSelect
            value={selectedResult ?? ''}
            onChange={(value) => setSelectedResult((value as ExperienceResult) || undefined)}
            options={[
              { value: '', label: 'All Outcomes' },
              { value: 'selected', label: 'Selected' },
              { value: 'rejected', label: 'Rejected' },
            ]}
            placeholder="All Outcomes"
            buttonClassName="min-w-[180px] w-[180px]"
          />

          {/* Difficulty Filter */}
          <SearchableSelect
            value={selectedDifficulty ?? ''}
            onChange={(value) => setSelectedDifficulty(value === '' ? undefined : Number(value))}
            options={[
              { value: '', label: 'Any Difficulty' },
              { value: 1, label: '1 Star (Easy)' },
              { value: 2, label: '2 Stars (Moderate)' },
              { value: 3, label: '3 Stars (Medium)' },
              { value: 4, label: '4 Stars (Hard)' },
              { value: 5, label: '5 Stars (Very Hard)' },
            ]}
            placeholder="Any Difficulty"
            buttonClassName="min-w-[180px] w-[180px]"
          />

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-rose-800 transition-colors ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 2. CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Results', count: totalResultsCount },
          { id: 'companies', label: 'Companies', count: results.companies.length, icon: Building2 },
          { id: 'roles', label: 'Roles', count: results.roles.length, icon: Briefcase },
          { id: 'topics', label: 'Topics', count: results.topics.length, icon: Layers },
          { id: 'questions', label: 'Questions', count: results.questions.length, icon: HelpCircle },
          { id: 'experiences', label: 'Experiences', count: results.experiences.length, icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-brand-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. SEARCH RESULTS DISPLAY */}
      <div className="space-y-10">
        {/* COMPANIES SECTION */}
        {(activeTab === 'all' || activeTab === 'companies') && results.companies.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Companies ({results.companies.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.companies.map((c) => (
                <CompanyCard
                  key={c.company_id}
                  company={c}
                  experienceCount={c.experience_count}
                  rolesCount={c.roles_count}
                  skills={c.skills}
                  onClick={() => onNavigate('company-details', { companyId: c.company_id })}
                />
              ))}
            </div>
          </section>
        )}

        {/* ROLES SECTION */}
        {(activeTab === 'all' || activeTab === 'roles') && results.roles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <span>Roles ({results.roles.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {results.roles.map((r, i) => (
                <RoleCard
                  key={`${r.company.company_id}-${r.role_title}-${i}`}
                  roleTitle={`${r.company.name} — ${r.role_title}`}
                  experienceCount={r.experience_count}
                  avgDifficulty={r.avg_difficulty}
                  onClick={() =>
                    onNavigate('role-details', {
                      companyId: r.company.company_id,
                      roleTitle: r.role_title,
                    })
                  }
                />
              ))}
            </div>
          </section>
        )}

        {/* TOPICS SECTION */}
        {(activeTab === 'all' || activeTab === 'topics') && results.topics.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Topics & Core Concepts ({results.topics.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {results.topics.map(({ topic, skill, mention_count }) => (
                <div
                  key={topic.topic_id}
                  onClick={() => setQuery(topic.topic_name)}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-400 dark:hover:border-cyan-500 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
                >
                  <TopicPill name={topic.topic_name} category={topic.category} />
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-teal-700 dark:text-teal-300">{skill.skill_name}</span>
                    <span>{mention_count} questions</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* QUESTIONS SECTION */}
        {(activeTab === 'all' || activeTab === 'questions') && results.questions.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Interview Questions ({results.questions.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.questions.map(({ question, topic, company, role_title }) => (
                <QuestionCard
                  key={question.question_id}
                  question={question}
                  topic={topic}
                  companyName={company.name}
                  roleTitle={role_title}
                />
              ))}
            </div>
          </section>
        )}

        {/* EXPERIENCES SECTION */}
        {(activeTab === 'all' || activeTab === 'experiences') && results.experiences.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Interview Experiences ({results.experiences.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.experiences.map(({ experience, company, author_college, author_branch }) => (
                <ExperienceCard
                  key={experience.experience_id}
                  experience={experience}
                  company={company}
                  authorCollege={author_college}
                  authorBranch={author_branch}
                  onClick={() => onNavigate('alumni-details', { experienceId: experience.experience_id })}
                />
              ))}
            </div>
          </section>
        )}

        {/* Zero Results State */}
        {totalResultsCount === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-4">
            <SearchIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No matching placement intelligence found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any results matching your search terms and filters. Try clearing your filters or searching for general keywords like "Qualcomm", "DSA", or "Trees".
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Clear All Search Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
