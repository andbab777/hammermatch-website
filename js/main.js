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

// Platform autocomplete
const platformInput = document.getElementById('platforms');
const suggestionsList = document.getElementById('platformSuggestions');
const PLATFORMS = ['Invaluable', 'LiveAuctioneers', 'Drouot', 'Bidsquare', 'HiBid', 'Proxibid', 'Bidspirit', 'eBay'];

if (platformInput && suggestionsList) {
  const getSelected = () => platformInput.value.split(',').map(s => s.trim().toLowerCase());

  const render = (matches) => {
    suggestionsList.innerHTML = '';
    if (!matches.length) { suggestionsList.classList.remove('open'); return; }
    matches.forEach(p => {
      const li = document.createElement('li');
      li.textContent = p;
      li.addEventListener('mousedown', e => {
        e.preventDefault();
        const parts = platformInput.value.split(',');
        parts[parts.length - 1] = ' ' + p;
        platformInput.value = parts.join(',').replace(/^\s*,/, '').trimStart() + ', ';
        suggestionsList.classList.remove('open');
        platformInput.focus();
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.classList.add('open');
  };

  platformInput.addEventListener('input', () => {
    const parts = platformInput.value.split(',');
    const current = parts[parts.length - 1].trim().toLowerCase();
    const selected = getSelected().slice(0, -1);
    if (!current) { suggestionsList.classList.remove('open'); return; }
    const matches = PLATFORMS.filter(p =>
      p.toLowerCase().startsWith(current) && !selected.includes(p.toLowerCase())
    );
    render(matches);
  });

  platformInput.addEventListener('blur', () => suggestionsList.classList.remove('open'));
}

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
