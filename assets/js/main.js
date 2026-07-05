(function () {
  const cfg = window.SITE_CONFIG || {};
  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  function track(name) {
    if (typeof window.ym === 'function' && cfg.yandexMetrikaId) window.ym(cfg.yandexMetrikaId, 'reachGoal', name);
    if (typeof window.gtag === 'function') window.gtag('event', name);
  }

  function hydrateSharedData() {
    qsa('[data-telegram-link]').forEach((el) => {
      if (cfg.telegramUrl) el.href = cfg.telegramUrl;
      else el.remove();
    });
    qsa('[data-max-link]').forEach((el) => {
      if (cfg.maxUrl) el.href = cfg.maxUrl;
      else el.remove();
    });
    qsa('[data-current-year]').forEach((el) => el.textContent = String(new Date().getFullYear()));
    qsa('[data-registry-number]').forEach((el) => el.textContent = cfg.registryNumber || '');
    qsa('[data-registry-link]').forEach((el) => { el.href = cfg.registryUrl || '#'; });
    qsa('[data-registry-qr]').forEach((el) => { if (cfg.registryQrPath) el.src = cfg.registryQrPath; });
  }

  function initHeader() {
    const header = qs('[data-header]');
    if (!header) return;
    const toggle = qs('[data-menu-toggle]', header);
    const mobile = qs('[data-mobile-menu]', header);
    const setHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    setHeader();
    window.addEventListener('scroll', setHeader, { passive: true });
    if (!toggle || !mobile) return;
    toggle.addEventListener('click', () => {
      const opened = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!opened));
      mobile.setAttribute('aria-hidden', String(opened));
      document.body.classList.toggle('menu-open', !opened);
    });
    qsa('a', mobile).forEach((item) => item.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false'); mobile.setAttribute('aria-hidden', 'true'); document.body.classList.remove('menu-open');
    }));
  }

  function initLeadModal() {
    const modal = qs('[data-lead-modal]');
    if (!modal) return;
    let lastActive = null;
    const open = (event) => {
      lastActive = event?.currentTarget || document.activeElement;
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      const firstInput = qs('input:not([type="hidden"]):not([tabindex="-1"])', modal);
      window.setTimeout(() => firstInput?.focus(), 40);
      track('open_form');
    };
    const close = () => {
      modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open');
      if (lastActive && typeof lastActive.focus === 'function') lastActive.focus();
    };
    qsa('[data-open-lead]').forEach((button) => button.addEventListener('click', open));
    qsa('[data-close-lead]', modal).forEach((button) => button.addEventListener('click', close));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') close(); });
  }

  function setHiddenFormFields(form) {
    const set = (name, value) => { const el = qs(`[name="${name}"]`, form); if (el) el.value = value || ''; };
    set('page_url', window.location.href);
    const params = new URLSearchParams(window.location.search);
    set('utm_source', params.get('utm_source'));
    set('utm_medium', params.get('utm_medium'));
    set('utm_campaign', params.get('utm_campaign'));
  }

  function initFormspree() {
    qsa('[data-lead-form]').forEach((form) => {
      setHiddenFormFields(form);
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const error = qs('[data-form-error]', form);
        const note = qs('[data-form-note]', form);
        const submit = qs('button[type="submit"]', form);
        if (error) error.textContent = '';
        if (!form.checkValidity()) { form.reportValidity(); return; }
        if (!cfg.formEndpoint || !/^https:\/\/formspree\.io\/f\//.test(cfg.formEndpoint)) {
          if (error) error.textContent = 'Форма временно недоступна. Напишите в Telegram.';
          return;
        }
        try {
          submit.disabled = true; submit.textContent = 'Отправляем…';
          const response = await fetch(cfg.formEndpoint, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
          if (!response.ok) {
            let detail = null; try { detail = await response.json(); } catch (_) { /* no-op */ }
            throw new Error(detail?.errors?.[0]?.message || 'form_error');
          }
          track('form_submit');
          window.location.href = `${document.documentElement.dataset.base || './'}thank-you.html`;
        } catch (_) {
          if (error) error.textContent = 'Не удалось отправить заявку. Повторите попытку или напишите в Telegram.';
          if (note) note.textContent = 'Данные не были отправлены.';
        } finally {
          submit.disabled = false; submit.textContent = 'Отправить заявку';
        }
      });
    });
  }

  function initReveal() {
    const nodes = qsa('[data-reveal]');
    if (!nodes.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    nodes.forEach((node) => observer.observe(node));
  }

  function initTrackedLinks() { qsa('[data-track]').forEach((link) => link.addEventListener('click', () => track(link.dataset.track))); }

  hydrateSharedData(); initHeader(); initLeadModal(); initFormspree(); initReveal(); initTrackedLinks();
})();
