/**
 * @file controllers/authController.js
 * @description Контроллер для аутентификации пользователей (логин).
 */

const { user } = require("../models");
const jwt = require("jsonwebtoken");

/**
 * @desc    Аутентификация пользователя и получение токена
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  // 1. Простая валидация
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Пожалуйста, введите email и пароль" });
  }

  try {
    // 2. Ищем пользователя и ВАЖНО: запрашиваем хеш пароля с помощью scope 'withPassword'
    const userData = await user
      .scope("withPassword")
      .findOne({ where: { email } });

    // 3. Проверяем, найден ли пользователь и совпадает ли пароль
    // Метод isValidPassword мы создали ранее в модели user
    if (!userData || !(await userData.isValidPassword(password))) {
      // Используем статус 401 Unauthorized для ошибок аутентификации
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    // 4. Генерируем токен, если все в порядке
    const token = generateToken(userData.id);

    // 5. Отправляем токен клиенту
    res.json({
      message: "Логин успешен!",
      token,
      // Можно также отправить данные пользователя (без пароля)
      user: {
        id: userData.id,
        email: userData.email,
      },
    });
  } catch (error) {
    console.error("Ошибка при логине:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @description Вспомогательная функция для генерации JWT
 * @param {number} id - ID пользователя, который будет "зашит" в токен
 * @returns {string} - Сгенерированный JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = { login };
