/* ============================================================
   ISMAEL GONZALO — Portfolio JS
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAV SCROLL ---- */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- MOBILE MENU ---- */
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate bars
      const bars = hamburger.querySelectorAll('span');
      if (open) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity   = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars[0].style.transform = '';
        bars[1].style.opacity   = '';
        bars[2].style.transform = '';
      }
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        const bars = hamburger.querySelectorAll('span');
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      });
    });
  }

  /* ---- SCROLL REVEAL ---- */
  const revealSelectors = '.reveal, .reveal-img, .reveal-left, .divider--animated, .divider--full';
  const reveals = document.querySelectorAll(revealSelectors);
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    reveals.forEach(el => observer.observe(el));
  }

  /* ---- LIGHTBOX ---- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('.lightbox__img');
  const lightboxClose = lightbox?.querySelector('.lightbox__close');

  if (lightbox && lightboxImg) {
    // Open
    document.querySelectorAll('[data-lightbox]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const src = trigger.dataset.lightbox;
        const alt = trigger.querySelector('img')?.alt || '';
        lightboxImg.src = src;
        lightboxImg.alt = alt;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    // Close
    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ---- CONTACT FORM ---- */
  const form = document.querySelector('.js-contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Enviando...';

      // Simulate send — replace with real backend / Formspree endpoint
      await new Promise(r => setTimeout(r, 1200));

      btn.innerHTML = '✓ Mensaje enviado';
      btn.style.background = '#27ae60';
      form.reset();

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        btn.style.background = '';
      }, 4000);
    });
  }

  /* ---- ACTIVE NAV LINK ---- */
  const navLinks = document.querySelectorAll('.nav__links a:not(.nav__cta)');
  const currentPath = window.location.pathname;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== '/') {
      link.classList.add('active');
    } else if (href === '/' && currentPath === '/') {
      link.classList.add('active');
    } else if (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('index.html'))) {
      link.classList.add('active');
    }
  });

  /* ---- SMOOTH SCROLL for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- REDUCED MOTION ---- */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal, .reveal-img, .reveal-left').forEach(el => el.classList.add('visible'));
  }

  /* ---- PARALLAX — Section numbers ---- */
  const sectionNums = document.querySelectorAll('.section-num');
  if (sectionNums.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    const onParallaxScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          sectionNums.forEach(num => {
            const parent = num.closest('.section, .about-strip, .cta-section') || num.parentElement;
            const rect = parent.getBoundingClientRect();
            // Solo aplica cuando el padre es visible
            if (rect.bottom > 0 && rect.top < window.innerHeight) {
              const relY = scrollY - (scrollY + rect.top);
              const shift = relY * 0.06; // factor de parallax suave
              num.style.transform = `translateY(${shift}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
  }

  /* ---- HERO TITLE — reveal por líneas ---- */
  const heroTitle = document.querySelector('.hero__title');
  if (heroTitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Dividimos el contenido en líneas envolviendo cada texto en un span animado
    heroTitle.style.overflow = 'hidden';
    const lines = heroTitle.querySelectorAll('.hero__line');
    if (lines.length) {
      lines.forEach((line, i) => {
        line.style.display = 'block';
        line.style.opacity = '0';
        line.style.transform = 'translateY(40px)';
        line.style.transition = `opacity 700ms cubic-bezier(0.16,1,0.3,1) ${120 + i * 120}ms,
                                  transform 700ms cubic-bezier(0.16,1,0.3,1) ${120 + i * 120}ms`;
      });
      // Pequeño delay para que arranque después de que cargue la página
      requestAnimationFrame(() => {
        setTimeout(() => {
          lines.forEach(line => {
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
          });
        }, 150);
      });
    }
  }

})();
// --- Back to top visibility ---
document.addEventListener('DOMContentLoaded', function () {
  const topBtn = document.getElementById('fab-top');
  const waBtn = document.querySelector('.fab--whatsapp');
  if (!topBtn) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
      if (waBtn) waBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
      if (waBtn) waBtn.classList.remove('visible');
    }
  }, { passive: true });
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
/* ============================================================
   CUSTOM CURSOR
   Solo en dispositivos con puntero fino (no táctil)
   ============================================================ */
(function () {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  const label = document.createElement('span');

  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  label.className = 'cursor-ring__label';
  label.textContent = 'Ver';
  ring.appendChild(label);

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('custom-cursor-active');

  // Posición actual del cursor (para el punto — sigue exacto)
  let mouseX = 0, mouseY = 0;
  // Posición del anillo (interpolada con lag)
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // El punto sigue inmediato via CSS transform
    dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });

  // Animación del anillo con lag via rAF
  function animateRing() {
    // Interpolación suave — factor 0.12 da el lag deseado
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor fuera de ventana
  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-out');
  });
  document.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-out');
  });

  // Elementos que activan hover normal (links, botones)
  const hoverSelectors = 'a, button, [role="button"], label, select, .btn, .arrow-link, .nav__logo, .fab';

  // Elementos que activan el estado "Ver" (cards de portfolio, lightbox triggers)
  const viewSelectors = '.portfolio-card, [data-lightbox], .blog-card__img, .gallery-masonry__item';

  function addCursorListeners(el, type) {
    el.addEventListener('mouseenter', () => {
      document.body.classList.remove('cursor-hover', 'cursor-view');
      document.body.classList.add(type === 'view' ? 'cursor-view' : 'cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-view');
    });
  }

  // Aplicar a elementos existentes
  document.querySelectorAll(hoverSelectors).forEach(el => addCursorListeners(el, 'hover'));
  document.querySelectorAll(viewSelectors).forEach(el => addCursorListeners(el, 'view'));

  // Observer para elementos que se añadan dinámicamente
  const mutationObserver = new MutationObserver(() => {
    document.querySelectorAll(hoverSelectors).forEach(el => {
      if (!el.dataset.cursorBound) {
        el.dataset.cursorBound = '1';
        addCursorListeners(el, 'hover');
      }
    });
    document.querySelectorAll(viewSelectors).forEach(el => {
      if (!el.dataset.cursorBound) {
        el.dataset.cursorBound = '1';
        addCursorListeners(el, 'view');
      }
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });

})();

/* ============================================================
   PAGE TRANSITION — barra de progreso superior
   ============================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const bar = document.createElement('div');
  bar.className = 'progress-bar';
  document.body.appendChild(bar);

  // Al cargar: completar la barra y ocultarla
  window.addEventListener('load', () => {
    bar.classList.add('complete');
    setTimeout(() => {
      bar.classList.remove('loading', 'complete');
    }, 500);
  });

  // Interceptar clicks en links internos
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Ignorar: externos, anclas, mailto, tel, _blank, descargas, teclas modificadoras
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      href.startsWith('mailto') ||
      href.startsWith('tel') ||
      href.startsWith('javascript') ||
      link.target === '_blank' ||
      link.hasAttribute('download') ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    // Arrancar la barra
    bar.classList.remove('complete');
    bar.classList.add('loading');

    // Navegar — el browser se encarga del resto
    setTimeout(() => {
      window.location.href = href;
    }, 10);
  });

})();

/* ============================================================
   INTRO SCREEN — pantalla de entrada
   Solo en la home y solo en la primera visita de la sesión
   ============================================================ */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const screen = document.querySelector('.intro-screen');
  if (!screen) return;

  // Solo mostrar una vez por sesión
  if (sessionStorage.getItem('intro-shown')) {
    screen.style.display = 'none';
    return;
  }

  const name = screen.querySelector('.intro-screen__name');

  // Bloquear scroll mientras la intro está activa
  document.body.style.overflow = 'hidden';

  // Arrancar la animación del nombre tras un frame
  requestAnimationFrame(() => {
    setTimeout(() => {
      if (name) name.classList.add('revealed');
    }, 120);
  });

  // Duración según dispositivo — más corta en móvil
  const isMobile = window.innerWidth < 768;
  const holdDuration = isMobile ? 1500 : 2200;

  // Ocultar la intro y revelar la home
  setTimeout(() => {
    screen.classList.add('hide');

    // Restaurar scroll y limpiar tras la transición
    setTimeout(() => {
      screen.style.display = 'none';
      document.body.style.overflow = '';

      // Disparar el reveal del hero manualmente
      const heroLines = document.querySelectorAll('.hero__line');
      heroLines.forEach(line => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      });
    }, 650);

    sessionStorage.setItem('intro-shown', '1');
  }, holdDuration);

})();
