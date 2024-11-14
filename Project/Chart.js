//No. 3
function displayIntensityGraph(data) {
    const ctx = document.getElementById('intensity-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.categories,
            datasets: [{
                label: 'Aroma Intensity',
                data: data.intensityValues,
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        }
    });
}




// No 4 
async function getDishSuggestions(ingredient) {
    const response = await fetch(https://api.foodoscope.com/dish-suggestions?ingredient=${ingredient}, {
        headers: { Authorization: Bearer YOUR_API_KEY }
    });
    const suggestions = await response.json();
    return suggestions;
}




// no.5
function drawAromaWheel(data) {
    const canvas = document.getElementById('aroma-wheel');
    const ctx = canvas.getContext('2d');
    // Drawing code for aroma wheel segments...
}




// no. 6
async function getSensoryRecommendations(ingredient) {
    const response = await fetch(https://api.foodoscope.com/sensory-recommendations?ingredient=${ingredient}, {
        headers: { Authorization: Bearer YOUR_API_KEY }
    });
    const data = await response.json();
    return data;
}




// no. 7
async function getMoodBasedSuggestions() {
    const mood = document.getElementById('mood-selector').value;
    const response = await fetch(https://api.foodoscope.com/mood-pairing?mood=${mood}, {
        headers: { Authorization: Bearer YOUR_API_KEY }
    });
    const data = await response.json();
    // Display suggestions...
}





// no.8 
async function getSubstitute(ingredient) {
    const response = await fetch(https://api.foodoscope.com/substitute?ingredient=${ingredient}, {
        headers: { Authorization: Bearer YOUR_API_KEY }
    });
    const substitutes = await response.json();
    return substitutes;
}