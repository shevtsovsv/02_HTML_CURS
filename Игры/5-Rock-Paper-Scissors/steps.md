# Пошаговое создание игры "Камень-Ножницы-Бумага"

## Шаг 1. Базовая HTML-структура

Создайте базовую HTML структуру с DOCTYPE, тегами html, head и body.

**Подсказки:**

- Начинайте с `<!DOCTYPE html>`
- Добавьте тег `<html lang="ru">`
- Внутри html создайте `<head>` и `<body>`
- Проверьте правильность вложенности тегов

**Ответ:**

```html
<!DOCTYPE html>
<html lang="ru">
  <head> </head>
  <body></body>
</html>
```

## Шаг 2. Мета-теги и заголовок

Добавьте в head: meta charset UTF-8, viewport для адаптивности и title "Камень-Ножницы-Бумага".

**Подсказки:**

- `<meta charset="UTF-8">` — для правильной кодировки
- `<meta name="viewport" content="width=device-width, initial-scale=1.0">` — для адаптивности
- `<title>` — заголовок вкладки браузера
- Все мета-теги размещаются внутри `<head>`

**Ответ:**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Камень-Ножницы-Бумага</title>
</head>
```

## Шаг 3. Подключение внешних файлов

Подключите файлы style.css и script.js через теги link и script.

**Подсказки:**

- Для CSS используйте `<link rel="stylesheet" href="style.css">`
- Для JavaScript используйте `<script src="script.js" defer>`
- Атрибут defer откладывает выполнение скрипта до загрузки HTML
- Тег link размещается в head, script можно в head или в конце body

**Ответ:**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Камень-Ножницы-Бумага</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <script src="script.js"></script>
</body>
```

## Шаг 4. Основной контейнер игры

Создайте div с классом game-container — это главный контейнер всей игры.

**Подсказки:**

- Создайте `<div class="game-container"></div>` внутри body
- Этот контейнер будет содержать все элементы игры
- Используйте семантически правильные имена классов

**Ответ:**

```html
<body>
  <div class="game-container"></div>
  <script src="script.js"></script>
</body>
```

## Шаг 5. Заголовок игры

Внутри game-container создайте h1 с текстом "✊✋✌️ Камень-Ножницы-Бумага" и p с классом subtitle.

**Подсказки:**

- Добавьте `<h1>✊✋✌️ Камень-Ножницы-Бумага</h1>`
- Добавьте `<p class="subtitle">Сразись с компьютером!</p>`
- Эмодзи делают интерфейс более дружелюбным

**Ответ:**

```html
<div class="game-container">
  <h1>✊✋✌️ Камень-Ножницы-Бумага</h1>
  <p class="subtitle">Сразись с компьютером!</p>
</div>
```

## Шаг 6. Контейнер статистики

Создайте div с классом game-stats для отображения счёта.

**Подсказки:**

- Создайте `<div class="game-stats"></div>`
- Внутри будут карточки со статистикой
- CSS Grid будет использоваться для размещения

**Ответ:**

```html
<div class="game-stats"></div>
```

## Шаг 7. Карточка "Победы"

В game-stats создайте карточку для отображения количества побед.

**Подсказки:**

- Создайте `<div class="stat-card">`
- Внутри добавьте `<span class="stat-number" id="wins">0</span>`
- И `<span class="stat-label">Победы</span>`
- ID нужен для обновления значения через JavaScript

**Ответ:**

```html
<div class="game-stats">
  <div class="stat-card">
    <span class="stat-number" id="wins">0</span>
    <span class="stat-label">Победы</span>
  </div>
</div>
```

## Шаг 8. Карточка "Поражения"

Создайте карточку для отображения количества поражений.

**Подсказки:**

- Аналогично предыдущему шагу
- id="losses", начальное значение: 0
- Название: "Поражения"

**Ответ:**

```html
<div class="stat-card">
  <span class="stat-number" id="losses">0</span>
  <span class="stat-label">Поражения</span>
</div>
```

