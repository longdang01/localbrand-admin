import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [
      { find: /^~/, replacement: "" },
      { find: "@", replacement: "/src" },
    ],
  },
  css: {
    modules: {
      localsConvention: "camelCase"
    }
  },
  server: {
    // port: 4200,
    // proxy: {
    //   '/api': {
    //     target: 'http://0.0.0.0:3102', /** APIs */
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   }, 
    // }
  }
})
