# Шаг 1

## Добавьте базовую HTML структуру: DOCTYPE, html, head, body

```json
[
  {
    "type": "hasDoctype",
    "expected": "html"
  },
  {
    "type": "elementExists",
    "selector": "html"
  },
  {
    "type": "elementExists",
    "selector": "head"
  },
  {
    "type": "elementExists",
    "selector": "body"
  }
]
```

# Шаг 2

## Добавьте в head: meta charset UTF-8, viewport и title "Генератор комплиментов"

```json
[
  {
    "type": "elementExists",
    "selector": "title"
  },
  {
    "type": "elementText",
    "expected": "Генератор комплиментов",
    "selector": "title"
  },
  {
    "type": "elementExists",
    "selector": "meta[charset=\"UTF-8\"]"
  },
  {
    "type": "elementExists",
    "selector": "meta[name=\"viewport\"]"
  }
]
```

# Шаг 3

## Создайте в body: div.game-container, h1 "😊 Генератор комплиментов 😊", p "Создай хорошее настроение себе и друзьям!"

```json
[
  {
    "type": "elementExists",
    "selector": "div.game-container"
  },
  {
    "type": "elementExists",
    "selector": "h1"
  },
  {
    "type": "elementText",
    "expected": "😊 Генератор комплиментов 😊",
    "selector": "h1"
  },
  {
    "type": "elementExists",
    "selector": "p"
  },
  {
    "type": "elementText",
    "expected": "Создай хорошее настроение себе и друзьям!",
    "selector": "p"
  }
]
```

<!-- Шаги создания CSS стиля -->

# Шаг 4

## Добавьте style тег и CSS для body: font-family, розовый градиентный фон (135deg, #ff9a9e, #fecfef), margin 0, padding 0

```json
[
  {
    "type": "cssPropertyCheck",
    "property": "font-family",
    "selector": "body"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "0",
    "property": "margin",
    "selector": "body"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "0",
    "property": "padding",
    "selector": "body"
  },
  {
    "type": "cssPropertyCheck",
    "property": "background",
    "selector": "body"
  }
]
```

# Шаг 5

## Добавьте к body: min-height 100vh, display flex, align-items center, justify-content center, color #333

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "100vh",
    "property": "min-height",
    "selector": "body"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "flex",
    "property": "display",
    "selector": "body"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "center",
    "property": "align-items",
    "selector": "body"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "center",
    "property": "justify-content",
    "selector": "body"
  }
]
```

# Шаг 6

## Стилизуйте .game-container: text-align center, background rgba(255,255,255,0.9), border-radius 25px, padding 20px

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "center",
    "property": "text-align",
    "selector": ".game-container"
  },
  {
    "type": "cssPropertyCheck",
    "property": "background",
    "selector": ".game-container"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "25px",
    "property": "border-radius",
    "selector": ".game-container"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "20px",
    "property": "padding",
    "selector": ".game-container"
  }
]
```

# Шаг 7

## Стилизуйте h1: font-size 2rem, color #e91e63, margin-bottom 5px

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "2rem",
    "property": "font-size",
    "selector": "h1"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "#e91e63",
    "property": "color",
    "selector": "h1"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "5px",
    "property": "margin-bottom",
    "selector": "h1"
  }
]
```

# Шаг 8

## Добавьте класс subtitle к p и CSS: font-size 1rem, margin-bottom 15px, color #666

```json
[
  {
    "type": "elementExists",
    "selector": "p.subtitle"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1rem",
    "property": "font-size",
    "selector": ".subtitle"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "margin-bottom",
    "selector": ".subtitle"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "#666",
    "property": "color",
    "selector": ".subtitle"
  }
]
```

# Шаг 9

## Создайте div.input-section с текстом "Как тебя зовут?", input#nameInput и button "✨ Сохранить имя"

```json
[
  {
    "type": "elementExists",
    "selector": ".input-section"
  },
  {
    "type": "elementExists",
    "selector": "#nameInput"
  },
  {
    "type": "elementExists",
    "selector": "button"
  }
]
```

# Шаг 10

## Стилизуйте .input-section: margin-top 15px, padding 15px, background rgba(255,255,255,0.7), border-radius 15px

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "margin-top",
    "selector": ".input-section"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "padding",
    "selector": ".input-section"
  },
  {
    "type": "cssPropertyCheck",
    "property": "background",
    "selector": ".input-section"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "border-radius",
    "selector": ".input-section"
  }
]
```

# Шаг 11

## Стилизуйте .name-input: padding 10px 15px, font-size 1rem, border 2px solid #ddd, border-radius 25px, text-align center

