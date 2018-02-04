const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin, HotModuleReplacementPlugin } = require('webpack')

// ----

const { NODE_ENV, BUCKET_URL, PORT } = process.env

// ----

const config = {
  entry: [resolve(__dirname, '..//main.js')],

  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, 'dist'),
    publicPath: './'
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: resolve(__dirname, '../'),
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
            cacheDirectory: true
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../index.html')
    }),
    new DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
      BUCKET_URL: JSON.stringify(
        BUCKET_URL || 'https://s3.eu-central-1.amazonaws.com/animu-x'
      )
    })
  ],

  bail: true // don't attempt to continue if there are any errors.
}

// ----

if (NODE_ENV !== 'production') {
  devtool: 'cheap-module-source-map'

  config.output = '/'

  config.plugins.push(new HotModuleReplacementPlugin())

  config.devServer = {
    hot: true,
    inline: true,
    compress: true,
    clientLogLevel: 'warning',
    port: Number(PORT) || 8000,
    historyApiFallback: true
  }
}

module.exports = config
