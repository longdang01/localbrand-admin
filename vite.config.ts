import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), svgr(), pluginRewriteAll()],
    resolve: {
        alias: [
            { find: /^~/, replacement: '' },
            { find: '@', replacement: '/src' },
        ],
    },
    css: {
        modules: {
            localsConvention: 'camelCase',
        },
    },
    server: {
        // port: 4200,
        // proxy: {
        //     //   '/api': {
        //     //     target: 'https://sca.vn/api', 
        //     //     changeOrigin: true,
        //     //     secure: false,
        //     //     rewrite: (path) => path.replace(/^\/api/, ''),
        //     //   },  

        //     '/api': {
        //         target: 'http://0.0.0.0:6102', 
        //         changeOrigin: true,
        //         secure: false,
        //         rewrite: (path) => path.replace(/^\/api/, ''),
        //     },  
        // },
    },
});
