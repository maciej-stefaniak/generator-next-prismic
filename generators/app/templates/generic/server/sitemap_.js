const fs = require('fs')
const builder = require('xmlbuilder')
const path = require('path')

const { languages: langs } = require('../constants/index_')

const perPage = (
  SITE_ROOT,
  results,
  sitemapXML,
  subRoute
) => {
  for (const page of results) {
    let pageName = page.uid
    langs.map(lang => {
      pageName = pageName.replace(`-${lang}`, '')
    })

    if (pageName && pageName.length > 0) {
      const page = `${SITE_ROOT}/${subRoute || ''}${pageName}`
      const modDate = new Date()
      const url = sitemapXML.ele('url')
      url.ele('loc', page)
      url.ele(
        'lastmod',
        `${modDate.getFullYear()}-${`0${modDate.getMonth() + 1}`.slice(
          -2
        )}-${`0${modDate.getDate()}`.slice(-2)}`
      )
      url.ele('changefreq', 'monthly')
      url.ele('priority', '0.5')
    }
  }

  return sitemapXML
}

// Exports API
module.exports = (prismicApi) => {
  try {
    const SITE_ROOT = process.env.SITE_ROOT
    const DESTINATION = path.join(__dirname, '..', 'static', 'sitemap.xml')

    let sitemapXML = builder
      .create('urlset', { encoding: 'utf-8' })
      .att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9')

    prismicApi.getDocument(
      null,
      '*',
      'page',
      langs[0],
      data => {
        sitemapXML = perPage(process.env.SITE_ROOT, data.results, sitemapXML)
        const sitemapString = sitemapXML.end({ pretty: true })
        fs.writeFile(DESTINATION, sitemapString, (err, data) => {
          if (err) {
            console.log('Error updating sitemap', err)
          }
          console.log(`Sitemap updated`)
        })
      },
      (error, dataFallback) => {
        console.log('Error fetching data to update sitemap')
      }
    )
  } catch (e) {
    console.log('Error writing sitemap', e)
  }
}
