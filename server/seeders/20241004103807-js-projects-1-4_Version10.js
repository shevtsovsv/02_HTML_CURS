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
        throw new Error('Курс "Основы JavaScript" не найден. Создайте курс перед проектами.');
      }

      await queryInterface.bulkInsert('projects', [
        {
          title: 'Приветствие пользователя',
          description: 'Первый проект для знакомства с переменными, функциями и DOM. Создайте интерактивное приветствие с кнопкой.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Приветствие</title>
</head>
<body>
    <h1>Добро пожаловать!</h1>
    <button id="greetBtn">Поприветствовать</button>
    <p id="greeting"></p>
</body>
</html>`,
          css_template: `body {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
}

button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #0056b3;
}

#greeting {
    margin-top: 20px;
    font-size: 18px;
    color: #333;
}`,
          js_template: `// Ваш код здесь
// Создайте переменную с вашим именем
// Обработайте клик по кнопке`,
          order: 1,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Калькулятор возраста',
          description: 'Изучение функций, объекта Date и математических операций. Создайте калькулятор для вычисления возраста по году рождения.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Калькулятор возраста</title>
</head>
<body>
    <h1>Калькулятор возраста</h1>
    <div class="calculator">
        <label for="birthYear">Год рождения:</label>
        <input type="number" id="birthYear" placeholder="1990">
        <button id="calculateBtn">Вычислить возраст</button>
        <div id="result"></div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: Arial, sans-serif;
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
}

.calculator {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
}

input {
    width: 200px;
    padding: 10px;
    margin: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 16px;
}

button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px;
}

#result {
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #007bff;
}`,
          js_template: `// Создайте функцию для вычисления возраста
// Добавьте обработчик события для кнопки`,
          order: 2,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Генератор случайных чисел',
          description: 'Работа с Math.random(), циклами и массивами. Создайте генератор случайных чисел с настраиваемыми параметрами.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Генератор случайных чисел</title>
</head>
<body>
    <h1>Генератор случайных чисел</h1>
    <div class="generator">
        <div class="controls">
            <label for="minNum">Минимум:</label>
            <input type="number" id="minNum" value="1">
            
            <label for="maxNum">Максимум:</label>
            <input type="number" id="maxNum" value="100">
            
            <label for="count">Количество:</label>
            <input type="number" id="count" value="5" min="1" max="20">
        </div>
        
        <button id="generateBtn">Генерировать</button>
        <div id="numbers"></div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
}

.generator {
    background: #f8f9fa;
    padding: 30px;
    border-radius: 10px;
    text-align: center;
}

.controls {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input {
    width: 80px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
}

button {
    background-color: #dc3545;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

#numbers {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
}

.number-item {
    background: #007bff;
    color: white;
    padding: 15px;
    border-radius: 50%;
    min-width: 40px;
    font-weight: bold;
    font-size: 18px;
}`,
          js_template: `// Создайте функцию getRandomNumber(min, max)
// Создайте функцию generateNumbers(min, max, count)
// Добавьте обработчик кнопки для отображения результатов`,
          order: 3,
          course_id: course.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: 'Счетчик кликов',
          description: 'Работа с состоянием, localStorage и обновлением DOM. Создайте счетчик с сохранением данных и статистикой.',
          html_template: `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Счетчик кликов</title>
</head>
<body>
    <h1>Счетчик кликов</h1>
    <div class="counter">
        <div id="count" class="count-display">0</div>
        <div class="buttons">
            <button id="incrementBtn" class="btn-increment">+1</button>
            <button id="decrementBtn" class="btn-decrement">-1</button>
            <button id="resetBtn" class="btn-reset">Сброс</button>
        </div>
        <div class="stats">
            <p>Всего кликов: <span id="totalClicks">0</span></p>
        </div>
    </div>
</body>
</html>`,
          css_template: `body {
    font-family: Arial, sans-serif;
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    color: white;
}

.counter {
    background: rgba(255, 255, 255, 0.1);
    padding: 40px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
}

.count-display {
    font-size: 72px;
    font-weight: bold;
    margin: 30px 0;
    color: #fff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin: 30px 0;
}

button {
    padding: 15px 25px;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-increment {
    background: #28a745;
    color: white;
}

.btn-decrement {
    background: #dc3545;
    color: white;
}

.btn-reset {
    background: #6c757d;
    color: white;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.stats {
    margin-top: 20px;
    font-size: 16px;
}`,
          js_template: `// Создайте переменные для хранения состояния
// Создайте функцию updateDisplay()
// Добавьте обработчики для кнопок
// Реализуйте сохранение в localStorage`,
          order: 4,
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
        order: [1, 2, 3, 4]
      });
    }
  }
};