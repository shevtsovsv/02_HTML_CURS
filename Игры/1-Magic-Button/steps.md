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

## Добавьте в head: meta charset UTF-8, viewport и title "Волшебная кнопка"

```json
[
  {
    "type": "elementExists",
    "selector": "title"
  },
  {
    "type": "elementText",
    "expected": "Волшебная кнопка",
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

## Создайте в body: div, h1 "Волшебная кнопка", p "Нажми на кнопку и увидишь магию!", button "✨ Магия! ✨"

```json
[
  {
    "type": "elementExists",
    "selector": "div"
  },
  {
    "type": "elementExists",
    "selector": "h1"
  },
  {
    "type": "elementText",
    "expected": "Волшебная кнопка",
    "selector": "h1"
  },
  {
    "type": "elementExists",
    "selector": "p"
  },
  {
    "type": "elementText",
    "expected": "Нажми на кнопку и увидишь магию!",
    "selector": "p"
  },
  {
    "type": "elementExists",
    "selector": "button"
  },
  {
    "type": "elementText",
    "expected": "✨ Магия! ✨",
    "selector": "button"
  }
]
```

<!-- Шаги создания CSS стиля -->

# Шаг 4

## Добавьте style тег и CSS для body: font-family, градиентный фон, margin 0, padding 0

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "Arial, sans-serif",
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

## Добавьте к body: min-height 100vh, display flex, align-items center, justify-content center, color white

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
  },
  {
    "type": "cssPropertyCheck",
    "expected": "white",
    "property": "color",
    "selector": "body"
  }
]
```

# Шаг 6

## Добавьте класс game-container к div и CSS: text-align center

```json
[
  {
    "type": "elementExists",
    "selector": "div.game-container"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "center",
    "property": "text-align",
    "selector": ".game-container"
  }
]
```

# Шаг 7

## Стилизуйте h1: font-size 2.5rem, margin-bottom 10px

```json
[
  {
    "type": "elementExists",
    "selector": "h1"
  },
  {
    "type": "styleRuleExists",
    "selector": "h1"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "2.5rem",
    "property": "font-size",
    "selector": "h1"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "10px",
    "property": "margin-bottom",
    "selector": "h1"
  }
]
```

# Шаг 8

## Добавьте класс subtitle к p и CSS: font-size 1.2rem, opacity 0.9

```json
[
  {
    "type": "elementExists",
    "selector": "p.subtitle"
  },
  {
    "type": "styleRuleExists",
    "selector": ".subtitle"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1.2rem",
    "property": "font-size",
    "selector": ".subtitle"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "0.9",
    "property": "opacity",
    "selector": ".subtitle"
  }
]
```

# Шаг 9

## Добавьте класс magic-button к button

```json
[
  {
    "type": "elementExists",
    "selector": "button.magic-button"
  }
]
```

# Шаг 10

## Стилизуйте кнопку:

- линейный градиент с парамертами 135deg, #ff6b6b, #ffa500
  -белый цвет для текста,
- внутренние отступы 20px сверху и снизу и 40px слева и справа,
- невидимая рамка с радиусом 50px
- жирный шрифт размером 1.5rem

```json
[
  {
    "type": "styleRuleExists",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "linear-gradient(135deg, #ff6b6b, #ffa500)",
    "property": "background",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "white",
    "property": "color",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "20px 40px",
    "property": "padding",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "50px",
    "property": "border-radius",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "bold",
    "property": "font-weight",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1.5rem",
    "property": "font-size",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyExists",
    "property": "border",
    "selector": ".magic-button"
  }
]
```

# Шаг 11

## Добавьте дополнительные стили к кнопке:

- отступы со всех сторон 20px
- тень с параметрами: 0 10px 25px rgba(255, 107, 107, 0.4)
- плавный переход всех изменений за 0.3 секунды
- текст заглавными буквами
- расстояние между буквами 1px

```json
[
  {
    "type": "cssPropertyCheck",
    "expected": "20px",
    "property": "margin",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "0 10px 25px rgba(255, 107, 107, 0.4)",
    "property": "box-shadow",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "all 0.3s ease",
    "property": "transition",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "uppercase",
    "property": "text-transform",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "1px",
    "property": "letter-spacing",
    "selector": ".magic-button"
  }
]
```

