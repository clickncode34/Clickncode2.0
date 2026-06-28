// ===== Bijou2luxe - Script Principal (Optimisé) =====

// ===== Throttle Utility =====
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            func(...args);
        }
    };
}

// ===== Initialization =====
function init() {
    console.log('🎁 Bijou2luxe - Initializing...');
    setupMagicParticles();
    setupScrollParticles();
    setupSmoothScroll();
    setupGalleryLightbox();
    setupAnimations();
    console.log('✅ Bijou2luxe - Ready!');
}

// ===== Magic Particles (Réduit pour performance) =====
function setupMagicParticles() {
    const particlesCount = 12; // Réduit de 28 à 12
    const overlay = document.querySelector('.site-magic-overlay');
    if (!overlay) return;

    for (let i = 0; i < particlesCount; i++) {
        const star = document.createElement('span');
        const size = Math.random() > 0.6 ? 8 + Math.random() * 10 : 3 + Math.random() * 4;
        const speed = 4 + Math.random() * 3;
        star.className = 'magic-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDuration = `${speed}s`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.opacity = size > 8 ? '0.6' : '0.3';
        star.style.willChange = 'transform';
        overlay.appendChild(star);
    }
}

// ===== Scroll Particles (Réduit + Throttled) =====
function setupScrollParticles() {
    const overlay = document.querySelector('.site-magic-overlay');
    if (!overlay) return;

    const scrollParticles = [];
    const particlesCount = 8; // Réduit de 16 à 8
    for (let i = 0; i < particlesCount; i++) {
        const particle = document.createElement('span');
        const size = Math.random() > 0.7 ? 10 + Math.random() * 12 : 4 + Math.random() * 4;
        particle.className = 'scroll-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.dataset.speedX = (Math.random() - 0.5) * 0.05;
        particle.dataset.speedY = (Math.random() - 0.2) * 0.06;
        particle.style.willChange = 'transform';
        overlay.appendChild(particle);
        scrollParticles.push(particle);
    }

    function updateScrollParticles() {
        const offset = window.scrollY;
        scrollParticles.forEach(particle => {
            const speedX = parseFloat(particle.dataset.speedX);
            const speedY = parseFloat(particle.dataset.speedY);
            particle.style.transform = `translate3d(${offset * speedX}px, ${offset * speedY}px, 0)`;
        });
    }

    // Throttle scroll events to 60fps max (16ms)
    window.addEventListener('scroll', throttle(updateScrollParticles, 16));
    updateScrollParticles();
}

// ===== Gallery Lightbox =====
function setupGalleryLightbox() {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    if (!galleryItems.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <div class="lightbox-inner">
            <button class="lightbox-close" aria-label="Fermer">×</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Photo précédente">‹</button>
            <button class="lightbox-nav lightbox-next" aria-label="Photo suivante">›</button>
            <img class="lightbox-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(overlay);

    const imageView = overlay.querySelector('.lightbox-image');
    const closeButton = overlay.querySelector('.lightbox-close');
    const prevButton = overlay.querySelector('.lightbox-prev');
    const nextButton = overlay.querySelector('.lightbox-next');

    let currentIndex = 0;

    const showItem = (index) => {
        if (index < 0) index = galleryItems.length - 1;
        if (index >= galleryItems.length) index = 0;
        const item = galleryItems[index];
        const image = item.querySelector('img');
        if (!image) return;

        imageView.src = image.src;
        imageView.alt = image.alt || 'Bijou Deluxe';
        currentIndex = index;
    };

    const openLightbox = (index) => {
        showItem(index);
        overlay.style.display = 'flex';
        window.requestAnimationFrame(() => overlay.classList.add('active'));
    };

    const closeLightbox = () => {
        overlay.classList.remove('active');
        overlay.addEventListener('transitionend', () => {
            if (!overlay.classList.contains('active')) {
                overlay.style.display = 'none';
            }
        }, { once: true });
    };

    const goTo = (index) => {
        showItem(index);
    };

    galleryItems.forEach((item, index) => {
        item.style.cursor = 'zoom-in';
        item.addEventListener('click', () => openLightbox(index));
    });

    closeButton.addEventListener('click', closeLightbox);
    prevButton.addEventListener('click', () => goTo(currentIndex - 1));
    nextButton.addEventListener('click', () => goTo(currentIndex + 1));

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLightbox();
        } else if (event.key === 'ArrowLeft') {
            goTo(currentIndex - 1);
        } else if (event.key === 'ArrowRight') {
            goTo(currentIndex + 1);
        }
    });
}

// ===== Smooth Scroll =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ===== Animations =====
function setupAnimations() {
    // Fade in elements on scroll
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.animation = 'fadeInScale 0.6s ease-out';
                }
            });
        });

        document.querySelectorAll('.product-card, .gallery-item, .feature').forEach(el => {
            el.style.opacity = '0.9';
            observer.observe(el);
        });
    }
}

// ===== Parallax Effect (Optimisé) =====
function setupParallax() {
    const hero = document.querySelector('.hero');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    // Disable parallax if no elements found
    if (!hero && !floatingCards.length) return;

    let isRunning = false;
    let ticking = false;

    const update = () => {
        if (!isRunning) return;
        const scrolled = window.pageYOffset;
        
        // Hero parallax with transform
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        // Floating cards parallax
        floatingCards.forEach((card, index) => {
            const offset = scrolled * (0.15 + index * 0.05);
            card.style.transform = `translateY(${offset}px)`;
        });

        ticking = false;
    };

    const onScroll = () => {
        isRunning = true;
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    };

    // Use throttled scroll listener
    window.addEventListener('scroll', throttle(onScroll, 16));
}

// ===== Ensure Visibility =====
function ensureVisibility() {
    document.body.style.opacity = '1';
    document.body.style.visibility = 'visible';
    document.body.style.display = 'block';
}

// ===== Start Application =====
ensureVisibility();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        init();
        setupParallax();
    });
} else {
    init();
    setupParallax();
}

