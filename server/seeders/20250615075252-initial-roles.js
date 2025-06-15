/**
 * @file seeders/...-initial-roles.js
 * @description Сидер для создания базовых ролей в системе.
 */
"use strict";

module.exports = {
  // Функция, которая выполняется при запуске сидера
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "roles",
      [
        {
          name: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  // Функция, которая выполняется при откате сидера
  down: async (queryInterface, Sequelize) => {
    // Удаляем только те роли, которые мы создали
    const { Op } = Sequelize;
    await queryInterface.bulkDelete(
      "roles",
      {
        name: {
          [Op.in]: ["admin", "user"],
        },
      },
      {}
    );
  },
};
