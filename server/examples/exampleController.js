/**
 * @file examples/exampleController.js
 * @description Example controller demonstrating best practices
 * 
 * This file shows how to properly structure a controller with:
 * - Error handling using asyncHandler
 * - Custom errors using AppError
 * - Logging with logger
 * - Input validation
 * - Proper HTTP status codes
 * - JSDoc documentation
 */

const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { course, project } = require('../models');

/**
 * @desc    Get all courses with pagination
 * @route   GET /api/courses
 * @access  Public
 * @query   {number} page - Page number (default: 1)
 * @query   {number} limit - Items per page (default: 10, max: 100)
 */
const getCourses = asyncHandler(async (req, res) => {
  // 1. Валидация и парсинг параметров
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const offset = (page - 1) * limit;

  // 2. Валидация входных данных
  if (page < 1) {
    throw new AppError('Page must be greater than 0', 400);
  }

  // 3. Запрос к базе данных
  logger.debug('Fetching courses', { page, limit, offset });
  
  const { count, rows } = await course.findAndCountAll({
    limit,
    offset,
    attributes: ['id', 'title', 'slug', 'description'],
    order: [['createdAt', 'DESC']],
  });

  // 4. Формирование ответа
  const totalPages = Math.ceil(count / limit);
  
  logger.info('Courses fetched successfully', { count, page, totalPages });
  
  res.json({
    success: true,
    data: rows,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: count,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
});

/**
 * @desc    Get single course by slug
 * @route   GET /api/courses/:slug
 * @access  Public
 * @param   {string} slug - Course slug
 */
const getCourseBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Валидация slug
  if (!slug || slug.length < 3) {
    throw new AppError('Invalid course slug', 400);
  }

  logger.debug('Fetching course by slug', { slug });

  // Получение курса с проектами
  const courseData = await course.findOne({
    where: { slug },
    include: [
      {
        model: project,
        as: 'projects',
        attributes: ['id', 'title', 'description', 'order'],
        order: [['order', 'ASC']],
      },
    ],
  });

  // Проверка существования
  if (!courseData) {
    throw new AppError(`Course with slug '${slug}' not found`, 404);
  }

  logger.info('Course fetched successfully', { slug, id: courseData.id });

  res.json({
    success: true,
    data: courseData,
  });
});

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private/Admin
 * @body    {object} courseData - Course data
 */
const createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  // 1. Валидация обязательных полей
  if (!title || title.trim().length < 3) {
    throw new AppError('Title is required and must be at least 3 characters', 400);
  }

  if (!description || description.trim().length < 10) {
    throw new AppError('Description is required and must be at least 10 characters', 400);
  }

  // 2. Проверка прав доступа (пример)
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('You are not authorized to create courses', 403);
  }

  // 3. Генерация slug
  const slugify = require('slugify');
  const slug = slugify(title, { lower: true, strict: true });

  // 4. Проверка уникальности slug
  const existingCourse = await course.findOne({ where: { slug } });
  if (existingCourse) {
    throw new AppError('Course with this title already exists', 409);
  }

  // 5. Создание курса
  logger.info('Creating new course', { title, slug, userId: req.user.id });

  const newCourse = await course.create({
    title,
    slug,
    description,
  });

  logger.info('Course created successfully', { id: newCourse.id, slug });

  // 6. Ответ с кодом 201 (Created)
  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: newCourse,
  });
});

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private/Admin
 * @param   {number} id - Course ID
 * @body    {object} updateData - Data to update
 */
const updateCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  // 1. Валидация ID
  if (!id || isNaN(id)) {
    throw new AppError('Invalid course ID', 400);
  }

  // 2. Проверка прав доступа
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('You are not authorized to update courses', 403);
  }

  // 3. Поиск курса
  const courseToUpdate = await course.findByPk(id);
  if (!courseToUpdate) {
    throw new AppError(`Course with ID ${id} not found`, 404);
  }

  // 4. Подготовка данных для обновления
  const updateData = {};
  if (title && title.trim().length >= 3) {
    updateData.title = title;
    // Обновить slug если изменился title
    const slugify = require('slugify');
    updateData.slug = slugify(title, { lower: true, strict: true });
  }
  if (description && description.trim().length >= 10) {
    updateData.description = description;
  }

  // 5. Проверка, есть ли что обновлять
  if (Object.keys(updateData).length === 0) {
    throw new AppError('No valid fields to update', 400);
  }

  // 6. Обновление
  logger.info('Updating course', { id, updateFields: Object.keys(updateData) });

  await courseToUpdate.update(updateData);

  logger.info('Course updated successfully', { id });

  res.json({
    success: true,
    message: 'Course updated successfully',
    data: courseToUpdate,
  });
});

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private/Admin
 * @param   {number} id - Course ID
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Валидация
  if (!id || isNaN(id)) {
    throw new AppError('Invalid course ID', 400);
  }

  // 2. Проверка прав
  if (!req.user || req.user.role !== 'admin') {
    throw new AppError('You are not authorized to delete courses', 403);
  }

  // 3. Поиск курса
  const courseToDelete = await course.findByPk(id);
  if (!courseToDelete) {
    throw new AppError(`Course with ID ${id} not found`, 404);
  }

  // 4. Проверка связей (опционально)
  const projectCount = await project.count({ where: { course_id: id } });
  if (projectCount > 0) {
    throw new AppError(
      `Cannot delete course: ${projectCount} projects are still associated with it`,
      409
    );
  }

  // 5. Удаление
  logger.warn('Deleting course', { id, title: courseToDelete.title });

  await courseToDelete.destroy();

  logger.info('Course deleted successfully', { id });

  // 6. Ответ с кодом 204 (No Content) или 200 с сообщением
  res.json({
    success: true,
    message: 'Course deleted successfully',
  });
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
};
