import { exposeThemeContext } from "./theme/theme-context";
import { exposeWindowContext } from "./window/window-context";
import { exposeElectronContext } from "./electron/electron-context";

export default function exposeContexts() {
  exposeWindowContext();
  exposeThemeContext();
  exposeElectronContext();
}
