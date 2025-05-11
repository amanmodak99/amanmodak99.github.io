document.addEventListener('DOMContentLoaded', () => {
    // Add animation to photos when they come into view
    const photos = document.querySelectorAll('.photo-container');
    
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
}); 