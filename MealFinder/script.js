document.getElementById("searchButton").addEventListener("click", function() {
    let searchQuery = document.getElementById("searchInput").value;

    var raw = JSON.stringify({
        "recipeTitle": searchQuery,
        "ingredientUsed": "",
        "ingredientNotUsed": "",
        "cookingProcess": "",
        "utensil": "",
        "energyMin": 0,
        "energyMax": 0,
        "carbohydratesMin": 0,
        "carbohydratesMax": 0,
        "fatMin": 0,
        "fatMax": 0,
        "proteinMin": 0,
        "proteinMax": 0
    });

    var requestOptions = {
        method: 'POST',
        body: raw,
        headers: {
            "Content-Type": "application/json"
        },
        redirect: 'follow'
    };

    fetch("https://cosylab.iiitd.edu.in/recipe-search/recipesAdvanced?page=1&pageSize=10", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.success === "true") {
                displayRecipes(result.payload.data);
            } else {
                document.getElementById("recipeList").innerHTML = "<p>No recipes found.</p>";
            }
        })
        .catch(error => {
            console.log('error', error);
            document.getElementById("recipeList").innerHTML = "<p>Failed to fetch recipes. Try again later.</p>";
        });
});

function displayRecipes(recipes) {
    let recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = ""; // Clear previous results

    recipes.forEach(recipe => {
        let recipeCard = document.createElement("div");
        recipeCard.classList.add("recipe-card");

        let recipeImage = document.createElement("img");
        recipeImage.src = recipe.img_url || "https://via.placeholder.com/200";
        recipeCard.appendChild(recipeImage);

        let recipeTitle = document.createElement("h3");
        recipeTitle.textContent = recipe.Recipe_title;
        recipeCard.appendChild(recipeTitle);

        let recipeDetails = document.createElement("p");
        recipeDetails.textContent = ('Region: ${recipe.Region} | Calories: ${recipe.Calories}');
        recipeCard.appendChild(recipeDetails);

        let recipeLink = document.createElement("a");
        recipeLink.href = "#"; // Prevent default navigation
        recipeLink.textContent = "View Recipe";
        recipeLink.addEventListener("click", function(event) {
            event.preventDefault();
            viewRecipeDetails(recipe.url); // Function to load recipe details
        });
        recipeCard.appendChild(recipeLink);

        recipeList.appendChild(recipeCard);
    });
}

function viewRecipeDetails(recipeUrl) {
    // This function will load the recipe details into a modal or section

    // Fetch the full recipe details from the URL (assuming the URL points to a detailed page)
    console.log("Fetching recipe details from URL:", recipeUrl);
    fetch(recipeUrl)
        .then(response => response.json()) // Assuming the recipe URL returns JSON
        .then(recipe => {
            displayRecipeModal(recipe);
        })
        .catch(error => {
            console.error("Error fetching recipe details:", error);
            alert("Failed to load recipe details.");
        });
}

function displayRecipeModal(recipe) {
    let modal = document.getElementById("recipeModal");
    let modalContent = document.getElementById("recipeModalContent");

    modalContent.innerHTML = `
        <h2>${recipe.Recipe_title}</h2>
        <p><strong>Region:</strong> ${recipe.Region}</p>
        <p><strong>Calories:</strong> ${recipe.Calories}</p>
        <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        <button onclick="closeModal()">Close</button>
    `;

    modal.style.display = "block"; // Show the modal
}

function closeModal() {
    let modal = document.getElementById("recipeModal");
    modal.style.display = "none"; // Close the modal
}
const proxyUrl = "https://cors-anywhere.herokuapp.com/";
fetch(proxyUrl + recipeUrl)
    .then(response => response.json())
    .then(recipe => {
        displayRecipeModal(recipe);
    })
    .catch(error => {
        console.error("Error fetching recipe details:", error);
        alert("Failed to load recipe details.");
    });