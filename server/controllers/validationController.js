/**
 * @file controllers/validationController.js
 * @description Контроллер для валидации кода пользователя.
 */
const { projectStep } = require("../models");
const { JSDOM } = require("jsdom");
const ValidationRules = require("../lib/validationRulesCustom");
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

  // Функция для обертывания JS кода, чтобы функции были доступны глобально для onclick
  const wrapJavaScript = (jsCode) => {
    if (!jsCode) return "";

    // Находим все function declarations в коде
    const functionRegex = /function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/g;
    const functionNames = [];
    let match;

    while ((match = functionRegex.exec(jsCode)) !== null) {
      functionNames.push(match[1]);
    }

    // Логирование для отладки
    if (functionNames.length > 0) {
      logger.debug(
        `[WRAPPER] Найдено функций для добавления в window: ${functionNames.join(", ")}`,
      );
    }

    // Создаем код, который делает функции глобальными
    let globalAssignments = "";
    if (functionNames.length > 0) {
      globalAssignments = "\n// Делаем функции доступными для onclick\n";
      functionNames.forEach((name) => {
        globalAssignments += `if (typeof ${name} !== 'undefined') window.${name} = ${name};\n`;
      });
    }

    // Оборачиваем код в DOMContentLoaded, чтобы DOM был готов для querySelector и addEventListener
    return `
document.addEventListener('DOMContentLoaded', function() {
  ${jsCode}
  ${globalAssignments}
});
    `.trim();
  };

  if (html && html.trim().toLowerCase().startsWith("<!doctype")) {
    // HTML уже содержит полную структуру документа
    fullHTML = html;
    // Добавляем стили в head, если есть
    if (css) {
      fullHTML = fullHTML.replace(/<\/head>/i, `<style>${css}</style></head>`);
    }
    // Добавляем JavaScript в конец body, если есть
    if (js) {
      const wrappedJS = wrapJavaScript(js);
      fullHTML = fullHTML.replace(
        /<\/body>/i,
        `<script>${wrappedJS}</script></body>`,
      );
    }
  } else {
    // HTML содержит только фрагмент, оборачиваем в полную структуру
    const wrappedJS = wrapJavaScript(js);
    fullHTML = `<html><head><style>${css || ""}</style></head><body>${
      html || ""
    }<script>${wrappedJS}</script></body></html>`;
  }

  const dom = new JSDOM(fullHTML, {
    url: "http://localhost",
    referrer: "http://localhost",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000,
    runScripts: "dangerously",
    beforeParse(window) {
      // Устанавливаем перехват addEventListener ДО выполнения скриптов
      const eventListenersMap = new Map();
      const originalAddEventListener =
        window.EventTarget.prototype.addEventListener;

      window.EventTarget.prototype.addEventListener = function (
        type,
        listener,
        options,
      ) {
        const element = this;
        const elementKey =
          (element.tagName || "Unknown") +
          (element.id ? "#" + element.id : "") +
          (element.className
            ? "." + element.className.split(" ").join(".")
            : "");

        if (!eventListenersMap.has(elementKey)) {
          eventListenersMap.set(elementKey, []);
        }
        eventListenersMap.get(elementKey).push({
          type,
          listener,
          options,
        });

        return originalAddEventListener.call(this, type, listener, options);
      };

      // Сохраняем Map в window для доступа из ValidationRules
      window.__eventListenersMap__ = eventListenersMap;
    },
  });
  const { document } = dom.window;

  // Ждем выполнения DOMContentLoaded, чтобы addEventListener успел зарегистрироваться
  await new Promise((resolve) => {
    if (dom.window.document.readyState === "complete") {
      // Если документ уже загружен, ждем немного для выполнения скриптов
      setTimeout(resolve, 100);
    } else {
      dom.window.document.addEventListener("DOMContentLoaded", () => {
        // Даем еще немного времени после DOMContentLoaded для выполнения кода
        setTimeout(resolve, 100);
      });
    }
  });

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
