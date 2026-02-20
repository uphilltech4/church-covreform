import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import About from './pages/About'
import Ministries from './pages/Ministries'
import Events from './pages/Events'
import Giving from './pages/Giving'
import Contact from './pages/Contact'
import OnlineServices from './pages/OnlineServices'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMinistries from './pages/admin/AdminMinistries'
import AdminStaff from './pages/admin/AdminStaff'
import AdminContent from './pages/admin/AdminContent'
import AdminSettings from './pages/admin/AdminSettings'
import AdminServices from './pages/admin/AdminServices'
import AdminSermons from './pages/admin/AdminSermons'
import AdminChangePassword from './pages/admin/AdminChangePassword'
import AdminLogin from './pages/admin/AdminLogin'
import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center py-5">Loading...</div>
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function App() {
  // Track visitor once per browser session
  useEffect(() => {
    if (!sessionStorage.getItem('_tracked')) {
      sessionStorage.setItem('_tracked', '1')
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: window.location.pathname,
          referrer: document.referrer,
        }),
      }).catch(() => {})
    }
  }, [])

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ministries" element={<Ministries />} />
        <Route path="/events" element={<Events />} />
        <Route path="/giving" element={<Giving />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/online-services" element={<OnlineServices />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="ministries" element={<AdminMinistries />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="sermons" element={<AdminSermons />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="change-password" element={<AdminChangePassword />} />
      </Route>
    </Routes>
  )
}

export default App
