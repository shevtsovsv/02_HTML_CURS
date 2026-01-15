"use strict";

/**
 * @file seeders/...-magic-button-lesson2-steps.js
 * @description Сидер для создания шагов урока 2 "CSS стили"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Получаем ID проекта "Урок 2"
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 2: CSS стили' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error(
        'Проект "Урок 2: CSS стили" не найден. Запустите сначала сидер курса.'
      );
    }

    const projectId = projects[0].id;

    return queryInterface.bulkInsert("projectSteps", [
      {
        instructions:
          'Добавьте CSS правило для body с шрифтом "Segoe UI", Tahoma, Geneva, Verdana, sans-serif.',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          {
            type: "cssRule",
            selector: "body",
            property: "font-family",
            expected: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          },
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div>\n        <h1>Волшебная кнопка</h1>\n        <p>Нажми на кнопку и увидишь магию!</p>\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: '/* \n  Урок 2: Создаем стили CSS\n*/\n\n/* \n  TODO 2.1.1: Настройте шрифт для body\n  Добавьте font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n*/',
          js: '/*\n  Урок 2: JavaScript для CSS урока\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 2 - изучаем CSS!");',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          "Добавьте к правилу body градиентный фон: linear-gradient(135deg, #667eea 0%, #764ba2 100%).",
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          {
            type: "cssRule",
            selector: "body",
            property: "background",
            contains: "linear-gradient",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "background",
            contains: "135deg",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "background",
            contains: "#667eea",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "background",
            contains: "#764ba2",
          },
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div>\n        <h1>Волшебная кнопка</h1>\n        <p>Нажми на кнопку и увидишь магию!</p>\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    /* TODO 2.1.2: Добавьте градиентный фон */\n    /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */\n}',
          js: '/*\n  Урок 2: JavaScript для CSS урока\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 2 - изучаем CSS!");',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          "Добавьте к body нулевые отступы (margin: 0; padding: 0;), высоту min-height: 100vh и настройте Flexbox для центрирования (display: flex; align-items: center; justify-content: center;).",
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          {
            type: "cssRule",
            selector: "body",
            property: "margin",
            expected: "0",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "padding",
            expected: "0",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "min-height",
            expected: "100vh",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "display",
            expected: "flex",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "align-items",
            expected: "center",
          },
          {
            type: "cssRule",
            selector: "body",
            property: "justify-content",
            expected: "center",
          },
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div>\n        <h1>Волшебная кнопка</h1>\n        <p>Нажми на кнопку и увидишь магию!</p>\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    /* TODO 2.1.3: Добавьте нулевые отступы */\n    /* margin: 0; */\n    /* padding: 0; */\n    /* TODO 2.1.4: Установите высоту */\n    /* min-height: 100vh; */\n    /* TODO 2.1.5: Настройте Flexbox для центрирования */\n    /* display: flex; */\n    /* align-items: center; */\n    /* justify-content: center; */\n}',
          js: '/*\n  Урок 2: JavaScript для CSS урока\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 2 - изучаем CSS!");',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          'Добавьте класс "game-container" к div в HTML, установите белый цвет текста для body (color: white;) и создайте CSS правило для .game-container с text-align: center.',
        order: 4,
        project_id: projectId,
        validationRules: JSON.stringify([
          { type: "elementExists", selector: "div.game-container" },
          {
            type: "cssRule",
            selector: "body",
            property: "color",
            expected: "white",
          },
          {
            type: "cssRule",
            selector: ".game-container",
            property: "text-align",
            expected: "center",
          },
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <!-- TODO 2.2.1: Добавьте класс game-container к div -->\n    <div>\n        <h1>Волшебная кнопка</h1>\n        <p>Нажми на кнопку и увидишь магию!</p>\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    /* TODO 2.1.6: Установите цвет текста белый */\n    /* color: white; */\n}\n\n/* TODO 2.2.2: Создайте правило для .game-container */\n/* .game-container {\n    text-align: center;\n} */',
          js: '/*\n  Урок 2: JavaScript для CSS урока\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 2 - изучаем CSS!");',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          "Создайте CSS правило для h1 с размером шрифта 2.5rem, отступом снизу 10px и тенью текста 0 2px 4px rgba(0, 0, 0, 0.3).",
        order: 5,
        project_id: projectId,
        validationRules: JSON.stringify([
          {
            type: "cssRule",
            selector: "h1",
            property: "font-size",
            expected: "2.5rem",
          },
          {
            type: "cssRule",
            selector: "h1",
            property: "margin-bottom",
            expected: "10px",
          },
          {
            type: "cssRule",
            selector: "h1",
            property: "text-shadow",
            contains: "0 2px 4px rgba(0, 0, 0, 0.3)",
          },
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <p>Нажми на кнопку и увидишь магию!</p>\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\n/* TODO 2.3: Стилизуйте заголовок h1 */\n/* h1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n} */',
          js: '/*\n  Урок 2: JavaScript для CSS урока\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 2 - изучаем CSS!");',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          'Добавьте класс "subtitle" к параграфу в HTML и создайте CSS правило для .subtitle с размером шрифта 1.2rem, отступом снизу 30px и прозрачностью 0.9.',
        order: 6,
        project_id: projectId,
        validationRules: JSON.stringify([
          { type: "elementExists", selector: "p.subtitle" },
          {
            type: "cssRule",
            selector: ".subtitle",
            property: "font-size",
            expected: "1.2rem",
          },
          {
            type: "cssRule",
            selector: ".subtitle",
            property: "margin-bottom",
            expected: "30px",
          },
          {
            type: "cssRule",
            selector: ".subtitle",
            property: "opacity",
            expected: "0.9",
          },
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n    <link rel="stylesheet" href="style.css">\n</head>\n<body>\n    <div class="game-container">\n        <h1>Волшебная кнопка</h1>\n        <!-- TODO 2.4.1: Добавьте класс subtitle к параграфу -->\n        <p>Нажми на кнопку и увидишь магию!</p>\n        <button>✨ Магия! ✨</button>\n    </div>\n</body>\n</html>',
          css: 'body {\n    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;\n    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n    margin: 0;\n    padding: 0;\n    min-height: 100vh;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    color: white;\n}\n\n.game-container {\n    text-align: center;\n}\n\nh1 {\n    font-size: 2.5rem;\n    margin-bottom: 10px;\n    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);\n}\n\n/* TODO 2.4.2: Создайте правило для .subtitle */\n/* .subtitle {\n    font-size: 1.2rem;\n    margin-bottom: 30px;\n    opacity: 0.9;\n} */',
          js: '/*\n  Урок 2: JavaScript для CSS урока\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button урок 2 - изучаем CSS!");',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 2: CSS стили' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      const projectId = projects[0].id;
      return queryInterface.bulkDelete("projectSteps", {
        project_id: projectId,
      });
    }
  },
};
