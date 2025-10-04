# ⚡ Quick Start Guide

Быстрый старт для разработчиков, которые хотят начать работу с проектом.

## 🚀 За 5 минут

### 1. Клонирование и установка

```bash
# Клонировать репозиторий
git clone https://github.com/shevtsovsv/02_HTML_CURS.git
cd 02_HTML_CURS

# Установить зависимости для сервера
cd server
npm install

# Установить зависимости для клиента
cd ../client
npm install
```

### 2. База данных

```bash
# Создать базу данных MySQL
mysql -u root -p
CREATE DATABASE htmlcurs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

### 3. Настройка окружения

```bash
# Создать .env файл для сервера
cd server
cp .env.example .env

# Отредактировать .env с вашими настройками
# nano .env или любой редактор
```

Минимальные настройки в `.env`:
```env
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=htmlcurs
JWT_SECRET=your_random_secret_min_32_chars
```

### 4. Миграции и начальные данные

```bash
# Запустить миграции
npx sequelize-cli db:migrate

# Загрузить начальные данные
npx sequelize-cli db:seed:all
```

### 5. Запуск

Откройте 2 терминала:

**Терминал 1 (Backend):**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Терминал 2 (Frontend):**
```bash
cd client
npm run dev
# Client running on http://localhost:5173
```

### 6. Открыть приложение

Откройте браузер: `http://localhost:5173`

**Тестовые аккаунты:**
- Admin: `admin@example.com` / `admin123`
- Student: `student@example.com` / `student123`

## 🎯 Что дальше?

### Изучить код
```bash
# Просмотреть структуру проекта
tree -L 2 -I 'node_modules'

# Просмотреть документацию
cat README.md
cat ARCHITECTURE.md
cat CODE_REVIEW_AND_RECOMMENDATIONS.md
```

### Запустить тесты
```bash
cd server
npm test
```

### Создать свой первый feature

1. Создайте новую ветку:
```bash
git checkout -b feature/my-feature
```

2. Внесите изменения

3. Запустите линтер:
```bash
# Frontend
cd client
npm run lint

# Исправить автоматически
npm run lint -- --fix
```

4. Commit и push:
```bash
git add .
git commit -m "feat: add my awesome feature"
git push origin feature/my-feature
```

5. Создайте Pull Request

## 🛠 Полезные команды

### Database

```bash
# Создать новую миграцию
npx sequelize-cli migration:generate --name add-new-field

# Создать новый seeder
npx sequelize-cli seed:generate --name demo-data

# Откатить последнюю миграцию
npx sequelize-cli db:migrate:undo

# Откатить все миграции
npx sequelize-cli db:migrate:undo:all

# Откатить все seeders
npx sequelize-cli db:seed:undo:all
```

### Development

```bash
# Backend с hot-reload
cd server
npm run dev

# Frontend с hot-reload
cd client
npm run dev

# Build для production
cd client
npm run build

# Preview production build
npm run preview
```

### Debugging

```bash
# Проверить логи базы данных
cd server
# Включить logging в config/config.js

# Проверить API endpoints
curl http://localhost:5000/api/courses

# С авторизацией
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/projects/1
```

## 📝 Частые проблемы

### Проблема: База данных не подключается

**Решение:**
```bash
# Проверьте, запущен ли MySQL
sudo systemctl status mysql
# или
brew services list | grep mysql

# Проверьте настройки в .env
cat server/.env

# Проверьте права пользователя
mysql -u your_user -p
SHOW GRANTS;
```

### Проблема: Port уже занят

**Решение:**
```bash
# Найти процесс на порту 5000
lsof -i :5000
# или на Windows
netstat -ano | findstr :5000

# Убить процесс
kill -9 PID

# Или изменить порт в .env
PORT=5001
```

### Проблема: CORS ошибки

**Решение:**
```bash
# Проверьте CORS_ORIGIN в server/.env
CORS_ORIGIN=http://localhost:5173

# Убедитесь, что клиент запущен на том же порту
```

### Проблема: Миграции не применяются

**Решение:**
```bash
# Проверьте таблицу SequelizeMeta
mysql -u root -p htmlcurs
SELECT * FROM SequelizeMeta;

# Если таблица пустая, запустите миграции заново
cd server
npx sequelize-cli db:migrate

# Если есть ошибки, проверьте config/config.js
```

## 🔍 Структура для быстрого ориентирования

```
02_HTML_CURS/
├── client/              # React Frontend
│   ├── src/
│   │   ├── pages/      # Страницы (роуты)
│   │   ├── components/ # UI компоненты
│   │   ├── stores/     # MobX stores
│   │   └── api/        # API клиент
│   └── package.json
│
├── server/             # Node.js Backend
│   ├── routes/         # API маршруты
│   ├── controllers/    # Контроллеры
│   ├── models/         # Sequelize модели
│   ├── middleware/     # Express middleware
│   ├── lib/            # Библиотеки (validation)
│   ├── migrations/     # DB миграции
│   ├── seeders/        # DB seeders
│   └── package.json
│
└── docs/               # Документация
```

## 💡 Советы

### Эффективная разработка

1. **Используйте hot-reload** - изменения применяются автоматически
2. **Проверяйте логи** - они помогают понять, что происходит
3. **Используйте React DevTools** - для отладки компонентов
4. **Используйте Postman/Insomnia** - для тестирования API
5. **Читайте код** - лучший способ понять систему

### Лучшие практики

1. **Делайте частые коммиты** - малые изменения легче ревьювить
2. **Пишите понятные commit messages** - следуйте Conventional Commits
3. **Добавляйте тесты** - для новой функциональности
4. **Обновляйте документацию** - если меняете API или архитектуру
5. **Спрашивайте** - если что-то непонятно

## 📚 Дополнительные ресурсы

- [README.md](README.md) - Полная документация
- [ARCHITECTURE.md](ARCHITECTURE.md) - Архитектура системы
- [CONTRIBUTING.md](CONTRIBUTING.md) - Правила контрибуции
- [CODE_REVIEW_AND_RECOMMENDATIONS.md](CODE_REVIEW_AND_RECOMMENDATIONS.md) - Анализ кода

## 🆘 Нужна помощь?

1. Проверьте [Issues](https://github.com/shevtsovsv/02_HTML_CURS/issues)
2. Создайте новый Issue с описанием проблемы
3. Добавьте label `question` или `help wanted`

---

Готово! Вы готовы к разработке. Удачи! 🚀
