"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем колонку 'slug' в таблицу 'courses'
    await queryInterface.addColumn("courses", "slug", {
      type: Sequelize.STRING,
      allowNull: true, // или false, если слаг обязателен
    });
  },

  async down(queryInterface, Sequelize) {
    // Удаляем колонку 'slug' из таблицы 'courses' при откате миграции
    await queryInterface.removeColumn("courses", "slug");
  },
};
