import { isElectron } from "./platform_helpers";

/**
 * Window state interface
 */
interface WindowState {
  isMaximized: boolean;
  isMinimized: boolean;
  isFullScreen: boolean;
}

/**
 * Get the current window state
 */
export const getWindowState = async (): Promise<WindowState> => {
  if (!isElectron()) {
    return {
      isMaximized: false,
      isMinimized: false,
      isFullScreen: document.fullscreenElement !== null,
    };
  }

  // For Electron, we'll use the window API
  const win = window.electronWindow;
  return {
    isMaximized: false, // TODO: Implement when needed
    isMinimized: false, // TODO: Implement when needed
    isFullScreen: false, // TODO: Implement when needed
  };
};

/**
 * Minimize the window
 */
export const minimizeWindow = async (): Promise<void> => {
  if (!isElectron()) {
    // In web, minimizing is not possible
    return;
  }
  await window.electronWindow.minimize();
};

/**
 * Maximize or restore the window
 */
export const maximizeWindow = async (): Promise<void> => {
  if (!isElectron()) {
    // In web, try to use the fullscreen API
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
    return;
  }
  await window.electronWindow.maximize();
};

/**
 * Close the window
 */
export const closeWindow = async (): Promise<void> => {
  if (!isElectron()) {
    // In web, we can only close if we opened the window
    if (window.opener) {
      window.close();
    }
    return;
  }
  await window.electronWindow.close();
};

/**
 * Check if window controls should be shown
 * This is useful for platforms like macOS where window controls are handled by the OS
 */
export const shouldShowWindowControls = (): boolean => {
  if (!isElectron()) {
    return false; // Don't show controls in web
  }
  // On macOS, window controls are handled by the OS
  return process.platform !== "darwin";
};
