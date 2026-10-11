import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export function createViteConfig({
  basePath = "/",
  outDir = "dist",
  port = 4173,
  clientEntry = "./src/main.jsx",
} = {}) {
  return defineConfig(({ command }) => ({
    base: command === "build" ? basePath : "/",
    build: {
      emptyOutDir: true,
      outDir,
    },
    optimizeDeps: {
      include: ["react", "react-dom/client"],
    },
    plugins: [react()],
    server: {
      allowedHosts: ["terminal.local"],
      host: "0.0.0.0",
      port,
      strictPort: true,
      warmup: {
        clientFiles: [clientEntry],
      },
    },
  }));
}