## Шаг 9. Карточка "Ничьих"

Создайте карточку для отображения количества ничьих.

**Подсказки:**

- id="draws"
- Начальное значение: 0
- Название: "Ничьих"

**Ответ:**

```html
<div class="stat-card">
  <span class="stat-number" id="draws">0</span>
  <span class="stat-label">Ничьих</span>
</div>
```

## Шаг 10. Карточка "Серия"

Создайте карточку для отображения текущей серии побед.

**Подсказки:**

- id="streak"
- Начальное значение: 0
- Название: "Серия"

**Ответ:**

```html
<div class="stat-card">
  <span class="stat-number" id="streak">0</span>
  <span class="stat-label">Серия</span>
</div>
```

## Шаг 11. Игровое поле (контейнер)

Создайте div с классом battle-arena для игрового поля.

**Подсказки:**

- Создайте `<div class="battle-arena"></div>`
- Здесь будут отображаться выборы игрока и компьютера
- Это основная область взаимодействия

**Ответ:**

```html
<div class="battle-arena"></div>
```

## Шаг 12. Секция VS (контейнер)

В battle-arena создайте div с классом vs-section для размещения выборов.

**Подсказки:**

- Создайте `<div class="vs-section"></div>`
- CSS Grid разделит это на 3 колонки: игрок | VS | компьютер
- Здесь будет происходить "бой"

**Ответ:**

```html
<div class="battle-arena">
  <div class="vs-section"></div>
</div>
```

## Шаг 13. Сторона игрока

В vs-section создайте div с классом player-side для отображения выбора игрока.

**Подсказки:**

- Создайте `<div class="player-side"></div>`
- Добавьте заголовок `<h3>Вы</h3>`
- Добавьте `<div class="player-choice" id="playerChoice">❓</div>` для отображения выбора
- Начальный символ: ❓ (вопросительный знак)

**Ответ:**

```html
<div class="player-side">
  <h3>Вы</h3>
  <div class="player-choice" id="playerChoice">❓</div>
</div>
```

## Шаг 14. Разделитель VS

Создайте div с классом vs-divider для отображения "VS" между игроком и компьютером.

**Подсказки:**

- Создайте `<div class="vs-divider">VS</div>`
- Это будет в центральной колонке
- Визуально разделяет два выбора

**Ответ:**

```html
<div class="vs-divider">VS</div>
```

## Шаг 15. Сторона компьютера

Создайте div с классом computer-side для отображения выбора компьютера.

**Подсказки:**

- Аналогично стороне игрока
- Заголовок: "Компьютер"
- id="computerChoice", начальный символ: ❓

**Ответ:**

```html
<div class="computer-side">
  <h3>Компьютер</h3>
  <div class="computer-choice" id="computerChoice">❓</div>
</div>
```

## Шаг 16. Контейнер кнопок выбора

Создайте div с классом choice-buttons для кнопок выбора.

**Подсказки:**

- Создайте `<div class="choice-buttons"></div>`
- CSS Grid разместит 3 кнопки в ряд
- Кнопки будут добавлены в следующих шагах

**Ответ:**

```html
<div class="choice-buttons"></div>
```

## Шаг 17. Кнопка "Камень"

Создайте кнопку для выбора камня.

**Подсказки:**

- Создайте `<button class="choice-btn" onclick="play('rock')">`
- Текст кнопки: ✊
- Добавьте `<span class="choice-label">Камень</span>` для подписи
- onclick вызывает функцию JavaScript с параметром 'rock'

**Ответ:**

```html
<button class="choice-btn" onclick="play('rock')">
  ✊
  <span class="choice-label">Камень</span>
</button>
```

## Шаг 18. Кнопка "Бумага"

Создайте кнопку для выбора бумаги.

**Подсказки:**

- onclick="play('paper')"
- Эмодзи: ✋
- Подпись: Бумага

**Ответ:**

