// vite.config.js
export default {
  base: process.env.VITE_BASE_PATH || "/frontend_deployed",
  server: {
    proxy: {
      '/api': {
        target: 'https://tfhub.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
