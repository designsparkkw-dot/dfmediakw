import { readFileSync, writeFileSync } from 'fs';

let h = readFileSync('index.html', 'utf8');

// ── HEAD ──────────────────────────────────────────────────
h = h.replace('<html lang="en">', '<html lang="ar" dir="rtl">');
h = h.replace(
  'content="DF Media — A full-service advertising agency that builds brands impossible to ignore."',
  'content="دي إف ميديا — وكالة إعلانية تبني براندات ما تُنسى."'
);
h = h.replace(
  '<title>DF Media — Bold Strategy. Real Results.</title>',
  '<title>دي إف ميديا — جرأة في الاستراتيجية. نتائج تتكلم.</title>'
);
h = h.replace(
  '<link rel="stylesheet" href="assets/css/style.css" />',
  '<link rel="stylesheet" href="assets/css/style.css" />\n  <link rel="stylesheet" href="assets/css/style-rtl.css" />'
);

// ── STICKY CTA ────────────────────────────────────────────
h = h.replace(
  /(<a href="contact\.html" class="sticky-cta-btn">\s*)Chat With Us/,
  '$1كلّمنا'
);

// ── MOBILE MENU ───────────────────────────────────────────
h = h.replace(
  `  <!-- MOBILE MENU -->
  <div class="mobile-menu">
    <a href="index.html">Home</a>
    <a href="services.html">Services</a>
    <a href="portfolio.html">Work</a>
    <a href="contact.html">Contact</a>
  </div>`,
  `  <!-- MOBILE MENU -->
  <div class="mobile-menu">
    <a href="index-ar.html">الرئيسية</a>
    <a href="services.html">خدماتنا</a>
    <a href="portfolio.html">شغلنا</a>
    <a href="contact.html">كلّمنا</a>
  </div>`
);

// ── NAV ───────────────────────────────────────────────────
h = h.replace(
  `  <!-- NAV -->
  <nav class="nav" id="nav">
    <a href="index.html" class="nav-logo">DF Media</a>
    <ul class="nav-links">
      <li><a href="index.html">Home</a></li>
      <li><a href="services.html">Services</a></li>
      <li><a href="portfolio.html">Work</a></li>
      <li><a href="contact.html">Contact</a></li>
    </ul>
    <div style="display:flex;align-items:center;gap:16px;">
      <a href="https://instagram.com/dfmedia" target="_blank" rel="noopener" class="nav-instagram" aria-label="Instagram">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      <a href="contact.html" class="nav-contact">Get Started</a>
      <button class="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </nav>`,
  `  <!-- NAV -->
  <nav class="nav" id="nav">
    <a href="index-ar.html" class="nav-logo">DF Media</a>
    <ul class="nav-links">
      <li><a href="index-ar.html" class="active">الرئيسية</a></li>
      <li><a href="services.html">خدماتنا</a></li>
      <li><a href="portfolio.html">شغلنا</a></li>
      <li><a href="contact.html">تواصل</a></li>
    </ul>
    <div style="display:flex;align-items:center;gap:16px;">
      <a href="https://instagram.com/dfmedia" target="_blank" rel="noopener" class="nav-instagram" aria-label="Instagram">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
      </a>
      <a href="contact.html" class="nav-contact">ابدأ معنا</a>
      <button class="hamburger" aria-label="القائمة"><span></span><span></span><span></span></button>
    </div>
  </nav>`
);

// ── HERO TITLE & BUTTONS ──────────────────────────────────
h = h.replace(
  '<h1 class="hero-title">We Build Brands<br>That <em>Move Markets.</em></h1>',
  '<h1 class="hero-title">نبني براندات<br><em>تتصدر المشهد.</em></h1>'
);
h = h.replace(
  '<a href="contact.html" class="btn btn-primary">Chat With Us</a>',
  '<a href="contact.html" class="btn btn-primary">كلّمنا</a>'
);
h = h.replace(
  '<a href="#work" class="btn btn-ghost">See Our Work</a>',
  '<a href="#work" class="btn btn-ghost">شوف شغلنا</a>'
);
h = h.replace(
  '<span class="hero-scroll-text">Scroll</span>',
  '<span class="hero-scroll-text">تصفّح</span>'
);

