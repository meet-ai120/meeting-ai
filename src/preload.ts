import { contextBridge, ipcRenderer } from "electron";
import {
  WIN_MINIMIZE_CHANNEL,
  WIN_MAXIMIZE_CHANNEL,
  WIN_CLOSE_CHANNEL,
} from "./helpers/ipc/window/window-channels";
import {
  THEME_GET_CURRENT_CHANNEL,
  THEME_SET_DARK_CHANNEL,
  THEME_SET_LIGHT_CHANNEL,
  THEME_SET_SYSTEM_CHANNEL,
  THEME_TOGGLE_CHANNEL,
} from "./helpers/ipc/theme/theme-channels";

// Expose window controls to renderer
contextBridge.exposeInMainWorld("electronWindow", {
  minimize: () => ipcRenderer.invoke(WIN_MINIMIZE_CHANNEL),
  maximize: () => ipcRenderer.invoke(WIN_MAXIMIZE_CHANNEL),
  close: () => ipcRenderer.invoke(WIN_CLOSE_CHANNEL),
});

// Expose theme controls to renderer
contextBridge.exposeInMainWorld("themeMode", {
  toggle: () => ipcRenderer.invoke(THEME_TOGGLE_CHANNEL),
  dark: () => ipcRenderer.invoke(THEME_SET_DARK_CHANNEL),
  light: () => ipcRenderer.invoke(THEME_SET_LIGHT_CHANNEL),
  system: () => ipcRenderer.invoke(THEME_SET_SYSTEM_CHANNEL),
  current: () => ipcRenderer.invoke(THEME_GET_CURRENT_CHANNEL),
});
