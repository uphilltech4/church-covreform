import { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { BsCheck2 } from 'react-icons/bs'
import { settingsAPI } from '../../services/api'

export default function AdminCalendar() {
  const [embedUrl, setEmbedUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    settingsAPI.get()
      .then(data => { if (data.calendarEmbedUrl) setEmbedUrl(data.calendarEmbedUrl) })
      .catch(err => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const current = await settingsAPI.get()
      await settingsAPI.update({ ...current, calendarEmbedUrl: embedUrl })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save calendar settings:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading...</div>

  return (
    <>
      <div className="mb-4">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Calendar Management</h3>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
          Configure the embedded calendar displayed on the Calendar page.
        </p>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" style={{ borderRadius: 12 }}>
          <BsCheck2 size={20} /> Calendar settings saved successfully!
        </div>
      )}

      <Form onSubmit={handleSave}>
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Calendar Embed</h5>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
            Paste the full iframe URL for the calendar embed shown on the Calendar page.
          </p>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Calendar Embed URL</Form.Label>
                <Form.Control
                  value={embedUrl}
                  onChange={(e) => setEmbedUrl(e.target.value)}
                  placeholder="https://api.mygospelevents.com/v1/embed/calendar/..."
                />
                <Form.Text className="text-muted">The iframe src URL for the embedded calendar view.</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Preview */}
        {embedUrl && (
          <div className="admin-form-card mb-4">
            <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Preview</h5>
            <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 350px)', minHeight: 400 }}>
              <iframe
                src={embedUrl}
                title="Calendar Preview"
                scrolling="no"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                  borderRadius: 8,
                  overflow: 'hidden',
                }}
              />
            </div>
          </div>
        )}

        <div className="text-end">
          <Button type="submit" className="btn-admin btn-admin-primary" style={{ padding: '0.7rem 2rem' }}>
            Save Settings
          </Button>
        </div>
      </Form>
    </>
  )
}
