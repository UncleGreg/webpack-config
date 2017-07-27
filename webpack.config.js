const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

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
    }),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      proxy: 'http://localhost:8080/',
      files: [
        {
          match: [
            '**/*.html'
          ],
          fn: function(event, file){
            if (event === "change") {
              const bs = require('browser-sync').get('bs-webpack-plugin');
              bs.reload();
            }
          }
        }
      ]
    }, { reload: false })
  ]
}
