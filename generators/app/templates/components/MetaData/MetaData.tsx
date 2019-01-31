import NextSeo from 'next-seo'
const { metadataDefaults } = require('./../../constants')

type MetaDataProps = {
  seoData?: any
}
const MetaData = ({ seoData }: MetaDataProps) => {
  const seoConfig = {
    ...metadataDefaults,
    ...seoData
  }

  return <NextSeo config={seoConfig} />
}

export default MetaData
