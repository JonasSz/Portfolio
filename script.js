document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Animation für Ladezeit-Zahl ---
    const loadTimeElement = document.getElementById('load-time');
    const targetLoadTime = 0.1; // Zielwert
    let currentValue = 0.8; // Startwert (simuliert)
    const duration = 1500; // Dauer der Animation in ms
    let startTime = null;

    function animateLoadTime(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); // Fortschritt von 0 bis 1

        if (progress < 1) {
            // Rechnet den Wert von 0.8 zu 0.1
            currentValue = 0.8 - (0.7 * progress);
            loadTimeElement.textContent = currentValue.toFixed(1) + 's';
            requestAnimationFrame(animateLoadTime);
        } else {
            loadTimeElement.textContent = targetLoadTime.toFixed(1) + 's';
        }
    }

    // Startet die Animation, wenn die Performance-Proof Sektion sichtbar wird
    const performanceProof = document.querySelector('.performance-proof');
    const proofObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(animateLoadTime);
                proofObserver.unobserve(performanceProof);
            }
        });
    }, { threshold: 0.5 }); 
    
    if (performanceProof) {
        proofObserver.observe(performanceProof);
    }


    // --- 2. Hamburger Menü Logik ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            hamburger.classList.toggle('is-active');
            // document.body.classList.toggle('no-scroll'); // Optional: Verhindert Scrollen im Body
        });

        // Schließt das Menü beim Klicken auf einen Link (für sanftes Scrollen)
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-open')) {
                    navLinks.classList.remove('nav-open');
                    hamburger.classList.remove('is-active');
                    // document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // --- 3. Zurück nach Oben Button Logik ---
    const backToTopButton = document.getElementById('back-to-top');

    const scrollHandler = () => {
        if (backToTopButton) {
            if (window.scrollY > 400) { // Zeigt Button nach 400px Scroll an
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        }
    };

    window.addEventListener('scroll', scrollHandler);

    
    // --- 4. Intersection Observer für Scroll-Animation ---
    const hiddenElements = document.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Trigger bei 10% Sichtbarkeit

    hiddenElements.forEach(el => observer.observe(el));
});