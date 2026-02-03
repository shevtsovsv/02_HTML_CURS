# Пошаговая разработка игры "Калькулятор-квест"

## Шаг 1. Базовая HTML-структура

Создайте базовую HTML структуру с DOCTYPE, тегами html, head и body.

**JSON валидация:**

```json
{
  "type": "html_structure",
  "required_tags": ["!DOCTYPE", "html", "head", "body"],
  "attributes": {
    "html": { "lang": "ru" }
  }
}
```

## Шаг 2. Мета-теги и заголовок

Добавьте в head: meta charset UTF-8, viewport для адаптивности и title "Калькулятор-квест".

**JSON валидация:**

```json
{
  "type": "head_content",
  "required_meta": ["charset", "viewport"],
  "title": "Калькулятор-квест"
}
```

## Шаг 3. Подключение внешних файлов

Подключите файлы style.css и script.js через теги link и script.

**JSON валидация:**

```json
{
  "type": "external_files",
  "required_files": ["style.css", "script.js"],
  "link_rel": "stylesheet",
  "script_defer": true
}
```

## Шаг 4. Основной контейнер игры

Создайте div с классом game-container - это главный контейнер всей игры.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "game-container"
}
```

## Шаг 5. Заголовок игры

Внутри game-container создайте h1 с текстом "🧮 Калькулятор-квест!" и p с классом subtitle.

**JSON валидация:**

```json
{
  "type": "heading",
  "parent": ".game-container",
  "h1": "🧮 Калькулятор-квест!",
  "subtitle_class": "subtitle"
}
```

## Шаг 6. Статистика игрока (контейнер)

Создайте div с классом player-stats для отображения статистики игрока.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "player-stats"
}
```

## Шаг 7. Карточка "Уровень"

В player-stats создайте div.stat-card со span.stat-number (id="levelDisplay") и span.stat-label "Уровень".

**JSON валидация:**

```json
{
  "type": "stat_card",
  "parent": ".player-stats",
  "number_id": "levelDisplay",
  "label": "Уровень"
}
```

## Шаг 8. Карточка "Очки"

Создайте вторую stat-card с id="scoreDisplay" и лейблом "Очки".

**JSON валидация:**

```json
{
  "type": "stat_card",
  "parent": ".player-stats",
  "number_id": "scoreDisplay",
  "label": "Очки"
}
```

## Шаг 9. Карточка "Серия"

Создайте третью stat-card с id="streakDisplay" и лейблом "Серия".

**JSON валидация:**

```json
{
  "type": "stat_card",
  "parent": ".player-stats",
  "number_id": "streakDisplay",
  "label": "Серия"
}
```

## Шаг 10. Карточка "Решено"

Создайте четвертую stat-card с id="totalDisplay" и лейблом "Решено".

**JSON валидация:**

```json
{
  "type": "stat_card",
  "parent": ".player-stats",
  "number_id": "totalDisplay",
  "label": "Решено"
}
```

## Шаг 11. Переключатель режимов

Создайте div.mode-buttons с двумя кнопками: "🎯 Режим квеста" и "🧮 Калькулятор".

**JSON валидация:**

```json
{
  "type": "mode_selector",
  "buttons": [
    {
      "class": "mode-btn active",
      "onclick": "setMode('quest')",
      "text": "🎯 Режим квеста"
    },
    {
      "class": "mode-btn",
      "onclick": "setMode('calculator')",
      "text": "🧮 Калькулятор"
    }
  ]
}
```

## Шаг 12. Селектор сложности

Создайте div.difficulty-selector с заголовком "Сложность:" и тремя кнопками сложности.

**JSON валидация:**

```json
{
  "type": "difficulty_selector",
  "levels": ["easy", "medium", "hard"],
  "labels": ["😊 Легко", "🤔 Средне", "🔥 Сложно"]
}
```

## Шаг 13. Область квеста

