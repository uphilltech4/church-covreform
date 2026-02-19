import { useState, useEffect } from 'react'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { BsPlus, BsPencil, BsTrash, BsClock, BsGeoAlt } from 'react-icons/bs'
import { eventsAPI } from '../../services/api'

const emptyEvent = { title: '', date: '', time: '', location: '', category: 'Worship', status: 'upcoming', description: '' }

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(emptyEvent)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    eventsAPI.getAll()
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load events:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = () => {
    setEditMode(false)
    setCurrentEvent(emptyEvent)
    setShowModal(true)
  }

  const handleEdit = (event) => {
    setEditMode(true)
    setCurrentEvent(event)
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editMode) {
        const updated = await eventsAPI.update(currentEvent.id, currentEvent)
        setEvents(events.map(e => e.id === currentEvent.id ? updated : e))
      } else {
        const { id, ...body } = currentEvent
        const created = await eventsAPI.create(body)
        setEvents([...events, created])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save event:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  const handleDelete = async () => {
    try {
      await eventsAPI.delete(deleteId)
      setEvents(events.filter(e => e.id !== deleteId))
      setShowDeleteModal(false)
    } catch (err) {
      console.error('Failed to delete event:', err)
      alert('Failed to delete. Make sure the JSON server is running.')
    }
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading events...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Events Management</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
            Create, edit, and manage church events.
          </p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={handleAdd}>
          <BsPlus size={18} /> Add Event
        </button>
      </div>

      {/* Stats Row */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Total Events', value: events.length, cls: 'bg-primary-soft' },
          { label: 'Active', value: events.filter(e => e.status === 'active').length, cls: 'bg-success-soft' },
          { label: 'Upcoming', value: events.filter(e => e.status === 'upcoming').length, cls: 'bg-gold-soft' },
          { label: 'Drafts', value: events.filter(e => e.status === 'draft').length, cls: 'bg-purple-soft' },
        ].map((s, i) => (
          <Col md={3} key={i}>
            <div className="admin-stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Events Table */}
      <div className="admin-table-card">
        <div className="card-header-custom">
          <h5>All Events</h5>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{events.length} events</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td style={{ fontWeight: 600 }}>{event.title}</td>
                  <td>{event.date}</td>
                  <td><BsClock className="me-1" style={{ color: 'var(--text-light)' }} />{event.time}</td>
                  <td><BsGeoAlt className="me-1" style={{ color: 'var(--text-light)' }} />{event.location}</td>
                  <td><span className="event-tag">{event.category}</span></td>
                  <td><span className={`status-badge ${event.status}`}>{event.status}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-admin btn-admin-outline" onClick={() => handleEdit(event)}>
                        <BsPencil />
                      </button>
                      <button className="btn-admin btn-admin-danger" onClick={() => { setDeleteId(event.id); setShowDeleteModal(true); }}>
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>
            {editMode ? 'Edit Event' : 'Add New Event'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="admin-form-card" style={{ boxShadow: 'none', padding: 0 }}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Event Title</Form.Label>
                  <Form.Control 
                    value={currentEvent.title} 
                    onChange={(e) => setCurrentEvent({ ...currentEvent, title: e.target.value })} 
                    placeholder="Enter event title"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Category</Form.Label>
                  <Form.Select 
                    value={currentEvent.category}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, category: e.target.value })}
                  >
                    <option>Worship</option>
                    <option>Education</option>
                    <option>Youth</option>
                    <option>Women</option>
                    <option>Group</option>
                    <option>Special</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={currentEvent.date} 
                    onChange={(e) => setCurrentEvent({ ...currentEvent, date: e.target.value })} 
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Time</Form.Label>
                  <Form.Control 
                    value={currentEvent.time} 
                    onChange={(e) => setCurrentEvent({ ...currentEvent, time: e.target.value })} 
                    placeholder="e.g. 10:30 AM"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    value={currentEvent.status}
                    onChange={(e) => setCurrentEvent({ ...currentEvent, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="draft">Draft</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Location</Form.Label>
                  <Form.Control 
                    value={currentEvent.location} 
                    onChange={(e) => setCurrentEvent({ ...currentEvent, location: e.target.value })} 
                    placeholder="Enter location"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    value={currentEvent.description} 
                    onChange={(e) => setCurrentEvent({ ...currentEvent, description: e.target.value })} 
                    placeholder="Event description..."
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 10 }}>
            Cancel
          </Button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>
            {editMode ? 'Save Changes' : 'Create Event'}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this event? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ borderRadius: 10 }}>
            Cancel
          </Button>
          <button className="btn-admin btn-admin-danger" onClick={handleDelete} style={{ background: '#EF4444', color: 'white', border: 'none' }}>
            Delete Event
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
