# 🏗️ Architecture Documentation

## Обзор системы

Платформа построена на современной full-stack архитектуре с четким разделением клиента и сервера.

```
┌─────────────────────────────────────────────────────────────┐
│                         Client                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application (Vite)                 │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Pages    │  │ Components │  │   Stores   │     │  │
│  │  │            │  │            │  │   (MobX)   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │         │              │                │            │  │
│  │         └──────────────┴────────────────┘            │  │
│  │                       │                              │  │
│  │                  ┌────▼────┐                         │  │
│  │                  │   API   │                         │  │
│  │                  │ (Axios) │                         │  │
│  │                  └────┬────┘                         │  │
│  └───────────────────────┼──────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────┘
                         │ HTTP/REST
                         │
┌────────────────────────▼─────────────────────────────────┐
│                        Server                             │
│  ┌───────────────────────────────────────────────────┐   │
│  │          Express.js Application                   │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  Routes  │─▶│Controllers│─▶│  Models  │       │   │
│  │  └──────────┘  └──────────┘  └─────┬────┘       │   │
│  │       │              │              │            │   │
│  │       ▼              ▼              ▼            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │Middleware│  │   Lib    │  │Sequelize │      │   │
│  │  │          │  │Validation│  │   ORM    │      │   │
│  │  └──────────┘  └──────────┘  └─────┬────┘      │   │
│  └─────────────────────────────────────┼──────────┘   │
└────────────────────────────────────────┼──────────────┘
                                         │
                                    ┌────▼────┐
                                    │  MySQL  │
                                    │Database │
                                    └─────────┘
```

## Frontend Архитектура

### Технологии:
- **React 19.1.0** - UI библиотека
- **Vite** - Build tool и dev server
- **MobX** - State management
- **React Router** - Routing
- **Monaco Editor** - Code editor

### Структура компонентов:

```
src/
├── pages/               # Page-level компоненты (роуты)
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── DashboardPage.jsx
│   ├── CoursePage.jsx
│   └── ProjectPage.jsx
│
├── components/          # Переиспользуемые компоненты
│   ├── layout/         # Layout компоненты
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── MainLayout.jsx
│   │
│   ├── modals/         # Модальные окна
│   │   ├── StepCreateModal.jsx
│   │   └── ExampleModal.jsx
│   │
│   └── ProjectPage/    # Компоненты страницы проекта
│       ├── TaskPanel.jsx
│       ├── Workspace.jsx
│       └── CodeEditor.jsx
│
├── stores/             # MobX stores
│   ├── RootStore.js
│   ├── AuthStore.js
│   ├── CourseStore.js
│   └── ProjectStore.js
│
├── api/                # API клиент
│   └── index.js        # Axios instance с interceptors
│
├── hooks/              # Custom React hooks
│   └── useStore.js
│
├── contexts/           # React contexts
│
└── utils/              # Утилиты
    └── toast.js
```

### Поток данных:

```
┌────────────┐
│   User     │
│  Action    │
└─────┬──────┘
      │
      ▼
┌─────────────┐
│  Component  │ ─────┐
└─────┬───────┘      │
      │              │ Direct state
      ▼              │ (для UI state)
┌─────────────┐      │
│    Store    │◀─────┘
│   (MobX)    │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│     API     │
│   (Axios)   │
└─────┬───────┘
      │
      ▼
   Backend
      │
      ▼
┌─────────────┐
│   Update    │
│    Store    │
└─────┬───────┘
      │
      ▼
┌─────────────┐
│ Re-render   │
│ Component   │
└─────────────┘
```

### MobX Stores:

#### RootStore
```javascript
class RootStore {
  authStore = new AuthStore(this);
  courseStore = new CourseStore(this);
  projectStore = new ProjectStore(this);
}
```

#### AuthStore
```javascript
class AuthStore {
  user = null;
  token = null;
  isAuthenticated = false;
  
  login(email, password)
  logout()
  checkAuth()
}
```

#### ProjectStore
```javascript
class ProjectStore {
  currentProject = null;
  isLoading = false;
  validationResult = null;
  
  fetchProject(id)
  checkCode(stepId, html, css, js)
  saveCode(projectId, html, css, js)
}
```

## Backend Архитектура

### Технологии:
- **Express 5.1.0** - Web framework
- **Sequelize 6.37.7** - ORM
- **MySQL** - Database
- **JSDOM** - HTML/CSS/JS validation
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Слои приложения:

