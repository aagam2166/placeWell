import express from 'express';
import * as userController from '../controllers/UserController.js';
import authenticateUser from '../Middleware/Auth.js';

const router = express.Router();

// GET /profile
router.get('/profile', authenticateUser, userController.getProfile);

// POST /edit-profile
router.post('/edit-profile', authenticateUser, userController.editProfile);

export default router;
