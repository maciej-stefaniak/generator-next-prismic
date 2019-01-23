/**
 * Registers our Service Worker on the site
 * Need more? check out:
 * https://github.com/GoogleChrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
 */

if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(reg => {
          console.log('Service worker registered')
        })
        .catch(e => {
          console.error('Error during service worker registration:', e)
        })
    })
  } else {
    // service workers not supported
  }
}
