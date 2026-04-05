import { execSync } from 'node:child_process'
import path from 'node:path'

// Keys injected by electron-builder/Electron that this app doesn't use.
// Removing them avoids App Store Review questions and permission dialogs the
// app never actually triggers.
const KEYS_TO_REMOVE = [
  'NSAudioCaptureUsageDescription',
  'NSBluetoothAlwaysUsageDescription',
  'NSBluetoothPeripheralUsageDescription',
  'NSCameraUsageDescription',
  'NSMicrophoneUsageDescription',
]

export default async function afterPack({ appOutDir, packager }) {
  if (packager.platform.name !== 'mac') return

  const infoPlistPath = path.join(
    appOutDir,
    `${packager.appInfo.productName}.app`,
    'Contents',
    'Info.plist'
  )

  for (const key of KEYS_TO_REMOVE) {
    try {
      execSync(`plutil -remove ${key} "${infoPlistPath}"`, { stdio: 'pipe' })
      console.log(`[afterPack] Removed ${key} from Info.plist`)
    } catch {
      // Key wasn't present — nothing to do
    }
  }
}