Создайте div.quest-area с id="quest-section" для отображения математических задач.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "quest-area",
  "id": "quest-section"
}
```

## Шаг 14. Заголовок квеста

В quest-area добавьте div.quest-title с текстом "🎲 Реши пример:".

**JSON валидация:**

```json
{
  "type": "html_element",
  "parent": ".quest-area",
  "class": "quest-title",
  "text": "🎲 Реши пример:"
}
```

## Шаг 15. Математическая задача

Добавьте div.math-problem с id="mathProblem" для отображения примера.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "math-problem",
  "id": "mathProblem"
}
```

## Шаг 16. Область ввода ответа

Создайте div.input-area с input.answer-input (id="answerInput", placeholder="Твой ответ").

**JSON валидация:**

```json
{
  "type": "input_field",
  "class": "answer-input",
  "id": "answerInput",
  "placeholder": "Твой ответ",
  "type": "number"
}
```

## Шаг 17. Кнопки проверки и новой задачи

Добавьте две кнопки: "✓ Проверить" (onclick="checkAnswer()") и "🎲 Новая задача" (onclick="generateProblem()").

**JSON валидация:**

```json
{
  "type": "button_group",
  "buttons": [
    { "onclick": "checkAnswer()", "text": "✓ Проверить" },
    { "onclick": "generateProblem()", "text": "🎲 Новая задача" }
  ]
}
```

## Шаг 18. Обратная связь

Создайте div.feedback с id="feedback" для отображения результатов проверки.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "feedback",
  "id": "feedback"
}
```

## Шаг 19. Секция калькулятора (контейнер)

Создайте div#calculator-section (style="display: none") для калькулятора.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "id": "calculator-section",
  "style": "display: none"
}
```

## Шаг 20. Обертка калькулятора

В calculator-section создайте div.calculator-section.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "calculator-section",
  "parent": "#calculator-section"
}
```

## Шаг 21. Дисплей калькулятора

Добавьте div.calc-display с id="calcDisplay" и текстом "0".

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "calc-display",
  "id": "calcDisplay",
  "default_value": "0"
}
```

## Шаг 22. Сетка кнопок калькулятора

Создайте div.calc-buttons для размещения кнопок калькулятора.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "calc-buttons"
}
```

## Шаг 23. Кнопки первого ряда (C, ⌫, /, ×)

Добавьте 4 кнопки: C (clearCalc), ⌫ (deleteLast), / и × (операторы).

**JSON валидация:**

```json
{
  "type": "calculator_row",
  "buttons": [
    { "onclick": "clearCalc()", "text": "C" },
    { "onclick": "deleteLast()", "text": "⌫" },
    { "onclick": "appendToCalc('/')", "class": "operator", "text": "/" },
    { "onclick": "appendToCalc('*')", "class": "operator", "text": "×" }
  ]
}
```

## Шаг 24. Кнопки второго ряда (7, 8, 9, -)

Добавьте кнопки цифр 7, 8, 9 и оператор вычитания -.

**JSON валидация:**

```json
{
  "type": "calculator_row",
  "buttons": [
    { "onclick": "appendToCalc('7')", "text": "7" },
    { "onclick": "appendToCalc('8')", "text": "8" },
    { "onclick": "appendToCalc('9')", "text": "9" },
    { "onclick": "appendToCalc('-')", "class": "operator", "text": "-" }
  ]
}
```

## Шаг 25. Кнопки третьего ряда (4, 5, 6, +)

Добавьте кнопки цифр 4, 5, 6 и оператор сложения +.

**JSON валидация:**

```json
{
  "type": "calculator_row",
  "buttons": [
    { "onclick": "appendToCalc('4')", "text": "4" },
    { "onclick": "appendToCalc('5')", "text": "5" },
    { "onclick": "appendToCalc('6')", "text": "6" },
    { "onclick": "appendToCalc('+')", "class": "operator", "text": "+" }
  ]
}
```

## Шаг 26. Кнопки четвертого ряда (1, 2, 3, =)

Добавьте кнопки 1, 2, 3 и кнопку = (calculateResult) с высотой в 2 ряда.

**JSON валидация:**

```json
{
  "type": "calculator_row",
  "buttons": [
    { "onclick": "appendToCalc('1')", "text": "1" },
    { "onclick": "appendToCalc('2')", "text": "2" },
    { "onclick": "appendToCalc('3')", "text": "3" },
    {
      "onclick": "calculateResult()",
      "class": "equals",
      "style": "grid-row: span 2",
      "text": "="
    }
  ]
}
```

## Шаг 27. Кнопки пятого ряда (0, .)

Добавьте кнопку 0 (ширина 2 колонки) и кнопку точки.

**JSON валидация:**

```json
{
  "type": "calculator_row",
  "buttons": [
    {
      "onclick": "appendToCalc('0')",
      "style": "grid-column: span 2",
      "text": "0"
    },
    { "onclick": "appendToCalc('.')", "text": "." }
  ]
}
```

## Шаг 28. Секция достижений

Создайте div.achievements для отображения достижений игрока.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "class": "achievements"
}
```

