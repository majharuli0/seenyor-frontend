// vite.config.js
import {
  defineConfig,
  transformWithEsbuild,
} from 'file:///D:/chj/chjclcz/Seenyor/vite/Seenyor/node_modules/vite/dist/node/index.js';
import react from 'file:///D:/chj/chjclcz/Seenyor/vite/Seenyor/node_modules/@vitejs/plugin-react/dist/index.mjs';
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
  ],
  resolve: {
    alias: {
      '@': '/src/',
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
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxjaGpcXFxcY2hqY2xjelxcXFxTZWVueW9yXFxcXHZpdGVcXFxcU2VlbnlvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcY2hqXFxcXGNoamNsY3pcXFxcU2VlbnlvclxcXFx2aXRlXFxcXFNlZW55b3JcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2Noai9jaGpjbGN6L1NlZW55b3Ivdml0ZS9TZWVueW9yL3ZpdGUuY29uZmlnLmpzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIHRyYW5zZm9ybVdpdGhFc2J1aWxkIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHtcbiAgICAgIG5hbWU6ICd0cmVhdC1qcy1maWxlcy1hcy1qc3gnLFxuICAgICAgYXN5bmMgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XG4gICAgICAgIGlmICghaWQubWF0Y2goL3NyY1xcLy4qXFwuanMkLykpICByZXR1cm4gbnVsbFxuXG4gXG4gICAgICAgIHJldHVybiB0cmFuc2Zvcm1XaXRoRXNidWlsZChjb2RlLCBpZCwge1xuICAgICAgICAgIGxvYWRlcjogJ2pzeCcsXG4gICAgICAgICAganN4OiAnYXV0b21hdGljJyxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZWFjdCgpLFxuICBdLFxuICByZXNvbHZlOntcbiAgICBhbGlhczp7XG4gICAgICAnQCc6Jy9zcmMvJywgICAgICAvL1x1NjgzQ1x1NUYwRlx1NEUwMFx1NUI5QVx1ODk4MVx1NTE5OVx1NUJGOVx1NTVCRFx1NEUwRFx1NzEzNlx1NkNBMVx1NjcwOVx1NEVFM1x1NzgwMVx1NjNEMFx1NzkzQVx1NjIxNlx1ODAwNVx1NjJBNVx1OTUxOVxuICAgIH1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZm9yY2U6IHRydWUsXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIGxvYWRlcjoge1xuICAgICAgICAnLmpzJzogJ2pzeCcsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLGNBQWMsNEJBQTRCO0FBQ25ELE9BQU8sV0FBVztBQUVsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUDtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sTUFBTSxVQUFVLE1BQU0sSUFBSTtBQUN4QixZQUFJLENBQUMsR0FBRyxNQUFNLGNBQWM7QUFBSSxpQkFBTztBQUd2QyxlQUFPLHFCQUFxQixNQUFNLElBQUk7QUFBQSxVQUNwQyxRQUFRO0FBQUEsVUFDUixLQUFLO0FBQUEsUUFDUCxDQUFDO0FBQUEsTUFDSDtBQUFBLElBQ0Y7QUFBQSxJQUNBLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFRO0FBQUEsSUFDTixPQUFNO0FBQUEsTUFDSixLQUFJO0FBQUE7QUFBQSxJQUNOO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osT0FBTztBQUFBLElBQ1AsZ0JBQWdCO0FBQUEsTUFDZCxRQUFRO0FBQUEsUUFDTixPQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
