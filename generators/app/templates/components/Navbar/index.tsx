import * as React from 'react'
const { Link } = require('../../server/routes')
import { fromEvent, timer } from 'rxjs'
import * as R from 'ramda'
import { map, bufferCount } from 'rxjs/operators'

import classnames from 'classnames'

import { connect } from 'react-redux'
import { withRouter } from 'next/router'

import { menuOpen, menuClose } from '../../store/actions/ui'

import { isNode } from '../../utils'

import './styles.scss'

import buttonMenuAnimationData from './assets/buttonMenuAnimationData'
import Menu from './components/Menu'

interface INavbarProps {
  router: {
    asPath: string
  }
  links: Array<{
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

interface INavbarState {
  sticky: boolean
  backgroundVisible: boolean
}

class Navbar extends React.Component<INavbarProps, INavbarState> {
  scrollDirection: 'up' | 'down'
  scrollSubscription: any

  static defaultProps = {
    animationDelay: 0
  }

  constructor(props) {
    super(props)
    this.state = {
      sticky: false,
      backgroundVisible: false,
      initialAnimationIn: true,
      animationIn: false,
      animationOut: false
    }

    this.toggleMenu = this.toggleMenu.bind(this)
    this.openMenu = this.openMenu.bind(this)
    this.closeMenu = this.closeMenu.bind(this)
    this.handleScrollChange = this.handleScrollChange.bind(this)
    this.scrollDirection = 'down'
  }

  componentDidMount() {
    if (!isNode) {
      this.scrollSubscription = fromEvent(window, 'scroll')
        .pipe(
          map(() => window.pageYOffset),
          bufferCount(2)
        )
        .subscribe(this.handleScrollChange)
    }
  }

  componentWillUnmount() {
    if (this.scrollSubscription) this.scrollSubscription.unsubscribe()
  }

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

  // handleScrollChange([[_, prevMaxVal], [_, maxVal]]) {
  handleScrollChange([prevVal, val]) {
    const SCROLL_TOP_BARRIER = 150
    const { sticky } = this.state

    if (prevVal - val > 0) {
      this.scrollDirection = 'up'
    } else {
      this.scrollDirection = 'down'
    }

    // prevent any modifications if menu opened
    if (this.props.ui.menuOpened) {
      // handle state when user opens menu at top and scroll few times to bottom
      if (this.scrollDirection === 'down')
        this.setState({ sticky: true, backgroundVisible: true })
      return undefined
    }

    // prevent sticky state when scroll at top of the page
    if (val < 5) {
      return this.setState({ sticky: false, backgroundVisible: false })
    }

    // add background when scroll down a bit
    if (val > SCROLL_TOP_BARRIER && !this.state.backgroundVisible) {
      this.setState({ backgroundVisible: true })
    }

    // remove background when scroll closely to top of the page
    if (val < SCROLL_TOP_BARRIER && this.state.backgroundVisible) {
      this.setState({ backgroundVisible: false })
    }

    // prevent any further modifications when scroll closely to top of the page
    if (val < SCROLL_TOP_BARRIER) {
      return undefined
    }

    // handle scroll to bottom
    if (this.scrollDirection === 'down' && sticky) {
      this.setState({
        sticky: false
      })

      return undefined
    }

    // handle scroll to top
    if (this.scrollDirection === 'up' && !sticky) {
      this.setState({
        sticky: true
      })

      return undefined
    }

    return undefined
  }

  render() {
    const { ui, lang } = this.props
    const isMenuVisible = ui.menuOpened

    return (
      <div>
        <nav>
          <Link route={`/${lang}`}>
            <a>Home page</a>
          </Link>

          <Menu
            visible={isMenuVisible}
            onClose={this.closeMenu}
            linksList={this.props.links}
          />
        </nav>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  ui: state.ui
})

const mapDispatchToProps = dispatch => ({
  menuOpen: () => dispatch(menuOpen()),
  menuClose: () => dispatch(menuClose())
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Navbar)
)