## Шаг 29. Заголовок достижений

В achievements добавьте h4 "🏆 Достижения:".

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "h4",
  "parent": ".achievements",
  "text": "🏆 Достижения:"
}
```

## Шаг 30. Список достижений

Добавьте div#achievementsList для отображения полученных достижений.

**JSON валидация:**

```json
{
  "type": "html_element",
  "tag": "div",
  "id": "achievementsList",
  "default_text": "Решай примеры, чтобы получить достижения!"
}
```

## Шаг 31. Игровые переменные

Объявите переменные: currentMode, difficulty, currentProblem, level, score, streak, totalSolved, achievements.

**JSON валидация:**

```json
{
  "type": "variables",
  "declarations": [
    { "name": "currentMode", "value": "'quest'" },
    { "name": "difficulty", "value": "'easy'" },
    { "name": "currentProblem", "value": "{}" },
    { "name": "level", "value": "1" },
    { "name": "score", "value": "0" },
    { "name": "streak", "value": "0" },
    { "name": "totalSolved", "value": "0" },
    { "name": "achievements", "value": "[]" }
  ]
}
```

## Шаг 32. Переменные калькулятора

Объявите переменные для калькулятора: calcDisplay и shouldResetDisplay.

**JSON валидация:**

```json
{
  "type": "variables",
  "declarations": [
    { "name": "calcDisplay", "value": "'0'" },
    { "name": "shouldResetDisplay", "value": "false" }
  ]
}
```

## Шаг 33. Настройки сложности

Создайте объект difficultySettings с параметрами для easy, medium и hard.

**JSON валидация:**

```json
{
  "type": "object",
  "name": "difficultySettings",
  "properties": {
    "easy": { "min": 1, "max": 10, "operations": ["+", "-"] },
    "medium": { "min": 1, "max": 50, "operations": ["+", "-", "*"] },
    "hard": { "min": 1, "max": 100, "operations": ["+", "-", "*", "/"] }
  }
}
```

## Шаг 34. Список достижений

Создайте массив achievementsList с объектами достижений (id, name, condition).

**JSON валидация:**

```json
{
  "type": "array",
  "name": "achievementsList",
  "min_items": 3,
  "item_structure": {
    "id": "string",
    "name": "string",
    "condition": "function"
  }
}
```

## Шаг 35. Функция setMode

Создайте функцию setMode(mode) для переключения между режимами квеста и калькулятора.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "setMode",
  "parameters": ["mode"],
  "updates": ["currentMode"],
  "ui_changes": ["#quest-section", "#calculator-section", ".mode-btn"]
}
```

## Шаг 36. Функция setDifficulty

Создайте функцию setDifficulty(level) для установки сложности игры.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "setDifficulty",
  "parameters": ["level"],
  "updates": ["difficulty"],
  "resets": ["level", "score", "streak"],
  "calls": ["generateProblem", "updateStats"]
}
```

## Шаг 37. Функция generateProblem

Создайте функцию generateProblem() для генерации новой математической задачи.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "generateProblem",
  "uses": ["difficultySettings", "Math.random"],
  "updates": ["currentProblem"],
  "dom_updates": ["#mathProblem", "#answerInput", "#feedback"]
}
```

