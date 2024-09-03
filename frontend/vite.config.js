import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',  // Ensures compatibility with older browsers
    rollupOptions: {
      input: {
        main: './src/main.jsx',          // Entry point for the dashboard
        widget: './src/widget.jsx'  // Entry point for the widget, adjust the path if needed
      },
      output: {
        entryFileNames: '[name].js',     // Generates `main.js` and `widget.js`
        dir: '../backend/public/js'      // Output directory for built JS files
      }
    },
    commonjsOptions: {
      include: [/node_modules/], // Ensure all modules are transpiled
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'] // Explicitly include dependencies to be optimized
  }
});
