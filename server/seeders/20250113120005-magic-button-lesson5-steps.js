"use strict";

/**
 * @file seeders/...-magic-button-lesson5-steps.js
 * @description Сидер для создания шагов урока 5 "Интерфейс статистики"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 5: Интерфейс статистики' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error('Проект "Урок 5: Интерфейс статистики" не найден.');
    }

    const projectId = projects[0].id;

    return queryInterface.bulkInsert("projectSteps", [
      {
        instructions:
          'Добавьте блок статистики в HTML: div с классом "stats", заголовок h3 "Статистика магии:" и параграф с span id="click-counter".',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          { type: "elementExists", selector: "div.stats" },
          { type: "elementExists", selector: "h3" },
          { type: "elementExists", selector: "#click-counter" },
        ]),
        starterCode: JSON.stringify({
          html: "Готовый HTML с кнопкой + TODO для добавления блока статистики",
          css: "Готовые стили предыдущих уроков + TODO для .stats",
          js: "Готовый JS с обработчиком + TODO для обновления счетчика",
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          "Добавьте CSS стили для .stats: background rgba(255, 255, 255, 0.2), padding 20px, border-radius 15px, margin-top 30px.",
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          {
            type: "cssRule",
            selector: ".stats",
            property: "background",
            contains: "rgba(255, 255, 255, 0.2)",
          },
          {
            type: "cssRule",
            selector: ".stats",
            property: "padding",
            expected: "20px",
          },
        ]),
        starterCode: JSON.stringify({
          html: "HTML с добавленным блоком статистики",
          css: "Стили + TODO для .stats правила",
          js: "JavaScript логика урока 4",
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        instructions:
          "Получите ссылку на элемент счетчика и обновите обработчик клика для показа количества кликов на экране.",
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          { type: "jsVariableExists", name: "clickCounterElement" },
          { type: "jsFunction", name: "getElementById", called: true },
        ]),
        starterCode: JSON.stringify({
          html: "Полный HTML с блоком статистики",
          css: "Полные стили с .stats",
          js: "JavaScript + TODO для обновления DOM",
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 5: Интерфейс статистики' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      return queryInterface.bulkDelete("projectSteps", {
        project_id: projects[0].id,
      });
    }
  },
};
