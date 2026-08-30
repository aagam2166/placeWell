// PlaceWell Database Schema Types (Strict Source of Truth)

export interface User {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  college: string;
  branch: string;
  graduation_year: number;
  phone: string;
  created_at: string; // ISO datetime
}

export interface Company {
  company_id: number;
  name: string;
  industry: string;
  website: string;
  logo_url: string;
}

export type ExperienceType = 'internship' | 'placement';
export type ExperienceResult = 'selected' | 'rejected';
export type ExperienceStatus = 'draft' | 'published' | 'verified';

export interface InterviewExperience {
  experience_id: number;
  user_id: number;
  company_id: number;
  role_title: string;
  experience_type: ExperienceType;
  year: number;
  result: ExperienceResult;
  overall_difficulty: number; // 1-5
  ctc_or_stipend: string;
  total_rounds: number;
  summary_text: string;
  is_anonymous_public: boolean;
  status: ExperienceStatus;
  created_at: string; // ISO datetime
}

export type RoundType = 'OA' | 'Tech' | 'HR' | 'SysDesign' | 'GD';

export interface Round {
  round_id: number;
  experience_id: number;
  topic_id: number;
  round_number: number;
  round_type: RoundType;
  duration_minutes: number;
  description_text: string;
  difficulty_rating: number; // 1-5
  platform_used: string;
  difficulty: number; // 1-5
  notes: string;
}

export interface Skill {
  skill_id: number;
  skill_name: string;
}

export type TopicCategory = 'dsa' | 'tech_stack' | 'subject' | 'soft_skill';

export interface Topic {
  topic_id: number;
  skill_id: number;
  topic_name: string;
  parent_topic_id?: number | null;
  category: TopicCategory;
}

export type QuestionType = 'coding' | 'theory' | 'puzzle';

export interface Question {
  question_id: number;
  round_id: number;
  topic_id: number;
  question_text: string;
  question_type: QuestionType;
  difficulty: number; // 1-5
  reference_link: string;
}

export interface Resource {
  resource_id: number;
  experience_id: number;
  title: string;
  url: string;
  created_at: string; // ISO datetime
}

export interface SkillResource {
  skill_id: number;
  resource_id: number;
}

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserSkill {
  user_id: number;
  skill_id: number;
  proficiency_level: ProficiencyLevel;
}

export type CompanySkillUsageType = 'core_stack' | 'frequent_interview_topic';

export interface CompanySkill {
  company_id: number;
  skill_id: number;
  usage_type: CompanySkillUsageType;
}

// Complete PlaceWell Database state container
export interface DatabaseState {
  users: User[];
  companies: Company[];
  interview_experiences: InterviewExperience[];
  rounds: Round[];
  skills: Skill[];
  topics: Topic[];
  questions: Question[];
  resources: Resource[];
  skill_resources: SkillResource[];
  user_skills: UserSkill[];
  company_skills: CompanySkill[];
}
