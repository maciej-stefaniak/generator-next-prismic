import * as React from 'react'
const { Link } = require('../../../../server/routes')
import * as R from 'ramda'

import './styles.scss'

type InternalLink = {
  url: string
  title: string
}

interface LinksGroupProps {
  links: InternalLink[]
  title: string
}

const LinksGroup: React.SFC<LinksGroupProps> = ({ links, title }) => (
  <React.Fragment>
    <p>{title}</p>
    {links &&
      links.map((menuLink, i) => {
        const { url, title } = menuLink

        return (
          <div key={i}>
            {R.startsWith('http', url) ? (
              <a href={url} target="_blank">
                {title}
              </a>
            ) : (
              <Link route={url}>
                <a>{title}</a>
              </Link>
            )}
          </div>
        )
      })}
  </React.Fragment>
)

export default LinksGroup
