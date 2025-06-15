/**
 * @file models/projectstep.js
 * @description Модель Sequelize для сущности "Шаг Проекта".
 * Это наименьшая единица учебного процесса. Каждый проект (project) разбит на
 * последовательность таких шагов, которые пользователь должен выполнить один за другим.
 */

module.exports = (sequelize, DataTypes) => {
  const projectStep = sequelize.define("projectStep", {
    /**
     * @property {string} instructions
     * @description Текст задания для текущего шага.
     * Именно эти инструкции пользователь видит в интерфейсе.
     * Например: "Создайте заголовок `<h1>` с текстом 'Привет, мир!'".
     */
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    /**
     * @property {number} order
     * @description Порядковый номер шага внутри проекта. Используется для сортировки
     * и для определения, какой шаг идет за каким.
     */
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    /**
     * @property {object} validationRules
     * @description JSON-объект (массив), содержащий правила для проверки выполнения шага.
     * Эти правила обрабатываются на бэкенде в JSDOM для определения,
     * правильно ли пользователь выполнил задание.
     * @example
     * // [
     * //   { "type": "elementExists", "selector": "h1" },
     * //   { "type": "elementText", "selector": "h1", "expected": "Привет, мир!" }
     * // ]
     */
    validationRules: {
      type: DataTypes.JSON,
      allowNull: false,
      // Важно: defaultValue для JSON в MySQL через Sequelize задается как строка.
      defaultValue: "[]",
    },
  });

  /**
   * @description Определение связей (ассоциаций) модели ProjectStep с другими моделями.
   */
  projectStep.associate = (models) => {
    // Связь "Один-ко-Многим": Каждый шаг принадлежит одному проекту (Project).
    // `belongsTo` добавляет внешний ключ `project_id` в эту таблицу.
    projectStep.belongsTo(models.project, {
      foreignKey: "project_id",
      as: "project", // Псевдоним для доступа: `projectStep.project`
    });
  };

  return projectStep;
};
