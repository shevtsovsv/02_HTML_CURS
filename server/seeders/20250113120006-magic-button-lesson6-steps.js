'use strict';

/**
 * @file seeders/...-magic-button-lesson6-steps.js
 * @description Сидер для создания шагов урока 6 "Финальные улучшения"
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 6: Финальные улучшения' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length === 0) {
      throw new Error('Проект "Урок 6: Финальные улучшения" не найден.');
    }

    const projectId = projects[0].id;

    return queryInterface.bulkInsert('projectSteps', [
      {
        instructions: 'Обновите стили .game-container для стеклянного дизайна: background rgba(255, 255, 255, 0.1), backdrop-filter blur(10px), border-radius 20px.',
        order: 1,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "cssRule", "selector": ".game-container", "property": "background", "contains": "rgba(255, 255, 255, 0.1)" },
          { "type": "cssRule", "selector": ".game-container", "property": "backdrop-filter", "contains": "blur" }
        ]),
        starterCode: JSON.stringify({
          html: 'Полный HTML из урока 5',
          css: 'Стили урока 5 + TODO для улучшения .game-container',
          js: 'JavaScript урока 5'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Добавьте функцию playClickSound() для воспроизведения звука с помощью Web Audio API.',
        order: 2,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "jsFunctionExists", "name": "playClickSound" },
          { "type": "jsFunction", "name": "AudioContext", "called": true }
        ]),
        starterCode: JSON.stringify({
          html: 'Финальный HTML',
          css: 'Стили со стеклянным дизайном',
          js: 'JavaScript + TODO для функции звука'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Создайте систему достижений: функцию checkAchievements() и div для отображения достижений.',
        order: 3,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "jsFunctionExists", "name": "checkAchievements" },
          { "type": "elementExists", "selector": "#achievements" }
        ]),
        starterCode: JSON.stringify({
          html: 'HTML + div для достижений',
          css: 'Финальные стили + .achievement класс',
          js: 'Полный JavaScript с достижениями'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        instructions: 'Финальная проверка: убедитесь, что все работает - кнопка кликабельна, счетчик обновляется, звуки играют, достижения показываются.',
        order: 4,
        project_id: projectId,
        validationRules: JSON.stringify([
          { "type": "elementExists", "selector": ".magic-button" },
          { "type": "jsEventListener", "event": "click", "exists": true },
          { "type": "jsFunctionExists", "name": "playClickSound" },
          { "type": "jsFunctionExists", "name": "checkAchievements" }
        ]),
        starterCode: JSON.stringify({
          html: 'Готовый HTML игры',
          css: 'Готовые стили игры',
          js: 'Готовый JavaScript игры'
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    const projects = await queryInterface.sequelize.query(
      `SELECT id FROM projects WHERE title = 'Урок 6: Финальные улучшения' 
       AND course_id = (SELECT id FROM courses WHERE slug = 'magic-button-javascript')`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (projects.length > 0) {
      return queryInterface.bulkDelete('projectSteps', { project_id: projects[0].id });
    }
  }
};