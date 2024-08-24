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
            showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'Subscribed!', 1.5);
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
                showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'Subscribed!', 1.5);
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
        showNotification('https://lottie.host/c8066a95-41fe-4a3b-9598-1d685b7027d0/KulXoGiGz3.json', 'Subscribed!', 1.5);
        subscribeButton.classList.add('jiggle-gradient-red');
        emailInput.value = '';
    });
}
