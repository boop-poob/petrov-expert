(function () {
  const cfg = window.SITE_CONFIG || {};
  const base = document.documentElement.dataset.base || './';
  const current = document.body.dataset.page || '';
  const link = (path) => `${base}${path}`;
  const active = (page) => current === page ? 'aria-current="page"' : '';

  const header = `
    <a class="skip-link" href="#main-content">К содержанию</a>
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="${link('index.html')}" aria-label="${cfg.expertName || 'Главная'}">
          <img src="${link('assets/images/brand-mark.svg')}" width="42" height="42" alt="" aria-hidden="true">
          <span class="brand-text"><strong>${cfg.expertName || 'Георгий Петров'}</strong><span>${cfg.expertRole || 'Эксперт по управлению строительными проектами'}</span></span>
        </a>
        <nav class="desktop-nav" aria-label="Основная навигация">
          <a href="${link('services.html')}" ${active('services')}>Задачи</a>
          <a href="${link('cases.html')}" ${active('cases')}>Проекты</a>
          <a href="${link('about.html')}" ${active('about')}>Об эксперте</a>
          <a href="${link('contacts.html')}" ${active('contacts')}>Контакты</a>
        </nav>
        <div class="header-actions"><button class="button button-primary button-compact" type="button" data-open-lead>Обсудить задачу</button></div>
        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
      </div>
      <div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true">
        <nav aria-label="Мобильная навигация">
          <a href="${link('services.html')}">Задачи</a>
          <a href="${link('cases.html')}">Проекты</a>
          <a href="${link('about.html')}">Об эксперте</a>
          <a href="${link('contacts.html')}">Контакты</a>
        </nav>
        <div class="mobile-menu-actions"><a class="button button-secondary" data-telegram-link target="_blank" rel="noopener">Telegram</a><button class="button button-primary" type="button" data-open-lead>Обсудить задачу</button></div>
      </div>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="brand" href="${link('index.html')}">
            <img src="${link('assets/images/brand-mark.svg')}" width="42" height="42" alt="" aria-hidden="true">
            <span class="brand-text"><strong>${cfg.expertName || 'Георгий Петров'}</strong><span>${cfg.expertRole || 'Эксперт по управлению строительными проектами'}</span></span>
          </a>
          <p>Независимая оценка, управленческая диагностика и сопровождение сложных строительных задач.</p>
        </div>
        <div class="footer-column"><p class="footer-title">Навигация</p><a href="${link('services.html')}">Задачи</a><a href="${link('cases.html')}">Проекты</a><a href="${link('about.html')}">Об эксперте</a><a href="${link('contacts.html')}">Контакты</a></div>
        <div class="footer-column"><p class="footer-title">Связь</p><a data-telegram-link target="_blank" rel="noopener">Telegram</a><a data-max-link target="_blank" rel="noopener">MAX</a><button class="footer-form-link" type="button" data-open-lead>Описать задачу</button></div>
      </div>
      <div class="container footer-bottom"><span>© <span data-current-year></span> ${cfg.expertName || 'Георгий Петров'}</span><a href="${link('privacy.html')}">Политика обработки персональных данных</a></div>
    </footer>`;

  const modal = `
    <div class="modal" data-lead-modal aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
      <div class="modal-backdrop" data-close-lead></div>
      <div class="modal-panel" role="document">
        <button class="modal-close" type="button" data-close-lead aria-label="Закрыть форму">×</button>
        <p class="eyebrow">Первичный разбор</p>
        <h2 id="lead-modal-title">Расскажите, что происходит на объекте</h2>
        <p class="modal-lead">Достаточно кратко описать объект, его стадию и задачу, которая требует внимания. Документы можно прислать после первичного разговора.</p>
        <form class="lead-form" data-lead-form action="${cfg.formEndpoint || '#'}" method="POST" novalidate>
          <div class="form-honeypot" aria-hidden="true"><label>Не заполняйте это поле <input name="_gotcha" tabindex="-1" autocomplete="off"></label></div>
          <div class="form-grid">
            <label class="field"><span>Имя</span><input name="name" autocomplete="name" required></label>
            <label class="field"><span>Компания / роль</span><input name="company" autocomplete="organization"></label>
          </div>
          <div class="form-grid">
            <label class="field"><span>Регион объекта</span><input name="region" placeholder="Например, Москва или Тверская область"></label>
            <label class="field"><span>Контакт для связи</span><input name="contact" placeholder="Телефон, e-mail или Telegram" required></label>
          </div>
          <label class="field"><span>Что требуется сейчас</span><select name="request_type"><option value="Диагностика проекта">Диагностика проекта</option><option value="Проблемный объект">Проблемный объект</option><option value="Инженерные сети и ввод">Инженерные сети и ввод</option><option value="Управление проектом">Управление проектом</option><option value="Другое">Другое</option></select></label>
          <label class="field"><span>Суть задачи</span><textarea name="message" rows="5" required placeholder="Например: объект на этапе…; требуется оценить…; задача должна быть решена до…"></textarea></label>
          <input type="hidden" name="_subject" value="Новая заявка с сайта — Георгий Петров">
          <input type="hidden" name="page_url"><input type="hidden" name="utm_source"><input type="hidden" name="utm_medium"><input type="hidden" name="utm_campaign">
          <label class="checkbox-field"><input type="checkbox" name="privacy" required><span>Даю согласие на обработку персональных данных в соответствии с <a href="${link('privacy.html')}" target="_blank">политикой обработки персональных данных</a>.</span></label>
          <p class="form-error" data-form-error aria-live="polite"></p>
          <button class="button button-primary button-full" type="submit">Отправить заявку</button>
          <p class="form-note" data-form-note>После отправки откроется страница подтверждения.</p>
        </form>
      </div>
    </div>`;

  document.querySelectorAll('[data-site-header]').forEach((node) => node.outerHTML = header);
  document.querySelectorAll('[data-site-footer]').forEach((node) => node.outerHTML = footer);
  document.body.insertAdjacentHTML('beforeend', modal);
})();
