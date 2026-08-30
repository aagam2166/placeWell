import prisma from '../config/prisma.js';

const authenticateUser = async (req, res, next) => {
  try {
    const auth0Id = req.auth?.payload?.sub || req.oidc?.user?.sub;

    if (!auth0Id) {
      return res.status(401).json({ error: "Unauthorized: No Auth0 ID found" });
    }

    // Fetch user from database using Prisma
    const user = await prisma.users.findUnique({
      where: { auth_provider_id: auth0Id }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in database" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Error in auth middleware:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default authenticateUser;