```
┌──────────────────────────────────────────┐
│              HTTP Request                 │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│              Middleware Layer             │
│  - CORS                                   │
│  - JSON Parser                            │
│  - Authentication (protect)               │
│  - File Upload (multer)                   │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│              Routes Layer                 │
│  - /api/auth                              │
│  - /api/courses                           │
│  - /api/projects                          │
│  - /api/validation                        │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│            Controllers Layer              │
│  - Request validation                     │
│  - Business logic orchestration           │
│  - Response formatting                    │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│              Models Layer                 │
│  - Sequelize models                       │
│  - Database queries                       │
│  - Associations                           │
└──────────────────┬───────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│              Database                     │
│  - MySQL                                  │
└──────────────────────────────────────────┘
```

### Файловая структура:

```
server/
├── app.js                 # Entry point
│
├── config/
│   └── config.json       # Database configuration
│
├── routes/               # API routes
│   ├── auth.js
│   ├── courses.js
│   ├── project.js
│   ├── steps.js
│   ├── userCode.js
│   ├── userProgress.js
│   └── validation.js
│
├── controllers/          # Request handlers
│   ├── authController.js
│   ├── courseController.js
│   ├── projectController.js
│   ├── validationController.js
│   └── ...
│
├── models/              # Sequelize models
│   ├── index.js        # Model aggregator
│   ├── User.js
│   ├── Course.js
│   ├── Project.js
│   ├── ProjectStep.js
│   ├── userCode.js
│   └── userProgress.js
│
├── middleware/          # Custom middleware
│   ├── protect.js      # JWT authentication
│   └── upload.js       # File upload
│
├── lib/                # Business logic libraries
│   ├── validationRules.js
│   └── validationSchema.js
│
├── migrations/         # Database migrations
└── seeders/           # Database seeders
```

## База Данных

### ER Диаграмма:

```
┌─────────────┐         ┌──────────────┐
│    User     │         │     Role     │
├─────────────┤         ├──────────────┤
│ id          │◀────┐   │ id           │
│ name        │     │   │ name         │
│ email       │     │   └──────────────┘
│ password    │     │
│ role_id     │─────┘
└─────┬───────┘
      │
      │ 1:N
      │
      ▼
┌──────────────┐
│ userProgress │
├──────────────┤
│ id           │
│ user_id      │◀───────┐
│ project_id   │        │
│ step_id      │        │
│ completed    │        │
└──────────────┘        │
                        │
┌──────────────┐        │
│  userCode    │        │
├──────────────┤        │
│ id           │        │
│ user_id      │────────┘
│ project_id   │
│ html         │
│ css          │
│ js           │
└──────────────┘

┌──────────────┐       ┌──────────────┐
│   Course     │       │   Project    │
├──────────────┤       ├──────────────┤
│ id           │       │ id           │
│ title        │◀──────│ course_id    │
│ slug         │  1:N  │ title        │
│ description  │       │ order        │
└──────────────┘       │ description  │
                       │ templates    │
                       └──────┬───────┘
                              │
                              │ 1:N
                              │
                              ▼
                       ┌──────────────┐
                       │ ProjectStep  │
                       ├──────────────┤
                       │ id           │
                       │ project_id   │
                       │ instructions │
                       │ order        │
                       │ validation   │
                       │ Rules (JSON) │
                       └──────────────┘
```

### Основные модели:

#### Course
```javascript
{
  id: Integer,
  title: String,
  slug: String (unique),
  description: Text,
  timestamps: true
}

// Relations:
hasMany Project
```

#### Project
```javascript
{
  id: Integer,
  course_id: Integer,
  title: String,
  description: Text,
  order: Integer,
  html_template: Text,
  css_template: Text,
  js_template: Text,
  sampleImageUrl: String,
  timestamps: true
}

// Relations:
belongsTo Course
hasMany ProjectStep
hasMany userCode
hasMany userProgress
```

#### ProjectStep
```javascript
{
  id: Integer,
  project_id: Integer,
  instructions: Text,
  order: Integer,
  validationRules: JSON,
  timestamps: true
}

// Relations:
belongsTo Project
```

#### User
```javascript
{
  id: Integer,
  name: String,
  email: String (unique),
  password: String (hashed),
  role_id: Integer,
  timestamps: true
}

// Relations:
belongsTo Role
hasMany userCode
hasMany userProgress
```

## Система Валидации

### Архитектура валидации:

```
┌────────────────┐
│  User submits  │
│   HTML/CSS/JS  │
└───────┬────────┘
        │
        ▼
┌───────────────────┐
│  POST /validation │
│    /check/:stepId │
└───────┬───────────┘
        │
        ▼
┌────────────────────────┐
│ validationController   │
│  1. Get step rules     │
│  2. Create JSDOM       │
│  3. Create validator   │
└───────┬────────────────┘
        │
        ▼
┌────────────────────────┐
│  ValidationRules class │
│  - 21 rule types       │
│  - Safe execution      │
└───────┬────────────────┘
        │
        ▼
┌────────────────────────┐
│   Validation result    │
│   { success, errors }  │
└────────────────────────┘
```

