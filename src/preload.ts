import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  startRecording: () => ipcRenderer.invoke("start-recording"),
  stopRecording: () => ipcRenderer.invoke("stop-recording"),
});

export type ElectronAPI = {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string>;
};
