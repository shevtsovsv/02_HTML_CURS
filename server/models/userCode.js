/**
 * @file models/usercode.js
 * @description Модель Sequelize для хранения кода, написанного пользователем.
 * Эта таблица позволяет сохранять состояние редакторов (HTML, CSS, JS) для каждого
 * проекта, над которым работает пользователь, чтобы он мог вернуться к работе позже.
 */

module.exports = (sequelize, DataTypes) => {
  const userCode = sequelize.define("userCode", {
    /**
     * @property {string} html
     * @description HTML-код, введенный пользователем.
     */
    html: {
      type: DataTypes.TEXT,
      // defaultValue "" позволяет создавать запись, даже если пользователь еще ничего не ввел.
      defaultValue: "",
    },

    /**
     * @property {string} css
     * @description CSS-код, введенный пользователем.
     */
    css: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    /**
     * @property {string} js
     * @description JavaScript-код, введенный пользователем.
     */
    js: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  });

  /**
   * @description Определение связей (ассоциаций) модели userCode с другими моделями.
   */
  userCode.associate = (models) => {
    // Каждая запись кода принадлежит одному пользователю (User).
    userCode.belongsTo(models.user, {
      foreignKey: {
        name: "user_id",
        allowNull: false, // Код не может существовать без пользователя
      },
      as: "user",
    });

    // Каждая запись кода относится к одному проекту (Project).
    userCode.belongsTo(models.project, {
      foreignKey: {
        name: "project_id",
        allowNull: false, // Код не может существовать без проекта
      },
      as: "project",
    });
  };

  return userCode;
};
