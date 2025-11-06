import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api":
        "https://mini-p-backend-jqdb-8f6tvt6ux-aditya-bajpayees-projects.vercel.app",
    },
  },
});
