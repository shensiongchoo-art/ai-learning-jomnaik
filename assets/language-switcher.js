(function () {
  const script = document.currentScript;
  const locale = script?.dataset.locale === 'zh-CN' ? 'zh-CN' : 'en';
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const isChinese = locale === 'zh-CN';
  const target = isChinese ? `../${page}` : `zh-CN/${page}`;

  const alternate = document.createElement('link');
  alternate.rel = 'alternate';
  alternate.hreflang = isChinese ? 'en' : 'zh-CN';
  alternate.href = target;
  document.head.appendChild(alternate);

  const self = document.createElement('link');
  self.rel = 'alternate';
  self.hreflang = isChinese ? 'zh-CN' : 'en';
  self.href = page;
  document.head.appendChild(self);

  const style = document.createElement('style');
  style.textContent = `
    .language-switcher {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 1000;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      border: 1px solid rgba(255,255,255,.28);
      border-radius: 999px;
      background: rgba(15,23,42,.92);
      box-shadow: 0 4px 14px rgba(0,0,0,.2);
      color: #fff;
      font: 700 12px/1.2 "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
      text-decoration: none;
      backdrop-filter: blur(10px);
    }
    .language-switcher:hover,
    .language-switcher:focus-visible {
      background: #263654;
      outline: 2px solid #63b3ed;
      outline-offset: 2px;
    }
    @media (max-width: 560px) {
      .language-switcher { top: 8px; right: 8px; padding: 7px 10px; }
    }
  `;
  document.head.appendChild(style);

  const switcher = document.createElement('a');
  switcher.className = 'language-switcher';
  switcher.href = target;
  switcher.hreflang = isChinese ? 'en' : 'zh-CN';
  switcher.lang = isChinese ? 'en' : 'zh-CN';
  switcher.textContent = isChinese ? '🌐 English' : '🌐 简体中文';
  switcher.setAttribute(
    'aria-label',
    isChinese ? 'Switch this lesson to English' : '将本课切换为简体中文'
  );
  switcher.addEventListener('click', function () {
    localStorage.setItem('learningHubLocale', isChinese ? 'en' : 'zh-CN');
  });
  document.body.appendChild(switcher);
})();
