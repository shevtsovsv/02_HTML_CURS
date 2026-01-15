'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Удаляем старый проект курса 13
      console.log('Удаляем старый проект курса...');
      await queryInterface.bulkDelete('projects', { course_id: 13 }, { transaction });

      // 2. Создаем новый проект
      console.log('Создаем новый проект с детальными шагами...');
      
      await queryInterface.bulkInsert('projects', [{
        course_id: 13,
        title: 'Волшебная кнопка - Изучение JavaScript',
        description: 'Пошаговое создание интерактивной кнопки с JavaScript',
        order: 1,
        html_template: '<!-- Начните писать ваш HTML код здесь -->',
        css_template: '/* Добавьте ваши CSS стили здесь */',
        js_template: '// Добавьте ваш JavaScript код здесь',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction });

      // 3. Получаем ID созданного проекта
      const [projects] = await queryInterface.sequelize.query(`
        SELECT id FROM projects WHERE course_id = 13 ORDER BY id DESC LIMIT 1;
      `, { transaction });
      
      const projectId = projects[0].id;
      console.log('Создан проект с ID:', projectId);

      // 4. Создаем детальные шаги
      const steps = [
        // Урок 1: HTML структура
        {
          project_id: projectId, order: 1,
          instructions: '**1.1 Добавьте базовую структуру HTML**\n\nНачните с `<!DOCTYPE html>` и добавьте теги `<html>`, `<head>` и `<body>`',
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
          instructions: '**1.2 Заполните секцию head**\n\nДобавьте meta теги для кодировки и viewport, а также title "Волшебная кнопка"',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'meta[charset="UTF-8"]' },
            { type: 'elementExists', selector: 'meta[name="viewport"]' },
            { type: 'elementExists', selector: 'title' },
            { type: 'elementText', selector: 'title', expected: 'Волшебная кнопка' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 3,
          instructions: '**1.3 Создайте контент в body**\n\nВ body добавьте div, заголовок h1 "Волшебная кнопка", параграф "Нажми на кнопку и увидишь магию!" и кнопку "✨ Магия! ✨"',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'body > div' },
            { type: 'elementExists', selector: 'h1' },
            { type: 'elementText', selector: 'h1', expected: 'Волшебная кнопка' },
            { type: 'elementExists', selector: 'p' },
            { type: 'elementExists', selector: 'button' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },

        // Урок 2: CSS стили
        {
          project_id: projectId, order: 4,
          instructions: '**2.1.1 Подключите шрифты**\n\nДобавьте CSS правило для body с font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'style' },
            { type: 'computedStyle', selector: 'body', property: 'font-family', expected: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 5,
          instructions: '**2.1.2 Настройте градиентный фон**\\n\\nДобавьте к body линейный градиент: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'body', property: 'background', expected: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 6,
          instructions: '**2.1.3 Уберите отступы**\\n\\nДобавьте к body `margin: 0` и `padding: 0`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'body', property: 'margin', expected: '0px' },
            { type: 'computedStyle', selector: 'body', property: 'padding', expected: '0px' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 7,
          instructions: '**2.1.4 Установите высоту**\\n\\nДобавьте к body `min-height: 100vh`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'body', property: 'min-height', expected: '100vh' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 8,
          instructions: '**2.1.5 Центрируйте содержимое**\\n\\nДобавьте к body: `display: flex`, `align-items: center`, `justify-content: center`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'body', property: 'display', expected: 'flex' },
            { type: 'computedStyle', selector: 'body', property: 'align-items', expected: 'center' },
            { type: 'computedStyle', selector: 'body', property: 'justify-content', expected: 'center' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 9,
          instructions: '**2.1.6 Установите цвет текста**\\n\\nДобавьте к body `color: white`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'body', property: 'color', expected: 'white' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 10,
          instructions: '**2.2.1 Добавьте класс к div**\\n\\nТегу div присвойте класс `game-container`',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'div.game-container' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 11,
          instructions: '**2.2.2 Центрируйте текст**\\n\\nДобавьте CSS правило для `.game-container` с `text-align: center`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: '.game-container', property: 'text-align', expected: 'center' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 12,
          instructions: '**2.3 Стилизуйте заголовок**\\n\\nДобавьте CSS для h1: `font-size: 2.5rem`, `margin-bottom: 10px`, `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3)`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: 'h1', property: 'font-size', expected: '2.5rem' },
            { type: 'computedStyle', selector: 'h1', property: 'margin-bottom', expected: '10px' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 13,
          instructions: '**2.4 Добавьте стили для параграфа**\\n\\nДобавьте к p класс `subtitle` и CSS: `font-size: 1.2rem`, `margin-bottom: 30px`, `opacity: 0.9`',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'p.subtitle' },
            { type: 'computedStyle', selector: '.subtitle', property: 'font-size', expected: '1.2rem' },
            { type: 'computedStyle', selector: '.subtitle', property: 'opacity', expected: '0.9' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },

        // Урок 3: Стилизация кнопки
        {
          project_id: projectId, order: 14,
          instructions: '**3.1 Создайте класс для кнопки**\\n\\nДобавьте к button класс `magic-button`',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'button.magic-button' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 15,
          instructions: '**3.2 Стилизуйте кнопку**\\n\\nДобавьте CSS для `.magic-button`: градиент `linear-gradient(135deg, #ff6b6b, #ffa500)`, белый цвет, без border, padding `20px 40px`, размер шрифта `1.5rem`, border-radius `50px`',
          validationRules: JSON.stringify([
            { type: 'computedStyle', selector: '.magic-button', property: 'background', expected: 'linear-gradient(135deg, #ff6b6b, #ffa500)' },
            { type: 'computedStyle', selector: '.magic-button', property: 'color', expected: 'white' },
            { type: 'computedStyle', selector: '.magic-button', property: 'border-radius', expected: '50px' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 16,
          instructions: '**3.3 Добавьте эффект при наведении**\\n\\nДобавьте CSS для `.magic-button:hover` с трансформацией `scale(1.1) rotate(2deg)`',
          validationRules: JSON.stringify([
            { type: 'styleRuleExists', selector: '.magic-button:hover' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 17,
          instructions: '**3.4 Добавьте эффект при нажатии**\\n\\nДобавьте CSS для `.magic-button:active` с трансформацией `scale(0.95) rotate(-1deg)`',
          validationRules: JSON.stringify([
            { type: 'styleRuleExists', selector: '.magic-button:active' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },

        // Урок 4: JavaScript логика  
        {
          project_id: projectId, order: 18,
          instructions: '**4.1 Создайте переменную для счетчика**\\n\\nДобавьте в script тег переменную `let clickCount = 0;`',
          validationRules: JSON.stringify([
            { type: 'elementExists', selector: 'script' },
            { type: 'jsGlobalDefined', variableName: 'clickCount' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 19,
          instructions: '**4.2 Получите ссылку на кнопку**\\n\\nСоздайте константу `const magicButton = document.querySelector(".magic-button");`',
          validationRules: JSON.stringify([
            { type: 'jsGlobalDefined', variableName: 'magicButton' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        },
        {
          project_id: projectId, order: 20,
          instructions: '**4.3 Добавьте обработчик события**\\n\\nСоздайте addEventListener для клика на кнопку, который увеличивает clickCount',
          validationRules: JSON.stringify([
            { type: 'jsExpression', expression: 'typeof magicButton.addEventListener === "function"' }
          ]),
          createdAt: new Date(), updatedAt: new Date()
        }
      ];

      await queryInterface.bulkInsert('projectSteps', steps, { transaction });

      await transaction.commit();
      console.log(\`✅ Курс "Волшебная кнопка" пересоздан с \${steps.length} детальными шагами!\`);

    } catch (error) {
      await transaction.rollback();
      console.error('❌ Ошибка при пересоздании курса:', error);
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