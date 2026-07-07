import { useState, useEffect } from 'react'
import MovieCard from '../components/MovieCard.jsx'
import { API_URL } from '../App.jsx'

function Buscar() {
  const [allMovies, setAllMovies] = useState([]) // catálogo completo, sin filtrar
  const [query, setQuery] = useState('')          // texto que el usuario escribe
  const [filtered, setFiltered] = useState([])    // lo que se muestra en pantalla
  const [loading, setLoading] = useState(true)

  // useEffect A: trae TODAS las películas una sola vez, al entrar a la página.
  useEffect(() => {
    fetch(`${API_URL}/movies`)
      .then((response) => response.json())
      .then((data) => {
        setAllMovies(data)
        setFiltered(data)
        setLoading(false)
      })
  }, [])

  // useEffect B: se ejecuta cada vez que "query" cambia (es decir, cada vez
  // que el usuario tipea algo). No vuelve a pedirle nada al servidor: filtra
  // en el navegador sobre los datos que ya tenemos en "allMovies".
  // Esto demuestra useEffect reaccionando a un cambio de estado, no solo al montaje.
  useEffect(() => {
    const texto = query.trim().toLowerCase()

    if (texto === '') {
      setFiltered(allMovies)
      return
    }

    setFiltered(
      allMovies.filter(
        (movie) =>
          movie.title.toLowerCase().includes(texto) ||
          movie.genre.toLowerCase().includes(texto)
      )
    )
  }, [query, allMovies])

  return (
    <div className="buscar">
      <h1 className="buscar__title">Buscar</h1>

      {/* Evento onChange: se dispara cada vez que cambia el valor del input */}
      <input
        type="text"
        placeholder="Buscar por título o género..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="buscar__input"
      />

      {loading ? (
        <p className="loading">Cargando catálogo...</p>
      ) : (
        <>
          <p className="buscar__resultados">
            {filtered.length} resultado{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="buscar__grid">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Buscar
