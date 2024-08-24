const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        const { email } = JSON.parse(event.body);

        if (!email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email is required" }),
            };
        }

        const response = await fetch("https://api.sendinblue.com/v3/contacts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": process.env.SENDINBLUE_API_KEY,
            },
            body: JSON.stringify({
                email: email,
                updateEnabled: true,
                attributes: {
                    FIRSTNAME: "Subscriber",
                },
                listIds: [2], // Replace with your actual list ID
            }),
        });

        const data = await response.json();

        if (response.ok) {
            return {
                statusCode: 200,
                body: JSON.stringify({ result: data }),
            };
        } else if (data.code === 'duplicate_parameter') {
            return {
                statusCode: 200,
                body: JSON.stringify({ result: { code: 'duplicate_parameter' }, message: "You're already subscribed!" }),
            };
        } else {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: data.message || "An error occurred" }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error", error: error.message }),
        };
    }
};
