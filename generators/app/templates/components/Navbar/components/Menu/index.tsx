import * as React from 'react'
import * as R from 'ramda'
const { Link } = require('../../../../server/routes')
import './styles.scss'

interface IMenuProps {
  visible: boolean
  onClose: (event?) => void
  linksList: Array<{
    text: string
    url: string
  }>
}

interface IMenuState {
  mounted: boolean
  visible: boolean
}

// TODO: remove unnecessary delays at links lists here
class Menu extends React.Component<IMenuProps, IMenuState> {
  constructor(props) {
    super(props)

    this.state = {
      mounted: false,
      visible: false
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (R.equals(this.props, nextProps) && R.equals(this.state, nextState)) {
      return false
    }

    return true
  }

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.setState({ mounted: true })
        this.setState({ visible: true })
      } else {
        this.setState({ visible: false })
        this.setState({ mounted: false })
      }
    }
  }

  render() {
    const { linksList } = this.props
    const { mounted, visible } = this.state

    return (
      <div className={`${!mounted && 'wrapper__hidden'}`}>
        <ul>
          {linksList.map((link, i) => {
            if (!link || !link.url) return null
            return (
              <li key={i}>
                {({ hovered }) => (
                  <Link route={link.url}>
                    <a
                      className={`
                        ${i === linksList.length - 1 && 'topList__item__last'}
                        ${hovered && 'topList__item__hovered'}
                      `}
                    >
                      {link.text}
                    </a>
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Menu
