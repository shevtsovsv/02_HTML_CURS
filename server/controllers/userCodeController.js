/**
 * @file controllers/userCodeController.js
 * @description Контроллер для сохранения кода пользователя.
 */
const { userCode } = require("../models");

/**
 * @desc    Сохранить или обновить код пользователя для проекта
 * @route   POST /api/user-code
 * @access  Private
 */
const saveUserCode = async (req, res) => {
  try {
    const { projectId, stepId, html, css, js } = req.body;
    const userId = req.user.id; // Получаем ID из middleware `protect`

    // `upsert` - мощный метод Sequelize.
    // Он попытается найти запись по уникальному ключу (у нас это user_id + project_id)
    // и обновить ее. Если не найдет - создаст новую.
    await userCode.upsert({
      user_id: userId,
      project_id: projectId,
      step_id: stepId,
      html,
      css,
      js,
    });

    res.status(200).json({ message: "Прогресс успешно сохранен" });
  } catch (error) {
    console.error("Ошибка при сохранении кода:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

module.exports = { saveUserCode };
