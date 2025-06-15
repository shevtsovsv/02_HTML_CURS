/**
 * @file routes/projects.js
 * @description Маршруты для API, связанные с проектами (заданиями).
 */

const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { checkProjectStep } = require("../controllers/validationController");
const { protect } = require("../middleware/protect");

// const { protect, authorize } = require('../middleware/auth');

// GET /api/projects - получить все проекты
// GET /api/projects?courseId=1 - получить все проекты для курса с ID 1
router.get("/", getAllProjects);

// GET /api/projects/5 - получить проект с ID 5
router.get("/:id", getProjectById);

// Далее - защищенные роуты (в будущем)

// POST /api/projects
router.post("/", protect, createProject);

// PUT /api/projects/5
router.put("/:id", protect, updateProject);

// DELETE /api/projects/5
router.delete("/:id", protect, deleteProject);

// POST /api/projects/1/steps/5/check
router.post("/:projectId/steps/:stepId/check", protect, checkProjectStep);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const { task, course } = require("../models"); // Импортируем модель task

// router.get("/", async (req, res) => {
//   try {
//     const tasks = await task.findAll();
//     res.json(tasks);
//   } catch (error) {
//     console.error("Ошибка при получении задач:", error); // ← добавь это
//     res.status(500).json({ error: "Ошибка при получении всех задач" });
//   }
// });
// // Получить все задачи для конкретного курса
// router.get("/:courseId", async (req, res) => {
//   try {
//     const tasks = await task.findAll({
//       where: { course_id: req.params.courseId },
//     });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при получении задач" });
//   }
// });

// // Получить задачу по ID
// router.get("/:courseId/:taskId", async (req, res) => {
//   try {
//     const taskData = await task.findOne({
//       where: { id: req.params.taskId, course_id: req.params.courseId },
//     });
//     if (taskData) {
//       res.json(taskData);
//     } else {
//       res.status(404).json({ error: "Задача не найдена" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при получении задачи" });
//   }
// });

// // Создать новую задачу для курса
// router.post("/:courseId", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const courseData = await course.findByPk(req.params.courseId);
//     if (!courseData) {
//       return res.status(404).json({ error: "Курс не найден" });
//     }

//     const newTask = await task.create({
//       title,
//       description,
//       course_id: req.params.courseId,
//     });
//     res.status(201).json(newTask);
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при создании задачи" });
//   }
// });

// // Обновить задачу
// router.put("/:courseId/:taskId", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const updatedTask = await task.update(
//       { title, description },
//       {
//         where: { id: req.params.taskId, course_id: req.params.courseId },
//         returning: true,
//       }
//     );
//     if (updatedTask[0] === 1) {
//       res.json(updatedTask[1][0]);
//     } else {
//       res.status(404).json({ error: "Задача не найдена" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при обновлении задачи" });
//   }
// });

// // Удалить задачу
// router.delete("/:courseId/:taskId", async (req, res) => {
//   try {
//     const deletedTask = await task.destroy({
//       where: { id: req.params.taskId, course_id: req.params.courseId },
//     });
//     if (deletedTask) {
//       res.status(204).send();
//     } else {
//       res.status(404).json({ error: "Задача не найдена" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при удалении задачи" });
//   }
// });

// module.exports = router;
