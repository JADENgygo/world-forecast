import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    strictPort: true,
    port: 8000,
    host: true,
  },
  preview: {
    strictPort: true,
    port: 8000,
    host: true,
  },
});
