import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint2";
import react from "@vitejs/plugin-react";

const host: string | undefined = process.env.TAURI_DEV_HOST;
const config = defineConfig(() => ({
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent vite from obscuring rust errors
    clearScreen: false,
    plugins: [react(), eslint()],
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        hmr: getHmr(host),
        host: host || false,
        port: 1420,
        strictPort: true,
        watch: {
            // 3. tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
}));
// https://vitejs.dev/config/
export default config;

function getHmr(host: string | undefined) {
    if (!host) {
        return;
    }
    return {
        host,
        port: 1421,
        protocol: "ws",
    };
}