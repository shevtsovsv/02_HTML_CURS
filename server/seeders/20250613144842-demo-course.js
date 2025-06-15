"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Вставляем данные в таблицу 'courses'
    await queryInterface.bulkInsert(
      "courses",
      [
        {
          title: "Основы HTML и CSS",
          description:
            "Курс для начинающих, который научит вас создавать структуру и стилизовать веб-страницы.",
          // Добавляем slug, как и планировали
          slug: "html-css-basics",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляет все записи из таблицы 'courses' при откате
    await queryInterface.bulkDelete("courses", null, {});
  },
};
