import { getFile, commitFiles, checkAuth, VALID_COLLECTIONS } from '../_lib/github.js'

export default async function handler(req, res) {
  const { collection, id } = req.query

  if (!VALID_COLLECTIONS.includes(collection)) {
    return res.status(404).json({ error: 'Collection not found' })
  }

  try {
    if (req.method === 'GET') {
      const { content: items } = await getFile(`public/data/${collection}.json`)
      const item = items.find(i => String(i.id) === String(id))
      if (!item) return res.status(404).json({ error: 'Item not found' })
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
      return res.status(200).json(item)
    }

    if (req.method === 'PUT') {
      if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const { content: items } = await getFile(`public/data/${collection}.json`)
      const index = items.findIndex(i => String(i.id) === String(id))
      if (index === -1) return res.status(404).json({ error: 'Item not found' })

      items[index] = { ...req.body, id: items[index].id }

      await commitFiles(
        [
          { path: `public/data/${collection}.json`, content: items },
          { path: `db/${collection}.json`, content: items },
        ],
        `Update ${collection}/${id} via admin panel`
      )
      return res.status(200).json(items[index])
    }

    if (req.method === 'DELETE') {
      if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const { content: items } = await getFile(`public/data/${collection}.json`)
      const filtered = items.filter(i => String(i.id) !== String(id))
      if (filtered.length === items.length) {
        return res.status(404).json({ error: 'Item not found' })
      }

      await commitFiles(
        [
          { path: `public/data/${collection}.json`, content: filtered },
          { path: `db/${collection}.json`, content: filtered },
        ],
        `Delete ${collection}/${id} via admin panel`
      )
      return res.status(200).json({})
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(`${collection}/${id} API error:`, err)
    return res.status(500).json({ error: err.message })
  }
}
