const OWNER = process.env.GITHUB_REPO_OWNER || 'uphilltech4'
const REPO = process.env.GITHUB_REPO_NAME || 'church-covreform'
const BRANCH = process.env.GITHUB_BRANCH || 'main'

const VALID_COLLECTIONS = ['events', 'staff', 'ministries', 'content', 'services', 'sermons']

function ghHeaders() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  }
}

/**
 * Read a JSON file from the GitHub repo.
 * Returns { content: <parsed JSON>, sha: <file SHA> }
 */
async function getFile(path) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${BRANCH}`
  const res = await fetch(url, { headers: ghHeaders() })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub GET ${path}: ${res.status} ${text}`)
  }
  const data = await res.json()
  const decoded = Buffer.from(data.content, 'base64').toString('utf8')
  // Strip UTF-8 BOM if present (prevents JSON.parse failures)
  const clean = decoded.charCodeAt(0) === 0xFEFF ? decoded.slice(1) : decoded
  return { content: JSON.parse(clean), sha: data.sha }
}

/**
 * Commit multiple files to the repo in a single atomic commit.
 * files: [{ path: 'public/data/x.json', content: <object> }]
 */
async function commitFiles(files, message) {
  const h = ghHeaders()

  // 1. Get the latest commit SHA on the branch
  const refRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/ref/heads/${BRANCH}`,
    { headers: h }
  )
  if (!refRes.ok) throw new Error('Failed to get branch ref')
  const ref = await refRes.json()
  const latestSha = ref.object.sha

  // 2. Get the tree SHA of the latest commit
  const commitRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/commits/${latestSha}`,
    { headers: h }
  )
  if (!commitRes.ok) throw new Error('Failed to get commit')
  const commitData = await commitRes.json()
  const baseTree = commitData.tree.sha

  // 3. Create a blob for each file and build tree entries
  const treeEntries = []
  for (const file of files) {
    const blobRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/git/blobs`,
      {
        method: 'POST',
        headers: h,
        body: JSON.stringify({
          content: JSON.stringify(file.content, null, 2) + '\n',
          encoding: 'utf-8',
        }),
      }
    )
    if (!blobRes.ok) throw new Error(`Failed to create blob for ${file.path}`)
    const blob = await blobRes.json()
    treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha })
  }

  // 4. Create a new tree
  const treeRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/trees`,
    {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ base_tree: baseTree, tree: treeEntries }),
    }
  )
  if (!treeRes.ok) throw new Error('Failed to create tree')
  const newTree = await treeRes.json()

  // 5. Create a new commit
  const newCommitRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/commits`,
    {
      method: 'POST',
      headers: h,
      body: JSON.stringify({ message, tree: newTree.sha, parents: [latestSha] }),
    }
  )
  if (!newCommitRes.ok) throw new Error('Failed to create commit')
  const newCommit = await newCommitRes.json()

  // 6. Update the branch reference
  const updateRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`,
    {
      method: 'PATCH',
      headers: h,
      body: JSON.stringify({ sha: newCommit.sha }),
    }
  )
  if (!updateRes.ok) throw new Error('Failed to update branch ref')

  return newCommit
}

/**
 * Verify admin auth via x-admin-secret header.
 */
function checkAuth(req) {
  const password = process.env.ADMIN_PASSWORD
  if (!password) return true // no env var = no server-side auth
  return req.headers['x-admin-secret'] === password
}

export { getFile, commitFiles, checkAuth, VALID_COLLECTIONS }
