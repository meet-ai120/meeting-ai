import { ThemeMode } from "@/lib/types/theme-mode";
import { hasNativeTheme } from "./platform_helpers";

const THEME_KEY = "theme";

export interface ThemePreferences {
  system: ThemeMode;
  local: ThemeMode | null;
}

/**
 * Get system color scheme preference
 */
function getSystemTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Get the current theme
 */
export async function getCurrentTheme(): Promise<ThemePreferences> {
  const localTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null;

  if (hasNativeTheme()) {
    const currentTheme = await window.themeMode.current();
    return {
      system: currentTheme,
      local: localTheme,
    };
  }

  // In web, use system preference
  return {
    system: getSystemTheme(),
    local: localTheme,
  };
}

/**
 * Set theme
 */
export async function setTheme(newTheme: ThemeMode) {
  if (hasNativeTheme()) {
    switch (newTheme) {
      case "dark":
        await window.themeMode.dark();
        updateDocumentTheme(true);
        break;
      case "light":
        await window.themeMode.light();
        updateDocumentTheme(false);
        break;
      case "system": {
        const isDarkMode = await window.themeMode.system();
        updateDocumentTheme(isDarkMode);
        break;
      }
    }
  } else {
    // In web, we can only toggle between light and dark
    if (newTheme === "system") {
      updateDocumentTheme(getSystemTheme() === "dark");
    } else {
      updateDocumentTheme(newTheme === "dark");
    }
  }

  localStorage.setItem(THEME_KEY, newTheme);
}

/**
 * Toggle theme
 */
export async function toggleTheme() {
  if (hasNativeTheme()) {
    const isDarkMode = await window.themeMode.toggle();
    updateDocumentTheme(isDarkMode);
    localStorage.setItem(THEME_KEY, isDarkMode ? "dark" : "light");
    return;
  }

  // In web, toggle based on current class
  const isDark = document.documentElement.classList.contains("dark");
  const newTheme = isDark ? "light" : "dark";
  updateDocumentTheme(!isDark);
  localStorage.setItem(THEME_KEY, newTheme);
}

/**
 * Sync theme with local storage
 */
export async function syncThemeWithLocal() {
  const { local } = await getCurrentTheme();
  if (!local) {
    setTheme("system");
    return;
  }

  await setTheme(local);
}

/**
 * Update document theme
 */
function updateDocumentTheme(isDarkMode: boolean) {
  if (!isDarkMode) {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }
}
