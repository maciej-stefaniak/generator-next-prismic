import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
const { getLangFromPathHelper: langFromPath } = require('./../server/utils')

import { languages, websiteURL } from '../constants'

export default class MyDocument extends Document<any, any> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    const acceptLanguage =
      ctx && ctx.req && ctx.req.headers && ctx.req.headers['accept-language']
        ? ctx.req.headers['accept-language']
        : null
    return {
      ...initialProps,
      pathname: ctx.req.url,
      acceptLanguage
    }
  }

  render() {
    const { pathname, acceptLanguage } = this.props
    const lang = langFromPath(pathname, null, acceptLanguage)

    const urlWithoutLangParts = pathname.split('/')
    const urlWithoutLang = urlWithoutLangParts[urlWithoutLangParts.length - 1]

    return (
      <html lang={lang}>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1"
          />

          {languages.map(langI =>
            langI === lang ? null : (
              <link
                rel="alternate"
                hrefLang={langI}
                href={`${websiteURL}/${langI}/${urlWithoutLang}`}
                key={lang}
              />
            )
          )}
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`${websiteURL}/${languages[0]}/${urlWithoutLang}`}
          />

          <meta name="theme-color" content="<%= primaryColor %>" />
          <link rel="manifest" href="/static/manifest.webmanifest" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
