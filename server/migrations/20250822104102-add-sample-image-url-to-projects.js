"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем новую колонку `sampleImageUrl` в таблицу `projects`
    await queryInterface.addColumn("projects", "sampleImageUrl", {
      type: Sequelize.STRING, // Или Sequelize.TEXT, если URL могут быть очень длинными
      allowNull: true, // Разрешаем полю быть пустым
    });
  },

  async down(queryInterface, Sequelize) {
    // При откате миграции - удаляем эту колонку
    await queryInterface.removeColumn("projects", "sampleImageUrl");
  },
};
