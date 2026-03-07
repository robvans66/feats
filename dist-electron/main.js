import { app as n, BrowserWindow as f, Menu as m } from "electron";
import { spawn as y } from "node:child_process";
import { existsSync as p, readdirSync as h } from "node:fs";
import { dirname as R, join as a } from "node:path";
import { fileURLToPath as N } from "node:url";
const E = "1.0.9", _ = "07 Mar 2026", T = N(import.meta.url), c = R(T);
n.setName("Feats");
n.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${E} (${_})`,
  version: "",
  // Suppress default Electron version info
  iconPath: a(c, "../build/icon.png")
});
const b = Number(process.env.NUXT_PORT || 3e3), v = `http://127.0.0.1:${b}`;
let l = null, t = null;
function C() {
  const e = a(c, "..");
  if (process.env.NUXT_SERVER_ENTRY && p(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const s = h(e, { withFileTypes: !0 }).filter((r) => r.isDirectory() && r.name.startsWith("feats_v")).map((r) => r.name).sort();
  for (let r = s.length - 1; r >= 0; r--) {
    const i = a(e, s[r], "server", "index.mjs");
    if (p(i)) return i;
  }
  const o = a(e, ".output", "server", "index.mjs");
  return p(o) ? o : null;
}
function S(e, s = 2e4) {
  const o = Date.now();
  return new Promise((r, i) => {
    const d = setInterval(async () => {
      try {
        const u = await fetch(e);
        if (u.ok || u.status < 500) {
          clearInterval(d), r();
          return;
        }
      } catch {
      }
      Date.now() - o > s && (clearInterval(d), i(new Error(`Nuxt server did not start in time: ${e}`)));
    }, 300);
  });
}
async function g() {
  if (process.env.NODE_ENV === "development") return;
  const e = C();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const s = process.env.NODE_BINARY || "node";
  l = y(s, [e], {
    cwd: a(c, ".."),
    env: { ...process.env, PORT: String(b), HOST: "127.0.0.1" },
    stdio: "pipe"
  }), l.stdout.on("data", (o) => console.log(`[nuxt] ${o}`)), l.stderr.on("data", (o) => console.error(`[nuxt] ${o}`)), await S(v);
}
function O() {
  const e = process.platform === "darwin", s = [
    // App Menu (macOS only)
    ...e ? [{
      label: n.name,
      submenu: [
        { role: "about" },
        { type: "separator" },
        { role: "services" },
        { type: "separator" },
        { role: "hide" },
        { role: "hideOthers" },
        { role: "unhide" },
        { type: "separator" },
        { role: "quit" }
      ]
    }] : [],
    // File Menu
    {
      label: "File",
      submenu: [
        {
          label: "Rides",
          accelerator: "CmdOrCtrl+R",
          click: () => t?.webContents.send("menu-rides")
        },
        {
          label: "Routes",
          accelerator: "CmdOrCtrl+T",
          click: () => t?.webContents.send("menu-routes")
        },
        {
          label: "Statistics",
          accelerator: "CmdOrCtrl+S",
          click: () => t?.webContents.send("menu-statistics")
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => t?.webContents.send("menu-settings")
        },
        { type: "separator" },
        ...e ? [
          { role: "close" }
        ] : [
          { role: "quit" }
        ]
      ]
    },
    // Edit Menu
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        ...e ? [
          { role: "pasteAndMatchStyle" },
          { role: "delete" },
          { role: "selectAll" }
        ] : [
          { role: "delete" },
          { type: "separator" },
          { role: "selectAll" }
        ]
      ]
    },
    // View Menu
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    // Window Menu
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        ...e ? [
          { role: "zoom" },
          { type: "separator" },
          { role: "front" },
          { type: "separator" },
          { role: "window" }
        ] : [
          { role: "close" }
        ]
      ]
    },
    // Help Menu
    {
      role: "help",
      submenu: [
        {
          label: "Documentation",
          click: () => t?.webContents.send("menu-documentation")
        },
        { type: "separator" },
        ...e ? [] : [
          {
            label: "About",
            click: () => {
              n.showAboutPanel();
            }
          }
        ]
      ]
    }
  ], o = m.buildFromTemplate(s);
  m.setApplicationMenu(o);
}
async function w() {
  t = new f({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: a(c, "preload.js")
    }
  }), process.env.NODE_ENV === "development" ? (await t.loadURL("http://localhost:3000"), t.webContents.openDevTools()) : await t.loadURL(v), t.on("closed", () => {
    t = null;
  });
}
n.whenReady().then(async () => {
  await g(), O(), await w(), n.on("activate", async () => {
    f.getAllWindows().length === 0 && await w();
  });
});
n.on("before-quit", () => {
  l && !l.killed && l.kill();
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && n.quit();
});