```html
<button class="choice-btn" onclick="play('paper')">
  ✋
  <span class="choice-label">Бумага</span>
</button>
```

## Шаг 19. Кнопка "Ножницы"

Создайте кнопку для выбора ножниц.

**Подсказки:**

- onclick="play('scissors')"
- Эмодзи: ✌️
- Подпись: Ножницы

**Ответ:**

```html
<button class="choice-btn" onclick="play('scissors')">
  ✌️
  <span class="choice-label">Ножницы</span>
</button>
```

## Шаг 20. Блок отображения результата

Создайте div для отображения результата раунда.

**Подсказки:**

- Создайте `<div class="result-display">`
- Внутри добавьте `<div class="result-text" id="resultText">Сделайте свой выбор!</div>`
- JavaScript будет обновлять этот текст после каждого раунда

**Ответ:**

```html
<div class="result-display">
  <div class="result-text" id="resultText">Сделайте свой выбор!</div>
</div>
```

## Шаг 21. Объект переменных игры

Создайте объект для хранения статистики игры.

**Подсказки:**

- Используйте let для изменяемого объекта
- Поля: wins, losses, draws, streak
- Все счётчики начинаются с 0

**Ответ:**

```javascript
let gameStats = {
  wins: 0,
  losses: 0,
  draws: 0,
  streak: 0,
};
```

## Шаг 22. Объект соответствия выбора эмодзи

Создайте объект для преобразования названия выбора в эмодзи.

**Подсказки:**

- Константа choices с ключами: rock, paper, scissors
- Значения: соответствующие эмодзи (✊, ✋, ✌️)
- Это упростит отображение выборов

**Ответ:**

```javascript
const choices = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};
```

## Шаг 23. Функция случайного выбора компьютера

Создайте функцию getComputerChoice() для генерации случайного выбора компьютера.

**Подсказки:**

- Создайте массив ['rock', 'paper', 'scissors']
- Используйте Math.random() для случайного числа
- Math.floor() округляет вниз
- Верните случайный элемент массива

**Ответ:**

```javascript
function getComputerChoice() {
  const options = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return options[randomIndex];
}
```

## Шаг 24. Функция определения победителя

Создайте функцию determineWinner(player, computer) для определения результата.

**Подсказки:**

- Если выборы равны — ничья
- Камень бьёт ножницы
- Ножницы бьют бумагу
- Бумага бьёт камень
- Верните 'win', 'lose' или 'draw'

**Ответ:**

```javascript
function determineWinner(player, computer) {
  if (player === computer) {
    return "draw";
  }

  if (
    (player === "rock" && computer === "scissors") ||
    (player === "scissors" && computer === "paper") ||
    (player === "paper" && computer === "rock")
  ) {
    return "win";
  }

  return "lose";
}
```

## Шаг 25. Функция обновления статистики

Создайте функцию updateStats() для обновления отображения счёта.

**Подсказки:**

- Обновите textContent элементов с id: wins, losses, draws, streak
- Используйте getElementById
- Берите значения из объекта gameStats

**Ответ:**

```javascript
function updateStats() {
  document.getElementById("wins").textContent = gameStats.wins;
  document.getElementById("losses").textContent = gameStats.losses;
  document.getElementById("draws").textContent = gameStats.draws;
  document.getElementById("streak").textContent = gameStats.streak;
}
```

## Шаг 26. Функция отображения результата

Создайте функцию displayResult(result, playerChoice, computerChoice) для показа результата раунда.

**Подсказки:**

- Обновите текст в элементе с id="resultText"
- Используйте разные сообщения для win, lose, draw
- Добавьте классы для цветового оформления (win, lose, draw)

**Ответ:**

