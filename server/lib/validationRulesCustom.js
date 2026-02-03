// Дополнительные (кастомные) правила валидации для Magic Button
// Подключать через require и расширять основной класс ValidationRules

const ValidationRules = require("./validationRules");

class ValidationRulesCustom extends ValidationRules {
  // Проверка наличия глобальной переменной (аналог variableExists)
  variableExists(rule) {
    this.executeJavaScript();

    // Сначала проверяем в window (для var и window.переменная)
    if (rule.name in this.window) {
      return null;
    }

    // Если не найдена в window, пробуем через eval (для let/const в глобальном scope)
    try {
      const result = this.window.eval(`typeof ${rule.name} !== 'undefined'`);
      if (result) {
        return null;
      }
    } catch (e) {
      // Переменная не доступна
    }

    return `Глобальная переменная '${rule.name}' не определена.`;
  }

  // Проверка значения глобальной переменной (аналог variableValueCheck)
  variableValueCheck(rule) {
    this.executeJavaScript();

    let value;
    // Сначала проверяем в window
    if (rule.name in this.window) {
      value = this.window[rule.name];
    } else {
      // Пробуем получить через eval (для let/const)
      try {
        value = this.window.eval(rule.name);
      } catch (e) {
        return `Глобальная переменная '${rule.name}' не определена.`;
      }
    }

    if (value !== rule.expected) {
      return `Переменная '${rule.name}' имеет значение '${value}', ожидалось '${rule.expected}'.`;
    }
    return null;
  }

  // Проверка наличия функции (аналог functionExists)
  functionExists(rule) {
    this.executeJavaScript();

    // Проверяем в window
    if (typeof this.window[rule.name] === "function") {
      return null;
    }

    // Пробуем через eval (для function в глобальном scope, объявленных через let/const)
    try {
      const fn = this.window.eval(rule.name);
      if (typeof fn === "function") {
        return null;
      }
    } catch (e) {
      // Функция не доступна
    }

    return `Функция '${rule.name}' не найдена.`;
  }

  // Проверка вызова функции (очень базово, только если функция есть)
  functionCallCheck(rule) {
    // Для простоты: проверяем, что функция определена (реальный call-tracking требует прокси)
    this.executeJavaScript();
    if (typeof this.window[rule.function] !== "function") {
      return `Функция '${rule.function}' не найдена для вызова.`;
    }
    // Можно расширить: логировать вызовы через Proxy или monkey-patch
    return null;
  }

  // Проверка наличия кода в теле функции (очень базово, eval+toString)
  functionBodyIncludes(rule) {
    this.executeJavaScript();

    let fn = this.window[rule.function];
    // Если не найдена в window, пробуем через eval
    if (typeof fn !== "function") {
      try {
        fn = this.window.eval(rule.function);
      } catch (e) {
        return `Функция '${rule.function}' не найдена.`;
      }
    }

    if (typeof fn !== "function") {
      return `Функция '${rule.function}' не найдена.`;
    }

    const body = fn.toString();

    // Поддержка массива альтернативных вариантов
    if (Array.isArray(rule.expected)) {
      const found = rule.expected.some((variant) => body.includes(variant));
      if (!found) {
        return `В теле функции '${rule.function}' не найден ни один из вариантов: ${rule.expected.join(" ИЛИ ")}.`;
      }
    } else {
      // Одиночная проверка (обратная совместимость)
      if (!body.includes(rule.expected)) {
        return `В теле функции '${rule.function}' не найдено '${rule.expected}'.`;
      }
    }

    return null;
  }

  // Проверка наличия кода (codeCheck)
  codeCheck(rule) {
    this.executeJavaScript();
    if (!this.js.includes(rule.code)) {
      return `В JS-коде не найдено '${rule.code}'.`;
    }
    return null;
  }

