// 各セクションが画面に入ったとき、一度だけフェードインする。
(() => {
  if (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0,
  });

  document.querySelectorAll('main > section').forEach((section) => {
    section.classList.add('scroll-reveal');
    observer.observe(section);

    // キーボード操作で移動したセクションも表示する。
    section.addEventListener('focusin', () => {
      section.classList.add('is-visible');
      observer.unobserve(section);
    });
  });
})();
