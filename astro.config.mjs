// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true,  // Necesario para WSL
        interval: 1000,    // Intervalo de polling
      },
      hmr: {
        overlay: true,     // Mostrar errores en overlay
        port: 24678,       // Puerto específico para HMR
      }
    }
  },
  output: "server",
  adapter: cloudflare(),
  integrations: [react({
    include: ['**/components/**/*.tsx', '**/components/**/*.ts'] // Asegurar que React reconozca tus componentes
  })],
  devToolbar: {
    enabled: false // Opcional: deshabilitar si causa problemas
  }
});
