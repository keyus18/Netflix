import { Link } from 'react-router-dom'

/**
 * Tarjeta de película. Recibe el objeto "movie" completo por props
 * y se usa tanto en Home.jsx (filas por género) como en Buscar.jsx (grilla).
 * Al envolver todo en <Link>, el click en cualquier parte de la tarjeta
 * navega a la página de detalle de esa película.
 */
function MovieCard({ movie }) {
  return (
    <Link to={`/pelicula/${movie.id}`} className="movie-card">
      <img
        src={movie.image}
        alt={`Póster de ${movie.title}`}
        className="movie-card__poster"
        loading="lazy"
      />
      <div className="movie-card__overlay">
        <p className="movie-card__title">{movie.title}</p>
        <p className="movie-card__meta">{movie.genre} · {movie.year}</p>
      </div>
    </Link>
  )
}

export default MovieCard