```javascript
function displayResult(result, playerChoice, computerChoice) {
  const resultText = document.getElementById("resultText");
  const playerEmoji = choices[playerChoice];
  const computerEmoji = choices[computerChoice];

  resultText.className = "result-text " + result;

  if (result === "win") {
    resultText.textContent = `Вы победили! ${playerEmoji} бьёт ${computerEmoji}`;
  } else if (result === "lose") {
    resultText.textContent = `Вы проиграли! ${computerEmoji} бьёт ${playerEmoji}`;
  } else {
    resultText.textContent = `Ничья! Оба выбрали ${playerEmoji}`;
  }
}
```

## Шаг 27. Функция обновления отображения выборов

Создайте функцию updateChoiceDisplay(playerChoice, computerChoice) для показа эмодзи выборов.

**Подсказки:**

- Обновите textContent элементов playerChoice и computerChoice
- Используйте объект choices для получения эмодзи
- Это визуально показывает, что выбрали игрок и компьютер

**Ответ:**

```javascript
function updateChoiceDisplay(playerChoice, computerChoice) {
  document.getElementById("playerChoice").textContent = choices[playerChoice];
  document.getElementById("computerChoice").textContent =
    choices[computerChoice];
}
```

## Шаг 28. Основная функция игры play()

Создайте функцию play(playerChoice) — главную функцию игры.

**Подсказки:**

- Получите выбор компьютера через getComputerChoice()
- Определите победителя через determineWinner()
- Обновите статистику в зависимости от результата
- Обновите серию побед
- Вызовите функции обновления дисплея

**Ответ:**

```javascript
function play(playerChoice) {
  const computerChoice = getComputerChoice();
  const result = determineWinner(playerChoice, computerChoice);

  if (result === "win") {
    gameStats.wins++;
    gameStats.streak++;
  } else if (result === "lose") {
    gameStats.losses++;
    gameStats.streak = 0;
  } else {
    gameStats.draws++;
  }

  updateChoiceDisplay(playerChoice, computerChoice);
  displayResult(result, playerChoice, computerChoice);
  updateStats();
}
```

## Шаг 29. Кнопка сброса статистики

Добавьте кнопку для сброса счёта игры.

**Подсказки:**

- Создайте `<button class="reset-btn" onclick="resetGame()">🔄 Сбросить счёт</button>`
- Разместите после result-display
- onclick вызовет функцию resetGame()

**Ответ:**

```html
<button class="reset-btn" onclick="resetGame()">🔄 Сбросить счёт</button>
```

## Шаг 30. Функция сброса игры

Создайте функцию resetGame() для обнуления всей статистики.

**Подсказки:**

- Обнулите все поля объекта gameStats
- Сбросьте отображение выборов на ❓
- Сбросьте текст результата
- Обновите статистику

**Ответ:**

```javascript
function resetGame() {
  gameStats.wins = 0;
  gameStats.losses = 0;
  gameStats.draws = 0;
  gameStats.streak = 0;

  document.getElementById("playerChoice").textContent = "❓";
  document.getElementById("computerChoice").textContent = "❓";
  document.getElementById("resultText").textContent = "Сделайте свой выбор!";
  document.getElementById("resultText").className = "result-text";

  updateStats();
}
```

## Шаг 31. Инициализация игры

Создайте начальную инициализацию при загрузке страницы.

**Подсказки:**

- Вызовите updateStats() для отображения начальных значений
- Это гарантирует, что счётчики показывают 0 при загрузке

**Ответ:**

```javascript
// Инициализация при загрузке страницы
updateStats();
```

## Шаг 32. Добавление режима "До 3 побед"

Создайте переменную для отслеживания режима игры.

**Подсказки:**

- Добавьте переменную let gameMode = 'normal'
- Возможные значения: 'normal' или 'firstTo3'
- Это позволит переключать режимы игры

**Ответ:**

```javascript
let gameMode = "normal";
```

## Шаг 33. Функция проверки победы в режиме "До 3 побед"

Создайте функцию checkFirstTo3Victory() для проверки условий победы.

**Подсказки:**

- Проверяйте, только если gameMode === 'firstTo3'
- Если wins >= 3 или losses >= 3 — игра окончена
- Покажите сообщение с результатом
- Кнопки выбора можно отключить

