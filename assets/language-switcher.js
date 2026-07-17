(function () {
  const script = document.currentScript;
  const locale = ['en', 'zh-CN', 'ms-MY'].includes(script?.dataset.locale)
    ? script.dataset.locale
    : 'en';
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const locales = [
    { code: 'en', label: 'EN', name: 'English', lang: 'en' },
    { code: 'zh-CN', label: '中文', name: '简体中文', lang: 'zh-CN' },
    { code: 'ms-MY', label: 'BM', name: 'Bahasa Melayu', lang: 'ms-MY' },
  ];

  function pathFor(targetLocale) {
    if (targetLocale === 'en') return locale === 'en' ? page : `../${page}`;
    if (locale === 'en') return `${targetLocale}/${page}`;
    return locale === targetLocale ? page : `../${targetLocale}/${page}`;
  }

  for (const item of locales) {
    const alternate = document.createElement('link');
    alternate.rel = 'alternate';
    alternate.hreflang = item.lang;
    alternate.href = pathFor(item.code);
    document.head.appendChild(alternate);
  }

  const style = document.createElement('style');
  style.textContent = `
    :root {
      color-scheme: dark light;
    }

    .site-controls {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 1000;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border: 1px solid rgba(255,255,255,.24);
      border-radius: 999px;
      background: rgba(15,23,42,.92);
      box-shadow: 0 4px 14px rgba(0,0,0,.2);
      color: #fff;
      font: 700 12px/1.2 "Segoe UI", "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
      backdrop-filter: blur(10px);
    }

    .site-controls a,
    .site-controls button {
      border: 0;
      border-radius: 999px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font: inherit;
      min-width: 34px;
      padding: 7px 9px;
      text-align: center;
      text-decoration: none;
    }

    .site-controls a[aria-current="page"],
    .site-controls button.active {
      background: rgba(255,255,255,.18);
    }

    .site-controls a:hover,
    .site-controls a:focus-visible,
    .site-controls button:hover,
    .site-controls button:focus-visible {
      background: #263654;
      outline: 2px solid #63b3ed;
      outline-offset: 2px;
    }

    body.light-mode {
      background: #f8fafc !important;
      background-image: none !important;
      color: #172033 !important;
    }

    body.light-mode .site-controls {
      border-color: rgba(15,23,42,.16);
      background: rgba(255,255,255,.94);
      color: #172033;
      box-shadow: 0 4px 16px rgba(15,23,42,.12);
    }

    body.light-mode .site-controls a[aria-current="page"],
    body.light-mode .site-controls button.active {
      background: #e2e8f0;
    }

    body.light-mode .site-controls a:hover,
    body.light-mode .site-controls a:focus-visible,
    body.light-mode .site-controls button:hover,
    body.light-mode .site-controls button:focus-visible {
      background: #dbeafe;
      outline-color: #2563eb;
    }

    body.light-mode header,
    body.light-mode .hero,
    body.light-mode .intro,
    body.light-mode .module-card,
    body.light-mode .lesson-card,
    body.light-mode .card,
    body.light-mode .concept-card,
    body.light-mode .feature-card,
    body.light-mode .example-card,
    body.light-mode .quiz-card,
    body.light-mode .quiz-box,
    body.light-mode .interactive-demo,
    body.light-mode .demo-box,
    body.light-mode .highlight-box,
    body.light-mode .takeaway,
    body.light-mode .comparison-card,
    body.light-mode .panel,
    body.light-mode .content-section,
    body.light-mode .section,
    body.light-mode .module-nav,
    body.light-mode .news-card {
      background: #ffffff !important;
      background-image: none !important;
      border-color: #d8e0ea !important;
      box-shadow: 0 8px 24px rgba(15,23,42,.08) !important;
      color: #172033 !important;
    }

    body.light-mode h1,
    body.light-mode h2,
    body.light-mode h3,
    body.light-mode p,
    body.light-mode li,
    body.light-mode label,
    body.light-mode span,
    body.light-mode .subtitle,
    body.light-mode .description,
    body.light-mode .explanation {
      color: #172033 !important;
    }

    body.light-mode input,
    body.light-mode textarea,
    body.light-mode select {
      background: #ffffff !important;
      border-color: #b8c4d6 !important;
      color: #172033 !important;
    }

    body.light-mode button:not(.theme-toggle) {
      color: inherit;
    }

    @media (max-width: 640px) {
      .site-controls {
        top: 8px;
        right: 8px;
        gap: 3px;
        padding: 5px;
      }

      .site-controls a,
      .site-controls button {
        min-width: 30px;
        padding: 7px 8px;
      }
    }
  `;
  document.head.appendChild(style);

  function applyTheme(theme) {
    const light = theme === 'light';
    document.body.classList.toggle('light-mode', light);
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
  }

  const savedTheme = localStorage.getItem('learningHubTheme') || 'dark';
  applyTheme(savedTheme);

  const controls = document.createElement('nav');
  controls.className = 'site-controls';
  controls.setAttribute('aria-label', 'Language and color mode');

  for (const item of locales) {
    const link = document.createElement('a');
    link.href = pathFor(item.code);
    link.hreflang = item.lang;
    link.lang = item.lang;
    link.textContent = item.label;
    link.title = item.name;
    link.setAttribute('aria-label', `Switch to ${item.name}`);
    if (item.code === locale) link.setAttribute('aria-current', 'page');
    link.addEventListener('click', function () {
      localStorage.setItem('learningHubLocale', item.code);
    });
    controls.appendChild(link);
  }

  const themeToggle = document.createElement('button');
  themeToggle.type = 'button';
  themeToggle.className = 'theme-toggle';
  themeToggle.textContent = savedTheme === 'light' ? '☀' : '☾';
  themeToggle.title = 'Toggle light color mode';
  themeToggle.setAttribute('aria-label', 'Toggle light color mode');
  themeToggle.classList.toggle('active', savedTheme === 'light');
  themeToggle.addEventListener('click', function () {
    const next = document.body.classList.contains('light-mode') ? 'dark' : 'light';
    localStorage.setItem('learningHubTheme', next);
    applyTheme(next);
    themeToggle.textContent = next === 'light' ? '☀' : '☾';
    themeToggle.classList.toggle('active', next === 'light');
  });
  controls.appendChild(themeToggle);

  document.body.appendChild(controls);
})();
