# 🎓 HTML/CSS/JS Learning Platform

Интерактивная платформа для обучения веб-разработке с системой пошаговых проектов, автоматической валидацией кода и встроенным редактором.

![Platform Status](https://img.shields.io/badge/status-active-success)
![Node Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)
![React Version](https://img.shields.io/badge/react-19.1.0-blue)

## 📋 Содержание

- [Описание](#-описание)
- [Возможности](#-возможности)
- [Технологический стек](#-технологический-стек)
- [Установка](#-установка)
- [Запуск](#-запуск)
- [Структура проекта](#-структура-проекта)
- [API документация](#-api-документация)
- [Разработка](#-разработка)
- [Развертывание](#-развертывание)
- [Вклад в проект](#-вклад-в-проект)
- [Лицензия](#-лицензия)

## 🎯 Описание

Платформа предназначена для интерактивного обучения HTML, CSS и JavaScript через практические проекты. Студенты проходят курсы, состоящие из пошаговых проектов, где каждый шаг автоматически проверяется системой валидации.

### Ключевые особенности:

- **Интерактивное обучение** - пишите код в браузере и сразу видите результат
- **Пошаговая система** - каждый проект разбит на логические шаги
- **Автоматическая проверка** - 21 тип правил валидации для HTML/CSS/JS
- **Отслеживание прогресса** - система сохраняет ваш код и прогресс
- **Monaco Editor** - профессиональный редактор кода (как в VS Code)

## ✨ Возможности

### Для Студентов:
- ✅ Регистрация и аутентификация
- ✅ Просмотр доступных курсов
- ✅ Прохождение пошаговых проектов
- ✅ Автосохранение кода
- ✅ Мгновенная валидация решений
- ✅ Отслеживание прогресса
- ✅ Просмотр примеров решений

### Для Администраторов:
- ✅ Создание курсов и проектов
- ✅ Настройка шагов с правилами валидации
- ✅ Управление пользователями
- ✅ Загрузка примеров и ресурсов

### Система Валидации:
- **HTML Rules** (8 типов): elementExists, elementText, elementHasClass, и др.
- **CSS Rules** (3 типа): computedStyle, styleRuleExists, styleRuleProperty
- **JavaScript Rules** (6 типов): jsGlobalDefined, jsExpression, jsFunctionReturns, и др.
- **Logic Rules** (4 типа): allOf, anyOf, not, countAtLeast

## 🛠 Технологический стек

### Frontend:
- **React 19.1.0** - UI библиотека
- **Vite 6.3.5** - сборщик и dev-сервер
- **MobX** - управление состоянием
- **Monaco Editor** - редактор кода
- **React Router** - маршрутизация
- **Axios** - HTTP клиент
- **React Split** - разделяемые панели

### Backend:
- **Node.js** - runtime
- **Express 5.1.0** - web framework
- **Sequelize 6.37.7** - ORM
- **MySQL** - база данных
- **JSDOM** - валидация HTML/CSS/JS
- **JWT** - аутентификация
- **bcrypt** - хеширование паролей

## 📦 Установка

### Требования:
- Node.js >= 16.0.0
- npm >= 8.0.0
- MySQL >= 8.0

### Шаги установки:

1. **Клонировать репозиторий:**
```bash
git clone https://github.com/shevtsovsv/02_HTML_CURS.git
cd 02_HTML_CURS
```

2. **Установить зависимости для сервера:**
```bash
cd server
npm install
```

3. **Установить зависимости для клиента:**
```bash
cd ../client
npm install
```

4. **Настроить базу данных:**

Создайте базу данных MySQL:
```sql
CREATE DATABASE htmlcurs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Настройте подключение в `server/config/config.json`:
```json
{
  "development": {
    "username": "your_username",
    "password": "your_password",
    "database": "htmlcurs",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
```

5. **Создать файл .env для сервера:**
```bash
cd server
cat > .env << EOF
PORT=5000
JWT_SECRET=your_secret_key_here_change_in_production
NODE_ENV=development
EOF
```

6. **Выполнить миграции:**
```bash
cd server
npx sequelize-cli db:migrate
```

7. **Загрузить начальные данные (seeders):**
```bash
npx sequelize-cli db:seed:all
```

## 🚀 Запуск

### Development режим:

**Терминал 1 - Запуск сервера:**
```bash
cd server
npm run dev
# Сервер запустится на http://localhost:5000
```

**Терминал 2 - Запуск клиента:**
```bash
cd client
npm run dev
# Клиент запустится на http://localhost:5173
```

### Production режим:

**1. Собрать клиент:**
```bash
cd client
npm run build
```

**2. Запустить сервер:**
```bash
cd server
NODE_ENV=production node app.js
```

## 📁 Структура проекта

```
02_HTML_CURS/
├── client/                    # React frontend
│   ├── public/               # Статические файлы
│   ├── src/
│   │   ├── api/             # API клиент (axios)
│   │   ├── components/      # React компоненты
│   │   │   ├── layout/     # Layout компоненты
│   │   │   ├── modals/     # Модальные окна
│   │   │   └── ProjectPage/ # Компоненты страницы проекта
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Страницы приложения
│   │   ├── stores/          # MobX stores
│   │   └── utils/           # Утилиты
│   ├── package.json
│   └── vite.config.js
│
├── server/                    # Node.js backend
│   ├── config/               # Конфигурация БД
│   ├── controllers/          # Контроллеры API
│   ├── lib/                  # Библиотеки (validation rules)
│   ├── middleware/           # Express middleware
│   ├── migrations/           # Миграции БД
│   ├── models/               # Sequelize модели
│   ├── routes/               # API маршруты
│   ├── seeders/              # Данные для БД
│   ├── test/                 # Тесты
│   ├── app.js               # Точка входа
│   └── package.json
│
├── CODE_REVIEW_AND_RECOMMENDATIONS.md  # Анализ и рекомендации
├── PROJECT_SUMMARY.md                   # Описание Wishbone проекта
├── ENHANCED_VALIDATION.md               # Документация валидации
└── README.md                            # Этот файл
```

## 🔌 API документация

### Основные эндпоинты:

#### Аутентификация:
```
POST   /api/auth/register     - Регистрация пользователя
POST   /api/auth/login        - Вход в систему
GET    /api/auth/me           - Получить текущего пользователя
```

#### Курсы:
```
GET    /api/courses           - Список всех курсов
GET    /api/courses/:slug     - Получить курс по slug
POST   /api/courses           - Создать курс (admin)
PUT    /api/courses/:id       - Обновить курс (admin)
DELETE /api/courses/:id       - Удалить курс (admin)
```

#### Проекты:
```
GET    /api/projects/:id      - Получить проект со всеми шагами
POST   /api/projects          - Создать проект (admin)
PUT    /api/projects/:id      - Обновить проект (admin)
DELETE /api/projects/:id      - Удалить проект (admin)
```

#### Шаги проекта:
```
GET    /api/steps/:projectId           - Все шаги проекта
POST   /api/steps                      - Создать шаг (admin)
PUT    /api/steps/:id                  - Обновить шаг (admin)
DELETE /api/steps/:id                  - Удалить шаг (admin)
```

#### Валидация:
```
POST   /api/validation/check/:stepId  - Проверить код пользователя
```

#### Код пользователя:
```
GET    /api/user-code/:projectId     - Получить сохраненный код
POST   /api/user-code                - Сохранить код
PUT    /api/user-code/:id            - Обновить код
```

#### Прогресс:
```
GET    /api/progress/:projectId      - Получить прогресс по проекту
POST   /api/progress                 - Отметить шаг как выполненный
```

### Формат запросов:

**Пример: Проверка кода**
```javascript
POST /api/validation/check/:stepId
Headers: {
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Body: {
  "html": "<h1>Hello World</h1>",
  "css": "h1 { color: red; }",
  "js": "console.log('Hello');"
}

Response: {
  "success": true,
  "message": "Отлично, шаг выполнен верно!"
}
// или
{
  "success": false,
  "errors": [
    "Элемент h1 не найден",
    "Текст заголовка должен быть 'Hello World'"
  ]
}
```

## 👨‍💻 Разработка

### Добавление нового курса:

1. Создайте seeder файл:
```bash
cd server
npx sequelize-cli seed:generate --name my-new-course
```

2. Заполните seeder:
```javascript
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const [courses] = await queryInterface.sequelize.query(
      "SELECT id FROM courses WHERE slug = 'osnovy-html-i-css'"
    );
    
    await queryInterface.bulkInsert('projects', [{
      title: 'Мой новый проект',
      description: 'Описание проекта',
      course_id: courses[0].id,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('projects', {
      title: 'Мой новый проект'
    });
  }
};
```

3. Запустите seeder:
```bash
npx sequelize-cli db:seed --seed название-файла.js
```

### Линтинг:

**Frontend:**
```bash
cd client
npm run lint
```

### Создание новой миграции:
```bash
cd server
npx sequelize-cli migration:generate --name add-new-field
```

## 🌐 Развертывание

### Docker (рекомендуется):

1. Создайте `Dockerfile` для сервера:
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "app.js"]
```

2. Создайте `docker-compose.yml`:
```yaml
version: '3.8'
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: htmlcurs
    volumes:
      - db_data:/var/lib/mysql
  
  server:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - db
    environment:
      - DB_HOST=db
  
  client:
    build: ./client
    ports:
      - "80:80"

volumes:
  db_data:
```

3. Запустите:
```bash
docker-compose up -d
```

### Традиционное развертывание:

1. Настройте production БД
2. Обновите `server/config/config.json` для production
3. Соберите клиент: `cd client && npm run build`
4. Разместите `client/dist` на веб-сервере (nginx/apache)
5. Запустите сервер с PM2:
```bash
npm install -g pm2
cd server
pm2 start app.js --name "html-curs-api"
pm2 save
pm2 startup
```

## 🤝 Вклад в проект

Мы приветствуем вклад в развитие проекта! 

### Процесс:
1. Fork проекта
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

### Правила:
- Следуйте существующему стилю кода
- Добавляйте тесты для новой функциональности
- Обновляйте документацию
- Одна функция = один PR

## 📝 Тестовые данные

После запуска seeders доступны следующие тестовые пользователи:

**Администратор:**
- Email: `admin@example.com`
- Пароль: `admin123`

**Студент:**
- Email: `student@example.com`
- Пароль: `student123`

## 🐛 Известные проблемы

- [ ] Отсутствует pagination для больших списков
- [ ] Нет real-time обновлений прогресса
- [ ] Мобильная версия требует улучшений
- [ ] Отсутствует dark mode

См. [Issues](https://github.com/shevtsovsv/02_HTML_CURS/issues) для полного списка.

## 📚 Дополнительная документация

- [CODE_REVIEW_AND_RECOMMENDATIONS.md](CODE_REVIEW_AND_RECOMMENDATIONS.md) - Подробный анализ и рекомендации
- [ENHANCED_VALIDATION.md](ENHANCED_VALIDATION.md) - Система валидации
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Wishbone проект
- [WISHBONE_PROJECT.md](WISHBONE_PROJECT.md) - Детали проекта

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для деталей.

## 👥 Авторы

- **Shevtsov SV** - *Начальная работа* - [shevtsovsv](https://github.com/shevtsovsv)

## 🙏 Благодарности

- Monaco Editor team за отличный редактор
- React и Vite сообщества
- Всем контрибьюторам проекта

---

Сделано с ❤️ для обучения веб-разработке
