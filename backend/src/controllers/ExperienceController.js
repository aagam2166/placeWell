import prisma from '../config/prisma.js';

// Helper to resolve company ID by ID or Name
async function resolveCompanyId(tx, companyId, companyName) {
  if (companyId) return BigInt(companyId);
  if (companyName && companyName.trim()) {
    const trimmedName = companyName.trim();
    let company = await tx.companies.findFirst({
      where: { name: { equals: trimmedName, mode: 'insensitive' } },
    });
    if (!company) {
      company = await tx.companies.create({
        data: { name: trimmedName },
      });
    }
    return company.company_id;
  }
  return null;
}

// Helper to resolve topic ID by ID or Name
async function resolveTopicId(tx, topicId, topicName) {
  if (topicId) return BigInt(topicId);
  if (topicName && topicName.trim()) {
    const trimmedName = topicName.trim();
    let topic = await tx.topics.findFirst({
      where: { topic_name: { equals: trimmedName, mode: 'insensitive' } },
    });
    if (!topic) {
      topic = await tx.topics.create({
        data: { topic_name: trimmedName },
      });
    }
    return topic.topic_id;
  }
  return null;
}

// GET /experiences
export const getExperiences = async (req, res) => {
  const { company_id, role, search } = req.query;

  try {
    const whereClause = {};

    if (company_id) {
      whereClause.company_id = BigInt(company_id);
    }

    if (role) {
      whereClause.role_title = {
        contains: role.trim(),
        mode: 'insensitive',
      };
    }

    if (search) {
      whereClause.OR = [
        { role_title: { contains: search.trim(), mode: 'insensitive' } },
        { summary_text: { contains: search.trim(), mode: 'insensitive' } },
        {
          companies: {
            name: { contains: search.trim(), mode: 'insensitive' },
          },
        },
      ];
    }

    const experiences = await prisma.interview_experiences.findMany({
      where: whereClause,
      include: {
        companies: {
          select: {
            name: true,
            logo_url: true,
          },
        },
        users: {
          select: {
            name: true,
            college: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Sanitize user information for anonymous submissions
    const sanitizedExperiences = experiences.map((exp) => {
      const formatted = { ...exp };
      if (exp.is_anonymous_public) {
        formatted.users = { name: 'Anonymous User', college: null };
      }
      return formatted;
    });

    res.json(sanitizedExperiences);
  } catch (err) {
    console.error('Error fetching experiences:', err);
    res.status(500).json({ error: 'Failed to fetch interview experiences' });
  }
};

// Helper to format experience responses for compatibility
function formatExperienceResponse(exp) {
  if (!exp) return null;
  const formatted = { ...exp };
  
  if (exp.rounds) {
    formatted.rounds = exp.rounds.map((round) => {
      const formattedRound = { ...round };
      // Map round_topics[0].topics to round.topics for single-topic compatibility
      formattedRound.topics = round.round_topics?.[0]?.topics || null;
      
      if (round.questions) {
        formattedRound.questions = round.questions.map((q) => {
          const formattedQ = { ...q };
          formattedQ.topics = q.question_topics?.[0]?.topics || null;
          delete formattedQ.question_topics;
          return formattedQ;
        });
      }
      delete formattedRound.round_topics;
      return formattedRound;
    });
  }
  return formatted;
}

// GET /experiences/:id
export const getExperienceById = async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await prisma.interview_experiences.findUnique({
      where: { experience_id: BigInt(id) },
      include: {
        companies: true,
        users: {
          select: {
            name: true,
            college: true,
            branch: true,
            graduation_year: true,
          },
        },
        resources: true,
        rounds: {
          orderBy: {
            round_number: 'asc',
          },
          include: {
            round_topics: {
              include: {
                topics: true,
              },
            },
            questions: {
              include: {
                question_topics: {
                  include: {
                    topics: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!experience) {
      return res.status(404).json({ error: `Experience with ID ${id} not found` });
    }

    // Sanitize user info if the experience is anonymous
    const sanitized = formatExperienceResponse(experience);
    if (experience.is_anonymous_public) {
      sanitized.users = {
        name: 'Anonymous User',
        college: null,
        branch: null,
        graduation_year: null,
      };
    }

    res.json(sanitized);
  } catch (err) {
    console.error('Error fetching specific experience:', err);
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
};

// POST /experiences
export const createExperience = async (req, res) => {
  const {
    company_id,
    company_name,
    role_title,
    experience_type,
    year,
    result,
    overall_difficulty,
    ctc_or_stipend,
    summary_text,
    is_anonymous_public,
    status,
    rounds,
    resources,
  } = req.body;

  if (!role_title) {
    return res.status(400).json({ error: 'Role title is required' });
  }

  // VALIDATION: difficulty check (between 1 and 5)
  if (overall_difficulty !== undefined && overall_difficulty !== null) {
    const diffVal = parseInt(overall_difficulty, 10);
    if (isNaN(diffVal) || diffVal < 1 || diffVal > 5) {
      return res.status(400).json({ error: 'Overall difficulty must be between 1 and 5' });
    }
  }

  if (Array.isArray(rounds)) {
    for (const roundItem of rounds) {
      if (roundItem.difficulty !== undefined && roundItem.difficulty !== null) {
        const diffVal = parseInt(roundItem.difficulty, 10);
        if (isNaN(diffVal) || diffVal < 1 || diffVal > 5) {
          return res.status(400).json({ error: 'Round difficulty must be between 1 and 5' });
        }
      }
      if (Array.isArray(roundItem.questions)) {
        for (const qItem of roundItem.questions) {
          if (qItem.difficulty !== undefined && qItem.difficulty !== null) {
            const diffVal = parseInt(qItem.difficulty, 10);
            if (isNaN(diffVal) || diffVal < 1 || diffVal > 5) {
              return res.status(400).json({ error: 'Question difficulty must be between 1 and 5' });
            }
          }
        }
      }
    }
  }

  try {
    const userId = req.user.user_id;

    const newExperience = await prisma.$transaction(async (tx) => {
      // 1. Resolve Company ID
      const resolvedCompanyId = await resolveCompanyId(tx, company_id, company_name);

      // 2. Create Interview Experience
      const experience = await tx.interview_experiences.create({
        data: {
          user_id: userId,
          company_id: resolvedCompanyId,
          role_title,
          experience_type,
          year: year ? parseInt(year, 10) : null,
          result,
          overall_difficulty: overall_difficulty ? parseInt(overall_difficulty, 10) : null,
          ctc_or_stipend: ctc_or_stipend ? String(ctc_or_stipend) : null,
          summary_text,
          is_anonymous_public: !!is_anonymous_public,
          status: status || 'draft',
        },
      });

      // 3. Create Resources if any
      if (Array.isArray(resources)) {
        for (const resItem of resources) {
          const contentVal = resItem.content || resItem.url;
          if (resItem.title && contentVal) {
            await tx.resources.create({
              data: {
                experience_id: experience.experience_id,
                title: resItem.title,
                content: contentVal,
              },
            });
          }
        }
      }

      // 4. Create Rounds & Questions
      if (Array.isArray(rounds)) {
        for (const roundItem of rounds) {
          const roundTopicId = await resolveTopicId(tx, roundItem.topic_id, roundItem.topic_name);

          if (roundItem.round_number === undefined || roundItem.round_number === null) {
            throw new Error('round_number is required for all rounds');
          }

          const round = await tx.rounds.create({
            data: {
              experience_id: experience.experience_id,
              round_number: parseInt(roundItem.round_number, 10),
              round_type: roundItem.round_type,
              duration_minutes: roundItem.duration_minutes ? parseInt(roundItem.duration_minutes, 10) : null,
              description_text: roundItem.description_text,
              platform_used: roundItem.platform_used,
              difficulty: roundItem.difficulty ? parseInt(roundItem.difficulty, 10) : null,
              notes: roundItem.notes,
            },
          });

          // Insert into round_topics many-to-many
          if (roundTopicId) {
            await tx.round_topics.create({
              data: {
                round_id: round.round_id,
                topic_id: roundTopicId,
              },
            });
          }

          // Create questions for this round
          if (Array.isArray(roundItem.questions)) {
            for (const qItem of roundItem.questions) {
              const question = await tx.questions.create({
                data: {
                  round_id: round.round_id,
                  question_text: qItem.question_text || null,
                  question_type: qItem.question_type,
                  difficulty: qItem.difficulty ? parseInt(qItem.difficulty, 10) : null,
                  reference_link: qItem.reference_link,
                },
              });

              const qTopicId = await resolveTopicId(tx, qItem.topic_id, qItem.topic_name);
              const targetTopicId = qTopicId || roundTopicId;
              if (targetTopicId) {
                await tx.question_topics.create({
                  data: {
                    question_id: question.question_id,
                    topic_id: targetTopicId,
                  },
                });
              }
            }
          }
        }
      }

      // Fetch the complete experience record to return
      return await tx.interview_experiences.findUnique({
        where: { experience_id: experience.experience_id },
        include: {
          companies: true,
          resources: true,
          rounds: {
            orderBy: {
              round_number: 'asc',
            },
            include: {
              round_topics: {
                include: {
                  topics: true,
                },
              },
              questions: {
                include: {
                  question_topics: {
                    include: {
                      topics: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    res.status(201).json(formatExperienceResponse(newExperience));
  } catch (err) {
    console.error('Error creating experience:', err);
    res.status(500).json({ error: 'Failed to create interview experience' });
  }
};

// PATCH /experiences/:id
export const updateExperience = async (req, res) => {
  const { id } = req.params;
  const {
    company_id,
    company_name,
    role_title,
    experience_type,
    year,
    result,
    overall_difficulty,
    ctc_or_stipend,
    summary_text,
    is_anonymous_public,
    status,
    rounds,
    resources,
  } = req.body;

  // VALIDATION: difficulty check (between 1 and 5)
  if (overall_difficulty !== undefined && overall_difficulty !== null) {
    const diffVal = parseInt(overall_difficulty, 10);
    if (isNaN(diffVal) || diffVal < 1 || diffVal > 5) {
      return res.status(400).json({ error: 'Overall difficulty must be between 1 and 5' });
    }
  }

  if (Array.isArray(rounds)) {
    for (const roundItem of rounds) {
      if (roundItem.difficulty !== undefined && roundItem.difficulty !== null) {
        const diffVal = parseInt(roundItem.difficulty, 10);
        if (isNaN(diffVal) || diffVal < 1 || diffVal > 5) {
          return res.status(400).json({ error: 'Round difficulty must be between 1 and 5' });
        }
      }
      if (Array.isArray(roundItem.questions)) {
        for (const qItem of roundItem.questions) {
          if (qItem.difficulty !== undefined && qItem.difficulty !== null) {
            const diffVal = parseInt(qItem.difficulty, 10);
            if (isNaN(diffVal) || diffVal < 1 || diffVal > 5) {
              return res.status(400).json({ error: 'Question difficulty must be between 1 and 5' });
            }
          }
        }
      }
    }
  }

  try {
    const experienceId = BigInt(id);
    const userId = req.user.user_id;

    // Verify experience exists and user owns it
    const existingExperience = await prisma.interview_experiences.findUnique({
      where: { experience_id: experienceId },
    });

    if (!existingExperience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    if (existingExperience.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this experience' });
    }

    const updatedExperience = await prisma.$transaction(async (tx) => {
      // 1. Resolve Company ID if company info was updated
      let resolvedCompanyId = undefined;
      if (company_id !== undefined || company_name !== undefined) {
        resolvedCompanyId = await resolveCompanyId(tx, company_id, company_name);
      }

      // 2. Build the experience updates object
      const experienceUpdates = {};
      if (resolvedCompanyId !== undefined) experienceUpdates.company_id = resolvedCompanyId;
      if (role_title !== undefined) experienceUpdates.role_title = role_title;
      if (experience_type !== undefined) experienceUpdates.experience_type = experience_type;
      if (year !== undefined) experienceUpdates.year = year ? parseInt(year, 10) : null;
      if (result !== undefined) experienceUpdates.result = result;
      if (overall_difficulty !== undefined) {
        experienceUpdates.overall_difficulty = overall_difficulty ? parseInt(overall_difficulty, 10) : null;
      }
      if (ctc_or_stipend !== undefined) {
        experienceUpdates.ctc_or_stipend = ctc_or_stipend ? String(ctc_or_stipend) : null;
      }
      if (summary_text !== undefined) experienceUpdates.summary_text = summary_text;
      if (is_anonymous_public !== undefined) experienceUpdates.is_anonymous_public = !!is_anonymous_public;
      if (status !== undefined) experienceUpdates.status = status;

      // Update experience main properties
      await tx.interview_experiences.update({
        where: { experience_id: experienceId },
        data: experienceUpdates,
      });

      // 3. Manage Resources if provided
      if (resources !== undefined) {
        // Delete all current resources
        await tx.resources.deleteMany({
          where: { experience_id: experienceId },
        });

        // Insert updated ones
        if (Array.isArray(resources)) {
          for (const resItem of resources) {
            const contentVal = resItem.content || resItem.url;
            if (resItem.title && contentVal) {
              await tx.resources.create({
                data: {
                  experience_id: experienceId,
                  title: resItem.title,
                  content: contentVal,
                },
              });
            }
          }
        }
      }

      // 4. Manage Rounds and Questions if provided
      if (rounds !== undefined) {
        // Delete all current rounds (this cascades to questions, round_topics, and question_topics via onDelete: Cascade)
        await tx.rounds.deleteMany({
          where: { experience_id: experienceId },
        });

        // Recreate them
        if (Array.isArray(rounds)) {
          for (const roundItem of rounds) {
            const roundTopicId = await resolveTopicId(tx, roundItem.topic_id, roundItem.topic_name);

            if (roundItem.round_number === undefined || roundItem.round_number === null) {
              throw new Error('round_number is required for all rounds');
            }

            const round = await tx.rounds.create({
              data: {
                experience_id: experienceId,
                round_number: parseInt(roundItem.round_number, 10),
                round_type: roundItem.round_type,
                duration_minutes: roundItem.duration_minutes ? parseInt(roundItem.duration_minutes, 10) : null,
                description_text: roundItem.description_text,
                platform_used: roundItem.platform_used,
                difficulty: roundItem.difficulty ? parseInt(roundItem.difficulty, 10) : null,
                notes: roundItem.notes,
              },
            });

            // Insert into round_topics many-to-many
            if (roundTopicId) {
              await tx.round_topics.create({
                data: {
                  round_id: round.round_id,
                  topic_id: roundTopicId,
                },
              });
            }

            if (Array.isArray(roundItem.questions)) {
              for (const qItem of roundItem.questions) {
                const question = await tx.questions.create({
                  data: {
                    round_id: round.round_id,
                    question_text: qItem.question_text || null,
                    question_type: qItem.question_type,
                    difficulty: qItem.difficulty ? parseInt(qItem.difficulty, 10) : null,
                    reference_link: qItem.reference_link,
                  },
                });

                const qTopicId = await resolveTopicId(tx, qItem.topic_id, qItem.topic_name);
                const targetTopicId = qTopicId || roundTopicId;
                if (targetTopicId) {
                  await tx.question_topics.create({
                    data: {
                      question_id: question.question_id,
                      topic_id: targetTopicId,
                    },
                  });
                }
              }
            }
          }
        }
      }

      // Fetch the updated experience details
      return await tx.interview_experiences.findUnique({
        where: { experience_id: experienceId },
        include: {
          companies: true,
          resources: true,
          rounds: {
            orderBy: {
              round_number: 'asc',
            },
            include: {
              round_topics: {
                include: {
                  topics: true,
                },
              },
              questions: {
                include: {
                  question_topics: {
                    include: {
                      topics: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    });

    res.json(formatExperienceResponse(updatedExperience));
  } catch (err) {
    console.error('Error updating experience:', err);
    res.status(500).json({ error: 'Failed to update interview experience' });
  }
};

// GET /experiences/:id/skills
export const getExperienceSkills = async (req, res) => {
  const { id } = req.params;

  try {
    const experience = await prisma.interview_experiences.findUnique({
      where: { experience_id: BigInt(id) },
      include: {
        rounds: {
          include: {
            round_topics: {
              include: {
                topics: {
                  include: {
                    skills: true,
                  },
                },
              },
            },
            questions: {
              include: {
                question_topics: {
                  include: {
                    topics: {
                      include: {
                        skills: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!experience) {
      return res.status(404).json({ error: `Experience with ID ${id} not found` });
    }

    const skillsMap = new Map();

    if (experience.rounds) {
      for (const round of experience.rounds) {
        // 1. Extract skill from round topics
        if (round.round_topics) {
          for (const rt of round.round_topics) {
            if (rt.topics && rt.topics.skills) {
              const skill = rt.topics.skills;
              skillsMap.set(skill.skill_id.toString(), {
                skill_id: skill.skill_id,
                skill_name: skill.skill_name,
              });
            }
          }
        }

        // 2. Extract skills from question topics in this round
        if (round.questions) {
          for (const q of round.questions) {
            if (q.question_topics) {
              for (const qt of q.question_topics) {
                if (qt.topics && qt.topics.skills) {
                  const skill = qt.topics.skills;
                  skillsMap.set(skill.skill_id.toString(), {
                    skill_id: skill.skill_id,
                    skill_name: skill.skill_name,
                  });
                }
              }
            }
          }
        }
      }
    }

    const uniqueSkills = Array.from(skillsMap.values());
    res.json(uniqueSkills);
  } catch (err) {
    console.error('Error retrieving experience skills:', err);
    res.status(500).json({ error: 'Failed to retrieve experience skills' });
  }
};
