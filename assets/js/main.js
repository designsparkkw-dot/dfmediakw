/* ============================================================
   DF MEDIA — main.js
   GSAP + ScrollTrigger animations, cursor, interactions
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── iOS MUTED-VIDEO AUTOPLAY UNLOCK ───────────────────────── */
// iOS Safari sometimes suspends media elements until the user has touched
// the page, even for muted+playsinline videos (e.g. when the page was
// opened via a link or loaded in the background). A single touchstart on
// any part of the page "unlocks" all media elements site-wide so that
// subsequent play() calls succeed without requiring another gesture.
(function () {
  document.addEventListener('touchstart', function () {
    document.querySelectorAll('video[playsinline]').forEach(function (v) {
      v.muted = true; // ensure IDL property is set, not just the HTML attr
      if (v.paused && v.currentSrc) v.play().catch(function () {});
    });
  }, { once: true, passive: true });
})();

/* ── CURSOR ────────────────────────────────────────────────── */
(function initCursor() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;

  const label = cursor.querySelector('.cursor-label');

  document.addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.55, ease: 'power3.out' });
  }, { passive: true });

  document.querySelectorAll('a, button, .wg-card, .portfolio-card, .service-trigger, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); if (label) label.textContent = ''; });
  });

  document.querySelectorAll('.wg-card, .portfolio-card').forEach(el => {
    el.addEventListener('mouseenter', () => { if (label) label.textContent = 'View'; });
  });
})();

/* ── STICKY CTA ────────────────────────────────────────────── */
(function () {
  const cta = document.getElementById('sticky-cta');
  if (!cta || cta.style.display === 'none') return;

  // Inner pages (page-hero present) — show immediately on load
  if (document.querySelector('.page-hero')) {
    cta.classList.add('visible');
    return;
  }

  // Homepage — reveal once user has scrolled past ~75% of hero
  const hero = document.querySelector('.hero');
  if (!hero) { cta.classList.add('visible'); return; }

  const threshold = () => hero.offsetHeight * 0.75;

  const onScroll = () => {
    if (window.scrollY >= threshold()) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── NAVBAR ────────────────────────────────────────────────── */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const fn = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', fn, { passive: true });
  fn();
})();

/* ── ACTIVE NAV LINK ───────────────────────────────────────── */
(function () {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── MOBILE MENU ───────────────────────────────────────────── */
(function () {
  const btn  = document.querySelector('.hamburger');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── WORD SPLITTER ─────────────────────────────────────────── */
function splitWords(el) {
  if (!el) return;
  const nodes = Array.from(el.childNodes);
  el.innerHTML = '';

  nodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(chunk => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          el.appendChild(document.createTextNode(chunk));
        } else {
          const ww = document.createElement('span');
          ww.className = 'ww';
          const wi = document.createElement('span');
          wi.className = 'wi';
          wi.textContent = chunk;
          ww.appendChild(wi);
          el.appendChild(ww);
        }
      });
    } else if (node.nodeName === 'BR') {
      el.appendChild(document.createElement('br'));
    } else {
      const ww = document.createElement('span');
      ww.className = 'ww';
      const wi = document.createElement('span');
      wi.className = 'wi';
      wi.appendChild(node.cloneNode(true));
      ww.appendChild(wi);
      el.appendChild(ww);
    }
  });
}

/* ── HERO ANIMATION ────────────────────────────────────────── */
(function () {
  const title   = document.querySelector('.hero-title');
  const eyebrow = document.querySelector('.hero-eyebrow');
  const sub     = document.querySelector('.hero-sub');
  const actions = document.querySelector('.hero-actions');
  const scroll  = document.querySelector('.hero-scroll-indicator');
  if (!title) return;

  splitWords(title);

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to(title.querySelectorAll('.wi'), { y: '0%', duration: 1.1, stagger: 0.07 }, 0.15);
  if (sub)     tl.to(sub,     { opacity: 1, y: 0, duration: 0.9 }, '-=0.5');
  if (actions) tl.to(actions, { opacity: 1, y: 0, duration: 0.9 }, '-=0.65');
  if (scroll)  tl.to(scroll,  { opacity: 1, duration: 0.8 },        '-=0.3');
})();

