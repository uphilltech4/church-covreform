import { useState } from 'react'
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom'
import { 
  BsGrid, BsPeople, BsPersonBadge, BsCameraVideo,
  BsFileText, BsGear, BsBoxArrowRight, BsList, BsPlusLg, BsJournalBookmark, BsBoxArrowInRight, BsKeyFill
} from 'react-icons/bs'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const menuItems = [
    { path: '/admin', icon: <BsGrid />, label: 'Dashboard', end: true },
    { path: '/admin/ministries', icon: <BsPeople />, label: 'Ministries' },
    { path: '/admin/staff', icon: <BsPersonBadge />, label: 'Staff' },
    { path: '/admin/sermons', icon: <BsJournalBookmark />, label: 'Sermons' },
    { path: '/admin/services', icon: <BsCameraVideo />, label: 'Online Services' },
    { path: '/admin/content', icon: <BsFileText />, label: 'Content Pages' },
    { path: '/admin/settings', icon: <BsGear />, label: 'Settings' },
  ]

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarOpen ? 'show' : ''}`}>
        <div className="sidebar-brand">
          <h5><BsPlusLg className="me-2" />MCA Admin</h5>
          <small>Church Management</small>
        </div>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
          <li style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
            <NavLink
              to="/admin/change-password"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <BsKeyFill />
              Change Password
            </NavLink>
          </li>
          <li>
            <Link to="/">
              <BsBoxArrowRight />
              Back to Website
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.7rem', padding: '0.65rem 1.1rem', width: '100%', cursor: 'pointer', fontSize: 'inherit', fontFamily: 'inherit' }}
            >
              <BsBoxArrowInRight />
              Sign Out
            </button>
          </li>
        </ul>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="d-flex align-items-center gap-3">
            <button 
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <BsList />
            </button>
            <h4>Admin Panel</h4>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize: '0.88rem', color: 'var(--text-medium)' }}>
              {user?.displayName || user?.email || 'Admin'}
            </span>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div style={{
                width: 36, height: 36,
                background: 'var(--gradient-primary)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '0.85rem'
              }}>
                {(user?.displayName || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
