import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard.jsx'
import { API_URL } from '../App.jsx'

function Home() {
  // useState #1 y #2 de esta página: la lista de películas, y si está cargando
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect #1 (de todo el proyecto): pide las películas a json-server
  // apenas el componente se monta. El array de dependencias [] vacío
  // significa "ejecutar solo una vez", no en cada render.
  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then((response) => response.json())
      .then((data) => {
        setMovies(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error al traer las películas:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="loading">Cargando catálogo...</p>
  }

  // Película destacada para el banner principal (la primera del catálogo)
  const destacada = movies[0]

  // Sacamos la lista de géneros sin repetidos para armar una fila por cada uno.
  // new Set() elimina duplicados; el spread [...] lo vuelve a convertir en array.
  const generos = [...new Set(movies.map((movie) => movie.genre))]

  return (
    <div className="home">
      {destacada && (
        <section
          className="hero"
          style={{ backgroundImage: `url(${destacada.backdrop})` }}
        >
          <div className="hero__gradient" />
          <div className="hero__content">
            <h1 className="hero__title">{destacada.title}</h1>
            <p className="hero__description">{destacada.description}</p>
            <div className="hero__actions">
              <Link to={`/pelicula/${destacada.id}`} className="btn btn--primary">
                ▶ Ver detalle
              </Link>
              <Link to="/buscar" className="btn btn--secondary">
                Explorar catálogo
              </Link>
            </div>
          </div>
        </section>
      )}

      {generos.map((genero) => (
        <section key={genero} className="movie-row">
          <h2 className="movie-row__title">{genero}</h2>
          <div className="movie-row__track">
            {movies
              .filter((movie) => movie.genre === genero)
              .map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default Home
