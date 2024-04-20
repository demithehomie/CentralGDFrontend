
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import proxy from 'vite-plugin-proxy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
   
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