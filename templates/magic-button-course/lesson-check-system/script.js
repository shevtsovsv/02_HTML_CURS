/*
  Система проверки кода с подсказками и рекламой
  Включает логику проверки кода, показ рекламы и подсказок
*/

// Состояние системы
let currentErrors = [];
let currentHintIndex = null;
let adTimer = null;
let isAdShowing = false;

// Настройки рекламы
const AD_DURATION = 5; // секунды
const TEST_MODE = true; // включить для тестирования

// База данных ошибок и подсказок
const errorDatabase = {
  missing_variable: {
    description: "Не найдена переменная clickCount",
    hint: {
      title: "Создание переменной",
      content: `
        <h4>💡 Как создать переменную clickCount:</h4>
        <p>Для создания переменной-счетчика используйте:</p>
        <code>let clickCount = 0;</code>
        
        <h4>📝 Объяснение:</h4>
        <p><strong>let</strong> - ключевое слово для создания переменной</p>
        <p><strong>clickCount</strong> - имя переменной (можно выбрать любое)</p>
        <p><strong>= 0</strong> - начальное значение (с нуля)</p>
        
        <h4>🎯 Пример:</h4>
        <code>
        let clickCount = 0; // Создаем счетчик<br>
        console.log(clickCount); // Выведет: 0
        </code>
      `,
    },
  },
  missing_element: {
    description: "Не найдено получение элемента кнопки",
    hint: {
      title: "Получение элемента кнопки",
      content: `
        <h4>💡 Как получить элемент кнопки:</h4>
        <p>Для получения элемента по CSS селектору используйте:</p>
        <code>const magicButton = document.querySelector('.magic-button');</code>
        
        <h4>📝 Объяснение:</h4>
        <p><strong>document.querySelector()</strong> - находит элемент на странице</p>
        <p><strong>'.magic-button'</strong> - CSS селектор (точка = класс)</p>
        <p><strong>const</strong> - переменная, которая не изменится</p>
        
        <h4>🎯 Другие примеры селекторов:</h4>
        <code>
        document.querySelector('#myId') // по ID<br>
        document.querySelector('button') // по тегу<br>
        document.querySelector('.my-class') // по классу
        </code>
      `,
    },
  },
  missing_event_listener: {
    description: "Не найден обработчик события click",
    hint: {
      title: "Добавление обработчика события",
      content: `
        <h4>💡 Как добавить обработчик клика:</h4>
        <p>Для обработки кликов используйте addEventListener:</p>
        <code>magicButton.addEventListener('click', function() {<br>
        &nbsp;&nbsp;// ваш код здесь<br>
        });</code>
        
        <h4>📝 Объяснение:</h4>
        <p><strong>addEventListener</strong> - метод для добавления события</p>
        <p><strong>'click'</strong> - тип события (клик мышью)</p>
        <p><strong>function() {}</strong> - функция, которая выполнится при клике</p>
        
        <h4>🎯 Альтернативная запись (стрелочная функция):</h4>
        <code>
        magicButton.addEventListener('click', () => {<br>
        &nbsp;&nbsp;clickCount++;<br>
        &nbsp;&nbsp;console.log('Кликов:', clickCount);<br>
        });
        </code>
      `,
    },
  },
  missing_increment: {
    description: "Отсутствует увеличение счетчика кликов",
    hint: {
      title: "Увеличение счетчика",
      content: `
        <h4>💡 Как увеличить счетчик:</h4>
        <p>Для увеличения значения переменной на 1:</p>
        <code>clickCount++;</code>
        
        <h4>📝 Альтернативные способы:</h4>
        <code>
        clickCount = clickCount + 1; // полная запись<br>
        clickCount += 1; // краткая запись<br>
        clickCount++; // самая короткая (увеличение на 1)
        </code>
        
        <h4>🎯 Полный пример в обработчике:</h4>
        <code>
        magicButton.addEventListener('click', function() {<br>
        &nbsp;&nbsp;clickCount++; // увеличиваем<br>
        &nbsp;&nbsp;console.log('Количество кликов:', clickCount);<br>
        });
        </code>
        
        <h4>⚡ Интересный факт:</h4>
        <p>++ называется "инкремент" - операция увеличения на единицу</p>
      `,
    },
  },
};

// Функция анализа кода
function analyzeCode(code) {
  const errors = [];

  // Проверка наличия переменной clickCount
  if (
    !code.includes("clickCount") ||
    !code.match(/let\s+clickCount|var\s+clickCount|const\s+clickCount/)
  ) {
    errors.push("missing_variable");
  }

  // Проверка получения элемента
  if (
    !code.includes("document.querySelector") &&
    !code.includes("document.getElementById")
  ) {
    errors.push("missing_element");
  }

  // Проверка addEventListener
  if (!code.includes("addEventListener") && !code.includes("onclick")) {
    errors.push("missing_event_listener");
  }

  // Проверка увеличения счетчика
  if (
    !code.includes("clickCount++") &&
    !code.includes("clickCount + 1") &&
    !code.includes("clickCount += 1")
  ) {
    errors.push("missing_increment");
  }

  return errors;
}

