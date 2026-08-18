// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
  });
}

// Contact form — posts to FormSubmit → sales@coastlinevirtualstudio.co.uk
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

if (form) {
  // Show success message if redirected back after send
  if (window.location.search.includes('sent=1') && formNote) {
    formNote.textContent = "Thanks! I'll be in touch within 24 working hours to arrange your discovery call.";
    formNote.className = 'form-note success';
  }

  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
    if (formNote) {
      formNote.textContent = 'Sending your message...';
      formNote.className = 'form-note';
    }
  });
}

// ===== AI Chat Assistant =====
(function () {
  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const suggestions = document.getElementById('chatSuggestions');
  const toggleIcon = document.getElementById('chatToggleIcon');

  if (!toggle || !panel || !messages || !form) return;

  const replies = [
    {
      keys: ['service', 'offer', 'do you do', 'help with', 'what can'],
      answer: 'We offer:\n• Website design\n• Virtual assistance\n• Admin solutions\n• Marketing support\n• Hosting & care plans\n\nAll aimed at local businesses who want to look professional online and run smoother day to day.'
    },
    {
      keys: ['price', 'cost', 'how much', 'rate', 'fee', 'quote', '£', 'pricing'],
      answer: 'Website packages start from a limited portfolio rate of £249 for a simple 3–5 page site.\n\nStandard projects and ongoing VA/admin support are quoted to suit your needs. Use the contact form and we\'ll come back with a clear next step.'
    },
    {
      keys: ['where', 'based', 'location', 'selsey', 'area', 'local'],
      answer: 'Coastline Virtual Studio is based in Selsey, West Sussex, and works with local businesses across the area (and further afield online).'
    },
    {
      keys: ['start', 'begin', 'book', 'contact', 'enquiry', 'get in touch', 'discovery'],
      answer: 'Easy — use the contact form on this page (or email sales@coastlinevirtualstudio.co.uk). We\'ll reply within 24 working hours to arrange a free discovery call.'
    },
    {
      keys: ['website', 'web site', 'web design', 'site'],
      answer: 'We design and build custom websites for local businesses — clean, mobile-friendly and ready in as little as 5–10 days for simpler projects.\n\nNo complicated platforms required unless you need them.'
    },
    {
      keys: ['va', 'virtual assist', 'admin', 'email', 'booking'],
      answer: 'Virtual assistance and admin support can include email & diary management, customer enquiries, bookings, document prep, social scheduling and day-to-day admin — so you can focus on the work that grows your business.'
    },
    {
      keys: ['marketing', 'seo', 'social', 'google business', 'ads'],
      answer: 'Marketing support includes social content & scheduling, Google Business Profile setup, basic SEO/local search, email newsletters and simple ads guidance — practical help to get found by more local customers.'
    },
    {
      keys: ['hosting', 'care plan', 'maintain'],
      answer: 'Hosting & care plans keep your site secure, backed up and up to date, with optional content updates and priority support.'
    },
    {
      keys: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
      answer: 'Hi — welcome to Coastline Virtual Studio. Ask me about services, pricing, location, or how to get started.'
    },
    {
      keys: ['roly', 'portfolio', 'example', 'work', 'demo'],
      answer: 'You can see recent work in the Projects section — including Roly\'s Pie & Mash (live site) plus café, salon and electrician demo sites.\n\nScroll to "Recent Projects" on this page.'
    },
    {
      keys: ['time', 'how long', 'timeline', 'days', 'week'],
      answer: 'Simple brochure-style websites are often ready in about 5–10 days once content is agreed. Larger or custom projects take longer — we\'ll give a realistic timeline on the discovery call.'
    }
  ];

  const fallback = 'I can help with questions about our services, pricing, location and how to get started.\n\nFor a tailored quote, please use the contact form on this page or email sales@coastlinevirtualstudio.co.uk — we\'ll reply within 24 working hours.';

  function addBubble(text, who) {
    const el = document.createElement('div');
    el.className = 'chat-bubble ' + who;
    el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function getReply(text) {
    const q = text.toLowerCase();
    for (const item of replies) {
      if (item.keys.some(k => q.includes(k))) return item.answer;
    }
    return fallback;
  }

  function openChat() {
    panel.hidden = false;
    toggleIcon.textContent = '✕';
    if (!messages.dataset.greeted) {
      addBubble('Hi! I\'m the Coastline assistant. Ask me about websites, virtual assistance, pricing, or how to get started.', 'bot');
      messages.dataset.greeted = '1';
    }
    input.focus();
  }

  function closeChat() {
    panel.hidden = true;
    toggleIcon.textContent = '💬';
  }

  toggle.addEventListener('click', () => {
    if (panel.hidden) openChat();
    else closeChat();
  });
  closeBtn.addEventListener('click', closeChat);

  function ask(question) {
    const q = question.trim();
    if (!q) return;
    addBubble(q, 'user');
    input.value = '';
    setTimeout(() => addBubble(getReply(q), 'bot'), 350);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });

  if (suggestions) {
    suggestions.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => ask(btn.getAttribute('data-q')));
    });
  }
})();

// ===== Cookie consent banner =====
(function () {
  const KEY = 'cvs-cookie-consent';
  if (localStorage.getItem(KEY)) return;

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie notice');
  banner.innerHTML = `
    <p>We use essential cookies to make this site work. See our <a href="privacy.html">Privacy Notice</a>.</p>
    <div class="cookie-actions">
      <button type="button" class="cookie-decline" data-choice="declined">Decline</button>
      <button type="button" class="cookie-accept" data-choice="accepted">Accept</button>
    </div>
  `;
  document.body.appendChild(banner);

  banner.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-choice]');
    if (!btn) return;
    localStorage.setItem(KEY, btn.getAttribute('data-choice'));
    banner.hidden = true;
  });
})();
