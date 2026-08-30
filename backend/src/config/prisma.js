import 'dotenv/config';
import pkgClient from '@prisma/client';
const { PrismaClient } = pkgClient;
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

// Create a pg connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the pg adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
