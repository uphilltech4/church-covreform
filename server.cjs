const jsonServer = require('json-server')
const fs = require('fs')
const path = require('path')

const DB_DIR = path.join(__dirname, 'db')
const PUBLIC_DATA_DIR = path.join(__dirname, 'public', 'data')
const PORT = 3001

const collections = ['events', 'staff', 'ministries', 'content', 'services', 'sermons']

function readDB() {
  const db = {}
  collections.forEach(name => {
    db[name] = JSON.parse(fs.readFileSync(path.join(DB_DIR, `${name}.json`), 'utf8'))
  })
  // Settings is a singleton object, not an array
  db.settings = JSON.parse(fs.readFileSync(path.join(DB_DIR, 'settings.json'), 'utf8'))
  return db
}

function writeDB(state) {
  collections.forEach(name => {
    const json = JSON.stringify(state[name], null, 2) + '\n'
    fs.writeFileSync(path.join(DB_DIR, `${name}.json`), json, 'utf8')
    fs.writeFileSync(path.join(PUBLIC_DATA_DIR, `${name}.json`), json, 'utf8')
  })
  const settingsJson = JSON.stringify(state.settings, null, 2) + '\n'
  fs.writeFileSync(path.join(DB_DIR, 'settings.json'), settingsJson, 'utf8')
  fs.writeFileSync(path.join(PUBLIC_DATA_DIR, 'settings.json'), settingsJson, 'utf8')
}

const server = jsonServer.create()
const router = jsonServer.router(readDB())
const middlewares = jsonServer.defaults()

server.use(middlewares)

// After any write operation, persist changes back to individual files
server.use((req, res, next) => {
  const original = res.send.bind(res)
  res.send = (body) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
      try {
        writeDB(router.db.getState())
      } catch (err) {
        console.error('Failed to write DB files:', err.message)
      }
    }
    return original(body)
  }
  next()
})

server.use(router)

server.listen(PORT, () => {
  console.log(`  JSON Server running on http://localhost:${PORT}`)
  console.log(`  Data files: ./db/*.json`)
  console.log()
})
