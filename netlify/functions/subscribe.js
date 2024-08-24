exports.handler = async function (event, context) {
    try {
        const { email } = JSON.parse(event.body);

        // Log start time
        const startTime = Date.now();

        // Sendinblue API call
        const response = await fetch('https://api.sendinblue.com/v3/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': process.env.SENDINBLUE_API_KEY,
            },
            body: JSON.stringify({
                email: email,
                listIds: [3], // Replace with your actual list ID
                updateEnabled: true,
            }),
        });

        // Log end time and calculate API response duration
        const endTime = Date.now();
        const apiDuration = endTime - startTime;
        console.log(`Sendinblue API response time: ${apiDuration} ms`);

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
