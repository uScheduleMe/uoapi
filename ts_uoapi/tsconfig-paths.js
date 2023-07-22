/* eslint-disable @typescript-eslint/no-var-requires */
const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

// Enable path resolution of aliased imports for compiled files in dist
tsConfigPaths.register({
  baseUrl: './build',
  paths: tsConfig.compilerOptions.paths,
});
