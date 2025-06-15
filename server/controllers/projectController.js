/**
 * @file controllers/projectController.js
 * @description Контроллер для всех операций, связанных с проектами (заданиями).
 */

const { project, projectStep, course } = require("../models");

/**
 * @desc    Получить все проекты. Позволяет фильтрацию по ID курса.
 * @route   GET /api/projects
 * @route   GET /api/projects?courseId=1
 * @access  Public
 */
const getAllProjects = async (req, res) => {
  try {
    const { courseId } = req.query; // Получаем courseId из параметров запроса (/?courseId=1)

    let filter = {};
    if (courseId) {
      filter.course_id = courseId;
    }

    const projects = await project.findAll({
      where: filter,
      // Сортируем проекты по их порядку внутри курса
      order: [["order", "ASC"]],
    });

    res.json(projects);
  } catch (error) {
    console.error("Ошибка при получении проектов:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Получить один проект по его ID со всеми шагами.
 * @route   GET /api/projects/:id
 * @access  Public
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const projectData = await project.findByPk(id, {
      include: {
        model: projectStep,
        as: "steps",
        // Сортируем шаги по их порядку
        order: [["order", "ASC"]],
      },
    });

    if (projectData) {
      res.json(projectData);
    } else {
      res.status(404).json({ error: "Проект не найден" });
    }
  } catch (error) {
    console.error(`Ошибка при получении проекта ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Создать новый проект.
 * @route   POST /api/projects
 * @access  Private (admin)
 */
const createProject = async (req, res) => {
  try {
    // Все данные для создания проекта передаются в теле запроса
    const {
      course_id,
      title,
      description,
      order,
      html_template,
      css_template,
      js_template,
    } = req.body;

    // Валидация: проверяем, существует ли курс, к которому мы привязываем проект
    const parentCourse = await course.findByPk(course_id);
    if (!parentCourse) {
      return res
        .status(400)
        .json({ error: `Курс с ID ${course_id} не найден.` });
    }

    const newProject = await project.create({
      course_id,
      title,
      description,
      order,
      html_template,
      css_template,
      js_template,
    });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Ошибка при создании проекта:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Обновить проект по ID.
 * @route   PUT /api/projects/:id
 * @access  Private (admin)
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    // Данные для обновления в теле запроса. Мы не позволяем менять course_id.
    const {
      title,
      description,
      order,
      html_template,
      css_template,
      js_template,
    } = req.body;

    const [updatedRows] = await project.update(
      { title, description, order, html_template, css_template, js_template },
      { where: { id } }
    );

    if (updatedRows > 0) {
      const updatedProject = await project.findByPk(id);
      res.json(updatedProject);
    } else {
      res.status(404).json({ error: "Проект не найден для обновления" });
    }
  } catch (error) {
    console.error(`Ошибка при обновлении проекта ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Удалить проект по ID.
 * @route   DELETE /api/projects/:id
 * @access  Private (admin)
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await project.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Проект не найден для удаления" });
    }
  } catch (error) {
    console.error(`Ошибка при удалении проекта ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