/* ── HERO PARALLAX ON SCROLL ───────────────────────────────── */
(function () {
  const heroContent = document.querySelector('.hero-content');
  const heroBg      = document.querySelector('.hero-bg');
  if (!heroContent) return;

  // Content drifts up gently as hero scrolls out
  gsap.to(heroContent, {
    yPercent: -18,
    opacity: 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2,
    }
  });

  // Background moves at a slower rate for depth
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      }
    });
  }
})();

/* ── PAGE HERO ANIMATION ───────────────────────────────────── */
(function () {
  const title = document.querySelector('.page-title');
  const label = document.querySelector('.page-label');
  const desc  = document.querySelector('.page-desc');
  if (!title) return;

  splitWords(title);

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  if (label) tl.to(label, { opacity: 1, duration: 0.6 }, 0.2);
  tl.to(title.querySelectorAll('.wi'), { y: '0%', duration: 1.1, stagger: 0.065 }, 0.35);
  if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.9 }, '-=0.5');
})();

/* ── SECTION SCROLL REVEALS ────────────────────────────────── */
(function () {
  // Curtain wipe: sections slide up into view from a clipped state
  gsap.utils.toArray('.section-reveal').forEach(section => {
    gsap.fromTo(section,
      { clipPath: 'inset(7% 0 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0% 0 0 0)',
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 86%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
})();

/* ── WORK GRID — CARD REVEAL ───────────────────────────────── */
(function () {
  const cards = gsap.utils.toArray('.wg-card');
  if (!cards.length) return;

  // Each card wipes in from bottom — cinematic staggered reveal.
  // onComplete fires per-card the instant clip-path reaches inset(0 0 0% 0),
  // meaning zero clipping — the ONLY safe moment to call play() on iOS,
  // which refuses autoplay on elements with any non-zero clip-path inset.
  gsap.fromTo(cards,
    { clipPath: 'inset(0 0 100% 0)', opacity: 1 },
    {
      clipPath: 'inset(0 0 0% 0)',
      duration: 1.05,
      ease: 'power3.inOut',
      stagger: { each: 0.1, from: 'start' },
      onComplete: function () {
        var v = this.targets()[0].querySelector('.wg-video--auto');
        if (!v) return;
        v.muted = true;
        v.play().catch(function () {});
        // One extra attempt 400ms later — covers rare iOS decoder-init lag
        setTimeout(function () { if (v.paused) v.play().catch(function () {}); }, 400);
      },
      scrollTrigger: {
        trigger: '.work-grid',
        start: 'top 88%',
        toggleActions: 'play none none none',
      }
    }
  );
})();

/* ── CASE STUDY CARDS — AUTOPLAY SHOWCASE VIDEO ────────────── */
(function () {
  document.querySelectorAll('.cs-card-video').forEach(function (video) {
    // Explicitly set the muted IDL property — some iOS Safari versions
    // ignore the HTML attribute and only respect the JS property
    video.muted = true;
    video.setAttribute('muted', '');

    // Explicit load() call — ensures iOS starts buffering immediately
    // instead of waiting for a scroll or user interaction to begin
    video.load();

    var tryPlay = function () { video.play().catch(function () {}); };

    // canplay fires as soon as the browser can begin playback (earlier
    // than canplaythrough); loadeddata is a belt-and-suspenders fallback
    video.addEventListener('canplay',    tryPlay, { once: true });
    video.addEventListener('loadeddata', tryPlay, { once: true });

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && video.paused) tryPlay();
    });
    // pageshow fires when navigating back via Back button on iOS
    window.addEventListener('pageshow', function () {
      if (video.paused) tryPlay();
    });

    // Nudge loop: retries every 200ms for up to 6s until play starts.
    // The cs-card is not inside any clip-path animation so these calls
    // are safe — they simply wait for the media decoder to become ready.
    if (!video.dataset.nudging) {
      video.dataset.nudging = '1';
      var attempts = 0;
      var nudge = function () {
        if (!video.paused || ++attempts > 30) {
          clearInterval(timer);
          delete video.dataset.nudging;
          return;
        }
        video.play().catch(function () {});
      };
      var timer = setInterval(nudge, 200);
    }
  });
})();

/* ── WORK GRID — VIDEO ON HOVER ────────────────────────────── */
(function () {
  // NOTE: wg-video--auto elements are played exclusively via the GSAP
  // card-reveal onComplete (above), which fires after clip-path reaches
  // inset(0 0 0% 0). Do NOT call play() here or via IntersectionObserver —
  // early calls while the card is still clip-path-hidden cause iOS Safari
  // to "blacklist" the video for the session, blocking all later play().

  document.querySelectorAll('.wg-card').forEach(card => {
    const video = card.querySelector('.wg-video');
    if (!video) return;

    if (video.classList.contains('wg-video--auto')) {
      // Set the muted IDL property now; play() is called from GSAP onComplete
      video.muted = true;
      video.setAttribute('muted', '');
      // Re-play if user returns from another tab or app
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && video.paused) { video.muted = true; video.play().catch(() => {}); }
      });
      window.addEventListener('pageshow', () => {
        if (video.paused) { video.muted = true; video.play().catch(() => {}); }
      });
      return;
    }

    // Hover-only videos (desktop) — play on mouseenter, reset on leave
    card.addEventListener('mouseenter', () => {
      if (video.currentSrc && video.currentSrc !== window.location.href) {
        video.play().catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
})();

/* ── SERVICES ROWS — staggered scroll reveal ───────────────── */
(function () {
  const rows = gsap.utils.toArray('.svc-row');
  if (!rows.length) return;

  rows.forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, y: 50, clipPath: 'inset(0 0 100% 0)' },
      {
        opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)',
        duration: 1, ease: 'power3.out',
        delay: i * 0.07,
        scrollTrigger: {
          trigger: row,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      }
    );
  });
})();

