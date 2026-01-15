/**
 * @file lib/validationRules.js
 * @description Enhanced validation rules for HTML, CSS, and JavaScript validation
 */

class ValidationRules {
  constructor(dom, document, html, css, js) {
    this.dom = dom;
    this.document = document;
    this.html = html;
    this.css = css;
    this.js = js;
    this.window = dom.window;
    this.consoleMessages = [];
    this.eventListeners = new Map();
    this.setupInterception();
  }

  /**
   * Setup console and addEventListener interception
   */
  setupInterception() {
    // Intercept console methods
    const originalConsole = this.window.console;
    const self = this; // Store reference to avoid binding issues

    ["log", "info", "warn", "error"].forEach((method) => {
      this.window.console[method] = (...args) => {
        self.consoleMessages.push({
          type: method,
          message: args.join(" "),
          timestamp: Date.now(),
        });
        // Don't call original to avoid recursion in test environment
      };
    });

    // Intercept addEventListener
    const originalAddEventListener =
      this.window.EventTarget.prototype.addEventListener;
    const validationInstance = this; // Store reference

    this.window.EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      const element = this;
      const elementKey =
        (element.tagName || "Unknown") +
        (element.id ? "#" + element.id : "") +
        (element.className ? "." + element.className.split(" ").join(".") : "");

      if (!validationInstance.eventListeners.has(elementKey)) {
        validationInstance.eventListeners.set(elementKey, []);
      }
      validationInstance.eventListeners.get(elementKey).push({
        type,
        listener,
        options,
      });

      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  /**
   * Execute JavaScript code safely
   */
  executeJavaScript() {
    if (!this.js) return;

    try {
      // Create a more secure context
      const script = this.document.createElement("script");
      script.textContent = this.js;
      this.document.head.appendChild(script);
    } catch (error) {
      this.consoleMessages.push({
        type: "error",
        message: `JavaScript execution error: ${error.message}`,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * HTML Validation Rules
   */

  elementExists(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден.`;
    }
    return null;
  }

  elementNotExists(rule) {
    const element = this.document.querySelector(rule.selector);
    if (element) {
      return `Элемент с селектором '${rule.selector}' не должен существовать, но найден.`;
    }
    return null;
  }

  elementText(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки текста.`;
    }
    if (element.textContent.trim() !== rule.expected) {
      return `Текст в '${
        rule.selector
      }' ('${element.textContent.trim()}') не совпадает с ожидаемым ('${
        rule.expected
      }').`;
    }
    return null;
  }

  elementMatches(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки регулярного выражения.`;
    }

    const content =
      rule.property === "innerHTML" ? element.innerHTML : element.textContent;
    const regex = new RegExp(rule.pattern, rule.flags || "");

    if (!regex.test(content)) {
      return `Содержимое элемента '${rule.selector}' не соответствует шаблону '${rule.pattern}'.`;
    }
    return null;
  }

  elementHasClass(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки класса.`;
    }

    if (!element.classList.contains(rule.className)) {
      return `Элемент '${rule.selector}' не содержит класс '${rule.className}'.`;
    }
    return null;
  }

  elementAttribute(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки атрибута.`;
    }

    const attributeValue = element.getAttribute(rule.attribute);
    if (attributeValue !== rule.expected) {
      return `Атрибут '${rule.attribute}' элемента '${rule.selector}' имеет значение '${attributeValue}', ожидалось '${rule.expected}'.`;
    }
    return null;
  }

  elementHasAttribute(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки атрибута.`;
    }

    if (!element.hasAttribute(rule.attribute)) {
      return `Элемент '${rule.selector}' не имеет атрибута '${rule.attribute}'.`;
    }
    return null;
  }

  elementCount(rule) {
    const elements = this.document.querySelectorAll(rule.selector);
    if (elements.length !== rule.expected) {
      return `Найдено ${elements.length} элементов с селектором '${rule.selector}', ожидалось ${rule.expected}.`;
    }
    return null;
  }

  hasDoctype(rule) {
    // Check if document has DOCTYPE declaration
    if (!this.document.doctype) {
      return "Документ должен содержать DOCTYPE декларацию.";
    }

    // If specific doctype is expected, check it
    if (rule.expected) {
      const actualDoctype = this.document.doctype.name;
      if (actualDoctype.toLowerCase() !== rule.expected.toLowerCase()) {
        return `DOCTYPE должен быть '${rule.expected}', но найден '${actualDoctype}'.`;
      }
    }

    return null;
  }

  /**
   * CSS Validation Rules
   */

  computedStyle(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки стиля.`;
    }

    const styles = this.window.getComputedStyle(element);
    const actualValue = styles.getPropertyValue(rule.property);
    if (actualValue !== rule.expected) {
      return `Стиль '${rule.property}' элемента '${rule.selector}' имеет значение '${actualValue}', ожидалось '${rule.expected}'.`;
    }
    return null;
  }

  styleRuleExists(rule) {
    // Check if CSS rule exists in stylesheets
    const styleSheets = this.document.styleSheets;
    let ruleFound = false;

    try {
      for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === rule.selector) {
              ruleFound = true;
              break;
            }
          }
        }
      }
    } catch (e) {
      // Some stylesheets might not be accessible due to CORS
      // Fallback: check if selector matches any elements and they have non-default styles
      const elements = this.document.querySelectorAll(rule.selector);
      if (elements.length > 0) {
        ruleFound = true; // Assume rule exists if elements match
      }
    }

    if (!ruleFound) {
      return `CSS правило для селектора '${rule.selector}' не найдено.`;
    }
    return null;
  }

  styleRuleProperty(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для проверки CSS правила.`;
    }

    const styles = this.window.getComputedStyle(element);
    const actualValue = styles.getPropertyValue(rule.property);

    if (rule.expected && actualValue !== rule.expected) {
      return `CSS свойство '${rule.property}' для селектора '${rule.selector}' имеет значение '${actualValue}', ожидалось '${rule.expected}'.`;
    }

    // If no expected value, just check that property exists and is not empty/initial
    if (
      !rule.expected &&
      (!actualValue || actualValue === "initial" || actualValue === "")
    ) {
      return `CSS свойство '${rule.property}' для селектора '${rule.selector}' не установлено.`;
    }

    return null;
  }

  cssPropertyExists(rule) {
    // Проверяем наличие CSS-свойства в стилях (не проверяем значение)
    const styleSheets = this.document.styleSheets;
    let propertyFound = false;

    try {
      for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const cssRule = rules[j];
            if (cssRule.selectorText === rule.selector && cssRule.style) {
              // Проверяем, есть ли нужное свойство в стиле
              if (
                cssRule.style.getPropertyValue(rule.property) !== "" ||
                cssRule.style[rule.property] !== undefined
              ) {
                propertyFound = true;
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      // Fallback: проверяем через проверку содержимого тега <style>
      const styleTags = this.document.querySelectorAll("style");
      for (let styleTag of styleTags) {
        const cssText = styleTag.textContent;
        // Простая проверка наличия селектора и свойства в CSS тексте
        const selectorRegex = new RegExp(
          `${rule.selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*{[^}]*${
            rule.property
          }\\s*:`,
          "i"
        );
        if (selectorRegex.test(cssText)) {
          propertyFound = true;
          break;
        }
      }
    }

    if (!propertyFound) {
      return `CSS свойство '${rule.property}' для селектора '${rule.selector}' не найдено в стилях.`;
    }
    return null;
  }

  cssPropertyCheck(rule) {
    // Комбинированная проверка: сначала наличие свойства, потом значение

    // Функция нормализации CSS значений для сравнения
    const normalizeValue = (value) => {
      if (!value) return value;

      // Удаляем лишние пробелы
      value = value.trim();

      // Нормализуем нулевые значения (0 -> 0px, 0px -> 0px, и т.д.)
      if (
        value === "0" ||
        value === "0px" ||
        value === "0em" ||
        value === "0rem"
      ) {
        return "0px"; // Браузер обычно нормализует к 0px
      }

      // Нормализуем цвета
      if (value.startsWith("#") && value.length === 4) {
        // Расширяем короткие hex цвета #abc -> #aabbcc
        return (
          "#" + value[1] + value[1] + value[2] + value[2] + value[3] + value[3]
        );
      }

      // Приводим к нижнему регистру для сравнения
      return value.toLowerCase();
    };

    // Шаг 1: Проверяем наличие свойства в CSS правилах
    const styleSheets = this.document.styleSheets;
    let propertyFound = false;
    let actualCssValue = null;

    try {
      for (let i = 0; i < styleSheets.length; i++) {
        const rules = styleSheets[i].cssRules || styleSheets[i].rules;
        if (rules) {
          for (let j = 0; j < rules.length; j++) {
            const cssRule = rules[j];
            if (cssRule.selectorText === rule.selector && cssRule.style) {
              const propValue = cssRule.style.getPropertyValue(rule.property);
              if (propValue !== "") {
                propertyFound = true;
                actualCssValue = propValue;
                break;
              }
            }
          }
        }
      }
    } catch (e) {
      // Fallback: проверяем через содержимое тега <style>
      const styleTags = this.document.querySelectorAll("style");
      for (let styleTag of styleTags) {
        const cssText = styleTag.textContent;
        const selectorRegex = new RegExp(
          `${rule.selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*{[^}]*${
            rule.property
          }\\s*:([^;}]+)`,
          "i"
        );
        const match = selectorRegex.exec(cssText);
        if (match) {
          propertyFound = true;
          actualCssValue = match[1].trim();
          break;
        }
      }
    }

    // Если свойство не найдено в CSS
    if (!propertyFound) {
      return `CSS свойство '${rule.property}' для селектора '${rule.selector}' не найдено в стилях. Добавьте это свойство в ваш CSS код.`;
    }

    // Если свойство найдено, но нужно проверить значение
    if (rule.expected) {
      // Получаем вычисленное значение для более точной проверки
      const element = this.document.querySelector(rule.selector);
      if (element) {
        const computedStyles = this.window.getComputedStyle(element);
        const computedValue = computedStyles.getPropertyValue(rule.property);

        // Нормализуем оба значения для корректного сравнения
        const normalizedExpected = normalizeValue(rule.expected);
        const normalizedComputed = normalizeValue(computedValue);

        // Проверяем разные варианты соответствия
        // Для градиентов и сложных значений используем более гибкую проверку
        if (
          rule.property === "background" ||
          rule.property === "background-image"
        ) {
          if (
            rule.expected.toLowerCase().includes("gradient") &&
            !computedValue.toLowerCase().includes("gradient")
          ) {
            return `CSS свойство '${rule.property}' найдено, но значение '${computedValue}' не содержит градиент. Ожидался градиент.`;
          }
        } else if (normalizedComputed !== normalizedExpected) {
          // Дополнительная проверка для случаев 0 vs 0px
          const isZeroMatch =
            (normalizedExpected === "0px" &&
              (rule.expected === "0" || rule.expected === "0px")) ||
            (normalizedComputed === "0px" &&
              (rule.expected === "0" || rule.expected === "0px"));

          if (!isZeroMatch) {
            return `CSS свойство '${rule.property}' найдено, но имеет значение '${computedValue}', ожидалось '${rule.expected}'.`;
          }
        }
      }
    }

    return null; // Всё в порядке
  }

  /**
   * JavaScript Validation Rules
   */

  jsGlobalDefined(rule) {
    this.executeJavaScript();

    if (!(rule.name in this.window)) {
      return `Глобальная переменная или функция '${rule.name}' не определена.`;
    }
    return null;
  }

  jsExpression(rule) {
    this.executeJavaScript();

    try {
      const result = this.window.eval(rule.expression);
      if (rule.expected !== undefined && result !== rule.expected) {
        return `Выражение '${rule.expression}' возвращает '${result}', ожидалось '${rule.expected}'.`;
      }
      if (rule.expected === undefined && !result) {
        return `Выражение '${rule.expression}' возвращает ложное значение.`;
      }
    } catch (error) {
      return `Ошибка выполнения выражения '${rule.expression}': ${error.message}`;
    }
    return null;
  }

  jsFunctionReturns(rule) {
    this.executeJavaScript();

    try {
      if (typeof this.window[rule.functionName] !== "function") {
        return `Функция '${rule.functionName}' не найдена или не является функцией.`;
      }

      const args = rule.args || [];
      const result = this.window[rule.functionName](...args);

      if (result !== rule.expected) {
        return `Функция '${rule.functionName}' возвращает '${result}', ожидалось '${rule.expected}'.`;
      }
    } catch (error) {
      return `Ошибка выполнения функции '${rule.functionName}': ${error.message}`;
    }
    return null;
  }

  jsConsoleContains(rule) {
    this.executeJavaScript();

    const found = this.consoleMessages.some(
      (msg) =>
        msg.type === (rule.consoleType || "log") &&
        msg.message.includes(rule.message)
    );

    if (!found) {
      return `Сообщение '${rule.message}' не найдено в консоли (тип: ${
        rule.consoleType || "log"
      }).`;
    }
    return null;
  }

  eventListenerAttached(rule) {
    this.executeJavaScript();

    const elements = this.document.querySelectorAll(rule.selector);
    let found = false;

    for (const elementKey of this.eventListeners.keys()) {
      const listeners = this.eventListeners.get(elementKey);
      if (listeners.some((listener) => listener.type === rule.eventType)) {
        found = true;
        break;
      }
    }

    if (!found) {
      return `Обработчик события '${rule.eventType}' не найден для селектора '${rule.selector}'.`;
    }
    return null;
  }

  eventDispatchChangesDom(rule) {
    this.executeJavaScript();

    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент с селектором '${rule.selector}' не найден для диспатча события.`;
    }

    // Capture DOM state before event
    const beforeState = this.document.body.innerHTML;

    try {
      // Dispatch event
      const event = new this.window.Event(rule.eventType, { bubbles: true });
      element.dispatchEvent(event);

      // Check if DOM changed
      const afterState = this.document.body.innerHTML;

      if (rule.expectChange && beforeState === afterState) {
        return `После события '${rule.eventType}' на '${rule.selector}' DOM не изменился, хотя ожидались изменения.`;
      }

      if (!rule.expectChange && beforeState !== afterState) {
        return `После события '${rule.eventType}' на '${rule.selector}' DOM изменился, хотя изменения не ожидались.`;
      }

      // If specific condition provided, check it
      if (rule.condition) {
        const conditionMet = this.window.eval(rule.condition);
        if (!conditionMet) {
          return `После события '${rule.eventType}' на '${rule.selector}' условие '${rule.condition}' не выполнено.`;
        }
      }
    } catch (error) {
      return `Ошибка при диспатче события '${rule.eventType}': ${error.message}`;
    }

    return null;
  }

  /**
   * Logical Composition Rules
   */

  allOf(rule) {
    const errors = [];
    for (const subRule of rule.rules) {
      const error = this.validateRule(subRule);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      return `Не все условия выполнены: ${errors.join("; ")}`;
    }
    return null;
  }

  anyOf(rule) {
    const errors = [];
    let anyPassed = false;

    for (const subRule of rule.rules) {
      const error = this.validateRule(subRule);
      if (error) {
        errors.push(error);
      } else {
        anyPassed = true;
      }
    }

    if (!anyPassed) {
      return `Ни одно из условий не выполнено: ${errors.join("; ")}`;
    }
    return null;
  }

  not(rule) {
    const error = this.validateRule(rule.rule);
    if (!error) {
      return `Условие должно было НЕ выполняться, но выполнилось.`;
    }
    return null;
  }

  countAtLeast(rule) {
    let passedCount = 0;
    const errors = [];

    for (const subRule of rule.rules) {
      const error = this.validateRule(subRule);
      if (!error) {
        passedCount++;
      } else {
        errors.push(error);
      }
    }

    if (passedCount < rule.minimum) {
      return `Выполнено только ${passedCount} условий из минимум ${rule.minimum} требуемых.`;
    }
    return null;
  }

  /**
   * Main validation method
   */
  validateRule(rule) {
    const methodName = rule.type;
    if (typeof this[methodName] === "function") {
      return this[methodName](rule);
    } else {
      return `Неизвестный тип правила валидации: '${rule.type}'`;
    }
  }
}

module.exports = ValidationRules;
