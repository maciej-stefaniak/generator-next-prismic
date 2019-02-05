import * as React from 'react'
import withRedux from 'next-redux-wrapper'

const { logoURL } = require('../../constants')

import { getPathAndLangForPage, isNextHR } from '../../utils'

import { Layout, MetaData, ContentBlock } from '../../components'

import { getPage } from '../../store/actions/content'
import { menuClose } from '../../store/actions/ui'
import initStore from '../../store/store'

import { ct } from '../../utils'

import ErrorPage from '../ErrorPage/ErrorPage'

interface StatelessPage<P = {}> extends React.SFC<P> {
  getInitialProps?: (ctx: any) => any
}

interface IPageProps {
  content: any
  lang: string
  pathId: string
  dev: boolean
}

const Page: StatelessPage<IPageProps> = ({ content, lang, pathId, dev }) => {
  if (!content) return <ErrorPage lang={lang} />
  const page = content[pathId]
  if (!page) return <ErrorPage lang={lang} />
  if (page.error) {
    return <ErrorPage {...page} lang={lang} />
  }

  const {
    navbar,
    footer,
    body: heroBlocks = [],
    body1: contentBlocks = [],
    meta_title,
    meta_open_graph_image
  } = page
  <% if (baseComponents.includes('ContentBlocks')) { %>const blocks = heroBlocks.concat(contentBlocks)<% } %>

  <% if (baseComponents.includes('MetaData')) { %>const seoData = {
    title: ct(meta_title),
    openGraph: {
      images: [
        {
          url: meta_open_graph_image.url || logoURL,
          alt: meta_open_graph_image.alt
        }
      ]
    }
  }<% } %>
  return (
    <section>
      <% if (baseComponents.includes('MetaData')) { %><MetaData seoData={seoData} /><% } %>
      <Layout navbar={navbar} footer={footer} lang={lang}>
        <% if (baseComponents.includes('ContentBlocks')) { %>{blocks.map((item, index) => {
          const { slice_type } = item
          const componentName = slice_type
            ? slice_type.charAt(0).toUpperCase() + slice_type.slice(1)
            : null

          return (
            <ContentBlock key={slice_type + index} tag={componentName} lang={lang} {...item} />
          )
        })}<% } %>
      </Layout>
    </section>
  )
}

Page.getInitialProps = async options => {
  const { store, req, asPath, query } = options

  // Avoid querying data with next.js-hot-reloading
  if (isNextHR(req.url)) return;

  try {
    const { lang, pathId, type } = getPathAndLangForPage(req, asPath, query)

    await store.dispatch(getPage(req, pathId, type, lang))

    // Make sure the menu is closed
    await store.dispatch(menuClose())

    return { pathId, lang }
  } catch (e) {
    console.log('getInitialProps error', e)
  }
}

const mapStateToProps = state => ({
  content: state.content,
  dev: state.dev
})

export default withRedux(initStore, mapStateToProps)(Page)
