const pokemonList = ['pikachu', 'charizard', 'blastoise', 'venusaur', 'alakazam', 'machamp', 'gengar', 'dragonite', 'mewtwo', 'mew', 'typhlosion', 'feraligatr', 'meganium', 'lugia', 'ho-oh', 'celebi', 'blaziken', 'swampert', 'sceptile', 'rayquaza', 'kyogre', 'groudon', 'garchomp', 'lucario', 'dialga', 'palkia', 'giratina', 'arceus'];

function validateAndSanitizeInput(input) {
    // Remove special characters and extra spaces
    const sanitized = input.toLowerCase().trim().replace(/[^a-z0-9\-]/g, '');
    // Check if input is valid (letters, numbers, hyphens only)
    if (sanitized.length === 0 || sanitized.length > 20) {
        return null;
    }
    return sanitized;
}

function preloadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function fetchData(){
    try{
        const rawInput = document.getElementById("pokemonName").value;
        const pokemonName = validateAndSanitizeInput(rawInput);
        const loadingSpinner = document.getElementById("loadingSpinner");
        const cardElement = document.getElementById("pokemonCard");
        const specsElement = document.getElementById("specsCard");
        const errorElement = document.getElementById("errorMessage");
        
        if(!pokemonName) {
            errorElement.querySelector('p').textContent = "Please enter a valid Pokemon name (letters and numbers only)";
            errorElement.style.display = "block";
            return;
        }
        
        // Clear previous results and show loading
        cardElement.style.display = "none";
        specsElement.style.display = "none";
        errorElement.style.display = "none";
        cardElement.classList.remove("show");
        specsElement.classList.remove("show");
        loadingSpinner.style.display = "block";
        hideSuggestions();
        
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if(!response.ok){
            throw new Error("Pokemon not found");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.other['official-artwork'].front_default;
        
        // Preload image before showing
        await preloadImage(pokemonSprite);
        
        const imgElement = document.getElementById("pokemonSprite");
        imgElement.src = pokemonSprite;
        document.querySelector(".specs-card h3").textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        document.getElementById("pokemonId").textContent = data.id;
        document.getElementById("pokemonHeight").textContent = (data.height / 10) + " m";
        document.getElementById("pokemonWeight").textContent = (data.weight / 10) + " kg";
        document.getElementById("pokemonType").textContent = data.types.map(type => type.type.name).join(", ");
        document.getElementById("pokemonAbilities").textContent = data.abilities.map(ability => ability.ability.name).join(", ");
        
        // Hide welcome message after first search
        document.getElementById("welcomeMessage").style.display = "none";
        
        // Hide loading and show results with animation
        loadingSpinner.style.display = "none";
        cardElement.style.display = "block";
        specsElement.style.display = "block";
        
        setTimeout(() => {
            cardElement.classList.add("show");
            specsElement.classList.add("show");
        }, 50);
    }
    catch(error){
        loadingSpinner.style.display = "none";
        const errorElement = document.getElementById("errorMessage");
        errorElement.querySelector('p').textContent = "Pokemon not found! Please check the spelling and try again.";
        errorElement.style.display = "block";
        document.getElementById("welcomeMessage").style.display = "none";
        console.error(error);
    }
}

function showSuggestions(suggestions) {
    const suggestionsDiv = document.getElementById("suggestions");
    suggestionsDiv.innerHTML = "";
    
    if (suggestions.length > 0) {
        suggestions.forEach(pokemon => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.textContent = pokemon;
            div.onclick = () => {
                document.getElementById("pokemonName").value = pokemon;
                hideSuggestions();
                fetchData();
            };
            suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = "block";
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    document.getElementById("suggestions").style.display = "none";
}

// Add Enter key support and search suggestions
const input = document.getElementById("pokemonName");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        fetchData();
    }
});

input.addEventListener("input", function() {
    const sanitized = validateAndSanitizeInput(this.value);
    if (sanitized && sanitized.length > 0) {
        const suggestions = pokemonList.filter(pokemon => 
            pokemon.startsWith(sanitized)
        ).slice(0, 5);
        showSuggestions(suggestions);
    } else {
        hideSuggestions();
    }
});

function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 1010) + 1;
    document.getElementById("pokemonName").value = randomId.toString();
    fetchData();
}

// Hide suggestions when clicking outside
document.addEventListener("click", function(event) {
    if (!event.target.closest(".search-container")) {
        hideSuggestions();
    }
});