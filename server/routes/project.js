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
const upload = require("../middleware/upload");
const { uploadAsset } = require("../controllers/assetController");

// const { protect, authorize } = require('../middleware/auth');

// GET /api/projects - получить все проекты
// GET /api/projects?courseId=1 - получить все проекты для курса с ID 1
router.get("/", getAllProjects);

// GET /api/projects/5 - получить проект с ID 5
router.get("/:id", protect, getProjectById);

// Далее - защищенные роуты (в будущем)

// POST /api/projects
router.post("/", protect, createProject);

// PUT /api/projects/5
router.put("/:id", protect, updateProject);

// DELETE /api/projects/5
router.delete("/:id", protect, deleteProject);

// POST /api/projects/1/steps/5/check
router.post("/:projectId/steps/:stepId/check", protect, checkProjectStep);



// @route   POST /api/projects/:projectId/upload-asset
// @desc    Загрузить новый ассет для проекта
router.post('/:projectId/upload-asset', protect, upload.single('asset'), uploadAsset);
// `upload.single('asset')` - это middleware multer. 'asset' - это имя поля в форме.


module.exports = router;

