/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies } from '../package.json';

var fs = require('fs');

let pythonPath = path.join(__dirname, '..', 'app/constants') + '/pythonPath.json';

let pythonFile = fs.readFileSync(pythonPath);
pythonFile = JSON.parse(pythonFile);

if(pythonFile.PYTHON_SERVER_PATH === ''){

  pythonFile.PYTHON_SERVER_PATH = path.join(__dirname, '..', 'python')

  fs.writeFile(pythonPath, JSON.stringify(pythonFile), (error) => {
    if(error) throw error;
  });
}

export default {
  externals: [...Object.keys(dependencies || {})],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },

  output: {
    path: path.join(__dirname, '..', 'app'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production'
    }),

    new webpack.NamedModulesPlugin()
  ]
};
