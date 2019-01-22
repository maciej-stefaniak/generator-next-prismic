const websiteURL = '<%= websiteURL %>'
const logoURL = ''
const companyName = '<%= websiteFullName %>'
const languages = [<%- languages.map(lang => `'${lang}'`) %>]
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

module.exports = {
  websiteURL,
  logoURL,
  companyName,
  languages,
  metadataDefaults
}