/* ============================================================
   DF MEDIA — contact-modal.js
   Intercepts every contact.html CTA across all pages and
   opens a WhatsApp / Instagram channel-selector modal.
   Language-aware: detects lang="ar" on <html> for Arabic text.
   ============================================================ */

(function () {

  /* ── CONFIG — update these when going live ───────────── */
  const WA_NUMBER = '96569094525';           // e.g. Kuwait: 96512345678
  const IG_HANDLE = 'dfmedia';               // without @
  const WA_URL    = `https://wa.me/${WA_NUMBER}`;
  const IG_URL    = `https://instagram.com/${IG_HANDLE}`;

  /* ── LANGUAGE DETECTION ──────────────────────────────── */
  const isAR = document.documentElement.lang === 'ar';

  const T = {
    eyebrow   : isAR ? 'تواصل معنا'                        : 'Get In Touch',
    title     : isAR ? 'كيف تبغي<br>توصل فينا؟'           : 'How do you want<br>to reach us?',
    sub       : isAR ? 'اختار القناة اللي تناسبك — نرد بسرعة.' : 'Pick your preferred channel — we respond fast.',
    waName    : isAR ? 'واتساب'                             : 'WhatsApp',
    waHint    : isAR ? 'تشات مباشر — أسرع رد'              : 'Chat directly — fastest response',
    igName    : isAR ? 'انستغرام DM'                       : 'Instagram DM',
    igHint    : isAR ? 'راسلنا على الانستغرام'             : 'Send us a DM on Instagram',
    close     : isAR ? 'إغلاق'                              : 'Close',
  };

  /* ── WHATSAPP SVG ────────────────────────────────────── */
  const WA_SVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>`;

  /* ── INSTAGRAM SVG ───────────────────────────────────── */
  const IG_SVG = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>`;

  /* ── ARROW SVG ───────────────────────────────────────── */
  const ARROW_SVG = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M3 7.5h9M9 3.5l4 4-4 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;

  /* ── CLOSE SVG ───────────────────────────────────────── */
  const CLOSE_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <line x1="1.5" y1="1.5" x2="14.5" y2="14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
    <line x1="14.5" y1="1.5" x2="1.5" y2="14.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>
  </svg>`;

  /* ── BUILD MODAL HTML ────────────────────────────────── */
  const html = `
  <div class="cm-backdrop" id="cm-backdrop" role="dialog" aria-modal="true" aria-label="${T.eyebrow}">
    <div class="cm-card" id="cm-card">

      <button class="cm-close" id="cm-close" aria-label="${T.close}">
        ${CLOSE_SVG}
      </button>

      <span class="cm-eyebrow">${T.eyebrow}</span>
      <h2 class="cm-title">${T.title}</h2>
      <p class="cm-sub">${T.sub}</p>

      <div class="cm-channels">

        <a href="${WA_URL}" target="_blank" rel="noopener noreferrer" class="cm-channel cm-channel--wa">
          <div class="cm-channel-icon">${WA_SVG}</div>
          <div class="cm-channel-text">
            <span class="cm-channel-name">${T.waName}</span>
            <span class="cm-channel-hint">${T.waHint}</span>
          </div>
          <div class="cm-channel-arrow">${ARROW_SVG}</div>
        </a>

        <a href="${IG_URL}" target="_blank" rel="noopener noreferrer" class="cm-channel cm-channel--ig">
          <div class="cm-channel-icon">${IG_SVG}</div>
          <div class="cm-channel-text">
            <span class="cm-channel-name">${T.igName}</span>
            <span class="cm-channel-hint">${T.igHint}</span>
          </div>
          <div class="cm-channel-arrow">${ARROW_SVG}</div>
        </a>

      </div>
    </div>
  </div>`;

  /* ── INJECT ──────────────────────────────────────────── */
  document.body.insertAdjacentHTML('beforeend', html);

  const backdrop = document.getElementById('cm-backdrop');
  const card     = document.getElementById('cm-card');
  const closeBtn = document.getElementById('cm-close');

  /* ── OPEN ────────────────────────────────────────────── */
  function openModal() {
    backdrop.classList.add('cm-open');
    document.body.style.overflow = 'hidden';

    if (typeof gsap !== 'undefined') {
      gsap.set(card, { opacity: 0, scale: 0.94, y: 20 });
      gsap.to(backdrop, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.to(card,     { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out' });
    }
  }

  /* ── CLOSE ───────────────────────────────────────────── */
  function closeModal() {
    if (typeof gsap !== 'undefined') {
      gsap.to(card, { opacity: 0, scale: 0.96, y: 10, duration: 0.22, ease: 'power2.in' });
      gsap.to(backdrop, {
        opacity: 0, duration: 0.28, ease: 'power2.in', delay: 0.04,
        onComplete() {
          backdrop.classList.remove('cm-open');
          document.body.style.overflow = '';
        }
      });
    } else {
      backdrop.classList.remove('cm-open');
      document.body.style.overflow = '';
    }
  }

  /* ── INTERCEPT — skip on contact.html itself ─────────── */
  const path = window.location.pathname;
  const isContactPage = path.endsWith('contact.html') || path.endsWith('contact');

  if (!isContactPage) {
    document.addEventListener('click', e => {
      const link = e.target.closest('a');
      if (!link) return;

      // Let the nav menu & mobile menu links go straight to contact.html
      if (link.closest('.nav-links'))   return;
      if (link.closest('.mobile-menu')) return;

      const href = link.getAttribute('href') || '';
      if (href === 'contact.html' || href === './contact.html') {
        e.preventDefault();
        openModal();
      }
    });
  }

  /* ── CLOSE TRIGGERS ──────────────────────────────────── */
  closeBtn.addEventListener('click', closeModal);

  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && backdrop.classList.contains('cm-open')) {
      closeModal();
    }
  });

})();
