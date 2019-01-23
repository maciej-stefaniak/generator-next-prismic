const fs = require('fs')
const builder = require('xmlbuilder')

const { languages: langs } = require('../constants')

const perPage = (
  SITE_ROOT: string,
  results: any[],
  sitemapXML: any,
  subRoute?: string
): string => {
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
module.exports = (app: any, prismicApi: any, path: any) => {
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
      'de',
      data => {
        sitemapXML = perPage(SITE_ROOT, data.results, sitemapXML)
      },
      (error, dataFallback) => {
        console.log('Error fetching data to update sitemap')
      }
    )
  } catch (e) {
    console.log('Error writing sitemap', e)
  }
}
