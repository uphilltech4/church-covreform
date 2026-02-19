import { useState, useEffect } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { BsCheck2, BsCheckCircleFill } from 'react-icons/bs'
import { settingsAPI } from '../../services/api'
import { useTheme, COLOR_THEMES } from '../../contexts/ThemeContext'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    churchName: '',
    tagline: '',
    email: '',
    phone: '',
    address: '',
    facebook: '',
    youtube: '',
    sundaySchool: '',
    celebrationService: '',
    powerKids: '',
    prayerTime: '',
    worshipService: '',
    kidsChurch: '',
    officeHours: '',
    affiliation: '',
    eventsEmbedUrl: '',
    calendarEmbedUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const { theme, changeTheme } = useTheme()

  useEffect(() => {
    settingsAPI.get()
      .then(data => {
        setSettings(data)
        if (data.colorTheme) changeTheme(data.colorTheme)
      })
      .catch(err => console.error('Failed to load settings:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleThemeChange = (themeKey) => {
    changeTheme(themeKey)
    setSettings({ ...settings, colorTheme: themeKey })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await settingsAPI.update({ ...settings, colorTheme: theme })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Failed to save settings:', err)
      alert('Failed to save. Make sure the JSON server is running.')
    }
  }

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value })
  }

  if (loading) return <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading settings...</div>

  return (
    <>
      <div className="mb-4">
        <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.3rem' }}>Settings</h3>
        <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem', margin: 0 }}>
          General church information and website configuration.
        </p>
      </div>

      {saved && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4" style={{ borderRadius: 12 }}>
          <BsCheck2 size={20} /> Settings saved successfully!
        </div>
      )}

      <Form onSubmit={handleSave}>
        {/* General Info */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>General Information</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Church Name</Form.Label>
                <Form.Control value={settings.churchName} onChange={(e) => handleChange('churchName', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Affiliation</Form.Label>
                <Form.Control value={settings.affiliation} onChange={(e) => handleChange('affiliation', e.target.value)} />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Tagline / Mission Statement</Form.Label>
                <Form.Control as="textarea" rows={2} value={settings.tagline} onChange={(e) => handleChange('tagline', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Contact Info */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Contact Information</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Email Address</Form.Label>
                <Form.Control type="email" value={settings.email} onChange={(e) => handleChange('email', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control value={settings.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="Enter phone number" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control value={settings.address} onChange={(e) => handleChange('address', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Office Hours</Form.Label>
                <Form.Control value={settings.officeHours} onChange={(e) => handleChange('officeHours', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Social Media */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Social Media</h5>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Facebook URL</Form.Label>
                <Form.Control value={settings.facebook} onChange={(e) => handleChange('facebook', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>YouTube URL</Form.Label>
                <Form.Control value={settings.youtube} onChange={(e) => handleChange('youtube', e.target.value)} placeholder="Enter YouTube channel URL" />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Service Times */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Service Times</h5>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Prayer Time</Form.Label>
                <Form.Control value={settings.prayerTime} onChange={(e) => handleChange('prayerTime', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Worship Service</Form.Label>
                <Form.Control value={settings.worshipService} onChange={(e) => handleChange('worshipService', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label>Kids Church (Discoveryland)</Form.Label>
                <Form.Control value={settings.kidsChurch} onChange={(e) => handleChange('kidsChurch', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Events Embed */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Events Embed</h5>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>Paste the full iframe URL for the events embed shown on the Events page.</p>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Events Embed URL</Form.Label>
                <Form.Control
                  value={settings.eventsEmbedUrl || ''}
                  onChange={(e) => handleChange('eventsEmbedUrl', e.target.value)}
                  placeholder="https://api.mygospelevents.com/v1/embed/..."
                />
                <Form.Text className="text-muted">The iframe src URL for the embedded events calendar.</Form.Text>
              </Form.Group>
            </Col>
          </Row>
        </div>

        {/* Calendar Embed */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Calendar Embed</h5>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>Paste the full iframe URL for the monthly calendar displayed below events on the Events page.</p>
          <Row className="g-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Calendar Embed URL</Form.Label>
                <Form.Control
                  value={settings.calendarEmbedUrl || ''}
                  onChange={(e) => handleChange('calendarEmbedUrl', e.target.value)}
                  placeholder="https://api.mygospelevents.com/v1/embed/calendar/..."
                />
                <Form.Text className="text-muted">The iframe src URL for the embedded monthly calendar view.</Form.Text>
              </Form.Group>
            </Col>
          </Row>
          {/* Calendar Preview */}
          {settings.calendarEmbedUrl && (
            <div style={{ marginTop: '1.5rem' }}>
              <h6 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Preview</h6>
              <div style={{ position: 'relative', width: '100%', height: 400, minHeight: 300 }}>
                <iframe
                  src={settings.calendarEmbedUrl}
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
        </div>

        {/* Color Theme */}
        <div className="admin-form-card mb-4">
          <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Color Theme</h5>
          <p style={{ color: 'var(--text-medium)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>Choose a color scheme for the website. Changes preview instantly.</p>
          <Row className="g-3">
            {Object.entries(COLOR_THEMES).map(([key, t]) => (
              <Col xs={6} md={4} key={key}>
                <div
                  onClick={() => handleThemeChange(key)}
                  style={{
                    cursor: 'pointer',
                    border: theme === key ? '3px solid var(--primary)' : '2px solid var(--border-light)',
                    borderRadius: 14,
                    padding: '1rem',
                    textAlign: 'center',
                    background: 'var(--bg-white)',
                    transition: 'var(--transition)',
                    position: 'relative',
                    boxShadow: theme === key ? '0 4px 16px rgba(0,0,0,0.12)' : 'var(--shadow-sm)',
                  }}
                >
                  {theme === key && (
                    <BsCheckCircleFill
                      size={20}
                      style={{ position: 'absolute', top: 8, right: 8, color: 'var(--primary)' }}
                    />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: '0.7rem' }}>
                    {t.preview.map((color, i) => (
                      <div
                        key={i}
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: color,
                          border: '2px solid rgba(0,0,0,0.08)',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#333' }}>{t.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="text-end">
          <Button type="submit" className="btn-admin btn-admin-primary" style={{ padding: '0.7rem 2rem' }}>
            Save Settings
          </Button>
        </div>
      </Form>
    </>
  )
}
