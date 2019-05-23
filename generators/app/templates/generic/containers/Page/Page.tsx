import * as React from 'react'
import withRedux from 'next-redux-wrapper'
const { logoURL } = require('../../constants')

import { getPathAndLangForPage, isNextHR, ct, isNode } from '../../utils'

import { Layout, MetaData, ContentBlock<% if (baseComponents.includes('Demo')) { %>, Demo<% } %> } from '../../components'

import { getPage, getStaticContent } from '../../store/actions/content'
import { menuClose } from '../../store/actions/ui'
import initStore from '../../store/store'

import ErrorPage from '../ErrorPage/ErrorPage'

import './styles.scss'

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
  const page = content ? content[pathId] : null
  if (!content || !page || page.error) {
    if (pathId !== '404') {
      if (!isNode) {
        window.location.href = `/${lang}/404`
      }
      return;
    } else {
      return <ErrorPage {...page} lang={lang} />
    }
  }

  const {
    navbar,
    footer,
    body: heroBlocks = [],
    body1: contentBlocks = [],
    meta_title,
    meta_open_graph_image = {
      url: null,
      alt: null
    }
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
        })}
        
        <% } %>
        <% if (baseComponents.includes('Demo')) { %>{/* To be removed when starting project */}
        <Demo />
        {/* --- */}<% } %>
      </Layout>
    </section>
  )
}

Page.getInitialProps = async options => {
  const { store, req, asPath, query } = options

    // Static fetching next page's content
    if (!options.isServer && process.env.EXPORT) {
      if (asPath) {
        const { lang, pathId, type } = getPathAndLangForPage(req, asPath, query)
        await store.dispatch(getStaticContent(asPath, pathId, lang));
        return { pathId, lang }
      } else {
        console.log(`Error with fecthing new page from getInitialProps on static exported: ${asPath}: `)
        return
      }
    }

  // Avoid querying data with next.js-hot-reloading
  if (isNextHR(req ? req.url : asPath)) return

  // Fetching page's content
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
