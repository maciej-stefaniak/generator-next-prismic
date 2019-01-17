import NextSeo from 'next-seo'
import { metadataDefaults } from './../../constants'

const PageMetaData = ({ seoData }) => {
  const seoConfig = {
    ...metadataDefaults,
    ...seoData
  }

  return <NextSeo config={seoConfig} />
}

export default PageMetaData
