/**
 * @file controllers/validationController.js
 * @description Контроллер для валидации кода пользователя.
 */
const { projectStep } = require("../models");
const { JSDOM } = require("jsdom");
const ValidationRules = require("../lib/validationRules");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

/**
 * @desc    Проверить выполнение шага проекта
 * @route   POST /api/validation/check/:stepId
 * @access  Private
 */
const checkProjectStep = asyncHandler(async (req, res) => {
  const { stepId } = req.params;
  const { html, css, js } = req.body;

  const step = await projectStep.findByPk(stepId);
  if (!step) {
    throw new AppError("Шаг не найден", 404);
  }

  // Правила валидации из нашей БД
  const rules = step.validationRules;

  // Создаем виртуальный DOM
  // Если HTML содержит DOCTYPE и полную HTML структуру, используем его как есть
  // Иначе, оборачиваем в стандартную структуру
  let fullHTML;

  if (html && html.trim().toLowerCase().startsWith("<!doctype")) {
    // HTML уже содержит полную структуру документа
    fullHTML = html;
    // Добавляем стили в head, если есть
    if (css) {
      fullHTML = fullHTML.replace(/<\/head>/i, `<style>${css}</style></head>`);
    }
  } else {
    // HTML содержит только фрагмент, оборачиваем в полную структуру
    fullHTML = `<html><head><style>${css || ""}</style></head><body>${
      html || ""
    }</body></html>`;
  }

  const dom = new JSDOM(fullHTML, {
    url: "http://localhost",
    referrer: "http://localhost",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
    runScripts: "dangerously",
  });
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
    logger.debug("Validation failed", { stepId, errorCount: errors.length });
    return res.json({ success: false, errors });
  }

  logger.debug("Validation successful", { stepId });
  return res.json({ success: true, message: "Отлично, шаг выполнен верно!" });
});

module.exports = { checkProjectStep };
