import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
  // useState #A: guarda si el usuario ya scrolleó la página o no.
  // Lo usamos para que la navbar pase de transparente a sólida, igual que en Netflix.
  const [isScrolled, setIsScrolled] = useState(false)

  // useEffect #A: se suscribe al evento "scroll" del navegador.
  // Este es un buen ejemplo para la defensa oral porque muestra:
  //  1) un efecto que interactúa con el DOM/window (no solo con la API)
  //  2) la función de limpieza (return) que evita memory leaks
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)

    // Esta función se ejecuta cuando el componente se desmonta.
    // Si no la pusiéramos, cada vez que Navbar se vuelva a renderizar
    // quedaría OTRO listener de scroll "pegado" en window.
    return () => window.removeEventListener('scroll', handleScroll)
  }, []) // array de dependencias vacío = el efecto corre 1 sola vez, al montar

  return (
    <header className={`navbar ${isScrolled ? 'navbar--solid' : ''}`}>
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__logo">NETFLIX</NavLink>

        <nav className="navbar__links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
            Inicio
          </NavLink>
          <NavLink to="/buscar" className={({ isActive }) => (isActive ? 'navbar__link active' : 'navbar__link')}>
            Buscar
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
