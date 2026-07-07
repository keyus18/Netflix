import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Perdido en el algoritmo. Esta página no existe.</p>
      <Link to="/" className="btn btn--primary">Volver al inicio</Link>
    </div>
  )
}

export default NotFound
