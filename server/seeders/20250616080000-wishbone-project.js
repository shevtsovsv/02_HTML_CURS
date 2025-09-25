"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Ищем курс по названию
      const courseTitle = "Основы HTML и CSS";
      const [course] = await queryInterface.sequelize.query(
        "SELECT id FROM courses WHERE title = :title LIMIT 1",
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { title: courseTitle },
          transaction: t,
        }
      );

      if (!course) {
        throw new Error(
          `Не найден курс "${courseTitle}". Засидьте курс(ы) перед проектами или создайте соответствующий seeder.`
        );
      }

      await queryInterface.bulkInsert(
        "projects",
        [
          {
            title: "Wishbone - ресторанный сайт",
            description:
              "Создайте современный сайт ресторана Wishbone с навигацией, героическим разделом, меню, информацией о ресторане и контактами. Изучите создание полноценной веб-страницы с семантической разметкой, формами и адаптивным дизайном.",
            html_template:
              '<!DOCTYPE html>\n<html lang="ru">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Wishbone - Ресторан высокой кухни</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <!-- Ваш код здесь -->\n</body>\n</html>',
            css_template:
              "/* Стили для Wishbone Restaurant */\n* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: 'Georgia', serif;\n  line-height: 1.6;\n  color: #333;\n  background-color: #fafafa;\n}\n\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\n/* Стили навигации */\nheader {\n  background: #2c1810;\n  color: #fff;\n  padding: 1rem 0;\n  box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n}\n\nnav {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 0 20px;\n}\n\nnav a {\n  color: #fff;\n  text-decoration: none;\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\nnav ul {\n  display: flex;\n  list-style: none;\n  gap: 2rem;\n}\n\nnav ul li a {\n  font-size: 1rem;\n  font-weight: normal;\n  transition: color 0.3s;\n}\n\nnav ul li a:hover {\n  color: #d4af37;\n}\n\n/* Героический раздел */\n.hero {\n  background: linear-gradient(rgba(44, 24, 16, 0.7), rgba(44, 24, 16, 0.7)), url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');\n  background-size: cover;\n  background-position: center;\n  color: #fff;\n  text-align: center;\n  padding: 120px 0;\n}\n\n.hero-content h1 {\n  font-size: 3rem;\n  margin-bottom: 1rem;\n  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);\n}\n\n.hero-content h2 {\n  font-size: 1.5rem;\n  margin-bottom: 2rem;\n  font-weight: normal;\n  opacity: 0.9;\n}\n\n.hero-content p {\n  font-size: 1.2rem;\n  margin-bottom: 2rem;\n  max-width: 600px;\n  margin-left: auto;\n  margin-right: auto;\n}\n\n/* Кнопки */\nbutton, .button, .btn {\n  background: #d4af37;\n  color: #fff;\n  padding: 12px 30px;\n  border: none;\n  border-radius: 5px;\n  font-size: 1.1rem;\n  cursor: pointer;\n  transition: background 0.3s;\n}\n\nbutton:hover, .button:hover, .btn:hover {\n  background: #b8941f;\n}\n\n/* Общие стили секций */\nsection {\n  padding: 80px 0;\n}\n\nsection h2 {\n  text-align: center;\n  font-size: 2.5rem;\n  margin-bottom: 3rem;\n  color: #2c1810;\n}\n\n/* Раздел О нас */\n.about {\n  background: #fff;\n}\n\n.about img {\n  max-width: 100%;\n  border-radius: 10px;\n  margin-top: 2rem;\n}\n\n/* Меню */\n.menu {\n  background: #f8f8f8;\n}\n\n.menu-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 2rem;\n  max-width: 1000px;\n  margin: 0 auto;\n}\n\n.menu-item {\n  background: #fff;\n  border-radius: 10px;\n  overflow: hidden;\n  box-shadow: 0 5px 15px rgba(0,0,0,0.1);\n  transition: transform 0.3s;\n}\n\n.menu-item:hover {\n  transform: translateY(-5px);\n}\n\n.menu-item img {\n  width: 100%;\n  height: 200px;\n  object-fit: cover;\n}\n\n.menu-item h3 {\n  padding: 1rem;\n  color: #2c1810;\n}\n\n.menu-item p {\n  padding: 0 1rem;\n  color: #666;\n}\n\n.menu-item .price {\n  display: block;\n  padding: 1rem;\n  font-size: 1.3rem;\n  font-weight: bold;\n  color: #d4af37;\n  text-align: right;\n}\n\n/* Форма бронирования */\n.booking {\n  background: #2c1810;\n  color: #fff;\n}\n\n.booking h2 {\n  color: #fff;\n}\n\n.booking form {\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.booking label {\n  display: block;\n  margin-bottom: 0.5rem;\n  font-weight: bold;\n}\n\n.booking input, .booking select {\n  width: 100%;\n  padding: 12px;\n  margin-bottom: 1.5rem;\n  border: none;\n  border-radius: 5px;\n  font-size: 1rem;\n}\n\n/* Контакты */\n.contacts {\n  background: #fff;\n}\n\n.contact-info {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 2rem;\n  max-width: 800px;\n  margin: 0 auto;\n  text-align: center;\n}\n\n.contact-info h3 {\n  color: #2c1810;\n  margin-bottom: 1rem;\n}\n\n.contact-info a {\n  color: #d4af37;\n  text-decoration: none;\n}\n\n/* Футер */\n.site-footer {\n  background: #1a1a1a;\n  color: #fff;\n  padding: 3rem 0 1rem;\n  text-align: center;\n}\n\n.social-links {\n  display: flex;\n  justify-content: center;\n  gap: 2rem;\n  list-style: none;\n  margin: 2rem 0;\n}\n\n.social-links a {\n  color: #fff;\n  text-decoration: none;\n  font-size: 1.2rem;\n  transition: color 0.3s;\n}\n\n.social-links a:hover {\n  color: #d4af37;\n}\n\n.footer-nav {\n  margin: 2rem 0;\n}\n\n.footer-nav a {\n  color: #ccc;\n  text-decoration: none;\n  margin: 0 1rem;\n  transition: color 0.3s;\n}\n\n.footer-nav a:hover {\n  color: #d4af37;\n}",
            js_template: "// JavaScript для интерактивности будет добавлен при необходимости",
            order: 1,
            course_id: course.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t }
      );

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(
      "projects",
      { title: "Wishbone - ресторанный сайт" },
      {}
    );
  },
};