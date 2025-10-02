async function fetchData(){

    try{

        const pokemonName = document.getElementById("pokemonName").value.toLowerCase();
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

        if(!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        const pokemonSprite = data.sprites.other['official-artwork'].front_default;
        const imgElement = document.getElementById("pokemonSprite");
        const cardElement = document.getElementById("pokemonCard");
        const specsElement = document.getElementById("specsCard");

        imgElement.src = pokemonSprite;
        document.getElementById("pokemonName").textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
        document.getElementById("pokemonHeight").textContent = (data.height / 10) + " m";
        document.getElementById("pokemonWeight").textContent = (data.weight / 10) + " kg";
        document.getElementById("pokemonType").textContent = data.types.map(type => type.type.name).join(", ");
        
        cardElement.style.display = "block";
        specsElement.style.display = "block";
    }
    catch(error){
        console.error(error);
    }
}