(function () {
  const cfg = window.SITE_CONFIG || {};
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function setContactLinks() {
    qsa('[data-telegram-link]').forEach((el) => {
      el.href = cfg.telegramUrl || '#';
      if (!cfg.telegramUrl) el.classList.add('is-hidden');
    });
    qsa('[data-max-link]').forEach((el) => {
      el.href = cfg.maxUrl || '#';
      if (!cfg.maxUrl) el.classList.add('is-hidden');
    });
    qsa('[data-phone-link]').forEach((el) => {
      if (!cfg.phone) return;
      el.href = `tel:${cfg.phone.replace(/[^+\d]/g, '')}`;
      el.textContent = cfg.phoneDisplay || cfg.phone;
      el.classList.remove('is-hidden');
    });
    qsa('[data-email-link]').forEach((el) => {
      if (!cfg.email) return;
      el.href = `mailto:${cfg.email}`;
      el.textContent = cfg.email;
      el.classList.remove('is-hidden');
    });
    qsa('[data-current-year]').forEach((el) => el.textContent = new Date().getFullYear());

    qsa('[data-registry-card]').forEach((card) => {
      if (!cfg.registryUrl) {
        card.remove();
        return;
      }
      qsa('[data-registry-link], [data-registry-qr-link]', card).forEach((el) => {
        el.href = cfg.registryUrl;
      });
      qsa('[data-registry-label]', card).forEach((el) => {
        el.textContent = cfg.registryLabel || 'Проверить запись в НРС НОСТРОЙ';
      });
      qsa('[data-registry-work-type]', card).forEach((el) => {
        el.textContent = cfg.registryWorkType || '';
      });
      qsa('[data-registry-number]', card).forEach((el) => {
        if (cfg.registryNumber) {
          el.textContent = `Идентификационный номер: ${cfg.registryNumber}`;
        } else {
          el.remove();
        }
      });
      qsa('[data-registry-qr]', card).forEach((img) => {
        if (cfg.registryQrPath) img.src = cfg.registryQrPath;
      });
    });

    qsa('[data-legal-name]').forEach((el) => el.textContent = cfg.legalName || 'Заполнить до публикации');
    qsa('[data-legal-address]').forEach((el) => el.textContent = cfg.legalAddress || 'Заполнить до публикации');
    qsa('[data-legal-email]').forEach((el) => el.textContent = cfg.legalEmail || 'Заполнить до публикации');
    qsa('[data-privacy-date]').forEach((el) => el.textContent = cfg.privacyDate || 'Заполнить до публикации');
  }

  function initHeader() {
    const header = qs('[data-header]');
    const menuButton = qs('[data-menu-toggle]');
    const mobileMenu = qs('[data-mobile-menu]');
    if (header) {
      const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
      updateHeader();
      window.addEventListener('scroll', updateHeader, { passive: true });
    }
    if (menuButton && mobileMenu) {
      menuButton.addEventListener('click', () => {
        const opened = menuButton.getAttribute('aria-expanded') === 'true';
        menuButton.setAttribute('aria-expanded', String(!opened));
        mobileMenu.setAttribute('aria-hidden', String(opened));
        document.body.classList.toggle('menu-open', !opened);
      });
      qsa('a', mobileMenu).forEach((link) => link.addEventListener('click', () => menuButton.click()));
    }
  }

  function initModal() {
    const modal = qs('[data-lead-modal]');
    if (!modal) return;
    const panel = qs('.modal-panel', modal);
    let lastActive = null;

    const open = () => {
      lastActive = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      setTimeout(() => qs('input[name="name"]', modal)?.focus(), 100);
      track('open_form');
    };
    const close = () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      lastActive?.focus();
    };

    qsa('[data-open-lead]').forEach((button) => button.addEventListener('click', open));
    qsa('[data-close-lead]', modal).forEach((button) => button.addEventListener('click', close));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) close();
      if (event.key === 'Tab' && modal.classList.contains('is-open')) {
        const focusable = qsa('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled])', panel)
          .filter((item) => item.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first.focus();
        }
      }
    });
  }

  function getUtm() {
    const params = new URLSearchParams(window.location.search);
    return ['utm_source', 'utm_medium', 'utm_campaign'].reduce((result, key) => {
      result[key] = params.get(key) || sessionStorage.getItem(key) || '';
      if (params.get(key)) sessionStorage.setItem(key, params.get(key));
      return result;
    }, {});
  }

  function initForms() {
    qsa('[data-lead-form]').forEach((form) => {
      const utm = getUtm();
      Object.entries(utm).forEach(([key, value]) => {
        const input = qs(`[name="${key}"]`, form);
        if (input) input.value = value;
      });

      const note = qs('[data-form-note]', form);
      if (note) {
        note.textContent = 'Заявка будет отправлена на рабочую почту. После отправки откроется страница подтверждения.';
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const error = qs('[data-form-error]', form);
        error.classList.remove('is-success');
        error.textContent = '';

        if (!form.checkValidity()) {
          error.textContent = 'Заполните обязательные поля и подтвердите согласие с политикой обработки персональных данных.';
          form.reportValidity();
          return;
        }

        const data = new FormData(form);
        if (data.get('website')) return;
        data.set('page_url', window.location.href);

        const submitButton = qs('button[type="submit"]', form);
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправляем…';

        try {
          if (!cfg.formEndpoint || !/^https:\/\/formspree\.io\/f\//.test(cfg.formEndpoint)) {
            throw new Error('missing_formspree_endpoint');
          }

          const response = await fetch(cfg.formEndpoint, {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: data
          });

          if (!response.ok) {
            const details = await response.json().catch(() => ({}));
            throw new Error(details?.errors?.[0]?.message || 'formspree_error');
          }

          track('form_submit');
          window.location.href = `${document.documentElement.dataset.base || './'}thank-you.html`;
        } catch (err) {
          error.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или напишите в Telegram / MAX.';
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      });
    });
  }

  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const elements = qsa('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    elements.forEach((el) => observer.observe(el));
  }

  function track(eventName) {
    try {
      if (cfg.yandexMetrikaId && typeof window.ym === 'function') window.ym(cfg.yandexMetrikaId, 'reachGoal', eventName);
      if (typeof window.gtag === 'function') window.gtag('event', eventName);
    } catch (_) { /* analytics should never break interaction */ }
  }
  window.track = track;

  function initAnalytics() {
    if (cfg.yandexMetrikaId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://mc.yandex.ru/metrika/tag.js?id=${cfg.yandexMetrikaId}`;
      document.head.appendChild(script);
      window.ym = window.ym || function () { (window.ym.a = window.ym.a || []).push(arguments); };
      window.ym(cfg.yandexMetrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true });
    }
    if (cfg.googleAnalyticsId) {
      const tag = document.createElement('script');
      tag.async = true;
      tag.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.googleAnalyticsId}`;
      document.head.appendChild(tag);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', cfg.googleAnalyticsId);
    }
  }

  document.addEventListener('click', (event) => {
    const tracked = event.target.closest('[data-track]');
    if (tracked) track(tracked.dataset.track);
  });

  document.addEventListener('DOMContentLoaded', () => {
    setContactLinks();
    initAnalytics();
    initHeader();
    initModal();
    initForms();
    initReveal();
  });
})();
