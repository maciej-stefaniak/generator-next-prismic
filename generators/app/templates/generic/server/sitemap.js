const fs = require('fs')
const builder = require('xmlbuilder')
const path = require('path')

const { languages: langs } = require('../constants')

// @return string
const perPage = (
  SITE_ROOT, // @param: string
  results, // @param: any[]
  sitemapXML, // @param: any
  subRoute // @param: string - optional
) => {
  for (const page of results) {
    let pageName = page.uid
    const pageUid = page.uid
    langs.map(lang => {
      pageName = pageName.replace(`-${lang}`, '')
    })

    if (pageName && pageName.length > 0 && pageName !== '404') {
      const regex = new RegExp(`-(${langs.join('|')})$`)
      const pageLangMatch = pageUid.match(regex)
      const pageLang =
        pageLangMatch && pageLangMatch[1] ? `${pageLangMatch[1]}/` : ''

      const page = `${SITE_ROOT}/${pageLang}${subRoute}${pageName}`
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
module.exports = prismicApi => {
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
        sitemapXML = perPage(SITE_ROOT, data.results, sitemapXML, '')
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
