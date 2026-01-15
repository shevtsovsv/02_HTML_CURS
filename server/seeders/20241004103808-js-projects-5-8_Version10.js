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
          title: 'Список задач (TODO)',
          description: 'Комплексный проект для изучения массивов, объектов, манипуляции DOM и фильтрации данных.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Список задач</title>
</head>
<body>
    <h1>Мой список задач</h1>
    <div class="todo-app">
        <div class="input-section">
            <input type="text" id="taskInput" placeholder="Добавить новую задачу...">
            <button id="addBtn">Добавить</button>
        </div>
        
        <div class="filters">
            <button id="allBtn" class="filter-btn active">Все</button>
            <button id="activeBtn" class="filter-btn">Активные</button>
            <button id="completedBtn" class="filter-btn">Выполненные</button>
        </div>
        
        <ul id="taskList" class="task-list"></ul>
        
        <div class="footer">
            <span id="taskCount">0 задач</span>
            <button id="clearBtn">Очистить выполненные</button>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Segoe UI', sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f5f5;
}

.todo-app {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.input-section {
    display: flex;
    margin-bottom: 20px;
}

#taskInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 5px 0 0 5px;
    font-size: 16px;
}

#addBtn {
    padding: 12px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
}

.filters {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 20px;
}

.filter-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 5px;
    cursor: pointer;
}

.filter-btn.active {
    background: #007bff;
    color: white;
}

.task-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.task-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #eee;
}

.task-item.completed .task-text {
    text-decoration: line-through;
    color: #999;
}

.task-checkbox {
    margin-right: 15px;
}

.task-text {
    flex: 1;
    font-size: 16px;
}

.delete-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
}

.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}`,
          js_template: `// Создайте массив tasks для хранения задач
// Реализуйте функцию renderTasks()
// Добавьте функции для добавления, удаления и переключения задач
// Реализуйте фильтрацию задач`,
          order: 5,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Викторина',
          description: 'Изучение объектов, условной логики, setTimeout и работы с данными. Создайте интерактивную викторину с таймером.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Викторина по JavaScript</title>
</head>
<body>
    <div class="quiz-container">
        <div id="startScreen" class="screen">
            <h1>Викторина по JavaScript</h1>
            <p>Проверьте свои знания! 5 вопросов ждут вас.</p>
            <button id="startBtn" class="btn-primary">Начать викторину</button>
        </div>
        
        <div id="quizScreen" class="screen hidden">
            <div class="progress">
                <div id="progressBar" class="progress-bar"></div>
                <span id="questionNumber">1 / 5</span>
            </div>
            
            <div id="question" class="question"></div>
            <div id="answers" class="answers"></div>
            
            <div class="quiz-footer">
                <div id="timer" class="timer">30</div>
                <button id="nextBtn" class="btn-primary hidden">Далее</button>
            </div>
        </div>
        
        <div id="resultScreen" class="screen hidden">
            <h2>Результаты викторины</h2>
            <div id="score" class="score"></div>
            <div id="feedback" class="feedback"></div>
            <button id="restartBtn" class="btn-primary">Пройти еще раз</button>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.quiz-container {
    background: white;
    border-radius: 15px;
    padding: 40px;
    max-width: 600px;
    width: 100%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.screen {
    text-align: center;
}

.hidden {
    display: none;
}

.progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.progress-bar {
    flex: 1;
    height: 10px;
    background: #e0e0e0;
    border-radius: 5px;
    margin-right: 20px;
    overflow: hidden;
}

.question {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
}

.answers {
    display: grid;
    gap: 15px;
    margin-bottom: 30px;
}

.answer-btn {
    padding: 15px 20px;
    border: 2px solid #ddd;
    background: white;
    border-radius: 10px;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
    text-align: left;
}

.quiz-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.timer {
    font-size: 24px;
    font-weight: bold;
    color: #dc3545;
    background: #fff3cd;
    padding: 10px 20px;
    border-radius: 50px;
    border: 2px solid #ffc107;
}

.btn-primary {
    background: #007bff;
    color: white;
    border: none;
    padding: 15px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
}`,
          js_template: `// Создайте массив вопросов с ответами
// Реализуйте функцию showQuestion()
// Добавьте обработку выбора ответа
// Реализуйте таймер и подсчет результатов`,
          order: 6,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Слайдер изображений',
          description: 'Работа с массивами, setInterval, CSS манипуляциями и событиями клавиатуры. Создайте интерактивный слайдер.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Слайдер изображений</title>
</head>
<body>
    <div class="slider-container">
        <h1>Галерея изображений</h1>
        
        <div class="slider">
            <button id="prevBtn" class="nav-btn prev-btn">‹</button>
            
            <div class="slide-wrapper">
                <div id="slideImage" class="slide">
                    <img id="currentImage" src="" alt="Слайд">
                    <div class="slide-info">
                        <h3 id="slideTitle"></h3>
                        <p id="slideDescription"></p>
                    </div>
                </div>
            </div>
            
            <button id="nextBtn" class="nav-btn next-btn">›</button>
        </div>
        
        <div class="controls">
            <div class="indicators" id="indicators"></div>
            <div class="slider-controls">
                <button id="playBtn" class="control-btn">▶</button>
                <button id="pauseBtn" class="control-btn hidden">⏸</button>
                <span class="slide-counter">
                    <span id="currentSlide">1</span> / <span id="totalSlides">5</span>
                </span>
            </div>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 20px;
    background: #1a1a1a;
    color: white;
    min-height: 100vh;
}

