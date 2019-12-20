const websiteURL = '<%= websiteURL %>'
const logoURL = ''
const companyName = '<%= websiteFullName %>'
const metadataDefaults = {
  title: companyName,
  description: '',
  openGraph: {
    type: 'website',
    locale: ' ',
    url: websiteURL,
    title: companyName,
    description: '<%= websiteDescription %>',
    images: [
      {
        url: logoURL,
        alt: companyName
      }
    ],
    site_name: companyName
  },
  twitter: {
    handle: '',
    site: '',
    cardType: 'summary_large_image'
  }
}

const FORM_EMAIL_API_POINT = `${process.env.API_ENDPOINT}/contact`

<% if (baseComponents.includes('GoogleMap')) { %>const GOOGLE_MAPS_KEY = ''
const GOOGLE_MAPS_STYLES = `[]`<% } %>

<% if (baseComponents.includes('Form') && languages.includes('de')) { %>const CALENDAR_LOCALE = {
  'de': {
    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    weekdaysLong: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    weekdaysShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    firstDay: 6
  }
}<% } %>

module.exports = {
  websiteURL,
  logoURL,
  companyName,
  languages: [<%- languages.map(lang => `'${lang}'`) %>],
  metadataDefaults,
  FORM_EMAIL_API_POINT,
  <% if (baseComponents.includes('Form') && languages.includes('de')) { %>CALENDAR_LOCALE,<% } %>
  <% if (baseComponents.includes('GoogleMap')) { %>GOOGLE_MAPS_KEY,
GOOGLE_MAPS_STYLES,<% } %>
}