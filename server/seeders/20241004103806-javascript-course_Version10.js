"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('courses', [
      {
        title: 'Основы JavaScript',
        description: 'Практический курс изучения JavaScript через 12 проектов возрастающей сложности. От базовых переменных до работы с API и Canvas.',
        slug: 'osnovy-javascript',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('courses', { 
      slug: 'osnovy-javascript' 
    });
  }
};