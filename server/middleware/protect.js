/**
 * @file middleware/protect.js
 * @description Middleware для защиты роутов с помощью JWT.
 */
const jwt = require("jsonwebtoken");
const { user } = require("../models");

const protect = async (req, res, next) => {
  let token;

  // 1. Проверяем, есть ли токен в заголовках Authorization
  // Токен обычно передается в формате "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 2. Извлекаем сам токен
      token = req.headers.authorization.split(" ")[1];

      // 3. Верифицируем (проверяем) токен с помощью нашего секретного ключа
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Находим пользователя по ID из токена и добавляем его в объект запроса (req)
      // Исключаем пароль на всякий случай, хотя defaultScope и так это сделает.
      req.user = await user.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });

      if (!req.user) {
        // Если пользователь был удален после выдачи токена
        return res.status(401).json({ error: "Пользователь не найден" });
      }

      // 5. Передаем управление следующему middleware или контроллеру
      next();
    } catch (error) {
      console.error("Ошибка верификации токена:", error);
      return res
        .status(401)
        .json({ error: "Не авторизован, токен недействителен" });
    }
  }

  if (!token) {
    return res.status(401).json({ error: "Не авторизован, токен отсутствует" });
  }
};

module.exports = { protect };
