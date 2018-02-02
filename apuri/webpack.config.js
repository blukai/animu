const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')

const resolve = dir => path.resolve(__dirname, dir)

const { NODE_ENV } = process.env

const config = {
  bail: true, // don't attempt to continue if there are any errors.
  devtool: 'cheap-module-source-map',

  entry: [resolve('renderer/main.js')],
  output: {
    filename: 'bundle.js',
    path: resolve('dist'),
    publicPath: './'
  },

  resolve: {
    extensions: ['.js', '.css']
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: resolve('renderer'),
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    node: 'current'
                  },
                  modules: false
                }
              ],
              '@babel/preset-react'
            ],
            plugins: [
              '@babel/plugin-proposal-decorators',
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-proposal-object-rest-spread'
            ]
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve('renderer/index.html')
    }),
    new DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      BUCKET_URL: JSON.stringify(
        process.env.BUCKET_URL ||
          'https://s3.eu-central-1.amazonaws.com/animu-x'
      )
    })
  ]
}

if (NODE_ENV !== 'production') {
  config.entry.unshift(
    require.resolve('webpack-dev-server/client') + '?/',
    require.resolve('webpack/hot/dev-server')
  )

  config.output = '/'

  config.plugins.push(new HotModuleReplacementPlugin())

  config.devServer = {
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    port: 8000,
    historyApiFallback: true
  }
}

module.exports = config