**Ответ:**

```javascript
function checkFirstTo3Victory() {
  if (gameMode !== "firstTo3") return;

  if (gameStats.wins >= 3) {
    alert("🎉 Поздравляем! Вы победили со счётом 3 раунда!");
    resetGame();
  } else if (gameStats.losses >= 3) {
    alert("😢 Компьютер победил со счётом 3 раунда. Попробуйте ещё раз!");
    resetGame();
  }
}
```

## Шаг 34. Обновление функции play() для режимов

Добавьте вызов checkFirstTo3Victory() в конец функции play().

**Подсказки:**

- Добавьте checkFirstTo3Victory() в конце функции play()
- Это будет проверять условия победы после каждого раунда
- Работает только в режиме 'firstTo3'

**Ответ:**

```javascript
function play(playerChoice) {
  const computerChoice = getComputerChoice();
  const result = determineWinner(playerChoice, computerChoice);

  if (result === "win") {
    gameStats.wins++;
    gameStats.streak++;
  } else if (result === "lose") {
    gameStats.losses++;
    gameStats.streak = 0;
  } else {
    gameStats.draws++;
  }

  updateChoiceDisplay(playerChoice, computerChoice);
  displayResult(result, playerChoice, computerChoice);
  updateStats();
  checkFirstTo3Victory();
}
```

## Шаг 35. HTML для переключателя режимов

Добавьте переключатель режимов игры в HTML.

**Подсказки:**

- Создайте `<div class="game-mode-selector">` перед battle-arena
- Добавьте две кнопки: "Обычный режим" и "До 3 побед"
- Используйте класс mode-btn
- onclick вызывает функцию setGameMode()

**Ответ:**

```html
<div class="game-mode-selector">
  <button class="mode-btn active" onclick="setGameMode('normal')">
    🎮 Обычный режим
  </button>
  <button class="mode-btn" onclick="setGameMode('firstTo3')">
    🏆 До 3 побед
  </button>
</div>
```

## Шаг 36. Функция переключения режима

Создайте функцию setGameMode(mode) для переключения режимов.

**Подсказки:**

- Установите gameMode = mode
- Обновите классы кнопок (добавьте/уберите active)
- Сбросьте статистику через resetGame()
- Покажите сообщение о смене режима

**Ответ:**

```javascript
function setGameMode(mode) {
  gameMode = mode;

  // Обновляем активную кнопку
  const buttons = document.querySelectorAll(".mode-btn");
  buttons.forEach((btn) => btn.classList.remove("active"));
  event.target.classList.add("active");

  resetGame();

  if (mode === "firstTo3") {
    document.getElementById("resultText").textContent =
      'Режим "До 3 побед"! Первый до 3 раундов выигрывает!';
  } else {
    document.getElementById("resultText").textContent =
      "Обычный режим. Сделайте свой выбор!";
  }
}
```

## Шаг 37. Сохранение статистики в localStorage

Создайте функцию saveStats() для сохранения статистики.

**Подсказки:**

- Используйте JSON.stringify() для преобразования объекта в строку
- localStorage.setItem('rpsStats', ...)
- Сохраняйте gameStats

**Ответ:**

```javascript
function saveStats() {
  localStorage.setItem("rpsStats", JSON.stringify(gameStats));
}
```

## Шаг 38. Загрузка статистики из localStorage

Создайте функцию loadStats() для загрузки сохранённой статистики.

**Подсказки:**

- Используйте localStorage.getItem('rpsStats')
- Проверьте, существует ли сохранение
- Используйте JSON.parse() для преобразования строки в объект
- Обновите gameStats и дисплей

**Ответ:**

```javascript
function loadStats() {
  const saved = localStorage.getItem("rpsStats");
  if (saved) {
    gameStats = JSON.parse(saved);
    updateStats();
  }
}
```

## Шаг 39. Автосохранение при изменении статистики

Добавьте вызов saveStats() в функцию play().

