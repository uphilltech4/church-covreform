import { getFile, commitFiles, checkAuth, VALID_COLLECTIONS } from './_lib/github.js'

export default async function handler(req, res) {
  const { collection } = req.query

  if (!VALID_COLLECTIONS.includes(collection)) {
    return res.status(404).json({ error: 'Collection not found' })
  }

  try {
    if (req.method === 'GET') {
      const { content } = await getFile(`public/data/${collection}.json`)
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
      return res.status(200).json(content)
    }

    if (req.method === 'POST') {
      if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const newItem = req.body
      const { content: items } = await getFile(`public/data/${collection}.json`)

      // Generate next numeric ID
      const maxId = items.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0)
      newItem.id = maxId + 1
      items.push(newItem)

      await commitFiles(
        [
          { path: `public/data/${collection}.json`, content: items },
          { path: `db/${collection}.json`, content: items },
        ],
        `Add new ${collection.slice(0, -1)} via admin panel`
      )
      return res.status(201).json(newItem)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(`${collection} API error:`, err)
    return res.status(500).json({ error: err.message })
  }
}
