require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const escape = require('escape-html');
const prisma = require('./src/config/prisma');

const app = express();

app.use(
  auth({
    authRequired: false, // set to true to require authentication for all routes
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  })
);

app.get('/signup', (req, res) =>
  res.oidc.login({
    returnTo: '/',
    authorizationParams: { screen_hint: 'signup' },
  })
);

app.get('/', async (req, res) => {
  if (!req.oidc.isAuthenticated()) {
    return res.type('html').send(`
      <a href="/signup">Signup</a><br>
      <a href="/login">Log in</a>
    `);
  }

  const auth0Id = req.oidc.user.sub;
  let dbUser = null;
  let dbStatusMessage = '';

  try {
    // Query database for the user using Prisma
    dbUser = await prisma.users.findUnique({
      where: { auth0_id: auth0Id }
    });

    if (!dbUser) {
      // Create user if not present using Prisma
      dbUser = await prisma.users.create({
        data: {
          auth0_id: auth0Id,
          email: req.oidc.user.email,
          name: req.oidc.user.name,
        }
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
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));


