import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import MovieDetail from './pages/MovieDetail.jsx'
import Buscar from './pages/Buscar.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

// URL base de la "base de datos". json-server levanta este JSON como si
// fuera una API REST real (GET, POST, PUT, DELETE) sobre HTTP, escuchando
// en este puerto. Lo definimos una sola vez aquí y lo pasamos como prop
// para no repetir el string en cada página.
export const API_URL = 'http://localhost:3001'

function App() {
  return (
    <div className="app">
      {/* Navbar se muestra en TODAS las páginas porque está fuera de <Routes> */}
      <Navbar />

      {/* <Routes> funciona como un switch: solo renderiza el <Route>
          cuya "path" coincide con la URL actual del navegador */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pelicula/:id" element={<MovieDetail />} />
        <Route path="/buscar" element={<Buscar />} />
        {/* path="*" captura cualquier URL que no matcheó ninguna ruta de arriba */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
