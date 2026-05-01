import { app as o, BrowserWindow as h, dialog as C, session as y, Menu as g, shell as v } from "electron";
import { spawn as N } from "node:child_process";
import { existsSync as u, readdirSync as D } from "node:fs";
import { dirname as T, join as l } from "node:path";
import { Socket as _ } from "node:net";
import { fileURLToPath as k } from "node:url";
const E = "1.1.15", P = "01 May 2026", O = k(import.meta.url), S = T(O);
o.setName("Feats");
o.commandLine.appendSwitch("no-proxy-server");
o.commandLine.appendSwitch("proxy-bypass-list", "*");
o.commandLine.appendSwitch("host-resolver-rules", "MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1");
o.commandLine.appendSwitch("disable-features", "AsyncDns,SystemResolverConfigChanged,CertificateNetworkService");
o.commandLine.appendSwitch("disable-net-logging");
o.commandLine.appendSwitch("disable-blink-features", "DnsPrefetch");
process.platform === "win32" && o.setAppUserModelId("com.feats.app");
o.setAboutPanelOptions({
  applicationName: "Feats",
  applicationVersion: `${E} (${P})`,
  version: ""
  // Suppress default Electron version info
});
const f = Number(process.env.NUXT_PORT || 3e3), m = `http://127.0.0.1:${f}`;
let p = null, r = null, c = null;
o.on("session-created", (e) => {
  e.setProxy({ mode: "direct" }).then(() => e.closeAllConnections()).catch((n) => {
    console.error("[main] failed to force direct proxy mode on session:", n);
  });
});
async function U() {
  await Promise.all([
    o.setProxy({ mode: "direct" }),
    y.defaultSession.setProxy({ mode: "direct" })
  ]), o.configureHostResolver({
    enableBuiltInResolver: !1,
    enableHappyEyeballs: !1,
    secureDnsMode: "off"
  }), await y.defaultSession.closeAllConnections();
}
function w() {
  return o.isPackaged ? o.getAppPath() : l(S, "..");
}
function R() {
  const e = process.platform === "win32" ? "icon.ico" : "icon.png";
  return o.isPackaged ? l(process.resourcesPath, e) : l(w(), "build", e);
}
function L(e) {
  return e.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
function I() {
  if (c && !c.isDestroyed()) {
    c.focus();
    return;
  }
  const e = `Version ${E} (${P})`, n = `<!doctype html>
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
      <p class="version">${L(e)}</p>
    </div>
  </body>
</html>`;
  c = new h({
    width: 380,
    height: 130,
    resizable: !1,
    minimizable: !1,
    maximizable: !1,
    fullscreenable: !1,
    autoHideMenuBar: !0,
    title: "About Feats",
    parent: r ?? void 0,
    modal: r !== null,
    icon: R(),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0
    }
  }), c.on("closed", () => {
    c = null;
  }), c.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(n)}`);
}
function F() {
  if (process.platform === "win32") {
    I();
    return;
  }
  o.showAboutPanel();
}
function $() {
  return o.isPackaged ? process.resourcesPath : w();
}
function W() {
  const e = w();
  if (process.env.NUXT_SERVER_ENTRY && u(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const n = D(e, { withFileTypes: !0 }).filter((t) => t.isDirectory() && t.name.startsWith("feats_v")).map((t) => t.name).sort();
  for (let t = n.length - 1; t >= 0; t--) {
    const s = l(e, n[t], "server", "index.mjs");
    if (u(s)) return s;
  }
  const a = [
    l(e, ".output", "server", "index.mjs"),
    l(process.resourcesPath, ".output", "server", "index.mjs"),
    l(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
  ];
  for (const t of a)
    if (u(t)) return t;
  return null;
}
function z(e, n, a = 2e4) {
  const t = Date.now();
  return new Promise((s, A) => {
    const b = setInterval(() => {
      const i = new _();
      let d = !1;
      i.setTimeout(1e3), i.on("connect", () => {
        d || (d = !0, i.destroy(), clearInterval(b), s());
      }), i.on("timeout", () => {
        d || (d = !0, i.destroy());
      }), i.on("error", () => {
        d || (d = !0, i.destroy());
      }), i.connect(n, e), Date.now() - t > a && (clearInterval(b), A(new Error(`Nuxt server did not start in time: ${e}:${n}`)));
    }, 300);
  });
}
async function V() {
  if (process.env.NODE_ENV === "development") return;
  const e = W();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const n = process.execPath, a = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  p = N(n, [e], {
    cwd: $(),
    env: { ...a, PORT: String(f), HOST: "127.0.0.1", FEATS_USER_DATA: o.getPath("userData") },
    stdio: "pipe"
  }), p.stdout.on("data", (t) => console.log(`[nuxt] ${t}`)), p.stderr.on("data", (t) => console.error(`[nuxt] ${t}`)), await z("127.0.0.1", f);
}
function M() {
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
              F();
            }
          }
        ]
      ]
    }
  ], a = g.buildFromTemplate(n);
  g.setApplicationMenu(a);
}
async function x() {
  r = new h({
    width: 1200,
    height: 800,
    title: "",
    icon: R(),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: l(S, "preload.js")
    }
  });
  const e = process.env.NODE_ENV === "development" ? ["http://localhost:3000", m] : [m], n = (t) => e.some((s) => t.startsWith(s)), a = (t) => {
    if (n(t)) return !1;
    try {
      const s = new URL(t);
      return s.protocol === "http:" || s.protocol === "https:";
    } catch {
      return !1;
    }
  };
  r.webContents.setWindowOpenHandler(({ url: t }) => (a(t) && v.openExternal(t), { action: "deny" })), r.webContents.on("will-navigate", (t, s) => {
    a(s) && (t.preventDefault(), v.openExternal(s));
  }), process.env.NODE_ENV === "development" ? (await r.loadURL("http://localhost:3000"), r.webContents.openDevTools()) : await r.loadURL(m), r.on("closed", () => {
    r = null;
  });
}
o.whenReady().then(async () => {
  await U(), await V(), await new Promise((e) => setTimeout(e, 50)), M(), await x(), o.on("activate", async () => {
    h.getAllWindows().length === 0 && await x();
  });
}).catch((e) => {
  const n = e instanceof Error ? e.message : String(e);
  console.error("[main] startup failed:", e), C.showErrorBox("Feats failed to start", n), o.quit();
});
o.on("before-quit", () => {
  p && !p.killed && p.kill();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
