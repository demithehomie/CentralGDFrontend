import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import proxy from 'vite-plugin-proxy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    sentryVitePlugin({
      org: "tripleavb",
      project: "gd-companion-web"
    }),
    // proxy({
    //   '/api': {
    //     target: 'https://frpbosstool-server.onrender.com',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, '/api'),
    //     secure: false
    //   }
    // })
  
  ],

  build: {
    sourcemap: true
  }
})