import * as React from 'react'
import withRedux from 'next-redux-wrapper'
import Router from 'next/router'
import { Helmet } from 'react-helmet'

const {   websiteURL, FACEBOOK_APP_ID, openGraphDefaultImage, languages } = require('../../constants')

import { getPathAndLangForPage, isNextHR, renderMeta, ct, isNode } from '../../utils'

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
  asPath: string
}

const Page: StatelessPage<IPageProps> = ({ content, lang, pathId, asPath, dev }) => {
  let toReturnError = null
  const page = content ? content[pathId] : null
  if (!content || !page || page.error) {
    if (pathId !== '404') {
      if (!isNode) {
        let langFor404 = lang
        if (asPath && asPath.split('/').length > 1) {
          langFor404 = asPath.split('/')[1]
        }
        if (!languages.includes(langFor404)) {
          langFor404 = lang
        }
        Router.push(`/${langFor404}/404`, `/${langFor404}/404`, {
          shallow: true
        })
      }
      toReturnError = <div />
    } else {
      toReturnError = <ErrorPage {...page} lang={lang} />
    }
  }

  const {
    navbar,
    footer,
    body: heroBlocks = [],
    body1: contentBlocks = [],
    meta_title,
    meta_description,
    meta_tags,
    meta_open_graph_image = {
      url: null,
      alt: null
    },
    asPath
  } = page
  <% if (baseComponents.includes('ContentBlocks')) { %>const blocks = heroBlocks.concat(contentBlocks)<% } %>

  <% if (baseComponents.includes('MetaData')) { %>const seoTitle = ct(meta_title)
    const seoCanonical = `${websiteURL}${asPath}`
    const seoData = {
    title: seoTitle,
    description: meta_description,
    canonical: seoCanonical,
    facebook: {
      appId: FACEBOOK_APP_ID
    },
    openGraph: {
      title: seoTitle,
      description: meta_description,
      url: seoCanonical,
      type: 'website',
      images: [
        {
          url: meta_open_graph_image.url || openGraphDefaultImage,
          alt: meta_open_graph_image.alt
        }
      ]
    }
  }<% } %>

  // Some generic data for some pages (server filters them)
  const genericItems = {
    /*
      blog_items: blog_detail
        ? !!blog_detail.length
          ? blog_detail
          : [blog_detail]
        : [],
    */
  }

  if (toReturnError) {
    return toReturnError
  }
  
  const pageNameParts = asPath.split('/')
  let pageName = pageNameParts[pageNameParts.length - 1]
  if (pageNameParts[pageNameParts.length - 1] === '') {
    pageName = pageNameParts[pageNameParts.length - 2]
  }

  return (
    <section className={`Page-${pageName}`}>
      <% if (baseComponents.includes('MetaData')) { %><MetaData seoData={seoData} /><% } %>
      {meta_tags && (
        <Helmet>
          {renderMeta(meta_tags)}
        </Helmet>
      )}
      <Layout navbar={navbar} footer={footer} lang={lang}>
        <% if (baseComponents.includes('ContentBlocks')) { %>{blocks.map((item, index) => {
          const { slice_type } = item
          const componentName = slice_type
            ? slice_type.charAt(0).toUpperCase() + slice_type.slice(1)
            : null

          return (
            <ContentBlock key={slice_type + index} tag={componentName} lang={lang} {...item} {...genericItems} />
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
        return { pathId, lang, asPath }
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

    return { pathId, lang, asPath }
  } catch (e) {
    console.log('getInitialProps error', e)
  }
}

const mapStateToProps = state => ({
  content: state.content,
  dev: state.dev
})

export default withRedux(initStore, mapStateToProps)(Page)
