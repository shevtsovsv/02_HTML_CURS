"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      const [course] = await queryInterface.sequelize.query(
        "SELECT id FROM courses WHERE slug = 'osnovy-javascript' LIMIT 1",
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (!course) {
        throw new Error('Курс "Основы JavaScript" не найден.');
      }

      await queryInterface.bulkInsert('projects', [
        {
          title: 'Игра "Угадай число"',
          description: 'Комплексная игра для изучения алгоритмов, игровой логики, валидации ввода и работы со статистикой.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Угадай число</title>
</head>
<body>
    <div class="game-container">
        <h1>🎯 Угадай число!</h1>
        
        <div class="game-setup">
            <div class="difficulty">
                <h3>Выберите сложность:</h3>
                <div class="difficulty-buttons">
                    <button class="difficulty-btn active" data-range="100" data-attempts="10">
                        Легко (1-100, 10 попыток)
                    </button>
                    <button class="difficulty-btn" data-range="500" data-attempts="12">
                        Средне (1-500, 12 попыток)
                    </button>
                    <button class="difficulty-btn" data-range="1000" data-attempts="15">
                        Сложно (1-1000, 15 попыток)
                    </button>
                </div>
            </div>
            
            <button id="startGame" class="start-btn">Начать игру</button>
        </div>
        
        <div id="gameArea" class="game-area hidden">
            <div class="game-info">
                <div class="info-item">
                    <span class="label">Диапазон:</span>
                    <span id="range">1 - 100</span>
                </div>
                <div class="info-item">
                    <span class="label">Попыток осталось:</span>
                    <span id="attemptsLeft">10</span>
                </div>
            </div>
            
            <div class="input-section">
                <input type="number" id="guessInput" placeholder="Введите число" min="1">
                <button id="submitGuess">Проверить</button>
                <button id="giveUp">Сдаться</button>
            </div>
            
            <div id="feedback" class="feedback"></div>
            <div id="attemptsList" class="attempts-list"></div>
        </div>
        
        <div class="statistics">
            <h3>📊 Статистика:</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <span class="stat-number" id="gamesPlayed">0</span>
                    <span class="stat-desc">Игр сыграно</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number" id="gamesWon">0</span>
                    <span class="stat-desc">Побед</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: #333;
}

.game-container {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

h1 {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 2.5em;
}

.difficulty-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 20px 0;
}

.difficulty-btn {
    padding: 15px 20px;
    border: 2px solid #3498db;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
}

.difficulty-btn.active {
    background: #3498db;
    color: white;
}

.start-btn {
    width: 100%;
    padding: 20px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    cursor: pointer;
}

.game-info {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
}

#guessInput {
    flex: 1;
    padding: 15px;
    border: 2px solid #ddd;
    border-radius: 10px;
    font-size: 18px;
    text-align: center;
}

button {
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
}

#submitGuess {
    background: #3498db;
    color: white;
}

#giveUp {
    background: #e74c3c;
    color: white;
}

.feedback {
    padding: 20px;
    border-radius: 10px;
    margin-bottom: 20px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}

.feedback.hot {
    background: #fff3cd;
    color: #856404;
}

.feedback.cold {
    background: #f8d7da;
    color: #721c24;
}

.hidden {
    display: none;
}`,
          js_template: `// Создайте переменные для игрового состояния
// Реализуйте функции startNewGame(), makeGuess()
// Добавьте систему подсказок и валидацию
// Реализуйте статистику с localStorage`,
          order: 9,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Погодное приложение',
          description: 'Продвинутый проект для изучения Fetch API, JSON, асинхронности, промисов и работы с внешними API.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Погодное приложение</title>