**Подсказки:**

- Добавьте saveStats() в конец функции play()
- Это будет автоматически сохранять статистику после каждого раунда
- Данные сохранятся даже после закрытия браузера

**Ответ:**

```javascript
function play(playerChoice) {
  const computerChoice = getComputerChoice();
  const result = determineWinner(playerChoice, computerChoice);

  if (result === "win") {
    gameStats.wins++;
    gameStats.streak++;
  } else if (result === "lose") {
    gameStats.losses++;
    gameStats.streak = 0;
  } else {
    gameStats.draws++;
  }

  updateChoiceDisplay(playerChoice, computerChoice);
  displayResult(result, playerChoice, computerChoice);
  updateStats();
  checkFirstTo3Victory();
  saveStats();
}
```

## Шаг 40. Загрузка статистики при старте

Добавьте вызов loadStats() в инициализацию.

**Подсказки:**

- Добавьте loadStats() в начало скрипта или в конце
- Это загрузит сохранённую статистику при открытии страницы
- Игрок сможет продолжить с того места, где остановился

**Ответ:**

```javascript
// Инициализация при загрузке страницы
loadStats();
updateStats();
```

## Шаг 41. Добавление звуковых эффектов (опционально)

Создайте функцию для воспроизведения звуков.

**Подсказки:**

- Создайте функцию playSound(result)
- Используйте new Audio() для создания звука
- Разные звуки для win, lose, draw
- Вызывайте в функции play()

**Ответ:**

```javascript
function playSound(result) {
  const sounds = {
    win: "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3",
    lose: "https://assets.mixkit.co/sfx/preview/mixkit-lose-2042.mp3",
    draw: "https://assets.mixkit.co/sfx/preview/mixkit-neutral-click-1544.mp3",
  };

  const audio = new Audio(sounds[result]);
  audio.play();
}
```

## Шаг 42. Анимация выбора

Добавьте CSS анимацию для кнопок при наведении.

**Подсказки:**

- Используйте свойство transform для увеличения
- scale(1.1) увеличивает кнопку на 10%
- transition делает изменение плавным
- Добавьте box-shadow для эффекта глубины

**Ответ:**
Добавьте в style.css:

```css
.choice-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}
```

## Шаг 43. Анимация при клике

Добавьте CSS анимацию для эффекта нажатия.

**Подсказки:**

- :active срабатывает при клике
- scale(0.95) немного уменьшает кнопку
- Создаёт эффект "вдавливания"

**Ответ:**
Добавьте в style.css:

```css
.choice-btn:active {
  transform: scale(0.95);
}
```

## Шаг 44. Анимация тряски для выборов

Создайте keyframes анимацию тряски для отображения выбора.

**Подсказки:**

- Используйте @keyframes shake
- translateX перемещает элемент влево-вправо
- Примените к .player-choice и .computer-choice

**Ответ:**
Добавьте в style.css:

```css
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

.player-choice.animate,
.computer-choice.animate {
  animation: shake 0.5s;
}
```

## Шаг 45. Применение анимации к выборам

Добавьте код для применения анимации при выборе.

**Подсказки:**

- Добавьте класс 'animate' к элементам
- Используйте setTimeout для удаления класса
- Добавьте в функцию updateChoiceDisplay()

**Ответ:**

```javascript
function updateChoiceDisplay(playerChoice, computerChoice) {
  const playerDisplay = document.getElementById("playerChoice");
  const computerDisplay = document.getElementById("computerChoice");

  playerDisplay.textContent = choices[playerChoice];
  computerDisplay.textContent = choices[computerChoice];

  // Добавляем анимацию
  playerDisplay.classList.add("animate");
  computerDisplay.classList.add("animate");

  // Убираем класс анимации через полсекунды
  setTimeout(() => {
    playerDisplay.classList.remove("animate");
    computerDisplay.classList.remove("animate");
  }, 500);
}
```

## Шаг 46. Градиентный фон для body

Создайте красивый градиентный фон.

