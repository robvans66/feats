import { BrowserWindow as e, Menu as t, app as n, dialog as r, session as i, shell as a } from "electron";
import { spawn as o } from "node:child_process";
import { existsSync as s, readdirSync as c } from "node:fs";
import { dirname as l, join as u } from "node:path";
import { Socket as d } from "node:net";
import { fileURLToPath as f } from "node:url";
//#region version.ts
var p = "1.3.2", m = "04 Sept 2026", h = l(f(import.meta.url));
n.setName("Feats"), n.commandLine.appendSwitch("no-proxy-server"), n.commandLine.appendSwitch("proxy-bypass-list", "*"), n.commandLine.appendSwitch("host-resolver-rules", "MAP * ~NOTFOUND, EXCLUDE localhost, EXCLUDE 127.0.0.1"), n.commandLine.appendSwitch("disable-features", "AsyncDns,SystemResolverConfigChanged,CertificateNetworkService"), n.commandLine.appendSwitch("disable-net-logging"), n.commandLine.appendSwitch("disable-blink-features", "DnsPrefetch"), process.platform === "win32" && n.setAppUserModelId("com.feats.app");
var g = Number(process.env.NUXT_PORT || 3e3), _ = `http://127.0.0.1:${g}`, v = null, y = null;
n.on("session-created", (e) => {
	e.setProxy({ mode: "direct" }).then(() => e.closeAllConnections()).catch((e) => {
		console.error("[main] failed to force direct proxy mode on session:", e);
	});
});
async function b() {
	await Promise.all([n.setProxy({ mode: "direct" }), i.defaultSession.setProxy({ mode: "direct" })]), n.configureHostResolver({
		enableBuiltInResolver: !1,
		enableHappyEyeballs: !1,
		secureDnsMode: "off"
	}), await i.defaultSession.closeAllConnections();
}
function x() {
	return n.isPackaged ? n.getAppPath() : u(h, "..");
}
function S() {
	let e = process.platform === "win32" ? "icon.ico" : "icon.png";
	return n.isPackaged ? u(process.resourcesPath, e) : u(x(), "build", e);
}
function C() {
	return n.isPackaged ? u(process.resourcesPath, "icon.png") : u(x(), "build", "icon.png");
}
function w() {
	n.showAboutPanel();
}
function T() {
	return n.isPackaged ? process.resourcesPath : x();
}
function E() {
	let e = x();
	if (process.env.NUXT_SERVER_ENTRY && s(process.env.NUXT_SERVER_ENTRY)) return process.env.NUXT_SERVER_ENTRY;
	let t = c(e, { withFileTypes: !0 }).filter((e) => e.isDirectory() && e.name.startsWith("feats_v")).map((e) => e.name).sort();
	for (let n = t.length - 1; n >= 0; n--) {
		let r = u(e, t[n], "server", "index.mjs");
		if (s(r)) return r;
	}
	let n = [
		u(e, ".output", "server", "index.mjs"),
		u(process.resourcesPath, ".output", "server", "index.mjs"),
		u(process.resourcesPath, "app.asar.unpacked", ".output", "server", "index.mjs")
	];
	for (let e of n) if (s(e)) return e;
	return null;
}
function D(e, t, n = 2e4) {
	let r = Date.now();
	return new Promise((i, a) => {
		let o = setInterval(() => {
			let s = new d(), c = !1;
			s.setTimeout(1e3), s.on("connect", () => {
				c || (c = !0, s.destroy(), clearInterval(o), i());
			}), s.on("timeout", () => {
				c || (c = !0, s.destroy());
			}), s.on("error", () => {
				c || (c = !0, s.destroy());
			}), s.connect(t, e), Date.now() - r > n && (clearInterval(o), a(/* @__PURE__ */ Error(`Nuxt server did not start in time: ${e}:${t}`)));
		}, 300);
	});
}
async function O() {
	if (process.env.NODE_ENV === "development") return;
	let e = E();
	if (!e) throw Error("Cannot find Nuxt server entry (feats_v*/server/index.mjs)");
	let t = process.execPath, r = {
		...process.env,
		ELECTRON_RUN_AS_NODE: "1"
	};
	v = o(t, [e], {
		cwd: T(),
		env: {
			...r,
			PORT: String(g),
			HOST: "127.0.0.1",
			FEATS_USER_DATA: n.getPath("userData")
		},
		stdio: "pipe"
	}), v.stdout.on("data", (e) => console.log(`[nuxt] ${e}`)), v.stderr.on("data", (e) => console.error(`[nuxt] ${e}`)), await D("127.0.0.1", g);
}
function k() {
	let e = process.platform === "darwin", r = [
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
		{
			label: "File",
			submenu: [
				{
					label: "Rides",
					accelerator: "CmdOrCtrl+R",
					click: () => y?.webContents.send("menu-rides")
				},
				{
					label: "Routes",
					accelerator: "CmdOrCtrl+T",
					click: () => y?.webContents.send("menu-routes")
				},
				{
					label: "Manage Data",
					accelerator: "CmdOrCtrl+M",
					click: () => y?.webContents.send("menu-manage-data")
				},
				{
					label: "Statistics",
					accelerator: "CmdOrCtrl+S",
					click: () => y?.webContents.send("menu-statistics")
				},
				{ type: "separator" },
				{
					label: "Settings",
					accelerator: "CmdOrCtrl+,",
					click: () => y?.webContents.send("menu-settings")
				},
				{ type: "separator" },
				...e ? [{ role: "close" }] : [{ role: "quit" }]
			]
		},
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
		{
			label: "View",
			submenu: [
				{
					role: "reload",
					accelerator: ""
				},
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
		{
			label: "Window",
			submenu: [{ role: "minimize" }, ...e ? [{ role: "zoom" }] : [{ role: "close" }]]
		},
		{
			role: "help",
			submenu: [
				{
					label: "Documentation",
					click: () => y?.webContents.send("menu-documentation")
				},
				{ type: "separator" },
				...e ? [] : [{
					label: "About",
					click: () => {
						w();
					}
				}]
			]
		}
	], i = t.buildFromTemplate(r);
	t.setApplicationMenu(i);
}
async function A() {
	y = new e({
		width: 1200,
		height: 800,
		title: "",
		icon: S(),
		webPreferences: {
			nodeIntegration: !1,
			contextIsolation: !0,
			preload: u(h, "preload.js")
		}
	});
	let t = process.env.NODE_ENV === "development" ? ["http://localhost:3000", _] : [_], n = (e) => t.some((t) => e.startsWith(t)), r = (e) => {
		if (n(e)) return !1;
		try {
			let t = new URL(e);
			return t.protocol === "http:" || t.protocol === "https:";
		} catch {
			return !1;
		}
	};
	y.webContents.setWindowOpenHandler(({ url: e }) => (r(e) && a.openExternal(e), { action: "deny" })), y.webContents.on("will-navigate", (e, t) => {
		r(t) && (e.preventDefault(), a.openExternal(t));
	}), process.env.NODE_ENV === "development" ? (await y.loadURL("http://localhost:3000"), y.webContents.openDevTools()) : await y.loadURL(_), y.on("closed", () => {
		y = null;
	});
}
n.whenReady().then(async () => {
	n.setAboutPanelOptions({
		applicationName: "Feats",
		applicationVersion: `${p} (${m})`,
		version: "",
		iconPath: C()
	}), await b(), await O(), await new Promise((e) => setTimeout(e, 50)), k(), await A(), n.on("activate", async () => {
		e.getAllWindows().length === 0 && await A();
	});
}).catch((e) => {
	let t = e instanceof Error ? e.message : String(e);
	console.error("[main] startup failed:", e), r.showErrorBox("Feats failed to start", t), n.quit();
}), n.on("before-quit", () => {
	v && !v.killed && v.kill();
}), n.on("window-all-closed", () => {
	process.platform !== "darwin" && n.quit();
});
//#endregion
