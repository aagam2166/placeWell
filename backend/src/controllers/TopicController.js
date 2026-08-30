import prisma from '../config/prisma.js';

// GET /api/v1/topics
export const getAllTopics = async (req, res) => {
  try {
    const rawTopics = await prisma.topics.findMany({
      include: {
        skills: true,
      },
      orderBy: {
        topic_id: 'asc',
      },
    });

    const topics = rawTopics.map((t) => ({
      topic_id: Number(t.topic_id),
      skill_id: t.skill_id ? Number(t.skill_id) : 1,
      topic_name: t.topic_name,
      parent_topic_id: t.parent_topic_id ? Number(t.parent_topic_id) : null,
      category: t.category || 'dsa',
      skill_name: t.skills ? t.skills.skill_name : null,
    }));

    return res.status(200).json(topics);
  } catch (err) {
    console.error('Error in getAllTopics controller:', err);
    return res.status(500).json({ error: 'Failed to fetch topics' });
  }
};

// GET /api/v1/skills
export const getAllSkills = async (req, res) => {
  try {
    const rawSkills = await prisma.skills.findMany({
      orderBy: {
        skill_id: 'asc',
      },
    });

    const skills = rawSkills.map((s) => ({
      skill_id: Number(s.skill_id),
      skill_name: s.skill_name,
    }));

    return res.status(200).json(skills);
  } catch (err) {
    console.error('Error in getAllSkills controller:', err);
    return res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

// GET /api/v1/questions
export const getAllQuestions = async (req, res) => {
  try {
    const rawQuestions = await prisma.questions.findMany({
      include: {
        question_topics: {
          include: {
            topics: true,
          },
        },
      },
      orderBy: {
        question_id: 'asc',
      },
    });

    const questions = rawQuestions.map((q) => ({
      question_id: Number(q.question_id),
      round_id: Number(q.round_id),
      topic_id: q.question_topics?.[0]?.topic_id ? Number(q.question_topics[0].topic_id) : 1,
      question_text: q.question_text || '',
      question_type: q.question_type || 'coding',
      difficulty: q.difficulty || 3,
      reference_link: q.reference_link || '',
      topics: q.question_topics?.[0]?.topics || null,
    }));

    return res.status(200).json(questions);
  } catch (err) {
    console.error('Error in getAllQuestions controller:', err);
    return res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

// GET /api/v1/resources
export const getAllResources = async (req, res) => {
  try {
    const rawResources = await prisma.resources.findMany({
      include: {
        skill_resources: true,
      },
      orderBy: {
        resource_id: 'asc',
      },
    });

    const resources = rawResources.map((r) => ({
      resource_id: Number(r.resource_id),
      experience_id: r.experience_id ? Number(r.experience_id) : undefined,
      title: r.title,
      content: r.content,
      url: r.content.startsWith('http') ? r.content : '',
      created_at: r.created_at ? r.created_at.toISOString() : new Date().toISOString(),
      skill_resources: r.skill_resources.map((sr) => ({
        skill_id: Number(sr.skill_id),
        resource_id: Number(sr.resource_id),
      })),
    }));

    return res.status(200).json(resources);
  } catch (err) {
    console.error('Error in getAllResources controller:', err);
    return res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

// GET /api/v1/user-skills
export const getAllUserSkills = async (req, res) => {
  try {
    const rawUserSkills = await prisma.user_skills.findMany({
      orderBy: {
        user_id: 'asc',
      },
    });

    const userSkills = rawUserSkills.map((us) => ({
      user_id: Number(us.user_id),
      skill_id: Number(us.skill_id),
      proficiency_level: us.proficiency_level || 'intermediate',
    }));

    return res.status(200).json(userSkills);
  } catch (err) {
    console.error('Error in getAllUserSkills controller:', err);
    return res.status(500).json({ error: 'Failed to fetch user skills' });
  }
};
