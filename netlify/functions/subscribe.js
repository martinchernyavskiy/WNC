function sendEmailToSendinblue(email) {
    fetch('/.netlify/functions/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        let animationTriggered = false;

        if (data.result && data.result.code === 'duplicate_parameter') {
            // Show error animation and red gradient on button
            showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'Subscribed!', 1.5); // Speed up the error animation
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
                showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'Subscribed!', 1.5); // Speed up the error animation
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
        showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'Subscribed!', 1.5); // Speed up the error animation
        subscribeButton.classList.add('jiggle-gradient-red');
        emailInput.value = ''; // Clear the email input field
    });
}
