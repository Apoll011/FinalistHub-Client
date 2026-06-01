import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  define: {
    'import.meta.env.MODE': JSON.stringify(process.env.VITE_MODE || 'production'),
  },
});

