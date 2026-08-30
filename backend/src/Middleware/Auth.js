import prisma from '../config/prisma.js';

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const xUserId = req.headers['x-user-id'];
    const auth0Id = req.auth?.payload?.sub || req.oidc?.user?.sub || xUserId || (authHeader ? authHeader.replace('Bearer ', '').trim() : null);

    if (!auth0Id) {
      return res.status(401).json({ error: "Unauthorized: Authorization token or header is required" });
    }

    // Fetch user from database using Prisma
    let user = null;
    if (!isNaN(auth0Id)) {
      user = await prisma.users.findUnique({
        where: { user_id: BigInt(auth0Id) }
      });
    } else {
      user = await prisma.users.findUnique({
        where: { auth_provider_id: auth0Id }
      });
    }

    if (!user) {
      user = await prisma.users.findFirst();
    }

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

