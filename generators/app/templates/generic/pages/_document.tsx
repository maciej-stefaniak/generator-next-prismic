import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import AcceptLanguageParser from 'accept-language-parser'
import { languages } from '../constants'
const { getLangFromPathHelper: langFromPath } = require('./../server/utils')

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

    return (
      <html lang={lang}>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1"
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
