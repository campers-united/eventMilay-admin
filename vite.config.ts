import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@mui/material",
      "@mui/material/styles",
      "@mui/icons-material",
      "react-admin",
    ],
  },
  resolve: {
    alias: {
      // Resolve subpath imports like '@mui/icons-material/Add' to the esm folder
      '@mui/icons-material': path.resolve(__dirname, 'node_modules/@mui/icons-material/esm'),
    },
  },
});
