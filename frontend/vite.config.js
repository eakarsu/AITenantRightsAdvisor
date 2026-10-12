import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  // The ignored root .env owns the existing demo account. Expose it only to
  // the local development UI, where the fill-only login control needs it.
  const local = command === 'serve' ? loadEnv(mode, '..', '') : {};
  const demoAvailable = Boolean(local.DEMO_EMAIL && local.DEMO_PASSWORD);
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_ENABLE_DEMO_CREDENTIAL_AUTOFILL': JSON.stringify(demoAvailable ? 'true' : 'false'),
      'import.meta.env.VITE_DEMO_EMAIL': JSON.stringify(demoAvailable ? local.DEMO_EMAIL : ''),
      'import.meta.env.VITE_DEMO_PASSWORD': JSON.stringify(demoAvailable ? local.DEMO_PASSWORD : ''),
    },
    server: {
      port: Number(process.env.FRONTEND_PORT || 5210),
      proxy: {
        '/api': {
          target: process.env.VITE_API_URL || `http://127.0.0.1:${process.env.BACKEND_PORT || 3053}`,
          changeOrigin: true,
        },
      },
    },
  };
});
