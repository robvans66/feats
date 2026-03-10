import { app as o, BrowserWindow as w, dialog as y, Menu as m } from "electron";
import { spawn as g } from "node:child_process";
import { existsSync as c, readdirSync as R } from "node:fs";
import { dirname as E, join as a } from "node:path";
import { fileURLToPath as N } from "node:url";
const P = "1.0.12", _ = "10 Mar 2026", S = N(import.meta.url), p = E(S);
o.setName("Feats");
o.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${P} (${_})`,
  version: "",
  // Suppress default Electron version info
  iconPath: a(p, "../build/icon.png")
});
const b = Number(process.env.NUXT_PORT || 3e3), v = `http://127.0.0.1:${b}`;
let l = null, r = null;
function h() {
  return o.isPackaged ? o.getAppPath() : a(p, "..");
}
function T() {
  return o.isPackaged ? process.resourcesPath : h();
}
function C() {
  const e = h();
  if (process.env.NUXT_SERVER_ENTRY && c(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const n = R(e, { withFileTypes: !0 }).filter((t) => t.isDirectory() && t.name.startsWith("feats_v")).map((t) => t.name).sort();
  for (let t = n.length - 1; t >= 0; t--) {
    const i = a(e, n[t], "server", "index.mjs");
    if (c(i)) return i;
  }
  const s = [
    a(e, ".output", "server", "index.mjs"),
    a(process.resourcesPath, ".output", "server", "index.mjs"),
    a(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
  ];
  for (const t of s)
    if (c(t)) return t;
  return null;
}
function x(e, n = 2e4) {
  const s = Date.now();
  return new Promise((t, i) => {
    const u = setInterval(async () => {
      try {
        const d = await fetch(e);
        if (d.ok || d.status < 500) {
          clearInterval(u), t();
          return;
        }
      } catch {
      }
      Date.now() - s > n && (clearInterval(u), i(new Error(`Nuxt server did not start in time: ${e}`)));
    }, 300);
  });
}
async function O() {
  if (process.env.NODE_ENV === "development") return;
  const e = C();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const n = process.execPath, s = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  l = g(n, [e], {
    cwd: T(),
    env: { ...s, PORT: String(b), HOST: "127.0.0.1" },
    stdio: "pipe"
  }), l.stdout.on("data", (t) => console.log(`[nuxt] ${t}`)), l.stderr.on("data", (t) => console.error(`[nuxt] ${t}`)), await x(v);
}
function k() {
  const e = process.platform === "darwin", n = [
    // App Menu (macOS only)
    ...e ? [{
      label: o.name,
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
          click: () => r?.webContents.send("menu-rides")
        },
        {
          label: "Routes",
          accelerator: "CmdOrCtrl+T",
          click: () => r?.webContents.send("menu-routes")
        },
        {
          label: "Statistics",
          accelerator: "CmdOrCtrl+S",
          click: () => r?.webContents.send("menu-statistics")
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => r?.webContents.send("menu-settings")
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
          click: () => r?.webContents.send("menu-documentation")
        },
        { type: "separator" },
        ...e ? [] : [
          {
            label: "About",
            click: () => {
              o.showAboutPanel();
            }
          }
        ]
      ]
    }
  ], s = m.buildFromTemplate(n);
  m.setApplicationMenu(s);
}
async function f() {
  r = new w({
    width: 1200,
    height: 800,
    title: "",
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: a(p, "preload.js")
    }
  }), process.env.NODE_ENV === "development" ? (await r.loadURL("http://localhost:3000"), r.webContents.openDevTools()) : await r.loadURL(v), r.on("closed", () => {
    r = null;
  });
}
o.whenReady().then(async () => {
  await O(), k(), await f(), o.on("activate", async () => {
    w.getAllWindows().length === 0 && await f();
  });
}).catch((e) => {
  const n = e instanceof Error ? e.message : String(e);
  console.error("[main] startup failed:", e), y.showErrorBox("Feats failed to start", n), o.quit();
});
o.on("before-quit", () => {
  l && !l.killed && l.kill();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
