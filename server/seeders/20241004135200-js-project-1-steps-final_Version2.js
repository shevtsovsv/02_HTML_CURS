"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Находим проект "Приветствие пользователя"
      const [project] = await queryInterface.sequelize.query(
        `SELECT p.id FROM projects p 
         INNER JOIN courses c ON p.course_id = c.id 
         WHERE c.slug = 'osnovy-javascript' AND p.title = 'Приветствие пользователя' LIMIT 1`,
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (!project) {
        throw new Error('Проект "Приветствие пользователя" не найден. Убедитесь, что проекты созданы.');
      }

      // Сначала удаляем существующие шаги для этого проекта
      await queryInterface.bulkDelete('projectSteps', {
        project_id: project.id
      }, { transaction: t });

      await queryInterface.bulkInsert('projectSteps', [
        {
          instructions: `**Шаг 1: Создание переменной с именем**

Создайте переменную \`userName\` и присвойте ей значение "Студент". Это будет имя пользователя для приветствия.

**Задание:**
1. Используйте ключевое слово \`const\` для создания переменной
2. Назовите переменную \`userName\`
3. Присвойте ей значение "Студент" (в кавычках)

**Пример:**
\`\`\`javascript
const userName = "Студент";
\`\`\`

**Что изучаем:**
- Объявление переменных с \`const\`
- Работа со строковыми значениями
- Присваивание значений переменным

**Подсказка:** Не забудьте использовать кавычки для строкового значения.`,
          validationRules: JSON.stringify([
            {
              type: "jsExpression",
              expression: "typeof userName !== 'undefined'",
              expected: true,
              message: "Переменная userName должна быть объявлена"
            },
            {
              type: "jsExpression",
              expression: "userName === 'Студент'",
              expected: true,
              message: "Переменная userName должна содержать значение 'Студент'"
            },
            {
              type: "jsExpression",
              expression: "typeof userName === 'string'",
              expected: true,
              message: "Переменная userName должна быть строкой"
            }
          ]),
          order: 1,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          instructions: `**Шаг 2: Добавление обработчика события клика**

Добавьте обработчик события клика для кнопки с id "greetBtn". При клике на кнопку должна выполняться функция.

**Задание:**
1. Найдите элемент с id "greetBtn" используя \`document.getElementById()\`
2. Добавьте обработчик события 'click' используя \`addEventListener()\`
3. В качестве обработчика используйте анонимную функцию

**Пример структуры:**
\`\`\`javascript
document.getElementById('greetBtn').addEventListener('click', function() {
    // код обработчика
});
\`\`\`

**Что изучаем:**
- Поиск элементов в DOM
- Добавление обработчиков событий
- Работа с событиями мыши (click)

**Подсказка:** Используйте точно такую структуру, как показано в примере.`,
          validationRules: JSON.stringify([
            {
              type: "eventListenerAttached",
              selector: "#greetBtn",
              eventType: "click",
              message: "Кнопка с id 'greetBtn' должна иметь обработчик события 'click'"
            }
          ]),
          order: 2,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          instructions: `**Шаг 3: Отображение приветствия в DOM**

В обработчике события выведите приветствие в элемент с id "greeting". Используйте переменную userName для персонализации сообщения.

**Задание:**
1. Внутри обработчика события найдите элемент с id "greeting"
2. Установите его текстовое содержимое используя \`textContent\`
3. Создайте сообщение "Привет, Студент!" используя переменную \`userName\`

**Полный пример кода:**
\`\`\`javascript
const userName = "Студент";

document.getElementById('greetBtn').addEventListener('click', function() {
    document.getElementById('greeting').textContent = "Привет, " + userName + "!";
});
\`\`\`

**Что изучаем:**
- Изменение содержимого элементов DOM
- Конкатенация строк
- Использование переменных в строках

**Подсказка:** Результат должен быть точно "Привет, Студент!"`,
          validationRules: JSON.stringify([
            {
              type: "allOf",
              rules: [
                {
                  type: "jsExpression",
                  expression: "typeof userName !== 'undefined' && userName === 'Студент'",
                  expected: true,
                  message: "Переменная userName должна быть определена со значением 'Студент'"
                },
                {
                  type: "eventListenerAttached",
                  selector: "#greetBtn",
                  eventType: "click",
                  message: "Кнопка должна иметь обработчик события click"
                },
                {
                  type: "eventDispatchChangesDom",
                  selector: "#greetBtn",
                  eventType: "click",
                  expectChange: true,
                  condition: "document.getElementById('greeting').textContent === 'Привет, Студент!'",
                  message: "При клике текст в элементе #greeting должен стать 'Привет, Студент!'"
                }
              ],
              message: "Все условия должны быть выполнены"
            }
          ]),
          order: 3,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await t.commit();
      console.log('✅ Шаги для проекта "Приветствие пользователя" успешно созданы');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const [project] = await queryInterface.sequelize.query(
      `SELECT p.id FROM projects p 
       INNER JOIN courses c ON p.course_id = c.id 
       WHERE c.slug = 'osnovy-javascript' AND p.title = 'Приветствие пользователя' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (project) {
      await queryInterface.bulkDelete('projectSteps', {
        project_id: project.id
      });
    }
  }
};