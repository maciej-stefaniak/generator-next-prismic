import * as React from 'react'
import withRedux from 'next-redux-wrapper'

import { websiteURL, logoURL, languages } from '../../constants'

import { isNode } from '../../utils'

import { Layout, MetaData, ContentBlock } from '../../components'

import { getPage, getAllDocumentsOfType } from '../../store/actions/content'
import { menuClose } from '../../store/actions/ui'
import initStore from '../../store/store'

export const GlobalVarContext = React.createContext({})
export const GlobalVarProvider: React.SFC<{
  initialValue: any
  children: any
}> = ({ initialValue, children }) => (
  <GlobalVarContext.Provider value={initialValue}>
    {children}
  </GlobalVarContext.Provider>
)

import {
  c,
  ct,
  renderMeta,
  renderMetaOpenGraph,
  langFromPath,
  adjustPath,
  adjustPathReqWithLang
} from '../../utils'

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
            <GlobalVarProvider initialValue={{}} key={slice_type + index}>
              <ContentBlock tag={componentName} {...item} lang={lang} />
            </GlobalVarProvider>
          )
        })}<% } %>
      </Layout>
    </section>
  )
}

Page.getInitialProps = async options => {
  const { store, req, asPath, query } = options
  try {
    let path = adjustPath(asPath || (req ? req.url : '/'), req)
    // Get lang from request url
    const lang = req
      ? langFromPath(path, req)
      : query && query.lang
      ? query.lang
      : languages[0]
    path = adjustPathReqWithLang(path, req, lang)

    let pathId = path
    let type = 'page'
    const pathParts = path.split('/')
    if (pathParts.length > 1) {
      type = pathParts[0]
      pathId = pathParts[1]
    }

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
