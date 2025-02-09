import { ipcMain, nativeTheme } from "electron";
import {
  THEME_GET_CURRENT_CHANNEL,
  THEME_SET_DARK_CHANNEL,
  THEME_SET_LIGHT_CHANNEL,
  THEME_SET_SYSTEM_CHANNEL,
  THEME_TOGGLE_CHANNEL,
} from "./theme-channels";

export function addThemeEventListeners() {
  ipcMain.handle(THEME_GET_CURRENT_CHANNEL, () => {
    return nativeTheme.themeSource;
  });

  ipcMain.handle(THEME_TOGGLE_CHANNEL, () => {
    const isDark = nativeTheme.shouldUseDarkColors;
    nativeTheme.themeSource = isDark ? "light" : "dark";
    return !isDark;
  });

  ipcMain.handle(THEME_SET_DARK_CHANNEL, () => {
    nativeTheme.themeSource = "dark";
  });

  ipcMain.handle(THEME_SET_LIGHT_CHANNEL, () => {
    nativeTheme.themeSource = "light";
  });

  ipcMain.handle(THEME_SET_SYSTEM_CHANNEL, () => {
    nativeTheme.themeSource = "system";
    return nativeTheme.shouldUseDarkColors;
  });
}
