const apiKey = '712a3e7d81705fd8471f8fc50dfe6f15'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];


async function fetchPopularMovies() {
    try {
     const respuesta = await fetch (
        `${apiUrl}/movie/popular?api_key=${apiKey}&language=es-ES`
     ) ;
      const data = await respuesta.json();
      displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas
    movies.forEach((movie ) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        li.onclick = () => showMovieDetails(movie.id); // Muestra detalles al hacer clic en la película
        movieList.appendChild(li);
    });
}

// Show movie details
async function showMovieDetails(movieId) {
    try {
        // tu codigo aqui: realiza una solicitud para obtener los detalles de la película
        // y actualiza el contenedor de detalles con la información de la película
        const respuesta = await fetch (
        `${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=es-ES`
        ); 
        const movie = await respuesta.json();
        selectedMovieId = movie.id;
        detailsContainer.innerHTML=`
   <h3>  ${movie.title}</h3>
   <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <p>   ${movie.overview}    </p>   
    <p>  ${movie.release_date}      </p>  
    <p>  ${movie.vote_average}      </p>  
   `;
 movieDetails.classList.remove("hidden");
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            // tu codigo aqui: realiza una solicitud para buscar películas
            // y llama a displayMovies con los resultados de la búsqueda
            const respuesta= await fetch(
                `${apiUrl}/search/movie?api_key=${apiKey}&language=es-ES&query=${encodeURIComponent(
                    query
                  )}
                `
            );
            const data = await respuesta.json();
            displayMovies(data.results);
            
        
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
