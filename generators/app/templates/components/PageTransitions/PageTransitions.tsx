import React from 'react'
import App, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'

import './styles.scss'

class PageTransitions extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <div className="PageTransitions">
          <PageTransition skipInitialTransition={true} timeout={500} classNames="page-transition">
            <Component {...pageProps} />
          </PageTransition>
        </div>
      </Container>
    )
  }
}

export default PageTransitions