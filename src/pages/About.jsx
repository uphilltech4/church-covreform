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
          <p>Mitchell Christian Assembly is a group of Christians who simply gather in the name of the Lord Jesus Christ.</p>
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
                <div className="about-badge">Mitchell, MB</div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="about-content">
                <div className="section-label">Who We Are</div>
                <h2>Reaching Up and Moving Out</h2>
                <p>
                  We are a company of Christians from many backgrounds, cultures, nationalities and many walks of life
                  who simply gather in the name of the Lord Jesus Christ.
                </p>
                <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                  Who is our God?
                </h5>
                <ul className="about-list">
                  <li>
                    <span className="check-icon"><BsStar /></span>
                    We believe in the one God, Jehovah creator of heaven and earth
                  </li>
                  <li>
                    <span className="check-icon"><BsBook /></span>
                    He gave us eternal life through the sacrifice of His son Jesus Christ
                  </li>
                  <li>
                    <span className="check-icon"><BsHeart /></span>
                    He works through us with the Holy Spirit
                  </li>
                  <li>
                    <span className="check-icon"><BsPeople /></span>
                    He offers us the incredible gift of eternal life
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
