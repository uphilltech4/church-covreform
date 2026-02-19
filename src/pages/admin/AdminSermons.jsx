import { useState, useEffect } from 'react'
import { Row, Col, Modal, Form, Button } from 'react-bootstrap'
import { BsPlus, BsPencil, BsTrash, BsPlayCircle, BsStar, BsStarFill, BsBookHalf } from 'react-icons/bs'
import { sermonsAPI } from '../../services/api'

const emptySermon = {
  title: '', series: '', speaker: '', date: '', scripture: '',
  description: '', videoUrl: '', audioUrl: '', featured: false, status: 'published'
}

export default function AdminSermons() {
  const [sermons, setSermons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [current, setCurrent] = useState(emptySermon)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => {
    sermonsAPI.getAll()
      .then(data => setSermons(data))
      .catch(err => console.error('Failed to load sermons:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    try {
      if (editMode) {
        const updated = await sermonsAPI.update(current.id, current)
        setSermons(sermons.map(s => s.id === current.id ? updated : s))
      } else {
        const { id, ...body } = current
        const created = await sermonsAPI.create(body)
        setSermons([...sermons, created])
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save sermon:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  const handleDelete = async () => {
    try {
      await sermonsAPI.delete(deleteId)
      setSermons(sermons.filter(s => s.id !== deleteId))
      setShowDelete(false)
    } catch (err) {
      console.error('Failed to delete sermon:', err)
      alert('Failed to delete. Make sure the JSON server is running.')
    }
  }

  const toggleFeatured = async (sermon) => {
    try {
      const updated = { ...sermon, featured: !sermon.featured }
      const saved = await sermonsAPI.update(sermon.id, updated)
      setSermons(sermons.map(s => s.id === sermon.id ? saved : s))
    } catch (err) {
      console.error('Failed to toggle featured:', err)
    }
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading sermons...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Sermons</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
            Manage weekly sermons displayed on the home page and sermon archive.
          </p>
        </div>
        <button className="btn-admin btn-admin-primary" onClick={() => { setEditMode(false); setCurrent(emptySermon); setShowModal(true) }}>
          <BsPlus size={18} /> Add Sermon
        </button>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {[
          { label: 'Total Sermons', value: sermons.length },
          { label: 'Published', value: sermons.filter(s => s.status === 'published').length },
          { label: 'Drafts', value: sermons.filter(s => s.status === 'draft').length },
          { label: 'Featured', value: sermons.filter(s => s.featured).length },
        ].map((s, i) => (
          <Col md={3} key={i}>
            <div className="admin-stat-card">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* Sermons Table */}
      <div className="admin-table-card">
        <div className="card-header-custom">
          <h5>All Sermons</h5>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{sermons.length} sermons</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}></th>
                <th>Title</th>
                <th>Series</th>
                <th>Speaker</th>
                <th>Date</th>
                <th>Scripture</th>
                <th>Media</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sermons.map((sermon) => (
                <tr key={sermon.id}>
                  <td>
                    <button
                      onClick={() => toggleFeatured(sermon)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: sermon.featured ? '#F59E0B' : '#ccc', fontSize: '1.1rem', padding: 0 }}
                      title={sermon.featured ? 'Remove featured' : 'Set as featured'}
                    >
                      {sermon.featured ? <BsStarFill /> : <BsStar />}
                    </button>
                  </td>
                  <td style={{ fontWeight: 600 }}>{sermon.title}</td>
                  <td style={{ color: 'var(--text-medium)' }}>{sermon.series || '—'}</td>
                  <td style={{ color: 'var(--text-medium)' }}>{sermon.speaker}</td>
                  <td>{new Date(sermon.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td style={{ color: 'var(--text-medium)', fontSize: '0.85rem' }}>
                    {sermon.scripture ? (
                      <span><BsBookHalf className="me-1" />{sermon.scripture}</span>
                    ) : '—'}
                  </td>
                  <td>
                    {sermon.videoUrl ? (
                      <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>
                        <BsPlayCircle className="me-1" /> Video
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>
                  <td><span className={`status-badge ${sermon.status}`}>{sermon.status}</span></td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-admin btn-admin-outline" onClick={() => { setEditMode(true); setCurrent(sermon); setShowModal(true) }}>
                        <BsPencil />
                      </button>
                      <button className="btn-admin btn-admin-danger" onClick={() => { setDeleteId(sermon.id); setShowDelete(true) }}>
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
            {editMode ? 'Edit Sermon' : 'Add New Sermon'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={8}>
              <Form.Group>
                <Form.Label>Sermon Title</Form.Label>
                <Form.Control
                  value={current.title}
                  onChange={(e) => setCurrent({ ...current, title: e.target.value })}
                  placeholder='e.g. "Walking in Faith"'
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Series</Form.Label>
                <Form.Control
                  value={current.series}
                  onChange={(e) => setCurrent({ ...current, series: e.target.value })}
                  placeholder="e.g. Faith Foundations"
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
                <Form.Label>Scripture Reference</Form.Label>
                <Form.Control
                  value={current.scripture}
                  onChange={(e) => setCurrent({ ...current, scripture: e.target.value })}
                  placeholder="e.g. Hebrews 11:1-6"
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea" rows={3}
                  value={current.description}
                  onChange={(e) => setCurrent({ ...current, description: e.target.value })}
                  placeholder="Brief description of the sermon message..."
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Video URL</Form.Label>
                <Form.Control
                  value={current.videoUrl}
                  onChange={(e) => setCurrent({ ...current, videoUrl: e.target.value })}
                  placeholder="YouTube or video URL"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Audio URL</Form.Label>
                <Form.Control
                  value={current.audioUrl}
                  onChange={(e) => setCurrent({ ...current, audioUrl: e.target.value })}
                  placeholder="Audio file or podcast URL"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select value={current.status} onChange={(e) => setCurrent({ ...current, status: e.target.value })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Featured</Form.Label>
                <Form.Check
                  type="switch"
                  label="Mark as this week's sermon"
                  checked={current.featured}
                  onChange={(e) => setCurrent({ ...current, featured: e.target.checked })}
                  className="mt-2"
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            style={{ background: 'var(--gradient-primary)', border: 'none', fontWeight: 600 }}
          >
            {editMode ? 'Update Sermon' : 'Create Sermon'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this sermon? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete Sermon</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
