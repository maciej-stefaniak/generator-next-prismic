import * as React from 'react'
import { isNode } from '../../utils'

import { companyName } from '../../constants'

import './styles.scss'

type IFooterProps = {
  copyright?: string
  lang: string
  router: {
    asPath: string
  }
}

class Footer extends React.Component<IFooterProps> {
  render() {
    const {
      copyright = `&copy ${new Date().getFullYear()} ${companyName}`,
      lang
    } = this.props

    return (
      <footer>
        <div className="container">
          <p>{copyright}</p>
        </div>
      </footer>
    )
  }
}

export default Footer
