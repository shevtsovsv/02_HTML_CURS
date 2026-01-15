"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Находим проект "Калькулятор возраста"
      const [project] = await queryInterface.sequelize.query(
        `SELECT p.id FROM projects p 
         INNER JOIN courses c ON p.course_id = c.id 
         WHERE c.slug = 'osnovy-javascript' AND p.title = 'Калькулятор возраста' LIMIT 1`,
        {
          type: Sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (!project) {
        throw new Error('Проект "Калькулятор возраста" не найден. Убедитесь, что проекты созданы.');
      }

      // Удаляем существующие шаги для этого проекта (если есть)
      await queryInterface.bulkDelete('projectSteps', {
        project_id: project.id
      }, { transaction: t });

      await queryInterface.bulkInsert('projectSteps', [
        {
          instructions: `**Шаг 1: Создание функции для вычисления возраста**

Создайте функцию \`calculateAge\` которая принимает год рождения как параметр и возвращает возраст в годах.

**Задание:**
1. Объявите функцию с именем \`calculateAge\`
2. Функция должна принимать один параметр \`birthYear\`
3. Внутри функции получите текущий год используя \`new Date().getFullYear()\`
4. Вычислите возраст как разность текущего года и года рождения
5. Верните результат с помощью \`return\`

**Пример структуры:**
\`\`\`javascript
function calculateAge(birthYear) {
    // получить текущий год
    // вычислить возраст
    // вернуть результат
}
\`\`\`

**Что изучаем:**
- Объявление функций
- Параметры функций
- Объект Date и метод getFullYear()
- Математические операции
- Возврат значений из функций

**Подсказка:** Используйте \`new Date().getFullYear()\` для получения текущего года.`,
          validationRules: JSON.stringify([
            {
              type: "jsExpression",
              expression: "typeof calculateAge === 'function'",
              expected: true,
              message: "Функция calculateAge должна быть объявлена"
            },
            {
              type: "jsFunctionReturns",
              functionName: "calculateAge",
              args: [1990],
              expected: new Date().getFullYear() - 1990,
              message: "Функция calculateAge должна корректно вычислять возраст"
            },
            {
              type: "jsExpression",
              expression: "typeof calculateAge(2000) === 'number'",
              expected: true,
              message: "Функция должна возвращать число"
            }
          ]),
          order: 1,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          instructions: `**Шаг 2: Добавление обработчика для кнопки вычисления**

Добавьте обработчик события клика для кнопки с id "calculateBtn". При клике кнопка должна получать значение из поля ввода.

**Задание:**
1. Найдите кнопку с id "calculateBtn"
2. Добавьте обработчик события 'click'
3. В обработчике получите значение из поля с id "birthYear"
4. Преобразуйте значение в число используя \`parseInt()\`
5. Пока просто выведите значение в консоль для проверки

**Пример:**
\`\`\`javascript
document.getElementById('calculateBtn').addEventListener('click', function() {
    const birthYear = parseInt(document.getElementById('birthYear').value);
    console.log('Год рождения:', birthYear);
});
\`\`\`

**Что изучаем:**
- Получение значений из полей ввода
- Преобразование строк в числа
- Работа с формами
- Отладка через console.log

**Подсказка:** Не забудьте использовать \`parseInt()\` для преобразования строки в число.`,
          validationRules: JSON.stringify([
            {
              type: "eventListenerAttached",
              selector: "#calculateBtn",
              eventType: "click",
              message: "Кнопка calculateBtn должна иметь обработчик события click"
            },
            {
              type: "allOf",
              rules: [
                {
                  type: "jsExpression",
                  expression: "typeof calculateAge === 'function'",
                  expected: true,
                  message: "Функция calculateAge должна быть определена"
                },
                {
                  type: "jsConsoleContains",
                  message: "Год рождения",
                  consoleType: "log",
                  message: "Код должен выводить информацию в консоль"
                }
              ],
              message: "Обработчик должен получать значение и выводить в консоль"
            }
          ]),
          order: 2,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          instructions: `**Шаг 3: Вычисление и отображение результата**

Доработайте обработчик события, чтобы он вычислял возраст и отображал результат в элементе с id "result".

**Задание:**
1. В обработчике события используйте функцию \`calculateAge\` для вычисления возраста
2. Найдите элемент с id "result"
3. Отобразите результат в формате "Ваш возраст: X лет"
4. Добавьте простую проверку: если год не введен или некорректен, показать сообщение об ошибке

**Полный пример:**
\`\`\`javascript
function calculateAge(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

document.getElementById('calculateBtn').addEventListener('click', function() {
    const birthYear = parseInt(document.getElementById('birthYear').value);
    
    if (birthYear && birthYear > 1900 && birthYear <= new Date().getFullYear()) {
        const age = calculateAge(birthYear);
        document.getElementById('result').textContent = 'Ваш возраст: ' + age + ' лет';
    } else {
        document.getElementById('result').textContent = 'Введите корректный год рождения';
    }
});
\`\`\`

**Что изучаем:**
- Валидация пользовательского ввода
- Условные операторы (if/else)
- Вызов функций с параметрами
- Формирование строк результата
- Обработка ошибок ввода

**Подсказка:** Проверьте, что год больше 1900 и не больше текущего года.`,
          validationRules: JSON.stringify([
            {
              type: "allOf",
              rules: [
                {
                  type: "jsExpression",
                  expression: "typeof calculateAge === 'function'",
                  expected: true,
                  message: "Функция calculateAge должна существовать"
                },
                {
                  type: "eventListenerAttached",
                  selector: "#calculateBtn",
                  eventType: "click",
                  message: "Кнопка должна иметь обработчик клика"
                },
                {
                  type: "eventDispatchChangesDom",
                  selector: "#calculateBtn",
                  eventType: "click",
                  expectChange: true,
                  condition: "document.getElementById('result').textContent.includes('возраст') || document.getElementById('result').textContent.includes('Введите')",
                  message: "При клике должен появляться результат в элементе #result"
                }
              ],
              message: "Все компоненты должны работать вместе"
            }
          ]),
          order: 3,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          instructions: `**Шаг 4: Улучшение валидации и обработки ошибок**

Улучшите валидацию ввода и добавьте более подробные сообщения об ошибках.

**Задание:**
1. Добавьте проверку на пустое поле ввода
2. Проверьте, что введенное значение является числом
3. Убедитесь, что год рождения разумен (например, от 1900 до текущего года)
4. Для некорректного ввода показывайте конкретные сообщения об ошибках
5. Для корректного ввода показывайте возраст в красивом формате

**Пример улучшенной валидации:**
\`\`\`javascript
document.getElementById('calculateBtn').addEventListener('click', function() {
    const input = document.getElementById('birthYear').value;
    const resultElement = document.getElementById('result');
    
    // Проверка на пустой ввод
    if (!input) {
        resultElement.textContent = 'Пожалуйста, введите год рождения';
        return;
    }
    
    const birthYear = parseInt(input);
    const currentYear = new Date().getFullYear();
    
    // Проверка на корректность числа
    if (isNaN(birthYear)) {
        resultElement.textContent = 'Введите корректное число';
        return;
    }
    
    // Проверка диапазона
    if (birthYear < 1900 || birthYear > currentYear) {
        resultElement.textContent = 'Год должен быть между 1900 и ' + currentYear;
        return;
    }
    
    const age = calculateAge(birthYear);
    resultElement.textContent = 'Ваш возраст: ' + age + ' лет';
});
\`\`\`

**Что изучаем:**
- Детальная валидация данных
- Функция isNaN() для проверки чисел
- Операторы сравнения
- Ранний возврат из функции (return)
- Улучшенный пользовательский опыт

**Подсказка:** Используйте \`isNaN()\` для проверки, является ли значение числом.`,
          validationRules: JSON.stringify([
            {
              type: "allOf",
              rules: [
                {
                  type: "jsExpression",
                  expression: "typeof calculateAge === 'function'",
                  expected: true,
                  message: "Функция calculateAge должна быть определена"
                },
                {
                  type: "eventListenerAttached",
                  selector: "#calculateBtn",
                  eventType: "click",
                  message: "Обработчик события должен быть прикреплен"
                },
                {
                  type: "jsExpression",
                  expression: "document.getElementById('calculateBtn').onclick !== null || document.getElementById('calculateBtn').addEventListener",
                  expected: true,
                  message: "Кнопка должна иметь обработчик событий"
                }
              ],
              message: "Финальная проверка: все компоненты должны быть реализованы"
            }
          ]),
          order: 4,
          project_id: project.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await t.commit();
      console.log('✅ Шаги для проекта "Калькулятор возраста" успешно созданы');
    } catch (error) {
      await t.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const [project] = await queryInterface.sequelize.query(
      `SELECT p.id FROM projects p 
       INNER JOIN courses c ON p.course_id = c.id 
       WHERE c.slug = 'osnovy-javascript' AND p.title = 'Калькулятор возраста' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );
    
    if (project) {
      await queryInterface.bulkDelete('projectSteps', {
        project_id: project.id
      });
    }
  }
};