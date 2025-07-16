/**
 * @file routes/userProgress.js
 * @description Маршрут для API, связанный с прогрессом пользователя.
 */
const express = require("express");
const router = express.Router();
const { completeStep } = require("../controllers/userProgressController");
const { protect } = require("../middleware/protect");

router.post("/complete-step", protect, completeStep);

module.exports = router;