### Типы правил:

```javascript
// HTML Rules
elementExists
elementNotExists
elementText
elementMatches
elementHasClass
elementAttribute
elementHasAttribute
elementCount

// CSS Rules
computedStyle
styleRuleExists
styleRuleProperty

// JavaScript Rules
jsGlobalDefined
jsExpression
jsFunctionReturns
jsConsoleContains
eventListenerAttached
eventDispatchChangesDom

// Logic Rules
allOf
anyOf
not
countAtLeast
```

### Пример правила:

```json
{
  "type": "elementExists",
  "selector": "h1",
  "errorMessage": "Элемент <h1> не найден"
}

{
  "type": "allOf",
  "rules": [
    {
      "type": "elementExists",
      "selector": "form"
    },
    {
      "type": "elementCount",
      "selector": "input",
      "count": 3
    }
  ]
}
```

## Аутентификация и Авторизация

### JWT Flow:

```
┌────────┐                           ┌────────┐
│ Client │                           │ Server │
└───┬────┘                           └───┬────┘
    │                                    │
    │  POST /api/auth/login              │
    │  { email, password }               │
    ├───────────────────────────────────▶│
    │                                    │
    │                         ┌──────────▼──────────┐
    │                         │ 1. Validate         │
    │                         │ 2. Check password   │
    │                         │ 3. Generate JWT     │
    │                         └──────────┬──────────┘
    │                                    │
    │  { token, user }                   │
    │◀───────────────────────────────────┤
    │                                    │
    │ Store token in localStorage        │
    │                                    │
    │  GET /api/courses                  │
    │  Headers: { Authorization: Bearer <token> }
    ├───────────────────────────────────▶│
    │                                    │
    │                         ┌──────────▼──────────┐
    │                         │ Middleware:         │
    │                         │ 1. Extract token    │
    │                         │ 2. Verify JWT       │
    │                         │ 3. Attach user      │
    │                         └──────────┬──────────┘
    │                                    │
    │  { courses: [...] }                │
    │◀───────────────────────────────────┤
    │                                    │
```

### Middleware защиты:

```javascript
// middleware/protect.js
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  // 1. Получить токен из заголовка
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Нет токена' });
  }
  
  try {
    // 2. Верифицировать токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Получить пользователя
    req.user = await User.findByPk(decoded.id);
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Неверный токен' });
  }
};
```

## Производительность

### Оптимизации:

1. **Database Query Optimization**
```javascript
// Использование eager loading
const project = await Project.findByPk(id, {
  include: [
    { model: ProjectStep, as: 'steps' },
    { model: userCode, as: 'userCodes' }
  ]
});
```

2. **React Optimization**
```javascript
// Мемоизация компонентов
const TaskPanel = memo(({ step, onCheck }) => {
  // ...
});

// Lazy loading
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
```

3. **API Response Size**
```javascript
// Только необходимые поля
const courses = await Course.findAll({
  attributes: ['id', 'title', 'slug']
});
```

## Безопасность

### Меры безопасности:

1. **Password Hashing**
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

2. **SQL Injection Prevention**
```javascript
// Sequelize автоматически экранирует
const user = await User.findOne({
  where: { email: userInput }
});
```

3. **XSS Protection**
```javascript
// React автоматически экранирует
<div>{userInput}</div>
```

4. **CORS**
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

## Масштабирование

### Горизонтальное:
- Load balancer (nginx)
- Множественные инстансы сервера
- Session store в Redis

### Вертикальное:
- Увеличение ресурсов сервера
- Database indexing
- Query optimization

### Будущее:
- Микросервисная архитектура
- Message queues (RabbitMQ/Redis)
- Caching layer (Redis)
- CDN для статики

## Мониторинг и Логирование

### Рекомендуемый стек:

```javascript
// Логирование
const winston = require('winston');

// APM
const newrelic = require('newrelic');

// Error tracking
const Sentry = require('@sentry/node');

// Metrics
const prometheus = require('prom-client');
```

## Заключение

Архитектура платформы спроектирована с учетом:
- ✅ Модульности
- ✅ Масштабируемости
- ✅ Безопасности
- ✅ Производительности
- ✅ Поддерживаемости

Следование этой архитектуре обеспечит стабильность и возможность расширения системы.
