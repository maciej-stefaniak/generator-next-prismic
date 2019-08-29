import * as React from 'react'
import { useEffect, useState } from 'react'

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
  isErrorFile?: boolean
  dispatch?: (any) => {}
  req?: any
  isExport?: boolean
  linkedToError?: boolean
}

const Page: StatelessPage<IPageProps> = ({ 
  content, 
  lang, 
  pathId, 
  asPath, 
  dev,
  isErrorFile = false,
  dispatch,
  req, 
  isExport = false,
  linkedToError = false 
}) => {
  const [langFix, setLangFix] = useState(lang)
  useEffect(() => {
    if (isErrorFile && !isNode) {
      const langError = langFromPath(document.location.pathname)
      dispatch(getPage(req, pathId, 'page', langError))
      setLangFix(langError)
    }
  }, [])

  let toReturnError = null
  const page = content ? content[pathId] : null
  if (linkedToError && isExport) {
    window.location.reload()
    toReturnError = <div />
  } else if (!content || !page || page.error) {
    if (pathId !== '404') {
      if (!isNode) {
        let langFor404 = langFix
        if (asPath && asPath.split('/').length > 1) {
          langFor404 = asPath.split('/')[1]
        }
        if (!languages.includes(langFor404)) {
          langFor404 = langFix
        }
        Router.push(`/${langFor404}/404`, `/${langFor404}/404`, {
          shallow: true
        })
      }
      toReturnError = <div />
    } else {
      toReturnError = <ErrorPage {...page} lang={langFix} />
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
    }
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
      <Layout navbar={navbar} footer={footer} lang={langFix}>
        <% if (baseComponents.includes('ContentBlocks')) { %>{blocks.map((item, index) => {
          const { slice_type } = item
          const componentName = slice_type
            ? slice_type.charAt(0).toUpperCase() + slice_type.slice(1)
            : null

          return (
            <ContentBlock key={slice_type + index} tag={componentName} lang={langFix} {...item} {...genericItems} />
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

  const reqToReturn = req ? { headers: req.headers } : null

  // Static fetching next page's content
  if (!options.isServer && process.env.EXPORT) {
    if (asPath) {
      const { lang, pathId, type } = getPathAndLangForPage(req, asPath, query)
      await store.dispatch(getStaticContent(asPath, pathId, lang));
     
      const { content } = store.getState()
      const page = content ? content[pathId] : null

      return { 
        req: reqToReturn,
        pathId, 
        lang, 
        asPath,  
        isExport: process.env.EXPORT,
        linkedToError: !page}
    } else {
      console.log(`Error with fecthing new page from getInitialProps on static exported: ${asPath}: `)
      return
    }
  }

  // Avoid querying data with next.js-hot-reloading
  if (isNextHR(req ? req.url : asPath)) return

  // Fetching page's content
  try {
    let { lang, pathId, type } = getPathAndLangForPage(req, asPath, query)

    let isErrorFile = false
    if (
      (process.env.EXPORT && pathId === 'error.html') ||
      (req && req.statusCode === 404)
    ) {
      pathId = '404'
      isErrorFile = true
    }
    await store.dispatch(getPage(req, pathId, type, lang))

    // Make sure the menu is closed
    await store.dispatch(menuClose())

    return {       
      req: reqToReturn,
      pathId, 
      lang, 
      asPath,
      isErrorFile,
      isExport: process.env.EXPORT}
  } catch (e) {
    console.log('getInitialProps error', e)
  }
}

const mapStateToProps = state => ({
  content: state.content,
  dev: state.dev
})

export default withRedux(initStore, mapStateToProps)(Page)
