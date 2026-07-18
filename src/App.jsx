import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { UserProvider, useUser } from './context/UserContext'
import { StickersProvider } from './context/StickersContext'
import Layout from './components/Layout'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AlbumPage from './components/AlbumPage'
import TeamPage from './components/TeamPage'
import SpecialsPage from './components/SpecialsPage'
import ExtrasPage from './components/ExtrasPage'
import MatchFinder from './components/MatchFinder'
import ProfilePage from './components/ProfilePage'
import VisualMissingReportPage from './components/VisualMissingReportPage'
import AdminDashboard from './components/AdminDashboard'

const routerBasename = import.meta.env.BASE_URL === '/'
  ? '/'
  : import.meta.env.BASE_URL.replace(/\/$/, '')

function AppRoutes() {
  const { user } = useUser()

  if (!user) {
    return <Register />
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="album" element={<AlbumPage />} />
        <Route path="team/:teamCode" element={<TeamPage />} />
        <Route path="specials" element={<SpecialsPage />} />
        <Route path="extras" element={<ExtrasPage />} />
        <Route path="matches" element={<MatchFinder />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="visual-report" element={<VisualMissingReportPage />} />
        <Route path="admin" element={<AdminDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <UserProvider>
        <StickersProvider>
          <AppRoutes />
        </StickersProvider>
      </UserProvider>
    </BrowserRouter>
  )
}
