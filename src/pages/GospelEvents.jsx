import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { Container, Row, Col, Spinner, Badge } from 'react-bootstrap'
import {
  BsClock, BsGeoAlt, BsCalendarEvent, BsBoxArrowUpRight,
  BsChevronLeft, BsChevronRight,
} from 'react-icons/bs'
import { getUpcomingEvents, getOrgEvents, KNOWN_ORGANIZATIONS } from '../services/gospelEvents'
import { settingsAPI } from '../services/api'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export default function GospelEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [orgName, setOrgName] = useState('')

  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    async function load() {
      try {
        const siteSettings = await settingsAPI.get().catch(() => ({}))
        const orgId = siteSettings.gospelOrgId
        console.log('[GospelEvents] gospelOrgId from settings:', orgId)
        if (orgId) {
          const org = KNOWN_ORGANIZATIONS.find(o => o.id === Number(orgId))
          if (org) setOrgName(org.name)
        }
        const evts = orgId
          ? await getOrgEvents(orgId, 365)
          : await getUpcomingEvents({ maxDays: 365 })
        setEvents(evts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // ── Calendar helpers ──────────────────────────────────
  const eventsByDate = useMemo(() => {
    const map = new Map()
    for (const ev of events) {
      const d = new Date(ev.startDatetime)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(ev)
    }
    return map
  }, [events])

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const rows = []
    for (let i = 0; i < firstDay; i++) rows.push(null)
    for (let d = 1; d <= daysInMonth; d++) rows.push(d)
    return rows
  }, [year, month])

  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  function dk(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) || []) : []
  const catColors = ['var(--primary)', 'var(--secondary)', '#e74c3c', '#27ae60', '#8e44ad', '#e67e22']

  // ── Cards scroll navigation ──────────────────────────────
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScrollButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 4)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    checkScrollButtons()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', checkScrollButtons, { passive: true })
    window.addEventListener('resize', checkScrollButtons)
    return () => {
      el.removeEventListener('scroll', checkScrollButtons)
      window.removeEventListener('resize', checkScrollButtons)
    }
  }, [events, checkScrollButtons])

  function scrollCards(dir) {
    const el = scrollRef.current
    if (!el) return
    const card = el.querySelector('.ge-event-card')
    const cardW = card ? card.offsetWidth + 20 : 300
    el.scrollBy({ left: dir * cardW * 4, behavior: 'smooth' })
  }

  function formatTime(dt) {
    return new Date(dt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  return (
    <>
      <section className="page-header">
        <Container>
          <h1>Events</h1>
          <p>Upcoming events and calendar.</p>
        </Container>
      </section>

      <section className="events-section section-padding">
        <Container>
          {loading && (
            <div className="text-center py-5">
              <Spinner animation="border" style={{ color: 'var(--primary)' }} />
              <p className="mt-3 text-muted">Loading events...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-5">
              <p className="text-danger">Failed to load events. Please try again later.</p>
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="text-center py-5">
              <BsCalendarEvent size={48} className="text-muted mb-3" />
              <h5>No upcoming events</h5>
              <p className="text-muted">
                {orgName
                  ? <>No events found for <strong>{orgName}</strong>. This organization may not have any upcoming events listed.  Try selecting a different organization in Admin Settings.</>
                  : 'Check back later for upcoming events.'
                }
              </p>
            </div>
          )}

          {/* ===== EVENT CARDS — horizontal scroll row ===== */}
          {!loading && !error && events.length > 0 && (
            <>
              <div className="section-header mb-3">
                <h2 className="section-title">Upcoming Events</h2>
                <p className="section-description">
                  {events.length} event{events.length !== 1 ? 's' : ''} coming up
                </p>
              </div>

              <div className="ge-cards-wrapper">
                {canScrollLeft && (
                  <button className="ge-scroll-arrow ge-scroll-left" onClick={() => scrollCards(-1)}>
                    <BsChevronLeft />
                  </button>
                )}
                {canScrollRight && (
                  <button className="ge-scroll-arrow ge-scroll-right" onClick={() => scrollCards(1)}>
                    <BsChevronRight />
                  </button>
                )}
              <div className="ge-cards-scroll" ref={scrollRef}>
                {events.map(ev => {
                  const start = new Date(ev.startDatetime)
                  const day = start.getDate()
                  const month = start.toLocaleString('en-US', { month: 'short' })
                  return (
                    <div className="ge-event-card fade-in-up" key={ev.id}>
                      {ev.bannerThumbnailUrl && (
                        <div className="ge-event-image">
                          <img src={ev.bannerThumbnailUrl} alt={ev.title} loading="lazy" />
                          <div className="ge-event-date-overlay">
                            <div className="day">{day}</div>
                            <div className="month">{month}</div>
                          </div>
                        </div>
                      )}
                      <div className="ge-event-body">
                        <h5 className="ge-event-title">{ev.title}</h5>
                        <div className="ge-event-meta">
                          <span><BsClock className="me-1" />{formatTime(ev.startDatetime)} – {formatTime(ev.endDatetime)}</span>
                        </div>
                        {ev.localName && (
                          <div className="ge-event-meta">
                            <span><BsGeoAlt className="me-1" />{ev.localName}</span>
                          </div>
                        )}
                        {ev.city && (
                          <div className="ge-event-location">
                            {ev.city}{ev.state ? `, ${ev.state}` : ''}
                          </div>
                        )}
                        <div className="ge-event-tags">
                          {ev.categories?.map(c => (
                            <Badge key={c.id} className="ge-event-tag">{c.name}</Badge>
                          ))}
                        </div>
                        <div className="ge-event-actions">
                          <a
                            href={`https://www.mygospelevents.com/events/detail/${ev.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ge-details-btn"
                          >
                            Details <BsBoxArrowUpRight className="ms-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              </div>
            </>
          )}

          {/* ===== FULL CALENDAR ===== */}
          {!loading && !error && (
            <>
              <div className="section-header mt-5 mb-3">
                <h2 className="section-title">Calendar</h2>
              </div>

              <Row className="g-4">
                <Col lg={8}>
                  <div className="calendar-widget">
                    <div className="calendar-header">
                      <div className="calendar-title-group">
                        <button className="calendar-nav-btn" onClick={() => { setCurrentDate(new Date(year, month - 1, 1)); setSelectedDate(null) }}>
                          <BsChevronLeft />
                        </button>
                        <h3 className="calendar-month-title">
                          {MONTH_NAMES[month]} {year}
                        </h3>
                        <button className="calendar-nav-btn" onClick={() => { setCurrentDate(new Date(year, month + 1, 1)); setSelectedDate(null) }}>
                          <BsChevronRight />
                        </button>
                      </div>
                      <button className="calendar-today-btn" onClick={() => { setCurrentDate(new Date()); setSelectedDate(null) }}>Today</button>
                    </div>

                    <div className="calendar-grid">
                      {DAY_NAMES.map(d => (
                        <div key={d} className="calendar-day-name">{d}</div>
                      ))}
                      {cells.map((day, i) => {
                        if (day === null) return <div key={`e${i}`} className="calendar-cell empty" />
                        const key = dk(day)
                        const dayEvts = eventsByDate.get(key) || []
                        const isToday = key === todayKey
                        const isSelected = key === selectedDate
                        return (
                          <div
                            key={key}
                            className={`calendar-cell${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${dayEvts.length ? ' has-events' : ''}`}
                            onClick={() => setSelectedDate(key)}
                          >
                            <span className="calendar-day-number">{day}</span>
                            {dayEvts.length > 0 && (
                              <div className="calendar-dots">
                                {dayEvts.slice(0, 3).map((ev, j) => (
                                  <span key={ev.id} className="calendar-dot" style={{ backgroundColor: catColors[j % catColors.length] }} />
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="calendar-sidebar">
                    <h4 className="calendar-sidebar-title">
                      {selectedDate
                        ? new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', {
                            weekday: 'long', month: 'long', day: 'numeric',
                          })
                        : 'Select a date'}
                    </h4>

                    {!selectedDate && (
                      <p className="calendar-no-events">Click a date on the calendar to see events.</p>
                    )}

                    {selectedDate && selectedEvents.length === 0 && (
                      <p className="calendar-no-events">No events on this date.</p>
                    )}

                    {selectedEvents.map(ev => (
                      <div key={ev.id} className="calendar-event-card">
                        {ev.categories?.length > 0 && (
                          <div className="calendar-event-category" style={{ color: 'var(--secondary)' }}>
                            {ev.categories[0].name}
                          </div>
                        )}
                        <div className="calendar-event-title">{ev.title}</div>
                        <div className="calendar-event-meta">
                          <span><BsClock className="me-1" />{formatTime(ev.startDatetime)} – {formatTime(ev.endDatetime)}</span>
                        </div>
                        {ev.localName && (
                          <div className="calendar-event-meta">
                            <span><BsGeoAlt className="me-1" />{ev.localName}</span>
                          </div>
                        )}
                        {ev.city && (
                          <p className="calendar-event-desc">
                            {ev.city}{ev.state ? `, ${ev.state}` : ''}
                          </p>
                        )}
                        {ev.url && ev.isExternalEventUrl && (
                          <a href={ev.url} target="_blank" rel="noopener noreferrer" className="ge-event-link" style={{ fontSize: '0.82rem' }}>
                            More Info <BsBoxArrowUpRight className="ms-1" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Container>
      </section>
    </>
  )
}
