import { app as s, BrowserWindow as w, Menu as m } from "electron";
import { spawn as y } from "node:child_process";
import { existsSync as u, readdirSync as h } from "node:fs";
import { dirname as R, join as a } from "node:path";
import { fileURLToPath as N } from "node:url";
const E = "1.0.4", _ = "03 Mar 2026", C = N(import.meta.url), c = R(C);
s.setName("Feats");
s.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${E} (${_})`,
  version: "",
  // Suppress default Electron version info
  iconPath: a(c, "../build/icon.png")
});
const b = Number(process.env.NUXT_PORT || 3e3), v = `http://127.0.0.1:${b}`;
let l = null, t = null;
function T() {
  const e = a(c, "..");
  if (process.env.NUXT_SERVER_ENTRY && u(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const n = h(e, { withFileTypes: !0 }).filter((r) => r.isDirectory() && r.name.startsWith("feats_v")).map((r) => r.name).sort();
  for (let r = n.length - 1; r >= 0; r--) {
    const i = a(e, n[r], "server", "index.mjs");
    if (u(i)) return i;
  }
  const o = a(e, ".output", "server", "index.mjs");
  return u(o) ? o : null;
}
function g(e, n = 2e4) {
  const o = Date.now();
  return new Promise((r, i) => {
    const d = setInterval(async () => {
      try {
        const p = await fetch(e);
        if (p.ok || p.status < 500) {
          clearInterval(d), r();
          return;
        }
      } catch {
      }
      Date.now() - o > n && (clearInterval(d), i(new Error(`Nuxt server did not start in time: ${e}`)));
    }, 300);
  });
}
async function O() {
  if (process.env.NODE_ENV === "development") return;
  const e = T();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const n = process.env.NODE_BINARY || "node";
  l = y(n, [e], {
    cwd: a(c, ".."),
    env: { ...process.env, PORT: String(b), HOST: "127.0.0.1" },
    stdio: "pipe"
  }), l.stdout.on("data", (o) => console.log(`[nuxt] ${o}`)), l.stderr.on("data", (o) => console.error(`[nuxt] ${o}`)), await g(v);
}
function S() {
  const e = process.platform === "darwin", n = [
    // App Menu (macOS only)
    ...e ? [{
      label: s.name,
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
          label: "Configuration",
          accelerator: "CmdOrCtrl+,",
          click: () => t?.webContents.send("menu-configuration")
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
            click: () => t?.webContents.send("menu-about")
          }
        ]
      ]
    }
  ], o = m.buildFromTemplate(n);
  m.setApplicationMenu(o);
}
async function f() {
  t = new w({
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
s.whenReady().then(async () => {
  await O(), S(), await f(), s.on("activate", async () => {
    w.getAllWindows().length === 0 && await f();
  });
});
s.on("before-quit", () => {
  l && !l.killed && l.kill();
});
s.on("window-all-closed", () => {
  process.platform !== "darwin" && s.quit();
});