# Шаг 12

## Добавьте эффект при наведении курсора на кнопку:

- добавьте указатель мыши при наведении
- увеличьте размер кнопки в 1.1 раза и поверните на 2 градуса (transform: scale(1.1) rotate(2deg))
- усильте тень: 0 15px 35px rgba(255, 107, 107, 0.6)
- измените градиент фона на более яркий: linear-gradient(135deg, #ff5252, #ff8f00)

```json
[
  {
    "type": "styleRuleExists",
    "selector": ".magic-button:hover"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "pointer",
    "property": "cursor",
    "selector": ".magic-button"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "scale(1.1) rotate(2deg)",
    "property": "transform",
    "selector": ".magic-button:hover"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "0 15px 35px rgba(255, 107, 107, 0.6)",
    "property": "box-shadow",
    "selector": ".magic-button:hover"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "linear-gradient(135deg, #ff5252, #ff8f00)",
    "property": "background",
    "selector": ".magic-button:hover"
  }
]
```

# Шаг 13

## Добавьте эффект при нажатии на кнопку:

- уменьшите размер кнопки до 95% и поверните на -1 градус (transform: scale(0.95) rotate(-1deg))

```json
[
  {
    "type": "styleRuleExists",
    "selector": ".magic-button:active"
  },
  {
    "type": "cssPropertyCheck",
    "expected": "scale(0.95) rotate(-1deg)",
    "property": "transform",
    "selector": ".magic-button:active"
  }
]
```

<!-- Шаги создания JS кода -->

# Шаг 14

## Создайте переменную clickCount со значением 0

````json
[
  {
    "type": "variableExists",
    "name": "clickCount"
  },
  {
    "type": "variableValueCheck",
    "name": "clickCount",
    "expected": 0
  }
]


# Шаг 15
## Добавьте тег <script> в конец body
```json
[
  { "type": "elementExists", "selector": "script" }
]
````

# Шаг 16

## Внутри <script> создайте функцию showMagic

```json
[{ "type": "functionExists", "name": "showMagic" }]
```

# Шаг 17

## Внутри функции showMagic выведите alert с текстом "🎉 Вау! Это действительно магия! 🎉"

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "alert(\"🎉 Вау! Это действительно магия! 🎉\")"
  }
]
```

# Шаг 18

## Добавьте обработчик: при клике на кнопку вызывается showMagic (через атрибут onclick)

```json
[
  {
    "type": "elementAttributeCheck",
    "selector": ".magic-button",
    "attribute": "onclick",
    "expected": "showMagic()"
  }
]
```

# Шаг 19

## Замените текст в alert на случайную фразу из массива magicMessages

```json
[
  { "type": "variableExists", "name": "magicMessages" },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "const randomIndex = Math.floor(Math.random() * magicMessages.length)"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "alert(randomMessage)"
  }
]
```

# Шаг 20

## Добавьте в массив magicMessages не менее 5 разных магических фраз

```json
[{ "type": "arrayLengthCheck", "array": "magicMessages", "expected": 5 }]
```

# Шаг 21

## Измените обработку клика: используйте addEventListener вместо onclick

```json
[
  {
    "type": "eventListenerExists",
    "element": ".magic-button",
    "event": "click"
  },
  {
    "type": "elementAttributeCheck",
    "selector": ".magic-button",
    "attribute": "onclick",
    "expected": null
  }
]
```

# Шаг 22

## Добавьте на страницу отдельный div с id="clickCounter" для отображения количества кликов

```json
[{ "type": "elementExists", "selector": "#clickCounter" }]
```

# Шаг 24

## При каждом клике увеличивайте clickCount на 1

```json
[{ "type": "codeCheck", "code": "clickCount++" }]
```

# Шаг 25

## После каждого клика обновляйте содержимое div#clickCounter, чтобы показывать актуальное число кликов

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": [
      "document.getElementById('clickCounter').innerHTML",
      "document.getElementById('clickCounter').innerText",
      "document.getElementById('clickCounter').textContent",
      "document.querySelector('#clickCounter').innerHTML",
      "document.querySelector('#clickCounter').innerText",
      "document.querySelector('#clickCounter').textContent",
      "clickCounter.innerHTML",
      "clickCounter.innerText",
      "clickCounter.textContent"
    ]
  },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "clickCount"
  }
]
```

# Шаг 26

## Добавьте div с id="magicMessage" для вывода магических сообщений на страницу

```json
[{ "type": "elementExists", "selector": "#magicMessage" }]
```

# Шаг 27

## Вместо alert выводите сообщение в div#magicMessage

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "document.getElementById('magicMessage').innerHTML = ..."
  }
]
```

