const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.SENDINBLUE_API_KEY; // Use environment variable for API key
    const { email } = JSON.parse(event.body);

    const response = await fetch('https://api.sendinblue.com/v3/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
        },
        body: JSON.stringify({
            email: email,
            listIds: [3],
            updateEnabled: true,
        }),
    });

    const result = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Subscription successful', result }),
    };
};
