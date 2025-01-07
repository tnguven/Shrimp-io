const path = require('path');
const { DefinePlugin } = require('webpack');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production';
  const tsConfigFile = path.resolve(__dirname, `tsconfig${isProduction ? '.prod' : ''}.json`);

  return {
    mode: argv.mode,
    entry: './src/index.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules|__tests__|\.test\.ts$|\.spec\.ts$|\.d\.ts$/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.mjs'],
      plugins: [
        new TsConfigPathsPlugin({
          configFile: tsConfigFile,
        }),
      ],
    },
    plugins: [
      new DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
      argv.analyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    externals: [nodeExternals()],
    target: 'node',
    optimization: {
      usedExports: true,
    },
  };
};
