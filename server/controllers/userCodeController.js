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

    // Ищем существующую запись по user_id + project_id + step_id
    const existingCode = await userCode.findOne({
      where: {
        user_id: userId,
        project_id: projectId,
        step_id: stepId,
      },
    });

    if (existingCode) {
      // Обновляем существующую запись
      await existingCode.update({
        html,
        css,
        js,
      });
    } else {
      // Создаем новую запись
      await userCode.create({
        user_id: userId,
        project_id: projectId,
        step_id: stepId,
        html,
        css,
        js,
      });
    }

    // --- НОВАЯ ЛОГИКА: Удаляем устаревший код последующих шагов ---
    // Получаем все шаги проекта для определения последующих шагов
    const { projectStep } = require("../models");
    const allSteps = await projectStep.findAll({
      where: { project_id: projectId },
      order: [["order", "ASC"]],
    });

    const currentStepIndex = allSteps.findIndex((step) => step.id === stepId);
    if (currentStepIndex > -1 && currentStepIndex < allSteps.length - 1) {
      // Удаляем код для всех последующих шагов
      const subsequentStepIds = allSteps
        .slice(currentStepIndex + 1)
        .map((step) => step.id);

      const deletedCount = await userCode.destroy({
        where: {
          user_id: userId,
          project_id: projectId,
          step_id: subsequentStepIds,
        },
      });

      if (deletedCount > 0) {
        console.log(`🗑️ Удалено ${deletedCount} устаревших записей`);
      }
    }

    res.status(200).json({ message: "Прогресс успешно сохранен" });
  } catch (error) {
    console.error("Ошибка при сохранении кода:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

module.exports = { saveUserCode };
