"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "projectSteps",
      [
        {
          // Шаг 1: Создание навигационной панели
          instructions:
            "Создайте семантическую навигацию для ресторана Wishbone. Добавьте элемент <header> с внутренним <nav>. В навигации разместите логотип (ссылка с текстом 'Wishbone') и список навигации <ul> с пятью пунктами: 'Главная', 'Меню', 'О нас', 'Контакты', 'Бронирование'. Каждый пункт должен быть ссылкой <a> внутри <li>.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "header" },
            { type: "elementExists", selector: "header nav" },
            { type: "elementExists", selector: "nav a" },
            { type: "elementText", selector: "nav a:first-child", expected: "Wishbone" },
            { type: "elementExists", selector: "nav ul" },
            { type: "elementCount", selector: "nav ul li", expected: 5 },
            { type: "elementCount", selector: "nav ul li a", expected: 5 }
          ]),
          order: 1,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 2: Создание героического раздела
          instructions:
            "Создайте впечатляющий героический раздел после навигации. Добавьте <section> с классом 'hero'. Внутри разместите контейнер <div class='hero-content'> с заголовком h1 'Добро пожаловать в Wishbone', подзаголовок h2 'Ресторан высокой кухни в сердце города', абзац с описанием 'Откройте для себя изысканные блюда, приготовленные из лучших ингредиентов нашими талантливыми шеф-поварами.' и кнопку 'Забронировать столик'.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "section.hero" },
            { type: "elementExists", selector: ".hero .hero-content" },
            { type: "elementExists", selector: ".hero-content h1" },
            { type: "elementText", selector: ".hero-content h1", expected: "Добро пожаловать в Wishbone" },
            { type: "elementExists", selector: ".hero-content h2" },
            { type: "elementText", selector: ".hero-content h2", expected: "Ресторан высокой кухни в сердце города" },
            { type: "elementExists", selector: ".hero-content p" },
            { type: "elementExists", selector: ".hero-content button, .hero-content .button, .hero-content a.btn" }
          ]),
          order: 2,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 3: Раздел "О нас"
          instructions:
            "Создайте информационный раздел о ресторане. Добавьте <section> с классом 'about' и внутри него контейнер <div class='container'>. В контейнере разместите заголовок h2 'О ресторане Wishbone', два абзаца с информацией о ресторане (история, философия) и изображение ресторана. Используйте семантический тег <img> с обязательными атрибутами src и alt.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "section.about" },
            { type: "elementExists", selector: ".about .container" },
            { type: "elementExists", selector: ".about h2" },
            { type: "elementText", selector: ".about h2", expected: "О ресторане Wishbone" },
            { type: "elementCount", selector: ".about p", expected: 2 },
            { type: "elementExists", selector: ".about img" },
            { type: "elementHasAttribute", selector: ".about img", attribute: "src" },
            { type: "elementHasAttribute", selector: ".about img", attribute: "alt" }
          ]),
          order: 3,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 4: Раздел меню с карточками блюд
          instructions:
            "Создайте раздел меню ресторана. Добавьте <section> с классом 'menu' и заголовок h2 'Наше меню'. Создайте контейнер для блюд <div class='menu-grid'> и разместите в нём три карточки блюд. Каждая карточка должна быть в <div class='menu-item'> и содержать: изображение блюда, заголовок h3 с названием, абзац с описанием и элемент <span class='price'> с ценой.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "section.menu" },
            { type: "elementExists", selector: ".menu h2" },
            { type: "elementText", selector: ".menu h2", expected: "Наше меню" },
            { type: "elementExists", selector: ".menu .menu-grid" },
            { type: "elementCount", selector: ".menu-grid .menu-item", expected: 3 },
            { type: "elementCount", selector: ".menu-item img", expected: 3 },
            { type: "elementCount", selector: ".menu-item h3", expected: 3 },
            { type: "elementCount", selector: ".menu-item p", expected: 3 },
            { type: "elementCount", selector: ".menu-item .price", expected: 3 },
            { type: "elementHasAttribute", selector: ".menu-item img", attribute: "src" },
            { type: "elementHasAttribute", selector: ".menu-item img", attribute: "alt" }
          ]),
          order: 4,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 5: Форма бронирования
          instructions:
            "Создайте раздел для бронирования столика. Добавьте <section> с классом 'booking' и заголовок h2 'Забронировать столик'. Создайте форму <form> с полями: имя (input type='text' name='name'), телефон (input type='tel' name='phone'), email (input type='email' name='email'), дата (input type='date' name='date'), время (select name='time' с опциями времени), количество гостей (input type='number' name='guests') и кнопку отправки 'Забронировать'. Добавьте соответствующие <label> для каждого поля.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "section.booking" },
            { type: "elementExists", selector: ".booking h2" },
            { type: "elementText", selector: ".booking h2", expected: "Забронировать столик" },
            { type: "elementExists", selector: ".booking form" },
            { type: "elementExists", selector: "form input[name='name'][type='text']" },
            { type: "elementExists", selector: "form input[name='phone'][type='tel']" },
            { type: "elementExists", selector: "form input[name='email'][type='email']" },
            { type: "elementExists", selector: "form input[name='date'][type='date']" },
            { type: "elementExists", selector: "form select[name='time']" },
            { type: "elementExists", selector: "form input[name='guests'][type='number']" },
            { type: "elementExists", selector: "form button[type='submit'], form input[type='submit']" },
            { type: "elementCount", selector: "form label", expected: 6 },
            { type: "elementCount", selector: "form select[name='time'] option", expected: 3 }
          ]),
          order: 5,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 6: Контактная информация
          instructions:
            "Создайте раздел с контактной информацией. Добавьте <section> с классом 'contacts' и заголовок h2 'Контакты'. Создайте контейнер <div class='contact-info'> с тремя блоками информации: адрес (используйте тег <address>), телефон (ссылка tel:) и часы работы. Каждый блок должен иметь иконку или заголовок h3 и соответствующую информацию в абзаце или другом подходящем элементе.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "section.contacts" },
            { type: "elementExists", selector: ".contacts h2" },
            { type: "elementText", selector: ".contacts h2", expected: "Контакты" },
            { type: "elementExists", selector: ".contacts .contact-info" },
            { type: "elementExists", selector: ".contact-info address" },
            { type: "elementExists", selector: ".contact-info a[href^='tel:']" },
            { type: "elementCount", selector: ".contact-info h3", expected: 3 }
          ]),
          order: 6,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 7: Футер сайта
          instructions:
            "Создайте подвал сайта. Добавьте элемент <footer> с классом 'site-footer'. В футере разместите копирайт '© 2024 Wishbone Restaurant. Все права защищены.', ссылки на социальные сети (минимум 3: Facebook, Instagram, Twitter) в списке <ul class='social-links'> и дополнительную навигацию с основными разделами сайта в <nav class='footer-nav'>.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "footer.site-footer" },
            { type: "elementExists", selector: "footer .social-links" },
            { type: "elementCount", selector: ".social-links li", expected: 3 },
            { type: "elementCount", selector: ".social-links a", expected: 3 },
            { type: "elementExists", selector: "footer .footer-nav" },
            { type: "elementCount", selector: ".footer-nav a", expected: 3 }
          ]),
          order: 7,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          // Шаг 8: Финальная проверка и семантика
          instructions:
            "Завершите создание сайта, проверив семантическую структуру и доступность. Убедитесь, что все изображения имеют alt-атрибуты, форма корректно структурирована с label-ами, используются подходящие семантические теги (header, nav, main, section, footer). Добавьте элемент <main>, который будет оборачивать основной контент (всё между header и footer). Проверьте, что все ссылки имеют осмысленный текст.",
          validationRules: JSON.stringify([
            { type: "elementExists", selector: "main" },
            { type: "elementExists", selector: "main .hero" },
            { type: "elementExists", selector: "main .about" },
            { type: "elementExists", selector: "main .menu" },
            { type: "elementExists", selector: "main .booking" },
            { type: "elementExists", selector: "main .contacts" },
            { type: "elementCount", selector: "form label", expected: 6 },
            { type: "elementHasAttribute", selector: "img", attribute: "alt" }
          ]),
          order: 8,
          project_id: 13,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("projectSteps", {
      project_id: 13
    }, {});
  },
};