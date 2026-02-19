import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { settingsAPI } from '../services/api'

const DEFAULT_EMBED = 'https://api.mygospelevents.com/v1/embed/calendar/month?organization_id=15&primary=%2300007A'

export default function Calendar() {
  const [embedUrl, setEmbedUrl] = useState(DEFAULT_EMBED)

  useEffect(() => {
    settingsAPI.get()
      .then(data => { if (data.calendarEmbedUrl) setEmbedUrl(data.calendarEmbedUrl) })
      .catch(() => {})
  }, [])

  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Church Calendar</h1>
          <p>View all upcoming services, events, and activities at Covenant Reformed Church.</p>
        </Container>
      </section>

      <section className="events-section section-padding">
        <Container>
          <div className="section-header">
            <div className="section-label">Monthly Calendar</div>
            <h2 className="section-title">What&apos;s Coming Up</h2>
            <p className="section-description">
              Stay up to date with everything happening at Covenant Reformed Church throughout the month.
            </p>
          </div>
          <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', minHeight: 600 }}>
            <iframe
              src={embedUrl}
              title="Church Calendar"
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
        </Container>
      </section>
    </>
  )
}
