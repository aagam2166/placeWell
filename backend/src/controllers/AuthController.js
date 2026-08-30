import prisma from '../config/prisma.js';
import escape from 'escape-html';

// GET /login
export const login = (req, res) => {
  const returnToUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/profile` : '/profile';
  if (req.oidc.isAuthenticated()) {
    if (req.accepts('html', 'json') === 'json') {
      return res.json({ authenticated: true, user: req.oidc.user });
    }
    return res.redirect(returnToUrl);
  }

  res.oidc.login({
    returnTo: returnToUrl,
  });
};

// GET /register /signup
export const register = (req, res) => {
  const returnToUrl = process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/profile` : '/profile';
  if (req.oidc.isAuthenticated()) {
    if (req.accepts('html', 'json') === 'json') {
      return res.json({ authenticated: true, user: req.oidc.user });
    }
    return res.redirect(returnToUrl);
  }

  res.oidc.login({
    returnTo: returnToUrl,
    authorizationParams: {
      screen_hint: 'signup',
    },
  });
};

// GET / — acts as a post-logout and post-login landing pad
// express-openid-connect uses returnTo for post-login, so authenticated hits here
// only happen if the user visits localhost:3000 directly.
export const home = (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  if (req.oidc.isAuthenticated()) {
    // Logged in but on backend root — send to frontend profile page
    return res.redirect(`${frontendUrl}/profile`);
  }
  // Not logged in (e.g. just logged out) — send to frontend homepage
  return res.redirect(frontendUrl);
};

