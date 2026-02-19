import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BsStar, BsPeople, BsHeart, BsBook, BsJoystick, BsFlower2, BsSunrise, BsHandThumbsUp, BsHouse, BsMortarboard } from 'react-icons/bs'
import { ministriesAPI } from '../services/api'

const iconMap = {
  "Discoveryland Kids Church": <BsStar size={28} />,
  'Community Groups': <BsPeople size={28} />,
  'Junior Youth': <BsJoystick size={28} />,
  'Senior Youth': <BsHeart size={28} />,
  "Ladies Connect Bible Study": <BsFlower2 size={28} />,
  "Sonrise Servants - Men's Prayer": <BsSunrise size={28} />,
  'Outreach': <BsHandThumbsUp size={28} />,
  'Good News Daycare': <BsHouse size={28} />,
  'Christian Preschool': <BsMortarboard size={28} />,
}

export default function Ministries() {
  const [ministries, setMinistries] = useState([])

  useEffect(() => {
    ministriesAPI.getAll()
      .then(data => setMinistries(data))
      .catch(err => console.error('Failed to load ministries:', err))
  }, [])

  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Ministries</h1>
          <p>Discover how you can grow, serve, and connect at Mitchell Christian Assembly.</p>
        </Container>
      </section>

      <section className="ministries-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Get Involved</div>
            <h2 className="section-title">There&apos;s a Place for You</h2>
            <p className="section-description">
              Whatever your age, interests, or stage of life, we have ministries 
              designed to help you grow in faith and connect with others.
            </p>
          </div>
          <Row className="g-4">
            {ministries.map((m) => (
              <Col md={6} lg={4} key={m.id}>
                <div className="ministry-card fade-in-up">
                  <div className="ministry-icon">{iconMap[m.name] || <BsStar size={28} />}</div>
                  <h4>{m.name}</h4>
                  <p>{m.description}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 500, marginTop: '0.8rem' }}>
                    {m.schedule}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  )
}
