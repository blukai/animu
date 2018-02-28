const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')

const path = to => resolve(__dirname, to)

const { PORT } = process.env

const config = {
  mode: 'development',

  target: 'electron-renderer',

  entry: path('../main.js'),

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path('../'),
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: { node: 'current' },
                  modules: false
                }
              ]
            ],
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            plugins: ['react-hot-loader/babel']
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path('../app.html')
    }),

    new HotModuleReplacementPlugin()
  ],

  // don't attempt to continue if there are any errors.
  bail: true,

  devServer: {
    hot: true,
    inline: true,
    compress: true,
    clientLogLevel: 'warning',
    port: Number(PORT) || 8000,
    historyApiFallback: true
  }
}

module.exports = config
