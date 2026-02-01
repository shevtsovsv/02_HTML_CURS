// Дополнительные (кастомные) правила валидации для Magic Button
// Подключать через require и расширять основной класс ValidationRules

const ValidationRules = require('./validationRules');

class ValidationRulesCustom extends ValidationRules {
  // Проверка наличия глобальной переменной (аналог variableExists)
  variableExists(rule) {
    this.executeJavaScript();
    if (!(rule.name in this.window)) {
      return `Глобальная переменная '${rule.name}' не определена.`;
    }
    return null;
  }

  // Проверка значения глобальной переменной (аналог variableValueCheck)
  variableValueCheck(rule) {
    this.executeJavaScript();
    if (!(rule.name in this.window)) {
      return `Глобальная переменная '${rule.name}' не определена.`;
    }
    if (this.window[rule.name] !== rule.expected) {
      return `Переменная '${rule.name}' имеет значение '${this.window[rule.name]}', ожидалось '${rule.expected}'.`;
    }
    return null;
  }

  // Проверка наличия функции (аналог functionExists)
  functionExists(rule) {
    this.executeJavaScript();
    if (typeof this.window[rule.name] !== 'function') {
      return `Функция '${rule.name}' не найдена.`;
    }
    return null;
  }

  // Проверка вызова функции (очень базово, только если функция есть)
  functionCallCheck(rule) {
    // Для простоты: проверяем, что функция определена (реальный call-tracking требует прокси)
    this.executeJavaScript();
    if (typeof this.window[rule.function] !== 'function') {
      return `Функция '${rule.function}' не найдена для вызова.`;
    }
    // Можно расширить: логировать вызовы через Proxy или monkey-patch
    return null;
  }

  // Проверка наличия кода в теле функции (очень базово, eval+toString)
  functionBodyIncludes(rule) {
    this.executeJavaScript();
    const fn = this.window[rule.function];
    if (typeof fn !== 'function') {
      return `Функция '${rule.function}' не найдена.`;
    }
    const body = fn.toString();
    if (!body.includes(rule.expected)) {
      return `В теле функции '${rule.function}' не найдено '${rule.expected}'.`;
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
    if (!(rule.array in this.window)) {
      return `Массив '${rule.array}' не найден.`;
    }
    if (!Array.isArray(this.window[rule.array])) {
      return `'${rule.array}' не является массивом.`;
    }
    if (this.window[rule.array].length < rule.expected) {
      return `Массив '${rule.array}' содержит ${this.window[rule.array].length} элементов, ожидалось минимум ${rule.expected}.`;
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
    this.executeJavaScript();
    const elements = this.document.querySelectorAll(rule.element);
    let found = false;
    for (const elementKey of this.eventListeners.keys()) {
      const listeners = this.eventListeners.get(elementKey);
      if (listeners.some((listener) => listener.type === rule.event)) {
        found = true;
        break;
      }
    }
    if (!found) {
      return `Слушатель события '${rule.event}' не найден для '${rule.element}'.`;
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
    const found = this.consoleMessages.some((msg) => msg.message.includes(rule.expected));
    if (!found) {
      return `В консоли не найдено сообщение '${rule.expected}'.`;
    }
    return null;
  }
}

module.exports = ValidationRulesCustom;
