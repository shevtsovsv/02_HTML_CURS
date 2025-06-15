/**
 * @file models/userprogress.js
 * @description Модель Sequelize, представляющая прогресс пользователя.
 * Эта таблица-связка (join table) отслеживает, какие шаги (projectStep)
 * какого проекта были выполнены конкретным пользователем.
 */

module.exports = (sequelize, DataTypes) => {
  const userProgress = sequelize.define(
    "userProgress",
    {
      /**
       * @property {boolean} completed
       * @description Флаг, указывающий, завершил ли пользователь данный шаг.
       * `true` - шаг выполнен, `false` (или запись отсутствует) - не выполнен.
       */
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false, // Поле должно иметь значение, не может быть NULL
        defaultValue: false,
      },
    },
    {
      // Эта таблица по своей сути является таблицей-связкой.
      // Уникальный композитный индекс гарантирует, что для пары "пользователь-шаг"
      // может существовать только ОДНА запись о прогрессе.
      indexes: [
        {
          unique: true,
          fields: ["user_id", "step_id"],
        },
      ],
    }
  );

  /**
   * @description Определение связей (ассоциаций) модели userProgress с другими моделями.
   */
  userProgress.associate = (models) => {
    // Каждая запись о прогрессе принадлежит одному пользователю (User).
    userProgress.belongsTo(models.user, {
      foreignKey: {
        name: "user_id",
        allowNull: false,
      },
      as: "user",
    });

    // Каждая запись о прогрессе относится к одному конкретному шагу (ProjectStep).
    userProgress.belongsTo(models.projectStep, {
      foreignKey: {
        name: "step_id",
        allowNull: false,
      },
      as: "step",
    });
  };

  return userProgress;
};
