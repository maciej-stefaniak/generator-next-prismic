import * as React from 'react'

import { isIE } from '../../utils'

import { Navbar, Footer } from '..'

import './Layout.scss'

interface ILayoutProps {
  children: React.ReactNode | React.ReactNode[]

  navbar?: {}

  footer?: {}

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
      <div className="Layout">
        {showNavbar && navbar && <Navbar lang={lang} {...navbar} />}
        <div className="Layout-content">{children}</div>
        {showFooter && footer && <Footer lang={lang} {...footer} />}
      </div>
    )
  }
}

export default Layout
