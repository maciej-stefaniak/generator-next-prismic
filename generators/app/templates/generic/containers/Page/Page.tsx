import * as React from 'react'
import { useEffect, useState } from 'react'

import Router from 'next/router'
import { Helmet } from 'react-helmet'

const {   websiteURL, FACEBOOK_APP_ID, openGraphDefaultImage, languages } = require('../../constants')

import { getPathAndLangForPage, langFromPath, isNextHR, renderMeta, ct, isNode} from '../../utils'
import { getPage, getStaticContent } from '../../content'

import { Layout, MetaData, ContentBlock<% if (baseComponents.includes('Demo')) { %>, Demo<% } %> } from '../../components'

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
  req?: any
  isExport?: boolean
  linkedToError?: boolean
}

const Page: StatelessPage<IPageProps> = ({ 
  content: defaultContent,
  lang, 
  pathId, 
  asPath, 
  dev,
  isErrorFile = false,
  req, 
  isExport = false,
  linkedToError = false 
}) => {
  const [langFix, setLangFix] = useState(lang)
  const [content, setContent] = useState(defaultContent)
  useEffect(() => {
    if (isErrorFile && !isNode) {
      const langError = langFromPath(document.location.pathname)
      getPage(req, pathId, 'page', langError).then(response => {
        setContent(response)
        setLangFix(langError)
      })
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

  if (toReturnError) {
    return toReturnError
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

  let urlPart = asPath
  if (urlPart[urlPart.length - 1] === '/') {
    urlPart = urlPart.slice(0, -1)
  }
  <% if (baseComponents.includes('MetaData')) { %>const seoTitle = ct(meta_title)
    const seoCanonical = `${websiteURL}${urlPart}/`
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
  let urlWithoutLang = urlPart
  for (let langI = 0; langI < languages.length; langI++) {
    urlWithoutLang = urlWithoutLang.replace(`/${languages[langI]}/`, ``)
  }

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

  const pageNameParts = asPath.split('/')
  let pageName = pageNameParts[pageNameParts.length - 1]
  if (pageNameParts[pageNameParts.length - 1] === '') {
    pageName = pageNameParts[pageNameParts.length - 2]
  }

  return (
    <section className={`Page-${pageName}`}>
      <% if (baseComponents.includes('MetaData')) { %><MetaData seoData={seoData} /><% } %>
      <Helmet>
        {meta_tags && renderMeta(meta_tags)}

        {languages.map(langI =>
          langI === lang ? null : (
            <link
              rel="alternate"
              hrefLang={langI}
              href={`${websiteURL}/${langI}/${urlWithoutLang}/`}
              key={lang}
            />
          )
        )}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`${websiteURL}/${languages[0]}/${urlWithoutLang}/`}
        />
      </Helmet>
      
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
  const { req, asPath, query } = options

  const reqToReturn = req ? { headers: req.headers } : null

  // Static fetching next page's content
  if (!isNode && process.env.EXPORT) {
    if (asPath) {
      const { lang, pathId, type } = getPathAndLangForPage(req, asPath, query)
      const content = await getStaticContent(asPath, pathId, lang)
      const page = content ? content[pathId] : null

      return {
        content,
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
    const content = await getPage(req, pathId, type, lang)

    return {
      content,       
      req: reqToReturn,
      pathId, 
      lang, 
      asPath,
      isErrorFile,
      isExport: process.env.EXPORT
    }
  } catch (e) {
    console.log('getInitialProps error', e)
  }
}

export default Page