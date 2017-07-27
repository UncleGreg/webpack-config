const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProduction = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', 'css-loader', 'stylus-loader'];
const cssProduction = ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: ['css-loader', 'stylus-loader'],
        })
const cssConfig = isProduction ? cssProduction : cssDev;

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname + '/dist'),
    filename: 'index.bundle.js'
  },
  module: {
    rules: [
      {
        test:/\.styl$/, 
        use: cssConfig 
      },
      {
        test:/\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader' 
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=img/[hash:6].[ext]' 
        ]
        }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '/dist'),
    compress: true,
    port: 8080,
    stats: 'errors-only',
    open: true,
    openPage: '',
    hot:true
  },
  plugins:[
    new HtmlWebpackPlugin(
      {
        minify: {
          collapseWhitespace: true
        },
        hash:true,
        template: './src/index.html',
      }),
    new ExtractTextPlugin({
      filename: 'index.css',
      disable: !isProduction,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    })
  ]
}
