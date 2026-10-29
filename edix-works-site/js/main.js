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

// スマートフォンのWorksカルーセル。スクロール位置にドットを同期する。
(() => {
  const carousel = document.querySelector('.works-grid');
  const pagination = document.querySelector('.works-dots');
  if (!carousel || !pagination) return;

  const cards = Array.from(carousel.querySelectorAll('.work-item'));
  if (!cards.length) return;

  const mobile = window.matchMedia('(max-width: 767px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let frame = null;

  // 実際のカード間隔を使うため、画面幅が変わっても位置がずれない。
  const cardPosition = (index) => cards[index].offsetLeft - cards[0].offsetLeft;
  const updateDots = (index) => {
    currentIndex = index;
    dots.forEach((dot, dotIndex) => {
      if (dotIndex === index) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  };
  const goTo = (index) => {
    carousel.scrollTo({
      left: cardPosition(index),
      behavior: reducedMotion.matches ? 'instant' : 'smooth',
    });
  };
  const dots = cards.map((card, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'works-dot';
    dot.setAttribute('aria-label', `制作実績 ${index + 1} / ${cards.length} を表示`);
    dot.setAttribute('aria-controls', carousel.id);
    dot.addEventListener('click', () => goTo(index));
    pagination.appendChild(dot);
    return dot;
  });

  carousel.addEventListener('scroll', () => {
    if (!mobile.matches || frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      let nearest = 0;
      cards.forEach((card, index) => {
        if (Math.abs(cardPosition(index) - carousel.scrollLeft) <
            Math.abs(cardPosition(nearest) - carousel.scrollLeft)) nearest = index;
      });
      updateDots(nearest);
    });
  }, { passive: true });

  carousel.addEventListener('keydown', (event) => {
    if (!mobile.matches || event.target !== carousel) return;
    let index = currentIndex;
    if (event.key === 'ArrowRight') index = Math.min(index + 1, cards.length - 1);
    else if (event.key === 'ArrowLeft') index = Math.max(index - 1, 0);
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = cards.length - 1;
    else return;
    event.preventDefault();
    goTo(index);
  });

  const syncLayout = () => {
    pagination.hidden = !mobile.matches;
    carousel.setAttribute('tabindex', mobile.matches ? '0' : '-1');
    if (!mobile.matches) updateDots(0);
    carousel.scrollTo({
      left: mobile.matches ? cardPosition(currentIndex) : 0,
      behavior: 'instant',
    });
  };
  updateDots(0);
  mobile.addEventListener('change', syncLayout);
  window.addEventListener('resize', syncLayout);
  syncLayout();
})();
