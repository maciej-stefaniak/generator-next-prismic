const POSSIBLE_LOCAL_SVGS = [
  /* 
    Add images names (with no extension) here from inline-svg-fallbacks files
    Has to be same as end of Prismic file url
  */
]

const hasSVGLocalFallback = url => {
  let newURL = url
  for (let index = 0; index < POSSIBLE_LOCAL_SVGS.length; index++) {
    const possibleHeroSvgLocal = POSSIBLE_LOCAL_SVGS[index]
    if (url && url.includes(`${possibleHeroSvgLocal}.svg`)) {
      newURL = `/static/images/inline-svg-fallbacks/${possibleHeroSvgLocal}.svg`
    }
  }

  return newURL
}

/*
 * Try to loads the svg as inline, to allow animations, style changes and such
 */
export default (
  src: string,
  { inlineSvgFallback = null, addAspectRatioFix = false },
  dispatch,
  mounted
) => {
  // If SVG is supported
  if (typeof SVGRect !== 'undefined') {
    const imageURL = hasSVGLocalFallback(src)
    let prefixURL = ''
    if (imageURL && imageURL.includes('http')) {
      prefixURL = 'https://cors-anywhere.herokuapp.com/'
    }

    // Request the SVG file to load it inline
    const ajax = new XMLHttpRequest()
    ajax.open('GET', `${prefixURL}${imageURL}`, true)
    ajax.timeout = 2500 // time in milliseconds
    // ajax.overrideMimeType('image/svg+xml')
    ajax.onreadystatechange = (e: any) => {
      if (!mounted) return
      if (ajax.readyState === 4) {
        if (ajax.status === 200) {
          dispatch({
            type: 'INLINE_SVG_LOADED',
            payload: {
              svgInlineCode: ajax.responseText.replace(
                '<svg ',
                `<svg role="img" ${
                  addAspectRatioFix
                    ? 'preserveAspectRatio="xMinYMin slice"'
                    : ''
                }`
              )
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
    if (!mounted) return
    dispatch({
      type: 'INLINE_SVG_FAILED',
      payload: {
        inlineSvgFallback
      }
    })
  }
}
