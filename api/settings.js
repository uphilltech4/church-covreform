import { getFile, commitFiles, checkAuth } from './_lib/github.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { content } = await getFile('public/data/settings.json')
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
      return res.status(200).json(content)
    }

    if (req.method === 'PUT') {
      if (!checkAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' })
      }
      const data = req.body
      await commitFiles(
        [
          { path: 'public/data/settings.json', content: data },
          { path: 'db/settings.json', content: data },
        ],
        'Update settings via admin panel'
      )
      return res.status(200).json(data)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('Settings API error:', err)
    return res.status(500).json({ error: err.message })
  }
}
