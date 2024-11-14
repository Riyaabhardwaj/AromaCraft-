// Replace 'YOUR_API_KEY' and 'API_ENDPOINT' with the actual foodoscope API details.
const API_ENDPOINT = 'https://api.foodoscope.com/data';
const API_KEY = 'YOUR_API_KEY';

// Fetch data from Foodoscope API
async function fetchFoodoscopeData() {
    const outputDiv = document.getElementById('data-output');
    outputDiv.innerHTML = 'Loading...';

    try {
        const response = await fetch(API_ENDPOINT, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Bearer ${API_KEY}
            }
        });

        if (!response.ok) {
            throw new Error(Error: ${response.statusText});
        }

        const data = await response.json();
        displayData(data);
    } catch (error) {
        outputDiv.innerHTML = <p style="color:red;">${error.message}</p>;
    }
}

// Display data on the page
function displayData(data) {
    const outputDiv = document.getElementById('data-output');
    outputDiv.innerHTML = '<pre>' + JSON.stringify(data, null, 4) + '</pre>';
}


async function analyzeAroma() {
    const ingredient = document.getElementById('ingredient-input').value;
    const outputDiv = document.getElementById('aroma-output');

    if (!ingredient) {
        outputDiv.innerHTML = "Please enter an ingredient.";
        return;
    }

    try {
        const response = await fetch(https://api.foodoscope.com/aroma-profile?ingredient=${ingredient}, {
            method: 'GET',
            headers: {
                'Authorization': Bearer YOUR_API_KEY
            }
        });
        const data = await response.json();

        if (data) {
            outputDiv.innerHTML = `
                <h3>${ingredient.toUpperCase()}</h3>
                <p><strong>Primary Aromas:</strong> ${data.primaryAromas.join(', ')}</p>
                <p><strong>Sub-Aromas:</strong> ${data.subAromas.join(', ')}</p>
            `;
        }
    } catch (error) {
        outputDiv.innerHTML = <p>Error: ${error.message}</p>;
    }
}

//Back-End
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.get('/aroma-profile', async (req, res) => {
    const { ingredient } = req.query;
    try {
        const response = await axios.get(https://api.foodoscope.com/aroma-profile, {
            params: { ingredient },
            headers: { Authorization: Bearer YOUR_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(Server running on http://localhost:${PORT});
});


//Culinary
async function getFlavorComplexity(ingredients) {
    const response = await fetch(https://api.foodoscope.com/flavor-complexity, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer YOUR_API_KEY
        },
        body: JSON.stringify({ ingredients })
    });
    const data = await response.json();
    return data.complexity;
}