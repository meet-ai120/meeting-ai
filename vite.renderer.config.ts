import path from "path";
import react from "@vitejs/plugin-react";
import type { ConfigEnv, UserConfig } from "vite";
import { defineConfig } from "vite";
import { pluginExposeRenderer } from "./vite.base.config";
import type { ForgeConfig } from "@electron-forge/shared-types";

interface ForgeEnv extends ConfigEnv {
  forgeConfigSelf: NonNullable<ForgeConfig["plugins"]>[number];
  root: string;
}

// https://vitejs.dev/config
export default defineConfig(async (env) => {
  const forgeEnv = env as ForgeEnv;
  const { root, mode, forgeConfigSelf } = forgeEnv;
  const name = forgeConfigSelf.name ?? "";

  const { viteStaticCopy } = await import("vite-plugin-static-copy");

  return {
    root,
    mode,
    base: "./",
    build: {
      outDir: `.vite/renderer/${name}`,
    },
    plugins: [
      pluginExposeRenderer(name),
      react(),
      viteStaticCopy({
        targets: [
          {
            src: "node_modules/@ricky0123/vad-web/dist/vad.worklet.bundle.min.js",
            dest: "./",
          },
          {
            src: "node_modules/@ricky0123/vad-web/dist/silero_vad_v5.onnx",
            dest: "./",
          },
          {
            src: "node_modules/@ricky0123/vad-web/dist/silero_vad_legacy.onnx",
            dest: "./",
          },
          {
            src: "node_modules/onnxruntime-web/dist/*.wasm",
            dest: "./",
          },
        ],
      }),
    ],
    resolve: {
      preserveSymlinks: true,
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    clearScreen: false,
  } as UserConfig;
});