```json
[
  {
    "type": "styleRuleExists",
    "selector": ".name-input"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "10px 15px",
    "property": "padding",
    "selector": ".name-input"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1rem",
    "property": "font-size",
    "selector": ".name-input"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "25px",
    "property": "border-radius",
    "selector": ".name-input"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "center",
    "property": "text-align",
    "selector": ".name-input"
  }
]
```

# Шаг 12

## Добавьте к input атрибуты: placeholder="Твоё имя", class="name-input"

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": "#nameInput",
    "attribute": "placeholder",
    "expected": "Твоё имя"
  },
  {
    "type": "elementAttributeCheck",
    "selector": "#nameInput",
    "attribute": "class",
    "expected": "name-input"
  }
]
```

# Шаг 13

## Создайте button.compliment-button с текстом "🎁 Получить комплимент!"

```json
[
  {
    "type": "elementExists",
    "selector": ".compliment-button"
  },
  {
    "type": "elementText",
    "expected": "🎁 Получить комплимент!",
    "selector": ".compliment-button"
  }
]
```

# Шаг 14

## Стилизуйте .compliment-button: градиент (135deg, #ff6b6b, #ee5a24), color white, padding 15px 30px, font-size 1.1rem, border-radius 50px

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "linear-gradient(135deg, #ff6b6b, #ee5a24)",
    "property": "background",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "white",
    "property": "color",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px 30px",
    "property": "padding",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1.1rem",
    "property": "font-size",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "50px",
    "property": "border-radius",
    "selector": ".compliment-button"
  }
]
```

# Шаг 15

## Добавьте к .compliment-button: border none, cursor pointer, margin 15px 10px, font-weight bold

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "none",
    "property": "border",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "pointer",
    "property": "cursor",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px 10px",
    "property": "margin",
    "selector": ".compliment-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "bold",
    "property": "font-weight",
    "selector": ".compliment-button"
  }
]
```

# Шаг 16

## Добавьте эффект :hover для .compliment-button: transform scale(1.05) translateY(-2px)

```json
[
  {
    "type": "styleRuleExists",
    "selector": ".compliment-button:hover"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "scale(1.05) translateY(-2px)",
    "property": "transform",
    "selector": ".compliment-button:hover"
  }
]
```

# Шаг 17

## Создайте div#complimentDisplay с текстом "Нажми на кнопку, чтобы получить свой первый комплимент! 🌈"

```json
[
  {
    "type": "elementExists",
    "selector": "#complimentDisplay"
  },
  {
    "type": "elementText",
    "expected": "Нажми на кнопку, чтобы получить свой первый комплимент! 🌈",
    "selector": "#complimentDisplay"
  }
]
```

# Шаг 18

## Стилизуйте .compliment-display: желтый градиент (135deg, #ffeaa7, #fdcb6e), padding 20px, border-radius 20px, border 3px solid #e17055

```json
[
  {
    "type": "styleRuleExists",
    "selector": ".compliment-display"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "linear-gradient(135deg, #ffeaa7, #fdcb6e)",
    "property": "background",
    "selector": ".compliment-display"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "20px",
    "property": "padding",
    "selector": ".compliment-display"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "20px",
    "property": "border-radius",
    "selector": ".compliment-display"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "3px solid #e17055",
    "property": "border",
    "selector": ".compliment-display"
  }
]
```

# Шаг 19

## Добавьте class="compliment-display" к div#complimentDisplay

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": "#complimentDisplay",
    "attribute": "class",
    "expected": "compliment-display"
  }
]
```

<!-- Шаги создания JS кода -->

# Шаг 20

## Создайте переменные: currentCategory = "general", userName = "", currentCompliment = ""

```json
[
  { "type": "variableExists", "name": "currentCategory" },
  { "type": "variableExists", "name": "userName" },
  { "type": "variableExists", "name": "currentCompliment" }
]
```

# Шаг 21

## Создайте объект compliments с массивом general, содержащим минимум 4 комплимента

```json
[
  { "type": "variableExists", "name": "compliments" },
  { "type": "arrayLengthCheck", "array": "compliments.general", "expected": 4 }
]
```

# Шаг 22

## Создайте функцию setName для сохранения имени пользователя из input#nameInput

```json
[
  { "type": "functionExists", "name": "setName" },
  {
    "type": "functionBodyIncludes",
    "function": "setName",
    "expected": "document.getElementById('nameInput')"
  }
]
```

# Шаг 23

## Добавьте в setName: получите значение из input, сохраните в userName, покажите alert с приветствием

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "setName",
    "expected": "userName ="
  },
  {
    "type": "functionBodyIncludes",
    "function": "setName",
    "expected": "alert"
  }
]
```

# Шаг 24

## Добавьте onclick="setName()" к кнопке сохранения имени

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": ".input-section button",
    "attribute": "onclick",
    "expected": "setName()"
  }
]
```

# Шаг 25

