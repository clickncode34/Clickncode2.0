const pageLoader = document.querySelector('.page-loader');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const contactForm = document.getElementById('contactForm');

window.addEventListener('load', () => {
  if (pageLoader) {
    pageLoader.classList.add('hidden');
    setTimeout(() => pageLoader.style.display = 'none', 500);
  }
});

menuToggle?.addEventListener('click', () => {
  const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!expanded));
  if (mobileMenu) {
    mobileMenu.hidden = !mobileMenu.hidden;
  }
});

mobileMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileMenu) mobileMenu.hidden = true;
    if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      alert('Merci de remplir tous les champs pour nous envoyer votre demande.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.value)) {
      alert('Merci de saisir une adresse email valide.');
      return;
    }

    contactForm.querySelector('button[type="submit"]').textContent = 'Envoi en cours...';
    setTimeout(() => {
      contactForm.reset();
      contactForm.querySelector('button[type="submit"]').textContent = 'Envoyer la demande';
      alert('Merci ! Votre demande a bien été envoyée. Nous revenons vers vous sous 24h.');
    }, 700);
  });
}

document.querySelectorAll('.payment-btn').forEach(button => {
  button.addEventListener('click', event => {
    const checkoutUrl = button.dataset.stripeUrl?.trim();
    const href = button.getAttribute('href');

    if (!checkoutUrl || checkoutUrl === '') {
      if (href === '#') {
        event.preventDefault();
        alert('Le lien de paiement Stripe n’est pas encore configuré. Remplacez la valeur href ou data-stripe-url par votre lien de paiement Stripe.');
      }
      return;
    }

    if (href === '#') {
      event.preventDefault();
      window.open(checkoutUrl, '_blank', 'noopener');
    }
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      console.warn('Service worker non enregistré.');
    });
  });
}

const throttle = (callback, limit) => {
  let waiting = false;
  return (...args) => {
    if (!waiting) {
      callback.apply(this, args);
      waiting = true;
      setTimeout(() => waiting = false, limit);
    }
  };
};

window.addEventListener('scroll', throttle(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  document.querySelectorAll('.fade-in, .glow-title, .text-underline-gold').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('visible');
    }
  });
}, 100));

window.addEventListener('load', () => {
  document.querySelectorAll('.fade-in, .glow-title, .text-underline-gold').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      el.classList.add('visible');
    }
  });
});
