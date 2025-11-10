# Урок 7: Секция подписки на рассылку

## Цели урока
- Создать форму подписки
- Работа с формами в HTML
- Стилизация input полей

## 7.1 HTML форма

```html
<section class="newsletter">
    <h2 class="newsletter-title">Подпишитесь на рассылку</h2>
    <p class="newsletter-description">Только полезная информация и никакого спама!</p>
    <form class="newsletter-form" action="https://echo.htmlacademy.ru/" method="post">
        <label class="visually-hidden" for="newsletter-email">Email</label>
        <input class="newsletter-input" type="email" id="newsletter-email" 
               name="email" placeholder="Ваш e-mail" required>
        <button class="button button-primary newsletter-button" type="submit">
            Подписаться
        </button>
    </form>
</section>
```

## 7.2 CSS для формы

```css
.newsletter {
    background-image: url("images/newsletter-background.jpg");
    background-size: cover;
    color: #ffffff;
}

.newsletter-form {
    display: flex;
}

.newsletter-input {
    flex-grow: 1;
    padding: 14px 20px;
    border-radius: 4px 0 0 4px;
}

.newsletter-button {
    border-radius: 0 4px 4px 0;
}
```

## Практическое задание

1. ✅ Создайте форму подписки
2. ✅ Добавьте валидацию email
3. ✅ Стилизуйте input и кнопку

---

[⬅️ Предыдущий урок](lesson-06-search-form.md) | [Следующий урок: Подвал ➡️](lesson-08-footer.md)
