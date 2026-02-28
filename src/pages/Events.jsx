import { useState, useEffect } from 'react'
import { Container } from 'react-bootstrap'
import { settingsAPI } from '../services/api'
import {
  DEFAULT_EVENTS_EMBED_ID,
  DEFAULT_CALENDAR_EMBED_ID,
  buildEventsEmbedUrl,
  buildCalendarEmbedUrl,
} from '../services/gospelEvents'

const DEFAULT_EVENTS_EMBED = buildEventsEmbedUrl(DEFAULT_EVENTS_EMBED_ID)
const DEFAULT_CALENDAR_EMBED = buildCalendarEmbedUrl(DEFAULT_CALENDAR_EMBED_ID)

export default function Events() {
  const [eventsUrl, setEventsUrl] = useState(DEFAULT_EVENTS_EMBED)
  const [calendarUrl, setCalendarUrl] = useState(DEFAULT_CALENDAR_EMBED)

  useEffect(() => {
    settingsAPI.get()
      .then(data => {
        if (data.eventsEmbedId) setEventsUrl(buildEventsEmbedUrl(data.eventsEmbedId))
        else if (data.eventsEmbedUrl) setEventsUrl(data.eventsEmbedUrl)

        if (data.calendarEmbedId) setCalendarUrl(buildCalendarEmbedUrl(data.calendarEmbedId))
        else if (data.calendarEmbedUrl) setCalendarUrl(data.calendarEmbedUrl)
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Events</h1>
          <p>Stay connected with what&apos;s happening at Covenant Reformed Church.</p>
        </Container>
      </section>

      {/* Upcoming Events & Calendar */}
      <section className="events-section section-padding">
        <Container>
          <div style={{ borderRadius: 8, overflow: 'hidden' }}>
            <iframe
              src={eventsUrl}
              width="100%"
              height="550"
              style={{ border: 0, display: 'block' }}
              title="Church Events"
            />
          </div>

          <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', minHeight: 600, marginTop: '3rem' }}>
            <iframe
              src={calendarUrl}
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
