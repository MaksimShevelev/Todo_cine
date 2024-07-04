if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
} else {
    alert("Ошибка при загрузке Service Worker");
}

document.addEventListener('DOMContentLoaded', () => {
    const botonBuscar = document.getElementById('botonBuscar');
    const tituloPelicula = document.getElementById('tituloPelicula');
    const resultados = document.getElementById('resultados');

    botonBuscar.addEventListener('click', buscarPeliculas);

    async function buscarPeliculas() {
        const titulo = tituloPelicula.value.trim();
        if (titulo === '') return;

        try {
            const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(titulo)}&apikey=1bcc8ed6`);
            const data = await response.json();

            if (data.Response === 'True') {
                mostrarResultados(data.Search);
            } else {
                resultados.innerHTML = `<p>No se encontraron resultados para "${titulo}".</p>`;
            }
        } catch (error) {
            console.error('Error:', error);
            resultados.innerHTML = `<p>Ocurrió un error al buscar las películas.</p>`;
        }
    }

    async function mostrarResultados(peliculas) {
        resultados.innerHTML = '';

        for (const pelicula of peliculas) {
            try {
                const movieDetailUrl = `https://www.omdbapi.com/?i=${pelicula.imdbID}&apikey=1bcc8ed6`;
                const response = await fetch(movieDetailUrl);
                const movieData = await response.json();

                const peliculaHTML = `
                    <div class="pelicula 'movie-card', 'col-lg-4', 'col-md-6', 'col-sm-12', 'mb-3'">
                        <h2>${movieData.Title}</h2>
                        <h6><strong>Año:</strong> ${movieData.Year}</h6>
                        <h6 class="card-text"><strong>Director:</strong> ${movieData.Director}</h6>
                        <img src="${movieData.Poster !== "N/A" ? movieData.Poster : 'images/placeholder.jpg'}" alt="Póster de ${movieData.Title}">
                        <button onclick="agregarAFavoritos('${movieData.imdbID}', '${movieData.Title}', '${movieData.Year}', '${movieData.Poster}')" class="btn mt-3">Agregar a favoritos</button>
                    </div>
                `;
                resultados.innerHTML += peliculaHTML;

                // Guardar en el historial
                const historial = JSON.parse(sessionStorage.getItem('historialPeliculas')) || [];
                if (!historial.find(item => item.imdbID === movieData.imdbID)) {
                    historial.push(movieData);
                }
                sessionStorage.setItem('historialPeliculas', JSON.stringify(historial));
            } catch (error) {
                console.error('Error al obtener detalles de la película:', error);
                resultados.innerHTML = `<p>Ocurrió un error al obtener detalles de la película.</p>`;
            }
        }
    }
});

// Agregar a favoritos
function agregarAFavoritos(imdbID, title, year, poster) {
    const favoritos = JSON.parse(localStorage.getItem('favoritosPeliculas')) || [];
    if (!favoritos.find(item => item.imdbID === imdbID)) {
        favoritos.push({ imdbID, Title: title, Year: year, Poster: poster });
        localStorage.setItem('favoritosPeliculas', JSON.stringify(favoritos));
        mostrarMensaje('Película agregada a favoritos exitosamente');
    }
};

// Mostrar mensaje
function mostrarMensaje(mensaje) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add('mostrar');
    setTimeout(() => {
        mensajeDiv.classList.remove('mostrar');
    }, 3000);
};

//eliminar de favoritos
function eliminarDeFavoritos(imdbID) {
    let favoritos = JSON.parse(localStorage.getItem('favoritosPeliculas')) || [];
    favoritos = favoritos.filter(item => item.imdbID !== imdbID);
    localStorage.setItem('favoritosPeliculas', JSON.stringify(favoritos));
}


