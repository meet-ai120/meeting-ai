import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

export function exposeAudioPreload() {
  contextBridge.exposeInMainWorld("electron", {
    startSystemAudioRecording: () => {
      ipcRenderer.send("start-system-audio-recording");
    },
    stopSystemAudioRecording: () => {
      ipcRenderer.send("stop-system-audio-recording");
    },
    onSystemAudioData: (callback: (data: Buffer) => void) => {
      const subscription = (_event: IpcRendererEvent, data: Buffer) =>
        callback(data);
      ipcRenderer.on("system-audio-data", subscription);
      return () => {
        ipcRenderer.removeListener("system-audio-data", subscription);
      };
    },
  });
}
