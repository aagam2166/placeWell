import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  DatabaseState,
  User,
  Company,
  InterviewExperience,
  Round,
  Skill,
  Topic,
  Question,
  Resource,
  UserSkill,
  CompanySkill,
  ProficiencyLevel,
  ExperienceStatus,
  RoundType,
  QuestionType,
  ExperienceType,
  ExperienceResult,
} from '../types/database';
import { initialDatabase } from '../data/initialData';
import * as companyApi from '../services/companyApi';


interface RoleSummary {
  role_title: string;
  experience_count: number;
  avg_difficulty: number;
  types: ExperienceType[];
  years: number[];
  recent_result: ExperienceResult;
}

export interface RoleAggregatedInsights {
  company: Company;
  role_title: string;
  total_experiences: number;
  types: ExperienceType[];
  years: number[];
  outcomes: {
    selected: number;
    rejected: number;
    selected_pct: number;
    rejected_pct: number;
  };
  difficulty_distribution: { [stars: number]: number };
  avg_difficulty: number;
  round_structure: { [key in RoundType]?: number };
  top_topics: { topic: Topic; skill: Skill; count: number; percentage: number }[];
  frequently_asked_questions: { question: Question; topic: Topic; round_type: RoundType }[];
  contributors: {
    experience_id: number;
    user_id: number;
    college: string;
    branch: string;
    graduation_year: number;
    experience_year: number;
    experience_type: ExperienceType;
    result: ExperienceResult;
    overall_difficulty: number;
    summary_text: string;
    is_anonymous_public: boolean;
  }[];
  insights: {
    most_common_topic: string;
    most_difficult_topic: string;
    most_common_round: string;
    top_skill: string;
  };
}

export interface ExperienceFullDetails {
  experience: InterviewExperience;
  company: Company;
  author: {
    college: string;
    branch: string;
    graduation_year: number;
    // Private fields only visible if is_anonymous_public is false AND viewer is the owner
    name?: string;
    email?: string;
    phone?: string;
    is_owner: boolean;
  };
  rounds: {
    round: Round;
    topic?: Topic;
    skill?: Skill;
    questions: (Question & { topic?: Topic })[];
  }[];
  topics_skills: { topic: Topic; skill: Skill }[];
  resources: Resource[];
}

export interface SearchResults {
  companies: (Company & { experience_count: number; roles_count: number; skills: Skill[] })[];
  roles: { company: Company; role_title: string; experience_count: number; avg_difficulty: number }[];
  topics: { topic: Topic; skill: Skill; mention_count: number }[];
  questions: { question: Question; topic: Topic; company: Company; role_title: string }[];
  experiences: {
    experience: InterviewExperience;
    company: Company;
    author_college: string;
    author_branch: string;
  }[];
}

interface PlaceWellContextType {
  db: DatabaseState;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  // Auth methods
  signIn: (email: string, password_hash_or_pass: string) => boolean;
  signUp: (data: Omit<User, 'user_id' | 'created_at'>) => User;
  signOut: () => void;
  // Queries
  getCompany: (companyId: number) => Company | undefined;
  getCompanySkills: (companyId: number) => { skill: Skill; usage_type: 'core_stack' | 'frequent_interview_topic' }[];
  getCompanyRoles: (companyId: number) => RoleSummary[];
  getRoleAggregatedInsights: (companyId: number, roleTitle: string) => RoleAggregatedInsights | null;
  getExperienceDetails: (experienceId: number) => ExperienceFullDetails | null;
  getUserSkills: (userId: number) => { userSkill: UserSkill; skill: Skill }[];
  getUserExperiences: (userId: number) => { experience: InterviewExperience; company: Company }[];
  getCompanyRecommendations: (userId: number) => {
    company: Company;
    match_percentage: number;
    matched_skills: Skill[];
    all_skills: Skill[];
    experience_count: number;
  }[];
  getTrendingTopics: () => { topic: Topic; skill: Skill; count: number }[];
  searchAll: (query: string, filterOptions?: {
    companyId?: number;
    experienceType?: ExperienceType;
    result?: ExperienceResult;
    difficulty?: number;
    skillId?: number;
  }) => SearchResults;
  // Mutations
  addUserSkill: (skillId: number, proficiency: ProficiencyLevel) => void;
  removeUserSkill: (skillId: number) => void;
  updateUserSkill: (skillId: number, proficiency: ProficiencyLevel) => void;
  updateUserProfile: (data: Partial<Omit<User, 'user_id' | 'password_hash' | 'created_at'>>) => void;
  updateExperience: (experienceId: number, payload: {
    experience: Omit<InterviewExperience, 'experience_id' | 'user_id' | 'created_at'>;
    rounds: {
      round: Omit<Round, 'round_id' | 'experience_id'>;
      questions: Omit<Question, 'question_id' | 'round_id'>[];
    }[];
    resources: { title: string; url: string; skill_id?: number }[];
  }) => void;
  submitExperience: (payload: {
    experience: Omit<InterviewExperience, 'experience_id' | 'user_id' | 'created_at'>;
    rounds: {
      round: Omit<Round, 'round_id' | 'experience_id'>;
      questions: Omit<Question, 'question_id' | 'round_id'>[];
    }[];
    resources: { title: string; url: string; skill_id?: number }[];
  }) => number; // returns experience_id
  resetDatabase: () => void;
  // Company Backend API actions
  fetchBackendCompanies: () => Promise<void>;
  createCompanyApi: (data: { name: string; industry?: string; website?: string; logo_url?: string }) => Promise<Company>;
  addSkillToCompanyApi: (
    companyId: number,
    skillData: { skill_id?: number; skill_name?: string; usage_type?: 'core_stack' | 'frequent_interview_topic' }
  ) => Promise<any>;
}


