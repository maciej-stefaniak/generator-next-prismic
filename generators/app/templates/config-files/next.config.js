const webpack = require('webpack')
const path = require('path')
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const withTs = require('@zeit/next-typescript')
const withSass = require('@zeit/next-sass')
const { languages } = require('./constants')
const exportMap = require('./next.config.export')
const fs = require('fs')
const { join } = require('path')
const mkdirp = require('mkdirp')
const { promisify } = require('util')
const copyFile = promisify(fs.copyFile)

const { ANALYZE, EXPORT } = process.env

module.exports = withSass(
  withTs({
    /**
     * Async function returning path mapping object for static export
     */
    exportPathMap: async function(
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
      if (!EXPORT) {
        return defaultPathMap;
      }
      const map = await exportMap.getMap(outDir)
      if (map) {
        await copyFile(join(dir, 'static/robots.txt'), join(outDir, 'robots.txt'))
        await copyFile(join(dir, 'static/favicon/favicon.ico'), join(outDir, 'favicon.ico'))
        await copyFile(join(dir, 'static/sw.js'), join(outDir, 'sw.js'))
        await copyFile(join(dir, 'static/sitemap.xml'), join(outDir, 'sitemap.xml'))
        languages.map(async (lang, index) => {
          mkdirp.sync(join(outDir, lang), (err) => {
            console.log(err)
          })
          await copyFile(join(dir, `export/redirects/${lang}/index.html`), join(outDir, lang, 'index.html'))
          if (index === 0) {
            await copyFile(join(dir, 'export/redirects/index.html'), join(outDir, 'index.html'))
          }
        })
        return map
      }
    },
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
          ),
          'process.env.EXPORT': process.env.EXPORT || false
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
