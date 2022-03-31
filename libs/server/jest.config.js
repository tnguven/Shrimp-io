function makeModuleNameMapper(srcPath, tsconfigPath) {
  const { paths } = require(tsconfigPath).compilerOptions;
  return Object.keys(paths).reduce((moduleMapper, pathKey) => {
    const key = pathKey.replace('/*', '/(.*)');
    const path = paths[pathKey][0].replace('/*', '/$1');
    moduleMapper[key] = `${srcPath}/${path}`;
    return moduleMapper;
  }, {});
}

const TS_CONFIG_PATH = './tsconfig.json';
const SRC_PATH = '<rootDir>/src';

module.exports = {
  preset: '@shelf/jest-mongodb',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest.setup.js'],
  testMatch: ['**/?(*.)+(spec|test).+(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleNameMapper: makeModuleNameMapper(SRC_PATH, TS_CONFIG_PATH),
  verbose: true,
  restoreMocks: true,
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  watchPathIgnorePatterns: ['globalConfig'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest'],
  },
};
