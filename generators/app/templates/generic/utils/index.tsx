export * from './content'
export * from './meta'
export * from './paths'

export const isNode: boolean = !(
  typeof window !== 'undefined' && window !== null
)

export const w = !isNode ? (window as any) : {}

export const isIE = (): boolean => {
  if (!isNode) {
    if (!w.isIE && !w.IEChecked) {
      const ua = w.navigator.userAgent
      const msie = ua ? ua.indexOf('MSIE ') : null
      if (
        (msie && msie > 0) ||
        !!navigator.userAgent.match(/Trident.*rv:11\./)
      ) {
        w.isIE = true
        document.documentElement.classList.add('is-ie')
      }
      // Treat Mircrosoft Edge like IE so no animations and so on
      if (!w.isIE) {
        w.isIE = !!w.StyleMedia
      }

      w.IEChecked = true
    }
    return w.isIE
  }

  return false
}

export const isRetina = (): boolean => {
  let retina: boolean = false
  if (!isNode) {
    if (w.isRetina) {
      retina = true
    } else {
      const mediaQuery =
        '(-webkit-min-device-pixel-ratio: 1.25), (min--moz-device-pixel-ratio: 1.25), (-o-min-device-pixel-ratio: 5/4), (min-resolution: 1.25dppx)'
      if (
        w.devicePixelRatio > 1.25 ||
        (w.matchMedia && w.matchMedia(mediaQuery).matches)
      ) {
        retina = true
        w.isRetina = true
      }
    }
  }
  return retina
}

export const replaceLast = (
  text: string,
  what: string,
  replacement: string
): string => {
  var pcs = text.split(what)
  var lastPc = pcs.pop()
  return pcs.join(what) + replacement + lastPc
}

export const countMtextChar = (element: any[], fallback?: any): number => {
  let charNumber = 0
  if (element && element.length > 0) {
    element.map(item => {
      charNumber += item.text.length
      return item
    })
  }
  return charNumber
}

export const scrollToSection = (url: string) => () => {
  if (!isNode) {
    const target = document.querySelector(url)
    if (target) {
      if (w && w.requestIdleCallback) {
        w.requestIdleCallback(() => {
          target.scrollIntoView({
            block: 'start',
            behavior: 'smooth'
          })
        })
      } else {
        target.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      }
    }
  }
}

export const jsonToQueryString = (json): string =>
  `?${Object.keys(json)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
    .join('&')}`

export const shadeBlendConvert = (p: number, from: string, to?: string) => {
  let sbcRip
  if (
    typeof p !== 'number' ||
    p < -1 ||
    p > 1 ||
    typeof from !== 'string' ||
    (from[0] != 'r' && from[0] != '#') ||
    (to && typeof to !== 'string')
  )
    return null // ErrorCheck
  if (!sbcRip)
    sbcRip = d => {
      let l = d.length,
        RGB = {}
      if (l > 9) {
        d = d.split(',')
        if (d.length < 3 || d.length > 4)
          return null // ErrorCheck
        ;(RGB[0] = i(d[0].split('(')[1])),
          (RGB[1] = i(d[1])),
          (RGB[2] = i(d[2])),
          (RGB[3] = d[3] ? parseFloat(d[3]) : -1)
      } else {
        if (l == 8 || l == 6 || l < 4) return null // ErrorCheck
        if (l < 6)
          d = `#${d[1]}${d[1]}${d[2]}${d[2]}${d[3]}${d[3]}${
            l > 4 ? `${d[4]}${d[4]}` : ''
          }` // 3 or 4 digit
        ;(d = i(d.slice(1), 16)),
          (RGB[0] = (d >> 16) & 255),
          (RGB[1] = (d >> 8) & 255),
          (RGB[2] = d & 255),
          (RGB[3] = -1)
        if (l == 9 || l == 5)
          (RGB[3] = r((RGB[2] / 255) * 10000) / 10000),
            (RGB[2] = RGB[1]),
            (RGB[1] = RGB[0]),
            (RGB[0] = (d >> 24) & 255)
      }
      return RGB
    }
  var i = parseInt,
    r = Math.round,
    h = from.length > 9,
    h =
      typeof to === 'string'
        ? to.length > 9
          ? true
          : to == 'c'
          ? !h
          : false
        : h,
    b = p < 0,
    p = b ? p * -1 : p,
    to = to && to != 'c' ? to : b ? '#000000' : '#FFFFFF',
    f = sbcRip(from),
    t = sbcRip(to)
  if (!f || !t) return null // ErrorCheck
  if (h)
    return `rgb${f[3] > -1 || t[3] > -1 ? 'a(' : '('}${r(
      (t[0] - f[0]) * p + f[0]
    )},${r((t[1] - f[1]) * p + f[1])},${r((t[2] - f[2]) * p + f[2])}${
      f[3] < 0 && t[3] < 0
        ? ')'
        : `,${
            f[3] > -1 && t[3] > -1
              ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000
              : t[3] < 0
              ? f[3]
              : t[3]
          })`
    }`
  return `#${(
    0x100000000 +
    r((t[0] - f[0]) * p + f[0]) * 0x1000000 +
    r((t[1] - f[1]) * p + f[1]) * 0x10000 +
    r((t[2] - f[2]) * p + f[2]) * 0x100 +
    (f[3] > -1 && t[3] > -1
      ? r(((t[3] - f[3]) * p + f[3]) * 255)
      : t[3] > -1
      ? r(t[3] * 255)
      : f[3] > -1
      ? r(f[3] * 255)
      : 255)
  )
    .toString(16)
    .slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2)}`
}
