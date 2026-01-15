'use strict';

/**
 * @file seeders/...-magic-button-lesson2-steps-simple.js
 * @description Упрощенный сидер для создания шагов урока 2 "CSS стили"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 2: CSS стили' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error('Проект "Урок 2: CSS стили" не найден.');
    }

    const projectId = projects[0].id;

    return queryInterface.bulkInsert('projectSteps', [
      {
        instructions: 'Добавьте CSS правило для body с шрифтом "Segoe UI", Tahoma, Geneva, Verdana, sans-serif.',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": "body", "property": "font-family", "expected": "\"Segoe UI\", Tahoma, Geneva, Verdana, sans-serif" }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте к правилу body градиентный фон: linear-gradient(135deg, #667eea 0%, #764ba2 100%).',
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": "body", "property": "background", "contains": "linear-gradient" },
          { "type": "cssRule", "selector": "body", "property": "background", "contains": "#667eea" }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте к body: margin: 0, padding: 0, min-height: 100vh, display: flex, align-items: center, justify-content: center, color: white.',
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": "body", "property": "margin", "expected": "0" },
          { "type": "cssRule", "selector": "body", "property": "display", "expected": "flex" },
          { "type": "cssRule", "selector": "body", "property": "color", "expected": "white" }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте класс "game-container" к div в HTML и создайте CSS правило .game-container с text-align: center.',
        order: 4,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "elementExists", "selector": "div.game-container" },
          { "type": "cssRule", "selector": ".game-container", "property": "text-align", "expected": "center" }
        ]),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 2: CSS стили' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      return queryInterface.bulkDelete('projectSteps', { project_id: projects[0].id });
    }
  }
};