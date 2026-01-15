'use strict';

/**
 * @file seeders/...-magic-button-lesson3-steps.js
 * @description Сидер для создания шагов урока 3 "Стилизация кнопки"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Получаем ID проекта "Урок 3"
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 3: Стилизация кнопки' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error('Проект "Урок 3: Стилизация кнопки" не найден. Запустите сначала сидер курса.');
    }

    const projectId = projects[0].id;

    return queryInterface.bulkInsert('projectSteps', [
      {
        instructions: 'Добавьте класс "magic-button" к кнопке в HTML.',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "elementExists", "selector": "button.magic-button" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\n        <!-- TODO 3.1: Добавьте класс magic-button к кнопке -->\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n}',
          js: '/*\n  Урок 3: JavaScript для стилизации кнопки\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 3 - изучаем стилизацию кнопки!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Создайте CSS правило для .magic-button с градиентным фоном linear-gradient(135deg, #ff6b6b, #ffa500), белым цветом текста, без границы и padding 20px 40px.',
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": ".magic-button", "property": "background", "contains": "linear-gradient" },
          { "type": "cssRule", "selector": ".magic-button", "property": "background", "contains": "#ff6b6b" },
          { "type": "cssRule", "selector": ".magic-button", "property": "background", "contains": "#ffa500" },
          { "type": "cssRule", "selector": ".magic-button", "property": "color", "expected": "white" },
          { "type": "cssRule", "selector": ".magic-button", "property": "border", "expected": "none" },
          { "type": "cssRule", "selector": ".magic-button", "property": "padding", "expected": "20px 40px" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\n        <button class="magic-button">✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n}\n\n/* TODO 3.2: Создайте базовые стили для .magic-button */\n/* .magic-button {\n    background: linear-gradient(135deg, #ff6b6b, #ffa500);\n    color: white;\n    border: none;\n    padding: 20px 40px;\n} */',
          js: '/*\n  Урок 3: JavaScript для стилизации кнопки\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 3 - изучаем стилизацию кнопки!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Дополните стили кнопки: font-size: 1.5rem, font-weight: bold, border-radius: 50px, cursor: pointer, margin: 20px и box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4).',
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": ".magic-button", "property": "font-size", "expected": "1.5rem" },
          { "type": "cssRule", "selector": ".magic-button", "property": "font-weight", "expected": "bold" },
          { "type": "cssRule", "selector": ".magic-button", "property": "border-radius", "expected": "50px" },
          { "type": "cssRule", "selector": ".magic-button", "property": "cursor", "expected": "pointer" },
          { "type": "cssRule", "selector": ".magic-button", "property": "margin", "expected": "20px" },
          { "type": "cssRule", "selector": ".magic-button", "property": "box-shadow", "contains": "0 10px 25px" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\n        <button class="magic-button">✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n}\n\n.magic-button {\n    background: linear-gradient(135deg, #ff6b6b, #ffa500);\n    color: white;\n    border: none;\n    padding: 20px 40px;\n    /* TODO 3.3: Добавьте дополнительные стили */\n    /* font-size: 1.5rem;\n    font-weight: bold;\n    border-radius: 50px;\n    cursor: pointer;\n    margin: 20px;\n    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4); */\n}',
          js: '/*\n  Урок 3: JavaScript для стилизации кнопки\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 3 - изучаем стилизацию кнопки!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте свойства transition: all 0.3s ease, text-transform: uppercase и letter-spacing: 1px к кнопке.',
        order: 4,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": ".magic-button", "property": "transition", "contains": "all 0.3s ease" },
          { "type": "cssRule", "selector": ".magic-button", "property": "text-transform", "expected": "uppercase" },
          { "type": "cssRule", "selector": ".magic-button", "property": "letter-spacing", "expected": "1px" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\n        <button class="magic-button">✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n}\n\n.magic-button {\n    background: linear-gradient(135deg, #ff6b6b, #ffa500);\n    color: white;\n    border: none;\n    padding: 20px 40px;\n    font-size: 1.5rem;\n    font-weight: bold;\n    border-radius: 50px;\n    cursor: pointer;\n    margin: 20px;\n    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);\n    /* TODO 3.4: Добавьте анимации и типографику */\n    /* transition: all 0.3s ease;\n    text-transform: uppercase;\n    letter-spacing: 1px; */\n}',
          js: '/*\n  Урок 3: JavaScript для стилизации кнопки\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 3 - изучаем стилизацию кнопки!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Создайте CSS правило для .magic-button:hover с эффектами: transform: scale(1.1) rotate(2deg), box-shadow: 0 15px 35px rgba(255, 107, 107, 0.6) и измененным градиентом background: linear-gradient(135deg, #ff5252, #ff8f00).',
        order: 5,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": ".magic-button:hover", "property": "transform", "contains": "scale(1.1)" },
          { "type": "cssRule", "selector": ".magic-button:hover", "property": "transform", "contains": "rotate(2deg)" },
          { "type": "cssRule", "selector": ".magic-button:hover", "property": "box-shadow", "contains": "0 15px 35px" },
          { "type": "cssRule", "selector": ".magic-button:hover", "property": "background", "contains": "#ff5252" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\n        <button class="magic-button">✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n}\n\n.magic-button {\n    background: linear-gradient(135deg, #ff6b6b, #ffa500);\n    color: white;\n    border: none;\n    padding: 20px 40px;\n    font-size: 1.5rem;\n    font-weight: bold;\n    border-radius: 50px;\n    cursor: pointer;\n    margin: 20px;\n    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);\n    transition: all 0.3s ease;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n\n/* TODO 3.5: Добавьте эффект при наведении */\n/* .magic-button:hover {\n    transform: scale(1.1) rotate(2deg);\n    box-shadow: 0 15px 35px rgba(255, 107, 107, 0.6);\n    background: linear-gradient(135deg, #ff5252, #ff8f00);\n} */',
          js: '/*\n  Урок 3: JavaScript для стилизации кнопки\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 3 - изучаем стилизацию кнопки!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте CSS правило для .magic-button:active с эффектом при нажатии: transform: scale(0.95) rotate(-1deg).',
        order: 6,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": ".magic-button:active", "property": "transform", "contains": "scale(0.95)" },
          { "type": "cssRule", "selector": ".magic-button:active", "property": "transform", "contains": "rotate(-1deg)" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p class="subtitle">Нажми на кнопку и увидишь магию!</p>\n        <button class="magic-button">✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n.subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n}\n\n.magic-button {\n    background: linear-gradient(135deg, #ff6b6b, #ffa500);\n    color: white;\n    border: none;\n    padding: 20px 40px;\n    font-size: 1.5rem;\n    font-weight: bold;\n    border-radius: 50px;\n    cursor: pointer;\n    margin: 20px;\n    box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);\n    transition: all 0.3s ease;\n    text-transform: uppercase;\n    letter-spacing: 1px;\n}\n\n.magic-button:hover {\n    transform: scale(1.1) rotate(2deg);\n    box-shadow: 0 15px 35px rgba(255, 107, 107, 0.6);\n    background: linear-gradient(135deg, #ff5252, #ff8f00);\n}\n\n/* TODO 3.6: Добавьте эффект при нажатии */\n/* .magic-button:active {\n    transform: scale(0.95) rotate(-1deg);\n} */',
          js: '/*\n  Урок 3: JavaScript для стилизации кнопки\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 3 - изучаем стилизацию кнопки!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 3: Стилизация кнопки' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      const projectId = projects[0].id;
      return queryInterface.bulkDelete('projectSteps', {
        project_id: projectId
      });
    }
  }
};