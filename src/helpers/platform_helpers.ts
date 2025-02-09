/**
 * Platform detection utilities for the application
 */

/**
 * Enum representing different platforms the app can run on
 */
export enum Platform {
  Windows = "windows",
  Mac = "mac",
  Web = "web",
}

/**
 * Check if the app is running in an Electron environment
 */
export const isElectron = (): boolean => {
  return window?.process?.type === "renderer" || "electron" in window;
};

/**
 * Check if native theme API is available
 */
export const hasNativeTheme = (): boolean => {
  return isElectron() && "themeMode" in window;
};

/**
 * Check if the app is running on macOS
 */
export const isMac = (): boolean => {
  if (isElectron()) {
    return process.platform === "darwin";
  }
  return window.navigator.platform.toLowerCase().includes("mac");
};

/**
 * Check if the app is running on Windows
 */
export const isWindows = (): boolean => {
  if (isElectron()) {
    return process.platform === "win32";
  }
  return window.navigator.platform.toLowerCase().includes("win");
};

/**
 * Check if the app is running in a web browser (not Electron)
 */
export const isWeb = (): boolean => {
  return !isElectron();
};

/**
 * Get the current platform the app is running on
 */
export const getPlatform = (): Platform => {
  if (isMac()) return Platform.Mac;
  if (isWindows()) return Platform.Windows;
  return Platform.Web;
};
