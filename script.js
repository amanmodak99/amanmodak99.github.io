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

    // Background music autoplay from 21 seconds
    const audio = document.getElementById('bg-music');
    if (audio) {
        audio.currentTime = 21;
        const playMusic = () => {
            audio.currentTime = 21;
            audio.play().catch(() => {
                // If autoplay is blocked, show a play button
                let btn = document.getElementById('music-play-btn');
                if (!btn) {
                    btn = document.createElement('button');
                    btn.id = 'music-play-btn';
                    btn.textContent = 'Play Music';
                    btn.style.position = 'fixed';
                    btn.style.bottom = '24px';
                    btn.style.right = '24px';
                    btn.style.zIndex = '1000';
                    btn.style.padding = '12px 20px';
                    btn.style.background = '#ff4b6e';
                    btn.style.color = '#fff';
                    btn.style.border = 'none';
                    btn.style.borderRadius = '24px';
                    btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
                    btn.style.fontSize = '1rem';
                    btn.style.cursor = 'pointer';
                    btn.onclick = () => {
                        audio.currentTime = 21;
                        audio.play();
                        btn.remove();
                    };
                    document.body.appendChild(btn);
                }
            });
        };
        playMusic();
    }
}); 