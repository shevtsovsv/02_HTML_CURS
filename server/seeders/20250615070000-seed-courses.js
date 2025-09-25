"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      const title = "Основы HTML и CSS";

      // Проверяем, есть ли уже такой курс
      const existing = await queryInterface.sequelize.query(
        "SELECT id FROM courses WHERE title = :title LIMIT 1",
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { title },
          transaction: t,
        }
      );

      if (!existing || existing.length === 0) {
        await queryInterface.bulkInsert(
          "courses",
          [
            {
              title,
              // При необходимости добавьте другие поля, если они есть в вашей схеме (например, slug, description и т.д.)
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
          { transaction: t }
        );
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Удаляем именно этот курс
    await queryInterface.bulkDelete(
      "courses",
      { title: "Основы HTML и CSS" },
      {}
    );
  },
};
