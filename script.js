// 1. Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// 2. Custom Cursor Script
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Slightly lagged outline movement for smooth feel
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 400, fill: "forwards" });
});

// Custom Cursor Hover expansion
const hoverElements = document.querySelectorAll('a, button, input, .glass-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// 3. Interactive 3D Sphere Canvas (Vanilla JS Canvas Math)
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Particle Sphere Setup
const numParticles = 300;
const particles = [];
const radius = 130;
let rotationX = 0;
let rotationY = 0;
let targetRotationX = 0;
let targetRotationY = 0;

// Populate 3D points on sphere
for (let i = 0; i < numParticles; i++) {
    const phi = Math.acos(-1 + (2 * i) / numParticles);
    const theta = Math.sqrt(numParticles * Math.PI) * phi;

    particles.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        baseSize: Math.random() * 2 + 1
    });
}

// Mouse interaction for rotation
let isDragging = false;
let previousMouseX = 0;
let previousMouseY = 0;

window.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    targetRotationY = (e.clientX - centerX) * 0.0005;
    targetRotationX = (e.clientY - centerY) * 0.0005;
});

// Render Loop
function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    rotationX += (targetRotationX - rotationX) * 0.05;
    rotationY += (targetRotationY - rotationY) * 0.05;

    // Automatic subtle continuous spin
    const autoSpin = 0.003;

    particles.forEach((p, index) => {
        // Rotate Y
        let x1 = p.x * Math.cos(rotationY + autoSpin) - p.z * Math.sin(rotationY + autoSpin);
        let z1 = p.z * Math.cos(rotationY + autoSpin) + p.x * Math.sin(rotationY + autoSpin);

        // Rotate X
        let y1 = p.y * Math.cos(rotationX) - z1 * Math.sin(rotationX);
        let z2 = z1 * Math.cos(rotationX) + p.y * Math.sin(rotationX);

        // Perspective Projection
        const perspective = 300;
        const scale = perspective / (perspective + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y1 * scale;

        // Color based on depth (z-index simulated)
        const alpha = Math.max(0.1, (z2 + radius) / (2 * radius));
        
        // Draw connecting lines to close neighbors
        for (let j = index + 1; j < particles.length; j += 15) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y, p.z - p2.z);
            if (dist < 50) {
                ctx.beginPath();
                ctx.moveTo(projX, projY);
                ctx.lineTo(centerX + p2.x * scale, centerY + p2.y * scale);
                ctx.strokeStyle = `rgba(91, 80, 246, ${alpha * 0.15})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }

        // Draw Particle Dot
        ctx.beginPath();
        ctx.arc(projX, projY, p.baseSize * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(91, 80, 246, ${alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#5B50F6';
        ctx.fill();
    });

    requestAnimationFrame(animateCanvas);
}

window.onload = function() {
    animateCanvas();
};

// 4. Scroll Reveal Intersection Observer
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');

            // Trigger stats counter if element is counter
            if (entry.target.querySelector('.counter')) {
                startCounters(entry.target);
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 5. Animated Number Counters
let countersTriggered = false;
function startCounters(container) {
    const counters = container.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000;
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.innerText = target;
                clearInterval(timer);
            } else {
                counter.innerText = Math.ceil(current);
            }
        }, stepTime);
    });
}

// 6. Contact Form Submission Mock
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.classList.remove('hidden');
    contactForm.reset();
    setTimeout(() => {
        formStatus.classList.add('hidden');
    }, 5000);
});