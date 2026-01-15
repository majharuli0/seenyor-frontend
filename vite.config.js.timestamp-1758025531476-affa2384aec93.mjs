// vite.config.js
import { sentryVitePlugin } from 'file:///D:/seenyor-frontend/node_modules/@sentry/vite-plugin/dist/esm/index.mjs';
import {
  defineConfig,
  transformWithEsbuild,
} from 'file:///D:/seenyor-frontend/node_modules/vite/dist/node/index.js';
import react from 'file:///D:/seenyor-frontend/node_modules/@vitejs/plugin-react/dist/index.js';
var vite_config_default = defineConfig({
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
    sentryVitePlugin({
      org: 'seenyor-jp',
      project: 'seenyor-platform',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src/',
      //格式一定要写对喽不然没有代码提示或者报错
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
    sourcemap: true,
  },
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxzZWVueW9yLWZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxzZWVueW9yLWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9zZWVueW9yLWZyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZywgdHJhbnNmb3JtV2l0aEVzYnVpbGQgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0XCI7XHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAge1xyXG4gICAgICBuYW1lOiBcInRyZWF0LWpzLWZpbGVzLWFzLWpzeFwiLFxyXG4gICAgICBhc3luYyB0cmFuc2Zvcm0oY29kZSwgaWQpIHtcclxuICAgICAgICBpZiAoIWlkLm1hdGNoKC9zcmNcXC8uKlxcLmpzJC8pKSByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRyYW5zZm9ybVdpdGhFc2J1aWxkKGNvZGUsIGlkLCB7XHJcbiAgICAgICAgICBsb2FkZXI6IFwianN4XCIsXHJcbiAgICAgICAgICBqc3g6IFwiYXV0b21hdGljXCIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgcmVhY3QoKSxcclxuICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xyXG4gICAgICBvcmc6IFwic2Vlbnlvci1qcFwiLFxyXG4gICAgICBwcm9qZWN0OiBcInNlZW55b3ItcGxhdGZvcm1cIixcclxuICAgIH0pLFxyXG4gIF0sXHJcblxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBcIi9zcmMvXCIsIC8vXHU2ODNDXHU1RjBGXHU0RTAwXHU1QjlBXHU4OTgxXHU1MTk5XHU1QkY5XHU1NUJEXHU0RTBEXHU3MTM2XHU2Q0ExXHU2NzA5XHU0RUUzXHU3ODAxXHU2M0QwXHU3OTNBXHU2MjE2XHU4MDA1XHU2MkE1XHU5NTE5XHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIG9wdGltaXplRGVwczoge1xyXG4gICAgZm9yY2U6IHRydWUsXHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICBsb2FkZXI6IHtcclxuICAgICAgICBcIi5qc1wiOiBcImpzeFwiLFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBidWlsZDoge1xyXG4gICAgc291cmNlbWFwOiB0cnVlLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStPLFNBQVMsd0JBQXdCO0FBQ2hSLFNBQVMsY0FBYyw0QkFBNEI7QUFDbkQsT0FBTyxXQUFXO0FBQ2xCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQO0FBQUEsTUFDRSxNQUFNO0FBQUEsTUFDTixNQUFNLFVBQVUsTUFBTSxJQUFJO0FBQ3hCLFlBQUksQ0FBQyxHQUFHLE1BQU0sY0FBYyxFQUFHLFFBQU87QUFFdEMsZUFBTyxxQkFBcUIsTUFBTSxJQUFJO0FBQUEsVUFDcEMsUUFBUTtBQUFBLFVBQ1IsS0FBSztBQUFBLFFBQ1AsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixpQkFBaUI7QUFBQSxNQUNmLEtBQUs7QUFBQSxNQUNMLFNBQVM7QUFBQSxJQUNYLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLO0FBQUE7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUFBLEVBRUEsY0FBYztBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixPQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFFQSxPQUFPO0FBQUEsSUFDTCxXQUFXO0FBQUEsRUFDYjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
