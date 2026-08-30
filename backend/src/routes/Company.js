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

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.get('/name/:company_name', getCompanyByName);
router.get('/:id/analytics', getCompanyAnalytics);
router.post('/', authenticateUser, createCompany);
router.post('/:id/skills', authenticateUser, addSkillToCompany);
router.get('/:id/roles', getCompanyRoles);
router.get('/:id/roles/:roleTitle/analytics', getRoleAnalytics);

export default router;
