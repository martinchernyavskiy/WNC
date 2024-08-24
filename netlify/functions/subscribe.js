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
        let animationTriggered = false;

        // Check if the user is already subscribed
        if (data.result && data.result.code === 'duplicate_parameter') {
            showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5);
            subscribeButton.classList.add('jiggle-gradient-red');
            emailInput.value = '';
            animationTriggered = true;
        } else if (data.result && (data.result.id || data.result.email)) {
            // If subscription is successful
            subscribeButton.classList.add('jiggle-gradient');
            emailInput.value = '';
            showNotification('https://lottie.host/67e8b582-122f-4250-9287-8ff7a3986b21/MpzkTLFcPd.json', 'Thank you for subscribing!');
            animationTriggered = true;
        }

        // Default error handling if no animation was triggered
        setTimeout(() => {
            if (!animationTriggered) {
                showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5);
                subscribeButton.classList.add('jiggle-gradient-red');
                emailInput.value = '';
            }
        }, 3000);

        // Reset the button state after the animation ends
        setTimeout(() => {
            subscribeButton.classList.remove('jiggle-gradient');
            subscribeButton.classList.remove('jiggle-gradient-red');
        }, 600);
    })
    .catch(error => {
        console.error('Error:', error);

        // Handle error scenario
        showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'You are already subscribed!', 1.5);
        subscribeButton.classList.add('jiggle-gradient-red');
        emailInput.value = '';
    });
}

// Function to display notifications with animation
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

    // Slide down the notification
    setTimeout(() => {
        notification.classList.add('visible');
    }, 100);

    // Hide the notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('visible');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}