  // Проверка длины массива (arrayLengthCheck)
  arrayLengthCheck(rule) {
    this.executeJavaScript();

    let arr;
    // Проверяем в window
    if (rule.array in this.window) {
      arr = this.window[rule.array];
    } else {
      // Пробуем через eval (для let/const)
      try {
        arr = this.window.eval(rule.array);
      } catch (e) {
        return `Массив '${rule.array}' не найден.`;
      }
    }

    if (!Array.isArray(arr)) {
      return `'${rule.array}' не является массивом.`;
    }
    if (arr.length < rule.expected) {
      return `Массив '${rule.array}' содержит ${arr.length} элементов, ожидалось минимум ${rule.expected}.`;
    }
    return null;
  }

  // Проверка наличия атрибута у элемента (elementAttributeCheck)
  elementAttributeCheck(rule) {
    const element = this.document.querySelector(rule.selector);
    if (!element) {
      return `Элемент '${rule.selector}' не найден.`;
    }
    if (rule.expected === null) {
      if (element.hasAttribute(rule.attribute)) {
        return `Атрибут '${rule.attribute}' не должен быть у '${rule.selector}', но найден.`;
      }
    } else {
      if (element.getAttribute(rule.attribute) !== rule.expected) {
        return `Атрибут '${rule.attribute}' элемента '${rule.selector}' имеет значение '${element.getAttribute(rule.attribute)}', ожидалось '${rule.expected}'.`;
      }
    }
    return null;
  }

  // Проверка наличия CSS класса (cssClassExists)
  cssClassExists(rule) {
    const styleSheets = this.document.styleSheets;
    let found = false;
    for (let i = 0; i < styleSheets.length; i++) {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].selectorText === rule.selector) {
            found = true;
            break;
          }
        }
      }
    }
    if (!found) {
      return `CSS класс/правило '${rule.selector}' не найдено.`;
    }
    return null;
  }

  // Проверка наличия keyframes (cssKeyframesExists)
  cssKeyframesExists(rule) {
    const styleSheets = this.document.styleSheets;
    let found = false;
    for (let i = 0; i < styleSheets.length; i++) {
      const rules = styleSheets[i].cssRules || styleSheets[i].rules;
      if (rules) {
        for (let j = 0; j < rules.length; j++) {
          if (rules[j].type === 7 && rules[j].name === rule.name) {
            found = true;
            break;
          }
        }
      }
    }
    if (!found) {
      return `CSS keyframes '${rule.name}' не найдены.`;
    }
    return null;
  }

  // Проверка наличия слушателя события (eventListenerExists)
  eventListenerExists(rule) {
    // JavaScript уже выполнен при создании DOM, не нужно вызывать executeJavaScript()
    // this.executeJavaScript(); - УБРАНО

    const elements = this.document.querySelectorAll(rule.element);
    if (elements.length === 0) {
      return `Элемент '${rule.element}' не найден в DOM.`;
    }

    let found = false;
    for (const elementKey of this.eventListeners.keys()) {
      const listeners = this.eventListeners.get(elementKey);
      if (listeners.some((listener) => listener.type === rule.event)) {
        found = true;
        break;
      }
    }

    if (!found) {
      // Дополнительная информация для отладки
      const allListeners = Array.from(this.eventListeners.keys());
      return `Слушатель события '${rule.event}' не найден для '${rule.element}'. Найденные слушатели: ${allListeners.length > 0 ? allListeners.join(", ") : "нет"}.`;
    }
    return null;
  }

  // Проверка alert с рандомной фразой (alertRandomPhrase)
  alertRandomPhrase(rule) {
    // Не реализовано: требует перехвата window.alert и анализа аргументов
    // Можно реализовать через monkey-patch window.alert и логировать вызовы
    return null;
  }

  // Проверка наличия сообщения в консоли (consoleLogCheck)
  consoleLogCheck(rule) {
    this.executeJavaScript();
    const found = this.consoleMessages.some((msg) =>
      msg.message.includes(rule.expected),
    );
    if (!found) {
      return `В консоли не найдено сообщение '${rule.expected}'.`;
    }
    return null;
  }
}

module.exports = ValidationRulesCustom;
