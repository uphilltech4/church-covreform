import { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Modal } from 'react-bootstrap'
import { BsPencil, BsEye, BsCheck2 } from 'react-icons/bs'
import { contentAPI } from '../../services/api'

export default function AdminContent() {
  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    contentAPI.getAll()
      .then(data => setPages(data))
      .catch(err => console.error('Failed to load content:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = (page) => {
    setCurrentPage({ ...page })
    setShowModal(true)
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      const updated = { ...currentPage, lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
      await contentAPI.update(currentPage.id, updated)
      setPages(pages.map(p => p.id === currentPage.id ? updated : p))
      setSaved(true)
      setTimeout(() => { setSaved(false); setShowModal(false) }, 1500)
    } catch (err) {
      console.error('Failed to save content:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading content...</div>

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Content Pages</h3>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
            Edit page content, headers, and descriptions.
          </p>
        </div>
      </div>

      <div className="admin-table-card">
        <div className="card-header-custom">
          <h5>Website Pages</h5>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>{pages.length} pages</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Page Name</th>
                <th>URL Path</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page) => (
                <tr key={page.id}>
                  <td style={{ fontWeight: 600 }}>{page.name}</td>
                  <td style={{ color: 'var(--text-medium)', fontFamily: 'monospace', fontSize: '0.85rem' }}>{page.slug}</td>
                  <td><span className={`status-badge ${page.status}`}>{page.status}</span></td>
                  <td style={{ color: 'var(--text-light)', fontSize: '0.88rem' }}>{page.lastUpdated}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button className="btn-admin btn-admin-outline" onClick={() => handleEdit(page)}>
                        <BsPencil /> Edit
                      </button>
                      <a href={page.slug} target="_blank" rel="noopener noreferrer" className="btn-admin btn-admin-outline">
                        <BsEye /> View
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-heading)' }}>
            Edit: {currentPage?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentPage && (
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Page Title</Form.Label>
                  <Form.Control value={currentPage.heroTitle} onChange={(e) => setCurrentPage({ ...currentPage, heroTitle: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Subtitle / Label</Form.Label>
                  <Form.Control value={currentPage.heroSubtitle} onChange={(e) => setCurrentPage({ ...currentPage, heroSubtitle: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Form.Select value={currentPage.status} onChange={(e) => setCurrentPage({ ...currentPage, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group>
                  <Form.Label>Description Text</Form.Label>
                  <Form.Control as="textarea" rows={4} value={currentPage.heroText} onChange={(e) => setCurrentPage({ ...currentPage, heroText: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
          )}
          {saved && (
            <div className="alert alert-success mt-3 d-flex align-items-center gap-2" style={{ borderRadius: 12 }}>
              <BsCheck2 /> Changes saved successfully!
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 10 }}>Cancel</Button>
          <button className="btn-admin btn-admin-primary" onClick={handleSave}>
            Save Changes
          </button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
