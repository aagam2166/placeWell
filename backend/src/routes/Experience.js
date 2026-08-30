import express from 'express';
import * as experienceController from '../controllers/ExperienceController.js';
import authenticateUser from '../Middleware/Auth.js';

const router = express.Router();

// GET /
router.get('/', authenticateUser, experienceController.getExperiences);

// GET /:id
router.get('/:id', authenticateUser, experienceController.getExperienceById);

// POST /
router.post('/', authenticateUser, experienceController.createExperience);

// PATCH /:id
router.patch('/:id', authenticateUser, experienceController.updateExperience);

// GET /:id/skills
router.get('/:id/skills', authenticateUser, experienceController.getExperienceSkills);

export default router;
