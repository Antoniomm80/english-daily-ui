import path from "path"
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/englishdaily-app',
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            '/english-daily': {
                target: 'http://controlplane.local',
                changeOrigin: true,
            },
            '/english-daily-ws': {
                target: 'http://controlplane.local',
                changeOrigin: true,
                ws: true,
            },
            '/ask-llama': {
                target: 'http://controlplane.local',
                changeOrigin: true,
                ws: true,
            },
            '/grammar': {
                target: 'http://controlplane.local',
                changeOrigin: true,
                ws: true,
            },
            '/ask-llama/socket': {
                target: 'http://controlplane.local',
                changeOrigin: true,
                ws: true,
            },
        },
    }
})
