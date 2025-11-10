# Урок 2: HTML структура и семантическая разметка

## Цели урока
- Понять важность семантической разметки
- Создать базовую структуру страницы
- Изучить основные HTML5 семантические теги
- Применить accessibility best practices

## 2.1 Что такое семантическая разметка?

**Семантическая разметка** - это использование HTML тегов, которые несут смысловую нагрузку, а не просто визуальное оформление.

### Зачем это нужно?

1. **Доступность** - помогает скринридерам понять структуру страницы
2. **SEO** - поисковые системы лучше индексируют семантический код
3. **Читаемость кода** - проще понять структуру для других разработчиков
4. **Поддержка** - легче поддерживать и обновлять код

### Примеры:

❌ **Несемантично:**
```html
<div class="header">
    <div class="nav">...</div>
</div>
<div class="main-content">...</div>
<div class="footer">...</div>
```

✅ **Семантично:**
```html
<header>
    <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
```

## 2.2 Основные семантические теги HTML5

### Структурные элементы:

| Тег | Назначение | Пример использования |
|-----|-----------|---------------------|
| `<header>` | Шапка страницы или секции | Логотип, навигация |
| `<nav>` | Навигационное меню | Главное меню, ссылки |
| `<main>` | Основное содержимое | Уникальный контент страницы |
| `<section>` | Тематическая секция | Блок преимуществ |
| `<article>` | Независимая единица контента | Статья, пост |
| `<aside>` | Дополнительный контент | Сайдбар, реклама |
| `<footer>` | Подвал страницы или секции | Копирайт, контакты |

## 2.3 Создание структуры страницы Sedona

Давайте создадим общую структуру нашей страницы:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sedona - Городок в Аризоне</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Шапка сайта -->
    <header class="page-header">
        <nav class="navigation">
            <!-- Навигация будет здесь -->
        </nav>
    </header>

    <!-- Основное содержимое -->
    <main class="page-main">
        <!-- Приветственный блок -->
        <section class="hero">
            <!-- Hero контент -->
        </section>

        <!-- Преимущества -->
        <section class="advantages">
            <!-- Список преимуществ -->
        </section>

        <!-- Поиск гостиниц -->
        <section class="search-hotels">
            <!-- Форма поиска -->
        </section>

        <!-- Подписка на рассылку -->
        <section class="newsletter">
            <!-- Форма подписки -->
        </section>
    </main>

    <!-- Подвал -->
    <footer class="page-footer">
        <!-- Контакты и ссылки -->
    </footer>
</body>
</html>
```

### Разбор структуры:

1. **`<header class="page-header">`**
   - Шапка страницы с навигацией
   - Класс `page-header` для стилизации

2. **`<main class="page-main">`**
   - Основной контент страницы
   - Должен быть только один на странице!

3. **`<section>`**
   - Тематические разделы страницы
   - Каждая секция имеет свой класс

4. **`<footer class="page-footer">`**
   - Подвал с контактной информацией

## 2.4 Именование классов (BEM методология)

**BEM** (Block Element Modifier) - методология именования классов в CSS.

### Структура:
```
block__element--modifier
```

### Примеры:

```html
<!-- Блок -->
<nav class="navigation">
    <!-- Элемент блока -->
    <ul class="navigation-list">
        <li class="navigation-item">
            <!-- Элемент с модификатором -->
            <a class="navigation-link navigation-link--active">Главная</a>
        </li>
    </ul>
</nav>
```

### Преимущества BEM:
- ✅ Понятная структура классов
- ✅ Избежание конфликтов имен
- ✅ Переиспользуемость компонентов
- ✅ Легкая поддержка

## 2.5 Доступность (Accessibility)

### Скрытие элементов визуально

Иногда нужно скрыть текст визуально, но оставить для скринридеров:

```html
<h1 class="visually-hidden">Город Sedona</h1>
```

```css
.visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    clip: rect(0 0 0 0);
    overflow: hidden;
}
```

### Альтернативный текст для изображений

```html
<!-- Декоративное изображение -->
<img src="decoration.svg" alt="">

<!-- Информативное изображение -->
<img src="logo.svg" alt="Логотип города Sedona">
```

### ARIA атрибуты

```html
<button aria-label="Закрыть окно">×</button>
<nav aria-label="Главная навигация">...</nav>
```

## 2.6 Обновленная структура с семантикой

Давайте обновим наш `index.html` с правильной семантикой:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sedona - Городок в Аризоне</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="page-header">
        <nav class="navigation">
            <a class="navigation-logo" href="index.html">
                <img src="images/logo.svg" width="140" height="70" alt="Логотип города Sedona">
            </a>
            <ul class="navigation-list">
                <li class="navigation-item">
                    <a class="navigation-link" href="index.html">Главная</a>
                </li>
            </ul>
        </nav>
    </header>

    <main class="page-main">
        <section class="hero">
            <h1 class="visually-hidden">Город Sedona</h1>
            <img class="hero-image" src="images/welcome.svg" width="458" height="352" 
                 alt="Welcome to the gorgeous Sedona">
        </section>
    </main>

    <footer class="page-footer">
        <section class="footer-contacts">
            <h2 class="visually-hidden">Контакты</h2>
            <a class="footer-contacts-phone" href="tel:+78128121212">+7 (812) 812-12-12</a>
        </section>
    </footer>
</body>
</html>
```

## 2.7 Валидация HTML

### Почему важна валидация?

- Выявляет ошибки в коде
- Обеспечивает кроссбраузерность
- Улучшает доступность

### Как проверить код?

1. Откройте [W3C Validator](https://validator.w3.org/)
2. Вставьте код или загрузите файл
3. Исправьте найденные ошибки

### Частые ошибки:

❌ Не закрытые теги:
```html
<p>Текст
<p>Другой текст
```

❌ Вложенные ссылки:
```html
<a href="/">
    <a href="/page">Ссылка</a>
</a>
```

❌ Дублирующиеся ID:
```html
<div id="block"></div>
<div id="block"></div>
```

## Практическое задание

1. ✅ Создайте семантическую структуру страницы
2. ✅ Добавьте все необходимые секции (header, main, footer)
3. ✅ Используйте BEM для именования классов
4. ✅ Добавьте скрытые заголовки для доступности
5. ✅ Проверьте код через W3C Validator
6. ✅ Убедитесь, что все изображения имеют атрибут `alt`

## Контрольные вопросы

1. Чем отличается `<section>` от `<div>`?
2. Сколько раз можно использовать тег `<main>` на странице?
3. Для чего нужен класс `visually-hidden`?
4. Что такое BEM и зачем он нужен?
5. Почему важно указывать размеры изображений (width и height)?

## Полезные ссылки

- [MDN: HTML elements reference](https://developer.mozilla.org/ru/docs/Web/HTML/Element)
- [HTML5 Doctor](http://html5doctor.com/)
- [W3C Validator](https://validator.w3.org/)
- [BEM Methodology](https://en.bem.info/)

## Что дальше?

В следующем уроке мы:
- Создадим шапку сайта
- Добавим навигационное меню
- Стилизуем логотип

---

[⬅️ Предыдущий урок](lesson-01-introduction.md) | [Следующий урок: Шапка и навигация ➡️](lesson-03-header-navigation.md)
