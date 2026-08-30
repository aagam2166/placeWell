import React, { useState } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { CompanyCard } from '../components/ui/Cards';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { Building2, Search } from 'lucide-react';

export const CompaniesPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { db, getCompanySkills, getCompanyRecommendations, currentUser } = usePlaceWell();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedSkillId, setSelectedSkillId] = useState<number | undefined>();

  // Extract unique industries
  const industries = ['All', ...Array.from(new Set(db.companies.map((c) => c.industry)))];

  const recommendations = getCompanyRecommendations(currentUser?.user_id || 1);

  // Filter companies
  const filteredCompanies = db.companies.filter((c) => {
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustry === 'All' || c.industry === selectedIndustry;

    const companySkills = db.company_skills.filter((cs) => cs.company_id === c.company_id);
    const matchesSkill =
      !selectedSkillId || companySkills.some((cs) => cs.skill_id === selectedSkillId);

    return matchesSearch && matchesIndustry && matchesSkill;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. HEADER */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
            Explore companies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Discover how different companies hire, what skills they look for, and what their technical interviews are actually like.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name or tech domain..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          {/* Industry Filter */}
          <div className="sm:col-span-3">
            <SearchableSelect
              value={selectedIndustry}
              onChange={(value) => setSelectedIndustry(String(value))}
              options={industries.map((ind) => ({
                value: ind,
                label: ind === 'All' ? 'All Industries' : ind,
              }))}
              placeholder="All Industries"
            />
          </div>

          {/* Skill Filter */}
          <div className="sm:col-span-3">
            <SearchableSelect
              value={selectedSkillId ?? ''}
              onChange={(value) => setSelectedSkillId(value === '' ? undefined : Number(value))}
              options={[
                { value: '', label: 'All Hiring Skills' },
                ...db.skills.map((s) => ({ value: s.skill_id, label: s.skill_name })),
              ]}
              placeholder="All Hiring Skills"
              searchable
            />
          </div>
        </div>
      </div>

      {/* 2. COMPANY TILES GRID */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const exps = db.interview_experiences.filter((e) => e.company_id === company.company_id);
            const rolesCount = new Set(exps.map((e) => e.role_title)).size;
            const skills = getCompanySkills(company.company_id);
            const rec = recommendations.find((r) => r.company.company_id === company.company_id);

            return (
              <CompanyCard
                key={company.company_id}
                company={company}
                experienceCount={exps.length}
                rolesCount={rolesCount}
                skills={skills}
                matchPercentage={rec?.match_percentage}
                onClick={() => onNavigate('company-details', { companyId: company.company_id })}
              />
            );
          })}
        </div>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No companies found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try adjusting your search query or reset your industry & skill filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('All');
                setSelectedSkillId(undefined);
              }}
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