## Шаг 38. Функция checkAnswer

Создайте функцию checkAnswer() для проверки ответа игрока.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "checkAnswer",
  "validates": "answerInput",
  "updates": ["score", "streak", "totalSolved", "level"],
  "calls": ["updateStats", "checkAchievements", "createSparkles"]
}
```

## Шаг 39. Функция updateStats

Создайте функцию updateStats() для обновления отображения статистики.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "updateStats",
  "dom_updates": [
    "#levelDisplay",
    "#scoreDisplay",
    "#streakDisplay",
    "#totalDisplay"
  ]
}
```

## Шаг 40. Функция checkAchievements

Создайте функцию checkAchievements() для проверки и разблокировки достижений.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "checkAchievements",
  "iterates": "achievementsList",
  "updates": ["achievements"],
  "calls": ["updateAchievements"]
}
```

## Шаг 41. Функция updateAchievements

Создайте функцию updateAchievements() для обновления списка достижений в UI.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "updateAchievements",
  "dom_updates": ["#achievementsList"],
  "uses": ["achievementsList", "achievements"]
}
```

## Шаг 42. Функция createSparkles

Создайте функцию createSparkles() для визуальных эффектов при правильном ответе.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "createSparkles",
  "creates": "DOM elements",
  "uses": ["Math.random", "setTimeout"]
}
```

## Шаг 43. Функция handleKeyPress

Создайте функцию handleKeyPress(event) для обработки нажатия Enter.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "handleKeyPress",
  "parameters": ["event"],
  "checks": "event.key === 'Enter'",
  "calls": ["checkAnswer"]
}
```

## Шаг 44. Функция appendToCalc

Создайте функцию appendToCalc(value) для добавления символов в калькулятор.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "appendToCalc",
  "parameters": ["value"],
  "updates": ["calcDisplay"],
  "calls": ["updateCalcDisplay"]
}
```

## Шаг 45. Функция clearCalc

Создайте функцию clearCalc() для очистки дисплея калькулятора.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "clearCalc",
  "sets": "calcDisplay = '0'",
  "calls": ["updateCalcDisplay"]
}
```

## Шаг 46. Функция deleteLast

Создайте функцию deleteLast() для удаления последнего символа в калькуляторе.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "deleteLast",
  "modifies": "calcDisplay",
  "uses": "slice",
  "calls": ["updateCalcDisplay"]
}
```

## Шаг 47. Функция calculateResult

Создайте функцию calculateResult() для вычисления результата в калькуляторе.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "calculateResult",
  "uses": "eval",
  "handles": "try-catch",
  "updates": ["calcDisplay", "shouldResetDisplay"],
  "calls": ["updateCalcDisplay"]
}
```

## Шаг 48. Функция updateCalcDisplay

Создайте функцию updateCalcDisplay() для обновления дисплея калькулятора.

**JSON валидация:**

```json
{
  "type": "function",
  "name": "updateCalcDisplay",
  "dom_updates": ["#calcDisplay"],
  "uses": ["calcDisplay"]
}
```

## Шаг 49. Добавление CSS переменных

В style.css добавьте CSS-переменные для цветов и размеров.

**JSON валидация:**

```json
{
  "type": "css_variables",
  "location": ":root",
  "variables": {
    "primary-color": "#667eea",
    "secondary-color": "#764ba2",
    "success-color": "#00b894",
    "danger-color": "#e17055"
  }
}
```

## Шаг 50. Стилизация game-container

Стилизуйте .game-container: центрирование, фон, тень, скругление.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".game-container",
  "properties": [
    "background",
    "border-radius",
    "padding",
    "box-shadow",
    "max-width"
  ]
}
```

## Шаг 51. Стилизация заголовка

Стилизуйте h1 и .subtitle.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selectors": ["h1", ".subtitle"],
  "properties": ["font-size", "color", "margin", "text-shadow"]
}
```

