import * as React from 'react'
import { withRouter } from 'next/router'

import { isNode } from '../../utils'

import { companyName } from '../../constants'

import './styles.scss'

import LinksGroup from './components/LinksGroup'

interface IFooterProps {
  menu_links_title: string
  menu_links_list: Array<{
    title: string
    url: string
  }>
  copyright: string
  lang: string
  router: {
    asPath: string
  }
}

class Footer extends React.Component<IFooterProps> {
  getPathForLang = (lang: 'en' | 'de') => {
    const opositeLangMap = {
      de: 'en',
      en: 'de'
    }

    const path = !isNode ? window.location.pathname : ''
    const pathFirstPart = path.substring(0, 3)

    if (!isNode && (pathFirstPart === '/de' || pathFirstPart === '/en')) {
      return path.replace(`/${opositeLangMap[lang]}`, `/${lang}`)
    } else if (!isNode) {
      return `/${lang}${path}`
    }

    return `/${lang}`
  }

  render() {
    const {
      body,
      copyright = `&copy ${new Date().getFullYear()} ${companyName}`,
      lang
    } = this.props

    const langOptions = [
      {
        id: 'de',
        title: lang === 'de' ? 'Deutsche' : 'German'
      },
      {
        id: 'en',
        title: lang === 'de' ? 'Englisch' : 'English'
      }
    ]

    return (
      <footer>
        <div>
          {body.map((item, index) => {
            const { links_group_title } = item.primary
            const { items } = item
            return (
              <LinksGroup key={index} title={links_group_title} links={items} />
            )
          })}
          <p>{copyright}</p>
        </div>
      </footer>
    )
  }
}

export default withRouter(Footer)
