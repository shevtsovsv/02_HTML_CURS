/**
 * @file controllers/courseController.js
 * @description Контроллер для обработки всех запросов, связанных с курсами.
 * Содержит бизнес-логику для CRUD-операций над моделью Course.
 */

// Импортируем все необходимые модели в одном месте
const { course, project, projectStep, userProgress } = require("../models");
const slugify = require("slugify"); // Понадобится для создания слага

const { Op } = require("sequelize");

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
	console.log(">>> req.user:", req.user);
  try {
    const { slug } = req.params;
    const userId = req.user?.id;

    // ШАГ 1: Загружаем основной контент (курс, проекты и их шаги)
    const courseInstance = await course.findOne({
      where: { slug: slug },
      include: [
        {
          model: project,
          as: "projects",
          include: [
            {
              model: projectStep,
              as: "steps",
              required: false,
            },
          ],
        },
      ],
      order: [
        [{ model: project, as: "projects" }, "order", "ASC"],
        [
          { model: project, as: "projects" },
          { model: projectStep, as: "steps" },
          "order",
          "ASC",
        ],
      ],
    });

    if (!courseInstance) {
      return res.status(404).json({ error: "Курс не найден" });
    }

    // Превращаем сложный экземпляр Sequelize в чистый JS-объект
    const courseData = courseInstance.toJSON();

    // ШАГ 2: Загружаем и "приклеиваем" прогресс
    if (userId && courseData.projects && courseData.projects.length > 0) {
      // --- ГЛАВНОЕ ИСПРАВЛЕНИЕ: Гарантируем, что работаем с настоящим массивом ---
      // `Array.from()` принудительно создает новый, настоящий массив из псевдо-массива Sequelize.
      const projectsArray = Array.from(courseData.projects);

      const projectIds = projectsArray.map((p) => p.id);

      const progresses = await userProgress.findAll({
        where: {
          user_id: userId,
          project_id: { [Op.in]: projectIds },
        },
      });
      console.log(
        ">>> progress records:",
        progresses.map((p) => p.toJSON())
      );

      for (const progress of progresses) {
        console.log(">>> progress.toJSON():", progress.toJSON());
      }

      // Создаем карту прогресса для быстрой "склейки"
      const progressMap = progresses.reduce((map, progress) => {
        const pid = progress.project_id;
        if (!map[pid]) map[pid] = [];
        map[pid].push(progress.toJSON());
        return map;
      }, {});

      // Итерируем по НАСТОЯЩЕМУ массиву и добавляем прогресс
      //   for (const proj of projectsArray) {
      //     proj.userProgresses = progressMap[proj.id] || [];
      //     // Ваш отладочный лог, который теперь должен сработать
      //     // console.log(
      //     //   ">>> [LOG] Проект ID:",
      //     //   proj.id,
      //     //   "Количество записей о прогрессе:",
      //     //   proj.userProgresses.length
      //     // );
      //   }
      for (let i = 0; i < courseData.projects.length; i++) {
        const proj = courseData.projects[i];
        proj.userProgresses = progressMap[proj.id] ?? [];
      }

      // Заменяем псевдо-массив в итоговом объекте на наш новый, обогащенный массив
      //   courseData.projects = projectsArray;
    }
    console.log(
      courseData.projects.map((p) => ({
        id: p.id,
        userProgresses: p.userProgresses,
      }))
    );
    res.json(courseData);
  } catch (error) {
    console.error(
      `Критическая ошибка при получении курса ${req.params.slug}:`,
      error
    );
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
