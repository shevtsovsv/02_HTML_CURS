# Урок 8: Подвал сайта

## Цели урока
- Создать подвал с контактами
- Добавить социальные сети
- Организация информации в футере

## 8.1 HTML футера

```html
<footer class="page-footer">
    <div class="footer-container">
        <section class="footer-social">
            <h2 class="visually-hidden">Социальные сети</h2>
            <ul class="footer-social-list">
                <li class="footer-social-item">
                    <a class="footer-social-link" href="https://vk.com/htmlacademy">
                        <span class="visually-hidden">ВКонтакте</span>
                    </a>
                </li>
            </ul>
        </section>

        <section class="footer-contacts">
            <a class="footer-contacts-phone" href="tel:+78128121212">
                +7 (812) 812-12-12
            </a>
        </section>

        <section class="footer-developer">
            <a class="footer-developer-link" href="https://htmlacademy.ru/">
                <img src="images/htmlacademy-logo.svg" alt="HTML Academy">
            </a>
        </section>
    </div>
</footer>
```

## 8.2 CSS футера

```css
.footer-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.footer-social-list {
    display: flex;
    gap: 30px;
}

.footer-contacts-phone {
    font-size: 40px;
    text-decoration: none;
}
```

## Практическое задание

1. ✅ Создайте футер
2. ✅ Добавьте социальные сети
3. ✅ Добавьте телефон
4. ✅ Добавьте логотип разработчика

---

[⬅️ Предыдущий урок](lesson-07-newsletter-section.md) | [Следующий урок: CSS стилизация ➡️](lesson-09-css-basics.md)
