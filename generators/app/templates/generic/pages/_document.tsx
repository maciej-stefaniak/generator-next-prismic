import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import AcceptLanguageParser from 'accept-language-parser'
import { languages } from '../constants'

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
    // Get lang from path
    let lang = languages[0] // Default lang
    try {
      const { pathname } = this.props
      lang = pathname.split('/')[1]
      if (!languages.includes(lang)) {
        let preferedLang
        if (this.props.acceptLanguage) {
          const preferedLangList = AcceptLanguageParser.parse(
            this.props.acceptLanguage
          )
          preferedLang =
            preferedLangList &&
            preferedLangList.length &&
            preferedLangList[0].quality >= 1
              ? preferedLangList[0].code
              : null
        }
        lang = languages.includes(preferedLang) ? preferedLang : languages[0]
      }
    } catch (e) {
      console.log(`Document: error find language :${e}`, this.props.pathname)
    }

    return (
      <html lang={lang}>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
          />
          <meta name="theme-color" content="#1A1A1A" />
          <link rel="manifest" href="/static/manifest.json" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/favicon/favicon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="/static/favicon/safari-pinned-tab.svg"
            color="#1A1A1A"
          />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* Required to work in Internet Explorer */}
          {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.6.15/browser-polyfill.min.js" /> */}
        </body>
      </html>
    )
  }
}
