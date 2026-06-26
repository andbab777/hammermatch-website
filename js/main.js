const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');

if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('mobile-open');
    document.body.style.overflow = open ? 'hidden' : '';
  });
}

// Close mobile menu when a nav link is tapped
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    nav.classList.remove('mobile-open');
    document.body.style.overflow = '';
  });
});

const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.fade').forEach(el => io.observe(el));

document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(tab.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => c.classList.toggle('on')));

// Formspree AJAX submission
const form = document.getElementById('contactForm');
const successWrap = document.querySelector('.success-wrap');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok) {
        form.style.display = 'none';
        if (successWrap) successWrap.style.display = 'block';
      } else {
        btn.disabled = false;
        btn.textContent = 'Submit Request';
        alert('Something went wrong. Please try again or email us directly.');
      }
    } catch {
      btn.disabled = false;
      btn.textContent = 'Submit Request';
      alert('Network error. Please check your connection and try again.');
    }
  });
}

// Active nav link
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
  if (href === currentPath) a.classList.add('active');
});
