import { useState, useEffect } from 'react'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { BsPlus, BsPencil, BsTrash } from 'react-icons/bs'
import { ministriesAPI } from '../../services/api'

const emptyMinistry = { name: '', leader: '', status: 'active', description: '', schedule: '' }

export default function AdminMinistries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [current, setCurrent] = useState(emptyMinistry)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    ministriesAPI.getAll()
      .then(data => setMinistries(data))
      .catch(err => console.error('Failed to load ministries:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      if (editMode) {
        const updated = await ministriesAPI.update(current.id, current)
        setMinistries(ministries.map(m => m.id === current.id ? updated : m))
      } else {
        const { id, ...body } = current
        const created = await ministriesAPI.create(body)
        setMinistries([...ministries, created])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save ministry:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  const handleDelete = async () => {
    try {
      await ministriesAPI.delete(deleteId)
      setMinistries(ministries.filter(m => m.id !== deleteId))
      setShowDelete(false)
    } catch (err) {
      console.error('Failed to delete ministry:', err)
      alert('Failed to delete. Make sure the JSON server is running.')
    }
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading ministries...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Ministries Management</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
            Manage church ministries and their details.
          </p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={() => { setEditMode(false); setCurrent(emptyMinistry); setShowModal(true); }}>
          <BsPlus size={18} /> Add Ministry
        </button>
      </div>

      <Row className="g-4">
        {ministries.map((ministry) => (
          <Col md={6} lg={4} key={ministry.id}>
            <div className="admin-form-card h-100">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem' }}>{ministry.name}</h5>
                <span className={`status-badge ${ministry.status}`}>{ministry.status}</span>
              </div>
              <p style={{ color: 'var(--text-medium)', fontSize: '0.9rem', lineHeight: 1.6 }}>{ministry.description}</p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Leader:</strong> {ministry.leader}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                <strong style={{ color: 'var(--text-dark)' }}>Schedule:</strong> {ministry.schedule}
              </div>
              <div className="d-flex gap-2">
                <button className="btn-admin btn-admin-outline" onClick={() => { setEditMode(true); setCurrent(ministry); setShowModal(true); }}>
                  <BsPencil /> Edit
                </button>
                <button className="btn-admin btn-admin-danger" onClick={() => { setDeleteId(ministry.id); setShowDelete(true); }}>
                  <BsTrash /> Delete
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>
            {editMode ? 'Edit Ministry' : 'Add New Ministry'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Ministry Name</Form.Label>
                <Form.Control value={current.name} onChange={(e) => setCurrent({ ...current, name: e.target.value })} placeholder="Enter ministry name" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select value={current.status} onChange={(e) => setCurrent({ ...current, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="completed">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Leader</Form.Label>
                <Form.Control value={current.leader} onChange={(e) => setCurrent({ ...current, leader: e.target.value })} placeholder="Ministry leader" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Schedule</Form.Label>
                <Form.Control value={current.schedule} onChange={(e) => setCurrent({ ...current, schedule: e.target.value })} placeholder="Meeting times" />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={current.description} onChange={(e) => setCurrent({ ...current, description: e.target.value })} placeholder="Ministry description..." />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 10 }}>Cancel</Button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>
            {editMode ? 'Save Changes' : 'Create Ministry'}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this ministry?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDelete(false)} style={{ borderRadius: 10 }}>Cancel</Button>
          <button className="btn-admin btn-admin-danger" onClick={handleDelete} style={{ background: '#EF4444', color: 'white', border: 'none' }}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
