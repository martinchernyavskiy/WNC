document.addEventListener('DOMContentLoaded', () => {
    const fadeInElements = document.querySelectorAll('.fade-in');
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

    // Function to handle scroll behavior for the header
    const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop) {
            header.style.top = "-100px"; // Hide header when scrolling down
            if (window.innerWidth <= 1024) {
                menuToggle.style.display = "none"; // Hide toggle menu
            }
        } else {
            if (scrollTop > heroHeight) {
                header.classList.add('header-shadow');
            } else {
                header.classList.remove('header-shadow');
            }
            header.style.top = "0"; // Show header when scrolling up
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    // Function to toggle the navigation menu
    const toggleNavMenu = () => {
        navLinks.classList.toggle('active');
        navLinks.classList.toggle('inactive');
        menuToggle.classList.toggle('open');
        if (window.innerWidth <= 1024) {
            mainCTA.style.display = navLinks.classList.contains('active') ? 'none' : 'flex';
            dropdownCTA.parentElement.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
        }
    };

    // Event listeners
    fadeInElements.forEach(element => {
        element.classList.add('visible');
    });

    logoSpans.forEach(span => {
        span.classList.add('initial-animation');
        span.addEventListener('animationend', (event) => {
            if (event.animationName === 'initialFadeIn') {
                span.style.opacity = '1';
                span.style.backgroundPosition = '0% 0%';
            }
        });
    });

    setTimeout(() => {
        logo.classList.add('hover-active');
    }, 1000);

    logo.addEventListener('mouseenter', () => {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1.1)';
                span.style.padding = '0 3px';
                span.style.backgroundPosition = '0% 0%';
            });
        }
    });

    logo.addEventListener('mouseleave', () => {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1)';
                span.style.padding = '0';
                span.style.backgroundPosition = '200% 0';
            });
        }
    });

    menuToggle.addEventListener('click', toggleNavMenu);

    window.addEventListener('resize', () => {
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

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.add('inactive');
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });

    if (joinUsButton) {
        joinUsButton.addEventListener('click', () => {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            navLinks.classList.remove('active');
            navLinks.classList.add('inactive');
            menuToggle.classList.remove('open');
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            menuToggle.style.display = "none";
        } else {
            menuToggle.style.display = "flex";
        }
    });

    // Initial display settings based on screen size
    if (window.innerWidth > 1024) {
        menuToggle.style.display = "none";
    } else {
        menuToggle.style.display = "flex";
    }
});
