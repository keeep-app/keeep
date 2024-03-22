import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { getCacheInvalidationKey, getPlugins } from './utils/vite';

const rootDir = resolve(__dirname);
const srcDir = resolve(rootDir, 'src');

const isDev = process.env.__DEV__ === 'true';
const isProduction = !isDev;

export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
    },
  },
  plugins: [...getPlugins(isDev), react()],
  publicDir: resolve(rootDir, 'public'),
  build: {
    outDir: resolve(rootDir, 'dist'),
    /** Can slow down build speed. */
    // sourcemap: isDev,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDev,
    rollupOptions: {
      input: {
        contentUI: resolve(srcDir, 'index.ts'),
      },
      output: {
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: isDev
          ? 'assets/js/[name].js'
          : 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const { name } = path.parse(assetInfo.name);
          const assetFileName =
            name === 'contentStyle'
              ? `${name}${getCacheInvalidationKey()}`
              : name;
          return `assets/[ext]/${assetFileName}.chunk.[ext]`;
        },
      },
    },
  },
});
