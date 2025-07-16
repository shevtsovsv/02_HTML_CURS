/**
 * @file controllers/userProgressController.js
 * @description Контроллер для управления прогрессом пользователя.
 */
const { userProgress } = require("../models");

/**
 * @desc    Отметить шаг как выполненный
 * @route   POST /api/progress/complete-step
 * @access  Private
 */
const completeStep = async (req, res) => {
  try {
    const { stepId, projectId } = req.body;
    const userId = req.user.id;

    // Ищем запись, и если ее нет - создаем.
    const [progress, created] = await userProgress.findOrCreate({
      where: { user_id: userId, step_id: stepId, project_id: projectId },
      // Если запись нужно создать, устанавливаем completed: true
      defaults: { completed: true },
    });

    // Если запись уже существовала, но была `completed: false`, обновляем ее.
    if (!created && !progress.completed) {
      progress.completed = true;
      await progress.save();
    }

    res.status(200).json({ message: "Шаг отмечен как выполненный" });
  } catch (error) {
    console.error("Ошибка при сохранении прогресса шага:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

module.exports = { completeStep };
