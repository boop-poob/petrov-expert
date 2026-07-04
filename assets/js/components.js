(function () {
  const cfg = window.SITE_CONFIG || {};
  const base = document.documentElement.dataset.base || './';
  const current = document.body.dataset.page || '';

  const link = (path) => `${base}${path}`;
  const active = (page) => current === page ? 'aria-current="page"' : '';

  const header = `
    <a class="skip-link" href="#main-content">Перейти к содержанию</a>
    <header class="site-header" data-header>
      <div class="container header-inner">
        <a class="brand" href="${link('index.html')}" aria-label="${cfg.expertName || 'Главная'}">
          <img src="${link('assets/images/brand-mark.svg')}" width="42" height="42" alt="" aria-hidden="true">
          <span class="brand-text">
            <strong>${cfg.expertName || 'Георгий Петров'}</strong>
            <span>${cfg.expertRole || 'Эксперт по строительным проектам'}</span>
          </span>
        </a>

        <nav class="desktop-nav" aria-label="Основная навигация">
          <a href="${link('services.html')}" ${active('services')}>Компетенции</a>
          <a href="${link('cases.html')}" ${active('cases')}>Кейсы</a>
          <a href="${link('about.html')}" ${active('about')}>О эксперте</a>
          <a href="${link('contacts.html')}" ${active('contacts')}>Контакты</a>
        </nav>

        <div class="header-actions">
          <a class="header-phone is-hidden" data-phone-link data-track="click_phone" href="#"></a>
          <button class="button button-primary button-compact" type="button" data-open-lead>Обсудить объект</button>
        </div>

        <button class="menu-toggle" type="button" data-menu-toggle aria-label="Открыть меню" aria-expanded="false" aria-controls="mobile-menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div class="mobile-menu" id="mobile-menu" data-mobile-menu aria-hidden="true">
        <nav aria-label="Мобильная навигация">
          <a href="${link('services.html')}">Компетенции</a>
          <a href="${link('cases.html')}">Кейсы</a>
          <a href="${link('about.html')}">О эксперте</a>
          <a href="${link('contacts.html')}">Контакты</a>
        </nav>
        <div class="mobile-menu-contacts">
          <a class="button button-secondary" data-telegram-link data-track="click_telegram" target="_blank" rel="noopener">Написать в Telegram</a>
          <button class="button button-primary" type="button" data-open-lead>Обсудить объект</button>
        </div>
      </div>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <a class="brand brand-footer" href="${link('index.html')}">
            <img src="${link('assets/images/brand-mark.svg')}" width="42" height="42" alt="" aria-hidden="true">
            <span class="brand-text">
              <strong>${cfg.expertName || 'Георгий Петров'}</strong>
              <span>${cfg.expertRole || 'Эксперт по строительным проектам'}</span>
            </span>
          </a>
          <p>Независимая оценка, управленческая диагностика и сопровождение сложных строительных проектов.</p>
        </div>
        <div class="footer-column">
          <p class="footer-title">Навигация</p>
          <a href="${link('services.html')}">Компетенции</a>
          <a href="${link('cases.html')}">Кейсы</a>
          <a href="${link('about.html')}">О эксперте</a>
          <a href="${link('contacts.html')}">Контакты</a>
        </div>
        <div class="footer-column">
          <p class="footer-title">Связь</p>
          <a data-telegram-link data-track="click_telegram" target="_blank" rel="noopener">Telegram</a>
          <a data-max-link data-track="click_max" target="_blank" rel="noopener">MAX</a>
          <a class="is-hidden" data-email-link data-track="click_email"></a>
          <a class="is-hidden" data-phone-link data-track="click_phone"></a>
        </div>
      </div>
      <div class="container footer-bottom">
        <span>© <span data-current-year></span> ${cfg.expertName || 'Георгий Петров'}</span>
        <a href="${link('privacy.html')}">Политика обработки персональных данных</a>
      </div>
    </footer>`;

  const modal = `
    <div class="modal" data-lead-modal aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="lead-modal-title">
      <div class="modal-backdrop" data-close-lead></div>
      <div class="modal-panel" role="document">
        <button class="modal-close" type="button" data-close-lead aria-label="Закрыть форму">×</button>
        <p class="eyebrow">Первичный разбор</p>
        <h2 id="lead-modal-title">Опишите объект или ситуацию</h2>
        <p class="modal-lead">Достаточно кратко: на каком этапе объект, что уже известно и какое решение нужно принять.</p>
        <form class="lead-form" data-lead-form novalidate>
          <div class="form-honeypot" aria-hidden="true">
            <label>Не заполняйте это поле <input name="website" tabindex="-1" autocomplete="off"></label>
          </div>
          <div class="form-grid">
            <label class="field">
              <span>Имя</span>
              <input name="name" autocomplete="name" required>
            </label>
            <label class="field">
              <span>Компания / роль</span>
              <input name="company" autocomplete="organization">
            </label>
          </div>
          <label class="field">
            <span>Как связаться</span>
            <input name="contact" placeholder="Телефон, e-mail или Telegram" required>
          </label>
          <label class="field">
            <span>Кратко о задаче</span>
            <textarea name="message" rows="5" required placeholder="Например: объект на этапе ...; нужно оценить ...; решение требуется до ..."></textarea>
          </label>
          <input type="hidden" name="utm_source">
          <input type="hidden" name="utm_medium">
          <input type="hidden" name="utm_campaign">
          <label class="checkbox-field">
            <input type="checkbox" name="privacy" required>
            <span>Я согласен(на) с <a href="${link('privacy.html')}" target="_blank">политикой обработки персональных данных</a>.</span>
          </label>
          <p class="form-error" data-form-error aria-live="polite"></p>
          <button class="button button-primary button-full" type="submit">Отправить запрос</button>
          <p class="form-note">До подключения формы текст запроса будет скопирован, а затем откроется Telegram.</p>
        </form>
      </div>
    </div>`;

  document.querySelectorAll('[data-site-header]').forEach((node) => node.outerHTML = header);
  document.querySelectorAll('[data-site-footer]').forEach((node) => node.outerHTML = footer);
  document.body.insertAdjacentHTML('beforeend', modal);
})();
