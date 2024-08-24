exports.handler = async function (event, context) {
    try {
        const { email } = JSON.parse(event.body);

        // Assuming you are using Sendinblue, replace with your own API call
        const response = await fetch('https://api.sendinblue.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.SENDINBLUE_API_KEY, // Make sure the API key is set in your Netlify environment variables
            },
            body: JSON.stringify({
                email: email,
                listIds: [3], // Replace with your actual list ID
                updateEnabled: true,
            }),
        });

        let data;

        try {
            data = await response.json();
        } catch (error) {
            console.error('Error parsing JSON:', error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to parse response from the API' }),
            };
        }

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ result: data }),
            };
        } else {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: data }),
            };
        }
    } catch (error) {
        console.error('Error processing subscription:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to process subscription' }),
        };
    }
};
