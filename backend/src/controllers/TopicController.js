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
