'use strict';

/**
 * @file seeders/...-magic-button-course.js
 * @description Сидер для создания курса "Волшебная кнопка" для изучения JavaScript
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Проверяем, существует ли курс
    const existingCourse = await queryInterface.sequelize.query(
      `SELECT id FROM courses WHERE slug = 'magic-button-javascript'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    let courseId;
    
    if (existingCourse.length > 0) {
      courseId = existingCourse[0].id;
      console.log('Курс "Волшебная кнопка" уже существует с ID:', courseId);
    } else {
      // Создаем курс
      await queryInterface.bulkInsert('courses', [
        {
          title: 'Волшебная кнопка - Изучение JavaScript',
          slug: 'magic-button-javascript',
          description: 'Пошаговое изучение JavaScript через создание интерактивной игры "Волшебная кнопка". Изучите основы программирования, DOM манипуляции, события и создайте свою первую игру!',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);

      // Получаем ID созданного курса
      const course = await queryInterface.sequelize.query(
        `SELECT id FROM courses WHERE slug = 'magic-button-javascript'`,
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      courseId = course[0].id;
      console.log('Создан курс "Волшебная кнопка" с ID:', courseId);
    }
    
    return queryInterface.bulkInsert('projects', [
      {
        title: 'Урок 1: Базовая HTML структура',
        description: 'Создаем основную HTML разметку для нашей игры. Изучаем DOCTYPE, мета-теги, структуру документа.',
        order: 1,
        course_id: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Урок 2: CSS стили',
        description: 'Стилизуем нашу страницу. Изучаем градиенты, Flexbox для центрирования, типографику.',
        order: 2,
        course_id: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Урок 3: Стилизация кнопки',
        description: 'Создаем красивую интерактивную кнопку с анимациями и hover эффектами.',
        order: 3,
        course_id: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Урок 4: JavaScript логика',
        description: 'Добавляем интерактивность с помощью JavaScript. Изучаем переменные, события, функции.',
        order: 4,
        course_id: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Урок 5: Интерфейс статистики',
        description: 'Создаем панель статистики. Изучаем DOM манипуляции и динамическое обновление контента.',
        order: 5,
        course_id: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Урок 6: Финальные улучшения',
        description: 'Добавляем продвинутые функции: звуки, достижения, современный дизайн.',
        order: 6,
        course_id: courseId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Сначала удаляем проекты
    await queryInterface.bulkDelete('projects', {
      course_id: {
        [Sequelize.Op.in]: [
          queryInterface.sequelize.literal(`(SELECT id FROM courses WHERE slug = 'magic-button-javascript')`)
        ]
      }
    });
    
    // Затем удаляем курс
    return queryInterface.bulkDelete('courses', {
      slug: 'magic-button-javascript'
    });
  }
};