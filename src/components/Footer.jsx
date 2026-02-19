import { useState, useEffect } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { BsFacebook, BsEnvelope, BsYoutube } from 'react-icons/bs'
import { settingsAPI } from '../services/api'

export default function Footer() {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    settingsAPI.get()
      .then(data => setSettings(data))
      .catch(() => {})
  }, [])

  return (
    <footer className="footer-section">
      <Container>
        <Row className="g-4">
          <Col lg={4}>
            <h5>{settings?.churchName || 'Mitchell Christian Assembly'}</h5>
            <p style={{ fontSize: '0.92rem', lineHeight: 1.8 }}>
              {settings?.tagline || 'Reaching Up and Moving Out — reaching to God for our direction and moving to connect with others.'}
            </p>
            <div className="footer-social mt-3">
              <a href={settings?.facebook || '#'} target="_blank" rel="noopener noreferrer">
                <BsFacebook />
              </a>
              <a href={`mailto:${settings?.email || ''}`}>
                <BsEnvelope />
              </a>
              <a href={settings?.youtube || '#'} target="_blank" rel="noopener noreferrer">
                <BsYoutube />
              </a>
            </div>
          </Col>
          <Col lg={2} md={4}>
            <h5>Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/ministries">Ministries</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={4}>
            <h5>Ministries</h5>
            <ul className="footer-links">
              <li><Link to="/ministries">Discoveryland Kids Church</Link></li>
              <li><Link to="/ministries">Community Groups</Link></li>
              <li><Link to="/ministries">Junior &amp; Senior Youth</Link></li>
              <li><Link to="/ministries">Ladies Connect</Link></li>
              <li><Link to="/ministries">Sonrise Servants</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={4}>
            <h5>Service Times</h5>
            <ul className="footer-links">
              <li><span>Prayer Time: {settings?.prayerTime || '8:45 AM'}</span></li>
              <li><span>Worship Service: {settings?.worshipService || '9:30 AM'}</span></li>
              <li><span>Kids Church: {settings?.kidsChurch || '9:30 AM (Sept – June)'}</span></li>
            </ul>
            <h5 className="mt-3">Contact</h5>
            <ul className="footer-links">
              <li><span>{settings?.email || ''}</span></li>
              <li><span>{settings?.address || 'Mitchell, Manitoba'}</span></li>
            </ul>
          </Col>
        </Row>
        <div className="footer-bottom text-center">
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            &copy; {new Date().getFullYear()} {settings?.churchName || 'Mitchell Christian Assembly'}. All rights reserved. | {settings?.affiliation || 'Non-Denominational'}
          </p>
          <p style={{ fontSize: '0.78rem', margin: '0.3rem 0 0' }}>
            Powered by <a href="https://www.uphilltech.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--secondary-light)' }}>Uphilltech</a>
          </p>
        </div>
      </Container>
    </footer>
  )
}