// ── MARQUEE ───────────────────────────────────────────────
h = h.replace(
  `    <div class="marquee-track">
      <span class="marquee-item">Social Media Marketing <span class="marquee-sep"></span></span>
      <span class="marquee-item">Paid Advertising <span class="marquee-sep"></span></span>
      <span class="marquee-item">Creative &amp; Design <span class="marquee-sep"></span></span>
      <span class="marquee-item">SEO &amp; Content <span class="marquee-sep"></span></span>
      <span class="marquee-item">Brand Strategy <span class="marquee-sep"></span></span>
      <span class="marquee-item">Meta &amp; Google Ads <span class="marquee-sep"></span></span>
      <span class="marquee-item">TikTok Advertising <span class="marquee-sep"></span></span>
      <span class="marquee-item">Conversion Optimisation <span class="marquee-sep"></span></span>
    </div>`,
  `    <div class="marquee-track">
      <span class="marquee-item">إدارة السوشيال ميديا <span class="marquee-sep"></span></span>
      <span class="marquee-item">إعلانات مدفوعة <span class="marquee-sep"></span></span>
      <span class="marquee-item">إبداع وتصميم <span class="marquee-sep"></span></span>
      <span class="marquee-item">محتوى و SEO <span class="marquee-sep"></span></span>
      <span class="marquee-item">استراتيجية البراند <span class="marquee-sep"></span></span>
      <span class="marquee-item">إعلانات ميتا وجوجل <span class="marquee-sep"></span></span>
      <span class="marquee-item">إعلانات تيك توك <span class="marquee-sep"></span></span>
      <span class="marquee-item">تحسين التحويل <span class="marquee-sep"></span></span>
    </div>`
);

// ── WORK SECTION ──────────────────────────────────────────
h = h.replace(
  `        View All Projects`,
  `        شوف كل الأعمال`
);

// ── SERVICE ROWS ──────────────────────────────────────────
h = h.replace(
  '<span class="svc-row-name">Social Media</span>',
  '<span class="svc-row-name">السوشيال ميديا</span>'
);
h = h.replace(
  '<span class="svc-row-tag">Content · Community · Growth</span>',
  '<span class="svc-row-tag">محتوى · جمهور · نمو</span>'
);
h = h.replace(
  '<span class="svc-row-name">Paid Advertising</span>',
  '<span class="svc-row-name">الإعلانات المدفوعة</span>'
);
h = h.replace(
  '<span class="svc-row-tag">Meta · Google · TikTok</span>',
  '<span class="svc-row-tag">ميتا · جوجل · تيك توك</span>'
);
h = h.replace(
  '<span class="svc-row-name">Creative &amp; Design</span>',
  '<span class="svc-row-name">الإبداع والتصميم</span>'
);
h = h.replace(
  '<span class="svc-row-tag">Brand · Visual · Motion</span>',
  '<span class="svc-row-tag">هوية · مرئيات · حركة</span>'
);
h = h.replace(
  '<span class="svc-row-name">SEO &amp; Content</span>',
  '<span class="svc-row-name">المحتوى والـ SEO</span>'
);
h = h.replace(
  '<span class="svc-row-tag">Organic · Authority · Rankings</span>',
  '<span class="svc-row-tag">عضوي · سلطة · تصنيفات</span>'
);

// ── NUMBERS ───────────────────────────────────────────────
h = h.replace(
  `      <span class="num-label">Campaigns<br>Delivered</span>`,
  `      <span class="num-label">حملة إعلانية<br>أنجزناها</span>`
);
h = h.replace(
  `      <span class="num-label">Average Lead<br>Growth</span>`,
  `      <span class="num-label">نمو<br>في العملاء</span>`
);
h = h.replace(
  `      <span class="num-label">Average<br>ROAS</span>`,
  `      <span class="num-label">متوسط<br><span dir="ltr">ROAS</span></span>`
);
h = h.replace(
  `      <span class="num-label">Client<br>Retention</span>`,
  `      <span class="num-label">عملاء<br>يثقون فينا</span>`
);

