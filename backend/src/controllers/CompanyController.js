import prisma from '../config/prisma.js';
import { serialize } from '../utils/response.js';

// Helper to format company skills
function formatCompanySkills(company) {
  if (!company) return null;
  const formattedCompany = { ...company };
  if (company.company_skills) {
    formattedCompany.skills = company.company_skills.map((cs) => ({
      skill_id: cs.skill_id ? Number(cs.skill_id) : null,
      skill_name: cs.skills?.skill_name || 'General',
      usage_type: cs.usage_type || 'frequent_interview_topic',
    }));
    delete formattedCompany.company_skills;
  } else {
    formattedCompany.skills = [];
  }
  return formattedCompany;
}

// Helper to group round topics by skill
const groupTopicsBySkill = (experiences) => {
  const totalRounds = experiences.reduce((s, e) => s + (e.rounds ? e.rounds.length : 0), 0);
  const skillMap = {};
  experiences.forEach((exp) => {
    if (!exp.rounds) return;
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
    round_id: true,
    round_number: true,
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
  const { search, industry, skill_id } = req.query;

  try {
    const whereClause = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { industry: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (industry && industry !== 'All') {
      whereClause.industry = { equals: industry.trim(), mode: 'insensitive' };
    }

    if (skill_id) {
      whereClause.company_skills = {
        some: {
          skill_id: BigInt(skill_id),
        },
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
  const { id } = req.params;
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const companyId = BigInt(id);
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
    const formatted = formatCompanySkills(company);
    res.json(serialize(formatted));
  } catch (err) {
    console.error("Error fetching company by ID:", err);
    res.status(500).json({ error: "Failed to fetch company" });
  }
};

// GET /companies/name/:company_name
export const getCompanyByName = async (req, res) => {
  const { company_name } = req.params;
  if (!company_name?.trim()) {
    return res.status(400).json({ error: "Company name is required" });
  }

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
        industry: industry?.trim() || 'Technology',
        website: website?.trim() || null,
        logo_url: logo_url?.trim() || null,
      },
      include: {
        company_skills: {
          include: { skills: true },
        },
        _count: { select: { interview_experiences: true } },
      },
    });

    const formatted = formatCompanySkills(company);
    res.status(201).json(serialize(formatted));
  } catch (err) {
    console.error("Error creating company:", err);
    res.status(500).json({ error: "Failed to create company" });
  }
};

// POST /companies/:id/skills
export const addSkillToCompany = async (req, res) => {
  const { id } = req.params;
  const { skill_id, skill_name, usage_type } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const companyId = BigInt(id);
    let resolvedSkillId = skill_id ? BigInt(skill_id) : null;

    if (!resolvedSkillId && skill_name?.trim()) {
      let existingSkill = await prisma.skills.findFirst({
        where: { skill_name: { equals: skill_name.trim(), mode: "insensitive" } },
      });
      if (!existingSkill) {
        existingSkill = await prisma.skills.create({
          data: { skill_name: skill_name.trim() },
        });
      }
      resolvedSkillId = existingSkill.skill_id;
    }

    if (!resolvedSkillId) {
      return res.status(400).json({ error: "skill_id or skill_name is required" });
    }

    const [company, skill] = await Promise.all([
      prisma.companies.findUnique({ where: { company_id: companyId } }),
      prisma.skills.findUnique({ where: { skill_id: resolvedSkillId } }),
    ]);

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    const companySkill = await prisma.company_skills.upsert({
      where: { company_id_skill_id: { company_id: companyId, skill_id: resolvedSkillId } },
      update: { usage_type: usage_type || "frequent_interview_topic" },
      create: { company_id: companyId, skill_id: resolvedSkillId, usage_type: usage_type || "frequent_interview_topic" },
      include: { skills: { select: { skill_id: true, skill_name: true } } },
    });

    res.status(201).json(serialize({
      company_id: Number(companySkill.company_id),
      skill_id: Number(companySkill.skill_id),
      usage_type: companySkill.usage_type,
      skill_name: companySkill.skills?.skill_name,
    }));
  } catch (err) {
    console.error("Error adding skill to company:", err);
    res.status(500).json({ error: "Failed to add skill to company" });
  }
};

