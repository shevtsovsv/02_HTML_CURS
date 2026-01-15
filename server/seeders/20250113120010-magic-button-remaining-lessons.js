"use strict";

/**
 * @file seeders/...-magic-button-remaining-lessons.js
 * @description Упрощенный сидер для создания шагов уроков 3-6
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Урок 3: Стилизация кнопки
    const lesson3Projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 3: Стилизация кнопки' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (lesson3Projects.length > 0) {
      const projectId3 = lesson3Projects[0].id;
      await queryInterface.bulkInsert("projectSteps", [
        {
          instructions: 'Добавьте класс "magic-button" к кнопке в HTML.',
          order: 1,
          project_id: projectId3,
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "button.magic-button" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          instructions:
            "Создайте CSS правило для .magic-button с градиентным фоном, белым цветом текста, без границы.",
          order: 2,
          project_id: projectId3,
          validationRules: JSON.stringify([
            {
              type: "cssRule",
              selector: ".magic-button",
              property: "background",
              contains: "linear-gradient",
            },
            {
              type: "cssRule",
              selector: ".magic-button",
              property: "color",
              expected: "white",
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          instructions:
            "Добавьте CSS правило для .magic-button:hover с эффектами transform и изменением box-shadow.",
          order: 3,
          project_id: projectId3,
          validationRules: JSON.stringify([
            {
              type: "cssRule",
              selector: ".magic-button:hover",
              property: "transform",
              contains: "scale",
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Урок 4: JavaScript логика
    const lesson4Projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 4: JavaScript логика' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (lesson4Projects.length > 0) {
      const projectId4 = lesson4Projects[0].id;
      await queryInterface.bulkInsert("projectSteps", [
        {
          instructions:
            "Создайте переменную let clickCount = 0; для подсчета кликов.",
          order: 1,
          project_id: projectId4,
          validationRules: JSON.stringify([
            { type: "jsVariableExists", name: "clickCount" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          instructions:
            'Получите ссылку на кнопку с помощью document.querySelector(".magic-button").',
          order: 2,
          project_id: projectId4,
          validationRules: JSON.stringify([
            { type: "jsFunction", name: "querySelector", called: true },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          instructions:
            "Добавьте обработчик события click к кнопке и создайте массив с волшебными фразами.",
          order: 3,
          project_id: projectId4,
          validationRules: JSON.stringify([
            { type: "jsFunction", name: "addEventListener", called: true },
            { type: "jsFunction", name: "alert", called: true },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Урок 5: Интерфейс статистики
    const lesson5Projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 5: Интерфейс статистики' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (lesson5Projects.length > 0) {
      const projectId5 = lesson5Projects[0].id;
      await queryInterface.bulkInsert("projectSteps", [
        {
          instructions:
            'Добавьте блок статистики в HTML: div с классом "stats" и span с id="click-counter".',
          order: 1,
          project_id: projectId5,
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "div.stats" },
            { type: "elementExists", selector: "#click-counter" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          instructions:
            "Добавьте CSS стили для .stats и обновите JavaScript для показа счетчика на экране.",
          order: 2,
          project_id: projectId5,
          validationRules: JSON.stringify([
            {
              type: "cssRule",
              selector: ".stats",
              property: "background",
              contains: "rgba",
            },
            { type: "jsFunction", name: "getElementById", called: true },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    // Урок 6: Финальные улучшения
    const lesson6Projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 6: Финальные улучшения' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (lesson6Projects.length > 0) {
      const projectId6 = lesson6Projects[0].id;
      await queryInterface.bulkInsert("projectSteps", [
        {
          instructions:
            "Обновите стили .game-container для стеклянного дизайна с backdrop-filter.",
          order: 1,
          project_id: projectId6,
          validationRules: JSON.stringify([
            {
              type: "cssRule",
              selector: ".game-container",
              property: "backdrop-filter",
              contains: "blur",
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          instructions:
            "Добавьте функции playClickSound() и checkAchievements() для звуков и достижений.",
          order: 2,
          project_id: projectId6,
          validationRules: JSON.stringify([
            { type: "jsFunctionExists", name: "playClickSound" },
            { type: "jsFunctionExists", name: "checkAchievements" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    console.log("Созданы шаги для уроков 3-6 курса Magic Button");
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем шаги для всех уроков 3-6
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')
       AND title IN ('Урок 3: Стилизация кнопки', 'Урок 4: JavaScript логика', 'Урок 5: Интерфейс статистики', 'Урок 6: Финальные улучшения')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      const projectIds = projects.map((p) => p.id);
      return queryInterface.bulkDelete("projectSteps", {
        project_id: { [Sequelize.Op.in]: projectIds },
      });
    }
  },
};
