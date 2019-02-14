/*
 * Try to loads the svg as inline, to allow animations, style changes and such
 */
export default (src: string, { inlineSvgFallback = null }, dispatch) => {
  // If SVG is supported
  if (typeof SVGRect !== 'undefined') {
    // Request the SVG file to load it inline
    const ajax = new XMLHttpRequest()
    ajax.open('GET', src, true)
    ajax.onreadystatechange = (e: any) => {
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          dispatch({
            type: 'INLINE_SVG_LOADED',
            payload: {
              svgInlineCode: ajax.responseText
            }
          })
        } else {
          dispatch({
            type: 'INLINE_SVG_FAILED',
            payload: {
              inlineSvgFallback
            }
          })
          console.log(`Error fetching svg for inline: ${ajax.statusText}`)
        }
      }
    }
    ajax.send()
  } else {
    dispatch({
      type: 'INLINE_SVG_FAILED',
      payload: {
        inlineSvgFallback
      }
    })
  }
}
