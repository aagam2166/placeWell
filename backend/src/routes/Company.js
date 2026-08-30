import express from 'express';
import authenticateUser from '../Middleware/Auth.js';
import {
  getCompanies,
  getCompanyById,
  getCompanyByName,
  createCompany,
  addSkillToCompany,
  getCompanyAnalytics,
  getCompanyRoles,
  getRoleAnalytics,
} from '../controllers/CompanyController.js';

const router = express.Router();

// GET /companies - Get list of companies with optional filters
router.get('/', getCompanies);

// GET /companies/name/:company_name - Fetch company info by name
router.get('/name/:company_name', getCompanyByName);

// GET /companies/:id - Get details of a company by its ID
router.get('/:id', getCompanyById);

// GET /companies/:id/analytics - Get placement and interview difficulty analytics
router.get('/:id/analytics', getCompanyAnalytics);

// POST /companies - Add/register a new company (Auth Required)
router.post('/', authenticateUser, createCompany);

// POST /companies/:id/skills - Map a skill to a company (Auth Required)
router.post('/:id/skills', authenticateUser, addSkillToCompany);

// GET /companies/:id/roles - Get roles offered at a company
router.get('/:id/roles', getCompanyRoles);

// GET /companies/:id/roles/:roleTitle/analytics - Get salary & difficulty analytics for a specific role
router.get('/:id/roles/:roleTitle/analytics', getRoleAnalytics);

export default router;

