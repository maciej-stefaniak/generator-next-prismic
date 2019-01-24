import * as React from 'react'
import Parser from 'html-react-parser'
import PrismicDOM from 'prismic-dom'

export const c = (element: any, fallback?: any) =>
  element && element[0] ? element[0] : fallback || element

export const ct = (element: any, fallback?: any) => {
  try {
    const e = c(element)
    if (e && e.text) {
      return e.text
    }
    if (fallback) {
      return fallback
    }
    if (
      element != null &&
      (typeof element === 'object' || typeof element === 'function')
    ) {
      return null
    }
    return element
  } catch (e) {
    return element
  }
}

export const cta = (
  element: any[],
  unwrapParagraphs: boolean = true,
  addListDecorator: boolean = false
) => {
  if (!element || !element[0] || !element[0].type) {
    return null
  }
  try {
    let richText = PrismicDOM.RichText.asHtml(element)
    if (unwrapParagraphs) {
      richText = richText.replace(
        new RegExp('<p>', 'g'),
        '<span style="display: block;">'
      )
      richText = richText.replace(new RegExp('</p>', 'g'), '</span>')
    }

    richText = richText.replace(new RegExp('https:///', 'g'), '/')
    richText = richText.replace(new RegExp('http:///', 'g'), '/')

    // Add decorators to list items
    if (addListDecorator) {
      const listItemDecorator = '<span class="list-item-decorator" />'
      richText = richText.replace(
        new RegExp('<li>', 'g'),
        `<li>${listItemDecorator}`
      )
    }
    return <span className="richtext">{Parser(richText)}</span>
  } catch (e) {
    console.log(e)
    return null
  }
}
