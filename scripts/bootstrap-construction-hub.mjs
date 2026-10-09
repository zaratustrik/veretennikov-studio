import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import { randomBytes, createHash } from 'node:crypto'
import path from 'node:path'

const directory = path.resolve(process.env.CONSTRUCTION_HUB_DIR || '.data/construction-hub')
await mkdir(directory, { recursive: true, mode: 0o700 })
try { await access(path.join(directory, 'state.json')); console.log('Existing state preserved.'); process.exit(0) } catch {}
const content = JSON.parse(await readFile('.data/construction-hub-content.json', 'utf8'))
const token = randomBytes(32).toString('base64url')
const colleagues = randomBytes(32).toString('base64url')
const now = new Date().toISOString()
content.invites = [{ id: randomBytes(12).toString('hex'), name: 'Анатолий Веретенников', role: 'organizer', hash: createHash('sha256').update(token).digest('hex'), active: true, createdAt: now }]
content.invites.push({ id: randomBytes(12).toString('hex'), name: 'Коллеги', role: 'member', hash: createHash('sha256').update(colleagues).digest('hex'), active: true, createdAt: now })
content.version = 1
content.updatedAt = now
content.comments = []
content.checks = {}
content.history = [{ at: now, author: 'Организатор', text: 'Добавлен первоначальный план по итогам встречи 8 октября' }]
await writeFile(path.join(directory, 'secret.key'), randomBytes(48).toString('hex'), { mode: 0o600, flag: 'wx' })
await writeFile(path.join(directory, 'colleagues.key'), colleagues, { mode: 0o600, flag: 'wx' })
await writeFile(path.join(directory, 'state.json'), JSON.stringify(content, null, 2), { mode: 0o600, flag: 'wx' })
await writeFile(path.join(directory, 'owner-invitation.txt'), `https://veretennikov.info/construction-hub#invite=${token}\n`, { mode: 0o600, flag: 'wx' })
console.log('Initialized. Organizer invitation saved privately in .data/construction-hub/owner-invitation.txt')
