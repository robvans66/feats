// electron/main.ts
import { app, BrowserWindow, Menu, dialog, shell } from 'electron'
import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { LatestVersion, LatestVersionDate } from '../version.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.setName('Feats') // Set your app name here for macOS menu
if (process.platform === 'win32') {
  app.setAppUserModelId('com.feats.app')
}
app.setAboutPanelOptions({
  applicationName: 'Feats',
  applicationVersion: `${LatestVersion} (${LatestVersionDate})`,
  version: '' // Suppress default Electron version info
})

const APP_PORT = Number(process.env.NUXT_PORT || 3000)
const APP_URL = `http://127.0.0.1:${APP_PORT}`

let nuxtServer: ChildProcessWithoutNullStreams | null = null
let mainWindow: BrowserWindow | null = null
let aboutWindow: BrowserWindow | null = null

function getAppRoot(): string {
  return app.isPackaged ? app.getAppPath() : join(__dirname, '..')
}

function getAppIconPath(): string {
  const iconFile = process.platform === 'win32' ? 'icon.ico' : 'icon.png'

  if (app.isPackaged) {
    return join(process.resourcesPath, iconFile)
  }

  return join(getAppRoot(), 'build', iconFile)
}

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function showWindowsAboutWindow() {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.focus()
    return
  }

  const versionText = `Version ${LatestVersion} (${LatestVersionDate})`
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: file:; style-src 'unsafe-inline'" />
    <title>About Feats</title>
    <style>
      :root {
        color-scheme: light;
        font-family: "Segoe UI", sans-serif;
      }
      html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      body {
        margin: 0;
        background: #f5f6f7;
        color: #111827;
      }
      .wrap {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 40px 20px;
        height: 100%;
        box-sizing: border-box;
      }
      .name {
        margin: 20px 0 0;
        padding-top: 16px;
        font-size: 20px;
        font-weight: 600;
      }
      .tagline {
        margin: 8px 0 0;
        color: #374151;
        font-size: 13px;
      }
      .version {
        margin: 6px 0 20px;
        padding-bottom: 16px;
        color: #4b5563;
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1 class="name">Feats</h1>
      <p class="tagline">Keep track of your bicycle rides and planned routes.</p>
      <p class="version">${escapeHtml(versionText)}</p>
    </div>
  </body>
</html>`

  aboutWindow = new BrowserWindow({
    width: 380,
    height: 130,
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    title: 'About Feats',
    parent: mainWindow ?? undefined,
    modal: mainWindow !== null,
    icon: getAppIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  aboutWindow.on('closed', () => {
    aboutWindow = null
  })

  void aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
}

function showAboutDialog() {
  if (process.platform === 'win32') {
    showWindowsAboutWindow()
    return
  }

  app.showAboutPanel()
}

function getServerWorkingDirectory(): string {
  return app.isPackaged ? process.resourcesPath : getAppRoot()
}

function findServerEntry(): string | null {
  const root = getAppRoot()

  // 1) Explicit override
  if (process.env.NUXT_SERVER_ENTRY && existsSync(process.env.NUXT_SERVER_ENTRY)) {
    return process.env.NUXT_SERVER_ENTRY
  }

  // 2) Your custom output pattern: feats_v*/server/index.mjs (pick latest lexicographically)
  const dirs = readdirSync(root, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name.startsWith('feats_v'))
    .map(d => d.name)
    .sort()

  for (let i = dirs.length - 1; i >= 0; i--) {
    const candidate = join(root, dirs[i], 'server', 'index.mjs')
    if (existsSync(candidate)) return candidate
  }

  // 3) Fallback default Nuxt output
  const fallbackCandidates = [
    join(root, '.output', 'server', 'index.mjs'),
    join(process.resourcesPath, '.output', 'server', 'index.mjs'),
    join(process.resourcesPath, 'app.asar.unpacked', '.output', 'server', 'index.mjs')
  ]

  for (const candidate of fallbackCandidates) {
    if (existsSync(candidate)) return candidate
  }

  return null
}

function waitForServer(url: string, timeoutMs = 20000): Promise<void> {
  const started = Date.now()
  return new Promise((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const res = await fetch(url)
        if (res.ok || res.status < 500) {
          clearInterval(timer)
          resolve()
          return
        }
      } catch {
        // keep polling
      }

      if (Date.now() - started > timeoutMs) {
        clearInterval(timer)
        reject(new Error(`Nuxt server did not start in time: ${url}`))
      }
    }, 300)
  })
}

async function startNuxtServerIfNeeded() {
  if (process.env.NODE_ENV === 'development') return

  const entry = findServerEntry()
  if (!entry) {
    throw new Error('Cannot find Nuxt server entry (feats_v*/server/index.mjs)')
  }

  const nodeBin = process.execPath
  const runnerEnv = { ...process.env, ELECTRON_RUN_AS_NODE: '1' }

  nuxtServer = spawn(nodeBin, [entry], {
    cwd: getServerWorkingDirectory(),
    env: { ...runnerEnv, PORT: String(APP_PORT), HOST: '127.0.0.1', FEATS_USER_DATA: app.getPath('userData') },
    stdio: 'pipe'
  })

  nuxtServer.stdout.on('data', d => console.log(`[nuxt] ${d}`))
  nuxtServer.stderr.on('data', d => console.error(`[nuxt] ${d}`))

  await waitForServer(APP_URL)
}

function createMenu() {
  const isMac = process.platform === 'darwin'

  const template: Electron.MenuItemConstructorOptions[] = [
    // App Menu (macOS only)
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' as const },
        { type: 'separator' as const },
        { role: 'services' as const },
        { type: 'separator' as const },
        { role: 'hide' as const },
        { role: 'hideOthers' as const },
        { role: 'unhide' as const },
        { type: 'separator' as const },
        { role: 'quit' as const }
      ]
    }] : []),

    // File Menu
    {
      label: 'File',
      submenu: [
        {
          label: 'Rides',
          accelerator: 'CmdOrCtrl+R',
          click: () => mainWindow?.webContents.send('menu-rides')
        },
        {
          label: 'Routes',
          accelerator: 'CmdOrCtrl+T',
          click: () => mainWindow?.webContents.send('menu-routes')
        },
        {
          label: 'Statistics',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow?.webContents.send('menu-statistics')
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => mainWindow?.webContents.send('menu-settings')
        },
        { type: 'separator' },
        ...(isMac ? [
          { role: 'close' as const }
        ] : [
          { role: 'quit' as const }
        ])
      ]
    },

    // Edit Menu
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' as const },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' as const },
          { role: 'delete' as const },
          { role: 'selectAll' as const }
        ] : [
          { role: 'delete' as const },
          { type: 'separator' as const },
          { role: 'selectAll' as const }
        ])
      ]
    },

    // View Menu
    {
      label: 'View',
      submenu: [
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' as const },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' as const },
        { role: 'togglefullscreen' as const }
      ]
    },

    // Window Menu
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        ...(isMac ? [
          { role: 'zoom' as const },
          { type: 'separator' as const },
          { role: 'front' as const },
          { type: 'separator' as const },
          { role: 'window' as const }
        ] : [
          { role: 'close' as const }
        ])
      ]
    },

    // Help Menu
    {
      role: 'help' as const,
      submenu: [
        {
          label: 'Documentation',
          click: () => mainWindow?.webContents.send('menu-documentation')
        },
        { type: 'separator' as const },
        ...(isMac ? [] : [
          {
            label: 'About',
            click: () => { showAboutDialog() }
          }
        ])
      ]
    }
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: '',
    icon: getAppIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  })

  const internalOrigins = process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', APP_URL]
    : [APP_URL]

  const isInternalUrl = (url: string) => internalOrigins.some((origin) => url.startsWith(origin))
  const isExternalUrl = (url: string) => {
    if (isInternalUrl(url)) return false
    try {
      const parsed = new URL(url)
      return parsed.protocol === 'http:' || parsed.protocol === 'https:'
    } catch {
      return false
    }
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isExternalUrl(url)) {
      void shell.openExternal(url)
    }
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (isExternalUrl(url)) {
      event.preventDefault()
      void shell.openExternal(url)
    }
  })

  if (process.env.NODE_ENV === 'development') {
    await mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadURL(APP_URL)
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(async () => {
  await startNuxtServerIfNeeded()
  createMenu()
  await createWindow()

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createWindow()
  })
}).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error('[main] startup failed:', error)
  dialog.showErrorBox('Feats failed to start', message)
  app.quit()
})

app.on('before-quit', () => {
  if (nuxtServer && !nuxtServer.killed) nuxtServer.kill()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