/* ── PORTFOLIO CARD VIDEO PREVIEWS ─────────────────────────── */
(function () {
  document.querySelectorAll('.portfolio-card').forEach(card => {
    const video = card.querySelector('.portfolio-video');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      if (video.currentSrc && video.currentSrc !== window.location.href) {
        video.play().catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
})();

/* ── STATEMENT SCRUB ───────────────────────────────────────── */
(function () {
  const el = document.querySelector('.statement-text');
  if (!el) return;

  const children = Array.from(el.childNodes);
  el.innerHTML = '';

  children.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      node.textContent.split(/(\s+)/).forEach(chunk => {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) {
          el.appendChild(document.createTextNode(chunk));
        } else {
          const sp = document.createElement('span');
          sp.className = 'sw';
          sp.textContent = chunk;
          el.appendChild(sp);
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      node.textContent.split(/\s+/).forEach((w, i, arr) => {
        const tag = document.createElement(node.tagName.toLowerCase());
        tag.className = 'sw';
        tag.textContent = w;
        el.appendChild(tag);
        if (i < arr.length - 1) el.appendChild(document.createTextNode(' '));
      });
    }
  });

  gsap.fromTo(el.querySelectorAll('.sw'),
    { opacity: 0.1 },
    {
      opacity: 1, stagger: 0.04, ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top 78%',
        end: 'bottom 28%',
        scrub: 1.2,
      }
    }
  );
})();

/* ── GENERAL REVEAL ────────────────────────────────────────── */
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── SERVICE ACCORDION ─────────────────────────────────────── */
(function () {
  const items = document.querySelectorAll('.service-item');
  if (!items.length) return;

  items.forEach(item => {
    item.querySelector('.service-trigger').addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  if (items[0]) items[0].classList.add('open');
})();

/* ── PORTFOLIO FILTER ──────────────────────────────────────── */
(function () {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.category === f;
        gsap.to(card, { opacity: show ? 1 : 0.1, scale: show ? 1 : 0.97, duration: 0.4, ease: 'power2.out' });
        card.style.pointerEvents = show ? 'auto' : 'none';
      });
    });
  });
})();

/* ── COUNTER ───────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dec    = target % 1 !== 0;

    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter() {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate() {
            el.textContent = (dec ? obj.val.toFixed(1) : Math.round(obj.val)) + suffix;
          }
        });
      }
    });
  });
})();

/* ── MARQUEE CLONE ─────────────────────────────────────────── */
(function () {
  const track = document.querySelector('.marquee-track');
  if (track) track.parentElement.appendChild(track.cloneNode(true));
})();

