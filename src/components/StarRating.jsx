import { useState } from 'react'

/**
 * Componente de calificación de 0 a 5 estrellas. Es reutilizable:
 *  - Modo SOLO LECTURA: <StarRating rating={4} />
 *    (se usa para mostrar el puntaje de una reseña ya guardada)
 *  - Modo INTERACTIVO: <StarRating rating={rating} onRate={setRating} />
 *    (se usa en el formulario, para que el usuario elija su calificación)
 *
 * La diferencia la decide la presencia de la prop "onRate".
 */
function StarRating({ rating = 0, onRate, size = 22 }) {
  // useState #B: guarda la estrella sobre la que está el mouse en este momento,
  // para mostrar una vista previa ANTES de que el usuario haga click definitivo.
  const [hoverRating, setHoverRating] = useState(0)

  const isInteractive = typeof onRate === 'function'
  const estrellas = [1, 2, 3, 4, 5]

  return (
    <div
      className="star-rating"
      onMouseLeave={() => isInteractive && setHoverRating(0)}
    >
      {estrellas.map((numero) => {
        // una estrella se pinta "llena" si es <= que el valor en hover,
        // o si no hay hover, si es <= que la calificación real
        const llena = numero <= (hoverRating || rating)

        return (
          <span
            key={numero}
            className={`star ${llena ? 'star--filled' : ''}`}
            style={{ fontSize: size, cursor: isInteractive ? 'pointer' : 'default' }}
            onMouseEnter={() => isInteractive && setHoverRating(numero)}
            onClick={() => isInteractive && onRate(numero)}
            role={isInteractive ? 'button' : undefined}
            aria-label={`${numero} estrella${numero > 1 ? 's' : ''}`}
          >
            ★
          </span>
        )
      })}
    </div>
  )
}

export default StarRating
