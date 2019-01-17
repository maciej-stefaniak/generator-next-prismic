import * as React from 'react'

import { isIE } from '../../utils'

import { Navbar, Footer } from '..'

import './Layout.scss'

interface ILayoutProps {
  children: React.ReactNode | React.ReactNode[]

  navbar?: {
    body: any
  }

  footer?: {
    body: any
  }

  /*
   * To show or not the Navbar
  */
  showNavbar?: boolean

  /*
   * To show or not the Navbar
  */
  showFooter?: boolean

  lang: string
}

class Layout extends React.Component<ILayoutProps> {
  componentWillMount() {
    isIE()
  }

  componentDidCatch(error, errorInfo) {
    // TODO: handle javascript exceptions
    console.log(error)
    // TODO: add logs to backend server
  }

  render() {
    const {
      children,
      navbar,
      showNavbar = true,
      footer,
      showFooter = true,
      lang
    } = this.props
    return (
      <div>
        {showNavbar &&
          navbar && (
            <Navbar
              links={navbar.body}
              lang={lang}
              {...navbar}
            />
          )}
        <div>{children}</div>
        {showFooter && footer && <Footer lang={lang} {...footer} />}
      </div>
    )
  }
}

export default Layout
