"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Ищем курс по названию (подставьте уникальный признак, если у вас slug)
      const courseTitle = "Основы HTML и CSS";
      const [course] = await queryInterface.sequelize.query(
        "SELECT id FROM courses WHERE title = :title LIMIT 1",
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { title: courseTitle },
          transaction: t,
        }
      );

      if (!course) {
        throw new Error(
          `Не найден курс "${courseTitle}". Засидьте курс(ы) перед проектами или создайте соответствующий seeder.`
        );
      }

      await queryInterface.bulkInsert(
        "projects",
        [
          {
            title: "Моя первая веб-страница",
            description:
              "Создайте свою первую полноценную веб-страницу с заголовками, абзацами, изображениями и списками. Изучите основы HTML разметки.",
            html_template:
              '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Моя первая страница</title>\n</head>\n<body>\n  <!-- Ваш код здесь -->\n</body>\n</html>',
            css_template:
              "/* Здесь можно добавить стили */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 20px;\n}",
            js_template: "// JavaScript не требуется для этого проекта",
            order: 0,
            course_id: course.id, // Используем найденный id
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t }
      );

      // Обновляем order у существующего проекта "Карточка профиля"
      await queryInterface.sequelize.query(
        'UPDATE projects SET `order` = 2 WHERE title = "Карточка профиля"',
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete(
        "projects",
        { title: "Моя первая веб-страница" },
        { transaction: t }
      );

      await queryInterface.sequelize.query(
        'UPDATE projects SET `order` = 1 WHERE title = "Карточка профиля"',
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },
};
