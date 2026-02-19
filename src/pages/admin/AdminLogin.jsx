import { useState } from 'react'
import { Container, Row, Col, Alert, Form } from 'react-bootstrap'
import { Navigate } from 'react-router-dom'
import { BsShieldLock } from 'react-icons/bs'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminLogin() {
  const { user, loading, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [signingIn, setSigningIn] = useState(false)

  if (loading) {
    return (
      <div className="admin-login-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="text-center" style={{ color: 'var(--text-medium)' }}>Loading...</div>
      </div>
    )
  }

  if (user) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setSigningIn(true)
    const success = login(username, password)
    if (!success) {
      setError('Invalid username or password')
    }
    setSigningIn(false)
  }

  return (
    <div className="admin-login-page d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--bg-light)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <div className="admin-login-card text-center" style={{
              background: 'white',
              borderRadius: 16,
              padding: '2.5rem 2rem',
              boxShadow: '0 8px 32px rgba(26,58,92,0.10)',
            }}>
              <div style={{
                width: 56, height: 56,
                background: 'var(--gradient-primary)',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.2rem',
                color: 'white', fontSize: '1.5rem'
              }}>
                <BsShieldLock />
              </div>

              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.4rem' }}>Admin Login</h4>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', marginBottom: '1.8rem' }}>
                Sign in to access the MCA admin panel.
              </p>

              {error && <Alert variant="danger" className="mb-3" style={{ fontSize: '0.85rem' }}>{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3 text-start">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    style={{ borderRadius: 10, padding: '0.65rem 1rem' }}
                  />
                </Form.Group>
                <Form.Group className="mb-4 text-start">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    style={{ borderRadius: 10, padding: '0.65rem 1rem' }}
                  />
                </Form.Group>
                <button
                  type="submit"
                  disabled={signingIn}
                  className="w-100"
                  style={{
                    padding: '0.7rem 1rem',
                    border: 'none',
                    borderRadius: 10,
                    background: 'var(--gradient-primary)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: signingIn ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {signingIn ? 'Signing in...' : 'Sign In'}
                </button>
              </Form>

              <p className="mt-4" style={{ color: 'var(--text-light)', fontSize: '0.8rem', margin: 0 }}>
                Only authorized administrators can access this panel.
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
