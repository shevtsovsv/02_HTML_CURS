/**
 * @file routes/courses.js
 * @description Маршруты для API, связанные с курсами.
 * Определяет эндпоинты и связывает их с соответствующими методами контроллера.
 */

const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");
const {protect} = require("../middleware/protect")

// В будущем сюда можно будет добавить middleware для защиты роутов
// const { protect, authorize } = require('../middleware/auth');

// --- Публичные роуты ---

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/osnovy-html-i-css
router.get("/:slug", protect, getCourseBySlug);

// --- Защищенные роуты (только для администраторов) ---

// POST /api/courses
// Пример, как будет выглядеть защищенный роут:
// router.post("/", protect, authorize('admin'), createCourse);
router.post("/", protect, createCourse);

// PUT /api/courses/1
router.put("/:id", protect, updateCourse);

// DELETE /api/courses/1
router.delete("/:id", protect, deleteCourse);

module.exports = router;
