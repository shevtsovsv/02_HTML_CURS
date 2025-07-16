
"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Добавляем новую колонку `project_id` в таблицу `userProgresses`
    await queryInterface.addColumn("userProgresses", "project_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      // Создаем внешний ключ, который ссылается на `id` в таблице `projects`
      references: {
        model: "projects", // Имя таблицы, на которую ссылаемся
        key: "id",
      },
      onUpdate: "CASCADE", // При обновлении ID проекта, он обновится и здесь
      onDelete: "CASCADE", // При удалении проекта, все записи о прогрессе для него тоже удалятся
    });
  },

  async down(queryInterface, Sequelize) {
    // При откате миграции - удаляем эту колонку
    await queryInterface.removeColumn("userProgresses", "project_id");
  },
};