/**
 * @file models/user.js
 * @description Модель Sequelize для сущности "Пользователь".
 * Хранит основную информацию для аутентификации и идентификации пользователя.
 */

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      /**
       * @property {string} email
       * @description Электронная почта пользователя. Используется как логин.
       * Должна быть уникальной.
       */
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true, // Встроенная валидация формата email
        },
      },

      /**
       * @property {string} password
       * @description Хеш пароля пользователя. **Никогда не храните пароль в открытом виде!**
       * Пароль хешируется автоматически перед сохранением с помощью хука `beforeCreate`.
       */
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      // Определяем "области видимости" (scopes) для контроля над возвращаемыми полями.
      defaultScope: {
        // По умолчанию НИКОГДА не возвращаем хеш пароля.
        attributes: { exclude: ["password"] },
      },
      scopes: {
        // Отдельный scope, который позволяет получить пользователя С паролем.
        // Используется только при логине для проверки пароля.
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  // --- Хуки Sequelize ---

  /**
   * @description Хук, который автоматически хеширует пароль перед созданием нового пользователя.
   */
  user.beforeCreate(async (userInstance) => {
    const salt = await bcrypt.genSalt(10);
    userInstance.password = await bcrypt.hash(userInstance.password, salt);
  });

  // --- Прототипные методы ---

  /**
   * @description Метод для сравнения предоставленного пароля с хешем в базе данных.
   * @param {string} candidatePassword - Пароль, введенный пользователем при логине.
   * @returns {Promise<boolean>} - `true`, если пароли совпадают.
   */
  user.prototype.isValidPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  /**
   * @description Определение связей (ассоциаций) модели User с другими моделями.
   */
  user.associate = (models) => {
    // Каждый пользователь принадлежит одной роли (Role).
    user.belongsTo(models.role, {
      foreignKey: "role_id",
      as: "role",
    });

    // У пользователя может быть много индивидуальных прав (UserPermission).
    user.hasMany(models.userPermission, {
      foreignKey: "user_id",
      as: "userPermissions",
    });

    // У пользователя много записей о прогрессе (по одному на каждый пройденный шаг).
    user.hasMany(models.userProgress, {
      foreignKey: "user_id",
      as: "progress",
    });

    // У пользователя много сохраненных версий кода (по одной на проект).
    user.hasMany(models.userCode, {
      foreignKey: "user_id",
      as: "codeSubmissions",
    });
  };

  return user;
};
