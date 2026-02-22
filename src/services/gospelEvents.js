/**
 * My Gospel Events API client
 * Base: https://api.mygospelevents.com
 * Public endpoints only (no auth required)
 */

const BASE = 'https://api.mygospelevents.com'

const HEADERS = {
  Accept: 'application/json',
}

async function apiFetch(path) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  return res.json()
}

/** Fetch a single event by ID (JSON) */
export function getEvent(id) {
  return apiFetch(`/v1/events/${id}`)
}

/** Fetch all 13 event categories */
export function getCategories() {
  return apiFetch('/v1/category')
}

/**
 * Parse events directly from the embed HTML.
 * Extracts title, date, time, organization, image, external URL from each event-card.
 * @param {string} html – full embed HTML
 * @returns {object[]} array of event objects matching our component's expected shape
 */
function parseEmbedEvents(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const cards = doc.querySelectorAll('.event-card')
  const events = []

  cards.forEach((card, idx) => {
    const title = card.querySelector('.event-title')?.textContent?.trim() || ''
    const banner = card.querySelector('.event-banner img')
    const bannerUrl = banner?.getAttribute('src') || ''

    // Extract event ID from view-btn detail URL (thumbnail IDs are image IDs, not event IDs)
    const viewBtn = card.querySelector('.view-btn')
    const viewUrl = viewBtn?.getAttribute('href') || ''
    const idMatch = viewUrl.match(/\/detail\/(\d+)/)
    const id = idMatch ? parseInt(idMatch[1], 10) : idx + 1

    // Parse meta rows
    const metaRows = card.querySelectorAll('.event-meta-row span')
    let dateStr = '', timeStr = '', orgName = ''
    metaRows.forEach((span, i) => {
      const text = span.textContent.trim()
      if (i === 0) dateStr = text       // e.g. "February 22, 2026"
      else if (i === 1) timeStr = text   // e.g. "09:00 AM – 10:30 AM"
      else if (i === 2) orgName = text   // e.g. "Catch The Fire Church"
    })

    // Parse date + times
    let startDatetime = '', endDatetime = ''
    if (dateStr) {
      const timeParts = timeStr.split('–').map(t => t.trim())
      const startTime = timeParts[0] || '12:00 AM'
      const endTime = timeParts[1] || startTime
      const startD = new Date(`${dateStr} ${startTime}`)
      const endD = new Date(`${dateStr} ${endTime}`)
      if (!isNaN(startD)) startDatetime = startD.toISOString()
      if (!isNaN(endD)) endDatetime = endD.toISOString()
    }

    // Categories
    const cats = []
    card.querySelectorAll('.category-chip').forEach(chip => {
      cats.push({ id: cats.length + 1, name: chip.textContent.trim() })
    })

    events.push({
      id,
      title,
      bannerThumbnailUrl: bannerUrl,
      bannerOriginalUrl: bannerUrl.replace('/thumbnails/', '/images/'),
      startDatetime,
      endDatetime,
      localName: orgName,
      city: '',
      state: '',
      categories: cats,
      url: viewUrl,
      isExternalEventUrl: !!viewUrl,
      organizationId: 0,
    })
  })

  return events.sort((a, b) => new Date(a.startDatetime) - new Date(b.startDatetime))
}

/**
 * Fetch all upcoming events for a single organization.
 * Parses event data directly from embed HTML — no per-event API calls needed.
 * @param {number} orgId – organization ID
 * @param {number} maxDays – how many days ahead (default 120)
 */
