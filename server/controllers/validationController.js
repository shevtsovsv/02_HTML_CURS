/**
 * @file controllers/validationController.js
 * @description Контроллер для валидации кода пользователя.
 */
const { projectStep } = require("../models");
const { JSDOM } = require("jsdom");

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
      `<html><head><style>${css}</style></head><body>${html}</body></html>`
    );
    const { document } = dom.window;

    const errors = [];
    // Прогоняем правила
    for (const rule of rules) {
      const element = document.querySelector(rule.selector);
      
      if (rule.type === "elementExists" && !element) {
        errors.push(`Элемент с селектором '${rule.selector}' не найден.`);
      }
      
      if (rule.type === "elementText" && element) {
        if (element.textContent.trim() !== rule.expected) {
          errors.push(
            `Текст в '${
              rule.selector
            }' ('${element.textContent.trim()}') не совпадает с ожидаемым ('${
              rule.expected
            }').`
          );
        }
      }
      
      if (rule.type === "elementAttribute" && element) {
        const attributeValue = element.getAttribute(rule.attribute);
        if (attributeValue !== rule.expected) {
          errors.push(
            `Атрибут '${rule.attribute}' элемента '${rule.selector}' имеет значение '${attributeValue}', ожидалось '${rule.expected}'.`
          );
        }
      }
      
      if (rule.type === "elementCount") {
        const elements = document.querySelectorAll(rule.selector);
        if (elements.length !== rule.expected) {
          errors.push(
            `Найдено ${elements.length} элементов с селектором '${rule.selector}', ожидалось ${rule.expected}.`
          );
        }
      }
      
      if (rule.type === "computedStyle" && element) {
        const styles = dom.window.getComputedStyle(element);
        const actualValue = styles.getPropertyValue(rule.property);
        if (actualValue !== rule.expected) {
          errors.push(
            `Стиль '${rule.property}' элемента '${rule.selector}' имеет значение '${actualValue}', ожидалось '${rule.expected}'.`
          );
        }
      }
      
      // Проверка существования атрибута (без проверки значения)
      if (rule.type === "elementHasAttribute" && element) {
        if (!element.hasAttribute(rule.attribute)) {
          errors.push(
            `Элемент с селектором '${rule.selector}' не имеет атрибута '${rule.attribute}'.`
          );
        }
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
