const API_BASE = '/api'
const DATA_BASE = '/data'

// ── Admin auth token (sent with write requests) ──────────────────
let _adminToken = null
export function setAdminToken(token) { _adminToken = token }

function writeHeaders() {
  const h = { 'Content-Type': 'application/json' }
  if (_adminToken) h['x-admin-secret'] = _adminToken
  return h
}

// Detect if API is available (json-server locally, serverless on Vercel).
// Public reads fall back to static /data/*.json files when the API is down.
let _apiAvailable = null
async function isAPIAvailable() {
  if (_apiAvailable !== null) return _apiAvailable
  try {
    const res = await fetch(`${API_BASE}/settings`, { signal: AbortSignal.timeout(1500) })
    _apiAvailable = res.ok
  } catch {
    _apiAvailable = false
  }
  return _apiAvailable
}

// ── Generic helpers ──────────────────────────────────────────────

async function fetchJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`GET ${url} → ${res.status}`)
  return res.json()
}

// Smart read: try API first, fall back to static JSON
async function readCollection(name) {
  if (await isAPIAvailable()) {
    return fetchJSON(`${API_BASE}/${name}`)
  }
  return fetchJSON(`${DATA_BASE}/${name}.json`)
}

async function readSingleton(name) {
  if (await isAPIAvailable()) {
    return fetchJSON(`${API_BASE}/${name}`)
  }
  return fetchJSON(`${DATA_BASE}/${name}.json`)
}

async function readById(collection, id) {
  if (await isAPIAvailable()) {
    return fetchJSON(`${API_BASE}/${collection}/${id}`)
  }
  // Static fallback: load entire file and filter
  const all = await fetchJSON(`${DATA_BASE}/${collection}.json`)
  const item = all.find(i => i.id === id || i.id === Number(id))
  if (!item) throw new Error(`${collection}/${id} not found`)
  return item
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: writeHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`POST ${url} → ${res.status}`)
  return res.json()
}

async function putJSON(url, body) {
  const res = await fetch(url, {
    method: 'PUT',
    headers: writeHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PUT ${url} → ${res.status}`)
  return res.json()
}

async function deleteJSON(url) {
  const res = await fetch(url, { method: 'DELETE', headers: writeHeaders() })
  if (!res.ok) throw new Error(`DELETE ${url} → ${res.status}`)
  return true
}

// ── Events ───────────────────────────────────────────────────────

export const eventsAPI = {
  getAll:   ()          => readCollection('events'),
  getById:  (id)        => readById('events', id),
  create:   (event)     => postJSON(`${API_BASE}/events`, event),
  update:   (id, event) => putJSON(`${API_BASE}/events/${id}`, event),
  delete:   (id)        => deleteJSON(`${API_BASE}/events/${id}`),
}

// ── Staff ────────────────────────────────────────────────────────

export const staffAPI = {
  getAll:   ()          => readCollection('staff'),
  getById:  (id)        => readById('staff', id),
  create:   (member)    => postJSON(`${API_BASE}/staff`, member),
  update:   (id, member)=> putJSON(`${API_BASE}/staff/${id}`, member),
  delete:   (id)        => deleteJSON(`${API_BASE}/staff/${id}`),
}

// ── Ministries ───────────────────────────────────────────────────

export const ministriesAPI = {
  getAll:   ()              => readCollection('ministries'),
  getById:  (id)            => readById('ministries', id),
  create:   (ministry)      => postJSON(`${API_BASE}/ministries`, ministry),
  update:   (id, ministry)  => putJSON(`${API_BASE}/ministries/${id}`, ministry),
  delete:   (id)            => deleteJSON(`${API_BASE}/ministries/${id}`),
}

// ── Content Pages ────────────────────────────────────────────────

export const contentAPI = {
  getAll:   ()            => readCollection('content'),
  getById:  (id)          => readById('content', id),
  update:   (id, page)    => putJSON(`${API_BASE}/content/${id}`, page),
}

// ── Services (online service videos) ─────────────────────────────

export const servicesAPI = {
  getAll:   ()              => readCollection('services'),
  getById:  (id)            => readById('services', id),
  create:   (service)       => postJSON(`${API_BASE}/services`, service),
  update:   (id, service)   => putJSON(`${API_BASE}/services/${id}`, service),
  delete:   (id)            => deleteJSON(`${API_BASE}/services/${id}`),
}

// ── Sermons ──────────────────────────────────────────────────────

export const sermonsAPI = {
  getAll:   ()              => readCollection('sermons'),
  getById:  (id)            => readById('sermons', id),
  create:   (sermon)        => postJSON(`${API_BASE}/sermons`, sermon),
  update:   (id, sermon)    => putJSON(`${API_BASE}/sermons/${id}`, sermon),
  delete:   (id)            => deleteJSON(`${API_BASE}/sermons/${id}`),
}

// ── Settings (singleton — json-server stores as an object) ───────

export const settingsAPI = {
  get:    ()              => readSingleton('settings'),
  update: (settings)      => putJSON(`${API_BASE}/settings`, settings),
}
