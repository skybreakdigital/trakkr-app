import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    "process.env.APP_VERSION": JSON.stringify(version) // Inject the version into an environment variable
  },
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "index.html"
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/styles/colors.scss";`
      }
    }
  }
});