## Создайте функцию generateCompliment для получения случайного комплимента из массива

```json
[
  { "type": "functionExists", "name": "generateCompliment" },
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "Math.random()"
  }
]
```

# Шаг 26

## В generateCompliment: выберите случайный комплимент из compliments[currentCategory]

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "compliments[currentCategory]"
  },
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "Math.floor(Math.random()"
  }
]
```

# Шаг 27

## В generateCompliment: если userName не пустое, добавьте имя к комплименту

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "if (userName)"
  }
]
```

# Шаг 28

## Выведите комплимент в #complimentDisplay через innerHTML

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "document.getElementById('complimentDisplay').textContent"
  }
]
```

# Шаг 29

## Добавьте onclick="generateCompliment()" к кнопке получения комплимента

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": ".compliment-button",
    "attribute": "onclick",
    "expected": "generateCompliment()"
  }
]
```

# Шаг 30

## Создайте переменные для статистики: totalCount = 0, categoryCount = 0

```json
[
  { "type": "variableExists", "name": "totalCount" },
  { "type": "variableExists", "name": "categoryCount" },
  {
    "type": "variableValueCheck",
    "name": "totalCount",
    "expected": 0
  },
  {
    "type": "variableValueCheck",
    "name": "categoryCount",
    "expected": 0
  }
]
```

# Шаг 31

## В generateCompliment: увеличьте totalCount и categoryCount на 1

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "totalCount++"
  },
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "categoryCount++"
  }
]
```

# Шаг 32

## Создайте div.stats с двумя div.stat-card внутри

```json
[
  { "type": "elementExists", "selector": ".stats" },
  { "type": "elementExists", "selector": ".stat-card" }
]
```

# Шаг 33

## В первой stat-card создайте div#totalCount со значением "0" и label "Всего комплиментов"

```json
[
  { "type": "elementExists", "selector": "#totalCount" },
  {
    "type": "elementText",
    "expected": "0",
    "selector": "#totalCount"
  }
]
```

# Шаг 34

## Во второй stat-card создайте div#categoryCount со значением "0" и label "В этой категории"

```json
[
  { "type": "elementExists", "selector": "#categoryCount" },
  {
    "type": "elementText",
    "expected": "0",
    "selector": "#categoryCount"
  }
]
```

# Шаг 35

## Создайте функцию updateStats для обновления отображения счётчиков

```json
[
  { "type": "functionExists", "name": "updateStats" },
  {
    "type": "functionBodyIncludes",
    "function": "updateStats",
    "expected": "document.getElementById('totalCount')"
  },
  {
    "type": "functionBodyIncludes",
    "function": "updateStats",
    "expected": "document.getElementById('categoryCount')"
  }
]
```

# Шаг 36

## Вызовите updateStats() в конце функции generateCompliment

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "updateStats()"
  }
]
```

# Шаг 37

## Добавьте в объект compliments массивы: smart, creative, kind (по 4 комплимента в каждом)

```json
[
  { "type": "arrayLengthCheck", "array": "compliments.smart", "expected": 4 },
  {
    "type": "arrayLengthCheck",
    "array": "compliments.creative",
    "expected": 4
  },
  { "type": "arrayLengthCheck", "array": "compliments.kind", "expected": 4 }
]
```

# Шаг 38

## Создайте 4 кнопки .category-button для выбора категорий: general, smart, creative, kind

```json
[{ "type": "elementExists", "selector": ".category-button" }]
```

# Шаг 39

## Добавьте первой кнопке категории класс active

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": ".category-button:first-child",
    "attribute": "class",
    "expected": "category-button active"
  }
]
```

# Шаг 40

## Создайте функцию setCategory(category) для смены активной категории

```json
[
  { "type": "functionExists", "name": "setCategory" },
  {
    "type": "functionBodyIncludes",
    "function": "setCategory",
    "expected": "currentCategory ="
  }
]
```

# Шаг 41

## В setCategory: удалите класс active у всех кнопок и добавьте к выбранной

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "setCategory",
    "expected": "classList.remove('active')"
  },
  {
    "type": "functionBodyIncludes",
    "function": "setCategory",
    "expected": "classList.add('active')"
  }
]
```

# Шаг 42

## В setCategory: сбросьте categoryCount на 0 и вызовите updateStats()

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "setCategory",
    "expected": "categoryCount = 0"
  },
  {
    "type": "functionBodyIncludes",
    "function": "setCategory",
    "expected": "updateStats()"
  }
]
```

# Шаг 43

## Добавьте onclick="setCategory('general')" к первой кнопке категории

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": "#btn-general",
    "attribute": "onclick",
    "expected": "setCategory('general')"
  }
]
```

# Шаг 44

## Создайте переменную favorites = [] для хранения избранных комплиментов

