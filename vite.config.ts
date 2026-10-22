import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Preserve existing local/Pages configuration during the env-name migration.
  // Only these two public client settings may fall back to their CRA names.
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_']);
  return {
    base: '/creatl-s-blog/',
    plugins: [react()],
    define: {
      'import.meta.env.VITE_UI_THEME': JSON.stringify(env.VITE_UI_THEME ?? env.REACT_APP_UI_THEME ?? 'creatl-brand'),
      'import.meta.env.VITE_GA_TRACK_ID': JSON.stringify(env.VITE_GA_TRACK_ID ?? env.REACT_APP_GA_TRACK_ID ?? ''),
    },
    server: { port: 5173, strictPort: true },
    preview: { port: 4173, strictPort: true },
    test: {
      environment: 'jsdom',
      globals: true,
      maxWorkers: 2,
      setupFiles: ['./src/setupTests.js'],
      restoreMocks: true,
    },
  };
});
