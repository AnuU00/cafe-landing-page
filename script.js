document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for fixed navbar
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Gallery Slider
    const track = document.querySelector('.gallery-track');
    const slides = Array.from(track.children);
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    
    // Calculate slide width including gap
    let slideWidth = slides[0].getBoundingClientRect().width + 20; 
    let currentIndex = 0;
    let autoSlideInterval;
    const totalSlides = slides.length / 2; // Since we duplicated them

    // Update slide width on resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].getBoundingClientRect().width + 20;
        updateSlidePosition(false);
    });

    const updateSlidePosition = (transition = true) => {
        if (transition) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    };

    const moveToNextSlide = () => {
        currentIndex++;
        updateSlidePosition();
        
        // Reset to start if we reach the end of the duplicate set
        if (currentIndex >= totalSlides) {
            setTimeout(() => {
                currentIndex = 0;
                updateSlidePosition(false); // No transition for instant jump
            }, 500); // Wait for transition to finish
        }
    };

    const moveToPrevSlide = () => {
        if (currentIndex <= 0) {
            currentIndex = totalSlides;
            updateSlidePosition(false); // Jump to end of duplicates instantly
            setTimeout(() => {
                currentIndex--;
                updateSlidePosition();
            }, 10);
        } else {
            currentIndex--;
            updateSlidePosition();
        }
    };

    // Auto Slide
    const startAutoSlide = () => {
        autoSlideInterval = setInterval(moveToNextSlide, 3000);
    };

    const stopAutoSlide = () => {
        clearInterval(autoSlideInterval);
    };

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        moveToNextSlide();
        startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        moveToPrevSlide();
        startAutoSlide();
    });

    // Pause on hover
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);

    // Initial Start
    startAutoSlide();
});

// Lightbox Functionality
function openLightbox(imgElement) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto'; // Enable scrolling
}

// Close lightbox on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
