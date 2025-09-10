import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import os from 'os';

function getLocalIP(adapterName = "Wi-Fi") {
  const interfaces = os.networkInterfaces();
  const iface = interfaces[adapterName];
  if (!iface) {
    console.warn(`Adaptador "${adapterName}" não encontrado.`);
    return 'localhost';
  }
  const ipv4 = iface.find((i) => i.family === 'IPv4' && !i.internal);
  return ipv4 ? ipv4.address : 'localhost';
}

// config principal
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // ← carrega .env
  const localIP = getLocalIP("Wi-Fi");

  // usa variável do .env se existir, senão IP local
  const backendIP = `http://${env.VITE_PC_AUTH_IP || localIP}:3001`;

  console.log(`🔌 Backend IP: ${backendIP}`);

  return {
    base: "./",
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: {
        "/api": {
          target: backendIP,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: localIP,
        },
      },
    },

    plugins: [
      react(),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.js',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        manifest: {
          name: 'compresso',
          short_name: 'compresso',
          description: 'compresso',
          theme_color: '#ffffff',
        },
        injectManifest: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        },
        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        }
      }),
    ],
  };
});
