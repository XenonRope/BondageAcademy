import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { nxViteTsPaths } from "@nx/vite/plugins/nx-tsconfig-paths.plugin";

export default defineConfig({
  root: __dirname,
  base: "./",
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
    outDir: "../../dist/apps/bondage-academy-client",
    reportCompressedSize: true,
    commonjsOptions: { transformMixedEsModules: true },
    target: "esnext",
  },
  plugins: [nxViteTsPaths(), solidPlugin()],
});
