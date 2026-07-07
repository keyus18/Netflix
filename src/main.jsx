import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// BrowserRouter envuelve toda la aplicación para habilitar el sistema de
// rutas de react-router-dom. Tiene que ir ACÁ (en la raíz) y no dentro de
// App.jsx, porque App.jsx ya usa hooks de router (useParams, useNavigate, etc.)
// y esos hooks solo funcionan si el componente está "adentro" de un Router.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
