import { contextBridge, ipcRenderer } from "electron";

// Expose window controls to renderer process
contextBridge.exposeInMainWorld("electronWindow", {
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close: () => ipcRenderer.invoke("window:close"),
});

// Expose process.platform to renderer process
contextBridge.exposeInMainWorld("process", {
  platform: process.platform,
  type: process.type,
});
