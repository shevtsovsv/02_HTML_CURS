"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projectSteps",
      [
        {
          // Шаг 1: Базовая структура и заголовок страницы
          instructions:
            "Создайте базовую структуру HTML-страницы. В теге `<head>` добавьте элемент `<title>` с текстом 'Моя первая веб-страница'. В теге `<body>` пока ничего не добавляйте.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "html" },
            { type: "elementExists", selector: "head" },
            { type: "elementExists", selector: "body" },
            { type: "elementExists", selector: "title" },
            { type: "elementText", selector: "title", expected: "Моя первая веб-страница" }
          ]),
          order: 1,
          project_id: 1, // ID первого проекта
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 2: Главный заголовок и вводный абзац
          instructions:
            "В теге `<body>` добавьте главный заголовок страницы `<h1>` с текстом 'Добро пожаловать на мою страницу!'. После заголовка добавьте абзац `<p>` с текстом 'Меня зовут [Ваше имя], и это моя первая веб-страница.'",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "h1" },
            { type: "elementText", selector: "h1", expected: "Добро пожаловать на мою страницу!" },
            { type: "elementExists", selector: "p" }
          ]),
          order: 2,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 3: Заголовки разных уровней
          instructions:
            "После первого абзаца добавьте заголовок второго уровня `<h2>` с текстом 'О себе', затем заголовок третьего уровня `<h3>` с текстом 'Мои увлечения'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "h2" },
            { type: "elementText", selector: "h2", expected: "О себе" },
            { type: "elementExists", selector: "h3" },
            { type: "elementText", selector: "h3", expected: "Мои увлечения" }
          ]),
          order: 3,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 4: Дополнительные абзацы
          instructions:
            "Под заголовком 'О себе' добавьте абзац с рассказом о себе. Под заголовком 'Мои увлечения' добавьте еще один абзац, описывающий ваши хобби. Всего на странице должно быть как минимум 3 абзаца `<p>`.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "p:nth-of-type(1)" },
            { type: "elementExists", selector: "p:nth-of-type(2)" },
            { type: "elementExists", selector: "p:nth-of-type(3)" }
          ]),
          order: 4,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 5: Добавление изображения
          instructions:
            "После всех абзацев добавьте заголовок `<h2>` с текстом 'Моя фотография'. Под ним разместите изображение `<img>` с атрибутом `src='https://via.placeholder.com/300x200'` и атрибутом `alt='Моя фотография'`.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "img" },
            { type: "elementExists", selector: "img[src='https://via.placeholder.com/300x200']" },
            { type: "elementExists", selector: "img[alt='Моя фотография']" }
          ]),
          order: 5,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 6: Неупорядоченный список
          instructions:
            "Добавьте заголовок `<h2>` с текстом 'Мои любимые книги'. Под ним создайте неупорядоченный список `<ul>` с тремя элементами `<li>`: 'Война и мир', 'Гарри Поттер' и 'Властелин колец'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "ul" },
            { type: "elementExists", selector: "ul li:nth-child(1)" },
            { type: "elementExists", selector: "ul li:nth-child(2)" },
            { type: "elementExists", selector: "ul li:nth-child(3)" },
            { type: "elementText", selector: "ul li:nth-child(1)", expected: "Война и мир" },
            { type: "elementText", selector: "ul li:nth-child(2)", expected: "Гарри Поттер" },
            { type: "elementText", selector: "ul li:nth-child(3)", expected: "Властелин колец" }
          ]),
          order: 6,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 7: Упорядоченный список
          instructions:
            "Добавьте заголовок `<h2>` с текстом 'Мои цели на год'. Под ним создайте упорядоченный список `<ol>` с тремя элементами `<li>`: 'Изучить HTML и CSS', 'Создать свой первый сайт' и 'Найти работу веб-разработчиком'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "ol" },
            { type: "elementExists", selector: "ol li:nth-child(1)" },
            { type: "elementExists", selector: "ol li:nth-child(2)" },
            { type: "elementExists", selector: "ol li:nth-child(3)" },
            { type: "elementText", selector: "ol li:nth-child(1)", expected: "Изучить HTML и CSS" },
            { type: "elementText", selector: "ol li:nth-child(2)", expected: "Создать свой первый сайт" },
            { type: "elementText", selector: "ol li:nth-child(3)", expected: "Найти работу веб-разработчиком" }
          ]),
          order: 7,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 8: Финальная структурная проверка
          instructions:
            "Проверьте вашу страницу: она должна содержать все необходимые элементы. Убедитесь, что у вас есть заголовок страницы, главный заголовок h1, минимум 4 заголовка h2, один заголовок h3, минимум 3 абзаца, одно изображение, один неупорядоченный список и один упорядоченный список.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "title" },
            { type: "elementExists", selector: "h1" },
            { type: "elementExists", selector: "h2:nth-of-type(1)" },
            { type: "elementExists", selector: "h2:nth-of-type(2)" },
            { type: "elementExists", selector: "h2:nth-of-type(3)" },
            { type: "elementExists", selector: "h2:nth-of-type(4)" },
            { type: "elementExists", selector: "h3" },
            { type: "elementExists", selector: "p:nth-of-type(3)" },
            { type: "elementExists", selector: "img" },
            { type: "elementExists", selector: "ul" },
            { type: "elementExists", selector: "ol" }
          ]),
          order: 8,
          project_id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projectSteps", { project_id: 1 }, {});
  },
};