import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split vendor code into stable-hashed chunks — client builds only.
        // (In the SSR prerender build these deps are external, so chunking
        // them is both unnecessary and an error.)
        // Content deploys then leave vendor filenames untouched, so a cached
        // HTML shell from a previous deploy still boots, and each file is
        // smaller (less exposure to flaky long HTTP/2 transfers).
        ...(!isSsrBuild
          ? {
              manualChunks: {
                "vendor-react": ["react", "react-dom", "react-router-dom"],
                "vendor-motion": ["framer-motion"],
                "vendor-ui": ["react-helmet-async", "lucide-react"],
              },
            }
          : {}),
      },
    },
  },
}));
