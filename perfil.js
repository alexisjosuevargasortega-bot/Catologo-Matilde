document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if(window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
            
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const hoverTargets = document.querySelectorAll('.hover-target, a');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                const text = target.getAttribute('data-cursor-text');
                if(text) {
                    cursorOutline.classList.add('hover-text');
                    cursorOutline.setAttribute('data-text', text);
                } else {
                    cursorOutline.classList.add('hover');
                }
            });
            target.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('hover', 'hover-text');
                cursorOutline.removeAttribute('data-text');
            });
        });
    }

    // 2. Utilidad SplitText para animación
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(el => {
        const text = el.innerText;
        el.innerHTML = '';
        text.split(' ').forEach(word => {
            if(word.trim() === '') return;
            const wordDiv = document.createElement('div');
            wordDiv.className = 'word';
            const wordInner = document.createElement('div');
            wordInner.className = 'word-inner';
            wordInner.style.transform = 'translateY(110%)'; // Inicial oculto abajo
            wordInner.innerText = word + '\u00A0';
            wordDiv.appendChild(wordInner);
            el.appendChild(wordDiv);
        });
    });

    // 3. Animaciones con GSAP
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();

    // Animación Inicial (Preloader -> Reveal Image)
    tl.to('.preloader-text', {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        duration: 1, ease: 'power4.inOut'
    })
    .to('.preloader', {
        yPercent: -100,
        duration: 0.8, ease: 'power4.inOut',
        delay: 0.2
    })
    .to('.image-reveal-wrapper', {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        duration: 1.5, ease: 'power4.inOut'
    }, "-=0.2")
    .fromTo('.marquee-container.top', { xPercent: -10, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, "-=1")
    .fromTo('.marquee-container.bottom', { xPercent: 10, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, "-=1.5");

    // Parallax Imagen
    gsap.to('#profile-image', {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero-profile",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Revelado About Title (SplitText)
    gsap.to('.word-inner', {
        y: '0%',
        duration: 1,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
            trigger: ".about-section",
            start: "top 75%"
        }
    });

    // Revelado Info Textos
    gsap.to('.gs-reveal-up', {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: ".about-grid",
            start: "top 80%"
        }
    });
});
