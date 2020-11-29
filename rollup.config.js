import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

export default [
  {
    input: 'src/efmrl.js',
    output: {
      name: 'efmrl',
      file: pkg.browser,
      format: 'esm'
    },
    plugins: [
      commonjs(),
      nodeResolve({ preferBuiltins: false }),
      babel({ babelHelpers: 'runtime' })
    ],
    external: [
      "axios",
    ],
  },
  {
    input: 'src/efmrl.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      commonjs(),
      nodeResolve({ preferBuiltins: false }),
      babel({ babelHelpers: 'runtime' })
    ],
    external: [
      "axios",
    ],
  }
];
