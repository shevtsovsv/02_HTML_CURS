/**
 * @file routes/steps.js
 * @description Маршруты для API, связанные с шагами проекта.
 */
const express = require("express");
const router = express.Router();
const {
  createStep,
  updateStep,
  deleteStep,
} = require("../controllers/stepController");
const { protect } = require("../middleware/protect");

// Все роуты для шагов защищены, только админ может ими управлять
router.post("/", protect, createStep);
router.put("/:id", protect, updateStep);
router.delete("/:id", protect, deleteStep);

module.exports = router;
