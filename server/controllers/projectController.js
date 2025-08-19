/**
 * @file controllers/projectController.js
 * @description Контроллер для всех операций, связанных с проектами (заданиями).
 */

const {
  project,
  projectStep,
  course,
  userCode,
  userProgress,
} = require("../models");

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
    const userId = req.user?.id; // req.user приходит из middleware аутентификации

    const projectData = await project.findByPk(id, {
      include: [
        {
          model: course,
          as: "course", // Используем alias из модели project
        },
        {
          model: projectStep,
          as: "steps",
          order: [["step_number", "ASC"]], // --- ИЗМЕНЕНИЕ: Сортируем по 'step_number', а не 'order' ---
        },
        // Если пользователь авторизован, пытаемся подгрузить его код
        // --- ИЗМЕНЕНИЕ: Теперь мы ищем ВЕСЬ код пользователя для этого проекта, а не один.
        userId && {
          model: userCode,
          as: "userCodes",
          where: { user_id: userId },
          required: false, // LEFT JOIN
        },
        userId && {
          model: userProgress,
          as: "userProgresses", // Убедитесь, что такой alias есть в модели project
          where: { user_id: userId },
          required: false,
        },
      ].filter(Boolean), // Убираем 'false' из массива, если userId нет
    });

    if (projectData) {
      // --- ИЗМЕНЕНИЕ: Мы больше не вычисляем current_step.
      // Просто возвращаем все данные как есть. Фронтенд разберется.
      res.json(projectData);
    } else {
      res.status(404).json({ error: "Проект не найден" });
    }
  } catch (error) {
    // --- ИЗМЕНЕНИЕ: Добавляем более подробный лог ошибки ---
    console.error(
      `КРИТИЧЕСКАЯ ОШИБКА в getProjectById для проекта ${req.params.id}:`,
      error
    );
    res
      .status(500)
      .json({ message: "Внутренняя ошибка сервера", error: error.message });
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
