import { app as o, BrowserWindow as v, dialog as b, Menu as f, shell as w } from "electron";
import { spawn as P } from "node:child_process";
import { existsSync as p, readdirSync as _ } from "node:fs";
import { dirname as x, join as i } from "node:path";
import { fileURLToPath as C } from "node:url";
const y = "1.0.14", g = "14 Mar 2026", O = C(import.meta.url), E = x(O);
o.setName("Feats");
process.platform === "win32" && o.setAppUserModelId("com.feats.app");
o.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${y} (${g})`,
  version: ""
  // Suppress default Electron version info
});
const R = Number(process.env.NUXT_PORT || 3e3), c = `http://127.0.0.1:${R}`;
let l = null, n = null;
function u() {
  return o.isPackaged ? o.getAppPath() : i(E, "..");
}
function N() {
  const e = process.platform === "win32" ? "icon.ico" : "icon.png";
  return o.isPackaged ? i(process.resourcesPath, e) : i(u(), "build", e);
}
function S() {
  const e = N(), r = `Version ${y} (${g})`;
  if (process.platform === "win32") {
    b.showMessageBox({
      type: "info",
      title: "About Feats",
      message: "Feats",
      detail: r,
      icon: e,
      buttons: ["OK"]
    });
    return;
  }
  o.showAboutPanel();
}
function T() {
  return o.isPackaged ? process.resourcesPath : u();
}
function A() {
  const e = u();
  if (process.env.NUXT_SERVER_ENTRY && p(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const r = _(e, { withFileTypes: !0 }).filter((t) => t.isDirectory() && t.name.startsWith("feats_v")).map((t) => t.name).sort();
  for (let t = r.length - 1; t >= 0; t--) {
    const s = i(e, r[t], "server", "index.mjs");
    if (p(s)) return s;
  }
  const a = [
    i(e, ".output", "server", "index.mjs"),
    i(process.resourcesPath, ".output", "server", "index.mjs"),
    i(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
  ];
  for (const t of a)
    if (p(t)) return t;
  return null;
}
function k(e, r = 2e4) {
  const a = Date.now();
  return new Promise((t, s) => {
    const d = setInterval(async () => {
      try {
        const m = await fetch(e);
        if (m.ok || m.status < 500) {
          clearInterval(d), t();
          return;
        }
      } catch {
      }
      Date.now() - a > r && (clearInterval(d), s(new Error(`Nuxt server did not start in time: ${e}`)));
    }, 300);
  });
}
async function D() {
  if (process.env.NODE_ENV === "development") return;
  const e = A();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const r = process.execPath, a = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  l = P(r, [e], {
    cwd: T(),
    env: { ...a, PORT: String(R), HOST: "127.0.0.1" },
    stdio: "pipe"
  }), l.stdout.on("data", (t) => console.log(`[nuxt] ${t}`)), l.stderr.on("data", (t) => console.error(`[nuxt] ${t}`)), await k(c);
}
function U() {
  const e = process.platform === "darwin", r = [
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
          click: () => n?.webContents.send("menu-rides")
        },
        {
          label: "Routes",
          accelerator: "CmdOrCtrl+T",
          click: () => n?.webContents.send("menu-routes")
        },
        {
          label: "Statistics",
          accelerator: "CmdOrCtrl+S",
          click: () => n?.webContents.send("menu-statistics")
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => n?.webContents.send("menu-settings")
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
          click: () => n?.webContents.send("menu-documentation")
        },
        { type: "separator" },
        ...e ? [] : [
          {
            label: "About",
            click: () => {
              S();
            }
          }
        ]
      ]
    }
  ], a = f.buildFromTemplate(r);
  f.setApplicationMenu(a);
}
async function h() {
  n = new v({
    width: 1200,
    height: 800,
    title: "",
    icon: N(),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: i(E, "preload.js")
    }
  });
  const e = process.env.NODE_ENV === "development" ? ["http://localhost:3000", c] : [c], r = (t) => e.some((s) => t.startsWith(s)), a = (t) => {
    if (r(t)) return !1;
    try {
      const s = new URL(t);
      return s.protocol === "http:" || s.protocol === "https:";
    } catch {
      return !1;
    }
  };
  n.webContents.setWindowOpenHandler(({ url: t }) => (a(t) && w.openExternal(t), { action: "deny" })), n.webContents.on("will-navigate", (t, s) => {
    a(s) && (t.preventDefault(), w.openExternal(s));
  }), process.env.NODE_ENV === "development" ? (await n.loadURL("http://localhost:3000"), n.webContents.openDevTools()) : await n.loadURL(c), n.on("closed", () => {
    n = null;
  });
}
o.whenReady().then(async () => {
  await D(), U(), await h(), o.on("activate", async () => {
    v.getAllWindows().length === 0 && await h();
  });
}).catch((e) => {
  const r = e instanceof Error ? e.message : String(e);
  console.error("[main] startup failed:", e), b.showErrorBox("Feats failed to start", r), o.quit();
});
o.on("before-quit", () => {
  l && !l.killed && l.kill();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