# Шаг 28

## Добавьте CSS-анимацию для кнопки: при клике добавляйте класс clicked, убирайте его через 200 мс

```json
[
  { "type": "cssClassExists", "selector": ".magic-button.clicked" },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "button.classList.add('clicked')"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "setTimeout(function() { button.classList.remove('clicked'); }, 200)"
  }
]
```

# Шаг 29

## Добавьте setTimeout для очистки сообщения через 3 секунды

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "setTimeout(function() { messageElement.innerHTML = ''; }, 3000)"
  }
]
```

# Шаг 30

## Добавьте особые сообщения для определённых количеств кликов (например, 10, 25, 50, 100)

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "if (clickCount === 10)"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "else if (clickCount === 25)"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "else if (clickCount === 50)"
  },
  {
    "type": "functionBodyIncludes",
    "function": "showMagic",
    "expected": "else if (clickCount === 100)"
  }
]
```

# Шаг 31

## Добавьте визуальные частицы: создайте функцию createParticles, которая добавляет несколько div с эмодзи в контейнер #particles

```json
[
  { "type": "elementExists", "selector": "#particles" },
  { "type": "functionExists", "name": "createParticles" },
  { "type": "functionCallCheck", "function": "createParticles" }
]
```

# Шаг 32

## Для каждой частицы задайте случайную позицию, эмодзи и удаляйте её через 2.5 секунды

```json
[
  {
    "type": "functionBodyIncludes",
    "function": "createParticles",
    "expected": "particle.style.left = Math.random() * 100 + '%'"
  },
  {
    "type": "functionBodyIncludes",
    "function": "createParticles",
    "expected": "setTimeout(() => { ... }, 2500)"
  }
]
```

# Шаг 33

## Добавьте функцию showRandomMessage для вывода случайного сообщения в #magicMessage с fadeIn-анимацией

```json
[
  { "type": "functionExists", "name": "showRandomMessage" },
  {
    "type": "functionBodyIncludes",
    "function": "showRandomMessage",
    "expected": "animation: fadeIn 0.5s ease-in;"
  }
]
```

# Шаг 34

## Добавьте функцию animateButton для анимации кнопки (добавление/удаление класса clicked)

```json
[
  { "type": "functionExists", "name": "animateButton" },
  { "type": "functionCallCheck", "function": "animateButton" }
]
```

# Шаг 35

## Добавьте функцию checkAchievements для показа достижений при определённых значениях clickCount

```json
[
  { "type": "functionExists", "name": "checkAchievements" },
  { "type": "functionCallCheck", "function": "checkAchievements" }
]
```

# Шаг 36

## Добавьте функцию playClickSound для воспроизведения звука при клике

```json
[
  { "type": "functionExists", "name": "playClickSound" },
  { "type": "functionCallCheck", "function": "playClickSound" }
]
```

# Шаг 37

## Добавьте кнопку сброса с id или классом reset-button и функцию resetGame для сброса состояния игры

```json
[
  { "type": "elementExists", "selector": ".reset-button" },
  { "type": "functionExists", "name": "resetGame" },
  { "type": "functionCallCheck", "function": "resetGame" }
]
```

# Шаг 38

## Для плавного появления сообщений добавьте CSS-анимацию fadeIn через @keyframes

```json
[{ "type": "cssKeyframesExists", "name": "fadeIn" }]
```

```

```