// GET /companies/:id/analytics
export const getCompanyAnalytics = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

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
      where: { company_id: companyId },
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
      (exp.rounds || []).forEach((r) => {
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

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

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
      where: { company_id: companyId },
      select: {
        role_title: true,
        overall_difficulty: true,
        experience_type: true,
        year: true,
        result: true,
      },
    });

    const total = experiences.length;
    const roleMap = {};
    experiences.forEach((e) => {
      const role = e.role_title?.trim() || "Software Engineer";
      if (!roleMap[role]) {
        roleMap[role] = {
          role_title: role,
          count: 0,
          difficulties: [],
          types: new Set(),
          years: new Set(),
          recent_result: e.result,
        };
      }
      roleMap[role].count++;
      if (e.overall_difficulty) roleMap[role].difficulties.push(e.overall_difficulty);
      if (e.experience_type) roleMap[role].types.add(e.experience_type);
      if (e.year) roleMap[role].years.add(e.year);
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
        types: Array.from(r.types),
        years: Array.from(r.years).sort((a, b) => b - a),
        recent_result: r.recent_result || 'selected',
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

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid company ID" });
  }

  try {
    const companyId = BigInt(id);
    const roleTitle = decodeURIComponent(rawRoleTitle).trim();

    const company = await prisma.companies.findUnique({
      where: { company_id: companyId },
      select: { company_id: true, name: true, industry: true, logo_url: true, website: true },
    });

    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    let experiences = [];
    try {
      experiences = await prisma.interview_experiences.findMany({
        where: {
          company_id: companyId,
          role_title: { contains: roleTitle, mode: "insensitive" },
        },
      select: {
        experience_id: true,
        user_id: true,
        year: true,
        experience_type: true,
        result: true,
        overall_difficulty: true,
        summary_text: true,
        is_anonymous_public: true,
        users: {
          select: {
            college: true,
            branch: true,
            graduation_year: true,
          },
        },
        rounds: {
          select: {
            round_id: true,
            round_type: true,
            round_number: true,
            description_text: true,
            questions: {
              select: {
                question_id: true,
                question_text: true,
                question_type: true,
                difficulty: true,
                reference_link: true,
                question_topics: {
                  select: {
                    topics: {
                      select: {
                        topic_id: true,
                        topic_name: true,
                        category: true,
                        skills: { select: { skill_id: true, skill_name: true } },
                      },
                    },
                  },
                },
              },
            },
            round_topics: {
              select: {
                topics: {
                  select: {
                    topic_id: true,
                    topic_name: true,
                    category: true,
                    skills: { select: { skill_id: true, skill_name: true } },
                  },
                },
              },
            },
          },
        },
      },
      });
    } catch (dbErr) {
      console.warn(`[getRoleAnalytics] DB query notice for company ${companyId}, role ${roleTitle}:`, dbErr.message);
    }

    if (!experiences || experiences.length === 0) {
      return res.status(404).json({ error: `No database experiences found for role "${roleTitle}"` });
    }

    const total = experiences.length;
    const selectedCount = experiences.filter((e) => e.result === 'selected').length;
    const rejectedCount = experiences.filter((e) => e.result === 'rejected').length;

    const diffDist = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const diffs = [];
    experiences.forEach((e) => {
      if (e.overall_difficulty) {
        const diff = Math.min(Math.max(Math.round(e.overall_difficulty), 1), 5);
        diffDist[diff] = (diffDist[diff] || 0) + 1;
        diffs.push(e.overall_difficulty);
      }
    });

    const avgDifficulty =
      diffs.length > 0
        ? Number((diffs.reduce((s, d) => s + d, 0) / diffs.length).toFixed(1))
        : 3.0;

    const allRounds = experiences.flatMap((e) => e.rounds || []);
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

    const topicsBySkill = groupTopicsBySkill(experiences);

    // Format top topics for UI
    const topTopics = [];
    topicsBySkill.forEach((sk) => {
      sk.topics.forEach((t) => {
        topTopics.push({
          topic: { topic_id: t.topic_id, topic_name: t.topic_name, skill_id: sk.skill_id },
          skill: { skill_id: sk.skill_id, skill_name: sk.skill_name },
          count: t.count,
          percentage: t.frequency_percent,
        });
      });
    });
    topTopics.sort((a, b) => b.count - a.count);

    // Format FAQs
    const faqList = [];
    allRounds.forEach((r) => {
      (r.questions || []).forEach((q) => {
        const t = q.question_topics?.[0]?.topics || { topic_id: 1, topic_name: 'General', category: 'dsa' };
        faqList.push({
          question: {
            question_id: Number(q.question_id),
            round_id: Number(r.round_id),
            topic_id: Number(t.topic_id),
            question_text: q.question_text || 'Interview Question',
            question_type: q.question_type || 'technical',
            difficulty: q.difficulty || 3,
            reference_link: q.reference_link,
          },
          topic: {
            topic_id: Number(t.topic_id),
            skill_id: t.skills ? Number(t.skills.skill_id) : 1,
            topic_name: t.topic_name || 'General',
            parent_topic_id: null,
            category: t.category || 'dsa',
          },
          round_type: r.round_type || 'Tech',
        });
      });
    });

    // Format Contributors
    const contributors = experiences.map((exp) => ({
      experience_id: Number(exp.experience_id),
      user_id: exp.user_id ? Number(exp.user_id) : 1,
      college: exp.is_anonymous_public ? 'Premier Engineering College' : (exp.users?.college || 'Engineering College'),
      branch: exp.is_anonymous_public ? 'Computer Engineering' : (exp.users?.branch || 'Computer Engineering'),
      graduation_year: exp.users?.graduation_year || 2025,
      experience_year: exp.year || 2025,
      experience_type: exp.experience_type || 'placement',
      result: exp.result || 'selected',
      overall_difficulty: exp.overall_difficulty || 3,
      summary_text: exp.summary_text || '',
      is_anonymous_public: exp.is_anonymous_public || false,
    }));

    const mostCommonRoundEntry = Object.entries(roundTypeCounts).sort((a, b) => (b[1] || 0) - (a[1] || 0))[0];

    res.json(serialize({
      company: { ...company, company_id: Number(company.company_id) },
      role_title: roleTitle,
      total_experiences: total,
      types: Array.from(new Set(experiences.map((e) => e.experience_type).filter(Boolean))),
      years: Array.from(new Set(experiences.map((e) => e.year).filter(Boolean))).sort((a, b) => b - a),
      outcomes: {
        selected: selectedCount,
        rejected: rejectedCount,
        selected_pct: total > 0 ? Math.round((selectedCount / total) * 100) : 0,
        rejected_pct: total > 0 ? Math.round((rejectedCount / total) * 100) : 0,
      },
      difficulty_distribution: diffDist,
      avg_difficulty: avgDifficulty,
      round_structure: roundTypeCounts,
      top_topics: topTopics,
      frequently_asked_questions: faqList,
      contributors,
      insights: {
        most_common_topic: topTopics[0]?.topic?.topic_name || 'Core Problem Solving',
        most_difficult_topic: topTopics.find((t) => t.topic?.category === 'tech_stack' || t.topic?.category === 'subject')?.topic?.topic_name || 'System Design',
        most_common_round: mostCommonRoundEntry ? `${mostCommonRoundEntry[0]} Round` : 'Technical Round',
        top_skill: topTopics[0]?.skill?.skill_name || 'Data Structures & Algorithms',
      },
    }));
  } catch (err) {
    console.error("Error fetching role analytics:", err);
    res.status(500).json({ error: "Failed to fetch role analytics" });
  }
};
