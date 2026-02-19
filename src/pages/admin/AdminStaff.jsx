import { useState, useEffect } from 'react'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs'
import { staffAPI } from '../../services/api'

const emptyStaff = { name: '', role: '', email: '', phone: '', bio: '', initials: '', image: '' }

export default function AdminStaff() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [current, setCurrent] = useState(emptyStaff)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    staffAPI.getAll()
      .then(data => setStaff(data))
      .catch(err => console.error('Failed to load staff:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      const updatedStaff = { ...current }
      if (!updatedStaff.initials) {
        updatedStaff.initials = updatedStaff.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      }
      if (editMode) {
        const saved = await staffAPI.update(current.id, updatedStaff)
        setStaff(staff.map(s => s.id === current.id ? saved : s))
      } else {
        const { id, ...body } = updatedStaff
        const created = await staffAPI.create(body)
        setStaff([...staff, created])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save staff:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  const handleDelete = async () => {
    try {
      await staffAPI.delete(deleteId)
      setStaff(staff.filter(s => s.id !== deleteId))
      setShowDelete(false)
    } catch (err) {
      console.error('Failed to delete staff:', err)
      alert('Failed to delete. Make sure the JSON server is running.')
    }
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading staff...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Staff Management</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
            Manage church staff, pastors, and team members.
          </p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={() => { setEditMode(false); setCurrent(emptyStaff); setShowModal(true); }}>
          <BsPlus size={18} /> Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="admin-table-card">
        <div className="card-header-custom">
          <h5>All Staff Members</h5>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{staff.length} members</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Bio</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((person) => (
                <tr key={person.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{
                        width: 36, height: 36,
                        background: 'var(--gradient-primary)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white', fontWeight: 700, fontSize: '0.8rem',
                        minWidth: 36
                      }}>
                        {person.initials}
                      </div>
                      <span style={{ fontWeight: 600 }}>{person.name}</span>
                    </div>
                  </td>
                  <td><span className="event-tag">{person.role}</span></td>
                  <td style={{ color: 'var(--text-medium)' }}>{person.email || '—'}</td>
                  <td style={{ color: 'var(--text-medium)', maxWidth: 300 }}>
                    <span style={{ fontSize: '0.85rem' }}>{person.bio.substring(0, 80)}...</span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-admin btn-admin-outline" onClick={() => { setEditMode(true); setCurrent(person); setShowModal(true); }}>
                        <BsPencil />
                      </button>
                      <button className="btn-admin btn-admin-danger" onClick={() => { setDeleteId(person.id); setShowDelete(true); }}>
                        <BsTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>
            {editMode ? 'Edit Staff Member' : 'Add New Staff'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control value={current.name} onChange={(e) => setCurrent({ ...current, name: e.target.value })} placeholder="Enter full name" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Role / Title</Form.Label>
                <Form.Control value={current.role} onChange={(e) => setCurrent({ ...current, role: e.target.value })} placeholder="e.g. Lead Pastor" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={current.email} onChange={(e) => setCurrent({ ...current, email: e.target.value })} placeholder="Email address" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone</Form.Label>
                <Form.Control value={current.phone} onChange={(e) => setCurrent({ ...current, phone: e.target.value })} placeholder="Phone number" />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Staff Photo</Form.Label>
                <div className="d-flex align-items-start gap-3 mt-1">
                  {/* Preview */}
                  <div style={{
                    width: 100, height: 100,
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    border: '2px solid #e5e7eb',
                  }}>
                    {current.image ? (
                      <img src={current.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.75rem', textAlign: 'center' }}>No photo</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if (!file) return
                        const reader = new FileReader()
                        reader.onload = (ev) => setCurrent({ ...current, image: ev.target.result })
                        reader.readAsDataURL(file)
                      }}
                    />
                    <Form.Text className="text-muted">
                      Upload a JPG or PNG image. The photo will be stored with the staff record.
                    </Form.Text>
                    {current.image && (
                      <div className="mt-2">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          style={{ borderRadius: 8, fontSize: '0.78rem' }}
                          onClick={() => setCurrent({ ...current, image: '' })}
                        >
                          Remove Photo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Biography</Form.Label>
                <Form.Control as="textarea" rows={4} value={current.bio} onChange={(e) => setCurrent({ ...current, bio: e.target.value })} placeholder="Staff member bio..." />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 10 }}>Cancel</Button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>
            {editMode ? 'Save Changes' : 'Add Staff'}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to remove this staff member?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDelete(false)} style={{ borderRadius: 10 }}>Cancel</Button>
          <button className="btn-admin btn-admin-danger" onClick={handleDelete} style={{ background: '#EF4444', color: 'white', border: 'none' }}>
            Remove
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
