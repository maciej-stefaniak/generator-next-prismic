import * as React from 'react'

const { languages } = require('../../constants')
import { Layout<% if (baseComponents.includes('MetaData')) { %>, MetaData<% } %><% if (baseComponents.includes('Link')) { %>, Link<% } %> } from '../../components'

import { ct, cta } from '../../utils'

import './styles.scss'

interface IErrorPageProps {
  error?: string
  navbar?: any
  footer?: any
  page_404?: any
  lang?: string
}

const ErrorPage: React.SFC<IErrorPageProps> = ({
  navbar,
  footer,
  page_404,
  lang = languages[0]
}) => {
  
  <% if (baseComponents.includes('MetaData')) { %>const seoData = {
    title: ct(page_404 ? page_404.meta_title : 'Error'),
    openGraph: {
      images: [
        {
          url: page_404 ? page_404.meta_open_graph_image.url : '',
          alt: ct(page_404 ? page_404.meta_title : 'Error')
        }
      ]
    }
  }<% } %>

  return page_404 ? (
    <section>
      <% if (baseComponents.includes('MetaData')) { %><MetaData seoData={seoData} /><% } %>
      <Layout
        navbar={{
          ...navbar
        }}
        footer={footer}
        lang={lang}
      >
        <div>
          <div>
            <h1>404</h1>
            <h3>{ct(page_404.hero_title)}</h3>
            <p>{cta(page_404.hero_description)}</p>
            <% if (baseComponents.includes('Link')) { %><div>
              <Link
                type="internal"
                url={page_404.hero_link_url}
                title={page_404.hero_link_text}
              />
            </div><% } %>
          </div>
        </div>
      </Layout>
    </section>
  ) : null
}
export default ErrorPage
