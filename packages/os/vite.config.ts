import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
  },
  plugins: [
    react(),
    dts({ include: ["src"] }),
  ],
  resolve: {
    alias: {
      "@dreamdesk/core": resolve(__dirname, "../core/src/shared.ts"),
      "@dreamdesk/react": resolve(__dirname, "../react/src/index.ts"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@dreamdesk/core", "@dreamdesk/react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
