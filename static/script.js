document.addEventListener('DOMContentLoaded', function () {
    const fadeInElements = document.querySelectorAll('.fade-in');

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

    logoSpans.forEach(span => {
        span.classList.add('initial-animation');

        span.addEventListener('animationend', function (event) {
            if (event.animationName === 'initialFadeIn') {
                span.style.opacity = '1';
                span.style.backgroundPosition = '0% 0%';
            }
        });
    });

    setTimeout(() => {
        logo.classList.add('hover-active');
    }, 1000);

    logo.addEventListener('mouseenter', function () {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1.1)';
                span.style.padding = '0 3px';
                span.style.backgroundPosition = '0% 0%';
            });
        }
    });

    logo.addEventListener('mouseleave', function () {
        if (logo.classList.contains('hover-active')) {
            logoSpans.forEach(span => {
                span.style.transform = 'scale(1)';
                span.style.padding = '0';
                span.style.backgroundPosition = '200% 0';
            });
        }
    });

    menuToggle.addEventListener('click', function () {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            navLinks.classList.add('inactive');
        } else {
            navLinks.classList.remove('inactive');
            navLinks.classList.add('active');
        }

        // Animate the toggle icon into an "X" shape
        menuToggle.classList.toggle('open');

        if (window.innerWidth <= 1024) {
            mainCTA.style.display = 'none';
            dropdownCTA.parentElement.style.display = 'block';
        } else {
            mainCTA.style.display = 'flex';
            dropdownCTA.parentElement.style.display = 'none';
        }
    });

    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            mainCTA.style.display = 'flex';
            dropdownCTA.parentElement.style.display = 'none';
            menuToggle.style.display = "none"; // Hide toggle on wide screens
        } else {
            mainCTA.style.display = 'none';
            dropdownCTA.parentElement.style.display = 'block';
            menuToggle.style.display = "flex"; // Show toggle on smaller screens
        }
    });

    if (window.innerWidth > 1024) {
        dropdownCTA.parentElement.style.display = 'none';
        menuToggle.style.display = "none"; // Hide toggle on wide screens
    } else {
        mainCTA.style.display = 'none';
        dropdownCTA.parentElement.style.display = 'block';
        menuToggle.style.display = "flex"; // Show toggle on smaller screens
    }

    // Close toggle menu on link click with fade effect
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(item => {
        item.addEventListener('click', function () {
            navLinks.classList.add('inactive');
            navLinks.classList.remove('active');

            // Revert the toggle menu icon to 3 lines
            menuToggle.classList.remove('open');
        });
    });

    // Make "Join Us" button in toggle menu direct to contact section
    const joinUsButton = document.querySelector('.dropdown-cta .cta');
    
    if (joinUsButton) {
        joinUsButton.addEventListener('click', function () {
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
            // Close the toggle menu
            navLinks.classList.remove('active');
            navLinks.classList.add('inactive');

            // Revert the toggle menu icon to 3 lines
            menuToggle.classList.remove('open');
        });
    }

    // New code for jiggling and gradient effect and clearing the email input
    const subscribeButton = document.querySelector('.subscription-form button[type="submit"]');
    const emailInput = document.querySelector('.subscription-form input[type="email"]');

    if (subscribeButton) {
        subscribeButton.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent form submission for demo purposes

            // Clear any existing error classes
            subscribeButton.classList.remove('jiggle-gradient');
            subscribeButton.classList.remove('jiggle-gradient-red');

            // Rely on the browser's built-in email validation
            if (emailInput.checkValidity()) {
                sendEmailToSendinblue(emailInput.value.trim());
            } else {
                emailInput.reportValidity(); // Show browser's default validation message
            }
        });
    }

    // Function to show the notification
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

        // Add padding to the notification for extra white space
        notification.style.padding = '0 20px';

        // Show the notification with slide down effect
        setTimeout(() => {
            notification.classList.add('visible');
        }, 100);

        // Remove the notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('visible');
            setTimeout(() => {
                notification.remove();
            }, 500); // Match the transition duration in CSS
        }, 3000);
    }

    // Function to send the email to Sendinblue
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
            console.log(data); // Log the full response to inspect

            let animationTriggered = false;

            if (data.result && data.result.code === 'duplicate_parameter') {
                // Show error animation and red gradient on button
                showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5); // Speed up the error animation
                subscribeButton.classList.add('jiggle-gradient-red');
                emailInput.value = ''; // Clear the email input field
                animationTriggered = true;
            } else if (data.result && (data.result.id || data.result.email)) {
                // Show success animation and blue gradient on button
                subscribeButton.classList.add('jiggle-gradient');
                emailInput.value = ''; // Clear the email input field
                showNotification('https://lottie.host/67e8b582-122f-4250-9287-8ff7a3986b21/MpzkTLFcPd.json', 'Thank you for subscribing!');
                animationTriggered = true;
            }

            // If no animation was triggered, display the default error after 2 seconds
            setTimeout(() => {
                if (!animationTriggered) {
                    showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5); // Speed up the error animation
                    subscribeButton.classList.add('jiggle-gradient-red');
                    emailInput.value = ''; // Clear the email input field
                }
            }, 3000);

            // Remove the class after the animation ends to reset the state
            setTimeout(() => {
                subscribeButton.classList.remove('jiggle-gradient');
                subscribeButton.classList.remove('jiggle-gradient-red');
            }, 600); // Adjust the time to match the animation duration
        })
        .catch(error => {
            console.error('Error:', error);

            // Show error notification and red gradient
            showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5); // Speed up the error animation
            subscribeButton.classList.add('jiggle-gradient-red');
            emailInput.value = ''; // Clear the email input field
        });
    }

    // Handle the scroll behavior for the header (sticky and shadow navigation)
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Scrolling down, hide the navigation
            header.style.top = "-100px"; // Hide header by moving it off-screen
            if (window.innerWidth <= 1024) {
                menuToggle.style.display = "none"; // Hide toggle menu
            }
        } else {
            // Scrolling up, show the navigation with shadow if past hero section
            if (scrollTop > heroHeight) {
                header.classList.add('header-shadow');
                if (window.innerWidth <= 1024) {
                    menuToggle.style.display = "flex"; // Show toggle menu only on smaller screens
                }
            } else {
                header.classList.remove('header-shadow');
                if (window.innerWidth <= 1024) {
                    menuToggle.style.display = "flex"; // Ensure toggle menu is visible in header/hero sections
                } else {
                    menuToggle.style.display = "none"; // Hide toggle menu on wide screens
                }
            }
            header.style.top = "0"; // Show header by moving it back to the top
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    }

    // Add event listener for scrolling
    window.addEventListener('scroll', handleScroll);

    // Ensure the navigation is correctly set when the page is loaded
    handleScroll();

    // Add logic for showing/hiding toggle menu based on screen size
    window.addEventListener('resize', function () {
        if (window.innerWidth > 1024) {
            menuToggle.style.display = "none"; // Hide toggle on wide screens
        } else {
            menuToggle.style.display = "flex"; // Show toggle on smaller screens
        }
    });

    // Initial check on page load
    if (window.innerWidth > 1024) {
        menuToggle.style.display = "none"; // Hide toggle on wide screens
    } else {
        menuToggle.style.display = "flex"; // Show toggle on smaller screens
    }

    // Function to load events from the .txt file
    function loadEventsFromTxt(startIndex = 0, loadAmount = 4) {
        fetch('/static/events.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.text();
            })
            .then(text => {
                const events = text.split('\n').filter(line => line.trim() !== '');
                const eventsContainer = document.querySelector('.events-container');
                const endIndex = Math.min(startIndex + loadAmount, events.length);

                for (let i = startIndex; i < endIndex; i++) {
                    // Split by pipe (|) instead of comma
                    const eventDetails = events[i].split("|");

                    const title = eventDetails[0]?.trim() || 'No Title';
                    const date = eventDetails[1]?.trim() || 'Date not available';
                    const address = eventDetails[2]?.trim() || 'Address not available';
                    const shortDesc = eventDetails[3]?.trim() || '';
                    const fullText = eventDetails[4]?.trim() || '';

                    const eventCard = document.createElement('div');
                    eventCard.classList.add('event-card');

                    const eventDate = new Date(date);
                    const currentDate = new Date();

                    if (eventDate < currentDate) {
                        eventCard.classList.add('past-event');
                    }

                    eventCard.innerHTML = `
                        <h3>${title}</h3>
                        <p><strong>Date:</strong> ${date}</p>
                        <p><strong>Address:</strong> ${address}</p>
                        <p>${shortDesc}</p>
                        ${fullText ? `<p>${fullText}</p>` : ''}
                    `;

                    eventsContainer.appendChild(eventCard);
                }

                if (endIndex >= events.length) {
                    document.getElementById('load-more').style.display = 'none';
                }
            })
            .catch(error => console.error('Error loading events:', error));
    }

    // Load initial events
    let loadedEvents = 0;
    loadEventsFromTxt(loadedEvents, 4);
    loadedEvents += 4;

    // Load more events on button click
    document.getElementById('load-more').addEventListener('click', function () {
        loadEventsFromTxt(loadedEvents, 4);
        loadedEvents += 4;
    });

    // Conveyor belt logic for independent elements
    const conveyor = document.querySelector('.conveyor');
    const images = Array.from(conveyor.children);

    images.forEach((img, index) => {
        // Initial positioning of images
        img.style.transform = `translateX(${index * 100}px)`;
    });

    function moveImages() {
        images.forEach((img, index) => {
            const currentX = parseFloat(img.style.transform.match(/-?\d+\.?\d*/)[0]);

            // Move image to the left
            img.style.transform = `translateX(${currentX - 100}px)`;

            // If the image is completely out of view on the left, move it to the right
            if (currentX <= -100) {
                const maxX = Math.max(...images.map(i => parseFloat(i.style.transform.match(/-?\d+\.?\d*/)[0])));
                img.style.transform = `translateX(${maxX + 100}px)`;
            }
        });

        requestAnimationFrame(moveImages);
    }

    moveImages();
});
