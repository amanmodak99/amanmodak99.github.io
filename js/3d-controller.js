/**
 * 3D Effects Controller
 * Advanced 3D animations, neural networks, and immersive effects
 */

class ThreeDEffects {
    constructor() {
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.mouseX = 0;
        this.mouseY = 0;
        
        if (!this.isReducedMotion) {
            this.init();
        }
    }

    init() {
        this.setupMouseTracking();
        this.createNeuralNetwork();
        this.createMatrixRain();
        this.setupParallax3D();
        this.create3DSkillCubes();
        this.setupHolographicText();
        this.createQuantumField();
        this.setupTesseract();
        this.createFloatingGeometry();
    }

    // Mouse tracking for 3D interactions
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = (e.clientY / window.innerHeight) * 2 - 1;
            
            this.update3DElements();
        });
    }

    update3DElements() {
        // Update parallax layers
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        parallaxLayers.forEach((layer, index) => {
            const depth = (index + 1) * 0.1;
            const moveX = this.mouseX * depth * 20;
            const moveY = this.mouseY * depth * 20;
            layer.style.transform += ` translate(${moveX}px, ${moveY}px)`;
        });

        // Update 3D cards
        const cards3D = document.querySelectorAll('.card-3d');
        cards3D.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const rotateX = (this.mouseY - (centerY / window.innerHeight)) * 10;
            const rotateY = (this.mouseX - (centerX / window.innerWidth)) * 10;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
    }

    // Neural Network Background
    createNeuralNetwork() {
        const neuralContainer = document.createElement('div');
        neuralContainer.className = 'neural-network';
        neuralContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
        `;

        const nodeCount = 20;
        const nodes = [];

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            node.style.left = Math.random() * 100 + '%';
            node.style.top = Math.random() * 100 + '%';
            node.style.animationDelay = Math.random() * 3 + 's';
            
            neuralContainer.appendChild(node);
            nodes.push({
                element: node,
                x: parseFloat(node.style.left),
                y: parseFloat(node.style.top)
            });
        }

        // Create connections
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(nodes[i].x - nodes[j].x, 2) + 
                    Math.pow(nodes[i].y - nodes[j].y, 2)
                );
                
                if (distance < 30) { // Only connect nearby nodes
                    this.createNeuralConnection(neuralContainer, nodes[i], nodes[j]);
                }
            }
        }

        document.body.appendChild(neuralContainer);
    }

    createNeuralConnection(container, node1, node2) {
        const connection = document.createElement('div');
        connection.className = 'neural-connection';
        
        const angle = Math.atan2(node2.y - node1.y, node2.x - node1.x);
        const length = Math.sqrt(
            Math.pow(node2.x - node1.x, 2) + 
            Math.pow(node2.y - node1.y, 2)
        );
        
        connection.style.cssText = `
            left: ${node1.x}%;
            top: ${node1.y}%;
            width: ${length}%;
            transform: rotate(${angle}rad);
            animation-delay: ${Math.random() * 4}s;
        `;
        
        container.appendChild(connection);
    }

    // Matrix Rain Effect
    createMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                this.createMatrixColumn(matrixContainer, characters);
            }, i * 200);
        }

        document.body.appendChild(matrixContainer);

        // Continuously create new columns
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createMatrixColumn(matrixContainer, characters);
            }
        }, 1000);
    }

    createMatrixColumn(container, characters) {
        const column = document.createElement('div');
        column.className = 'matrix-column';
        column.style.left = Math.random() * 100 + '%';
        column.style.animationDuration = (Math.random() * 10 + 5) + 's';
        
        // Fill column with random characters
        let text = '';
        for (let i = 0; i < 20; i++) {
            text += characters[Math.floor(Math.random() * characters.length)] + '<br>';
        }
        column.innerHTML = text;
        
        container.appendChild(column);

        // Remove column after animation
        setTimeout(() => {
            if (column.parentNode) {
                column.parentNode.removeChild(column);
            }
        }, 15000);
    }

    // 3D Parallax Setup
    setupParallax3D() {
        const parallaxElements = document.querySelectorAll('.hero, .about, .experience, .skills, .contact');
        
        parallaxElements.forEach((element, index) => {
            element.classList.add('parallax-3d');
            
            // Add multiple layers to each section
            for (let i = 1; i <= 4; i++) {
                const layer = document.createElement('div');
                layer.className = `parallax-layer parallax-layer-${i}`;
                layer.style.cssText = `
                    background: radial-gradient(circle at ${20 + i * 20}% ${30 + i * 15}%, 
                        rgba(59, 130, 246, ${0.02 * i}) 0%, transparent 70%);
                `;
                element.appendChild(layer);
            }
        });

        // Scroll-based parallax
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            document.querySelectorAll('.parallax-layer').forEach((layer, index) => {
                const speed = (index + 1) * 0.1;
                layer.style.transform += ` translateY(${scrolled * speed}px)`;
            });
        });
    }

    // 3D Skill Cubes
    create3DSkillCubes() {
        const skillIcons = document.querySelectorAll('.skill-icon');
        
        skillIcons.forEach((icon, index) => {
            const cube = this.createSkillCube(icon);
            icon.appendChild(cube);
            
            // Add hover interactions
            icon.addEventListener('mouseenter', () => {
                cube.style.animationPlayState = 'paused';
                cube.style.transform = 'rotateY(45deg) rotateX(45deg) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', () => {
                cube.style.animationPlayState = 'running';
                cube.style.transform = '';
            });
        });
    }

    createSkillCube(skillElement) {
        const cube = document.createElement('div');
        cube.className = 'skill-cube';
        
        const faces = ['front', 'back', 'right', 'left', 'top', 'bottom'];
        const iconClass = skillElement.querySelector('i').className;
        
        faces.forEach(face => {
            const faceElement = document.createElement('div');
            faceElement.className = `face ${face}`;
            faceElement.innerHTML = `<i class="${iconClass}"></i>`;
            cube.appendChild(faceElement);
        });
        
        // Random rotation delay
        cube.style.animationDelay = Math.random() * 20 + 's';
        
        return cube;
    }

    // Holographic Text Effects
    setupHolographicText() {
        const specialTexts = document.querySelectorAll('.gradient-text, .hero-title, .section-title');
        
        specialTexts.forEach((text, index) => {
            if (index % 2 === 0) { // Apply to every other element
                text.classList.add('holographic');
                
                // Add glitch effect on hover
                text.addEventListener('mouseenter', () => {
                    text.style.animation = 'holographicShift 0.3s ease-in-out, glitch 0.5s ease-in-out';
                });
                
                text.addEventListener('mouseleave', () => {
                    text.style.animation = 'holographicShift 4s ease-in-out infinite';
                });
            }
        });
    }

    // Quantum Field Background
    createQuantumField() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            if (index % 3 === 0) { // Add to every third section
                const quantumField = document.createElement('div');
                quantumField.className = 'quantum-field';
                quantumField.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: -1;
                    opacity: 0.1;
                `;
                
                section.style.position = 'relative';
                section.appendChild(quantumField);
            }
        });
    }

    // Tesseract (4D Cube) Animation
    setupTesseract() {
        const aboutSection = document.querySelector('.about');
        if (aboutSection) {
            const tesseract = document.createElement('div');
            tesseract.className = 'tesseract';
            tesseract.style.cssText = `
                position: absolute;
                right: 10%;
                top: 20%;
                opacity: 0.1;
                pointer-events: none;
            `;
            
            // Create inner and outer cubes
            const innerCube = document.createElement('div');
            innerCube.className = 'tesseract-inner';
            
            const outerCube = document.createElement('div');
            outerCube.className = 'tesseract-outer';
            
            tesseract.appendChild(innerCube);
            tesseract.appendChild(outerCube);
            
            aboutSection.style.position = 'relative';
            aboutSection.appendChild(tesseract);
        }
    }

    // Floating Geometric Shapes
    createFloatingGeometry() {
        const geometryContainer = document.createElement('div');
        geometryContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        // Create various geometric shapes
        const shapes = ['circle', 'square', 'triangle', 'hexagon'];
        
        for (let i = 0; i < 8; i++) {
            const shape = document.createElement('div');
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            
            shape.className = `floating-element geometric-${shapeType}`;
            shape.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: var(--gradient-primary);
                opacity: 0.1;
                border-radius: ${shapeType === 'circle' ? '50%' : '0'};
                animation-delay: ${Math.random() * 6}s;
                animation-duration: ${6 + Math.random() * 4}s;
            `;
            
            if (shapeType === 'triangle') {
                shape.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
            } else if (shapeType === 'hexagon') {
                shape.style.clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
            }
            
            geometryContainer.appendChild(shape);
        }

        document.body.appendChild(geometryContainer);
    }

    // Interactive 3D Cards
    setup3DCards() {
        const cards = document.querySelectorAll('.card, .certification-item, .timeline-content');
        
        cards.forEach(card => {
            card.classList.add('card-3d');
            card.classList.add('perspective-container');
            
            // Add tilt effect based on mouse position
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const angleX = (e.clientY - centerY) / 10;
                const angleY = (centerX - e.clientX) / 10;
                
                card.style.transform = `rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // DNA Helix for Timeline
    createDNAHelix() {
        const timeline = document.querySelector('.experience-timeline');
        if (timeline) {
            const dnaHelix = document.createElement('div');
            dnaHelix.className = 'dna-helix';
            dnaHelix.style.cssText = `
                position: absolute;
                left: 50%;
                top: 0;
                height: 100%;
                transform: translateX(-50%);
                z-index: -1;
            `;
            
            timeline.style.position = 'relative';
            timeline.appendChild(dnaHelix);
        }
    }

    // Performance Optimization
    optimizePerformance() {
        let lastScrollY = window.scrollY;
        let isScrolling = false;
        
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;
                    const scrollDelta = Math.abs(currentScrollY - lastScrollY);
                    
                    // Reduce effects during fast scrolling
                    if (scrollDelta > 50) {
                        this.reduceEffects();
                    } else {
                        this.restoreEffects();
                    }
                    
                    lastScrollY = currentScrollY;
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });
    }

    reduceEffects() {
        document.body.classList.add('reduced-effects');
    }

    restoreEffects() {
        document.body.classList.remove('reduced-effects');
    }

    // Initialize all 3D effects
    static init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                const effects = new ThreeDEffects();
                effects.setup3DCards();
                effects.createDNAHelix();
                effects.optimizePerformance();
            });
        } else {
            const effects = new ThreeDEffects();
            effects.setup3DCards();
            effects.createDNAHelix();
            effects.optimizePerformance();
        }
    }
}

