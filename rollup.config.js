import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

import babel from '@rollup/plugin-babel';

const config = {
  input: 'src/efmrl.js',
  output: {
    dir: 'output',
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
};

export default config;
