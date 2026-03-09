import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const packageJsonPath = resolve(process.cwd(), 'package.json')
const versionTsPath = resolve(process.cwd(), 'version.ts')

const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const packageVersion = String(pkg.version || '').trim()

if (!packageVersion) {
  throw new Error('Missing "version" in package.json')
}

const today = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}).format(new Date())

const existing = existsSync(versionTsPath) ? readFileSync(versionTsPath, 'utf8') : ''
const existingVersionMatch = existing.match(/export const LatestVersion = '([^']+)'/)
const existingDateMatch = existing.match(/export const LatestVersionDate = '([^']+)'/)

const existingVersion = existingVersionMatch?.[1] || ''
const existingDate = existingDateMatch?.[1] || ''

const versionDate = existingVersion === packageVersion
  ? (existingDate || today)
  : today

const next = `export const LatestVersion = '${packageVersion}'\nexport const LatestVersionDate = '${versionDate}'\n`

if (existing !== next) {
  writeFileSync(versionTsPath, next, 'utf8')
  console.log(`Synced version.ts -> ${packageVersion}`)
} else {
  console.log(`version.ts already in sync (${packageVersion})`)
}
