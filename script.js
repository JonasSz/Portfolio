document.addEventListener('DOMContentLoaded', () => {

    // 1. PERFORMANCE-CHECK (Simulierte Ladezeit, demonstriert aber den Fokus)
    if (window.performance && performance.timing) {
        const loadTimeElement = document.getElementById('load-time');
        const loadTimeMs = performance.timing.loadEventEnd - performance.timing.navigationStart;
        if (loadTimeElement && loadTimeMs > 0) {
            loadTimeElement.textContent = (loadTimeMs / 1000).toFixed(2) + 's';
        } else if (loadTimeElement) {
            loadTimeElement.textContent = '0.05s'; // Annäherung für Demo-Zwecke
        }
    }

    // 2. KONTAKTFORMULAR-FEEDBACK (Demonstriert Automatisierungs-Logik)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            submitButton.textContent = 'Workflow gestartet! 🤖';
            submitButton.style.backgroundColor = '#28a745';
            submitButton.disabled = true;

            // Simulierte Verzögerung für die Demo:
            setTimeout(() => {
                alert("Vielen Dank für Ihre Anfrage! Unser automatisierter Qualifizierungs-Workflow hat soeben gestartet. Ich melde mich in Kürze bei Ihnen.");
                contactForm.reset();
                submitButton.textContent = originalButtonText;
                submitButton.style.backgroundColor = 'var(--primary-color)';
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // 3. SMOOTH SCROLLING (Für verbesserte User Experience)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. SCROLL-REVEAL ANIMATIONEN (Der visuelle "Wow"-Faktor)
    const animateOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    };

    const observerOptions = {
        root: null,
        threshold: 0.1
    };

    const observer = new IntersectionObserver(animateOnScroll, observerOptions);

    const animatedElements = document.querySelectorAll(
        '.performance-proof, .stat-card, .service-card, .case-study-card, .guarantee-points > div, .step, .about-me'
    );

    animatedElements.forEach(element => {
        element.classList.add('hidden');
        observer.observe(element);
    });
});