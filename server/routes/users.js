/**
 * @file routes/users.js
 * @description Маршруты для API, связанные с пользователями.
 */

const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
} = require("../controllers/userController");
const { protect } = require("../middleware/protect");

// Утилиты для валидации
const { body } = require("express-validator");

// const { protect, authorize } = require('../middleware/auth');

// GET /api/users - Получить всех пользователей (защищено)
router.get("/", /* protect, authorize('admin'), */ getAllUsers);

// @route GET /api/users/me
router.get('/me', protect, getMe); // <-- ДОБАВЛЯЕМ ЭТОТ РОУТ

// GET /api/users/1 - Получить пользователя по ID (защищено)
router.get("/:id", /* protect, authorize('admin', 'owner'), */ getUserById);

// POST /api/users - Создать нового пользователя (Регистрация)
router.post(
  "/",
  // Middleware для валидации и санации данных перед тем, как они попадут в контроллер
  [
    body("email", "Пожалуйста, введите корректный email")
      .isEmail()
      .normalizeEmail(), // Приводит email к стандартному виду (например, убирает точки в gmail)
    body("password", "Пароль должен содержать не менее 6 символов").isLength({
      min: 6,
    }),
  ],
  createUser
);

// PUT /api/users/1 - Обновить пользователя (защищено)
router.put("/:id", /* protect, authorize('admin', 'owner'), */ updateUser);

// DELETE /api/users/1 - Удалить пользователя (защищено)
router.delete("/:id", /* protect, authorize('admin'), */ deleteUser);

module.exports = router;

