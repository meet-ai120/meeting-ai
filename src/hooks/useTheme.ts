import { useEffect, useState } from "react";
import { ThemeMode } from "@/lib/types/theme-mode";
import {
  getCurrentTheme,
  setTheme,
  toggleTheme as toggleThemeHelper,
} from "@/helpers/theme_helpers";
import { ThemePreferences } from "@/helpers/theme_helpers";

export function useTheme() {
  const [themePreferences, setThemePreferences] =
    useState<ThemePreferences | null>(null);

  useEffect(() => {
    // Initial theme load
    getCurrentTheme().then(setThemePreferences);

    // Listen for system theme changes
    const handleStorageChange = () => {
      getCurrentTheme().then(setThemePreferences);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleTheme = async () => {
    await toggleThemeHelper();
    const newTheme = await getCurrentTheme();
    setThemePreferences(newTheme);
  };

  const changeTheme = async (newTheme: ThemeMode) => {
    await setTheme(newTheme);
    const updatedTheme = await getCurrentTheme();
    setThemePreferences(updatedTheme);
  };

  return {
    themePreferences,
    toggleTheme,
    changeTheme,
    isDark: document.documentElement.classList.contains("dark"),
  };
}
