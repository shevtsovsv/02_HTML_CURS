"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projects",
      [
        {
          title: "Моя первая веб-страница",
          description:
            "Создайте свою первую полноценную веб-страницу, изучив основы HTML: заголовки разных уровней, абзацы, изображения и списки. Этот проект познакомит вас с базовой структурой веб-страниц.",
          // Стартовый HTML-шаблон для пользователя
          html_template: "<!DOCTYPE html>\n<html>\n<head>\n  <!-- Ваш код заголовка здесь -->\n</head>\n<body>\n  <!-- Ваш код страницы здесь -->\n</body>\n</html>",
          // Стартовый CSS-шаблон (пока простой)
          css_template: "/* Ваши стили здесь */",
          // JS нам пока не нужен
          js_template: "// Ваш JS здесь",
          order: 1, // Первый проект в курсе
          course_id: 1, // Ссылка на наш курс 'Основы HTML и CSS'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projects", { title: "Моя первая веб-страница" }, {});
  },
};