import React, { useState, useEffect } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { RoleCard } from '../components/ui/Cards';
import { SkillPill } from '../components/ui/Badges';
import { getCompanyRoles, ApiRoleSummary } from '../services/companyApi';
import {
  Building2,
  ExternalLink,
  Globe,
  Briefcase,
  Search,
  ShieldCheck,
  Layers,
  ChevronLeft
} from 'lucide-react';

export const CompanyDetailsPage: React.FC<{
  companyId: number;
  onNavigate: (page: string, params?: any) => void;
}> = ({ companyId, onNavigate }) => {
  const { getCompany, getCompanySkills, getCompanyRoles: getContextRoles, db } = usePlaceWell();

  const [roleSearch, setRoleSearch] = useState('');
  const [dbRoles, setDbRoles] = useState<ApiRoleSummary[] | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCompanyRoles(companyId)
      .then((res) => {
        if (isMounted && res && Array.isArray(res.roles)) {
          setDbRoles(res.roles);
        }
      })
      .catch((err) => {
        console.warn('Live company roles API connection notice:', err);
      });
    return () => {
      isMounted = false;
    };
  }, [companyId]);

  const company = getCompany(companyId) || db.companies[0];
  const companySkills = getCompanySkills(company.company_id);

  const roles = dbRoles
    ? dbRoles.map((r) => ({
        role_title: r.role_title,
        experience_count: r.experience_count,
        avg_difficulty: r.avg_difficulty || 3,
        types: (r.types || ['placement']).map((t) =>
          t.toLowerCase() === 'internship' ? ('internship' as const) : ('placement' as const)
        ),
      }))
    : getContextRoles(company.company_id);

  const coreStackSkills = companySkills.filter((cs) => cs.usage_type === 'core_stack');
  const frequentTopics = companySkills.filter((cs) => cs.usage_type === 'frequent_interview_topic');

  const filteredRoles = roles.filter((r) =>
    r.role_title.toLowerCase().includes(roleSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back to Companies button */}
      <button
        type="button"
        onClick={() => onNavigate('companies')}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Companies
      </button>

      {/* 1. COMPANY HEADER & OVERVIEW */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-4 relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-brand-50 via-cyan-50 to-transparent dark:from-brand-950/40 dark:via-slate-800/40 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-5 flex-1 min-w-0">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 shadow-md flex items-center justify-center shrink-0">
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
                <Building2 className="w-8 h-8 text-brand-600 dark:text-brand-400" />
              )}
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {company.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/70 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Company
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{company.industry}</p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{company.website.replace('https://', '')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. SKILLS THE COMPANY HIRES / INTERVIEWS FOR (COMPANY_SKILL) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <span>Technical Skills {company.name} Hires For</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Classified from verified candidate interview rounds into core production stack vs frequent interview testing topics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Stack */}
          <div className="p-5 rounded-2xl bg-brand-50/40 dark:bg-brand-950/40 border border-brand-200/80 dark:border-brand-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600 dark:bg-brand-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-brand-900 dark:text-brand-200">
                Core Production Stack
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Primary languages and architectures used in engineering teams at {company.name}.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {coreStackSkills.map(({ skill }) => (
                <SkillPill key={skill.skill_id} name={skill.skill_name} usageType="core_stack" />
              ))}
              {coreStackSkills.length === 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">No core stack logged yet</span>
              )}
            </div>
          </div>

          {/* Frequent Interview Topics */}
          <div className="p-5 rounded-2xl bg-teal-50/40 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 dark:bg-teal-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-200">
                Frequent Interview Topics
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Subjects repeatedly tested across OA and Technical interview rounds.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {frequentTopics.map(({ skill }) => (
                <SkillPill key={skill.skill_id} name={skill.skill_name} usageType="frequent_interview_topic" />
              ))}
              {frequentTopics.length === 0 && (
                <span className="text-xs text-slate-400 dark:text-slate-500">No interview topics logged yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. ROLES SECTION (MAJOR COMPONENT) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span>Roles Offered at {company.name}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any role to view aggregated interview round structures, topic distributions, and question banks.
            </p>
          </div>

          {/* Search roles bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={roleSearch}
              onChange={(e) => setRoleSearch(e.target.value)}
              placeholder="Search roles..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <RoleCard
              key={role.role_title}
              roleTitle={role.role_title}
              experienceCount={role.experience_count}
              avgDifficulty={role.avg_difficulty}
              types={role.types}
              onClick={() =>
                onNavigate('role-details', {
                  companyId: company.company_id,
                  roleTitle: role.role_title,
                })
              }
            />
          ))}

          {filteredRoles.length === 0 && (
            <div className="sm:col-span-3 text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400">
              No matching roles found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
