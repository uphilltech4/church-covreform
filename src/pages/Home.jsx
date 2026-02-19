import { useState, useEffect } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { 
  BsClock, BsBook, BsPeople, BsHeart, BsStar, 
  BsArrowRight, BsCalendarEvent, BsMusicNote 
} from 'react-icons/bs'
import { settingsAPI, ministriesAPI, eventsAPI, sermonsAPI } from '../services/api'

export default function Home() {
  const [settings, setSettings] = useState(null)
  const [ministries, setMinistries] = useState([])
  const [events, setEvents] = useState([])
  const [sermons, setSermons] = useState([])

  useEffect(() => {
    Promise.all([settingsAPI.get(), ministriesAPI.getAll(), eventsAPI.getAll(), sermonsAPI.getAll()])
      .then(([s, m, e, sr]) => {
        setSettings(s)
        setMinistries(m.slice(0, 4))
        // Filter upcoming/active and sort by date, show up to 4
        const upcoming = e
          .filter(ev => ev.status === 'upcoming' || ev.status === 'active')
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 4)
        setEvents(upcoming)
        // Latest published sermons, sorted by date descending
        const latest = sr
          .filter(sermon => sermon.status === 'published')
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
        setSermons(latest)
      })
      .catch(err => console.error('Failed to load home data:', err))
  }, [])

  const ministryIcons = [<BsStar />, <BsPeople />, <BsHeart />, <BsPeople />]

  const serviceTimes = settings ? [
    { icon: <BsHeart />, label: 'Breaking of Bread', value: settings.sundayBreakingOfBread || '10:00 AM' },
    { icon: <BsMusicNote />, label: 'Bible Teaching & Sunday School', value: settings.sundayBibleTeaching || '11:30 AM' },
    { icon: <BsStar />, label: 'Gospel Hour', value: settings.sundayGospelHour || '7:00 PM' },
  ] : []

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <div className="hero-content">
                <div className="hero-subtitle">Welcome to Covenant Reformed Church</div>
                <h1 className="hero-title">
                  <span className="highlight">&ldquo;Come to me,</span> all you who are weary and burdened and I will give you rest&rdquo;
                </h1>
                <p className="hero-text">
                  {settings?.tagline || 'A congregation committed to the Bible, discipleship and the gospel, and to the principles of Reformed theology.'}{' '}
                  — Matthew 11:28
                </p>
                <div className="hero-buttons">
                  <Button as={Link} to="/about" className="btn-hero-primary">
                    Learn More <BsArrowRight className="ms-2" />
                  </Button>
                  <Button as={Link} to="/online-services" className="btn-hero-secondary">
                    Watch Online
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={5} className="mt-4 mt-lg-0">
              <div className="service-times-card">
                <h4><BsClock className="me-2" />Service Times</h4>
                {serviceTimes.map((st, i) => (
                  <div className="service-time-item" key={i}>
                    <div className="time-icon">{st.icon}</div>
                    <div>
                      <div className="time-label">{st.label}</div>
                      <div className="time-value">{st.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* MISSION */}
      <section className="about-section section-padding">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="about-image-wrapper">
                <img 
                  src="/images/about/bible-worship.jpg" 
                  alt="Bible and worship"
                />
                <div className="about-badge">
                  {settings?.affiliation || 'Non-Denominational'}
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content">
                <div className="section-label">Our Mission</div>
                <h2>Committed to the Bible, Discipleship and the Gospel</h2>
                <p>
                  Covenant Reformed Church is a congregation of sinners saved by God's sovereign grace, committed to the principles of Reformed theology.
                </p>
                <ul className="about-list">
                  <li>
                    <span className="check-icon"><BsStar /></span>
                    Committed to the authority of the Bible
                  </li>
                  <li>
                    <span className="check-icon"><BsBook /></span>
                    Growing in God&apos;s Word together
                  </li>
                  <li>
                    <span className="check-icon"><BsHeart /></span>
                    Saved by God&apos;s sovereign grace
                  </li>
                  <li>
                    <span className="check-icon"><BsPeople /></span>
                    Come as you are — all are welcome
                  </li>
                </ul>
                <Button as={Link} to="/about" className="btn-hero-primary mt-3">
                  About Us <BsArrowRight className="ms-2" />
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* MINISTRIES PREVIEW */}
      <section className="ministries-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Get Involved</div>
            <h2 className="section-title">Our Ministries</h2>
            <p className="section-description">
              There&apos;s a place for everyone at Covenant Reformed Church. Discover how you can grow, serve, and connect.
            </p>
          </div>
          <Row className="g-4">
            {ministries.map((m, i) => (
              <Col md={6} lg={3} key={m.id}>
                <div className="ministry-card fade-in-up">
                  <div className="ministry-icon">{ministryIcons[i] || <BsStar />}</div>
                  <h4>{m.name}</h4>
                  <p>{m.description}</p>
                </div>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/ministries" variant="outline-dark" className="mt-3" style={{ borderRadius: 10, fontWeight: 600 }}>
              View All Ministries <BsArrowRight className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* EVENTS */}
      <section className="events-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">What&apos;s Happening</div>
            <h2 className="section-title">Upcoming Events</h2>
            <p className="section-description">
              Stay connected and join us for worship, fellowship, and community.
            </p>
          </div>
          <Row className="g-4">
            {events.map((ev) => {
              const d = new Date(ev.date + 'T00:00:00')
              const day = d.getDate()
              const month = d.toLocaleString('en-US', { month: 'short' })
              return (
                <Col md={6} lg={3} key={ev.id}>
                  <div className="event-card fade-in-up">
                    <div className="d-flex">
                      <div className="event-date-badge">
                        <div className="day">{day}</div>
                        <div className="month">{month}</div>
                      </div>
                      <div className="event-card-body">
                        <h5>{ev.title}</h5>
                        <div className="event-time"><BsClock className="me-1" /> {ev.time}</div>
                        <span className="event-tag">{ev.category}</span>
                      </div>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
          <div className="text-center mt-4">
            <Button as={Link} to="/events" variant="outline-dark" className="mt-3" style={{ borderRadius: 10, fontWeight: 600 }}>
              See All Events <BsCalendarEvent className="ms-2" />
            </Button>
          </div>
        </Container>
      </section>

      {/* SERMONS OF THE WEEK */}
      <section className="sermons-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Listen & Grow</div>
            <h2 className="section-title">Sermons of the Week</h2>
            <p className="section-description">
              Catch up on recent messages and be encouraged in your faith journey.
            </p>
          </div>
          <Row className="g-4">
            {sermons.map((sermon) => {
              const d = new Date(sermon.date + 'T00:00:00')
              const day = d.getDate()
              const month = d.toLocaleString('en-US', { month: 'short' })
              return (
                <Col md={6} lg={4} key={sermon.id}>
                  <div className="sermon-card fade-in-up">
                    <div className="sermon-card-header">
                      <div className="sermon-date-badge">
                        <div className="day">{day}</div>
                        <div className="month">{month}</div>
                      </div>
                      {sermon.featured && (
                        <span className="sermon-featured-tag">This Week</span>
                      )}
                    </div>
                    <div className="sermon-card-body">
                      <h5>{sermon.title}</h5>
                      {sermon.series && <div className="sermon-series">{sermon.series}</div>}
                      <div className="sermon-meta">
                        <span><BsBook className="me-1" />{sermon.scripture || 'Scripture TBD'}</span>
                        <span><BsPeople className="me-1" />{sermon.speaker}</span>
                      </div>
                      <p className="sermon-desc">{sermon.description}</p>
                      {sermon.videoUrl && (
                        <a href={sermon.videoUrl} target="_blank" rel="noopener noreferrer" className="sermon-watch-link">
                          <BsArrowRight className="me-1" /> Watch Now
                        </a>
                      )}
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section className="giving-section section-padding">
        <Container className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-label" style={{ color: 'var(--secondary-light)' }}>Join Us</div>
          <h2 style={{ color: 'white', marginBottom: '1.2rem' }}>You Are Welcome Here</h2>
          <p style={{ maxWidth: 600, margin: '0 auto 2rem', color: 'rgba(255,255,255,0.75)' }}>
            Whether you&apos;re new to faith or have been walking with God for years, there&apos;s 
            a place for you at {settings?.churchName || 'Covenant Reformed Church'}. Come as you are and experience the 
            warmth of our church family.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Button as={Link} to="/contact" className="btn-hero-primary">
              Plan Your Visit
            </Button>
            <Button as={Link} to="/giving" className="btn-hero-secondary">
              Support Our Mission
            </Button>
          </div>
        </Container>
      </section>
    </>
  )
}
