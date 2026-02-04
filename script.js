const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}


const glowSelectors = [
  '.panel-card',
  '.focus-card',
  '.project-card',
  '.tool-card',
  '.timeline-content',
  '.skills-card',
  '.cert-card',
  '.education-card',
  '.contact-card',
  '.mission-card',
];

document
  .querySelectorAll(glowSelectors.join(','))
  .forEach((element) => element.classList.add('glow-track'));

if (!prefersReducedMotion) {
  const glowTargets = document.querySelectorAll('.glow-track');
  glowTargets.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty('--mx', `${x}%`);
      element.style.setProperty('--my', `${y}%`);
    });

    element.addEventListener('pointerleave', () => {
      element.style.setProperty('--mx', '50%');
      element.style.setProperty('--my', '50%');
    });
  });
}

const staggerSelectors = [
  '.mission-grid > *',
  '.focus-grid > *',
  '.tools-grid > *',
  '.projects-grid > *',
  '.timeline-item',
  '.skills-grid > *',
  '.cert-grid > *',
  '.education-grid > *',
  '.lang-row > *',
  '.contact-grid > *',
];

document
  .querySelectorAll(staggerSelectors.join(','))
  .forEach((element) => element.classList.add('stagger-item'));

const heroStagger = document.querySelectorAll('.hero-content > *, .hero-panel > *');
heroStagger.forEach((element, index) => {
  const delay = prefersReducedMotion ? 0 : 120 + index * 90;
  element.classList.add('stagger-item');
  element.style.transitionDelay = `${delay}ms`;
  requestAnimationFrame(() => element.classList.add('stagger-in'));
});

const applyStagger = (section) => {
  const items = section.querySelectorAll('.stagger-item');
  items.forEach((item, index) => {
    if (item.classList.contains('stagger-in')) {
      return;
    }
    const delay = prefersReducedMotion ? 0 : index * 80;
    item.style.transitionDelay = `${delay}ms`;
    item.classList.add('stagger-in');
  });
};

const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        applyStagger(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

reveals.forEach((section) => observer.observe(section));

const rotator = document.querySelector('[data-rotating]');
if (rotator) {
  let words = [];
  try {
    words = JSON.parse(rotator.dataset.words || '[]');
  } catch (error) {
    words = [];
  }

  let index = 0;
  if (words.length > 0) {
    rotator.textContent = words[0];
  }

  if (!prefersReducedMotion && words.length > 1) {
    setInterval(() => {
      rotator.classList.add('fade');
      setTimeout(() => {
        index = (index + 1) % words.length;
        rotator.textContent = words[index];
        rotator.classList.remove('fade');
      }, 350);
    }, 2400);
  }
}

const hero = document.querySelector('.hero');
if (hero && !prefersReducedMotion) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    targetX = x * 40;
    targetY = y * 40;
  });

  const animate = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    hero.style.setProperty('--mx', `${currentX}px`);
    hero.style.setProperty('--my', `${currentY}px`);
    requestAnimationFrame(animate);
  };

  animate();
}

const projectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('project-modal');

if (modal && projectCards.length) {
  const modalTitle = modal.querySelector('#modal-title');
  const modalSubtitle = modal.querySelector('#modal-subtitle');
  const modalBody = modal.querySelector('#modal-body');
  const closeButton = modal.querySelector('.modal-close');
  const closeTargets = modal.querySelectorAll('[data-modal-close]');
  let lastFocused = null;

  const splitItems = (value) =>
    value
      ? value
          .split('|')
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const buildListSection = (title, items) => {
    const section = document.createElement('div');
    section.className = 'modal-section';
    const heading = document.createElement('h4');
    heading.textContent = title;
    const list = document.createElement('ul');
    items.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      list.appendChild(li);
    });
    section.append(heading, list);
    return section;
  };

  const buildNote = (label, text) => {
    const note = document.createElement('p');
    note.className = 'modal-note';
    const strong = document.createElement('strong');
    strong.textContent = label;
    note.append(strong, document.createTextNode(` ${text}`));
    return note;
  };

  const openModal = (card) => {
    lastFocused = document.activeElement;
    modalTitle.textContent = card.dataset.title || 'Project';
    modalSubtitle.textContent = card.dataset.subtitle || '';

    modalBody.innerHTML = '';
    modalBody.append(
      buildListSection('Architecture', splitItems(card.dataset.architecture)),
      buildListSection('Capabilities', splitItems(card.dataset.capabilities)),
      buildListSection('Advantages', splitItems(card.dataset.advantages)),
      buildNote('Real-world usage:', card.dataset.usage || ''),
      buildNote('Why it is better:', card.dataset.why || '')
    );

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (closeButton) {
      closeButton.focus();
    }
  };

  const closeModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  closeTargets.forEach((target) => {
    target.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}
