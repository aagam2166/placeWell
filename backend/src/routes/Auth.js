import express from 'express';
import { auth } from 'express-openid-connect';
import * as authController from '../controllers/AuthController.js';

const router = express.Router();

// Configure and initialize Auth0 middleware
const isProduction = process.env.NODE_ENV === 'production';

const authMiddleware = auth({
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET || process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || process.env.AUTH0_BASE_URL,
  clientID: process.env.CLIENT_ID || process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL || process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    // After Auth0 logout, redirect back to backend root /
    postLogoutRedirect: '/',
  },
  session: {
    cookie: {
      sameSite: isProduction ? 'None' : 'Lax',
      secure: isProduction,
    },
  },
});

// GET /
router.get('/', authController.home);

// GET /signup
router.get('/signup', authController.register);

// GET /login
router.get('/login', authController.login);

// GET /register
router.get('/register', authController.register);

// GET /logout — handled automatically by express-openid-connect when auth0Logout:true
// This explicit route just ensures it's visible in our route list

export {
  router,
  authMiddleware,
};
