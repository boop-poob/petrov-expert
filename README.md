# Сайт Георгия Петрова

Статический сайт для GitHub Pages и Vercel.

## Текущая конфигурация

- Публикация: Vercel, проект связан с GitHub.
- Форма: Formspree, endpoint задан в `assets/js/config.js`.
- Публичный e-mail на страницах не выводится.
- НРС НОСТРОЙ: отображается только на странице `about.html`.

## Перед публикацией постоянного домена

После покупки домена нужно заменить адрес `https://gp-construction.vercel.app` в:

- `assets/js/config.js`;
- canonical URL и OG image в HTML-файлах;
- `robots.txt`;
- `sitemap.xml`.

## Редактирование

Основные публичные тексты находятся в `.html` файлах. Общие элементы шапки, футера и формы находятся в `assets/js/components.js`. Стиль — `assets/css/style.css`.
