/*
  Урок 5: Добавляем интерфейс статистики
  (включает результат урока 4)
*/

// Результат урока 4 - переменные и массив фраз
let clickCount = 0;

const magicPhrases = [
    "✨ Магия работает! ✨",
    "🌟 Невероятно! 🌟",
    "🎭 Удивительно! 🎭", 
    "🔮 Волшебство! 🔮",
    "🎪 Фантастика! 🎪"
];

const magicButton = document.querySelector('.magic-button');

/* 
  TODO 5.3: Получите ссылку на элемент счетчика
  Добавьте: const clickCounterElement = document.getElementById('click-counter');
*/


/* 
  TODO 5.4: Обновите обработчик события
  Измените addEventListener, чтобы:
  1. Увеличивался clickCount++
  2. Обновлялся текст счетчика: clickCounterElement.textContent = clickCount;
  3. Показывалась случайная фраза через alert()
*/

// Базовый обработчик из урока 4 (нужно будет модифицировать)
magicButton.addEventListener('click', function() {
    clickCount++;
    console.log('Кликов:', clickCount);
    
    const randomPhrase = magicPhrases[Math.floor(Math.random() * magicPhrases.length)];
    alert(randomPhrase);
});

console.log("Magic Button урок 5 - добавляем статистику!");