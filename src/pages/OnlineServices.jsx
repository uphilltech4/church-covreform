import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BsPlayCircle, BsFacebook, BsYoutube, BsCalendarEvent } from 'react-icons/bs'
import { servicesAPI } from '../services/api'

function getYouTubeEmbed(url) {
  if (!url) return null
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/)
  return m ? `https://www.youtube.com/embed/${m[1]}` : null
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function OnlineServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    servicesAPI.getAll()
      .then(data => {
        const published = data.filter(s => s.status === 'published')
        published.sort((a, b) => new Date(b.date) - new Date(a.date))
        setServices(published)
      })
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false))
  }, [])

  const featured = services.find(s => s.featured) || services[0]
  const rest = services.filter(s => s !== featured)

  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Online Services</h1>
          <p>Can&apos;t make it in person? Join us online for worship and the Word.</p>
        </Container>
      </section>

      <section className="online-services-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Watch Online</div>
            <h2 className="section-title">Join Us From Anywhere</h2>
            <p className="section-description">
              Our Sunday services are available online. Watch live or catch up on past messages.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>Loading services...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-5" style={{ color: 'var(--text-medium)' }}>No services available yet. Check back soon!</div>
          ) : (
            <>
              {/* Featured Video */}
              {featured && (
                <div className="video-card mb-5" style={{ maxWidth: 800, margin: '0 auto 3rem' }}>
                  {getYouTubeEmbed(featured.videoUrl) ? (
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
                      <iframe
                        src={getYouTubeEmbed(featured.videoUrl)}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={featured.title}
                      />
                    </div>
                  ) : featured.videoUrl ? (
                    <a href={featured.videoUrl} target="_blank" rel="noopener noreferrer">
                      <div className="video-placeholder" style={{ height: 400 }}>
                        <BsPlayCircle size={80} style={{ position: 'relative', zIndex: 1, opacity: 0.8 }} />
                      </div>
                    </a>
                  ) : (
                    <div className="video-placeholder" style={{ height: 400 }}>
                      <BsPlayCircle size={80} style={{ position: 'relative', zIndex: 1, opacity: 0.8 }} />
                    </div>
                  )}
                  <div className="video-card-body text-center">
                    <span className="event-tag mb-2">{featured.featured ? 'Featured Service' : 'Latest Service'}</span>
                    <h4 style={{ fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
                      {featured.title}
                    </h4>
                    <p style={{ color: 'var(--text-medium)', fontSize: '0.92rem' }}>
                      <BsCalendarEvent className="me-1" /> {formatDate(featured.date)} &bull; {featured.speaker}
                    </p>
                  </div>
                </div>
              )}

              {/* Recent Services */}
              {rest.length > 0 && (
                <>
                  <h3 className="text-center mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Recent Services</h3>
                  <Row className="g-4">
                    {rest.map((service) => (
                      <Col md={6} lg={4} key={service.id}>
                        <div className="video-card">
                          {getYouTubeEmbed(service.videoUrl) ? (
                            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                              <iframe
                                src={getYouTubeEmbed(service.videoUrl)}
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title={service.title}
                              />
                            </div>
                          ) : service.videoUrl ? (
                            <a href={service.videoUrl} target="_blank" rel="noopener noreferrer">
                              <div className="video-placeholder">
                                <BsPlayCircle size={50} style={{ position: 'relative', zIndex: 1, opacity: 0.7 }} />
                              </div>
                            </a>
                          ) : (
                            <div className="video-placeholder">
                              <BsPlayCircle size={50} style={{ position: 'relative', zIndex: 1, opacity: 0.7 }} />
                            </div>
                          )}
                          <div className="video-card-body">
                            <h5 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: '0.5rem' }}>
                              {service.title}
                            </h5>
                            <p style={{ color: 'var(--text-medium)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                              <BsCalendarEvent className="me-1" /> {formatDate(service.date)}
                            </p>
                            <p style={{ color: 'var(--secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                              {service.speaker}
                            </p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </>
          )}

          {/* Social Links */}
          <div className="text-center mt-5 p-4" style={{ background: 'white', borderRadius: 20, boxShadow: 'var(--shadow-sm)' }}>
            <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Follow Along</h4>
            <p style={{ color: 'var(--text-medium)', maxWidth: 500, margin: '0 auto 1.5rem' }}>
              Stay connected with us on social media for updates, encouragement, and live streams.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <a 
                href="https://www.facebook.com/people/Christian-Life-Centre/100064390823405/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-primary"
                style={{ borderRadius: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <BsFacebook /> Facebook
              </a>
              <a 
                href="#"
                className="btn btn-outline-danger"
                style={{ borderRadius: 10, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}
              >
                <BsYoutube /> YouTube
              </a>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