export async function getOrgEvents(orgId, maxDays = 120) {
  const url = `${BASE}/v1/embed/all/events?org_ids=${orgId}&max_days=${maxDays}&events_layout=grid`
  console.log('[GospelEvents] Fetching embed for org', orgId, url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Embed ${res.status} for org ${orgId}`)
  const html = await res.text()
  console.log('[GospelEvents] Embed HTML length:', html.length)
  const events = parseEmbedEvents(html)
  console.log('[GospelEvents] Parsed', events.length, 'events for org', orgId)
  return events
}

/**
 * Fetch upcoming events for multiple organizations.
 * Uses the embed endpoint per org to discover IDs, then fetches JSON details.
 * @param {object} opts
 * @param {number[]} opts.orgIds – organization IDs to include (required)
 * @param {number}   opts.maxDays – how many days ahead (default 120)
 */
export async function getUpcomingEvents({ orgIds = [], maxDays = 120 } = {}) {
  if (orgIds.length === 0) {
    // If no org IDs specified, fall back to scanning
    return getUpcomingEventsByScan({ maxDays })
  }

  // Fetch event IDs for all orgs in parallel
  const orgResults = await Promise.allSettled(
    orgIds.map(id => getOrgEventIds(id, maxDays))
  )

  // Collect all unique event IDs
  const allIds = new Set()
  for (const r of orgResults) {
    if (r.status === 'fulfilled') {
      for (const id of r.value) allIds.add(id)
    }
  }

  if (allIds.size === 0) return []

  // Fetch JSON details for all events
  const results = await Promise.allSettled([...allIds].map(id => getEvent(id)))
  return results
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => new Date(a.startDatetime) - new Date(b.startDatetime))
}

/**
 * Fallback: Fetch events by scanning sequential IDs.
 * Used when no org IDs are specified.
 */
async function getUpcomingEventsByScan({ maxDays = 120, scanFrom = 1, scanTo = 500 } = {}) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const cutoff = new Date(now)
  cutoff.setDate(cutoff.getDate() + maxDays)

  const BATCH = 20
  const allEvents = []

  for (let start = scanFrom; start <= scanTo; start += BATCH) {
    const ids = Array.from({ length: Math.min(BATCH, scanTo - start + 1) }, (_, i) => start + i)
    const batch = await Promise.allSettled(ids.map(id => getEvent(id)))

    let notFoundCount = 0
    for (const result of batch) {
      if (result.status === 'fulfilled') {
        allEvents.push(result.value)
      } else {
        notFoundCount++
      }
    }
    if (notFoundCount === ids.length && start > 20) break
  }

  return allEvents
    .filter(ev => {
      const s = new Date(ev.startDatetime)
      return s >= now && s <= cutoff
    })
    .sort((a, b) => new Date(a.startDatetime) - new Date(b.startDatetime))
}

/**
 * Extract unique organizations from a list of events.
 * Returns sorted array of { id, name, city, state }.
 */
export function extractOrganizations(events) {
  const map = new Map()
  for (const ev of events) {
    if (!map.has(ev.organizationId)) {
      map.set(ev.organizationId, {
        id: ev.organizationId,
        name: ev.localName || 'Unknown Church',
        city: ev.city || '',
        state: ev.state || '',
      })
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Known organizations registry.
 * Discovered via API scanning — org IDs 2–18.
 * Each entry: { id, name, city, state }
 */
export const KNOWN_ORGANIZATIONS = [
  { id: 2,  name: 'Emmanuel Evangelical Free Church', city: 'Winnipeg', state: 'MB' },
  { id: 3,  name: 'Crossview Church', city: 'Winnipeg', state: 'MB' },
  { id: 4,  name: 'My Church Winnipeg', city: 'Winnipeg', state: 'MB' },
  { id: 5,  name: 'Soul Sanctuary', city: 'Winnipeg', state: 'MB' },
  { id: 6,  name: 'Winnipeg EFC', city: 'Winnipeg', state: 'MB' },
  { id: 7,  name: 'First Assembly', city: 'Calgary', state: 'AB' },
  { id: 8,  name: 'First Church of the Nazarene', city: 'Calgary', state: 'AB' },
  { id: 9,  name: 'Bow Valley Christian Church', city: 'Calgary', state: 'AB' },
  { id: 10, name: 'Redemption Church', city: 'Calgary', state: 'AB' },
  { id: 11, name: 'Pathway Community Church', city: 'Calgary', state: 'AB' },
  { id: 12, name: 'Grant Memorial Church', city: 'Winnipeg', state: 'MB' },
  { id: 13, name: 'Ellerslie Road Baptist Church', city: 'Edmonton', state: 'AB' },
  { id: 14, name: "St. John's Vancouver", city: 'Vancouver', state: 'BC' },
  { id: 15, name: 'Christian Life Centre', city: 'Winnipeg', state: 'MB' },
  { id: 16, name: 'Toronto City Church', city: 'Toronto', state: 'ON' },
  { id: 17, name: 'Catch The Fire', city: 'Toronto', state: 'ON' },
  { id: 18, name: 'Hope Church Toronto West', city: 'Toronto', state: 'ON' },
  { id: 19, name: 'Bloom Church Regina', city: 'Regina', state: 'SK' },
  { id: 20, name: 'Forest Grove Community Church', city: 'Vancouver', state: 'BC' },
  { id: 21, name: 'Centre Church', city: 'Winnipeg', state: 'MB' },
  { id: 22, name: 'Every Nations Vancouver', city: 'Vancouver', state: 'BC' },
  { id: 23, name: 'Ness Baptist Church', city: 'Winnipeg', state: 'MB' },
  { id: 24, name: 'Grunthal Abundant Life Fellowship', city: 'Grunthal', state: 'MB' },
  { id: 25, name: 'Impactus', city: 'Steinbach', state: 'MB' },
  { id: 26, name: 'Saints Church', city: 'Steinbach', state: 'MB' },
  { id: 27, name: 'Champion City Church', city: 'Edmonton', state: 'AB' },
  { id: 28, name: 'Edmonton Church of God', city: 'Edmonton', state: 'AB' },
]