// Основная функция проверки кода
function checkCode() {
  const code = document.getElementById("codeInput").value;
  const resultsContainer = document.getElementById("checkResults");
  const hintsContainer = document.getElementById("hintsContainer");

  // Очищаем предыдущие результаты
  resultsContainer.innerHTML = "";
  hintsContainer.innerHTML = "";
  resultsContainer.className = "check-results";

  if (!code.trim()) {
    showError("Пожалуйста, введите код для проверки!");
    return;
  }

  // Анализируем код
  currentErrors = analyzeCode(code);

  if (currentErrors.length === 0) {
    showSuccess("🎉 Отлично! Код написан правильно!");
  } else {
    showErrors(currentErrors);
  }
}

// Показать успех
function showSuccess(message) {
  const resultsContainer = document.getElementById("checkResults");
  resultsContainer.className = "check-results success";
  resultsContainer.innerHTML = `
    <h3>✅ Проверка пройдена!</h3>
    <p>${message}</p>
  `;
}

// Показать ошибки
function showError(message) {
  const resultsContainer = document.getElementById("checkResults");
  resultsContainer.className = "check-results error";
  resultsContainer.innerHTML = `
    <h3>❌ Ошибка</h3>
    <p>${message}</p>
  `;
}

// Показать ошибки с подсказками
function showErrors(errors) {
  const resultsContainer = document.getElementById("checkResults");
  const hintsContainer = document.getElementById("hintsContainer");

  resultsContainer.className = "check-results error";
  resultsContainer.innerHTML = `
    <h3>❌ Найдены ошибки</h3>
    <p>Обнаружено ${errors.length} ошибок. Используйте подсказки для исправления:</p>
  `;

  // Создаем кнопки подсказок
  errors.forEach((errorType, index) => {
    const hintButton = document.createElement("button");
    hintButton.className = "hint-button";
    hintButton.textContent = `💡 Подсказка ${index + 1}`;
    hintButton.onclick = () => showHint(index, errorType);
    hintsContainer.appendChild(hintButton);
  });
}

// Показать подсказку (с рекламой)
function showHint(index, errorType) {
  currentHintIndex = index;

  if (TEST_MODE) {
    console.log(`🧪 ТЕСТ: Показываем рекламу перед подсказкой ${index + 1}`);
  }

  // Сначала показываем рекламу
  showAd(() => {
    // После рекламы показываем подсказку
    displayHint(errorType);
  });
}

// Показать рекламу через универсальный адаптер
function showAd(callback) {
  if (TEST_MODE) {
    console.log("🧪 ТЕСТ: Запуск рекламы через универсальный адаптер");
    console.log(
      "🧪 ТЕСТ: Текущая платформа:",
      window.adAdapter?.config?.platform || "не определена"
    );
  }

  // Используем универсальный адаптер если доступен
  if (window.adAdapter) {
    window.adAdapter.showAd(callback);
    return;
  }

  // Fallback на старую систему
  const adModal = document.getElementById("adModal");
  const adTimer = document.getElementById("adTimer");
  const skipBtn = document.getElementById("skipAdBtn");

  // Показываем модальное окно
  adModal.style.display = "block";
  isAdShowing = true;

  // Сбрасываем состояние
  skipBtn.disabled = true;
  skipBtn.textContent = "Пропустить рекламу";

  let timeLeft = AD_DURATION;
  adTimer.textContent = timeLeft;

  // Запускаем таймер
  const timer = setInterval(() => {
    timeLeft--;
    adTimer.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      skipBtn.disabled = false;
      skipBtn.textContent = "Продолжить";
      skipBtn.onclick = () => closeAdAndShowHint(callback);
    }
  }, 1000);

  // В тестовом режиме логируем
  if (TEST_MODE) {
    console.log(
      "🧪 ТЕСТ: Fallback реклама запущена, таймер:",
      AD_DURATION,
      "секунд"
    );
    console.log("🧪 ТЕСТ: Тип рекламы: Демо-реклама (обучающие курсы)");
  }
}

// Закрыть рекламу и показать подсказку
function closeAdAndShowHint(callback) {
  closeAd();
  if (callback) {
    setTimeout(callback, 300); // Небольшая задержка для плавности
  }
}

// Закрыть рекламу
function closeAd() {
  document.getElementById("adModal").style.display = "none";
  isAdShowing = false;

  if (TEST_MODE) {
    console.log("🧪 ТЕСТ: Реклама закрыта");
  }
}

// Принудительно пропустить рекламу (для тестирования)
function skipAd() {
  const skipBtn = document.getElementById("skipAdBtn");
  if (!skipBtn.disabled) {
    closeAd();
  }
}

