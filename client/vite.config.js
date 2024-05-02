import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
 plugins: [react()],
 resolve: {
  alias: {
   "@": path.resolve(__dirname, "./src"),
  },
 },
//  server: {
//   proxy: {
//    "/api": {
//     target: "http://localhost:8000",
//     // target: "https://bytebard-hfri.onrender.com",
//     // changeOrigin: true, // Add this line if necessary
//     secure: true,
//    },
//   },
//  },
});
