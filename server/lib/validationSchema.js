

/**
 * @file lib/validationSchema.js
 * @description Schema definitions for validation rules to support the Rule Builder
 */

const validationSchema = {
  // HTML Validation Rules
  elementExists: {
    category: "HTML",
    title: "Элемент существует",
    description: "Проверяет, что элемент с указанным селектором существует",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        description: "CSS селектор для поиска элемента",
        placeholder: "h1, .my-class, #my-id",
      },
    },
    example: {
      type: "elementExists",
      selector: "h1",
    },
  },

  elementNotExists: {
    category: "HTML",
    title: "Элемент не существует",
    description: "Проверяет, что элемент с указанным селектором НЕ существует",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        description: "CSS селектор элемента, который не должен существовать",
        placeholder: ".deprecated-class",
      },
    },
    example: {
      type: "elementNotExists",
      selector: ".old-style",
    },
  },

  elementText: {
    category: "HTML",
    title: "Текст элемента",
    description: "Проверяет, что элемент содержит точно указанный текст",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        description: "CSS селектор для поиска элемента",
        placeholder: "h1, .title",
      },
      expected: {
        type: "string",
        required: true,
        title: "Ожидаемый текст",
        description: "Текст, который должен содержать элемент",
        placeholder: "Добро пожаловать!",
      },
    },
    example: {
      type: "elementText",
      selector: "h1",
      expected: "Добро пожаловать!",
    },
  },

  elementMatches: {
    category: "HTML",
    title: "Текст элемента соответствует шаблону",
    description:
      "Проверяет, что содержимое элемента соответствует регулярному выражению",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "p, .content",
      },
      pattern: {
        type: "string",
        required: true,
        title: "Регулярное выражение",
        description: "Паттерн для проверки содержимого",
        placeholder: "\\d{2}-\\d{2}-\\d{4}",
      },
      flags: {
        type: "string",
        required: false,
        title: "Флаги регулярного выражения",
        description: "Флаги: i, g, m, s, u, y",
        placeholder: "i",
      },
      property: {
        type: "select",
        required: false,
        title: "Свойство для проверки",
        options: ["textContent", "innerHTML"],
        default: "textContent",
      },
    },
    example: {
      type: "elementMatches",
      selector: ".date",
      pattern: "\\d{2}\\.\\d{2}\\.\\d{4}",
      flags: "g",
    },
  },

  elementHasClass: {
    category: "HTML",
    title: "Элемент имеет класс",
    description: "Проверяет, что элемент содержит указанный CSS класс",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "div, button",
      },
      className: {
        type: "string",
        required: true,
        title: "Название класса",
        description: "CSS класс, который должен быть у элемента",
        placeholder: "active, highlighted",
      },
    },
    example: {
      type: "elementHasClass",
      selector: "button",
      className: "btn-primary",
    },
  },

  elementAttribute: {
    category: "HTML",
    title: "Атрибут элемента имеет значение",
    description:
      "Проверяет, что атрибут элемента имеет точно указанное значение",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "img, a",
      },
      attribute: {
        type: "string",
        required: true,
        title: "Название атрибута",
        placeholder: "src, href, alt",
      },
      expected: {
        type: "string",
        required: true,
        title: "Ожидаемое значение",
        placeholder: "image.jpg, #section1",
      },
    },
    example: {
      type: "elementAttribute",
      selector: "img",
      attribute: "alt",
      expected: "Описание изображения",
    },
  },

  elementHasAttribute: {
    category: "HTML",
    title: "Элемент имеет атрибут",
    description:
      "Проверяет, что элемент имеет указанный атрибут (независимо от значения)",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "img, input",
      },
      attribute: {
        type: "string",
        required: true,
        title: "Название атрибута",
        placeholder: "src, required, disabled",
      },
    },
    example: {
      type: "elementHasAttribute",
      selector: "input[type='email']",
      attribute: "required",
    },
  },

  elementCount: {
    category: "HTML",
    title: "Количество элементов",
    description: "Проверяет, что количество элементов соответствует ожидаемому",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "li, .item",
      },
      expected: {
        type: "number",
        required: true,
        title: "Ожидаемое количество",
        min: 0,
        placeholder: "3",
      },
    },
    example: {
      type: "elementCount",
      selector: "ul li",
      expected: 5,
    },
  },

  hasDoctype: {
    category: "HTML",
    title: "DOCTYPE декларация",
    description: "Проверяет наличие DOCTYPE декларации в HTML документе",
    parameters: {
      expected: {
        type: "string",
        required: false,
        title: "Ожидаемый DOCTYPE",
        description: "Конкретный тип DOCTYPE (html, html5, xhtml, etc.)",
        placeholder: "html",
        default: "html",
      },
    },
    example: {
      type: "hasDoctype",
      expected: "html",
    },
  },

  // CSS Validation Rules
  computedStyle: {
    category: "CSS",
    title: "Вычисленный стиль элемента",
    description:
      "Проверяет, что CSS свойство элемента имеет определенное значение",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: ".card, #header",
      },
      property: {
        type: "string",
        required: true,
        title: "CSS свойство",
        description: "Название CSS свойства",
        placeholder: "width, color, display",
      },
      expected: {
        type: "string",
        required: true,
        title: "Ожидаемое значение",
        placeholder: "300px, red, flex",
      },
    },
    example: {
      type: "computedStyle",
      selector: ".container",
      property: "max-width",
      expected: "1200px",
    },
  },

  styleRuleExists: {
    category: "CSS",
    title: "CSS правило существует",
    description:
      "Проверяет, что в таблице стилей есть правило для указанного селектора",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        description: "Селектор, для которого должно быть CSS правило",
        placeholder: ".my-class, #my-id",
      },
    },
    example: {
      type: "styleRuleExists",
      selector: ".hero-section",
    },
  },

  styleRuleProperty: {
    category: "CSS",
    title: "CSS правило содержит свойство",
    description:
      "Проверяет, что CSS правило содержит определенное свойство со значением",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: ".button, body",
      },
      property: {
        type: "string",
        required: true,
        title: "CSS свойство",
        placeholder: "background-color, font-size",
      },
      expected: {
        type: "string",
        required: false,
        title: "Ожидаемое значение (необязательно)",
        description: "Если не указано, проверяется только наличие свойства",
        placeholder: "#ff0000, 16px",
      },
    },
    example: {
      type: "styleRuleProperty",
      selector: ".button",
      property: "background-color",
      expected: "#007bff",
    },
  },

  cssPropertyExists: {
    category: "CSS",
    title: "CSS свойство присутствует в стилях",
    description:
      "Проверяет наличие CSS-свойства для селектора в стилях (без проверки значения)",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        description: "Селектор, для которого проверяется свойство",
        placeholder: "body, .container, h1",
      },
      property: {
        type: "string",
        required: true,
        title: "CSS свойство",
        description: "Название CSS свойства для проверки",
        placeholder: "font-family, margin, background",
      },
    },
    example: {
      type: "cssPropertyExists",
      selector: "body",
      property: "font-family",
    },
  },

  cssPropertyCheck: {
    category: "CSS",
    title: "CSS свойство: наличие + значение",
    description:
      "Проверяет наличие CSS-свойства в стилях, а затем (опционально) его значение",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        description: "Селектор, для которого проверяется свойство",
        placeholder: "body, .container, h1",
      },
      property: {
        type: "string",
        required: true,
        title: "CSS свойство",
        description: "Название CSS свойства для проверки",
        placeholder: "font-family, margin, background",
      },
      expected: {
        type: "string",
        required: false,
        title: "Ожидаемое значение (необязательно)",
        description:
          "Если указано, проверяется значение свойства после проверки его наличия",
        placeholder: "Arial, 0, linear-gradient",
      },
    },
    example: {
      type: "cssPropertyCheck",
      selector: "body",
      property: "font-family",
      expected: "Arial, sans-serif",
    },
  },

  // JavaScript Validation Rules
  jsGlobalDefined: {
    category: "JavaScript",
    title: "Глобальная переменная/функция определена",
    description: "Проверяет, что глобальная переменная или функция существует",
    parameters: {
      name: {
        type: "string",
        required: true,
        title: "Имя переменной/функции",
        placeholder: "myVariable, myFunction",
      },
    },
    example: {
      type: "jsGlobalDefined",
      name: "calculateSum",
    },
  },

  jsExpression: {
    category: "JavaScript",
    title: "JavaScript выражение",
    description: "Проверяет результат выполнения JavaScript выражения",
    parameters: {
      expression: {
        type: "text",
        required: true,
        title: "JavaScript выражение",
        description: "Выражение для выполнения",
        placeholder: "document.querySelector('h1').textContent === 'Hello'",
      },
      expected: {
        type: "string",
        required: false,
        title: "Ожидаемый результат",
        description: "Если не указан, ожидается true",
        placeholder: "true, 42, 'result'",
      },
    },
    example: {
      type: "jsExpression",
      expression: "typeof myFunction === 'function'",
      expected: true,
    },
  },

  jsFunctionReturns: {
    category: "JavaScript",
    title: "Функция возвращает значение",
    description: "Проверяет, что функция возвращает ожидаемое значение",
    parameters: {
      functionName: {
        type: "string",
        required: true,
        title: "Имя функции",
        placeholder: "calculateSum, getUserName",
      },
      args: {
        type: "json",
        required: false,
        title: "Аргументы (JSON массив)",
        description: "Аргументы для вызова функции",
        placeholder: "[1, 2, 3]",
      },
      expected: {
        type: "string",
        required: true,
        title: "Ожидаемый результат",
        placeholder: "6, 'John', true",
      },
    },
    example: {
      type: "jsFunctionReturns",
      functionName: "add",
      args: [5, 3],
      expected: 8,
    },
  },

  jsConsoleContains: {
    category: "JavaScript",
    title: "Консоль содержит сообщение",
    description:
      "Проверяет, что в консоли было выведено определенное сообщение",
    parameters: {
      message: {
        type: "string",
        required: true,
        title: "Текст сообщения",
        description: "Часть сообщения для поиска",
        placeholder: "Hello World, Error:",
      },
      consoleType: {
        type: "select",
        required: false,
        title: "Тип сообщения",
        options: ["log", "info", "warn", "error"],
        default: "log",
      },
    },
    example: {
      type: "jsConsoleContains",
      message: "Функция выполнена успешно",
      consoleType: "log",
    },
  },

  eventListenerAttached: {
    category: "JavaScript",
    title: "Обработчик события прикреплен",
    description: "Проверяет, что к элементу прикреплен обработчик события",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "button, .clickable",
      },
      eventType: {
        type: "select",
        required: true,
        title: "Тип события",
        options: [
          "click",
          "mouseover",
          "mouseout",
          "keydown",
          "keyup",
          "submit",
          "change",
          "input",
        ],
        placeholder: "click",
      },
    },
    example: {
      type: "eventListenerAttached",
      selector: "#submit-btn",
      eventType: "click",
    },
  },

  eventDispatchChangesDom: {
    category: "JavaScript",
    title: "Событие изменяет DOM",
    description:
      "Проверяет, что диспатч события изменяет DOM определенным образом",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор элемента",
        placeholder: "button, .trigger",
      },
      eventType: {
        type: "select",
        required: true,
        title: "Тип события",
        options: ["click", "mouseover", "keydown", "submit", "change"],
      },
      expectChange: {
        type: "boolean",
        required: false,
        title: "Ожидается изменение DOM",
        default: true,
      },
      condition: {
        type: "text",
        required: false,
        title: "Условие для проверки (JavaScript)",
        description: "Дополнительное условие для проверки после события",
        placeholder:
          "document.querySelector('.result').textContent.includes('Success')",
      },
    },
    example: {
      type: "eventDispatchChangesDom",
      selector: "#toggle-btn",
      eventType: "click",
      expectChange: true,
      condition: "document.querySelector('.content').style.display === 'block'",
    },
  },

  // Logical Composition Rules
  allOf: {
    category: "Logic",
    title: "Все условия (AND)",
    description: "Проверяет, что ВСЕ вложенные правила выполняются",
    parameters: {
      rules: {
        type: "rules-array",
        required: true,
        title: "Правила для проверки",
        description: "Массив правил, которые должны выполняться одновременно",
      },
    },
    example: {
      type: "allOf",
      rules: [
        { type: "elementExists", selector: "h1" },
        { type: "elementText", selector: "h1", expected: "Welcome" },
      ],
    },
  },

  anyOf: {
    category: "Logic",
    title: "Любое условие (OR)",
    description: "Проверяет, что ХОТЯ БЫ ОДНО из вложенных правил выполняется",
    parameters: {
      rules: {
        type: "rules-array",
        required: true,
        title: "Правила для проверки",
        description: "Массив правил, одно из которых должно выполняться",
      },
    },
    example: {
      type: "anyOf",
      rules: [
        { type: "elementExists", selector: "h1" },
        { type: "elementExists", selector: "h2" },
      ],
    },
  },

  not: {
    category: "Logic",
    title: "Отрицание (NOT)",
    description: "Проверяет, что правило НЕ выполняется",
    parameters: {
      rule: {
        type: "rule",
        required: true,
        title: "Правило для отрицания",
        description: "Правило, которое НЕ должно выполняться",
      },
    },
    example: {
      type: "not",
      rule: { type: "elementExists", selector: ".error" },
    },
  },

  countAtLeast: {
    category: "Logic",
    title: "Минимум N условий",
    description: "Проверяет, что выполняется как минимум N из указанных правил",
    parameters: {
      minimum: {
        type: "number",
        required: true,
        title: "Минимальное количество",
        min: 1,
        placeholder: "2",
      },
      rules: {
        type: "rules-array",
        required: true,
        title: "Правила для проверки",
        description: "Массив правил, из которых минимум N должно выполняться",
      },
    },
    example: {
      type: "countAtLeast",
      minimum: 2,
      rules: [
        { type: "elementExists", selector: "h1" },
        { type: "elementExists", selector: "p" },
        { type: "elementExists", selector: "img" },
      ],
    },
  },
  // Проверка, что элемент реагирует на клик и изменяет DOM
  eventClickChangesDom: {
    category: "JavaScript",
    title: "Элемент на клик изменяет DOM",
    description:
      "Проверяет, что при клике на элемент DOM изменяется определенным образом",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "button, .clickable",
      },
      expectChange: {
        type: "boolean",
        required: false,
        title: "Ожидается изменение DOM",
        default: true,
      },
      condition: {
        type: "text",
        required: false,
        title: "Условие проверки",
        description:
          "JavaScript выражение для проверки изменения DOM после клика",
        placeholder:
          "document.querySelector('.result').textContent === 'Success'",
      },
    },
    example: {
      type: "eventClickChangesDom",
      selector: "#magic-button",
      expectChange: true,
      condition: "document.querySelector('#clickCounter').textContent === '1'",
    },
  },

  // Проверка, что массив содержит определенные значения
  arrayContains: {
    category: "JavaScript",
    title: "Массив содержит значения",
    description:
      "Проверяет, что массив содержит хотя бы одно указанное значение",
    parameters: {
      name: {
        type: "string",
        required: true,
        title: "Имя массива",
        placeholder: "magicMessages, items",
      },
      expected: {
        type: "array",
        required: true,
        title: "Ожидаемые значения",
        description: "Значения, которые должны быть в массиве",
        placeholder: '["one", "two"]',
      },
    },
    example: {
      type: "arrayContains",
      name: "magicMessages",
      expected: ["✨", "💫"],
    },
  },

  // Проверка создания элемента динамически
  elementCreated: {
    category: "HTML",
    title: "Элемент создан динамически",
    description: "Проверяет, что в DOM появился элемент с указанным селектором",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "div.particle, span.effect",
      },
    },
    example: {
      type: "elementCreated",
      selector: ".particle",
    },
  },

  // Проверка добавления CSS класса через JS
  classAdded: {
    category: "JavaScript",
    title: "Класс добавлен элементу",
    description:
      "Проверяет, что JS добавил CSS класс элементу с указанным селектором",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "div, button",
      },
      className: {
        type: "string",
        required: true,
        title: "CSS класс",
        placeholder: "active, highlighted",
      },
    },
    example: {
      type: "classAdded",
      selector: "div.game-container",
      className: "active",
    },
  },

  // Проверка inline стиля элемента
  inlineStyleCheck: {
    category: "CSS",
    title: "Проверка inline стиля элемента",
    description: "Проверяет наличие и значение inline CSS свойства у элемента",
    parameters: {
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: "button, div.box",
      },
      property: {
        type: "string",
        required: true,
        title: "CSS свойство",
        placeholder: "transform, color",
      },
      expected: {
        type: "string",
        required: false,
        title: "Ожидаемое значение",
        placeholder: "scale(1.1), red",
      },
    },
    example: {
      type: "inlineStyleCheck",
      selector: ".magic-button",
      property: "transform",
      expected: "scale(1.1) rotate(2deg)",
    },
  },

  // Проверка количества элементов после действия
  elementCountAfterAction: {
    category: "Logic",
    title: "Количество элементов после действия",
    description:
      "Проверяет, что после определенного действия в DOM есть нужное количество элементов",
    parameters: {
      action: {
        type: "text",
        required: true,
        title: "Действие",
        description: "JS код для выполнения действия (например, клик)",
        placeholder: "document.querySelector('#magic-button').click()",
      },
      selector: {
        type: "string",
        required: true,
        title: "CSS селектор",
        placeholder: ".particle",
      },
      expected: {
        type: "number",
        required: true,
        title: "Ожидаемое количество элементов",
        placeholder: "10",
      },
    },
    example: {
      type: "elementCountAfterAction",
      action: "document.querySelector('#magic-button').click()",
      selector: ".particle",
      expected: 10,
    },
  },
};

module.exports = validationSchema;
