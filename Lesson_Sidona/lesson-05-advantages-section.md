# Урок 5: Секция преимуществ

## Цели урока
- Создать секцию с преимуществами города
- Использовать CSS Grid и Flexbox
- Работа с иконками
- Создание сложной структуры

## 5.1 HTML структура преимуществ

```html
<section class="advantages" id="about">
    <div class="advantages-header">
        <h2 class="advantages-title">Седона — небольшой городок в Аризоне, заслуживающий большего!</h2>
        <p class="advantages-description">Рассмотрим причины, по которым Седона круче, чем Гранд-Каньон!</p>
    </div>

    <ul class="advantages-list">
        <li class="advantages-item advantages-item-blue">
            <div class="advantages-content">
                <h3 class="advantages-item-title">Настоящий городок</h3>
                <p class="advantages-item-number">— №1 —</p>
                <p class="advantages-item-description">Седона — не аттракцион для туристов</p>
            </div>
            <div class="advantages-image">
                <img src="images/photo-1.jpg" alt="Вид на город">
            </div>
        </li>
        <!-- Другие преимущества -->
    </ul>
</section>
```

## 5.2 CSS Grid для преимуществ

```css
.advantages-list {
    display: flex;
    flex-wrap: wrap;
}

.advantages-item {
    display: flex;
    width: 100%;
}

.advantages-content {
    width: 400px;
    padding: 102px 85px;
}

.advantages-image {
    width: 800px;
}
```

## 5.3 Цветовые модификаторы

```css
.advantages-item-blue {
    background-color: #82b3d3;
    color: #ffffff;
}

.advantages-item-light {
    background-color: rgba(131, 179, 211, 0.12);
}

.advantages-item-gray {
    background-color: rgba(131, 179, 211, 0.2);
}
```

## 5.4 Декоративные элементы с иконками

```css
.advantages-content-icon::before {
    content: "";
    background-image: url("images/icon-housing.svg");
    width: 75px;
    height: 72px;
}
```

## Практическое задание

1. ✅ Создайте список преимуществ
2. ✅ Добавьте изображения
3. ✅ Примените цветовые модификаторы
4. ✅ Добавьте иконки

---

[⬅️ Предыдущий урок](lesson-04-hero-section.md) | [Следующий урок: Форма поиска ➡️](lesson-06-search-form.md)
