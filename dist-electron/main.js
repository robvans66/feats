import { app as n, BrowserWindow as u, dialog as P, Menu as w, shell as b } from "electron";
import { spawn as A } from "node:child_process";
import { existsSync as d, readdirSync as N } from "node:fs";
import { dirname as C, join as l } from "node:path";
import { fileURLToPath as _ } from "node:url";
const v = "1.1.3", y = "25 Mar 2026", S = _(import.meta.url), x = C(S);
n.setName("Feats");
process.platform === "win32" && n.setAppUserModelId("com.feats.app");
n.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${v} (${y})`,
  version: ""
  // Suppress default Electron version info
});
const E = Number(process.env.NUXT_PORT || 3e3), p = `http://127.0.0.1:${E}`;
let c = null, o = null, i = null;
function m() {
  return n.isPackaged ? n.getAppPath() : l(x, "..");
}
function R() {
  const e = process.platform === "win32" ? "icon.ico" : "icon.png";
  return n.isPackaged ? l(process.resourcesPath, e) : l(m(), "build", e);
}
function T(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function O() {
  if (i && !i.isDestroyed()) {
    i.focus();
    return;
  }
  const e = `Version ${v} (${y})`, r = `<!doctype html>
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
      <p class="version">${T(e)}</p>
    </div>
  </body>
</html>`;
  i = new u({
    width: 380,
    height: 130,
    resizable: !1,
    minimizable: !1,
    maximizable: !1,
    fullscreenable: !1,
    autoHideMenuBar: !0,
    title: "About Feats",
    parent: o ?? void 0,
    modal: o !== null,
    icon: R(),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), i.on("closed", () => {
    i = null;
  }), i.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(r)}`);
}
function k() {
  if (process.platform === "win32") {
    O();
    return;
  }
  n.showAboutPanel();
}
function U() {
  return n.isPackaged ? process.resourcesPath : m();
}
function D() {
  const e = m();
  if (process.env.NUXT_SERVER_ENTRY && d(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const r = N(e, { withFileTypes: !0 }).filter((t) => t.isDirectory() && t.name.startsWith("feats_v")).map((t) => t.name).sort();
  for (let t = r.length - 1; t >= 0; t--) {
    const s = l(e, r[t], "server", "index.mjs");
    if (d(s)) return s;
  }
  const a = [
    l(e, ".output", "server", "index.mjs"),
    l(process.resourcesPath, ".output", "server", "index.mjs"),
    l(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
  ];
  for (const t of a)
    if (d(t)) return t;
  return null;
}
function I(e, r = 2e4) {
  const a = Date.now();
  return new Promise((t, s) => {
    const f = setInterval(async () => {
      try {
        const h = await fetch(e);
        if (h.ok || h.status < 500) {
          clearInterval(f), t();
          return;
        }
      } catch {
      }
      Date.now() - a > r && (clearInterval(f), s(new Error(`Nuxt server did not start in time: ${e}`)));
    }, 300);
  });
}
async function W() {
  if (process.env.NODE_ENV === "development") return;
  const e = D();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const r = process.execPath, a = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  c = A(r, [e], {
    cwd: U(),
    env: { ...a, PORT: String(E), HOST: "127.0.0.1" },
    stdio: "pipe"
  }), c.stdout.on("data", (t) => console.log(`[nuxt] ${t}`)), c.stderr.on("data", (t) => console.error(`[nuxt] ${t}`)), await I(p);
}
function $() {
  const e = process.platform === "darwin", r = [
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
          click: () => o?.webContents.send("menu-documentation")
        },
        { type: "separator" },
        ...e ? [] : [
          {
            label: "About",
            click: () => {
              k();
            }
          }
        ]
      ]
    }
  ], a = w.buildFromTemplate(r);
  w.setApplicationMenu(a);
}
async function g() {
  o = new u({
    width: 1200,
    height: 800,
    title: "",
    icon: R(),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: l(x, "preload.js")
    }
  });
  const e = process.env.NODE_ENV === "development" ? ["http://localhost:3000", p] : [p], r = (t) => e.some((s) => t.startsWith(s)), a = (t) => {
    if (r(t)) return !1;
    try {
      const s = new URL(t);
      return s.protocol === "http:" || s.protocol === "https:";
    } catch {
      return !1;
    }
  };
  o.webContents.setWindowOpenHandler(({ url: t }) => (a(t) && b.openExternal(t), { action: "deny" })), o.webContents.on("will-navigate", (t, s) => {
    a(s) && (t.preventDefault(), b.openExternal(s));
  }), process.env.NODE_ENV === "development" ? (await o.loadURL("http://localhost:3000"), o.webContents.openDevTools()) : await o.loadURL(p), o.on("closed", () => {
    o = null;
  });
}
n.whenReady().then(async () => {
  await W(), $(), await g(), n.on("activate", async () => {
    u.getAllWindows().length === 0 && await g();
  });
}).catch((e) => {
  const r = e instanceof Error ? e.message : String(e);
  console.error("[main] startup failed:", e), P.showErrorBox("Feats failed to start", r), n.quit();
});
n.on("before-quit", () => {
  c && !c.killed && c.kill();
});
n.on("window-all-closed", () => {
  process.platform !== "darwin" && n.quit();
});
