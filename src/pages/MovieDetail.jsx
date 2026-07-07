import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import StarRating from '../components/StarRating.jsx'
import ReviewForm from '../components/ReviewForm.jsx'
import ReviewList from '../components/ReviewList.jsx'
import { API_URL } from '../App.jsx'

function MovieDetail() {
  // useParams() lee el valor dinámico de la URL. Si la ruta es
  // "/pelicula/:id" y el usuario entra a "/pelicula/3", entonces id === "3"
  const { id } = useParams()

  const [movie, setMovie] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect #2 (de todo el proyecto): a diferencia del de Home.jsx,
  // este SÍ tiene una dependencia: [id]. Eso significa que si el usuario
  // navega de "/pelicula/3" a "/pelicula/5" sin recargar la página,
  // React vuelve a ejecutar este efecto y pide los datos de la película nueva.
  useEffect(() => {
    setLoading(true)

    // Promise.all dispara los dos fetch en paralelo (no uno después del otro)
    // y espera a que ambos terminen antes de seguir.
    Promise.all([
      fetch(`${API_URL}/movies/${id}`).then((response) => response.json()),
      fetch(`${API_URL}/reviews?movieId=${id}`).then((response) => response.json()),
    ]).then(([movieData, reviewsData]) => {
      setMovie(movieData)
      setReviews(reviewsData)
      setLoading(false)
    })
  }, [id])

  // Esta función la recibe ReviewForm como prop (onReviewAdded).
  // Cuando se publica una reseña nueva, la agregamos al estado local
  // para que aparezca en pantalla SIN tener que volver a pedirle todo a la API.
  const handleReviewAdded = (nuevaResena) => {
    setReviews((reseniasPrevias) => [...reseniasPrevias, nuevaResena])
  }

  if (loading) return <p className="loading">Cargando película...</p>
  if (!movie || !movie.id) {
    return (
      <div className="loading">
        <p>No encontramos esta película.</p>
        <Link to="/" className="btn btn--secondary">Volver al inicio</Link>
      </div>
    )
  }

  // Promedio de estrellas calculado en el momento a partir de las reseñas,
  // no se guarda en la base de datos: siempre se recalcula con los datos actuales.
  const promedio = reviews.length
    ? reviews.reduce((acumulado, review) => acumulado + review.rating, 0) / reviews.length
    : 0

  return (
    <div className="movie-detail">
      <div
        className="movie-detail__backdrop"
        style={{ backgroundImage: `url(${movie.backdrop})` }}
      >
        <div className="movie-detail__gradient" />
      </div>

      <div className="movie-detail__content">
        <img src={movie.image} alt={`Póster de ${movie.title}`} className="movie-detail__poster" />

        <div className="movie-detail__info">
          <h1>{movie.title}</h1>
          <span className="tag">{movie.genre} · {movie.year} · {movie.duration}</span>
          <p className="movie-detail__description">{movie.description}</p>

          <div className="movie-detail__rating">
            <StarRating rating={Math.round(promedio)} />
            <span className="movie-detail__rating-text">
              {promedio ? promedio.toFixed(1) : 'Sin calificaciones todavía'}
              {reviews.length > 0 && ` · ${reviews.length} reseña${reviews.length > 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>

      <div className="movie-detail__reviews">
        <ReviewForm movieId={movie.id} onReviewAdded={handleReviewAdded} />
        <ReviewList reviews={reviews} />
      </div>

      <Link to="/" className="back-link">← Volver al inicio</Link>
    </div>
  )
}

export default MovieDetail
