import prisma from '../config/prisma.js';

// Helper to format user profile data with a clean skills array
function formatUserProfile(user) {
  if (!user) return null;
  const formattedUser = { ...user };
  if (user.user_skills) {
    formattedUser.skills = user.user_skills.map((us) => ({
      skill_id: us.skill_id,
      skill_name: us.skills?.skill_name,
      proficiency_level: us.proficiency_level,
    }));
    delete formattedUser.user_skills;
  } else {
    formattedUser.skills = [];
  }
  return formattedUser;
}

// GET /profile
export const getProfile = async (req, res) => {
  try {
    const userWithSkills = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      include: {
        user_skills: {
          include: {
            skills: true,
          },
        },
      },
    });

    res.json(formatUserProfile(userWithSkills));
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// POST /edit-profile
export const editProfile = async (req, res) => {
  const { name, college, branch, graduation_year, phone, skills } = req.body;

  try {
    const userId = req.user.user_id;

    // Resolve skill IDs (find existing skills or create new ones)
    const resolvedSkills = [];
    if (Array.isArray(skills)) {
      for (const skillItem of skills) {
        let skillId = skillItem.skill_id;
        
        // If skill_id is not provided but skill_name is, find or create the skill
        if (!skillId && skillItem.skill_name) {
          const trimmedName = skillItem.skill_name.trim();
          if (trimmedName) {
            let skillObj = await prisma.skills.findFirst({
              where: {
                skill_name: {
                  equals: trimmedName,
                  mode: 'insensitive',
                },
              },
            });

            if (!skillObj) {
              skillObj = await prisma.skills.create({
                data: { skill_name: trimmedName },
              });
            }
            skillId = skillObj.skill_id;
          }
        }

        if (skillId) {
          resolvedSkills.push({
            skill_id: BigInt(skillId),
            proficiency_level: skillItem.proficiency_level || 'Beginner',
          });
        }
      }
    }

    // Execute database updates in a transaction
    const updatedUser = await prisma.$transaction(async (tx) => {
      // 1. Update basic profile fields
      const userUpdateData = {};
      if (name !== undefined) userUpdateData.name = name;
      if (college !== undefined) userUpdateData.college = college;
      if (branch !== undefined) userUpdateData.branch = branch;
      if (graduation_year !== undefined) {
        userUpdateData.graduation_year = graduation_year ? parseInt(graduation_year, 10) : null;
      }
      if (phone !== undefined) userUpdateData.phone = phone;

      const user = await tx.users.update({
        where: { user_id: userId },
        data: userUpdateData,
      });

      // 2. Manage user skills if provided
      if (skills !== undefined) {
        // Delete all current skills
        await tx.user_skills.deleteMany({
          where: { user_id: userId },
        });

        // Insert new skills
        if (resolvedSkills.length > 0) {
          await tx.user_skills.createMany({
            data: resolvedSkills.map((rs) => ({
              user_id: userId,
              skill_id: rs.skill_id,
              proficiency_level: rs.proficiency_level,
            })),
          });
        }
      }

      // Fetch the fully updated user with skill details
      return await tx.users.findUnique({
        where: { user_id: userId },
        include: {
          user_skills: {
            include: {
              skills: true,
            },
          },
        },
      });
    });

    res.json({
      message: 'Profile updated successfully',
      user: formatUserProfile(updatedUser),
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
};
