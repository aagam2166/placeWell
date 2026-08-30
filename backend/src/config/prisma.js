import 'dotenv/config';
import pkgClient from '@prisma/client';
const { PrismaClient } = pkgClient;
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
const { Pool } = pkg;

// Create a pg connection pool with SSL support for Supabase/production
const isProduction = process.env.NODE_ENV === 'production' || (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase'));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
const adapter = new PrismaPg(pool);

// Instantiate PrismaClient with the pg adapter
const prisma = new PrismaClient({ adapter });

export default prisma;