// Показать подсказку
function displayHint(errorType) {
  const hintModal = document.getElementById("hintModal");
  const hintTitle = document.getElementById("hintTitle");
  const hintText = document.getElementById("hintText");

  const errorInfo = errorDatabase[errorType];

  if (errorInfo) {
    hintTitle.textContent = `💡 ${errorInfo.hint.title}`;
    hintText.innerHTML = errorInfo.hint.content;
    hintModal.style.display = "block";

    if (TEST_MODE) {
      console.log(`🧪 ТЕСТ: Показана подсказка для ошибки: ${errorType}`);
      console.log(`🧪 ТЕСТ: Заголовок: ${errorInfo.hint.title}`);
    }
  }
}

// Закрыть подсказку
function closeHint() {
  document.getElementById("hintModal").style.display = "none";
}

// Закрытие модальных окон по клику вне них
window.onclick = function (event) {
  const adModal = document.getElementById("adModal");
  const hintModal = document.getElementById("hintModal");

  if (event.target === adModal) {
    // Не закрываем рекламу по клику вне её
    if (TEST_MODE) {
      console.log("🧪 ТЕСТ: Попытка закрыть рекламу кликом - заблокировано");
    }
  }

  if (event.target === hintModal) {
    closeHint();
  }
};

// Функции для тестирования
function testSystem() {
  if (TEST_MODE) {
    console.log("🧪 СИСТЕМА ТЕСТИРОВАНИЯ АКТИВНА");
    console.log("🧪 Доступные команды:");
    console.log("  - testAd() - тестировать рекламу");
    console.log("  - testHints() - тестировать все подсказки");
    console.log("  - testErrors() - сэмулировать ошибки");
    console.log("  - setAdDuration(seconds) - изменить длительность рекламы");
    console.log("  - testPlatforms.google() - тест Google AdSense");
    console.log("  - testPlatforms.yandex() - тест Яндекс.Директ");
    console.log("  - testPlatforms.vk() - тест VK Ads");
    console.log("  - testPlatforms.mailru() - тест Mail.ru");
    console.log("  - testPlatforms.meta() - тест Meta Ads");
    console.log("  - switchAdPlatform(platform) - сменить рекламную платформу");
  }
}

function testAd() {
  console.log("🧪 ТЕСТ: Запуск тестовой рекламы");
  showAd(() => {
    console.log("🧪 ТЕСТ: Реклама завершена, callback выполнен");
  });
}

function testHints() {
  console.log("🧪 ТЕСТ: Показ всех доступных подсказок");
  Object.keys(errorDatabase).forEach((errorType, index) => {
    console.log(`🧪 ТЕСТ: Подсказка ${index + 1} - ${errorType}`);
    setTimeout(() => {
      displayHint(errorType);
    }, index * 1000);
  });
}

function testErrors() {
  console.log("🧪 ТЕСТ: Симуляция ошибок");
  currentErrors = Object.keys(errorDatabase);
  showErrors(currentErrors);
}

function setAdDuration(seconds) {
  console.log(`🧪 ТЕСТ: Длительность рекламы изменена на ${seconds} секунд`);
  if (window.adAdapter) {
    window.adAdapter.config.defaultDuration = seconds * 1000;
  }
  // Это демо - в реальности нужно было бы изменить константу
}

// Функция для переключения рекламной платформы
function switchAdPlatform(platform) {
  if (window.adAdapter) {
    window.adAdapter.switchPlatform(platform);
    console.log(`🔄 Переключено на рекламную платформу: ${platform}`);
  } else {
    console.log("❌ Универсальный адаптер не загружен");
  }
}

// Инициализация
document.addEventListener("DOMContentLoaded", function () {
  console.log("🎯 Система проверки кода загружена");

  if (TEST_MODE) {
    testSystem();
  }

  // Пример кода для демонстрации
  const codeInput = document.getElementById("codeInput");
  codeInput.placeholder = `// Напишите ваш код здесь...
// Пример правильного кода:

let clickCount = 0;
const magicButton = document.querySelector('.magic-button');

magicButton.addEventListener('click', function() {
    clickCount++;
    console.log('Кликов:', clickCount);
});`;

  // Добавляем функционал для магической кнопки
  const magicButton = document.querySelector(".magic-button");
  let clickCount = 0;

  if (magicButton) {
    magicButton.addEventListener("click", function () {
      clickCount++;
      console.log("✨ Магический клик номер:", clickCount);

      // Добавляем немного магии
      const phrases = [
        "✨ Магия работает!",
        "🌟 Невероятно!",
        "🎭 Удивительно!",
        "🔮 Волшебство!",
        "🎪 Фантастика!",
      ];

      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

      // Показываем фразу в консоли вместо alert (чтобы не мешать тестированию)
      console.log(randomPhrase);

      // Визуальный эффект
      magicButton.style.transform = "scale(1.2) rotate(5deg)";
      setTimeout(() => {
        magicButton.style.transform = "";
      }, 200);
    });
  }
});

// Экспортируем функции для тестирования
if (TEST_MODE) {
  window.testAd = testAd;
  window.testHints = testHints;
  window.testErrors = testErrors;
  window.setAdDuration = setAdDuration;
  window.switchAdPlatform = switchAdPlatform;
}
