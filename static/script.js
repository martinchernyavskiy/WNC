document.addEventListener('DOMContentLoaded', function () {
    const fadeInElements = document.querySelectorAll('.fade-in');

    // Trigger fade-in animation for elements
    fadeInElements.forEach(element => {
        element.classList.remove('visible');
        element.offsetHeight;
        element.classList.add('visible');
    });

    const logo = document.querySelector('.logo');
    const logoSpans = logo.querySelectorAll('h1 span');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdownCTA = document.querySelector('.dropdown-cta .cta');
    const mainCTA = document.querySelector('.cta.main-cta');
    const header = document.querySelector('header');
    const heroSection = document.querySelector('#hero');
    const heroHeight = heroSection ? heroSection.offsetHeight : 0;
    let lastScrollTop = 0;

    // Initial animation for logo spans
    logoSpans.forEach(span => {
        span.classList.add('initial-animation');

        span.addEventListener('animationend', function (event) {
            if (event.animationName === 'initialFadeIn') {
                span.style.opacity = '1';
                span.style.backgroundPosition = '0% 0%';
            }
        });
    });

    // Activate hover effects on logo after initial animation
    setTimeout(() => {
        logo.classList.add('hover-active');
    }, 1000);

    // Logo hover effect
    logo.addEventListener('mouseenter', function () {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1.1)';
                span.style.padding = '0 3px';
                span.style.backgroundPosition = '0% 0%';
            });
        }
    });

    // Remove hover effects when mouse leaves logo
    logo.addEventListener('mouseleave', function () {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1)';
                span.style.padding = '0';
                span.style.backgroundPosition = '200% 0';
            });
        }
    });

    // Toggle navigation menu on small screens
    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        navLinks.classList.toggle('inactive');
        menuToggle.classList.toggle('open');

        if (window.innerWidth <= 1024) {
            mainCTA.style.display = 'none';
            dropdownCTA.parentElement.style.display = 'block';
        } else {
            mainCTA.style.display = 'flex';
            dropdownCTA.parentElement.style.display = 'none';
        }
    });

    // Adjust menu visibility on window resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            mainCTA.style.display = 'flex';
            dropdownCTA.parentElement.style.display = 'none';
            menuToggle.style.display = "none";
        } else {
            mainCTA.style.display = 'none';
            dropdownCTA.parentElement.style.display = 'block';
            menuToggle.style.display = "flex";
        }
    });

    // Set initial menu visibility based on screen size
    if (window.innerWidth > 1024) {
        dropdownCTA.parentElement.style.display = 'none';
        menuToggle.style.display = "none";
    } else {
        mainCTA.style.display = 'none';
        dropdownCTA.parentElement.style.display = 'block';
        menuToggle.style.display = "flex";
    }

    // Close toggle menu when a link is clicked
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(item => {
        item.addEventListener('click', function () {
            navLinks.classList.add('inactive');
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });

    // Scroll to contact section when "Join Us" is clicked in the toggle menu
    const joinUsButton = document.querySelector('.dropdown-cta .cta');
    if (joinUsButton) {
        joinUsButton.addEventListener('click', function () {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            navLinks.classList.remove('active');
            navLinks.classList.add('inactive');
            menuToggle.classList.remove('open');
        });
    }

    // Handle subscribe button click event
    const subscribeButton = document.querySelector('.subscription-form button[type="submit"]');
    const emailInput = document.querySelector('.subscription-form input[type="email"]');

    subscribeButton.addEventListener('click', function (e) {
        e.preventDefault();
        subscribeButton.classList.remove('jiggle-gradient');
        subscribeButton.classList.remove('jiggle-gradient-red');

        if (emailInput.checkValidity()) {
            sendEmailToSendinblue(emailInput.value.trim());
        } else {
            emailInput.reportValidity();
        }
    });

    // Show notification with animation
    function showNotification(animationSrc, message, speed = 1) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <dotlottie-player src="${animationSrc}" background="transparent" speed="${speed}" style="width: 150px; height: 150px;" loop autoplay></dotlottie-player>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(notification);
        notification.style.padding = '0 20px';

        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // Send email to Sendinblue and handle response
    function sendEmailToSendinblue(email) {
        fetch('/.netlify/functions/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            let animationTriggered = false;

            if (data.result && data.result.code === 'duplicate_parameter') {
                showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5);
                subscribeButton.classList.add('jiggle-gradient-red');
                emailInput.value = '';
                animationTriggered = true;
            } else if (data.result && (data.result.id || data.result.email)) {
                subscribeButton.classList.add('jiggle-gradient');
                emailInput.value = '';
                showNotification('https://lottie.host/67e8b582-122f-4250-9287-8ff7a3986b21/MpzkTLFcPd.json', 'Thank you for subscribing!');
                animationTriggered = true;
            }

            setTimeout(() => {
                if (!animationTriggered) {
                    showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5);
                    subscribeButton.classList.add('jiggle-gradient-red');
                    emailInput.value = '';
                }
            }, 3000);

            setTimeout(() => {
                subscribeButton.classList.remove('jiggle-gradient');
                subscribeButton.classList.remove('jiggle-gradient-red');
            }, 600);
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5);
            subscribeButton.classList.add('jiggle-gradient-red');
            emailInput.value = '';
        });
    }

    // Handle sticky header visibility on scroll
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            header.style.top = "-100px";
            if (window.innerWidth <= 1024) {
                menuToggle.style.display = "none";
            }
        } else {
            if (scrollTop > heroHeight) {
                header.classList.add('header-shadow');
                if (window.innerWidth <= 1024) {
                    menuToggle.style.display = "flex";
                }
            } else {
                header.classList.remove('header-shadow');
                if (window.innerWidth <= 1024) {
                    menuToggle.style.display = "flex";
                } else {
                    menuToggle.style.display = "none";
                }
            }
            header.style.top = "0";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }

    // Initialize scroll behavior
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Adjust toggle menu on resize
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            menuToggle.style.display ="none";
        } else {
            menuToggle.style.display = "flex";
        }
    });

    // Initial check on page load for the toggle menu visibility
    if (window.innerWidth > 1024) {
        menuToggle.style.display = "none"; // Hide toggle on wide screens
    } else {
        menuToggle.style.display = "flex"; // Show toggle on smaller screens
    }
});
