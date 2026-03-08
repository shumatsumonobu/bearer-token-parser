import {createRequire} from 'node:module';
import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import builtins from 'builtin-modules'

// Use createRequire to load JSON (Node 20+ requires import attributes for JSON).
const pkg = createRequire(import.meta.url)('./package.json');

export default {
  // Exclude Node.js built-in modules from the bundle.
  external: builtins,
  input: './src/index.ts',
  plugins: [
    // Compile TypeScript and emit .d.ts declaration files.
    typescript({
      tsconfigDefaults: {compilerOptions: {}},
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {compilerOptions: {}},
      useTsconfigDeclarationDir: true
    }),
    // Minify the output.
    terser(),
    // Allow importing JSON files.
    json(),
    // Convert CommonJS modules to ES modules.
    commonjs(),
    // Resolve third-party modules from node_modules.
    nodeResolve({
      mainFields: ['module', 'main'],
    })
  ],
  // Output both ESM and CJS formats (paths read from package.json).
  output: [
    {
      format: 'esm',
      file: pkg.module
    },
    {
      format: 'cjs',
      file: pkg.main
    }
  ],
  watch: {
    exclude: 'node_modules/**',
    include: 'src/**'
  }
}
