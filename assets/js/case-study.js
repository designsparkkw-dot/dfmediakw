/* ─────────────────────────────────────────────────────────
   case-study.js — Full-screen case study overlay controller
   Opens / closes .cso panels with a GSAP clip-path animation.
   ───────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Guard: GSAP must be loaded ─────────────────────── */
  if (typeof gsap === 'undefined') {
    console.warn('[case-study] GSAP not found. Overlays will open without animation.');
  }

  /* ── State ───────────────────────────────────────────── */
  let activeOverlay = null;
  let previousScrollY = 0;

  /* ── Helpers ─────────────────────────────────────────── */
  const ease = 'cubic-bezier(0.16, 1, 0.3, 1)';

  function lockScroll() {
    previousScrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${previousScrollY}px`;
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, previousScrollY);
  }

  /* ── Open ────────────────────────────────────────────── */
  function openOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay || overlay === activeOverlay) return;

    // Close any existing overlay instantly before opening new one
    if (activeOverlay) closeOverlay(true);

    activeOverlay = overlay;
    overlay.scrollTop = 0;

    // Kick off the sticky showcase video alongside the body copy — played
    // here, synchronously inside the click handler's call stack, so the
    // browser treats it as a user-gesture-initiated play and allows audio
    const showcaseVideo = overlay.querySelector('.cso-body-video');
    let playShowcaseWithSound = null;
    if (showcaseVideo) {
      showcaseVideo.muted = false;
      showcaseVideo.currentTime = 0;
      playShowcaseWithSound = () => showcaseVideo.play().catch(() => {
        // Autoplay-with-sound was blocked (e.g. gesture not recognised) —
        // fall back to a muted autoplay so the video still runs
        showcaseVideo.muted = true;
        showcaseVideo.play().catch(() => {});
      });
      playShowcaseWithSound();
    }

    lockScroll();

    if (typeof gsap !== 'undefined') {
      // Start clipped from bottom — slides up into view
      /* Start clipped from the bottom — reveals top-to-bottom so the
         bar immediately covers the page content beneath the nav */
      gsap.set(overlay, {
        clipPath: 'inset(0 0 100% 0)',
        pointerEvents: 'none',
      });

      overlay.classList.add('is-open');

      gsap.to(overlay, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 0.85,
        ease: ease,
        onStart() {
          overlay.style.pointerEvents = 'all';
        },
        onComplete() {
          // Re-trigger play once the overlay (and the sticky video inside
          // it) is fully revealed — mirrors the homepage showcase-video
          // fix: iOS/WebKit can refuse to (un)muted-autoplay a <video>
          // while its container is still clip-path-hidden and reports
          // zero visible area. This still lands well within the click's
          // "user activation" window, so audio keeps working.
          if (playShowcaseWithSound) playShowcaseWithSound();
        },
      });

      /* Stagger in the body sections */
      const sections = overlay.querySelectorAll('.cso-section');
      gsap.fromTo(
        sections,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: ease,
          delay: 0.45,
        }
      );

    } else {
      /* Fallback — no GSAP */
      overlay.classList.add('is-open');
      overlay.style.clipPath = 'inset(0 0 0% 0)';
      overlay.style.pointerEvents = 'all';
    }
  }

  /* ── Close ───────────────────────────────────────────── */
  function closeOverlay(instant) {
    if (!activeOverlay) return;
    const overlay = activeOverlay;
    activeOverlay = null;

    // Pause the showcase video so it doesn't keep playing offscreen
    const showcaseVideo = overlay.querySelector('.cso-body-video');
    if (showcaseVideo) {
      showcaseVideo.pause();
      showcaseVideo.currentTime = 0;
    }

    if (typeof gsap !== 'undefined' && !instant) {
      /* Roll up from the bottom — bar stays visible last, then snaps shut */
      gsap.to(overlay, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.65,
        ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
        onComplete() {
          overlay.classList.remove('is-open');
          overlay.style.pointerEvents = 'none';
          gsap.set(overlay, { clearProps: 'clipPath' });
        },
      });
    } else {
      overlay.classList.remove('is-open');
      overlay.style.clipPath = '';
      overlay.style.pointerEvents = 'none';
    }

    unlockScroll();
  }

  /* ── Event: click client rows ────────────────────────── */
  document.addEventListener('click', function (e) {
    /* Open overlay when clicking a .cs-item */
    const row = e.target.closest('.cs-card[data-overlay]');
    if (row) {
      const id = row.dataset.overlay;
      if (id) openOverlay(id);
      return;
    }

    /* Close overlay when clicking the .cso-close button */
    const closeBtn = e.target.closest('.cso-close');
    if (closeBtn) {
      closeOverlay(false);
      return;
    }

    /* Close if backdrop outside overlay content clicked */
    /* (not needed here since overlay is full-screen, but guard anyway) */
  });

  /* ── Event: Escape key ───────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && activeOverlay) {
      closeOverlay(false);
    }
  });

  /* ── Event: browser back button ─────────────────────── */
  window.addEventListener('popstate', function () {
    if (activeOverlay) closeOverlay(false);
  });

  /* ── Push a state so back button works ──────────────── */
  /* Augment openOverlay to push history state */
  const _open = openOverlay;
  /* Already defined above — wrap after declaration */

  document.addEventListener('click', function (e) {
    const row = e.target.closest('.cs-card[data-overlay]');
    if (row && row.dataset.overlay) {
      // Push state so popstate fires on back
      history.pushState({ cso: row.dataset.overlay }, '', '');
    }
  }, true /* capture: fires before the bubble listener */);

})();
