# Урок 10: Адаптивный дизайн

## Цели урока
- Создать адаптивную версию сайта
- Изучить Media Queries
- Mobile-first подход
- Тестирование на разных устройствах

## 10.1 Что такое адаптивный дизайн?

**Адаптивный дизайн** (Responsive Design) - это подход к веб-дизайну, при котором сайт корректно отображается на устройствах с разными размерами экрана.

### Основные принципы:
1. Гибкая сетка (Flexible Grid)
2. Гибкие изображения (Flexible Images)
3. Медиа-запросы (Media Queries)

## 10.2 Media Queries

Media Queries позволяют применять стили в зависимости от характеристик устройства.

### Синтаксис:

```css
@media (условие) {
    /* Стили */
}
```

### Примеры:

```css
/* Для экранов шире 768px */
@media (min-width: 768px) {
    .container {
        width: 750px;
    }
}

/* Для экранов уже 1199px */
@media (max-width: 1199px) {
    .container {
        width: 100%;
    }
}

/* Для печати */
@media print {
    .navigation {
        display: none;
    }
}
```

## 10.3 Breakpoints (Точки перелома)

Стандартные точки перелома:

```css
/* Mobile (до 767px) - базовые стили */

/* Tablet (768px - 1199px) */
@media (min-width: 768px) {
    /* Стили для планшетов */
}

/* Desktop (1200px и выше) */
@media (min-width: 1200px) {
    /* Стили для десктопов */
}
```

### Для Sedona:

```css
/* Desktop-first подход */
@media (max-width: 1199px) {
    .advantages-header {
        padding: 69px 85px 90px;
    }
}

@media (max-width: 767px) {
    .advantages-header {
        padding: 40px 20px;
    }
}
```

## 10.4 Адаптивная навигация

### Desktop:
```css
.navigation {
    display: flex;
}

.navigation-list {
    display: flex;
}
```

### Mobile:
```css
@media (max-width: 767px) {
    .navigation-list {
        display: none; /* Или меню-бургер */
    }
    
    .navigation-toggle {
        display: block;
    }
}
```

## 10.5 Адаптивные изображения

### HTML:

```html
<!-- Разные изображения для разных экранов -->
<picture>
    <source media="(min-width: 1200px)" srcset="hero-desktop.jpg">
    <source media="(min-width: 768px)" srcset="hero-tablet.jpg">
    <img src="hero-mobile.jpg" alt="Hero">
</picture>

<!-- Retina изображения -->
<img src="logo.png" 
     srcset="logo.png 1x, logo@2x.png 2x" 
     alt="Logo">
```

### CSS:

```css
.hero-image {
    max-width: 100%;
    height: auto;
}
```

## 10.6 Адаптивная типографика

```css
/* Desktop */
.title {
    font-size: 30px;
}

/* Mobile */
@media (max-width: 767px) {
    .title {
        font-size: 22px;
    }
}
```

### Использование clamp():

```css
.title {
    /* min, предпочтительный, max */
    font-size: clamp(22px, 5vw, 30px);
}
```

## 10.7 Flexbox для адаптивности

```css
.advantages-item {
    display: flex;
}

@media (max-width: 767px) {
    .advantages-item {
        flex-direction: column;
    }
}
```

## 10.8 Полный пример адаптивных стилей

```css
/* =================
   Адаптивность
   ================= */

/* До 1199px */
@media (max-width: 1199px) {
    .page-header,
    .page-main,
    .page-footer {
        max-width: 100%;
    }

    .advantages-header {
        padding: 69px 85px 90px;
    }

    .search-hotels {
        padding: 96px 85px;
    }

    .newsletter {
        padding: 96px 85px 104px;
    }
}

/* До 767px */
@media (max-width: 767px) {
    .navigation {
        padding: 0 20px;
    }

    .navigation-list {
        display: none;
    }

    .advantages-header {
        padding: 40px 20px;
    }

    .advantages-item {
        flex-direction: column;
    }

    .advantages-content,
    .advantages-item-blue .advantages-content {
        width: 100%;
        padding: 40px 20px;
    }

    .advantages-image {
        width: 100%;
    }

    .search-hotels {
        padding: 60px 20px;
    }

    .newsletter {
        padding: 60px 20px;
    }

    .newsletter-form {
        flex-direction: column;
    }

    .newsletter-input {
        margin-bottom: 20px;
        border-radius: 4px;
    }

    .newsletter-button {
        border-radius: 4px;
    }

    .footer-container {
        flex-direction: column;
        gap: 20px;
    }
}
```

## 10.9 Тестирование адаптивности

### В браузере:
1. Откройте DevTools (F12)
2. Нажмите Toggle Device Toolbar (Ctrl+Shift+M)
3. Выберите устройство или введите размер

### Популярные размеры:
- Mobile: 320px, 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1440px, 1920px

## 10.10 Лучшие практики

### 1. Mobile-first:
```css
/* Базовые стили для мобильных */
.element {
    width: 100%;
}

/* Расширение для больших экранов */
@media (min-width: 768px) {
    .element {
        width: 50%;
    }
}
```

### 2. Не дублируйте код:
❌ Плохо:
```css
.title { font-size: 30px; }
@media (max-width: 767px) {
    .title { font-size: 22px; color: black; } /* color дублируется */
}
```

✅ Хорошо:
```css
.title {
    font-size: 30px;
    color: black;
}

@media (max-width: 767px) {
    .title {
        font-size: 22px;
    }
}
```

### 3. Используйте относительные единицы:
```css
.container {
    width: 100%;
    max-width: 1200px;
    padding: 0 5%; /* Вместо px */
}
```

## Практическое задание

1. ✅ Добавьте media queries для 768px и 1200px
2. ✅ Сделайте навигацию адаптивной
3. ✅ Адаптируйте секцию преимуществ
4. ✅ Проверьте на разных размерах экрана
5. ✅ Протестируйте на реальном устройстве

## Контрольные вопросы

1. Что такое breakpoint?
2. В чем разница между mobile-first и desktop-first?
3. Зачем нужен meta viewport?
4. Как сделать изображение адаптивным?

## Полезные ссылки

- [Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
- [Media Queries на MDN](https://developer.mozilla.org/ru/docs/Web/CSS/Media_Queries)
- [Responsive Images](https://developer.mozilla.org/ru/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)

## Итоги курса

🎉 **Поздравляем!** Вы прошли весь курс по созданию сайта Sedona!

### Что вы изучили:
- ✅ Семантическая HTML разметка
- ✅ Современный CSS (Flexbox, Grid)
- ✅ Адаптивный дизайн
- ✅ Лучшие практики веб-разработки
- ✅ Доступность (Accessibility)
- ✅ Организация кода проекта

### Следующие шаги:
1. Добавьте JavaScript для интерактивности
2. Оптимизируйте производительность
3. Добавьте анимации
4. Создайте свой проект!

---

[⬅️ Предыдущий урок](lesson-09-css-basics.md) | [К оглавлению](README.md)
