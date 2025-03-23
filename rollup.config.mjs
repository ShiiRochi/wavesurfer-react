import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import swc from '@rollup/plugin-swc';
import dts from 'rollup-plugin-dts';
import path from 'node:path';

const srcDir = 'src';
const distDir = 'dist';
const extensions = ['.ts', '.tsx', '.js'];

const mainInput = `${srcDir}/index.ts`;

const external = (id) =>
  /^react($|\/)/.test(id) ||
  /^react-dom($|\/)/.test(id) ||
  /^wavesurfer($|\/)/.test(id) ||
  (id !== `${srcDir}/index.ts` && !id.startsWith(".") && !path.isAbsolute(id));

// full list of configuration to build
const configurations = [];

const plugins = [
  resolve({ extensions }),
  json(),
  swc({
    tsconfig: 'tsconfig.json',
    minify: true,
  }),
];

// esm
configurations.push({
  input: mainInput,
  output: {
    dir: `${distDir}`,
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: srcDir,
    entryFileNames: '[name].js'
  },
  plugins,
  external
});

// ts types
configurations.push({
  input: mainInput,
  output: {
    dir: `${distDir}`,
    format: 'es',
    preserveModules: true,
    preserveModulesRoot: srcDir,
  },
  plugins: [dts()],
});

export default configurations;