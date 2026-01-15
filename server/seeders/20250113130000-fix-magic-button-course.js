"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // 1. Удаляем все старые проекты курса "Волшебная кнопка"
      console.log("Удаляем старые проекты курса Волшебная кнопка...");

      // Простой способ - удалим все проекты курса 13
      await queryInterface.bulkDelete(
        "projects",
        { course_id: 13 },
        { transaction }
      );

      // 2. Создаем один проект с использованием bulkInsert
      console.log("Создаем новый проект...");

      await queryInterface.bulkInsert(
        "projects",
        [
          {
            course_id: 13,
            title: "Волшебная кнопка - Изучение JavaScript",
            description: "Пошаговое создание интерактивной кнопки с JavaScript",
            order: 1,
            html_template:
              '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="UTF-8">\n    <title>Волшебная кнопка</title>\n  </head>\n  <body>\n    \n  </body>\n</html>',
            css_template: "/* Добавьте ваши CSS стили здесь */",
            js_template: "// Добавьте ваш JavaScript код здесь",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction }
      );

      // 3. Получаем ID созданного проекта
      const [projects] = await queryInterface.sequelize.query(
        `
        SELECT id FROM projects WHERE course_id = 13 ORDER BY id DESC LIMIT 1;
      `,
        { transaction }
      );

      const projectId = projects[0].id;
      console.log("Создан проект с ID:", projectId);

      // 4. Создаем 6 шагов для проекта
      const steps = [
        {
          project_id: projectId,
          order: 1,
          instructions:
            "Базовая HTML структура\n\nСоздайте базовую HTML структуру с DOCTYPE, head и body. Добавьте заголовок, описание и кнопку.",
          validationRules: JSON.stringify([
            { type: "hasDoctype", expected: "html" },
            { type: "elementExists", selector: "html" },
            { type: "elementExists", selector: "head" },
            { type: "elementExists", selector: "body" },
            { type: "elementExists", selector: "h1" },
            { type: "elementExists", selector: "p" },
            { type: "elementExists", selector: "button" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          project_id: projectId,
          order: 2,
          instructions:
            "Добавление CSS стилей\n\nДобавьте базовые CSS стили для улучшения внешнего вида страницы. Используйте центрирование, шрифты и цвета.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "style" },
            {
              type: "computedStyle",
              selector: "body",
              property: "text-align",
              expected: "center",
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          project_id: projectId,
          order: 3,
          instructions:
            "Стилизация кнопки\n\nСоздайте красивые стили для кнопки: размер, цвета, эффекты при наведении.",
          validationRules: JSON.stringify([
            {
              type: "computedStyle",
              selector: "button",
              property: "padding",
              expected: "15px 30px",
            },
            {
              type: "computedStyle",
              selector: "button",
              property: "border-radius",
              expected: "25px",
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          project_id: projectId,
          order: 4,
          instructions:
            "JavaScript логика\n\nДобавьте JavaScript код для обработки кликов по кнопке. Реализуйте счетчик кликов и изменение текста.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "script" },
            { type: "jsGlobalDefined", variableName: "clickCount" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          project_id: projectId,
          order: 5,
          instructions:
            "Интерфейс статистики\n\nДобавьте элементы для отображения статистики кликов и создайте функции для их обновления.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: ".stats" },
            { type: "elementExists", selector: "#click-count" },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          project_id: projectId,
          order: 6,
          instructions:
            "Финальные улучшения\n\nДобавьте анимации, звуковые эффекты или другие интерактивные элементы для завершения проекта.",
          validationRules: JSON.stringify([
            {
              type: "computedStyle",
              selector: "button",
              property: "transition",
              expected: "all 0.3s ease",
            },
          ]),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert("projectSteps", steps, { transaction });

      await transaction.commit();
      console.log(
        '✅ Курс "Волшебная кнопка" успешно пересоздан как один проект с 6 шагами!'
      );
    } catch (error) {
      await transaction.rollback();
      console.error("❌ Ошибка при пересоздании курса:", error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Удаляем проект и все связанные данные
      await queryInterface.bulkDelete(
        "projects",
        { course_id: 13 },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
