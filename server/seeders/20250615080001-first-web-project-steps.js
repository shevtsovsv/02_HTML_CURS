"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projectSteps",
      [
        {
          // Шаг 1: Создание заголовков разного уровня
          instructions:
            "Создайте структуру заголовков для вашей веб-страницы. Добавьте главный заголовок h1 с текстом 'Добро пожаловать на мою первую веб-страницу!', заголовок второго уровня h2 с текстом 'О себе' и заголовок третьего уровня h3 с текстом 'Мои увлечения'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "h1" },
            { type: "elementExists", selector: "h2" },
            { type: "elementExists", selector: "h3" },
            { type: "elementText", selector: "h1", expected: "Добро пожаловать на мою первую веб-страницу!" },
            { type: "elementText", selector: "h2", expected: "О себе" },
            { type: "elementText", selector: "h3", expected: "Мои увлечения" },
          ]),
          order: 1,
          project_id: 12, // ID нового проекта (будет 2, так как карточка профиля уже имеет ID 1)
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 2: Добавление абзацев с текстом
          instructions:
            "Добавьте два абзаца с текстом. Первый абзац должен содержать ваше краткое представление (например: 'Меня зовут [Ваше имя], и я изучаю основы веб-разработки.'). Второй абзац - описание ваших интересов (например: 'Мне интересно создавать красивые и функциональные веб-сайты.').",
          validationRules: JSON.stringify([
            { type: "elementCount", selector: "body > p", expected: 2 },
            { type: "elementExists", selector: "p:first-of-type" },
            { type: "elementExists", selector: "p:last-of-type" },
          ]),
          order: 2,
          project_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 3: Добавление изображения
          instructions:
            "Добавьте изображение на страницу. Используйте тег img с атрибутом src, указывающим на любое изображение (можете использовать заглушку https://via.placeholder.com/300x200 или любое другое изображение). Обязательно добавьте атрибут alt с описанием изображения.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "img" },
            { type: "elementHasAttribute", selector: "img", attribute: "src" },
            { type: "elementHasAttribute", selector: "img", attribute: "alt" },
          ]),
          order: 3,
          project_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 4: Создание неупорядоченного списка
          instructions:
            "Создайте неупорядоченный список (ul) с тремя элементами (li). Список должен содержать ваши любимые занятия, например: 'Чтение книг', 'Просмотр фильмов', 'Изучение программирования'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "ul" },
            { type: "elementCount", selector: "ul li", expected: 3 },
          ]),
          order: 4,
          project_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 5: Создание упорядоченного списка
          instructions:
            "Добавьте упорядоченный список (ol) с планами на будущее. Создайте список из 4 пунктов с вашими целями в изучении веб-разработки, например: 'Изучить HTML', 'Освоить CSS', 'Изучить JavaScript', 'Создать свой первый сайт'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "ol" },
            { type: "elementCount", selector: "ol li", expected: 4 },
          ]),
          order: 5,
          project_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 6: Финальное оформление
          instructions:
            "Добавьте завершающий элемент - футер (footer) с информацией об авторе. Внутри футера создайте абзац с текстом '© 2024 Моя первая веб-страница'. Это завершит структуру вашей первой веб-страницы!",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "footer" },
            { type: "elementExists", selector: "footer p" },
            { type: "elementText", selector: "footer p", expected: "© 2024 Моя первая веб-страница" },
          ]),
          order: 6,
          project_id: 12,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projectSteps", {
      project_id: 12
    }, {});
  },
};