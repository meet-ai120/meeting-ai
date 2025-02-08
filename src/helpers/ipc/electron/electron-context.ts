import { GET_SOURCES_CHANNEL } from "./electron-channels";

export function exposeElectronContext() {
  const { contextBridge, ipcRenderer } = window.require("electron");

  contextBridge.exposeInMainWorld("electron", {
    getSources: () => ipcRenderer.invoke(GET_SOURCES_CHANNEL),
  });
}
