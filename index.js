class Pokemon {
  constructor(nombre, image) {
    this.nombre = nombre;
    this.image = image;
  }
};

const newPokemon = new Pokemon();

const inputPokemonSearch = document.getElementById('input-pokemon-search');
const searchPokemonButton = document.getElementById('search-pokemon-button');
const searchResult = document.getElementById('search-result');
const saveFavoriteButton = document.getElementById('save-favorite-button');
const favoritesContainer = document.getElementById('favoritos');
const clearFavoritesButton = document.getElementById('clear-favorites-button');

const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

searchPokemonButton.addEventListener('click', async () => {
    const pokemonName = inputPokemonSearch.value.toLowerCase();
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
        if (!response.ok) {
            throw new Error('Pokémon not found');
        }
        const pokemonData = await response.json();
        newPokemon.nombre = pokemonData.name;
        newPokemon.image = pokemonData.sprites.front_default;
        displayPokemon(pokemonData);
    } catch (error) {
        searchResult.textContent = error.message;
    }
});

displayPokemon = (pokemonData) => {
    searchResult.innerHTML = `
        <h2>${pokemonData.name}</h2>
        <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    `;
}

saveFavoriteButton.addEventListener('click', () => {
    
    if (!newPokemon.nombre || !newPokemon.image) {
        alert('No hay un Pokémon válido para guardar');
        return;
    }
    
    const currentFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

    for (let i = 0; i < currentFavorites.length; i++) {
        if (currentFavorites[i].name === newPokemon.nombre) {
            alert('Este Pokémon ya está en tus favoritos');
            return;
        }
    }
    currentFavorites.push({ name: newPokemon.nombre, image: newPokemon.image });
    localStorage.setItem('favorites', JSON.stringify(currentFavorites));
    updateFavoritesList();
});

updateFavoritesList = () => {
    const currentFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favoritesContainer.innerHTML = '';
    currentFavorites.forEach(pokemon => {
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('favorite-pokemon');
        pokemonElement.innerHTML = `
            <h3>${pokemon.name}</h3>
            <img src="${pokemon.image}" alt="${pokemon.name}">
        `;
        favoritesContainer.appendChild(pokemonElement);
    });
}

clearFavoritesButton.addEventListener('click', () => {
    localStorage.removeItem('favorites');
    updateFavoritesList();
})

updateFavoritesList();

