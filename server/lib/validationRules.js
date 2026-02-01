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
    this.functionCallHistory = new Map(); // Для отслеживания вызовов функций
    this.jsExecuted = false; // Флаг для предотвращения повторного выполнения JS
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
        // Не вызываем оригинал, чтобы избежать рекурсии в тестах
      };
    });

    // Intercept addEventListener
    const originalAddEventListener =
      this.window.EventTarget.prototype.addEventListener;

    this.window.EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options,
    ) {
      const element = this;
      const elementKey =
        (element.tagName || "Unknown") +
        (element.id ? "#" + element.id : "") +
        (element.className ? "." + element.className.split(" ").join(".") : "");

      if (!self.eventListeners.has(elementKey)) {
        self.eventListeners.set(elementKey, []);
      }
      self.eventListeners.get(elementKey).push({
        type,
        listener,
        options,
      });

      return originalAddEventListener.call(this, type, listener, options);
    };
  }

  /**
   * Execute JavaScript code safely
   * JavaScript уже встроен в DOM через <script> тег в validationController
   * Эта функция больше не должна добавлять скрипты повторно
   */
  executeJavaScript() {
    // JavaScript уже выполнен через встроенный <script> тег
    // Не нужно выполнять повторно, это вызывает ошибки "already declared"
    if (this.jsExecuted || !this.js) return;

    this.jsExecuted = true;
    // Скрипт уже встроен в DOM при создании fullHTML в validationController
    // Ничего делать не нужно
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
    if (!this.document.doctype) {
      return "Документ должен содержать DOCTYPE декларацию.";
    }
    if (rule.expected) {
      const actualDoctype = this.document.doctype.name;
      if (actualDoctype.toLowerCase() !== rule.expected.toLowerCase()) {
        return `DOCTYPE должен быть '${rule.expected}', но найден '${actualDoctype}'.`;
      }
    }
    return null;
  }

  // Новые правила HTML
  elementInnerHTML(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element)
      return `Элемент '${rule.selector}' не найден для проверки innerHTML.`;
    if (element.innerHTML.trim() !== rule.expected) {
      return `innerHTML элемента '${rule.selector}' ('${element.innerHTML.trim()}') не совпадает с ожидаемым ('${rule.expected}').`;
    }
    return null;
  }

  elementContainsText(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element)
      return `Элемент '${rule.selector}' не найден для проверки текста.`;
    if (!element.textContent.includes(rule.text)) {
      return `Элемент '${rule.selector}' не содержит ожидаемый текст '${rule.text}'.`;
    }
    return null;
  }

  elementAttributeContains(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element)
      return `Элемент '${rule.selector}' не найден для проверки атрибута.`;
    const value = element.getAttribute(rule.attribute);
    if (!value || !value.includes(rule.expectedSubstring)) {
      return `Атрибут '${rule.attribute}' элемента '${rule.selector}' не содержит '${rule.expectedSubstring}'.`;
    }
    return null;
  }

  /**
   * CSS Validation Rules
   */
  //   cssPropertyCheck(rule) {
  //     // (Твой текущий код cssPropertyCheck сохраняется без изменений)
  //   }

  //   styleRuleExists(rule) {
  //     // (Твой текущий код styleRuleExists сохраняется без изменений)
  //   }

  //   styleRuleProperty(rule) {
  //     // (Твой текущий код styleRuleProperty сохраняется без изменений)
  //   }

  //   computedStyle(rule) {
  //     // (Твой текущий код computedStyle сохраняется без изменений)
  //   }

  //   cssPropertyExists(rule) {
  //     // (Твой текущий код cssPropertyExists сохраняется без изменений)
  //   }

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
          "i",
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
    const normalizeValue = (value, currentRule = null) => {
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
        value =
          "#" + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
      }

      // Преобразуем hex цвета в rgb для унификации
      if (value.startsWith("#") && value.length === 7) {
        const r = parseInt(value.slice(1, 3), 16);
        const g = parseInt(value.slice(3, 5), 16);
        const b = parseInt(value.slice(5, 7), 16);
        return `rgb(${r},${g},${b})`;
      }

      // Нормализуем именованные цвета в RGB значения
      const colorMap = {
        white: "rgb(255,255,255)",
        black: "rgb(0,0,0)",
        red: "rgb(255,0,0)",
        green: "rgb(0,128,0)",
        blue: "rgb(0,0,255)",
        yellow: "rgb(255,255,0)",
        cyan: "rgb(0,255,255)",
        magenta: "rgb(255,0,255)",
        silver: "rgb(192,192,192)",
        gray: "rgb(128,128,128)",
        maroon: "rgb(128,0,0)",
        olive: "rgb(128,128,0)",
        lime: "rgb(0,255,0)",
        aqua: "rgb(0,255,255)",
        teal: "rgb(0,128,128)",
        navy: "rgb(0,0,128)",
        fuchsia: "rgb(255,0,255)",
        purple: "rgb(128,0,128)",
      };

      // Проверяем, есть ли цвет в нашей карте
      const lowerValue = value.toLowerCase();
      if (colorMap[lowerValue]) {
        return colorMap[lowerValue];
      }

      // Специальная обработка для border: none
      if (
        value === "" &&
        currentRule &&
        currentRule.property === "border" &&
        currentRule.expected === "none"
      ) {
        return "none";
      }

      // Специальная обработка для border-style
      if (currentRule && currentRule.property === "border-style") {
        // Если ожидается none, а computed style показывает outset/initial - это норма для сброшенных границ
        if (
          currentRule.expected === "none" &&
          (value === "outset" || value === "initial")
        ) {
          return "none";
        }
      }

      // Нормализуем rgb/rgba значения (убираем пробелы)
      if (value.startsWith("rgb")) {
        return value.replace(/\s+/g, "");
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
          "i",
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
        const normalizedExpected = normalizeValue(rule.expected, rule);
        const normalizedComputed = normalizeValue(computedValue, rule);

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

  jsFunctionDefined(rule) {
    this.executeJavaScript();
    if (typeof this.window[rule.name] !== "function") {
      return `Функция '${rule.name}' не определена.`;
    }
    return null;
  }

  jsFunctionCalled(rule) {
    this.executeJavaScript();
    const history = this.functionCallHistory.get(rule.name) || [];
    if (history.length === 0) {
      return `Функция '${rule.name}' не была вызвана.`;
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
        msg.message.includes(rule.message),
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

    const beforeState = this.document.body.innerHTML;

    try {
      const event = new this.window.Event(rule.eventType, { bubbles: true });
      element.dispatchEvent(event);
      const afterState = this.document.body.innerHTML;

      if (rule.expectChange && beforeState === afterState) {
        return `После события '${rule.eventType}' на '${rule.selector}' DOM не изменился, хотя ожидались изменения.`;
      }
      if (!rule.expectChange && beforeState !== afterState) {
        return `После события '${rule.eventType}' на '${rule.selector}' DOM изменился, хотя изменения не ожидались.`;
      }

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
      if (error) errors.push(error);
    }
    if (errors.length > 0)
      return `Не все условия выполнены: ${errors.join("; ")}`;
    return null;
  }

  anyOf(rule) {
    const errors = [];
    let anyPassed = false;
    for (const subRule of rule.rules) {
      const error = this.validateRule(subRule);
      if (error) errors.push(error);
      else anyPassed = true;
    }
    if (!anyPassed)
      return `Ни одно из условий не выполнено: ${errors.join("; ")}`;
    return null;
  }

  not(rule) {
    const error = this.validateRule(rule.rule);
    if (!error) return `Условие должно было НЕ выполняться, но выполнилось.`;
    return null;
  }

  countAtLeast(rule) {
    let passedCount = 0;
    for (const subRule of rule.rules) {
      const error = this.validateRule(subRule);
      if (!error) passedCount++;
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

// // ------------------------------------------------------------------------
// /**
//  * @file lib/validationRules.js
//  * @description Enhanced validation rules for HTML, CSS, and JavaScript validation
//  */

// class ValidationRules {
//   constructor(dom, document, html, css, js) {
//     this.dom = dom;
//     this.document = document;
//     this.html = html;
//     this.css = css;
//     this.js = js;
//     this.window = dom.window;
//     this.consoleMessages = [];
//     this.eventListeners = new Map();
//     this.setupInterception();
//   }

//   /**
//    * Setup console and addEventListener interception
//    */
//   setupInterception() {
//     // Intercept console methods
//     const originalConsole = this.window.console;
//     const self = this; // Store reference to avoid binding issues

//     ["log", "info", "warn", "error"].forEach((method) => {
//       this.window.console[method] = (...args) => {
//         self.consoleMessages.push({
//           type: method,
//           message: args.join(" "),
//           timestamp: Date.now(),
//         });
//         // Don't call original to avoid recursion in test environment
//       };
//     });

//     // Intercept addEventListener
//     const originalAddEventListener =
//       this.window.EventTarget.prototype.addEventListener;
//     const validationInstance = this; // Store reference

//     this.window.EventTarget.prototype.addEventListener = function (
//       type,
//       listener,
//       options
//     ) {
//       const element = this;
//       const elementKey =
//         (element.tagName || "Unknown") +
//         (element.id ? "#" + element.id : "") +
//         (element.className ? "." + element.className.split(" ").join(".") : "");

//       if (!validationInstance.eventListeners.has(elementKey)) {
//         validationInstance.eventListeners.set(elementKey, []);
//       }
//       validationInstance.eventListeners.get(elementKey).push({
//         type,
//         listener,
//         options,
//       });

//       return originalAddEventListener.call(this, type, listener, options);
//     };
//   }

//   /**
//    * Execute JavaScript code safely
//    */
//   executeJavaScript() {
//     if (!this.js) return;

//     try {
//       // Create a more secure context
//       const script = this.document.createElement("script");
//       script.textContent = this.js;
//       this.document.head.appendChild(script);
//     } catch (error) {
//       this.consoleMessages.push({
//         type: "error",
//         message: `JavaScript execution error: ${error.message}`,
//         timestamp: Date.now(),
//       });
//     }
//   }

//   /**
//    * HTML Validation Rules
//    */

//   elementExists(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден.`;
//     }
//     return null;
//   }

//   elementNotExists(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (element) {
//       return `Элемент с селектором '${rule.selector}' не должен существовать, но найден.`;
//     }
//     return null;
//   }

//   elementText(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки текста.`;
//     }
//     if (element.textContent.trim() !== rule.expected) {
//       return `Текст в '${
//         rule.selector
//       }' ('${element.textContent.trim()}') не совпадает с ожидаемым ('${
//         rule.expected
//       }').`;
//     }
//     return null;
//   }

//   elementMatches(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки регулярного выражения.`;
//     }

//     const content =
//       rule.property === "innerHTML" ? element.innerHTML : element.textContent;
//     const regex = new RegExp(rule.pattern, rule.flags || "");

//     if (!regex.test(content)) {
//       return `Содержимое элемента '${rule.selector}' не соответствует шаблону '${rule.pattern}'.`;
//     }
//     return null;
//   }

//   elementHasClass(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки класса.`;
//     }

//     if (!element.classList.contains(rule.className)) {
//       return `Элемент '${rule.selector}' не содержит класс '${rule.className}'.`;
//     }
//     return null;
//   }

//   elementAttribute(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки атрибута.`;
//     }

//     const attributeValue = element.getAttribute(rule.attribute);
//     if (attributeValue !== rule.expected) {
//       return `Атрибут '${rule.attribute}' элемента '${rule.selector}' имеет значение '${attributeValue}', ожидалось '${rule.expected}'.`;
//     }
//     return null;
//   }

//   elementHasAttribute(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки атрибута.`;
//     }

//     if (!element.hasAttribute(rule.attribute)) {
//       return `Элемент '${rule.selector}' не имеет атрибута '${rule.attribute}'.`;
//     }
//     return null;
//   }

//   elementCount(rule) {
//     const elements = this.document.querySelectorAll(rule.selector);
//     if (elements.length !== rule.expected) {
//       return `Найдено ${elements.length} элементов с селектором '${rule.selector}', ожидалось ${rule.expected}.`;
//     }
//     return null;
//   }

//   hasDoctype(rule) {
//     // Check if document has DOCTYPE declaration
//     if (!this.document.doctype) {
//       return "Документ должен содержать DOCTYPE декларацию.";
//     }

//     // If specific doctype is expected, check it
//     if (rule.expected) {
//       const actualDoctype = this.document.doctype.name;
//       if (actualDoctype.toLowerCase() !== rule.expected.toLowerCase()) {
//         return `DOCTYPE должен быть '${rule.expected}', но найден '${actualDoctype}'.`;
//       }
//     }

//     return null;
//   }

//   /**
//    * CSS Validation Rules
//    */

//   computedStyle(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки стиля.`;
//     }

//     const styles = this.window.getComputedStyle(element);
//     const actualValue = styles.getPropertyValue(rule.property);
//     if (actualValue !== rule.expected) {
//       return `Стиль '${rule.property}' элемента '${rule.selector}' имеет значение '${actualValue}', ожидалось '${rule.expected}'.`;
//     }
//     return null;
//   }

//   styleRuleExists(rule) {
//     // Check if CSS rule exists in stylesheets
//     const styleSheets = this.document.styleSheets;
//     let ruleFound = false;

//     try {
//       for (let i = 0; i < styleSheets.length; i++) {
//         const rules = styleSheets[i].cssRules || styleSheets[i].rules;
//         if (rules) {
//           for (let j = 0; j < rules.length; j++) {
//             if (rules[j].selectorText === rule.selector) {
//               ruleFound = true;
//               break;
//             }
//           }
//         }
//       }
//     } catch (e) {
//       // Some stylesheets might not be accessible due to CORS
//       // Fallback: check if selector matches any elements and they have non-default styles
//       const elements = this.document.querySelectorAll(rule.selector);
//       if (elements.length > 0) {
//         ruleFound = true; // Assume rule exists if elements match
//       }
//     }

//     if (!ruleFound) {
//       return `CSS правило для селектора '${rule.selector}' не найдено.`;
//     }
//     return null;
//   }

//   styleRuleProperty(rule) {
//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для проверки CSS правила.`;
//     }

//     const styles = this.window.getComputedStyle(element);
//     const actualValue = styles.getPropertyValue(rule.property);

//     if (rule.expected && actualValue !== rule.expected) {
//       return `CSS свойство '${rule.property}' для селектора '${rule.selector}' имеет значение '${actualValue}', ожидалось '${rule.expected}'.`;
//     }

//     // If no expected value, just check that property exists and is not empty/initial
//     if (
//       !rule.expected &&
//       (!actualValue || actualValue === "initial" || actualValue === "")
//     ) {
//       return `CSS свойство '${rule.property}' для селектора '${rule.selector}' не установлено.`;
//     }

//     return null;
//   }

//   cssPropertyExists(rule) {
//     // Проверяем наличие CSS-свойства в стилях (не проверяем значение)
//     const styleSheets = this.document.styleSheets;
//     let propertyFound = false;

//     try {
//       for (let i = 0; i < styleSheets.length; i++) {
//         const rules = styleSheets[i].cssRules || styleSheets[i].rules;
//         if (rules) {
//           for (let j = 0; j < rules.length; j++) {
//             const cssRule = rules[j];
//             if (cssRule.selectorText === rule.selector && cssRule.style) {
//               // Проверяем, есть ли нужное свойство в стиле
//               if (
//                 cssRule.style.getPropertyValue(rule.property) !== "" ||
//                 cssRule.style[rule.property] !== undefined
//               ) {
//                 propertyFound = true;
//                 break;
//               }
//             }
//           }
//         }
//       }
//     } catch (e) {
//       // Fallback: проверяем через проверку содержимого тега <style>
//       const styleTags = this.document.querySelectorAll("style");
//       for (let styleTag of styleTags) {
//         const cssText = styleTag.textContent;
//         // Простая проверка наличия селектора и свойства в CSS тексте
//         const selectorRegex = new RegExp(
//           `${rule.selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*{[^}]*${
//             rule.property
//           }\\s*:`,
//           "i"
//         );
//         if (selectorRegex.test(cssText)) {
//           propertyFound = true;
//           break;
//         }
//       }
//     }

//     if (!propertyFound) {
//       return `CSS свойство '${rule.property}' для селектора '${rule.selector}' не найдено в стилях.`;
//     }
//     return null;
//   }

//   cssPropertyCheck(rule) {
//     // Комбинированная проверка: сначала наличие свойства, потом значение

//     // Функция нормализации CSS значений для сравнения
//     const normalizeValue = (value, currentRule = null) => {
//       if (!value) return value;

//       // Удаляем лишние пробелы
//       value = value.trim();

//       // Нормализуем нулевые значения (0 -> 0px, 0px -> 0px, и т.д.)
//       if (
//         value === "0" ||
//         value === "0px" ||
//         value === "0em" ||
//         value === "0rem"
//       ) {
//         return "0px"; // Браузер обычно нормализует к 0px
//       }

//       // Нормализуем цвета
//       if (value.startsWith("#") && value.length === 4) {
//         // Расширяем короткие hex цвета #abc -> #aabbcc
//         value =
//           "#" + value[1] + value[1] + value[2] + value[2] + value[3] + value[3];
//       }

//       // Преобразуем hex цвета в rgb для унификации
//       if (value.startsWith("#") && value.length === 7) {
//         const r = parseInt(value.slice(1, 3), 16);
//         const g = parseInt(value.slice(3, 5), 16);
//         const b = parseInt(value.slice(5, 7), 16);
//         return `rgb(${r},${g},${b})`;
//       }

//       // Нормализуем именованные цвета в RGB значения
//       const colorMap = {
//         white: "rgb(255,255,255)",
//         black: "rgb(0,0,0)",
//         red: "rgb(255,0,0)",
//         green: "rgb(0,128,0)",
//         blue: "rgb(0,0,255)",
//         yellow: "rgb(255,255,0)",
//         cyan: "rgb(0,255,255)",
//         magenta: "rgb(255,0,255)",
//         silver: "rgb(192,192,192)",
//         gray: "rgb(128,128,128)",
//         maroon: "rgb(128,0,0)",
//         olive: "rgb(128,128,0)",
//         lime: "rgb(0,255,0)",
//         aqua: "rgb(0,255,255)",
//         teal: "rgb(0,128,128)",
//         navy: "rgb(0,0,128)",
//         fuchsia: "rgb(255,0,255)",
//         purple: "rgb(128,0,128)",
//       };

//       // Проверяем, есть ли цвет в нашей карте
//       const lowerValue = value.toLowerCase();
//       if (colorMap[lowerValue]) {
//         return colorMap[lowerValue];
//       }

//       // Специальная обработка для border: none
//       if (
//         value === "" &&
//         currentRule &&
//         currentRule.property === "border" &&
//         currentRule.expected === "none"
//       ) {
//         return "none";
//       }

//       // Специальная обработка для border-style
//       if (currentRule && currentRule.property === "border-style") {
//         // Если ожидается none, а computed style показывает outset/initial - это норма для сброшенных границ
//         if (
//           currentRule.expected === "none" &&
//           (value === "outset" || value === "initial")
//         ) {
//           return "none";
//         }
//       }

//       // Нормализуем rgb/rgba значения (убираем пробелы)
//       if (value.startsWith("rgb")) {
//         return value.replace(/\s+/g, "");
//       }

//       // Приводим к нижнему регистру для сравнения
//       return value.toLowerCase();
//     };

//     // Шаг 1: Проверяем наличие свойства в CSS правилах
//     const styleSheets = this.document.styleSheets;
//     let propertyFound = false;
//     let actualCssValue = null;

//     try {
//       for (let i = 0; i < styleSheets.length; i++) {
//         const rules = styleSheets[i].cssRules || styleSheets[i].rules;
//         if (rules) {
//           for (let j = 0; j < rules.length; j++) {
//             const cssRule = rules[j];
//             if (cssRule.selectorText === rule.selector && cssRule.style) {
//               const propValue = cssRule.style.getPropertyValue(rule.property);
//               if (propValue !== "") {
//                 propertyFound = true;
//                 actualCssValue = propValue;
//                 break;
//               }
//             }
//           }
//         }
//       }
//     } catch (e) {
//       // Fallback: проверяем через содержимое тега <style>
//       const styleTags = this.document.querySelectorAll("style");
//       for (let styleTag of styleTags) {
//         const cssText = styleTag.textContent;
//         const selectorRegex = new RegExp(
//           `${rule.selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*{[^}]*${
//             rule.property
//           }\\s*:([^;}]+)`,
//           "i"
//         );
//         const match = selectorRegex.exec(cssText);
//         if (match) {
//           propertyFound = true;
//           actualCssValue = match[1].trim();
//           break;
//         }
//       }
//     }

//     // Если свойство не найдено в CSS
//     if (!propertyFound) {
//       return `CSS свойство '${rule.property}' для селектора '${rule.selector}' не найдено в стилях. Добавьте это свойство в ваш CSS код.`;
//     }

//     // Если свойство найдено, но нужно проверить значение
//     if (rule.expected) {
//       // Получаем вычисленное значение для более точной проверки
//       const element = this.document.querySelector(rule.selector);
//       if (element) {
//         const computedStyles = this.window.getComputedStyle(element);
//         const computedValue = computedStyles.getPropertyValue(rule.property);

//         // Нормализуем оба значения для корректного сравнения
//         const normalizedExpected = normalizeValue(rule.expected, rule);
//         const normalizedComputed = normalizeValue(computedValue, rule);

//         // Проверяем разные варианты соответствия
//         // Для градиентов и сложных значений используем более гибкую проверку
//         if (
//           rule.property === "background" ||
//           rule.property === "background-image"
//         ) {
//           if (
//             rule.expected.toLowerCase().includes("gradient") &&
//             !computedValue.toLowerCase().includes("gradient")
//           ) {
//             return `CSS свойство '${rule.property}' найдено, но значение '${computedValue}' не содержит градиент. Ожидался градиент.`;
//           }
//         } else if (normalizedComputed !== normalizedExpected) {
//           // Дополнительная проверка для случаев 0 vs 0px
//           const isZeroMatch =
//             (normalizedExpected === "0px" &&
//               (rule.expected === "0" || rule.expected === "0px")) ||
//             (normalizedComputed === "0px" &&
//               (rule.expected === "0" || rule.expected === "0px"));

//           if (!isZeroMatch) {
//             return `CSS свойство '${rule.property}' найдено, но имеет значение '${computedValue}', ожидалось '${rule.expected}'.`;
//           }
//         }
//       }
//     }

//     return null; // Всё в порядке
//   }

//   /**
//    * JavaScript Validation Rules
//    */

//   jsGlobalDefined(rule) {
//     this.executeJavaScript();

//     if (!(rule.name in this.window)) {
//       return `Глобальная переменная или функция '${rule.name}' не определена.`;
//     }
//     return null;
//   }

//   jsExpression(rule) {
//     this.executeJavaScript();

//     try {
//       const result = this.window.eval(rule.expression);
//       if (rule.expected !== undefined && result !== rule.expected) {
//         return `Выражение '${rule.expression}' возвращает '${result}', ожидалось '${rule.expected}'.`;
//       }
//       if (rule.expected === undefined && !result) {
//         return `Выражение '${rule.expression}' возвращает ложное значение.`;
//       }
//     } catch (error) {
//       return `Ошибка выполнения выражения '${rule.expression}': ${error.message}`;
//     }
//     return null;
//   }

//   jsFunctionReturns(rule) {
//     this.executeJavaScript();

//     try {
//       if (typeof this.window[rule.functionName] !== "function") {
//         return `Функция '${rule.functionName}' не найдена или не является функцией.`;
//       }

//       const args = rule.args || [];
//       const result = this.window[rule.functionName](...args);

//       if (result !== rule.expected) {
//         return `Функция '${rule.functionName}' возвращает '${result}', ожидалось '${rule.expected}'.`;
//       }
//     } catch (error) {
//       return `Ошибка выполнения функции '${rule.functionName}': ${error.message}`;
//     }
//     return null;
//   }

//   jsConsoleContains(rule) {
//     this.executeJavaScript();

//     const found = this.consoleMessages.some(
//       (msg) =>
//         msg.type === (rule.consoleType || "log") &&
//         msg.message.includes(rule.message)
//     );

//     if (!found) {
//       return `Сообщение '${rule.message}' не найдено в консоли (тип: ${
//         rule.consoleType || "log"
//       }).`;
//     }
//     return null;
//   }

//   eventListenerAttached(rule) {
//     this.executeJavaScript();

//     const elements = this.document.querySelectorAll(rule.selector);
//     let found = false;

//     for (const elementKey of this.eventListeners.keys()) {
//       const listeners = this.eventListeners.get(elementKey);
//       if (listeners.some((listener) => listener.type === rule.eventType)) {
//         found = true;
//         break;
//       }
//     }

//     if (!found) {
//       return `Обработчик события '${rule.eventType}' не найден для селектора '${rule.selector}'.`;
//     }
//     return null;
//   }

//   eventDispatchChangesDom(rule) {
//     this.executeJavaScript();

//     const element = this.document.querySelector(rule.selector);
//     if (!element) {
//       return `Элемент с селектором '${rule.selector}' не найден для диспатча события.`;
//     }

//     // Capture DOM state before event
//     const beforeState = this.document.body.innerHTML;

//     try {
//       // Dispatch event
//       const event = new this.window.Event(rule.eventType, { bubbles: true });
//       element.dispatchEvent(event);

//       // Check if DOM changed
//       const afterState = this.document.body.innerHTML;

//       if (rule.expectChange && beforeState === afterState) {
//         return `После события '${rule.eventType}' на '${rule.selector}' DOM не изменился, хотя ожидались изменения.`;
//       }

//       if (!rule.expectChange && beforeState !== afterState) {
//         return `После события '${rule.eventType}' на '${rule.selector}' DOM изменился, хотя изменения не ожидались.`;
//       }

//       // If specific condition provided, check it
//       if (rule.condition) {
//         const conditionMet = this.window.eval(rule.condition);
//         if (!conditionMet) {
//           return `После события '${rule.eventType}' на '${rule.selector}' условие '${rule.condition}' не выполнено.`;
//         }
//       }
//     } catch (error) {
//       return `Ошибка при диспатче события '${rule.eventType}': ${error.message}`;
//     }

//     return null;
//   }

//   /**
//    * Logical Composition Rules
//    */

//   allOf(rule) {
//     const errors = [];
//     for (const subRule of rule.rules) {
//       const error = this.validateRule(subRule);
//       if (error) {
//         errors.push(error);
//       }
//     }

//     if (errors.length > 0) {
//       return `Не все условия выполнены: ${errors.join("; ")}`;
//     }
//     return null;
//   }

//   anyOf(rule) {
//     const errors = [];
//     let anyPassed = false;

//     for (const subRule of rule.rules) {
//       const error = this.validateRule(subRule);
//       if (error) {
//         errors.push(error);
//       } else {
//         anyPassed = true;
//       }
//     }

//     if (!anyPassed) {
//       return `Ни одно из условий не выполнено: ${errors.join("; ")}`;
//     }
//     return null;
//   }

//   not(rule) {
//     const error = this.validateRule(rule.rule);
//     if (!error) {
//       return `Условие должно было НЕ выполняться, но выполнилось.`;
//     }
//     return null;
//   }

//   countAtLeast(rule) {
//     let passedCount = 0;
//     const errors = [];

//     for (const subRule of rule.rules) {
//       const error = this.validateRule(subRule);
//       if (!error) {
//         passedCount++;
//       } else {
//         errors.push(error);
//       }
//     }

//     if (passedCount < rule.minimum) {
//       return `Выполнено только ${passedCount} условий из минимум ${rule.minimum} требуемых.`;
//     }
//     return null;
//   }

//   /**
//    * Main validation method
//    */
//   validateRule(rule) {
//     const methodName = rule.type;
//     if (typeof this[methodName] === "function") {
//       return this[methodName](rule);
//     } else {
//       return `Неизвестный тип правила валидации: '${rule.type}'`;
//     }
//   }
// }

// module.exports = ValidationRules;
