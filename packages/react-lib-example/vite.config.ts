import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer';

import BOSConfig from './bos.json' assert { type: 'json' };

const { environments, filePathMatchers } = BOSConfig
const { deployerAccount, fileServerUrl } = environments.testnet;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),visualizer() as PluginOption, {
    name: 'inject-bundle-url',
    apply: 'build',
    transformIndexHtml(html ) {
      return html.replace(/(href|src)="\/assets\//g, `$1="${fileServerUrl}/${deployerAccount}/`);
    }
  }],
  build: {
    rollupOptions: {
      output: {
        manualChunks: function (id) {
          if (id.includes('ChainRoot')) {
            return 'preset';
          }

          if (filePathMatchers.some((m) => id.includes(m))) {
            return 'dev';
          }

          if (id.match(/\/node_modules\/[^/]+\/react/g)) {
            const depRootIndex = id.indexOf('/react');
            if (depRootIndex > -1) {
              return 'react';
            }
          }
        },
      },
    },
  },
})
