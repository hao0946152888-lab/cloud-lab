import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {docker compose --env-file mern-demo/.env ps
curl -I http://localhost:8080
curl http://localhost:8080/api/students
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});