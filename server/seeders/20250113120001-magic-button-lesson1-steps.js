'use strict';

/**
 * @file seeders/...-magic-button-lesson1-steps.js
 * @description Сидер для создания шагов урока 1 "Базовая HTML структура"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Получаем ID проекта "Урок 1"
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 1: Базовая HTML структура' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error('Проект "Урок 1: Базовая HTML структура" не найден. Запустите сначала сидер курса.');
    }

    const projectId = projects[0].id;
    console.log('Создаем шаги для проекта ID:', projectId);

    return queryInterface.bulkInsert('projectSteps', [
      {
        instructions: 'Добавьте DOCTYPE и базовую структуру HTML документа с тегами html, head и body.',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "hasDoctype", "expected": "html" },
          { "type": "elementExists", "selector": "html" },
          { "type": "elementExists", "selector": "head" },
          { "type": "elementExists", "selector": "body" }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'В секции head добавьте мета-тег для кодировки UTF-8, viewport мета-тег для адаптивности и заголовок страницы "Волшебная кнопка".',
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "elementExists", "selector": "meta[charset='UTF-8']" },
          { "type": "elementExists", "selector": "meta[name='viewport'][content*='width=device-width']" },
          { "type": "elementExists", "selector": "title" },
          { "type": "elementText", "selector": "title", "expected": "Волшебная кнопка" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <!-- TODO: 1.2.1 Добавьте мета-тег для кодировки UTF-8 -->\n    \n    <!-- TODO: 1.2.2 Добавьте viewport мета-тег для адаптивности -->\n    \n    <!-- TODO: 1.2.3 Добавьте заголовок страницы "Волшебная кнопка" -->\n    \n</head>\n<body>\n\n</body>\n</html>',
          css: '/* \n  Урок 1: Стили для базовой HTML структуры\n  \n  Пока что этот файл пустой - стили мы начнем добавлять в уроке 2\n  \n  TODO: В уроке 2 добавим стили для body и остальных элементов\n*/',
          js: '/*\n  Урок 1: JavaScript для базовой HTML структуры\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button готов к изучению JavaScript!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'В body создайте div-контейнер, добавьте заголовок h1 с текстом "Волшебная кнопка", параграф с описанием "Нажми на кнопку и увидишь магию!" и кнопку с текстом "✨ Магия! ✨".',
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "elementExists", "selector": "div" },
          { "type": "elementExists", "selector": "h1" },
          { "type": "elementText", "selector": "h1", "expected": "Волшебная кнопка" },
          { "type": "elementExists", "selector": "p" },
          { "type": "elementText", "selector": "p", "expected": "Нажми на кнопку и увидишь магию!" },
          { "type": "elementExists", "selector": "button" },
          { "type": "elementText", "selector": "button", "expected": "✨ Магия! ✨" }
        ]),
        starterCode: JSON.stringify({
          html: '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Волшебная кнопка</title>\n</head>\n<body>\n    <!-- TODO: 1.3.1 Создайте div-контейнер для содержимого -->\n    \n        <!-- TODO: 1.3.2 Добавьте заголовок первого уровня "Волшебная кнопка" -->\n        \n        <!-- TODO: 1.3.3 Добавьте параграф с описанием "Нажми на кнопку и увидишь магию!" -->\n        \n        <!-- TODO: 1.3.4 Добавьте кнопку с текстом "✨ Магия! ✨" -->\n    \n</body>\n</html>',
          css: '/* \n  Урок 1: Стили для базовой HTML структуры\n  \n  Пока что этот файл пустой - стили мы начнем добавлять в уроке 2\n  \n  TODO: В уроке 2 добавим стили для body и остальных элементов\n*/',
          js: '/*\n  Урок 1: JavaScript для базовой HTML структуры\n  \n  Пока что этот файл пустой - JavaScript логику мы начнем добавлять в уроке 4\n*/\n\nconsole.log("Magic Button готов к изучению JavaScript!");'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем шаги урока 1
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 1: Базовая HTML структура' 
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