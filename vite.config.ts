import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { buildContent } from './scripts/build-content';

/** In dev, rebuild src/content/generated.json whenever a file in /content changes. */
function contentWatcher(): Plugin {
  return {
    name: 'content-watcher',
    apply: 'serve',
    configureServer(server) {
      const dir = resolve('content');
      server.watcher.add(dir);
      server.watcher.on('all', (_event, file) => {
        if (!file.startsWith(dir) || !file.endsWith('.json')) return;
        try {
          buildContent(process.cwd());
          server.config.logger.info('content rebuilt', { timestamp: true });
        } catch (e) {
          server.config.logger.error((e as Error).message);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), contentWatcher()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/framer-motion')) return 'motion';
          if (id.includes('node_modules/react')) return 'react';
          return undefined;
        },
      },
    },
  },
  ssr: {
    noExternal: ['framer-motion', 'lucide-react'],
  },
});