// ── CTA ───────────────────────────────────────────────────
h = h.replace(
  '<h2 class="cta-title reveal d1">Ready to Be<br><em>Unskippable?</em></h2>',
  '<h2 class="cta-title reveal d1">جاهز<br><em>تفرق؟</em></h2>'
);
h = h.replace(
  `        <a href="contact.html" class="btn btn-primary">Chat With Us</a>
        <a href="services.html" class="btn btn-ghost">Explore Services</a>`,
  `        <a href="contact.html" class="btn btn-primary">كلّمنا</a>
        <a href="services.html" class="btn btn-ghost">شوف خدماتنا</a>`
);

// ── FOOTER ────────────────────────────────────────────────
h = h.replace(
  'A full-service advertising agency helping ambitious brands grow through bold strategy, precision advertising, and world-class creative.',
  'وكالتنا تخلي براندك يفرق — استراتيجية، إعلانات، وإبداع على أعلى مستوى.'
);
h = h.replace(
  `          <a href="#" class="footer-social">Instagram</a>
          <a href="#" class="footer-social">LinkedIn</a>
          <a href="#" class="footer-social">TikTok</a>
          <a href="#" class="footer-social">X</a>`,
  `          <a href="#" class="footer-social">انستغرام</a>
          <a href="#" class="footer-social">لينكد إن</a>
          <a href="#" class="footer-social">تيك توك</a>
          <a href="#" class="footer-social">إكس</a>`
);
// Footer columns
h = h.replace(
  `        <h4>Services</h4>
        <ul>
          <li><a href="services.html#social">Social Media</a></li>
          <li><a href="services.html#paid">Paid Advertising</a></li>
          <li><a href="services.html#creative">Creative &amp; Design</a></li>
          <li><a href="services.html#seo">SEO &amp; Content</a></li>
        </ul>`,
  `        <h4>خدماتنا</h4>
        <ul>
          <li><a href="services.html#social">السوشيال ميديا</a></li>
          <li><a href="services.html#paid">الإعلانات المدفوعة</a></li>
          <li><a href="services.html#creative">الإبداع والتصميم</a></li>
          <li><a href="services.html#seo">المحتوى والـ SEO</a></li>
        </ul>`
);
h = h.replace(
  `        <h4>Company</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="portfolio.html">Our Work</a></li>
          <li><a href="contact.html">Contact</a></li>`,
  `        <h4>عن الوكالة</h4>
        <ul>
          <li><a href="index-ar.html">الرئيسية</a></li>
          <li><a href="portfolio.html">شغلنا</a></li>
          <li><a href="contact.html">تواصل معنا</a></li>`
);
h = h.replace(
  `        <h4>Contact</h4>
        <ul>
          <li><a href="mailto:hello@dfmedia.com">hello@dfmedia.com</a></li>
          <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
          <li><a href="#">Instagram DM</a></li>
        </ul>`,
  `        <h4>كلّمنا</h4>
        <ul>
          <li><a href="mailto:hello@dfmedia.com">hello@dfmedia.com</a></li>
          <li><a href="tel:+1234567890">+1 (234) 567-890</a></li>
          <li><a href="#">DM على الانستغرام</a></li>
        </ul>`
);
h = h.replace(
  '&copy; 2025 DF Media. All rights reserved.',
  '&copy; 2025 DF Media. جميع الحقوق محفوظة.'
);
h = h.replace(
  `        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>`,
  `        <a href="#">سياسة الخصوصية</a>
        <a href="#">شروط الخدمة</a>`
);

writeFileSync('index-ar.html', h);
console.log('index-ar.html generated');
