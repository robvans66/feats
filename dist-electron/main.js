import { app as o, BrowserWindow as y, dialog as S, session as h, Menu as b, shell as v } from "electron";
import { spawn as R } from "node:child_process";
import { existsSync as u, readdirSync as N } from "node:fs";
import { dirname as C, join as i } from "node:path";
import { Socket as x } from "node:net";
import { fileURLToPath as A } from "node:url";
const D = "1.2.4", T = "18 Jun 2026", _ = A(import.meta.url), E = C(_);
o.setName("Feats");
o.commandLine.appendSwitch("no-proxy-server");
o.commandLine.appendSwitch("proxy-bypass-list", "*");
o.commandLine.appendSwitch("host-resolver-rules", "MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1");
o.commandLine.appendSwitch("disable-features", "AsyncDns,SystemResolverConfigChanged,CertificateNetworkService");
o.commandLine.appendSwitch("disable-net-logging");
o.commandLine.appendSwitch("disable-blink-features", "DnsPrefetch");
process.platform === "win32" && o.setAppUserModelId("com.feats.app");
const f = Number(process.env.NUXT_PORT || 3e3), m = `http://127.0.0.1:${f}`;
let d = null, r = null;
o.on("session-created", (e) => {
  e.setProxy({ mode: "direct" }).then(() => e.closeAllConnections()).catch((n) => {
    console.error("[main] failed to force direct proxy mode on session:", n);
  });
});
async function k() {
  await Promise.all([
    o.setProxy({ mode: "direct" }),
    h.defaultSession.setProxy({ mode: "direct" })
  ]), o.configureHostResolver({
    enableBuiltInResolver: !1,
    enableHappyEyeballs: !1,
    secureDnsMode: "off"
  }), await h.defaultSession.closeAllConnections();
}
function p() {
  return o.isPackaged ? o.getAppPath() : i(E, "..");
}
function O() {
  const e = process.platform === "win32" ? "icon.ico" : "icon.png";
  return o.isPackaged ? i(process.resourcesPath, e) : i(p(), "build", e);
}
function U() {
  return o.isPackaged ? i(process.resourcesPath, "icon.png") : i(p(), "build", "icon.png");
}
function L() {
  o.showAboutPanel();
}
function I() {
  return o.isPackaged ? process.resourcesPath : p();
}
function F() {
  const e = p();
  if (process.env.NUXT_SERVER_ENTRY && u(process.env.NUXT_SERVER_ENTRY))
    return process.env.NUXT_SERVER_ENTRY;
  const n = N(e, { withFileTypes: !0 }).filter((t) => t.isDirectory() && t.name.startsWith("feats_v")).map((t) => t.name).sort();
  for (let t = n.length - 1; t >= 0; t--) {
    const s = i(e, n[t], "server", "index.mjs");
    if (u(s)) return s;
  }
  const a = [
    i(e, ".output", "server", "index.mjs"),
    i(process.resourcesPath, ".output", "server", "index.mjs"),
    i(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
  ];
  for (const t of a)
    if (u(t)) return t;
  return null;
}
function V(e, n, a = 2e4) {
  const t = Date.now();
  return new Promise((s, P) => {
    const w = setInterval(() => {
      const l = new x();
      let c = !1;
      l.setTimeout(1e3), l.on("connect", () => {
        c || (c = !0, l.destroy(), clearInterval(w), s());
      }), l.on("timeout", () => {
        c || (c = !0, l.destroy());
      }), l.on("error", () => {
        c || (c = !0, l.destroy());
      }), l.connect(n, e), Date.now() - t > a && (clearInterval(w), P(new Error(`Nuxt server did not start in time: ${e}:${n}`)));
    }, 300);
  });
}
async function W() {
  if (process.env.NODE_ENV === "development") return;
  const e = F();
  if (!e)
    throw new Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
  const n = process.execPath, a = { ...process.env, ELECTRON_RUN_AS_NODE: "1" };
  d = R(n, [e], {
    cwd: I(),
    env: { ...a, PORT: String(f), HOST: "127.0.0.1", FEATS_USER_DATA: o.getPath("userData") },
    stdio: "pipe"
  }), d.stdout.on("data", (t) => console.log(`[nuxt] ${t}`)), d.stderr.on("data", (t) => console.error(`[nuxt] ${t}`)), await V("127.0.0.1", f);
}
function $() {
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
          { role: "zoom" }
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
              L();
            }
          }
        ]
      ]
    }
  ], a = b.buildFromTemplate(n);
  b.setApplicationMenu(a);
}
async function g() {
  r = new y({
    width: 1200,
    height: 800,
    title: "",
    icon: O(),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      preload: i(E, "preload.js")
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
  o.setAboutPanelOptions({
    applicationName: "Feats",
    applicationVersion: `${D} (${T})`,
    version: "",
    iconPath: U()
  }), await k(), await W(), await new Promise((e) => setTimeout(e, 50)), $(), await g(), o.on("activate", async () => {
    y.getAllWindows().length === 0 && await g();
  });
}).catch((e) => {
  const n = e instanceof Error ? e.message : String(e);
  console.error("[main] startup failed:", e), S.showErrorBox("Feats failed to start", n), o.quit();
});
o.on("before-quit", () => {
  d && !d.killed && d.kill();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
