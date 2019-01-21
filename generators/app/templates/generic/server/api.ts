const iFetch = require('isomorphic-unfetch')
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator/check')

let clearCacheTimeout = null

// Exports API
module.exports = (
  app: any,
  prismicApi: any,
  sitemap: any,
  path: any,
  dev: boolean
) => {
  // Query for page
  app.get('/api-page', (req, res) => {
    try {
      prismicApi.getDocumentsPage(
        req,
        req.query.id,
        req.query.type,
        req.query.lang,
        data => {
          res.status(200).send({ ...data, dev })
        },
        (error, dataFallback) => {
          if (dataFallback) {
            res.status(200).send({ ...dataFallback, dev })
          } else {
            res.status(404).send({ error, dev })
          }
        }
      )
    } catch (error) {
      res.status(404).send({ error, dev })
    }
  })

  // Query for document
  app.get('/api-document', (req, res) => {
    try {
      prismicApi.getDocument(
        req,
        req.query.id,
        req.query.type,
        req.query.lang,
        data => {
          res.status(200).send({ ...data, dev })
        },
        (error, dataFallback) => {
          if (dataFallback) {
            res.status(200).send({ ...dataFallback, dev })
          } else {
            res.status(404).send({ error, dev })
          }
        }
      )
    } catch (error) {
      res.status(404).send({ error, dev })
    }
  })

  // Query for document
  app.get('/api-all-documents', (req, res) => {
    try {
      prismicApi.getDocument(
        req,
        '*',
        req.query.type,
        req.query.lang,
        data => {
          res.status(200).send(data)
        },
        (error, dataFallback) => {
          if (dataFallback) {
            res.status(200).send(dataFallback)
          } else {
            res.status(404).send({ error })
          }
        }
      )
    } catch (error) {
      res.status(404).send({ error, dev })
    }
  })

  // Clear api content cache
  app.post('/api-clear-cache', (req, res) => {
    try {
      console.log('/clear-cache - webhook')
      if (clearCacheTimeout) {
        clearTimeout(clearCacheTimeout)
        console.log('/clear-cache - timeout cleared')
      }

      clearCacheTimeout = setTimeout(() => {
        // Clear Contentful cache
        prismicApi.clearCache()

        // Sitemap
        sitemap(app, prismicApi, path)
      }, 1000 * 60 * 2) // Delay of 2 minutes, to avoid consecutive clearing the cache when changing several things in prismic

      res.status(200).send('Alright, cache will clear.')
    } catch (error) {
      console.log('api-clear-cache: ', error)
    }
  })

  // create application/json parser
  app.use(bodyParser.json())
}
