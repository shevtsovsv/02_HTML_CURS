"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projectSteps",
      [
        {
          // Шаг 1: HTML-структура
          instructions:
            "Создайте основную структуру карточки. Она должна состоять из главного контейнера с классом `profile-card`, изображения `<img>` и двух параграфов `<p>`.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: ".profile-card" },
            { type: "elementExists", selector: ".profile-card img" },
            { type: "elementExists", selector: ".profile-card p" },
          ]),
          order: 1,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 2: Базовые стили
          instructions:
            "Задайте для карточки (`.profile-card`) ширину `300px` и добавьте фоновый цвет `#f0f0f0`.",
          // JSDOM не умеет проверять CSS, поэтому мы проверяем наличие класса,
          // а логику проверки стилей реализуем позже, или упростим.
          // Для примера, пока оставим так, как будто мы можем это проверить.
          // В реальности мы бы проверяли наличие определенного класса.
          validationRules: JSON.stringify([
            // Это пример. Для реальной проверки стилей потребуется более сложный подход
            // или мы будем проверять только наличие классов, которые пользователь должен добавить.
            {
              type: "computedStyle",
              selector: ".profile-card",
              property: "width",
              expected: "300px",
            },
            {
              type: "computedStyle",
              selector: ".profile-card",
              property: "backgroundColor",
              expected: "rgb(240, 240, 240)",
            },
          ]),
          order: 2,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 3: Текст и рамка
          instructions:
            "Добавьте карточке сплошную черную рамку толщиной `1px` и внутренние отступы `20px`.",
          validationRules: JSON.stringify([
            {
              type: "computedStyle",
              selector: ".profile-card",
              property: "border",
              expected: "1px solid rgb(0, 0, 0)",
            },
            {
              type: "computedStyle",
              selector: ".profile-card",
              property: "padding",
              expected: "20px",
            },
          ]),
          order: 3,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projectSteps", null, {});
  },
};
