import { useState } from 'react'
import StarRating from './StarRating.jsx'
import { API_URL } from '../App.jsx'

/**
 * Formulario para publicar una reseña sobre una película puntual.
 * Props:
 *  - movieId: id de la película a la que pertenece la reseña
 *  - onReviewAdded: función que avisa al componente padre (MovieDetail)
 *    que se guardó una reseña nueva, para actualizar la lista sin recargar la página
 */
function ReviewForm({ movieId, onReviewAdded }) {
  const [user, setUser] = useState('')
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  // handleSubmit reacciona al evento "submit" del <form>.
  const handleSubmit = async (event) => {
    event.preventDefault() // sin esto, el navegador recargaría la página entera

    if (rating === 0 || comment.trim() === '') {
      setError('Elegí una calificación y escribí un comentario antes de publicar.')
      return
    }

    const nuevaResena = {
      movieId: Number(movieId),
      user: user.trim() || 'Anónimo',
      rating,
      comment: comment.trim(),
    }

    try {
      setEnviando(true)
      setError('')

      // POST a json-server: esto agrega un nuevo objeto a la colección
      // "reviews" dentro de db.json, como si fuera un INSERT en SQL.
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaResena),
      })

      if (!response.ok) throw new Error('No se pudo guardar la reseña')

      const resenaGuardada = await response.json()
      onReviewAdded(resenaGuardada)

      // limpiamos el formulario para la próxima reseña
      setUser('')
      setRating(0)
      setComment('')
    } catch (err) {
      setError('Ocurrió un error al publicar tu reseña. Intentá de nuevo.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3 className="review-form__title">Dejá tu reseña</h3>

      <StarRating rating={rating} onRate={setRating} size={26} />

      <input
        type="text"
        placeholder="Tu nombre (opcional)"
        value={user}
        onChange={(event) => setUser(event.target.value)}
        className="review-form__input"
      />

      <textarea
        placeholder="¿Qué te pareció la película?"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="review-form__textarea"
        rows={3}
      />

      {error && <p className="review-form__error">{error}</p>}

      <button type="submit" disabled={enviando} className="btn btn--primary">
        {enviando ? 'Publicando...' : 'Publicar reseña'}
      </button>
    </form>
  )
}

export default ReviewForm