const PlaceWellContext = createContext<PlaceWellContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'placewell_db_state_v1';
const CURRENT_USER_KEY = 'placewell_active_user_id';

export const PlaceWellProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<DatabaseState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading stored state:', e);
    }
    return initialDatabase;
  });

  const [currentUserId, setCurrentUserId] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(CURRENT_USER_KEY);
      if (saved) {
        return Number(saved);
      }
    } catch (e) {
      console.warn('Error reading active user:', e);
    }
    return 1; // Default to Vatsal Shah
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('Error persisting database state:', e);
    }
  }, [db]);

  useEffect(() => {
    try {
      if (currentUserId !== null) {
        localStorage.setItem(CURRENT_USER_KEY, String(currentUserId));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.warn('Error saving current user:', e);
    }
  }, [currentUserId]);

  const fetchBackendCompanies = async () => {
    try {
      const apiCompanies = await companyApi.getCompanies();
      if (Array.isArray(apiCompanies) && apiCompanies.length > 0) {
        setDb((prev) => {
          const updatedCompanySkills = [...prev.company_skills];

          const formattedCompanies: Company[] = apiCompanies.map((ac) => {
            if (ac.skills && Array.isArray(ac.skills)) {
              ac.skills.forEach((sk) => {
                const exists = updatedCompanySkills.some(
                  (cs) => cs.company_id === ac.company_id && cs.skill_id === sk.skill_id
                );
                if (!exists) {
                  updatedCompanySkills.push({
                    company_id: ac.company_id,
                    skill_id: sk.skill_id,
                    usage_type: (sk.usage_type as any) || 'frequent_interview_topic',
                  });
                }
              });
            }
            return {
              company_id: ac.company_id,
              name: ac.name,
              industry: ac.industry || 'Technology',
              website: ac.website || '',
              logo_url: ac.logo_url || '',
            };
          });

          return {
            ...prev,
            companies: formattedCompanies,
            company_skills: updatedCompanySkills,
          };
        });
      }
    } catch (err) {
      console.warn('Backend connection notice (using local fallback state):', err);
    }
  };

  useEffect(() => {
    fetchBackendCompanies();
  }, []);

  const createCompanyApi = async (data: { name: string; industry?: string; website?: string; logo_url?: string }): Promise<Company> => {
    try {
      const created = await companyApi.createCompany(data, currentUserId || 1);
      const newCompany: Company = {
        company_id: created.company_id,
        name: created.name,
        industry: created.industry || 'Technology',
        website: created.website || '',
        logo_url: created.logo_url || '',
      };
      setDb((prev) => ({
        ...prev,
        companies: [...prev.companies.filter((c) => c.company_id !== newCompany.company_id), newCompany],
      }));
      return newCompany;
    } catch (err) {
      console.error('API creation failed, executing local fallback:', err);
      const newId = Math.max(...db.companies.map((c) => c.company_id), 0) + 1;
      const newComp: Company = {
        company_id: newId,
        name: data.name,
        industry: data.industry || 'Technology',
        website: data.website || '',
        logo_url: data.logo_url || '',
      };
      setDb((prev) => ({ ...prev, companies: [...prev.companies, newComp] }));
      return newComp;
    }
  };

  const addSkillToCompanyApi = async (
    companyId: number,
    skillData: { skill_id?: number; skill_name?: string; usage_type?: 'core_stack' | 'frequent_interview_topic' }
  ) => {
    try {
      const res = await companyApi.addSkillToCompany(companyId, skillData, currentUserId || 1);
      const skillId = res?.skill_id || skillData.skill_id || 1;
      setDb((prev) => {
        const exists = prev.company_skills.some((cs) => cs.company_id === companyId && cs.skill_id === skillId);
        if (!exists) {
          return {
            ...prev,
            company_skills: [
              ...prev.company_skills,
              { company_id: companyId, skill_id: skillId, usage_type: skillData.usage_type || 'frequent_interview_topic' },
            ],
          };
        }
        return prev;
      });
      return res;
    } catch (err) {
      console.error('Failed to add skill via API:', err);
    }
  };

  const currentUser = db.users.find((u) => u.user_id === currentUserId) || null;

  const setCurrentUser = (user: User | null) => {
    setCurrentUserId(user ? user.user_id : null);
  };


  const signIn = (email: string, password_hash_or_pass: string): boolean => {
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() || u.name.toLowerCase() === email.toLowerCase()
    );
    if (user) {
      setCurrentUserId(user.user_id);
      return true;
    }
    return false;
  };

  const signUp = (data: Omit<User, 'user_id' | 'created_at'>): User => {
    const newId = Math.max(...db.users.map((u) => u.user_id), 0) + 1;
    const newUser: User = {
      ...data,
      user_id: newId,
      created_at: new Date().toISOString(),
    };
    setDb((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
    }));
    setCurrentUserId(newId);
    return newUser;
  };

  const signOut = () => {
    setCurrentUserId(null);
  };

  const getCompany = (companyId: number): Company | undefined => {
    return db.companies.find((c) => c.company_id === companyId);
  };

  const getCompanySkills = (companyId: number) => {
    return db.company_skills
      .filter((cs) => cs.company_id === companyId)
      .map((cs) => {
        const skill = db.skills.find((s) => s.skill_id === cs.skill_id);
        return {
          skill: skill || { skill_id: cs.skill_id, skill_name: 'General Tech' },
          usage_type: cs.usage_type,
        };
      });
  };

  const getCompanyRoles = (companyId: number): RoleSummary[] => {
    const experiences = db.interview_experiences.filter((exp) => exp.company_id === companyId);
    const roleMap = new Map<string, { exps: InterviewExperience[] }>();

    experiences.forEach((exp) => {
      if (!roleMap.has(exp.role_title)) {
        roleMap.set(exp.role_title, { exps: [] });
      }
      roleMap.get(exp.role_title)!.exps.push(exp);
    });

    const summaries: RoleSummary[] = [];
    roleMap.forEach((val, roleTitle) => {
      const count = val.exps.length;
      const avgDiff = Number((val.exps.reduce((acc, e) => acc + e.overall_difficulty, 0) / count).toFixed(1));
      const types = Array.from(new Set(val.exps.map((e) => e.experience_type)));
      const years = Array.from(new Set(val.exps.map((e) => e.year))).sort((a, b) => b - a);
      const latestExp = [...val.exps].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

      summaries.push({
        role_title: roleTitle,
        experience_count: count,
        avg_difficulty: avgDiff,
        types,
        years,
        recent_result: latestExp ? latestExp.result : 'selected',
      });
    });

    return summaries.sort((a, b) => b.experience_count - a.experience_count);
  };

  const getRoleAggregatedInsights = (companyId: number, roleTitle: string): RoleAggregatedInsights | null => {
    const company = db.companies.find((c) => c.company_id === companyId);
    if (!company) return null;

    const experiences = db.interview_experiences.filter(
      (e) => e.company_id === companyId && e.role_title.toLowerCase() === roleTitle.toLowerCase()
    );

    if (experiences.length === 0) {
      // Fallback empty aggregate if matching
      return {
        company,
        role_title: roleTitle,
        total_experiences: 0,
        types: ['placement'],
        years: [2025],
        outcomes: { selected: 0, rejected: 0, selected_pct: 0, rejected_pct: 0 },
        difficulty_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        avg_difficulty: 3,
        round_structure: { OA: 0, Tech: 0, HR: 0, SysDesign: 0, GD: 0 },
        top_topics: [],
        frequently_asked_questions: [],
        contributors: [],
        insights: {
          most_common_topic: 'N/A',
          most_difficult_topic: 'N/A',
          most_common_round: 'N/A',
          top_skill: 'N/A',
        },
      };
    }

    const total = experiences.length;
    const selectedCount = experiences.filter((e) => e.result === 'selected').length;
    const rejectedCount = experiences.filter((e) => e.result === 'rejected').length;

    const diffDist: { [stars: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    experiences.forEach((e) => {
      const diff = Math.min(Math.max(Math.round(e.overall_difficulty), 1), 5);
      diffDist[diff] = (diffDist[diff] || 0) + 1;
    });

    const avgDiff = Number((experiences.reduce((acc, e) => acc + e.overall_difficulty, 0) / total).toFixed(1));
    const expIds = experiences.map((e) => e.experience_id);
    const relatedRounds = db.rounds.filter((r) => expIds.includes(r.experience_id));

    const roundStructure: { [key in RoundType]?: number } = {};
    relatedRounds.forEach((r) => {
      roundStructure[r.round_type] = (roundStructure[r.round_type] || 0) + 1;
    });

    // Topic aggregation
    const topicCounts = new Map<number, number>();
    relatedRounds.forEach((r) => {
      if (r.topic_id) {
        topicCounts.set(r.topic_id, (topicCounts.get(r.topic_id) || 0) + 1);
      }
    });

    const roundIds = relatedRounds.map((r) => r.round_id);
    const relatedQuestions = db.questions.filter((q) => roundIds.includes(q.round_id));
    relatedQuestions.forEach((q) => {
      if (q.topic_id) {
        topicCounts.set(q.topic_id, (topicCounts.get(q.topic_id) || 0) + 1);
      }
    });

    const topTopics: { topic: Topic; skill: Skill; count: number; percentage: number }[] = [];
    let maxTopicCount = 0;
    topicCounts.forEach((c) => {
      if (c > maxTopicCount) maxTopicCount = c;
    });

    topicCounts.forEach((count, topicId) => {
      const topic = db.topics.find((t) => t.topic_id === topicId);
      if (topic) {
        const skill = db.skills.find((s) => s.skill_id === topic.skill_id) || {
          skill_id: topic.skill_id,
          skill_name: 'General',
        };
        const percentage = maxTopicCount > 0 ? Math.round((count / maxTopicCount) * 100) : 100;
        topTopics.push({ topic, skill, count, percentage });
      }
    });
    topTopics.sort((a, b) => b.count - a.count);

    // Frequently Asked Questions
    const faqList = relatedQuestions.map((q) => {
      const topic = db.topics.find((t) => t.topic_id === q.topic_id) || {
        topic_id: q.topic_id,
        skill_id: 1,
        topic_name: 'General Question',
        parent_topic_id: null,
        category: 'dsa' as const,
      };
      const round = relatedRounds.find((r) => r.round_id === q.round_id);
      return {
        question: q,
        topic,
        round_type: round ? round.round_type : ('Tech' as RoundType),
      };
    });

    // Contributors (Strict privacy filtering)
    const contributors = experiences.map((exp) => {
      const user = db.users.find((u) => u.user_id === exp.user_id);
      return {
        experience_id: exp.experience_id,
        user_id: exp.user_id,
        college: user?.college || 'Engineering College',
        branch: user?.branch || 'Computer Engineering',
        graduation_year: user?.graduation_year || 2025,
        experience_year: exp.year,
        experience_type: exp.experience_type,
        result: exp.result,
        overall_difficulty: exp.overall_difficulty,
        summary_text: exp.summary_text,
        is_anonymous_public: exp.is_anonymous_public,
      };
    });

    const mostCommonRoundEntry = Object.entries(roundStructure).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0];

    return {
      company,
      role_title: roleTitle,
      total_experiences: total,
      types: Array.from(new Set(experiences.map((e) => e.experience_type))),
      years: Array.from(new Set(experiences.map((e) => e.year))).sort((a, b) => b - a),
      outcomes: {
        selected: selectedCount,
        rejected: rejectedCount,
        selected_pct: Math.round((selectedCount / total) * 100),
        rejected_pct: Math.round((rejectedCount / total) * 100),
      },
      difficulty_distribution: diffDist,
      avg_difficulty: avgDiff,
      round_structure: roundStructure,
      top_topics: topTopics,
      frequently_asked_questions: faqList,
      contributors,
      insights: {
        most_common_topic: topTopics[0]?.topic.topic_name || 'Core Problem Solving',
        most_difficult_topic: topTopics.find((t) => t.topic.category === 'tech_stack' || t.topic.category === 'subject')?.topic.topic_name || 'Memory & Concurrency',
        most_common_round: mostCommonRoundEntry ? `${mostCommonRoundEntry[0]} Round` : 'Technical Round',
        top_skill: topTopics[0]?.skill.skill_name || 'DSA',
      },
    };
  };

  const getExperienceDetails = (experienceId: number): ExperienceFullDetails | null => {
    const experience = db.interview_experiences.find((e) => e.experience_id === experienceId);
    if (!experience) return null;

    const company = db.companies.find((c) => c.company_id === experience.company_id) || {
      company_id: experience.company_id,
      name: 'Technology Company',
      industry: 'Technology',
      website: '#',
      logo_url: '',
    };

    const user = db.users.find((u) => u.user_id === experience.user_id);
    const isOwner = currentUser?.user_id === experience.user_id;

    // Strict Anonymity: never disclose name, email, phone if is_anonymous_public unless current viewer is the owner
    const author = {
      college: user?.college || 'Premier Technical Institute',
      branch: user?.branch || 'Computer Engineering',
      graduation_year: user?.graduation_year || 2025,
      name: !experience.is_anonymous_public || isOwner ? user?.name : undefined,
      email: !experience.is_anonymous_public || isOwner ? user?.email : undefined,
      phone: !experience.is_anonymous_public || isOwner ? user?.phone : undefined,
      is_owner: isOwner,
    };

    const rounds = db.rounds
      .filter((r) => r.experience_id === experienceId)
      .sort((a, b) => a.round_number - b.round_number)
      .map((round) => {
        const topic = db.topics.find((t) => t.topic_id === round.topic_id);
        const skill = topic ? db.skills.find((s) => s.skill_id === topic.skill_id) : undefined;
        const questions = db.questions
          .filter((q) => q.round_id === round.round_id)
          .map((q) => ({
            ...q,
            topic: db.topics.find((t) => t.topic_id === q.topic_id),
          }));

        return {
          round,
          topic,
          skill,
          questions,
        };
      });

    // Associated topics and skills
    const topicMap = new Map<number, Topic>();
    rounds.forEach((r) => {
      if (r.topic) topicMap.set(r.topic.topic_id, r.topic);
      r.questions.forEach((q) => {
        if (q.topic) topicMap.set(q.topic.topic_id, q.topic);
      });
    });

    const topics_skills: { topic: Topic; skill: Skill }[] = [];
    topicMap.forEach((t) => {
      const skill = db.skills.find((s) => s.skill_id === t.skill_id) || {
        skill_id: t.skill_id,
        skill_name: 'General',
      };
      topics_skills.push({ topic: t, skill });
    });

    const resources = db.resources.filter((res) => res.experience_id === experienceId);

    return {
      experience,
      company,
      author,
      rounds,
      topics_skills,
      resources,
    };
  };

  const getUserSkills = (userId: number) => {
    return db.user_skills
      .filter((us) => us.user_id === userId)
      .map((us) => {
        const skill = db.skills.find((s) => s.skill_id === us.skill_id) || {
          skill_id: us.skill_id,
          skill_name: 'Unknown Skill',
        };
        return { userSkill: us, skill };
      });
  };

  const getUserExperiences = (userId: number) => {
    return db.interview_experiences
      .filter((e) => e.user_id === userId)
      .map((exp) => ({
        experience: exp,
        company: db.companies.find((c) => c.company_id === exp.company_id) || {
          company_id: exp.company_id,
          name: 'Company',
          industry: 'Tech',
          website: '#',
          logo_url: '',
        },
      }))
      .sort((a, b) => new Date(b.experience.created_at).getTime() - new Date(a.experience.created_at).getTime());
  };

  const getCompanyRecommendations = (userId: number) => {
    const userSkillIds = new Set(db.user_skills.filter((us) => us.user_id === userId).map((us) => us.skill_id));

    return db.companies
      .map((company) => {
        const companySkills = db.company_skills.filter((cs) => cs.company_id === company.company_id);
        const compSkillIds = companySkills.map((cs) => cs.skill_id);

        const matchedSkillIds = compSkillIds.filter((id) => userSkillIds.has(id));
        const matchPct = compSkillIds.length > 0
          ? Math.min(Math.round((matchedSkillIds.length / compSkillIds.length) * 100), 100)
          : 50;

        const matchedSkills = matchedSkillIds
          .map((id) => db.skills.find((s) => s.skill_id === id))
          .filter(Boolean) as Skill[];

        const allSkills = compSkillIds
          .map((id) => db.skills.find((s) => s.skill_id === id))
          .filter(Boolean) as Skill[];

        const expCount = db.interview_experiences.filter((e) => e.company_id === company.company_id).length;

        return {
          company,
          match_percentage: matchPct,
          matched_skills: matchedSkills,
          all_skills: allSkills,
          experience_count: expCount,
        };
      })
      .sort((a, b) => b.match_percentage - a.match_percentage);
  };

  const getTrendingTopics = () => {
    const counts = new Map<number, number>();
    db.rounds.forEach((r) => {
      if (r.topic_id) counts.set(r.topic_id, (counts.get(r.topic_id) || 0) + 1);
    });
    db.questions.forEach((q) => {
      if (q.topic_id) counts.set(q.topic_id, (counts.get(q.topic_id) || 0) + 1);
    });

    const result: { topic: Topic; skill: Skill; count: number }[] = [];
    counts.forEach((count, topicId) => {
      const topic = db.topics.find((t) => t.topic_id === topicId);
      if (topic) {
        const skill = db.skills.find((s) => s.skill_id === topic.skill_id) || {
          skill_id: topic.skill_id,
          skill_name: 'Tech',
        };
        result.push({ topic, skill, count });
      }
    });

    return result.sort((a, b) => b.count - a.count);
  };

  const searchAll = (
    query: string,
    filters?: {
      companyId?: number;
      experienceType?: ExperienceType;
      result?: ExperienceResult;
      difficulty?: number;
      skillId?: number;
    }
  ): SearchResults => {
    const q = query.trim().toLowerCase();

    // 1. Companies
    const companies = db.companies
      .filter((c) => {
        if (filters?.companyId && c.company_id !== filters.companyId) return false;
        if (!q) return true;
        return c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q);
      })
      .map((c) => {
        const exps = db.interview_experiences.filter((e) => e.company_id === c.company_id);
        const roles = new Set(exps.map((e) => e.role_title));
        const compSkills = db.company_skills
          .filter((cs) => cs.company_id === c.company_id)
          .map((cs) => db.skills.find((s) => s.skill_id === cs.skill_id))
          .filter(Boolean) as Skill[];

        return {
          ...c,
          experience_count: exps.length,
          roles_count: roles.size,
          skills: compSkills,
        };
      });

    // 2. Roles
    const roleList: { company: Company; role_title: string; experience_count: number; avg_difficulty: number }[] = [];
    db.companies.forEach((comp) => {
      if (filters?.companyId && comp.company_id !== filters.companyId) return;
      const summaries = getCompanyRoles(comp.company_id);
      summaries.forEach((s) => {
        if (!q || s.role_title.toLowerCase().includes(q) || comp.name.toLowerCase().includes(q)) {
          roleList.push({
            company: comp,
            role_title: s.role_title,
            experience_count: s.experience_count,
            avg_difficulty: s.avg_difficulty,
          });
        }
      });
    });

    // 3. Topics
    const topics = db.topics
      .filter((t) => {
        if (filters?.skillId && t.skill_id !== filters.skillId) return false;
        if (!q) return true;
        return t.topic_name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      })
      .map((t) => {
        const skill = db.skills.find((s) => s.skill_id === t.skill_id) || { skill_id: t.skill_id, skill_name: 'General' };
        const mention_count = db.rounds.filter((r) => r.topic_id === t.topic_id).length + db.questions.filter((ques) => ques.topic_id === t.topic_id).length;
        return { topic: t, skill, mention_count };
      });

    // 4. Questions
    const questions: { question: Question; topic: Topic; company: Company; role_title: string }[] = [];
    db.questions.forEach((question) => {
      const topic = db.topics.find((t) => t.topic_id === question.topic_id) || {
        topic_id: question.topic_id,
        skill_id: 1,
        topic_name: 'General',
        parent_topic_id: null,
        category: 'dsa' as const,
      };
      if (filters?.skillId && topic.skill_id !== filters.skillId) return;
      if (filters?.difficulty && question.difficulty !== filters.difficulty) return;

      const round = db.rounds.find((r) => r.round_id === question.round_id);
      const experience = round ? db.interview_experiences.find((e) => e.experience_id === round.experience_id) : null;
      const company = experience ? db.companies.find((c) => c.company_id === experience.company_id) : null;

      if (filters?.companyId && company && company.company_id !== filters.companyId) return;

      if (!q || question.question_text.toLowerCase().includes(q) || topic.topic_name.toLowerCase().includes(q)) {
        questions.push({
          question,
          topic,
          company: company || db.companies[0],
          role_title: experience?.role_title || 'Software Engineer',
        });
      }
    });

    // 5. Experiences
    const experiences = db.interview_experiences
      .filter((exp) => {
        if (filters?.companyId && exp.company_id !== filters.companyId) return false;
        if (filters?.experienceType && exp.experience_type !== filters.experienceType) return false;
        if (filters?.result && exp.result !== filters.result) return false;
        if (filters?.difficulty && Math.round(exp.overall_difficulty) !== filters.difficulty) return false;

        if (!q) return true;
        const comp = db.companies.find((c) => c.company_id === exp.company_id);
        return (
          exp.role_title.toLowerCase().includes(q) ||
          exp.summary_text.toLowerCase().includes(q) ||
          (comp && comp.name.toLowerCase().includes(q))
        );
      })
      .map((exp) => {
        const company = db.companies.find((c) => c.company_id === exp.company_id) || db.companies[0];
        const user = db.users.find((u) => u.user_id === exp.user_id);
        return {
          experience: exp,
          company,
          author_college: user?.college || 'Engineering College',
          author_branch: user?.branch || 'Computer Engineering',
        };
      });

    return {
      companies,
      roles: roleList,
      topics,
      questions,
      experiences,
    };
  };

  const addUserSkill = (skillId: number, proficiency: ProficiencyLevel) => {
    if (!currentUser) return;
    setDb((prev) => {
      const filtered = prev.user_skills.filter(
        (us) => !(us.user_id === currentUser.user_id && us.skill_id === skillId)
      );
      return {
        ...prev,
        user_skills: [...filtered, { user_id: currentUser.user_id, skill_id: skillId, proficiency_level: proficiency }],
      };
    });
  };

  const removeUserSkill = (skillId: number) => {
    if (!currentUser) return;
    setDb((prev) => ({
      ...prev,
      user_skills: prev.user_skills.filter(
        (us) => !(us.user_id === currentUser.user_id && us.skill_id === skillId)
      ),
    }));
  };

  const updateUserSkill = (skillId: number, proficiency: ProficiencyLevel) => {
    addUserSkill(skillId, proficiency);
  };

  const updateUserProfile = (data: Partial<Omit<User, 'user_id' | 'password_hash' | 'created_at'>>) => {
    if (!currentUser) return;
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) => (u.user_id === currentUser.user_id ? { ...u, ...data } : u)),
    }));
  };

  const updateExperience = (experienceId: number, payload: {
    experience: Omit<InterviewExperience, 'experience_id' | 'user_id' | 'created_at'>;
    rounds: {
      round: Omit<Round, 'round_id' | 'experience_id'>;
      questions: Omit<Question, 'question_id' | 'round_id'>[];
    }[];
    resources: { title: string; url: string; skill_id?: number }[];
  }) => {
    setDb((prev) => {
      const existingExperience = prev.interview_experiences.find((e) => e.experience_id === experienceId);
      if (!existingExperience) return prev;

      let nextRoundId = Math.max(...prev.rounds.map((r) => r.round_id), 0) + 1;
      let nextQuestionId = Math.max(...prev.questions.map((q) => q.question_id), 0) + 1;
      let nextResourceId = Math.max(...prev.resources.map((r) => r.resource_id), 0) + 1;

      const newRounds: Round[] = [];
      const newQuestions: Question[] = [];
      const newResources: Resource[] = [];
      const newSkillResources: { skill_id: number; resource_id: number }[] = [];
      const updatedRoundIds = new Set<number>();
      const updatedResourceIds = new Set<number>();

      payload.rounds.forEach((roundItem) => {
        const currentRoundId = nextRoundId++;
        updatedRoundIds.add(currentRoundId);
        newRounds.push({
          ...roundItem.round,
          round_id: currentRoundId,
          experience_id: experienceId,
        });

        roundItem.questions.forEach((qItem) => {
          newQuestions.push({
            ...qItem,
            question_id: nextQuestionId++,
            round_id: currentRoundId,
          });
        });
      });

      payload.resources.forEach((res) => {
        if (res.title.trim() && res.url.trim()) {
          const curResId = nextResourceId++;
          updatedResourceIds.add(curResId);
          newResources.push({
            resource_id: curResId,
            experience_id: experienceId,
            title: res.title.trim(),
            url: res.url.trim(),
            created_at: new Date().toISOString(),
          });
          if (res.skill_id) {
            newSkillResources.push({
              skill_id: res.skill_id,
              resource_id: curResId,
            });
          }
        }
      });

      return {
        ...prev,
        interview_experiences: prev.interview_experiences.map((e) =>
          e.experience_id === experienceId
            ? {
                ...e,
                ...payload.experience,
                experience_id: experienceId,
                user_id: e.user_id,
                created_at: e.created_at,
              }
            : e
        ),
        rounds: [
          ...prev.rounds.filter((r) => r.experience_id !== experienceId),
          ...newRounds,
        ],
        questions: [
          ...prev.questions.filter((q) => !prev.rounds.some((r) => r.experience_id === experienceId && r.round_id === q.round_id)),
          ...newQuestions,
        ],
        resources: [
          ...prev.resources.filter((r) => r.experience_id !== experienceId),
          ...newResources,
        ],
        skill_resources: [
          ...prev.skill_resources.filter((sr) => !prev.resources.some((resource) => resource.experience_id === experienceId && resource.resource_id === sr.resource_id)),
          ...newSkillResources,
        ],
      };
    });
  };

  const submitExperience = (payload: {
    experience: Omit<InterviewExperience, 'experience_id' | 'user_id' | 'created_at'>;
    rounds: {
      round: Omit<Round, 'round_id' | 'experience_id'>;
      questions: Omit<Question, 'question_id' | 'round_id'>[];
    }[];
    resources: { title: string; url: string; skill_id?: number }[];
  }): number => {
    const userId = currentUser ? currentUser.user_id : 1;
    const newExpId = Math.max(...db.interview_experiences.map((e) => e.experience_id), 0) + 1;

    const newExperience: InterviewExperience = {
      ...payload.experience,
      experience_id: newExpId,
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    let nextRoundId = Math.max(...db.rounds.map((r) => r.round_id), 0) + 1;
    let nextQuestionId = Math.max(...db.questions.map((q) => q.question_id), 0) + 1;
    let nextResourceId = Math.max(...db.resources.map((r) => r.resource_id), 0) + 1;

    const newRounds: Round[] = [];
    const newQuestions: Question[] = [];
    const newResources: Resource[] = [];
    const newSkillResources: { skill_id: number; resource_id: number }[] = [];

    payload.rounds.forEach((roundItem) => {
      const currentRoundId = nextRoundId++;
      newRounds.push({
        ...roundItem.round,
        round_id: currentRoundId,
        experience_id: newExpId,
      });

      roundItem.questions.forEach((qItem) => {
        newQuestions.push({
          ...qItem,
          question_id: nextQuestionId++,
          round_id: currentRoundId,
        });
      });
    });

    payload.resources.forEach((res) => {
      if (res.title.trim() && res.url.trim()) {
        const curResId = nextResourceId++;
        newResources.push({
          resource_id: curResId,
          experience_id: newExpId,
          title: res.title.trim(),
          url: res.url.trim(),
          created_at: new Date().toISOString(),
        });
        if (res.skill_id) {
          newSkillResources.push({
            skill_id: res.skill_id,
            resource_id: curResId,
          });
        }
      }
    });

    setDb((prev) => ({
      ...prev,
      interview_experiences: [newExperience, ...prev.interview_experiences],
      rounds: [...prev.rounds, ...newRounds],
      questions: [...prev.questions, ...newQuestions],
      resources: [...prev.resources, ...newResources],
      skill_resources: [...prev.skill_resources, ...newSkillResources],
    }));

    return newExpId;
  };

  const resetDatabase = () => {
    setDb(initialDatabase);
    setCurrentUserId(1);
  };

  return (
    <PlaceWellContext.Provider
      value={{
        db,
        currentUser,
        setCurrentUser,
        signIn,
        signUp,
        signOut,
        getCompany,
        getCompanySkills,
        getCompanyRoles,
        getRoleAggregatedInsights,
        getExperienceDetails,
        getUserSkills,
        getUserExperiences,
        getCompanyRecommendations,
        getTrendingTopics,
        searchAll,
        addUserSkill,
        removeUserSkill,
        updateUserSkill,
        updateUserProfile,
        updateExperience,
        submitExperience,
        resetDatabase,
        fetchBackendCompanies,
        createCompanyApi,
        addSkillToCompanyApi,
      }}
    >
      {children}
    </PlaceWellContext.Provider>
  );
};

export const usePlaceWell = (): PlaceWellContextType => {
  const context = useContext(PlaceWellContext);
  if (!context) {
    throw new Error('usePlaceWell must be used within a PlaceWellProvider');
  }
  return context;
};