```json
[
  { "type": "variableExists", "name": "favorites" },
  { "type": "arrayLengthCheck", "array": "favorites", "expected": 0 }
]
```

# Шаг 45

## Создайте div.favorites с заголовком "❤️ Твои любимые комплименты:" и div#favoritesList

```json
[
  { "type": "elementExists", "selector": ".favorites" },
  { "type": "elementExists", "selector": "#favoritesList" }
]
```

# Шаг 46

## Создайте функцию addToFavorites для добавления текущего комплимента в избранное

```json
[
  { "type": "functionExists", "name": "addToFavorites" },
  {
    "type": "functionBodyIncludes",
    "function": "addToFavorites",
    "expected": "currentCompliment"
  },
  {
    "type": "functionBodyIncludes",
    "function": "addToFavorites",
    "expected": "favorites.push"
  }
]
```

# Шаг 47

## В addToFavorites: проверьте, есть ли уже такой комплимент в favorites

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "addToFavorites",
    "expected": "favorites.includes"
  }
]
```

# Шаг 48

## Создайте функцию updateFavoritesList для отображения списка избранных комплиментов

```json
[
  { "type": "functionExists", "name": "updateFavoritesList" },
  {
    "type": "functionBodyIncludes",
    "function": "updateFavoritesList",
    "expected": "document.getElementById('favoritesList')"
  }
]
```

# Шаг 49

## В updateFavoritesList: используйте map() для создания HTML из массива favorites

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "updateFavoritesList",
    "expected": ".map("
  }
]
```

# Шаг 50

## Создайте кнопку "⭐ Добавить в избранное" с onclick="addToFavorites()"

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": "button[onclick='addToFavorites()']",
    "attribute": "onclick",
    "expected": "addToFavorites()"
  }
]
```

# Шаг 51

## Создайте функцию showSpecialEffects для показа сообщений при достижениях

```json
[
  { "type": "functionExists", "name": "showSpecialEffects" },
  {
    "type": "functionBodyIncludes",
    "function": "showSpecialEffects",
    "expected": "if (totalCount ==="
  }
]
```

# Шаг 52

## В showSpecialEffects: добавьте alert для 1, 10, 25 комплиментов

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "showSpecialEffects",
    "expected": "totalCount === 1"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showSpecialEffects",
    "expected": "totalCount === 10"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showSpecialEffects",
    "expected": "totalCount === 25"
  }
]
```

# Шаг 53

## Вызовите showSpecialEffects() в конце функции generateCompliment

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "generateCompliment",
    "expected": "showSpecialEffects()"
  }
]
```

# Шаг 54

## Создайте функцию resetStats для сброса всей статистики и избранного

```json
[
  { "type": "functionExists", "name": "resetStats" },
  {
    "type": "functionBodyIncludes",
    "function": "resetStats",
    "expected": "confirm("
  }
]
```

# Шаг 55

## В resetStats: обнулите все счётчики и очистите массив favorites

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "resetStats",
    "expected": "totalCount = 0"
  },
  {
    "type": "functionBodyIncludes",
    "function": "resetStats",
    "expected": "categoryCount = 0"
  },
  {
    "type": "functionBodyIncludes",
    "function": "resetStats",
    "expected": "favorites = []"
  }
]
```

# Шаг 56

## Создайте кнопку "🔄 Сбросить статистику" с onclick="resetStats()"

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": "button[onclick='resetStats()']",
    "attribute": "onclick",
    "expected": "resetStats()"
  }
]
```

# Шаг 57

## Создайте функцию handleKeyPress(event) для обработки Enter в поле ввода

```json
[
  { "type": "functionExists", "name": "handleKeyPress" },
  {
    "type": "functionBodyIncludes",
    "function": "handleKeyPress",
    "expected": "event.key === 'Enter'"
  }
]
```

# Шаг 58

## Добавьте onkeypress="handleKeyPress(event)" к input#nameInput

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": "#nameInput",
    "attribute": "onkeypress",
    "expected": "handleKeyPress(event)"
  }
]
```

# Шаг 59

## Стилизуйте .stats: display grid, grid-template-columns 1fr 1fr, gap 15px

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "grid",
    "property": "display",
    "selector": ".stats"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1fr 1fr",
    "property": "grid-template-columns",
    "selector": ".stats"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "gap",
    "selector": ".stats"
  }
]
```

# Шаг 60

## Стилизуйте .stat-card: background rgba(255,255,255,0.7), padding 15px, border-radius 15px, border 2px solid #ddd

```json
[
  {
    "type": "cssPropertyCheck",
    "property": "background",
    "selector": ".stat-card"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "padding",
    "selector": ".stat-card"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "15px",
    "property": "border-radius",
    "selector": ".stat-card"
  }
]
```