/* ── STAGGERED SECTION ITEMS ───────────────────────────────── */
(function () {
  ['.num-item', '.process-step'].forEach(sel => {
    gsap.utils.toArray(sel).forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 18, duration: 0.8, ease: 'power3.out',
        delay: i * 0.06,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
    });
  });
})();

/* ── MAGNETIC BUTTONS ──────────────────────────────────────── */
(function () {
  document.querySelectorAll('.btn-primary, .btn-accent').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.28;
      const y = (e.clientY - r.top  - r.height / 2) * 0.28;
      gsap.to(btn, { x, y, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' });
    });
  });
})();

/* ── LEAD FORM ─────────────────────────────────────────────── */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const btn      = form.querySelector('[type="submit"]');
  const label    = btn.querySelector('.btn-label');
  const fields   = form.querySelectorAll('.form-field input, .form-field select, .form-field textarea');
  const origText = label ? label.textContent : btn.textContent;

  const setLabel = txt => { if (label) label.textContent = txt; else btn.textContent = txt; };

  /* Animated focus glow — each field gets a soft, theme-coloured halo that
     scales in from its label on focus, echoing the site's cinematic-lens motif */
  fields.forEach(field => {
    const wrap = field.closest('.form-field');
    if (!wrap || wrap.querySelector('.form-field-glow')) return;
    const glow = document.createElement('span');
    glow.className = 'form-field-glow';
    wrap.appendChild(glow);

    field.addEventListener('focus', () => {
      gsap.fromTo(glow,
        { opacity: 0, scaleX: 0.6 },
        { opacity: 1, scaleX: 1, duration: 0.55, ease: 'power3.out', transformOrigin: 'left center' }
      );
      gsap.to(wrap, { y: -2, duration: 0.35, ease: 'power2.out' });
    });
    field.addEventListener('blur', () => {
      gsap.to(glow, { opacity: 0, duration: 0.4, ease: 'power2.in' });
      gsap.to(wrap, { y: 0, duration: 0.4, ease: 'power2.out' });
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (btn.disabled) return;
    btn.disabled = true;

    // Collect form values
    const payload = {
      name:    (document.getElementById('lf-name')?.value    || '').trim(),
      email:   (document.getElementById('lf-email')?.value   || '').trim(),
      phone:   (document.getElementById('lf-phone')?.value   || '').trim(),
      service: (document.getElementById('lf-service')?.value || '').trim(),
      message: (document.getElementById('lf-message')?.value || '').trim(),
    };

    // Phase 1 — animate button into "sending" state, then await so the
    //            spinner stays visible while the HTTP request is in-flight
    await new Promise(resolve => {
      gsap.timeline({ onComplete: resolve, defaults: { ease: 'power3.out' } })
        // Button pulse
        .to(btn, { scale: 0.97, duration: 0.18, ease: 'power2.in' })
        .to(btn, { scale: 1,    duration: 0.4,  ease: 'elastic.out(1, 0.5)' })
        .add(() => { setLabel('Sending'); btn.classList.add('is-sending'); })
        // Fields softly dim while the request processes
        .to(form.querySelectorAll('.form-field'), {
          opacity: 0.45, duration: 0.5, stagger: 0.03, ease: 'power2.inOut',
        }, '<');
    });

    // Phase 2 — fire the actual API request
    let ok = false;
    try {
      const res = await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      ok = res.ok;
    } catch (_) {
      ok = false;
    }

    // Phase 3a — SUCCESS: button flips to accent gradient, fields glow back in
    if (ok) {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .add(() => {
          btn.classList.remove('is-sending');
          btn.classList.add('is-sent');
          setLabel('Message Sent');
        })
        .fromTo(btn, { '--sent-wipe': '0%' }, { '--sent-wipe': '100%', duration: 0.6, ease: 'power3.out' }, '<')
        .to(form.querySelectorAll('.form-field'), {
          opacity: 1, duration: 0.6, stagger: 0.03, ease: 'power2.out',
        }, '<0.1')
        .fromTo('.lead-form-success', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '<0.1')
        // Reset everything after a moment so the form is usable again
        .add(() => {
          setTimeout(() => {
            gsap.to('.lead-form-success', { autoAlpha: 0, y: 10, duration: 0.4, ease: 'power2.in' });
            btn.classList.remove('is-sent');
            btn.style.removeProperty('--sent-wipe');
            setLabel(origText);
            btn.disabled = false;
            form.reset();
          }, 4200);
        });

    // Phase 3b — ERROR: restore fields so the user can try again
    } else {
      gsap.to(form.querySelectorAll('.form-field'), {
        opacity: 1, duration: 0.4, ease: 'power2.out',
      });
      btn.classList.remove('is-sending');
      setLabel('Failed — Try Again');
      btn.disabled = false;
    }
  });
})();

