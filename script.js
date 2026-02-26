document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Animation für Ladezeit-Zahl ---
    const loadTimeElement = document.getElementById('load-time');
    const targetLoadTime = 0.1; 
    let currentValue = 0.8; 
    const duration = 1500; 
    let startTime = null;

    function animateLoadTime(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1); 

        if (progress < 1) {
            currentValue = 0.8 - (0.7 * progress);
            loadTimeElement.textContent = currentValue.toFixed(1) + 's';
            requestAnimationFrame(animateLoadTime);
        } else {
            loadTimeElement.textContent = targetLoadTime.toFixed(1) + 's';
        }
    }

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
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('nav-open')) {
                    navLinks.classList.remove('nav-open');
                    hamburger.classList.remove('is-active');
                }
            });
        });
    }

    // --- 3. Zurück nach Oben Button Logik ---
    const backToTopButton = document.getElementById('back-to-top');

    const scrollHandler = () => {
        if (backToTopButton) {
            if (window.scrollY > 400) { 
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
    }, { threshold: 0.1 }); 

    hiddenElements.forEach(el => observer.observe(el));
    
    
    // --- 5. Endlos Karten-Diashow Swipe-Logik (Mobile) ---
    
    const carouselWrapper = document.querySelector('.case-studies-grid'); 
    const cards = Array.from(document.querySelectorAll('.case-study-card'));
    const dotsContainer = document.querySelector('.carousel-dots-container');
    
    // Hauptprüfung: Wenn kein Karussell oder keine Karten, beenden
    if (!carouselWrapper || cards.length === 0) return;
        
    let currentIndex = 0; 
    let dots = [];
    const swipeThreshold = 50; 
    
    let isSwiping = false;
    let currentTopCard = null; 
    let deltaX = 0;

    const isMobileView = () => window.innerWidth <= 900;
    
    // --- 5.1 Dots erstellen ---
    cards.forEach((card, i) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    // --- 5.2 RESIZE OBSERVER für die automatische Höhenanpassung ---
    // Dies ist der FIX für das Verschwinden.
    let isMeasuring = false;

    const resizeObserver = new ResizeObserver(entries => {
        if (isMeasuring) {
            const newHeight = entries[0].contentRect.height;
            carouselWrapper.style.height = `${newHeight}px`;
            
            // Position nach der Messung wiederherstellen
            cards[currentIndex].style.position = 'absolute';
            isMeasuring = false;
            
            // Entferne den Observer nach der Messung, er wird bei jedem Wechsel neu gesetzt
            resizeObserver.unobserve(cards[currentIndex]);
        }
    });
    
    // --- 5.3 Funktion zur Aktualisierung des Karten-Zustands ---
    function updateSlideshowVisuals() {
        if (!isMobileView()) {
            // Desktop-Modus: Reset aller Karussell-spezifischen Stile
            carouselWrapper.style.height = ''; 
            cards.forEach(card => {
                card.style.position = ''; // Zurück zu CSS-Grid-Flow
                card.classList.remove('top-card', 'next-card', 'swiping-out');
                card.style.transform = '';
                card.style.opacity = 1; 
                card.style.zIndex = 1;
                card.style.pointerEvents = 'auto';
            });
            return; 
        } 

        // Mobile-Modus: Karussell-Logik
        const nextIndex = (currentIndex + 1) % cards.length;
        const cardToMeasure = cards[currentIndex];

        // 1. ZUERST: Position der aktuellen Karte auf "static" setzen, um die natürliche Höhe zu messen
        isMeasuring = true;
        cardToMeasure.style.position = 'static'; 
        resizeObserver.observe(cardToMeasure); // Beginnt mit der Überwachung

        // 2. Karten-Klassen setzen und Positionen anpassen
        cards.forEach((card, i) => {
            card.classList.remove('top-card', 'next-card', 'swiping-out');
            card.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
            card.style.pointerEvents = 'none';
            
            // Stelle sicher, dass unsichtbare Karten absolut positioniert bleiben
            if (i !== currentIndex) {
                card.style.position = 'absolute'; 
            }
            card.style.visibility = 'visible';


            if (i === currentIndex) {
                // Die aktuell sichtbare Karte (Top Card)
                card.classList.add('top-card');
                card.style.transform = 'translateX(-50%) scale(1.0)';
                card.style.opacity = 1;
                card.style.zIndex = 10;
                card.style.pointerEvents = 'auto'; 
                
            } else if (i === nextIndex) { 
                // Die nächste Karte
                card.classList.add('next-card');
                card.style.transform = 'translateX(-50%) scale(0.98)'; 
                card.style.opacity = 1; 
                card.style.zIndex = 9;
                
            } else {
                // Alle anderen Karten sind unsichtbar
                card.style.opacity = 0;
                card.style.zIndex = 1; 
                card.style.transform = 'translateX(-50%) scale(1.0)';
            }
        });
        
        // Punkte aktualisieren
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
        
        currentTopCard = cards[currentIndex];
    }
    
    // --- 5.4 Swipe-Handler Funktionen ---
    
    const handleMove = (e) => {
        if (!isSwiping || !currentTopCard) return;
        
        const currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        deltaX = currentX - currentTopCard.startX;
        
        if (deltaX < 0) { // Nur nach links wischen
            const rotation = Math.max(-15, deltaX / 10);
            const scaleFactor = Math.max(0.8, 1 - Math.abs(deltaX) / 500);
            
            currentTopCard.style.transform = `translateX(-50%) translateX(${deltaX}px) rotate(${rotation}deg) scale(${scaleFactor})`;
            if (e.type.includes('touch')) e.preventDefault(); 
        }
    };

    const handleEnd = () => {
        if (!isSwiping || !currentTopCard) return;
        isSwiping = false;
        
        currentTopCard.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out'; 

        if (deltaX < -swipeThreshold) {
            // KARTE AUSSWIPEN
            currentTopCard.classList.add('swiping-out');
            
            currentIndex = (currentIndex + 1) % cards.length; 

            // Nach der Animation den Zustand aktualisieren
            setTimeout(() => {
                updateSlideshowVisuals();
            }, 550); 
            
        } else {
            // KARTE ZURÜCKSETZEN
            currentTopCard.style.transform = 'translateX(-50%) scale(1.0)';
        }
        
        // Globale Listener entfernen
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        
        deltaX = 0;
    };
    
    const handleStart = (e) => {
        if (!currentTopCard || e.target.closest('.case-study-card') !== currentTopCard || !isMobileView()) return;

        currentTopCard.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        isSwiping = true;
        currentTopCard.style.transition = 'none'; 
        
        if (e.type.includes('mouse')) {
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handleEnd);
            e.preventDefault(); 
        }
        
        currentTopCard.onselectstart = () => false; 
    };
    
    // --- 5.5 Finales Initialisierungs-Handling ---
    
    cards.forEach(card => {
        // Touch Listener
        card.addEventListener('touchstart', handleStart);
        card.addEventListener('touchmove', handleMove);
        card.addEventListener('touchend', handleEnd);
        
        // Maus Start Listener
        card.addEventListener('mousedown', handleStart);
    });

    // WICHTIG: Die Initialisierung muss warten, bis ALLE Ressourcen geladen sind (inkl. Bilder)
    window.addEventListener('load', () => {
        // Geben Sie dem Browser 100ms Zeit, das Layout zu berechnen
        setTimeout(updateSlideshowVisuals, 100); 
    });
    
    // Füge einen Resize-Listener hinzu (für Desktop <-> Mobile Wechsel oder Gerätedrehung)
    window.addEventListener('resize', () => {
         // Wird immer ausgeführt, um den Reset im Desktop-Modus und die Messung im Mobil-Modus zu gewährleisten
         updateSlideshowVisuals(); 
    });

    // FALLBACK: Falls das window.load-Event schon durch ist, direkt ausführen
    if (document.readyState === 'complete') {
        setTimeout(updateSlideshowVisuals, 100);
    }
    
});

function checkPassword() {
    const input = document.getElementById('pw-input').value;
    const overlay = document.getElementById('password-overlay');
    const error = document.getElementById('pw-error');

    // Dein Passwort: Early-Access
    if (input === 'Early-Access') {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Scrollen wieder erlauben
    } else {
        error.style.display = 'block';
        document.getElementById('pw-input').value = ""; // Feld leeren bei Fehler
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const pwInput = document.getElementById('pw-input');
    
    // 1. Fokus auf das Eingabefeld setzen (User kann direkt tippen)
    if (pwInput) {
        pwInput.focus();
        
        // 2. Prüfung bei Druck auf die Enter-Taste
        pwInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }

    // 3. E-Mail Schutz
    const user = "jonas.it.solutions"; 
    const domain = "gmail.com"; 
    const mailElement = document.getElementById('mail-link');
    
    if(mailElement) {
        mailElement.innerHTML = `<a href="mailto:${user}@${domain}" class="primary-cta">Jetzt Projekt anfragen</a>`;
    }
    
    // 4. Scrollen verhindern, solange das Overlay aktiv ist
    document.body.style.overflow = 'hidden';
});