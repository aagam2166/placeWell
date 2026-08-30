const express = require("express");
const router = express.Router();
const authenticateUser = require("../Middleware/Auth");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  addSkillToCompany,
  getCompanyAnalytics,
  getCompanyRoles,       // add this
  getRoleAnalytics,      // add this
} = require("../controllers/company.controller");

router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.get("/:id/analytics", getCompanyAnalytics);
router.post("/", authenticateUser, createCompany);
router.post("/:id/skills", authenticateUser, addSkillToCompany);
router.get("/:id/roles", getCompanyRoles);
router.get("/:id/roles/:roleTitle/analytics", getRoleAnalytics);
module.exports = router;