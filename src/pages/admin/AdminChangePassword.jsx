import { useState } from 'react'
import { Row, Col, Form, Button, Alert } from 'react-bootstrap'
import { BsKeyFill, BsCheckCircle } from 'react-icons/bs'
import { useAuth } from '../../contexts/AuthContext'

export default function AdminChangePassword() {
  const { changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    const result = changePassword(currentPassword, newPassword)
    if (result.success) {
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      setError(result.error)
    }
  }

  return (
    <>
      <div className="mb-4">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Change Password</h3>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem' }}>
          Update your admin panel password.
        </p>
      </div>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="admin-table-card">
            <div className="card-header-custom">
              <h5><BsKeyFill className="me-2" />Update Password</h5>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {success && (
                <Alert variant="success" className="d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                  <BsCheckCircle /> Password changed successfully!
                </Alert>
              )}
              {error && (
                <Alert variant="danger" style={{ fontSize: '0.9rem' }}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.88rem' }}>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: 600, fontSize: '0.88rem' }}>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                    minLength={6}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  style={{
                    background: 'var(--gradient-primary)',
                    border: 'none',
                    fontWeight: 700,
                    borderRadius: 10,
                    padding: '0.6rem 1.5rem',
                  }}
                >
                  Update Password
                </Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}
