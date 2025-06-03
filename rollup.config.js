import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import css from 'rollup-plugin-css-only';
import copy from 'rollup-plugin-copy';

const name = 'NLWebJsClient';
const input = 'js/init/ChatInterfaceInit.js';

export default [
  // ESM build
  {
    input,
    output: {
      file: 'dist/nlweb-js-client.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      css({ output: false }) // Don't extract CSS for ESM build
    ]
  },
  
  // UMD build (unminified)
  {
    input,
    output: {
      file: 'dist/nlweb-js-client.js',
      format: 'umd',
      name,
      sourcemap: true,
      globals: {}
    },
    plugins: [
      nodeResolve(),
      css({ output: 'css/bundle.css' }),
      copy({
        targets: [
          { src: 'css/*.css', dest: 'dist/css' }
        ]
      })
    ]
  },
  
  // UMD build (minified)
  {
    input,
    output: {
      file: 'dist/nlweb-js-client.min.js',
      format: 'umd',
      name,
      sourcemap: true,
      globals: {}
    },
    plugins: [
      nodeResolve(),
      css({ output: 'css/bundle.min.css' }),
      terser({
        format: {
          comments: false
        }
      })
    ]
  }
];