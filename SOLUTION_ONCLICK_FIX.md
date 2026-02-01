# Решение проблемы "showMagic is not defined"

## Проблема

При использовании `onclick="showMagic()"` в HTML возникала ошибка:
```
Uncaught ReferenceError: showMagic is not defined
    at HTMLButtonElement.onclick
```

## Причина

**JavaScript выполнялся многократно**, создавая конфликты:

1. **Первое выполнение**: Код из редактора JS встраивался как `<script>` тег в body через [validationController.js](../server/controllers/validationController.js#L44)

2. **Повторные выполнения**: Метод `executeJavaScript()` вызывался при каждой проверке валидации, добавляя новые `<script>` теги в head

Это приводило к:
- Ошибкам "Identifier 'clickCount' has already been declared" (для `let`/`const`)
- Потере доступа к функциям для `onclick`
- Переопределению переменных

## Решение

### 1. Предотвращение повторного выполнения JS

**Файл**: [validationRules.js](../server/lib/validationRules.js)

Добавлен флаг `jsExecuted` для предотвращения повторного выполнения:

```javascript
class ValidationRules {
  constructor(dom, document, html, css, js) {
    // ...
    this.jsExecuted = false; // Новый флаг
    this.setupInterception();
  }

  executeJavaScript() {
    // JavaScript уже выполнен через встроенный <script> тег
    // Не нужно выполнять повторно
    if (this.jsExecuted || !this.js) return;
    
    this.jsExecuted = true;
    // Скрипт уже встроен в DOM при создании fullHTML
  }
}
```

### 2. Встраивание JS в DOM один раз

**Файл**: [validationController.js](../server/controllers/validationController.js)

JavaScript добавляется **один раз** при создании fullHTML:

```javascript
if (html && html.trim().toLowerCase().startsWith("<!doctype")) {
  fullHTML = html;
  if (css) {
    fullHTML = fullHTML.replace(/<\/head>/i, `<style>${css}</style></head>`);
  }
  if (js) {
    // Добавляем JS один раз в конец body
    fullHTML = fullHTML.replace(/<\/body>/i, `<script>${js}</script></body>`);
  }
}
```

### 3. Поддержка let/const в валидации

**Файл**: [validationRulesCustom.js](../server/lib/validationRulesCustom.js)

Валидация теперь проверяет переменные и функции как в `window`, так и через `eval`:

```javascript
variableExists(rule) {
  this.executeJavaScript();
  
  // Проверка в window (для var и window.переменная)
  if (rule.name in this.window) {
    return null;
  }
  
  // Проверка через eval (для let/const)
  try {
    const result = this.window.eval(`typeof ${rule.name} !== 'undefined'`);
    if (result) {
      return null;
    }
  } catch (e) {}
  
  return `Глобальная переменная '${rule.name}' не определена.`;
}
```

## Как работает сейчас

### ✅ Правильный код в редакторе JS:

```javascript
let clickCount = 0;
const magicMessages = [
  "✨ Магия случилась!",
  "🎉 Вау! Это невероятно!",
  "🌟 Волшебство работает!",
  "🎊 Удивительно!"
];

function showMagic() {
  const randomIndex = Math.floor(Math.random() * magicMessages.length);
  const randomMessage = magicMessages[randomIndex];
  alert(randomMessage);
}
```

### ✅ HTML с onclick:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Волшебная кнопка</title>
</head>
<body>
  <div>
    <h1>Волшебная кнопка</h1>
    <p>Нажми на кнопку и увидишь магию!</p>
    <button class="magic-button" onclick="showMagic()">✨ Магия! ✨</button>
  </div>
</body>
</html>
```

### Как это объединяется:

1. **validationController** создаёт fullHTML, встраивая CSS в `<head>` и JS в конец `<body>`
2. **JSDOM** создаёт виртуальный DOM с опцией `runScripts: "dangerously"`
3. **JavaScript выполняется один раз** автоматически при загрузке
4. **Функция `showMagic`** становится доступной глобально (function declarations автоматически попадают в window)
5. **onclick работает** потому что функция доступна в глобальном scope

## Важные детали

### Почему `function` работает с onclick, а `const fn = () => {}` может не работать?

```javascript
// ✅ Работает с onclick
function showMagic() { ... }
// function declarations автоматически добавляются в window

// ⚠️ Может не работать с onclick (зависит от контекста)
const showMagic = () => { ... };
// const не добавляется в window, остаётся в блочном scope
```

**Рекомендация**: Используйте обычные `function` declarations для функций, которые нужны для `onclick`.

### Переменные let/const

```javascript
// ❌ НЕ доступна через window.magicMessages
const magicMessages = [...];

// ✅ НО доступна в том же scope, где объявлена функция
function showMagic() {
  // magicMessages доступна здесь!
  const msg = magicMessages[0];
}
```

## Тестирование

Запустите тесты для проверки:

```bash
# Полный тест валидации
node test/test-magic-button-validation.js

# Тест onclick
node test/test-onclick-fix.js
```

Ожидаемый результат:
```
✅ Функция showMagic доступна глобально через window
✅ onclick должен работать
```

## Резюме изменений

| Файл | Изменение | Цель |
|------|-----------|------|
| [validationRules.js](../server/lib/validationRules.js#L17) | Добавлен флаг `jsExecuted` | Предотвращение повторного выполнения JS |
| [validationRules.js](../server/lib/validationRules.js#L71-L78) | Переработан `executeJavaScript()` | JS не добавляется повторно в DOM |
| [validationController.js](../server/controllers/validationController.js#L44) | JS встраивается в `<script>` тег | Одноразовое выполнение при загрузке DOM |
| [validationRulesCustom.js](../server/lib/validationRulesCustom.js) | Проверка через eval для let/const | Поддержка современного синтаксиса |

Теперь `onclick` работает корректно! 🎉
