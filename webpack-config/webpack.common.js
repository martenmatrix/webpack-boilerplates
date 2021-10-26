const path = require('path');

module.exports = {
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },

  module: {
      rules: [
        {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf|webm)$/i,
        type: 'asset', // determines on the size (max size is 8kb) of the file, whether it should be inlined(js in assets directory) or in the assets directory
        },
        {
         test: /\.html$/i,
         loader: 'html-loader',
        },
      ],
  },
};