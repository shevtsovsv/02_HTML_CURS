'use strict';

/**
 * @file seeders/...-magic-button-lesson4-steps.js
 * @description Сидер для создания шагов урока 4 "JavaScript логика"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 4: JavaScript логика' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error('Проект "Урок 4: JavaScript логика" не найден.');
    }

    const projectId = projects[0].id;
    const baseHTML = '<!DOCTYPE html>\\n<html lang="ru">\\n<head>\\n    <meta charset="UTF-8">\\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\\n    <title>Волшебная кнопка</title>\\n    <link rel="stylesheet" href="style.css">\\n</head>\\n<body>\\n    <div class="game-container">\\n        <h1>Волшебная кнопка</h1>\\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\\n        <button class="magic-button">✨ Магия! ✨</button>\\n    </div>\\n    <script src="script.js"></script>\\n</body>\\n</html>';
    const baseCSS = 'body {\\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\\n    margin: 0;\\n    padding: 0;\\n    min-height: 100vh;\\n    display: flex;\\n    align-items: center;\\n    justify-content: center;\\n    color: white;\\n}\\n\\n.game-container {\\n    text-align: center;\\n}\\n\\nh1 {\\n    font-size: 2.5rem;\\n    margin-bottom: 10px;\\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\\n}\\n\\n.subtitle {\\n    font-size: 1.2rem;\\n    margin-bottom: 30px;\\n    opacity: 0.9;\\n}\\n\\n.magic-button {\\n    background: linear-gradient(135deg, #ff6b6b, #ffa500);\\n    color: white;\\n    border: none;\\n    padding: 20px 40px;\\n    font-size: 1.5rem;\\n    font-weight: bold;\\n    border-radius: 50px;\\n    cursor: pointer;\\n    margin: 20px;\\n    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);\\n    transition: all 0.3s ease;\\n    text-transform: uppercase;\\n    letter-spacing: 1px;\\n}\\n\\n.magic-button:hover {\\n    transform: scale(1.1) rotate(2deg);\\n    box-shadow: 0 15px 35px rgba(255, 107, 107, 0.6);\\n    background: linear-gradient(135deg, #ff5252, #ff8f00);\\n}\\n\\n.magic-button:active {\\n    transform: scale(0.95) rotate(-1deg);\\n}';

    return queryInterface.bulkInsert('projectSteps', [
      {
        instructions: 'Создайте переменную let clickCount = 0; для подсчета кликов.',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "jsVariableExists", "name": "clickCount" },
          { "type": "jsVariableValue", "name": "clickCount", "expected": 0 }
        ]),
        starterCode: JSON.stringify({
          html: baseHTML,
          css: baseCSS,
          js: '/*\\n  Урок 4: JavaScript логика\\n*/\\n\\n/* TODO 4.1: Создайте переменную для счетчика */\\n/* let clickCount = 0; */\\n\\nconsole.log("Magic Button урок 4 - изучаем JavaScript!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Получите ссылку на кнопку с помощью document.querySelector(".magic-button") и сохраните в константу magicButton.',
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "jsVariableExists", "name": "magicButton" },
          { "type": "jsFunction", "name": "querySelector", "called": true }
        ]),
        starterCode: JSON.stringify({
          html: baseHTML,
          css: baseCSS,
          js: 'let clickCount = 0;\\n\\n/* TODO 4.2: Получите ссылку на кнопку */\\n/* const magicButton = document.querySelector(".magic-button"); */\\n\\nconsole.log("Magic Button урок 4 - изучаем JavaScript!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте обработчик события click к кнопке. В функции увеличивайте clickCount и выводите в консоль количество кликов.',
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "jsFunction", "name": "addEventListener", "called": true },
          { "type": "jsEventListener", "event": "click", "exists": true }
        ]),
        starterCode: JSON.stringify({
          html: baseHTML,
          css: baseCSS,
          js: 'let clickCount = 0;\\nconst magicButton = document.querySelector(".magic-button");\\n\\n/* TODO 4.3: Добавьте обработчик события click */\\n/* magicButton.addEventListener("click", function() {\\n    clickCount++;\\n    console.log("Кликов:", clickCount);\\n}); */\\n\\nconsole.log("Magic Button урок 4 - изучаем JavaScript!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Создайте массив magicPhrases с волшебными фразами и добавьте показ случайной фразы через alert в обработчик клика.',
        order: 4,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "jsVariableExists", "name": "magicPhrases" },
          { "type": "jsFunction", "name": "alert", "called": true },
          { "type": "jsFunction", "name": "Math.random", "called": true }
        ]),
        starterCode: JSON.stringify({
          html: baseHTML,
          css: baseCSS,
          js: 'let clickCount = 0;\\n\\n/* TODO 4.4: Создайте массив с фразами */\\n/* const magicPhrases = [\\n    "✨ Магия работает! ✨",\\n    "🌟 Невероятно! 🌟",\\n    "🎭 Удивительно! 🎭",\\n    "🔮 Волшебство! 🔮",\\n    "🎪 Фантастика! 🎪"\\n]; */\\n\\nconst magicButton = document.querySelector(".magic-button");\\n\\nmagicButton.addEventListener("click", function() {\\n    clickCount++;\\n    console.log("Кликов:", clickCount);\\n    \\n    /* TODO: Добавьте показ случайной фразы */\\n    /* const randomPhrase = magicPhrases[Math.floor(Math.random() * magicPhrases.length)];\\n    alert(randomPhrase); */\\n});\\n\\nconsole.log("Magic Button урок 4 - изучаем JavaScript!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 4: JavaScript логика' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      return queryInterface.bulkDelete('projectSteps', { project_id: projects[0].id });
    }
  }
};