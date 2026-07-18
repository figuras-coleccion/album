import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { useStickers } from '../context/StickersContext'
import { db, ref, get } from '../firebase'

export default function Layout() {
  const { user, logout, isAdmin } = useUser()
  const { pendingChanges, saveToCloud } = useStickers()
  const location = useLocation()
  const navigate = useNavigate()
  const [memberCount, setMemberCount] = useState(null)
  const initial = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase()
  const hasPendingChanges = Object.keys(pendingChanges || {}).length > 0
  const isAlbumRoute = location.pathname.startsWith('/album')

  useEffect(() => {
    let mounted = true

    const loadMemberCount = async () => {
      try {
        const snapshot = await get(ref(db, 'users'))
        const total = snapshot.exists() ? Object.keys(snapshot.val() || {}).length : 0
        if (mounted) setMemberCount(total)
      } catch (error) {
        console.warn('No se pudo cargar el número de miembros:', error)
        if (mounted) setMemberCount(null)
      }
    }

    loadMemberCount()
    return () => { mounted = false }
  }, [])

  const formattedMembers = memberCount === null
    ? null
    : new Intl.NumberFormat('es-PE').format(memberCount)

  const guardAlbumExit = async (event, to) => {
    if (!isAlbumRoute || !hasPendingChanges || to === '/album') return false

    event?.preventDefault?.()
    const shouldSave = window.confirm(
      'Tienes cambios sin guardar en el álbum. Para salir debes guardar primero. ¿Guardar ahora?'
    )

    if (!shouldSave) return true
    const success = await saveToCloud()
    if (success && to) navigate(to)
    return true
  }

  const handleLogout = async () => {
    if (isAlbumRoute && hasPendingChanges) {
      const shouldSave = window.confirm(
        'Tienes cambios sin guardar en el álbum. Para cerrar sesión debes guardar primero. ¿Guardar ahora?'
      )
      if (!shouldSave) return
      const success = await saveToCloud()
      if (!success) return
    }
    logout()
  }

  const navClass = ({ isActive }) => isActive ? 'active' : ''

  return (
    <>
      <header className="app-header">
        <div className="brand-block">
          <h1>⚽ Panini World Cup 2026 Sticker Tracker</h1>
          <p className="brand-tagline">Completar el álbum es más rápido y fácil cuando todos aportamos.</p>
          {formattedMembers && (
            <p className="brand-members">👥 {formattedMembers} miembros registrados</p>
          )}
        </div>
        <div className="user-info">
          <Link
            to="/profile"
            className="header-profile-link"
            title="Ver mi perfil"
            onClick={(event) => guardAlbumExit(event, '/profile')}
          >
            <div className="header-avatar">
              {user?.photoURL ? <img src={user.photoURL} alt="Foto de perfil" /> : <span>{initial}</span>}
            </div>
            <div className="header-profile-text">
              <strong>{user?.name} {user?.surname}</strong>
              <small>Mi perfil ⚙️</small>
            </div>
          </Link>
          <button className="header-logout" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <nav className="bottom-nav">
        <NavLink to="/" end className={navClass} onClick={(event) => guardAlbumExit(event, '/') }>
          <span className="icon">📊</span>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/album" className={navClass} onClick={(event) => guardAlbumExit(event, '/album') }>
          <span className="icon">📖</span>
          <span>Álbum</span>
        </NavLink>
        <NavLink to="/matches" className={navClass} onClick={(event) => guardAlbumExit(event, '/matches') }>
          <span className="icon">🤝</span>
          <span>Matches</span>
        </NavLink>
        <NavLink to="/profile" className={navClass} onClick={(event) => guardAlbumExit(event, '/profile') }>
          <span className="icon">👤</span>
          <span>Perfil</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={navClass} onClick={(event) => guardAlbumExit(event, '/admin') }>
            <span className="icon">🛡️</span>
            <span>Admin</span>
          </NavLink>
        )}
        <NavLink to="/extras" className={navClass} onClick={(event) => guardAlbumExit(event, '/extras') }>
          <span className="icon">📦</span>
          <span>Extras</span>
        </NavLink>
      </nav>
    </>
  )
}
