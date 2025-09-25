/**
 * @file routes/validation.js
 * @description Routes for validation schema and rule builder functionality
 */

const express = require("express");
const router = express.Router();
const {
  getValidationSchema,
  getValidationCategories,
  getValidationRuleSchema,
  validateRuleConfiguration
} = require("../controllers/validationSchemaController");

// GET /api/validation/schema - get complete validation schema
router.get("/schema", getValidationSchema);

// GET /api/validation/categories - get validation rule categories
router.get("/categories", getValidationCategories);

// GET /api/validation/schema/:ruleType - get specific rule schema
router.get("/schema/:ruleType", getValidationRuleSchema);

// POST /api/validation/validate-rule - validate rule configuration
router.post("/validate-rule", validateRuleConfiguration);

module.exports = router;