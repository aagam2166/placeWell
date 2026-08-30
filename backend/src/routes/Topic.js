import express from 'express';
import {
  getAllTopics,
  getAllSkills,
  getAllQuestions,
  getAllResources,
  getAllUserSkills
} from '../controllers/TopicController.js';

const router = express.Router();

router.get('/topics', getAllTopics);
router.get('/skills', getAllSkills);
router.get('/questions', getAllQuestions);
router.get('/resources', getAllResources);
router.get('/user-skills', getAllUserSkills);

export default router;
