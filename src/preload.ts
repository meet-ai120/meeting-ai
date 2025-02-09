import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("systemAudio", {
  startRecording: () => ipcRenderer.invoke("start-system-audio"),
  stopRecording: () => ipcRenderer.invoke("stop-system-audio"),
  onData: (callback: (data: Buffer) => void) => {
    ipcRenderer.on("system-audio-data", (_event, data) => callback(data));
  },
  removeDataListener: (callback: (data: Buffer) => void) => {
    ipcRenderer.removeListener("system-audio-data", callback);
  },
});
