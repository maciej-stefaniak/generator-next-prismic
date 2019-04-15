const webpack = require('webpack')
const path = require('path')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const withTs = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')

const { ANALYZE } = process.env

module.exports = withSass(
  withTs({
    webpack(config, { dev }) {
      const conf = config
      /**
       * Install and Update our Service worker
       * on our main entry file :)
       * Reason: https://github.com/ooade/NextSimpleStarter/issues/32
       */
      const oldEntry = conf.entry

      conf.entry = () =>
        oldEntry().then(entry => {
          if (entry['main.js']) {
            entry['main.js'].push(path.resolve('./utils/offline'))
          }
          return entry
        })

      /* Enable only in Production */
      if (!dev) {
        // Service Worker
        conf.plugins.push(
          new SWPrecacheWebpackPlugin({
            cacheId: 'next-ss',
            filepath: './static/sw.js',
            minify: true,
            staticFileGlobsIgnorePatterns: [/\.next\//],
            staticFileGlobs: [
              'static/**/*' // Precache all static files by default
            ],
            runtimeCaching: [
              {
                handler: 'fastest',
                urlPattern: /[.](png|jpg|svg|css)/
              },
              {
                handler: 'networkFirst',
                // Cache all request and exclude analitics and such
                urlPattern: /^http.((?!(googletagmanager|doubleclick|googleapis|analytics|googleusercontent)).)*$/
              }
            ]
          })
        )
      }

      conf.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(
            process.env.NODE_ENV || 'development'
          )
        })
      )

      // Bundle Analyzer
      if (ANALYZE) {
        conf.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 3000,
            openAnalyzer: true
          })
        )
      }

      return config
    }
  })
)
