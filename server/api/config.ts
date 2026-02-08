import db from '../db/index'

type UserConfig = {
  bikeOptions: string[]
  surfaceOptions: string[]
  pageSizeOptions: number[]
  ridesColumnVisibility: Record<string, boolean>
  routesColumnVisibility: Record<string, boolean>
}

type RawUserConfig = {
  bikeOptions?: unknown
  surfaceOptions?: unknown
  pageSizeOptions?: unknown
  ridesColumnVisibility?: unknown
  routesColumnVisibility?: unknown
}

function getDefaults(): UserConfig {
  return {
    bikeOptions: ['Santos', 'Rimonta', 'Gazelle', 'Wahoo'],
    surfaceOptions: ['Road', 'Gravel', 'Road/Gravel', 'Gravel/MTB'],
    pageSizeOptions: [5, 10, 20],
    ridesColumnVisibility: {
      id: true,
      date: true,
      description: true,
      distance: true,
      average: true,
      grade: true,
      bike: true,
      reference: true,
      link: true,
      notes: true
    },
    routesColumnVisibility: {
      id: true,
      description: true,
      distance: true,
      grade: true,
      start: true,
      destination: true,
      surface: true,
      reference: true,
      link: true,
      notes: true
    }
  }
}

function normalizeVisibility(keys: string[], input: unknown, fallback: Record<string, boolean>) {
  const result: Record<string, boolean> = {}
  const source = typeof input === 'object' && input !== null ? (input as Record<string, unknown>) : fallback
  for (const key of keys) {
    const value = source[key]
    result[key] = typeof value === 'boolean' ? value : fallback[key] ?? true
  }
  return result
}

function normalizeConfig(input: Partial<UserConfig>): UserConfig {
  const defaults = getDefaults()
  const bikeOptions = Array.isArray(input.bikeOptions)
    ? input.bikeOptions.map((value) => String(value).trim()).filter(Boolean)
    : defaults.bikeOptions

  const surfaceOptions = Array.isArray(input.surfaceOptions)
    ? input.surfaceOptions.map((value) => String(value).trim()).filter(Boolean)
    : defaults.surfaceOptions

  const pageSizeOptions = Array.isArray(input.pageSizeOptions)
    ? input.pageSizeOptions
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    : defaults.pageSizeOptions

  const ridesKeys = Object.keys(defaults.ridesColumnVisibility)
  const routesKeys = Object.keys(defaults.routesColumnVisibility)

  return {
    bikeOptions: bikeOptions.length ? bikeOptions : defaults.bikeOptions,
    surfaceOptions: surfaceOptions.length ? surfaceOptions : defaults.surfaceOptions,
    pageSizeOptions: pageSizeOptions.length ? pageSizeOptions : defaults.pageSizeOptions,
    ridesColumnVisibility: normalizeVisibility(ridesKeys, (input as RawUserConfig).ridesColumnVisibility, defaults.ridesColumnVisibility),
    routesColumnVisibility: normalizeVisibility(routesKeys, (input as RawUserConfig).routesColumnVisibility, defaults.routesColumnVisibility)
  }
}

function parseJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    const row = db
      .prepare('SELECT bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility FROM user_config WHERE id=1')
      .get()
    const defaults = getDefaults()
    return {
      bikeOptions: parseJson<string[]>(row?.bike_options, defaults.bikeOptions),
      surfaceOptions: parseJson<string[]>(row?.surface_options, defaults.surfaceOptions),
      pageSizeOptions: parseJson<number[]>(row?.page_size_options, defaults.pageSizeOptions),
      ridesColumnVisibility: parseJson<Record<string, boolean>>(
        row?.rides_column_visibility,
        defaults.ridesColumnVisibility
      ),
      routesColumnVisibility: parseJson<Record<string, boolean>>(
        row?.routes_column_visibility,
        defaults.routesColumnVisibility
      )
    }
  }

  if (method === 'PUT') {
    const body = (await readBody(event)) as RawUserConfig
    const next = normalizeConfig(body || {})
    const exists = db.prepare('SELECT COUNT(*) as c FROM user_config WHERE id=1').get().c
    if (exists > 0) {
      db.prepare(
        'UPDATE user_config SET bike_options=?, surface_options=?, page_size_options=?, rides_column_visibility=?, routes_column_visibility=? WHERE id=1'
      ).run(
        JSON.stringify(next.bikeOptions),
        JSON.stringify(next.surfaceOptions),
        JSON.stringify(next.pageSizeOptions),
        JSON.stringify(next.ridesColumnVisibility),
        JSON.stringify(next.routesColumnVisibility)
      )
    } else {
      db.prepare(
        'INSERT INTO user_config (id, bike_options, surface_options, page_size_options, rides_column_visibility, routes_column_visibility) VALUES (1, ?, ?, ?, ?, ?)'
      ).run(
        JSON.stringify(next.bikeOptions),
        JSON.stringify(next.surfaceOptions),
        JSON.stringify(next.pageSizeOptions),
        JSON.stringify(next.ridesColumnVisibility),
        JSON.stringify(next.routesColumnVisibility)
      )
    }
    return next
  }

  return { ok: false }
})
