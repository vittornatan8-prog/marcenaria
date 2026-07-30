/* ==========================================================================
   MODERNA — MARCENARIA PLANEJADA
   JavaScript modular, sem dependências externas
   ========================================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initMobileMenu();
    initSmoothAnchors();
    initHeroCarousel();
    initScrollReveal();
    initCounters();
    initGalleryFilter();
    initLazyLoad();
    initTestimonialCarousel();
    initContactForm();
    initBackToTop();
  });

  /* ---------- Header: fundo ao rolar ---------- */
  function initHeaderScroll() {
    var header = document.getElementById('header');
    if (!header) return;

    function toggle() {
      if (window.scrollY > 60) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

  /* ---------- Menu mobile (hamburger) ---------- */
  function initMobileMenu() {
    var toggleBtn = document.getElementById('navToggle');
    var nav = document.getElementById('nav');
    if (!toggleBtn || !nav) return;

    function closeMenu() {
      nav.classList.remove('is-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggleBtn.classList.toggle('is-active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    nav.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Scroll suave para âncoras (compensando header fixo) ---------- */
  function initSmoothAnchors() {
    var header = document.getElementById('header');
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Carrossel do Hero ---------- */
  function initHeroCarousel() {
    var slides = document.querySelectorAll('.hero__slide');
    var indicators = document.querySelectorAll('.hero__indicator');
    if (!slides.length) return;

    var current = 0;
    var intervalId;
    var AUTOPLAY_MS = 6000;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      indicators[current] && indicators[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      indicators[current] && indicators[current].classList.add('is-active');
    }

    function next() { goTo(current + 1); }

    function startAutoplay() {
      stopAutoplay();
      intervalId = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() { clearInterval(intervalId); }

    indicators.forEach(function (btn, i) {
      btn.addEventListener('click', function () {
        goTo(i);
        startAutoplay();
      });
    });

    startAutoplay();
  }

  /* ---------- Animações ao rolar (Intersection Observer) ---------- */
  function initScrollReveal() {
    var elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Contadores animados (+3500 Clientes / +2800 Projetos) ---------- */
  function initCounters() {
    var counters = document.querySelectorAll('.stat__number');
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var duration = 1800;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString('pt-BR');
        }
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCounter);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Filtro da galeria de projetos ---------- */
  function initGalleryFilter() {
    var buttons = document.querySelectorAll('.filter-btn');
    var cards = document.querySelectorAll('.project-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');

        var filter = btn.getAttribute('data-filter');

        cards.forEach(function (card) {
          var match = filter === 'todos' || card.getAttribute('data-category') === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- Lazy loading de imagens (data-src) ---------- */
  function initLazyLoad() {
    var lazyImages = document.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    function load(img) {
      img.src = img.getAttribute('data-src');
      img.removeAttribute('data-src');
      img.classList.add('is-loaded');
    }

    if (!('IntersectionObserver' in window)) {
      lazyImages.forEach(load);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          load(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(function (img) { observer.observe(img); });
  }

  /* ---------- Carrossel de depoimentos ---------- */
  function initTestimonialCarousel() {
    var track = document.getElementById('testimonialTrack');
    if (!track) return;

    var slides = track.querySelectorAll('.testimonial');
    var prevBtn = document.getElementById('prevTestimonial');
    var nextBtn = document.getElementById('nextTestimonial');
    var current = 0;
    var intervalId;
    var AUTOPLAY_MS = 7000;

    function goTo(index) {
      slides[current].classList.remove('is-active');
      current = (index + slides.length) % slides.length;
      slides[current].classList.add('is-active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAutoplay() {
      stopAutoplay();
      intervalId = setInterval(next, AUTOPLAY_MS);
    }
    function stopAutoplay() { clearInterval(intervalId); }

    if (nextBtn) nextBtn.addEventListener('click', function () { next(); startAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); startAutoplay(); });

    startAutoplay();
  }

  /* ---------- Formulário de contato ---------- */
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var feedback = document.getElementById('formFeedback');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        if (feedback) {
          feedback.textContent = 'Por favor, preencha todos os campos corretamente.';
          feedback.style.color = '#c0392b';
        }
        return;
      }

      if (feedback) {
        feedback.textContent = 'Mensagem enviada com sucesso! Em breve entraremos em contato.';
        feedback.style.color = '';
      }
      form.reset();
    });
  }

  /* ---------- Botão voltar ao topo ---------- */
  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    function toggle() {
      btn.classList.toggle('is-visible', window.scrollY > 500);
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    toggle();
    window.addEventListener('scroll', toggle, { passive: true });
  }

})();
