/**
 * @file seeders/...-initial-users.js
 * @description Сидер для создания администратора и обычного пользователя.
 * ВАЖНО: Этот сидер должен выполняться ПОСЛЕ сидера initial-roles.
 */
"use strict";
const { Op } = require("sequelize");
const bcrypt = require("bcrypt"); // <--- 1. Импортируем bcrypt

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Находим ID для ролей 'admin' и 'user'
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name IN ('admin', 'user');`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const roleMap = roles.reduce((acc, role) => {
      acc[role.name] = role.id;
      return acc;
    }, {});

    if (!roleMap.admin || !roleMap.user) {
      throw new Error(
        "Не удалось найти базовые роли. Убедитесь, что сидер для ролей был запущен."
      );
    }

    // 2. Хешируем пароли перед вставкой
    const salt = await bcrypt.genSalt(10);
    const hashedPasswordAdmin = await bcrypt.hash("adminpassword123", salt);
    const hashedPasswordUser = await bcrypt.hash("userpassword123", salt);

    // 3. Создаем пользователей с уже захешированными паролями
    await queryInterface.bulkInsert(
      "users",
      [
        {
          email: "admin@app.com",
          password: hashedPasswordAdmin, // <--- Используем хеш
          role_id: roleMap.admin,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: "user@app.com",
          password: hashedPasswordUser, // <--- Используем хеш
          role_id: roleMap.user,
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
