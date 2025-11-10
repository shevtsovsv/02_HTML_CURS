# Урок 6: Форма поиска гостиниц

## Цели урока
- Создать секцию призыва к действию
- Изучить стилизацию ссылок-кнопок
- Центрирование контента

## 6.1 HTML разметка

```html
<section class="search-hotels" id="hotels">
    <h2 class="search-hotels-title">Заинтересовались?</h2>
    <p class="search-hotels-description">
        Укажите предполагаемые даты поездки, и мы покажем вам лучшие предложения
    </p>
    <a class="button button-large button-primary" href="#booking">
        Поиск гостиницы в Седоне
    </a>
</section>
```

## 6.2 CSS стилизация

```css
.search-hotels {
    padding: 96px 304px;
    text-align: center;
}

.search-hotels-title {
    font-size: 30px;
    font-weight: 700;
    text-transform: uppercase;
}

.button-large {
    padding: 8px 50px;
    font-size: 20px;
}
```

## Практическое задание

1. ✅ Создайте секцию поиска
2. ✅ Добавьте заголовок и описание
3. ✅ Стилизуйте кнопку

---

[⬅️ Предыдущий урок](lesson-05-advantages-section.md) | [Следующий урок: Подписка ➡️](lesson-07-newsletter-section.md)
