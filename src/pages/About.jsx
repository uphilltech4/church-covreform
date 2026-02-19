import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BsStar, BsBook, BsHeart, BsPeople } from 'react-icons/bs'
import { staffAPI } from '../services/api'

export default function About() {
  const [staff, setStaff] = useState([])

  useEffect(() => {
    staffAPI.getAll()
      .then(data => setStaff(data))
      .catch(err => console.error('Failed to load staff:', err))
  }, [])

  return (
    <>
      {/* Page Header */}
      <section className="page-header">
        <Container>
          <h1>About Us</h1>
          <p>We are a credo-baptist congregation committed to the principles of Reformed covenantal theology.</p>
        </Container>
      </section>

      {/* Mission Section */}
      <section className="about-section section-padding">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="about-image-wrapper">
                <img 
                  src="/images/about/community.jpg" 
                  alt="Church community"
                />
                <div className="about-badge">Steinbach, MB</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content">
                <div className="section-label">Who We Are</div>
                <h2>Committed to Reformed Covenantal Theology</h2>
                <p>
                  We are a growing demographically diverse congregation committed to the principles of Reformed
                  covenantal theology. Our foundation is the Bible, our desire is to see discipleship happen for
                  every person and we seek to elevate the gospel in all areas as our only hope of salvation.
                </p>
                <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                  What We Believe
                </h5>
                <ul className="about-list">
                  <li>
                    <span className="check-icon"><BsStar /></span>
                    The Bible is the written word of God, inspired by the Holy Spirit and without error
                  </li>
                  <li>
                    <span className="check-icon"><BsBook /></span>
                    Salvation is by God&apos;s grace alone, through faith alone, in Jesus Christ alone
                  </li>
                  <li>
                    <span className="check-icon"><BsHeart /></span>
                    God sovereignly chooses whom He will save based solely on His grace
                  </li>
                  <li>
                    <span className="check-icon"><BsPeople /></span>
                    The church is the covenant community of God where His grace is available to all
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Focus */}
      <section className="section-padding" style={{ background: 'var(--bg-cream)' }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="order-lg-2">
              <div className="about-image-wrapper">
                <img 
                  src="/images/about/bible-worship.jpg" 
                  alt="Bible and Faith"
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content">
                <div className="section-label">Our Beliefs</div>
                <h2>Our God is Awesome and Loving</h2>
                <p>
                  Our God is awesome and loving. He wants what is best for us and has offered us 
                  the incredible gift of eternal life with Him in a very real and wonderful place 
                  called Heaven. The gift is offered, but it is for us to choose and this free 
                  will is part of His incredible love for us.
                </p>
                <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginTop: '1.5rem', marginBottom: '1rem' }}>
                  The Scriptures
                </h5>
                <p>
                  The best way to get to know Him is through His words in the scriptures. The 
                  Bible has a lot of information and some great examples of God&apos;s love and His power.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Staff */}
      <section className="staff-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Our Team</div>
            <h2 className="section-title">Meet Our Pastors & Staff</h2>
            <p className="section-description">
              Our dedicated team serves with passion and purpose, committed to shepherding 
              our church family.
            </p>
          </div>
          <Row className="g-4">
            {staff.map((person) => (
              <Col md={6} key={person.id}>
                <div className="staff-card fade-in-up" style={{ height: '100%' }}>
                  {person.image && (
                    <div className="staff-card-image">
                      <img src={person.image} alt={person.name} />
                    </div>
                  )}
                  <div className="staff-card-body" style={{ padding: '2rem' }}>
                    <div style={{ 
                      display: 'inline-block',
                      background: 'var(--primary)', 
                      color: '#fff', 
                      fontSize: '0.75rem', 
                      fontWeight: 700, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.08em',
                      padding: '0.35rem 1rem', 
                      borderRadius: '2rem',
                      marginBottom: '0.75rem'
                    }}>
                      {person.role}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                      {person.name}
                    </h4>
                    {person.bio.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} style={{ lineHeight: 1.8, color: '#555' }}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}
