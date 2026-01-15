/*
  Урок 6: Финальные улучшения
  (полный функционал игры)
*/

// Результат урока 4-5 - основные переменные
let clickCount = 0;

const magicPhrases = [
  "✨ Магия работает! ✨",
  "🌟 Невероятно! 🌟",
  "🎭 Удивительно! 🎭",
  "🔮 Волшебство! 🔮",
  "🎪 Фантастика! 🎪",
];

const magicButton = document.querySelector(".magic-button");
const clickCounterElement = document.getElementById("click-counter");
const achievementsElement = document.getElementById("achievements");

/* 
  TODO 6.2: Добавьте функцию воспроизведения звука
  Создайте функцию playClickSound() используя Web Audio API
*/
function playClickSound() {
  try {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log("Звук недоступен:", error);
  }
}

/* 
  TODO 6.3: Добавьте систему достижений
  Создайте функцию checkAchievements()
*/
function checkAchievements() {
  let achievementMessage = "";

  if (clickCount === 10) {
    achievementMessage = "🏆 Достижение: Первые 10 кликов!";
  } else if (clickCount === 50) {
    achievementMessage = "🏆 Достижение: Полсотни кликов!";
  } else if (clickCount === 100) {
    achievementMessage = "🏆 Достижение: Сотня кликов! Вы мастер магии!";
  }

  if (achievementMessage) {
    const achievementDiv = document.createElement("div");
    achievementDiv.className = "achievement";
    achievementDiv.textContent = achievementMessage;
    achievementsElement.appendChild(achievementDiv);

    alert(achievementMessage);
  }
}

// Результат урока 5 - обработчик с обновлениями урока 6
magicButton.addEventListener("click", function () {
  clickCount++;

  // Обновляем счетчик
  clickCounterElement.textContent = clickCount;

  // Показываем случайную фразу
  const randomPhrase =
    magicPhrases[Math.floor(Math.random() * magicPhrases.length)];
  alert(randomPhrase);

  // TODO 6.4: Раскомментируйте строки ниже для полного функционала
  // playClickSound();
  // checkAchievements();
});

console.log("Magic Button урок 6 - финальная версия готова! 🎉");
