/**
 * @file seeders/...-initial-users.js
 * @description Сидер для создания администратора и обычного пользователя.
 * ВАЖНО: Этот сидер должен выполняться ПОСЛЕ сидера initial-roles.
 */
"use strict";
const { Op } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Находим ID для ролей 'admin' и 'user'
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('admin', 'user');`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Создаем карту для удобного доступа: { admin: 1, user: 2 } (ID могут отличаться)
    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    if (!roleMap.admin || !roleMap.user) {
      throw new Error(
        "Не удалось найти базовые роли. Убедитесь, что сидер для ролей был запущен."
      );
    }

    // 2. Создаем пользователей
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@app.com",
          // ВАЖНО: Мы вводим пароль в открытом виде здесь,
          // но хук beforeCreate в модели user АВТОМАТИЧЕСКИ захеширует его перед записью в БД.
          password: "adminpassword123",
          role_id: roleMap.admin, // Используем найденный ID
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user@app.com",
          password: "userpassword123",
          role_id: roleMap.user, // Используем найденный ID
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "users",
      {
        email: {
          [Op.in]: ["admin@app.com", "user@app.com"],
        },
      },
      {}
    );
  },
};
