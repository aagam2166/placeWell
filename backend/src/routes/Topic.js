import express from 'express';
import { getAllTopics, getAllSkills, getAllQuestions } from '../controllers/TopicController.js';

const router = express.Router();

router.get('/topics', getAllTopics);
router.get('/skills', getAllSkills);
router.get('/questions', getAllQuestions);

export default router;
