/**
 * @file controllers/courseController.js
 * @description Контроллер для обработки всех запросов, связанных с курсами.
 * Содержит бизнес-логику для CRUD-операций над моделью Course.
 */

// Импортируем все необходимые модели в одном месте
const { course, project, projectStep } = require("../models");
const slugify = require("slugify"); // Понадобится для создания слага

/**
 * @desc    Получить список всех курсов.
 * @route   GET /api/courses
 * @access  Public
 */
const getAllCourses = async (req, res) => {
  try {
    // Сразу подгружаем связанные проекты, это называется "жадная загрузка" (eager loading)
    const courses = await course.findAll({
      include: {
        model: project,
        as: "projects", // Используем alias из модели
      },
      order: [
        ["createdAt", "ASC"], // Сортируем курсы по дате создания
      ],
    });
    res.json(courses);
  } catch (error) {
    console.error("Ошибка при получении курсов:", error); // Логируем ошибку для отладки
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Получить один курс по его slug.
 * @route   GET /api/courses/:slug
 * @access  Public
 */
const getCourseBySlug = async (req, res) => {
  try {
    const courseData = await course.findOne({
      where: { slug: req.params.slug },
      include: {
        // Также подгружаем проекты и их шаги для детального просмотра
        model: project,
        as: "projects",
        include: {
          model: projectStep, // предполагаем, что модель называется projectStep
          as: "steps",
        },
      },
    });

    if (courseData) {
      res.json(courseData);
    } else {
      res.status(404).json({ error: "Курс не найден" });
    }
  } catch (error) {
    console.error(`Ошибка при получении курса ${req.params.slug}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Создать новый курс.
 * @route   POST /api/courses
 * @access  Private (в будущем здесь будет проверка на admin)
 */
const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Автоматически генерируем слаг из названия
    const slug = slugify(title, { lower: true, strict: true });

    const newCourse = await course.create({ title, description, slug });
    res.status(201).json(newCourse);
  } catch (error) {
    // Обрабатываем ошибку уникальности слага
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Курс с таким названием уже существует." });
    }
    console.error("Ошибка при создании курса:", error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Обновить существующий курс по ID.
 * @route   PUT /api/courses/:id
 * @access  Private (admin)
 */
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    // Готовим данные для обновления
    const updateData = { title, description };
    // Если меняется title, нужно обновить и slug
    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    const [updatedRows] = await course.update(updateData, {
      where: { id },
    });

    if (updatedRows > 0) {
      // Возвращаем обновленный объект, сделав повторный запрос
      const updatedCourse = await course.findByPk(id);
      res.json(updatedCourse);
    } else {
      res.status(404).json({ error: "Курс не найден для обновления" });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ error: "Курс с таким названием уже существует." });
    }
    console.error(`Ошибка при обновлении курса ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

/**
 * @desc    Удалить курс по ID.
 * @route   DELETE /api/courses/:id
 * @access  Private (admin)
 */
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRows = await course.destroy({
      where: { id },
    });

    if (deletedRows > 0) {
      // 204 No Content - стандартный ответ для успешного удаления без тела ответа
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Курс не найден для удаления" });
    }
  } catch (error) {
    console.error(`Ошибка при удалении курса ${req.params.id}:`, error);
    res.status(500).json({ error: "Ошибка на сервере" });
  }
};

// Экспортируем все функции контроллера
module.exports = {
  getAllCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
};
