/**
 * @file controllers/validationController.js
 * @description Контроллер для валидации кода пользователя.
 */
const { projectStep } = require("../models");
const { JSDOM } = require("jsdom");
const ValidationRules = require("../lib/validationRules");

/**
 * @desc    Проверить выполнение шага проекта
 * @route   POST /api/projects/:projectId/steps/:stepId/check
 * @access  Private
 */
const checkProjectStep = async (req, res) => {
  try {
    const { stepId } = req.params;
    const { html, css, js } = req.body;

    const step = await projectStep.findByPk(stepId);
    if (!step) {
      return res.status(404).json({ error: "Шаг не найден" });
    }

    // Правила валидации из нашей БД
    const rules = step.validationRules;

    // Создаем виртуальный DOM
    const dom = new JSDOM(
      `<html><head><style>${css || ""}</style></head><body>${html || ""}</body></html>`,
      {
        url: "http://localhost",
        referrer: "http://localhost",
        contentType: "text/html",
        includeNodeLocations: true,
        storageQuota: 10000000,
        runScripts: "dangerously"
      }
    );
    const { document } = dom.window;

    // Создаем экземпляр расширенной системы валидации
    const validator = new ValidationRules(dom, document, html, css, js);

    const errors = [];
    // Прогоняем правила с использованием новой системы валидации
    for (const rule of rules) {
      const error = validator.validateRule(rule);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return res.json({ success: false, errors });
    }

    // TODO: Сохранить прогресс пользователя в UserProgress

    return res.json({ success: true, message: "Отлично, шаг выполнен верно!" });
  } catch (error) {
    console.error("Ошибка при проверке шага:", error);
    res.status(500).json({ error: "Ошибка на сервере при проверке" });
  }
};

module.exports = { checkProjectStep };
