'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      console.log('Удаляем старый проект...');
      await queryInterface.bulkDelete('projects', { course_id: 13 }, { transaction });

      console.log('Создаем проект с детальными шагами...');
      
      await queryInterface.bulkInsert('projects', [{
        course_id: 13,
        title: 'Волшебная кнопка - Изучение JavaScript',
        description: 'Пошаговое создание интерактивной кнопки',
        order: 1,
        html_template: '<!-- Начните с DOCTYPE html -->',
        css_template: '/* Добавьте CSS стили */',
        js_template: '// Добавьте JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction });

      const [projects] = await queryInterface.sequelize.query(`
        SELECT id FROM projects WHERE course_id = 13 ORDER BY id DESC LIMIT 1;
      `, { transaction });
      
      const projectId = projects[0].id;
      console.log('Проект создан с ID:', projectId);

      const steps = [
        {
          project_id: projectId, order: 1,
          instructions: 'Добавьте базовую HTML структуру: DOCTYPE, html, head, body',
          validationRules: JSON.stringify([
            { type: 'hasDoctype', expected: 'html' },
            { type: 'elementExists', selector: 'html' },
            { type: 'elementExists', selector: 'head' },
            { type: 'elementExists', selector: 'body' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 2,
          instructions: 'Добавьте в head: meta charset UTF-8, viewport и title "Волшебная кнопка"',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'title' },
            { type: 'elementText', selector: 'title', expected: 'Волшебная кнопка' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 3,
          instructions: 'Создайте в body: div, h1 "Волшебная кнопка", p "Нажми на кнопку и увидишь магию!", button "✨ Магия! ✨"',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'div' },
            { type: 'elementExists', selector: 'h1' },
            { type: 'elementExists', selector: 'p' },
            { type: 'elementExists', selector: 'button' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 4,
          instructions: 'Добавьте style тег и CSS для body: font-family, градиентный фон, margin 0, padding 0',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'style' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 5,
          instructions: 'Добавьте к body: min-height 100vh, display flex, align-items center, justify-content center, color white',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'body', property: 'display', expected: 'flex' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 6,
          instructions: 'Добавьте класс game-container к div и CSS: text-align center',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'div.game-container' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 7,
          instructions: 'Стилизуйте h1: font-size 2.5rem, margin-bottom 10px',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'h1', property: 'font-size', expected: '2.5rem' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 8,
          instructions: 'Добавьте класс subtitle к p и CSS: font-size 1.2rem, opacity 0.9',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'p.subtitle' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 9,
          instructions: 'Добавьте класс magic-button к button',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'button.magic-button' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 10,
          instructions: 'Стилизуйте кнопку: градиент, белый цвет, padding 20px 40px, border-radius 50px',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: '.magic-button', property: 'border-radius', expected: '50px' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 11,
          instructions: 'Добавьте hover эффект для кнопки: transform scale(1.1)',
          validationRules: JSON.stringify([
            { type: 'styleRuleExists', selector: '.magic-button:hover' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 12,
          instructions: 'Добавьте script тег и переменную: let clickCount = 0',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'script' },
            { type: 'jsGlobalDefined', variableName: 'clickCount' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 13,
          instructions: 'Создайте константу: const magicButton = document.querySelector(".magic-button")',
          validationRules: JSON.stringify([
            { type: 'jsGlobalDefined', variableName: 'magicButton' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 14,
          instructions: 'Добавьте обработчик клика: magicButton.addEventListener("click", function() { clickCount++; })',
          validationRules: JSON.stringify([
            { type: 'jsExpression', expression: 'typeof magicButton !== "undefined"' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 15,
          instructions: 'Добавьте в body div со статистикой: class="stats", h3 и p со span id="click-counter"',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: '.stats' },
            { type: 'elementExists', selector: '#click-counter' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        }
      ];

      await queryInterface.bulkInsert('projectSteps', steps, { transaction });

      await transaction.commit();
      console.log(`✅ Создан проект с ${steps.length} шагами!`);

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Ошибка:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete('projects', { course_id: 13 }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};