/**
 * @file controllers/userController.js
 * @description Контроллер для операций с пользователями.
 * Включает регистрацию, получение данных, обновление и удаление.
 */

const { user, role } = require("../models");
// Библиотека для валидации входящих данных. Установите ее: npm install express-validator
const { validationResult } = require("express-validator");

/**
 * @desc    Получить всех пользователей (без паролей).
 * @route   GET /api/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res) => {
  try {
    // defaultScope в модели user автоматически уберет поле password.
    const users = await user.findAll();
    res.json(users);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Получить одного пользователя по ID (без пароля).
 * @route   GET /api/users/:id
 * @access  Private (Admin or Owner)
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    // defaultScope также работает и здесь.
    const userData = await user.findByPk(id);

    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (error) {
    console.error(`Ошибка при получении пользователя ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Создать нового пользователя (Регистрация).
 * @route   POST /api/users
 * @access  Public
 */
const createUser = async (req, res) => {
  // Проверяем результаты валидации из роута
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, role_id } = req.body;

    // 1. Проверка, не занят ли email
    const existingUser = await user.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        errors: [{ msg: "Пользователь с таким email уже существует" }],
      });
    }

    // 2. Создание пользователя.
    // Хеширование пароля происходит АВТОМАТИЧЕСКИ благодаря хуку beforeCreate в модели.
    const newUser = await user.create({ email, password, role_id });

    // 3. Отправка ответа.
    // Поле password будет АВТОМАТИЧЕСКИ удалено благодаря defaultScope в модели.
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Обновить данные пользователя (кроме пароля).
 * @route   PUT /api/users/:id
 * @access  Private (Admin or Owner)
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Мы намеренно не принимаем `password` в этом роуте.
    // Смена пароля должна быть отдельной, более защищенной операцией.
    const { email, role_id } = req.body;

    const [updatedRows] = await user.update(
      { email, role_id },
      {
        where: { id },
      }
    );

    if (updatedRows > 0) {
      const updatedUser = await user.findByPk(id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: "Пользователь не найден для обновления" });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Этот email уже занят другим пользователем." });
    }
    console.error(
      `Ошибка при обновлении пользователя ${req.params.id}:`,
      error
    );
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Удалить пользователя.
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await user.destroy({ where: { id } });

    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Пользователь не найден для удаления" });
    }
  } catch (error) {
    console.error(`Ошибка при удалении пользователя ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Получить данные текущего пользователя (по токену)
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res) => {
	const userData = await user.findByPk(req.user.id, {
    include: {
      model: role,
      as: "role",
      attributes: ["name"],
    },
  });
  res.status(200).json(userData);
  };

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMe,
};
