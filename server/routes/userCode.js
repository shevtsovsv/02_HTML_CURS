/**
 * @file routes/userCode.js
 * @description Маршрут для API, связанный с кодом пользователя.
 */
const express = require("express");
const router = express.Router();
const { saveUserCode } = require("../controllers/userCodeController");
const { protect } = require("../middleware/protect");

// Этот роут будет защищен - только авторизованный пользователь может сохранять свой код.
router.post("/", protect, saveUserCode);

module.exports = router;
