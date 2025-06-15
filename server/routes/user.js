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
} = require("../controllers/userController");

// Утилиты для валидации
const { body } = require("express-validator");

// const { protect, authorize } = require('../middleware/auth');

// GET /api/users - Получить всех пользователей (защищено)
router.get("/", /* protect, authorize('admin'), */ getAllUsers);

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

// const express = require("express");
// const router = express.Router();
// const { user } = require("../models"); // Импортируем модель user

// // Получить всех пользователей
// router.get("/", async (req, res) => {
//   try {
//     const users = await user.findAll();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при получении пользователей" });
//   }
// });

// // Получить пользователя по ID
// router.get("/:id", async (req, res) => {
//   try {
//     const userData = await user.findByPk(req.params.id);
//     if (userData) {
//       res.json(userData);
//     } else {
//       res.status(404).json({ error: "Пользователь не найден" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при получении пользователя" });
//   }
// });

// // Создать нового пользователя
// router.post("/", async (req, res) => {
//   try {
//     const { email, password, role_id } = req.body;
//     const newUser = await user.create({ email, password, role_id });
//     res.status(201).json(newUser);
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при создании пользователя" });
//   }
// });

// // Обновить пользователя
// router.put("/:id", async (req, res) => {
//   try {
//     const { email, password, role_id } = req.body;
//     const updatedUser = await user.update(
//       { email, password, role_id },
//       { where: { id: req.params.id }, returning: true }
//     );
//     if (updatedUser[0] === 1) {
//       res.json(updatedUser[1][0]);
//     } else {
//       res.status(404).json({ error: "Пользователь не найден" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при обновлении пользователя" });
//   }
// });

// // Удалить пользователя
// router.delete("/:id", async (req, res) => {
//   try {
//     const deletedUser = await user.destroy({
//       where: { id: req.params.id },
//     });
//     if (deletedUser) {
//       res.status(204).send();
//     } else {
//       res.status(404).json({ error: "Пользователь не найден" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Ошибка при удалении пользователя" });
//   }
// });

// module.exports = router;