.slider-container {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.slider {
    position: relative;
    background: #333;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.slide-wrapper {
    position: relative;
    height: 400px;
    overflow: hidden;
}

.slide {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.slide img {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.slide-info {
    padding: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    height: 100px;
}

.nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 30px;
    padding: 20px 15px;
    cursor: pointer;
    z-index: 10;
    border-radius: 5px;
}

.prev-btn {
    left: 20px;
}

.next-btn {
    right: 20px;
}

.controls {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.indicators {
    display: flex;
    gap: 10px;
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    cursor: pointer;
}

.indicator.active {
    background: #007bff;
}`,
          js_template: `// Создайте массив slides с данными изображений
// Реализуйте функции showSlide(), nextSlide(), prevSlide()
// Добавьте индикаторы и автопроигрывание
// Реализуйте управление с клавиатуры`,
          order: 7,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Калькулятор',
          description: 'Продвинутый проект для изучения обработки строк, математических операций, обработки ошибок и работы с историей.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Калькулятор</title>
</head>
<body>
    <div class="calculator">
        <div class="display">
            <div id="previousDisplay" class="previous-display"></div>
            <div id="currentDisplay" class="current-display">0</div>
        </div>
        
        <div class="buttons">
            <button class="btn btn-clear" id="clearAll">C</button>
            <button class="btn btn-clear" id="clearEntry">CE</button>
            <button class="btn btn-operation" id="backspace">⌫</button>
            <button class="btn btn-operation" data-operation="/">/</button>
            
            <button class="btn btn-number" data-number="7">7</button>
            <button class="btn btn-number" data-number="8">8</button>
            <button class="btn btn-number" data-number="9">9</button>
            <button class="btn btn-operation" data-operation="*">×</button>
            
            <button class="btn btn-number" data-number="4">4</button>
            <button class="btn btn-number" data-number="5">5</button>
            <button class="btn btn-number" data-number="6">6</button>
            <button class="btn btn-operation" data-operation="-">-</button>
            
            <button class="btn btn-number" data-number="1">1</button>
            <button class="btn btn-number" data-number="2">2</button>
            <button class="btn btn-number" data-number="3">3</button>
            <button class="btn btn-operation" data-operation="+">+</button>
            
            <button class="btn btn-number btn-zero" data-number="0">0</button>
            <button class="btn btn-number" id="decimal">.</button>
            <button class="btn btn-equals" id="equals">=</button>
        </div>
        
        <div class="history">
            <h3>История:</h3>
            <div id="historyList" class="history-list"></div>
            <button id="clearHistory" class="btn-clear-history">Очистить историю</button>
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
    display: flex;
    justify-content: center;
    align-items: center;
}

.calculator {
    background: #2c3e50;
    border-radius: 20px;
    padding: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 100%;
}

.display {
    background: #34495e;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    text-align: right;
    color: white;
}

.previous-display {
    font-size: 16px;
    color: #bdc3c7;
    min-height: 20px;
}

.current-display {
    font-size: 36px;
    font-weight: bold;
    min-height: 50px;
}

.buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 20px;
}

.btn {
    height: 60px;
    border: none;
    border-radius: 10px;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
}

.btn-number {
    background: #3498db;
    color: white;
}

.btn-operation {
    background: #e67e22;
    color: white;
}

.btn-clear {
    background: #e74c3c;
    color: white;
}

.btn-equals {
    background: #27ae60;
    color: white;
    grid-column: span 2;
}

.btn-zero {
    grid-column: span 2;
}

.history {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    color: white;
}`,
          js_template: `// Создайте переменные для состояния калькулятора
// Реализуйте функции updateDisplay(), inputNumber(), inputOperation()
// Добавьте функцию calculate() с обработкой ошибок
// Реализуйте историю вычислений с localStorage`,
          order: 8,
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
        order: [5, 6, 7, 8]
      });
    }
  }
};