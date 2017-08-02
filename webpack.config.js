const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const rupture = require('rupture');

const isProduction = process.env.NODE_ENV === 'production';
const cssDev = ['style-loader', 'css-loader', 'autoprefixer-loader', 'stylus-loader'];
const cssProduction = ExtractTextPlugin.extract({
          fallback: 'style-loader', 
          use: ['css-loader', 'autoprefixer-loader', 'stylus-loader'],
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
        use:{
          loader: 'babel-loader',
          options: {
            "presets": ["env"],
            "plugins": ["syntax-dynamic-import"]
          }
          }
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
    port: 25555,
    stats: 'errors-only',
    open: true,
    openPage: '',
    disableHostCheck: true,
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
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, 'src/*.html'))
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        context:path.resolve(__dirname, 'src'),
        stylus:{
          use:[
            require('rupture')()
          ],
          import: [
            path.resolve(__dirname, 'src/index.styl')
          ]
        }
      }
    }),
    new BrowserSyncPlugin({
      open: 'external',
      host: '0.0.0.0',
      port: 25550,
      proxy: '0.0.0.0:25555',
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
