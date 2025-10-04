# 📚 Best Practices Guide

Руководство по лучшим практикам разработки для этого проекта.

## 📋 Содержание

- [Backend Best Practices](#backend-best-practices)
- [Frontend Best Practices](#frontend-best-practices)
- [Database Best Practices](#database-best-practices)
- [Security Best Practices](#security-best-practices)
- [Testing Best Practices](#testing-best-practices)
- [Git Best Practices](#git-best-practices)

## Backend Best Practices

### 1. Структура контроллеров

✅ **DO:**
```javascript
// Используйте asyncHandler для обработки ошибок
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  res.json({ success: true, data: user });
});
```

❌ **DON'T:**
```javascript
// Не используйте try-catch в каждом контроллере
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

### 2. Валидация входных данных

✅ **DO:**
```javascript
const createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  
  // Явная валидация
  if (!title || title.trim().length < 3) {
    throw new AppError('Title must be at least 3 characters', 400);
  }
  
  // Или используйте express-validator
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError('Validation failed', 400);
  }
  
  // Продолжение логики...
});
```

❌ **DON'T:**
```javascript
// Не пропускайте валидацию
const createCourse = async (req, res) => {
  const course = await Course.create(req.body); // Опасно!
  res.json(course);
};
```

### 3. Логирование

✅ **DO:**
```javascript
const logger = require('../utils/logger');

const processData = asyncHandler(async (req, res) => {
  logger.info('Processing data', { userId: req.user.id });
  
  // Обработка...
  
  logger.debug('Data processed', { resultCount: results.length });
  
  res.json({ success: true, data: results });
});
```

❌ **DON'T:**
```javascript
// Не используйте console.log в production
console.log('User logged in'); // Плохо!
console.error('Error:', error); // Плохо!
```

### 4. Запросы к базе данных

✅ **DO:**
```javascript
// Используйте eager loading
const project = await Project.findByPk(id, {
  include: [
    { model: ProjectStep, as: 'steps' },
    { model: Course, as: 'course' }
  ]
});

// Выбирайте только нужные поля
const users = await User.findAll({
  attributes: ['id', 'name', 'email']
});

// Используйте индексы для where условий
const course = await Course.findOne({
  where: { slug: slug } // slug должен быть indexed
});
```

❌ **DON'T:**
```javascript
// N+1 problem
const projects = await Project.findAll();
for (const project of projects) {
  project.steps = await ProjectStep.findAll({ 
    where: { project_id: project.id } 
  }); // Плохо!
}

// Выбор всех полей
const users = await User.findAll(); // Включает password!
```

## Frontend Best Practices

### 1. Структура компонентов

✅ **DO:**
```jsx
// Функциональные компоненты с хуками
const MyComponent = ({ data, onAction }) => {
  const [state, setState] = useState(initialState);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  const handleClick = useCallback(() => {
    onAction(data);
  }, [data, onAction]);
  
  return <div onClick={handleClick}>{data}</div>;
};

// PropTypes
MyComponent.propTypes = {
  data: PropTypes.object.isRequired,
  onAction: PropTypes.func.isRequired,
};
```

❌ **DON'T:**
```jsx
// Классовые компоненты без необходимости
class MyComponent extends React.Component {
  // Устаревший подход
}

// Компоненты без PropTypes
const MyComponent = (props) => {
  return <div>{props.data}</div>; // Нет type checking!
};
```

### 2. Состояние и эффекты

✅ **DO:**
```jsx
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/users/${userId}`);
        if (!cancelled) {
          setUser(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    // Cleanup
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <EmptyState />;
  
  return <div>{user.name}</div>;
};
```

❌ **DON'T:**
```jsx
// Без обработки состояний загрузки/ошибок
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    api.get(`/users/${userId}`).then(setUser); // Нет обработки ошибок!
  }, [userId]);
  
  return <div>{user.name}</div>; // Может быть null!
};
```

### 3. Производительность

✅ **DO:**
```jsx
// Мемоизация компонентов
const ExpensiveComponent = memo(({ data }) => {
  return <div>{/* Сложный рендер */}</div>;
});

// Мемоизация вычислений
const ResultsList = ({ items, filter }) => {
  const filteredItems = useMemo(() => {
    return items.filter(item => item.type === filter);
  }, [items, filter]);
  
  return <List items={filteredItems} />;
};

// Мемоизация callbacks
const handleClick = useCallback(() => {
  doSomething(value);
}, [value]);
```

❌ **DON'T:**
```jsx
// Создание функций в render
const MyComponent = () => {
  return (
    <button onClick={() => console.log('clicked')}>
      Click
    </button>
  ); // Создается новая функция при каждом рендере!
};

// Вычисления в render без useMemo
const MyComponent = ({ items }) => {
  const expensiveValue = items
    .map(x => x * 2)
    .filter(x => x > 10)
    .reduce((a, b) => a + b); // Вычисляется при каждом рендере!
    
  return <div>{expensiveValue}</div>;
};
```

### 4. Accessibility

✅ **DO:**
```jsx
// Семантический HTML и ARIA атрибуты
<button
  onClick={handleClick}
  aria-label="Delete item"
  disabled={isDeleting}
>
  🗑️
</button>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</div>

// Alt text для изображений
<img src={image} alt="Course thumbnail showing HTML basics" />
```

❌ **DON'T:**
```jsx
// Div вместо кнопки без accessibility
<div onClick={handleClick}>Click</div>

// Изображения без alt
<img src={image} />

// Нет keyboard navigation
<div onClick={handleClick}>Button</div>
```

## Database Best Practices

### 1. Миграции

✅ **DO:**
```javascript
// Всегда используйте миграции для изменений схемы
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
    // Добавьте индекс если нужно
    await queryInterface.addIndex('users', ['phone']);
  },
  
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'phone');
  }
};
```

❌ **DON'T:**
```javascript
// Изменение базы данных вручную через SQL
// ALTER TABLE users ADD COLUMN phone VARCHAR(255); // Плохо!
```

### 2. Индексы

✅ **DO:**
```javascript
// Добавляйте индексы для часто используемых полей
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex('courses', ['slug'], {
      unique: true,
      name: 'courses_slug_unique'
    });
    
    await queryInterface.addIndex('projects', ['course_id', 'order']);
  }
};
```

### 3. Транзакции

✅ **DO:**
```javascript
// Используйте транзакции для связанных операций
const createProjectWithSteps = async (projectData, stepsData) => {
  const t = await sequelize.transaction();
  
  try {
    const project = await Project.create(projectData, { transaction: t });
    
    const steps = await Promise.all(
      stepsData.map(step => 
        ProjectStep.create({ ...step, project_id: project.id }, { transaction: t })
      )
    );
    
    await t.commit();
    return { project, steps };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};
```

## Security Best Practices

### 1. Аутентификация

✅ **DO:**
```javascript
// Хешируйте пароли
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);

// Используйте JWT с expiration
const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Проверяйте токен в middleware
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new AppError('No token', 401);
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findByPk(decoded.id);
  next();
};
```

❌ **DON'T:**
```javascript
// Храните пароли в открытом виде
await User.create({ password: password }); // Опасно!

// Токены без expiration
const token = jwt.sign({ id: user.id }, 'secret'); // Нет expiration!
```

### 2. Валидация и Санитизация

✅ **DO:**
```javascript
// Валидируйте все входные данные
const { body, validationResult } = require('express-validator');

router.post('/courses',
  body('title').trim().isLength({ min: 3 }),
  body('description').trim().isLength({ min: 10 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError('Validation failed', 400);
    }
    // Продолжение...
  }
);
```

### 3. Rate Limiting

✅ **DO:**
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // максимум 100 запросов
  message: 'Too many requests'
});

app.use('/api/', limiter);
```

## Testing Best Practices

### 1. Unit тесты

✅ **DO:**
```javascript
describe('User Model', () => {
  it('should hash password before save', async () => {
    const user = await User.create({
      email: 'test@test.com',
      password: 'password123'
    });
    
    expect(user.password).not.toBe('password123');
    const isValid = await bcrypt.compare('password123', user.password);
    expect(isValid).toBe(true);
  });
});
```

### 2. Integration тесты

✅ **DO:**
```javascript
describe('POST /api/courses', () => {
  it('should create a new course', async () => {
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Course',
        description: 'Test Description'
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });
});
```

## Git Best Practices

### 1. Commit Messages

✅ **DO:**
```bash
# Используйте Conventional Commits
git commit -m "feat(auth): add password reset functionality"
git commit -m "fix(validation): correct email regex"
git commit -m "docs(readme): update installation steps"

# С телом для сложных изменений
git commit -m "feat(courses): add search functionality

- Add search input component
- Implement debounced search
- Add API endpoint
- Update tests"
```

❌ **DON'T:**
```bash
# Неясные сообщения
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

### 2. Branching

✅ **DO:**
```bash
# Создавайте feature branches
git checkout -b feature/user-profile
git checkout -b fix/login-error
git checkout -b docs/api-documentation

# Держите ветки актуальными
git fetch origin
git rebase origin/main
```

### 3. Pull Requests

✅ **DO:**
- Одна функция = один PR
- Описательное название и описание
- Линк на related issues
- Запросите code review
- Обновите документацию

## Заключение

Следование этим практикам поможет:
- ✅ Писать чистый, поддерживаемый код
- ✅ Избегать распространенных ошибок
- ✅ Улучшить производительность
- ✅ Повысить безопасность
- ✅ Упростить тестирование

Смотрите также:
- [ARCHITECTURE.md](ARCHITECTURE.md) - Архитектура системы
- [CONTRIBUTING.md](CONTRIBUTING.md) - Правила контрибуции
- [server/examples/exampleController.js](server/examples/exampleController.js) - Пример контроллера
- [client/src/examples/ExampleComponent.jsx](client/src/examples/ExampleComponent.jsx) - Пример компонента
