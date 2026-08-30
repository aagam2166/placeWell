const prisma = require("../config/prisma");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

const roundsSelect = {
  select: {
    round_type: true,
    questions: { select: { question_id: true } },
    topics: {
      select: {
        topic_id: true,
        topic_name: true,
        skills: { select: { skill_id: true, skill_name: true } },
      },
    },
  },
};

const groupTopicsBySkill = (experiences) => {
  const totalRounds = experiences.reduce((s, e) => s + e.rounds.length, 0);
  const skillMap = {};
  experiences.forEach((exp) => {
    exp.rounds.forEach((round) => {
      if (!round.topics) return;
      const topic = round.topics;
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

const getAllCompanies = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const companies = await prisma.companies.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    select: {
      company_id: true,
      name: true,
      industry: true,
      website: true,
      logo_url: true,
      _count: { select: { interview_experiences: true } },
    },
    orderBy: { name: "asc" },
  });
  sendSuccess(res, { count: companies.length, data: companies });
});

const getCompanyById = asyncHandler(async (req, res) => {
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
  if (!company) throw new AppError("Company not found", 404);
  sendSuccess(res, { data: company });
});

const createCompany = asyncHandler(async (req, res) => {
  const { name, industry, website, logo_url } = req.body;
  if (!name?.trim()) throw new AppError("Company name is required", 400);
  const existing = await prisma.companies.findFirst({
    where: { name: { equals: name.trim(), mode: "insensitive" } },
  });
  if (existing) throw new AppError("A company with this name already exists", 409);
  const company = await prisma.companies.create({
    data: {
      name: name.trim(),
      industry: industry?.trim() || null,
      website: website?.trim() || null,
      logo_url: logo_url?.trim() || null,
    },
  });
  sendSuccess(res, { data: company }, 201);
});

const addSkillToCompany = asyncHandler(async (req, res) => {
  const companyId = BigInt(req.params.id);
  const { skill_id, usage_type } = req.body;
  if (!skill_id) throw new AppError("skill_id is required", 400);
  const skillId = BigInt(skill_id);
  const [company, skill] = await Promise.all([
    prisma.companies.findUnique({ where: { company_id: companyId } }),
    prisma.skills.findUnique({ where: { skill_id: skillId } }),
  ]);
  if (!company) throw new AppError("Company not found", 404);
  if (!skill) throw new AppError("Skill not found", 404);
  const companySkill = await prisma.company_skills.upsert({
    where: { company_id_skill_id: { company_id: companyId, skill_id: skillId } },
    update: { usage_type: usage_type || null },
    create: { company_id: companyId, skill_id: skillId, usage_type: usage_type || null },
    include: { skills: { select: { skill_name: true } } },
  });
  sendSuccess(res, { data: companySkill }, 201);
});

const getCompanyAnalytics = asyncHandler(async (req, res) => {
  const companyId = BigInt(req.params.id);
  const company = await prisma.companies.findUnique({
    where: { company_id: companyId },
    select: { company_id: true, name: true, industry: true, logo_url: true, website: true },
  });
  if (!company) throw new AppError("Company not found", 404);
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
  // Distinct roles count
  const distinctRoles = new Set(
    experiences.map((e) => e.role_title?.toLowerCase().trim()).filter(Boolean)
  ).size;
  // Round type breakdown
  const roundTypeCounts = {};
  experiences.forEach((exp) =>
    exp.rounds.forEach((r) => {
      const t = r.round_type || "Unknown";
      roundTypeCounts[t] = (roundTypeCounts[t] || 0) + 1;
    })
  );
  sendSuccess(res, {
    data: {
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
    },
  });
});

const getCompanyRoles = asyncHandler(async (req, res) => {
  const companyId = BigInt(req.params.id);
  const company = await prisma.companies.findUnique({
    where: { company_id: companyId },
    select: { company_id: true, name: true },
  });
  if (!company) throw new AppError("Company not found", 404);
  const experiences = await prisma.interview_experiences.findMany({
    where: { company_id: companyId, status: "published" },
    select: {
      role_title: true,
      overall_difficulty: true,
    },
  });
  const total = experiences.length;
  // Group by role_title
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
  sendSuccess(res, {
    data: {
      company_id: Number(company.company_id),
      company_name: company.name,
      total_experiences: total,
      roles,
    },
  });
});



const getRoleAnalytics = asyncHandler(async (req, res) => {
  const companyId = BigInt(req.params.id);
  const roleTitle = decodeURIComponent(req.params.roleTitle).trim();
  const company = await prisma.companies.findUnique({
    where: { company_id: companyId },
    select: { company_id: true, name: true },
  });
  if (!company) throw new AppError("Company not found", 404);
  const experiences = await prisma.interview_experiences.findMany({
    where: {
      company_id: companyId,
      status: "published",
      role_title: { equals: roleTitle, mode: "insensitive" },
    },
    select: {
      overall_difficulty: true,
      total_rounds: true,
      rounds: roundsSelect,
    },
  });
  if (experiences.length === 0) {
    throw new AppError(`No published experiences found for role "${roleTitle}"`, 404);
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
  sendSuccess(res, {
    data: {
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
    },
  });
});


module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  addSkillToCompany,
  getCompanyAnalytics,
  getCompanyRoles,
  getRoleAnalytics,
};
