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
            wordInner.innerText = word + '\u00A0';
            wordDiv.appendChild(wordInner);
            el.appendChild(wordDiv);
        });
    });

    // 3. GSAP Animations
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();

    // Preloader and Hero Entry
    tl.to('.preloader-text', {
        clipPath: 'polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)',
        duration: 1, ease: 'power4.inOut'
    })
    .to('.preloader', {
        yPercent: -100,
        duration: 0.8, ease: 'power4.inOut',
        delay: 0.2
    })
    .to('.line-inner', {
        y: '0%',
        duration: 1.2,
        stagger: 0.1,
        ease: 'power4.out'
    }, "-=0.2")
    .fromTo('.hero-subtext', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, "-=0.8");

    // Scroll Animations for Sections
    const sections = gsap.utils.toArray('.section-dark');
    sections.forEach(section => {
        const titleWords = section.querySelectorAll('.word-inner');
        if(titleWords.length > 0) {
            gsap.to(titleWords, {
                scrollTrigger: { trigger: section, start: "top 75%" },
                y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out'
            });
        }

        const reveals = section.querySelectorAll('.gs-reveal-up');
        if(reveals.length > 0) {
            gsap.to(reveals, {
                scrollTrigger: { trigger: section, start: "top 80%" },
                y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out'
            });
        }
    });

    // 4. Smooth scrolling nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. THREE.JS 3D Abstract Blob Animation (Light Mode)
    initThreeJS();
});

function initThreeJS() {
    const canvas = document.getElementById('webgl-canvas');
    if(!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Luces adaptadas a Light Mode
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Luz fuerte
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x2563EB, 1.5); // Luz de acento Azul
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 2); // Luz blanca de rebote
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xDB2777, 1); // Ligero acento rosado/purpura
    pointLight3.position.set(0, -5, -5);
    scene.add(pointLight3);

    // Geometría
    const geometry = new THREE.IcosahedronGeometry(2, 30); // Alta densidad para que la deformación sea muy suave
    
    const positionAttribute = geometry.attributes.position;
    const vertexData = [];
    for (let i = 0; i < positionAttribute.count; i++) {
        vertexData.push({
            x: positionAttribute.getX(i),
            y: positionAttribute.getY(i),
            z: positionAttribute.getZ(i)
        });
    }

    // Material Cerámico/Cristal Brillante para Modo Claro
    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.1,
        metalness: 0.1,
        transparent: true,
        opacity: 0.95
    });

    // Wireframe sutil azul
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2563EB,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });

    const sphere = new THREE.Mesh(geometry, material);
    const wireframeSphere = new THREE.Mesh(geometry, wireframeMaterial);
    
    const group = new THREE.Group();
    group.add(sphere);
    group.add(wireframeSphere);
    scene.add(group);

    // Position
    group.position.x = window.innerWidth > 768 ? 2 : 0;
    camera.position.z = 5;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.001;
        mouseY = (event.clientY - windowHalfY) * 0.001;
    });

    // Simple noise para distorsionar la geometría de forma fluida
    function noise(x, y, z, time) {
        return Math.sin(x * 2.5 + time) * Math.cos(y * 2.5 + time) * Math.sin(z * 2.5 + time);
    }

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        const time = clock.getElapsedTime() * 0.3;

        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;
        group.rotation.y += 0.05 * (targetX - group.rotation.y);
        group.rotation.x += 0.05 * (targetY - group.rotation.x);
        
        group.rotation.y += 0.001;
        group.rotation.z -= 0.0005;

        // Deform vertices suave
        for (let i = 0; i < positionAttribute.count; i++) {
            const v = vertexData[i];
            const noiseVal = noise(v.x, v.y, v.z, time) * 0.5;
            
            const length = Math.sqrt(v.x*v.x + v.y*v.y + v.z*v.z);
            const nx = v.x / length;
            const ny = v.y / length;
            const nz = v.z / length;

            positionAttribute.setXYZ(
                i,
                v.x + nx * noiseVal,
                v.y + ny * noiseVal,
                v.z + nz * noiseVal
            );
        }
        
        positionAttribute.needsUpdate = true;
        geometry.computeVertexNormals();

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        group.position.x = width > 768 ? 2 : 0;
    });
}
