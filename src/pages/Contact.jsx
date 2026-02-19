import { useState, useEffect } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { BsGeoAlt, BsEnvelope, BsTelephone, BsClock, BsFacebook } from 'react-icons/bs'
import { settingsAPI } from '../services/api'

export default function Contact() {
  const [settings, setSettings] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    settingsAPI.get()
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  const contactInfo = [
    { icon: <BsGeoAlt />, label: 'Address', value: settings?.address || 'Mitchell, MB R0G 1L0' },
    { icon: <BsEnvelope />, label: 'Email', value: settings?.email || '' },
    { icon: <BsTelephone />, label: 'Phone', value: settings?.phone || '204-434-6829 ext 1' },
    { icon: <BsClock />, label: 'Office Hours', value: settings?.officeHours || 'Mon — Fri: 8:00 AM — 12:00 PM' },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setFormData({ name: '', email: '', subject: '', message: '' })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Contact Us</h1>
          <p>We&apos;d love to hear from you. Reach out anytime!</p>
        </Container>
      </section>

      <section className="contact-section section-padding">
        <Container>
          <Row className="g-4 mb-5">
            {contactInfo.map((info, i) => (
              <Col md={6} lg={3} key={i}>
                <div className="contact-info-card">
                  <div className="contact-icon">{info.icon}</div>
                  <div>
                    <h6>{info.label}</h6>
                    <p>{info.value}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <div className="contact-form-wrapper">
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>Send Us a Message</h3>
                <p style={{ color: 'var(--text-medium)', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  Whether you have a question, prayer request, or just want to say hello, 
                  we&apos;re here for you.
                </p>
                {submitted && (
                  <div className="alert alert-success" style={{ borderRadius: 12 }}>
                    Thank you for your message! We&apos;ll get back to you soon.
                  </div>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control 
                          type="email" 
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Subject</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Message</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={5}
                          placeholder="Your message..."
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Button type="submit" className="btn-hero-primary" style={{ width: '100%' }}>
                        Send Message
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
            <Col lg={5}>
              <div style={{ background: 'white', borderRadius: 20, padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
                <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Find Us</h5>
                <div style={{ background: '#f0f0f0', borderRadius: 12, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  <BsGeoAlt className="me-2" /> {settings?.address || 'Mitchell, MB R0G 1L0'}
                </div>
                <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Connect Online</h5>
                <div className="d-flex gap-2 flex-column">
                  <a 
                    href={settings?.facebook || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                    style={{ borderRadius: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <BsFacebook /> Follow on Facebook
                  </a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}
