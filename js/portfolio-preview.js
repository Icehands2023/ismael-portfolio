/**
 * portfolio-preview.js
 * ─────────────────────────────────────────────────────────────────────────
 * FASE 3: Hover mini-preview en tarjetas de categoría del portfolio.
 *
 * Cómo funciona:
 * 1. Lee los atributos data-previews de cada .portfolio-card
 * 2. Precarga las imágenes en background cuando el cursor entra en la tarjeta
 * 3. Las inserta en .portfolio-card__preview-grid
 * 4. Activa/desactiva la clase .is-preview-visible con un pequeño delay
 *    para evitar flashes en pasos rápidos de ratón
 *
 * Consideraciones de rendimiento:
 * - Las imágenes del preview NO se cargan en el HTML (no penalizan el LCP)
 * - Se cargan a demanda en el primer hover de cada tarjeta
 * - Se cachean en memoria para hovers subsiguientes
 * - No actúa en dispositivos touch (hover: none)
 * - El script se carga con defer — no bloquea el render
 *
 * Dependencias: ninguna (vanilla JS)
 * ─────────────────────────────────────────────────────────────────────────
 */

(function () {
  'use strict';

  // No ejecutar en dispositivos táctiles — el hover no existe
  if (!window.matchMedia('(hover: hover)').matches) return;

  const DELAY_SHOW = 220;   // ms antes de mostrar el preview (evita flashes)
  const DELAY_HIDE = 80;    // ms antes de ocultar (más rápido)

  const cards = document.querySelectorAll('.portfolio-card[data-previews]');
  if (!cards.length) return;

  cards.forEach(function (card) {
    let showTimer = null;
    let hideTimer = null;
    let imagesLoaded = false;

    const previewGrid = card.querySelector('.portfolio-card__preview-grid');
    if (!previewGrid) return;

    // Leer las rutas de las imágenes del atributo data-previews
    let previews = [];
    try {
      previews = JSON.parse(card.dataset.previews);
    } catch (e) {
      console.warn('[portfolio-preview] JSON inválido en data-previews:', card.dataset.previews);
      return;
    }

    if (!previews.length) return;

    // Añadir etiqueta "Ver categoría" en la capa de preview
    const previewPanel = card.querySelector('.portfolio-card__preview');
    if (previewPanel && !previewPanel.querySelector('.portfolio-card__preview-label')) {
      const label = document.createElement('span');
      label.className = 'portfolio-card__preview-label';
      label.textContent = 'Ver categoría →';
      previewPanel.appendChild(label);
    }

    /**
     * Carga las imágenes del preview en el DOM (solo la primera vez).
     * Usa Image() para precargar en memoria antes de insertarlas.
     */
    function loadImages() {
      if (imagesLoaded) return;
      imagesLoaded = true;

      previews.forEach(function (src) {
        const img = new Image();
        img.src = src;
        img.alt = '';           // decorativo dentro del preview
        img.setAttribute('aria-hidden', 'true');
        img.loading = 'lazy';  // el navegador decide si ya está en caché

        // Insertar en el grid cuando cargue (evita layout shift si tarda)
        img.addEventListener('load', function () {
          previewGrid.appendChild(img);
        });

        // Si falla la carga, simplemente no se muestra ese thumbnail
        img.addEventListener('error', function () {
          console.warn('[portfolio-preview] No se pudo cargar imagen:', src);
        });
      });
    }

    // ── Eventos de hover ──────────────────────────────────────────────────

    card.addEventListener('mouseenter', function () {
      clearTimeout(hideTimer);

      // Precargar imágenes en el primer hover
      loadImages();

      showTimer = setTimeout(function () {
        card.classList.add('is-preview-visible');
      }, DELAY_SHOW);
    });

    card.addEventListener('mouseleave', function () {
      clearTimeout(showTimer);

      hideTimer = setTimeout(function () {
        card.classList.remove('is-preview-visible');
      }, DELAY_HIDE);
    });

    // ── Accesibilidad: ocultar preview si el foco sale de la tarjeta ──────
    // (el focus con teclado no debe activar el hover visual)
    card.addEventListener('focusout', function (e) {
      if (!card.contains(e.relatedTarget)) {
        card.classList.remove('is-preview-visible');
      }
    });
  });

})();