## Шаг 52. Grid для статистики

Стилизуйте .player-stats с grid-layout.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".player-stats",
  "display": "grid",
  "grid-template-columns": "repeat(4, 1fr)"
}
```

## Шаг 53. Стилизация stat-card

Стилизуйте .stat-card с градиентом и рамкой.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".stat-card",
  "properties": ["background", "padding", "border-radius", "border", "color"]
}
```

## Шаг 54. Стилизация кнопок режимов

Стилизуйте .mode-btn с градиентом и эффектами hover.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".mode-btn",
  "includes_hover": true,
  "includes_active": true
}
```

## Шаг 55. Стилизация quest-area

Стилизуйте .quest-area с градиентным фоном и рамкой.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".quest-area",
  "properties": ["background", "padding", "border-radius", "border"]
}
```

## Шаг 56. Стилизация калькулятора

Стилизуйте .calculator-section и .calc-display.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selectors": [".calculator-section", ".calc-display"],
  "calc-display": {
    "background": "dark",
    "font-family": "monospace"
  }
}
```

## Шаг 57. Grid для кнопок калькулятора

Стилизуйте .calc-buttons с grid-layout 4 колонки.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".calc-buttons",
  "display": "grid",
  "grid-template-columns": "repeat(4, 1fr)"
}
```

## Шаг 58. Стилизация кнопок калькулятора

Стилизуйте .calc-btn с градиентом и hover-эффектами.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selector": ".calc-btn",
  "includes_hover": true,
  "variants": [".operator", ".equals"]
}
```

## Шаг 59. Стилизация достижений

Стилизуйте .achievements и .achievement.

**JSON валидация:**

```json
{
  "type": "css_rule",
  "selectors": [".achievements", ".achievement"],
  "achievement": {
    "display": "inline-block",
    "padding": "5px 12px"
  }
}
```

## Шаг 60. Анимация sparkles

Добавьте CSS анимацию @keyframes sparkle-anim для эффектов.

**JSON валидация:**

```json
{
  "type": "css_animation",
  "name": "sparkle-anim",
  "keyframes": {
    "0%": { "opacity": 1, "transform": "scale(0)" },
    "100%": { "opacity": 0, "transform": "scale(2)" }
  }
}
```

## Шаг 61. Инициализация при загрузке

Добавьте DOMContentLoaded event listener для инициализации игры.

**JSON валидация:**

```json
{
  "type": "event_listener",
  "event": "DOMContentLoaded",
  "calls": ["generateProblem", "updateStats", "updateAchievements"]
}
```

## Шаг 62. Обработчик Enter для input

Добавьте onkeypress="handleKeyPress(event)" к полю ввода ответа.

**JSON валидация:**

```json
{
  "type": "event_attribute",
  "element": "#answerInput",
  "event": "onkeypress",
  "handler": "handleKeyPress(event)"
}
```

## Шаг 63. Responsive дизайн

Добавьте media queries для адаптивности на мобильных устройствах.

**JSON валидация:**

```json
{
  "type": "media_query",
  "breakpoint": "768px",
  "changes": {
    ".player-stats": "grid-template-columns: repeat(2, 1fr)",
    ".calc-buttons": "gap: 5px"
  }
}
```

## Шаг 64. Оптимизация производительности

Добавьте debounce для функций, вызываемых часто.

**JSON валидация:**

```json
{
  "type": "optimization",
  "technique": "debounce",
  "applies_to": ["generateProblem", "checkAnswer"]
}
```

## Шаг 65. Сохранение прогресса

Добавьте функционал сохранения прогресса в localStorage.

**JSON валидация:**

```json
{
  "type": "feature",
  "name": "saveProgress",
  "uses": "localStorage",
  "saves": ["level", "score", "totalSolved", "achievements"]
}
```
