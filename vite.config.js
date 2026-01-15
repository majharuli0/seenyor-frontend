import { sentryVitePlugin } from '@sentry/vite-plugin';
import { defineConfig, transformWithEsbuild } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        });
      },
    },
    react(),
    // sentryVitePlugin({
    //   org: "seenyor-jp",
    //   project: "seenyor-platform",
    // }),
  ],

  resolve: {
    alias: {
      '@': '/src/', //格式一定要写对喽不然没有代码提示或者报错
    },
  },

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },

  build: {
    sourcemap: false,
  },
});