</head>
<body>
    <div class="weather-app">
        <header class="app-header">
            <h1>🌤️ Погодное приложение</h1>
            <div class="search-container">
                <input type="text" id="cityInput" placeholder="Введите название города...">
                <button id="searchBtn">🔍</button>
                <button id="locationBtn" title="Моя геолокация">📍</button>
            </div>
        </header>

        <div id="loadingSpinner" class="loading hidden">
            <div class="spinner"></div>
            <p>Загрузка данных о погоде...</p>
        </div>

        <div id="errorMessage" class="error-message hidden">
            <div class="error-content">
                <h3>❌ Ошибка</h3>
                <p id="errorText"></p>
                <button id="retryBtn">Попробовать снова</button>
            </div>
        </div>

        <main id="weatherContent" class="weather-content hidden">
            <div class="current-weather">
                <div class="location">
                    <h2 id="cityName">Москва</h2>
                    <p id="countryName">Россия</p>
                </div>
                
                <div class="weather-main">
                    <div class="temperature">
                        <span id="currentTemp">22°</span>
                        <span id="feelsLike">Ощущается как 25°</span>
                    </div>
                    <div class="weather-icon">
                        <img id="weatherIcon" src="" alt="Погода">
                        <p id="weatherDescription">Солнечно</p>
                    </div>
                </div>
            </div>

            <div class="weather-details">
                <div class="detail-card">
                    <span class="detail-label">💨 Ветер</span>
                    <span id="windSpeed" class="detail-value">15 км/ч</span>
                </div>
                <div class="detail-card">
                    <span class="detail-label">💧 Влажность</span>
                    <span id="humidity" class="detail-value">65%</span>
                </div>
                <div class="detail-card">
                    <span class="detail-label">🌡️ Давление</span>
                    <span id="pressure" class="detail-value">1013 мб</span>
                </div>
            </div>
        </main>

        <div class="favorites">
            <h3>⭐ Избранные города</h3>
            <div id="favoritesList" class="favorites-list"></div>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
    min-height: 100vh;
}

.weather-app {
    max-width: 800px;
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.app-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    text-align: center;
}

.search-container {
    display: flex;
    max-width: 400px;
    margin: 0 auto;
    gap: 10px;
}

#cityInput {
    flex: 1;
    padding: 15px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
}

#searchBtn, #locationBtn {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    font-size: 18px;
    cursor: pointer;
}

.loading {
    text-align: center;
    padding: 50px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.current-weather {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin: 30px;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 15px;
    color: white;
}

.temperature {
    text-align: center;
}

#currentTemp {
    font-size: 4em;
    font-weight: bold;
    display: block;
}

.weather-details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin: 30px;
}

.detail-card {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
}

.hidden {
    display: none;
}`,
          js_template: `// Создайте API ключ и базовый URL (используйте OpenWeatherMap API)
// Реализуйте функции getWeatherData(), updateWeatherDisplay()
// Добавьте обработку ошибок и загрузки
// Реализуйте геолокацию и избранные города`,
          order: 10,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Текстовый редактор',
          description: 'Экспертный проект для изучения ContentEditable, команд документа, сложной DOM манипуляции и работы с файлами.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Текстовый редактор</title>
</head>
<body>
    <div class="editor-container">
        <header class="editor-header">
            <h1>📝 Текстовый редактор</h1>
            <div class="file-actions">
                <button id="newBtn">Новый</button>
                <button id="openBtn">Открыть</button>
                <button id="saveBtn">Сохранить</button>
                <input type="file" id="fileInput" accept=".txt,.html" style="display: none;">
            </div>
        </header>
        
        <div class="toolbar">
            <div class="format-group">
                <button id="boldBtn" class="format-btn" title="Жирный"><b>B</b></button>
                <button id="italicBtn" class="format-btn" title="Курсив"><i>I</i></button>
                <button id="underlineBtn" class="format-btn" title="Подчеркнутый"><u>U</u></button>
            </div>
            
            <div class="format-group">
                <select id="fontSize">
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16" selected>16px</option>
                    <option value="18">18px</option>
                    <option value="24">24px</option>
                </select>
                
                <input type="color" id="textColor" value="#000000" title="Цвет текста">
                <input type="color" id="bgColor" value="#ffffff" title="Цвет фона">
            </div>
            
            <div class="format-group">
                <button id="alignLeftBtn" class="format-btn" title="По левому краю">⬅</button>
                <button id="alignCenterBtn" class="format-btn" title="По центру">↔</button>
                <button id="alignRightBtn" class="format-btn" title="По правому краю">➡</button>
            </div>
        </div>
        
        <div class="editor-workspace">
            <div id="editor" class="editor-content" contenteditable="true">
                <p>Начните печатать здесь...</p>
            </div>
        </div>
        
        <div class="status-bar">
            <span id="wordCount">Слов: 0</span>
            <span id="charCount">Символов: 0</span>
            <span id="saveStatus">Не сохранено</span>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 0;
    background: #f5f5f5;
}

.editor-container {
    max-width: 1200px;
    margin: 20px auto;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
}

.editor-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.file-actions {
    display: flex;
    gap: 10px;
}

.file-actions button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
}

