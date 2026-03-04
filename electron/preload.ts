import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  onMenuRides: (cb: () => void) => ipcRenderer.on('menu-rides', cb),
  onMenuRoutes: (cb: () => void) => ipcRenderer.on('menu-routes', cb),
  onMenuStatistics: (cb: () => void) => ipcRenderer.on('menu-statistics', cb),
  onMenuDocumentation: (cb: () => void) => ipcRenderer.on('menu-documentation', cb),
  onMenuConfiguration: (cb: () => void) => ipcRenderer.on('menu-configuration', cb)
})