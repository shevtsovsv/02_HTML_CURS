/**
 * @file models/userpermission.js
 * @description Модель Sequelize для индивидуальных прав пользователя.
 * Эта таблица позволяет назначать пользователю специфические права доступа,
 * которые могут дополнять или переопределять его основную роль.
 * Это более гибкий подход, чем система, основанная только на ролях.
 */

module.exports = (sequelize, DataTypes) => {
  const userPermission = sequelize.define(
    "userPermission",
    {
      /**
       * @property {string} permission
       * @description Строка, описывающая конкретное право доступа.
       * Рекомендуется использовать формат "ресурс:действие".
       * @example
       * // 'course:create', 'project:edit', 'user:delete'
       */
      permission: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      // Добавляем композитный индекс, чтобы избежать дублирования прав.
      // Один и тот же пользователь не может иметь одно и то же право дважды.
      indexes: [
        {
          unique: true,
          fields: ["user_id", "permission"],
        },
      ],
    }
  );

  /**
   * @description Определение связей (ассоциаций) модели userPermission с другими моделями.
   */
  userPermission.associate = (models) => {
    // Каждое право принадлежит одному пользователю (User).
    userPermission.belongsTo(models.user, {
      foreignKey: {
        name: "user_id",
        allowNull: false, // Право не может существовать без пользователя.
      },
      as: "user",
    });
  };

  return userPermission;
};