// Immersive Audio Controller
class AudioController {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.setupAudio();
    }

    async setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.loadSounds();
            this.setupInteractiveSounds();
        } catch (error) {
            console.log('Audio not supported or blocked');
        }
    }

    async loadSounds() {
        // Create synthetic sounds for interactions
        this.sounds.hover = this.createTone(800, 0.1, 'sine');
        this.sounds.click = this.createTone(1200, 0.2, 'triangle');
        this.sounds.whoosh = this.createNoise(0.3);
    }

    createTone(frequency, duration, waveType = 'sine') {
        return () => {
            if (!this.audioContext) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = waveType;
            
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    createNoise(duration) {
        return () => {
            if (!this.audioContext) return;
            
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const output = buffer.getChannelData(0);
            
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const whiteNoise = this.audioContext.createBufferSource();
            whiteNoise.buffer = buffer;
            
            const gainNode = this.audioContext.createGain();
            whiteNoise.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            whiteNoise.start(this.audioContext.currentTime);
        };
    }

    setupInteractiveSounds() {
        // Add sound to interactive elements
        document.querySelectorAll('.btn, .card, .skill-icon').forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (this.sounds.hover) this.sounds.hover();
            });
            
            element.addEventListener('click', () => {
                if (this.sounds.click) this.sounds.click();
            });
        });

        // Scroll sounds
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            if (Math.abs(currentScrollY - lastScrollY) > 100) {
                if (this.sounds.whoosh) this.sounds.whoosh();
                lastScrollY = currentScrollY;
            }
        });
    }
}

// Initialize all systems
ThreeDEffects.init();

// Initialize audio with user gesture
document.addEventListener('click', () => {
    if (!window.audioController) {
        window.audioController = new AudioController();
    }
}, { once: true });

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThreeDEffects, AudioController };
}
