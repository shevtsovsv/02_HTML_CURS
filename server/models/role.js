/**
 * @file models/role.js
 * @description Модель Sequelize для сущности "Роль пользователя".
 * Определяет уровень доступа и права пользователя в системе.
 * Используется для реализации Role-Based Access Control (RBAC).
 */

module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define("role", {
    /**
     * @property {string} name
     * @description Название роли. Должно быть уникальным.
     * @example
     * // 'user', 'admin', 'moderator', 'content_creator'
     */
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Названия ролей должны быть уникальными.
    },
  });

  /**
   * @description Определение связей (ассоциаций) модели Role с другими моделями.
   */
  role.associate = (models) => {
    // Связь "Один-ко-Многим": У одной роли может быть много пользователей (User).
    // `hasMany` добавляет внешний ключ `role_id` в таблицу `users`.
    role.hasMany(models.user, {
      foreignKey: "role_id",
      as: "users", // Позволяет получить всех пользователей с этой ролью: `role.users`
    });
  };

  return role;
};
