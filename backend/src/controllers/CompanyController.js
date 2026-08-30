import prisma from '../config/prisma.js';
import { serialize } from '../utils/response.js';

// Helper to format company skills
function formatCompanySkills(company) {
  if (!company) return null;
  const formattedCompany = { ...company };
  if (company.company_skills) {
    formattedCompany.skills = company.company_skills.map((cs) => ({
      skill_id: cs.skill_id,
      skill_name: cs.skills?.skill_name,
      usage_type: cs.usage_type,
    }));
    delete formattedCompany.company_skills;
  } else {
    formattedCompany.skills = [];
  }
  return formattedCompany;
}

// Helper to group round topics by skill
const groupTopicsBySkill = (experiences) => {
  const totalRounds = experiences.reduce((s, e) => s + e.rounds.length, 0);
  const skillMap = {};
  experiences.forEach((exp) => {
    exp.rounds.forEach((round) => {
      if (!round.round_topics || round.round_topics.length === 0) return;
      round.round_topics.forEach((rt) => {
        const topic = rt.topics;
        if (!topic) return;
        const skillKey = topic.skills ? String(topic.skills.skill_id) : "general";
        const skillName = topic.skills?.skill_name || "General";
        if (!skillMap[skillKey]) {
          skillMap[skillKey] = {
            skill_id: topic.skills ? Number(topic.skills.skill_id) : null,
            skill_name: skillName,
            topics: {},
          };
        }
        const topicKey = String(topic.topic_id);
        if (!skillMap[skillKey].topics[topicKey]) {
          skillMap[skillKey].topics[topicKey] = {
            topic_id: Number(topic.topic_id),
            topic_name: topic.topic_name,
            count: 0,
          };
        }
        skillMap[skillKey].topics[topicKey].count++;
      });
    });
  });
  return Object.values(skillMap)
    .map((skill) => ({
      skill_id: skill.skill_id,
      skill_name: skill.skill_name,
      topics: Object.values(skill.topics)
        .map((t) => ({
          topic_id: t.topic_id,
          topic_name: t.topic_name,
          count: t.count,
          frequency_percent:
            totalRounds > 0 ? Math.round((t.count / totalRounds) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => {
      const aSum = a.topics.reduce((s, t) => s + t.count, 0);
      const bSum = b.topics.reduce((s, t) => s + t.count, 0);
      return bSum - aSum;
    });
};

// Rounds select criteria
const roundsSelect = {
  select: {
    round_type: true,
    questions: { select: { question_id: true } },
    round_topics: {
      select: {
        topics: {
          select: {
            topic_id: true,
            topic_name: true,
            skills: { select: { skill_id: true, skill_name: true } },
          },
        },
      },
    },
  },
};

// GET /companies
export const getCompanies = async (req, res) => {
  const { search } = req.query;

  try {
    const whereClause = {};
    if (search) {
      whereClause.name = {
        contains: search.trim(),
        mode: 'insensitive',
      };
    }

    const dbCompanies = await prisma.companies.findMany({
      where: whereClause,
      include: {
        company_skills: {
          include: {
            skills: true,
          },
        },
        _count: {
          select: {
            interview_experiences: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    const formattedCompanies = dbCompanies.map(formatCompanySkills);
    res.json(serialize(formattedCompanies));
  } catch (err) {
    console.error('Error fetching companies:', err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
};

// GET /companies/:id
export const getCompanyById = async (req, res) => {
  try {
    const companyId = BigInt(req.params.id);
    const company = await prisma.companies.findUnique({
      where: { company_id: companyId },
      include: {
        company_skills: {
          include: { skills: { select: { skill_id: true, skill_name: true } } },
        },
        _count: { select: { interview_experiences: true } },
      },
    });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.json(serialize(company));
  } catch (err) {
    console.error("Error fetching company by ID:", err);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

// GET /companies/name/:company_name
export const getCompanyByName = async (req, res) => {
  const { company_name } = req.params;

  try {
    const company = await prisma.companies.findFirst({
      where: {
        name: {
          equals: company_name.trim(),
          mode: 'insensitive',
        },
      },
      include: {
        company_skills: {
          include: {
            skills: true,
          },
        },
        interview_experiences: {
          include: {
            users: {
              select: {
                name: true,
                college: true,
                branch: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      return res.status(404).json({ error: `Company '${company_name}' not found` });
    }

    const formattedCompany = formatCompanySkills(company);

    // Filter user information if the interview experience is anonymous
    if (formattedCompany.interview_experiences) {
      formattedCompany.interview_experiences = formattedCompany.interview_experiences.map((exp) => {
        const formattedExp = { ...exp };
        if (exp.is_anonymous_public) {
          formattedExp.users = {
            name: 'Anonymous User',
            college: null,
            branch: null,
          };
        }
        return formattedExp;
      });
    }

    res.json(serialize(formattedCompany));
  } catch (err) {
    console.error('Error fetching company details:', err);
    res.status(500).json({ error: 'Failed to fetch company details' });
  }
};

// POST /companies
export const createCompany = async (req, res) => {
  const { name, industry, website, logo_url } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Company name is required" });
  }

  try {
    const existing = await prisma.companies.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" } },
    });
    if (existing) {
      return res.status(409).json({ error: "A company with this name already exists" });
    }

    const company = await prisma.companies.create({
      data: {
        name: name.trim(),
        industry: industry?.trim() || null,
        website: website?.trim() || null,
        logo_url: logo_url?.trim() || null,
      },
    });

    res.status(201).json(serialize(company));
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ error: "Failed to create company" });
  }
};

// POST /companies/:id/skills
export const addSkillToCompany = async (req, res) => {
  const { id } = req.params;
  const { skill_id, usage_type } = req.body;
  if (!skill_id) {
    return res.status(400).json({ error: "skill_id is required" });
  }

  try {
    const companyId = BigInt(id);
    const skillId = BigInt(skill_id);

    const [company, skill] = await Promise.all([
      prisma.companies.findUnique({ where: { company_id: companyId } }),
      prisma.skills.findUnique({ where: { skill_id: skillId } }),
    ]);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    const companySkill = await prisma.company_skills.upsert({
      where: { company_id_skill_id: { company_id: companyId, skill_id: skillId } },
      update: { usage_type: usage_type || null },
      create: { company_id: companyId, skill_id: skillId, usage_type: usage_type || null },
      include: { skills: { select: { skill_name: true } } },
    });

    res.status(201).json(serialize(companySkill));
  } catch (err) {
    console.error("Error adding skill to company:", err);
    res.status(500).json({ error: "Failed to add skill to company" });
  }
};

// GET /companies/:id/analytics
export const getCompanyAnalytics = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = BigInt(id);
    const company = await prisma.companies.findUnique({
      where: { company_id: companyId },
      select: { company_id: true, name: true, industry: true, logo_url: true, website: true },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const experiences = await prisma.interview_experiences.findMany({
      where: { company_id: companyId, status: "published" },
      select: {
        overall_difficulty: true,
        role_title: true,
        rounds: roundsSelect,
      },
    });

    const total = experiences.length;
    const diffs = experiences.map((e) => e.overall_difficulty).filter(Boolean);
    const avgDifficulty =
      diffs.length > 0
        ? Number((diffs.reduce((s, d) => s + d, 0) / diffs.length).toFixed(1))
        : null;

    const distinctRoles = new Set(
      experiences.map((e) => e.role_title?.toLowerCase().trim()).filter(Boolean)
    ).size;

    const roundTypeCounts = {};
    experiences.forEach((exp) =>
      exp.rounds.forEach((r) => {
        const t = r.round_type || "Unknown";
        roundTypeCounts[t] = (roundTypeCounts[t] || 0) + 1;
      })
    );

    res.json(serialize({
      company: { ...company, company_id: Number(company.company_id) },
      overview: {
        total_experiences: total,
        distinct_roles: distinctRoles,
        avg_difficulty: avgDifficulty,
      },
      round_type_breakdown: Object.entries(roundTypeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      topics_by_skill: groupTopicsBySkill(experiences),
    }));
  } catch (err) {
    console.error("Error fetching company analytics:", err);
    res.status(500).json({ error: "Failed to fetch company analytics" });
  }
};

// GET /companies/:id/roles
export const getCompanyRoles = async (req, res) => {
  const { id } = req.params;

  try {
    const companyId = BigInt(id);
    const company = await prisma.companies.findUnique({
      where: { company_id: companyId },
      select: { company_id: true, name: true },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const experiences = await prisma.interview_experiences.findMany({
      where: { company_id: companyId, status: "published" },
      select: {
        role_title: true,
        overall_difficulty: true,
      },
    });

    const total = experiences.length;
    const roleMap = {};
    experiences.forEach((e) => {
      const role = e.role_title?.trim() || "Unknown";
      if (!roleMap[role]) {
        roleMap[role] = { role_title: role, count: 0, difficulties: [] };
      }
      roleMap[role].count++;
      if (e.overall_difficulty) roleMap[role].difficulties.push(e.overall_difficulty);
    });

    const roles = Object.values(roleMap)
      .map((r) => ({
        role_title: r.role_title,
        experience_count: r.count,
        percentage: total > 0 ? Math.round((r.count / total) * 100) : 0,
        avg_difficulty:
          r.difficulties.length > 0
            ? Number(
                (r.difficulties.reduce((s, d) => s + d, 0) / r.difficulties.length).toFixed(1)
              )
            : null,
      }))
      .sort((a, b) => b.experience_count - a.experience_count);

    res.json(serialize({
      company_id: Number(company.company_id),
      company_name: company.name,
      total_experiences: total,
      roles,
    }));
  } catch (err) {
    console.error("Error fetching company roles:", err);
    res.status(500).json({ error: "Failed to fetch company roles" });
  }
};

// GET /companies/:id/roles/:roleTitle/analytics
export const getRoleAnalytics = async (req, res) => {
  const { id, roleTitle: rawRoleTitle } = req.params;

  try {
    const companyId = BigInt(id);
    const roleTitle = decodeURIComponent(rawRoleTitle).trim();

    const company = await prisma.companies.findUnique({
      where: { company_id: companyId },
      select: { company_id: true, name: true },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    const experiences = await prisma.interview_experiences.findMany({
      where: {
        company_id: companyId,
        status: "published",
        role_title: { equals: roleTitle, mode: "insensitive" },
      },
      select: {
        overall_difficulty: true,
        rounds: roundsSelect,
      },
    });

    if (experiences.length === 0) {
      return res.status(404).json({ error: `No published experiences found for role "${roleTitle}"` });
    }

    const total = experiences.length;
    const diffs = experiences.map((e) => e.overall_difficulty).filter(Boolean);
    const avgDifficulty =
      diffs.length > 0
        ? Number((diffs.reduce((s, d) => s + d, 0) / diffs.length).toFixed(1))
        : null;

    const allRounds = experiences.flatMap((e) => e.rounds);
    const avgRounds = Number((allRounds.length / total).toFixed(1));
    const totalQuestionsTagged = allRounds.reduce(
      (s, r) => s + (r.questions?.length || 0),
      0
    );

    const roundTypeCounts = {};
    allRounds.forEach((r) => {
      const t = r.round_type || "Unknown";
      roundTypeCounts[t] = (roundTypeCounts[t] || 0) + 1;
    });

    res.json(serialize({
      company_id: Number(company.company_id),
      company_name: company.name,
      role_title: roleTitle,
      overview: {
        total_experiences: total,
        avg_difficulty: avgDifficulty,
        avg_rounds: avgRounds,
        total_questions_tagged: totalQuestionsTagged,
      },
      round_type_breakdown: Object.entries(roundTypeCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      topics_by_skill: groupTopicsBySkill(experiences),
    }));
  } catch (err) {
    console.error("Error fetching role analytics:", err);
    res.status(500).json({ error: "Failed to fetch role analytics" });
  }
};
