import { app as r, BrowserWindow as h, dialog as E, Menu as f, shell as w } from "electron";
import { spawn as g } from "node:child_process";
import { existsSync as p, readdirSync as R } from "node:fs";
import { dirname as N, join as l } from "node:path";
import { fileURLToPath as _ } from "node:url";
const P = "1.0.14", C = "14 Mar 2026", x = _(import.meta.url), d = N(x);
r.setName("Feats");
r.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${P} (${C})`,
  version: "",
  // Suppress default Electron version info
  iconPath: l(d, "../build/icon.png")
});
const b = Number(process.env.NUXT_PORT || 3e3), c = `http://127.0.0.1:${b}`;
let i = null, o = null;
function y() {
  return r.isPackaged ? r.getAppPath() : l(d, "..");
}
function O() {
  return r.isPackaged ? process.resourcesPath : y();
}
function S() {
  const t = y();
  if (process.env.NUXT_SERVER_ENTRY && p(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const n = R(t, { withFileTypes: !0 }).filter((e) => e.isDirectory() && e.name.startsWith("feats_v")).map((e) => e.name).sort();
  for (let e = n.length - 1; e >= 0; e--) {
    const s = l(t, n[e], "server", "index.mjs");
    if (p(s)) return s;
  }
  const a = [
    l(t, ".output", "server", "index.mjs"),
    l(process.resourcesPath, ".output", "server", "index.mjs"),
    l(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
  ];
  for (const e of a)
    if (p(e)) return e;
  return null;
}
function T(t, n = 2e4) {
  const a = Date.now();
  return new Promise((e, s) => {
    const u = setInterval(async () => {
      try {
        const m = await fetch(t);
        if (m.ok || m.status < 500) {
          clearInterval(u), e();
          return;
        }
      } catch {
      }
      Date.now() - a > n && (clearInterval(u), s(new Error(`Nuxt server did not start in time: ${t}`)));
    }, 300);
  });
}
async function k() {
  if (process.env.NODE_ENV === "development") return;
  const t = S();
  if (!t)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const n = process.execPath, a = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  i = g(n, [t], {
    cwd: O(),
    env: { ...a, PORT: String(b), HOST: "127.0.0.1" },
    stdio: "pipe"
  }), i.stdout.on("data", (e) => console.log(`[nuxt] ${e}`)), i.stderr.on("data", (e) => console.error(`[nuxt] ${e}`)), await T(c);
}
function A() {
  const t = process.platform === "darwin", n = [
    // App Menu (macOS only)
    ...t ? [{
      label: r.name,
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
          click: () => o?.webContents.send("menu-rides")
        },
        {
          label: "Routes",
          accelerator: "CmdOrCtrl+T",
          click: () => o?.webContents.send("menu-routes")
        },
        {
          label: "Statistics",
          accelerator: "CmdOrCtrl+S",
          click: () => o?.webContents.send("menu-statistics")
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => o?.webContents.send("menu-settings")
        },
        { type: "separator" },
        ...t ? [
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
        ...t ? [
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
        ...t ? [
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
          click: () => o?.webContents.send("menu-documentation")
        },
        { type: "separator" },
        ...t ? [] : [
          {
            label: "About",
            click: () => {
              r.showAboutPanel();
            }
          }
        ]
      ]
    }
  ], a = f.buildFromTemplate(n);
  f.setApplicationMenu(a);
}
async function v() {
  o = new h({
    width: 1200,
    height: 800,
    title: "",
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: l(d, "preload.js")
    }
  });
  const t = process.env.NODE_ENV === "development" ? ["http://localhost:3000", c] : [c], n = (e) => t.some((s) => e.startsWith(s)), a = (e) => {
    if (n(e)) return !1;
    try {
      const s = new URL(e);
      return s.protocol === "http:" || s.protocol === "https:";
    } catch {
      return !1;
    }
  };
  o.webContents.setWindowOpenHandler(({ url: e }) => (a(e) && w.openExternal(e), { action: "deny" })), o.webContents.on("will-navigate", (e, s) => {
    a(s) && (e.preventDefault(), w.openExternal(s));
  }), process.env.NODE_ENV === "development" ? (await o.loadURL("http://localhost:3000"), o.webContents.openDevTools()) : await o.loadURL(c), o.on("closed", () => {
    o = null;
  });
}
r.whenReady().then(async () => {
  await k(), A(), await v(), r.on("activate", async () => {
    h.getAllWindows().length === 0 && await v();
  });
}).catch((t) => {
  const n = t instanceof Error ? t.message : String(t);
  console.error("[main] startup failed:", t), E.showErrorBox("Feats failed to start", n), r.quit();
});
r.on("before-quit", () => {
  i && !i.killed && i.kill();
});
r.on("window-all-closed", () => {
  process.platform !== "darwin" && r.quit();
});
