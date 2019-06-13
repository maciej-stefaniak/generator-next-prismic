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

module.exports = {
  websiteURL,
  logoURL,
  companyName,
  languages: [<%- languages.map(lang => `'${lang}'`) %>],
  metadataDefaults,
  FORM_EMAIL_API_POINT
}