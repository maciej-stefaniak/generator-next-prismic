import Parser from 'html-react-parser'
import { isNode } from '.'

export const renderMeta = (meta_tags: any[]) => {
  if (!meta_tags) return null
  try {
    let tags = ''
    meta_tags.map(tag => {
      tags += tag.text
    })
    return tags ? Parser(tags) : null
  } catch (e) {
    console.log(e)
    return null
  }
}

export const renderMetaOpenGraph = (
  title: string,
  pageId: string,
  meta_open_graph_image: { url: string }
) =>
  Parser(`
      <meta property="og:title" content="${title}" />
      <meta property="og:url" content="${
        !isNode ? window.location.href : `/${pageId}`
      }" />
      <meta property="og:type" content="website" />
      ${meta_open_graph_image &&
        meta_open_graph_image.url &&
        meta_open_graph_image.url.length > 0 &&
        `<meta property="og:image" content="${meta_open_graph_image.url}" />`}
    `)
