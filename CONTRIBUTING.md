# 🤝 Contributing Guidelines

Спасибо за интерес к проекту! Мы приветствуем любой вклад - от исправления опечаток до новых функций.

## 📋 Содержание

- [Code of Conduct](#code-of-conduct)
- [Как я могу помочь?](#как-я-могу-помочь)
- [Процесс разработки](#процесс-разработки)
- [Стиль кода](#стиль-кода)
- [Commit сообщения](#commit-сообщения)
- [Pull Request процесс](#pull-request-процесс)
- [Reporting Bugs](#reporting-bugs)
- [Предложение новых функций](#предложение-новых-функций)

## Code of Conduct

Участвуя в этом проекте, вы соглашаетесь следовать принципам уважительного и профессионального общения. Будьте вежливы и конструктивны.

## Как я могу помочь?

### 🐛 Исправление багов
Проверьте раздел [Issues](https://github.com/shevtsovsv/02_HTML_CURS/issues) с меткой `bug`.

### ✨ Новые функции
Посмотрите issues с меткой `enhancement` или `feature request`.

### 📝 Документация
Улучшение документации всегда приветствуется! Метка `documentation`.

### 🧪 Написание тестов
Помогите увеличить покрытие тестами. Метка `tests`.

### 🎨 UI/UX улучшения
Улучшение интерфейса и пользовательского опыта. Метка `ui/ux`.

## Процесс разработки

### 1. Fork и клонирование

```bash
# Fork репозитория через GitHub UI
# Затем клонируйте ваш fork
git clone https://github.com/YOUR_USERNAME/02_HTML_CURS.git
cd 02_HTML_CURS

# Добавьте upstream remote
git remote add upstream https://github.com/shevtsovsv/02_HTML_CURS.git
```

### 2. Создание branch

```bash
# Обновите main
git checkout main
git pull upstream main

# Создайте feature branch
git checkout -b feature/amazing-feature
# или для bugfix
git checkout -b fix/issue-123
```

### 3. Установка зависимостей

```bash
# Установите зависимости для сервера
cd server
npm install

# Установите зависимости для клиента
cd ../client
npm install
```

### 4. Настройка окружения

Следуйте инструкциям в [README.md](README.md) для настройки базы данных и переменных окружения.

### 5. Внесение изменений

- Пишите чистый, понятный код
- Следуйте существующему стилю кода
- Добавляйте комментарии для сложной логики
- Обновляйте документацию при необходимости

### 6. Тестирование

```bash
# Запустите существующие тесты
cd server
npm test

# Добавьте тесты для нового кода
# Убедитесь, что все тесты проходят
```

### 7. Commit изменений

```bash
git add .
git commit -m "feat: add amazing feature"
```

См. раздел [Commit сообщения](#commit-сообщения) для правил.

### 8. Push и создание PR

```bash
git push origin feature/amazing-feature
```

Затем откройте Pull Request через GitHub UI.

## Стиль кода

### JavaScript/React

#### Именование:
```javascript
// camelCase для переменных и функций
const userName = "John";
function fetchUserData() {}

// PascalCase для компонентов и классов
class UserStore {}
function UserProfile() {}

// UPPERCASE для констант
const API_URL = "http://localhost:5000";
const MAX_RETRIES = 3;
```

#### Форматирование:
```javascript
// Используйте 2 пробела для отступов
function example() {
  if (condition) {
    doSomething();
  }
}

// Используйте одинарные кавычки
const message = 'Hello World';

// Запятая в конце для многострочных объектов/массивов
const obj = {
  name: 'John',
  age: 30,
};
```

#### React компоненты:
```javascript
// Функциональные компоненты с деструктуризацией props
function UserCard({ name, email, onEdit }) {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
}

// Используйте PropTypes или TypeScript для типизации
UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
};
```

#### Хуки:
```javascript
// Хуки в начале компонента
function MyComponent() {
  const [state, setState] = useState(initialState);
  const { user } = useStore();
  
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // Затем остальная логика
  const handleClick = () => {};
  
  return <div>...</div>;
}
```

### CSS

```css
/* BEM именование */
.user-card {}
.user-card__header {}
.user-card__header--active {}

/* Группируйте похожие свойства */
.element {
  /* Positioning */
  position: relative;
  top: 0;
  
  /* Box model */
  display: flex;
  width: 100%;
  padding: 10px;
  
  /* Typography */
  font-size: 16px;
  color: #333;
  
  /* Visual */
  background: white;
  border-radius: 4px;
  
  /* Misc */
  cursor: pointer;
}
```

### Node.js/Express

```javascript
// Async/await для асинхронных операций
async function getUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// JSDoc комментарии для функций
/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
async function getUserById(req, res) {
  // implementation
}
```

## Commit сообщения

Используем [Conventional Commits](https://www.conventionalcommits.org/):

### Формат:
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: Новая функция
- `fix`: Исправление бага
- `docs`: Изменения в документации
- `style`: Форматирование кода (без изменения логики)
- `refactor`: Рефакторинг кода
- `test`: Добавление/изменение тестов
- `chore`: Изменения в build process, инструментах и т.д.
- `perf`: Улучшение производительности

### Примеры:
```bash
# Новая функция
git commit -m "feat(auth): add password reset functionality"

# Исправление бага
git commit -m "fix(validation): correct email validation regex"

# Документация
git commit -m "docs(readme): update installation instructions"

# Рефакторинг
git commit -m "refactor(store): simplify user store logic"

# С телом сообщения
git commit -m "feat(courses): add course search

- Add search input component
- Implement debounced search
- Add API endpoint for course search"

# Breaking change
git commit -m "feat(api)!: change user endpoint response format

BREAKING CHANGE: User endpoint now returns nested object"
```

## Pull Request процесс

### 1. Проверка перед созданием PR

- [ ] Код проходит все тесты
- [ ] Добавлены новые тесты (если необходимо)
- [ ] Код следует стилю проекта
- [ ] Документация обновлена
- [ ] Коммиты следуют конвенции
- [ ] Ветка обновлена с main

### 2. Название и описание PR

**Название:**
```
feat: Add user profile page
fix: Resolve validation error on login
docs: Update API documentation
```

**Описание должно включать:**
```markdown
## Описание
Краткое описание изменений

## Тип изменения
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Как протестировано?
Опишите проведенные тесты

## Checklist
- [x] Код следует стилю проекта
- [x] Добавлена документация
- [x] Добавлены тесты
- [x] Все тесты проходят

## Screenshots (если применимо)
[Добавьте скриншоты]

## Связанные issues
Closes #123
Related to #456
```

### 3. Code Review

- Будьте открыты к обратной связи
- Отвечайте на комментарии вежливо
- Вносите запрошенные изменения
- Обсуждайте спорные моменты

### 4. После одобрения

Maintainer выполнит merge вашего PR. Спасибо за вклад! 🎉

## Reporting Bugs

### Перед созданием bug report:

1. Проверьте [existing issues](https://github.com/shevtsovsv/02_HTML_CURS/issues)
2. Убедитесь, что используете последнюю версию
3. Попробуйте воспроизвести баг

### Создание Bug Report:

Используйте шаблон:

```markdown
**Описание бага**
Четкое описание проблемы

**Как воспроизвести**
Шаги для воспроизведения:
1. Перейти к '...'
2. Нажать на '....'
3. Прокрутить вниз до '....'
4. Увидеть ошибку

**Ожидаемое поведение**
Что должно было произойти

**Скриншоты**
Если применимо

**Окружение:**
 - OS: [e.g. macOS 12.0]
 - Browser [e.g. chrome, safari]
 - Node version [e.g. 16.0.0]
 - Version [e.g. 1.0.0]

**Дополнительный контекст**
Любая дополнительная информация
```

## Предложение новых функций

### Создание Feature Request:

```markdown
**Связано с проблемой?**
Описание проблемы, которую решает функция

**Предлагаемое решение**
Четкое описание желаемой функции

**Альтернативы**
Рассмотренные альтернативные решения

**Дополнительный контекст**
Скриншоты, примеры и т.д.
```

## Области для вклада

### 🔴 Критический приоритет:
- [ ] Написание unit тестов
- [ ] Улучшение безопасности
- [ ] Исправление критических багов
- [ ] Оптимизация производительности

### 🟡 Высокий приоритет:
- [ ] Добавление TypeScript типов
- [ ] Улучшение документации
- [ ] Accessibility улучшения
- [ ] Mobile responsiveness

### 🟢 Средний приоритет:
- [ ] UI/UX улучшения
- [ ] Новые функции
- [ ] Рефакторинг кода
- [ ] Добавление примеров

## Вопросы?

Если у вас есть вопросы:
1. Проверьте [README.md](README.md)
2. Посмотрите [Issues](https://github.com/shevtsovsv/02_HTML_CURS/issues)
3. Создайте новый issue с вопросом

## Благодарность

Каждый вклад ценен! Ваше имя будет добавлено в список контрибьюторов.

Спасибо за помощь в улучшении проекта! 🚀