.toolbar {
    background: #f8f9fa;
    padding: 15px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    gap: 20px;
    align-items: center;
    flex-wrap: wrap;
}

.format-group {
    display: flex;
    gap: 5px;
    align-items: center;
}

.format-btn {
    width: 35px;
    height: 35px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.format-btn:hover {
    background: #e9ecef;
}

.editor-workspace {
    min-height: 500px;
    padding: 30px;
}

.editor-content {
    min-height: 400px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: white;
    font-size: 16px;
    line-height: 1.6;
    outline: none;
}

.status-bar {
    background: #f8f9fa;
    padding: 10px 20px;
    border-top: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
}`,
          js_template: `// Создайте переменные для состояния редактора
// Реализуйте функции форматирования текста (bold, italic, underline)
// Добавьте функции для работы с файлами (открыть, сохранить)
// Реализуйте подсчет слов и символов
// Добавьте автосохранение в localStorage`,
          order: 11,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Мини-игра "Змейка"',
          description: 'Экспертный проект для изучения Canvas API, игрового цикла, обработки столкновений и анимации.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Игра Змейка</title>
</head>
<body>
    <div class="game-container">
        <header class="game-header">
            <h1>🐍 Змейка</h1>
            <div class="game-controls">
                <button id="playBtn">Играть</button>
                <button id="pauseBtn" style="display: none;">Пауза</button>
                <button id="resetBtn">Сброс</button>
            </div>
        </header>
        
        <div class="game-info">
            <div class="score-panel">
                <div class="score-item">
                    <span class="label">Счет:</span>
                    <span id="currentScore">0</span>
                </div>
                <div class="score-item">
                    <span class="label">Рекорд:</span>
                    <span id="bestScore">0</span>
                </div>
                <div class="score-item">
                    <span class="label">Скорость:</span>
                    <select id="speedSelect">
                        <option value="200">Медленно</option>
                        <option value="150" selected>Нормально</option>
                        <option value="100">Быстро</option>
                        <option value="50">Очень быстро</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="game-area">
            <canvas id="gameCanvas" width="400" height="400"></canvas>
            <div id="gameOverScreen" class="game-over hidden">
                <h2>Игра окончена!</h2>
                <p>Ваш счет: <span id="finalScore">0</span></p>
                <button id="restartBtn">Играть снова</button>
            </div>
        </div>
        
        <div class="instructions">
            <h3>Управление:</h3>
            <div class="controls-info">
                <div class="control-item">
                    <span class="key">↑↓←→</span>
                    <span>Стрелки - движение</span>
                </div>
                <div class="control-item">
                    <span class="key">SPACE</span>
                    <span>Пауза/Продолжить</span>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    color: white;
    min-height: 100vh;
}

.game-container {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
}

.game-header {
    margin-bottom: 20px;
}

.game-header h1 {
    font-size: 3em;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.game-controls {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.game-controls button {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;
}

#playBtn, #restartBtn {
    background: #27ae60;
    color: white;
}

#pauseBtn {
    background: #f39c12;
    color: white;
}

#resetBtn {
    background: #e74c3c;
    color: white;
}

.game-info {
    margin: 20px 0;
}

.score-panel {
    display: flex;
    justify-content: center;
    gap: 30px;
    background: rgba(255, 255, 255, 0.1);
    padding: 15px;
    border-radius: 10px;
    backdrop-filter: blur(10px);
}

.score-item {
    text-align: center;
}

.label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    opacity: 0.8;
}

#gameCanvas {
    border: 3px solid white;
    border-radius: 10px;
    background: #34495e;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.game-over {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.9);
    padding: 40px;
    border-radius: 15px;
    text-align: center;
    border: 2px solid white;
}

.hidden {
    display: none;
}

.instructions {
    margin-top: 20px;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 10px;
}

.controls-info {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.control-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.key {
    background: rgba(255, 255, 255, 0.2);
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: bold;
}`,
          js_template: `// Создайте переменные для игры (canvas, ctx, snake, food)
// Реализуйте функции drawGame(), moveSnake(), checkCollision()
// Добавьте обработку клавиш управления
// Реализуйте игровой цикл с setInterval
// Добавьте систему счета и рекордов`,
          order: 12,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const [course] = await queryInterface.sequelize.query(
      "SELECT id FROM courses WHERE slug = 'osnovy-javascript' LIMIT 1",
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (course) {
      await queryInterface.bulkDelete('projects', {
        course_id: course.id,
        order: [9, 10, 11, 12]
      });
    }
  }
};