**Подсказки:**

- Используйте linear-gradient
- Укажите несколько цветов
- 135deg — угол наклона
- Используйте фиолетово-синюю палитру

**Ответ:**
Добавьте в style.css:

```css
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #6b73ff 100%);
  margin: 0;
  padding: 20px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

## Шаг 47. Стилизация контейнера игры

Оформите главный контейнер с закруглёнными углами и тенью.

**Подсказки:**

- background: белый с прозрачностью
- border-radius для закругления
- box-shadow для тени
- padding для внутренних отступов

**Ответ:**
Добавьте в style.css:

```css
.game-container {
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 25px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  max-width: 700px;
}
```

## Шаг 48. Стилизация статистических карточек

Оформите карточки статистики с градиентом.

**Подсказки:**

- display: grid для сетки
- grid-template-columns: repeat(4, 1fr) — 4 равные колонки
- gap для расстояния между карточками
- Градиент для каждой карточки

**Ответ:**
Добавьте в style.css:

```css
.game-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  padding: 15px;
  border-radius: 15px;
  color: white;
  font-weight: bold;
}

.stat-number {
  font-size: 2rem;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.9;
}
```

## Шаг 49. Стилизация игрового поля

Оформите зону battle-arena с ярким фоном.

**Подсказки:**

- Используйте тёплый градиент (оранжево-розовый)
- border для рамки
- padding для внутренних отступов
- border-radius для закругления

**Ответ:**
Добавьте в style.css:

```css
.battle-arena {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  border-radius: 25px;
  padding: 25px;
  margin: 20px 0;
  border: 3px solid #ff8a65;
}

.vs-section {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
}

.player-side,
.computer-side {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  border: 3px solid #ddd;
}

.player-choice,
.computer-choice {
  font-size: 6rem;
  margin: 15px 0;
}

.vs-divider {
  font-size: 3rem;
  color: #ff6b6b;
  font-weight: bold;
}
```

## Шаг 50. Стилизация кнопок выбора

Оформите кнопки камень-ножницы-бумага.

**Подсказки:**

- display: grid с 3 колонками
- Градиентный фон кнопок
- Большой размер эмодзи (font-size: 3rem)
- transition для плавных переходов

**Ответ:**
Добавьте в style.css:

```css
.choice-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin: 20px 0;
}

.choice-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 20px;
  font-size: 3rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.choice-label {
  display: block;
  font-size: 0.9rem;
  margin-top: 5px;
  font-weight: bold;
}
```

## Шаг 51. Стилизация блока результата

Оформите область отображения результата с цветовой индикацией.

**Подсказки:**

- Белый фон с рамкой
- min-height для постоянной высоты
- Разные цвета для win, lose, draw
- .win — зелёный, .lose — красный, .draw — жёлтый

**Ответ:**
Добавьте в style.css:

```css
.result-display {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 20px;
  margin: 20px 0;
  border: 3px solid #4ecdc4;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.result-text.win {
  color: #27ae60;
}

.result-text.lose {
  color: #e74c3c;
}

.result-text.draw {
  color: #f39c12;
}
```

## Шаг 52. Стилизация кнопки сброса и переключателя режимов

Оформите кнопку сброса и кнопки переключения режимов.

**Подсказки:**

- Отдельные стили для reset-btn
- mode-btn для переключателя режимов
- .active для активного режима
- Разные цвета и эффекты

**Ответ:**
Добавьте в style.css:

```css
.reset-btn {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  padding: 12px 25px;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  margin-top: 15px;
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}

.game-mode-selector {
  margin-bottom: 20px;
}

.mode-btn {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #333;
  border: none;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 20px;
  cursor: pointer;
  margin: 5px;
  transition: all 0.3s ease;
  font-weight: bold;
}

.mode-btn:hover {
  transform: scale(1.05);
}

.mode-btn.active {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  box-shadow: 0 5px 15px rgba(255, 154, 158, 0.4);
}
```
