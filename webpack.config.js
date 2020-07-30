const path = require('path');

module.exports = {
  entry: './demo/index.tsx',
  output: {
    path: path.resolve(__dirname, 'demo'),
    filename: 'demo.bundle.js'
  },
  module: {
    rules: [{
      test: /\.ts(x?)$/,
      exclude: /node_modules/,
      use: [{
          loader: "ts-loader"
      }]
    }]
  }
};
