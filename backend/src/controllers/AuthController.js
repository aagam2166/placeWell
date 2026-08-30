import prisma from '../config/prisma.js';
import escape from 'escape-html';

// GET /login
export const login = (req, res) => {
  if (req.oidc.isAuthenticated()) {
    if (req.accepts('html', 'json') === 'json') {
      return res.json({ authenticated: true, user: req.oidc.user });
    }
    return res.redirect('/profile');
  }

  res.oidc.login({
    returnTo: '/profile',
  });
};

// GET /register /signup
export const register = (req, res) => {
  if (req.oidc.isAuthenticated()) {
    if (req.accepts('html', 'json') === 'json') {
      return res.json({ authenticated: true, user: req.oidc.user });
    }
    return res.redirect('/profile');
  }

  res.oidc.login({
    returnTo: '/profile',
    authorizationParams: {
      screen_hint: 'signup',
    },
  });
};

// GET /
export const home = async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.type('html').send(`
      <a href="/register">Signup</a><br>
      <a href="/login">Log in</a>
    `);
  }

  const auth0Id = req.oidc.user.sub;
  let dbUser = null;
  let dbStatusMessage = '';

  try {
    // Query database for the user using Prisma
    dbUser = await prisma.users.findUnique({
      where: { auth_provider_id: auth0Id },
    });

    if (!dbUser) {
      // Determine provider dynamically based on the Auth0 sub prefix
      const provider = auth0Id.startsWith('google-oauth2|') ? 'google' : 'local';

      // Create user if not present using Prisma
      dbUser = await prisma.users.create({
        data: {
          auth_provider_id: auth0Id,
          auth_provider: provider,
          email: req.oidc.user.email,
          name: req.oidc.user.name,
        },
      });
      dbStatusMessage = '<p style="color: green; font-weight: bold;">User record synced and created in database via Prisma!</p>';
    } else {
      dbStatusMessage = '<p style="color: blue;">User loaded from database via Prisma.</p>';
    }
  } catch (err) {
    console.error('Prisma database integration error:', err);
    dbStatusMessage = `<p style="color: red;">Error communicating with database via Prisma: ${escape(err.message || err)}</p>`;
  }

  res.type('html').send(`
    <p>Logged in as ${escape(req.oidc.user.name)}</p>
    
    <h2>Auth0 Profile (ID Token Claims)</h2>
    <pre>${escape(JSON.stringify(req.oidc.user, null, 2))}</pre>

    <h2>Database Status (Prisma)</h2>
    ${dbStatusMessage}
    ${dbUser ? `
      <h3>User Record from Database</h3>
      <pre>${escape(JSON.stringify(dbUser, null, 2))}</pre>
    ` : ''}

    <br>
    <a href="/logout">Log out</a>
  `);
};
