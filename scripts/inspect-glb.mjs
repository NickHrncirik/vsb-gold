import fs from 'node:fs'

function listNames(path) {
  const b = fs.readFileSync(path)
  const jsonLen = b.readUInt32LE(12)
  const json = JSON.parse(b.slice(20, 20 + jsonLen).toString())
  const names = []
  for (const n of json.nodes || []) if (n.name) names.push(n.name)
  for (const m of json.meshes || []) if (m.name) names.push('mesh:' + m.name)
  console.log('file', path, 'size', b.length)
  console.log('materials', (json.materials || []).map((m) => m.name))
  console.log('names:\n' + [...new Set(names)].join('\n'))
}

listNames('public/models/pendant.glb')
