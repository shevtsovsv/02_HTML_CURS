/**
 * @file models/course.js
 * @description Модель Sequelize для сущности "Курс".
 * Курс является верхнеуровневой группировкой для набора проектов (project),
 * объединенных одной темой. Например, "Основы JavaScript" или "Продвинутый CSS".
 */

module.exports = (sequelize, DataTypes) => {
  const course = sequelize.define("course", {
    /**
     * @property {string} title
     * @description Основное название курса, видимое пользователям.
     */
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    /**
     * @property {string} slug
     * @description Уникальная, человеко-понятная строка для использования в URL.
     * Генерируется из title. Например, "Основы HTML и CSS" -> "osnovy-html-i-css".
     * Используется для SEO и более чистых ссылок.
     */
    slug: {
      type: DataTypes.STRING,
      unique: true, // Слаг должен быть уникальным, чтобы URL не пересекались.
    },

    /**
     * @property {string} description
     * @description Краткое описание курса, объясняющее, чему научится пользователь.
     */
    description: DataTypes.TEXT,
  });

  /**
   * @description Определение связей (ассоциаций) модели Course с другими моделями.
   */
  course.associate = (models) => {
    // Связь "Один-ко-Многим": У одного курса может быть много проектов (Project).
    // `hasMany` добавляет внешний ключ `course_id` в таблицу `projects`.
    course.hasMany(models.project, {
      foreignKey: "course_id",
      as: "projects", // Позволяет получать все проекты курса через `course.projects`
    });
  };

  return course;
};
