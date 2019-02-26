import * as React from 'react'

import { companyName } from '../../constants'

import './styles.scss'

type IFooterProps = {
  copyright?: string
  lang: string
  router: {
    asPath: string
  }
}

function Footer(props: IFooterProps) {
  const {
    copyright = `&copy ${new Date().getFullYear()} ${companyName}`
  } = props

  return (
    <footer>
      <div className="container">
        <p>{copyright}</p>
      </div>
    </footer>
  )

}

export default Footer
