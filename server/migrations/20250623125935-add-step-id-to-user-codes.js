"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("userCodes", "step_id", {
      type: Sequelize.INTEGER,
      allowNull: false, // Каждый код должен быть привязан к шагу
      references: {
        model: "projectSteps", // Имя таблицы шагов
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE", // Если шаг удаляется, удаляем и связанный код
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("userCodes", "step_id");
  },
};
