import StarRating from './StarRating.jsx'

/**
 * Lista de reseñas de una película. Recibe el array "reviews" ya
 * filtrado por movieId (ese filtrado lo hace MovieDetail.jsx).
 */
function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return <p className="review-list__empty">Todavía no hay reseñas. ¡Sé el primero en opinar!</p>
  }

  return (
    <ul className="review-list">
      {/* .map() recorre el array y devuelve un <li> por cada reseña.
          "key" es obligatorio en React para que sepa qué elemento cambió
          sin tener que re-renderizar toda la lista de cero. */}
      {reviews.map((review) => (
        <li key={review.id} className="review-card">
          <div className="review-card__header">
            <span className="review-card__user">{review.user}</span>
            <StarRating rating={review.rating} size={16} />
          </div>
          <p className="review-card__comment">{review.comment}</p>
        </li>
      ))}
    </ul>
  )
}

export default ReviewList
