"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projects",
      [
        {
          title: "Карточка профиля",
          description:
            "Создайте простую карточку профиля пользователя с аватаром, именем и описанием.",
          // Стартовый HTML-шаблон для пользователя
          html_template: "<div>\n  <!-- Ваш код здесь -->\n</div>",
          // Стартовый CSS-шаблон
          css_template: "/* Ваши стили здесь */",
          // JS нам пока не нужен
          js_template: "// Ваш JS здесь",
          order: 2, // Второй проект в курсе
          course_id: 1, // Ссылка на наш курс 'Основы HTML и CSS'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projects", null, {});
  },
};
