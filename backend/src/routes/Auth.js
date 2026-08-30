import express from 'express';
import { auth } from 'express-openid-connect';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

// Configure and initialize Auth0 middleware
const authMiddleware = auth({
  authRequired: false, // set to true to require authentication for all routes
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
});

// GET /
router.get('/', authController.home);

// GET /signup
router.get('/signup', authController.register);

// GET /login
router.get('/login', authController.login);

// GET /register
router.get('/register', authController.register);

export {
  router,
  authMiddleware,
};
