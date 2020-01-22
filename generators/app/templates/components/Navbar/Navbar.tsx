import * as React from 'react'
import { Link } from '../'

import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { menuOpen, menuClose } from '../../store/actions/ui'

import './styles.scss'

type INavbarProps = {
  router: {
    asPath: string
  }
  links?: Array<{
    primary: {
      text: string
      url: string
    }
  }>
  lang: string
  ui: {
    menuOpened
  }

  menuOpen: () => void
  menuClose: () => void
}

class Navbar extends React.Component<INavbarProps> {
  toggleMenu() {
    if (this.props.ui.menuOpened) return this.closeMenu()
    return this.openMenu()
  }

  openMenu() {
    this.props.menuOpen()
  }

  closeMenu() {
    this.props.menuClose()
  }

  render() {
    const { ui, lang } = this.props
    const isMenuVisible = ui.menuOpened

    return (
      <div>
        <nav>
          {/*
            <Link url={`/${lang}`}>
              Link Text
            </Link>
          */}
        </nav>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

export default withRouter(
  connect(
    mapStateToProps,
    { menuOpen, menuClose }
  )(Navbar)
)
