import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@dreamdesk/core": resolve(__dirname, "../../core/src/shared.ts"),
      "@dreamdesk/os": resolve(__dirname, "../../os/src/index.ts"),
    },
  },
  server: { fs: { allow: ["../../.."] } },
});
