/**
 * @file models/project.js
 * @description Модель Sequelize, представляющая "Проект" или "Задачу" внутри курса.
 * Каждый проект - это отдельное практическое задание для пользователя,
 * состоящее из нескольких шагов (projectStep).
 */

module.exports = (sequelize, DataTypes) => {
  const project = sequelize.define("project", {
    /**
     * @property {string} title
     * @description Название проекта, которое видит пользователь. Например, "Создать карточку профиля".
     */
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * @property {number} order
     * @description Порядковый номер проекта внутри курса. Используется для сортировки и
     * определения последовательности обучения. Начинается с 0 или 1.
     */
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    /**
     * @property {string} description
     * @description Подробное описание задачи проекта, общие цели и ожидаемый результат.
     */
    description: DataTypes.TEXT,

    /**
     * @property {string} html_template
     * @description Стартовый HTML-код, который будет загружен в редактор пользователя
     * в самом начале работы над проектом. Может содержать закомментированные подсказки.
     */
    html_template: DataTypes.TEXT,

    /**
     * @property {string} css_template
     * @description Стартовый CSS-код для проекта.
     */
    css_template: DataTypes.TEXT,

    /**
     * @property {string} js_template
     * @description Стартовый JavaScript-код для проекта.
     */
    js_template: DataTypes.TEXT,
  });

  /**
   * @description Определение связей (ассоциаций) модели Project с другими моделями.
   * Этот метод автоматически вызывается Sequelize при инициализации всех моделей.
   */
  project.associate = (models) => {
    // Связь "Один-ко-Многим": Каждый проект принадлежит одному курсу (Course).
    // `belongsTo` добавляет внешний ключ `course_id` в таблицу `projects`.
    project.belongsTo(models.course, {
      foreignKey: "course_id",
      as: "course", // Псевдоним для удобного доступа: `project.course`
    });

    // Связь "Один-ко-Многим": У каждого проекта может быть много шагов (ProjectStep).
    // `hasMany` добавляет внешний ключ `project_id` в таблицу `projectSteps`.
    project.hasMany(models.projectStep, {
      foreignKey: "project_id",
      as: "steps", // Псевдоним для удобного доступа: `project.steps`
    });

    // Связь с кодом пользователя. У одного проекта может быть много записей кода (от разных юзеров).
    project.hasMany(models.userCode, {
      foreignKey: "project_id",
      as: "userCodes", // ВАЖНО: alias должен совпадать с тем, что в `include`
    });
  };

  return project;
};
