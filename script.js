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
