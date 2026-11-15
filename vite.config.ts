import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import * as esbuild from 'esbuild';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function fastEsbuildProductionPlugin(): Plugin {
  const mainEntry = path.resolve(__dirname, 'src/main.tsx');
  return {
    name: 'fast-esbuild-production-bundle',
    apply: 'build',
    enforce: 'pre',
    load(id) {
      const cleanId = id.split('?')[0];
      if (cleanId === mainEntry || cleanId.endsWith('/src/main.tsx')) {
        return `import 'katex/dist/katex.min.css';\nimport './index.css';\n`;
      }
      return null;
    },
    async closeBundle() {
      if (process.env.VITE_SKIP_INLINE_ESBUILD === '1') {
        return;
      }
      await esbuild.build({
        entryPoints: [mainEntry],
        bundle: true,
        write: true,
        outfile: path.resolve(__dirname, 'dist/assets/app-main.js'),
        format: 'esm',
        target: 'es2020',
        jsx: 'automatic',
        minify: true,
        legalComments: 'none',
        define: {
          'process.env.NODE_ENV': '"production"',
        },
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        loader: {
          '.css': 'empty',
        },
      });
    },
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (!html.includes('/assets/app-main.js')) {
          return html.replace(
            '</body>',
            '  <script type="module" crossorigin src="/assets/app-main.js"></script>\n  </body>',
          );
        }
        return html;
      },
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [fastEsbuildProductionPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR and Vite WebSocket server are disabled in AI Studio preview iframe to prevent flickering and WebSocket connection errors.
      hmr: false as const,
      ws: false as const,
      watch: null,
    },
    build: {
      reportCompressedSize: false,
      chunkSizeWarningLimit: 5000,
      sourcemap: false,
    },
  };
});

