/**
 * @file routes/auth.js
 * @description Маршруты для API, связанные с аутентификацией.
 */
const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");

// @route POST /api/auth/login
router.post("/login", login);

module.exports = router;
