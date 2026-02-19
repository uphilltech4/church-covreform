import { useState, useEffect } from 'react'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { BsPlus, BsPencil, BsTrash, BsPlayCircle, BsStar, BsStarFill } from 'react-icons/bs'
import { servicesAPI } from '../../services/api'

const emptyService = { title: '', date: '', speaker: '', videoUrl: '', featured: false, status: 'published' }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [current, setCurrent] = useState(emptyService)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    servicesAPI.getAll()
      .then(data => setServices(data))
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      if (editMode) {
        const updated = await servicesAPI.update(current.id, current)
        setServices(services.map(s => s.id === current.id ? updated : s))
      } else {
        const { id, ...body } = current
        const created = await servicesAPI.create(body)
        setServices([...services, created])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save service:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  const handleDelete = async () => {
    try {
      await servicesAPI.delete(deleteId)
      setServices(services.filter(s => s.id !== deleteId))
      setShowDelete(false)
    } catch (err) {
      console.error('Failed to delete service:', err)
      alert('Failed to delete. Make sure the JSON server is running.')
    }
  }

  const toggleFeatured = async (service) => {
    try {
      // Unfeatured all others first, then feature this one
      const updated = { ...service, featured: !service.featured }
      const saved = await servicesAPI.update(service.id, updated)
      setServices(services.map(s => s.id === service.id ? saved : s))
    } catch (err) {
      console.error('Failed to toggle featured:', err)
    }
  }

  const getVideoEmbed = (url) => {
    if (!url) return null
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
    // Facebook — just return the URL for linking
    if (url.includes('facebook.com')) return null
    return null
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading services...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Online Services</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
            Manage recorded service videos displayed on the Online Services page.
          </p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={() => { setEditMode(false); setCurrent(emptyService); setShowModal(true); }}>
          <BsPlus size={18} /> Add Service
        </button>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Total Services', value: services.length },
          { label: 'Published', value: services.filter(s => s.status === 'published').length },
          { label: 'Drafts', value: services.filter(s => s.status === 'draft').length },
          { label: 'Featured', value: services.filter(s => s.featured).length },
        ].map((s, i) => (
          <Col md={3} key={i}>
            <div className="admin-stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Services Table */}
      <div className="admin-table-card">
        <div className="card-header-custom">
          <h5>All Services</h5>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{services.length} services</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Title</th>
                <th>Date</th>
                <th>Speaker</th>
                <th>Video</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>
                    <button
                      onClick={() => toggleFeatured(service)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: service.featured ? '#F59E0B' : '#ccc', fontSize: '1.1rem', padding: 0 }}
                      title={service.featured ? 'Remove featured' : 'Set as featured'}
                    >
                      {service.featured ? <BsStarFill /> : <BsStar />}
                    </button>
                  </td>
                  <td style={{ fontWeight: 600 }}>{service.title}</td>
                  <td>{new Date(service.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={{ color: 'var(--text-medium)' }}>{service.speaker}</td>
                  <td>
                    {service.videoUrl ? (
                      <a href={service.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>
                        <BsPlayCircle className="me-1" /> View
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>No video</span>
                    )}
                  </td>
                  <td><span className={`status-badge ${service.status}`}>{service.status}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-admin btn-admin-outline" onClick={() => { setEditMode(true); setCurrent(service); setShowModal(true); }}>
                        <BsPencil />
                      </button>
                      <button className="btn-admin btn-admin-danger" onClick={() => { setDeleteId(service.id); setShowDelete(true); }}>
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
            {editMode ? 'Edit Service' : 'Add New Service'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Service Title</Form.Label>
                <Form.Control
                  value={current.title}
                  onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                  placeholder='e.g. Sunday Celebration - "Walking in Faith"'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  value={current.date}
                  onChange={(e) => setCurrent({ ...current, date: e.target.value })}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Speaker</Form.Label>
                <Form.Control
                  value={current.speaker}
                  onChange={(e) => setCurrent({ ...current, speaker: e.target.value })}
                  placeholder="e.g. Pastor Weldon Yeo"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={current.status}
                  onChange={(e) => setCurrent({ ...current, status: e.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={9}>
              <Form.Group>
                <Form.Label>Video URL</Form.Label>
                <Form.Control
                  value={current.videoUrl}
                  onChange={(e) => setCurrent({ ...current, videoUrl: e.target.value })}
                  placeholder="YouTube or Facebook video URL"
                />
                <Form.Text className="text-muted">
                  Paste a YouTube link (e.g. https://youtube.com/watch?v=...) or Facebook video URL.
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={3} className="d-flex align-items-end">
              <Form.Group>
                <Form.Check
                  type="switch"
                  id="featured-switch"
                  label="Featured"
                  checked={current.featured}
                  onChange={(e) => setCurrent({ ...current, featured: e.target.checked })}
                />
              </Form.Group>
            </Col>
            {current.videoUrl && getVideoEmbed(current.videoUrl) && (
              <Col xs={12}>
                <Form.Label>Preview</Form.Label>
                <div style={{ borderRadius: 12, overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={getVideoEmbed(current.videoUrl)}
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video Preview"
                  />
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 10 }}>Cancel</Button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>
            {editMode ? 'Save Changes' : 'Add Service'}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this service recording?</Modal.Body>
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
