/// <reference types="vitest" />
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

export default defineConfig({
  cacheDir: "../../node_modules/.vite/bondage-academy-client",
  server: {
    port: 5173,
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
      },
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [nxViteTsPaths(), solidPlugin()],
  test: {
    globals: true,
    cache: {
      dir: "../../node_modules/.vitest",
    },
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
