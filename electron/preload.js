"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    onMenuRides: function (cb) { return electron_1.ipcRenderer.on('menu-rides', cb); },
    onMenuRoutes: function (cb) { return electron_1.ipcRenderer.on('menu-routes', cb); },
    onMenuStatistics: function (cb) { return electron_1.ipcRenderer.on('menu-statistics', cb); },
    onMenuDocumentation: function (cb) { return electron_1.ipcRenderer.on('menu-documentation', cb); },
    onMenuSettings: function (cb) { return electron_1.ipcRenderer.on('menu-settings', cb); },
    onMenuConfiguration: function (cb) { return electron_1.ipcRenderer.on('menu-settings', cb); }
});
