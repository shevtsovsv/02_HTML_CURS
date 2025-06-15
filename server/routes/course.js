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

// В будущем сюда можно будет добавить middleware для защиты роутов
// const { protect, authorize } = require('../middleware/auth');

// --- Публичные роуты ---

// GET /api/courses
router.get("/", getAllCourses);

// GET /api/courses/osnovy-html-i-css
router.get("/:slug", getCourseBySlug);

// --- Защищенные роуты (только для администраторов) ---

// POST /api/courses
// Пример, как будет выглядеть защищенный роут:
// router.post("/", protect, authorize('admin'), createCourse);
router.post("/", createCourse);

// PUT /api/courses/1
router.put("/:id", updateCourse);

// DELETE /api/courses/1
router.delete("/:id", deleteCourse);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { course } = require("../models"); // Импортируем модель course

// // Получить все курсы
// router.get("/", async (req, res) => {
//   try {
//     const courses = await course.findAll();
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при получении курсов" });
//   }
// });

// // Получить курс по ID
// router.get("/:id", async (req, res) => {
//   try {
//     const courseData = await course.findByPk(req.params.id);
//     if (courseData) {
//       res.json(courseData);
//     } else {
//       res.status(404).json({ error: "Курс не найден" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при получении курса" });
//   }
// });

// // Создать новый курс
// router.post("/", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const newCourse = await course.create({ title, description });
//     res.status(201).json(newCourse);
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при создании курса" });
//   }
// });

// // Обновить курс
// router.put("/:id", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const updatedCourse = await course.update(
//       { title, description },
//       { where: { id: req.params.id }, returning: true }
//     );
//     if (updatedCourse[0] === 1) {
//       res.json(updatedCourse[1][0]);
//     } else {
//       res.status(404).json({ error: "Курс не найден" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при обновлении курса" });
//   }
// });

// // Удалить курс
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedCourse = await course.destroy({
//       where: { id: req.params.id },
//     });
//     if (deletedCourse) {
//       res.status(204).send();
//     } else {
//       res.status(404).json({ error: "Курс не найден" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при удалении курса" });
//   }
// });

// module.exports = router;
