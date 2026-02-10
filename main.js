/**
 * Zoorld - Premium Wildlife Experience
 * Professional JavaScript File
 */

$(document).ready(function() {
    // Initialize all functions
    initNavbar();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    initSmoothScroll();
    initGalleryHover();
    initAccordion();
});

/**
 * Navigation Bar
 * Handles scroll effects and mobile toggle
 */
function initNavbar() {
    const navbar = $('#mainNav');
    
    // Scroll effect
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 50) {
            navbar.addClass('scrolled');
        } else {
            navbar.removeClass('scrolled');
        }
    });
    
    // Active link highlighting
    const currentPath = window.location.pathname.split('/').pop() || 'Home.html';
    $('.navbar-nav .nav-link').each(function() {
        const href = $(this).attr('href');
        if (href === currentPath || (currentPath === '' && href === 'Home.html')) {
            $(this).addClass('active');
        }
    });
    
    // Close mobile menu on link click
    $('.navbar-nav .nav-link').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });
}

/**
 * Scroll Animations
 * Elements fade in as they enter viewport
 */
function initScrollAnimations() {
    // Add fade-in class to elements that should animate
    const animatedElements = $('.feature-card, .gallery-item, .info-card, .stat-item');
    animatedElements.addClass('fade-in-section');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                $(entry.target).addClass('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    $('.fade-in-section').each(function() {
        observer.observe(this);
    });
    
    // Stagger animation for feature cards
    $('.features-section .feature-card').each(function(index) {
        $(this).css('transition-delay', (index * 0.1) + 's');
    });
    
    // Stagger animation for gallery items
    $('.gallery-section .gallery-item').each(function(index) {
        $(this).css('transition-delay', (index * 0.1) + 's');
    });
}

/**
 * Counter Animation
 * Animated number counters for statistics
 */
function initCounterAnimation() {
    const counters = $('.counter');
    let hasAnimated = false;
    
    function animateCounters() {
        counters.each(function() {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            let current = 0;
            
            const timer = setInterval(function() {
                current += step;
                if (current >= target) {
                    $this.text(target + '+');
                    clearInterval(timer);
                } else {
                    $this.text(Math.floor(current));
                }
            }, 16);
        });
    }
    
    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = $('.about-stats');
    if (statsSection.length) {
        statsObserver.observe(statsSection[0]);
    }
}

/**
 * Contact Form
 * Form validation and submission handling
 */
function initContactForm() {
    const form = $('#contactForm');
    const submitBtn = $('#submitBtn');
    const successMessage = $('#successMessage');
    const resetFormBtn = $('#resetFormBtn');
    
    // Form validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: /^.{10,500}$/
    };
    
    // Validation messages
    const messages = {
        name: 'Name should be 2-50 letters only',
        email: 'Please enter a valid email address',
        message: 'Message should be at least 10 characters'
    };
    
    // Real-time validation
    $('#name, #email, #message').on('blur', function() {
        validateField($(this));
    });
    
    $('#name, #email, #message').on('input', function() {
        if ($(this).hasClass('is-invalid')) {
            validateField($(this));
        }
    });
    
    // Validate individual field
    function validateField($field) {
        const fieldId = $field.attr('id');
        const value = $field.val().trim();
        const errorEl = $('#' + fieldId + 'Error');
        
        if (value === '' && $field.attr('required')) {
            $field.removeClass('is-invalid');
            errorEl.hide();
            return false;
        }
        
        if (patterns[fieldId] && !patterns[fieldId].test(value)) {
            $field.addClass('is-invalid');
            errorEl.text(messages[fieldId]).show();
            return false;
        } else {
            $field.removeClass('is-invalid');
            errorEl.hide();
            return true;
        }
    }
    
    // Form submission
    form.on('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        $('#name, #email, #message').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Shake animation for invalid form
            form.addClass('shake');
            setTimeout(function() {
                form.removeClass('shake');
            }, 500);
            return;
        }
        
        // Show loading state
        submitBtn.prop('disabled', true);
        submitBtn.find('.btn-text').addClass('d-none');
        submitBtn.find('.btn-loader').removeClass('d-none');
        
        // Simulate form submission
        setTimeout(function() {
            // Hide form, show success message
            form.fadeOut(300, function() {
                successMessage.addClass('show');
                successMessage.hide().fadeIn(300);
            });
            
            // Reset button
            submitBtn.prop('disabled', false);
            submitBtn.find('.btn-text').removeClass('d-none');
            submitBtn.find('.btn-loader').addClass('d-none');
        }, 1500);
    });
    
    // Reset form button
    resetFormBtn.on('click', function() {
        successMessage.removeClass('show');
        successMessage.hide();
        form[0].reset();
        form.fadeIn(300);
    });
}

/**
 * Smooth Scroll
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
        const targetId = $(this).attr('href');
        
        if (targetId === '#') return;
        
        const $target = $(targetId);
        
        if ($target.length) {
            e.preventDefault();
            const navHeight = $('#mainNav').outerHeight();
            const targetPosition = $target.offset().top - navHeight;
            
            $('html, body').animate({
                scrollTop: targetPosition
            }, 800, 'easeInOutQuad');
        }
    });
}

/**
 * Gallery Hover Effects
 * Enhanced hover interactions for gallery items
 */
function initGalleryHover() {
    $('.gallery-item').on('mouseenter', function() {
        $(this).find('.gallery-image').css('transform', 'scale(1.1)');
    });
    
    $('.gallery-item').on('mouseleave', function() {
        $(this).find('.gallery-image').css('transform', 'scale(1)');
    });
}

/**
 * Accordion Enhancements
 * Smooth accordion animations
 */
function initAccordion() {
    // Add animation to accordion collapse
    $('.accordion-collapse').on('show.bs.collapse', function() {
        $(this).prev().find('.accordion-button').addClass('active');
    });
    
    $('.accordion-collapse').on('hide.bs.collapse', function() {
        $(this).prev().find('.accordion-button').removeClass('active');
    });
}

/**
 * Parallax Effect (Subtle)
 * Adds depth to hero section
 */
$(window).on('scroll', function() {
    const scrolled = $(window).scrollTop();
    const hero = $('.hero-section');
    
    if (hero.length) {
        hero.css('background-position', 'center ' + (scrolled * 0.3) + 'px');
    }
});

/**
 * Page Loader
 * Smooth page loading experience
 */
$(window).on('load', function() {
    const loader = $('.page-loader');
    
    if (loader.length) {
        loader.addClass('hidden');
        
        setTimeout(function() {
            loader.remove();
        }, 500);
    }
    
    // Trigger initial animations
    $('body').addClass('loaded');
});

/**
 * Utility Functions
 */

// Easing function for smooth animations
$.easing.easeInOutQuad = function(x, t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
};

// Add CSS for shake animation
$('<style>')
    .prop('type', 'text/css')
    .html(`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
            animation: shake 0.5s ease-in-out;
        }
    `)
    .appendTo('head');

/**
 * Console Welcome Message
 */
console.log('%c🦁 Welcome to Zoorld! 🦁', 'font-size: 24px; color: #8b7355; font-weight: bold;');
console.log('%cPremium Wildlife Experience', 'font-size: 14px; color: #3d7a5f;');
console.log('%cBuilt with ❤️ for wildlife conservation', 'font-size: 12px; color: #5d4037;');

/* ==========================================================================
   END OF Zoorld JavaScript File
   ========================================================================== */
