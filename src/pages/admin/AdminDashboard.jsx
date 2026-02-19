import { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { BsPeople, BsPersonBadge, BsCalendarEvent } from 'react-icons/bs'
import { eventsAPI, staffAPI, ministriesAPI } from '../../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ ministries: 0, staff: 0, events: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([ministriesAPI.getAll(), staffAPI.getAll(), eventsAPI.getAll()])
      .then(([m, s, e]) => setStats({ ministries: m.length, staff: s.length, events: e.length }))
      .catch(err => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: <BsPeople />, iconClass: 'bg-gold-soft', value: stats.ministries, label: 'Active Ministries', change: 'From JSON data' },
    { icon: <BsPersonBadge />, iconClass: 'bg-success-soft', value: stats.staff, label: 'Staff Members', change: 'From JSON data' },
    { icon: <BsCalendarEvent />, iconClass: 'bg-purple-soft', value: stats.events, label: 'Total Events', change: 'From JSON data' },
  ]

  return (
    <>
      <div className="mb-4">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Dashboard</h3>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem' }}>
          Welcome back! Here&apos;s an overview of your church management.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading dashboard...</div>
      ) : (
        <Row className="g-4 mb-4">
          {statCards.map((stat, i) => (
            <Col md={6} lg={4} key={i}>
              <div className="admin-stat-card">
                <div className={`stat-icon ${stat.iconClass}`}>{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
                <small style={{ color: '#10B981', fontSize: '0.78rem', fontWeight: 600 }}>
                  {stat.change}
                </small>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Row className="g-4">
        <Col lg={12}>
          <div className="admin-table-card">
            <div className="card-header-custom">
              <h5>Data Storage</h5>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
                All data is stored in <code style={{ background: 'rgba(26,58,92,0.06)', padding: '2px 6px', borderRadius: 4 }}>db.json</code> and 
                served via <strong>json-server</strong>. Changes made in the admin panel are automatically saved to the JSON file.
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}
