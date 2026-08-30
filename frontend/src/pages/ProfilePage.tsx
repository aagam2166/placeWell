import React, { useState } from 'react';
import { usePlaceWell } from '../context/PlaceWellContext';
import { ProficiencyLevel } from '../types/database';
import { StatusBadge } from '../components/ui/Badges';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import {
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Lock,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowRight,
  FileText,
  Share2
} from 'lucide-react';
import { DifficultyStars, ResultBadge } from '../components/ui/Badges';

export const ProfilePage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const {
    currentUser,
    db,
    getUserSkills,
    getUserExperiences,
    addUserSkill,
    removeUserSkill,
    updateUserProfile,
  } = usePlaceWell();

  const requiredProfileFields = [
    currentUser?.name?.trim(),
    currentUser?.college?.trim(),
    currentUser?.branch?.trim(),
    currentUser?.graduation_year ? String(currentUser.graduation_year) : '',
    currentUser?.email?.trim(),
    currentUser?.phone?.trim(),
  ];

  const profileCompletion = Math.round(
    (requiredProfileFields.filter(Boolean).length / requiredProfileFields.length) * 100
  );

  const [isEditingProfile, setIsEditingProfile] = useState(profileCompletion < 100);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editCollege, setEditCollege] = useState(currentUser?.college || '');
  const [editBranch, setEditBranch] = useState(currentUser?.branch || '');
  const [editGradYear, setEditGradYear] = useState(currentUser?.graduation_year || 2026);

  // New Skill Modal
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState<number>(1);
  const [selectedProficiency, setSelectedProficiency] = useState<ProficiencyLevel>('intermediate');

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-600 dark:text-slate-400">Please sign in to view your profile.</p>
        <button
          onClick={() => onNavigate('auth')}
          className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Sign In
        </button>
      </div>
    );
  }

  const userSkills = getUserSkills(currentUser.user_id);
  const userExperiences = getUserExperiences(currentUser.user_id);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: editName,
      college: editCollege,
      branch: editBranch,
      graduation_year: Number(editGradYear),
    });
    setIsEditingProfile(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    addUserSkill(Number(selectedSkillId), selectedProficiency);
    setIsAddSkillOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* 1. STUDENT HERO PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 relative overflow-hidden">
        <div className="relative flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/30 p-1.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-black text-2xl shadow-inner">
                  {currentUser.name.charAt(0)}
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">{currentUser.name}</h1>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  {currentUser.college || 'College not added'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentUser.branch || 'Branch not added'} • {currentUser.graduation_year ? `Class of ${currentUser.graduation_year}` : 'Graduation year not added'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#3b82f6 ${profileCompletion * 3.6}deg, rgba(148,163,184,0.24) 0deg)`,
                  }}
                />
                <div className="absolute inset-[8px] rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-white">
                  {profileCompletion}%
                </div>
              </div>

              <div className="text-left">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Profile</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {profileCompletion < 100 ? 'Incomplete' : 'Complete'}
                </p>
              </div>
            </div>
          </div>

          {profileCompletion < 100 && (
            <div className="rounded-2xl border border-amber-200 dark:border-amber-700 bg-amber-50/80 dark:bg-amber-950/40 px-4 py-3 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3">
              <span>
                Add the remaining profile details to unlock a complete student profile after Google sign-up.
              </span>
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold hover:bg-amber-600 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Complete profile
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditingProfile ? 'Cancel' : 'Edit Profile Info'}
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{profileCompletion < 100 ? 'Needs more details' : 'Ready to go'}</span>
            </div>
          </div>

          {isEditingProfile && (
            <form onSubmit={handleSaveProfile} className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">College</label>
                <input
                  type="text"
                  value={editCollege}
                  onChange={(e) => setEditCollege(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Branch</label>
                <input
                  type="text"
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Graduation Year</label>
                <input
                  type="number"
                  value={editGradYear}
                  onChange={(e) => setEditGradYear(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-600/20 hover:bg-brand-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser.phone}
            </span>
            
          </div>
        </div>
      </div>

      {/* 2. SKILLS PORTFOLIO & INTERESTS (USER_SKILL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                <span>Technical Skills & Proficiencies</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                These skills power your personalized placement recommendations and match scoring.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddSkillOpen(true)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-50 dark:bg-brand-950/70 hover:bg-brand-100 dark:hover:bg-brand-900/70 text-brand-700 dark:text-brand-300 font-bold text-xs border border-brand-200 dark:border-brand-800 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Skill
            </button>
          </div>

          {/* Skill List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userSkills.map(({ userSkill, skill }) => {
              const profColor = {
                advanced: 'from-brand-600 to-teal-600 text-white',
                intermediate: 'from-cyan-500 to-blue-500 text-white',
                beginner: 'from-slate-400 to-slate-500 text-white',
              }[userSkill.proficiency_level];

              return (
                <div
                  key={skill.skill_id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-card transition-all flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.skill_name}</span>
                    <div>
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-gradient-to-r ${profColor}`}>
                        {userSkill.proficiency_level}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeUserSkill(skill.skill_id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Skill Modal inline container */}
          {isAddSkillOpen && (
            <div className="p-4 rounded-2xl bg-brand-50/60 dark:bg-slate-800/80 border border-brand-200 dark:border-brand-800 animate-fadeIn">
              <form onSubmit={handleAddSkill} className="space-y-3">
                <h4 className="text-xs font-bold text-brand-900 dark:text-brand-300 uppercase tracking-wider">
                  Add New Skill to Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Skill</label>
                    <div className="mt-1">
                      <SearchableSelect
                        value={selectedSkillId}
                        onChange={(value) => setSelectedSkillId(Number(value))}
                        options={db.skills.map((s) => ({ value: s.skill_id, label: s.skill_name }))}
                        searchable
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Proficiency Level</label>
                    <div className="mt-1">
                      <SearchableSelect
                        value={selectedProficiency}
                        onChange={(value) => setSelectedProficiency(value as ProficiencyLevel)}
                        options={[
                          { value: 'beginner', label: 'Beginner' },
                          { value: 'intermediate', label: 'Intermediate' },
                          { value: 'advanced', label: 'Advanced' },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddSkillOpen(false)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 shadow-xs"
                  >
                    Save Skill
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Interests / Target Roles sidebar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Target Role Interests</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select roles to prioritize your preparation feed.
            </p>
          </div>

          <div className="space-y-2">
            {[
              { role: 'Embedded Systems Engineer', tag: 'High Priority', active: true },
              { role: 'Software Engineer (Backend/Distributed)', tag: 'Priority', active: true },
              { role: 'Firmware / IoT Developer', tag: 'Exploring', active: false },
              { role: 'Systems Software Engineer', tag: 'Exploring', active: false },
            ].map((r) => (
              <div
                key={r.role}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-slate-800 dark:text-slate-200">{r.role}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                  r.active ? 'bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {r.tag}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-50 to-cyan-50 dark:from-brand-950/60 dark:to-slate-800/80 border border-brand-100 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-brand-900 dark:text-brand-300">Placement Preparation Tip</span>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your profile currently matches <strong>82%</strong> with <strong>Qualcomm</strong> and <strong>78%</strong> with <strong>Nvidia</strong> based on C++ and Embedded Systems tags.
            </p>
            <button
              onClick={() => onNavigate('feed')}
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300 flex items-center gap-1 pt-1"
            >
              View matching companies <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. EXPERIENCE HISTORY (Submitted by this user) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-card dark:shadow-dark-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <span>Your Submitted Interview Experiences</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Experiences you shared with the student community. Status: draft, published, or verified.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('submit-experience')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share New Experience
          </button>
        </div>

        {userExperiences.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No interview experiences submitted yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Share your OA questions, technical rounds, and preparation resources to help fellow students.
            </p>
            <button
              onClick={() => onNavigate('submit-experience')}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-xs"
            >
              Submit Your First Experience
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userExperiences.map(({ experience, company }) => (
              <div
                key={experience.experience_id}
                className="group p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div
                  onClick={() => onNavigate('alumni-details', { experienceId: experience.experience_id })}
                  className="cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center shrink-0">
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

                      <StatusBadge status={experience.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <ResultBadge result={experience.result} size="sm" />
                      <span className="font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {experience.year} • {experience.experience_type.toUpperCase()}
                      </span>
                      <DifficultyStars rating={experience.overall_difficulty} size="sm" />
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                      "{experience.summary_text}"
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    <span>View submission breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onNavigate('submit-experience', { editExperienceId: experience.experience_id });
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] font-bold"
                  >
                    <Edit3 className="w-3 h-3" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