/* ── SERVICE CARD 3D TILT ──────────────────────────────────── */
(function () {
  const cards = document.querySelectorAll('.svc-visual');
  if (!cards.length) return;

  // Inject the specular shine overlay into each card
  cards.forEach(card => {
    const shine = document.createElement('div');
    shine.className = 'svc-visual-shine';
    card.appendChild(shine);
  });

  // Only run tilt interaction on pointer-capable (non-touch) devices
  if (!window.matchMedia('(hover: hover)').matches) return;

  const MAX_TILT = 14;   // max rotation degrees
  const SCALE    = 1.03; // subtle lift on hover

  cards.forEach(card => {
    const shine = card.querySelector('.svc-visual-shine');

    card.addEventListener('mouseenter', () => {
      card.classList.add('is-tilting');
      if (shine) gsap.to(shine, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      // Normalise cursor position to [-1, 1]
      const nx   = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ny   = ((e.clientY - rect.top)  / rect.height) * 2 - 1;

      const rotY =  nx * MAX_TILT;
      const rotX = -ny * MAX_TILT;

      gsap.to(card, {
        rotationX           : rotX,
        rotationY           : rotY,
        scale               : SCALE,
        duration            : 0.4,
        ease                : 'power2.out',
        transformPerspective: 900,
      });

      // Specular highlight follows the cursor position
      if (shine) {
        const ox = ((e.clientX - rect.left) / rect.width)  * 100;
        const oy = ((e.clientY - rect.top)  / rect.height) * 100;
        shine.style.background =
          `radial-gradient(circle at ${ox}% ${oy}%, rgba(255,255,255,0.15) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.classList.remove('is-tilting');

      gsap.to(card, {
        rotationX           : 0,
        rotationY           : 0,
        scale               : 1,
        duration            : 0.8,
        ease                : 'elastic.out(1, 0.45)',
        transformPerspective: 900,
      });

      if (shine) gsap.to(shine, { opacity: 0, duration: 0.4, ease: 'power2.out' });
    });
  });
})();

/* ── SMOOTH ANCHOR SCROLL ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});

/* ── HERO → NAV LOGO MORPH ─────────────────────────────────── */
/*
   Large logo visible in the hero at page load.
   As the user scrolls ~300px past the top the hero mark fades +
   scales down while the nav logo fades back in — creating a
   seamless transition between the two sizes.
*/
(function () {
  const heroMark = document.querySelector('.hero-logo-mark');
  const navMark  = document.querySelector('.nav-logo-img');
  if (!heroMark || !navMark) return;

  // Hide the nav logo on load; it re-appears as the hero mark exits
  gsap.set(navMark, { autoAlpha: 0 });

  // Use whichever hero container is on this page
  const heroCont = document.querySelector('.hero') || document.querySelector('.page-hero');
  if (!heroCont) return;

  gsap.timeline({
    scrollTrigger: {
      trigger : heroCont,
      start   : 'top top',
      end     : '+=300',
      scrub   : 0.7,
    }
  })
  // hero mark fades & shrinks toward nav position
  .to(heroMark, {
    autoAlpha     : 0,
    scale         : 0.55,
    y             : -20,
    duration      : 1,
    ease          : 'none',
  }, 0)
  // nav logo fades in once hero mark is mostly gone
  .to(navMark, {
    autoAlpha : 1,
    duration  : 0.5,
    ease      : 'none',
  }, 0.5);
})();
