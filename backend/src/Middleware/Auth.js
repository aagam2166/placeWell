import prisma from '../config/prisma.js';

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const xUserId = req.headers['x-user-id'];
    const auth0Id = req.auth?.payload?.sub || req.oidc?.user?.sub || xUserId || (authHeader ? authHeader.replace('Bearer ', '').trim() : null);

    const isPublicGet = (
      req.originalUrl.startsWith('/api/v1/experiences') ||
      req.originalUrl.startsWith('/api/v1/topics') ||
      req.originalUrl.startsWith('/api/v1/skills') ||
      req.originalUrl.startsWith('/api/v1/questions') ||
      req.originalUrl.startsWith('/api/v1/resources') ||
      req.originalUrl.startsWith('/api/v1/user-skills') ||
      req.originalUrl.startsWith('/api/companies')
    ) && req.method === 'GET';

    if (!auth0Id) {
      if (isPublicGet) {
        req.user = null;
        return next();
      }
      return res.status(401).json({ error: "Unauthorized: Authorization token or header is required" });
    }

    // Fetch user from database using Prisma
    let user = await prisma.users.findUnique({
      where: { auth_provider_id: auth0Id }
    });

    if (!user) {
      const provider = auth0Id.startsWith('google-oauth2|') ? 'google' : 'local';
      const email = req.oidc?.user?.email || req.auth?.payload?.email;
      const name = req.oidc?.user?.name || req.auth?.payload?.name || 'New Student';

      try {
        // upsert: create the user if not found by auth_provider_id, else no-op
        user = await prisma.users.upsert({
          where: { auth_provider_id: auth0Id },
          update: {},
          create: {
            auth_provider_id: auth0Id,
            auth_provider: provider,
            email: email || `${auth0Id}@placewell.local`,
            name,
          },
        });
      } catch (upsertErr) {
        // Email unique constraint hit — an account with this email already exists
        // under a different provider. Link auth_provider_id to that existing record.
        if (upsertErr.code === 'P2002' && email) {
          user = await prisma.users.update({
            where: { email },
            data: { auth_provider_id: auth0Id, auth_provider: provider },
          });
        } else {
          throw upsertErr;
        }
      }
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default authenticateUser;

