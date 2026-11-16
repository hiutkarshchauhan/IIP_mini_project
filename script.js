// ===== Meridian Institute of Technology — interactions =====
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
  }

  // Header shadow + back-to-top button
  const header = document.querySelector('.site-header');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
    if (toTop) toTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  // Animated counters
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        const start = performance.now();
        const dur = 1600;
        const tick = (now) => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  }

  // Course filter
  const chips = document.querySelectorAll('.chip[data-filter]');
  const courses = document.querySelectorAll('.course');
  const search = document.getElementById('courseSearch');
  const countEl = document.getElementById('courseCount');
  let activeFilter = 'all';
  const applyFilter = () => {
    const q = search ? search.value.trim().toLowerCase() : '';
    let shown = 0;
    courses.forEach((c) => {
      const okDept = activeFilter === 'all' || c.dataset.dept === activeFilter;
      const okText = !q || c.textContent.toLowerCase().includes(q);
      const show = okDept && okText;
      c.classList.toggle('hide', !show);
      if (show) shown++;
    });
    if (countEl) countEl.textContent = shown + (shown === 1 ? ' program' : ' programs') + ' found';
  };
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    applyFilter();
  }));
  if (search) search.addEventListener('input', applyFilter);
  if (courses.length) applyFilter();

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((o) => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  // Fee calculator (admissions page)
  const prog = document.getElementById('feeProgram');
  const hostel = document.getElementById('feeHostel');
  const out = document.getElementById('feeTotal');
  if (prog && hostel && out) {
    const calc = () => {
      const total = +prog.value + (hostel.checked ? 90000 : 0);
      out.textContent = '₹' + total.toLocaleString('en-IN');
    };
    prog.addEventListener('change', calc);
    hostel.addEventListener('change', calc);
    calc();
  }

  // Contact form validation
  const form = document.getElementById('contactForm');
  if (form) {
    const rules = {
      name: (v) => v.trim().length >= 2,
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      phone: (v) => v === '' || /^[0-9+\-\s]{10,14}$/.test(v),
      message: (v) => v.trim().length >= 10,
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      Object.keys(rules).forEach((name) => {
        const input = form.elements[name];
        const valid = rules[name](input.value);
        input.closest('.field').classList.toggle('error', !valid);
        if (!valid) ok = false;
      });
      const msg = document.getElementById('formSuccess');
      if (ok) {
        msg.textContent = '✓ Thank you, ' + form.elements.name.value.trim() + '! We will reply within 2 working days.';
        msg.classList.add('show');
        form.reset();
      } else {
        msg.classList.remove('show');
      }
    });
  }

  // Footer year
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
});
