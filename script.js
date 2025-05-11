document.addEventListener('DOMContentLoaded', () => {
    // Add animation to photos when they come into view
    const photos = document.querySelectorAll('.photo-container');
    
    // Staggered fade-in for photo cards
    photos.forEach((photo, idx) => {
        photo.style.setProperty('--fade-delay', `${0.2 + idx * 0.18}s`);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, {
        threshold: 0.1
    });

    photos.forEach(photo => {
        photo.style.opacity = '0';
        photo.style.transform = 'scale(0.8)';
        photo.style.transition = 'all 0.5s ease-out';
        observer.observe(photo);
    });

    // Add click effect to photos
    photos.forEach(photo => {
        photo.addEventListener('click', () => {
            photo.style.transform = 'scale(1.1)';
            setTimeout(() => {
                photo.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add floating animation to hearts
    const heartMessage = document.querySelector('.heart-message');
    const hearts = heartMessage.innerHTML.split('❤️');
    heartMessage.innerHTML = '';
    
    hearts.forEach((text, index) => {
        const span = document.createElement('span');
        span.textContent = text;
        if (index < hearts.length - 1) {
            const heart = document.createElement('span');
            heart.textContent = '❤️';
            heart.style.animation = `float ${2 + index * 0.5}s infinite ease-in-out`;
            heartMessage.appendChild(heart);
        }
        heartMessage.appendChild(span);
    });

    // Parallax effect for SVG backgrounds
    const geoBg = document.querySelector('.geo-bg');
    const lineBg = document.querySelector('.line-bg');
    const artBg = document.querySelector('.art-bg');
    function parallax(e) {
        const x = (e.clientX || window.innerWidth/2) / window.innerWidth - 0.5;
        const y = (e.clientY || window.innerHeight/2) / window.innerHeight - 0.5;
        if (geoBg) geoBg.style.transform = `translate(${x*30}px, ${y*30}px)`;
        if (lineBg) lineBg.style.transform = `translate(${x*20}px, ${y*20}px)`;
        if (artBg) artBg.style.transform = `translate(${x*10}px, ${y*10}px)`;
    }
    window.addEventListener('mousemove', parallax);
    window.addEventListener('touchmove', e => {
        if (e.touches && e.touches[0]) parallax(e.touches[0]);
    });
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (geoBg) geoBg.style.transform += ` translateY(${scrollY * 0.05}px)`;
        if (lineBg) lineBg.style.transform += ` translateY(${scrollY * 0.03}px)`;
        if (artBg) artBg.style.transform += ` translateY(${scrollY * 0.01}px)`;
    });

    // Mouse/touch trail effect
    const trailColors = ['#ff4b6e', '#00bfff', '#ffb347', '#7f7fd5', '#00ffb0', '#ff5e62'];
    function spawnTrail(x, y) {
        const dot = document.createElement('div');
        dot.className = 'mouse-trail-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        dot.style.background = trailColors[Math.floor(Math.random()*trailColors.length)];
        document.body.appendChild(dot);
        setTimeout(() => dot.remove(), 600);
    }
    window.addEventListener('mousemove', e => spawnTrail(e.clientX, e.clientY));
    window.addEventListener('touchmove', e => {
        if (e.touches && e.touches[0]) spawnTrail(e.touches[0].clientX, e.touches[0].clientY);
    });

    // Confetti effect
    function createConfetti() {
        for (let i = 0; i < 32; i++) {
            const conf = document.createElement('div');
            conf.className = 'confetti';
            conf.style.left = Math.random()*100 + 'vw';
            conf.style.animationDelay = (Math.random()*5) + 's';
            conf.style.background = trailColors[Math.floor(Math.random()*trailColors.length)];
            document.body.appendChild(conf);
        }
    }
    createConfetti();

    // Sparkle overlay
    function createSparkles() {
        for (let i = 0; i < 24; i++) {
            const sp = document.createElement('div');
            sp.className = 'sparkle';
            sp.style.left = Math.random()*100 + 'vw';
            sp.style.top = Math.random()*100 + 'vh';
            sp.style.animationDelay = (Math.random()*6) + 's';
            document.body.appendChild(sp);
        }
    }
    createSparkles();

    // 3D tilt/pop effect for photo cards
    document.querySelectorAll('.photo-container').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width/2, cy = rect.height/2;
            const dx = (x-cx)/cx, dy = (y-cy)/cy;
            card.style.transform = `rotateY(${dx*8}deg) rotateX(${-dy*8}deg) scale(1.04)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        card.addEventListener('mousedown', () => {
            card.style.transform += ' scale(1.08)';
        });
        card.addEventListener('mouseup', () => {
            card.style.transform = card.style.transform.replace(' scale(1.08)','');
        });
    });

    // Glowing, pulsing effect for the title
    const title = document.querySelector('.header .title');
    if (title) title.classList.add('glow-title');

    // Lightbox/modal for gallery images
    let lightboxIndex = 0;
    const galleryImgs = Array.from(document.querySelectorAll('.gallery .photo'));
    if (!document.getElementById('lightboxOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'lightboxOverlay';
        overlay.innerHTML = `
            <button id="lightboxClose">✕</button>
            <button id="lightboxPrev">◀</button>
            <img id="lightboxImg" src="" alt="Gallery Photo" />
            <button id="lightboxNext">▶</button>
        `;
        document.body.appendChild(overlay);
    }
    const overlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    function showLightbox(idx) {
        lightboxIndex = idx;
        lightboxImg.src = galleryImgs[idx].src;
        overlay.classList.add('active');
    }
    function hideLightbox() { overlay.classList.remove('active'); }
    function prevLightbox() { showLightbox((lightboxIndex-1+galleryImgs.length)%galleryImgs.length); }
    function nextLightbox() { showLightbox((lightboxIndex+1)%galleryImgs.length); }
    galleryImgs.forEach((img, idx) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            showLightbox(idx);
            playPop();
        });
    });
    document.getElementById('lightboxClose').onclick = hideLightbox;
    document.getElementById('lightboxPrev').onclick = prevLightbox;
    document.getElementById('lightboxNext').onclick = nextLightbox;
    overlay.onclick = e => { if (e.target === overlay) hideLightbox(); };
    document.addEventListener('keydown', e => {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowLeft') prevLightbox();
        if (e.key === 'ArrowRight') nextLightbox();
    });

    // Button ripple effect
    const sendLoveBtn = document.getElementById('sendLoveBtn');
    if (sendLoveBtn) {
        sendLoveBtn.addEventListener('click', e => {
            sendLoveBtn.classList.add('ripple');
            setTimeout(() => sendLoveBtn.classList.remove('ripple'), 400);
        });
    }

    // Sound effect on photo click
    let popAudio;
    function playPop() {
        if (!popAudio) {
            popAudio = document.createElement('audio');
            popAudio.src = 'https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5b2.mp3';
            popAudio.volume = 0.2;
            document.body.appendChild(popAudio);
        }
        popAudio.currentTime = 0;
        popAudio.play();
    }

    // Scroll indicator hide on scroll
    const scrollInd = document.querySelector('.scroll-indicator');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        if (!scrollInd) return;
        if (window.scrollY > 40) scrollInd.style.opacity = '0';
        else scrollInd.style.opacity = '0.7';
        lastScroll = window.scrollY;
    });

    // Animate each letter of the title on load
    if (title) {
        const text = title.textContent;
        title.innerHTML = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.textContent = ch;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(-30px)';
            title.appendChild(span);
            setTimeout(() => {
                span.style.transition = 'all 0.5s cubic-bezier(.5,1.5,.5,1)';
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 100 + i*60);
        });
    }
}); 