const API_BASE_URL = `${import.meta.env.VITE_API_URL || ''}/api`;

export interface ApiCompany {
  company_id: number;
  name: string;
  industry: string;
  website?: string | null;
  logo_url?: string | null;
  skills?: { skill_id: number; skill_name: string; usage_type: string }[];
  _count?: { interview_experiences: number };
}

export interface ApiCompanyAnalytics {
  company: ApiCompany;
  overview: {
    total_experiences: number;
    distinct_roles: number;
    avg_difficulty: number | null;
  };
  round_type_breakdown: { type: string; count: number }[];
  topics_by_skill: {
    skill_id: number | null;
    skill_name: string;
    topics: { topic_id: number; topic_name: string; count: number; frequency_percent: number }[];
  }[];
}

export interface ApiRoleSummary {
  role_title: string;
  experience_count: number;
  percentage: number;
  avg_difficulty: number | null;
  types?: string[];
  years?: number[];
  recent_result?: string;
}

export interface ApiCompanyRolesResponse {
  company_id: number;
  company_name: string;
  total_experiences: number;
  roles: ApiRoleSummary[];
}

export interface ApiRoleAnalyticsResponse {
  company: ApiCompany;
  role_title: string;
  total_experiences: number;
  types: string[];
  years: number[];
  outcomes: {
    selected: number;
    rejected: number;
    selected_pct: number;
    rejected_pct: number;
  };
  difficulty_distribution: { [stars: number]: number };
  avg_difficulty: number;
  round_structure: { [key: string]: number };
  top_topics: any[];
  frequently_asked_questions: any[];
  contributors: any[];
  insights: {
    most_common_topic: string;
    most_difficult_topic: string;
    most_common_round: string;
    top_skill: string;
  };
}

// Helper to construct Auth headers
function getHeaders(userId?: number) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['Authorization'] = `Bearer ${userId}`;
    headers['x-user-id'] = String(userId);
  }
  return headers;
}

/**
 * 1. GET /companies - Get list of companies with optional filters
 */
export async function getCompanies(params?: { search?: string; industry?: string; skill_id?: number }): Promise<ApiCompany[]> {
  const url = new URL('/api/companies', window.location.origin);
  if (params?.search) url.searchParams.append('search', params.search);
  if (params?.industry && params.industry !== 'All') url.searchParams.append('industry', params.industry);
  if (params?.skill_id) url.searchParams.append('skill_id', String(params.skill_id));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Failed to fetch companies: ${res.statusText}`);
  return res.json();
}

/**
 * 2. GET /companies/:id - Get details of a company by ID
 */
export async function getCompanyById(id: number): Promise<ApiCompany> {
  const res = await fetch(`${API_BASE_URL}/companies/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch company with ID ${id}`);
  return res.json();
}

/**
 * 3. GET /companies/name/:company_name - Fetch company info by name
 */
export async function getCompanyByName(name: string): Promise<ApiCompany> {
  const res = await fetch(`${API_BASE_URL}/companies/name/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Failed to fetch company '${name}'`);
  return res.json();
}

/**
 * 4. GET /companies/:id/analytics - Get placement & interview difficulty analytics
 */
export async function getCompanyAnalytics(id: number): Promise<ApiCompanyAnalytics> {
  const res = await fetch(`${API_BASE_URL}/companies/${id}/analytics`);
  if (!res.ok) throw new Error(`Failed to fetch analytics for company ${id}`);
  return res.json();
}

/**
 * 5. POST /companies - Add/register a new company (Auth Required)
 */
export async function createCompany(
  data: { name: string; industry?: string; website?: string; logo_url?: string },
  userId: number = 1
): Promise<ApiCompany> {
  const res = await fetch(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: getHeaders(userId),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to create company (Status ${res.status})`);
  }
  return res.json();
}

/**
 * 6. POST /companies/:id/skills - Map a skill to a company (Auth Required)
 */
export async function addSkillToCompany(
  companyId: number,
  skillData: { skill_id?: number; skill_name?: string; usage_type?: 'core_stack' | 'frequent_interview_topic' },
  userId: number = 1
): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/companies/${companyId}/skills`, {
    method: 'POST',
    headers: getHeaders(userId),
    body: JSON.stringify(skillData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to add skill to company (Status ${res.status})`);
  }
  return res.json();
}

/**
 * 7. GET /companies/:id/roles - Get roles offered at a company
 */
export async function getCompanyRoles(id: number): Promise<ApiCompanyRolesResponse> {
  const res = await fetch(`${API_BASE_URL}/companies/${id}/roles`);
  if (!res.ok) throw new Error(`Failed to fetch roles for company ${id}`);
  return res.json();
}

/**
 * 8. GET /companies/:id/roles/:roleTitle/analytics - Get salary & difficulty analytics for a specific role
 */
export async function getRoleAnalytics(id: number, roleTitle: string): Promise<ApiRoleAnalyticsResponse> {
  const res = await fetch(`${API_BASE_URL}/companies/${id}/roles/${encodeURIComponent(roleTitle)}/analytics`);
  if (!res.ok) throw new Error(`Failed to fetch role analytics for '${roleTitle}' at company ${id}`);
  return res.json();
}
