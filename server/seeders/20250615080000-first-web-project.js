"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projects",
      [
        {
          title: "Моя первая веб-страница",
          description:
            "Создайте свою первую полноценную веб-страницу с заголовками, абзацами, изображениями и списками. Изучите основы HTML разметки.",
          // Стартовый HTML-шаблон для пользователя
          html_template: "<!DOCTYPE html>\n<html lang=\"ru\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <title>Моя первая страница</title>\n</head>\n<body>\n  <!-- Ваш код здесь -->\n</body>\n</html>",
          // Стартовый CSS-шаблон (минимальный)
          css_template: "/* Здесь можно добавить стили */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n}",
          // JS не нужен для этого проекта
          js_template: "// JavaScript не требуется для этого проекта",
          order: 0, // Делаем это самым первым проектом
          course_id: 1, // Ссылка на курс 'Основы HTML и CSS'
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    // Обновляем порядковый номер существующего проекта "Карточка профиля"
    await queryInterface.sequelize.query(
      'UPDATE projects SET `order` = 2 WHERE title = "Карточка профиля"'
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projects", {
      title: "Моя первая веб-страница"
    }, {});
    
    // Возвращаем порядковый номер проекта "Карточка профиля" обратно
    await queryInterface.sequelize.query(
      'UPDATE projects SET `order` = 1 WHERE title = "Карточка профиля"'
    );
  },
};