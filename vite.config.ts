import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/', 
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
        port: 4201,
        proxy: {
            '/api': {
                target: 'http://0.0.0.0:5100', 
                changeOrigin: true,
                secure: false,
            },  
        },
    },
});
